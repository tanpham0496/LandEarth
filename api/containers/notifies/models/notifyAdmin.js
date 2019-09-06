const mongoose = require('mongoose');

const adminNotifySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref : 'User' },
    userName: { type: String, trim: true, required: true },
    title: { type: String, required: true },
    category: { type: String },
    content: { type: String, required: true },
    createdDate: { type: String},
});

adminNotifySchema.set('toJSON', { virtuals: true });
module.exports =  adminNotifySchema