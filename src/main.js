// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './app'
import router from './router'
import store from './store'
import 'view-design/dist/styles/iview.css'
import './mock/mockServer'
import VueLazyload from 'vue-lazyload'
import loading from './common/imgs/loading.gif'
import './filters' // 加载过滤器
import { Button,Dialog,Notify } from 'vant'
Vue.use(Button)
/* eslint-disable no-new */
Vue.use(Dialog)
Vue.use(Notify)
Vue.use(VueLazyload, {
  loading
})
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
  store
})
