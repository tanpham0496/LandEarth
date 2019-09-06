import React, {Fragment, memo, useEffect} from 'react';
import GameUI from "../veticalBarComponent";
import connect from "react-redux/es/connect/connect";
import { useSelector, useDispatch } from "react-redux";
import MiniMapComponent from "../miniMapComponent/miniMap"
import MiniMapComponentNewVersionUi from "../miniMapComponentNewVersionUi/miniMap"
import LandMap from "../landMapComponent/LandMap";
import GameMap from "../gameMapComponent/GameMap";
import {landActions} from "../../../../store/actions/landActions/landActions";
import {shopsActions} from "../../../../store/actions/gameActions/shopsActions";
import Functions from "../horizontalBarComponent";
import SearchBar from "../horizontalBarComponent/component/SearchBar";
import Notice from "../noticeComponent"
import BloodExchangeTrade from "../horizontalBarComponent/component/BloodExchangeTrade";
import InfoCurrentZoom from "../horizontalBarComponent/component/InfoCurrenZoom";
import { newVersionUI, settingLandInfo } from "../../../../helpers/config";
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

const MultipleMap = memo((props) => {

    const {gameMode, mapExpanding, checkDisplay, onHandleGetShop, lands, getAllLandMarkCategoryInMap, screens} = props;
    const { todayLandInfo, landsPerCellInfo } = useSelector(state => state.settings);
    const defaultMap = {
        center: [37.566535, 126.9779692],
        zoom: 22,
        size: null,
        bounds: null,
        map: null,
    };

    useEffect(() => {
        if(props.user && props.user._id) props.getAllLandCategoryNew({userId: props.user._id});
        onHandleGetShop();
        getAllLandMarkCategoryInMap();
    },[]);
    return (
        <div className='map-container'>
            {/*check right click notice and function GameUi*/}
            <div onContextMenu={newVersionUI ? (() => props.removePopup({name : 'ContextMenu'})) : ''}>

                {newVersionUI ? <MiniMapComponentNewVersionUi/> : <MiniMapComponent/>}
                { ((settingLandInfo && todayLandInfo) || !settingLandInfo) && <BloodExchangeTrade defaultPrice={lands.defaultLandPrice}/>}

                <Notice />
                {checkDisplay && <Fragment>
                    <GameUI gameMode={gameMode}/>
                    <div className={`game-tools ${mapExpanding ? 'minimap-expanding' : ''}`} /*onContextMenu={() => props.removePopup({name : 'ContextMenu'})} */>
                        <SearchBar/>
                        <Functions/>
                    </div>
                </Fragment>}
                { (settingLandInfo && landsPerCellInfo) && <InfoCurrentZoom/>}
            </div>
            <div className='mainMap' id='mainMap'>
                { gameMode ? <GameMap dataMap={defaultMap} /> : <LandMap dataMap={defaultMap} /> }
                { newVersionUI ? screens["ContextMenu"] && <ContextMenu />  : '' }
                { newVersionUI ? <LandMapRightClick />  : '' }
            </div>
            {newVersionUI && screens["showTotalBlood"] && <DetailSelectedLand {...screens["showTotalBlood"]}/> }
            {/*Purchase Land*/}
            { screens['NoLandSelectedAlert'] && <NoLandSelectedAlert /> }
            { screens['TooManySelectedLandAlert'] && <TooManySelectedLandAlert /> }
            { screens["BuyLandSuccessAlert"] && <BuyLandSuccessAlert {...screens["BuyLandSuccessAlert"]} /> }
            { screens["ErrorBuyLandAlert"] && <ErrorBuyLandAlert /> }
            { screens["ErrorOver500LandsInCategory"] && <ErrorOver500LandsInCategory /> }
        </div>
    )
});


export default connect(
    state => {
        const {map, lands, settings, settingReducer: {gameMode, mapExpanding},screens, authentication: {user},lands: {categoryList}} = state;
        return {
            map,
            lands,
            settings,
            gameMode,
            mapExpanding,
            screens,
            user,
            categoryList
        };
    },
    dispatch => ({
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        getAllLandMarkCategoryInMap: () => dispatch(landActions.getAllLandMarkCategoryInMap()),
        onHandleGetShop: () => dispatch(shopsActions.getShop()),
        getAllLandCategoryNew: (param) => dispatch(landActions.getAllLandCategoryNew(param)),
        dispatch,
    })
)(MultipleMap);
