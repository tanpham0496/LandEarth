import {objectsService} from "../../services/gameServices/objectsService";
import * as t from "../../actionTypes/gameActionTypes/objectActionTypes"

export const objectsActions = {
    moveTreeToMap,
    clearMoveTreeToMap,
    getAllObjects,
    getAllObjectsByUserId,
    getDetailObject,
    getOnLandObjectsByUserId,
    removeObjects,
    updateTreeObject,
    setTreeDies,
    getAreaObject,
    getObjectByQuadKey,
    getLandByCateIdAndQuadKeys,
    getLandSelectedMyLand,
    getCategorySelectedMyLand,
    getLandToPlantTree,
    getLandToRemoveTree,
    getCurrentCategory,
    getLandToUseNutrient,
    getLandToUseWater,
    clearResultGetLandByCateIdsAndQuadKeys,
    resetLandSelectedMyLand,
    resetLandSelectedToPlantTree

};

function moveTreeToMap({status, plantedTrees, error}) {
    return status ? {type: t.MOVE_TREE_TO_MAP_SUCCESS, res: {status, plantedTrees}} : {
        type: t.MOVE_TREE_TO_MAP_FAILURE,
        res: {status, error}
    };
}

function clearMoveTreeToMap() {
    return {type: t.CLEAR_MOVE_TREE_TO_MAP}
}


function getAllObjects({quadKeyParent1, quadKeyParent2, level}) {
    return dispatch => {
        objectsService.getAllObjects({quadKeyParent1, quadKeyParent2, level})
            .then(
                objects => {
                    dispatch(success(objects));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(objects) {
        return {type: t.GET_OBJS_SUCCESS, objects}
    }

    function failure(error) {
        return {type: t.GET_OBJS_FAILURE, error}
    }
}

function getAreaObject({quadKeyParent1}) {
    return dispatch => {
        objectsService.getAreaObject({quadKeyParent1})
            .then(
                objectArea => {
                    dispatch(success(objectArea));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(objectArea) {
        return {type: t.GET_OBJS_AREA_SUCCESS, objectArea}
    }

    function failure(error) {
        return {type: t.GET_OBJS_AREA_FAILURE, error}
    }
}
function getAllObjectsByUserId({userId}) {
    return dispatch => {
        objectsService.getAllObjectsByUserId({userId})
            .then(
                myObjects => {
                    dispatch(success(myObjects));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(myObjects) {
        return {type: t.GET_MY_OBJS_SUCCESS, myObjects}
    }

    function failure(error) {
        return {type: t.GET_MY_OBJS_FAILURE, error}
    }
}

function getDetailObject({userId, objectId}) {
    return dispatch => {
        objectsService.getDetailObject({userId, objectId})
            .then(
                detail => {
                    dispatch({type: t.GET_DETAIL_OBJ_SUCCESS, detail , objectId});
                },
                error => {
                    dispatch({type: t.GET_DETAIL_OBJ_FAILURE, error});
                }
            );
    };
}


function getOnLandObjectsByUserId({userId}) {
    return dispatch => {
        objectsService.getOnLandObjectsByUserId({userId})
            .then(
                onLands => {
                    dispatch(success(onLands));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(onLands) {
        return {type: t.GET_ONLAND_OBJS_BY_USERID_SUCCESS, onLands}
    }

    function failure(error) {
        return {type: t.GET_ONLAND_OBJS_BY_USERID_FAILURE, error}
    }
}

function removeObjects({status, deletedTrees}) {
    return {type: t.REMOVE_OBJS, status, deletedTrees}
}


function updateTreeObject({objects}) {
    return {type: t.UPDATE_OBJS, objects}
}


function setTreeDies(trees) {
    console.log("trees will set to dies is", trees);
    return {type: t.SET_TREE_DIES, trees}
}

function getObjectByQuadKey(param) {

    return dispatch => {
        dispatch(loadingObject( true));
        objectsService.getObjectByQuadKey(param)
            .then(
                objectList => {
                    dispatch(success(objectList));
                    dispatch(loadingObject( false));

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(loadingObject( false));
                },

            );
    };


    function success(objectList) {
        return {type: t.GET_OBJECT_BY_QUADKEY_SUCCESS, objectList}
    }

    function failure(error) {
        return {type: t.GET_OBJECT_BY_QUADKEY_FAILURE, error}
    }
}

function getLandByCateIdAndQuadKeys(param) {
    const {reload} = param
    return dispatch => {
        objectsService.getObjectByCategories(param)
            .then(
                result => {
                    dispatch(success(result , reload));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };
    function success(result, reload) {
        return {type: t.GET_LAND_TREES_SUCCESS, result , reload}
    }

    function failure(error) {
        return {type: t.GET_LAND_TREES_FAILURE, error}
    }
    
}

//FOR MY LAND
function getLandSelectedMyLand(param) {
    return{
        type: t.GET_LAND_SELECTED_MY_LAND, param
    }
}
function getCategorySelectedMyLand(param) {
    return{
        type: t.GET_CATEGORY_SELECTED_MY_LAND, param
    }
}
//GET CURRENT CATEGORY
function getCurrentCategory(id) {
    return{
        type: t.GET_CURRENT_CATEGORY_ID, id
    }
}
//GET LAND TO PLANT TREE
function getLandToPlantTree(param) {
    return{
        type: t.GET_LAND_PLANT_TREE, param
    }
}
//GET LAND TO REMOVE TREE
function getLandToRemoveTree(param) {
    return{
        type: t.GET_LAND_REMOVE_TREE, param
    }
}

//GET LAND TO USE NUTRIENT
function getLandToUseNutrient(param) {
    return{
        type: t.GET_LAND_TO_USE_NUTRIENT, param
    }
}

//GET LAND TO USE WATER
function getLandToUseWater(param) {
    // console.log('param')
    return{
        type: t.GET_LAND_TO_USE_WATER, param
    }
}

function clearResultGetLandByCateIdsAndQuadKeys() {
    return{
        type: t.CLEAR_GET_LAND_BY_CATEID_AND_QUADKEYS
    }
}

function resetLandSelectedMyLand() {
    return{
        type: t.RESET_LAND_SELECTED_MY_LAND
    }
}


function resetLandSelectedToPlantTree() {

    return {
        type: t.RESET_LAND_SELECTED_PLANT_TREE
    }
}
function loadingObject(status) {
    return {type: t.LOADING_STATUS , status}
}