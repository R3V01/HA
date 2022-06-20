//token

var jwt = require('jsonwebtoken');

var secret = 'hahahaha';

exports.generateToken = function(id){
    let payload = {id:id,time:new Date()};
    
    let token = jwt.sign(payload,secret,{expiresIn:60*60*24*120})

    return token;
}

exports.verifyToken = function(e){
    let payload;
    jwt.verify(e,secret,function(err,result){
        if(err){
            payload = 0;
        }else{
            payload = 1;
        }
    });

    return payload;
}