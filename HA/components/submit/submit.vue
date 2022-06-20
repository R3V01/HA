<template>
	<view>
		<view class="submit">
			<view class="chat">
				<textarea auto-height="true" class="text" @input="inputs" v-model="msg"></textarea>
				<view class="emoji">
					<image src="../../static/icon_1sjrt66hk8e/a-bianzu53.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				msg:'',
			}
		},
		methods: {
			inputs:function(e){
				var chatcontent = e.detail.value;
				var pos = chatcontent.indexOf('\n');
				if(pos!=-1 && chatcontent.length>1){
					this.$emit('inputs',this.msg);
					this.msg='';
				} 
			}
		}
	}
</script>

<style lang="scss">
	.submit{
		background-color: #00aac1;
		border-top: 1rpx solid #333333;
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 100;
		.chat{
			width: 100%;
			display: flex;
			align-items: flex-end;
			box-sizing: border-box;
			padding: 14rpx 14rpx;
			image{
				width: 56rpx;
				height: 56rpx;
				margin: 10rpx 10rpx;
				flex: auto;
			}
			.text{
				flex: auto;
				background-color: #FFFFFF;
				border-radius: 10rpx;
				padding: 20rpx;
				max-height: 160rpx;
				margin: 0rpx 20rpx;
			}
		}
	}

</style>
