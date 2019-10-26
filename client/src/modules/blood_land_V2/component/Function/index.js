import React, {useState, useEffect, Fragment} from 'react'
import {loadingImage} from "../../../blood_land/components/general/System";
import {useDispatch, useSelector} from 'react-redux';
import {screenActions} from '../../../../store/actions/commonActions/screenActions';
import { SELECT_MODE} from '../../../../store/actions/commonActions/mapActions';
import {MenuListLeftMap1, MenuListLeftMap2,MenuListLeftMap3} from './ListData'

function MenuFunction(props){
    const [activeMode, setActiveMode] = useState(0);
    const [hoverIcon, setHoverIcon] = useState(false);
    const [hoverIcon64, setHoverIcon64] = useState(false);
    const [toggleFunction, setToggleFunction] = useState(true);
    const [toggleChoose64, setToggleChoose64] = useState(false);

    const dispatch = useDispatch();
    const {screens } = useSelector(state => state);

    const onHandleEachFunction1 = (idx, tab , mode) => {
        setActiveMode(idx);
        dispatch({type : 'SELECT_MODE', mode });
    };
    const onHandleEachFunction2 = (type,tab) => {
        if(type=== 'choose64') {
            setToggleChoose64(!toggleChoose64)
        }
        else if(type=== 'Advertisement')  {   
            dispatch(screenActions.addPopup({name : 'Advertisement'}));
            dispatch(screenActions.removePopup({name : 'selectLand'}));
            dispatch({type : 'LAND_MODE', mode: false });
        }
        else if(type=== 'selectLand') {
            dispatch(screenActions.addPopup({name : 'selectLand'})) ;
            dispatch(screenActions.removePopup({name : 'Advertisement'}));
            dispatch({type : 'LAND_MODE', mode: true });
        }
        else{
            dispatch(screenActions.addPopup({name : `${type}`}))
        }
    };
    return (
        <Fragment>
            <div className={'menu-icon-container-left'}>
                <div className={`icon--toggle-function`} onClick={()=> setToggleFunction(!toggleFunction)}  >
                    <img alt={''} src={loadingImage( `${toggleFunction ? `/images/bloodLandNew/func/icon-function-open.png` : `/images/bloodLandNew/func/icon-function-close.png` }`)}/>
                </div>
                {toggleFunction &&  <Fragment>
                    {/*Select singleMode and multipleMode*/}
                    {MenuListLeftMap1.map((value,idx) => {
                        const {tab, imageUrl ,name,mode} = value;
                        const activeClass = activeMode === idx ? 'activeClass icon-child-left' : 'icon-child-left';
                        return (
                            <div className={`${activeClass}`} key={idx} onClick={()=> onHandleEachFunction1(idx,tab,mode)}  >
                                <img alt={name} src={loadingImage(`${imageUrl}`)}/>
                            </div>
                        )
                    })}
                    <div className={'icon-child-left'}  onMouseLeave={()=>setHoverIcon(false)} onMouseEnter={()=>setHoverIcon('Clear')} onClick={()=> dispatch({type : 'CLEAR_SELECTED'})}>
                        <img  src={loadingImage(`${hoverIcon === 'Clear' ? '/images/bloodLandNew/func/Clear-Select-hover.png' : '/images/bloodLandNew/func/Clear-Select.png'}`)}/>
                    </div>
                    {/*Select announce and priceland*/}
                    {MenuListLeftMap2.map((value,idx) => {
                        const {tab, imageUrl, name, type, imageUrlHover} = value;
                        const hoverImage = hoverIcon === tab;
                        return (
                            <div className={screens && screens[`${type}`] ? 'icon-child-left active' : 'icon-child-left'}  key={idx}  onClick={()=>onHandleEachFunction2(type,tab)} onMouseLeave={()=>setHoverIcon(false)} onMouseEnter={()=>setHoverIcon(idx)} >
                                <img alt={name} src={loadingImage(`${(hoverImage || (screens && screens[`${type}`])) ? imageUrlHover : imageUrl}`)}/>
                            </div>
                        )
                    }) }
                    <div className={'choose64'}>
                        <div className={ `${toggleChoose64 ? 'icon-child-left active' : 'icon-child-left' }`}  onClick={()=>onHandleEachFunction2('choose64')} onMouseLeave={()=>setHoverIcon64(false)} onMouseEnter={()=>setHoverIcon64(true)} >
                            <img  src={loadingImage(`${(hoverIcon64|| toggleChoose64) ? '/images/bloodLandNew/func/choose64-hover.png'  : '/images/bloodLandNew/func/choose64.png'}`)}/>
                        </div>
                        {toggleChoose64 && <div className={'choose'}>
                            <div className={'choose-one'} > 4 </div>
                            <div className={'choose-one'} > 16 </div>
                            <div className={'choose-one'} > 64 </div>
                            <div className={'choose-one'} > 256 </div>
                        </div>}
                    </div>
                    {/*Select land and advertisement*/}
                    {MenuListLeftMap3.map((value,idx) => {
                        const {tab, imageUrl, name, type, imageUrlHover} = value;
                        const hoverImage = hoverIcon === tab;
                        return (
                            <div className={screens && screens[`${type}`] ? 'icon-child-left active' : 'icon-child-left'}  key={idx}  onClick={()=>onHandleEachFunction2(type,tab)} onMouseLeave={()=>setHoverIcon(false)} onMouseEnter={()=>setHoverIcon(idx)} >
                                <img alt={name} src={loadingImage(`${(hoverImage || (screens && screens[`${type}`])) ? imageUrlHover : imageUrl}`)}/>
                            </div>
                        )
                    }) }

                </Fragment>
                }
            </div>

        </Fragment>
    )
};
export default MenuFunction;
