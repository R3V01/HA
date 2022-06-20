let dbserver = require('./dbserver');


module.exports = function(io){
    var users = {};

    io.on('connection', (socket) => {
        //console.log('a user connected');

        socket.on('login',(id) => {
            console.log(socket.id);
            socket.emit('login',socket.id);
            socket.name = id;
            users[id] = socket.id;
        });

        //一对一消息
        socket.on('msg',(msg,sendid,getid) => {
            console.log(msg);

            dbserver.friendLastTime({uid:sendid,fid:getid});
            dbserver.insertMsg(sendid,getid,msg);

            if(users[getid]){
                socket.to(users[getid]).emit('msg',msg,sendid,0);
            }
            socket.emit('msg',msg,getid,1);
        });

        socket.on('disconnecting',()=>{
            console.log(users);
            if(users.hasOwnProperty(socket.name)){
                delete users[socket.name];
                //console.log(users);
                console.log(socket.id + '离开');
            }
        });
      });
}