import React, {memo, Fragment, useState, useEffect} from 'react'
import {screenActions} from "../../../../../../store/actions/commonActions/screenActions";
import {connect} from 'react-redux'
import {
    TranslateLanguage,
    loadingImage,
    landActions,
    mapActions,
    QuadKeyToLatLong
} from '../../../../../../helpers/importModule';
import _ from 'lodash'
import * as f from "./commonSceen"
import {StyledCheckbox} from "../../../../../../components/customStyled/Checkbox_style";
import Tooltip from "../../../general/Tooltip";
import NoSelectedToModified from "../../../common/Popups/LandForSellPopups/NoSelectedToModified"
import NoSelectedToRemove from "../../../common/Popups/LandForSellPopups/NoSelectedToRemove"
import SellLandModify from "../../../common/Popups/LandForSellPopups/SellLandModifyPopup"
import SaleLandRemovePopup from "../../../common/Popups/LandForSellPopups/SaleLandRemovePopup"
const LandSaleButton = [
    {
        type: 'back',
        name: 'button-back',
        image: '/images/game-ui/sm-back.svg',
        translate: 'menuTab.myLand.landSold.back',
        toolTip: 'menuTab.myLand.landSold.MyLandsCounter.toolTip.removeSellLandButton'
    },
    {
        type: 'edit',
        name: 'button-edit-sale-land',
        image: '/images/game-ui/sm-change-land-price.svg',
        translate: 'menuTab.myLand.landSold.MyLandsCounter.editLandSellButton',
        toolTip: 'menuTab.myLand.landSold.MyLandsCounter.toolTip.editLandSellButton'
    },
    {
        type: 'remove',
        name: 'button-remove-sale-land',
        image: '/images/game-ui/sm-remove-land.svg',
        translate: 'menuTab.myLand.landSold.MyLandsCounter.removeSellLandButton',
        toolTip: 'menuTab.myLand.landSold.MyLandsCounter.toolTip.removeSellLandButton'
    }
];

