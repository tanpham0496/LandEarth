import {
    SET_LANDS_PER_CELL_INFO_SUCCESS,
    SET_LANDS_PER_CELL_INFO_FAILURE,
    SET_TODAY_LAND_INFO_SUCCESS,
    SET_TODAY_LAND_INFO_FAILURE,
    GET_SETTING_SUCCESS,
    GET_SETTING_FAILURE,
    SET_LAND_SHOW_INFO_SUCCESS,
    SET_LAND_SHOW_INFO_FAILURE,
    SET_BACKGROUND_MUSIC_SUCCESS,
    SET_BACKGROUND_MUSIC_FAILURE,
    SET_EFFECT_MUSIC_SUCCESS,
    SET_EFFECT_MUSIC_FAILURE,
    SET_SETTING_SUCCESS,
    SET_SETTING_FAILURE,
    SET_LANGUAGE_SUCCESS,
    SET_LANGUAGE_FAILURE,
    GAME_MODE,
    SHOW_CHARACTER,
    SHOW_ITEM,
    MAP_EXPANDING
} from "../../actions/commonActions/settingActions";

const initState = {
    bgMusic: { volume: 0, turnOn: true },
    effMusic: { volume: 0, turnOn: false },
    land: { showInfo: false },
    language: 'kr',
    gameMode: false,
    showCharacter: true,
    showItem: true,
    mapExpanding: false,
    disableMode: true
}
const settingReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_LANDS_PER_CELL_INFO_SUCCESS:
            //console.log('action', action)
            // if(action.status) return { ...state, todayLandInfo: action.todayLandInfo }
            // else return { ...state, setTodayLandInfoError: action.error }
            return { ...state, ...action };
        case SET_LANDS_PER_CELL_INFO_FAILURE:
            return { ...state, ...action };
        case SET_TODAY_LAND_INFO_SUCCESS:
            //console.log('action', action)
            if(action.status) return { ...state, todayLandInfo: action.todayLandInfo }
            return { ...state }
        case SET_TODAY_LAND_INFO_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case SET_LAND_SHOW_INFO_SUCCESS:
            //console.log('SET_LAND_SHOW_INFO_SUCCESS', action)
            return {
                ...state,
                land: action.land.land
            };
        case SET_LAND_SHOW_INFO_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case SET_BACKGROUND_MUSIC_SUCCESS:
        
            return {
                ...state,
                bgMusic: action.bgMusic.bgMusic
            };
        case SET_BACKGROUND_MUSIC_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case SET_EFFECT_MUSIC_SUCCESS:
            return {
                ...state,
                effMusic: action.effMusic.effMusic
            };
        case SET_EFFECT_MUSIC_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case SET_LANGUAGE_SUCCESS:
            return {
                ...state,
                language: action.language,
            };
        case SET_LANGUAGE_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case GET_SETTING_SUCCESS:
            return {
                ...state,
                ...action.setting
            };
        case GET_SETTING_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case SET_SETTING_SUCCESS:
            return {
                ...state,
                ...action.setting
            };
        case SET_SETTING_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case GAME_MODE:
            return {
                ...state,
                gameMode: action.mode
            };

        case SHOW_CHARACTER:
            return {
                ...state,
                showCharacter: action.displayChar
            };
        case SHOW_ITEM:
            return {
                ...state,
                showItem: action.displayItem
            };

        case MAP_EXPANDING:
            return {
                ...state,
                mapExpanding: action.expand
            };
        default:
            return state
    }
};

export default settingReducer;