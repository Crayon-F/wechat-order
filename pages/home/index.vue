<template>
	<view class="container">
		<view class="content-data">
			<view class="nav">
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
				@scroll="scroll">
					<view @click="getActive(item)" v-for="(item,index) in navList" :key='index' :class="['nav-item',{'active':activeId===item.id}]">{{item.name}}</view>
				</scroll-view>
			</view>
			<view class="shop-list">
				<scroll-view  scroll-y="true" class="scroll-Y shop-list-scroll"
				 v-if="shopList.length > 0">
					<view  v-for="(item,index) in shopList" :key='index' @click="showDetail(item)" class="shop-list-item">
						<image :src="item.pic" mode="" class="pic"></image>
						<p class='name'>{{item.name}}</p>
					</view>
				</scroll-view>
				<view class="no-data" v-else>
					暂无数据
				</view>
			</view>
		</view>
		<view class="bottom-footer">
			<view class="car" @click="showShopCarPop">
				<view class="car-pic"></view>
				<span  class='totalNumber'>{{totalNumber}}</span>
				<span class='totalPirce'>￥{{totalPirce}}</span>
			</view>
			<view>
				<button :disabled="totalNumber == 0" class="shop-btn" type="primary" size="mini" @click="generateOrder" :loading="isLoading">下单</button>
			</view>
		</view>
		<!-- 商品详情然弹窗 -->
		<uniPopup ref="popup" type="bottom" class='Popup'>
			<view class="model">
				<view class="title">
					<view class="classify">
						<p>{{detailInfo.basicInfo.name}}</p>
					</view>
				</view>
				<view class="classify-list">
					<view class="classify-list-item" v-for="(item,index) in detailInfo.properties" :key='index'>
						<p class='sub-title'>{{item.name}}</p>
						<view class="classify-list-ul" v-if="item.childsCurGoods.length">
							<view  :class="['ul-item',{checked:tag.isChecked}]" v-for="(tag,index) in item.childsCurGoods" :data-father='item.id' :data-child='tag.id' :key='index' @click='choiceType($event)'>
								{{tag.name}}
							</view>
						</view>
					</view>
					<view class="addCard">
						<view class="price">￥{{currentShopInfo.price}}</view>
						<view><button type="warn" size="mini" :disabled='currentShopInfo.price === 0' @click="currentAddCar">加入购物车</button></view>
					</view>
				</view>
			</view>
		</uniPopup>
		<!-- 购物车弹窗 -->
		<uniPopup ref="shopCar" type="bottom" class='Popup'>
			<view class="model">
				<view class="title">
					<view class="classify">
						<p>购物车</p>
					</view>
				</view>
				<view class="classify-list">
					<template v-if="shopCarList.length > 0">
						<view class="classify-list-item shopcar-pop" v-for="(item,index) in shopCarList" :key='index'>
							<image :src="item.pic" mode="" class="shop-pic"></image>
							<view class="car-shop-list">
								<view class="car-shop-list-item">
									<view class="car-shop-list-item-name">
										{{item.name}}
									</view>
									<view class="car-shop-list-item-type" v-for="(tag,index) in item.names" :key='index'>
										{{tag}}
									</view>
								</view>
								<view class="">
									<uni-number-box  :min="0" :max="10" :value='item.number' @change="getUpdateNumber($event,item)"></uni-number-box>
								</view>
							</view>
							<view class="car-shop-list-item-price">
								￥{{item.number * item.price}}
							</view>
						</view>
					</template>
					<view class="shopcar-no" v-else>
						<image class="shopcar-no-pic" src="https://cdn.it120.cc/apifactory/2019/01/15/efe19e3b852c0912e4b834f426363f29.png" mode=""></image>
						<p class='empty-car'>您的购物车是空的~</p>
					</view>
					
				</view>
			</view>
		</uniPopup>
		<!-- 授权登陆 -->
		<uniPopup ref="warrantLogin" type="bottom" class='Popup'>
			<view class="model">
				<view class="title">
					<view class="classify">
						<p>微信授权页面</p>
					</view>
				</view>
				<view class="classify-list warrantLogin-model">
					<view>授权并同意使用微信账号登录当前小程序</view>
					<button type="primary" class="warrantLogin-model-btn" :loading="isLoginLogin" @click="loginBtn">授权登陆</button>
				</view>
			</view>
		</uniPopup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import api from '../../api/api.js'
	export default {
		components:{
			uniPopup,
			uniNumberBox
		},
		data() {
			return {
				scrollTop: 0,
				old: {
				     scrollTop: 0
				},
				activeId:'',
				navList:[{id:'', name: '全部'}],
				shopList:[],
				isLoading:false,
				detailInfo:{},
				propertyChildIds:{},
				currentShopInfo:{
					price:0
				},
				shopCarList:[],
				isCanUse:uni.getStorageSync('isCanUse') || true,//默认为true
				isLoginLogin:false
			}
		},
		created(){
			this.getNav();
			this.getShop();
		},
		watch: {
			
		},
		computed:{
			totalPirce(){
				let amount = 0;
				this.shopCarList.map(item=>{
					amount+=item.price*item.number
				})
				console.log(amount)
				return amount;
			},
			totalNumber(){
				let number = 0;
				this.shopCarList.map(item=>{
					number+= parseInt(item.number) 
				})
				console.log(number)
				return number;
			}
		},
		methods: {
			confirm(done){
				done()
			},
			close(done){
				done()
			},
			loginBtn(){
				this.isLoginLogin = true;
				wx.login({
				  success:(res)=>{
					 let code = res.code;
					 api.login({
						 code: code
					 }).then(res=>{
						 this.isLoginLogin = false;
						 if (res.data.code === 10000) {
							 
							 console.log('去注册')
							 
							 // Todo
							 // 注册
							 
						 }else if(res.data.code != 0){
							 this.$refs.warrantLogin.close();
							 uni.showModal({
							     title: '提示',
							     content: '无法登陆，请重试',
								 cancelText:'取消',
								 confirmText:'确定',
							     success: function (res) {
							         if (res.confirm) {
							             console.log('用户点击确定');
							         } else if (res.cancel) {
							             console.log('用户点击取消');
							         }
							     }
							 });
							 return;
						 }
						 
						 // Todo
						 // 登陆成功，将成功返回的数据存储在setStorageSync中
						 // 用来判断登陆
						 
					 })
				  },
				  
					
				})
				// // uni.login({
				// // 	provider: 'weixin',
				// // 	success: function(loginRes) {
				// // 		console.log(loginRes)
				// 		// try {
				// 		// 	uni.setStorageSync('isCanUse', false);//记录是否第一次授权  false:表示不是第一次授权
				// 		// 	_this.updateUserInfo();
				// 		// } catch (e) {}
				// 	},
				// 	fail(res) {}
				// });
			},
			//下单
			generateOrder(){
				let _this = this;
				// 没有登陆
				let userInfo = uni.getStorageSync('userInfo');
				if(!userInfo){
					// this.$refs.warrantLogin.open()
					if(this.isCanUse){
						uni.authorize({
						    scope: 'scope.userInfo',
						    success() {
						        uni.getUserInfo({
									  provider: 'weixin',
									  success:(infoRes)=>{
										console.log('用户信息：' + infoRes.userInfo.nickName);
										_this.isCanUse = false;
										uni.setStorageSync('isCanUse', false);
										_this.$refs.warrantLogin.open();
									  }
								})
						    }
						})
					}else{
						uni.getUserInfo({
							  provider: 'weixin',
							  success:(infoRes)=>{
								console.log('用户昵称为：' + infoRes.userInfo.nickName);
								_this.$refs.warrantLogin.open()
								
							  }
						})
					}
					
				}
				return;
				
				// Todo
				// 登陆以后的逻辑生成订单
			},
			getUpdateNumber(value,cur){
				if(value > 0){
					cur.number = value;
					this.$store.commit('updateShopCar',cur)
				}else{
					cur.number = 0;
					this.$store.commit('delectShopCar',cur)
				}
				
			},
			showShopCarPop(){
				this.$refs.shopCar.open();
				
			},
			getShopList(){
				this.shopCarList = this.$store.state.shopcarList;
				console.log(this.shopCarList)
			},
			currentAddCar(){
				this.$store.commit('addShopCar',this.propertyChildIds)
				this.$refs.popup.close()
				this.getShopList()
			},
			choiceType(e){
				let fatherId = e.target.dataset.father
				let childId =  e.target.dataset.child
				let array = this.detailInfo.properties.filter(item=>{
					return item.id === fatherId;
				})
				array[0].childsCurGoods.forEach(item=>{
					item.isChecked = false;
					if(item.id == childId){
						item.isChecked = !item.isChecked;
					}
				})
				this.setPropertyChildIds()
			},
			setPropertyChildIds(){
				this.propertyChildIds = {};
				let _this = this;
				let ids = []
				let names = []
				let price = {}
				this.detailInfo.properties.forEach(item=>{
					item.childsCurGoods.forEach(child=>{
						if(child.isChecked){
							ids.push(`${item.id}:${child.id}`)
							names.push(`${child.name}`)
						}
					})
				})
				this.propertyChildIds = {
					ids,
					names,
					name:this.detailInfo.basicInfo.name,
					number:1,
					id:this.detailInfo.basicInfo.id,
					price:0,
					pic:this.detailInfo.basicInfo.pic
				}
				if(this.propertyChildIds.ids.length == 3){
					let propertyChildIds = [...this.propertyChildIds.ids];
					let propertyChildIdsStr =  propertyChildIds.join(',')
					this.getCurrentPrice(this.detailInfo.basicInfo.id,propertyChildIdsStr)
				}
				
			},
			getCurrentPrice(goodsId,propertyChildIds){
				api.getCurrentInfo({
					goodsId,
					propertyChildIds
				}).then(info=>{
					if(info.data.code == 0){
						this.currentShopInfo = Object.assign({},this.currentShopInfo,info.data.data);
						this.propertyChildIds.price = this.currentShopInfo.price;
					}
				})
			},
			showDetail(cur){
				uni.showLoading({
				    title: '加载中'  
				});
				this._reset()
				this.$refs.popup.open()
				
				api.getDetail({
					id:cur.id
				}).then(res=>{
					uni.hideLoading()
					let array = [...res.data.data.properties]
					array.map(item=>{
						item.childsCurGoods.map(child=>{
								child.isChecked = false
							})
					})
					
					this.detailInfo = {
							basicInfo:{...res.data.data.basicInfo},
							properties:[...array]
					}
					
				})
			},
			getActive(active){
				this.activeId = active.id;
				this.getShop()
			},
			getShop(){
				uni.showLoading({
					title:'加载中'
				})
				api.getShopList({
					categoryId:this.activeId
				}).then(res=>{
					uni.hideLoading()
					if(res.data.code == 0){
						this.shopList = res.data.data;
					}else{
						this.shopList = [];
					}
				})
			},
			getNav(){
				uni.showLoading({  
				    title: '加载中'  
				});
				api.getNavList()
					.then(res=>{
						uni.hideLoading()
						if(res.data.code == 0){
							this.navList = [...this.navList,...res.data.data]
						}
					})
			},
			_reset(){
				this.currentShopInfo = {
					price:0
				}
			},
			upper:function(e) {
				console.log(e)
			 },
			lower: function(e) {
				console.log(e)
			},
			scroll: function(e) {
				console.log(e)
				this.old.scrollTop = e.detail.scrollTop
			},
		}
	}
