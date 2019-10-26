import React, {Fragment, memo, useEffect, lazy, Suspense} from 'react';
import GameUI from "../veticalBarComponent";
import connect from "react-redux/es/connect/connect";
import {useSelector, useDispatch} from "react-redux";
import MiniMapComponent from "../miniMapComponent/miniMap"
import MiniMapComponentNewVersionUi from "../miniMapComponentNewVersionUi/miniMap"
import LandMap from "../landMapComponent/LandMap";
import GameMap from "../gameMapComponent/GameMap";
import {landActions} from "../../../../store/actions/landActions/landActions";
import {shopsActions} from "../../../../store/actions/gameActions/shopsActions";
import Functions from "../horizontalBarComponent";
// import SearchBar from "../horizontalBarComponent/component/SearchBar";
import Notice from "../noticeComponent"
import BloodExchangeTrade from "../horizontalBarComponent/component/BloodExchangeTrade";
import InfoCurrentZoom from "../horizontalBarComponent/component/InfoCurrenZoom";
import {newVersionUI, settingLandInfo, notification, mapBox} from "../../../../helpers/config";
import ContextMenu from "../landMapComponent/component/ContextMenu";
import {screenActions} from "../../../../helpers/importModule";
import LandMapRightClick from "../landMapComponent/component/LandMapRightClick"
import DetailSelectedLand from "../horizontalBarComponent/component/DetailSelectedLand"
//purschase land
import BuyLandSuccessAlert from '../gameUIComponent/LandTrading/component/Popups/BuyLandSuccessAlert';
import ErrorBuyLandAlert from '../gameUIComponent/LandTrading/component/Popups/ErrorBuyLandAlert';
import NoLandSelectedAlert from '../gameUIComponent/LandTrading/component/Popups/NoLandSelectedAlert';
import TooManySelectedLandAlert from '../gameUIComponent/LandTrading/component/Popups/TooManySelectedLandAlert';
import ErrorOver500LandsInCategory from '../gameUIComponent/LandTrading/component/Popups/ErrorOver500LandsInCategory';
//SellLand
import NoSelectedAlert from '../common/Popups/commomPopups/NoSelectedAlert';
import EmptyCategoryAlert from '../common/Popups/commomPopups/EmptyCategoryAlert';
import NoLandCanSaleAlert from '../common/Popups/commomPopups/NoLandCanSaleAlert';


import {notificationAction} from "../../../../store/actions/commonActions/notifyActions";
import {developmentalAction} from "../../../../store/actions/commonActions/developActions";

import SearchBar from "../horizontalBarComponent/component/SearchBar";
//import LandMapBox from "../../components/mapBoxComponent/LandMapBox";

const MultipleMap = memo((props) => {

    const {gameMode, mapExpanding, checkDisplay, onHandleGetShop, lands, getAllLandMarkCategoryInMap, screens, getNotification, getDevelopment, lands: {loadingLandAction}} = props;
    const {todayLandInfo, landsPerCellInfo} = useSelector(state => state.settings);
    const defaultMap = {
        center: [37.566535, 126.9779692],
        zoom: 22,
        size: null,
        bounds: null,
        map: null,
    };

    useEffect(() => {

        if (props.user && props.user._id) {
            props.getAllLandCategoryNew({userId: props.user._id});
            notification && getNotification(props.user._id);
            notification && getDevelopment(props.user._id);
        }
        onHandleGetShop();
        getAllLandMarkCategoryInMap();

    }, []);

    return (
        <div className='map-container'>
            {/*check right click notice and function GameUi*/}
{/*            <div onContextMenu={newVersionUI ? (() => props.removePopup({name: 'ContextMenu'})) : ''}>

                {!loadingLandAction && newVersionUI ? <MiniMapComponentNewVersionUi/> : !loadingLandAction &&
                    <MiniMapComponent/>}
                {((settingLandInfo && todayLandInfo) || !settingLandInfo) &&
                <BloodExchangeTrade defaultPrice={lands.defaultLandPrice}/>}

                <Notice/>
                {checkDisplay && <Fragment>
                    <GameUI gameMode={gameMode}/>
                    <div
                        className={`game-tools ${mapExpanding ? 'minimap-expanding' : ''}`}>
                        <SearchBar/>
                        <Functions/>
                    </div>
                </Fragment>}
                {(settingLandInfo && landsPerCellInfo) && <InfoCurrentZoom/>}
            </div>*/}
            <div className='mainMap' id='mainMap'>
                {/*gameMode && !mapBox ? <GameMap dataMap={defaultMap}/> : <LandMap dataMap={defaultMap}/>*/}
                {newVersionUI ? screens["ContextMenu"] && <ContextMenu/> : ''}
                {newVersionUI ? <LandMapRightClick/> : ''}
            </div>
{/*            {newVersionUI && !gameMode && screens["showTotalBlood"] &&
            <DetailSelectedLand {...screens["showTotalBlood"]}/>}
       
            {screens['NoLandSelectedAlert'] && <NoLandSelectedAlert/>}
            {screens['TooManySelectedLandAlert'] && <TooManySelectedLandAlert/>}
            {screens["BuyLandSuccessAlert"] && <BuyLandSuccessAlert {...screens["BuyLandSuccessAlert"]} />}
            {screens["ErrorBuyLandAlert"] && <ErrorBuyLandAlert/>}
            {screens["ErrorOver500LandsInCategory"] && <ErrorOver500Lanotice-final-containerndsInCategory/>}
            
            {screens['NoSelectedAlert'] && <NoSelectedAlert/>}
            {screens['EmptyCategoryAlert'] && <EmptyCategoryAlert/>}
            {screens['NoLandCanSaleAlert'] && <NoLandCanSaleAlert/>}*/}

        </div>
    )
});


export default connect(
    state => {
        const {map, lands, settings, settingReducer: {gameMode, mapExpanding}, screens, authentication: {user}, lands: {categoryList}, socket} = state;
        return {
            map,
            lands,
            settings,
            gameMode,
            mapExpanding,
            screens,
            user,
            categoryList,
            socket
        };
    },
    dispatch => ({
        //
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        getAllLandMarkCategoryInMap: () => dispatch(landActions.getAllLandMarkCategoryInMap()),
        onHandleGetShop: () => dispatch(shopsActions.getShop()),
        getAllLandCategoryNew: (param) => dispatch(landActions.getAllLandCategoryNew(param)),
        getNotification: (id) => dispatch(notificationAction.getById(id)),
        getDevelopment: (id) => dispatch(developmentalAction.getById(id)),
        dispatch,
    })
)(MultipleMap);
