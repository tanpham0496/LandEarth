import React, {useState, Fragment} from 'react'
import _ from 'lodash'
import {loadingImage} from "../../../blood_land/components/general/System";
import MenuIconListComponent from "./MenuIconList";
import MenuIconTabListComponent from "./MenuIconTabList";
import {useDispatch, useSelector} from "react-redux";
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import classNames from 'classnames';
import MenuDetailComponent from "./MenuDetail";
import {MenuList} from "./data"
import PopupGame from "../Game/PopupGame";
import SettingComponent from "../Setting";
import {
    mapActions,
} from '../../../../helpers/importModule';

import {
    MAX_LEVEL,
    DEFAULT_LEVEL_MAPBOX_OFFSET,
    MIN_ZOOM_MAPBOX,
    MAX_ZOOM_MAPBOX
} from '../../../../helpers/constants';

const MenuComponent = () => {
    const dispatch = useDispatch();
    const {screens, maps} = useSelector(state => state);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [toolTipValue, setToolTipValue] = useState();
    const [isToolTipOpen, setIsToolTipOpen] = useState(false);

    const [menuTabOpen , setMenuTabOpen] = useState();
    const [isShowFloor, setIsShowFloor] = useState(false);

    const range = MAX_LEVEL - (maps.zoom + DEFAULT_LEVEL_MAPBOX_OFFSET);
    const onHandleOpenMenu = _.debounce((e) => {
        e.persist();
        let menuIcon = document.getElementsByClassName("menu-icon");
        MenuList.map((item, index) => {
            menuIcon[index].classList.remove(isMenuOpen ? 'fadeIn' : 'fadeOut');
            menuIcon[index].className += isMenuOpen ? ' fadeOut' : ' fadeIn';
            menuIcon[index].style.animationDelay = `${isMenuOpen ? item.timeDelayClose : item.timeDelayOpen}s`;
            setTimeout(() => {
                menuIcon[index].style.display = isMenuOpen ? 'none' : 'flex';
            }, isMenuOpen ? 1000 : 50)
        });
        setIsToolTipOpen(!isMenuOpen);
        setIsMenuOpen(!isMenuOpen);
        dispatch(screenActions.removePopup({name:menuTabOpen}))
    }, 500);

    const onMenuIconHover = _.debounce((item) => {
        setToolTipValue(item.tooltip);
        setIsToolTipOpen(true)
    }, 200);


    //Render for icon , icon child in menu tab icon
    const menuIconRender = (type) => {
        return MenuList.filter(m => m.type === type).map((item, index) => {
            let menuIconClass = classNames({
                'menu-icon': true,
                'fadeIn': isMenuOpen,
                'fadeOut': !isMenuOpen,
                'fadeIn active': screens[item.name]
            });
            return (
                <div className={menuIconClass} key={index} onMouseEnter={() => onMenuIconHover(item)}
                     onMouseLeave={() => setIsToolTipOpen(false)}
                     onClick={(e) => onHandleClickMenuIcon(e, item)}>
                    <img alt={item.name} src={loadingImage(item.imageUrl)}/>
                </div>
            )
        })
    };
    const onHandleClickMenuIcon = _.debounce((e, item) => {
        e.persist();
        const {type, name} = item;
        if (type === 'left') {
            if (screens[name]) {
                if(screens['friendList'] || screens['addFriend'] || screens['blockFriend'] || screens['receiveMail'] || screens['readMail'] || screens['sendMail']
                    || screens['Reserve'] || screens['LandForSale'] || screens['RegisteredLand']){
                    dispatch(screenActions.removePopup({names: ['friendList' , 'addFriend', 'blockFriend', 'receiveMail' , 'readMail' , 'sendMail', 'Reserve', 'LandForSale', 'RegisteredLand']}))
                }else{
                    dispatch(screenActions.removePopup({name}));
                }
            } else {
                dispatch(screenActions.addPopup({name , close: menuTabOpen }));
                dispatch(screenActions.removePopup({names: ['friendList' , 'addFriend' , 'blockFriend' ,  'receiveMail' , 'readMail' , 'sendMail', 'Reserve', 'LandForSale', 'RegisteredLand']}));
                setMenuTabOpen(name)
            }
        }
        if (type === 'right') {
            if(screens[name]) {
                dispatch(screenActions.removePopup({name}));
            }
            else {
                dispatch(screenActions.addPopup({name , close: menuTabOpen }));
                setMenuTabOpen(name)
            }
        }
    }, 200);

    const MenuIconListComponentProps = {
        menuIconRender, toolTipValue, isToolTipOpen,isMenuOpen
    };
    const menuButtonContainerClass = classNames({
        'menu-button-container ': true,
        'disabled': !isMenuOpen,
        'active': isMenuOpen
    });

    const _onClickZoomOut = (type) => {
        // console.log("_onClick");
        // console.log('maps.zoom', maps.zoom);
        // console.log('newZoom', maps.zoom+1);
        if(maps.zoom < MAX_ZOOM_MAPBOX){
            dispatch(mapActions.syncMap({ zoom: maps.zoom+1 }));
        }
    }

    const _onClickZoomIn = (type) => {
        // console.log("zoomIn");
        // console.log('maps.zoom', maps.zoom);
        // console.log('newZoom', maps.zoom-1);
        // console.log("maps.zoom <= MIN_ZOOM_MAPBOX", maps.zoom <= MIN_ZOOM_MAPBOX);
        if(maps.zoom > MIN_ZOOM_MAPBOX){
            dispatch(mapActions.syncMap({ zoom: maps.zoom-1 }));
        }
    }

    return (
        <Fragment>
            <div className={menuButtonContainerClass} onClick={(e) => onHandleOpenMenu(e)}>
                <img alt='menu' src={loadingImage('/images/bloodLandNew/menu.png')}/>
            </div>
            {/*<div className={`${isMenuOpen ? 'menu-wrapper' : ''}`}>*/}
            <div className={'menu-wrapper'}>
                {/*Render for menu Icon*/}
                <MenuIconListComponent {...MenuIconListComponentProps}/>
                {/*render Menu Tab*/}
                {screens[menuTabOpen]  && <MenuIconTabListComponent/>}
                {/*render menu Detail*/}
                <MenuDetailComponent/>
            </div>
            {/*show popup Game*/}
            {screens['game'] && <PopupGame />}
            {/*Setting popup*/}
            {screens['setting'] &&  <SettingComponent/> }
            
            <div className={'floor-Zoom-container'} onClick={()=>setIsShowFloor(!isShowFloor)}>
                <div className={'floor-Zoom'}> X1 </div>
                {  isShowFloor &&
                <div className={'content'}> <span style={{color : '#6EF488'}}> 1 Cell </span> / <span>{4**range}</span></div>
                }
            </div>
            <div className={'zoomBtn'}>
                <div className={'zoomOut'} onClick={() => _onClickZoomOut()}> + </div>
                <div className={'line-height-zoom'} />
                <div className={'zoomIn'} onClick={() => _onClickZoomIn()}> - </div>
            </div>
        </Fragment>
    )
};
export default MenuComponent
