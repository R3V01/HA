var dbserver = require('../dao/dbserver');

exports.getFriend = function(req,res){
    let uid = req.body.uid;
    let state = req.body.state;
    dbserver.getUsers(uid,state,res);
    //console.log(uid);
    //console.log(state);
}

exports.getLastMsg = function(req,res){
    let data = req.body;
    dbserver.getMsg(data,res);
    //console.log(data);
}