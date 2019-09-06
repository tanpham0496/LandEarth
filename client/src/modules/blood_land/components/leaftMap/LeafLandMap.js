import React, { PureComponent, useState, useRef, useEffect, useReducer } from 'react'
import ReactDOMServer from "react-dom/server";
import MapBoxGLLayer from './components/MapBoxGLLayer';
import update from 'immutability-helper';
import JsxMarker from './components/JsxMarker';
import DivIcon from 'react-leaflet-div-icon';
import { LatLongToTileXY, TileXYToQuadKey, TileXYToLatLong, QuadKeyToLatLong, QuadKeyToTileXY } from "../general/System";
import { Map as LeafletMap, TileLayer, Marker, Popup, FeatureGroup } from 'react-leaflet';
import * as L from "leaflet";
import connect from "react-redux/es/connect/connect";
import uniq from "lodash.uniq";
import isNull from "lodash.isnull";
import isEqual from "lodash.isequal";
import { mapActions } from "../../../../store/actions/commonActions/mapActions";
import { landActions } from "../../../../store/actions/landActions/landActions";
import { toggleLandIcon } from "./../landMapComponent/component/asset";
import { covertDragPositionToQuadkey } from "./../gameMapComponent/component/GameMapFunction";
import {
    calculatorLand,
    removeDuplicates,
    checkInCountry,
} from '../landMapComponent/component/MapFunction';
import { getCertificateAlertPopup } from "./../landMapComponent/component/LandMapAlert";
import _ from "lodash";
import LandTileComponent from './components/LandTileComponent';
import LandCertificateComponent from './components/LandCertificateComponent';
import LandCertificateImageComponent from './components/LandCertificateImageComponent';
import ContextMenu from "./components/ContextMenu";


const LIMIT_ZOOM_SELECTED = 22;
const DEFAULT_LEVEL_OFFSET = 2;
const PARENT_1_RANGE = 4;
const PARENT_2_RANGE = 5;

