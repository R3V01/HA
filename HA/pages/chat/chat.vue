<template>
	<view>
		<view class="bar-class">
			<view class="back" @tap="back">
				<image src="../../static/img/tongzhi.png"></image>
			</view>
			<view class="userName">{{fname}}</view>
			<view class="detail" @tap="detail">
				<image src="../../static/icon_1sjrt66hk8e/a-bianzu15.png"></image>
			</view>
		</view>
		<scroll-view class="chat" scroll-y="true" :scroll-into-view="siv"  @scrolltoupper="nextPage" upper-threshold="0">
			<view class="chatMain">
				<view class="loading" :class="{displaynone:isloading}">
					<image src="../../static/icon_1sjrt66hk8e/a-bianzu45.png" class="loading-img" :animation="animationData"></image>
				</view>
				<view class="list" v-for="(item,index) in msgs" :key="index" :id="'msg'+item.id">
					<view class="time" v-if="item.time !=''">{{changeTime(item.time)}}</view>
					<view class="msg msg-l" v-if="item.sendID != uid">
						<image :src="item.headurl" class="user-head"></image>
						<view class="message">
							<view class="msg-text">{{item.message}}</view>
						</view>
					</view>
					<view class="msg msg-r" v-if="item.sendID == uid">
						<image :src="item.headurl" class="user-head"></image>
						<view class="message">
							<view class="msg-text">{{item.message}}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<submit @inputs = "inputs"></submit>
	</view>
</template>

