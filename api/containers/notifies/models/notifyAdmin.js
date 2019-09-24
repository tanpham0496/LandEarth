const mongoose = require('mongoose');

const adminNotifySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref : 'User', index: true },
    nameAdmin: { type: String, trim: true, required: true },
    idNotify: { type: mongoose.Schema.Types.ObjectId, index: true},
    title: { type: String, required: true },
    category: { type: String },
    content: { type: String, required: true },
    createdDate: { type: String},
    read: Boolean
});

adminNotifySchema.set('toJSON', { virtuals: true });
module.exports =  adminNotifySchema