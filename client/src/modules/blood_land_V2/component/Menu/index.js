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

const MenuComponent = () => {
    const dispatch = useDispatch();
    const {screens} = useSelector(state => state);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [toolTipValue, setToolTipValue] = useState();
    const [isToolTipOpen, setIsToolTipOpen] = useState(false);
    const [menuTabOpen , setMenuTabOpen] = useState()

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
        setToolTipValue(item.name);
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
                if(screens['friendList'] || screens['addFriend'] || screens['blockFriend'] || screens['receiveMail'] || screens['readMail'] || screens['sendMail'] ){
                    dispatch(screenActions.removePopup({names: ['friendList' , 'addFriend', 'blockFriend', 'receiveMail' , 'readMail' , 'sendMail']}))
                }else{
                    dispatch(screenActions.removePopup({name}));
                }
            } else {
                dispatch(screenActions.addPopup({name , close: menuTabOpen }));
                dispatch(screenActions.removePopup({names: ['friendList' , 'addFriend' , 'blockFriend' ,  'receiveMail' , 'readMail' , 'sendMail']}));
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
        menuIconRender, toolTipValue, isToolTipOpen
    };
    const menuButtonContainerClass = classNames({
        'menu-button-container ': true,
        'disabled': !isMenuOpen,
        'active': isMenuOpen
    });
    return (
        <Fragment>
            <div className={menuButtonContainerClass} onClick={(e) => onHandleOpenMenu(e)}>
                <img alt='menu' src={loadingImage('/images/bloodLandNew/menu.png')}/>
            </div>
            <div className='menu-wrapper'>
                {/*Render for menu Icon*/}
                <MenuIconListComponent {...MenuIconListComponentProps}/>
                {/*render Menu Tab*/}
                {screens[menuTabOpen]  && <MenuIconTabListComponent/>}
                {/*render menu Detail*/}
                <MenuDetailComponent/>
            </div>
            {/*show popup Game*/}
            {screens['game'] && <PopupGame />}
        </Fragment>
    )
};
export default MenuComponent
