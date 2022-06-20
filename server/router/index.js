var dbserver = require('../dao/dbserver');
var signup = require('../server/signup');
var signin = require('../server/signin');
var user = require('../server/userdetail');
var friend = require('../server/friend');
var chatp = require('../server/chatp');
var chat =require('../server/chat');
var getpost = require('../server/post');
var match = require('../server/hamatch');

//搜索
var search = require('../server/serch');
const { getFriend } = require('../server/chatp');


module.exports = function(app){


    app.get('/test',(req,res) => {
        dbserver.findUser(res);
    });


    app.post('/signup/add',(req,res) => {
        signup.signUp(req,res);
    });


    app.post('/signup/judge',(req,res) => {
        signup.judgeValue(req,res);
    });

    app.post('/signin/match',(req,res) =>{
        signin.signIn(req,res);
    });

    //搜索用户
    /*app.post('/search/user',(req,res) =>{
        search.searchUser(req,res);
    });*/

    app.post('/user/detail',(req,res) => {
        user.userDetail(req,res);
    });
    app.post('/user/update',(req,res) => {
        user.userUpdate(req,res);
    });


    //获取匹配
    app.post('/chatp/getFriend',(req,res) => {
        chatp.getFriend(req,res);
    })

    app.post('/chatp/getlastmsg',(req,res) => {
        chatp.getLastMsg(req,res);
    })

    app.post('/friend/updatefriend',(req,res) => {
        friend.updateFriend(req,res);
    })

    app.post('/chat/msg',(req,res)=> {
        chat.msg(req,res);
    })


    //shuoshuo
    app.post('/post/getpost',(req,res) => {
        getpost.getpost(req,res);
    })

    app.post('/post/post',(req,res) => {
        getpost.justpost(req,res);
    })

    //match
    app.post('/match/bematch',(req,res) => {
        match.beMatch(req,res);
    })

    app.post('/match/hamatch',(req,res) => {
        match.haMatch(req,res);
    })

}