import axios from 'axios'
import {Toast} from "antd-mobile"
//axios 的默认配置修改
axios.defaults.timeout = 50000000000000;
let dTime = '';
// 根据环境 来进行baseURL等东西的配置
let baseURL = '';
let showLoadNum = 0;
//请求拦截
axios.interceptors.request.use(function (config) {
    Toast.loading('加载中', 1, '', true)
    showLoadNum ++;
    let time = String(Date.parse( new Date()) + dTime).substr(0,10);
    return config;
},function (error) {
   return Promise.reject(error);
})
//返回状态的拦截
axios.interceptors.response.use(function (response) {
  showLoadNum --;
  if(showLoadNum == 0){ 
      Toast.hide();
  }  
  let t = Date.parse(new Date());
  let t1 = Date.parse(new Date(response.headers.date));
  dTime = t1 - t;
  // alert(JSON.stringify(response.data));
  if(response.status == '200'){
    return response;
  }
  else{
    Toast.info(response.data.messages);
  }
  return response;
},function (error) {
  // 跨域之类的请求失
  Toast.info(error);
  return Promise.reject(error);
})
//封装get
 function gAJAX(url,params,type) {
  return new Promise((resolve,reject)=>{
    axios.get(url,params,type)
       .then(response=>{
         if(response.data.code == '200'){
          resolve(response.data)
         }else{
          response.data.messages && Toast.info(response.data.messages);
            reject(response.data);
        }
       },err=>{
          Toast.info(err);
       })
       .catch(error=>{
          Toast.info(error);
       })
  })
}
//封装post
 function pAJAX(url,params,config) {
  return new Promise((resolve,reject)=>{
    axios.post(url,params,config)
      .then(response=>{
        if(response.data.code  == '200'){
         resolve(response.data)
        }else{
          response.data.messages && Toast.info(response.data.messages);
          reject(response.data);
        }
      },err=>{
        Toast.info(err);
      })
      .catch(error=>{
        Toast.info(error);
      })
  })
}
//接口的封装
export default{
  userInfo(data){
    return gAJAX(`/user/info`,{data});
  },
  register(data){
    return pAJAX('/user/register',data);
  },
  login(data){
    return pAJAX('/user/login',data);
  },
  userInfoUpdate(data){
    return pAJAX('/user/update',data);
  },
  getMemList(data){
    return gAJAX('/user/list?type=2',data);
  },
  getBossList(data){
    return gAJAX('/user/list?type=1',data);
  }
}
