const db = require('../../../db/db');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');

//process.env.NODE_ENV = 'development';

async function createRoom({ wToken='', name='' }) {
	try {
		if(!wToken || !name) return { status: false };

		const user = await User.findOne({ wToken });
		if(!user) return { status: false };

		const addNewRoom = await db.Room.create({
			name,
			owner: user._id,
			members: [user._id]
		});

		if(!addNewRoom) return { status: false };
		return { status: true, room: addNewRoom };
	} catch(e){
		console.log('Err: ', e);
		return { status: false };
	}
}

// async function addMemberToRoom({ wToken='', roomId='', memberId='' }) {
// 	try {
// 		if(!roomId || !memberId) return { status: false };

// 		const addNewRoom = await db.Room.findOneAndUpdate({  });

// 	} catch (e) {
// 		return { status: false };
// 	}
// }
// 

// (async () => {

// 	createRoom({ wToken: 'wTk730785399083', name: '' });

// })()


module.exports = {

};