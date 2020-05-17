import Vue from 'vue'
import Vuex from 'vuex'
let state = {
	shopcarList:[]
}
let mutations = {
	addShopCar(state,current){
		let isRepeact = false;
		state.shopcarList.some(item=>{
			if(item.id == current.id){
				item.number = ++item.number;
				isRepeact = true;
			}
		})
		if(!isRepeact){
			state.shopcarList.push(current)
		}
	},
	updateShopCar(state,current){
		state.shopcarList.map(item=>{
			if(item.id == current.id){
				item.number = current.number
			}
		})
	},
	delectShopCar(state,current){
		let curIndex = 0;
		state.shopcarList.map((item,index)=>{
			if(item.id == current.id){
				curIndex = index
			}
		})
		state.shopcarList.splice(curIndex,1)
	}
}
Vue.use(Vuex)
const store = new Vuex.Store({
    state,
    mutations,
})
export default store