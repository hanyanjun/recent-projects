/**
 *
 */
import api from "../api/core.js"
import axios from 'axios'
import util from '../util'
import ElementUI from 'element-ui'
import Router from "../router"
// 全局的action
export default {
  getBaseInfo ({state,dispatch},payload) {
    return new Promise ( resolve => {
      if(!state.isUpdateHeadInfo){resolve() ; return ""};
        api.headBase().then(obj=>{
          let d = obj.data.data;
          if(!d.btn){
            d.btn = {btn1 : '',btn2 : ''};
          }
          state.headInfo = Object.assign({},d);
          dispatch('imgUrlToBlobHeader',state.headInfo.headPic).then(obj=>{
          //   state.headInfo.headPic = '';
            state.headInfo.headPic = obj;
            resolve();
          })
        })
    })
  },
  getWelcomeInfo({state,dispatch},payload){
    return new Promise(resolce=>{
      if(state.welcomeInfo.is_update){
        api.getWelcomeInfo().then(obj=>{
           state.welcomeInfo = {...obj.data.data, is_update :false};
        })
      }
    })
  },
  uploadFile({state},payload){
    return new Promise((resolve,reject)=>{
      axios.post( `/admin/file/upload/file/${payload.type}/${state.headInfo.userId}/${payload.showName || 'N'}`, payload.formData ,
        {//后台请求地址
          headers:{'Content-Type':'multipart/form-data'},
        }).then((res)=>{
            resolve(res);
          }).catch(obj=>{
            reject();
          })
    })
  },
  uploadImg({state},payload){
    return new Promise((resolve,reject)=>{
      axios.post( `/admin/file/upload/pic/${payload.type}/${state.headInfo.userId}/${payload.width}/${payload.height}`, payload.formData ,
        {//后台请求地址
          headers:{'Content-Type':'multipart/form-data'},
        }).then((res)=>{
            resolve(res);
          }).catch(obj=>{
            reject();
          })
    })
  },
  downFile ({state},payload){
    return new Promise(resolve => {
      if(payload.type == 'post'){
        axios.post( payload.url, payload.data
          // {//后台请求地址
            // responseType:'blob',
            // data : payload.data
          // }
          ).then((response)=>{
                down(resolve,response);
            }).catch(obj=>{  
              ElementUI.Message.error('下载出错!');
            })
      }else{
        axios.get( payload.url,
          {//后台请求地址
            responseType:'blob',
            params : payload.data || '',
            data : payload.data
          }).then((response)=>{
                down(resolve,response);
            }).catch(obj=>{
              ElementUI.Message.error('下载出错!');
            })
      }
       function down(resolve,response){
        const blob = new Blob([response.data])
        const fileName  = payload.fileName ;
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
          resolve();
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName);
          resolve();
        }
       }   
    })
  },
  gainFileBlob({state},payload){
    return new Promise(resolve => {
      axios.get( payload.url,
        {//后台请求地址
          responseType:'blob',
          params : payload.data || '',
          data : payload.sign
        }).then((res)=>{
            // const blob = new Blob([res.data])
            resolve(res.data);
          })
    })
  },
  // 登录账号登录重新设置token
  resetToken({state},payload){
    state.isUpdateHeadInfo = true;
    // token 存在存储token
    if(payload.token){
      state.auth = payload.token ;
      // window.localStorage['userId'] = payload.id;
      // window.sessionStorage['userId'] = payload.id;
      axios.defaults.headers.common['auth'] =  payload.token;
      util.setCookie('auth', payload.token, 7);
    }
    // if(payload.id && payload.token){
      // util.setCookie(payload.id + '_auth', payload.token, 7);
    // }
  },  
  // 退出登陆初始化所有信息
  clearAllInfo({state},payload){
    window.localStorage.clear();
    window.sessionStorage.clear();
    state.auth = '';
    state.headInfo = Object.assign({},{btn : {btn1 : ''} , name : '',headPic :''});
  },
  imgUrlToBlob ({state},payload){
      return new Promise(resolve =>{
          if(!payload){resolve();  return ''};
          axios.get('/admin/file/download/file',{params: {filePath:payload},responseType: 'blob' , data : {'filePath' : payload}}).then(function (response) {
            // 头部头像的初始化加载
            var blob = new Blob([response.data])
            let src  = window.URL.createObjectURL(blob)
            resolve(src)
          }).catch(_=>{
            resolve('');
          })
      })
  },
  imgUrlToBlobHeader ({state},payload){
    return new Promise(resolve =>{
        if(!payload){resolve();  return ''};
        axios.get('/admin/file/download/myself/portrait',{params: {filePath:payload},responseType: 'blob' , data : {'filePath' : payload}}).then(function (response) {
          // 头部头像的初始化加载
          var blob = new Blob([response.data]);
          let src  = window.URL.createObjectURL(blob);
          resolve(src);
        }).catch(_=>{
          resolve('');
        })
    })
},
  // 获取权限树
  getBaseMenu({state}){
    return new Promise(resolve=>{
      if(!state.isUpdateHeadInfo){resolve() ; return ""};
      api.userMenu().then(obj=>{
        state.userMenu =  obj.data.data;
        detailMenu(state.userMenu);
        function detailMenu(data,parent){
          data.forEach(v => {
             if(v.children && v.children.length != 0){
               detailMenu(v.children,data);
             }else{
                state.userMenuObj[v.link || 'null'] = v.name;
                state.userMenuObj[v.id || 'null'] = v;
             }
          })
        }
        state.isUpdateHeadInfo = false;
        resolve();
      }).catch(_=>{
        resolve();
      })
    })
  },
  
  // 进入应用首先要初始化的一些数据
  init({dispatch,state},payload){
    // 初始化时  有token设置token  无token跳转至登录页面
    return new Promise((resolve)=>{
      // let token = util.getCookie(window.sessionStorage['userId'] + '_auth') || util.getCookie(window.localStorage['userId'] + '_auth');
      if(payload.token){
        dispatch('resetToken',{token : payload.token})
      }
      let token = util.getCookie('auth') || util.getCookie('auth');
      if(token){
        axios.defaults.headers.common['auth'] = token;
        state.auth = token;
        setTimeout(()=>{
          dispatch('getBaseInfo').then(_=>{
            dispatch('getBaseMenu').then(_=>{
              dispatch('getDicForAll').then(_=>{
                resolve();
              })
            })
          })
        },300)
      }else{
        switch(USER_AGENT_TYPE){
          case 'mobile':
          window.location.href = '/indexh5.html#/h5/login';
          break;
          case 'pc':
          Router.push('/login');
          break;
        }
      }
    })
  }
}
