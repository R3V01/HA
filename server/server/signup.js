var dbserver = require('../dao/dbserver');

exports.signUp = function(req,res){
    let name = req.body.name;
    let psw = req.body.psw;
    //res.send({name,psw});
    dbserver.newUser(name,psw,res);
}

exports.judgeValue = function(req,res){
    let name = req.body.name;
    //res.send({data});
    dbserver.countUserValue(name,res);
}