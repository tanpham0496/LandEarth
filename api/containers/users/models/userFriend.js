const mongoose = require('mongoose');

const userFriendSchema = new mongoose.Schema({
    userId : { type : mongoose.Schema.Types.ObjectId },
    userName: {type: String},
    friendList :{ //friend list of user
        list : [
            {
                userId :{ type : mongoose.Schema.Types.ObjectId },
                name : { type: String },
                createdDate: { type: Date, default: Date.now },
                sort :{ type : Number, default : 0 },
                _id : false,
            }
        ],
    },
    blockList : { //block list of user
        list : [
            {
                userId :{ type : mongoose.Schema.Types.ObjectId },
                name : { type: String },
                createdDate: { type: Date, default: Date.now },
                sort :{type : Number, default : 0},
                _id : false,
            }
        ],
    },
    addFriendList : [{
        userId :{ type : mongoose.Schema.Types.ObjectId },
        name : { type: String },
        createdDate: { type: Date, default: Date.now },
        _id : false,
        // accept : Boolean,
    }],
    id : false,
});

userFriendSchema.set('toJSON', { virtuals: true });
module.exports =  userFriendSchema;