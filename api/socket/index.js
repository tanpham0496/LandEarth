const db = require('../db/db');
const landSocket = require('./landSocket');
const { getByToken } = require('../containers/users/services');
const { middleware } = require('./middleware');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log("==> connection");

        //create middleware
        middleware(socket);

        //==============================================================================================================================================
        socket.on("USER_NEW_CONNECT", async (socketData) => {
            
            // console.log('USER_NEW_CONNECT', socketData);
            const { user, socketId } = socketData;
            const updateUser = await db.User.findOneAndUpdate({ _id: user._id }, { sId: socketId }, { new: true });
            // console.log('==> Update sId', 'updateUser');
            if(!updateUser){
                socket.emit('ERROR', { err: "cantUpdateSID" });
                return;
            }

            socket.emit('USER_NEW_CONNECT_RESPONSE');    
        });
        //==============================================================================================================================================

        landSocket(io, socket);

    });
};

