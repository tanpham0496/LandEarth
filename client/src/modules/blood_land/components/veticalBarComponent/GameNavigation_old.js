import React, {Component, Fragment} from 'react';
import classNames from 'classnames';
import connect from "react-redux/es/connect/connect";
import {userActions} from "../../../../store/actions/commonActions/userActions";
import alertActions from '../../../../store/actions/commonActions/alertActions';
import {settingActions} from '../../../../store/actions/commonActions/settingActions';
import {loadingImage} from "../general/System";
import TranslateLanguage from "../general/TranslateComponent";
import {notificationAction} from "../../../../store/actions/commonActions/notifyActions";
import { LazyImage } from 'react-lazy-images';
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import throttle from 'lodash.throttle'
import Shop from "./Shop";
import MessageBox from "../general/MessageBox";
import Setting from "./settingComponent/SettingScreen";
import {apiLand} from "../../../../helpers/config";

import {Modal} from 'reactstrap';

class GameNavigation extends Component {
    constructor(props) {
        super(props);
        this.handleShow = throttle(this.handleShow, 400);
        this.handleShowWithCheckingGameMode = throttle(this.handleShowWithCheckingGameMode, 400);
        this.state = {
            currentScreen: this.screen.noScreen,
            currentPopupScreen: this.screen.noScreen,
            user: null,
            logoHover: false,
        };
    }

    screen = {
        noScreen: "noScreen",
        userInfo: "userInfo",
        myland: "myland",
        wallet: "wallet",
        landTrade: "landTrade",
        characterInventory: "characterInventory",
        itemsInventory: "itemsInventory",
        giftInventory: "giftInventory",
        bitamin: 'bitamin',
    };

