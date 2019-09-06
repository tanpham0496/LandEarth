const db = require('../../../db/db');
const moment = require('moment');

module.exports = {
    //tan
    create,
    get,
    update ,
    delete: _delete
};

async function get() {
    const newDevelop = await db.Develop.find({});
    newDevelop.reverse();
    return await newDevelop;
}

async function create(param) {
    const newDevelop = new db.Develop(param);
    newDevelop.title = param.title;
    newDevelop.userName = param.userName;
    newDevelop.category = param.category;
    newDevelop.content = param.content.editorState;
    newDevelop.createdDate = moment( param.createdDate).format('DD/MM/YYYY');
    return await newDevelop.save();
}

async function update(param){
    let id = param._id;
    let updateObj = Object.assign({}, param);
    delete updateObj._id;
    return await db.Develop.findByIdAndUpdate(id,updateObj,{new: true});
}

async function _delete(id) {
    return await db.Develop.findByIdAndRemove(id.id);
}

