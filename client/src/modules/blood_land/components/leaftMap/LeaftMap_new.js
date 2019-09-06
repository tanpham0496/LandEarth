import React, { PureComponent } from 'react'
import ReactDOMServer from "react-dom/server";
import MapBoxGLLayer from './components/MapBoxGLLayer';
import update from 'immutability-helper';
import JsxMarker from './components/JsxMarker';
import DivIcon from 'react-leaflet-div-icon';
import { LatLongToTileXY, TileXYToQuadKey, TileXYToLatLong, QuadKeyToLatLong, QuadKeyToTileXY } from "../general/System";
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import * as L from "leaflet";
import connect from "react-redux/es/connect/connect";
import uniq from "lodash.uniq";
import isNull from "lodash.isnull";
import isEqual from "lodash.isequal";
import { mapActions } from "../../../../reduxNew/actions/commonActions/mapActions";
import { landActions } from "../../../../reduxNew/actions/landActions/landActions";
import { toggleLandIcon } from "./../landMapComponent/component/asset";
import {
    calculatorLand,
    removeDuplicates,
    splitLand,
    checkInCountry,
    drawLine,
    checkInCenter
} from '../landMapComponent/component/MapFunction';

import { getCertificateAlertPopup, landCertificationPopup } from "./../landMapComponent/component/LandMapAlert";

const LIMIT_ZOOM_SELECTED = 20;
const DEFAULT_LEVEL_OFFSET = 2;
const PARENT_1_RANGE = 4;
const PARENT_2_RANGE = 5;


class LeaftMap extends PureComponent {
    constructor(props) {
        super(props);
        this.map = React.createRef();
        this.state = {
            center: [37.566535, 126.9779692],
            loaded: false,
            zoom: 22,
            bounds: null,
            lands: null,
            isDragging: false,
            tiles: [],
            markets: [],
            selectedTiles: [],
            selectMode: "single",
            multiSelect: false,
            multiSelectStart: null,
            multiSelectSave: [],
            multiClearStart: null,

            defaultLandPrice: 0,
        };
    }

    componentDidMount = () => {

        this.props.getAllLandById(this.props.user_id);
        this.loadTiles();
        this.setState({ loaded: true });
    }

    static getDerivedStateFromProps(props, state) {
        //load land
        const { allLands, landGrpCate, defaultLandPrice, isOwn } = props.lands;
        if (allLands && !isEqual(allLands, state.lands)) {
            if (isOwn) {
                return { lands: allLands, landsUpdated: true, selectedTiles: [] };
            }
            return { lands: allLands, landGrpCate, defaultLandPrice, landsUpdated: true }
        }
        //change center
        const { center, zoom, centerQuadKey, centerChange } = props.map;
        if (center) {
            if (zoom) {
                if (centerQuadKey) {
                    return { center, zoom, centerQuadKey, centerChange };
                }
                return { center, zoom, centerChange };
            }
            return { center, centerChange };
        }
        return null;
    }

    getZoomBounds = (map) => {
        if (!map) return;
        const zoom = map.getZoom();
        let bounds = map.getBounds();
        let ne = bounds._northEast;
        let sw = bounds._southWest;
        const newBounds = {
            ne: { lat: ne.lat, lng: ne.lng },
            nw: { lat: ne.lat, lng: sw.lng },
            se: { lat: sw.lat, lng: ne.lng },
            sw: { lat: sw.lat, lng: sw.lng },
        };
        return { zoom, bounds: newBounds, level: zoom + DEFAULT_LEVEL_OFFSET };
    };

    getParticalLands() {
        let map = this.map.current.leafletElement;
        const { bounds, level } = this.getZoomBounds(map);
        let beginTile = LatLongToTileXY(bounds.ne.lat, bounds.sw.lng, level);
        let endTile = LatLongToTileXY(bounds.sw.lat, bounds.ne.lng, level);

        let arrQK = [];
        for (let x = beginTile.x; x <= endTile.x; x++) {
            for (let y = beginTile.y; y <= endTile.y; y++) {
                arrQK.push(TileXYToQuadKey(x, y, level));
            }
        }

        let parents1 = uniq(arrQK.map(qk => qk.substr(0, level - PARENT_1_RANGE)));
        let parents2 = uniq(arrQK.map(qk => qk.substr(0, level - PARENT_2_RANGE)));
        this.props.getAllLand({ parents1, parents2, level, role: this.props.user ? this.props.user.role : 'user' })

    }

