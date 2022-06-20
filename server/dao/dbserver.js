var dbmodel = require('../model/dbmodule');
var User =dbmodel.model('User');
var jwt = require('../dao/jwt');
var Message = dbmodel.model('Message');
var Friend = dbmodel.model('Friend');
var Post = dbmodel.model('Post');
var Match = dbmodel.model('Match');


var bcrypt = require('../dao/bcrypt');
const { where } = require('../model/dbmodule');
const { rsort } = require('semver');
const { type } = require('os');
const { result } = require('lodash');
const e = require('express');
const { stat } = require('fs');
const { message } = require('statuses');

/*exports.findUser = function (res) {
    User.find(function (err,val) {
        if(err){
            console.log('查找失败'+err)
        }else{
            res.send(val);
        }
    })
  }*/

exports.newUser = function(name,psw,res){
    let password = bcrypt.encryption(psw);

    let data = {
        name: name,
        psw: password,
    }

    let user = new User(data);
    user.save(function(err,result){
        if(err){
            res.send({status:500});
        }else{
            res.send({status:200});
        }
    })
}

exports.countUserValue = function(name,res){
    let wherestr ={};
    wherestr['name'] = name;
    //console.log('1');

    User.countDocuments(wherestr,function(err,result){
            if(err){
                res.send({status:500});
            }else{
                res.send({status:200,result});
            }
    })
}

exports.userMatch = function(name,psw,res){
    let wherestr ={'name':name};
    let out = {'name':1,'headurl':1,psw:1}

    User.find(wherestr,out,function(err,result){
        if(err){
            res.send({status:500});
        }else{
            if(result == ''){
                res.send({status:400});
               // console.log('1');
            }
            result.map(function(e){
                const pswMatch = bcrypt.verification(psw,e.psw);
                if(pswMatch){
                    let token = jwt.generateToken(e._id);
                    let back = {
                        id:e._id,
                        name:e.name,
                        headurl:e.headurl,
                        token:token,
                    }
                    res.send({status:200,back});
                }else{
                    res.send({status:400});
                    //console.log(2);
                }
            })
        }
    })
}


//搜索用户
/*exports.searchUser = function(data,res){
    let wherestr;
    if(data == 'ha'){
        wherestr = {};
    }else{
        wherestr = {$or:[{'name':{$regex:data}},{'email':{$regex:data}}]};
    }
    let out = {
        'name':1,
        'email':1,
        'headurl':1,
    }
    User.find(wherestr,out,function(err,result){
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200,result})
        }
    })
}

//判断是否为好友
exports.isFriend = function(uid,fid,res){
    let wherestr = {'userID':uid,'friendID':fid,'state':0}

    Friend.findOne(wherestr,function(err,result){
        if(err){
            res.send({status:500});
        }else{
            if(result){
                res.send({status:200})
            }else{
                res.send({status:400});
            }
        }
    })
}*/
//用户详情
exports.userDetail = function(id,res){
    let wherestr = {'_id':id};
    let out = {'psw':0};
    User.findOne(wherestr,out,function(err,result){
        if(err){
            res.send({status:500});
        }else{
            res.send({status:200,result});
        }
    })
}

//用户信息修改
exports.userUpdate = function(data,res){
    let updatestr = {};
    if(typeof(data.psw)!='undefined'){
        User.find({'_id':data.id},{'psw':1},function(err,result){
            if(err){
                res.send({status:500});
            }else{
                if(result == ''){
                    res.send({status:400});
                   // console.log('1');
                }
                result.map(function(e){
                    const pswMatch = bcrypt.verification(data.psw,e.psw);
                    if(pswMatch){
                        if(data.type == 'psw'){
                            let password = bcrypt.encryption(data.data);
                            updatestr[data.type] = password;

                        }else{
                            updatestr[data.type] = data.data;
                        }
                        
                        User.findByIdAndUpdate(data.id,updatestr,function(err,result){
                            if(err){
                                res.send({status:500});
                            }else{
                                res.send({status:200});
                            }
                        })
                    }else{
                        res.send({stause:400});
                    }
                })
            }
        })
    }else{
        updatestr[data.type] = data.data;
        console.log(updatestr);
        User.findByIdAndUpdate(data.id,updatestr,function(err,result){
            if(err){
                res.send({status:500});
            }else{
                res.send({status:200,result});
            }
        })
    }
}



//一对一消息
exports.insertMsg = function(uid,fid,msg,res){
    let data = {
        userID: uid,
        friendID:fid,
        message:msg,
        time:new Date(),
    }
    let message = new Message(data);
    message.save(function(err,result){
        if(err){
            if(res){
                res.send({status:500});
            }
            
        }else{
            if(res){
                res.send({status:200});
            }
            
        }
    })
}

//最后通讯
exports.friendLastTime = function(data){
    let wherestr ={'userID':data.uid,'friendID':data.fid};
    let updatestr = {'lastTime':new Date()};

    Friend.updateOne(wherestr,updatestr,function(err,result){
        if(err){
            //res.send({status:500});
            console.log('更新出错');
        }else{
            //res.send({status:200});
        }
    })
}

