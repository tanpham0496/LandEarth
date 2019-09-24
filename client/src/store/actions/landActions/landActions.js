import { apiLand } from '../../../helpers/config';
import {landService} from "../../services/landServices/landService";
import * as t from "../../actionTypes/landActionTypes/landActionTypes"
import {objectsActions} from "../gameActions/objectsActions";
import { authHeader } from '../../../helpers/authHeader';
import alertActions from "../../actions/commonActions/alertActions";
import { store } from "../../../helpers/store";
import { handleResponses, handleErrorResponses } from "../../../helpers/handleResponse"

export const landActions = {
    getListForSaleLands,
    changePriceSellLands,
    getSellLandInfos,
    getAllLandMarkCategoryInMap,
    addCenterCategory,
    getAllHistoryTradingLandById,
    getDefault,
    getAllLandById,
    //getAllLand,
    getAllCategory,
    transferLandCategory,
    editLand,
    addCategory,
    editCategory,
    deleteLandCategory,
    clearPurchaseStatusSocket,
    saveSelectedLandPosition,
    getAllLandMarkCategory,
    getAllLandCategory,
    getLandByCategory,
    getLandByCategoryForChecking,
    changeLandMarkState,
    getLastestQuadkeyLandPurchase,
    getAreaLand,
    getLandInfo,
    getLandByQuadKeys,
    getAllLandCategoryNew,
    getLandByCategoryNew,
    transferLandCategoryNew,
    getAllLandByCategoryId
};

function getListForSaleLands(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    }
    return dispatch => {
        fetch(`${apiLand}/lands/getListForSaleLands`, requestOptions)
            .then(handleResponses).catch(err => err.toString() === 'TypeError: Failed to fetch' && store.dispatch(alertActions.tokenExpiredPopup(err)))
            .then(
                result => dispatch({ type: t.GET_LIST_FOR_SALE_LANDS_SUCCESS, result }),
                error => dispatch({ type: t.GET_LIST_FOR_SALE_LANDS_FAILURE, error })
            );
    };
}


function changePriceSellLands(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    }
    return dispatch => {
        fetch(`${apiLand}/lands/changePriceSellLands`, requestOptions)
            .then(handleResponses).catch(err => err.toString() === 'TypeError: Failed to fetch' && store.dispatch(alertActions.tokenExpiredPopup(err)))
            .then(
                result => console.log('result', result) /*dispatch({ type: t.GET_SELL_LAND_INFOS_SUCCESS, result })*/,
                error => dispatch({ type: t.GET_SELL_LAND_INFOS_FAILURE, error })
            );
    };
}

function getSellLandInfos(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    }
    return dispatch => {
        fetch(`${apiLand}/lands/getSellLandInfos`, requestOptions)
            .then(handleResponses).catch(err => err.toString() === 'TypeError: Failed to fetch' && store.dispatch(alertActions.tokenExpiredPopup(err)))
            .then(
                result => dispatch({ type: t.GET_SELL_LAND_INFOS_SUCCESS, result }),
                error => dispatch({ type: t.GET_SELL_LAND_INFOS_FAILURE, error })
            );
    };
}

function getLandInfo(param) {
    // console.log('getLandInfo')
    return dispatch => {
        landService.getLandInfo(param)
            .then(
                result => dispatch({ type: t.GET_LAND_INFO_SUCCESS, result }),
                error => dispatch({ type: t.GET_LAND_INFO_FAILURE, error })
            );
    };
}

function getAllLandMarkCategoryInMap() {
    // console.log('getAllLandMarkCategoryInMap')
    return dispatch => {
        landService.getAllLandMarkCategoryInMap()
            .then(
                res => dispatch({ type: t.GET_ALL_LAND_MARK_CATEGORY_IN_MAP_SUCCESS, res }),
                error => dispatch({ type: t.GET_ALL_LAND_MARK_CATEGORY_IN_MAP_FAILURE, error })
            );
    };
}


function getLandByCategory(param) {
    // console.log('getLandByCategory')
    return dispatch => {
        landService.getLandByCategory(param)
            .then(
                result => dispatch({ type: t.GET_LAND_BY_CATEGORY_SUCCESS, category: result }),
                error => dispatch({ type: t.GET_LAND_BY_CATEGORY_FAILURE, error })
            );
    };
}
function getLandByCategoryNew(param) {

    return dispatch => {
        landService.getLandByCategory(param)
            .then(
                result => dispatch({type: t.GET_LAND_BY_QUADKEY_NEW_SUCCESS, categoryLandList: result}),
                error => dispatch({type: t.GET_LAND_BY_QUADKEY_NEW_FAILURE, error})
            );
    };
}
function getLandByCategoryForChecking(param) {
    // console.log('getLandByCategoryForChecking')
    return dispatch => {
        landService.getLandByCategory(param)
            .then(
                result => dispatch({ type: t.GET_LAND_BY_CATEGORY_FOR_CHECKING_SUCCESS, category: result }),
                error => dispatch({ type: t.GET_LAND_BY_CATEGORY_FOR_CHECKING_FAILURE, error })
            );
    };
}


