/*

*/
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
import {
  reqAddress,
  reqFoodCategorys,
  reqLogout,
  reqSearchShop,
  reqSendCode,
  reqShopGoods,
  reqShopInfo,
  reqShopRatings,
  reqShops,
  reqUserInfo,
} from '../api'

export default {
  // 异步获取地址
  async getAddress({commit,state}) {
    // 发送异步ajax请求
    const geohash = state.latitude + ',' + state.longitude
    const result = await reqAddress(geohash)
    // 提交mutation
    if(result.code===0) {
      const address = result.data
      commit(RECEIVE_ADDRESS,{address})
    }
  },
  // 异步获取食品分类
  async getCategorys({commit}) {
    // 发送异步ajax请求
    const result = await reqFoodCategorys()
    // 提交mutation
    if(result.code===0) {
      const category = result.data
      commit(RECEIVE_CATEGORY,{category})
    }
  },
  // 异步获取商家列表
  async getShops({commit,state}) {
    // 发送异步ajax请求
    const {longitude,latitude} = state
    const result = await reqShops(longitude,latitude)
    // 提交mutation
    if(result.code===0) {
      const shops = result.data
      commit(RECEIVE_SHOPS,{shops})
    }
  },
  //同步记录用户信息
  recordUser({commit},userInfo) {
    commit(RECEIVE_USER_INFO,{userInfo})
  },
  //异步实现自动登录
  async getUserInfo({commit}) {
    //
    const result = await reqUserInfo()
    if(result.code===0) {
      const userInfo = result.data
      commit(RECEIVE_USER_INFO,{userInfo})
    }
  },
  //异步退出登录
  async logout({commit}) {
    const result = await reqLogout()
    if(result.code===0) {
      const userInfo = {}
      commit(RECEIVE_USER_INFO,{userInfo})
    }
  },
  //异步获取商家信息对象
  async getShopInfo({commit}) {
    const result = await reqShopInfo()
    if(result.code===0) {
      const info = result.data
      commit(RECEIVE_INFO,{info})
    }
  },
  //异步获取评价数组
  async getShopRatings({commit},callback) {
    const result = await reqShopRatings()
    if(result.code===0) {
      const ratings = result.data
      commit(RECEIVE_RATINGS,{ratings})
      callback&&callback()
    }
  },
  //异步获取食品数组
  async getShopGoods({commit},callback) {
    const result = await reqShopGoods()
    if(result.code===0) {
      const goods = result.data
      commit(RECEIVE_GOODS,{goods})
      callback&&callback()
    }
  },
  //同步更新food中的count
  updateFoodCount({commit},{isAdd,food}) {
    if(isAdd) {
      commit(INCREMENT_FOOD_COUNT,{food})
    } else {
      commit(DECREMENT_FOOD_COUNT,{food})
    }
  },
  //同步清空购物车
  clearCart({commit}) {
    commit(CLEAR_CART)
  },
  // 异步获取商家商品列表
  async searchShops({commit, state}, keyword) {
    const geohash = state.latitude + ',' + state.longitude
    const result = await reqSearchShop(geohash, keyword)
    if (result.code === 0) {
      const searchShops = result.data
      commit(RECEIVE_SEARCH_SHOPS, {searchShops})
    }
  },
}
