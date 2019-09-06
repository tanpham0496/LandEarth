import React, { PureComponent } from 'react';
import connect from "react-redux/es/connect/connect";
// import ReactDOMServer from "react-dom/server";
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import MapBoxGLLayer from './components/MapBoxGLLayer';
import { LatLongToTileXY, TileXYToQuadKey, TileXYToLatLong, QuadKeyToLatLong, QuadKeyToTileXY } from "../general/System";
import { mapActions } from "../../../../reduxNew/actions/commonActions/mapActions";
import { inventoryActions } from "../../../../reduxNew/actions/gameActions/inventoryActions";
import { userActions } from "../../../../reduxNew/actions/commonActions/userActions";
import { objectsActions } from "../../../../reduxNew/actions/gameActions/objectsActions";
import { landActions } from "../../../../reduxNew/actions/landActions/landActions";
import GameMapRenderComponent from "../gameMapComponent/component/GameMapRender";
import { alertPopup } from "../gameMapComponent/component/A&PSchema";
// import * as L from 'leaflet';
import intersectionBy from 'lodash.intersectionby';
import isEqual from 'lodash.isequal';
import isUndefined from 'lodash.isundefined';
//import LandStatusComponent from "./../gameMapComponent/component/LandStatusRender";
import LeaftletTileComponent from "./components/GameTileComponent";
// // import TreePositionRender from "./../gameMapComponent/component/TreePositionRender";
import {
    addCharacterToMap,
    createTile,
    // getParticleLands,
    //getZoomBounds,
    usingItemForTree,
    Leaflet_getParticleLands
} from "./../gameMapComponent/component/GameMapFunction";

const DEFAULT_LEVEL_OFFSET = 2;

class GameMap extends PureComponent {

    state = {
        selectedTiles: [],
        selectMode: "single", //none, single, multi, clear
        currentPopup: alertPopup.noPopup,
        checkTreeInterval: null,
        tiles: [],
        lands: []
    };
    map = React.createRef();



    componentDidMount() {
        const { user: { wToken } } = this.props;
        // Minh tri
        // Update param - 6/4/19
        // ========================================
        this.setState({ loaded: true });
        this.props.getWalletInfo({ wToken });
    }

    static getDerivedStateFromProps(props, state) {
        if (props.lands.allLands && !isEqual(props.lands.allLands, state.lands)) {
            if (props.lands.isOwn) {
                return { landsUpdated: true, selectedTiles: [] };
            }
            return { lands: props.lands.allLands }
        }
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.characterData !== this.props.characterData) {
            const { characterData, lands, user, objects } = this.props;
            if (characterData) {
                console.log("add cay");
                addCharacterToMap(characterData, lands, user, this.handleShowPopup, objects);
            }
        }
        if (prevProps.itemData !== this.props.itemData) {
            const { itemData, lands, user, objects, wallet, itemInventory } = this.props;
            if (itemData) {
                const itemFind = itemInventory && itemInventory.find(shop => shop.itemId === itemData.itemId);
                if (itemData.itemId === 'I03' || itemFind.quantity > 0) {
                    usingItemForTree(itemData, lands, user, this.handleShowPopup, objects, this.handleShowAlert)
                } else {
                    const { info } = wallet;
                    if (info.goldBlood - itemFind.price < 0) {
                        this.handleShowAlert(alertPopup.rechargeAlertPopup) /*!!!!important*/
                    } else {
                        usingItemForTree(itemData, lands, user, this.handleShowPopup, objects, this.handleShowAlert)
                    }
                }

            }
        }

        if (prevProps.plantingResult !== this.props.plantingResult) {
            if (this.props.plantingResult) {
                const { plantingResult: { status } } = this.props;
                if (status) {
                    setTimeout(() => {
                        this.handleShowAlert(alertPopup.platingTreeSuccessPopup)
                    }, 500);
                    this.props.clearPlantedTreesResult()
                } else {
                    this.handleShowAlert(alertPopup.platingTreeUnSuccessPopup);
                    this.props.clearPlantedTreesResult()
                }
            }
        }

        if (prevProps.usingResult !== this.props.usingResult) {
            if (this.props.usingResult) {
                const { usingResult: { status } } = this.props;
                if (status) {
                    setTimeout(() => {
                        this.handleShowAlert(alertPopup.usingItemForTreeSuccessPopup)
                    }, 500);
                    this.props.clearSuccessError();
                } else {
                    this.handleShowAlert(alertPopup.usingItemForTreeUnSuccessPopup);
                    this.props.clearSuccessError();
                }
            }
        }
        //plant tree
        if (!isUndefined(this.props.plantStatus)) {
            this.props.clearMoveTreeToMap();
        }
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

