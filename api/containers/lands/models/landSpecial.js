const mongoose = require('mongoose');
const LandSpecialSchema = new mongoose.Schema({
	name: String,
    quadKeys: [String],
    center: {
        lat: Number,
        lng: Number,
    },
    price: Number,
});

module.exports = LandSpecialSchema;
