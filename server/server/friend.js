var dbserver = require('../dao/dbserver');

exports.updateFriend = function(req,res){
    let data = req.body;
    dbserver.updateFriend(data,res);
}