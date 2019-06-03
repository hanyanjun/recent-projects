import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import './assets/css/reset.css'
import store from './vuex/store'
import api from './fetch/api'
import hwButton from './btns/hwButton'
import * as data from './data/data'
import means from './means/means'
import {Toast} from './components/hw-components'
var VueTouch = require('vue-touch')
Vue.use(VueTouch, {name: 'v-touch'})



Vue.config.productionTip = false
/* eslint-disable no-new */
Vue.prototype.$api = api;
Vue.prototype.$hwdata = data;
Vue.prototype.$means = means;
Vue.prototype.$http = axios;
// Vue.prototype.$echart = echart;
// console.log(echart);
//一列的picker
Vue.prototype.$picker1 = new mui.PopPicker({
  layer : 1
});
//两列的picker
Vue.prototype.$picker2 = new mui.PopPicker({
  layer : 2
});
//三列的picker
Vue.prototype.$pickerl3 = new mui.PopPicker({
  layer : 3
});
Vue.prototype.$picker3 = new mui.DtPicker({
  "type" : "date",
  beginYear:(new Date().getFullYear()-100),//设置开始日期
  endDate: new Date(new Date().getFullYear() + 100,new Date().getMonth(),new Date().getDate())//设置结束日期
})
Vue.prototype.$picker4 = new mui.DtPicker({
  "type" : "month",
  beginYear:(new Date().getFullYear()-100),//设置开始日期
  endDate: new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())//设置结束日期
})
//图片延迟加载指令
Vue.directive('img',{
  inserted : function (el,binding) {
     if(binding.value){
       if(el.tagName == 'IMG'){
         el.src = LOADINGIMG;
       }else{
         el.style.backgroundImage = `url(${LOADINGIMG})`;
       }
       let img = new Image();
       img.src = binding.value;
       img.onload = function () {
         if(el.tagName == 'IMG'){
           el.src = `${binding.value}`;
         }else{
           el.style.backgroundImage = `url(${binding.value})`;
         }
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
        let img = new Image();
        img.src = binding.value;
        img.onload = function () {
          if(el.tagName == 'IMG'){
            el.src = `${binding.value}`;
          }else{
            el.style.backgroundImage = `url(${binding.value})`;
          }
        }
      }
  }
})



//图片延迟加载指令1 不更新
Vue.directive('img1',{
  inserted : function (el,binding) {
    if(binding.value){
      if(el.tagName == 'IMG'){
        el.src = LOADINGIMG;
      }else{
        // el.style.backgroundImage = `url(${LOADINGIMG})`;
        el.style.background = `url(${LOADINGIMG})`;
      }
      let img = new Image();
      img.src = binding.value;
      img.onload = function () {
        if(el.tagName == 'IMG'){
          el.src = `${binding.value}`;
        }else{
          el.style.backgroundImage = `url(${binding.value})`;
        }
      }
    }
  }
})

//textarea input foucus事件
Vue.directive('focus',{
  inserted : function (el,binding) {
    el.addEventListener('focus',(e)=>{
      binding.value();
    },false)
  }
})
Vue.directive('blur',{
  inserted : function (el,binding) {
    el.addEventListener('blur',()=>{
      binding.value();
    },false)
  }
})
Vue.directive('todo',{
  inserted : function (el,binding) {
    el.addEventListener('click',()=>{
       Toast('该功能即将开通!');
    },false);
  }
})

Vue.directive('keyboard',{
  inserted : function (el,binding) {
    el.addEventListener("focus",function(){
      // document.activeElement.blur();//屏蔽默认键盘弹出；
      binding.value();
    },false);
  }
})

Vue.component('hw-button',hwButton);
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
