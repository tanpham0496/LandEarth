import React, {Component, Fragment} from 'react';
import connect from "react-redux/es/connect/connect";
import classNames from 'classnames';
import {landActions} from "../../../../../store/actions/landActions/landActions";
import {userActions} from "../../../../../store/actions/commonActions/userActions";
import {socketActions} from "../../../../../store/actions/commonActions/socketActions";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {Modal} from 'reactstrap';
import {
    convertFloatToLocalString
} from '../../landMapComponent/component/MapFunction';
import Rules from "../../../../../helpers/ValidationRule";
import {loadingImage} from "../../general/System";
import TranslateLanguage from "../../general/TranslateComponent";
import {StyledDropdown} from '../../../../../components/customStyled/Dropdown_style';
import {
    alertPopupScreen,
    //getInitLoadingAlertPopup,
    //getNoLandAlertPopup,
    //getTooManyLandAlertPopup,
    getPurchaseLandConfirmAlertPopup,
    getNoSelectedAlert,
    getNotEnoughBloodAlertPopup,
    getWaitingAlertPopup,
    //getSuccessAlertPopup,
    getDeletedLandAlertPopup,
    getWaitingNoBlockAlertPopup,
    //getErrorAlertPopup,
    getFolderNameEmptyAlertPopup,
} from './component/AlertPopup';
import { isEqual, cloneDeep } from 'lodash';
import {screenActions} from "../../../../../store/actions/commonActions/screenActions";
import ValidationAlert from "./component/Popups/validationAlert";
// import NoLandSelectedAlert from "./component/Popups/NoLandSelectedAlert";
// import TooManySelectedLandAlert from "./component/Popups/TooManySelectedLandAlert";
// import BuyLandSuccessAlert from "./component/Popups/BuyLandSuccessAlert";

const TOTAL_PURCHASE_FEE = 0.01;
// const MAX_SELECTED_LAND = 300;
const MAX_LAND_IN_CATEGORY = 500;

const validationMess = {
    maxLength: 'maxLength',
    exist: 'exist',
    empty: 'empty',
    none: 'none'
}

class LandPurchasePopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalPopup: false,
            modalAlertPopup: false,
            currentAlertPopUp: alertPopupScreen.noPopup,
            totalLandPurchase: -1,
            buySuccess: -1,
            popupNoData: true,
            showPurchaseScreen: true,
            //data
            selectedTiles: [],
            checkAll: false,
            landItems: [],
            landDeleteInCart: null,
            calculatorBuyLand: {
                totalLandNumber: 0,
                totalBloodFee: 0,
                totalPurchaseFee: 0,
                myBlood: 0,
                myBloodAfterBuy: 0,
            },
            buying: false,
            categoryName: '',
            error: null,
            prePurchaseLands: []
        };
    }

    resetCalculatorBuyLand() {
        const {wallet} = this.state;
        return {
            totalLandNumber: 0,
            totalBloodFee: 0,
            totalPurchaseFee: 0,
            myBlood: wallet && wallet.info && wallet.info.goldBlood ? wallet.info.goldBlood : 0,
            myBloodAfterBuy: wallet && wallet.info && wallet.info.goldBlood ? wallet.info.goldBlood : 0,
        }
    }

    componentDidMount() {
        //console.log('componentDidMount');
        const {user: {wToken,_id}, lands: { buyLandInfos }} = this.props;
        const landItems = buyLandInfos && buyLandInfos.map(land => ({ checked: false, land }));
        this.setState({ categoryName: '', landItems, calculatorBuyLand: this.resetCalculatorBuyLand(this.props.user) });
        this.props.getAllLandCategoryNew({ userId: _id });
        this.props.getWalletInfo({ wToken });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        //console.log('componentDidUpdate');
        //result purchase land
        if (this.state.buying === true) {
            //console.log('this.state.buying === true')
            const {isOwn, purchaseSuccess, updates, buyFailure} = this.props.lands;
            if (isOwn) {
                // console.log('updates.length', updates.length);
                // console.log('buyFailure.length', buyFailure.length);
                // console.log('prePurchaseLands', updates.length+buyFailure.length);
                if (purchaseSuccess) {
                    this.removeCheckedItem();
                    this.props.dispatch({ type: 'ADD_POPUP', name: "BuyLandSuccessAlert", data: { prePurchaseLands: updates.length+buyFailure.length, buySuccess: updates.length } });
                    this.props.dispatch(landActions.getAllLandById(this.props.user._id));
                } else {
                    //this.handleShowAlertPopup(alertPopupScreen.errorAlert);
                    this.props.dispatch({ type: 'ADD_POPUP', name: "ErrorBuyLandAlert" });
                }
                this.props.clearPurchaseStatusSocket();
                this.props.dispatch({ type: 'REMOVE_BUY_LAND_STATUS' });
                this.props.dispatch({ type: 'REMOVE_POPUP', name: "LandPurchasePopup" });
                this.setState({ buying: false, calculatorBuyLand: this.resetCalculatorBuyLand(), prePurchaseLands: [] });
            }
        }

        const { lands: { statusBuyLand, errBuyLand, buyLandInfos }, screens } = this.props;
        const { landItems } = this.state;
        if(statusBuyLand && landItems && buyLandInfos && !isEqual(landItems.map(l => l.land), buyLandInfos)){
            //console.log('buy land list change');
            const landItems = buyLandInfos.map(land => ({ checked: false, land }));
            this.setState({ landItems });
            this.props.dispatch({ type: 'REMOVE_BUY_LAND_STATUS' });
            //this.props.dispatch({ type: 'REMOVE_POPUP', name: "LandPurchasePopup" });
        } else if(errBuyLand) {
            //console.log('errBuyLand', errBuyLand);
            if(errBuyLand === "noLand"){
                if(!screens['NoLandSelectedAlert']) this.props.dispatch(screenActions.addPopup({ name: 'NoLandSelectedAlert', close: 'LandPurchasePopup' }));
            } else if(errBuyLand === 'tooManyLand'){
                if(!screens['TooManySelectedLandAlert']) this.props.dispatch(screenActions.addPopup({ name: 'TooManySelectedLandAlert', close: 'LandPurchasePopup' }));
            }

            this.setState({ landItems: [] });
            this.props.dispatch({ type: 'REMOVE_BUY_LAND_STATUS' });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const {wallet} = nextProps;
        const walletCheck = Object.keys(wallet).length === 0 && wallet.constructor === Object;
        if (!walletCheck && wallet.info) {
            return { wallet: wallet }
        } else {
            return null
        }
    }

    handleShowAlertPopup = (screen, param) => {
        let updateTotalLandPurchase = -1;
        let updateBuySuccess = -1;
        if (typeof param !== 'undefined') {
            updateTotalLandPurchase = param.totalLandPurchase;
            updateBuySuccess = param.buySuccess;
        }
        this.setState({
            currentAlertPopUp: screen,
            modalAlertPopup: true,
            totalLandPurchase: updateTotalLandPurchase,
            buySuccess: updateBuySuccess
        });
    };

    handleHideAlertPopup = () => {
        this.setState({
            currentAlertPopUp: alertPopupScreen.noPopup,
            modalAlertPopup: false
        });
    };

    checkedAllLand = (splitLand) => {
        let newLandItems = cloneDeep(this.state.landItems).map(landItem => ({
            checked: !this.state.checkAll,
            land: landItem.land
        }));
        const {wallet} = this.state;
        if (wallet && wallet.info) {
            const calculatorBuyLand = newLandItems.reduce((sum, landItem) => {

                if (landItem.checked) {
                    sum.totalLandNumber += 1;
                    sum.totalBloodFee = parseFloat(sum.totalBloodFee) + parseFloat(landItem.land.sellPrice);
                    sum.totalPurchaseFee += TOTAL_PURCHASE_FEE;
                    sum.myBloodAfterBuy = wallet && wallet.info && wallet.info.goldBlood && parseFloat(wallet.info.goldBlood) - parseFloat(sum.totalBloodFee) - sum.totalPurchaseFee;
                }
                return sum;
            }, {
                totalLandNumber: 0,
                totalBloodFee: 0,
                totalPurchaseFee: 0,
                myBlood: wallet && wallet.info && wallet.info.goldBlood && parseFloat(wallet.info.goldBlood),
                myBloodAfterBuy: wallet && wallet.info && wallet.info.goldBlood && parseFloat(wallet.info.goldBlood),
            });
            calculatorBuyLand.totalBloodFee = parseFloat(calculatorBuyLand.totalBloodFee);
            calculatorBuyLand.totalPurchaseFee = parseFloat(calculatorBuyLand.totalPurchaseFee);
            calculatorBuyLand.myBloodAfterBuy = parseFloat(calculatorBuyLand.myBloodAfterBuy);

            //validate number land in category
            const { categoryNameSelected } = this.state;
            if(categoryNameSelected && categoryNameSelected.landCount + this.state.landItems.length > MAX_LAND_IN_CATEGORY && !this.props.screens['ErrorOver500LandsInCategory']){
                this.props.dispatch(screenActions.addPopup({ name: 'ErrorOver500LandsInCategory' }));
                return;
            }
            this.setState({checkAll: !this.state.checkAll, landItems: newLandItems, calculatorBuyLand});
        }

    };

    checkedOneLand = (landItem) => {
        let newLandItems = cloneDeep(this.state.landItems);
        let fIndex = newLandItems.findIndex(landIt => landIt.land.quadKey === landItem.land.quadKey);
        newLandItems[fIndex].checked = !newLandItems[fIndex].checked;
        const {wallet} = this.state;
        //console.log('wallet', wallet)
        if (wallet && wallet.info) {
            //console.log('newLandItems ', newLandItems[0].land.sellPrice);
            const calculatorBuyLand = newLandItems.reduce((sum, landItem) => {

                if (landItem.checked) {
                    sum.totalLandNumber += 1;
                    sum.totalBloodFee = parseFloat(sum.totalBloodFee) + parseFloat(landItem.land.sellPrice);
                    sum.totalPurchaseFee += TOTAL_PURCHASE_FEE;
                    sum.myBloodAfterBuy = wallet && wallet.info && wallet.info.goldBlood && parseFloat(wallet.info.goldBlood) - parseFloat(sum.totalBloodFee);
                }
                return sum;
            }, {
                totalLandNumber: 0,
                totalBloodFee: 0,
                totalPurchaseFee: 0,
                myBlood: wallet && wallet.info && wallet.info.goldBlood && parseFloat(wallet.info.goldBlood),
                myBloodAfterBuy: wallet && wallet.info && wallet.info.goldBlood && parseFloat(wallet.info.goldBlood),
            });

            calculatorBuyLand.totalBloodFee = parseFloat(calculatorBuyLand.totalBloodFee);
            calculatorBuyLand.totalPurchaseFee = parseFloat(calculatorBuyLand.totalPurchaseFee);
            calculatorBuyLand.myBloodAfterBuy = parseFloat(calculatorBuyLand.myBloodAfterBuy);

            const newCheckedItem = newLandItems.filter(item => item.checked);

            //validate number land in category
            const { categoryNameSelected } = this.state;
            if(categoryNameSelected && categoryNameSelected.landCount + newCheckedItem.length > MAX_LAND_IN_CATEGORY && !this.props.screens['ErrorOver500LandsInCategory']){
                this.props.dispatch(screenActions.addPopup({ name: 'ErrorOver500LandsInCategory' }));
                return;
            }

            this.setState({
                landItems: newLandItems,
                calculatorBuyLand,
                checkAll: newCheckedItem.length === this.state.landItems.length
            });
        }

    };

    changeCategoryName = (e) => {
        const newCategoryName = e.target.value;
        this.setState({categoryName: newCategoryName});
    };

    removeCheckItemWhenClosePuschasePopup() {
        const { screens } = this.props;
        const rmChecked = this.state.landItems.map(landItem => {
            landItem.checked = false;
            return landItem;
        });
        this.setState({
            landItems: rmChecked,
            checkAll: false,
            calculatorBuyLand: this.resetCalculatorBuyLand(),
            categoryName: ''
        });
        if(screens['LandPurchasePopup']) this.props.dispatch(screenActions.removePopup({ name: 'LandPurchasePopup' }));
    }

    validateCategoryName = (value) => {
        const {categoryList} = this.props;
        const allCate = categoryList && categoryList.categories;
        let categoriesName = allCate.map((item, index) => {
            return item.name
        });

        let rules = new Rules.ValidationRules();
        if (rules.checkLength(value, 36, '_')) {
            this.props.addPopup({name: 'ValidationAlert', data: {error: rules.checkLength(value , 36 , validationMess.maxLength )} });
            this.setState({
                error: validationMess.maxLength
            })
        }else if (rules.checkExistName(value, categoriesName, '_')) {
            this.props.addPopup({name: 'ValidationAlert', data: {error: rules.checkLength(value , categoriesName , validationMess.exist ) }});
            this.setState({
                error: validationMess.exist
            })
        }else{
            this.setState({
                error: null
            })
        }
    }

    hidePopupAnClearError = () => {
        this.setState({
            modalAlertPopup: false,
            error: null
        });
    };

    checkEmptyLandBeforeOpenConfirmPopup = () => {
        const {landItems,categoryName,categoryNameSelected,calculatorBuyLand} = this.state;
        const isSelected = landItems && landItems.some(land => land.checked);
        if(!isSelected) {
            return this.handleShowAlertPopup(alertPopupScreen.noSelectedAlert);
        }

        this.validateCategoryName(categoryName.trim());
        if ((categoryName.trim() === '' || categoryName === null ) && !categoryNameSelected ) return this.handleShowAlertPopup(alertPopupScreen.folderNameEmptyAlertPopup);
        if (calculatorBuyLand.totalLandNumber <= 0) return this.handleShowAlertPopup(alertPopupScreen.noSelectedAlert);
        //not enough blood when buy land
        if (calculatorBuyLand.myBloodAfterBuy <= 0) return this.handleShowAlertPopup(alertPopupScreen.notEnoughBloodAlert);
        //show confirm buy
        this.handleShowAlertPopup(alertPopupScreen.purchaseLandConfirmAlert);
    };

    hideAndRefreshPage = () => {

        this.props.getAllLandById(this.props.user._id);
        setTimeout(()=> {
            this.handleHideAllPopup();
        },0.01)

    };

    confirmLandPurchase = () => {
        let {lands: {categoryList}, map: { zoom }} = this.props;
        //console.log('zoom', zoom);
        const {_id, nid} = this.props.user;
        let filterCheckedLand = this.state.landItems.filter(landItems => landItems.checked);
        if (filterCheckedLand && filterCheckedLand.length > 0) {
            let objBuyLand = {
                categoryName: this.state.categoryName === '' ? this.state.categoryNameSelected.name: this.state.categoryName,
                itemQuadKeys: filterCheckedLand.map(landItem => {
                    const {quadKey, sellPrice, user} = landItem.land;
                    return user ? {
                            quadKey,
                            sellPrice,
                            buyerId: _id,
                            buyerNid: nid,
                            sellerId: user._id,
                            sellerNid: user.nid
                        }
                        : {quadKey, sellPrice, buyerId: _id, buyerNid: nid, sellerId: null, sellerNid: 0}
                }),
                user: this.props.user,
                categoryId: !this.state.changeCategoryModeToggle && categoryList.categories.length !== 0 ? this.state.categoryNameSelected._id : null,
                zoom
            };
            const quadKeys = filterCheckedLand.map(landItem => landItem.land.quadKey);
            this.setState({showPurchaseScreen: false});
            this.setState({prePurchaseLands: quadKeys});
            this.setState({buying: true, landItems: []});
            this.props.clearSelected();
            this.props.transferBloodTradingLand({buyLands: objBuyLand});
            this.handleHideAlertPopup();
            this.handleShowAlertPopup(alertPopupScreen.waitingAlert);
        }
    };

    handleHideAllPopup = () => {
        this.props.clearPurchaseStatusSocket();
        this.setState({prePurchaseLands: []});
        this.props.handleHidePopup();
        this.handleHideAlertPopup();
    };

    removeCheckedItem() {
        let newLandItems = [...this.state.landItems];
        newLandItems = newLandItems.filter(slTile => slTile.checked === false);
        this.setState({
            checkAll: false,
            landItems: newLandItems,
            calculatorBuyLand: this.resetCalculatorBuyLand(this.props.user)
        });
    }

    confirmDeleteSelectedLand = () => {
        this.removeCheckedItem();
        this.handleHideAlertPopup();
    }

    changeCategoryEditor = () =>{
        let { categoryList } = this.props;
        if(categoryList.categories.length !== 0){
            this.setState({
                changeCategoryModeToggle: !this.state.changeCategoryModeToggle,
                categoryNameSelected: null,
                categoryName: ''
            });
        }
    }

    // checkEmptyLandBeforeOpenDeleteLandPopup = () =>{
    //     const {deletedLandAlert,noSelectedAlert} = alertPopupScreen
    //     const {landItems} = this.state;
    //     const isSelected = landItems && landItems.some(land => land.checked);
    //     return isSelected ? this.handleShowAlertPopup(deletedLandAlert) : this.handleShowAlertPopup(noSelectedAlert);
    // };

    cateTemplate = (option , landItemsChecked) => {
        const style = {
            opacity: landItemsChecked.length + option.landCount > 500 ? 0.5 : 1
        }
        if (!option._id) {
            return option.name;
        } else {
            return (<Fragment>
                <div className='land-name' style={style}>{option.name}</div>
                <div className='land-amount' style={style}>{option.landCount}</div>
            </Fragment>);
        }
    };
    getSelectedLandList = (landItems,categoryList,categoryNameSelected,categoryName,totalLandNumber,totalBloodFee,goldBlood) => {
        const {checkAll, changeCategoryModeToggle} = this.state;
        const category = categoryList && categoryList.categories;
        // console.log('categoryList', categoryList);
        // console.log('category', category)
        const clsCheckAll = classNames({
            'check-box' :true,
            'checked' : checkAll
        });
        const landItemsChecked = (landItems && landItems.filter(l => l.checked)) || [];
        const spacing = <div className='item-row'><div className='land-col'/><div className='init-blood-col'/><div className='blood-col' /></div>;
        return (
            <div className='land-purchase-container'>
                <div className='header-grid'>
                    <div className='land-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.selectedLandTitle'}/>
                    </div>
                    <div className='blood-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.priceTitle'}/>
                    </div>
                    <div className='land-sub-col'>
                        <div className={clsCheckAll} onClick={() => this.checkedAllLand()}/>
                        <span onClick={() => this.checkedAllLand()}><TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.selectAll'}/></span>
                        {/*<div > &nbsp;{`(${ (Array.isArray(landItems) && landItems.length) || 0 })`} </div>*/}
                    </div>
                    <div className='init-blood-sub-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.landPrice'}/>
                    </div>
                    <div className='blood-sub-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.priceBlood'}/>
                    </div>
                </div>

                <div className='body-grid'>
                    {spacing}
                    {
                        landItems && landItems.map((landItem, index) => {
                            const clsCheckOne = classNames({
                                'check-box' :true,
                                'checked' : landItem.checked
                            });

                            return <div className='item-row' key={index}>
                                <div className='land-col'>
                                    <div className={clsCheckOne} onClick={() => this.checkedOneLand(landItem)}/>
                                    <span onClick={() => this.checkedOneLand(landItem)} >{landItem.land.quadKey}</span>
                                </div>
                                <div className='init-blood-col'>
                                    <input type="number" readOnly value={landItem.land.initialPrice}/>
                                </div>
                                <div className='blood-col'>
                                    <input type="number" readOnly value={landItem.land.sellPrice}/> Blood
                                </div>
                            </div>
                        })
                    }
                </div>
                <div className='footer-grid'>

                    <div className='title-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.folderName'}/>
                    </div>
                    <div className='edit-col'>
                        {!changeCategoryModeToggle && category && category.length !== 0
                            ? <StyledDropdown optionLabel='name' value={categoryNameSelected} options={category}
                                            itemTemplate={(option) => this.cateTemplate(option, landItemsChecked)}
                                            onChange={e => e.value.landCount + landItemsChecked.length <= 500 ? this.setState({ categoryNameSelected: e.value }) : null}
                                            placeholder="Select a Category"/>
                            : <input autoFocus className='value' type='text' value={categoryName} onChange={(e) => this.changeCategoryName(e)}/>
                        }
                    </div>
                    <div className='unit-col'>
                        <div className='change-mode-button' onClick={() => this.changeCategoryEditor()}>
                            <div className='change-mode-button-content'>{!changeCategoryModeToggle ?
                                <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.change-mode-button2'}/> :
                                <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.change-mode-button1'}/>}</div>
                        </div>

                    </div>

                    <div className='title-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.noSelectedLand'}/>
                    </div>
                    <div className='edit-col'>
                        <div className='value'>{totalLandNumber}</div>
                    </div>
                    <div className='unit-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.land'}/>
                    </div>


                    <div className='title-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.bloodPurchasedLand'}/>
                    </div>
                    <div className='edit-col'>
                        <div className='value'>{convertFloatToLocalString(totalBloodFee)}</div>
                    </div>
                    <div className='unit-col'>Blood</div>


                    <div className='title-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.fees'}/>
                    </div>
                    <div className='edit-col'>
                        <div className='value'>{0}</div>
                    </div>
                    <div className='unit-col'>Blood</div>


                    <div className='title-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.myBlood'}/>
                    </div>
                    <div className='edit-col'>
                        <div className='value'>{convertFloatToLocalString(goldBlood)}</div>
                    </div>
                    <div className='unit-col'>Blood</div>


                    <div className='title-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.myBloodAfter'}/>
                    </div>
                    <div className='edit-col'>
                        <div className='value'>{convertFloatToLocalString(goldBlood - totalBloodFee)}</div>
                    </div>
                    <div className='unit-col'>Blood</div>

                </div>
            </div>
        )
    }

    getLandPurchasePopup = () => {
        const {calculatorBuyLand: {totalLandNumber, totalBloodFee}, landItems, categoryName, wallet, showPurchaseScreen, categoryNameSelected} = this.state;
        let goldBlood = wallet && wallet.info ? wallet.info.goldBlood : 0;
        let { modalPopup, categoryList } = this.props;
        
        return showPurchaseScreen && <Modal isOpen={modalPopup} backdrop="static" className={`custom-modal modal--land-purchase`}>
            <div className='custom-modal-header'>
                <img src={loadingImage('/images/bloodland-ui/land-purchare-white.png')} alt=''/>
                <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.header'}/>
                <span className="lnr lnr-cross lnr-custom-close"
                      onClick={() => this.removeCheckItemWhenClosePuschasePopup()}/>
            </div>
            <div className='custom-modal-body'>
                {this.getSelectedLandList(landItems, categoryList, categoryNameSelected, categoryName, totalLandNumber, totalBloodFee, goldBlood)}
            </div>
            <div className='custom-modal-footer-action-group'>
                <button onClick={() => this.checkEmptyLandBeforeOpenConfirmPopup()}>
                    <img src='/images/game-ui/sm-ok.svg' alt=''/>
                    <div>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.confirmBtn'}/>
                    </div>
                </button>

                {/*                
                <button onClick={() => this.checkEmptyLandBeforeOpenDeleteLandPopup()}>
                    <img src='/images/game-ui/sm-recycle.svg' alt=''/>
                    <div>
                        <TranslateLanguage
                            direct={'menuTab.transaction.buyLand.getLandPurchasePopup.deleteBtn'}/>
                    </div>
                </button>*/}

                <button onClick={() => this.removeCheckItemWhenClosePuschasePopup()}>
                    <img src='/images/game-ui/sm-close.svg' alt=''/>
                    <div>
                        <TranslateLanguage
                            direct={'menuTab.transaction.buyLand.getLandPurchasePopup.cancelBtn'}/>
                    </div>
                </button>
            </div>
        </Modal>
    };

    getAlertModalPopup = () => {
        const {modalAlertPopup,currentAlertPopUp , error} = this.state;
        const {screens} = this.props;
        const { deletedLandAlert,
            purchaseLandConfirmAlert,
            waitingAlert,
            noSelectedAlert,
            waitingNoBlockAlert,
            notEnoughBloodAlert,
            folderNameEmptyAlertPopup,
            } = alertPopupScreen;
        //const {buySuccess, prePurchaseLands:{length}} = this.state;
        return (
            <Fragment>
                {deletedLandAlert === currentAlertPopUp && getDeletedLandAlertPopup(modalAlertPopup,this.confirmDeleteSelectedLand,this.handleHideAlertPopup)}
                {error === null && purchaseLandConfirmAlert === currentAlertPopUp && getPurchaseLandConfirmAlertPopup(modalAlertPopup,this.confirmLandPurchase,this.handleHideAlertPopup)}
                {waitingAlert === currentAlertPopUp && getWaitingAlertPopup(modalAlertPopup)}
                {/*successAlert === currentAlertPopUp && getSuccessAlertPopup(modalAlertPopup,this.hideAndRefreshPage,buySuccess,length , getAllLandById , user)*/}
                {/*errorAlert === currentAlertPopUp && getErrorAlertPopup(modalAlertPopup,this.handleHideAllPopup)*/}
                {noSelectedAlert === currentAlertPopUp && getNoSelectedAlert(modalAlertPopup,this.handleHideAlertPopup)}
                {waitingNoBlockAlert === currentAlertPopUp && getWaitingNoBlockAlertPopup(modalAlertPopup,this.hideAndRefreshPage)}
                {notEnoughBloodAlert === currentAlertPopUp && getNotEnoughBloodAlertPopup(modalAlertPopup,this.handleHideAlertPopup)}
                {folderNameEmptyAlertPopup === currentAlertPopUp && getFolderNameEmptyAlertPopup(modalAlertPopup,this.handleHideAlertPopup)}
                {/*reLoginAlert === currentAlertPopUp && getReLoginAlertPopup(modalAlertPopup,bloodAppId,this.handleHideAllPopup) ----*/}
                {/*waitingNoBlockAlert*/}
                {screens['ValidationAlert'] && <ValidationAlert {...screens['ValidationAlert']}/>}
            </Fragment>
        );
    };

    render() {
        const { lands: { statusBuyLand }, map: { selected } } = this.props;
        return (
            <Fragment>
                { statusBuyLand && selected && this.getLandPurchasePopup()}
                { this.getAlertModalPopup() }
            </Fragment>
        );
    }

}

