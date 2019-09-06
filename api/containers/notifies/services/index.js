const db = require('../../../db/db');
const AdminNotify = db.AdminNotify;
const moment = require('moment');

module.exports = {
   //tan
    create,
    get,
    update ,
    delete: _delete
};

async function get() {
    // return await AdminNotify.find({});
    const newNotify = await AdminNotify.find({});
    newNotify.reverse();
    return await newNotify;
}

async function create(param) {
    const newAdminNotify = new AdminNotify(param);
    newAdminNotify.title = param.title;
    newAdminNotify.userName = param.userName;
    newAdminNotify.category = param.category;
    newAdminNotify.content = param.content.editorState;
    newAdminNotify.url = param.url;
    newAdminNotify.createdDate = moment( param.createdDate).format('DD/MM/YYYY');
    return await newAdminNotify.save();
}

async function update(param){
    let id = param._id;
    let updateObj = Object.assign({}, param);
    delete updateObj._id;
    return await AdminNotify.findByIdAndUpdate(id,updateObj,{new: true});
}

async function _delete(id) {
    return await AdminNotify.findByIdAndRemove(id.id);
}

