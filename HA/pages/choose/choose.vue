<template>
	<view>
		<view class="edge">
			<view class="back" @tap="back">
				<image src="../../static/img/fanhui.png"></image>
			</view>
			<swiper class="swiper" :indicator-dots="indicatorDots" @change="getfid" >
				<swiper-item v-for="(item,index) in matchers" :key="index" >
					<view class="user-detail">
						<view class="user-head">
							<image :src="item.headurl"></image>
						</view>
						<view class="user-name">{{item.username}}</view>
						<view class="user-sex">
							<image src="../../static/icon_1sjrt66hk8e/a-bianzu15.png"></image>
						</view>
						<view class="user-age">
							<image src="../../static/icon_1sjrt66hk8e/a-bianzu45.png"></image>
						</view>
						<view class="user-msg">{{item.message}}</view>
					</view>
					<view class="user-pic" >
						<view class="u-share-list" >
							<image :src="item.imgurl"></image>
						</view>
						
					</view>
					<view class="btn">
						<button class="chat" @tap="chat(item)">say hi</button>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				matchers:[],
				indicatorDots: true,
				uid:'',
				fid:'',
			}
		},
		onLoad() {
			this.getStorages();
			this.getPost();
			this.fid=this.matchers[0].userID;
			//console.log(this.fid);
			//this.getfid();
		},
		
		methods: {
			getStorages:function(){
				try {
					const value = uni.getStorageSync('match');
					const user = uni.getStorageSync('user');
					console.log(value);
					if (value) {
						let users = value.matchers;
						//console.log(this.users);
						for(let i=0;i<users.length;i++){
							users[i].headurl=this.serverUrl +'/user/'+users[i].headurl;
							users[i].imgurl=this.serverUrl +users[i].imgurl;
							//this.matchers.push(users[i]);
							this.matchers.push(users[i]);
						}
						console.log(this.matchers);
						//console.log(this.matchers[0].imgurl);
					}
					if (user) {
						this.uid = user.id;
						//this.headurl = this.serverUrl+'/user/'+value.headurl;
						this.token = user.token;
						this.myname = user.name;
					}
					//console.log(this.uid);
				} catch (e) {
					// error
				}
			},
			
			back:function(){
				uni.navigateBack({
					delta:1
				});
			},
			
			getPost: function(){
				for(let i = 0;i< this.matchers.length;i++){
					uni.request({
						url:this.serverUrl+'/post/getpost',
						data:{
							uid:this.matchers[i].userID,
						},
						method:'POST',
						success: (data) => {
							//console.log(this.uid);
							//console.log(typeof(this.uid));
							//console.log(this.uid === '62344a96edd7a43138802433')
							let status = data.data.status;
							if(status ==200){
								let res =data.data.result;
								console.log(res);
								if(res.length>0){
									//this.users = res;
									
									this.matchers[i].imgurl = res[0].imgurl
								
									
								}
								console.log(this.matchers[i].imgurl);
								//this.user = myfunc.paixu(this.user,'lastTime',0);
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
				}
				
			},
			
			getfid:function(e){
				
				let i = e.detail.current;
				this.fid = this.matchers[i].userID;
				console.log(this.fid);
			},
			
			chat: function(e){
				uni.request({
					url:this.serverUrl+'/friend/updatefriend',
					data:{
						uid:this.uid,
						fid:this.fid,
					},
					method:'POST',
					success: (data) => {
						console.log(this.uid);
						//console.log(typeof(this.uid));
						//console.log(this.uid === '62344a96edd7a43138802433')
						let status = data.data.status;
						if(status ==200){
							let res =data.data.result;
							console.log(res);
							uni.navigateTo({
								url:'../chat/chat?id='+e.userID+'&name='+e.username+'&head='+e.headurl
							})
							
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
				//console.log(this.matchers.userID);
			}
			
			
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
	}
	.edge{
		width: 100%;
		height: 100vh;
		background-color: #00aac1;//#5d7eed
	}
	.back{
		position: absolute;
		
		top:2%;
		left:6%;
		//background-color: #000;
		z-index: 1000;
		image{
			width: 80rpx;
			height: 80rpx;
			border-radius: 40rpx;
		}
	}
	.swiper{
		width: 94%;
		height: 100%;
		margin: auto;
		//border-left: 4rpx solid #ea5514;
		//border-right: 4rpx solid #ea5514;
		.user-detail{
			width: 100%;
			height: 50%;
			background-color: #00aac1;
			.user-head{
				width: 100%;
				height: 50%;
				background-color: #00aac1;
				image{
					width: 250rpx;
					height: 250rpx;
					border-radius: 125rpx;
					margin-top: 20%;
					margin-left: 32.5%;
				}
			}
			.user-name{
				width: 100%;
				height: 20%;
				background-color: #00aac1;
				color: #FFFFFF;
				text-align: center;
				line-height: 120rpx;
				font-size: 60rpx;
				font-weight: bold;
			}
			.user-sex{
				width: 50%;
				height: 15%;
				float: left;
				background-color: #00aac1;
				text-align: right;
				image{
					width: 66rpx;
					height: 66rpx;
					//border-radius: 125rpx;
				}
			}
			.user-age{
				width: 50%;
				height: 15%;
				float: right;
				background-color: #00aac1;
				image{
					width: 66rpx;
					height: 66rpx;
				}
			}
			.user-msg{
				width: 100%;
				height: 15%;
				background-color: #00aac1;
				text-align: center;
				color: #FFFFFF;
				font-size: 36rpx;
			}
			
			
		}
		.user-pic{
			width: 100%;
			height: 30%;
			//float: left;
			//padding: 20rpx;
			display: flex;
			flex-wrap: wrap;
			background-color: #00aac1;
			.u-share-list{
				
				flex: 1;
				height: 350rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		.btn{
			width: 100%;
			height: 100rpx;
			//background-color: #3F536E;
			.chat{
				background-color: #ea5514;
				width: 350rpx;
				height: 100rpx;
				font-size: 42rpx;
				line-height: 100rpx;
				color: #FFFFFF;
				display: block;
				margin: 100rpx auto;
			}
		}
	}

</style>
