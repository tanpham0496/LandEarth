import React, {useState, useEffect, Fragment} from 'react'
import {loadingImage} from "../../../blood_land/components/general/System";
import {connect} from 'react-redux';
import {screenActions} from '../../../../store/actions/commonActions/screenActions'
const MenuListLeftMap1 = [
    {
        tab : '1',
        imageUrl : '/images/bloodLandNew/func/Individual-Select.png',
        name : 'Individual-Select'
    },
    {
        tab : '2',
        imageUrl : '/images/bloodLandNew/func/Area-select.png',
        name : 'Area-select'
    }
];
const MenuListLeftMap2 = [
    {
        tab : '1',
        imageUrl : '/images/bloodLandNew/func/Clear-Select.png',
        imageUrlHover : '/images/bloodLandNew/func/Clear-Select-hover.png',
        name : 'Clear-Select',
        type : 'clear'
    },
    {
        tab : '2',
        imageUrl : '/images/bloodLandNew/func/Notify.png',
        imageUrlHover : '/images/bloodLandNew/func/Notify-hover.png',
        name : 'Notify',
        type : 'NotificationBlood'
    },
    {
        tab : '3',
        imageUrl : '/images/bloodLandNew/func/Price-Land.png',
        imageUrlHover : '/images/bloodLandNew/func/Price-Land-hover.png',
        name : 'Price-Land',
        type : ''
    },
    {
        tab : '4',
        imageUrl : '/images/bloodLandNew/func/Advertisement.png',
        imageUrlHover : '/images/bloodLandNew/func/Advertisement-hover.png',
        name : 'Advertisement',
        type : ''
    },
    {
        tab : '5',
        imageUrl : '/images/bloodLandNew/func/Shopping-mall.png',
        imageUrlHover : '/images/bloodLandNew/func/Shopping-mall-hover.png',
        name : 'Shopping-mall',
        type : ''
    },
    {
        tab : '6',
        imageUrl : '/images/bloodLandNew/func/choose64.png',
        imageUrlHover : '/images/bloodLandNew/func/choose64-hover.png',
        name : 'Shopping-mall',
        type : ''
    }
];

function MenuFunction(props){
    const [activeTab, setActiveTab] = useState(0);
    const [hoverIcon, setHoverIcon] = useState(false);
    const [toggleFunction, setToggleFunction] = useState(true);

    const onHandleEachFunction1 = (idx, tab) => {
        setActiveTab(idx);
        switch (tab) {
            case 1:
                return '';
            case 2:
                return '';
            default:
                return '';
        }
    };
    const onHandleEachFunction2 = (type) => {
        props.addPopup({name : `${type}`});
    };
    return (
        <Fragment>
            <div className={'menu-icon-container-left'}>
                <div className={`icon-child-left`} onClick={()=> setToggleFunction(!toggleFunction)}  >
                    <img alt={''} src={loadingImage(`/images/bloodLandNew/func/toggle-function-icon.png`)}/>
                </div>
                {toggleFunction &&  <Fragment>
                    {MenuListLeftMap1.map((value,idx) => {
                        const {tab, imageUrl ,name} = value;
                        const activeClass = activeTab === idx ? 'activeClass' : '';
                        return (
                            <div className={`${activeClass + ' icon-child-left' } `} key={idx} onClick={()=> onHandleEachFunction1(idx,tab)}  >
                                <img alt={name} src={loadingImage(`${imageUrl}`)}/>
                            </div>
                        )
                    })}
                    {MenuListLeftMap2.map((value,idx) => {
                        const {tab, imageUrl, name, type, imageUrlHover} = value;
                        const hoverImage = hoverIcon === idx;
                        return (
                            <div className={'icon-child-left'} key={idx}  onClick={()=>onHandleEachFunction2(type)} onMouseLeave={()=>setHoverIcon(false)} onMouseEnter={()=>setHoverIcon(idx)} >
                                <img alt={name} src={loadingImage(`${hoverImage ? imageUrlHover : imageUrl}`)}/>
                            </div>
                        )
                    }) }
                </Fragment>
                }
            </div>
        </Fragment>
    )
};
const mapStateToProps = (state) => {
    const {screens} = state;
    return {
        screens
    }
};
const mapDispatchToProps = (dispatch) => ({
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
});
export default connect(mapStateToProps,mapDispatchToProps)(MenuFunction);
