const mongoose = require('mongoose');

const developSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref : 'User' },
    nameAdmin: { type: String, trim: true, required: true },
    idDevelop: { type: mongoose.Schema.Types.ObjectId, index: true},
    title: { type: String },
    category: { type: String },
    content: { type: String },
    createdDate: { type: String},
    read: Boolean
});

module.exports =  developSchema