import Vue from 'vue'
// import moment from 'moment'
import format from 'date-fns/format'
// 自定义过滤器
Vue.filter('dateFormat', function (value, formatStr='yyyy-MM-dd HH:mm:ss') {
  // return moment(value).format(formatStr)
  return format(value, formatStr)
})
