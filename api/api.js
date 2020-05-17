import fetch from '../utils/axios.js'
export default{
	getNavList(parmas){
		return fetch.get('/shop/goods/category/all',parmas)
	},
	getShopList(parmas){
		return fetch.post('/shop/goods/list',parmas)
	},
	getDetail(parmas){
		return fetch.get('/shop/goods/detail',parmas)
	},
	getCurrentInfo(parmas){
		return fetch.post('/shop/goods/price',parmas)
	},
	login(parmas){
		return fetch.get('/user/wxapp/login',parmas)
	}
}