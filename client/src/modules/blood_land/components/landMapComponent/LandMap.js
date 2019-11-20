import React, {Component} from 'react';
import GoogleMap from 'google-map-react';
import update from 'immutability-helper';
import connect from "react-redux/es/connect/connect";
import {mapActions} from "../../../../store/actions/commonActions/mapActions";
import _ from 'lodash';
import {
    calculatorLand,
    checkInCountry,
} from './component/MapFunction';
import {
    LatLongToTileXY,
    TileXYToLatLong,
    TileXYToQuadKey,
} from '../general/System';
import { landActions, screenActions } from '../../../../helpers/importModule'
import {
    MAX_ZOOM,
    DEFAULT_LEVEL_OFFSET,
    MAX_ZOOM_SELECTED_TILE,
    MIN_ZOOM_SELECTED_TILE,
    PARENT_1_RANGE,
    PARENT_2_RANGE,
    dBug,
} from '../../../../helpers/constants';
import { newVersionUI } from "../../../../helpers/config";
import LandTileComponent from './component/LandTileComponent';
import MarkerLandMark from './component/MarkerLandMark';

async function getFisrtLocation(){
    
    const lat = localStorage.getItem('lat');
    const lng = localStorage.getItem('lng');
    const syncMapCenter = localStorage && lat && lng && [parseFloat(lat), parseFloat(lng)];
    //console.log('syncMapCenter', syncMapCenter);
    if(syncMapCenter && syncMapCenter[0] && syncMapCenter[1]) return syncMapCenter;

    const curentCenter = await getCurrentLocation();
    if(curentCenter && curentCenter[0] && curentCenter[1]) return curentCenter;

    const DEFAULT_CENTER = [37.566535, 126.9779692];
    return DEFAULT_CENTER;

    async function getCurrentLocation(){
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    if(position && position.coords && position.coords.latitude && position.coords.longitude) resolve([position.coords.latitude, position.coords.longitude]);
                    resolve(null);
                },
                error => {
                    //console.log("can't getCurrentPosition!!");
                    resolve(null);
                }
            );
        })
    }
}

class LandMap extends Component {
    state = {
        center: null,// [37.566535, 126.9779692],// {lat: 38.30394763084891, lng: 127.51487731933594}
        zoom: null,
        size: null,
        bounds: null,
        map: null,
        tiles: [],
        selectedTiles: [],
        selectMode: "single", //none, single, multi, clear, line, fill
        multiSelectStart: null,
        multiSelectSave: [],
        multiClearSave: [],
        centerQuadKey: null,
        firstLoad: true,
    };

    //gọi khi map move hoặc zoom
    _onChange = async ({center, zoom, bounds}) => {
        if(dBug) {console.log('run _onChange');}
        //return if param not exist
        if(!center || !zoom || zoom > MAX_ZOOM || !bounds) return;

        localStorage.setItem('lat', center.lat );
        localStorage.setItem('lng', center.lng );
        const { selectedTiles } = this.state;
        if(this.state.firstLoad) {
            //tạo ra tiles
            const tiles = this.drawTiles({ zoom, bounds, selectedTiles, dBugPlace: "_onChange firstLoad" });
            //set state, thay đổi tiles hiện tại và sẽ render lại tiles
            this.setState({ tiles, zoom, bounds, firstLoad: false });
        }

        if(zoom !== this.state.zoom){
            const tiles = this.drawTiles({ zoom, bounds, selectedTiles: [], dBugPlace: "_onChange zoom change" });
            //set state, thay đổi tiles hiện tại và sẽ render lại tiles
            this.setState({ tiles, zoom, bounds, selectedTiles: [] });
            //clear selected when zoom
            this.props.clearSelected();
        }

        // //get area Land
        // this.getParticalLands({ bounds, zoom });
        //cập nhật lại vị trí hiện tại
        this.props.syncCenterMap(center, zoom);
    };