</script>

<style lang="less">
	page{
		height: 100% !important;
	}
	.container {
		display:flex;
		height: 100%;
		flex-direction: column;
		.content-data{
			display:flex;
			flex:1;
			.nav{
				border-right: 1px solid #ccc;
				width: 90px;
				.nav-item{
					padding:0 20px;
					height: 50px;
					line-height: 50px;
					&.active{
						border-right: 1px solid #FF6600;
					}
				}
			}
			.shop-list{
				height: 100%;
				flex:1;
				display: flex;
				.shop-list-scroll{
					height: 100%;
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;
				}
				.shop-list-item{
					width: 33.3%;
					text-align:center;
					float: left;
					padding:10px 0;
					.pic{
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
					}
					.name{
						font-size: 14px;
					}
				}
				
			}
		}
		.bottom-footer{
			width: 100%;
			height: 80px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			padding:0 30px;
			
			.car{
				display: flex;
				align-items:center;
				.car-pic{
					width: 36px;
					height: 36px;
					background: url(images/car.png) no-repeat center;
					background-size: 100%;
					
				}
				.totalNumber{
					padding: 0 6px 0 7px;
					background: red;
					text-align: center;
					border-radius:8px;
					color: #fff;
					background: #ff2a00;
					font-size: 12px;
				}
				.totalPirce{
					margin-left: 30rpx;
				}
			}
			.shop-btn{
				height: 35px;
				width: 132px;
				background: #ff2a00;
				line-height: 35px;
			}
		}
		.Popup{
			width: 100%;
			// height: 100%;
			.model{
				width: 96%;
				background: #fff;
				box-sizing:border-box;
				padding: 10px;
				margin:0 auto;
				border-radius: 4px;
				.title{
					height: 30px;
					border-bottom: 1px solid #ccc;
					padding-left: 8px;
					font-size: 12px;
				}
				.classify-list{
					&.warrantLogin-model{
						padding:30px 0;
						text-align:center;
						.warrantLogin-model-btn{
							margin-top: 28px;
							width: 90%;
							height: 35px;
							line-height: 35px;
							font-size: 14px;
						}
					}
					.classify-list-item{
						padding:8px 0;
						&.shopcar-pop{
							display: flex;
							justify-content: space-between;
							border-bottom:1px solid #ccc;
							align-items: center;
							padding:12px 10px;
							.shop-pic{
								width: 40px;
								height: 40px;
							}
							.car-shop-list{
								display: flex;
								flex-direction: column;
								.car-shop-list-item-name{
									margin-right: 6px;
								}
								.car-shop-list-item-type{
									margin:0 2px;
								}
								.car-shop-list-item{
									display: flex;
								}
							}
							.car-shop-list-item-price{
								color:red;
							}
						}
					}
					.sub-title{
						margin:8px 0;
					}
					.classify-list-ul{
						display: flex;
						flex-wrap: wrap;
						.ul-item{
							border: 1px solid #f1f2f3;
							border-radius: 3px;
							text-align: center;
							height: 25px;
							line-height: 24px;
							line-height: 25px;
							font-size: 12px;
							padding:0 10px;
							margin:6px;
							box-sizing: border-box;
							&.checked{
								background: #4CD964;
								color: #fff;
							}
						}
					}
					.shopcar-no{
						text-align:center;
						.shopcar-no-pic{
							width: 250rpx;
							height: 250rpx;
						}
					}
				}
				.addCard{
					display: flex;
					align-items: center;
					justify-content:space-between;
					padding:8px 0;
					.price{
						color:#FF6600;
					}
				}
			}
		}
		.header {
		        margin: 90rpx 0 90rpx 50rpx;
		        border-bottom: 1px solid #ccc;
		        text-align: center;
		        width: 650rpx;
		        height: 300rpx;
		        line-height: 450rpx;
		    }
		
		    .header image {
		        width: 200rpx;
		        height: 200rpx;
		    }
		
		    .content {
		        margin-left: 50rpx;
		        margin-bottom: 90rpx;
		    }
		
		    .content text {
		        display: block;
		        color: #9d9d9d;
		        margin-top: 40rpx;
		    }
		
		    .bottom {
		        border-radius: 80rpx;
		        margin: 70rpx 50rpx;
		        font-size: 35rpx;
		    }
		
	}
	
</style>