    checkInCountry = (latlng) => {
        const limitMaps = [
            {
                minLat: 37.45741810262937,
                minLng: 130.78125,
                maxLat: 37.56199695314351,
                maxLng: 130.93505859375,
                ranges: [
                    {
                        lat: [37.45741810262937, 37.56199695314351],
                        lng: [130.78125, 130.93505859375]
                    }
                ]
            },
            {   //Korean
                minLat: 34.16181816123038,
                minLng: 125.859375,
                maxLat: 38.272688535980954,
                maxLng: 129.58648681640625,
                ranges: [
                    {
                        lat: [34.16181816123038, 34.30714385628803],
                        lng: [125.859375, 127.529296875]
                    },
                    {
                        lat: [34.30714385628803, 34.74161249883172],
                        lng: [125.859375, 127.880859375]
                    },
                    {
                        lat: [34.74161249883172, 35.10193405724607],
                        lng: [125.859375, 128.7158203125]
                    },
                    {
                        lat: [35.10193405724607, 37.5097258429375],
                        lng: [126.03515625, 129.58648681640625]
                    },

                    {
                        lat: [37.5097258429375, 37.75334401310657],
                        lng: [126.2109375, 129.375]
                    },
                    {
                        lat: [37.75334401310657, 37.996162679728116],
                        lng: [126.826171875, 129.375]
                    },

                    {
                        lat: [37.71859032558814, 37.996162679728116],
                        lng: [126.826171875, 129.375]
                    },
                    {
                        lat: [37.996162679728116, 38.13455657705411],
                        lng: [126.9580078125, 128.84765625]
                    },
                    {
                        lat: [38.13455657705411, 38.272688535980954],
                        lng: [127.08984375, 128.84765625]
                    },
                    {
                        lat: [38.272688535980954, 38.34165619279593],
                        lng: [127.08984375, 128.551025390625]
                    },
                    {
                        lat: [38.34165619279593, 38.61687046392973],
                        lng: [128.2763671875, 128.4521484375]
                    },
                ]
            },
            // {   //Viet Nam
            //     minLat: 8.754794702435618,
            //     minLng: 102.3046875,
            //     maxLat: 23.24134610238613,
            //     maxLng: 110.0390625,
            //     ranges: [
            //         {
            //             lat: [8.754794702435618, 11.523087506868507],
            //             lng: [104.4140625, 109.3359375]
            //         },
            //         {
            //             lat: [11.523087506868507, 12.565286943988028],
            //             lng: [105.8203125, 110.0390625]
            //         },
            //         {
            //             lat: [12.565286943988028, 13.934067182498325],
            //             lng: [107.4462890625, 109.599609375]
            //         },
            //         {
            //             lat: [13.934067182498325, 15.623036831528253],
            //             lng: [107.325439453125, 109.6875]
            //         },
            //         {
            //             lat: [15.623036831528253, 16.636191878397653],
            //             lng: [107.2265625, 109.3359375]
            //         },
            //         {
            //             lat: [16.636191878397653, 16.972741019999006],
            //             lng: [106.5234375, 108.6328125]
            //         },
            //         {
            //             lat: [16.972741019999006, 17.308687886770016],
            //             lng: [106.5234375, 107.9296875]
            //         },
            //         {
            //             lat: [17.308687886770016, 17.64402202787271],
            //             lng: [106.171875, 107.2265625]
            //         },
            //         {
            //             lat: [17.64402202787271, 17.97873309555615],
            //             lng: [105.8203125, 107.2265625]
            //         },
            //         {
            //             lat: [17.97873309555615, 18.312810846425435],
            //             lng: [105.46875, 106.875]
            //         },
            //         {
            //             lat: [18.312810846425435, 18.646245142670594],
            //             lng: [105.1171875, 106.875]
            //         },
            //         {
            //             lat: [18.646245142670594, 18.97902595325526],
            //             lng: [105.1171875, 106.5234375]
            //         },
            //         {
            //             lat: [18.97902595325526, 19.14516819620529],
            //             lng: [104.4140625, 106.171875]
            //         },
            //         {
            //             lat: [19.14516819620529, 19.80805412808857],
            //             lng: [103.88671875, 106.171875]
            //         },
            //         {
            //             lat: [19.80805412808857, 21.616579336740585],
            //             lng: [104.58984375, 106.69921875]
            //         },
            //         {
            //             lat: [21.616579336740585, 21.943045533438166],
            //             lng: [102.65625, 107.578125]
            //         },
            //         {
            //             lat: [21.943045533438166, 22.91792293614602],
            //             lng: [102.3046875, 106.5234375]
            //         },
            //         {
            //             lat: [22.91792293614602, 23.24134610238613],
            //             lng: [103.0078125, 106.5234375]
            //         },
            //         {
            //             lat: [23.24134610238613, 23.24134610238613],
            //             lng: [104.765625, 105.46875]
            //         }
            //     ]
            // }
        ];
        return limitMaps.some(limitMap => {
            if (latlng.lat >= limitMap.minLat && latlng.lat <= limitMap.maxLat && latlng.lng >= limitMap.minLng && latlng.lng <= limitMap.maxLng) {
                if (!limitMap.ranges) {
                    return false;
                } else {
                    return limitMap.ranges.some(range => latlng.lat >= range.lat[0] && latlng.lat <= range.lat[1] && latlng.lng >= range.lng[0] && latlng.lng <= range.lng[1]);
                }
            }
            return false;
        });
    }