    async componentDidMount() {
        const {user: {_id}} = this.props;
        let {center, zoom} = this.props.dataMap;
        if(this.props.map.center){ //sync from redux
            center = this.props.map.center;
        } else {
            center = await getFisrtLocation();
        }
        //load tất cả land của 1 user khi đã render xong map
        this.props.getAllLandById(_id);
        //setState trạng thái load của map, quadKey center, zoom hiện tại
        this.setState({ loaded: true, center, zoom });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // cập nhật land được chọn
        // cập nhật trạng thái mới của land được chọn, nếu mode từ props mới là clear thì xóa luôn những land đang chọn = rỗng
        // còn không thì cập nhật land được chọn ( chọn từng ô hoặc từng vùng )
        if(this.state.loaded && this.props.map.mode && this.props.map.mode !== this.state.selectMode){
            const {zoom, bounds, selectedTiles} = this.state;
            if(bounds && zoom){
                let tiles = this.drawTiles({ zoom, bounds, selectedTiles, dBugPlace: "componentDidUpdate changeMode" });
                this.setState({ tiles, selectMode: this.props.map.mode, selectedTiles, multiSelectStart: null/*, multiClearStart: null*/ });
            }
        }

        //update tiles when seleted change
        const { selected } = this.props.map;
        if(this.state.loaded && !_.isEqual(prevProps.map.selected, selected)){
            //console.log('change prevProps.map.selected, selected');
            this.props.getLandByQuadKeys({ userId: this.props.user._id, quadKeys: selected.map(tile => tile.quadKey) });

            // if(dBug) console.log('state seleted change');
            // const {zoom, bounds} = this.state;
            // if(bounds && zoom) {
            //     //console.log('change selected, this.state.selectedTiles');
            //     const tiles = this.drawTiles({zoom, bounds, selectedTiles: selected, dBugPlace: "componentDidUpdate change selected"});
            //     this.setState({tiles, selectedTiles: selected});
            // }
        }

        if(this.state.loaded && !_.isEqual(selected, this.state.selectedTiles)) {
            if(dBug) console.log('state seleted change');
            const {zoom, bounds} = this.state;
            if(bounds && zoom) {
                //console.log('change selected, this.state.selectedTiles');
                const tiles = this.drawTiles({zoom, bounds, selectedTiles: selected, dBugPlace: "componentDidUpdate change selected"});
                this.setState({tiles, selectedTiles: selected});
            }
        }

        //update center
        const { centerQuadKey, center } = this.props.map;
        if(!_.isEqual(prevProps.map.center, center)){
            if(prevProps.map.centerQuadKey !== centerQuadKey){ //go to center quadKey
                this.setState({ centerQuadKey, center })
            } else { //change center in minimap
                this.setState({ center })
            }
        }

        //update tile when allLands change
        const { allLands } = this.props.lands;
        if(!_.isEqual(prevProps.lands.allLands, allLands)){
            //console.log('allLands');
            const {zoom, bounds} = this.state;
            const tiles = this.drawTiles({zoom, bounds, selectedTiles: this.props.map.selected, dBugPlace: "componentDidUpdate change allLands"});
            this.setState({ tiles });
        }
    }

    getParticalLands({bounds, zoom}) {
        if(dBug) console.log('getParticalLands');
        const level = zoom + DEFAULT_LEVEL_OFFSET;
        //gọi request lấy những land trong database
        let beginTile = LatLongToTileXY(bounds.ne.lat, bounds.sw.lng, level);
        let endTile = LatLongToTileXY(bounds.sw.lat, bounds.ne.lng, level);

        let arrQK = [];
        for (let x = beginTile.x; x <= endTile.x; x++) {
            for (let y = beginTile.y; y <= endTile.y; y++) {
                arrQK.push(TileXYToQuadKey(x, y, level));
            }
        }
        let parents1 = _.uniq(arrQK.map(qk => qk.substr(0, level - PARENT_1_RANGE)));
        let parents2 = _.uniq(arrQK.map(qk => qk.substr(0, level - PARENT_2_RANGE)));
        this.props.getAreaLand({parents1, parents2, level, role: this.props.user ? this.props.user.role : 'user'});
    }

