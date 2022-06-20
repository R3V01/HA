var dbserver = require('../dao/dbserver');

exports.userDetail = function(req,res){
    let id = req.body.id;
    dbserver.userDetail(id,res);
}

exports.userUpdate = function(req,res){
    let data = req.body;
    dbserver.userUpdate(data,res);
}