import React, {PureComponent} from 'react';
import GoogleMap from 'google-map-react';
import update from 'immutability-helper';
import connect from "react-redux/es/connect/connect";
import * as f from "./component/GameMapFunction";
import GameMapRender from "./component/GameMapRender";
import {alertPopup} from "./component/A&PSchema";
import { splitLand} from "../landMapComponent/component/MapFunction";
import {
    screenActions, mapGameAction, userActions, inventoryActions, landActions, objectsActions, mapActions
} from "../../../../helpers/importModule";
import { uniqBy, isNull, isUndefined, intersectionBy, isEqual } from 'lodash';
import { newVersionUI } from '../../../../helpers/config';


//Minh Tri
//Modified  6/Aug/2019
class GameMap extends PureComponent {
    state = {
        selectMode: "single", //none, single, multi, clear
        currentPopup: alertPopup.noPopup,
        checkTreeInterval: null,
        multiSelectStart: null,
        firstLoad: true,
        selectedTiles: []
    };

    static getDerivedStateFromProps(props, state) {
        if (props.lands.allLands && !isEqual(props.lands.allLands, state.lands)) {
            if (props.lands.isOwn) {
                return {landsUpdated: true};
            }
            return {lands: props.lands.allLands}
        }
        const {center, zoom, centerQuadKey, centerChange} = props.map;
        if (center) {
            if (zoom) {
                if (centerQuadKey) {
                    return {center, zoom, centerQuadKey, centerChange};
                }
                return {center, zoom, centerChange};
            }
            return {center, centerChange};
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {lands, centerQuadKey, map} = this.state;
        if (prevProps.characterData !== this.props.characterData) {
            const {characterData, lands, user, objectArea} = this.props;
            const arrayTileEffect = this.createBitaminTile();

            if (characterData) {
                f.addCharacterToMap(characterData, lands, user, this.handleShowPopup, objectArea, arrayTileEffect);
            }
        }
        if (prevProps.itemData !== this.props.itemData) {
            const {itemData, lands, user, objectArea, wallet, itemInventory, addPopup} = this.props;
            if (itemData) {
                const itemFind = itemInventory && itemInventory.find(shop => shop.itemId === itemData.itemId);
                if (itemData.itemId === 'I03' || itemFind.quantity > 0) {
                    f.usingItemForTree(itemData, lands, user, addPopup, objectArea, this.handleShowAlert , this.handleShowPopup)
                } else {
                    const {info} = wallet;
                    if (info.goldBlood - itemFind.price < 0) {
                        addPopup({name: 'rechargeAlertPopup'});
                    } else {
                        f.usingItemForTree(itemData, lands, user, addPopup, objectArea, this.handleShowAlert, this.handleShowPopup)
                    }
                }

            }
        }

        if (prevProps.plantingResult !== this.props.plantingResult) {
            if (this.props.plantingResult ) {
                const {plantingResult: {status}, addPopup , user , screens} = this.props;
                if(screens.LoadingPopup && screens.LoadingPopup.mode && screens.LoadingPopup.mode === 'moveTreeToMap'){
                    if (status ) {
                        setTimeout(() => {
                            addPopup({ name: 'PlantingTreeSuccessAlert', close: "LoadingPopup" });
                        }, 500);

                        f.getParticleLands(map, this.props.getAreaObject, user , this.props.getAreaLand );
                        this.props.clearPlantedTreesResult()
                    } else {
                        addPopup({ name: 'DroppingTreeUnsuccessAlert' });
                        this.props.clearPlantedTreesResult()
                    }
                }

            }
        }

        if (prevProps.usingResult !== this.props.usingResult) {
            if (this.props.usingResult) {
                const {usingResult: {status}, addPopup, user, screens} = this.props;
                if(screens.LoadingPopup && screens.LoadingPopup.mode && screens.LoadingPopup.mode === 'moveItemToMap'){
                    if (status) {
                        setTimeout(() => {
                            addPopup({ name: 'UseItemSuccessAlert', close: 'LoadingPopup' });
                        }, 500);
                        this.props.clearSuccessError();

                        f.getParticleLands(map, this.props.getAreaObject, user , this.props.getAreaLand );
                    } else {
                        addPopup({ name: 'UseItemFailureAlert', close: 'LoadingPopup' });
                        this.props.clearSuccessError();
                    }
                }

            }
        }
        //plant tree
        if (!isUndefined(this.props.plantStatus)) {
            this.props.clearMoveTreeToMap();
        }

        if(this.state.map){
            if (this.state.loaded && this.props.map.mode && this.props.map.mode !== this.state.selectMode) {
                const {selectedTiles} = this.state;
                const {zoom, bounds} = f.getZoomBounds(map);
                const {
                    lands: { openCountriesLoading, openCountries },
                    map: {  }
                } = this.props;
                let newSelectedTiles = this.props.map.mode === "clear" ? [] : selectedTiles;
                if (typeof bounds !== 'undefined' && !isNull(bounds)) {
                    const drawTilesParam = {
                        zoom,
                        bounds,
                        lands: lands || [],
                        selected: newSelectedTiles,
                        centerQuadKey,
                        openCountriesLoading,
                        openCountries
                    };
                    let tiles = f.drawTiles(drawTilesParam);
                    this.setState({
                        tiles,
                        // landsUpdated: false,
                        selectMode: this.props.map.mode,
                        selectedTiles: newSelectedTiles,
                        multiSelectStart: null,
                        multiClearStart: null
                    });
                }
            }

            if (this.state.loaded && this.props.map.selected && !isEqual(this.props.map.selected, this.state.selectedTiles)) {
                const {lands} = this.state;
                const {zoom, bounds} = f.getZoomBounds(map);
                const {
                    lands: { openCountriesLoading, openCountries },
                    map: { selected }
                } = this.props;
                if (typeof bounds !== 'undefined' && !isNull(bounds)) {
                    const drawTilesParam = {
                        zoom,
                        bounds,
                        lands: lands || [],
                        selected,
                        centerQuadKey,
                        openCountriesLoading,
                        openCountries
                    };
                    const tiles = f.drawTiles(drawTilesParam);
                    this.setState({tiles, selectedTiles: this.props.map.selected});
                }
            }
        }


    }

    //show alert and popup
    handleShowAlert = (status) => {
        this.setState({
            currentPopup: status
        });
    };
    handleShowPopup = (status) => {
        const {user} = status;
        const {...s} = status;
        const {itemInventory , addPopup } = this.props;
        if(s.checkNotMyLand){
            addPopup({ name:'PlantTreeOnOtherUserLand' });
        } else if (s.checkForSaleStatus) {
            addPopup({name:'PlantTreeOnForSaleLandAlert'})
        }else if(s.checkAlreadyHaveTree) {
            addPopup({name:'ExistTreeAlert'});
        }else {
            if (s.checkLand) {
                if (s.characterData) {
                    const plantData = {characterData: s.characterData, user};
                    const arrayTileEffect = this.createBitaminTile();
                    addPopup({ name: 'ConfirmPlantingTree', data: { plantData, arrayTileEffect } });
                } else if (s.itemData) {
                    const {checkLand: {checkLimitNutritionResult}} = status;
                    if (checkLimitNutritionResult) {
                        addPopup({name: 'UseLimitedItemAlert'});
                    } else {
                        const usingItemData = {itemData: s.itemData, user, objectId: s.objectId};
                        if (s.itemData.itemId === "I03") {
                            addPopup({ name: 'UsingItemForTreeConfirm', data: { usingItemData }, close: "PlantCultivationComponent" });
                        } else {
                            const itemInventoryFindItem = itemInventory.find(item => item.itemId === s.itemData.itemId);
                            if (itemInventoryFindItem.quantity === 0) {
                                addPopup({ name: 'UsingItemByBloodForTreeConfirm', data: { usingItemData }, close: "PlantCultivationComponent" });
                            } else {
                                addPopup({ name: 'UsingItemForTreeConfirm', data: { usingItemData }, close: "PlantCultivationComponent" });
                            }
                        }
                    }
                } else {
                    addPopup({ name: 'DroppingTreeUnsuccessAlert' });
                }
            } else { addPopup({ name: 'PlantTreeOnOtherUserLand' });}
        }

    };




    componentWillUnmount = () => {
        clearInterval(this.state.checkTreeInterval);
    };

    // =========================================
    componentDidMount() {
        const {user: {wToken, _id}} = this.props;
        // Minh tri
        // Update param - 6/4/19
        // ========================================
        this.props.getAllLandById(_id);
        this.setState({loaded: true});
        this.props.getWalletInfo({wToken});
    }


    onHandleSetState = (map) => {
        const {lands, centerQuadKey} = this.state;
        const {zoom, bounds} = f.getZoomBounds(map);
        const {
            lands: { openCountriesLoading, openCountries },
            map: { selected }
        } = this.props;
        const drawTilesParam = {
            zoom,
            bounds,
            lands: lands || [],
            selected: selected || [],
            centerQuadKey,
            openCountriesLoading,
            openCountries
        };

        const tiles = f.drawTiles(drawTilesParam);
        this.setState({tileLoaded: true, landsUpdated: false, tiles, zoom, bounds});
    };

    _onGoogleApiLoaded = ({map}) => {
        if(!map) return;
        const {user, getAreaObject, getAreaLand} = this.props;
        this.setState({map});
        map.addListener('idle', () => {
            f.getParticleLands(map, getAreaObject, user, getAreaLand);
            this.onHandleSetState(map)

        });
        // map.addListener('bounds_changed', () => {
        //     this.onHandleSetState(map);
        // });
        map.addListener('dragstart', () => {
            this.setState({isDragging: true});
        });
        map.addListener('dragend', () => {
            setTimeout(() => {
                this.setState({isDragging: false});
            })
        });
    };

    createBitaminTile = () => {
        let {tiles} = this.state;
        const {quadKeyBitamin , objectArea , user: {_id} } = this.props;
        const bigTreeQuadKeys = objectArea ? (objectArea.reduce((totalQK, object) => object.bigTreeQuadKeys ? totalQK.concat(object.bigTreeQuadKeys) : totalQK, [])) : [];
        const createTileEffectParam = {quadKeyBitamin , tiles , objectArea , bigTreeQuadKeys , _id };
        return quadKeyBitamin && f.onHandleCreateTileEffect(createTileEffectParam);
    }
    _onChange = async ({center, zoom, bounds}) => {
        localStorage.setItem('lat', center.lat );
        localStorage.setItem('lng', center.lng );
        this.props.syncCenterMap(center, zoom);
    };

    tileClick = (tile) => {

        //disable click game map
        return null;
        //if(!newVersionUI) return;
        if (this.state.selectMode === "none") {
            if (this.state.multiClearStart === null) {
                if (!this.state.isDragging) {
                    this.setState({multiClearStart: tile});
                }
            } else {
                this.setState({multiClearStart: null, selectedTiles: this.state.multiSelectSave});
                this.props.addSelected(this.state.multiSelectSave);
            }
        } else if (this.state.selectMode === "multi") {
            //Chọn từng vùng
            //nếu state khởi đầu null , bắt đầu chọn
            if (this.state.multiSelectStart === null) {
                //set state tile khởi đầu
                if (!this.state.isDragging) {
                    this.setState({multiSelectStart: tile});
                }
            } else {
                //state khởi đầu khác null, chọn xong và set state selected
                this.setState({multiSelectStart: null, selectedTiles: this.state.multiSelectSave});
                this.props.addSelected(this.state.multiSelectSave);
            }
        } else {
            //chọn từng ô
            //chọn vị trí của tile mà bạn đã click
            const selectedIndex = this.state.tiles.findIndex(t => t.quadKey === tile.quadKey);
            //nếu ô này chưa được chọn
            if (this.state.tiles[selectedIndex].selected === false) {
                //nếu không có đang kéo màn hình
                if (!this.state.isDragging) {
                    //show popup buy land
                    const newTiles = [...this.state.tiles];
                    newTiles[selectedIndex].selected = true;
                    let newSelectedTiles = update(this.state.selectedTiles, {$push: [tile]});
                    this.setState({tiles: newTiles, selectedTiles: newSelectedTiles});
                    this.props.addSelected(newSelectedTiles);
                }
            } else { //nếu ô này đã được chọn
                const newTiles = [...this.state.tiles];
                newTiles[selectedIndex].selected = false;
                let newSelectedTiles = [...this.state.selectedTiles];
                const slTIndex = this.state.selectedTiles.findIndex(t => t.quadKey === tile.quadKey);
                if (slTIndex !== -1) { //equal level
                    newSelectedTiles = update(newSelectedTiles, {$splice: [[slTIndex, 1]]});
                } else { // lower level or higher
                    const lowerLevelIndex = this.state.selectedTiles.findIndex(t => tile.quadKey.indexOf(t.quadKey) === 0)
                    if (lowerLevelIndex !== -1) {
                        let parentTile = newSelectedTiles[lowerLevelIndex];
                        let arrSplitQuadkey = splitLand([parentTile.quadKey], tile.quadKey);
                        let splitTile = arrSplitQuadkey.map(qk => this.tileByQuadKey(qk));

                        newSelectedTiles.splice(lowerLevelIndex, 1);
                        newSelectedTiles = newSelectedTiles.concat(splitTile);
                    }
                }
                //remove under lever
                newSelectedTiles = newSelectedTiles.filter(t => t.quadKey.indexOf(tile.quadKey) !== 0);

                this.setState({tiles: newTiles, landsUpdated: true, selectedTiles: newSelectedTiles});
                this.props.addSelected(newSelectedTiles);
            }
        }
    }

    tileMouseEnter = (tileEnd)  => {
        if(!newVersionUI) return;
        //hiệu ứng hover
        let tileStart = null;
        if (this.state.selectMode === "none") {
            tileStart = this.state.multiClearStart;
        }  else if (this.state.selectMode === "multi") {
            //nếu đang hover mà trạng thái chọn 1 vùng
            //set trạng thái selected true từ ô bắt đầu + ô đang hover ( vẽ hình vuông theo tọa độ x,y)
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
                    //xóa các đất trùng nhau
                    newSelectedTiles = uniqBy([...arrTmp, ...this.state.selectedTiles], 'quadKey');
                } else if (this.state.selectMode === "none") {
                    newSelectedTiles = [...this.state.selectedTiles].filter(slTile => !arrTmp.some(tmp => slTile.quadKey.indexOf(tmp.quadKey) === 0));
                }
                //setState vẽ lại lưới
                if (typeof this.state.bounds !== 'undefined' && !isNull(this.state.bounds)) {
                    const {lands, centerQuadKey , map} = this.state;
                    const {zoom, bounds} = f.getZoomBounds(map);
                    const {
                        lands: { openCountriesLoading, openCountries },
                    } = this.props;
                    const drawTilesParam = {
                        zoom,
                        bounds,
                        lands: lands || [],
                        selected: newSelectedTiles,
                        centerQuadKey,
                        openCountriesLoading,
                        openCountries
                    };
                    const tiles = f.drawTiles(drawTilesParam);
                    this.setState({tiles: tiles, landsUpdated: false, multiSelectSave: newSelectedTiles});
                }
            }
        }
    }

    tileRightMouseClick = (item) => {
        const {selected} = item;
        const tmp = [];
        if(selected) {
            tmp.push(selected);
            if(tmp){
                this.props.addPopup({ name: "ContextMenuGame" });
            }
        }
        else{
            this.props.removePopup({ name: "ContextMenuGame" });
        }
    };
    renderMap = () => {
        let {center, isDragging, tiles} = this.state;
        const {lands: {allLands}, landSelected  , objectArea , user: {_id} } = this.props;
        const landsFilter = intersectionBy(allLands, tiles, 'quadKey');
        const arrayTileEffect = this.createBitaminTile();

        return (
            <GoogleMap
                center={center}
                zoom={22}
                bootstrapURLKeys={{
                    key: process.env.NODE_ENV === 'production' ? 'AIzaSyDOh8D1GMQ_Uxq3NwSXIkvM-ZUS8PgI-Ts' : 'AIzaSyDmkJ8gIsSaSMACE2oFXBkJbuMAs-8Jvcs',
                    language: 'kr',
                    region: 'KR',
                    v: "3.exp",
                    //libraries: "geometry,drawing,places"
                }}
                onChange={this._onChange}
                onGoogleApiLoaded={this._onGoogleApiLoaded}
                yesIWantToUseGoogleMapApiInternals
                options={{
                    fullscreenControl: false,
                    disableDoubleClickZoom: true,
                    scrollwheel: false,
                    zoomControl: false,
                    keyboardShortcuts: false,
                }}>
                {tiles && tiles.map((item) => {
                    let myLand = landsFilter && landsFilter.filter(i => i.quadKey === item.quadKey)[0];

                    let clsName = f.onRenderClassName(item, myLand, _id, arrayTileEffect, landSelected);

                    const {latlng: {lat, lng}, quadKey} = item;
                    return (
                         <f.SingleTile
                            key={quadKey}
                            lat={lat} lng={lng}
                            quadKey={quadKey} className={clsName}
                            tileClick={() => this.tileClick(item)}
                            tileMouseEnter={() => this.tileMouseEnter(item)}
                            landCharacters={objectArea}
                            tileRightMouseClick={() => this.tileRightMouseClick(item)}
                            isDragging={isDragging}/>
                    )
                })}

            </GoogleMap>
        );
    };

    render() {
        const { plantData, itemPopupCultivation, itemPopupDetail, usingItemData, map } = this.state;
        const renderMap = this.renderMap();
        return (
            <GameMapRender renderMap={renderMap}
                           itemPopupCultivation={itemPopupCultivation}
                           itemPopupDetail={itemPopupDetail}
                           map={map}
                           plantData={plantData}
                           usingItemData={usingItemData}
                           handleShowAlert={(status) => this.handleShowAlert(status)}/>
        )
    }
}