const LandSale = memo((props) => {
    const [landForSaleList, setLandForSaleList] = useState();
    const [checkAll, setCheckAll] = useState(false);

    useEffect(() => {
        const {lands: {myLands}} = props;
        const myLandsForSaleList = _.cloneDeep(myLands).filter(l => l.forSaleStatus);
        const myLandsForSaleListUpdate = myLandsForSaleList.map(l => {
            l.checked = false;
            return l
        });
        setLandForSaleList(myLandsForSaleListUpdate)
    }, [props.lands.myLands]);


    const onHandleSelectedLand = (e) => {
        const myLandsForSaleListUpdate = _.cloneDeep(landForSaleList).map(l => {
            if(l._id === e.value._id){
                l.checked = !l.checked
            }
            return l
        });
        const isCheckAll = _.cloneDeep(myLandsForSaleListUpdate).filter(l => !l.checked).length === 0;
        setCheckAll(isCheckAll)
        setLandForSaleList(myLandsForSaleListUpdate)

    };

    const onHandleSelectedAllLand = (e) => {
        const myLandsForSaleListUpdate = _.cloneDeep(landForSaleList).map(l => {
            l.checked = e.checked;
            return l
        });
        setLandForSaleList(myLandsForSaleListUpdate);
        setCheckAll(e.checked)
    };

    const onSaleLandButtonClick = (type) => {
        const landForSaleSelected = _.cloneDeep(landForSaleList).filter(l => l.checked);
        switch (type) {
            case 'back':
                props.handleChangeScreen('default');
                break;
            case 'edit' :
                if(landForSaleSelected.length === 0){
                    props.addPopup({name: 'NoSelectedToModified'})
                }else{
                    props.addPopup({name: 'SaleLandModifiedPopup' , data: {landForSaleSelected}})
                    // console.log('landForSaleSelected', landForSaleSelected)
                }
                break;
            case 'remove':
                if(landForSaleSelected.length === 0){
                    props.addPopup({name: 'NoSelectedToRemove'})
                }else{
                    //console.log('landForSaleSelected',landForSaleSelected);
                    props.addPopup({name: 'SaleLandRemovePopup' , data: {landForSaleSelected}})
                }
                break;
            default:
                break;
        }
    };

    const onHandleClickLand = (item) => {
            const {gameMode, map} = props;
            if (map && map.zoom === 22) {
                const center = QuadKeyToLatLong(item.quadKey);
                let zoom = item.quadKey.length - 2;
                gameMode && props.saveLandSelectedPosition(item);
                props.syncCenterMap(center, zoom, item.quadKey);
            } else {

                const center = QuadKeyToLatLong(item.quadKey);
                props.syncCenterMap(center);
            }
    };
    const landForSaleListRender = () => {
        return (
            <Fragment>
                <div className='land-list-length'>
                    <TranslateLanguage direct={'menuTab.myLand.landSold.MyLandsCounter.heading'}/>
                    <div>{landForSaleList.length} <TranslateLanguage direct={'menuTab.myLand.landOwned.land'}/></div>
                </div>
                <div className='land-sale-list-container'>
                    <div className='header-grid'>
                        <div className='land-col'>
                            <TranslateLanguage direct={'menuTab.myLand.landSold.MyLandsCounter.column1Title'}/>
                        </div>
                        <div className='blood-col'>
                            <TranslateLanguage direct={'menuTab.myLand.landSold.MyLandsCounter.column2Title'}/>
                        </div>
                        <div className='select-all'>
                            <StyledCheckbox checked={checkAll} onChange={(e) => onHandleSelectedAllLand(e)}/>
                            <TranslateLanguage direct={'menuTab.myLand.landSold.MyLandsCounter.checkAllButton'}/>
                            <span > &nbsp;{landForSaleList.filter(l => l.checked).length} </span>
                        </div>
                    </div>
                    <div className='body-grid'>
                        {landForSaleList.map((land, index) => {
                            // console.log('land', land)
                            const {quadKey , name , sellPrice , checked} = land;
                            return (
                                <div key={index} className='item-row'>
                                    <div className='land-col'>
                                        <StyledCheckbox value={land} checked={checked} onChange={(e) => onHandleSelectedLand(e)}/>
                                        <span onClick={() => onHandleClickLand(land)}>
                                            {name !== '' ? name : quadKey}
                                        </span>
                                    </div>
                                    <div className='blood-col' style={{paddingTop: '5px'}}>{sellPrice}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='land-sale-button-container'>
                    {LandSaleButton.map((value , index) => {
                        const {name ,  image , translate , type , toolTip} = value;
                        return(
                            <div className={name} onClick={() => onSaleLandButtonClick(type)} key={index}>
                                <div className='image-item'>
                                    <img src={loadingImage(image)} alt='' />
                                </div>
                                <div className='item-title'>
                                    <TranslateLanguage direct={translate}/>
                                </div>
                                <Tooltip descLang={toolTip}/>
                            </div>
                        )
                    })}
                </div>
            </Fragment>
        )
    };


    const {screens} = props;
    return (
        <Fragment>
            <div className="screen-title">
                <img src={loadingImage('images/game-ui/tab2/nav2.svg')} alt=''/>
                <div>
                    <TranslateLanguage direct={'menuTab.myLand.landSold'}/>
                </div>
                {!landForSaleList ? f.loading() : landForSaleList.length === 0 ? f.getNoInfoView(onSaleLandButtonClick) : landForSaleListRender()}
                {screens['NoSelectedToModified'] && <NoSelectedToModified/>}
                {screens['NoSelectedToRemove'] && <NoSelectedToRemove/>}
                {screens['SaleLandModifiedPopup'] && <SellLandModify/>}
                {screens['SaleLandRemovePopup'] && <SaleLandRemovePopup {...screens['SaleLandRemovePopup']} />}
            </div>
        </Fragment>
    )
});

const mapStateToProps = (state) => {
    const {lands , screens , authentication: {user} , settingReducer: { gameMode} , map} = state;
    return {
        lands, screens , user , gameMode , map
    }

};
const mapDispatchToProps = (dispatch) => ({
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
    saveLandSelectedPosition: (landSelected) => dispatch(landActions.saveSelectedLandPosition(landSelected)),
    syncCenterMap: (center, zoom, centerQuadkey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey)),
});
export default connect(mapStateToProps, mapDispatchToProps)(LandSale)