<template>
	<view>
		<view class="top">
			<view class="top-friend" @tap="chat">
				<image src="../../static/img/tongzhi.png"></image>
			</view>
			<view class="post" @tap="postImg()">
				<image src="../../static/img/shangchuan.png"></image>
			</view>
		</view>
		<view class="content">
			<view class="share" v-for="(item,index) in users" :key="index">
				<view class="share-top">
					<view class="user-head">
						<image :src="item.headurl"></image>
						<view class="user-name">{{item.username}}</view>
					</view>
					<view class="time">{{changeTime(item.time)}}</view>
				</view>
				<view class="share-content">
					<image :src="item.imgurl"></image>
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import datas from '../../common/data.js';
	import myfunc from '../../common/myfunc.js'
	export default {
		data() {
			return {
				users:[],
				uid:'',
				headurl:'',
				imgurl:'',
				token:'',
			}
		},
		onLoad() {
			this.getStorages();
			this.getPost();
		},
		onPullDownRefresh() {
				this.users=[],
				//this.getStorages();
				this.getPost();
				console.log('refresh');
				setTimeout(function () {
					uni.stopPullDownRefresh();
				}, 1000);
			},
		methods: {
			changeTime: function(date){
				return myfunc.dateTime(date);
			},
			//获取缓存
			getStorages:function(){
				
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id;
						this.headurl = this.serverUrl+'/user/'+value.headurl;
						this.token = value.token;
					}
					//console.log(value);
				} catch (e) {
					// error
				}
			},
			
			getPost1: function(){
				this.users = datas.uers();
				for(let i=0;i<this.users.length;i++){
					this.users[i].headurl='../../static/icon_1sjrt66hk8e/'+this.users[i].headurl;
					this.users[i].picurl='../../static/img/'+this.users[i].picurl;
					}
				console.log(this.users);
			},
			
			getPost: function(){
				uni.request({
					url:this.serverUrl+'/post/getpost',
					data:{
						//uid:this.uid,
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
								//this.users = res;
								for(let i=0;i<res.length;i++){
									res[i].headurl=this.serverUrl +'/user/'+res[i].headurl;
									res[i].imgurl;
									res[i].username;
									this.users.push(res[i])
								}
							}
							//console.log(this.imgurl);
							this.users = myfunc.paixu(this.users,'lastTime',0);
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
			
			
			chat:function(){
				uni.navigateTo({
					url:"../friends/friends"
				})
			},
			
			
			postImg:function(){
				let url = myfunc.fileName(new Date());
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album','camera'], //从相册选择
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						const uploadTask = uni.uploadFile({
							url: this.serverUrl + '/files/upload', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								url: url,
								name:new Date().getTime(),
							},
							success: (uploadFileRes) => {
								console.log(uploadFileRes);
								let path = this.serverUrl +'/'+url+'/'+ uploadFileRes.data;
								this.imgurl = path;
								console.log(this.imgurl);
								this.justPost();
							}
						});
				
						uploadTask.onProgressUpdate((res) => {
							console.log('上传进度' + res.progress);
							console.log('已经上传的数据长度' + res.totalBytesSent);
							console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
				
							// 测试条件，取消上传任务。
							/* if (res.progress > 50) {
								uploadTask.abort();
							} */
						});
					},
					
				});
				//this.justPost();
			},
			
			justPost:function(){
				uni.request({
					url:this.serverUrl+'/post/post',
					data:{
						uid:this.uid,
						imgurl:this.imgurl
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
			
			/*post:function(){
				this.postImg();
				this.justPost();
			}*/
		}
	}
</script>

<style lang="scss">
	.top{
		width: 100%;
		height: 100rpx;
		//border: #007AFF;
		background-color: #00aac1;//#494949
		position: fixed;
		z-index: 999;
		.top-friend{
			float: left;
			image{
				width: 60rpx;
				height: 60rpx;
				margin: 15rpx 20rpx;
			}
		}
		.post{
			float: right;
			image{
				width: 60rpx;
				height: 60rpx;
				margin: 15rpx 20rpx;
			}
		}
	}
	.content{
		.share{
			border-bottom: 8rpx solid #d3ddf2;//#ed6c00
			width: 100%;
			background-color: #d3ddf2;
			padding-top: 100rpx;
			.share-top{
				width: 100%;
				height: 80rpx;
				background-color: #f2e8d3;//#00aac1
				.user-head{
					float: left;
					margin: 5rpx 10rpx;
					image{
						width: 70rpx;
						height: 70rpx;
						border-radius: 35rpx;
					}
					.user-name{
						float: right;
						margin: 15rpx 10rpx;
						font-weight: 550;
					}
				}
				.time{
					float: right;
					margin-top: 40rpx;
					margin-right: 20rpx;
					font-weight: 530;
				}
			}
			.share-content{
				border-top: 5rpx solid #f2e8d3;
				image{
					width: 100%;
					height: 500rpx;
				}
			}
		}
	}
</style>
