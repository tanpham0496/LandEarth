//process.env.NODE_ENV = 'development';
const db = require('../../../db/db');

async function addMessage({ user, roomId, message }) {
	try {
		if(!message) return { status: false, err: 'noMessage' };

		const newMessage = await db.Message.create({ message, roomId, senderId: user._id });
		if(!newMessage) return { status: false };

		console.log('message', newMessage);
		return { status: true, message: newMessage };
	} catch (e){
		console.log('Err', e);
		return { status: false, err: e }
	}
}

/**
 * Gets the messages by room identifier.
 *
 * @param      {Object}   arg1         The argument 1
 * @param      {string || null}   arg1.roomId  The room identifier
 * @return     {object}  The messages by room identifier. { status: true, room: { id: roomId, messages } }
 * 
 */
async function getMessagesByRoomId({ roomId }) {
	try {
		// //if(!message) return { status: false, err: 'noMessage' };

		const messages = await db.Message.find({ roomId }).select('-updatedAt').limit(50);
		//console.log('messages', messages);
		if(!messages) return { status: false };

		//console.log('room', { id: roomId, messages });
		return { status: true, room: { id: roomId, messages } };
	} catch (e){
		console.log('Err', e);
		return { status: false, err: e }
	}
}


// (async () => {

// 	const k = await getMessages({ roomId: null });
// 	console.log('k', k)

// })()

module.exports = {
	addMessage,
	getMessagesByRoomId
}