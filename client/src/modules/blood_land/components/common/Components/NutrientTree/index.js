import React, {Fragment, PureComponent} from 'react'
import {Modal} from 'reactstrap';
import * as m from '../../../../../../helpers/importModule';
import TreeList from "./component/TreeList";
import cloneDeep from 'lodash.clonedeep'
import {connect} from 'react-redux'
import isEqual from "lodash.isequal"
import differenceBy from 'lodash.differenceby'
import intersectionby from 'lodash.intersectionby'
import {screenActions} from "../../../../../../helpers/importModule";
import NoSelectedAlert from "../../Popups/commomPopups/NoSelectedAlert"
import DeadByWaterAlert from "../../Popups/commomPopups/DeadByWaterAlert"
import NotEnoughMoneyAlert from "../../Popups/commomPopups/NotEnoughMoneyAlert"
import UsingBloodToUseNutrientAlert from "../../Popups/NutritionPopups/UsingBloodToUseNutrientAlert"
import UsingNutrientConfirmAlert from "../../Popups/NutritionPopups/UsingNutrientConfirmAlert"
import UsingNutrientSuccessAlert from "../../Popups/NutritionPopups/usingNutrientSuccessAlert"
import UsingNutrientFailureAlert from "../../Popups/NutritionPopups/usingNutrientfailureAlert"
import LoadingPopup from "../../Popups/commomPopups/LoadingPopup";

class Nutrient extends PureComponent {
    state = {};

    componentDidMount() {
        const {user: {_id, wToken}} = this.props
        const {selectedLands, shopsReducer: {shops}} = this.props;
        this.props.getItemInventoryByUserId({userId: _id});
        this.props.getWalletInfo({wToken});
        if (selectedLands) {
            const selectedLandsUpdate = cloneDeep(selectedLands);
            selectedLandsUpdate.map(l => {
                l.checked = false;
                shops.map(s => {
                    if (s.itemId === l.tree.itemId) {
                        l.treeInfo = {...s}
                    }
                    return s
                });
                return l
            });
            this.setState({
                selectedLands: selectedLandsUpdate
            })
        }

    }

    componentDidUpdate(prevProps, prevState) {
        const {inventoryReducer: {usingResult}, objectList, addPopup, selectedLands , removePopup} = this.props;
        if(usingResult){
            setTimeout(() => {
                addPopup({
                    name:  usingResult.status ? 'UsingNutrientSuccessAlert' : 'UsingNutrientFailureAlert',
                    close: 'LoadingPopup',
                    data: {selectedLands}
                });
                this.props.clearSuccessError()

            }, 500)
        }


        //reload list selected in plant tree tab
        if (!isEqual(objectList, prevProps.objectList)) {

            const objectListFilter = objectList.filter(o => o.tree && o.tree.limitUseNutritional === 0);
            const landsSelectedFilter = differenceBy(this.state.selectedLands, objectListFilter, "quadKey");

            const objectFilterSelected = intersectionby(objectList, landsSelectedFilter, "quadKey");

            landsSelectedFilter.map(l => {
                const findObjectFilterSelected = objectFilterSelected.find(o => o.quadKey === l.quadKey);
                l.tree = findObjectFilterSelected.tree;
                return l
            });
            if (landsSelectedFilter.length === 0) {
                removePopup({name: 'nutrition'})
            }
            this.setState({
                selectedLands: landsSelectedFilter
            });
        }


    }


    clickCheckbox = (e) => {
        const {selectedLands} = this.state;

        let selectedLandsUpdate = cloneDeep(selectedLands);
        let landSelected = {
            ...selectedLandsUpdate.find(l => l._id === e.value._id),
            checked: !e.value.checked
        };

        selectedLandsUpdate.splice(selectedLandsUpdate.findIndex(l => l._id === e.value._id), 1, landSelected);
        const checkAllLength = selectedLandsUpdate.filter(l => l.checked).length === selectedLands.length;
        this.setState({
            checkStatus: true,
            checkAll: checkAllLength,
            selectedLands: selectedLandsUpdate
        });
    };

    onHandleCheckAll = (e) => {
        const {selectedLands} = this.state;
        const selectedLandsUpdate = cloneDeep(selectedLands);
        selectedLandsUpdate.map(l => {
            l.checked = e.checked;
            return l
        })
        this.setState({
            checkStatus: true,
            checkAll: e.checked,
            selectedLands: selectedLandsUpdate
        });
    };


    hasWaterLeftDeadTrees() {
        const {selectedLands} = this.state;
        for (let i = 0; i < selectedLands.length; i++) {
            const {tree} = selectedLands[i];
            if (selectedLands[i].checked) if (m.common.waterLeftSecond(tree.waterEndTime) <= 0) return true
        }
        return false;
    };

