import React, {Fragment, Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {Modal} from 'reactstrap';
import _ from 'lodash'
import {validatePrice} from '../../../landMapComponent/component/MapFunction';

import {
    TranslateLanguage,
    loadingImage,
    landActions,
    socketActions,
} from '../../../../../../helpers/importModule';
import {StyledCheckbox} from "../../../../../../components/customStyled/Checkbox_style";
import NoSelectedToModified from "./NoSelectedToModified"
import SellLandPriceAlert from "../SellLandPopups/SellLandPriceAlert"
import SellLandConfirmAlert from "../SellLandPopups/SellLandConfirmAlert"
import ModifyLandResultAlert from "./ModifyLandResultAlert"
import {screenActions} from "../../../../../../store/actions/commonActions/screenActions";
import LoadingPopup from "../commomPopups/LoadingPopup";


class SellLandModify extends Component {
    state = {
            forSellLandSelected: [],
            sellPrice: 0,
            limitPrice: false,
            checkAll: false
        };

    componentDidMount() {
        const {lands, screens: {SaleLandModifiedPopup: {landForSaleSelected}}} = this.props;
        this.setState({sellPrice: lands.defaultLandPrice});
        if (landForSaleSelected && landForSaleSelected.length > 0) {
            const landForSaleSelectedUpdate = _.cloneDeep(landForSaleSelected).map(l => {
                l.itemChecked = false;
                return l
            });
            this.setState({
                forSellLandSelected: landForSaleSelectedUpdate
            });
        }
    }

    componentDidUpdate(prevProps) {
        const {lands: {isOwnSell, sellSuccess, mode, updatedStateLands}, addPopup, screens, user} = this.props;
        if (isOwnSell && mode === 're_selling') {
            const paramModifyLandResultAlert = {
                landUpdate: sellSuccess ? updatedStateLands.length : 0,
                totalLand: screens.LoadingPopup.totalLand
            };
            this.props.getAllLandById(user._id)
            setTimeout(() => {
                addPopup({name: 'ModifyLandResultAlert', data: {paramModifyLandResultAlert}, close: 'LoadingPopup'})
            }, 500)
            this.props.clearForSaleStatusSocket();
        }
    }

    changePriceAll = (e) => {
        const newSellPrice = parseFloat(e.target.value);
        if (validatePrice(newSellPrice)) {
            let newForSellLandSelected = [...this.state.forSellLandSelected].map(landItem => {
                landItem.sellPrice = newSellPrice;
                return landItem;
            });
            this.setState(() => ({
                sellPrice: newSellPrice,
                forSellLandSelected: newForSellLandSelected,
                limitPrice: false
            }));
        } else {
            this.setState({limitPrice: true});
        }
    };

    clickCheckedAll = () => {
        const {forSellLandSelected, checkAll} = this.state;
        let newForSellLandSelected = [...forSellLandSelected].map(landItem => {
            landItem.checked = !this.state.checkAll;
            return landItem;
        });
        this.setState({checkAll: !checkAll, forSellLandSelected: newForSellLandSelected});
    };

    onHandleSelectedLand = (e) => {
        const {forSellLandSelected} = this.state;
        const forSellLandSelectedUpdate = _.cloneDeep(forSellLandSelected).map(l => {
            if (l._id === e.value._id) {
                l.itemChecked = !l.itemChecked
            }
            return l;
        });
        const isCheckAll = _.cloneDeep(forSellLandSelectedUpdate).filter(l => !l.itemChecked).length === 0;
        this.setState({
            checkAll: isCheckAll,
            forSellLandSelected: forSellLandSelectedUpdate
        })
    };
    onHandleSelectedAllLand = (e) => {
        const {forSellLandSelected} = this.state;
        const forSellLandSelectedUpdate = _.cloneDeep(forSellLandSelected).map(l => {
            l.itemChecked = e.checked;
            return l;
        });
        this.setState({
            checkAll: e.checked,
            forSellLandSelected: forSellLandSelectedUpdate
        })
    }

    changePriceOne = (e, landItem) => {
        const newSellPrice = parseFloat(e.target.value);
        if (validatePrice(newSellPrice)) {
            let newForSellLandSelected = [...this.state.forSellLandSelected];
            let fIndex = newForSellLandSelected.findIndex(splLand => splLand.quadKey === landItem.quadKey)
            newForSellLandSelected[fIndex].sellPrice = newSellPrice;
            this.setState({forSellLandSelected: newForSellLandSelected, limitPrice: false});
        } else {
            this.setState({limitPrice: true});
        }
    };


    getSellLandModifyPopup = () => {
        const {sellPrice, forSellLandSelected , checkAll} = this.state;
        const {removePopup} = this.props;
        const selectedLandLength = forSellLandSelected.filter(landItem => landItem.checked).length;
        const spacing = <div className='item-row'>
            <div className='land-col'/>
            <div className='blood-col'/>
        </div>;
        return (
            <Modal isOpen={true} backdrop="static" className={`custom-modal modal--land-sell-modify`}>
                <div className='custom-modal-header'>
                    <img src={loadingImage('/images/game-ui/sm-change-land-price.svg')} alt=''/>
                    <TranslateLanguage direct={'alert.getSellLandModifyPopup.header'}/>
                    <span className="lnr lnr-cross lnr-custom-close"
                          onClick={() => removePopup({name: 'SaleLandModifiedPopup'})}/>
                </div>
                <div className='custom-modal-body'>
                    <div className='sell-land-modify-container'>
                        <div className='header-grid'>
                            <div className='land-col'>
                                <TranslateLanguage direct={'alert.getSellLandModifyPopup.headingColumn1'}/>
                            </div>
                            <div className='blood-col'>
                                <TranslateLanguage direct={'alert.getSellLandModifyPopup.headingColumn2'}/>
                            </div>
                            <div className='land-sub-col'>
                                <StyledCheckbox checked={checkAll}
                                                onChange={(e) => this.onHandleSelectedAllLand(e)}/>
                                <span onClick={() => this.clickCheckedAll()}><TranslateLanguage
                                    direct={'alert.getSellLandModifyPopup.selectAll'}/></span>
                                <div> &nbsp;{`(${(Array.isArray(forSellLandSelected) && forSellLandSelected.length) || 0})`} </div>
                            </div>
                            <div className='blood-sub-col'>
                                <TranslateLanguage direct={'alert.getSellLandModifyPopup.changePriceAll'}/>
                                <input type='number' onChange={(e) => this.changePriceAll(e)} value={sellPrice}/> Blood
                            </div>
                        </div>
                        <div className='body-grid'>
                            {spacing}
                            {
                                forSellLandSelected.map((landItem, index) => {
                                    // console.log('land', landItem)
                                    const {name, sellPrice, quadKey, itemChecked} = landItem;
                                    return <div className='item-row' key={index}>
                                        <div className='land-col'>
                                            <StyledCheckbox value={landItem} checked={itemChecked}
                                                            onChange={(e) => this.onHandleSelectedLand(e)}/>
                                            <span>{name !== '' ? name : quadKey}</span>
                                        </div>
                                        <div className='blood-col'>
                                            <input type='number' onChange={(e) => this.changePriceOne(e, landItem)}
                                                   value={sellPrice}
                                            /> Blood
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                        <div className='footer-grid'>
                            <div className='footer1-col'><TranslateLanguage
                                direct={'alert.getSellLandModifyPopup.totalSell'}/></div>
                            <div className='footer2-col'>
                                <div className='value'> {selectedLandLength}</div>
                                <TranslateLanguage direct={'alert.getSellLandModifyPopup.land'}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='custom-modal-footer-action-group'>
                    <button onClick={() => this.modifyPriceLands()}>
                        <img src={loadingImage('/images/game-ui/sm-ok.svg')} alt=''/>
                        <div><TranslateLanguage direct={'alert.getSellLandModifyPopup.confirm'}/></div>
                    </button>
                    <button onClick={() => removePopup({name: 'SaleLandModifiedPopup'})}>
                        <img src={loadingImage('/images/game-ui/sm-close.svg')} alt=''/>
                        <div><TranslateLanguage direct={'alert.getSellLandModifyPopup.cancel'}/></div>
                    </button>
                </div>
            </Modal>
        )
    };


    getAlertModalPopup = () => {
        const {screens} = this.props;
        return (
            <Fragment>
                {screens['SellLandConfirmAlert'] && <SellLandConfirmAlert/>}
                {screens['ModifyLandResultAlert'] && <ModifyLandResultAlert/>}
                {screens['NoSelectedToModified'] && <NoSelectedToModified/>}
                {screens['SellLandPriceAlert'] && <SellLandPriceAlert/>}
                {screens["LoadingPopup"] && <LoadingPopup/>}
            </Fragment>
        );
    };

    render() {
        const modalPopup = this.getSellLandModifyPopup();
        const alertPopup = this.getAlertModalPopup();
        return (
            <Fragment>
                {modalPopup}
                {alertPopup}
            </Fragment>
        );
    }

    modifyPriceLands = () => {
        const {forSellLandSelected} = this.state;
        const {addPopup} = this.props;
        const itemSelected = _.cloneDeep(forSellLandSelected).filter(l => l.itemChecked);
        // console.log('forSellLandSelected', itemSelected)
        if (itemSelected.length === 0) {
            addPopup({name: 'NoSelectedToModified'})
        } else {
            const checkPriceItemSelected = itemSelected.filter(l => l.sellPrice <= 0);
            // console.log('checkPriceItemSelected', checkPriceItemSelected)
            if (checkPriceItemSelected.length !== 0) {
                addPopup({name: "SellLandPriceAlert"})
            } else {
                const ForSellLandSelected = itemSelected.filter(l => l.sellPrice > 0 && l.itemChecked);
                addPopup({name: "SellLandConfirmAlert", data: {ForSellLandSelected}})
            }
        }
    }
}

//랜드를 선택해주세요
function mapStateToProps(state) {
    const {lands, authentication: {user}, map, settingReducer: {language}, screens} = state;
    return {
        lands,
        user,
        map,
        language,
        screens
    };
}

const mapDispatchToProps = (dispatch) => ({
    getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
    clearForSaleStatusSocket: () => dispatch(socketActions.clearForSaleStatusSocket()),
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen))
});

export default connect(mapStateToProps, mapDispatchToProps)(SellLandModify);
