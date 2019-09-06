import React, {useState, useRef, useEffect, Fragment} from 'react';
import connect from "react-redux/es/connect/connect";
import {Map as LeafletMap} from 'react-leaflet';
import GameTileComponent from './components/GameTileComponent';
import {
    mapActions, landActions, objectsActions, userActions, screenActions, inventoryActions
} from "../../../../helpers/importModule";
import _ from "lodash";
import update from 'immutability-helper';
import * as f from "./components/GameMapFunction";

import PlantCultivationPopup from "../gameUIComponent/Common/PlantCultivationComponent/PlantCultivationPopup";
//popups
import UsingItemByBloodForTreeConfirm from './components/popups/UsingItemByBloodForTreeConfirm';
import LoadingPopup from './components/popups/LoadingPopup';
import UseItemSuccessAlert from './components/popups/UseItemSuccessAlert';
import UseItemFailureAlert from './components/popups/UseItemFailureAlert';
import UsingItemForTreeConfirm from './components/popups/UsingItemForTreeConfirm';
import CheckForSaleStatusAlertForItemPopup from './components/popups/CheckForSaleStatusAlertForItemPopup';
import PlantTreeOnOtherUserLand from './components/popups/PlantTreeOnOtherUserLand';
import PlantingTreeSuccessAlert from './components/popups/PlantingTreeSuccessAlert';
import ConfirmPlantingTree from './components/popups/ConfirmPlantingTree';

import ExistTreeAlert from './components/popups/ExistTreeAlert';
import PlantTreeOnForSaleLandAlert from './components/popups/PlantTreeOnForSaleLandAlert';
import DroppingTreeUnsuccessAlert from './components/popups/DroppingTreeUnsuccessAlert';
import PlantTreeBeforeNutrientAlert from './components/popups/PlantTreeBeforeNutrientAlert';
import PlantTreeBeforeDropletAlert from './components/popups/PlantTreeBeforeDropletAlert';
import PlantTreeBeforeShovelAlert from './components/popups/PlantTreeBeforeShovelAlert';
import LeftWaterDeadAlert from './components/popups/LeftWaterDeadAlert';
import RechargeAlert from './components/popups/RechargeAlert'; 
import UseLimitedItemAlert from './components/popups/UseLimitedItemAlert';
import ContextMenuGame from "./components/ContextMenuGame";

const LIMIT_ZOOM_SELECTED = 22;

//move item to using in tree==========================================
//check available to move
const onHandleCheckQuadKeyObject = (objects, itemData) => {
    const {itemId} = itemData;
    const itemSpecialFilter = objects.filter(object => object.itemId === 'T10');
    const findTreeInTileResult = itemSpecialFilter.filter(item => {
        const {bigTreeQuadKeys} = item;
        const findObject = bigTreeQuadKeys.filter(quadKey => quadKey === itemData.quadKey);
        return findObject.length !== 0 && item
    });
    if (findTreeInTileResult && itemId === 'I04' && findTreeInTileResult.length !== 0) {
        return findTreeInTileResult
    } else if (findTreeInTileResult && itemId !== 'I04' && findTreeInTileResult.length === 0) {
        return objects.filter(object => object.quadKey === itemData.quadKey);
    } else {
        return []
    }
};

function onHandleCheckAvailableForItem(myLand, itemData, objects) {
    const checkQuadKey = myLand.filter(land => land.quadKey === itemData.quadKey);
    if (checkQuadKey.length !== 0) {
        const checkForSaleStatus = (checkQuadKey[0].forSaleStatus && itemData.itemId === 'I01') || (checkQuadKey[0].forSaleStatus && itemData.itemId === 'I02');
        if (checkForSaleStatus) {
            return {checkForSaleStatus: true}
        } else {
            const checkObjectQuadKey = onHandleCheckQuadKeyObject(objects, itemData);
            const checkQuadKeyResult = checkQuadKey.length !== 0;
            const checkObjectQuadKeyResult = checkObjectQuadKey.length !== 0;

            if (itemData.itemId === 'I01') {
                const checkLimitNutrition = objects.filter(object => (object.quadKey === itemData.quadKey) && object.limitUseNutritional === 0);
                const checkLimitNutritionResult = checkLimitNutrition.length === 0;
                if (!checkLimitNutritionResult) {
                    return {checkLimitNutritionResult: true}
                } else {
                    return checkLimitNutritionResult && checkObjectQuadKeyResult && checkQuadKeyResult
                }
            } else {
                return checkObjectQuadKeyResult && checkQuadKeyResult
            }
        }
    }
};

