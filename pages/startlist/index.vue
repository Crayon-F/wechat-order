<template>
	<view class="start">
		<view class="uni-padding-wrap uni-common-mt">
			<scroll-view class="scroll-view_H" :style="{ width: screenWidth+ 'px',height:screenHeight+'px' }" scroll-x="true" @scroll="scroll" scroll-left="100%" @scrolltolower="scrolltolower">
				<view class="scroll-view-item_H first">
					<view class="title"></view>
					<image :src="userInfo.avatarUrl" mode="" class="user-pic"></image>
					<!-- <view class="root"> -->
						<!-- <view class="sunlight"></view> -->
						<view class="sea-one"></view>
						<view class="sea-two"></view>
						<view class="info">
							<view class="text">
								一起，加油
							</view>
							<button type="default" class="btnHome" @click="goHome">开启新之旅</button>
						</view>
					<!-- </view> -->
				</view>
				<!-- <view class="scroll-view-item_H second">
					欢迎
				</view>
				<view class="scroll-view-item_H third">
					大家
				</view> -->
			</scroll-view>
	</view>
	</view>
</template>
	
<script>
	const SystemInfo = uni.getSystemInfoSync();
	export default{
		data(){
			return{
				screenWidth: SystemInfo.screenWidth,
				screenHeight:SystemInfo.windowHeight,
				userInfo:{
					avatarUrl:''
				}
			}
		},
		created(){
			this.getUserInfo()
		},
		methods:{
			goHome(){
				uni.navigateTo({
				    url: '/pages/home/index'
				});
			},
			getUserInfo(){
				uni.getUserInfo({
					  provider: 'weixin',
					  success:(infoRes)=>{
						  this.userInfo = Object.assign({},this.userInfo,infoRes.userInfo)
						console.log('用户信息：' + infoRes.userInfo.avatarUrl);
					  }
				})
			},
			scroll(event) {
				//距离每个边界距离
				console.log(event.detail)
			},
			//滚动到底部/右边触发
			scrolltolower() {
				console.log(1111);
			},
			// 滚动到顶部/左边触发
			scrolltoupper() {
				console.log(2222);
			}
		}
	}
</script>

<style scoped lang="less">
	page{
		height: 100%;
		width: 100%;
	}
	 .scroll-view_H {
	        white-space: nowrap;
			.scroll-view-item_H {
				display: inline-block;
				width: 100%;
				height: 100%;
				&.first{
					background: #76DAFF;
					text-align:center;
					position: relative;
					.title{
						padding-top:10px;
						width: 300px;
						height: 300px;
						margin:0 auto;
						background: url('./images/title.png') no-repeat center;
						background-size:100%;
					}
					.user-pic{
						width: 80px;
						height: 80px;
						border-radius: 50%;
						position: absolute;
						top:40%;
						left:50%;
						transform: translate(-50%,0);
						transform-origin: center;
						animation: translate-sea-user 2s  linear infinite;
					}
					@keyframes translate-sea-user{
						0% {
						    transform: rotatez(7deg) translate(-17px, 1px);
						  }
						  50% {
						    transform: rotatez(-7deg) translate(17px, 1px);
						  }
						  100% {
						    transform: rotatez(7deg) translate(-17px, 1px);
						  }
					}
					.root {
						width: 100%;
						height: 100%;
						position: absolute;
						// background-image: linear-gradient(to bottom,#2F79D2,white);
					}
					.sea-one {
						width: 100%;
						height: 50%;
						background: url('./images/wave.png') no-repeat center;
						background-size:cover;
			 
						position: absolute;
						left: 0;
						bottom: 40px;
						animation: translate-sea-one 2s  linear infinite;
			 
						/*
						半透明
						*/
						opacity: 0.5;
					}
					
					 
					.sea-two {
						width: 100%;
						height: 50%;
						background: url("./images/wave.png") no-repeat center;
						background-size:cover;
			 
						position: absolute;
						left: 0;
						bottom: 0px;
						animation: translate-sea-two 2s 0.5s linear infinite;
						
						box-sizing: border-box;
						.text{
							position: absolute;
							top:100px;
							left:50%;
							transform: translate(-50%,0);
							font-family: 'STXihei';
							font-size: 20px;
						}
					}
					.info{
						position: absolute;
						bottom:20%;
						left:0;
						width: 100%;
						.text{
							font-size: 20px;
							font-family: 'STXihei';
						}
						.btnHome{
							width: 40%;
							height: 40px;
							line-height: 40px;
							background: #76DAFF;
							color:#fff;
							margin-top:80px;
						}
					}
					 
					/*
					海水1的动画
					*/
					@keyframes translate-sea-one {
			 
						0% {
			 
						}
			 
						50% {
							bottom: 20px;
						}
			 
						100% {
							bottom: 40px;
						}
			 
					}
					/*
					海水2的动画
					*/
					@keyframes translate-sea-two {
			 
						0% {
						}
			 
						50% {
							bottom: -20px;
						}
			 
						100% {
							bottom: 0px;
						}
					}
				}
				&.second{
					background: pink;
				}
				&.third{
					background: lightgreen;
				}
			}
	}
</style>