    getZoomBounds = (map) => {
        //trả ra 4 cặp latlng của 4 góc theo màn hình
        if (!map) return;
        const newCenter = map.getCenter();
        const zoom = map.getZoom();
        const b = map.getBounds();
        const ne = b.getNorthEast();
        const sw = b.getSouthWest();
        const bounds = {
            ne: {lat: ne.lat(), lng: ne.lng()},
            nw: {lat: ne.lat(), lng: sw.lng()},
            se: {lat: sw.lat(), lng: ne.lng()},
            sw: {lat: sw.lat(), lng: sw.lng()},
        };
        return {
            zoom,
            bounds,
            level: zoom + DEFAULT_LEVEL_OFFSET,
            center: { lat: newCenter.lat(), lng: newCenter.lng()} };
    };

    _onGoogleApiLoaded = ({map, maps}) => {
        if(!map || !maps) return;
        //event load map và setState map vào component
        this.setState({map});
        //disable double right click => Zoom
        map.addListener('rightclick', (e) => {
            e.stop();
        })

        map.addListener('idle', (e) => {
            if (this.state.map) {
                const {zoom, bounds} = this.getZoomBounds(this.state.map);
                //console.log('zoom', zoom);
                if (this.props.map.zoom && zoom === this.props.map.zoom) {
                    const { selectedTiles } = this.state;
                    //tạo tile
                    const tiles = this.drawTiles({ zoom, bounds, selectedTiles, dBugPlace: "idle" });
                    //set tiles và sẽ render lại
                    this.setState({ tiles, zoom, bounds });
                }
                
                // _.debounce(() => {
                //     console.log('bounds', bounds);
                //     console.log('zoom',zoom)
                this.getParticalLands({ bounds, zoom })
                // }, 300);
            }
        })

        map.addListener('zoom_changed', (e) => {
            //tạo hiệu ứng xóa lưới khi vừa zoom xong
            this.setState({tiles: [], multiSelectStart: null/*, multiClearStart: null*/});
            //remove tooltip hover selected
            this.props.removePopup({name: "showTotalBlood"});

        });

        map.addListener('dragstart', () => {
            //sự kiện kéo map, set 1 biến flag để chặn hiệu ứng thừa
            this.setState({isDragging: true});
            if(this.props.screens['ContextMenu']) {
                this.props.removePopup({name: "ContextMenu"});
            }
        });

        map.addListener('dragend', () => {
            // if (this.state.map) {
            //     const {zoom, bounds} = this.getZoomBounds(map);
            //     if (this.props.map.zoom && zoom === this.props.map.zoom) {
            //         const { selectedTiles, center } = this.state;
            //         //tạo tile
            //         const tiles = this.drawTiles({ zoom, bounds, selectedTiles, dBugPlace: "dragend" });
            //         //set tiles và sẽ render lại
            //         this.setState({ tiles, zoom, bounds });
            //     }
            // }
            //sự kiện sau khi kéo map, set lại biến flag
            setTimeout(() => {
                this.setState({isDragging: false});
            }, 100)
        });



        // let maxZoomService = new maps.MaxZoomService();
        // map.addListener('click', showMaxZoom);

        // function showMaxZoom(e) {
        //     console.log('click ==> ')
        //   maxZoomService.getMaxZoomAtLatLng(e.latLng, function(response) {
        //     if (response.status !== 'OK') {
        //         console.log('Error in MaxZoomService')
        //     } else {
        //       console.log('The maximum zoom at this location is: ' + response.zoom);
        //     }
        //   });
        // }
        

    };

