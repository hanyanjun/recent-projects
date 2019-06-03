/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
import util from '../util'
import {md5} from '../util/md5.js'
import {Message} from 'element-ui'
import Router from "../router"
import store from "../vuex/store.js"

USER_AGENT_TYPE = util.userAgentType();  let needLoadingRequestCount = 0;
const  env = process.env.NODE_ENV;
// 根据环境 来进行baseURL等东西的配置
switch(env){
  case 'development': //本地测试环境
    axios.baseURL = 'http://106.14.114.152:9005/';
    // axios.baseURL = 'http://192.168.104.59:9005/';
  break;
  case 'production':  //线上环境
    axios.baseURL = 'http://106.14.114.152:9005/';
  break;
  case 'testing':  //测试人员测试环境
    axios.baseURL = 'http://106.14.114.152:9005/';
  break;
  case 'online':  //正式线上环境
    axios.baseURL = 'https://oa.edaili.com/'
  default:
    axios.baseURL = 'http://106.14.114.152:9005/';
  break;
}
// 接口请求的其他默认值设置
axios.defaults.timeout = 60000;  //1分钟服务器无响应提示网络较差
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Cache-Control'] = 'no-cache';
axios.defaults.headers.common['Pragma'] = 'no-cache';
// 请求拦截
axios.interceptors.request.use(function (config) {
  // 验签机制
  let str = '';
  if(config.data){
    if(config.method == 'get'){
      // 获取所有key值
      if(Object.prototype.toString.call(config.data) == '[object Object]'){
        let keys = Object.keys(config.data);
        let keysSort = keys.sort();
        keysSort.forEach(v => {
          str = str + `&${v}=${config.data[v] || ''}`;
        });
        str = str.substr(1,str.length - 1);
      }
    }else{
      str = JSON.stringify(config.data);
    }
  }
  let time = String(Date.parse( new Date()) + global.BASETIME).substr(0,10);
  config.headers['sign'] = `${time}-`+   (md5(`${str};${util.b64DecodeUnicode('MTIzNDU2')}-${time}`)).toLowerCase();
  // console.log(config.url);
  // console.log(config.data);
  // console.log(`${str};123456-${time}`);
  // console.log(md5(`${str};123456-${time}`));
  // 匹配url
  if(config.url != '/admin/wechat/getWechatBinding'){
    showFullScreenLoading(); //显示loading
  }
  return config;

},function (error) {
 return Promise.reject(error);
})
// 注册toast组件
import toast from '@/componentsh5/toast';
Vue.use(toast);
//返回状态的拦截
axios.interceptors.response.use(function (response) {
  return  new Promise((resolve,reject)=>{ 
    global.NOWTIME = Date.parse(new Date(response.headers.date));
    tryHideFullScreenLoading();//关闭loading显示
    if(response.status == 200){  //代表接口请求成功
      // 根据data里面的code值做进一步的分流
      switch(response.data.code){
        case '200':
          resolve(response);
        break;
        case '401':
          store.dispatch('clearAllInfo');
          switch(USER_AGENT_TYPE){
            case 'mobile':
            window.location.href = '/indexh5.html#/h5/login';
            break;
            case 'pc':
            Router.push('/login');;
            break;
          }
          // return Promise.reject(response);
        break;
        case '406':
        // 签名失效 如果是入口请求 默认 重新发送一次请求
        let time = Date.parse(new Date(response.headers.date));
        let time1 = Date.parse(new Date());
        global.BASETIME = time - time1;
        if(response.config.url == '/admin/head/base'){
          resolve(axios(response.config));
        }else{
          if(USER_AGENT_TYPE == 'pc'){
            Message.error(response.data.messages);
          }else{
            Vue.prototype.$showToast({message : response.data.messages});
          }
          return reject(response);
        }
        break;
        case '601':
        Router.push('/verifySafe')
        store.dispatch("resetToken",response.data.data.token);
        // return Promise.reject(response);
        default:
          if(response.data.code){
            if(USER_AGENT_TYPE == 'pc'){
              Message.error(response.data.messages);
            }else{
              Vue.prototype.$showToast({message : response.data.messages});
            }
            return reject(response);
          }else{
            resolve(response);
          }
        break;
      }
    }else{
      if(USER_AGENT_TYPE == 'pc'){
        Message.error(response.data.messages);
      }else{
        Vue.prototype.$showToast({message : response.data.messages});
      }
      return reject(response);
    }
  })
},function (error) {
  console.log(error);
// TODO: 
  Vue.prototype.$showToast({message : '当前网络环境较差，请稍后再试'});
  return Promise.reject(error);
})


function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading();
    }
    needLoadingRequestCount++;
};
function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return;
    needLoadingRequestCount--;
    if (needLoadingRequestCount === 0) {
        endLoading();
    }
};
function startLoading(){
  if(USER_AGENT_TYPE == 'pc'){
    Vue.prototype.$showLoading();
  }else{

  }
}
function endLoading(){
  if(USER_AGENT_TYPE == 'pc'){
    Vue.prototype.$closeLoading();
  }else{

  }
}
export default (options) => {
  return axios({
    responseType: options.responseType === 'blob' ? 'blob' : 'json',
    // withCredentials: true,
    validateStatus: (status) => true,
    ...options
  })
}
