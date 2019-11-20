import React, { useState, useEffect, Fragment } from 'react'
import { loadingImage } from "../../../blood_land/components/general/System";
import { useDispatch, useSelector } from 'react-redux';
import { screenActions } from '../../../../store/actions/commonActions/screenActions';
import { mapActions } from '../../../../store/actions/commonActions/mapActions';
import { MenuListLeftMap } from './ListData'
import _ from 'lodash'
import classNames from "classnames";

function MenuFunction(props) {

    const dispatch = useDispatch();
    const { screens, maps, lands } = useSelector(state => state);
    const [activeMode, setActiveMode] = useState(0);
    const [hoverIcon, setHoverIcon] = useState(false);
    const [toggleFunction, setToggleFunction] = useState(true);
    const [toggleChoose64, setToggleChoose64] = useState(false);
    const [openSpecialLand, setOpenSpecialLand] = useState(false);

    const [stateUrlImage, setStateUrlImage] = useState('/images/bloodLandNew/func/icon-region-1.png');
    const [stateUrlImageHover, setStateUrlImageHover] = useState('/images/bloodLandNew/func/icon-region-hover-1.png');

    const [stateImageThreeMode, setStateImageThreeMode] = useState('/images/bloodLandNew/func/icon-land-mode.png');
    const [toggleThreeMode, setToggleThreeMode] = useState(false);

    const onHandleEachFunction1 = (idx, tab, mode) => {
        setActiveMode(idx);
        dispatch(mapActions.selectMode(mode));
    };
    const onHandleEachFunction2 = (type, tab) => {
        if (type === 'choose64') {
            setToggleChoose64(!toggleChoose64)
        } else if (type === 'Advertisement') {
            dispatch(screenActions.addPopup({ name: 'Advertisement' }));
            dispatch(screenActions.removePopup({ name: 'selectLand' }));
            dispatch(mapActions.setLandMode(false));
        } else if (type === 'selectLand') {
            dispatch(screenActions.addPopup({ name: 'selectLand' }));
            dispatch(screenActions.removePopup({ name: 'Advertisement' }));
            dispatch(mapActions.setLandMode(true));
        } else if (type === 'SPECIAL-LAND') {
            //console.log("kjsdfksdkfj")
            setOpenSpecialLand(!openSpecialLand);
            if(openSpecialLand) {
                dispatch(screenActions.removePopup({ name: `${type}` }))
            }
            else dispatch(screenActions.addPopup({ name: `${type}` }))

        }else if (type === 'ThreeMode') {
            setToggleThreeMode(!toggleThreeMode);
            if(toggleThreeMode) {
                dispatch(screenActions.removePopup({ name: `${type}` }))
            }
            else dispatch(screenActions.addPopup({ name: `${type}` }))

        }else {
            dispatch(screenActions.addPopup({ name: `${type}` }))
        }
    };
    const _clickSelectFloor = (hintMode) => {
        //console.log("hintMode", hintMode);
        setStateUrlImage(`/images/bloodLandNew/func/icon-region-${hintMode}.png`);
        setStateUrlImageHover(`/images/bloodLandNew/func/icon-region-hover-${hintMode}.png`);
        setToggleChoose64(false);
        dispatch(mapActions.setHintMode({ hintMode }));
    };
    const onClickThreeMode = (imageUrl, index) => {
        setStateImageThreeMode(imageUrl);
        setToggleThreeMode(false);
    }

    const _onClickLandSpecial = (landSpecialName) => {
        //tab
        const landSpecial = lands.landSpecials.find(spLand => spLand.name === landSpecialName);
        
        if(landSpecial){
            console.log("landSpecial", landSpecial);
            // dispatch(mapActions.setPauseDrawTile(true));
            dispatch(mapActions.syncMap({ center: landSpecial.center, zoom: 7 }));
        }
    }

    const onHandleToggleFunction = _.debounce((e) => {
        let menuIcon = document.getElementsByClassName("icon-child-left");

        MenuListLeftMap.map((item, index) => {
            menuIcon[index].classList.remove(toggleFunction ? 'fadeIn' : 'fadeOut');
            menuIcon[index].className += toggleFunction ? ' fadeOut' : ' fadeIn';
            menuIcon[index].style.animationDelay = `${toggleFunction ? item.timeDelayClose : item.timeDelayOpen}s`;
            setTimeout(() => {
                menuIcon[index].style.display = toggleFunction ? 'none' : 'flex';
            }, toggleFunction ? 1000 : 50)
        });
        setToggleChoose64(false);
        setOpenSpecialLand(false);
        setToggleThreeMode(false);
        setToggleFunction(!toggleFunction)
    }, 500);

    return (
        <Fragment>
            <div className={'menu-icon-container-left'}>
                <div className={`${toggleFunction ? 'icon--toggle-function active' : 'icon--toggle-function'}`} onClick={onHandleToggleFunction}  >
                    <img alt={''} src={loadingImage(`/images/bloodLandNew/func/icon-function-close.png`)}/>
                </div>
                {MenuListLeftMap.slice(0,2).map((value,idx) => {
                    const {tab, imageUrl ,name,mode} = value;
                    let menuIconClass = classNames({
                        'icon-child-left': true,
                        'fadeIn': toggleFunction,
                        'fadeOut': !toggleFunction,
                        'fadeIn active': activeMode === idx
                    });
                    return (
                        <div className={`${menuIconClass}`} key={idx} onClick={()=> onHandleEachFunction1(idx,tab,mode)}  >
                            <img alt={name} src={loadingImage(`${imageUrl}`)}/>
                        </div>
                    )
                })}
                {MenuListLeftMap.slice(2,3).map((value,idx) => {
                    let menuIconClass = classNames({
                        'icon-child-left': true,
                        'fadeIn': toggleFunction,
                        'fadeOut': !toggleFunction,
                    });
                    return (
                        <div key={idx} className={menuIconClass}  onMouseLeave={()=>setHoverIcon(false)} onMouseEnter={()=>setHoverIcon(`${value.mode}`)} onClick={()=> dispatch({type : 'CLEAR_SELECTED'})}>
                            <img  src={loadingImage(`${hoverIcon === value.mode ? value.imageUrlHover : value.imageUrl}`)}/>
                        </div>
                    )
                })}
                {MenuListLeftMap.slice(4,5).map((value,idx) => {
                    let menuIconClass = classNames({
                        'icon-child-left': true,
                        'fadeIn': toggleFunction,
                        'fadeOut': !toggleFunction,
                        'fadeIn active': toggleChoose64
                    });
                    let choose64 = classNames({
                        'choose64': true,
                        'active': toggleChoose64
                    });
                    return (
                        <div className={ choose64 } key={idx}>
                            <div className={menuIconClass}  onClick={()=>onHandleEachFunction2(`${value.mode}`)} onMouseLeave={()=>setHoverIcon(false)} onMouseEnter={()=>setHoverIcon(`${value.mode}`)} >
                                <img alt={value.name}  src={loadingImage(`${(hoverIcon === value.mode || toggleChoose64) ? stateUrlImageHover  : stateUrlImage}`)}/>
                                <img alt={'image-raffle'} className={'image-raffle'} src={loadingImage(`${value.imageRaffle}`)}/>
                            </div>
                            {toggleChoose64 && <div className={'choose'}>
                                {/*{ ZOOM_FLOORS.map(zoom => (<div className={'choose-one'} onClick={_clickSelectFloor} >{ zoom }</div>)) } */}
                                {value.childrenTab.map((value,ind)=> {
                                    return(
                                        <div key={ind} className={'choose-one'} onClick={() => _clickSelectFloor(value.nameChild)}>
                                            {value.nameChild}
                                        </div>
                                    )
                                })}
                            </div>}
                        </div>
                    )
                }) }
                {MenuListLeftMap.slice(3,4).map((value,idx) => {
                    const {tab, imageUrl, name, type, imageUrlHover} = value;
                    let menuIconClass = classNames({
                        'icon-child-left': true,
                        'fadeIn': toggleFunction,
                        'fadeOut': !toggleFunction,
                        'fadeIn active': screens && screens[`${type}`]
                    });
                    return (
                        <div className={menuIconClass}  key={idx}  onClick={()=>onHandleEachFunction2(type,tab)} onMouseLeave={()=>setHoverIcon(false)} onMouseEnter={()=>setHoverIcon(tab)} >
                            <img alt={name} src={loadingImage(`${(hoverIcon === tab|| (screens && screens[`${type}`])) ? imageUrlHover : imageUrl}`)}/>
                        </div>
                    )
                }) }
                {MenuListLeftMap.slice(5,6).map((value,idx)=> {
                    let menuIconClass = classNames({
                        'icon-child-left': true,
                        'fadeIn': toggleFunction,
                        'fadeOut': !toggleFunction,
                        'fadeIn active': openSpecialLand
                    });
                    let SpecialLand = classNames({
                        'SpecialLand': true,
                        'active': openSpecialLand
                    });
                    const {tab, imageUrl, name, type, imageUrlHover,imageRaffle,childrenTab} = value;
                    return(
                        <div className={SpecialLand} key={idx} onClick={()=>onHandleEachFunction2(type,tab)} onMouseLeave={()=>setHoverIcon(false)} onMouseEnter={()=>setHoverIcon(tab)}>
                            <div className={menuIconClass}>
                                <img alt={name} src={loadingImage(`${(hoverIcon === tab|| (screens && screens[`${type}`])) ? imageUrlHover : imageUrl}`)}/>
                                <img alt={'image-raffle'} className={'image-raffle'} src={loadingImage(`${imageRaffle}`)}/>
                            </div>
                            {openSpecialLand && <div className={'list-choose-special-land'}>
                                {childrenTab.map((value,ind)=> {
                                return(
                                    <div className={'name-child-special'} key={ind} onClick={() => _onClickLandSpecial(value.nameChild)}>
                                        <img alt={value.nameChild} src={loadingImage(`${value.imageUrl}`)}/>
                                    </div>
                                )
                            })}
                            </div>}
                        </div>
                    )
                })}
                {MenuListLeftMap.slice(6,7).map((value,idx) => {
                    const {tab, name, type,imageRaffle,childrenTab,imageUrlMode} = value;
                    let menuIconClass = classNames({
                        'icon-child-left': true,
                        'fadeIn': toggleFunction,
                        'fadeOut': !toggleFunction,
                        'fadeIn active': toggleThreeMode
                    });
                    let SpecialLand = classNames({
                        'ThreeMode': true,
                        'active': toggleThreeMode
                    });
                    return(
                        <div className={SpecialLand} key={idx} >
                            <div className={menuIconClass} onClick={()=>onHandleEachFunction2(type,tab)}>
                                <img alt={name} className={'mode'} src={loadingImage(`${imageUrlMode}`)}/>
                                <img alt={name} src={loadingImage(`${stateImageThreeMode}`)}/>
                                <img alt={'image-raffle'} className={'image-raffle'} src={loadingImage(`${imageRaffle}`)}/>
                            </div>
                            {toggleThreeMode && <div className={'list-choose-special-land'}>
                                {childrenTab.map((value,ind)=> {
                                    return(
                                        <div className={'name-child-special'} key={ind} onClick={() => onClickThreeMode(value.imageUrl, ind)}>
                                            <img alt={value.nameChild} src={loadingImage(`${value.imageUrl}`)}/>
                                        </div>
                                    )
                                })}
                            </div>}
                        </div>
                    )
                }) }
                </div>

        </Fragment>
    )
};
export default MenuFunction;