    createTile = (x, y, level, lands, selectedTiles) => {
        const { centerQuadKey } = this.props.map;
        const { openCountries=[], landmarks, defaultLandPrice=0 } = this.props.lands;
        //hàm tạo ra 1 tile dựa vào các thông tin sau
        //lấy quadKey từ x,y,level
        let tileQuadKey = TileXYToQuadKey(x, y, level);
        //lấy latlng từ x,y,level
        let tileLatLng = TileXYToLatLong(x, y, level);
        //khao báo tile object
        let tile = {x, y, level, latlng: tileLatLng, quadKey: tileQuadKey};
        //BOOLEAN trạng thái selected của 1 tile, nếu quadKey của tile này thuộc state selectedTiles của component thì TRUE, else FALSE
        tile.selected = _.isArray(selectedTiles) && selectedTiles.some(t => tile.quadKey === t.quadKey);
        //BOOLEAN trạng thái forbid của 1 tile từ function checkInCountry
        const forbid = !checkInCountry({ latlng: tileLatLng, openCountries });
        //BOOLEAN trạng thái cho biết 1 tile có phải là center hay ko
        tile.isCenter = tileQuadKey === centerQuadKey;
        //BOOLEAN trạng thái cho biết 1 tile có phải là landmark hay ko
        tile.landmark = _.isArray(landmarks) && landmarks.some(lm => lm.centerQuadKey.indexOf(tileQuadKey) === 0);
        const totalCount = calculatorLand(tile.quadKey.length);
        //đếm số land có tồn tại trên 1 tile ( khi zoom lên các tầng trên )
        tile.totalCount = totalCount;
        //nếu lands có giá trị ( đất trong database )
        if (lands) {
            //tìm và set giá trị 1 land nếu land này có đang nằm trong những tiles hiển thị trên màn hình
            let fLand = lands.find(land => tile && tile.quadKey.indexOf(land.quadKey) === 0);
            if (fLand) {
                //set giá trị cho 1 land
                tile.lands = [{
                    forbid: forbid || fLand.forbidStatus,
                    landmark: fLand.user && fLand.user.role && fLand.user.role === 'manager',//fLand.forbidStatus,
                    forSaleStatus: fLand.forSaleStatus,
                    user: fLand.user,
                    quadKey: fLand.quadKey,
                    sellPrice: fLand.sellPrice
                }]

                tile.land = {
                    forbid: forbid || fLand.forbidStatus,
                    landmark: fLand.user && fLand.user.role && fLand.user.role === 'manager',//fLand.forbidStatus,
                    forSaleStatus: fLand.forSaleStatus,
                    user: fLand.user,
                    quadKey: fLand.quadKey,
                    sellPrice: fLand.sellPrice
                }
            } else {
                //set 1 tile chỉ có 1 land
                tile.lands = [{
                    empty: true,
                    forbid: forbid || false,
                    landmark: false,
                    forSaleStatus: null,
                    user: null,
                    quadKey: tileQuadKey,
                    sellPrice: defaultLandPrice
                }];
                tile.land = {
                    empty: true,
                    forbid: forbid || false,
                    landmark: false,
                    forSaleStatus: null,
                    user: null,
                    quadKey: tileQuadKey,
                    sellPrice: defaultLandPrice
                }
            }
            return tile;
        }
    }

    createTileLower22 = (x, y, level, lands, selectedTiles) => {
        const { openCountries=[] } = this.props.lands;
        //tạo tile nếu khác tầng cuối cùng
        //lấy quadkey từ x,y,level
        let tileQuadKey = TileXYToQuadKey(x, y, level);
        //lấy latlng từ x,y,level
        let tileLatLng = TileXYToLatLong(x, y, level);
        //tạo tile object
        let tile = {x, y, level, latlng: tileLatLng, quadKey: tileQuadKey};

        //tính tổng số land có bên trên của 1 tile
        const totalCount = calculatorLand(tile.quadKey.length);

        tile.totalCount = totalCount;
        //tile.forbid = !checkInCountry(tileLatLng);
        //BOOLEAN trạng thái 1 tile có phải là forbid hay ko
        tile.forbid = !checkInCountry({ latlng: tileLatLng, openCountries });
        //BOOLEAN trạng thái 1 tile có đang được select hay ko ? ( kiểm tra từ state selectedTiles )
        tile.selected = _.isArray(selectedTiles) && selectedTiles.some(t => tile.quadKey === t.quadKey);
        //BOOLEAN trạng thái 1 tile có phải là landmark hay ko ?
        tile.landmark = this.props.lands.landmarks && this.props.lands.landmarks.length > 0 && this.props.lands.landmarks.some(lm => lm.centerQuadKey.indexOf(tileQuadKey) === 0);
        let fLand = lands.find(land => land.quadKey === tile.quadKey);
        //tạo thông tin số đất được mua, số đất không đc mua, số landmark của 1 tile ( khác tầng cuối cùng )
        if (fLand) {
            tile.canBuy = totalCount - fLand.count;
            tile.canNotBuy = fLand.count;
            tile.landmarkCount = fLand.landmarkCount || 0;
        } else {
            tile.empty = true;
        }
        return tile;
    }