exports.getUsers = function(uid,state,res){
    let query =Friend.find({});

    query.where({'userID':uid, 'state':state});
    query.populate('friendID');
    query.sort({'lastTime':-1});
    query.exec().then(function(e){
        let result = e.map(function(ver){
            return {
                id: ver.friendID._id,
                name:ver.friendID.name,
                headurl:ver.friendID.headurl,
                lastTime:ver.lastTime,
            }
        })
        res.send({status:200,result});
    }).catch(function(err){
        res.send({status:500});
    })
}


exports.getMsg = function(data,res){
    let query =Message.findOne({});

    query.where({$or:[{'userID':data.uid,'friendID':data.fid},{'userID':data.fid,'friend':data.uid}]});

    query.sort({'time':-1});
    query.exec().then(function(ver){
        let result = {
            message: ver.message,
            time:ver.time,
        }
        res.send({status:200,result});
    }).catch(function(err){
        res.send({status:500});
        console.log(data);
    })
}


exports.buildFriend = function(uid,fid,state){
    let data = {
        userID:uid,
        friendID:fid,
        state: state,
        time: new Date(),
        lastTime:new Date(),
        //message:'',
    }
    let friend = new Friend(data);
    //let message =new Message(data);
    friend.save(function (err, res){
        if(err){
            //res.send({status:500});
            console.log('添加好友出错');
        }else{
            //res.send({status:200});
        }
    } )
    /*message.save(function (err, res){
        if(err){
            //res.send({status:500});
            console.log('添加好友出错');
        }else{
            //res.send({status:200});
        }
    } )*/
}

//exports.buildMessage.

exports.updateFriend = function(data,res){
    let wherestr = {'userID':data.uid,'friendID':data.fid};
    Friend.countDocuments(wherestr,(err,result) => {
        if(err){
            res.send({status:500});
        }else{
            if(result == 0){
                this.buildFriend(data.uid,data.fid,1);
                this.buildFriend(data.fid,data.uid,1);
                
            }else{
                this.friendLastTime(data.uid,data.id);
                this.friendLastTime(data.fid,data.uid);
            }
            this.insertMsg(data.uid,data.fid,data.msg,res);
            //res.send({status:200});
        }
    })
}


exports.msg = function(data,res){
    var skipNum = data.nowPage * data.pageSize;
    let query =Message.find({});

    query.where({$or:[{'userID':data.uid,'friendID':data.fid},{'userID':data.fid,'friendID':data.uid}]});
    query.populate('userID');
    query.sort({'time':-1});
    query.skip(skipNum);
    query.limit(data.pageSize);
    query.exec().then(function(e){
        let result = e.map(function(ver){
            return {
                id: ver._id,
                message:ver.message,
                time:ver.time,
                sendID:ver.userID._id,
                headurl:ver.userID.headurl,
            }
        })
        res.send({status:200,result});
    }).catch(function(err){
        res.send({status:500});
    })
}

exports.getPost = function(uid,res){
    let query =Post.find({});
    if(uid != undefined){
        query.where({'userID':uid});
    };
    query.populate('userID');
    query.sort({'lastTime':-1});
    query.exec().then(function(e){
        let result = e.map(function(ver){
            return{
            
            headurl: ver.userID.headurl,
            username:ver.userID.name,
            imgurl: ver.imgurl,
            time: ver.time,
            }
        })
        res.send({status:200,result});
    }).catch(function(err){
        res.send({status:500});
        console.log('未能获取数据');
        console.log(err);
    })
}


exports.justPost = function(uid, imgurl, res){
    let data = {
        userID: uid,
        time: new Date(),
        imgurl: imgurl,
        lastTime: new Date(),
        //message:'',
    }
    let post = new Post(data);
    //let message =new Message(data);
    post.save(function (err, result){
        if(err){
            res.send({status:500});
            console.log('动态出错');
        }else{
            //res.send({status:200,result});
            //console.log('ppp');
        }
    } )
}


exports.beMatch = function(data, res){
    let datas = {
        userID: data.uid,
        game: data.game,
        num: data.num,
        message: data.message,
        //message:'',
    }
    let match = new Match(datas);
    match.save(function (err, result){
        if(err){
            res.send({status:500});
            console.log('动态出错');
        }else{
            res.send({status:200,result});
            //console.log('ppp');
        }
    } )
}


exports.haMatch = function(game,num,res){
    let query =Match.find({});
    query.where({'game':game,'num':num});
    query.populate('userID');
    query.sort({'Time':-1});
    query.exec().then(function(e){
        let result = e.map(function(ver){
            return{
            userID: ver.userID._id,
            headurl: ver.userID.headurl,
            username: ver.userID.name,
            message: ver.message,
            imgurl: ver.imgurl,
            time: ver.time,
            }
        })
        res.send({status:200,result});
    }).catch(function(err){
        res.send({status:500});
        console.log('未能获取数据');
        console.log(err);
    })
}