function onHandleCheckTreeInTile( myLand , objects , itemData) {
    const findTile = objects.filter(object => object.quadKey === itemData.quadKey);
    const itemSpecialFilter = objects.filter(object => object.itemId === 'T10');
    const findTreeInTileResult = itemSpecialFilter.filter(item => {
        const {bigTreeQuadKeys} = item;
        const findObject = bigTreeQuadKeys.filter(quadKey => quadKey === itemData.quadKey);
        return findObject.length !== 0 && item
    });
    const checkQuadKey = myLand.filter(land => land.quadKey === itemData.quadKey);
    return checkQuadKey.length !== 0 && findTile.length === 0 && findTreeInTileResult.length === 0;
};

function LeafGameMap(props) {

    //====================================================================================
    const leafMap = useRef(); //map
    const {getAreaObject, getAreaLand, screens, itemInventory} = props;
    const [mapLoaded, setMapLoaded] = useState(false); //map load done
    const [tileUpdate, setTileUpdate] = useState(false); //allow update tile
    // map property
    const [tiles, setTiles] = useState(null);
    const [tileStart, setTileStart] = useState(null);
    const [multiSelectSave, setMultiSelectSave] = useState(null);
    
    const [currentPopup, setCurrentPopup] = useState(null);
    const [plantData, setPlantData] = useState();


    const handleShowPopup = (status) => {
        const {user} = props;
        const {...s} = status;
        if (s.checkNotMyLand) {
            props.addPopup({ name: 'PlantTreeOnOtherUserLand' });
        } else if (s.checkForSaleStatus) {
            props.addPopup({ name: 'PlantTreeOnForSaleLandAlert' });
        } else if (s.checkAlreadyHaveTree) {
            props.addPopup({ name: 'ExistTreeAlert' });
        } else {
            if (s.checkLand) {
                if (s.characterData) {
                    const plantData = {characterData: s.characterData, user};
                    const arrayTileEffect = createBitaminTile();
                    props.addPopup({ name: 'ConfirmPlantingTree', data: { plantData, arrayTileEffect } });
                } else if (s.itemData) {
                    const {checkLand: {checkLimitNutritionResult}} = status;
                    if (checkLimitNutritionResult) {
                        props.addPopup({ name: 'UseLimitedItemAlert' });
                    } else {
                        const usingItemData = {itemData: s.itemData, user, objectId: s.objectId};
                        if (s.itemData.itemId === "I03") {
                            props.addPopup({ name: 'UsingItemForTreeConfirm', data: { usingItemData }, close: "PlantCultivationComponent" });
                        } else {
                            const itemInventoryFindItem = itemInventory.find(item => item.itemId === s.itemData.itemId);
                            if (itemInventoryFindItem.quantity === 0) {
                                props.addPopup({ name: 'UsingItemByBloodForTreeConfirm', data: { usingItemData }, close: "PlantCultivationComponent" });
                            } else {
                                props.addPopup({ name: 'UsingItemForTreeConfirm', data: { usingItemData }, close: "PlantCultivationComponent" });
                            }
                        }
                    }
                } else {
                    props.addPopup({ name: 'DroppingTreeUnsuccessAlert' });
                }
            } else {
                props.addPopup({ name: 'PlantTreeOnOtherUserLand' });
            }
        }
    };

    const handleShowAlert = (status) => {
        setCurrentPopup(status)
    };

    const handleHidePopup = () => {
        setCurrentPopup(null)
    };

    const usingItemForTree = (itemData, lands, user, handleShowPopup, objects, handleShowAlert) => {
        if (itemData && lands && user) {
            const myLand = lands && lands.allLands.filter(land => land.user._id === user._id);
            const checkLand = onHandleCheckAvailableForItem(myLand, itemData, objects);
            const checkNotHaveTreeInTile = onHandleCheckTreeInTile( myLand ,  objects , itemData);
            //check quadkey again -> before submit
            const itemSpecialFilter = objects.filter(object => object.itemId === 'T10');
            const objectFilter = itemData.itemId === 'I04' ? itemSpecialFilter.find(item => {
                const {bigTreeQuadKeys} = item;
                const findObject = bigTreeQuadKeys.filter(quadKey => quadKey === itemData.quadKey);
                return findObject.length !== 0 && item
            }) : objects.find(object => object.quadKey === itemData.quadKey);
            // ==========================================
            if(checkNotHaveTreeInTile  && itemData.itemId !== 'I04'){
                const objItemAlert = {
                    'I01': 'PlantTreeBeforeNutrientAlert',
                    'I02': 'PlantTreeBeforeShovelAlert',
                    'I03': 'PlantTreeBeforeDropletAlert',
                }
                props.addPopup({ name: objItemAlert[itemData.itemId] });
            }else if (checkLand) {
                // console.log('ch', checkLand)
                if (checkLand.checkForSaleStatus) {
                    props.addPopup({ name: 'CheckForSaleStatusAlertForItemPopup', close: "PlantCultivationComponent" });
                } else {
                    if (objectFilter) {
                        const dataUsingItem = {
                            itemData, user, checkLand, objectId: objectFilter._id
                        };
                        handleShowPopup(dataUsingItem);
                    } else {
                        handleShowPopup('error');
                    }
                }
            } else {
                handleShowPopup('error');
            }
        }
    };


    // const startAndEndBounds = (paramStartAndEndBounds) => {
    //     const {level, beginTile, endTile} = paramStartAndEndBounds;
    //     if (beginTile.x > endTile.x) {
    //         let tempEndTile = 2 ** level - 1;
    //         return [{ //split end chunk
    //             beginTile: {x: beginTile.x, y: beginTile.y},
    //             endTile: {x: tempEndTile, y: endTile.y}
    //         }, { //split start chunk
    //             beginTile: {x: 0, y: beginTile.y},
    //             endTile: {x: endTile.x, y: endTile.y}
    //         }]
    //     } else {
    //         return [{beginTile, endTile}]
    //     }
    // };

    const createBitaminTile = () => {
        const {quadKeyBitamin, objectArea, user: {_id}} = props;
        const bigTreeQuadKeys = objectArea ? (objectArea.reduce((totalQK, object) => object.bigTreeQuadKeys ? totalQK.concat(object.bigTreeQuadKeys) : totalQK, [])) : [];
        return quadKeyBitamin && f.onHandleCreateTileEffect({ quadKeyBitamin, tiles, objectArea, bigTreeQuadKeys, _id });
    }
    const arrayTileEffect = createBitaminTile();

    //==========================================================MAP EVENTs==========================================================================
    const onMoveEnd = (e) => {
        const {getAreaObject, getAreaLand, lands, objects, map: { centerQuadKey, selected }} = props;
        const zb = f.getZoomBounds(leafMap);
        if (zb) {
            const newTiles = f.drawTiles({ lands, objects, leafMap, centerQuadKey, selected, multiSelectSave });
            if (tileUpdate === false && !_.isEqual(tiles, newTiles)) {
                //change
                const {newZoom, newCenter} = zb;

                //tile change
                const param = {
                    getAreaObject,
                    getAreaLand,
                    leafMap
                };
                f.getParticleLandObjects(param);
                setTiles(newTiles);
                setTileUpdate(true);

                //sync center for minimap - set center & zoom
                props.syncCenterMap(newCenter, newZoom, null, null, leafMap);
                //save last location in localStorage
                localStorage.setItem('lat', newCenter[0]);
                localStorage.setItem('lng', newCenter[1]);
            }
        }
    }
    //==========================================================END MAP EVENTs=======================================================================

    useEffect(() => {
        const {getAreaObject, getAreaLand} = props;

        const {user: {wToken, _id}} = props;
        props.getWalletInfo({wToken});
        props.getAllLandById(_id);

        setMapLoaded(true);
        const param = {
            getAreaObject,
            getAreaLand,
            leafMap
        };
        f.getParticleLandObjects(param);
    }, []);

    useEffect(() => {
        const {objects: {objectArea}, lands: {allLands}, lands, objects, map: { centerQuadKey, selected }} = props;
        if (objectArea && allLands) {
            const newTiles = f.drawTiles({ lands, objects, leafMap, centerQuadKey, selected, multiSelectSave });
            if (!_.isEqual(tiles, newTiles)) {
                //console.log('update Tile with Lands', props.lands.allLands);
                setTiles(newTiles);
                setTileUpdate(true);
            }
        }
    }, [props.objects.objectArea, props.lands.allLands, props.map.selected, multiSelectSave]);

    //after update tiles
    useEffect(() => {
        if (tileUpdate) {
            setTileUpdate(false);
        }
    }, [tileUpdate]);

    //use Item
    useEffect(() => {
        const {characterData, lands, user, objectArea} = props;
        if (characterData) {
            f.addCharacterToMap(characterData, lands, user, handleShowPopup, objectArea, arrayTileEffect);
        }
    }, [props.characterData]);

    useEffect(() => {
        const {lands, user, objectArea, wallet, itemInventory, itemData} = props;
        if (itemData) {
            const itemFind = itemInventory && itemInventory.find(shop => shop.itemId === itemData.itemId);
            if (itemData.itemId === 'I03' || itemFind.quantity > 0) {
                usingItemForTree(itemData, lands, user, handleShowPopup, objectArea, handleShowAlert)
            } else {
                const {info} = wallet;
                if (info.goldBlood - itemFind.price < 0) {
                    //handleShowAlert(alertPopup.rechargeAlertPopup) /*!!!!important*/
                    props.addPopup({ name: 'RechargeAlert' });
                } else {
                    usingItemForTree(itemData, lands, user, handleShowPopup, objectArea, handleShowAlert)
                }
            }
        }

    }, [props.itemData]);

    useEffect(() => {
        const {plantingResult} = props;
        if (plantingResult) {
            const {plantingResult: {status}} = props;
            if (status) {
                setTimeout(() => {
                    props.addPopup({ name: 'PlantingTreeSuccessAlert', close: "LoadingPopup" });
                }, 500);
                props.clearPlantedTreesResult()
            } else {
                setTimeout(() => {
                    props.addPopup({ name: 'DroppingTreeUnsuccessAlert' });
                }, 500);
                props.clearPlantedTreesResult()
            }
            //reload
            f.getParticleLandObjects({
                getAreaObject: props.getAreaObject,
                getAreaLand: props.getAreaLand,
                leafMap
            });
        }
    }, [props.plantingResult]);

    useEffect(() => {

        //console.log('props', props);
        const {itemData, lands, user, objectArea, wallet, itemInventory} = props;
        if (itemData) {
            const itemFind = itemInventory && itemInventory.find(shop => shop.itemId === itemData.itemId);
            if (itemData.itemId === 'I03' || itemFind.quantity > 0) {
                usingItemForTree(itemData, lands, user, handleShowPopup, objectArea, handleShowAlert)
            } else {
                const {info} = wallet;
                if (info.goldBlood - itemFind.price < 0) {
                    //handleShowAlert(alertPopup.rechargeAlertPopup) /*!!!!important*/
                    props.addPopup({ name: 'RechargeAlert' });
                } else {
                    usingItemForTree(itemData, lands, user, handleShowPopup, objectArea, handleShowAlert)
                }
            }

        }
    }, [props.itemData])


    useEffect(() => {
        const {usingResult} = props;

            if (usingResult) {
                const {status} = usingResult;
                if (status) {
                    setTimeout(() => {
                        props.addPopup({ name: 'UseItemSuccessAlert', close: 'LoadingPopup' });
                        //re-open popup normal tree & open popup Tree
                        //load map
                        f.getParticleLandObjects({
                            getAreaObject: props.getAreaObject,
                            getAreaLand: props.getAreaLand,
                            leafMap
                        });
                    }, 500);
                    props.clearSuccessError();
                } else {
                    props.addPopup({ name: 'UseItemFailureAlert', close: 'LoadingPopup' });
                    props.clearSuccessError();
                }
            }
        
    }, [props.usingResult])


    //=====================================================MOUSE EVENT=============================================================
    const tileGameClick = (tile) => {
        const { mode, selected, zoom } = props.map;
        //console.log('{ mode, selected, zoom }',{ mode, selected, zoom });
        // /console.log('tiles', tiles);
        if(zoom < 22) return null;
        if(!mode || !tiles) return null; //slow load mode
        const selectedIndex = tiles.findIndex(t => t.quadKey === tile.quadKey);
        if(mode === "single") {
            if (tiles[selectedIndex].selected === false) {
                const newSelectedTiles = update((selected || []), { $push: [tile] });
                props.addSelected(newSelectedTiles);
            }else {
                const iSelected = selected.findIndex(t => t.quadKey === tile.quadKey);
                const newSelectedTiles = update(selected, { $splice: [[iSelected, 1]] });
                props.addSelected(newSelectedTiles);
            }
        }
        else if (mode === "multi") {
            if (tileStart === null) { //first click
                setTileStart(tile);
            } else { //second click
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
        if (zoom !== LIMIT_ZOOM_SELECTED) return; //don't click when lower zoom 22
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
    //=====================================================MOUSE EVENT=============================================================

    return (
        <Fragment>
            <LeafletMap
                center={props.map.center || props.centerLeave}
                zoom={22}
                minZoom={22}
                maxZoom={22}
                attributionControl={true}
                zoomControl={false}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                dragging={true}
                animate={true}
                easeLinearity={0.35}
                ref={leafMap}
                onMoveend={onMoveEnd}
            >
                {mapLoaded && tiles && tiles.map((item, key) => {
                    return (
                        <GameTileComponent
                            key={key}
                            lat={item.latlng.lat}
                            lng={item.latlng.lng}
                            tile={item}
                            zoom={22}
                            tileStart={tileStart} //for check multiselect: when hover => do not show certificate
                            //markerPane={'markerPane'}
                            // tileHaveBTamin={tileHaveBTamin}
                            tileMouseEnter={(tile) => tileMouseEnter(tile)}
                            arrayTileEffect={arrayTileEffect}
                            tileGameClick={(tile) => tileGameClick(tile)}
                        />
                    )
                })}
            </LeafletMap>
            { screens["PlantCultivationComponent"] && screens["PlantCultivationComponent"].tree && screens["PlantCultivationComponent"].tree._id && 
                <div className="popup-container">
                    <PlantCultivationPopup objectId={screens["PlantCultivationComponent"].tree._id} handleHidePopup={null/* keep for old map */} handleShowAlert={null/* keep for old map */}/>
                </div>
            }
            { screens["UsingItemByBloodForTreeConfirm"] && <UsingItemByBloodForTreeConfirm {...screens["UsingItemByBloodForTreeConfirm"]}/> } 
            { screens["UsingItemForTreeConfirm"] && <UsingItemForTreeConfirm {...screens["UsingItemForTreeConfirm"]}/> }
            { screens["ConfirmPlantingTree"] && <ConfirmPlantingTree {...screens["ConfirmPlantingTree"]} /> }
            { screens["LoadingPopup"] && <LoadingPopup /> }
            { screens["UseItemSuccessAlert"] && <UseItemSuccessAlert /> }
            { screens["UseItemFailureAlert"] && <UseItemFailureAlert /> }
            { screens["CheckForSaleStatusAlertForItemPopup"] && <CheckForSaleStatusAlertForItemPopup /> }
            { screens["PlantTreeOnOtherUserLand"] && <PlantTreeOnOtherUserLand /> }
            { screens["PlantingTreeSuccessAlert"] && <PlantingTreeSuccessAlert /> }
            { screens["ExistTreeAlert"] && <ExistTreeAlert /> }
            { screens["PlantTreeOnForSaleLandAlert"] && <PlantTreeOnForSaleLandAlert /> }
            { screens["DroppingTreeUnsuccessAlert"] && <DroppingTreeUnsuccessAlert /> }
            { screens["PlantTreeBeforeNutrientAlert"] && <PlantTreeBeforeNutrientAlert /> }
            { screens["PlantTreeBeforeShovelAlert"] && <PlantTreeBeforeShovelAlert /> }
            { screens["PlantTreeBeforeDropletAlert"] && <PlantTreeBeforeDropletAlert /> }
            { screens["RechargeAlert"] && <RechargeAlert /> }
            { screens["LeftWaterDeadAlert"] && <LeftWaterDeadAlert /> }
            { screens["UseLimitedItemAlert"] && <UseLimitedItemAlert /> }

            { screens["ContextMenuGame"] && <ContextMenuGame/> }

        </Fragment>



    );

}

export default connect(
    state => {
        const {
            authentication: {user}, map, lands, objects,
            mapGameReducer: {characterData, quadKeyBitamin , itemData},
            objectsReducer: {objectArea},
            screens,
            inventoryReducer: {itemInventory, plantingResult, usingResult},
            wallet,
            // shopsReducer: {shops},
            // mapGameReducer: {arrayTileEffect},
            // , lands: {landSelected}, , mapGameReducer: {characterData, itemData, quadKeyBitamin}, 
        } = state;

        return {
            user, map, lands, objects, characterData,
            plantingResult, quadKeyBitamin, objectArea, itemData,
            screens,
            itemInventory,  //use Item
            wallet, //use Item
            usingResult, //use Item
            // landSelected,
            // objects,
            // plantStatus,
            // plantingResult,
            
            // shops,
            // quadKeyBitamin,
            // arrayTileEffect,
            // objectArea
        };
    }, dispatch => ({
        getAreaLand: (param) => dispatch(landActions.getAreaLand(param)),
        getAreaObject: (param) => dispatch(objectsActions.getAreaObject(param)),
        syncCenterMap: (center, zoom, centerQuadKey, centerChange) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadKey, centerChange)),
        getWalletInfo: (param) => dispatch(userActions.getWalletInfo(param)),
        // clearMoveTreeToMap: () => dispatch(objectsActions.clearMoveTreeToMap()),
        // // getAllObjects: (param) => dispatch(objectsActions.getAllObjects(param)),
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        clearPlantedTreesResult: () => dispatch(inventoryActions.clearPlantedTreesResult()),
        clearSuccessError: () => dispatch(inventoryActions.clearSuccessError()),
        // setTreeDies: (deadTrees) => dispatch(objectsActions.setTreeDies(deadTrees)),
        // onHandleGetArrayTileEffect: (arrayTileEffect) => dispatch(mapGameAction.onHandleGetArrayTileEffect(arrayTileEffect)),
        getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
        addSelected: (selected) => dispatch(mapActions.addSelected(selected)), //add selected tile

    })
)(LeafGameMap);



