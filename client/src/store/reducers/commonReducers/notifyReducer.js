import {
    GET_NOTICE_SUCCESS,
    GET_NOTICE_FAILURE,
    GET_BY_ID_NOTIFY_SUCCESS,
    GET_BY_ID_NOTIFY_FAILURE,
    UPDATE_STATUS_NOTIFY_SUCCESS,
    UPDATE_STATUS_NOTIFY_FAILURE,
    SEND_NOTIFY_SUCCESS,
    SEND_NOTIFY_FAILURE, OPEN_NOTIFY,

    CREATE_NOTICE_SUCCESS,
    CREATE_NOTICE_FAILURE,
    UPDATE_NOTICE_SUCCESS,
    UPDATE_NOTICE_FAILURE,

    DELETE_NOTICE_SUCCESS,
    DELETE_NOTICE_FAILURE,
    HAVE_READ_NOTICE_SUCCESS,
    HAVE_READ_NOTICE_FAILURE
} from "../../actions/commonActions/notifyActions";

const notificationReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_NOTICE_SUCCESS:
            return {
                ...state,
                notifies: action.notices
            };
        case GET_NOTICE_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case CREATE_NOTICE_SUCCESS:
            return {
                ...state,
                notifies: action.notices
            };
        case CREATE_NOTICE_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case GET_BY_ID_NOTIFY_SUCCESS:
            return {
                ...state,
                notifies: action.notifies
            };
        case GET_BY_ID_NOTIFY_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case UPDATE_STATUS_NOTIFY_SUCCESS:
            return {
                ...state,
                notifies: action.notifies
            };
        case UPDATE_STATUS_NOTIFY_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case UPDATE_NOTICE_SUCCESS:
            return {
                ...state,
                notifies: action.notifies
            };
        case UPDATE_NOTICE_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case DELETE_NOTICE_SUCCESS:
            return {
                ...state,
                notifies: action.notices
            };
        case DELETE_NOTICE_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case SEND_NOTIFY_SUCCESS:
            return {
                ...state,
                notifies: action.notifies
            };
        case SEND_NOTIFY_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case HAVE_READ_NOTICE_SUCCESS:
            return {
                ...state,
                notifies: action.notices
            };
        case HAVE_READ_NOTICE_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case OPEN_NOTIFY:
            return{
                ...state,
                notice: action.notice
            };
        default:
            return state
    }
};

export default notificationReducer;