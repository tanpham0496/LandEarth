const db = require('../../../db/db');
const AdminNotify = db.AdminNotify;
const User = db.User;
const moment = require('moment');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
   //tan
    create,
    get,
    //update ,
    delete: _delete,
    getById,
    read,
    createAndGetAllNotification
};

async function get() {
    const newNotify = await AdminNotify.find({});
    newNotify.reverse();
    return await newNotify;
}

async function getById(id) {
    try{
        const newNotify = await AdminNotify.find({userId : id});
        newNotify.reverse();
        return await newNotify;
    }
    catch (e) {
      console.log('error',e)
    }

}

async function createAndGetAllNotification (param) {
    try{
        await create(param);
        return getById(param.userId);
    }
    catch (e) {
        console.log('error',e)
    }
}

async function create(param) {
    try{
        const checkUserAdmin = await User.findById(param.userId);
        if(checkUserAdmin && checkUserAdmin.role === 'editor' ) {
            const users = await db.User.find().select('_id nameAdmin');
            const objectId =  mongoose.Types.ObjectId();
            await Promise.all(
                users.map(user =>
                    AdminNotify.create( {
                        title: param.title,
                        userId: user._id,
                        // nameAdmin: param.nameAdmin,
                        nameAdmin: 'Administrator',
                        idNotify : objectId,
                        category: param.category,
                        content: param.content.editorState,
                        createdDate: moment( param.createdDate ).format( 'DD/MM/YYYY' ),
                        read: false
                    })
                )
            )
            return true;
        }
        else {
            return false;
        }
    }
    catch (e) {
        console.log('error',e)
    }
}

// async function update(param){
//     const checkUserAdmin = await User.findById(param.userId);
//     if(checkUserAdmin && checkUserAdmin.role === 'editor' ) {
//         // let _idNotify = param.idNotify;
//         // let updateObj = Object.assign({}, param);
//         // console.log('updateObj',updateObj);
//         // delete updateObj.idNotify;
//         // return await AdminNotify.findByIdAndUpdate(_idNotify,updateObj,{new: true});
//         const users = await db.User.find().select('_id nameAdmin');
//         await Promise.all(
//             users.map(user =>
//                 {
//                     let updateObj = Object.assign({}, param);
//                     return AdminNotify.findOneAndUpdate(user.idNotify,{ $set: updateObj },{new: true});
//                 }
//             )
//         )
//         return true;
//     }
//     else {
//        return false;
//     }
// }

async function _delete(param) {
    try{
        const checkUserAdmin = await User.findById(param.userId);
        if(checkUserAdmin && checkUserAdmin.role === 'editor' ) {
            // const users = await db.User.find().select('_id nameAdmin');
            // await Promise.all( users.map(() => { return AdminNotify.findOneAndRemove({idNotify : param.idNotify }) }) );
            await AdminNotify.deleteMany({idNotify : param.idNotify });
        }
        else { }
        return getById(param.userId);
    }
    catch (e) {
        console.log('error',e)
    }

}
async function read({ userId, _id }) {
    try {
        await AdminNotify.findOneAndUpdate({ _id: ObjectId(_id), userId: ObjectId(userId) },{ $set: {read : true} },{new: true});
        return getById(ObjectId(userId));
    }
    catch (e) {
       console.log('error',e);
    }

}

