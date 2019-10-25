const db = require('../db/db');
const chatSocket = require('./chatSocket');
const { middleware } = require('./middleware');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log("==> connection");

        //create middleware
        middleware(socket);

        //==============================================================================================================================================
        // socket.on("USER_NEW_CONNECT", async (socketData) => {
            
        //     //console.log('USER_NEW_CONNECT', socketData);
        //     const { user, socketId } = socketData;
        //     const updateUser = await db.User.findOneAndUpdate({ _id: user._id }, { sId: socketId }, { new: true });
        //     if(!updateUser){
        //         socket.emit('ERROR', { err: "cantUpdateSID" });
        //         return;
        //     }

        //     console.log('USER_NEW_CONNECT_RESPONSE', { h: 'klkl' });
        //     console.log('socketId', socketId);
        //     socket.emit('USER_NEW_CONNECT_RESPONSE');

            
        // })
        //==============================================================================================================================================

        chatSocket(io, socket);

    });
};

