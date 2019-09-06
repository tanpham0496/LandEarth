const mongoose = require('mongoose');

const developSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref : 'User' },
    userName: { type: String, trim: true},
    title: { type: String },
    category: { type: String },
    content: { type: String },
    createdDate: { type: String},
});

module.exports =  developSchema