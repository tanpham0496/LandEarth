const { addMessage } = require('../containers/messages/services');

module.exports = function (io, socket) {

    socket.on("SEND_MESSAGE", async ({ user, socketId, roomId, message }) => {
        
        console.log('SEND_MESSAGE', message);

        const addMsg = await addMessage({ user, roomId, message });
        if(addMsg.status){
        	console.log('SEND_MESSAGE');
        	//socket.emit('SEND_MESSAGE_RESPONSE');
        }
        // const updateUser = await db.User.findOneAndUpdate({ _id: user._id }, { sId: socketId }, { new: true });
        // if(!updateUser){
        //     socket.emit('ERROR', { err: "cantUpdateSID" });
        //     return;
        // }
        // addMessage
        // console.log('USER_NEW_CONNECT_RESPONSE', { h: 'klkl' });
        // console.log('socketId', socketId);
        

        
    });

}