import React, {Fragment, PureComponent} from 'react'
import {Modal} from 'reactstrap';
import * as m from '../../../../../../helpers/importModule';
import TreeList from "./component/TreeList";
import cloneDeep from 'lodash.clonedeep'
import {connect} from 'react-redux'
import isEqual from "lodash.isequal"
import intersectionby from 'lodash.intersectionby'
import {screenActions} from "../../../../../../helpers/importModule";
import NoSelectedAlert from "../../Popups/commomPopups/NoSelectedAlert";
import DeadByWaterAlert from "../../Popups/commomPopups/DeadByWaterAlert";
import LoadingPopup from "../../Popups/commomPopups/LoadingPopup";
import UsingDropletConfirmAlert from "../../Popups/DropletPopups/usingDropletConfirmAlert";
import UsingDropletSuccessAlert from "../../Popups/DropletPopups/usingDropletSuccessAlert";
import UsingDropletFailureAlert from "../../Popups/DropletPopups/usingDropletFailureAlert";

class Droplet extends PureComponent {
    state = {};

    componentDidMount() {
        const {user: {_id, wToken}} = this.props;
        const {selectedLands, shopsReducer: {shops}} = this.props;
        this.props.getItemInventoryByUserId({userId: _id});
        this.props.getWalletInfo({wToken});
        if (selectedLands) {
            const selectedLandsUpdate = cloneDeep(selectedLands);
            selectedLandsUpdate.map(l => {
                l.checked = false;
                shops.map(s => {
                    if(s.itemId === l.tree.itemId){
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
        const {inventoryReducer: {usingResult} , objectList , selectedLands, addPopup} = this.props;
        if (usingResult) {
            setTimeout(() => {
                addPopup({
                    name: usingResult.status ? 'UsingDropletSuccessAlert' : 'UsingDropletFailureAlert',
                    close: 'LoadingPopup',
                    data: {selectedLands}
                })
                this.props.clearSuccessError()
            }, 500)
        }

        //reload list selected in plant tree tab
        if(!isEqual(objectList , prevProps.objectList)){
            let landsSelectedFilter = cloneDeep(this.state.selectedLands);
            const objectFilterSelected = intersectionby(objectList,this.state.selectedLands , "quadKey" );
            landsSelectedFilter.map(l => {
                objectFilterSelected.map(o => {
                    if(o.quadKey === l.quadKey){
                        l.tree.waterEndTime = o.tree.waterEndTime
                    }
                    return o
                });
                return l
            });
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
        const itemId = "I03";
        const {user: {_id}} = this.props;
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
        const {addPopup} = this.props;
        const landUsingShovel = selectedLands && selectedLands.filter(l => l.checked);

        if (landUsingShovel.length === 0 ){
            addPopup({name: 'NoSelectedAlert'})
        } else if (this.hasWaterLeftDeadTrees()){
            addPopup({name: 'DeadByWaterAlert'})
        } else {
            addPopup({name: 'UsingDropletConfirmAlert', data: {useItem: this.useItem}})
        }

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

    getLandList = () => {
        const {selectedLands, checkAll} = this.state;
        const {removePopup} = this.props;

        return (
            <Modal isOpen={true} backdrop="static" className={`custom-modal modal--tree-nutrients`}>
                <div className='custom-modal-header'>
                    <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.detail'}/>
                    <span className="lnr lnr-cross lnr-custom-close"
                          onClick={() => removePopup({name: 'smallWater'})}/>
                </div>
                <div className='custom-modal-body'>
                    <TreeList lands={selectedLands}
                              checkAll={checkAll}
                              clickCheckbox={this.clickCheckbox} onHandleCheckAll={this.onHandleCheckAll} />
                </div>
                <div className='custom-modal-footer-action-group'>
                    <button onClick={() => this.onHandleUsingItem()}>
                        <img src={m.loadingImage(`/images/game-ui/sm-ok.svg`)} alt=''/>
                        <div>
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.use'}/>
                        </div>
                    </button>
                    <button onClick={() => removePopup({name: 'smallWater'})}>
                        <img src={m.loadingImage(`/images/game-ui/sm-close.svg`)} alt=''/>
                        <div>
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.cancel'}/>
                        </div>
                    </button>
                </div>
            </Modal>
        )
    };


    alertPopupRender = () => {
        const {screens} = this.props;
        return(
            <Fragment>
                {screens['NoSelectedAlert'] && <NoSelectedAlert/>}
                {screens['DeadByWaterAlert'] && <DeadByWaterAlert/>}
                {screens['UsingDropletConfirmAlert'] && <UsingDropletConfirmAlert/>}
                {screens['UsingDropletSuccessAlert'] && <UsingDropletSuccessAlert/>}
                {screens['UsingDropletFailureAlert'] && <UsingDropletFailureAlert/>}
                {screens['LoadingPopup'] && <LoadingPopup/>}
            </Fragment>
        )
    };
    render() {
        return (
            <Fragment>
                {this.getLandList()}
                {this.alertPopupRender()}
            </Fragment>
        );
    }
}
const mapStateToProps = ( state ) => {
    const {shopsReducer , authentication: {user} , inventoryReducer , objectsReducer: {objectList} , wallet , screens} = state;
    return {
        shopsReducer , user , inventoryReducer , objectList , wallet , screens
    }
};

const mapDispatchToProps = (dispatch) => ({
    getItemInventoryByUserId: (param) => dispatch(m.inventoryActions.getItemInventoryByUserId(param)),
    getWalletInfo: (param) => dispatch(m.userActions.getWalletInfo(param)),
    useItem: (param) => dispatch(m.inventoryActions.onHandleUsingItemForTree(param)),
    clearSuccessError: () => dispatch(m.inventoryActions.clearSuccessError()),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    addPopup: (screen) => dispatch(screenActions.addPopup(screen))
});

export default connect(mapStateToProps , mapDispatchToProps)(Droplet)