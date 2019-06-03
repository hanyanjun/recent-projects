import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'
import axios from 'axios'
import api from './api/core.js'
import "babel-polyfill"
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css'
import data from './commons/staticData'
// collapse 展开折叠
import util from '@/util'
// 引入样式重置文件
import './assets/css/reset.css'

// 关闭线上环境调试信息
const isDebug_mode = process.env.NODE_ENV === 'development'
Vue.config.debug = isDebug_mode
Vue.config.devtools = isDebug_mode
Vue.config.productionTip = isDebug_mode

import toast from '@/componentsh5/toast'
Vue.use(toast)

if (util.isProd()) {
  /* eslint-disable no-native-reassign */
  /* eslint-disable no-global-assign */
  console = console || {}
  console.log = function () {}
  console.debug = function () {}
  console.info = function () {}
}

// this.$api.接口名
// Vue.use(message);
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$eData = data
Vue.prototype.$api = api
Vue.prototype.$util = util


/* eslint-disable no-new */
new Vue({
  el: '#apph5',
  router,
  store,
  template: '<App/>',
  components: { App },
})
