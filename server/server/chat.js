var dbserver = require('../dao/dbserver');

exports.msg = function(req,res){
    let data =req.body;
    dbserver.msg(data,res);
    //console.log(data);
    //console.log("1");
}