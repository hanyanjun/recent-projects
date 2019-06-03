import Vue from 'vue'
import Vuex from 'vuex'
import getters from "./rootGetters"
import mutations from "./rootMutations"
import actions from "./rootActions"
import selectData from "./modules/selectData"
import partData from "./modules/partData"
import menuList from "./modules/menuList"
import company from "./modules/company"
import contract from "./modules/contract"
import exam from "./modules/exam"
import approval from "./modules/approval"

Vue.use(Vuex)

const state = {
  userName: 'yourName',
  isCollapse: false,
  stepOneIsDone: false,
  allIndex: [],
  defaultData: 0,
  stepOfNew: 0,
  importId: '',
  allMenu1: [],
  allMenu2: [],
  allMenu3: [],
  userId: '',
  auth :'' ,  //授权的token
  /*************************以上为之前的state 后期需优化 剔除多余的部分************************************/ 
  headInfo : {btn : {btn1 : ''} , name : '',headPic :'',deptName :'', position : ''},  //用户的基本信息
  isUpdateHeadInfo : true, //是否更新用户的基本信息
  userMenu : '', //用户权限树
  userMenuObj : {}, //用户权限树对象
  routeTrack : {}, //路由轨迹
  isSafe : false , //是否需要走安全机制验证
  wHeight : 0, //窗口的总高度
  wWeight : 0, //窗口的总宽度
  isExam : false, //是否处于考试中的状态
  pdfShow : false,
  userAgentType : '',
  welcomeInfo : {
    city : '',
    is_update : true,
    entryDays : '',
    lastIp : '',
    lastLoginDate : '',
    userName : ''
  }
}
export default new Vuex.Store({
  state, mutations, getters,actions,
  modules: {
    selectData,
    menuList,
    partData,
    company,
    contract,
    exam,
    approval
  }
})
