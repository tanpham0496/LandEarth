import moment from 'moment';
import {
    SET_CURRENT_ROOM,
    GET_MESSAGES_BY_ROOM_ID_SUCCESS,
    RECEIVE_MESSAGE

    // GETALL_CHATROOMS_SUCCESS,
    // GETALL_RECENTLY_CHAT_USER,
    // ADD_RECENTLY_CHAT_USER,
    // JOIN_ROOM_REQUEST,
    // UPDATE_USER_STATUS,
    // FETCH_MESSAGES,
    // PUSH_MESSAGE,
    // LOAD_MORE_MESSAGE_REQUEST,
    // LOAD_MORE_MESSAGE_SUCCESS,
    // LOAD_MORE_MESSAGE_ERROR,
    // NOTIFICATION,
    // CLEAR_NOTIFICATIONS,
} from '../../actions/commonActions/chatActions';
//import { USER_LOGOUT } from "../../actions/commonActions/userActions";

const initialState = {
    //recentlyChatUser: [{ 'name': 'all' }],
    //n: 1,
    //loading: false,
    // messages: {},
    //notifications: [],
    //currentRoomId: '-1'
    rooms: {},
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_ROOM:
            // console.log('SET_CURRENT_ROOM', action);
            return {
                ...state,
                currentRoomId: action.roomId,
                pageLoadMsg: action.pageLoadMsg,
            }
        case GET_MESSAGES_BY_ROOM_ID_SUCCESS:
            // console.log('GET_MESSAGES_BY_ROOM_ID_SUCCESS', action.result);
            const { room } = action.result;
            const iMsg = room.messages.length;
            room.lastMsg = iMsg ? room.messages[iMsg-1] : {};
            //console.log('room.lastMsg', room.lastMsg);
            return {
                ...state,
                rooms: { [room.id]: room }
            }
        case RECEIVE_MESSAGE:
            //console.log('state.rooms[state.currentRoomId]',state.rooms[state.currentRoomId])
            if(state.currentRoomId === null || state.currentRoomId){
                const diffMiliseconds = moment(state.rooms[state.currentRoomId].lastMsg.createdAt).diff(moment(action.message.createdAt), 'miliseconds');
                //console.log('diffMiliseconds', diffMiliseconds);
                let curRoom = state.rooms[state.currentRoomId];
                curRoom.lastMsg = action.message;
                curRoom.messages.push(action.message);
                if(!diffMiliseconds){
                    return {
                        ...state,
                        messages :action.messages,
                        rooms: { ...state.rooms, [state.currentRoomId]: curRoom }
                    }
                }
            }

            return { ...state }

        // case FETCH_MESSAGES:
        //     return {
        //         ...state,
        //         messages: action.messages,
        //         loading: false,
        //     };

        // case GETALL_CHATROOMS_SUCCESS: {
        //     return {
        //         ...state,
        //         chatRooms: action.chatRooms
        //     }
        // }

        // case JOIN_ROOM_REQUEST: {
        //     const notifySet = new Set(state.notifications);
        //     return (typeof state.notifications !== 'undefined' && state.notifications.length > 0) ? {
        //         ...state,
        //         chatRooms: state.chatRooms,
        //         currentRoom: action.roomName,
        //         notifications: state.notifications.filter(nt => nt.room === action.roomName),
        //         loading: true,
        //         n: 1
        //     } : {
        //         ...state,
        //         chatRooms: state.chatRooms,
        //         currentRoom: action.roomName,
        //         notifications: Array.from(notifySet),
        //         loading: true,
        //         n: 1
        //     };
        // }

        // case PUSH_MESSAGE: {
        //     let newMessages = typeof state.messages === 'undefined' ? [] : state.messages;
        //     newMessages = [...newMessages, action.newMessage];
        //     return {
        //         ...state,
        //         loading: false,
        //         messages: newMessages
        //     }
        // }

        // case UPDATE_USER_STATUS:
        //     return {
        //         ...state,
        //         onlineUsers: action.onlineUsers
        //     };
        // case GETALL_RECENTLY_CHAT_USER:
        //     return {
        //         ...state,
        //         recentlyChatUser: action.recentlyChatUser
        //     };

        // case ADD_RECENTLY_CHAT_USER:
        //     return {
        //         ...state,
        //         recentlyChatUser: [action.user, ...state.recentlyChatUser]
        //     };

        // case USER_LOGOUT:
        //     return {};

        // case LOAD_MORE_MESSAGE_REQUEST:
        //     return {
        //         ...state,
        //         loading: true
        //     };

        // case LOAD_MORE_MESSAGE_SUCCESS:
        //     return {
        //         ...state,
        //         loading: false,
        //         n: action.result.nextN,
        //         messages: [...action.result.messages, ...state.messages]
        //     };

        // case LOAD_MORE_MESSAGE_ERROR:
        //     return {
        //         ...state,
        //         n: -1,
        //         loading: false
        //     };

        // case NOTIFICATION:
        //     const notifySet = new Set(state.notifications);
        //     if (action.fromRoom !== state.currentRoom) notifySet.add(action.fromRoom);
        //     return {
        //         ...state,
        //         notifications: Array.from(notifySet)
        //     };

        // case CLEAR_NOTIFICATIONS:
        //     let updateNotifications = state.notifications.filter(nt => !action.rooms.find(r => r === nt));

        //     return {
        //         ...state,
        //         notifications: updateNotifications
        //     };
        default:
            return { ...state }
    }
}