function LeaftLandMap(props) {

    //====================================================================================
    let leafMap = useRef(); //map
    const [mapLoaded, setMapLoaded] = useState(false); //map load done
    const [tileUpdate, setTileUpdate] = useState(false); //allow update tile
    //map property
    const [tiles, setTiles] = useState(null);
    const [tileStart, setTileStart] = useState(null);
    const [multiSelectSave, setMultiSelectSave] = useState(null);
    //====================================================================================


    //====================================================================================
    //first load
    useEffect(() => {
        //console.log('mapLoaded', mapLoaded);
        setMapLoaded(true);
        setTileUpdate(true);
        getParticalLands();
        if(props.user && props.user._id) props.getAllLandById(props.user._id);
        const { map: { zoom } } = props;
        props.syncCenterMap(props.centerLeave, zoom);
    }, []); 

    //
    useEffect(() => {
        const newTiles = drawTiles();
        if(!isEqual(tiles, newTiles)){
            //console.log('update Tile with Lands'/*, props.lands.allLands*/);
            setTiles(newTiles);
            setTileUpdate(true);
        }
    }, [props.lands.allLands, props.map.selected, multiSelectSave]);

    //after update tiles
    useEffect(() => {
        if(tileUpdate){
            setTileUpdate(false);
        }
    }, [tileUpdate]);

    // //update after buy land 
    // useEffect(() => {
    //     console.log('props.lands.isOwn', props.lands && props.lands.isOwn);
    //     console.log('props.map.selected', props.map.selected)
    //     // receive from other 
    //     // console.log('center', center);
    //     // console.log('props.map.center', props.map.center);
    //     // if(!_.isEqual(center, props.map.center)){
    //     //     setCenter(props.map.center);
    //     // }
    // }, [props.lands.isOwn]);

    //====================================================================================



    //===========================================MAP EVENT===========================================
    const getZoomBounds = () => {
        if(!leafMap || !leafMap.current || !leafMap.current.leafletElement) return;
        const map = leafMap.current.leafletElement;
        const newZoom = map.getZoom();
        const center = map.getCenter();
        const newCenter = center ? [center.lat, center.lng] : null;
        const bounds = map.getBounds();
        const ne = bounds._northEast;
        const sw = bounds._southWest;
        const newBounds = {
            ne: { lat: ne.lat, lng: ne.lng },
            nw: { lat: ne.lat, lng: sw.lng },
            se: { lat: sw.lat, lng: ne.lng },
            sw: { lat: sw.lat, lng: sw.lng },
        };
        const level = newZoom + DEFAULT_LEVEL_OFFSET
        return { newZoom, newBounds, level, newCenter };
    };

    const onZoomstart = () => {
        setTiles(null); //set tile selected = null
    }

    const onMoveEnd = (e) => {
        const zb = getZoomBounds();
        if(zb){
            const newTiles = drawTiles();
            if(tileUpdate === false && !_.isEqual(tiles, newTiles)){
                //change
                const { newZoom, newCenter } = zb;

                //tile change
                getParticalLands();
                setTiles(newTiles);
                setTileUpdate(true);

                //reset multi select tile
                if(tileStart){
                    setTileStart(null);
                    setMultiSelectSave(null);
                }

                //sync center for minimap - set center & zoom
                props.syncCenterMap(newCenter, newZoom);
                //save last location in localStorage
                localStorage.setItem('lat', newCenter[0]);
                localStorage.setItem('lng', newCenter[1]);
            }
        }
    }

    const onZoomEnd = () => {
        const zb = getZoomBounds();
        if(zb){
            const { newZoom, newCenter } = zb;
            //setZoom(newZoom);
            props.syncCenterMap(newCenter, newZoom);
        }

        //reset multi select tile
        if(tileStart){
            setTileStart(null);
            setMultiSelectSave(null);
        }
    }
    //===========================================END MAP EVENT===========================================

    const getParticalLands = () => {
        //console.log('Call API lands');
        const { newBounds, level } = getZoomBounds();
        let beginTile = LatLongToTileXY(newBounds.ne.lat, newBounds.sw.lng, level);
        let endTile = LatLongToTileXY(newBounds.sw.lat, newBounds.ne.lng, level);

        let arrQK = [];
        for (let x = beginTile.x; x <= endTile.x; x++) {
            for (let y = beginTile.y; y <= endTile.y; y++) {
                arrQK.push(TileXYToQuadKey(x, y, level));
            }
        }

        let parents1 = uniq(arrQK.map(qk => qk.substr(0, level - PARENT_1_RANGE)));
        props.getAreaLand({ parents1, level });
    }


    const drawTiles = () => {
        if(!leafMap || !leafMap.current || !leafMap.current.leafletElement) return null;
        //const map = leafMap.current.leafletElement;
        const { newBounds, newZoom } = getZoomBounds();
        if(!newBounds || !newZoom) return null;
        const openCountries = props.lands.openCountries;
        const defaultLandPrice = props.lands.defaultLandPrice;
        const landmarks = props.lands.landmarks;
        const lands = props.lands.allLands || [];
        const selected = _.uniqBy([...(props.map.selected || []), ...(multiSelectSave || [])], 'quadKey');
        
        const level = newZoom + DEFAULT_LEVEL_OFFSET;
        const beginTile = LatLongToTileXY(newBounds.ne.lat, newBounds.sw.lng, level);
        const endTile = LatLongToTileXY(newBounds.sw.lat, newBounds.ne.lng, level);
        const centerQuadKey = props.map.centerQuadKey || null;
        const newTiles = createArrayTile({ beginTile, endTile, zoom: newZoom, level, lands, selected, openCountries, defaultLandPrice, landmarks, centerQuadKey });
        //console.log('arrayTile', arrayTile);
        return newTiles;
    }

    const createArrayTile = ({ beginTile, endTile, zoom, level, lands, selected, openCountries, defaultLandPrice, landmarks, centerQuadKey }) => {
        let arrTile = [];
        if (zoom === 22) {
            if (beginTile.x <= endTile.x) {
                for (let x = beginTile.x; x <= endTile.x; x++) {
                    for (let y = beginTile.y; y <= endTile.y; y++) {
                        arrTile.push(createTile({ x, y, level, lands, selected, openCountries, defaultLandPrice, centerQuadKey }));
                    }
                }
            }
        } else {
            if (beginTile.x <= endTile.x) {
                for (let x = beginTile.x; x <= endTile.x; x++) {
                    for (let y = beginTile.y; y <= endTile.y; y++) {
                        arrTile.push(createTileLower22({ x, y, level, lands, selected, openCountries, landmarks }));
                    }
                }
            }
        }
        return arrTile;
    }

    const createTile = ({ x, y, level, lands, selected, openCountries, defaultLandPrice, centerQuadKey }) => {
        let tileQuadKey = TileXYToQuadKey(x, y, level);
        let latlng = TileXYToLatLong(x, y, level);
        let tile = { x, y, level, latlng, quadKey: tileQuadKey };
        tile.selected = selected && selected.length > 0 && selected.some(t => tile.quadKey.indexOf(t.quadKey) === 0 || t.quadKey.indexOf(tile.quadKey) === 0);
        const outsideOpenCountries = !checkInCountry({ latlng, openCountries });
        const totalCount = calculatorLand(tile.quadKey.length);
        tile.totalCount = totalCount;
        tile.isCenter = tileQuadKey === centerQuadKey;



        if (lands) {
            let fLand = lands.find(land => tile && tile.quadKey.indexOf(land.quadKey) === 0);
            if (fLand) {
                tile.lands = [{
                    empty: false,
                    outsideOpenCountries,
                    forbid: fLand.forbidStatus,
                    landmark: fLand.user && fLand.user.role && fLand.user.role === 'manager',
                    forSaleStatus: fLand.forSaleStatus,
                    sellPrice: fLand.sellPrice,
                    initialPrice: fLand.initialPrice,
                    purchasePrice: fLand.purchasePrice,
                    purchaseDate: fLand.purchaseDate,
                    user: fLand.user,
                    landCount: totalCount,
                    totalCount: totalCount,
                    quadKey: fLand.quadKey,
                }];
                tile.land = {
                    empty: false,
                    outsideOpenCountries,
                    forbid: fLand.forbidStatus,
                    landmark: fLand.user && fLand.user.role && fLand.user.role === 'manager',
                    forSaleStatus: fLand.forSaleStatus,
                    sellPrice: fLand.sellPrice,
                    initialPrice: fLand.initialPrice,
                    purchasePrice: fLand.purchasePrice,
                    purchaseDate: fLand.purchaseDate,
                    user: fLand.user,
                    landCount: totalCount,
                    totalCount: totalCount,
                    quadKey: fLand.quadKey,
                };
            } else {
                tile.lands = [{
                    empty: true,
                    outsideOpenCountries,
                    forbid: false,
                    forSaleStatus: null,
                    landmark: false,
                    user: null,
                    sellPrice: defaultLandPrice,
                    initialPrice: defaultLandPrice,
                    purchasePrice: null,
                    purchaseDate: null,
                    landCount: totalCount,
                    totalCount: totalCount,
                    quadKey: tileQuadKey,
                }];
                tile.land = {
                    empty: true,
                    outsideOpenCountries,
                    forbid: false,
                    forSaleStatus: null,
                    landmark: false,
                    user: null,
                    sellPrice: defaultLandPrice,
                    initialPrice: defaultLandPrice,
                    purchasePrice: null,
                    purchaseDate: null,
                    landCount: totalCount,
                    totalCount: totalCount,
                    quadKey: tileQuadKey,
                };
            }
            return tile;
        }
    }

    const createTileLower22 = ({ x, y, level, lands, selected, openCountries, landmarks }) => {
        const quadKey = TileXYToQuadKey(x, y, level);
        const latlng = TileXYToLatLong(x, y, level);
        const tile = { level, latlng, quadKey };
        const totalCount = calculatorLand(tile.quadKey.length);

        tile.outsideOpenCountries = !checkInCountry({ latlng, openCountries });
        tile.landmark = Array.isArray(landmarks) && landmarks.some(lm => lm.centerQuadKey.indexOf(quadKey) === 0);
        tile.totalCount = totalCount;
        let fLand = lands.find(land => land.quadKey === tile.quadKey);
        if (fLand) {
            tile.canBuy = totalCount - fLand.count;
            tile.canNotBuy = fLand.count;
        } else {
            tile.canBuy = totalCount;
            tile.canNotBuy = 0;
        }
        return tile;
    }

    const tileClick = (tile) => {        
        const { mode, selected, zoom } = props.map;
        if(zoom < 22) return null;
        if(!mode) return null; //slow load mode
        const selectedIndex = tiles.findIndex(t => t.quadKey === tile.quadKey);
        //console.log('selectedIndex', selectedIndex);
        if(mode === "single") {
            if (tiles[selectedIndex].selected === false) {
                const newSelectedTiles = update((selected || []), { $push: [tile] });
                props.addSelected(newSelectedTiles);
            }else {
                const iSelected = selected.findIndex(t => t.quadKey === tile.quadKey);
                const newSelectedTiles = update(selected, { $splice: [[iSelected, 1]] });
                props.addSelected(newSelectedTiles);
            }
        } else if (mode === "multi") {
            if (tileStart === null) {
                setTileStart(tile);
            } else {
                const newSelected = _.uniqBy([...(multiSelectSave || []), ...(selected || [])], 'quadKey');
                props.addSelected(newSelected);
                setTileStart(null);
                setMultiSelectSave(null);   //set null after save
            }
        }
    }

    const tileMouseEnter = (tileEnd) => {
        const { map: { mode, selected, zoom } } = props;
        //hiệu ứng hover
        if (zoom < LIMIT_ZOOM_SELECTED) return; //don't click when lower zoom 22
        if (mode === "multi" && tileStart) {
            //nếu đang hover mà trạng thái chọn 1 vùng
            //set trạng thái selected true từ ô bắt đầu + ô đang hover ( vẽ hình vuông theo tọa độ x,y)

            let arrTmp = [];
            for(let t of _.cloneDeep(tiles)){
                if ((t.x <= tileStart.x && t.x >= tileEnd.x && t.y <= tileStart.y && t.y >= tileEnd.y) ||
                    (t.x <= tileStart.x && t.x >= tileEnd.x && t.y <= tileEnd.y && t.y >= tileStart.y) ||
                    (t.x <= tileEnd.x && t.x >= tileStart.x && t.y <= tileStart.y && t.y >= tileEnd.y) ||
                    (t.x <= tileEnd.x && t.x >= tileStart.x && t.y <= tileEnd.y && t.y >= tileStart.y)) {
                    t.selected = true;
                    arrTmp.push(t);
                }
            }
            setMultiSelectSave(arrTmp);
        }
    }

    const onViewReset = () => {
        console.log('onViewReset');
    }

    const onLayerAdd = () => {
        console.log('onLayerAdd');
    }

    const { screens } = props;

    return (
        <LeafletMap
            center={props.map.center || props.centerLeave}
            zoom={props.map.zoom}
            minZoom={5}
            maxZoom={22}
            attributionControl={true}
            zoomControl={false}
            doubleClickZoom={true}
            scrollWheelZoom={true}
            dragging={true}
            animate={true}
            easeLinearity={0.35}
            ref={leafMap}
            onViewreset={ onViewReset }
            onMoveend={onMoveEnd}
            onZoomstart={onZoomstart}
            onZoomend={onZoomEnd}
        >
            <MapBoxGLLayer accessToken='pk.eyJ1Ijoibmd1eWVucXVhbjEzIiwiYSI6ImNqeWwxMXBpejAzankzY3Q0czBjeHVuZ3IifQ.Rbuh_pPMRWpj_mUi1VRcUA' style='mapbox://styles/nguyenquan13/cjyl18qu4106a1do20r6j7wii' />
            { mapLoaded && tiles && tiles.map((item) => {
                return <LandTileComponent
                    key={item.quadKey}
                    zoom={props.map.zoom}
                    lat={item.latlng.lat}
                    lng={item.latlng.lng}
                    tile={item}
                    selected={item.selected}
                    tileClick={(tile) => tileClick(tile)}
                    tileMouseEnter={(tile) => tileMouseEnter(tile)}
                    user={props.user}
                    myLands={props.myLands}
                    //isDragging={isDragging}
                    tileStart={tileStart} //for check multiselect: when hover => do not show certificate
                    //settingReducer={props.settingReducer}
                    //getAllLandById={props.getAllLandById}
                    //clearSelected={props.clearSelected}
                    lmap={leafMap && leafMap.current && leafMap.current.leafletElement}
                />
            }) }
            {screens["LandCertificateComponent"] && <LandCertificateComponent quadKey={screens["LandCertificateComponent"].quadKey} />}
            {screens["LandCertificateImageComponent"] && <LandCertificateImageComponent quadKey={screens["LandCertificateImageComponent"].quadKey} />}
            {screens["ContextMenu"] && <ContextMenu/>}

        </LeafletMap>
    );
}

export default connect(
    state => {
        const { lands, authentication: { user }, map, alert, users, settingReducer, lands: { myLands }, screens } = state;
        return { user, alert, lands, map, users, settingReducer, myLands, screens };
    }, dispatch => ({
        getAreaLand: (param) => dispatch(landActions.getAreaLand(param)), //get land in screen
        addSelected: (selected) => dispatch(mapActions.addSelected(selected)), //add selected tile
        syncCenterMap: (center, zoom) => dispatch(mapActions.syncCenterMap(center, zoom)),
        clearSelected: () => dispatch(mapActions.clearSelected()), //clear selected after buy land
        getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
    })
)(LeaftLandMap)




