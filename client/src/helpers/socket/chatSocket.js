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
    
    socket.chat.on('SEND_MESSAGE_RESPONSE', (result) => {
        // console.log('SEND_MESSAGE_RESPONSE', result)
        // dispatch(alertActions.tokenExpiredPopup('authentication failed'));
        if(result.status){
            dispatch({ type: 'RECEIVE_MESSAGE', message: result.message });
        }
    });

};

export {
    chatSocket,
    chatEvent
}