    onMoveEnd = (e) => {
        let { getAllObjects, user, getAllLand } = this.props;
        let map = this.map.current.leafletElement;
        Leaflet_getParticleLands(map, getAllObjects, user, getAllLand);
        let { bounds, level } = this.getZoomBounds(map);
        let zoom = map.getZoom();
        let tiles = this.drawTiles({ zoom, bounds, lands: this.state.lands || [] });

        this.setState({
            tileLoaded: true,
            landsUpdated: false,
            tiles,
            zoom,
            bounds,
            centerChange: false,
            firstLoad: false
        });
    }

    drawTiles = ({ zoom, bounds, lands, selectedTiles }) => {
        const level = zoom + DEFAULT_LEVEL_OFFSET;
        const beginTile = LatLongToTileXY(bounds.ne.lat, bounds.sw.lng, level);
        const endTile = LatLongToTileXY(bounds.sw.lat, bounds.ne.lng, level);
        console.log('be', beginTile);
        console.log('en', endTile)
        const { centerQuadKey } = this.state;
        if (beginTile.x < endTile.x) {
            let arrTile = [];
            for (let x = beginTile.x; x <= endTile.x; x++) {
                for (let y = beginTile.y; y <= endTile.y; y++) {
                    if (typeof lands === 'undefined') continue;
                    arrTile.push(createTile(x, y, level, lands, selectedTiles, centerQuadKey, this.props.lands.openCountries))
                }
            }
            return arrTile;
        }
    };

    onZoomstart = () => {
        let that = this;
        function removeTiles() {
            that.setState({ tiles: [] });
        }
        removeTiles();
    }

    handleShowPopup = (status) => {
        const {characterData, user, checkLand, itemData, objectId} = status;
        const {itemInventory} = this.props;

        if (checkLand) {
            if (characterData) {
                const plantData = {characterData, user};
                this.setState({
                    plantData,
                    currentPopup: alertPopup.plantingConfirmAlert
                })
            } else if (itemData) {
                const {checkLand: {checkLimitNutritionResult}} = status;
                if (checkLimitNutritionResult) {
                    this.setState({
                        currentPopup: alertPopup.limitNutritionAlert
                    })
                } else {
                    const usingItemData = {itemData, user, objectId};
                    if (itemData.itemId === "I03") {
                        this.setState({
                            usingItemData,
                            currentPopup: alertPopup.usingItemConfirmAlert
                        })
                    } else {
                        const itemInventoryFindItem = itemInventory.find(item => item.itemId === itemData.itemId);
                        if (itemInventoryFindItem.quantity === 0) {
                            this.setState({
                                usingItemData,
                                currentPopup: alertPopup.usingItemNoneQuantityConfirmAlert
                            })
                        } else {
                            this.setState({
                                usingItemData,
                                currentPopup: alertPopup.usingItemConfirmAlert
                            })
                        }
                    }
                }
            }else{
                this.setState({
                    currentPopup: alertPopup.platingTreeUnSuccessPopup
                })
            }
        } else {
            this.setState({
                currentPopup: alertPopup.wrongLandAlert
            })
        }
    };


    handleHidePopup = () => {
        this.setState({
            currentPopup: alertPopup.noPopup
        })
    };

    onZoomend = () => {

    }

    onZoom = () => {

    }


    onMovestart = () => {

    }

    onRenderTiles = (tiles) => {
        const { center, isDragging } = this.state;
        const { user: { _id }, user, lands: { allLands }, objects } = this.props;
        const landsFilter = intersectionBy(allLands, tiles, 'quadKey');
        return tiles && tiles.map((item) => {
            let myLand = landsFilter && landsFilter.filter(i => i.quadKey === item.quadKey)[0];
            let clsName = this.onRenderClassName(item, myLand, _id);
            const { latlng, quadKey } = item;
            return (
                <SingleTile
                    key={quadKey}
                    lat={latlng.lat}
                    lng={latlng.lng}
                    quadKey={quadKey}
                    className={clsName}
                    landCharacters={objects}
                    user={user}
                // handleShowPopupForTree={this.handleShowPopupForTree}
                // isDragging={isDragging} 
                />
            )
        })
    }