    createArrayTile({beginTile, endTile, level, lands, selectedTiles}) {
        //tạo ra nhiều tiles , được gọi trong function drawTiles
        const MAX_LEVEL = 24;
        let arrTile = [];
        for (let x = beginTile.x; x <= endTile.x; x++) {
            for (let y = beginTile.y; y <= endTile.y; y++) {
                if(level === MAX_LEVEL) arrTile.push(this.createTile(x, y, level, lands, selectedTiles));
                else arrTile.push(this.createTileLower22(x, y, level, lands, selectedTiles));
            }
        }
        return arrTile;
    }

    startAndEndBounds = ({level, beginTile, endTile}) => {
        if (beginTile.x > endTile.x) {
            let tmpEndTile = 127;
            if (level > 7) {
                tmpEndTile = 2 ** level - 1;
            }
            return [{ //split end chunk
                beginTile: {x: beginTile.x, y: beginTile.y},
                endTile: {x: tmpEndTile, y: endTile.y}
            }, { //split start chunk
                beginTile: {x: 0, y: beginTile.y},
                endTile: {x: endTile.x, y: endTile.y}
            }]
        } else {
            return [{beginTile, endTile}];
        }
    };

    drawTiles = ({zoom, bounds, selectedTiles, dBugPlace}) => {
        const lands = this.props.lands.allLands || [];
        selectedTiles = selectedTiles || [];
        if(dBug) {console.log('drawTiles ==>', dBugPlace, zoom);}
        //console.log('lands', lands);
        //tạo biến level
        const level = zoom + DEFAULT_LEVEL_OFFSET;
        //tạo tile với tọa độ x,y từ latlng góc trái trên
        let beginTile = bounds && LatLongToTileXY(bounds.ne.lat, bounds.sw.lng, level);
        //tạo tile với tọa độ x,y từ latlng góc phải dưới
        let endTile = bounds && LatLongToTileXY(bounds.sw.lat, bounds.ne.lng, level);

        beginTile = {x: beginTile.x, y: beginTile.y};
        endTile = {x: endTile.x, y: endTile.y};

        //ARRAY trường hợp đi hết 1 vòng trái đất, tách ra 2 loại lưới,
        let arrStartEnd = this.startAndEndBounds({level, beginTile, endTile});
        //tạo tiles
        return arrStartEnd.reduce((total, {beginTile, endTile}) => total.concat(this.createArrayTile({ beginTile, endTile, level, lands, selectedTiles })), []);
    }

