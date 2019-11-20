import {
    //=======NEW MAP=========
    SET_SELECTED,
    ADD_SELECTED,
    REMOVE_SELECTED,
    CLEAR_SELECTED,
    SET_HINT_MODE,
    SET_PAUSE_DRAW_TILE,
    //================
    DISABLE_TILE_MAP,
    CLEAR_INVALID_TOKEN,
    INVALID_TOKEN,
    CLEAR_STATUS_REMOVE_LAND_IN_CART,
    REMOVE_LAND_IN_CART,
    ADD_LAND_TO_CART,
    SYNC_CENTER_MAP,
    UPDATE_MAP,
    UPDATE_MOVABLES,
    GET_CURRENT,
    UPDATE_TILES,
    SELECT_MODE,
    //======================
    CLEAR_CART,
    SAVE_CART,
    LAND_MODE
} from '../../actions/commonActions/mapActions';

const miniLeafMap = {
    country: {
        zoom: 6,
        minZoom: 4,
        maxZoom: 8,
    },
    city: {
        zoom: 12,
        minZoom: 10,
        maxZoom: 14,
    },
    town: {
        zoom: 17,
        minZoom: 15,
        maxZoom: 19, 
    }
}

const defaultState = {
    tiles: [],
    searchLocation: {},
    clickMode: "single",
    miniMap: miniLeafMap,
    zoom: 22,
    landMode : true,
    selected: [],
    hintMode: 1,
};

export default function (state = { ...defaultState }, action) {
    switch (action.type) {
        case SET_PAUSE_DRAW_TILE:
            console.log("SET_PAUSE_DRAW_TILE", action.data);
            return {
                ...state,
                pauseDrawTile: action.data
            }
        case SET_HINT_MODE:
            // console.log("SET_HINT_MODE", action);
            return {
                ...state,
                hintMode: action.hintMode
            };
        //======================
        case SET_SELECTED:
            return {
                ...state,
                selected: [...action.selected]
            };
        case ADD_SELECTED:
            return {
                ...state,
                selected: [...state.selected, ...action.selected]
            };
        case REMOVE_SELECTED:
            const newSelected = state.selected.filter(slQK => !action.selected.some(qk => qk === slQK))
            return {
                ...state,
                selected: newSelected
            };
        case CLEAR_SELECTED:
            return { ...state, selected: [] };
        //=================================================================================================
        case DISABLE_TILE_MAP:
            return { ...state, ...action };
        case CLEAR_INVALID_TOKEN:
            if(state.invalidToken){
                delete state.invalidToken;
            }
            return { ...state };
        case INVALID_TOKEN:
            return { ...state, invalidToken: true };
        case CLEAR_STATUS_REMOVE_LAND_IN_CART:
            if(state.isRemoveLandInCart){
                delete state.isRemoveLandInCart;
            }
            return { ...state };
        case REMOVE_LAND_IN_CART:
            let cartAfterRemove = [];
            if(action.lands){
                if(state.cart){
                    if(action.lands && action.lands[0].land){ //remove land after buy in land cart
                        cartAfterRemove = state.cart.filter(land => !action.lands.some(l => l.land.quadKey === land.quadKey));
                    } else { //remove land at deleted button
                        cartAfterRemove = state.cart.filter(land => !action.lands.some(l => l.quadKey === land.quadKey));
                    }
                }
            }
            return { ...state, cart: cartAfterRemove, isRemoveLandInCart: true };
        case ADD_LAND_TO_CART:
            // if(debug){
            // }
            let newCart = [];
            if(state.cart && state.cart.length > 0){
                if(action.lands && action.lands.length > 0){
                    let arrRemoveDuplicate = action.lands.filter(land => {
                        return !state.cart.some(l => l.quadKey === land.quadKey);
                    });
                    newCart = state.cart.concat(arrRemoveDuplicate);
                }
            } else {
                newCart = newCart.concat(action.lands);
            }
            if(state.selected && state.selected.length > 0){
                state.selected = [];
            }
            return { ...state, cart: newCart };
        case UPDATE_TILES:
            return {
                ...state,
                tiles: action.tiles
            };
        case SYNC_CENTER_MAP:
            return {
                ...state,
                ...action,
            };
        case UPDATE_MAP:
            return {
                ...state,
                map: action.map
            };
        case UPDATE_MOVABLES:
            return {
                ...state,
                movables: action.movables
            };
        case GET_CURRENT:
            return {
                ...state,
                current: action.current
            };
        case CLEAR_CART:
            return {
                ...state,
                cart: null
            };
        case SAVE_CART:
            return {
                ...state,
                saveCart: [ ...state, ...action.newCart ]
            };
        case SELECT_MODE:
            return {
                ...state,
                clickMode: action.mode
            };
        case LAND_MODE:
            return {
                ...state,
                landMode: action.mode
            };
        default:
            return state
    }
}