<template>
	<view >
		<view class="user">
			<view class="u-head">
				<image-cropper :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>
				
				<image :src="this.headurl" @tap="upload" ></image>
				
			</view>
			<view class="u-name">
				<view class="name">{{myname}}</view>
			</view>
			<view class="u-sign">
				<textarea auto-height="true" class="sign" placeholder='个性签名' :value='this.sign' @blur='updateDetail'></textarea>
			</view>
			
		</view>
		<view class="sth"></view>
		<view class="user-share">
			<view class="u-share-list" v-for="(item,index) in user" :key="index">
				<image :src="item.imgurl"></image>
			</view>
		</view>
		
		
		
	</view>
</template>

<script>
	import myfunc from '../../common/myfunc.js';
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	export default {
		data() {
			return {
				user:[],
				uid:'',
				headurl:'',
				imgurl:'',
				sign:'',
				token:'',
				myname:'',
				tempFilePath: '',
				cropFilePath: '',
			}
		},
		
		components: {
		    ImageCropper,
		},
		
		onLoad() {
			
			this.getStorages();
			this.getPost();
			this.getUserdetail();
		},
		
		onPullDownRefresh() {
				this.user=[],
				//this.getStorages();
				this.getPost();
				console.log('refresh');
				setTimeout(function () {
					uni.stopPullDownRefresh();
				}, 1000);
			},
		
		methods: {
			getStorages:function(){
				
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id;
						this.headurl = this.serverUrl+'/user/'+value.headurl;
						this.token = value.token;
						this.myname = value.name;
					}
				} catch (e) {
					// error
				}
			},
			
			getPost: function(){
				uni.request({
					url:this.serverUrl+'/post/getpost',
					data:{
						uid:this.uid,
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
									res[i].imgurl;
									this.user.push(res[i])
								}
							}
							console.log(this.imgurl);
							this.user = myfunc.paixu(this.user,'lastTime',0);
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
			
			upload() {
			    uni.chooseImage({
			        count: 1, //默认9
			        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			        sourceType: ['album'], //从相册选择
			        success: (res) => {
			            this.tempFilePath = res.tempFilePaths.shift()
			        }
			    });
			},
			confirm(e) {
			      this.tempFilePath = "";
			      this.cropFilePath = e.detail.tempFilePath;
				  this.headurl = e.detail.tempFilePath;
			
			      uni.uploadFile({
			        url: this.serverUrl + '/files/upload', 
			        filePath: this.headurl,
			        name: "file",
			        fileType: "image",
			        formData:{
						url:'user',
						name:this.uid,
						token:this.token,
					},
			        success: (uploadFileRes) => {
			          var backstr = uploadFileRes.data;
					  console.log(backstr);
					  try {
					  	uni.setStorageSync('user',{'id':this.id,'name':this.name,'headurl':backstr,'token':this.token});
					  }catch(e){
					  	console.log('数据储存出错')
					  }
			          //自定义操作
					  this.update(backstr,'headurl');
			        },
			
			        fail(e) {
			          console.log("this is errormes " + e.message);
			        },
			      });
			
			    },
			    cancel() {
			      console.log("canceled");
			      this.tempFilePath = "";
			    },
			
			getUserdetail:function(){
				uni.request({
					url:this.serverUrl+'/user/detail',
					data:{
						id:this.uid,
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
							this.sign = res.sign;
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
			
			updateDetail:function(e){
				uni.request({
					url: this.serverUrl + '/user/update',
					data:{
						id:this.uid,
						data:e.detail.value,
						type: 'sign',
						
					},
					method:'POST',
					success:(data) =>{
						console.log(data);
						let status = data.data.status;
						//console.log(e.detail.value);
						if(status ==200){
							let res =data.data.result;
							console.log(res);
							//this.sign = res.sign;
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
			
			update:function(e,t){
				uni.request({
					url: this.serverUrl + '/user/update',
					data:{
						id:this.uid,
						data:e,
						type: t,
						
					},
					method:'POST',
					success:(data) =>{
						console.log(data);
						let status = data.data.status;
						//console.log(e.detail.value);
						if(status ==200){
							let res =data.data.result;
							console.log(res);
							//this.sign = res.sign;
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
			
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #e6e6e6;
	}
	.user{
		width: 100%;
		height: 300rpx;
		background-color: #f5f5f5;
		
		.u-head{
			float: left;
			width: 40%;
			height: 100%;
			background-color: #f5f5f5;
			image{
				width: 200rpx;
				height: 200rpx;
				border-radius: 100rpx;
				margin-top: 30%;
				margin-left: 30%;
			}
		}
		
		.u-name{
			float: left;
			width: 60%;
			height: 60%;
			background-color: #f5f5f5;
			color: black;
			font-size: 50rpx;
			font-weight: bold;
			.name{
				margin: 20% 15%;
			}
			//margin: 30rpx 20rpx;
		}
		.u-sign{
			float: left;
			width: 60%;
			height: 40%;
			background-color: #f5f5f5;
			color: #525252;
			.sign{
				width: 80%;
				height: 30%;
				padding-left: 15%;
				margin-top: 10%;
				flex: auto;
				
			}
		}
		
	}
	.sth{
		width: 100%;
		height: 150rpx;
		background-color: #f5f5f5;
	}
	.user-share{
		padding-left: 0.5%;
		padding-right: 0.5%;
		display: flex;
		flex-wrap: wrap;
		background-color: #e6e6e6;
		.u-share-list{
			width: 33%;
			height: 350rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}

</style>