    //sự kiện tile click
    tileClick(tile) {
        //console.log('this.state.zoom', this.state.zoom);
        //chỉ cho phép click chọn tile nếu tile có giá lớn hơn 0 đồng
        const {lands, user, screens} = this.props;
        //không cho click nếu không phải tầng cuối cùng
        if(newVersionUI){
            if (this.state.zoom < MIN_ZOOM_SELECTED_TILE) return;
        } else {
            if (this.state.zoom < MAX_ZOOM_SELECTED_TILE) return;
        }

        //không cho click nếu ko có 1 miếng đất có giá lớn hơn 0
        if (!lands || lands.landPriceLoading) return;
        //không cho click land forbid
        if (tile && tile.lands && tile.lands.length > 0 && tile.lands.some(land => tile.quadKey.indexOf(land.quadKey) === 0 && land.forbid)) return;    //limit don't click to Forbid Tile
        //không cho admin click land nếu đất đó thuộc người khác
        if (user && user.role && user.role === 'manager' && tile && tile.lands && tile.lands.length > 0 && tile.lands.some(land => land.user !== null)) return;   //limit admin don't click to Partical or Other land

        if(this.state.selectMode === "zoomSelect") {
            //console.log('this.state.selectMode', this.state.selectMode);

        } else if(this.state.selectMode === "single") {
            const { selectedTiles } = this.state;
            //remove popup rightClick
            if(screens["ContextMenu"]) this.props.removePopup({name : "ContextMenu"});
            //chọn từng ô
            //chọn vị trí của tile mà bạn đã click
            const selectedIndex = this.state.tiles.findIndex(t => t.quadKey === tile.quadKey);
            //nếu ô này chưa được chọn
            if (this.state.tiles[selectedIndex].selected === false) {
                //nếu không có đang kéo màn hình
                if (!this.state.isDragging) {
                    //show popup buy land
                    const newTiles = _.cloneDeep(this.state.tiles);
                    newTiles[selectedIndex].selected = true;
                    let newSelectedTiles = update((selectedTiles || []), {$push: [newTiles[selectedIndex]]});
                    this.setState({tiles: newTiles, selectedTiles: newSelectedTiles});
                    this.props.addSelected(newSelectedTiles);
                    this.props.addPopup({name : "showTotalBlood", data: { isClick: true }});
                }
            } else { //nếu ô này đã được chọn
                //remove tooltip detailSelectedLand
                this.props.removePopup( {name: "showTotalBlood"} )
                const { tiles, selectedTiles } = this.state;
                const newTiles = [...tiles];
                newTiles[selectedIndex].selected = false;
                const slTIndex = selectedTiles.findIndex(t => t.quadKey === tile.quadKey);
                let newSelectedTiles = update(selectedTiles, {$splice: [[slTIndex, 1]]});

                this.setState({tiles: newTiles, selectedTiles: newSelectedTiles});
                this.props.addSelected(newSelectedTiles);
            }
        } else if (this.state.selectMode === "multi") {
            //remove popup rightClick
            this.props.removePopup({name : "ContextMenu"});
            //Chọn từng vùng
            //nếu state khởi đầu null , bắt đầu chọn
            if (this.state.multiSelectStart === null) {
                //set state tile khởi đầu
                if (!this.state.isDragging) {
                    this.setState({multiSelectStart: tile});
                }
            } else {
                //state khởi đầu khác null, chọn xong và set state selected
                this.setState({ multiSelectStart: null, multiClearSave: [], multiSelectSave: [], selectedTiles: this.state.multiSelectSave });
                this.props.addSelected(this.state.multiSelectSave);
            }
        }
    }


    tileMouseEnter(tileEnd, e) {
        //hiệu ứng hover
        if(newVersionUI){
            if(this.state.zoom < MIN_ZOOM_SELECTED_TILE) return; //don't click when lower zoom 19
        } else {
            if(this.state.zoom < MAX_ZOOM_SELECTED_TILE) return; //don't click when lower zoom 22
        }

        const { selectedTiles=[], multiSelectStart, multiClearSave=[], tiles } = this.state;
        if(this.state.selectMode !== "multi" || !multiSelectStart) return;
        //nếu đang hover mà trạng thái chọn 1 vùng
        //set trạng thái selected true từ ô bắt đầu + ô đang hover ( vẽ hình vuông theo tọa độ x,y)
        //let rm = [];
        const tileStart = multiSelectStart;
        const newTiles = _.cloneDeep(tiles).map(t => {
            if ((t.x <= tileStart.x && t.x >= tileEnd.x && t.y <= tileStart.y && t.y >= tileEnd.y)
                || (t.x <= tileStart.x && t.x >= tileEnd.x && t.y <= tileEnd.y && t.y >= tileStart.y)
                || (t.x <= tileEnd.x && t.x >= tileStart.x && t.y <= tileStart.y && t.y >= tileEnd.y)
                || (t.x <= tileEnd.x && t.x >= tileStart.x && t.y <= tileEnd.y && t.y >= tileStart.y)
            ){
                if (t.selected){
                    if(selectedTiles.some(tile => tile.quadKey === t.quadKey)){
                        t.selected = false;
                        if(!multiClearSave.some(tile => tile.quadKey === t.quadKey)){
                            multiClearSave.push(t);
                        }
                    }
                } else {
                    if(!multiClearSave.some(tile => tile.quadKey === t.quadKey)){
                        t.selected = true
                    }
                }
            } else {
                if (t.selected){
                    if(!selectedTiles.some(tile => tile.quadKey === t.quadKey)){
                        t.selected = false;
                    }
                } else { //t.selected=false
                    const iTile = multiClearSave.findIndex(tile => tile.quadKey === t.quadKey);
                    if(iTile !== -1){
                        t.selected = true
                        multiClearSave.splice(iTile, 1);
                    }
                }
            }
            return t;
        })
        const newtileChecked = newTiles.filter(t => t.selected);
        this.setState({tiles: newTiles, multiSelectSave: newtileChecked});
    }

