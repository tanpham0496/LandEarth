const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: { type: String },
    senderName: { type: String },
    senderId: { type: mongoose.Schema.Types.ObjectId, index: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, index: true },
    message: { type: String }
},
{ timestamps: true});

module.exports = messageSchema;
