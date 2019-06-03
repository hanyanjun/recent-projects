/**
 * Created by Hardy on 2017/7/8.
 */
/**
 * Created by Hardy on 2017/7/3.
 */
//全局使用的MUTATIONS

import * as types from './types'
import means from '../means/means'

export default {
  // 医生登录信息
  [types.UPDATE_DOCLOGININFO] (state,payload){
    state.loginInfo = payload;
  },
  [types.IS_UPDATE_CONTACTS](state,payload){
    state.is_update_contacts = payload;
  },
  // loading
  [types.UPDATE_LOADING] (state,payload){
    state.isLoading = payload;
  },
  [types.SET_FOOTER_TAB](state,payload){
    let arr =[
      {
        // to : '/work', name : '工作室' , c : 'icon-footer-home1'
        to : '/work', name : '工作室' , c : 'icon-footer_home1'
      },
      {
        // to : '/message', name : '消息' , c : 'icon-footer-message1'
        to : '/message', name : '消息' , c : 'icon-footer_message1'
      },
      // {
      //   to : '/myPatients', name : '通讯录' , c : 'icon-footer-myPatients1'
      // },
      {
        // to : '/my', name : '我' , c : 'icon-footer-my1'
        to : '/my', name : '我' , c : 'icon-footer_my1'
      },
    ]
    arr[payload]['c'] = arr[payload]['c'].replace(/1/g,'');
    state.footerTab = arr;
  },
  // 医生详细信息
  [types.UPDATE_DOCSELFINFO] (state,payload){
    state.docInfo = payload;
    state.docInfoCopy = Object.assign({},payload);
  },
  //待办事项  咨询条数更新
  [types.UPDATE_UNREPLAY](state,payload){
    state.unReplay.status = payload;
  },
  // 导航
  [types.UPDATE_NAV] (state,payload){
    // console.log( '%c当前页面导航为:'+payload.router,'color:green' );
    state.nav = payload;
  },
  [types.UPDATE_MASK](state,payload){
    state.isMask = payload;
  },
  // 会员信息
  [types.UPDATE_PATSELFINFO](state,payload){
    state.patInfo = payload;
  },
  //医生信息状态是否更新
  [types.IS_UPDATE_DOCINFO](state,payload){
    state.is_update_doc = payload;
  },
  //用户信息状态是否更新
  [types.IS_UPDATE_PATINFO](state,payload){
    state.is_update_doc = payload;
  },
  [types.UPDATE_CHAT_SET](state,payload){
    state.docInfo.chat_switch = payload;
  },
  [types.UPDATE_REVIEW_SET](state,payload){
    state.docInfo.review_switch = payload;
  },
  [types.UPDATE_SCROLL](state,payload){
    state.scroll = payload;
  },
  [types.SET_ROTATE_ANI](state,payload){
    state.rotateAni = payload;
  },
  //绑卡
  [types.BANK_CARDS](state,payload){
    state.bankCards = payload;
  },
  // [types.SET_PREVIEW_IMG](state,payload){
  //   if(payload){
  //     let src = payload;
  //     let arr = JSON.parse(JSON.stringify(state.img)) , index = null , u ;
  //     arr.some((v,i)=>{
  //        if(v == src){
  //          index = i;
  //          return i;
  //        }
  //     })
  //     arr.forEach((v,i)=>{
  //       if(/^data/.test(v)){
  //          let f = means.BaseToBlob(v);
  //          let url = window.URL.createObjectURL(f);
  //          arr[i] = url;
  //       }
  //     })
  //     if(/^data/.test(src)){
  //       let f = means.BaseToBlob(src);
  //       u = window.URL.createObjectURL(f);
  //       if(index == null){
  //         index = 0;
  //         arr.unshift(u);
  //       }else{
  //         arr[index] = u;
  //       }
  //     }
  //     state.preImg = {
  //       current : u || src ,
  //       urls : arr,
  //       i : index
  //     };
  //   }
  // },
  //用户查看图片预览
  [types.SET_IMG_ARR](state,payload){
    switch (payload.way){
      case 'push':
        if(payload.msg.data){
          state.img.push(payload.msg.data.text.src);
        }else{
          state.img.push(payload.msg);
        }
        break;
      case 'unshift':
        if(payload.msg.data){
          state.img.unshift(payload.msg.data.text.src);
        }else{
          state.img.unshift(payload.msg);
        }
        break;
      case 'clear':
        state.img = [];
        break;
      case 'concat':
        state.img = (state.img).concat(payload.msg);
        break;
    }
  }





}