    drawTiles = ({ zoom, bounds, lands, selectedTiles }) => {

        let ne = bounds.ne;
        let sw = bounds.sw;

        const level = zoom + DEFAULT_LEVEL_OFFSET;
        const beginTile = LatLongToTileXY(ne.lat, sw.lng, level);
        const endTile = LatLongToTileXY(sw.lat, ne.lng, level);

        let arrayTile = this.createArrayTile({ beginTile, zoom, endTile, lands, level, selectedTiles });
        return arrayTile;
    }


    createArrayTile({ beginTile, endTile, zoom, level, lands, selectedTiles }) {
        let arrTile = [];
        if (zoom === 22) {
            if (beginTile.x <= endTile.x) {
                for (let x = beginTile.x; x <= endTile.x; x++) {
                    for (let y = beginTile.y; y <= endTile.y; y++) {
                        arrTile.push(this.createTile(x, y, level, lands, selectedTiles || []));
                    }
                }
            }
        } else {
            if (beginTile.x <= endTile.x) {
                for (let x = beginTile.x; x <= endTile.x; x++) {
                    for (let y = beginTile.y; y <= endTile.y; y++) {
                        arrTile.push(this.createTileLower22(x, y, level, lands, selectedTiles || []));
                    }
                }
            }
        }
        return arrTile;
    }

    createTileLower22 = (x, y, level, lands, selectedTiles) => {
        let tileQuadKey = TileXYToQuadKey(x, y, level);
        let tileLatLng = TileXYToLatLong(x, y, level);
        let tile = { level, latlng: tileLatLng, quadKey: tileQuadKey };
        const totalCount = calculatorLand(tile.quadKey.length);
        tile.totalCount = totalCount;
        //tile.forbid = !checkInCountry(tileLatLng);
        tile.forbid = !checkInCountry({
            latlng: tileLatLng,
            openCountries: this.props.lands.openCountriesLoading === false ? this.props.lands.openCountries : []
        });
        tile.selected = selectedTiles && selectedTiles.length > 0 && selectedTiles.some(t => tile.quadKey.indexOf(t.quadKey) === 0 || t.quadKey.indexOf(tile.quadKey) === 0);
        tile.landmark = this.props.lands.landmarks && this.props.lands.landmarks.length > 0 && this.props.lands.landmarks.some(lm => lm.centerQuadKey.indexOf(tileQuadKey) === 0);
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



    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.loaded && this.props.map.mode && this.props.map.mode !== this.state.selectMode) {
            let map = this.map.current.leafletElement;
            let { bounds, level } = this.getZoomBounds(map);
            let zoom = map.getZoom();
            let { lands } = this.state;
            let newSelectedTiles = this.props.map.mode === "clear" ? [] : this.state.selectedTiles;
            if (typeof bounds !== 'undefined' && !isNull(bounds)) {
                let tiles = this.drawTiles({
                    zoom,
                    bounds,
                    lands,
                    selectedTiles: newSelectedTiles,
                });
                this.setState({
                    tiles,
                    landsUpdated: false,
                    selectMode: this.props.map.mode,
                    selectedTiles: newSelectedTiles,
                    multiSelectStart: null,
                    multiClearStart: null
                });
            }
        }

        if (this.state.loaded && this.props.map.selected && !isEqual(this.props.map.selected, this.state.selectedTiles)) {
            let map = this.map.current.leafletElement;
            let { bounds, level } = this.getZoomBounds(map);
            let zoom = map.getZoom();
            let { lands } = this.state;
            if (typeof bounds !== 'undefined' && !isNull(bounds)) {
                const tiles = this.drawTiles({
                    zoom: zoom,
                    bounds: bounds,
                    lands: lands || [],
                    selectedTiles: this.props.map.selected,
                });
                this.setState({ tiles: tiles, landsUpdated: false, selectedTiles: this.props.map.selected });
            }
        }

        // if (this.state.loaded && this.props.map.selected && !isEqual(this.props.map.selected, this.state.selectedTiles)) {

