<template>
	<view>
		<view class="user">
			<view class="u-head"><image src="../../static/logo.png"></image></view>
		</view>
		<view class="sth">
			<view class="u-name">R3</view>
			<view class="u-sign">R3 is a furry</view>
		</view>
		<view class="user-share">
			<view class="u-share-list">
				<image src="../../static/logo.png"></image>
			</view>
			<view class="u-share-list">
				<image src="../../static/logo.png"></image>
			</view>
			<view class="u-share-list">
				<image src="../../static/logo.png"></image>
			</view>
			<view class="u-share-list">
				<image src="../../static/logo.png"></image>
			</view>
			<view class="u-share-list">
				<image src="../../static/logo.png"></image>
			</view>
			<view class="u-share-list">
				<image src="../../static/logo.png"></image>
			</view>
		</view>
		<view class="btn">
			<button class="chat">发消息</button>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				matchers:{},
				
			}
		},
		
		onLoad() {
			this.getStorages();
		},
		
		methods: {
			
			getStorages:function(){
				try {
					const value = uni.getStorageSync('match');
					if (value) {
						this.matchers=value.matchers;
						console.log(this.matchers);
					}
				} catch (e) {
					// error
				}
			},
		}
	}
</script>

<style lang="scss">
	.user{
		width: 100%;
		height: 300rpx;
		background-color: #C0C0C0;
		
		.u-head{
			width: 100%;
			height: 100%;
			background-color: white;
			padding: 0 auto;
			image{
				width: 300rpx;
				height: 300rpx;
				border-radius: 150rpx;
				display: block;
				margin: 10% auto;
			}
		}
		
	}
	.sth{
		width: 100%;
		height: 150rpx;
		background-color: yellow;
		.u-name{
			width: 100%;
			height: 60%;
			background-color: white;
			font-size: 50rpx;
			font-weight: bold;
			text-align: center;
		}
		.u-sign{
			width: 100%;
			height: 40%;
			background-color: #999999;
			text-align: center;
		}
	}
	.user-share{
		padding-left: 0.5%;
		padding-right: 0.5%;
		display: flex;
		flex-wrap: wrap;
		.u-share-list{
			width: 33%;
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
		background-color: #007AFF;
		.chat{
			background-color: #F0AD4E;
			width: 350rpx;
			height: 100rpx;
			background-color: 30rpx;
			display: block;
			margin: 100rpx auto;
		}
	}

</style>