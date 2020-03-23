/*

*/
import Vue from 'vue'
import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORY,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  RECEIVE_INFO,
  RECEIVE_GOODS,
  RECEIVE_RATINGS,
  INCREMENT_FOOD_COUNT,
  DECREMENT_FOOD_COUNT,
  CLEAR_CART,
  RECEIVE_SEARCH_SHOPS
} from './mutation-types'

export default {
  [RECEIVE_ADDRESS] (state,{address}) {
    state.address = address
  },
  [RECEIVE_CATEGORY] (state,{category}) {
    state.category = category
  },
  [RECEIVE_SHOPS] (state,{shops}) {
    state.shops = shops
  },
  [RECEIVE_USER_INFO] (state,{userInfo}) {
    state.userInfo = userInfo
  },
  [RECEIVE_INFO] (state,{info}) {
    state.info = info
  },
  [RECEIVE_GOODS] (state,{goods}) {
    state.goods = goods
  },
  [RECEIVE_RATINGS] (state,{ratings}) {
    state.ratings = ratings
  },
  [INCREMENT_FOOD_COUNT] (state,{food}) {
    if(!food.count) {
      Vue.set(food,'count',1)
      state.cartFoods.push(food)
    } else {
      food.count++
    }
  },
  [DECREMENT_FOOD_COUNT] (state,{food}) {
    if(food.count){
      food.count--
      if(food.count===0) {
        const index = state.cartFoods.indexOf(food)
        state.cartFoods.splice(index,1)
      }
    }
  },
  [CLEAR_CART] (state) {
    state.cartFoods.forEach(food=> food.count = 0)
    state.cartFoods = []
  },
  [RECEIVE_SEARCH_SHOPS](state, {searchShops}) {
    state.searchShops = searchShops
  },
}
