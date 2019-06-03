/**
 * 
 */
//全局使用的MUTATIONS

import * as types from './types'
import core from "../api/core.js"

export default {
  // 用户基本信息
  [types.UPDATE_HEAD_INFO] (state,payload){
    state.headInfo = payload;
  },
  [types.IS_UPDATE_HEAD_INFO] (state,payload){
    state.isUpdateHeadInfo = payload;
  },





  /*************************以下为之前的mumations 后期需优化 剔除多余的部分************************************/  
  userIdGet (state, value) {
    state.userId = value
  },
  userNameGet (state, value) {
    state.userName = value
  },
  stepOfNewSet (state, value) {
    state.stepOfNew = value
  },
  defaultDataGet (state, value) {
    state.defaultData = value
  },
  allIndexGet (state, value) {
    state.allIndex = value
  },
  importIdNull (state) {
    state.importId = 'kong'
  },
  importIdGet (state, value) {
    if (value === '/allData') {
      state.importId = ['全部报表']
    } else if (value === '/menuManage') {
      state.importId = ['菜单管理']
    } else if (value === '/reportMan') {
      state.importId = ['指标管理']
    } else if (value === '/reportManageNew') {
      state.importId = ['报表管理']
    } else {
      core.parentMenu({
        'id': JSON.parse(value).id
      }).then((res) => {
        console.log('vuex.status:', res)
        state.importId = res.data
      }).catch(util.errorHandle)
    }
  },
  allMenuGet (state) {
    core.menuReportAll({
    }).then((res) => {
      state.allMenu1 = res.data[0]
      state.allMenu2 = res.data[1]
      state.allMenu3 = res.data[2]
    }).catch(util.errorHandle())
  },
  menuToggle (state) {
    if (state.isCollapse) {
      state.isCollapse = false
    } else {
      state.isCollapse = true
    }
  }
}
