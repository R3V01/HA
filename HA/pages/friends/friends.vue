<template>
	<view>
		<view class="bar-class">
			<view class="back" @tap="back">
				<image src="../../static/icon_1sjrt66hk8e/a-bianzu45.png"></image>
			</view>
		</view>
		<view class="main">
			<view class="msg" v-for="(item,index) in friends" :key="index" @tap="toChat(item)">
				<view class="userHead">
					<text class="tip" v-if="item.tip>0">{{item.tip}}</text>
					<image :src="item.headurl"></image>
				</view>
				<view class="userName">{{item.name}}</view>
				<view class="time">{{changeTime(item.lastTime)}}</view>
				<view class="userMsg">{{item.msg}}</view>
				
			</view>
		</view>
		
	</view>
</template>

<script>
	import datas from '../../common/data.js';
	import myfunc from '../../common/myfunc.js';
	export default {
		data() {
			return {
				friends:[],
				uid:'',
				headurl:'',
				token:'',
				myname:''
			}
		},
		onLoad(){
			//this.getUsers();
			this.getStorages();
			this.getFriend();
			this.join(this.uid);
			//this.sockettest();
			this.receiveSocket();
		},
		methods: {
			changeTime: function(date){
				return myfunc.dateTime(date);
			},
			/*getUsers: function(){
				this.users = datas.users();
				for(let i=0;i<this.users.length;i++){
					this.users[i].headurl='../../static/icon_1sjrt66hk8e/'+this.users[i].headurl;
					this.users[i].picurl='../../static/img/'+this.users[i].picurl;
					}
				//console.log(this.users);
			},*/
			back:function(){
				uni.navigateBack({
					delta:1
				});
				
			},
			getStorages:function(){
				
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id;
						//this.headurl = this.serverUrl+'/user/'+value.headurl;
						this.token = value.token;
						this.myname = value.name;
					}
					console.log(this.uid);
				} catch (e) {
					// error
				}
			},
			
			getFriend:function(){
				uni.request({
					url:this.serverUrl+'/chatp/getfriend',
					data:{
						uid:this.uid,
						state:1,
						token:this.token,
					},
					method:'POST',
					success: (data) => {
						console.log(this.uid);
						//console.log(typeof(this.uid));
						//console.log(this.uid === '62344a96edd7a43138802433')
						let status = data.data.status;
						if(status ==200){
							let res =data.data.result;
							if(res.length>0){
								for(let i=0;i<res.length;i++){
									res[i].headurl=this.serverUrl +'/user/'+res[i].headurl;
									this.friends.push(res[i])
								}
							}
							//console.log(this.headurl);
							this.friends = myfunc.paixu(this.friends,'lastTime',0);
							for(let i=0;i<this.friends.length;i++){
								this.getLastmsg(this.friends,i);
							}
							//console.log(res);
						}else if(status == 500){
							uni.showToast({
								title:'服务器出错了！',
								icon:'none',
								duration:2000
							});
						}else if(status == 300){
							uni.navigateTo({
								url:'../loginin/loginin?name='+this.myname
							})
						}
					}
				})
				
			},
			
			getLastmsg:function(arr,i){
				uni.request({
					url:this.serverUrl+'/chatp/getlastmsg',
					data:{
						uid:this.uid,
						fid:arr[i].id,
						token:this.token,
					},
					method:'POST',
					success: (data) => {
						let status = data.data.status;
						//console.log(data);
						if(status ==200){
							let res =data.data.result;
							let e =arr[i];
							e.msg = res.message;
							arr.splice(i,1,e);
							//console.log(res);
						}else if(status == 500){
							uni.showToast({
								title:'服务器出错了！',
								icon:'none',
								duration:2000
							});
						}else if(status == 300){
							uni.navigateTo({
								url:'../loginin/loginin?name='+this.myname
							})
						}
					}
				})
			},
			
			//socket
			join:function(uid){
				this.socket.emit('login',uid);
				//console.log(this.socket.emit());
			},
			
			/*sockettest:function(){
				this.socket.on('msg',id =>{
					console.log(id);
				});
				//console.log(this.socket.on());
			},*/
			
			receiveSocket:function(){
				this.socket.on('msg',(msg,sendid) =>{
					let nowmsg = '';
					nowmsg = msg;
					
					for(let i=0;i<this.friends.length;i++){
						if(this.friends[i].id == sendid){
							let e =this.friends[i];
							e.lastTime = new Date();
							e.msg = nowmsg;
							//e.tip++;
							this.friends.splice(i,1);
							this.friends.unshift(e);
						}
					}
					
				})
			},
			
			toChat:function(data){
				uni.navigateTo({
					url:'../chat/chat?id='+data.id+'&name='+data.name+'&head='+data.headurl,
				})
			}
			
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f5f5f5;
	}
	.bar-class{
		width: 100%;
		height: 100rpx;
		//border: #007AFF;
		background-color: #00aac1;
		position: fixed;
		z-index: 999;
		.back{
			width: 10%;
			height: 70%;
			//background-color: #2C405A;
			margin-left: 2.5%;
			margin-top: 15rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	.main{
		padding-top: 100rpx;
		
		.msg{
			width: 100%;
			height: 180rpx;
			background-color: #d6d6d6;
			float: left;
			&:active{
				background-color: #e6e6e6;
			}
			.userHead{
				width: 16%;
				height: 64%;
				//background-color: #DD524D;
				margin: 4% 2.5% ;
				float: left;
				image{
					width: 100%;
					height: 100%;
					border-radius: 10%;
				}
			}
			.userName{
				width: 20%;
				height: 30%;
				float: left;
				margin-top: 36rpx;
				//background-color: white;
				color: black;
				font-size: 36rpx;
				font-weight: 500;
			}
			.userMsg{
				height: 20%;
				width: 70%;
				float: left;
				padding-top: 12rpx;
				//margin-bottom: 16rpx;
				//background-color: grey;
				color: #8a8a8a;
			}
			.time{
				width: 20%;
				height: 20%;
				float: right;
				margin-top: 30rpx;
				margin-right: 5%;
				//background-color: #F1F1F1;
				text-align: center;
				color: #6c6c6c;
			}
		}
	}

</style>