function getAllLandMarkCategory(param) {
    // console.log('getAllLandMarkCategory')
    return dispatch => {
        landService.getAllLandMarkCategory(param)
            .then(
                result => dispatch({ type: t.GET_ALL_LAND_MARK_CATEGORY_SUCCESS, categories: result }),
                error => dispatch({ type: t.GET_ALL_LAND_MARK_CATEGORY_FAILURE, error })
            );
    };
}

function getAllLandCategory(param) {
    // console.log('getAllLandCategory')
    return dispatch => {
        landService.getAllLandCategory(param)
            .then(
                result => dispatch({ type: t.GET_ALL_LAND_CATEGORY_SUCCESS, categories: result }),
                error => dispatch({ type: t.GET_ALL_LAND_CATEGORY_FAILURE, error })
            );
    };
}

function getAllLandCategoryNew(param) {
    // console.log('getAllLandCategory')
    return dispatch => {
        landService.getAllLandCategoryNew(param)
            .then(
                result => dispatch({type: t.GET_ALL_LAND_CATEGORY_NEW_SUCCESS, categoryList: result}),
                error => dispatch({type: t.GET_ALL_LAND_CATEGORY_NEW_FAILURE, error})
            );
    };
}

function getAllLandByCategoryId(param){
    return dispatch => {
        landService.getAllLandByCategoryId(param).then(

        )
    }
}
function addCenterCategory(param) {
    // console.log('addCenterCategory')
    return dispatch => {
        landService.addCenterCategory(param)
            .then(
                res => dispatch({ type: t.ADD_CENTER_CATEGORY_SUCCESS, res }),
                error => dispatch({ type: t.ADD_CENTER_CATEGORY_FAILURE, error })
            );
    };
}

function getDefault() {
    // console.log('getDefault')
    return dispatch => {
        dispatch({ type: t.GET_DEFAULT });
        landService.getDefault()
            .then(
                res => dispatch({ type: t.GET_DEFAULT_SUCCESS, res }),
                error => dispatch({ type: t.GET_DEFAULT_FAILURE, error })
            );
    };
}

function getAllLandById(userId) {
    // console.log('getAllLandById')

    // console.log('param', userId)
    return dispatch => {
        // dispatch(loadingLandAction(true))
        //dispatch({ type: GET_ALL_LAND_BY_ID });
        landService.getAllLandById(userId)
            .then(

                res => {
                    // console.log('res', res);
                    // dispatch(loadingLandAction(false))
                    dispatch({ type: t.GET_ALL_LAND_BY_ID_SUCCESS, res })
                },
                error => dispatch({ type: t.GET_ALL_LAND_BY_ID_FAILURE, error })
            );
    };
}

function getAreaLand(startEndTile) {
    // console.log('getAreaLand')
    return dispatch => {
        dispatch({ type: t.GET_ALL_LAND });
        landService.getAreaLand(startEndTile)
            .then(
                areaLand => dispatch({ type: t.GET_AREA_LAND_SUCCESS, areaLand }),
                error => dispatch({ type: t.GET_AREA_LAND_FAILURE, error })
            );
    };
}
function getAllHistoryTradingLandById(userId) {
    // console.log('getAllHistoryTradingLandById')
    return dispatch => {
        landService.getAllHistoryTradingLandById(userId)
            .then(
                histories => dispatch({ type: t.GET_ALL_HISTORY_TRADING_LAND_BY_ID_SUCCESS, histories }),
                error => {
                    dispatch({ type: t.GET_ALL_HISTORY_TRADING_LAND_BY_ID_FAILURE, error });
                }
            );
    };
}

function clearPurchaseStatusSocket() {
    // console.log('getAllHistoryTradingLandById')
    return { type: t.CLEAR_PURCHASE_STATUS_SOCKET };
}