function mapStateToProps(state) {
    const {lands, lands: {categoryList}, authentication: {user}, map, users, notify: {notifies}, settingReducer, wallet , screens} = state;
    return {
        notifies,
        user,
        lands,
        map,
        users,
        wallet,
        settingReducer,
        categoryList,
        screens,
    };
}

const mapDispatchToProps = (dispatch) => ({
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    getAllLandCategoryNew: (param) => dispatch(landActions.getAllLandCategoryNew(param)),
    addWaitingTile: (tiles) => dispatch(mapActions.addWaitingTile(tiles)),
    removeWaitingTile: (tiles) => dispatch(mapActions.removeWaitingTile(tiles)),
    transferBloodTradingLand: (objTransfer) => dispatch(socketActions.transferBloodTradingLand(objTransfer)),
    clearBloodPurchase: () => dispatch(userActions.clearBloodPurchase()),
    transferBlood: (objTransfer) => dispatch(userActions.transferBlood(objTransfer)),
    transferBloodTrading: (objTransfer) => dispatch(userActions.transferBloodTrading(objTransfer)),
    clearSelected: () => dispatch(mapActions.clearSelected()),
    clearPurchaseStatusSocket: () => dispatch(landActions.clearPurchaseStatusSocket()),
    getWalletInfo: (param) => dispatch(userActions.getWalletInfo(param)),
    getAllLandCategory: ({userId}) => dispatch(landActions.getAllLandCategory({userId})),
    getLandByQuadKeys: (param) => dispatch(landActions.getLandByQuadKeys(param)),
    getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
    dispatch
});
export default connect(mapStateToProps, mapDispatchToProps)(LandPurchasePopup)
