import Vue from 'vue'
import Vuex from 'vuex'
let state = {
	shopcarList:[]
}
let mutations = {
	addShopCar(state,current){
		let isRepeact = false;
		let index = 0;
		state.shopcarList.map(item=>{
			if(item.id == current.id){
				for(let i = 0;i<item.ids.length;i++){
					let ids = item.ids[i];
					// debugger;
					if(current.ids.indexOf(ids) !== -1){
						index++
						if(index == item.ids.length){
							console.log('index',index)
							item.number = ++item.number;
							isRepeact = true;
						}
					}else{
						break;
					}
				}
				// item.number = ++item.number;
				// isRepeact = true;
			}
		})
		if(!isRepeact){
			state.shopcarList.push(current)
		}
		console.log(state.shopcarList)
	},
	updateShopCar(state,current){
		let index = 0;
		state.shopcarList.map(item=>{
			if(item.id == current.id){
				for(let i = 0;i<item.ids.length;i++){
					let ids = item.ids[i];
					// debugger;
					if(current.ids.indexOf(ids) !== -1){
						index++
						if(index == item.ids.length){
							item.number = current.number;
						}
					}else{
						break;
					}
				}
			}
		})
	},
	delectShopCar(state,current){
		let curIndex = 0;
		let indexNumber = 0;
		state.shopcarList.map((item,index)=>{
			if(item.id == current.id){
				for(let i = 0;i<item.ids.length;i++){
					let ids = item.ids[i];
					// debugger;
					if(current.ids.indexOf(ids) !== -1){
						indexNumber++
						if(indexNumber == item.ids.length){
							curIndex = index;
						}
					}else{
						break;
					}
				}
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