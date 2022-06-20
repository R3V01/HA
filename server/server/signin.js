var dbserver = require('../dao/dbserver');

exports.signIn = function(req,res){
    let name = req.body.name;
    let psw = req.body.psw;

    dbserver.userMatch(name,psw,res);
}