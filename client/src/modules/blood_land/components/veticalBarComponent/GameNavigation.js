import React, {memo, useState, Fragment , useEffect} from 'react'
import {connect} from 'react-redux'
import {loadingImage} from "../general/System";
import TranslateLanguage from "../general/TranslateComponent";
import {LazyImage} from 'react-lazy-images';
import {loadingImg} from '../../components/common/Components/CommonScreen'
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import classNames from "classnames";
import LogoutAlert from "../common/Popups/NavigationPopups/LogoutAlert"
import SettingPopup from "../common/Popups/NavigationPopups/SettingPopup"
import Shop from "./Shop";
import {userActions} from "../../../../store/actions/commonActions/userActions";
//MINHTRI - 23/8/2019
const tabList = [
    {
        name: <TranslateLanguage direct={'menuTab.user'}/>,
        type: 'userInfo',
        tabCode: 1
    },
    {
        name: <TranslateLanguage direct={'menuTab.wallet'}/>,
        type: 'wallet',
        tabCode: 3
    },
    {
        name: <TranslateLanguage direct={'menuTab.bitamin'}/>,
        type: 'bitamin',
        tabCode: 11
    },
    {
        name: <TranslateLanguage direct={'menuTab.myLand'}/>,
        type: 'myland',
        tabCode: 2
    },
    {
        name: <TranslateLanguage direct={'menuTab.transaction'}/>,
        type: 'landTrade',
        tabCode: 4,
        mode: 'landMode'
    },
    {
        name: <TranslateLanguage direct={'menuTab.characters'}/>,
        type: 'characterInventory',
        tabCode: 5,
        mode: 'gameMode'
    },
    {
        name: <TranslateLanguage direct={'menuTab.items'}/>,
        type: 'itemsInventory',
        tabCode: 6,
        mode: 'gameMode'
    },
    {
        name: <TranslateLanguage direct={'menuTab.randomBox'}/>,
        type: 'giftInventory',
        tabCode: 10,
        mode: 'gameMode'
    },
    {
        name: <TranslateLanguage direct={'menuTab.shop'}/>,
        type: 'ShopTab',
        tabCode: 7,
        mode: 'gameMode',
        isTabOpen: false
    },
    {
        name: <TranslateLanguage direct={'menuTab.logOut'}/>,
        type: 'LogoutTab',
        tabCode: 8,
        isTabOpen: false
    },
    {
        name: <TranslateLanguage direct={'menuTab.setting'}/>,
        type: 'SettingTab',
        tabCode: 9,
        isTabOpen: false
    }
];

const GameNavigation = memo(props => {
    const {gameMode, screens, addPopup, removePopup , newMails} = props;

    const [logoHover, setLogoHover] = useState(false);
    const [tabHover, setTabHover] = useState(false);


    useEffect(() => {
        //right click reload open tab after sellLand
        if(!props.activeInRightClick){
            const {user:{_id},haveNewMails} = props;
            haveNewMails(_id);
        }
    },[]);


    const onHandleClick = (screen) => {
        const isGameTab = !gameMode && !tabList.some(t => t.type === screen && t.mode && t.mode === 'gameMode');
        const isLandTab = gameMode && !tabList.some(t => t.type === screen && t.mode && t.mode === 'landMode');
        const isTabOpen = tabList.some(t => t.type === screen && t.isTabOpen === false);
        removePopup({name: "MyLand"});
        if ((isGameTab || isLandTab) ) {
            if (!screens['open'] || screens['open'].screen !== screen) {
                removePopup({name: 'open'});
                if(!isTabOpen){
                    addPopup({name: 'open', data: {screen}});
                }else{
                    addPopup({name: screen});
                }
            }
        }
    };


    return (
        <Fragment>
            <div className='game-navigator'>
                <div className='logo-game' onMouseOver={() => setLogoHover(true)}
                     onMouseLeave={() => setLogoHover(false)}>
                    <a target="_blank" rel="noopener noreferrer" href='https://wallet.blood.land/'>
                        <img
                            src={loadingImage(logoHover ? '/images/game-ui/wallet-logo-hover.svg' : '/images/game-ui/wallet-logo.svg')}
                            alt=''/>
                    </a>
                </div>
                {tabList.map((item, index) => {
                    const {name, type, tabCode, mode} = item;
                    const checkTabActive = gameMode ? mode === 'landMode' : mode === 'gameMode';
                    const tabContainerClass = classNames({'tab-container': true, 'disabled': checkTabActive});
                    const landModeImage = tabCode === tabHover && !gameMode && mode !== 'gameMode';
                    const gameModeImage = tabCode === tabHover && gameMode && mode !== 'landMode';
                    return (
                        <div className={tabContainerClass} style={{marginTop: type === 'LogoutTab' && '40%'}}
                             onClick={() => onHandleClick(type)}
                             onMouseOver={() => {
                                 setTabHover(tabCode)
                             }} onMouseLeave={() => setTabHover(false)} key={index}>
                            <div className={'tab-icon'}>
                                <LazyImage
                                    src={loadingImage(`/images/game-ui/tabs/tab${tabCode}${landModeImage || gameModeImage ? '-selected' : ''}.svg`)}
                                    placeholder={({ref}) => loadingImg(ref)}
                                    actual={({imageProps}) => <img {...imageProps} alt={type}/>}/>
                                {type === 'userInfo' && newMails && newMails.unreads > 0 && <div className='has-new'>NEW</div>}
                            </div>
                            <div className='tab-name'>{name}</div>
                        </div>
                    )
                })}
            </div>
            {screens['LogoutTab'] && <LogoutAlert/>}
            {screens['SettingTab'] && <SettingPopup/>}
            {screens['ShopTab'] && <Shop isOpen={true}
                                         handleHidePopup={() => {removePopup({name: 'ShopTab' })}}/>}
        </Fragment>

    )
});

const mapStateToProps = (state) => {
    const {settingReducer: {gameMode}, screens , users:{newMails} , authentication: {user}} = state;
    return {
        gameMode, screens, newMails, user
    }
};
const mapDispatchToProps = (dispatch) => ({
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    haveNewMails: (userId) => dispatch(userActions.haveNewMails({userId})),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen))
});
export default connect(mapStateToProps, mapDispatchToProps)(GameNavigation)