        //     console.log("change selected");
        //     // if (typeof bounds !== 'undefined' && !isNull(bounds)) {
        //     //     const tiles = this.drawTiles({
        //     //         zoom: zoom,
        //     //         bounds: bounds,
        //     //         lands: this.state.lands || [],
        //     //         selectedTiles: this.props.selectedTiles,
        //     //     });
        //     //     this.setState({ tiles: tiles, landsUpdated: false, selectedTiles: this.props.selectedTiles });
        //     // }
        // }
    }


    createTile = (x, y, level, lands, selectedTiles) => {
        let tileQuadKey = TileXYToQuadKey(x, y, level);
        let tileLatLng = TileXYToLatLong(x, y, level);
        let tile = { x, y, level, latlng: tileLatLng, quadKey: tileQuadKey };
        tile.selected = selectedTiles && selectedTiles.length > 0 && selectedTiles.some(t => tile.quadKey.indexOf(t.quadKey) === 0 || t.quadKey.indexOf(tile.quadKey) === 0);
        const forbid = !checkInCountry({
            latlng: tileLatLng,
            openCountries: this.props.lands.openCountriesLoading === false ? this.props.lands.openCountries : []
        });

        const totalCount = calculatorLand(tile.quadKey.length);
        tile.totalCount = totalCount;

        if (lands) {
            let fLand = lands.find(land => tile && tile.quadKey.indexOf(land.quadKey) === 0);

            if (fLand) {
                // console.log("status",fLand.user.role);
                tile.lands = [{
                    forbid: forbid || fLand.forbidStatus,
                    landmark: fLand.user && fLand.user.role && fLand.user.role == 'manager',//fLand.forbidStatus,
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
            } else {
                tile.lands = [{
                    empty: true,
                    forbid: forbid || false,
                    forSaleStatus: null,
                    landmark: false,
                    user: null,
                    sellPrice: this.props.lands.defaultLandPrice,
                    initialPrice: this.props.lands.defaultLandPrice,
                    purchasePrice: null,
                    purchaseDate: null,
                    landCount: totalCount,
                    totalCount: totalCount,
                    char: null,
                    quadKey: tileQuadKey,
                }];
            }
            return tile;
        }
    }

    tileClick = (tile) => {
        let map = this.map.current.leafletElement;
        if (map.getZoom() < LIMIT_ZOOM_SELECTED) return '';
        const selectedIndex = this.state.tiles.findIndex(t => t.quadKey === tile.quadKey);
        if (this.state.selectMode === "none") {

        } else if (this.state.selectMode === "multi") {
            if (this.state.multiSelectStart === null) {
                if (!this.state.isDragging) {
                    this.setState({ multiSelectStart: tile });
                }
            } else {
                this.setState({ multiSelectStart: null, selectedTiles: this.state.multiSelectSave });
                this.props.addSelected(this.state.multiSelectSave);
            }
        } else {
            if (this.state.tiles[selectedIndex].selected === false) {
                if (!this.state.isDragging) {
                    //show popup buy land
                    const newTiles = [...this.state.tiles];
                    newTiles[selectedIndex].selected = true;
                    let newSelectedTiles = update(this.state.selectedTiles, { $push: [tile] });
                    this.setState({ tiles: newTiles, selectedTiles: newSelectedTiles });
                    this.props.addSelected(newSelectedTiles);
                }
            } else {
                const newTiles = [...this.state.tiles];
                newTiles[selectedIndex].selected = false;
                let newSelectedTiles = [...this.state.selectedTiles];
                const slTIndex = this.state.selectedTiles.findIndex(t => t.quadKey === tile.quadKey);
                if (slTIndex !== -1) { //equal level
                    newSelectedTiles = update(newSelectedTiles, { $splice: [[slTIndex, 1]] });
                }
                //remove under lever
                newSelectedTiles = newSelectedTiles.filter(t => t.quadKey.indexOf(tile.quadKey) !== 0);

                this.setState({ tiles: newTiles, selectedTiles: newSelectedTiles });
                this.props.addSelected(newSelectedTiles);
            }
        }
    }


    tileMouseEnter(tileEnd, e) {

        if (this.state.zoom < LIMIT_ZOOM_SELECTED/* && this.props.user.role !== 'manager'*/) return; //don't click when lower zoom 22
        let tileStart = null;
        if (this.state.selectMode === "none") {
            tileStart = this.state.multiClearStart;
        } else if (this.state.selectMode === "line") {
            //MANAGER 

            // tileStart = this.state.multiSelectStart;
            // if (tileStart) {
            //     let lineQuadKeys = this.getLineAround([{x: tileStart.x, y: tileStart.y}, {x: tileEnd.x, y: tileEnd.y}]);
            //     if (Array.isArray(lineQuadKeys) && lineQuadKeys.length > 0) {
            //         let arrTmp = [];
            //         [...this.state.tiles].map(t => {
            //             let findQK = lineQuadKeys.find(lineQK => lineQK === t.quadKey);
            //             if (findQK) {
            //                 t.selected = true;
            //                 arrTmp.push(t);
            //             }
            //             return t;
            //         });

            //         let newSelectedTiles = removeDuplicates([...arrTmp, ...this.state.selectedTiles], 'quadKey');
            //         if (this.props.user.role === 'manager') {
            //             newSelectedTiles = newSelectedTiles && newSelectedTiles.length > 0 && newSelectedTiles.filter(slTile => slTile.lands && slTile.lands.length > 0 && !slTile.lands.some(land => land.user));
            //         }

            //         const {zoom, bounds, lands} = this.state;
            //         if (bounds && zoom) {
            //             const tiles = this.drawTiles({zoom, bounds, lands, selectedTiles: newSelectedTiles});
            //             this.setState({tiles: tiles, landsUpdated: false, multiSelectSave: newSelectedTiles});
            //         }
            //     }
            // }
        } else if (this.state.selectMode === "multi") {
            tileStart = this.state.multiSelectStart;
            if (tileStart) {
                let arrTmp = [];
                [...this.state.tiles].map(t => {
                    if ((t.x <= tileStart.x && t.x >= tileEnd.x && t.y <= tileStart.y && t.y >= tileEnd.y) ||
                        (t.x <= tileStart.x && t.x >= tileEnd.x && t.y <= tileEnd.y && t.y >= tileStart.y) ||
                        (t.x <= tileEnd.x && t.x >= tileStart.x && t.y <= tileStart.y && t.y >= tileEnd.y) ||
                        (t.x <= tileEnd.x && t.x >= tileStart.x && t.y <= tileEnd.y && t.y >= tileStart.y)) {
                        t.selected = true;
                        arrTmp.push(t);
                    }
                    return t;
                });
                let newSelectedTiles = [];
                if (this.state.selectMode === "multi") {
                    newSelectedTiles = removeDuplicates([...arrTmp, ...this.state.selectedTiles], 'quadKey');
                    // this.setState({tiles:newSelectedTiles});
                    // if (this.props.user.role === 'manager') {
                    //MANAGER
                    //     newSelectedTiles = newSelectedTiles && newSelectedTiles.length > 0 && newSelectedTiles.filter(slTile => slTile.lands && slTile.lands.length > 0 && !slTile.lands.some(land => land.user));
                    // }
                } else if (this.state.selectMode === "none") {
                    newSelectedTiles = [...this.state.selectedTiles].filter(slTile => !arrTmp.some(tmp => slTile.quadKey.indexOf(tmp.quadKey) === 0));
                }

                let map = this.map.current.leafletElement;
                let { bounds, level } = this.getZoomBounds(map);
                let zoom = map.getZoom();

                if (typeof bounds !== 'undefined' && !isNull(bounds)) {
                    const tiles = this.drawTiles({
                        zoom: zoom,
                        bounds: bounds,
                        lands: this.state.lands || [],
                        selectedTiles: newSelectedTiles,
                    });
                    this.setState({ tiles: tiles, landsUpdated: false, multiSelectSave: newSelectedTiles });
                }
            }
        }
    }


    onMovestart = () => {

    }

    //HIEN ADD
    loadTiles = () => {
        this.getParticalLands();
        let map = this.map.current.leafletElement;
        let { bounds, level } = this.getZoomBounds(map);
        let zoom = map.getZoom();
        if (typeof zoom !== 'undefined') {
            const tiles = this.drawTiles({
                zoom: zoom,
                bounds: bounds,
                lands: this.state.lands || [],
                selectedTiles: this.state.selectedTiles,
            });
            this.setState({
                tileLoaded: true,
                landsUpdated: false,
                tiles,
                zoom,
                bounds,
                isDragging: false
            });
        }

    }
    //END HIEN ADD
    onMoveEnd = (e) => {
        this.loadTiles();
    }

    onZoomstart = () => {
        let that = this;
        function removeTiles() {
            that.setState({ tiles: [] });
        }
        removeTiles();
    }

    onZoomend = () => {

    }

    onZoom = () => {

    }

    toggleAllCertoficationExpect = (quadKey) => {
        console.log({quadKey});
    }
    onRenderTiles = (tmpTiles) => {

        let tiles = tmpTiles;

        if (this.map.current && this.state.multiSelectStart === null && this.state.multiClearStart === null && this.state.landsUpdated) {
            let map = this.map.current.leafletElement;
            let { bounds, level } = this.getZoomBounds(map);
            let zoom = map.getZoom();
            let check = !this.state.tiles || !this.state.tiles[0] || !bounds || !zoom;
            if (!check) {
                tiles = this.drawTiles({
                    zoom,
                    bounds,
                    lands: this.state.lands || [],
                    selectedTiles: this.state.selectedTiles,
                });
            }

        }

        // console.log("tiles -> ",tiles.filter(t => typeof t.lands[0].user !== null && t.lands[0].user.role));
        // console.log("!! tiles -> ",tiles.filter(t =>  typeof t.lands[0].user === null));

        return tiles.map((item) => {
            return <TileComponent
                zoom={this.state.zoom}
                key={item.quadKey}
                lat={item.latlng.lat}
                lng={item.latlng.lng}
                tile={item}
                selected={item.selected}
                tileClick={() => this.tileClick(item)}
                tileMouseEnter={() => this.tileMouseEnter(item)}
                user={this.props.user}
                myLands={this.props.myLands}
                isDragging={this.state.isDragging}
                syncCenterMap={this.props.syncCenterMap}
                settingReducer={this.props.settingReducer}
                getAllLandById={this.props.getAllLandById}
                clearSelected={this.props.clearSelected}
                selectMode={this.props.selectMode}
                
                toggleAllCertoficationExpect={this.toggleAllCertoficationExpect}
            />
        })
    }



    render() {
        const { tiles, center, zoom } = this.state;
        let lat = 51.505;
        let lng = -0.09;
        let position = [lat, lng];
        return (
            <LeafletMap
                center={center}
                zoom={this.state.zoom}
                user={this.props.user}
                maxZoom={22}
                attributionControl={true}
                zoomControl={true}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                dragging={true}
                animate={true}
                easeLinearity={0.35}
                ref={this.map}

                onMoveend={this.onMoveEnd}
                onMovestart={this.onMovestart}

                onZoomstart={this.onZoomstart}
                onZoom={this.onZoom}
                onZoomend={this.onZoomend}

                onViewreset={this.onViewreset}


            >
                <MapBoxGLLayer
                    accessToken={'pk.eyJ1IjoianVuMDIyOCIsImEiOiJjanVrcGJ4eHowa3hkNDNxdm54ZjZpbmoxIn0.FHZXhfvwhWqLxCa1DC8xnQ'}
                    style={"mapbox://styles/mapbox/streets-v11"}
                />
                {this.onRenderTiles(tiles)}
            </LeafletMap>
        );
    }
}

class TileComponent extends PureComponent {
    state = {};

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    tileClick = () => {
        this.props.tileClick()
    }

    createClassLand = (props, { canBuy }) => {
        const { tile, tile: { lands, selected }, user } = props;
        let clsName = "";
        clsName += lands.reduce((clsName, land) => {
            if (land.user) {
                if (land.forbid) { //forbid by Admin
                    if (land.landmark) {
                        if (clsName.indexOf(' landmark') === -1) clsName += ' landmark';
                    } else {
                        if (clsName.indexOf(' forbid') === -1) clsName += ' forbid';
                    }
                } else {
                    if (land.user._id === user._id) { //is MyLand
                        if (land.forSaleStatus === true) {
                            if (clsName.indexOf(' myLand myForSell') === -1) clsName += ' myLand myForSell';
                        } else {
                            if (clsName.indexOf(' myLand') === -1) clsName += ' myLand';
                        }
                    } else { //is other user
                        if (land.landmark) {
                            if (clsName.indexOf(' landmark') === -1) clsName += ' landmark';
                        }

                        if (land.forSaleStatus === true) {
                            if (clsName.indexOf(' forSell') === -1) clsName += ' forSell';
                        } else {
                            if (clsName.indexOf(' noSell') === -1) clsName += ' noSell';
                        }
                    }
                }
            } else { //forbid Area
                if (land.forbid) {
                    if (clsName.indexOf(' forbid') === -1) clsName += ' forbid';
                }
            }
            return clsName;
        }, '');

        if (canBuy > 0) {
            clsName = clsName.replace(/ myLand| noSell| forbid| partial/g, ' partial');
        }

        if (tile.waiting) {
            clsName += ' waiting';
        } else {
            if (clsName.indexOf(' forbid') !== -1) { //when has forbid land => disable selected
                clsName = clsName.replace(' selected', '');
            } else {
                clsName += selected ? " selected" : "";
            }
        }
        clsName += tile.isCenter ? ' center' : "";
        return clsName;
    };


    tileMouseEnter = (tile) => {
        this.onHandleMouseOver(tile);
        this.props.toggleAllCertoficationExpect(tile.quadKey);
        this.props.tileMouseEnter();
    }

    tileMouseLeave = () => {
       
        this.setState({ toggleCertification: false })
    }

    componentDidMount() {
        const { tile: { lands, quadKey, totalCount }, user: { _id } } = this.props;
        let that = this;

        // hover-icon-
        // hover-land-info-icon-
        document.addEventListener('click', function (e) {
            if (e.target && e.target.id == 'hover-icon-' + quadKey) {
                //do something
                that.props.getAllLandById(_id);
                that.setState({
                    isOpenLandCertificate: true
                });
            }
        });

        document.addEventListener("mouseover", function (e) {
            if (e.target && e.target.id == 'hover-land-info-icon-' + quadKey) {
                that.setState({
                    toolTipDisplay: true
                })
            }
        })

        document.addEventListener("mouseout", function (e) {
            if (e.target && e.target.id == 'hover-land-info-icon-' + quadKey) {
                console.log("oh");
                that.setState({
                    toolTipDisplay: false
                })
            }
        })
    }

    createClassLandLower22 = (props) => {

        let cls = "";
        if (props.tile && props.tile.forbid) {
            cls += ' forbid';
        }
        const { tile: { canBuy, canNotBuy, totalCount } } = props;
        if (canBuy === totalCount) {
            cls += '';
        } else if (canNotBuy === totalCount) {
            cls += ' noSell';
        } else {
            cls += ' partial';
        }
        return cls;
    };

    // tren tang 18
    createInfoLandLowerLv23(props) {
        const { tile: { totalCount, canBuy, canNotBuy, quadKey }, settingReducer } = props;
        let infoHtml = '';
        const { land } = settingReducer;
        if (settingReducer && land && land.showInfo) {
            infoHtml = (
                <div className='cell'>
                    <div>
                        <div className='cell-info' id={'hover-land-info-icon-' + quadKey} onMouseOver={() => this.setState({ toolTipDisplay: true })}
                            onMouseLeave={() => this.setState({ toolTipDisplay: false })}>
                            {/* <img src={cellInfoImg} alt=''/> */}
                            <span className='can-buy'>{canNotBuy} /&nbsp; </span><span
                                className='total-count'>{totalCount}</span>
                            {
                                this.state.toolTipDisplay
                                &&
                                <span className="tooltiptext">
                                    <div>
                                        <div>총 랜드: {totalCount}</div>
                                        <div> 구매 가능 랜드: {canBuy} </div>
                                        <div> 이미 판매된 랜드: {canNotBuy} </div>
                                    </div>
                                </span>
                            }
                        </div>
                    </div>
                </div>
            )
        }
        return infoHtml;
    }

    onHandleShowLandCertificate = () => {
        // const {user:{_id}} = this.props;
        // this.props.getAllLandById(_id);
        // console.log("_id ne",_id);
        // this.setState({
        //     isOpenLandCertificate: true
        // });
    };

    onHandleHideLandCertificate = () => {

        // this.onHandleMouseLeave();

        this.tileMouseLeave();
        this.props.clearSelected();
        this.props.selectMode(1);
        this.setState({
            isOpenLandCertificate: false

        });
    };

    renderTileDetailHtml = (clsName, infoHtml) => {

        const { toggleCertification, isOpenLandCertificate, isOpenCertificateImage } = this.state;
        const { tile: { lands, quadKey, totalCount } } = this.props;
        return (
            <React.Fragment>
                {
                    toggleCertification &&
                    <div className="toggle-land-button-container">
                        <div id={'hover-icon-' + quadKey} className='toggle-land-button' onClick={() => this.onHandleShowLandCertificate()}>
                            <img src={toggleLandIcon} alt='' />
                        </div>

                    </div>
                }
                {(clsName.indexOf('partial') !== -1 || clsName.indexOf('noSell') !== -1 || clsName.indexOf('myLand') !== -1 || clsName.indexOf('myForSell') !== -1) && infoHtml}

                {clsName.indexOf('center') !== -1 ? <div className='centick' /> : null}
                {(clsName.indexOf('myForSell') !== -1 && clsName.indexOf('myLand') === -1) || clsName.indexOf('forSell') !== -1 ?
                    <div className='fs-cont'>
                        <div className="fs-img" />
                        <div className='fs-title'> for sale</div>

                    </div>
                    : ''
                }
                {clsName.indexOf('myLand') !== -1 && clsName.indexOf('myForSell') === -1 ?
                    <div className='ml-cont'>
                        <div className="ml-img" />
                        <div className='ml-title'> my land</div>
                    </div>
                    : ''
                }
                {clsName.indexOf('myLand') !== -1 && clsName.indexOf('myForSell') !== -1 ?
                    <div className='fl-cont' style={{ marginTop: '22px' }}>
                        <div className='fs-cont'>
                            <div className="fs-img" />
                            <div className='fs-title'> for sale</div>
                        </div>
                        <div className='ml-cont'>
                            <div className="ml-img" />
                            <div className='ml-title'> my land</div>
                        </div>
                    </div> : ''
                }
            </React.Fragment>

        );
    }

    onHandleMouseOver = (tile) => {
        const { lands } = tile;
        if (lands && lands[0] && lands[0].user !== null) {
            if (lands[0].forbid === false) {
                this.setState({
                    toggleCertification: true
                })
            }
        }
    }


    onHandleShowCertificateImage = () => {
        this.setState({
            isOpenCertificateImage: true
        })
    };

    onHandleHideCertificateImage = () => {
        this.setState({
            isOpenCertificateImage: false,
            toggleCertification: false
        })
    };

    render() {

        let { isOpenLandCertificate, isOpenCertificateImage } = this.state;
        let { tile: { lands, quadKey, totalCount }, tile, lat, lng, zoom, user, myLands, syncCenterMap } = this.props;
        let clsName = '';
        let infoHtml = '';
        let position = [lat, lng];

        if (zoom !== 22) {
            infoHtml = this.createInfoLandLowerLv23(this.props);
            clsName = this.createClassLandLower22(this.props);

        } else {
            let otherLand = lands && lands.length > 0 && lands.reduce((otherLand, land) => {
                if (land.user) {
                    if (land.user._id === user._id)
                        otherLand.myLand += land.landCount;
                    else {
                        if (land.forSaleStatus === true)
                            otherLand.forSale += land.landCount;
                        else
                            otherLand.noSell += land.landCount;
                    }
                } else if (land.forbid) {
                    otherLand.forbid += land.landCount;
                }
                return otherLand;
            }, { noSell: 0, forSale: 0, forbid: 0, myLand: 0 });

            // // làm lại chỗ này no sell === ko có tại zoom khác 22
            const { noSell, forSale, forbid, myLand } = otherLand;
            const empty = totalCount - (noSell + forSale + forbid + myLand);
            const canBuy = forSale + empty ? forSale + empty : '';
            const canNotBuy = myLand + noSell ? myLand + noSell : '';
            clsName = this.createClassLand(this.props, { canBuy, canNotBuy })
        }

        let reactDetail = this.renderTileDetailHtml(clsName, infoHtml);

        let icon = L.divIcon({
            iconUrl: null,
            iconRetinaUrl: null,
            iconAnchor: null,
            popupAnchor: null,
            shadowUrl: null,
            shadowSize: null,
            shadowAnchor: null,
            iconSize: new L.Point(64, 64),
            className: 'tile-n' + clsName,
            html: ReactDOMServer.renderToString(reactDetail)
        });

        return (
            <React.Fragment>
                {isOpenLandCertificate && landCertificationPopup(isOpenLandCertificate, tile, myLands, this.onHandleHideLandCertificate, user, syncCenterMap, this.onHandleShowCertificateImage)}
                {isOpenCertificateImage && getCertificateAlertPopup(isOpenCertificateImage, tile, this.onHandleHideCertificateImage, user)}
                <Marker
                    position={position}
                    icon={icon}
                    onClick={this.tileClick}
                    // onMouseenter={e => {console.log("enter ne0")}}
                    // onMouseOver={e => {console.log("enter ne1")}}
                    // onMouseover = {e => this.onHandleMouseOver(tile)}
                    onMouseover={e => this.tileMouseEnter(tile)}
                    onMouseOut={e => this.tileMouseLeave()}
                // onMouseOver={e => {console.log("mouse over")}}
                >

                </Marker>
            </React.Fragment>
        )
    }
}


const mapStateToProps = state => {
    const { lands, authentication: { user }, map, alert, users, settingReducer, lands: { myLands } } = state;
    return {
        user, alert, lands, map, users, settingReducer, myLands
    };
}

const mapDispatchToProps = (dispatch) => ({
    getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
    syncCenterMap: (center, zoom, centerQuadkey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey)),
    addSelected: (multiSelectSave) => dispatch(mapActions.addSelected(multiSelectSave)),
    getAllLand: (param) => dispatch(landActions.getAllLand(param)),
    selectMode: (mode) => dispatch(mapActions.selectMode(mode)),
    clearSelected: () => dispatch(mapActions.clearSelected())
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaftMap);




