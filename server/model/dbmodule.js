var mongoose = require('mongoose');
var db = require('../config/db');
var Schema = mongoose.Schema;

var UserSchema= new Schema({
    name: {type: String},
    psw:{type:String},
    sex: {type: String, default:'asexual'},
    age: {type: Number},
    sign: {type: String, default:''},
    headurl: {type :String, default:'xx.png'},
    //photo: {type :String},
});

var PostSchema = new Schema({
    userID: {type: Schema.Types.ObjectId,ref:'User'},
    //headurl:{type:String,default:'/user/xx.png'},
    imgurl: {type: String},
    time: {type: Date},
    lastTime:{type: Date},
});

var MessageSchema = new Schema({
    userID: {type: Schema.Types.ObjectId,ref:'User'},
    friendID: {type: Schema.Types.ObjectId,ref:'User'},
    message: {type: String,default:'Hi!'},
    time: {type: Date},
});

var MatchSchema = new Schema({
    userID: {type: Schema.Types.ObjectId,ref:'User'},
    //state:{type: String},
    game: {type: Number},
    num: {type: Number},
    sex: {type: String,default:'asexual'},
    age: {type: Number},
    message: {type: String},
    imgurl:{type: String,default:'/user/haihai.jpg'},
    time:{type:Date},
    
});

var FriendSchema = new Schema({
    userID:{type: Schema.Types.ObjectId,ref:'User'},
    friendID: {type: Schema.Types.ObjectId,ref:'User'},
    time: {type: Date},
    state: {type: String},
    lastTime:{type: Date}
})

module.exports = db.model('User',UserSchema);
module.exports = db.model('Post',PostSchema);
module.exports = db.model('Message',MessageSchema);
module.exports = db.model('Match',MatchSchema);
module.exports = db.model('Friend',FriendSchema);