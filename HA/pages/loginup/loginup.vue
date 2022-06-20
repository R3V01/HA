<template>
	<view class="content">
		<view class="top">
			<view class="top-left" @tap="tologinin">
				<image src="../../static/img/fanhui2.png" class="back"></image>
			</view>
		</view>
		<view class="logo">
			<image src="../../static/icon_1sjrt66hk8e/huojian.png"></image>
		</view>
		<view class="main">
			<view class="title">注册</view>
			<view class="inputs">
				<view class="inputs-u">
					<input type="text" placeholder="请输入用户名" class="usr" @blur="matchuser"/>
					<view class="occupy" v-if="occupy">已被占用</view>
					<image src="../../static/icon_1sjrt66hk8e/a-bianzu5.png" class="ok" v-if="isuse"></image>
				</view>
				<view class="inputs-u">
					<input :type="type" placeholder="设置密码" class="psw" @input="getpsw"/>
					<image :src="lookurl" class="see" @tap="looks"></image>
				</view>
			</view>
		</view>
		<view :class="[{submit:isok},{submit1:!isok}]" @tap="signup">注册</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:'password',
				isuse:false,
				look: false,
				occupy:false,
				lookurl:'../../static/img/yincangbukejian.png',
				isok:false,
				user:'',
				psw:'',
			}
		},
		computed:{
			isOk:function(){
				let that = this;
				if(that.isuse&&that.psw.length>5){
					this.isok=true;
				}else{
					this.isok=false;
				}
				return that.isok;
			}
		},
		
		methods: {
			looks:function(){
				if(this.look){
					this.type="password";
					this.look=!this.look;
					this.lookurl='../../static/img/yincangbukejian.png'
				}else{
					this.type="text";
					this.look=!this.look;
					this.lookurl='../../static/img/xianshikejian.png'
					
				}
			},
			
			tologinin:function(){
				uni.navigateBack({
					delta:1
				})
			},
			
			//匹配用户
			matchuser:function(e){
				this.user=e.detail.value;
				if(this.user.length>0){
					uni.request({
						url: this.serverUrl + '/signup/judge',
						data:{
							name:this.user,
							type:'name',
						},
						method:'POST',
						success:(data) =>{
							console.log(data);
							let status = data.data.status;
							if(status ==200){
								let res = data.data.result;
								if(res>0){
									this.occupy=true;
									this.isuse=false;
								}else{
									this.occupy=false;
									this.isuse=true;
								}
								this.isOk;
							}else if(status==500){
								uni.showToast({
									title:'服务器出错啦!',
									icon:'none',
									duration:2000,
								});
							}
						}
					})
				}else{
					this.occupy=false;
					this.isuse=false;
					this.isOk;
				}
				//this.isOk();
			},
			
			getpsw:function(e){
				this.psw=e.detail.value;
				this.isOk;
			},
			
			signup:function(){
				if(this.isOk){
						uni.request({
							url: this.serverUrl + '/signup/add',
							data:{
								name:this.user,
								psw:this.psw,
							},
							method:'POST',
							success:(data) =>{
								console.log(data);
								let status = data.data.status;
								if(status ==200){
									uni.navigateTo({
										url:'../loginin/loginin?user='+this.user,
									})
								}else if(status==500){
									uni.showToast({
										title:'服务器出错啦!',
										icon:'none',
										duration:2000,
									});
								}
							}
						})
					}else{
						this.occupy=false;
						this.isuse=false;
						this.isOk;
					}
					//this.isOk();
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
		
		.top-left{
			float: left;
			padding-right: 32rpx;
			width: 88rpx;
			height: 88rpx;
			.text{
				font-size: 32rpx;
				font-weight: 900;
				color: #333333;
				line-height: 88rpx;
			}
			.back{
				width: 46rpx;
				height: 46rpx;
				margin-top: 21rpx;
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
		.inputs-u{
			position: relative;
		}
		.occupy{
			position: absolute;
			right: 0;
			top: 40rpx;
			font-size: 36rpx;
			font-weight: 500;
			color: red;
			line-height: 88rpx;
		}
		.ok{
			position: absolute;
			right: 0;
			top: 76rpx;
			width: 38rpx;
			height: 30rpx;
		}
		.see{
			position: absolute;
			right: 0;
			top: 76rpx;
			width: 38rpx;
			height: 30rpx;
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
	.submit1{
		margin: 0 auto;
		width: 520rpx;
		height: 96rpx;
		background-color: rgba(39,400,50,0.4);
		box-shadow: 0 50rpx 32rpx -36rpx rgba(255,228,49,0.4);
		border-radius: 48rpx;
		font-size: 32rpx;
		font-weight: 900;
		color: white;
		line-height: 96rpx;
		text-align: center;
	}

</style>