<script>
	import datas from '../../common/data.js';
	import myfunc from '../../common/myfunc.js';
	import submit from '../../components/submit/submit.vue';
	export default {
		data() {
			return {
				uid:'',
				uname:'',
				uhead:'',
				fname:'',
				fhead:'',
				fid:'',
				token:'',
				msgs:[],
				oldTime: 0,
				siv:'',
				nowpage: 0,
				pagesize:10,
				animationData: {},
				loading:'',
				isloading: true,
				beginloading: true,
			}
		},
		onLoad:function(e){
			this.fid = e.id;
			this.fname = e.name;
			this.fhead = e.head;
			console.log(e);
			this.getStorages();
			
			this.getMsg();
			this.receiveSocket();
			//this.nextPage();
		},
		components:{
			submit,
		},
		methods: {
			back:function(){
				uni.navigateBack({
					delta:1
				});
			},
			changeTime:function(date){
				return myfunc.dateTime1(date);
			},
			
			
			
			getStorages:function(){
				
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id;
						this.uhead = this.serverUrl+'/user/'+value.headurl;
						this.token = value.token;
						this.uname = value.name;
					}
					console.log(value);
				} catch (e) {
					// error
				}
			},
			
			nextPage:function(){
				
				if(this.nowpage>0 /*&& this.beginloading*/){
					this.isloading = false;
					//this.beginloading = false;
					var animation = uni.createAnimation({
					      duration: 1000,
					        timingFunction: 'ease',
					    })
					
					    this.animation = animation
						
						let i=1;
					    this.loading = setInterval(function() {
					      animation.rotate(i*20).step()
					      this.animationData = animation.export()
						  i++;
						  if(i>20 && this.beginloading){
							this.beginloading = false;
							this.getMsg(this.nowpage);
							}
					    }.bind(this), 100)
				}
				
				
				
				/*if(this.nowpage>0&&this.beginloading){
					
				}*/
			},
			
			/*getMsg1:function(page){
				
				let msg = datas.message();
				let maxpages = msg.length;
				if(msg.length>(page+1)*10){
					maxpages = (page+1)*10;
					this.nowpage++;
				}else{
					this.nowpage =-1;
				}
				
				for(var i=page*10;i<maxpages;i++){
					msg[i].headurl='../../static/icon_1sjrt66hk8e/'+msg[i].headurl;
					if(i<msg.length-1){
						let t = myfunc.spaceTime(this.oldTime,msg[i].time);
						if(t){
							this.oldTime=t;
						}
						msg[i].time=t;
					}
					this.msgs.unshift(msg[i]);
				}
				
				this.$nextTick(function(){
					this.siv='msg'+this.msgs[maxpages-page*10-1].tip;
					console.log(this.siv);
				})
				clearInterval(this.loading);
				this.isloading = true;
				this.beginloading =true;
			},*/
			
			getMsg:function(page){
				uni.request({
					url:this.serverUrl+'/chat/msg',
					data:{
						uid:this.uid,
						fid:this.fid,
						nowPage:this.nowpage,
						pageSize:this.pagesize,
						token:this.token,
					},
					method:'POST',
					success: (data) => {
						console.log(data);
						let status = data.data.status;
						console.log(status);
						if(status ==200){
							let msg =data.data.result;
							msg.reverse();
							console.log(msg);
							let oldtime =msg[0].time;
							if(msg.length>0){
								
								for(var j=0;j<msg.length;j++){
									msg[j].headurl=this.serverUrl + '/user/'+msg[j].headurl;
								}
								
								for(var i=1;i<msg.length;i++){
									
									if(i<msg.length-1){
										let t = myfunc.spaceTime(oldtime,msg[i].time);
										if(t){
											oldtime=t;
										}
										msg[i].time=t;
									}
									
									//最新时间匹配
									if(this.nowpage == 0){
										if(msg[i].time>this.oldTime){
											this.oldTime = msg[i].time;
										}
									}
									//this.msgs.unshift(msg[i]);
								}
								this.msgs = msg.concat(this.msgs);
								//this.msgs.unshift(msg);
							}
							//console.log(msg[i]);
							//console.log(this.msgs);
							if(msg.length == 10){
								this.nowpage++;
							}else{
								this.nowpage =-1;
							}
							
							this.$nextTick(function(){
								//console.log(this.msgs[msg.length-1]);
								this.siv='msg'+this.msgs[msg.length-1].id;
								
							})
							clearInterval(this.loading);
							this.isloading = true;
							this.beginloading =true;
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
				
				
				/*for(var i=0;i<msg.length;i++){
					msg[i].headurl='../../static/icon_1sjrt66hk8e/'+msg[i].headurl;
					if(i<msg.length-1){
						let t = myfunc.spaceTime(this.oldTime,msg[i].time);
						if(t){
							this.oldTime=t;
						}
						msg[i].time=t;
					}
					this.msgs.unshift(msg[i]);
				}
				this.$nextTick(function(){
					this.siv='msg'+this.msgs[i-1].tip;
				})*/
			},
			
			inputs:function(e){
				/*let len = this.msgs.length;
				let nowTime = new Date();
				
				let t = myfunc.spaceTime(this.oldTime,nowTime);
				
				if(t){
					this.oldTime = t;
				}
				console.log(e);
				nowTime = t;
				let data{
					//id: this.sendID,
					headurl:'',
					message: e.message,
					time: nowTime,
					tip: len,
				};
				this.msgs.push(data);
				this.$nextTick(function(){
					this.siv = 'msg'+len;
				})*/
				this.receiveMsg(e,this.uid,this.uhead,0);
			},
			
			receiveMsg:function(e,id,head,tip){
				let len = this.msgs.length;
				let nowTime = new Date();
				
				let t = myfunc.spaceTime(this.oldTime,nowTime);
				
				if(t){
					this.oldTime = t;
				}
				console.log(e);
				nowTime = t;
				
				let data = {
					sendID:id,
					headurl:head,
					message: e,
					time: nowTime,
					id: len,
				};
				this.msgs.push(data);
				console.log(data);
				this.$nextTick(function(){
					this.siv = 'msg'+len;
				})
				this.sendSocket(e);
				
			},
			
			sendSocket:function(e){
				this.socket.emit('msg',e,this.uid,this.fid);
			},
			
			receiveSocket:function(){
				this.socket.on('msg',(msg,sendid,tip) =>{
					if(sendid ==this.fid && tip==0){
						let len = this.msgs.length;
						let nowTime = new Date();
						
						let t = myfunc.spaceTime(this.oldTime,nowTime);
						
						if(t){
							this.oldTime = t;
						}
						
						nowTime = t;
						
						let data = {
							sendID:sendid,
							headurl:this.fhead,
							message: msg,
							time: nowTime,
							id: len,
						};
						this.msgs.push(data);
					}
					
				})
			},
			
		}
	}
</script>

<style lang="scss">
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
			float: left;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.userName{
			width: 40%;
			height: 70%;
			margin: 20rpx 15%;
			//background-color: #555555;
			float: left;
			text-align: center;
			font-size: 36rpx;
			font-weight: bold;
		}
		.detail{
			width: 10%;
			height: 70%;
			float: right;
			margin-top: 15rpx;
			margin-right: 2.5%;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	.displaynone{
		display: none;
	}
	.chat{
		height: 99vh;
		
		.loading{
			text-align: center;
			.loading-img{
				width: 60rpx;
				height: 60rpx;
			}
		}
		.chatMain{
			padding-left: 32rpx;
			padding-right: 32rpx;
			padding-top: 100rpx;
			padding-bottom: 170rpx;
			flex-direction: column;
		}
		.list{
			.time{
				padding: 20rpx 0;
				text-align: center;
			}
			.msg{
				display: flex;
				padding: 20rpx 0;
				.user-head{
					width: 80rpx;
					height: 80rpx;
					border-radius: 20rpx;
					flex: none;
				}
				.message{
					max-width: 480rpx;
					flex: auto;
					.msg-text{
						font-size: 32rpx;
						font-weight: 400;
						line-height: 44rpx;
						padding: 18rpx 24rpx;
						word-break: break-all;
						}
				}
			}
			.msg-l{
				flex-direction: row;
				.msg-text{
					margin-left: 16rpx;
					background-color: #F692B2;//#F0AD4E
					border-radius: 0rpx 20rpx 20rpx 20rpx;
				}
			}
			.msg-r{
				flex-direction: row-reverse;
				.msg-text{
					margin-right: 16rpx;
					background-color: #81d8d1;
					border-radius: 20rpx 0rpx 20rpx 20rpx;
				}
			}
		}
	}

</style>
