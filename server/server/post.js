var dbserver = require('../dao/dbserver');

exports.getpost = function(req,res){
    let uid = req.body.uid;
    dbserver.getPost(uid,res);
    console.log(uid);
}

exports.justpost = function(req,res){
    let uid = req.body.uid;
    let imgurl = req.body.imgurl;
    dbserver.justPost(uid,imgurl,res);
}