    popupScreen = {
        noPopup: 'noPopup',
        shop: 'shop',
        logout: 'logout',
        setting: 'setting',
    };
    componentDidMount(){
        const {user:{_id},haveNewMails} = this.props;
        haveNewMails(_id);
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.notice !== this.props.notice) {
            if (this.props.notice === 'open') {
                this.handleShow(this.screen.userInfo);
                const notice = 'pending';
                this.props.onHandleOpenNotify(notice);
            }
        }
        if (typeof this.props.alert.screen !== 'undefined' && this.props.alert.screen !== -1) {
            this.handleShowPopup(this.props.alert.screen);
            this.props.closePopup()
        }
        if (this.props.gameMode === false) {
            if (
                this.state.currentScreen === this.screen.characterInventory ||
                this.state.currentScreen === this.screen.itemsInventory ||
                this.state.currentScreen === this.screen.giftInventory
            ) {
                this.handleHide();
            }
        } else {
            if (
                this.state.currentScreen === this.screen.landTrade
            ) {
                this.handleHide();
            }
        }

    };

    getActiveTabItemClass = (screen) => {
        return classNames({
            'active': screen === this.state.currentScreen,
            'game-mode': (
                screen === this.screen.characterInventory ||
                screen === this.screen.itemsInventory ||
                screen === this.screen.giftInventory
            ) && !this.props.settingReducer.gameMode,
        });
    };

    getActiveTabItemClass2 = (screen) => {
        return classNames({
            'active': screen === this.state.currentScreen,
            'game-mode': (
                screen === this.screen.landTrade
            ) && this.props.settingReducer.gameMode,
        });
    };

    getActivePopupTabItemClass = (popup) => {
        return classNames({
            'active': popup === this.state.currentPopupScreen,
            'game-mode': (popup === this.popupScreen.shop
            ) && !this.props.settingReducer.gameMode
        });
    };

    getNavImgUrl = tabCode => {
        return {
            IMG: loadingImage(`/images/game-ui/tabs/tab${tabCode}.svg`),
            SELECTED_IMG: loadingImage(`/images/game-ui/tabs/tab${tabCode}-selected.svg`)
        }
    };

    loadingImg = (ref) => {
        return (
            <div ref={ref} className="lds-ellipsis img-loading">
                <div/>
                <div/>
                <div/>
                <div/>
            </div>
        )
    };
    handleShow = (screen) => {
        const notice = 'close';
        this.props.onHandleOpenNotify(notice)

        this.props.addPopup({ name: 'gameUIShow' });

        if (this.state.currentScreen === screen) {
            console.log('Diff', this.state.currentScreen);

            setTimeout(function () {
                this.props.addPopup({ name: 'open', data:  'noScreen' });
            }.bind(this), 0);

            setTimeout(function () {
                this.props.addPopup({ name: 'open', data: { screen } });
            }.bind(this), 0);
        } else {
            setTimeout(function () {
                this.props.removePopup({ name: 'open' });
            }.bind(this), 0);
            setTimeout(function () {
                this.props.addPopup({ name: 'open', data: { screen } });
            }.bind(this), 0);
        }
    };
    handleShowWithCheckingGameMode = (screen) => {
        if (
            screen === this.screen.myland ||
            screen === this.screen.characterInventory ||
            screen === this.screen.itemsInventory ||
            screen === this.screen.giftInventory
        ) {
            this.props.toggleGame(true);
        } else {
            this.props.toggleGame(false);
        }
        this.handleShow(screen);
    };
    handleShowPopupShop = () => {
        this.handleShowPopup(this.popupScreen.shop);
    };
    handleShowPopup = (popupScreen) => {
        //hide gametab value before popup logout or setting
        setTimeout(() => {
            this.props.addPopup({name: "hideGameTabContent"});
        }, 0);
        this.setState({
            currentPopupScreen: popupScreen,
            modal: true,
        });
        setTimeout(() => {
            this.handleHide();
        }, 200);
    };
    handleHide = () => {
        setTimeout( () => {
            this.props.removePopup({ name: 'open' });
        }, 0.000001);

        setTimeout(() => {
            this.props.removePopup({ name: 'gameUIShow' });
        }, 100);
    };
    getModalPopup = () => {
        return (
            <Fragment>
                {this.popupScreen.shop === this.state.currentPopupScreen ? this.getShopPopup() : ''}
                {this.popupScreen.logout === this.state.currentPopupScreen ? this.getLogoutAlertPopup() : ''}
                {this.popupScreen.setting === this.state.currentPopupScreen ? this.getSettingPopup() : ''}
            </Fragment>
        );
    };
    getShopPopup = () => {
        return <Shop isOpen={this.state.modal} handleShowPopup={this.handleShowPopup}
                     handleHidePopup={this.handleHidePopup} popupScreen={this.popupScreen}/>
    };
    getLogoutAlertPopup = () => {
        const {modal} = this.state;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.doLogout();
        const noBtn = () => this.handleHidePopup();
        const header = <TranslateLanguage direct={'menuTab.logOut.alert.getLogoutAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'menuTab.logOut.alert.getLogoutAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body}/>;
    };
    doLogout = () => {
        (apiLand === 'http://127.0.0.1:5001' || apiLand === 'http://127.0.0.1:5002' || apiLand === 'http://127.0.0.1:5003') ? this.props.userLogout() : this.props.userLogoutWallet();
    };

    getSettingPopup = () => {
        return (
            <Modal isOpen={this.state.modal} backdrop="static" className={`custom-modal modal--setting`}>
                <div className='custom-modal-header'>
                    <TranslateLanguage direct={'menuTab.setting'}/>
                    <span className="lnr lnr-cross lnr-custom-close" onClick={() => this.handleHidePopup()}/>
                </div>
                <div className='custom-modal-body'>
                    <Setting/>
                </div>
                {/* Ver. 0.1.1903261400 */}
                {process.env.VERSION_DATE_NOW}
                <div style={{fontSize: '10px', color: 'rgba(36,36,36,0.5)'}}>{process.env.VERSION_TIME}</div>
                <div className='custom-modal-footer'>
                    <button onClick={() => this.handleHidePopup()}>
                        <TranslateLanguage direct={'menuTab.setting.close'}/></button>
                </div>
            </Modal>
        )
    }
    handleHidePopup = () => {
        //hide popup MyLand and hideGameTabContent after logout or setting
        setTimeout(() => {
            this.props.removePopup({name: "MyLand"});
            this.props.removePopup({name: "hideGameTabContent"});
        }, 0);
        this.setState({
            currentPopupScreen: this.popupScreen.noPopup,
            currentScreen: this.screen.noScreen,
            open: false,
            modal: false
        });
    };
    getNotificationInfo = () => {
        return (
            <div className='notice-info'>
                {/*<marquee>*/}
                {/*    이것은 샘플 알림입니다. 이것은 샘플 알림입니다. 이것은 샘플 알림입니다. 이것은 샘플 알림입니다. 이것은 샘플 알림입니다. 이것은 샘플 알림입니다.*/}
                {/*</marquee>*/}
            </div>
        )
    };
    //handle remove LandSale and show GameTab which clicked.
    handleRightClickSellLand = () => {
        console.log('test')
        setTimeout(()=>{
            this.props.removePopup({name: "LandSale"})
        },0);
        setTimeout(()=>{
            this.props.addPopup({name: "GameTabScreenValueGameUi"})
        },0.1);
    }
    render() {
        const modalPopup = this.getModalPopup();
        const notice = this.getNotificationInfo();
        const {noticeToggle} = this.state;
        const {newMails,user:{_id}} = this.props;
        return (
            <Fragment >
                <div className='game-navigator' onClick={()=> this.handleRightClickSellLand()}>
                    <div className='logo-game'
                         onMouseOver={() => this.setState({logoHover: true})}
                         onMouseLeave={() => this.setState({logoHover: false})}>
                        <a target="_blank" rel="noopener noreferrer" href='https://wallet.blood.land/'>
                            {this.state.logoHover ?
                                <img src={loadingImage('/images/game-ui/wallet-logo-hover.svg')} alt=''/> :
                                <img src={loadingImage('/images/game-ui/wallet-logo.svg')} alt=''/>}
                        </a>
                    </div>

                    <ul className='game-tabs'>
                        <li className={this.getActiveTabItemClass(this.screen.userInfo)}
                            onClick={() => {
                                this.props.haveNewMails(_id);
                                this.handleShow(this.screen.userInfo);
                                console.log('userInfo')
                            }}>
                            <LazyImage src={this.getNavImgUrl(1).IMG}
                                       placeholder={({ ref }) => (
                                           this.loadingImg(ref)
                                       )}
                                       actual={({ imageProps }) => <img {...imageProps} alt="user-tab" />} />
                            {newMails && newMails.unreads > 0 && <div className='has-new'>NEW</div>}
                            <div>
                                <TranslateLanguage direct={'menuTab.user'}/>
                            </div>
                        </li>
                        <li className={this.getActiveTabItemClass(this.screen.wallet)}
                            onClick={() => this.handleShow(this.screen.wallet)}>
                            <LazyImage src={this.getNavImgUrl(3).IMG}
                                       placeholder={({ imageProps, ref }) => (
                                           this.loadingImg(ref)
                                       )}
                                       actual={({ imageProps }) => <img {...imageProps} alt="wallet-tab" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.wallet'}/>
                            </div>
                        </li>
                        <li className={this.getActiveTabItemClass(this.screen.bitamin)}
                            onClick={() => this.handleShow(this.screen.bitamin)}>

                            <LazyImage src={this.getNavImgUrl(11).IMG}
                                       placeholder={({ imageProps, ref }) => (
                                           this.loadingImg(ref)
                                       )}
                                       actual={({ imageProps }) => <img {...imageProps}  alt="bitamin-tab" />} />

                            <div>
                                <TranslateLanguage direct={'menuTab.bitamin'}/>
                            </div>
                        </li>
                        <li className={this.getActiveTabItemClass(this.screen.myland)}
                            onClick={() => this.handleShow(this.screen.myland)}>
                            <LazyImage src={this.getNavImgUrl(2).IMG}
                                       placeholder={({ imageProps, ref }) => (
                                           this.loadingImg(ref)
                                       )}
                                       actual={({ imageProps }) => <img {...imageProps}  alt="myLand-tab" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.myLand'}/>
                            </div>
                        </li>
                        <li className={this.getActiveTabItemClass2(this.screen.landTrade)}
                            onClick={() => !this.props.settingReducer.gameMode && this.handleShowWithCheckingGameMode(this.screen.landTrade)}>
                            <LazyImage src={this.getNavImgUrl(4).IMG}
                                       placeholder={({ imageProps, ref }) => (
                                           this.loadingImg(ref)
                                       )}
                                       actual={({ imageProps }) => <img {...imageProps}  alt="transaction-tab" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.transaction'}/>
                            </div>
                        </li>
                        <li className={this.getActiveTabItemClass(this.screen.characterInventory)}
                            onClick={() => this.props.settingReducer.gameMode && this.handleShowWithCheckingGameMode(this.screen.characterInventory)}>
                            <LazyImage src={this.getNavImgUrl(5).IMG}
                                       placeholder={({ imageProps, ref }) => (
                                           this.loadingImg(ref)
                                       )}
                                       actual={({ imageProps }) => <img {...imageProps} alt="characters-tab" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.characters'}/>
                            </div>
                        </li>
                        <li className={this.getActiveTabItemClass(this.screen.itemsInventory)}
                            onClick={() => this.props.settingReducer.gameMode && this.handleShowWithCheckingGameMode(this.screen.itemsInventory)}>
                            <LazyImage src={this.getNavImgUrl(6).IMG}
                                       placeholder={({ imageProps, ref }) => (
                                           this.loadingImg(ref)
                                       )}
                                       actual={({ imageProps }) => <img {...imageProps}  alt="items-tab" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.items'}/>
                            </div>
                        </li>
                        <li className={this.getActiveTabItemClass(this.screen.giftInventory)}
                            onClick={() => this.props.settingReducer.gameMode && this.handleShowWithCheckingGameMode(this.screen.giftInventory)}>
                            <LazyImage src={this.getNavImgUrl(10).IMG}
                                       placeholder={({ imageProps, ref }) => (
                                           this.loadingImg(ref)
                                       )}
                                       actual={({ imageProps }) => <img {...imageProps} alt="randomBox-tab" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.randomBox'}/>
                            </div>
                        </li>
                        <li className={this.getActivePopupTabItemClass(this.popupScreen.shop)}
                            onClick={() => this.props.settingReducer.gameMode && this.handleShowPopupShop()}>
                            <LazyImage src={this.getNavImgUrl(7).IMG}
                                       placeholder={({ imageProps, ref }) => (
                                           this.loadingImg(ref)
                                       )}
                                       actual={({ imageProps }) => <img {...imageProps} alt="shop-tab" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.shop'}/>
                            </div>
                        </li>
                    </ul>
                    <ul className='game-tabs2'>
                        <li onClick={() => this.handleShowPopup(this.popupScreen.logout)}>
                            <LazyImage src={this.getNavImgUrl(8).IMG}
                                       placeholder={({ imageProps, ref }) => (
                                           this.loadingImg(ref)
                                       )}
                                       actual={({ imageProps }) => <img {...imageProps} alt="logout-tab" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.logOut'}/>
                            </div>
                            {/* <div className="tooltip-info">
                                <TranslateLanguage direct={'menuTab.logOut'}/>
                            </div> */}
                        </li>
                        <li onClick={() => this.handleShowPopup(this.popupScreen.setting)}>
                            <LazyImage src={this.getNavImgUrl(9).IMG}
                                       placeholder={({ imageProps, ref }) => (
                                           this.loadingImg(ref)
                                       )}
                                       actual={({ imageProps }) => <img {...imageProps} alt="setting-tab" />} />
                            <div>
                                <TranslateLanguage direct={'menuTab.setting'}/>
                            </div>
                            {/* <div className="tooltip-info">
                                <TranslateLanguage direct={'menuTab.setting'}/>
                            </div> */}
                        </li>
                    </ul>
                </div>
                {modalPopup}
                {noticeToggle && notice}
            </Fragment>
        );
    }

}

function mapStateToProps(state) {
    const {settingReducer, alert, authentication: {user}, notify: {notice},users:{newMails}, settingReducer : {gameMode}} = state;
    return {
        settingReducer,
        alert,
        user,
        notice,
        newMails,
        gameMode
    };
}

const mapDispatchToProps = (dispatch) => ({

    userLogout: () => dispatch(userActions.logout()),
    haveNewMails: (userId) => dispatch(userActions.haveNewMails({userId})),
    userLogoutWallet: () => dispatch(userActions.logoutWallet()),
    closePopup: () => dispatch(alertActions.closePopup()),
    toggleGame: (mode) => dispatch(settingActions.toggleGameMode(mode)),
    onHandleOpenNotify: (notice) => dispatch(notificationAction.onOpenNotify(notice)),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
});

const connectedFunctionPage = connect(mapStateToProps, mapDispatchToProps)(GameNavigation);
export default connectedFunctionPage;
