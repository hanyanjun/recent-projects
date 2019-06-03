import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import store from './vuex/store'
import axios from 'axios'
import api from './api/core.js'
import "babel-polyfill"
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css'
import 'element-ui/lib/theme-chalk/base.css'
import './assets/css/el-variables.scss'
import data from './commons/staticData'
import VueCropper from 'vue-cropper' 
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import util from '@/util'
// 引入样式重置文件
import './assets/css/reset.css'


// 关闭线上环境调试信息
const isDebug_mode = process.env.NODE_ENV === 'development'
Vue.config.debug = isDebug_mode
Vue.config.devtools = isDebug_mode
Vue.config.productionTip = isDebug_mode


import pdf from '@/components/pdf'
import loading from '@/components/loading'
Vue.use(pdf)
Vue.use(loading)
Vue.use(VueCropper)

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
Vue.use(ElementUI)
Vue.component(CollapseTransition.name, CollapseTransition)

// loading 图片
global.LOADINGIMG = 'data:image/png;base64,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';



Vue.directive('todo',{
  inserted : function (el,binding) {
    el.addEventListener('click',()=>{
      ElementUI.Message.error('该功能完善中!');
    },false);
  }
})

// 图片延迟加载指令
Vue.directive('img',{
  inserted : function (el,binding) {
     if(binding.value){
       if(el.tagName == 'IMG'){
         el.src = LOADINGIMG;
       }else{
         el.style.backgroundImage = `url(${LOADINGIMG})`;
       }
       store.dispatch("imgUrlToBlob",binding.value).then(obj=>{
         el.src = obj;
       })
     }else{
      if(el.tagName == 'IMG'){
        el.src = LOADINGIMG;
      }else{
        el.style.backgroundImage = `url(${LOADINGIMG})`;
      }
     }
  },
  update : function (el,binding) {
      if(binding.value){
        if(el.tagName == 'IMG'){
          el.src = LOADINGIMG;
        }else{
          el.style.backgroundImage = `url(${LOADINGIMG})`;
        }
        store.dispatch("imgUrlToBlob",binding.value).then(obj=>{
          el.src = obj;
        })
      }else{
       if(el.tagName == 'IMG'){
         el.src = LOADINGIMG;
       }else{
         el.style.backgroundImage = `url(${LOADINGIMG})`;
       }
      }
  }
})

// 图片延迟加载指令
Vue.directive('img1',{
  inserted : function (el,binding) {
     if(binding.value){
       if(el.tagName == 'IMG'){
         el.src = LOADINGIMG;
       }else{
         el.style.backgroundImage = `url(${LOADINGIMG})`;
       }
       store.dispatch("imgUrlToBlob",binding.value).then(obj=>{
         el.src = obj;
       })
     }else{
      if(el.tagName == 'IMG'){
        el.src = LOADINGIMG;
      }else{
        el.style.backgroundImage = `url(${LOADINGIMG})`;
      }
     }
  },
})

// 图片延迟加载指令
Vue.directive('imgNoBg',{
  inserted : function (el,binding) {
     if(binding.value){
       store.dispatch("imgUrlToBlob",binding.value).then(obj=>{
        el.src = obj;
       }).catch(_=>{
          if(el.tagName == 'IMG'){
            el.src = LOADINGIMG;
          }else{
            el.style.backgroundImage = `url(${LOADINGIMG})`;
          }
       })
     }else{
      if(el.tagName == 'IMG'){
        el.src = LOADINGIMG;
      }else{
        el.style.backgroundImage = `url(${LOADINGIMG})`;
      }
     }
  },
  update : function (el,binding) {
      if(binding.value){
        store.dispatch("imgUrlToBlob",binding.value).then(obj=>{
          el.src = obj;
        }).catch(_=>{
          if(el.tagName == 'IMG'){
            el.src = LOADINGIMG;
          }else{
            el.style.backgroundImage = `url(${LOADINGIMG})`;
          }
       })
      }else{
       if(el.tagName == 'IMG'){
         el.src = LOADINGIMG;
       }else{
         el.style.backgroundImage = `url(${LOADINGIMG})`;
       }
      }
  }
})
Vue.directive('header',{
  inserted : function (el,binding) {
     if(binding.value){
       if(el.tagName == 'IMG'){
         el.src = LOADINGIMG;
       }else{
         el.style.backgroundImage = `url(${LOADINGIMG})`;
       }
       store.dispatch("imgUrlToBlobHeader",binding.value).then(obj=>{
         el.src = obj;
        //  alert(`inserted-img-src:${obj}`);
       })
     }else{
      if(el.tagName == 'IMG'){
        el.src = LOADINGIMG;
      }else{
        el.style.backgroundImage = `url(${LOADINGIMG})`;
      }
     }
  },
  update : function (el,binding) {
      if(binding.value){
        if(el.tagName == 'IMG'){
          el.src = LOADINGIMG;
        }else{
          el.style.backgroundImage = `url(${LOADINGIMG})`;
        }
        store.dispatch("imgUrlToBlobHeader",binding.value).then(obj=>{
          el.src = obj;
          // alert(`update-img-src:${obj}`);
        })
      }else{
       if(el.tagName == 'IMG'){
         el.src = LOADINGIMG;
       }else{
         el.style.backgroundImage = `url(${LOADINGIMG})`;
       }
      }
  }
})

// function formatComponentName (vm) {
//   if (vm.$root === vm) return 'root'
//   var name = vm._isVue ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag) : vm.name
//   return (name ? 'component <' + name + '>' : 'anonymous component') + (vm._isVue && vm.$options && vm.$options.__file ? ' at ' + (vm.$options && vm.$options.__file) : '')
// }
// Vue.config.errorHandler = function (err, vm, info) {
//   var componentName = formatComponentName(vm)
//   var propsData = vm.$options && vm.$options.propsData
//   fundebug.notifyError(err, {
//     metaData: {
//       componentName: componentName,
//       propsData: propsData,
//       info: info
//     }
//   })
// }
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
})
