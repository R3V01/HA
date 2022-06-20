var dbserver = require('../dao/dbserver');

exports.beMatch = function(req,res){
    let data = req.body;
    dbserver.beMatch(data,res);
    
}

exports.haMatch = function(req,res){
    let game = req.body.game;
    let num = req.body.num;
    dbserver.haMatch(game,num,res);
}