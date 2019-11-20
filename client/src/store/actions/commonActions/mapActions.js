export const SET_SELECTED = 'SET_SELECTED';
export const ADD_SELECTED = 'ADD_SELECTED';
export const REMOVE_SELECTED = 'REMOVE_SELECTED';
export const CLEAR_SELECTED = 'CLEAR_SELECTED';
export const SET_HINT_MODE = 'SET_HINT_MODE';
export const SET_PAUSE_DRAW_TILE = 'SET_PAUSE_DRAW_TILE';
//======================================================
export const ADD_CENTER_MAP_GEO = 'ADD_CENTER_MAP_GEO';
export const INVALID_TOKEN = 'INVALID_TOKEN';
export const CLEAR_INVALID_TOKEN = 'CLEAR_INVALID_TOKEN';
export const SELECT_MODE = 'SELECT_MODE';
export const CLEAR_STATUS_REMOVE_LAND_IN_CART = 'CLEAR_STATUS_REMOVE_LAND_IN_CART';
export const REMOVE_LAND_IN_CART = 'REMOVE_LAND_IN_CART';
export const ADD_LAND_TO_CART = 'ADD_LAND_TO_CART';
export const SYNC_CENTER_MAP = 'SYNC_CENTER_MAP';
export const UPDATE_MAP = 'UPDATE_MAP';
export const UPDATE_MOVABLES = 'UPDATE_MOVABLES';
export const GET_CURRENT = 'GET_CURRENT';
//====================================================================
export const UPDATE_TILES = 'UPDATE_TILES';
export const CLEAR_CART = 'CLEAR_CART';
export const SAVE_CART = 'SAVE_CART';
export const DISABLE_TILE_MAP = 'DISABLE_TILE_MAP';
//-------------------------------------------------------------------
export const LAND_MODE = "LAND_MODE";


export const mapActions = {
    //=================
    syncMap,
    setSelected,
    addSelected,
    removeSelected,
    clearSelected,
    setLandMode,
    setHintMode,
    setPauseDrawTile,
    //=================
    disableTileMap,
    clearInvalidToken,
    invalidToken,
    clearStatusRemoveLandInCart,
    removeLandInCart,
    addLandToCart,
    //map
    syncCenterMap,
    updateMap,
    //select
    selectMode,
    addCenterMapGeo,
    //clearCart,
    //saveCart,
};

function setPauseDrawTile(data) {
    return { type: SET_PAUSE_DRAW_TILE, data }
}

//==============================================================================================
function setHintMode(data){
    return { type: SET_HINT_MODE, ...data };
}

function setSelected(selected){
    return { type: SET_SELECTED, selected };
}

function addSelected(selected){
    return { type: ADD_SELECTED, selected };
}

function removeSelected(selected){
    return { type: REMOVE_SELECTED, selected };
}

function clearSelected(clearQuadKeys=[]){
    return { type: CLEAR_SELECTED, clearQuadKeys }
}
//==============================================================================================

function addCenterMapGeo(centerMapGeo){
    return { type: ADD_CENTER_MAP_GEO, centerMapGeo: centerMapGeo };
}

function disableTileMap(disableMap){
    return { type: DISABLE_TILE_MAP, disableMap: disableMap };
}

function clearInvalidToken(){
    return { type: CLEAR_INVALID_TOKEN };
}

function invalidToken(){
    return { type: INVALID_TOKEN }
}

function selectMode(mode){
    return { type: SELECT_MODE, mode }
}

function clearStatusRemoveLandInCart(){
    return { type: CLEAR_STATUS_REMOVE_LAND_IN_CART }
}

function removeLandInCart(lands){
    return { type: REMOVE_LAND_IN_CART, lands }
}

function addLandToCart(lands){
    return { type: ADD_LAND_TO_CART, lands }
}

function updateMap(map){
    return { type: UPDATE_MAP, map }
}

function setLandMode(mode){
    return { type: LAND_MODE, mode }
}

function syncCenterMap(center=null, zoom=null, centerQuadKey=null, centerChange=false, leafMap=null){
    const mapChange = {};
    if(center) mapChange.center = center;
    if(zoom) mapChange.zoom = zoom;
    if(centerQuadKey) mapChange.centerQuadKey = centerQuadKey;
    if(centerChange) mapChange.centerChange = centerChange;
    if(leafMap) mapChange.leafMap = leafMap;
    return {
        type: SYNC_CENTER_MAP,
        ...mapChange
    }
}
//==============================================NEW MAPBOX===========================================================
function syncMap({center=null, zoom=null, centerQuadKey=null, centerChange=false, leafMap=null, oddZoom=null}){
    const mapChange = {};
    if(center) mapChange.center = center;
    if(zoom) mapChange.zoom = zoom;
    if(oddZoom) mapChange.oddZoom = oddZoom;
    if(centerQuadKey) mapChange.centerQuadKey = centerQuadKey;
    if(centerChange) mapChange.centerChange = centerChange;
    if(leafMap) mapChange.leafMap = leafMap;
    return {
        type: SYNC_CENTER_MAP,
        ...mapChange
    }
}