var bcrypt = require('bcryptjs');

exports.encryption = function(e){
    let salt = bcrypt.genSaltSync(10);

    let hash = bcrypt.hashSync(e,salt);
    return hash;
}

exports.verification = function(e,hash){
    let verif = bcrypt.compareSync(e,hash);

    return verif;
}