import {
    GET_DEVELOP_SUCCESS,
    GET_DEVELOP_FAILURE,
    GET_BY_ID_DEVELOP_SUCCESS,
    GET_BY_ID_DEVELOP_FAILURE,
    UPDATE_STATUS_DEVELOP_SUCCESS,
    UPDATE_STATUS_DEVELOP_FAILURE,
    SEND_DEVELOP_SUCCESS,
    SEND_DEVELOP_FAILURE, OPEN_DEVELOP,

    CREATE_DEVELOP_SUCCESS,
    CREATE_DEVELOP_FAILURE,
    UPDATE_DEVELOP_SUCCESS,
    UPDATE_DEVELOP_FAILURE,

    DELETE_DEVELOP_SUCCESS,
    DELETE_DEVELOP_FAILURE
} from "../../actions/commonActions/developActions";

const developmentalReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_DEVELOP_SUCCESS:
            return {
                ...state,
                develops: action.develops
            };
        case GET_DEVELOP_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case CREATE_DEVELOP_SUCCESS:
            return {
                ...state,
                develops: action.develops
            };
        case CREATE_DEVELOP_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case GET_BY_ID_DEVELOP_SUCCESS:
            return {
                ...state,
                develops: action.develops
            };
        case GET_BY_ID_DEVELOP_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case UPDATE_STATUS_DEVELOP_SUCCESS:
            return {
                ...state,
                develops: action.develops
            };
        case UPDATE_STATUS_DEVELOP_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case UPDATE_DEVELOP_SUCCESS:
            return {
                ...state,
                develops: action.develops
            };
        case UPDATE_DEVELOP_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case DELETE_DEVELOP_SUCCESS:
            return {
                ...state,
                develops: action.develops
            };
        case DELETE_DEVELOP_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case SEND_DEVELOP_SUCCESS:
            return {
                ...state,
                develops: action.develops
            };
        case SEND_DEVELOP_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case OPEN_DEVELOP:
            // console.log('develop', action.develop)
            return{
                ...state,
                develop: action.develop
            };
        default:
            return state
    }
};

export default developmentalReducer;