    onRenderClassName = (item, myLand, _id) => {
        let clsName = '';
        const landPosition = this.props.landSelected && this.props.landSelected.land.quadKey;
        if (item.lands[0]) {
            const myLands = item.lands[0];
            if (myLands.forbid) {
                if (myLands.landmark) {
                    if (clsName.indexOf(' landmark') === -1) clsName += ' landmark';
                } else {
                    if (clsName.indexOf(' forbid') === -1) clsName += ' forbid';
                }
            }
        }
        if (myLand) {
            if (myLand.user) {
                if (myLand.forbidStatus) { //forbid by Admin
                    if (clsName.indexOf(' forbid') === -1) clsName += ' forbid';
                } else {
                    if (myLand.user._id !== _id) {
                        if (clsName.indexOf(' myLand noSell') === -1) clsName += ' noSell';
                        if (myLand.forSaleStatus) {
                            if (clsName.indexOf(' forSell') === -1) clsName += ' forSell'
                        }

                    } else {
                        if (myLand.forSaleStatus) {
                            if (clsName.indexOf(' myLand myForSell') === -1) clsName += ' myForSell'
                        }
                        if (clsName.indexOf(' myLand') === -1) clsName += ' myLand';
                    }
                }
            } else { //forbid Area
                if (myLand.forbidStatus) {
                    if (clsName.indexOf(' forbid') === -1) clsName += ' forbid';
                }
            }
        }
        clsName += landPosition && myLand && myLand.quadKey === landPosition ? ' center' : '';
        return clsName

    };

    renderMap() {
        const { tiles } = this.state;
        return (
            <LeafletMap
                center={[37.566535, 126.9779692]}
                zoom={22}
                maxZoom={22}
                dragging={true}
                animate={true}
                easeLinearity={0.35}
                ref={this.map}


                onMoveend={this.onMoveEnd}
                onMovestart={this.onMovestart}

                onZoomstart={this.onZoomstart}
                onZoom={this.onZoom}
                onZoomend={this.onZoomend}


            >
                <MapBoxGLLayer
                    accessToken={'pk.eyJ1IjoianVuMDIyOCIsImEiOiJjanVrcGJ4eHowa3hkNDNxdm54ZjZpbmoxIn0.FHZXhfvwhWqLxCa1DC8xnQ'}
                    style={"mapbox://styles/mapbox/streets-v11"}
                />
                {
                    this.onRenderTiles(tiles)
                }
            </LeafletMap>
        );
    }

    render() {
        const { currentPopup, plantData, itemPopupCultivation, itemPopupDetail, usingItemData } = this.state;
        const renderMap = this.renderMap();
        return (
            <GameMapRenderComponent
                renderMap={renderMap}
                currentPopup={currentPopup}
                itemPopupCultivation={itemPopupCultivation}
                itemPopupDetail={itemPopupDetail}
                handleHidePopup={this.handleHidePopup}
                plantData={plantData}
                usingItemData={usingItemData}
                handleShowPopupForTree={this.handleShowPopupForTree}
                handleShowAlert={(status) => this.handleShowAlert(status)}
            />
        );
    }

}

const mapStateToProps = state => {
    const {
        wallet, lands, authentication: { user },
        shopsReducer: { shops },
        map, lands: { landSelected }, objectsReducer: { objects, plantStatus }, mapGameReducer: { characterData, itemData }, inventoryReducer: { itemInventory, plantingResult, usingResult }
    } = state;
    return {
        user, lands, map, landSelected, objects, characterData, itemData, itemInventory, plantStatus, plantingResult, usingResult, wallet, shops
    };
}

const mapDispatchToProps = dispatch => ({
    getWalletInfo: (param) => dispatch(userActions.getWalletInfo(param)),
    clearMoveTreeToMap: () => dispatch(objectsActions.clearMoveTreeToMap()),
    getAllLand: (startEndTile) => dispatch(landActions.getAllLand(startEndTile)),
    getAllObjects: (param) => dispatch(objectsActions.getAllObjects(param)),
    syncCenterMap: (center, zoom) => dispatch(mapActions.syncCenterMap(center, zoom)),
    clearPlantedTreesResult: () => dispatch(inventoryActions.clearPlantedTreesResult()),
    clearSuccessError: () => dispatch(inventoryActions.clearSuccessError()),
    setTreeDies: (deadTrees) => dispatch(objectsActions.setTreeDies(deadTrees)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GameMap);




class SingleTile extends PureComponent {

    render() {
        return (
            <LeaftletTileComponent type='game' {...this.props} />
        )
    }
}