    render() {
        const { lands: { landmarks }, landInfo , loadingLandAction} = this.props;
        const { tiles, center, zoom} = this.state;
        return (
           <GoogleMap
                center={center}
                zoom={zoom}
                bootstrapURLKeys={{
                    key: process.env.NODE_ENV === 'production' ? 'AIzaSyDOh8D1GMQ_Uxq3NwSXIkvM-ZUS8PgI-Ts' : 'AIzaSyDmkJ8gIsSaSMACE2oFXBkJbuMAs-8Jvcs',
                    language: 'kr',
                    region: 'KR',
                    v: 3.38,
                    //libraries: "geometry,drawing,places"
                }}
                heatmapLibrary={true}
                //heatmap={heatMapData}
                onGoogleApiLoaded={this._onGoogleApiLoaded}
                onChange={this._onChange}
                yesIWantToUseGoogleMapApiInternals
                options={{
                    fullscreenControl: false,
                    disableDoubleClickZoom: true,
                    minZoom: 5,
                    maxZoom: 22,
                    keyboardShortcuts: false,
                    //debounced: true
                }}>
                {tiles.map((item) => {
                    return  <LandTileComponent
                        key={item.quadKey}
                        lat={item.latlng.lat}
                        lng={item.latlng.lng}
                        tile={item}
                        mainMap={this.state}
                        user={this.props.user}
                        tileClick={() => this.tileClick(item)}
                        tileMouseEnter={() => this.tileMouseEnter(item)}
                        isDragging={this.state.isDragging}
                        setMultiSelectStart={() => this.setState({ multiSelectStart: null/*, multiClearStart: null*/ })}
                        landInfo={landInfo}
                    />;
                })}
                { landmarks && landmarks.map((landmark, key) => <MarkerLandMark key={key} lat={landmark.center.lat} lng={landmark.center.lng} landmark={landmark} />) }
            </GoogleMap>
        );
    }
}

const mapStateToProps = (state) => {
    const {lands, authentication: {user}, map, alert, users, settingReducer, lands: {myLands, areaLand,landInfo , loadingLandAction}, screens} = state;
    return {
        user, alert, lands, map, users, settingReducer, myLands , areaLand, landInfo, screens, loadingLandAction
    };
};

const mapDispatchToProps = (dispatch) => ({
    getLandByQuadKeys: (param) => dispatch(landActions.getLandByQuadKeys(param)),
    getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
    syncCenterMap: (center, zoom, centerQuadkey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey)),
    addSelected: (selected) => dispatch(mapActions.addSelected(selected)),
    selectMode: (mode) => dispatch(mapActions.selectMode(mode)),
    clearSelected: () => dispatch(mapActions.clearSelected()),
    getAreaLand: (param) => dispatch(landActions.getAreaLand(param)),
    getLandInfo: (quadKey) => dispatch(landActions.getLandInfo({quadKey})),
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LandMap);
