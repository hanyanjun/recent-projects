import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

//路由参数配置
//同级路由配置  name属性相同即可
//模板消息进入配置 back属性  back可以传递参数
//一级路由配置 root属性
//返回路由带参数 params
//定义返回路由层级  count  即当前路由与之前路由之间的层级数
Router.prototype.routeBack = function (params,count) {
  let routeTrack = JSON.parse(window.sessionStorage['routeTrack']);
  let c  = count ?　count : 0;
  let length = routeTrack.children.length;
  if(length == 0 || length == 1){
      this.push({path : routeTrack.root});
  }else{
      routeTrack.children.forEach((v,i)=>{
        if(v.fullPath == this.history.current.fullPath){
          if(i-1-c < 0 ){
            this.push({path : '/work'});
            console.log('返回层级不存在，即将返回根目录！');
          }else{
            this.push({path : routeTrack.children[i-1-c].fullPath , query : params});
          }
        }
      })
  }
}

//meta字段配置
//noBack 为true 表示 topNav  back不生效
//参数 chat_hx_account 和 chat_team_id 是保留字段 只有在聊天页面才使用其他页面不可使用  因为和聊天的配置有关
const rout = new Router({
  routes: [
    {
      path : '/',
      redirect : '/work'
    },
    {
      path : '/work',
      name : 'work',
      component : resolve => require(['../pages/work/work'], resolve),
      meta: {root: true , docTitle : 'doctorWork' , clearSession : ['sendScienceing']}
    },
    {
      path : '/my',
      name : 'my',
      component : resolve => require(['../pages/my/my'], resolve),
      meta: {root: true , docTitle : 'doctorWork' , clearSession: ['sharePath']}
    },
    {
      path : '/login',
      name : 'login',
      component : resolve => require(['../pages/login/login'], resolve),
      meta: {root: true , common : true}
    },
    {
      path : '/homeMessage',
      name : 'homeMessage',
      component : resolve => require(['../pages/homeMessage/homeMessage'], resolve),
      meta: {root: true , docTitle : 'doctorWork'},
      children : [
        {
          path : '/message',
          name : 'message',
          component : resolve => require(['../pages/message/message'], resolve),
        },
        {
          path : '/teamMessage',
          name : 'teamMessage',
          component : resolve => require(['../pages/teamMessage/teamMessage'], resolve),
          meta : {clearSession : ['unReadTipCount']}
        }
      ]
    },
    // {
    //   path : '/message',
    //   name : 'message',
    //   component : resolve => require(['../pages/message/message'], resolve),
    //   meta: {root: true , docTitle : 'doctorWork'}
    // },
    {
      path : '/contacts',
      name : 'contacts',
      component : resolve => require(['../pages/contacts/contacts'], resolve),
      meta: { docTitle : 'doctorWork'}
    },
    {
      path : '/register',
      name : 'register',
      component : resolve => require(['../pages/register/register'], resolve),
      meta: {root: true,common : true}
    },
    {
      path : '/workArea',
      name : 'workArea',
      component : resolve => require(['../pages/workArea/workArea'], resolve)
    },
    {
      //传递参数id  origin
      path : '/:id/editArea/:origin',
      name : 'editArea',
      component : resolve => require(['../pages/editArea/editArea'], resolve)
    },
    {
      //传递参数 origin hospital
      path : '/appointDetailSet/:hospitalId/:hospital',
      name : 'appointDetailSet',
      component : resolve => require(['../pages/appointDetailSet/appointDetailSet'], resolve)
    },
    {
      //传递参数 origin
      path : '/orderAreaSelect',
      name : 'orderAreaSelect',
      component : resolve => require(['../pages/orderAreaSelect/orderAreaSelect'], resolve)
    },
    {
      path : '/workServiceSet',
      name : 'workServiceSet',
      component : resolve => require(['../pages/workServiceSet/workServiceSet'], resolve),
      children : [
        {
          path : 'consultSet',
          components : {
            default : resolve => require(['../pages/IT-consult/IT-consult'], resolve),
            part :resolve => require(['../pages/familyConsultPart/familyConsultPart'], resolve),
            all :resolve => require(['../pages/familyConsultAll/familyConsultAll'], resolve),
          },
          meta : {set : true}
        }
      ]
    },
    {
      path : '/IT-consult',
      name : 'IT-consult',
      component : resolve => require(['../pages/IT-consult/IT-consult'], resolve),
      meta : {limit : 1}
    },
    {
      path : '/appointmentSet',
      name : 'appointmentSet',
      component : resolve => require(['../pages/appointmentSet/appointmentSet'], resolve)
    },
    {
      path : '/myHome',
      name : 'myHome',
      component : resolve => require(['../pages/myHome/myHome'], resolve)
    },
    {
      path : '/:type/myOrder',
      name : 'myOrder',
      component : resolve => require(['../pages/myOrder/myOrder'], resolve)
    },
    {
      path : '/:type/:id/orderDetail',
      name : 'orderDetail',
      component : resolve => require(['../pages/orderDetail/orderDetail'], resolve)
    },
    {
      path : '/:type/:id/orderInfo',
      name : 'orderInfo',
      component : resolve => require(['../pages/orderInfo/orderInfo'], resolve)
    },
    {
      path : '/:type/:id/orderPlan',
      name : 'orderPlan',
      component : resolve => require(['../pages/orderPlan/orderPlan'], resolve)
    },
    {
      path : '/:chat_hx_account/userInfo',
      name : 'chat',
      component : resolve => require(['../pages/userInfo/userInfo'], resolve),
      meta : {back : '/myPatients',common : true ,   docTitle : 'patientName'}
    },
    {
      path : '/:id/inquiryDetail',
      name : 'inquiryDetail',
      component : resolve => require(['../pages/inquiryDetail/inquiryDetail'], resolve)
    },
    {
      path : '/:id/:groId/userGroup',
      name : 'userGroup',
      component : resolve => require(['../pages/userGroup/userGroup'], resolve)
    },
    {
      path : '/:id/pathography',
      name : 'pathography',
      component : resolve => require(['../pages/pathography/pathography'], resolve)
    },
    {
      path : '/:id/share',
      name : 'share',
      component : resolve => require(['../pages/share/share'], resolve)
    },
    {
      path : '/set',
      name : 'set',
      component : resolve => require(['../pages/set/set'], resolve)
    },
    {
      path : '/about',
      name : 'about',
      component : resolve => require(['../pages/about/about'], resolve)
    },
    {
      path : '/newsReportSet',
      name : 'newsReportSet',
      component : resolve => require(['../pages/newsReportSet/newsReportSet'], resolve)
    },
    {
      path : '/:id/resetIphone',
      name : 'resetIphone',
      component : resolve => require(['../pages/resetIphone/resetIphone'], resolve)
    },
    {
      path : '/setPassword',
      name : 'setPassword',
      component : resolve => require(['../pages/setPassword/setPassword'], resolve)
    },
    {
      path : '/:id/:phone/resetPassword',
      name : 'resetPassword',
      component : resolve => require(['../pages/resetPassword/resetPassword'], resolve)
    },
    {
      path : '/test',
      name : 'test',
      component : require('../pages/test/test')
    },
    {
      path : '/:type/addInfo',
      name : 'addInfo',
      component : resolve => require(['../pages/addInfo/addInfo'], resolve)
    },
    {
      path : '/:chat_hx_account/chat',
      name : 'chat',
      component : resolve => require(['../pages/chat/chat'], resolve),
      meta: {back : '/message',common : true,   docTitle : 'patientName'}
    },
    {
      path : '/:chat_hx_account/:chat_team_id/groupConsult',
      name : 'groupConsult',
      component : resolve => require(['../pages/groupConsult/groupConsult'], resolve),
      meta: {back : '/4/myItConsult', common : true,   docTitle : ''}
    },
    {
      path : '/:chat_hx_account/serviceHistory',
      name : 'chat',
      component : resolve => require(['../pages/serviceHistory/serviceHistory'], resolve),
      meta: {back : '/message',   docTitle : 'patientName'}
    },
    {
      path : '/:id/serviceHistoryDetail',
      name : 'serviceHistoryDetail',
      component : resolve => require(['../pages/serviceHistoryDetail/serviceHistoryDetail'], resolve)
    },
    {
      path : '/:id/editReply',
      name : 'editReply',
      component : resolve => require(['../pages/editReply/editReply'], resolve)
    },
    {
      path : '/patientReport',
      name : 'patientReport',
      component : resolve => require(['../pages/patientReport/patientReport'], resolve)
    },
    {
      path : '/:time/reportDetail',
      name : 'reportDetail',
      component : resolve => require(['../pages/reportDetail/reportDetail'], resolve)
    },
    {
      path : '/:id/addgroup',
      name : 'addgroup',
      component : resolve => require(['../pages/addgroup/addgroup'], resolve)
    },
    {
      path : '/:id/selectPat',
      name : 'selectPat',
      component : resolve => require(['../pages/selectPat/selectPat'], resolve)
    },
    {
      path : '/orderIntroduce',
      name : 'orderIntroduce',
      component : resolve => require(['../pages/orderIntroduce/orderIntroduce'], resolve)
    },
    {
      path : '/:id/orderDescDetails',
      name : 'orderDescDetails',
      component : resolve => require(['../pages/orderDescDetails/orderDescDetails'], resolve)
    },
    {
      path : '/hospital',
      name : 'hospital',
      component : resolve => require(['../pages/hospital/hospital'], resolve)
    },
    {
      path : '/family-consult',
      name : 'family-consult',
      component : resolve => require(['../pages/family-consult/family-consult'], resolve),
      meta : {limit : 1}
    },
    {
      path : '/freeSetting',
      name : 'freeSetting',
      component : resolve => require(['../pages/freeSetting/freeSetting'], resolve),
      meta : {limit : 1}
    },
    {
      path : '/myWallet',
      name : 'myWallet',
      component : resolve => require(['../pages/myWallet/myWallet'], resolve),
      meta: {docTitle : '我的收入',clearSession : ['walletType']}
    },
    {
      path : '/incomeDetail',
      name : 'incomeDetail',
      component : resolve => require(['../pages/incomeDetail/incomeDetail'], resolve)
    },
    {
      path : '/incomeSelect',
      name : 'incomeSelect',
      component : resolve => require(['../pages/incomeSelect/incomeSelect'], resolve)
    },
    {
      path : '/:year/:month/incomeMonth',
      name : 'incomeMonth',
      component : resolve => require(['../pages/incomeMonth/incomeMonth'], resolve)
    },

    {
      path : '/accountManage',
      name : 'accountManage',
      component : resolve => require(['../pages/accountManage/accountManage'], resolve),
      meta : {limit :  1}
    },
    {
      path : '/addBank',
      name : 'addBank',
      component : resolve => require(['../pages/addBank/addBank'], resolve)
    },
    {
      path : '/selectBank',
      name : 'selectBank',
      component : resolve => require(['../pages/selectBank/selectBank'], resolve)
    },
    {
      path : '/addBankVerify',
      name : 'addBankVerify',
      component : resolve => require(['../pages/addBankVerify/addBankVerify'], resolve)
    },
    {
      path : '/transferAccount',
      name : 'transferAccount',
      component : resolve => require(['../pages/transferAccount/transferAccount'], resolve),
      meta : {limit : 1}
    },
    {
      path : '/transfer',
      name : 'transfer',
      component : resolve => require(['../pages/transfer/transfer'], resolve)
    },
    {
      path : '/transferPlan',
      name : 'transferAccount',
      component : resolve => require(['../pages/transferPlan/transferPlan'], resolve)
    },
    {
      path : '/transferHistory',
      name : 'transferHistory',
      component : resolve => require(['../pages/transferHistory/transferHistory'], resolve)
    },
    {
      path : '/:id/transferDetail',
      name : 'transferDetail',
      component : resolve => require(['../pages/transferDetail/transferDetail'], resolve)
    },
    {
      path : '/myIndent',
      name : 'myIndent',
      component : resolve => require(['../pages/myIndent/myIndent'], resolve),
      meta : {clearSession : ['walletType']}
    },
    {
      path : '/indentFilter',
      name : 'indentFilter',
      component : resolve => require(['../pages/indentFilter/indentFilter'], resolve)
    },
    {
      path : '/:id/indentDetail',
      name : 'indentDetail',
      component : resolve => require(['../pages/indentDetail/indentDetail'], resolve),
      meta :{clearSession : ['is_first_call']}
    },
    {
      path : '/wVertify',
      name : 'wVertify',
      component : resolve => require(['../pages/wVertify/wVertify'], resolve)

    },
    {
      path : '/deleBank',
      name : 'deleBank',
      component : resolve => require(['../pages/deleBank/deleBank'], resolve),
      meta : {noRouteTrack : true }
    },
    {
      path : '/vertifyResult',
      name : 'vertifyResult',
      component : resolve => require(['../pages/vertifyResult/vertifyResult'], resolve)
    },
    {
      path : '/wQuestions',
      name : 'wQuestions',
      component : resolve => require(['../pages/wQuestions/wQuestions'], resolve)
    },
    {
      path : '/:status/myItConsult',
      name : 'myItConsult',
      component : resolve => require(['../pages/myItConsult/myItConsult'], resolve)
    },
    {
      path : '/:type/serviceIntro',
      name : 'serviceIntro',
      component : resolve => require(['../pages/serviceIntro/serviceIntro'], resolve)
    },
    {
      path : '/:chat_hx_account/:chat_team_id/teamDocChartList',
      name : 'myPatients',
      component : resolve => require(['../pages/myPatients/myPatients'], resolve),
    },
    {
      path : '/:id/inviteDoctor',
      name : 'inviteDoctor',
      component : resolve => require(['../pages/inviteDoctor/inviteDoctor'], resolve),
      meta: {docTitle : '欢迎注册智呼吸医生工作室'}
    },
    {
      path : '/moneyAccount',
      name : 'moneyAccount',
      component : resolve => require(['../pages/moneyAccount/moneyAccount'], resolve),
      meta : {limit : 1}
    },
    {
      path : '/inviteDoctor1',
      name : 'inviteDoctor1',
      component : resolve => require(['../pages/inviteDoctor1/inviteDoctor1'], resolve)
    },
    {
      path : '/:id/inviteDoctor2',
      name : 'inviteDoctor2',
      component : resolve => require(['../pages/inviteDoctor2/inviteDoctor2'], resolve)
    },
    {
      path : '/groupNews',
      name : 'groupNews',
      component : resolve => require(['../pages/groupNews/groupNews'], resolve)
    },
    {
      path : '/progress',
      name : 'progress',
      component : resolve => require(['../pages/progress/progress'], resolve)
    },
    {
      path : '/groupSendNews',
      name : 'groupSendNews',
      component : resolve => require(['../pages/groupSendNews/groupSendNews'], resolve)
    },
    {
      path : '/groupNewsHistory',
      name : 'groupNewsHistory',
      component : resolve => require(['../pages/groupNewsHistory/groupNewsHistory'], resolve),
      meta : {clearSession : ['groupNews','groupNewsGroup']}
    },
    {
      path : '/sendAppoint',
      name : 'sendAppoint',
      component : resolve => require(['../pages/sendAppoint/sendAppoint'], resolve)
    },
    {
      path : '/appointNoticeB',
      name : 'appointNoticeB',
      component : resolve => require(['../pages/appointNoticeB/appointNoticeB'], resolve)
    },
    {
      path : '/appointNoticeS',
      name : 'appointNoticeS',
      component : resolve => require(['../pages/appointNoticeS/appointNoticeS'], resolve)
    },
    {
      path : '/systemVersionTip',
      name : 'systemVersionTip',
      component : resolve => require(['../pages/systemVersionTip/systemVersionTip'], resolve)
    },
    {
      path : '/myScienceing',
      name : 'myScienceing',
      component : resolve => require(['../pages/myScienceing/myScienceing'], resolve)
    },
    {
      path : '/:id/:status/collectScienceArticle',
      name : 'collectScienceArticle',
      component : resolve => require(['../pages/collectScienceArticle/collectScienceArticle'], resolve)
    },
    {
      path : '/:type/scienceLibrary',
      name : 'scienceLibrary',
      component : resolve => require(['../pages/scienceLibrary/scienceLibrary'], resolve)
    },
    {
      path : '/manageMyScienceing',
      name : 'manageMyScienceing',
      component : resolve => require(['../pages/manageMyScienceing/manageMyScienceing'], resolve)
    },
    {
      path : '/scienceSearchResult',
      name : 'scienceSearchResult',
      component : resolve => require(['../pages/scienceSearchResult/scienceSearchResult'], resolve)
    },
    {
      path : '/addLinkScienceArticle',
        name : 'addLinkScienceArticle',
      component : resolve => require(['../pages/addLinkScienceArticle/addLinkScienceArticle'], resolve)
    },
    {
      path : '/addEmailScienceArticle',
        name : 'addEmailScienceArticle',
      component : resolve => require(['../pages/addEmailScienceArticle/addEmailScienceArticle'], resolve)
    },
    {
      path : '/transferByMonth',
      name : 'transferByMonth',
      component : resolve => require(['../pages/transferByMonth/transferByMonth'], resolve)
    },
    {
      path : '/:acc/:id/teamNotice',
      name : 'teamNotice',
      component : resolve => require(['../pages/teamNotice/teamNotice'], resolve)
    },
    {
      path : '/:id/addTeamNotice',
      name : 'addTeamNotice',
      component : resolve => require(['../pages/addTeamNotice/addTeamNotice'], resolve)
    },
    {
      path : '/:id/teamNoticeDetail',
      name : 'teamNoticeDetail',
      component : resolve => require(['../pages/teamNoticeDetail/teamNoticeDetail'], resolve)
    },
    {
      path : '/:id/teamSetPreview',
      name : 'teamSetPreview',
      component : resolve => require(['../pages/teamSetPreview/teamSetPreview'], resolve)
    },
    {
      path : '/editTeamNotice',
      name : 'editTeamNotice',
      component : resolve => require(['../pages/editTeamNotice/editTeamNotice'], resolve)
    },
    {
      path : '/:id/teamBankManage',
      name : 'teamBankManage',
      component : resolve => require(['../pages/teamBankManage/teamBankManage'], resolve)
    },
    {
      path : '/myTeam',
      name : 'myTeam',
      component : resolve => require(['../pages/myTeam/myTeam'], resolve),
      redirect : '/myTeam/createTeamList',
      children : [
        {
          path : 'createTeamList',
          name : 'createTeamList',
          component : resolve => require(['../pages/createTeamList/createTeamList'], resolve),
          meta : {clearSession : ['teamTitle','teamSkill','teamIntro']},
        },{
          path : 'joinTeamList',
          name : 'joinTeamList',
          component : resolve => require(['../pages/joinTeamList/joinTeamList'], resolve),
          meta : {clearSession : ['teamTitle','teamSkill','teamIntro']},
        },
      ]
    },
    {
      path : '/addTeam',
      name : 'addTeam',
      component : resolve => require(['../pages/addTeam/addTeam'], resolve),
      meta : {noRouteTrack : true },
    },
    {
      path : '/:id/addTeamMem',
      name : 'addTeamMem',
      component : resolve => require(['../pages/addTeamMem/addTeamMem'], resolve)
    },
    {
      path : '/:id/teamWallet',
      name : 'teamWallet',
      component : resolve => require(['../pages/teamWallet/teamWallet'], resolve)
    },
    {
      path : '/teamIncomeList',
      name : 'teamIncomeList',
      component : resolve => require(['../pages/teamIncomeList/teamIncomeList'], resolve),
      meta : {clearSession: ['teamTitle','teamSkill','teamPrice','teamIntro']}
    },
    {
      path : '/:id/teamInfoPre',
      name : 'teamInfoPre',
      component : resolve => require(['../pages/teamInfoPre/teamInfoPre'], resolve),
    },
    {
      path : '/:id/teamInfoMem',
      name : 'teamInfoMem',
      component : resolve => require(['../pages/teamInfoMem/teamInfoMem'], resolve),
    },
    {
      path : '/teamIndent',
      name : 'teamIndent',
      component : resolve => require(['../pages/teamIndent/teamIndent'], resolve),
      meta : {clearSession : ['unReadTipCount']}
    },
    // {
    //   path : '/teamMessage',
    //   name : 'teamMessage',
    //   component : resolve => require(['../pages/teamMessage/teamMessage'], resolve),
    // },
    {
      path : '/:id/teamPriceSet',
      name : 'teamPriceSet',
      component : resolve => require(['../pages/teamPriceSet/teamPriceSet'], resolve),
    },
    {
      path : '/:id/teamInviteSms',
      name : 'teamInviteSms',
      component : resolve => require(['../pages/teamInviteSms/teamInviteSms'], resolve),
    },
    {
      path : '/expertsCooperation',
      name : 'expertsCooperation',
      component : resolve => require(['../pages/expertsCooperation/expertsCooperation'], resolve)
    },
    {
      path : '/addExpertsTeam',
      name : 'addExpertsTeam',
      component : resolve => require(['../pages/addExpertsTeam/addExpertsTeam'], resolve)
    },
    {
      path : '/myExpertsTeams',
      name : 'myExpertsTeams',
      component : resolve => require(['../pages/myExpertsTeams/myExpertsTeams'], resolve),
      meta: {root: true , common : true, noBack : true}
    },
    {
      path : '/:id/expertDetails',
      name : 'expertDetails',
      component : resolve => require(['../pages/expertDetails/expertDetails'], resolve),
    },
    {
      path : '/:id/sharenoAccexpertsTeamQrcode',
      name : 'sharenoAccexpertsTeamQrcode',
      component : resolve => require(['../pages/expertsTeamQrcode/expertsTeamQrcode'], resolve),
      meta: {showJudge : '1'}
    },
    {
      path : '/:acc/:id/sharenoAccwxInviteTeamMem',
      name : 'wxInviteTeamMem',
      component : resolve => require(['../pages/wxInviteTeamMem/wxInviteTeamMem'], resolve),
      meta: {showJudge : '1'}
    },
    {
      path : '/:id/expertInviteMulChat',
      name : 'expertInviteMulChat',
      component : resolve => require(['../pages/expertInviteMulChat/expertInviteMulChat'], resolve)
    },
    {
      path : '/expertMulChatInviteGroup',
      name : 'expertMulChatInviteGroup',
      component : resolve => require(['../pages/expertMulChatInviteGroup/expertMulChatInviteGroup'], resolve)
    },
    //电话咨询
    {
      path : '/:type/callList',
      name : 'callList',
      component : resolve => require(['../pages/callList/callList'], resolve),
      meta :{clearSession : ['is_first_call']}
    },
    {
      path : '/callSet',
      name : 'callSet',
      component : resolve => require(['../pages/callSet/callSet'], resolve)
    },
    {
      path : '/:id/callPhone',
      name : 'callPhone',
      component : resolve => require(['../pages/callPhone/callPhone'], resolve)
    },
    {
      path : '/:id/callSetModify',
      name : 'callSetModify',
      component : resolve => require(['../pages/callSetModify/callSetModify'], resolve)
    },
    {
      path : '/linkFail',
      name : 'linkFail',
      component : resolve => require(['../pages/linkFail/linkFail'], resolve)
    },
    {
      path : '/:id/sharenoAcccollectMaterial',
      name : 'sharecollectMaterial',
      component : resolve => require(['../pages/collectMaterial/collectMaterial'], resolve)
    },
    {
      path : '/chooseMaterial',
      name : 'chooseMaterial',
      component : resolve => require(['../pages/chooseMaterial/chooseMaterial'], resolve),
      meta : {clearSession : ['chooseCard','reciveInfo']}
    },
    {
      path : '/chooseCard',
      name : 'chooseCard',
      component : resolve => require(['../pages/chooseCard/chooseCard'], resolve)
    },
    {
      path : '/ensureCard',
      name : 'ensureCard',
      component : resolve => require(['../pages/ensureCard/ensureCard'], resolve)
    },
    {
      path : '/addCardAddress',
      name : 'addCardAddress',
      component : resolve => require(['../pages/addCardAddress/addCardAddress'], resolve)
    },
    {
      path : '/chooseDeskCard',
      name : 'chooseDeskCard',
      component : resolve => require(['../pages/chooseDeskCard/chooseDeskCard'], resolve)
    },
    {
      path : '/chooseSuccess',
      name : 'chooseSuccess',
      component : resolve => require(['../pages/chooseSuccess/chooseSuccess'], resolve)
    },
    {
      path : '/myResearch',
      name : 'myResearch',
      component : resolve => require(['../pages/myResearch/myResearch'], resolve)
    },
    
  ]
})
rout.beforeEach((to,from,next)=>{
  if(window.sessionStorage['routeTrack']){
    global.ROUTELENGTH = JSON.parse(window.sessionStorage['routeTrack']).children.length;
  }
  if(to.meta.hasOwnProperty('root')){
    if(to.meta.root){
      window.sessionStorage['routeTrack'] =  JSON.stringify({root : to.fullPath , children :[]});
    }
  }else{
    if(!window.sessionStorage['routeTrack']){
        if(to.meta.back){
          window.sessionStorage['routeTrack'] =  JSON.stringify({root : to.meta.back, children :[]});
        }else{
          window.sessionStorage['routeTrack'] =  JSON.stringify({root : '/work', children :[]});
        }
      }
      let routeTrack = JSON.parse(window.sessionStorage['routeTrack']);
      //判断原有路由是否存在相同路由  并且记录路由
      if(!to.meta.noRouteTrack){
        let result = routeTrack.children.some((v,i)=>{
          if(v.name == to.name){
            routeTrack.children.splice(i+1,);
            routeTrack.children[i] = {name : to.name , fullPath : to.fullPath};
          }
          return v.name == to.name;
        })
        if(!result){
          routeTrack.children.push({name : to.name , fullPath : to.fullPath});
        }
      }
    window.sessionStorage['routeTrack'] = JSON.stringify(routeTrack);
  }
  next();
})
export default rout;
