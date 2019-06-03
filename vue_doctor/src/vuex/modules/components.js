/**
 * Created by HIWEIN008 on 2017/8/16.
 */


//组件的公共状态

import api from '../../fetch/api'
import *  as types  from '../types'
const components = {
  state : {
      prompt : {
        show : false,
        value : ''
      },
      input : {
        show : false,
        keyShow : true
      },
      actionSheet : {
        show : false
      },
      sheetSelect :{
        show : false,
        head : [],
        select : [{
          text : '微信发送邀请',
          icon : 'icon-weixin-icon',
          suf : 'icon-return-right',
          method : function () {

          }
        }],
        btn : [
          {
            text : '取消',
            style : [{marginTop : '0.2rem'}]
          }
        ]

      }

  },
  mutations : {
    [types.SET_PROMPT](state,payload){
       state.prompt  = payload;
    },
    [types.INIT_PROMPT](state,payload){
      state.prompt = {show : false,tip : ''};
    },
    [types.SET_SHEET_SELECT](state,payload){
      state.sheetSelect  =  payload ;
    },
    [types.SET_INPUT](state,payload){
      state.input  =  payload;
    },
    [types.INIT_INPUT](state,payload){
      //将上一个input状态还原
      state.input.show = false;
      state.input = '';
    },
    [types.SET_ACTION_SHEET](state,payload){
      state.actionSheet = payload;
    },
    [types.INIT_ACTION_SHEET](state){
      state.actionSheet = {show : false};
    }
  }
}
export default components;

