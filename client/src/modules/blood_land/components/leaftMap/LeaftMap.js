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
import TileComponent from './components/TileComponent';
import LandCertificateComponent from './components/LandCertificateComponent';
import LandCertificateImageComponent from './components/LandCertificateImageComponent';

const LIMIT_ZOOM_SELECTED = 22;
const DEFAULT_LEVEL_OFFSET = 2;
const PARENT_1_RANGE = 4;
const PARENT_2_RANGE = 5;



// this.state = {
//     markets: [],
//     multiSelect: false,
//     multiClearStart: null,
// };

function LeaftMap(props) {
    //this.map = React.createRef();
    //const [count, setCount] = useState();
    //====================================================================================
    let leafMap = useRef();
    const [mapLoaded, setMapLoaded] = useState(false);
    const [tileUpdate, setTileUpdate] = useState(false);
    //map property
    //
    
    const [center, setCenter] = useState([37.583136601716824, 127.0003867149353]);
    //const [center, setCenter] = useState([37.566535, 126.9779692]);
    const [zoom, setZoom] = useState(22);
    const [bounds, setBounds] = useState(null);
    const [tiles, setTiles] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [tileLoaded, setTileLoaded] = useState(null);
    const [landsUpdated, setLandsUpdated] = useState(null);
    const [tileStart, setTileStart] = useState(null);
    const [multiSelectSave, setMultiSelectSave] = useState(null);
    //selectMode
    //====================================================================================


    //====================================================================================
    //first load
    useEffect(() => {
        //console.log('mapLoaded', mapLoaded);
        setMapLoaded(true);
        setTileUpdate(true);
        getParticalLands();
    }, []); 

    //
    useEffect(() => {
        const newTiles = drawTiles();
        if(!isEqual(tiles, newTiles)){
            console.log('setTile with Lands'/*, props.lands.allLands*/);
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

    //update center when click quadKey or certificate
    useEffect(() => {
        if(!_.isEqual(center, props.map.center)){
            //console.log('props.map.center', props.map.center);
            setCenter(props.map.center);
        }
    }, [props.map.center]);

    
    //receive center from other component 
    // useEffect(() => {
    //     console.log('props.dataMap', props.dataMap);
    //     const {center, zoom} = props.dataMap;
    // }, [props.dataMap]);


    // useEffect(() => {
    //     console.log('tileLoaded change', tileLoaded);
    //     //setMapLoaded(true);
    //     if(tileLoaded){
    //         console.log('tileLoaded change = true');
    //     }
    // }, [tileLoaded]);
    //====================================================================================



    //===========================================MAP EVENT===========================================
    const getZoomBounds = () => {
        if(!leafMap || !leafMap.current || !leafMap.current.leafletElement) return;
        const map = leafMap.current.leafletElement;
        const newZoom = map.getZoom();
        const center = map.getCenter();
        const newCenter = center ? [center.lat, center.lng] : null;
        //console.log('newCenter',newCenter)

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
        setTiles([]);
        //setTileUpdate(true);
        console.log("====================================Tile.length = 0");
    }

    const onMoveEnd = (e) => {
        const zb = getZoomBounds();
        if(zb){
            const newTiles = drawTiles();
            if(tileUpdate === false && !isEqual(tiles, newTiles)){
                console.log('1. Change bound when move end');
                //change
                const { newZoom, newBounds, newCenter } = zb;
                //console.log('newZoom', newZoom);
                setZoom(newZoom);
                setBounds(newBounds);
                setCenter(newCenter);

                //tile change
                getParticalLands();
                //update tiles
                setTiles(newTiles);
                setTileUpdate(true);



                //console.log('onMoveEnd setTile');


                //const { map: { selected } } = props;
                //console.log('selected', selected);



            }
        }

        //reset multi select tile
        if(tileStart){
            setTileStart(null);
            setMultiSelectSave(null);
        }
    }

    const onZoomEnd = () => {
        const zb = getZoomBounds();
        if(zb){
            const { newZoom } = zb;
            setZoom(newZoom);
        }

        //reset multi select tile
        if(tileStart){
            setTileStart(null);
            setMultiSelectSave(null);
        }
    }
    //===========================================END MAP EVENT===========================================

    const getParticalLands = () => {
        console.log('Call API lands');
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
        const selected = [...(props.map.selected || []), ...(multiSelectSave || [])];
        
        
        const level = newZoom + DEFAULT_LEVEL_OFFSET;
        const beginTile = LatLongToTileXY(newBounds.ne.lat, newBounds.sw.lng, level);
        const endTile = LatLongToTileXY(newBounds.sw.lat, newBounds.ne.lng, level);

        const newTiles = createArrayTile({ beginTile, endTile, zoom: newZoom, level, lands, selected, openCountries, defaultLandPrice, landmarks });
        //console.log('arrayTile', arrayTile);
        return newTiles;
    }

    const createArrayTile = ({ beginTile, endTile, zoom, level, lands, selected, openCountries, defaultLandPrice, landmarks }) => {
        let arrTile = [];
        if (zoom === 22) {
            if (beginTile.x <= endTile.x) {
                for (let x = beginTile.x; x <= endTile.x; x++) {
                    for (let y = beginTile.y; y <= endTile.y; y++) {
                        arrTile.push(createTile({ x, y, level, lands, selected, openCountries, defaultLandPrice }));
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

    const createTile = ({ x, y, level, lands, selected, openCountries, defaultLandPrice }) => {
        let tileQuadKey = TileXYToQuadKey(x, y, level);
        let latlng = TileXYToLatLong(x, y, level);
        let tile = { x, y, level, latlng, quadKey: tileQuadKey };
        tile.selected = selected && selected.length > 0 && selected.some(t => tile.quadKey.indexOf(t.quadKey) === 0 || t.quadKey.indexOf(tile.quadKey) === 0);
        const outsideOpenCountries = !checkInCountry({ latlng, openCountries });
        const totalCount = calculatorLand(tile.quadKey.length);
        tile.totalCount = totalCount;

        if (lands) {
            //console.log('lands', lands)
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
        //console.log(QuadKeyToLatLong('132110320102333310310313'))
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
        //console.log('tile', tile);
        //console.log("zoom",zoom);
        //console.log("props", props);
        if(zoom < 22) return null;
        const { mode, selected } = props.map;
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
            console.log('mode', mode);
            if (tileStart === null) {
                setTileStart(tile);
                //const newSelected = update((selected || []), { $push: [tile] });
                //props.addSelected(newSelected);
            } else {
                setTileStart(null);
                const newSelected = _.uniqWith([...(multiSelectSave || []), ...(selected || [])], _.isEqual);
                props.addSelected(newSelected);
            }
        }
    }

    const tileMouseEnter = (tileEnd) => {
        const { map: { mode, selected } } = props;
        //hiệu ứng hover
        if (zoom < LIMIT_ZOOM_SELECTED) return; //don't click when lower zoom 22
        //console.log('tileStart',tileStart)
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

        //For Landmark Admin
        // else if (this.state.selectMode === "line") {
        //     tileStart = this.state.multiSelectStart;
        //     if (tileStart) {
        //         let lineQuadKeys = this.getLineAround([{x: tileStart.x, y: tileStart.y}, {x: tileEnd.x, y: tileEnd.y}]);
        //         if (Array.isArray(lineQuadKeys) && lineQuadKeys.length > 0) {
        //             let arrTmp = [];
        //             [...this.state.tiles].map(t => {
        //                 let findQK = lineQuadKeys.find(lineQK => lineQK === t.quadKey);
        //                 if (findQK) {
        //                     t.selected = true;
        //                     arrTmp.push(t);
        //                 }
        //                 return t;
        //             });

        //             let newSelectedTiles = removeDuplicates([...arrTmp, ...this.state.selectedTiles], 'quadKey');
        //             if (this.props.user.role === 'manager') {
        //                 newSelectedTiles = newSelectedTiles && newSelectedTiles.length > 0 && newSelectedTiles.filter(slTile => slTile.lands && slTile.lands.length > 0 && !slTile.lands.some(land => land.user));
        //             }

        //             const {zoom, bounds, lands} = this.state;
        //             if (bounds && zoom) {
        //                 const tiles = this.drawTiles({zoom, bounds, lands, selectedTiles: newSelectedTiles});
        //                 this.setState({tiles: tiles, landsUpdated: false, multiSelectSave: newSelectedTiles});
        //             }
        //         }
        //     }
        // }
    }


        // let tiles = tmpTiles;
        // if (this.state.multiSelectStart === null && this.state.multiClearStart === null && this.state.landsUpdated) {
        //     let map = this.map.current.leafletElement;
        //     let { bounds, zoom } = this.getZoomBounds(map);
        //     let check = !this.state.tiles || !this.state.tiles[0] || !bounds || !zoom;
        //     if (!check) {
        //         tiles = this.drawTiles({
        //             zoom,
        //             bounds,
        //             lands: this.props.lands.allLands,
        //             selectedTiles: this.state.selectedTiles,
        //         });
        //     }
        // }


    const onViewReset = () => {
        console.log('onViewReset');
    }

    const onLayerAdd = () => {
        console.log('onLayerAdd');
    }

    const onAdd = () => {
        console.log('onadd');
    }
    //console.log('props.screens', props.screens);
    const { screens } = props;
    //console.log('{ popupName, popupOpen, popupData }', { popupName, popupOpen, popupData });

    return (
        <LeafletMap
            center={center}
            zoom={zoom}
            //user={user}
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
            // onMovestart={this.onMovestart}
            onZoomstart={onZoomstart}
            // onZoom={this.onZoom}
            onZoomend={onZoomEnd}
            // onViewreset={this.onViewreset}
        >
            <MapBoxGLLayer accessToken='pk.eyJ1IjoianVuMDIyOCIsImEiOiJjanVrcGJ4eHowa3hkNDNxdm54ZjZpbmoxIn0.FHZXhfvwhWqLxCa1DC8xnQ' style="mapbox://styles/mapbox/streets-v11" />
            { mapLoaded && tiles && tiles.map((item) => {
                return <TileComponent
                    zoom={zoom}
                    key={item.quadKey}
                    lat={item.latlng.lat}
                    lng={item.latlng.lng}
                    tile={item}
                    selected={item.selected}
                    tileClick={(tile) => tileClick(tile)}
                    tileMouseEnter={(tile) => tileMouseEnter(tile)}
                    user={props.user}
                    myLands={props.myLands}
                    isDragging={isDragging}
                    tileStart={tileStart} //for check multiselect: when hover => do not show certificate
                    //settingReducer={props.settingReducer}
                    //getAllLandById={props.getAllLandById}
                    //clearSelected={props.clearSelected}
                    lmap={leafMap && leafMap.current && leafMap.current.leafletElement}
                />
            }) }
            {screens["LandCertificateComponent"] && <LandCertificateComponent quadKey={screens["LandCertificateComponent"].quadKey} />}
            {screens["LandCertificateImageComponent"] && <LandCertificateImageComponent />}
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
        //getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
        //selectMode: (mode) => dispatch(mapActions.selectMode(mode)),
        //clearSelected: () => dispatch(mapActions.clearSelected())
    })
)(LeaftMap)




