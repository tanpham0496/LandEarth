const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, index: true },
    members: [ mongoose.Schema.Types.ObjectId ]
},
{ timestamps: true});

module.exports = roomSchema;
