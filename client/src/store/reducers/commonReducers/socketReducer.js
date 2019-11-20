import {
    SAVE_CONNECT_SOCKET,
    //===============================================================================

    TRANSFER_BLOOD_SOCKET,
    TRANSFER_BLOOD_TRADING_LAND,
    PURCHASE_LAND,
    CLEAR_SOCKET_ACTION,
    REMOVE_HISTORY_TRADING_LAND_SOCKET,
    SELL_LAND_SOCKET,
    USER_NEW_CONNECT,
    USER_DISCONNECTED,
} from '../../actions/commonActions/socketActions';

// import {
//     JOIN_ROOM_REQUEST,
//     LEAVE_ROOM_REQUEST,
//     PUSH_MESSAGE
// } from '../../actions/commonActions/chatActions';


import * as t from "../../actionTypes/landActionTypes/landActionTypes"

export default function (state = { rooms: {} }, action) {
    switch (action.type) {
        //======================================================
        case SAVE_CONNECT_SOCKET:
            //console.log('SAVE_CONNECT_SOCKET', action);
            return { ...state, socketId: action.connectData.socketId }
        //======================================================
        case TRANSFER_BLOOD_SOCKET:
            return { ...state, action: action };
        case TRANSFER_BLOOD_TRADING_LAND:
            return { ...state, action: action };
        case CLEAR_SOCKET_ACTION:
            return { ...state, action: undefined };
        case t.GET_ALL_LAND_SUCCESS:
            return { ...state, action: undefined };
        case t.GET_ALL_LAND_FAILURE:
            return { ...state, action: undefined };
        case REMOVE_HISTORY_TRADING_LAND_SOCKET:
            return { ...state, action: action };
        // case PUSH_MESSAGE:
        //     return {
        //         ...state,
        //         action: undefined
        //     };
        // case JOIN_ROOM_REQUEST:
        //     return {
        //         ...state,
        //         roomName: action.roomName,
        //         action: action
        //     };
        // case LEAVE_ROOM_REQUEST:
        //     return {
        //         ...state,
        //         roomName: action.roomName,
        //         action: action
        //     };
        case USER_DISCONNECTED:
            return {
                ...state,
                user: action.user,
                action: action
            };
        case PURCHASE_LAND:
            return {
                ...state,
                action: action
            };
        case SELL_LAND_SOCKET:
            console.log('action ', action);
            return {
                ...state,
                action: action
            };
        default:
            return { ...state };
    }
}