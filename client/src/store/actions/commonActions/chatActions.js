import { apiChat } from '../../../helpers/config';
import { handleResponses, handleResponse, handleErrorResponses } from "../../../helpers/handleResponse";
import { authHeader } from '../../../helpers/authHeader';
import { store } from "../../../helpers/store";
import axios from 'axios';
import alertActions from "../../actions/commonActions/alertActions";

import { chatService } from '../../services/commonServices/chatService'
export const GETALL_CHATROOMS_SUCCESS = 'GETALL_CHATROOMS_SUCCESS';
export const GETALL_CHATROOMS_FAILURE = 'GETALL_CHATROOMS_FAILURE';
export const JOIN_ROOM_REQUEST = 'JOIN_ROOM_REQUEST';
export const LEAVE_ROOM_REQUEST = 'LEAVE_ROOM_REQUEST';
export const FETCH_MESSAGES = 'FETCH_MESSAGES';
export const UPDATE_USER_STATUS = 'UPDATE_USER_STATUS';
export const NOTIFICATION = 'NOTIFICATION';
export const GETALL_RECENTLY_CHAT_USER = 'GETALL_RECENTLY_CHAT_USER';
export const ADD_RECENTLY_CHAT_USER = 'ADD_RECENTLY_CHAT_USER ';
export const PUSH_MESSAGE = 'PUSH_MESSAGE';
export const LOAD_MORE_MESSAGE_REQUEST = 'LOAD_MORE_MESSAGE_REQUEST';
export const LOAD_MORE_MESSAGE_SUCCESS = 'LOAD_MORE_MESSAGE_SUCCESS';
export const LOAD_MORE_MESSAGE_ERROR = 'LOAD_MORE_MESSAGE_ERROR';

export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';


//========================================================================================
export const SET_CURRENT_ROOM = 'SET_CURRENT_ROOM';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
//export const GET_MESSAGES_BY_ROOM_ID = 'GET_MESSAGES_BY_ROOM_ID';
export const GET_MESSAGES_BY_ROOM_ID_SUCCESS = 'GET_MESSAGES_BY_ROOM_ID_SUCCESS';
export const GET_MESSAGES_BY_ROOM_ID_FAILURE = 'GET_MESSAGES_BY_ROOM_ID_FAILURE';
//========================================================================================

export const chatActions = {
    getMessagesByRoomId,
    setCurrentRoom,
    //========================
    getAll,
    create,
    joinRoomRequest,
    leaveRoomRequest,
    uploadImage,
    fetchMessages,
    updateUserStatus,
    pushNotification,
    addRecentlyChatUser,
    pushMessage,
    loadMore,
    clearNotifications
};

function setCurrentRoom(data) {
    return { type: 'SET_CURRENT_ROOM', ...data }
}

function getMessagesByRoomId(param) {
    // console.log('getMessagesByRoomId', param);
    // return dispatch => {
    //     axios({
    //         method: 'post',
    //         url: `${apiLand}/messages/getMessagesByRoomId`,
    //         headers: { ...authHeader(), 'Content-Type': 'application/json' },
    //         data
    //     })
    //     .then(
    //         result => dispatch({ type: GET_MESSAGES_BY_ROOM_ID_SUCCESS, result }),
    //         error => dispatch({ type: GET_MESSAGES_BY_ROOM_ID_FAILURE, error })
    //     )
    //     .catch(function (error) {
    //         // handle error
    //         console.log(error);
    //     })
    // };

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    }
    //console.log(`${apiChat}/messages/getMessagesByRoomId`);
    return dispatch => {
        fetch(`${apiChat}/messages/getMessagesByRoomId`, requestOptions)
            .then(handleResponse)
            .then(
                result => dispatch({ type: GET_MESSAGES_BY_ROOM_ID_SUCCESS, result }),
                error => dispatch({ type: GET_MESSAGES_BY_ROOM_ID_FAILURE, error })
            )
            .catch(err => {
                console.log('Err', err)
                err.toString() === 'TypeError: Failed to fetch' && store.dispatch(alertActions.tokenExpiredPopup(err));
                
            })
    };
}



function clearNotifications(rooms){
    // return {
    //     type: CLEAR_NOTIFICATIONS,
    //     rooms: rooms
    // }
}

function addRecentlyChatUser(user) {
    // return {
    //     type: ADD_RECENTLY_CHAT_USER,
    //     user: user
    // }
}

function loadMore(currentRoom, n,topMessIndex) {
    // return dispatch => {
    //     dispatch(request());
    //     chatService.loadMoreMessage(currentRoom, n,topMessIndex)
    //         .then(rs => {
    //             dispatch(success(rs));
    //         })
    //         .catch(err => dispatch(failure()));
    // };

    // function request() { return { type: LOAD_MORE_MESSAGE_REQUEST } }
    // function success(result) { return { type: LOAD_MORE_MESSAGE_SUCCESS, result } }
    // function failure() { return { type: LOAD_MORE_MESSAGE_ERROR } }
}


function create(room) {
    // return dispatch => {
    //     chatService.create(room)
    //         .then(
    //             res => {

    //             },
    //             error => {

    //             }
    //         );
    // }
}

function getAll() {
    // return dispatch => {
    //     chatService.getAll()
    //         .then(
    //             chatRooms => {
    //                 dispatch(success(chatRooms));
    //             },
    //             error => {
    //                 dispatch(failure(error));
    //             }
    //         )
    // };
    // function success(chatRooms) { return { type: GETALL_CHATROOMS_SUCCESS, chatRooms } }
    // function failure(error) { return { type: GETALL_CHATROOMS_FAILURE, error } }
}

function joinRoomRequest(roomName,user) {
    // return {
    //     type: JOIN_ROOM_REQUEST,
    //     roomName: roomName,
    //     user:user
    // }
}

function leaveRoomRequest(roomName) {
    // return {
    //     type: LEAVE_ROOM_REQUEST,
    //     roomName: roomName
    // }
}

function uploadImage(selectedFile) {
    // return chatService.uploadImage(selectedFile);
}

function fetchMessages(messages) {
    // return {
    //     type: FETCH_MESSAGES,
    //     messages: messages
    // }
}

function pushMessage(newMessage) {
    // return {
    //     type: PUSH_MESSAGE,
    //     newMessage: newMessage
    // }
}

function updateUserStatus(onlineUsers) {
    // return {
    //     type: UPDATE_USER_STATUS,
    //     onlineUsers: onlineUsers
    // }
}

function pushNotification(fromRoom) {
    // return {
    //     type: NOTIFICATION,
    //     fromRoom
    // };
}