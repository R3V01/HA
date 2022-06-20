<template>
	<view class="content">
		<view class="top">
			<view class="top-right" @tap="tologinup">
				<view class="text">注册</view>
			</view>
		</view>
		<view class="logo">
			<image src="../../static/icon_1sjrt66hk8e/huojian.png"></image>
		</view>
		<view class="main">
			<view class="title">登录</view>
			<view class="slogan">hahaahah</view>
			<view class="inputs">
				<input type="text" v-model="user" placeholder="用户名" class="usr" />
				<input type="password" v-model="psw" placeholder="密码" class="psw" />
			</view>
			<view class="tips" :style="{display: h}">用户名或密码错误</view>
		</view>
		<view class="submit" @tap="login">登录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user:'',
				psw:'',
				token:'',
				h:'none',
			}
		},
		onLoad:function(e){
			if(e.user){
				this.user = e.user;
				uni.showToast({
					title:'注册成功请登录',
					icon:'none',
					duration:1500,
				})
			}
		},
		methods: {
			tologinup:function(){
				uni.navigateTo({
					url:'../loginup/loginup',
				});
			},
			
			login:function(){
				if(this.user&&this.psw){
					uni.request({
						url: this.serverUrl + '/signin/match',
						data:{
							name:this.user,
							psw:this.psw,
						},
						method:'POST',
						success:(data) =>{
							console.log(data);
							let status = data.data.status;
							if(status ==200){
								let res = data.data.back;
								this.h = 'none';
								console.log(res);
								try {
									uni.setStorageSync('user',{'id':res.id,'name':res.name,'headurl':res.headurl,'token':res.token});
								}catch(e){
									console.log('数据储存出错')
								}
								
								uni.switchTab({
									url:'../index/index',
								});
							}else if(status == 400){
								this.h = 'block';
								this.psw = '';
							
							}else if(status==500){
								uni.showToast({
									title:'服务器出错啦!',
									icon:'none',
									duration:2000,
								});
							}
						}
					})
				}
			},
			
			testFun:function(){
							 uni.request({
							 	url: this.serverUrl + '/signup/match',
								data:{
									name:this.user,
									psw:this.psw,
								},
								method:'POST',
								success:(data) =>{
									console.log(data);
								}
							 })
			}
		}
	}
</script>

<style lang="scss">
	.content{
		padding-top: 32rpx;
	}
	.top{
		position: fixed;
		z-index: 999;
		top: 0;
		left: 0;
		width: 100%;
		height: 88rpx;
		padding: 16rpx;
		background-color: #F8F8F8;
		
		.top-right{
			float: right;
			padding-right: 32rpx;
			.text{
				font-size: 32rpx;
				font-weight: 900;
				color: #333333;
				line-height: 88rpx;
			}
		}
	}
	.logo{
		text-align: center;
		image{
			padding-top: 256rpx;
			width: 194rpx;
			height: 92rpx;
			margin: 0 auto;
		}
			
	}
	.main{
		padding: 54rpx 32rpx 120rpx;
		//width: 100%;
		.title{
			font-size: 56rpx;
			font-weight: 500;
			color: #333333;
			line-height: 80rpx;
		}
		.slogan{
			font-size: 48rpx;
			font-weight: 400;
			color: rgba(39,40,50,0.5);
			line-height: 56rpx;
		}
		.inputs{
			padding-top: 8rpx;
			
			input{
				padding-top: 40rpx;
				height: 88rpx;
				font-size: 32rpx;
				font-weight: 500;
				line-height: 88rpx;
				color: #555555;
				border-bottom: 1rpx solid #808080;
			}
		}
		.tips{
			color: red;
			line-height: 56rpx;
			float: left;
		}
	}
	.submit{
		margin: 0 auto;
		width: 520rpx;
		height: 96rpx;
		background-color: #007AFF;
		box-shadow: 0 50rpx 32rpx -36rpx rgba(255,228,49,0.4);
		border-radius: 48rpx;
		font-size: 32rpx;
		font-weight: 900;
		color: rgba(39,40,50,1);
		line-height: 96rpx;
		text-align: center;
	}

</style>
