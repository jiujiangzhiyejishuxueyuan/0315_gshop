// 路由器
//引入路由和路由器
import Vue from 'vue'
import VueRouter from 'vue-router'
// import Msite from '../pages/Msite/Msite'
// import Order from '../pages/Order/Order'
// import Profile from '../pages/Profile/Profile'
// import Search from '../pages/Search/Search'

const Msite = () => import('../pages/MSite/Msite.vue')
const Search = () => import('../pages/Search/Search.vue')
const Order = () => import('../pages/Order/Order.vue')
const Profile = () => import('../pages/Profile/Profile.vue')

import Login from '../pages/Login/Login'
import ShopGoods from '../pages/Shop/ShopGoods/ShopGoods'
import ShopInfo from '../pages/Shop/ShopInfo/ShopInfo'
import ShopRatings from '../pages/Shop/ShopRatings/ShopRatings'
import Shop from '../pages/Shop/Shop'



//声明使用插件
Vue.use(VueRouter)

export default new VueRouter({
  // 所有路由
  routes: [
    {
      path: '/msite',
      component: Msite,
      meta: {
        ShowFooter: true
      }
    },
    {
      path: '/order',
      component: Order,
      meta: {
        ShowFooter: true
      }
    },
    {
      path: '/profile',
      component: Profile,
      meta: {
        ShowFooter: true
      }
    },
    {
      path: '/search',
      component: Search,
      meta: {
        ShowFooter: true
      }
    },
    {
      path: '/',
      redirect: '/Msite'
    },
    {
      path: '/Login',
      component: Login
    },
    {
      path: '/shop',
      component: Shop,
      children: [
        {
          path: 'goods',
          component: ShopGoods
        },
        {
          path: 'info',
          component: ShopInfo
        },
        {
          path: 'ratings',
          component: ShopRatings
        },
        {
          path: '',
          redirect: '/shop/goods'
        }
      ]
    }
  ]
})
