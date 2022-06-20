<template>
	<view class="p">
		<view class="bottle" :style="wait">
			<button @tap="change"></button>
		</view>
		<view class="main" :style="wait">
			<view class="pos">
				<image src="../../static/icon_1sjrt66hk8e/a-bianzu36.png">xxxx</image>
			</view>
			<view class="game">
				<picker @change="gameChange" :value="gindex" :range="game" range-key="name">
					<view >{{ game[gindex].name }}</view>
				</picker>
			</view>
			<view class="num">
				<picker @change="numChange" :value="nindex" :range="member" range-key="num">
					<view >{{ member[nindex].num }}</view>
				</picker>
			</view>
			<view class="message" v-if="!mod">
				<textarea @blur="msg" ></textarea>
			</view>
			<view class="haren">
				<button class="btn" @tap="match" v-if="mod">开哈</button>
				<button class="btn" @tap="bematch" style="background-color: #009933;" v-if="!mod">等哈</button>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				game:[{ name:'哈酒' },{name:'哈剧本'},{name:'哈密室'}],
				gindex: 0,
				member:[{num:'1'},{num:'2'},{num:'3'},{num:'4'},{num:'5'}],
				nindex: 0,
				wait:'',
				mod:true,
				uid:'',
				message:'',
			}
		},
		
		onLoad(){
			this.getStorages();
		},
		
		methods: {
			msg: function(e){
				this.message = e.detail.value;
			},
			
			
			bematch: function(){
				uni.request({
					url:this.serverUrl+'/match/bematch',
					data:{
						uid:this.uid,
						game:this.gindex,
						num:this.nindex+1,
						message:this.message
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
							uni.showToast({
								title:'等人来找你吧！',
								icon:'success',
								duration:2000
							});
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
			
			match: function(){
				uni.request({
					url:this.serverUrl+'/match/hamatch',
					data:{
						game:this.gindex,
						num:this.nindex+1,
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
							if(res.length>0){
								try{
									uni.setStorageSync('match',{'matchers':res});
								}catch(e){
									console.log('数据储存出错')
								}
								
								uni.navigateTo({
									url:'../choose/choose'
								})
							}else{
								uni.showToast({
									title:'暂时没有想要的匹配哦！',
									icon:'none',
									duration:2000
								});
							}
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
			
			 
			gameChange: function(e) {
			 	this.gindex = e.detail.value;
			},
			numChange: function(e) {
			 	this.nindex = e.detail.value;
			},
			
			change: function(){
				this.mod = !this.mod;
				console.log(this.mod);
				if(this.mod == true){
					this.wait = '';
				}else{
					this.wait = 'background-color:#539b3d';
				}
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
			
		}
	}

	
	
</script>

<style lang="scss">
	page {
		height: 100%;
		background-color: #f6ae54;
	}
	.p{
		width: 100%;
		background-color: #f6ae54;
	
	
	.bottle{
		width: 30%;
		height: 280rpx;
		margin: auto auto;
		background-color: #CC3333;
		text-align: center;
		line-height: 280rpx;
		button{
			width: 30rpx;
			height: 30rpx;
			display: inline;
			margin: auto auto;
			border-radius: 50%;
			background-color: #FFFF33;
			font-weight: bold;
		}
	}
	.main{
		width: 80%;
		height: 800rpx;
		margin: auto auto;
		padding-top: 80rpx;
		background-color: #CC3333;
		border-radius: 30% 30% 15% 15%;
		.pos{
			width: 80%;
			height: 80rpx;
			background-color: orange;
			margin: 80rpx auto;
			image{
				width: 80rpx;
				height: 80rpx;
			}
		}
		
		.game{
			width: 60%;
			height: 80rpx;
			margin: 20rpx auto;
			background-color: orange;
			line-height: 80rpx;
			text-align: center;
			font-size: 32rpx;
			font-weight: bold;
		}
		.num{
			width: 60%;
			height: 80rpx;
			margin: 20rpx auto;
			background-color: orange;
			line-height: 80rpx;
			text-align: center;
			font-size: 32rpx;
			font-weight: bold;
		}
		.message{
			width: 60%;
			height: 80rpx;
			margin: 20rpx auto;
			background-color: orange;
			font-size: 32rpx;
			textarea{
				height: 100%;
				width: 100%;
				overflow: scroll;
			}
		}
		.haren{
			width: 50%;
			height: 120rpx;
			margin: 120rpx auto;
			.btn{
				width: 100%;
				height: 100%;
				border-radius: 50%;
				background-color: #990066;
				color: #FFFF33;
				line-height: 120rpx;
				font-weight: bolder;
				font-size: 40rpx;
			}
		}
		
	}
}
</style>
