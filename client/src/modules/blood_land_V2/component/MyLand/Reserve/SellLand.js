import React, {Fragment, PureComponent} from "react";
import {Modal} from "reactstrap";
import {loadingImage} from "../../../../blood_land/components/general/System";
import {landActions,mapActions,screenActions,socketActions, TranslateLanguage } from "../../../../../helpers/importModule";
import LandList from "./LandList";
import LoadingPopup from "../../Popup/LoadingPopup";
import {connect} from "react-redux";
import _ from 'lodash'
import {SellLandPricePopup, SellLandConfirmPopup, SellLandSuccessPopup, SellLandFailurePopup, NoCategorySelectedPopup ,NoSelectedPopup} from '../../Popup/myland'

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
                    name: sellSuccess ? 'SellLandSuccessPopup' : sellSuccess !== prevProps.lands.sellSuccess && sellSuccess === false && 'SellLandFailurePopup',
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
        let landSell = [...selectedLands].filter(l => l.checked);
        if (landSell.length === 0) {
            addPopup({name: 'NoSelectedPopup'});
        } else {
            let landCheckPrice = landSell.filter(l => l.sellPrice === 0);
            if (landCheckPrice.length !== 0) {
                addPopup({name: "SellLandPricePopup"});
            } else {
                const forSellLandSelected = landSell.filter(l => l.checked && l.sellPrice !== 0);
                // console.log('forSellLandSelected',forSellLandSelected);
                addPopup({name: "SellLandConfirmPopup", data: {forSellLandSelected, modeSell: true}})
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
    render() {
        const { screens, removePopup } = this.props;
        const {selectedLands, checkAll} = this.state;
        if(!selectedLands) return null;
        const selectedLandLength = selectedLands && selectedLands.filter(landItem => landItem.checked).length;
        const totalBloodSell = selectedLands && selectedLands.filter(landItem => landItem.checked);
        return (
            <Fragment>
                <Modal isOpen={true} backdrop="static" className={`custom-modal modal-land-sell`}>
                    <div className='custom-modal-header'>
                        <img src={loadingImage('/images/bloodLandNew/myLand/icon-sell.png')} alt=''/>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.sell'}/>
                        <div className='button-header'
                             onClick={() => removePopup({name: 'SellLand'})}>
                            <div className='button-return'>
                                <div className='icon-button'/>
                            </div>
                        </div>
                    </div>
                    <div className="line-container"> </div>
                    <div className='custom-modal-body'>
                        {!selectedLands ? <div>loading</div> : <LandList selectedLands={selectedLands}
                                                                         checkAll={checkAll}
                                                                         onHandleCheckAll={this.onHandleCheckAll}
                                                                         onHandleCheckLand={this.onHandleCheckLand}
                                                                         onHandleChangePriceOne={this.onHandleChangePriceOne}
                                                                         onHandleChangePriceAll={this.onHandleChangePriceAll}/>}
                    </div>
                    <div className='footer-grid'>
                        <div className='footer1-col'><TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.totalSell'}/></div>
                        <div className='footer2-col'>
                            <div className='value'>{selectedLandLength || 0}</div> <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.land'}/>
                        </div>
                        <div className='footer1-col'><TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.totalBloodSell'}/></div>
                        <div className='footer2-col'>
                            <div className='value'>
                                {selectedLandLength ? (totalBloodSell || []).reduce((total, land) => total + (land.sellPrice),0) : 0}
                            </div> <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.Blood'}/>
                        </div>
                    </div>
                    <div className='custom-modal-footer-sell-land'>
                        <button onClick={() => this.onHandleConfirmSellLand()}>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.confirm'}/>
                        </button>
                        <button onClick={() => removePopup({name: 'SellLand'})}>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.cancel'}/>
                        </button>
                    </div>
                </Modal>
                {screens['SellLandPricePopup'] && <SellLandPricePopup/>}
                {screens['SellLandConfirmPopup'] && <SellLandConfirmPopup {...screens['SellLandConfirmPopup']} />}
                {screens['SellLandSuccessPopup'] && <SellLandSuccessPopup {...screens['SellLandSuccessPopup']} />}
                {screens['LoadingPopup'] && <LoadingPopup/>}
                {screens['SellLandFailurePopup'] && <SellLandFailurePopup/>}
                {screens['NoSelectedPopup'] && <NoSelectedPopup/>}
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