    useItem = () => {
        const {addPopup} = this.props;
        if (this.hasWaterLeftDeadTrees()) return addPopup({name: 'DeadByWaterAlert'});
        addPopup({name: 'LoadingPopup'})

        // create param for api

        const {selectedLands} = this.state;
        const itemId = "I01";
        const {user: {_id}} = this.props
        let trees = [];
        for (let i = 0; i < selectedLands.length; i++) {
            if (selectedLands[i].checked) {
                const currentTree = selectedLands[i].tree._id;
                trees.push(currentTree);
            }
        }

        const param = {itemId, trees, userId: _id};
        this.props.useItem(param);
    };
    onHandleUsingItem = () => {
        const {selectedLands} = this.state;
        this.setState({confirmAction: true});
        const {inventoryReducer: {itemInventory}, addPopup} = this.props;
        const nutrient = itemInventory && itemInventory.find(i => i.itemId === "I01");
        const landUsingNutrient = selectedLands && selectedLands.filter(l => l.checked);

        if (landUsingNutrient.length === 0) {
            addPopup({name: 'NoSelectedAlert'})
        } else if (this.hasWaterLeftDeadTrees()) {
            addPopup({name: 'DeadByWaterAlert'})
        } else if (landUsingNutrient.length > nutrient.quantity) {
            const needGoldBlood = nutrient.price * (landUsingNutrient.length - nutrient.quantity)
            addPopup({name: 'UsingBloodToUseNutrientAlert', data: {needGoldBlood, useItem: this.useItem}})
        } else {
            addPopup({name: 'UsingNutrientConfirmAlert', data: {useItem: this.useItem}})
        }

    };

    getLandList = () => {
        const {selectedLands, checkAll} = this.state;
        const {removePopup} = this.props;

        return (
            <Modal isOpen={true} backdrop="static" className={`custom-modal modal--tree-nutrients`}>
                <div className='custom-modal-header'>
                    <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.detail'}/>
                    <span className="lnr lnr-cross lnr-custom-close"
                          onClick={() => removePopup({name: 'nutrition'})}/>
                </div>
                <div className='custom-modal-body'>
                    <TreeList
                        checkAll={checkAll}
                        onHandleCheckAll={this.onHandleCheckAll}
                        lands={selectedLands} clickCheckbox={this.clickCheckbox}/>
                </div>
                <div className='custom-modal-footer-action-group'>
                    <button onClick={() => this.onHandleUsingItem()}>
                        <img src={m.loadingImage(`/images/game-ui/sm-ok.svg`)} alt=''/>
                        <div>
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.use'}/>
                        </div>
                    </button>
                    <button onClick={() => removePopup({name: 'nutrition'})}>
                        <img src={m.loadingImage(`/images/game-ui/sm-close.svg`)} alt=''/>
                        <div>
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.cancel'}/>
                        </div>
                    </button>
                </div>
            </Modal>
        )
    };


    render() {
        const {screens} = this.props;
        return (
            <Fragment>
                {this.getLandList()}
                {screens['NoSelectedAlert'] && <NoSelectedAlert/>}
                {screens['DeadByWaterAlert'] && <DeadByWaterAlert/>}
                {screens['NotEnoughMoneyAlert'] && <NotEnoughMoneyAlert/>}
                {screens['UsingBloodToUseNutrientAlert'] && <UsingBloodToUseNutrientAlert/>}
                {screens['UsingNutrientConfirmAlert'] && <UsingNutrientConfirmAlert/>}
                {screens['UsingNutrientSuccessAlert'] && <UsingNutrientSuccessAlert/>}
                {screens['UsingNutrientFailureAlert'] && <UsingNutrientFailureAlert/>}
                {screens['LoadingPopup'] && <LoadingPopup/>}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const {shopsReducer, authentication: {user}, inventoryReducer, objectsReducer: {objectList}, screens} = state;
    return {
        shopsReducer, user, inventoryReducer, objectList, screens
    }
};

const mapDispatchToProps = (dispatch) => ({
    getItemInventoryByUserId: (param) => dispatch(m.inventoryActions.getItemInventoryByUserId(param)),
    getWalletInfo: (param) => dispatch(m.userActions.getWalletInfo(param)),
    useItem: (param) => dispatch(m.inventoryActions.onHandleUsingItemForTree(param)),
    clearSuccessError: () => dispatch(m.inventoryActions.clearSuccessError()),
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen))
});

export default connect(mapStateToProps, mapDispatchToProps)(Nutrient)