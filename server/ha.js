const express = require('express')
const app = express()
const port = 3000

var jwt = require('./dao/jwt');

//socket.io
var server =app.listen(8082);
var io = require('socket.io').listen(server);
require('./dao/socket')(io);


app.get('/', (req,res)=>res.send('Hello World!'))
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//获取静态路径
//token
/*app.use(function(req,res,next){
    if(typeof(req.body.token)!='undefined'){
        let token =req.body.token;
        let tokenMatch = jwt.verifyToken(token);
        if(tokenMatch ==1){
            next();
        }else{
            res.send({status:300})
        }
        console.log(tokenMatch);
        res.send({result:tokenMatch});
    }else{
        next();
    }
})*/

app.use((req, res, next) => {
    //设置请求头
    res.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Max-Age': 1728000,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8'
    })
    req.method === 'OPTIONS' ? res.status(204).end() : next()
})

app.use(express.static(__dirname + '/data'));




require('./router/index')(app);
require('./router/files')(app)

app.use(function(req,res,next){
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err,req,res,next){
    res.status(err.status || 500)
    res.send(err.message);
});


app.listen(port, () => console.log(`example on port ${port}!`))