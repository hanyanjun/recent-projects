/**
 * Created by Hardy on 2017/7/8.
 */

//全局getters
export default {
  userId : state =>{
    return state.HeadInfo.userId || state.userId;
  },
  










  /*************************以下为之前的getters 后期需优化 剔除多余的部分************************************/  
  userName (state) {
    return state.HeadInfo.userName || state.userName
  },
  userId (state) {
    return state.userId
  },
  allMenu (state) {
    return state.allMenu
  },
  allMenu1 (state) {
    return state.allMenu1
  },
  allMenu2 (state) {
    return state.allMenu2
  },
  allMenu3 (state) {
    return state.allMenu3
  },
  defaultData (state) {
    return state.defaultData
  },
  isCollapse (state) {
    return state.isCollapse
  },
  allIndex (state) {
    return state.allIndex
  },
  importId (state) {
    return state.importId
  }
}
