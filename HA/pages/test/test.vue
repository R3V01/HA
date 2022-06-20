<template>
	<view>
		<view class="upload" @tap="upload">pic</view>
		<image :src="img"></image>
		<button  @tap="testFun">test</button>
	</view>
</template>

<script>
	import myfunc from '../../common/myfunc.js';
	
	export default {
		data() {
			return {
				id:'77',
				img:'',
			}
		},
		methods: {
			upload: function(){
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
								this.img = path;
								console.log(this.img);
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
					}
				});
			},
			
			testFun:function(){
				uni.request({
					url: this.serverUrl + '/friend/updatefriend',
					data:{
						uid:'62344a96edd7a43138802433',
						fid:'6231c23be257f751fd3e752b',
						//type:'sign',
						//psw: '123456',
						//state:1,
						msg:'Hello!',
					},
					method:'POST',
					success:(data) =>{
						console.log(data);
					}
				})
			
			},
		}
	}
</script>

<style>
	.upload{
		padding-top: 40rpx;
		text-align: center;
	}
	

</style>