function getAllCategory(userId) {
    // console.log('getAllCategory')
    return dispatch => {
        landService.getAllCategory(userId)
            .then(
                categories => dispatch(success(categories)),
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(categories) {
        return { type: t.LANDS_GETALLCATEGORY_SUCCESS, categories }
    }

    function failure(error) {
        return { type: t.LANDS_GETALLCATEGORY_FAILURE, error }
    }
}

function transferLandCategory(param) {
    return dispatch => {
        landService.transferLandCategory(param)
            .then(
                modifiedCate => dispatch(success(modifiedCate)),
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(modifiedCate) {
        return { type: t.TRANSFER_LAND_CATEGORY_SUCCESS, modifiedCate }
    }

    function failure(error) {
        return { type: t.TRANSFER_LAND_CATEGORY_FAILURE, error }
    }
}

function transferLandCategoryNew(param) {
    const paramGetLandByCategory = {
        cateId: param.oldCateId,
        userId: param.userId
    };
    return dispatch => {
        landService.transferLandCategoryNew(param)
            .then(
                result => {
                    dispatch(getAllLandCategoryNew({userId: param.userId}));
                    dispatch(objectsActions.getObjectByQuadKey(paramGetLandByCategory));
                    result && dispatch(success(result))
                }
            );
    };

    function success(result) {
        return {type: t.TRANSFER_LAND_CATEGORY_NEW_SUCCESS, result}
    }

}


function addCategory(param) {
    const {userId} = param;
    const getAllLandCategoryNewParam = {userId};
    return dispatch => {
        landService.addCategory(param)
            .then(
                categories => {
                    dispatch(success(categories))
                    dispatch(getAllLandCategoryNew(getAllLandCategoryNewParam))
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(getAllLandCategoryNew(getAllLandCategoryNewParam))
                }
            );
    };

    function success(categories) {
        return { type: t.ADD_CATEGORY_SUCCESS, categories }
    }

    function failure(error) {
        return { type: t.ADD_CATEGORY_FAILURE, error }
    }
}

function editLand(param) {
    // console.log('editLand')
    const paramGetLandByCategory = {
        cateId: param.cateId,
        userId: param.userId
    };
    return dispatch => {
        landService.editLand(param)
            .then(
                modifiedLand => {
                    dispatch(success(modifiedLand));
                    dispatch(objectsActions.getObjectByQuadKey(paramGetLandByCategory))
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(modifiedLand) {
        return { type: t.EDIT_LAND_SUCCESS, modifiedLand }
    }

    function failure(error) {
        return { type: t.EDIT_LAND_FAILURE, error }
    }
}

function editCategory(param) {
    // console.log('editCategory')
    const {userId} = param;
    const getAllLandCategoryNewParam = {userId};
    return dispatch => {
        landService.editCategory(param)
            .then(
                modifiedCate => {
                    dispatch(success(modifiedCate));
                    // {userId: _id}
                    dispatch(getAllLandCategoryNew(getAllLandCategoryNewParam))
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(getAllLandCategoryNew(getAllLandCategoryNewParam))
                }
            );
    };

    function success(modifiedCate) {
        return { type: t.EDIT_CATEGORY_SUCCESS, modifiedCate }
    }

    function failure(error) {
        return { type: t.EDIT_CATEGORY_FAILURE, error }
    }
}

function deleteLandCategory(param) {
    const {userId} = param;
    const getAllLandCategoryNewParam = {userId};
    // console.log('deleteLandCategory')
    return dispatch => {
        landService.deleteLandCategory(param)
            .then(
                emptyCateLands =>{
                    dispatch(success(emptyCateLands));
                    dispatch(getAllLandCategoryNew(getAllLandCategoryNewParam))

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(getAllLandCategoryNew(getAllLandCategoryNewParam))

                }
            );
    };

    function success(emptyCateLands) {
        return { type: t.DELETE_LAND_CATEGORY_SUCCESS, emptyCateLands }
    }

    function failure(error) {
        return { type: t.DELETE_LAND_CATEGORY_FAILURE, error }
    }
}

function saveSelectedLandPosition(landSelected) {
    return { type: t.SAVE_LAND_SELECTED_POSITION, landSelected }
}

function changeLandMarkState(param) {
    // console.log('changeLandMarkState')
    return dispatch => {
        landService.changeLandMarkState(param)
            .then(
                res => {
                    // console.log("res", res);
                },
                error => {
                    // console.log("error", error);
                }
            );
    };
}

function getLastestQuadkeyLandPurchase (param) {
    // console.log('getLastestQuadkeyLandPurchase')
    return {type: t.GET_LATEST_QUADKEY_LAND_PURCHASE , param}
}

function getLandByQuadKeys(param) {
    return dispatch => {
        landService.getLandByQuadKeys(param)
            .then(
                res => dispatch({ type: t.GET_LAND_BY_QUADKEY_SUCCESS, param, res }),
                error => dispatch({ type: t.GET_LAND_BY_QUADKEY_FAILURE, param, error })
            );
    };
}

function loadingLandAction(status) {
    return{
        type: t.LOADING_LAND_STATUS , status
    }
}