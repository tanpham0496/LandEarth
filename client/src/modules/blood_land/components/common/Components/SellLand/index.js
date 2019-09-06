import React, {Fragment, PureComponent} from 'react'
import {Modal} from 'reactstrap';
import {loadingImage, screenActions, TranslateLanguage, landActions, socketActions, mapActions} from '../../../../../../helpers/importModule';
import LandList from "./component/landList";
import _ from 'lodash';
import {connect} from 'react-redux'
// popup component
import NoSelectedAlert from "../../Popups/commomPopups/NoSelectedAlert";
import SellLandPriceAlert from "../../Popups/SellLandPopups/SellLandPriceAlert"
import SellLandConfirmAlert from "../../Popups/SellLandPopups/SellLandConfirmAlert"
import LoadingPopup from "../../Popups/commomPopups/LoadingPopup"
import SellLandSuccess from "../../Popups/SellLandPopups/SellLandSuccessAlert"
import SellLandFailure from "../../Popups/SellLandPopups/SellLandFailureAlert"

class SellLand extends PureComponent {
    state = {
        selectedLands: null,
    };

    componentDidMount() {
        const { isSellLandInTab, objects: { selectedLandMyLand, selectedCategoryMyLand }, user: { _id } } = this.props
        if(isSellLandInTab){
            if(!_.isEmpty(selectedLandMyLand) || !_.isEmpty(selectedCategoryMyLand)){
                const quadKeys = selectedLandMyLand.map(land => land.quadKey);
                const cateIds = selectedCategoryMyLand.map(cate => cate._id);
                this.props.getSellLandInfos({ userId: _id, quadKeys, cateIds });
            }
        } else {
            const { lands: { sellLandInfos=[] } } = this.props;
            if (sellLandInfos) {
                const selectedLands = _.cloneDeep(sellLandInfos).map(l => {
                    l.checked = false;
                    return l;
                });
                this.setState({ selectedLands });
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {lands: {sellSuccess, mode, isOwnSell}, objectList, addPopup, gotoSellLand , categoryId, isSellLandInTab, lands: { sellLands=[] }} = this.props;
        if (isOwnSell && mode === 'sell') {
            setTimeout(() => {
                addPopup({
                    name: sellSuccess ? 'SellLandSuccessAlert' : sellSuccess !== prevProps.lands.sellSuccess && sellSuccess === false && 'SellLandFailureAlert',
                    close: 'LoadingPopup',
                    data:  {gotoSellLand , categoryId}
                });
            }, 500)
            this.props.clearPurchaseStatusSocket();
            this.props.clearSelected();
            
        }

        if (!_.isEqual(objectList, prevProps.objectList)) {
            const objectListFilter = objectList.filter(o => o.forSaleStatus);
            const landsSelectedFilter = _.differenceBy(this.state.selectedLands, objectListFilter, "quadKey");

            if (landsSelectedFilter.length === 0) {
                this.props.handleHidePopup()
            }
            this.setState({ selectedLands: landsSelectedFilter });
        }

        console.log('sellLands', sellLands);
        if(isSellLandInTab && !_.isEmpty(sellLands)){
            console.log('sellLands', sellLands)
            const selectedLands = _.cloneDeep(sellLands).map(l => {
                l.checked = false;
                return l;
            });
            this.setState({ selectedLands });
            this.props.dispatch({ type: 'REMOVE_SELL_LAND_INFOS' });
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
                let ForSellLandSelected = landSell.filter(l => l.checked && l.sellPrice !== 0);
                addPopup({name: "SellLandConfirmAlert", data: {ForSellLandSelected, modeSell: true}})
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
        const { screens, objects: { selectedLandMyLand, selectedCategoryMyLand } } = this.props;
        if(_.isEmpty(selectedLandMyLand) && _.isEmpty(selectedCategoryMyLand)){
            this.props.addPopup({ name: 'NoSelectedAlert' });
        }
        
        return (
            <Fragment>
                {this.sellLandRender()}
                {screens['NoSelectedAlert'] && <NoSelectedAlert/>}
                {screens['SellLandPriceAlert'] && <SellLandPriceAlert/>}
                {screens['SellLandConfirmAlert'] && <SellLandConfirmAlert/>}
                {screens['SellLandSuccessAlert'] && <SellLandSuccess/>}
                {screens['SellLandFailureAlert'] && <SellLandFailure/>}
                {screens['LoadingPopup'] && <LoadingPopup/>}
 
            </Fragment>
        );
    }
}


const mapStateToProps = (state) => {
    const {authentication: {user}, lands, objectsReducer: {objectList}, screens, objects} = state;
    return {
        user, lands, objectList, screens, objects
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