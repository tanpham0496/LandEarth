const db = require('../../../db/db');
const moment = require('moment');
const User = db.User;
const mongoose = require('mongoose');

module.exports = {
    //tan
    create,
    get,
    // update ,
    delete: _delete,
    getById,
    read,
    createAndGetAllDevelop
};

async function get() {
    try{
        const newDevelop = await db.Develop.find({});
        newDevelop.reverse();
        return await newDevelop;
    }
    catch (e) {
        console.log('error',e)
    }
}
async function getById(id) {
    try{
        const newDevelop = await  db.Develop.find({userId : id});
        newDevelop.reverse();
        return await newDevelop;
    }
    catch (e) {
       console.log('err',e)
    }

}

async function createAndGetAllDevelop (param) {
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
            const users = await db.User.find({}).select('_id nameAdmin');
            const objectId =  mongoose.Types.ObjectId();
            await Promise.all(
                users.map(user =>
                    db.Develop.create( {
                        title: param.title,
                        userId: user._id,
                        nameAdmin: 'Administrator',
                        // nameAdmin: param.nameAdmin,
                        idDevelop : objectId,
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
//         let id = param._id;
//         let updateObj = Object.assign( {}, param );
//         delete updateObj._id;
//         return await db.Develop.findByIdAndUpdate( id, updateObj, {new: true} );
//     }
//     else {
//         return false;
//     }
// }

async function _delete(param) {
    try{
        const checkUserAdmin = await User.findById(param.userId);
        if(checkUserAdmin && checkUserAdmin.role === 'editor' ) {
            const users = await db.User.find({}).select('_id nameAdmin');
            await Promise.all( users.map(() => { return db.Develop.findOneAndRemove( {idDevelop : param.idDevelop }) }) );
        }
        else { }
        return getById(param.userId);
    }
    catch (e) {
        console.log('error',e)
    }

}
async function read(param) {
    try{
        let id = param._id;
        await db.Develop.findByIdAndUpdate(id,{ $set: {read : true} },{new: true});
        return getById(param.userId);
    }
    catch (e) {
        console.log('error',e)
    }

}

