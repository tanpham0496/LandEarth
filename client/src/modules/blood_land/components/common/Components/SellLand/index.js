import React, {Fragment, PureComponent} from 'react'
import {Modal} from 'reactstrap';
import {loadingImage, screenActions, TranslateLanguage, landActions, socketActions, mapActions} from '../../../../../../helpers/importModule';
import LandList from "./component/landList";
import _ from 'lodash';
import {connect} from 'react-redux'
// popup component
import SellLandPriceAlert from "../../Popups/SellLandPopups/SellLandPriceAlert"
import SellLandConfirmAlert from "../../Popups/SellLandPopups/SellLandConfirmAlert"
import LoadingPopup from "../../Popups/commomPopups/LoadingPopup"
import SellLandSuccessAlert from "../../Popups/SellLandPopups/SellLandSuccessAlert"
import SellLandFailureAlert from "../../Popups/SellLandPopups/SellLandFailureAlert"

class SellLand extends PureComponent {
    state = {
        selectedLands: null,
    };

    componentDidMount() {
        const { isSellLandInTab, objects: { selectedLandMyLand, selectedCategoryMyLand }, user: { _id } } = this.props;

        if(isSellLandInTab){
            const quadKeys = selectedLandMyLand.map(land => land.quadKey);
            const cateIds = selectedCategoryMyLand.map(cate => cate._id);
            this.props.getSellLandInfos({ userId: _id, quadKeys, cateIds });
        } else {
            const { lands: { sellLandInfos=[] } } = this.props;
            if (!_.isEmpty(sellLandInfos)) {
                const selectedLands = _.cloneDeep(sellLandInfos).map(l => {
                    l.checked = false;
                    return l;
                });
                this.setState({ selectedLands });
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {lands: {sellSuccess, mode, isOwnSell, sellLands=[], getListSellLandSuccess }, objectList, addPopup, gotoSellLand, currentCategoryId, isSellLandInTab} = this.props;
        if (isOwnSell && mode === 'sell') {
            setTimeout(() => {
                addPopup({
                    name: sellSuccess ? 'SellLandSuccessAlert' : sellSuccess !== prevProps.lands.sellSuccess && sellSuccess === false && 'SellLandFailureAlert',
                    close: 'LoadingPopup',
                    data:  {gotoSellLand , currentCategoryId}
                });
            }, 500)
            this.props.clearPurchaseStatusSocket();
            this.props.clearSelected();
        }

        if (!_.isEqual(objectList, prevProps.objectList)) {
            const objectListFilter = objectList.filter(o => o.forSaleStatus);
            const landsSelectedFilter = _.differenceBy(this.state.selectedLands, objectListFilter, "quadKey");

            if (landsSelectedFilter.length === 0) {
                this.props.removePopup({name : "SellLand"});
            }
            this.setState({ selectedLands: landsSelectedFilter });
        }

        if(isSellLandInTab){
            if(!_.isEmpty(sellLands)){
                const selectedLands = _.cloneDeep(sellLands).map(l => {
                    l.checked = false;
                    return l;
                });
                this.setState({ selectedLands });
                this.props.dispatch({ type: 'REMOVE_SELL_LAND_INFOS' });
            }
            else {
                if(getListSellLandSuccess){
                    addPopup({ name: 'NoLandCanSaleAlert' });
                    this.props.dispatch({ type: 'REMOVE_SELL_LAND_INFOS' });
                }
            }
        }
    }


    //change price all
    onHandleChangePriceAll = (priceAll) => {
        const {selectedLands} = this.state;
        let selectedLandsUpdate = _.cloneDeep(selectedLands);
        selectedLandsUpdate.map(l => {
            l.sellPrice = priceAll;
            return l
        });
        this.setState({
            selectedLands: selectedLandsUpdate
        })
    };

    onHandleChangePriceOne = (e, land) => {
        const {selectedLands} = this.state;
        let selectedLandsUpdate = _.cloneDeep(selectedLands);
        const price = parseInt(e.target.value, 10);
        selectedLandsUpdate.map(l => {
            if (l.quadKey === land.quadKey) {
                l.sellPrice = price;
                return l
            }
            return l
        });
        this.setState({
            selectedLands: selectedLandsUpdate
        })
    };

    onHandleCheckLand = (land) => {
        const {selectedLands} = this.state;

        //change select
        const i = selectedLands.findIndex(l => l.quadKey === land.quadKey);

        let newSelectedLands = _.cloneDeep(selectedLands);
        newSelectedLands[i].checked = !newSelectedLands[i].checked;

        //change select all
        const checkAll = newSelectedLands.filter(l => l.checked).length === selectedLands.length;
        this.setState({ checkStatus: true, checkAll, selectedLands: newSelectedLands });
    };

    onHandleConfirmSellLand = () => {
        const {selectedLands} = this.state;
        const {addPopup} = this.props;

        let selectedLandsClone = _.cloneDeep(selectedLands);
        let landSell = selectedLandsClone.filter(l => l.checked);
        if (landSell.length === 0) {
            addPopup({name: 'NoSelectedAlert'});
        } else {
            let landCheckPrice = landSell.filter(l => l.sellPrice === 0);
            if (landCheckPrice.length !== 0) {
                addPopup({name: "SellLandPriceAlert"});
            } else {
                const forSellLandSelected = landSell.filter(l => l.checked && l.sellPrice !== 0);
                addPopup({name: "SellLandConfirmAlert", data: {forSellLandSelected, modeSell: true}})
            }
        }
    };

    onHandleCheckAll = (e) => {
        const {selectedLands} = this.state;
        const selectedLandsUpdate = _.cloneDeep(selectedLands);
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
    
    sellLandRender = () => {
        const {selectedLands, checkAll} = this.state;
        const {removePopup} = this.props;
        if(!selectedLands) return null;
        return (
            <Modal isOpen={true} backdrop="static" className={`custom-modal modal--land-sell`}>
                <div className='custom-modal-header'>
                    <img src={loadingImage('/images/game-ui/sm-sell-land.svg')} alt=''/>
                    <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.sell'}/>
                    <span className="lnr lnr-cross lnr-custom-close"
                          onClick={() => removePopup({name: 'sellLand'})}/>
                </div>
                <div className='custom-modal-body'>
                    {!selectedLands ? <div>loading</div> : <LandList selectedLands={selectedLands}
                                                                     checkAll={checkAll}
                                                                     onHandleCheckAll={this.onHandleCheckAll}
                                                                     onHandleCheckLand={this.onHandleCheckLand}
                                                                     onHandleChangePriceOne={this.onHandleChangePriceOne}
                                                                     onHandleChangePriceAll={this.onHandleChangePriceAll}/>}
                </div>
                <div className='custom-modal-footer-action-group'>
                    <button onClick={() => this.onHandleConfirmSellLand()}>
                        <img src={loadingImage('/images/game-ui/sm-ok.svg')} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.confirm'}/>
                        </div>
                    </button>
                    <button onClick={() => removePopup({name: 'sellLand'})}>
                        {/*<button onClick={() => this.onHandleShowAlert(aS.sellLandCancel)}>*/}
                        <img src={loadingImage('/images/game-ui/sm-close.svg')} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.cancel'}/>
                        </div>
                    </button>
                </div>
            </Modal>
        )
    };

    render() {
        const { screens } = this.props;
        return (
            <Fragment>
                {this.sellLandRender()}
                {screens['SellLandPriceAlert'] && <SellLandPriceAlert/>}
                {screens['SellLandConfirmAlert'] && <SellLandConfirmAlert {...screens['SellLandConfirmAlert']} />}
                {screens['SellLandSuccessAlert'] && <SellLandSuccessAlert {...screens['SellLandSuccessAlert']} />}
                {screens['SellLandFailureAlert'] && <SellLandFailureAlert/>}
                {screens['LoadingPopup'] && <LoadingPopup/>}
            </Fragment>
        );
    }
}


const mapStateToProps = (state) => {
    const {authentication: {user}, lands, objectsReducer: {objectList, currentCategoryId}, screens, objects} = state;
    return {
        user, lands, objectList, screens, objects, currentCategoryId
    }
};

const mapDispatchToProps = (dispatch) => ({
    getSellLandInfos: (param) => dispatch(landActions.getSellLandInfos(param)),
    sellLandSocket: (objSellLand) => dispatch(socketActions.sellLandSocket(objSellLand)),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    clearPurchaseStatusSocket: () => dispatch(landActions.clearPurchaseStatusSocket()),
    clearSelected: () => dispatch(mapActions.clearSelected()),
    dispatch,
});
export default connect(mapStateToProps, mapDispatchToProps)(SellLand)