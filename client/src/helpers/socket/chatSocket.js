// import { socketActions } from '../../store/actions/commonActions/socketActions';

const chatEvent = {
    USER_NEW_CONNECT: (socket, action) => {
        //console.log('USER_NEW_CONNECT w37958349', action);
        //socket.land.emit('USER_NEW_CONNECT', { socketId: socket.land.id, token: localStorage.getItem('token')});
        socket.land.emit(action.type, { ...action });
    },
    SEND_MESSAGE: (socket, action) => {
        console.log('SEND_MESSAGE', action);
        //socket.land.emit('USER_NEW_CONNECT', { socketId: socket.land.id, token: localStorage.getItem('token')});
        socket.chat.emit(action.type, { ...action });
    },
};

const chatSocket = (dispatch, socket) => {
    // socket.land.on('INVALID_TOKEN', (res) => {
    //     dispatch(alertActions.tokenExpiredPopup('authentication failed'));
    // });
};

export {
    chatSocket,
    chatEvent
}