const mapStateToProps = (state) => {
    const {
        wallet, lands, authentication: {user},
        shopsReducer: {shops},
        mapGameReducer: {arrayTileEffect},
        screens,
        map, lands: {landSelected}, objectsReducer: {objects, plantStatus, objectArea }, mapGameReducer: {characterData, itemData, quadKeyBitamin}, inventoryReducer: {itemInventory, plantingResult, usingResult}
    } = state;
    return {
        user,
        lands,
        map,
        landSelected,
        objects,
        characterData,
        itemData,
        itemInventory,
        plantStatus,
        plantingResult,
        usingResult,
        wallet,
        shops,
        quadKeyBitamin,
        arrayTileEffect,
        objectArea, screens
    };
};

const mapDispatchToProps = (dispatch) => ({
    getWalletInfo: (param) => dispatch(userActions.getWalletInfo(param)),
    clearMoveTreeToMap: () => dispatch(objectsActions.clearMoveTreeToMap()),
    getAreaLand: (param) => dispatch(landActions.getAreaLand(param)),
    syncCenterMap: (center, zoom) => dispatch(mapActions.syncCenterMap(center, zoom)),
    clearPlantedTreesResult: () => dispatch(inventoryActions.clearPlantedTreesResult()),
    clearSuccessError: () => dispatch(inventoryActions.clearSuccessError()),
    setTreeDies: (deadTrees) => dispatch(objectsActions.setTreeDies(deadTrees)),
    onHandleGetArrayTileEffect: (arrayTileEffect) => dispatch(mapGameAction.onHandleGetArrayTileEffect(arrayTileEffect)),
    getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
    getAreaObject: (param) => dispatch(objectsActions.getAreaObject(param)),
    addSelected: (multiSelectSave) => dispatch(mapActions.addSelected(multiSelectSave)),
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GameMap);



