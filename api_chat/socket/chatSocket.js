const { addMessage } = require('../containers/messages/services');

module.exports = function (io, socket) {

    socket.on("SEND_MESSAGE", async ({ user, socketId, roomId, message }) => {
        
        const addMsg = await addMessage({ user, roomId, message });
        if(addMsg.status){
            io.emit('SEND_MESSAGE_RESPONSE', { ...addMsg });
        }
        // const updateUser = await db.User.findOneAndUpdate({ _id: user._id }, { sId: socketId }, { new: true });
        // if(!updateUser){
        //     socket.emit('ERROR', { err: "cantUpdateSID" });
        //     return;
        // }
        // addMessage
        // console.log('socketId', socketId);
        

    });

}