const applySocketMiddeware = (socket, allSocketFn) => {
    return store => next => action => {
        // /console.log("action.type", action.type);
        const isFnExist = allSocketFn.hasOwnProperty(action.type);
        if (isFnExist) {
            const socketEmitter = allSocketFn[action.type];
            // console.log('allSocketFn', action.type, allSocketFn[action.type])
            // const token = localStorage.getItem('token');
            // const socketId = socket.land.id;
            // console.log("action.type", token, socketId);
            action.token = localStorage.getItem('token');
            action.socketId = socket.land.id;
            //console.log('action', action)
            
            socketEmitter(socket, action);
        }
        next(action);
    }
};

export {
    applySocketMiddeware
}