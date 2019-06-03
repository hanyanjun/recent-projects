import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './rootMutations'
import getters from './rootGetters'
import actions from './rootActions'
import chat from './modules/chat'
import editGroup from './modules/editGroup'
import contacts from './modules/contacts'
import components from './modules/components'
import myTeam from './modules/myTeam'
import groupConsult from './modules/groupConsult'

//全局的state
const state = {
  loginInfo : '',
  isLoading : true,
  docInfo : '',
  docInfoCopy : '',
  patInfo : '',
  bankCards:'',
  is_update_doc : true,
  is_update_contacts: true,
  rotateAni : false,
  contacts : '',
  footerTab : '',
  isMask : false,
  isIOS : false,
  sShow:false,  //分享二维码弹窗显示隐藏
  walletType :'', //收入相关的 钱包的类型（个人，团队）
  shareMask : {  //分享二维码弹窗
    show : false,
    type : '1'
  },
  expertTeams:{
    myMeeting:[],
    joinMeeting:[]
  },
  //待回复消息的条数
  unReplay : {
    status : true,
    arr : [],
    num : {

    }
  },
  chatService : [false,false,false], //图文咨询设置是否保存成功
  nav : {
    text : '',
    router : '',
    // 是否显示尾部导航
    fShow : true,
    // 是否显示头部导航
    hShow : false,
  },
  img : []
  // preImg : {current : '' , urls : [] , i : null}
}
Vue.use(Vuex);
export  default new  Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    modules : {
      chat,
      editGroup,
      contacts,
      components,
      myTeam,
      groupConsult
    }
})
