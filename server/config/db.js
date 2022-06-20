var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://localhost:27017/ha');
db.on('error', console.error.bind(console,'connect error:'));
db.once('open', function(){
    console.info('数据库ha打开成功')
});

module.exports = db;