import Vue from 'vue'
import Router from 'vue-router'
import store from "../vuex/store"
import util from '../util'
const login  = ()=> import('@/views/loginPage/login')
const homePage = ()=> import('@/views/homePage')
const employeeList = ()=> import('@/views/employeeList/employeeList')
const entryNumPage = ()=> import('@/views/employeeList/entryNumPage')
const leavingNumPage = ()=> import('@/views/employeeList/leavingNumPage')
const contractNumPage = ()=> import('@/views/employeeList/contractNumPage')
const brithNumPage = ()=> import('@/views/employeeList/brithNumPage')
const transferNumPage = ()=> import('@/views/employeeList/transferNumPage')
const personalCenter = ()=> import('@/views/personalCenter/personalCenter')
const menuList = ()=> import('@/views/systemSetup/menuList')
const roleList = ()=> import('@/views/systemSetup/roleList')
const seeRoleList = ()=> import('@/views/systemSetup/seeRoleList')
const editRoleList = ()=> import('@/views/systemSetup/editRoleList')
const logManage = ()=> import('@/views/systemSetup/logManage')
const powerList = ()=> import('@/views/systemSetup/powerList')
const leaveEmployeeList = ()=> import('@/views/employeeList/leaveEmployeeList')
const editInfo = ()=> import('@/views/employeeList/editInfo')
const electronicSign = ()=> import('@/views/applyManage/electronicSign')
const dictionaryData = ()=> import('@/views/systemSetup/dictionaryData')

const company = ()=> import('@/views/company/index.vue')
const companyList = ()=> import('@/views/company/companyList.vue')
const companyInfo = ()=> import('@/views/company/companyInfo.vue')
const contract = ()=> import('@/views/contract/index.vue')
const contractList = ()=> import('@/views/contract/contractList.vue')
const contractAdList = ()=> import('@/views/contract/adList.vue')
const contractbusList = ()=> import('@/views/contract/busList.vue')
const contractAdInfo = ()=> import('@/views/contract/contractAdInfo.vue')
const contractBusInfo = ()=> import('@/views/contract/contractBusInfo.vue')
// 考题管理
const questionManage = () => import('@/views/questionBank/questionManage.vue')
const addEdit = () => import('@/views/questionBank/addEditQuest.vue')
// 在线考试
const already = () => import('@/views/onlineTest/alreadyTest.vue')
const noTest = () => import('@/views/onlineTest/noTest.vue')
const examAnalysis = () => import('@/views/exam/examAnalysis.vue')
// import util from '../util'
// 修改1
// 组织架构管理-orgManagement
import orgManagement from '@/views/orgManagement/orgManagement'
Vue.use(Router)
Router.prototype.routeBack = function (params,count) {
  let routeTrack = JSON.parse(window.sessionStorage['routeTrack']);
  let c  = count ?　count : 0;
  let length = routeTrack.children.length;
  if(length == 0 || length == 1){
      this.push({path : routeTrack.root});
  }else{
    let fullPath = routeTrack.children[length-1-c].fullPath;
    if(!fullPath){
      this.push({path : routeTrack.root});
    }else{
      this.push({path : routeTrack.children[length-1-c].fullPath , query : params});
    }
  }
}
// meta字段定义说明 
//  init 代表是否要进行信息初始化的页面  信息初始化 对应rootactions 为 init
// root  代表一级路由 当为true时  会重新进行路有轨迹记录
// isHome 代表 登录成功之后默认渲染的页面
// clearSession  用于在进入某个路由之前 清除掉session中的数据

const route = new Router({
  routes: [
    // 未匹配到的路由重定向到404页面
    // {
    //   path: "/home/*",
    //   redirect: '/home/errorPage/404'
    // },
    // 根路由默认到 个人信息页
    {
      path: "/",
      redirect: '/home',
    },
    {
      path: '/test',
      name: 'test',
      component:  resolve => require(['../views/test'], resolve),
      meta : {init :false , root : true}
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta :{init : false , root : true , clearSession : ['verifyPhone','verifyPhoneCode','verifyEmail']}
    }, 
    {
      path: '/activating',
      name: 'activating',
      component:  resolve => require(['../views/loginPage/activating'], resolve),
      meta :{init : false , root : true}
    }, 
    {
      path: '/invalid',
      name: 'invalid',
      component:  resolve => require(['../views/loginPage/invalid'], resolve),
      meta :{init : false , root : true}
    }, 
    {
      path: '/verifySafe',
      name: 'verifySafe',
      component:  resolve => require(['../views/verifySafe/verifySafe'], resolve),
      meta :{init : false , root : true}
    }, 
    {
      path: '/home',
      name: 'home',
      component: resolve => require(['../views/homePage/index.vue'], resolve),
      meta :{ root : true ,clearSession : ['verifyPhone','verifyPhoneCode','verifyEmail'] },
      redirect : '/home/bench',
      children: [
        {
          path: 'errorPage/:status',
          name: 'errorPage',
          component:  resolve => require(['../views/errorPage/errorPage'], resolve),
        },
        {
          path: 'employeeList',
          name: 'employeeList',
          component: employeeList,
          meta: { root: true },
          // children: [
          //   {path: '/', component: employeeList},
          //   {path: 'employeeList/entryNumPage', component: entryNumPage}
          // ]
        }, {
          path: 'personalCenter',
          name: 'personalCenter',
          component: resolve => require(['../views/personalCenter/personalCenter'], resolve),
          meta :{ root : true , isHome : true },
        },{       
          path: 'personalCenter/:token',
          name: 'personalCenterToken',
          component: resolve => require(['../views/personalCenter/personalCenter'], resolve),
          meta :{ root : true , isHome : true },
        },{
          path: 'systemSetup/menuList',
          name: 'menuList',
          component: menuList,
          meta :{ root : true },
        }, {
          path: 'systemSetup/roleList',
          name: 'roleList',
          component: roleList,
          meta :{ root : true },
        }, {
          path: 'systemSetup/seeRoleList',
          name: 'seeRoleList',
          component: seeRoleList,
          meta :{ root : true },
        }, {
          path: 'systemSetup/powerList',
          name: 'powerList',
          component: powerList,
          meta :{ root : true },
        }, {
          path: 'orgManagement',
          name: 'orgManagement',
          component: orgManagement,
          meta :{ root : true },
        }, {
          path: 'leaveEmployeeList',
          name: 'leaveEmployeeList',
          component: leaveEmployeeList,
          meta :{ root : true },
        },
        // 年假调休统计列表
        {
          path: 'employee/annualRestList',
          name: 'annualRestList',
          component: resolve => require(['../views/employeeList/annualRestList.vue'], resolve),
          meta: { root: true },
        },
        // 打卡记录
        {
          path: 'employee/clockInList',
          name: 'clockInList',
          component: resolve => require(['../views/employeeList/clockInList.vue'], resolve),
          meta: { root: true },
        },
        // 考勤校对日志
        {
          path: 'employee/timeLogList',
          name: 'timeLogList',
          component: resolve => require(['../views/employeeList/timeLogList.vue'], resolve),
          meta: { root: true }
        },
        // 编辑员工信息
        {
          path: 'employeeList/editInfo',
          name: 'editInfo',
          component: editInfo
        },
        {
          path: 'employeeList/entryNumPage',
          name: 'entryNumPage',
          component: entryNumPage
        },
        {
          path: 'employeeList/leavingNumPage',
          name: 'leavingNumPage',
          component: leavingNumPage
        },
        {
          path: 'employeeList/contractNumPage',
          name: 'contractNumPage',
          component: contractNumPage
        },
        {
          path: 'employeeList/brithNumPage',
          name: 'brithNumPage',
          component: brithNumPage
        },
        {
          path: 'employeeList/transferNumPage',
          name: 'transferNumPage',
          component: transferNumPage
        },
        // 编辑角色列表
        {
          path: 'systemSetup/roleList/editRoleList',
          name: 'editRoleList',
          component: editRoleList
        },
        // 日志记录
        {
          path: 'systemSetup/logManage',
          name: 'logManage',
          meta :{ root : true },
          component: logManage
        },
        // 电子签名
        {
          path: 'approveManage/ele',
          name: 'electronicSign',
          meta :{ root : true },
          component: electronicSign
          // meta: { root: true }
        },
        // 字典数据
        {
          path: 'dictionary/data',
          name: 'dictionaryData',
          meta :{ root : true },
          component: dictionaryData
        },
        // 公司管理模块
        {
          path: 'company',
          name: 'company',
          redirect : '/home/company/list',
          component:  company,
          meta :{ root : true },
          children : [{
              path: 'list',
              name: 'companyList',
              component: companyList,
              meta :{ root : true },
            },{
              path: 'info',
              name: 'companyInfo',
              component:  companyInfo
            },
          ]
        },
        // 合同管理模块
        {
          path: 'contract',
          name: 'contract',
          redirect : '/home/contract/list/ad',
          component:  contract,
          meta :{ root : true },
          children : [{
              path: 'list',
              name: 'contractList',
              component: contractList,
              meta :{ root : true },
              children : [
                {
                  path :'ad',
                  name : 'contractAdList',
                 component:  contractAdList,
                 meta :{ root : true },
                },{
                  path :'bus',
                  name : 'contractbusList',
                 component:  contractbusList,
                 meta :{ root : true },
                },
              ]
            },{
              path: 'adinfo',
              name: 'contractAdInfo',
              component:  contractAdInfo
            },{
              path: 'busInfo',
              name: 'contractBusInfo',
              component:  contractBusInfo
            },
          ]
        },
        {
          path : 'contacts',
          name : 'contacts',
          redirect : '/home/contacts/list',
          component:  resolve => require(['../views/contacts/index.vue'], resolve),
          children : [
            {
              path : 'list',
              name : 'contactsList',
              component:   resolve => require(['../views/contacts/list.vue'], resolve),
              meta :{ root : true },
            },
            {
              path : 'info',
              name : 'contactsInfo',
              component:  resolve => require(['../views/contacts/info.vue'], resolve),
            }
          ]
        },
        {
          path : 'sysparams',
          name : 'sysparamsList',
          meta :{ root : true },
          component:  resolve => require(['../views/sysparams/sysparams.vue'], resolve),
        },
        {
          path : 'timedTask',
          name : 'timedTaskList',
          meta :{ root : true },
          component:  resolve => require(['../views/timedTask/timedTask.vue'], resolve),
        },
        {
          path: 'initExam',
          name: 'initExam',
          component:  resolve => require(['../views/exam/initExam.vue'], resolve)
        },  
        {
          path: 'examList',
          name: 'examList',
          component:  resolve => require(['../views/exam/examList.vue'], resolve),
          meta : {clearSession : ['examEditInfoId','examCopy'] ,root : true  }
        },  
        // 成绩查询
        { path: 'examResults',
          name: 'examResults',
          component: resolve => require(['../views/exam/examResults.vue'], resolve),
          meta: { root: true },
        },
        // 考题管理
        { path: 'question/subject',
          name: 'questionManage',
          meta: { root: true },
          component: questionManage
          // children : [
          //   {path: '/', component: questionManage},
          //   {path: 'addEdit', name: 'addEdit', component: addEdit
          //   }
          // ]
        },
        // 编辑考题管理
        { path: 'question/addEdit',
          name: 'addEdit',
          meta: { root: true },
          component: addEdit
        },
        // 已考试
        { path: 'onlineTest/already',
          name: 'already',
          meta: { root: true ,pathName : '在线考试'},
          component: already
        },
        // 未考试
        { path: 'onlineTest/no',
          name: 'noTest',
          meta: { root: true },
          component: noTest
        },
        // 考试分析
        { path: 'exam/examAnalysis',
          name: 'examAnalysis',
          component: examAnalysis
        },
        // 工作流
        { path: 'work',
          name: 'workModel',
          component: resolve => require(['../views/workModel/model.vue'], resolve),
        },
        // 审批-待处理的审批列表
        { path: 'apply/waitForList',
          name: 'waitForList',
          component: resolve => require(['../views/applyManage/waitForList.vue'], resolve),
          meta : { root : true}
        },
        // 审批-已处理的审批列表
        { path: 'apply/alreadyList',
          name: 'alreadyList',
          component: resolve => require(['../views/applyManage/alreadyList.vue'], resolve),
          meta : { root : true}
        },
        // 审批-我发起的审批列表
        { path: 'apply/myselfList',
          name: 'myselfList',
          component: resolve => require(['../views/applyManage/myselfList.vue'], resolve),
          meta : { root : true}
        },
        // 审批-抄送我的审批列表
        { path: 'apply/copymeList',
          name: 'copymeList',
          component: resolve => require(['../views/applyManage/copymelist.vue'], resolve),
          meta : { root : true}
        },
        // 审批-流程监控列表
        { path: 'apply/progressList',
          name: 'progressList',
          component: resolve => require(['../views/applyManage/progressList.vue'], resolve),
          meta : { root : true}
        },
        // 工作台
        { path: 'bench',
          name: 'bench',
          component: resolve => require(['../views/bench/bench.vue'], resolve),
          meta : { root : true}
        },
        // 工作台
        { path: 'bench/:token',
          name: 'benchToken',
          component: resolve => require(['../views/bench/bench.vue'], resolve),
          meta : { root : true}
        },
        // 审批设置
        { path: 'approval/setting',
          name: 'approvalSet',
          component: resolve => require(['../views/approval/setting.vue'], resolve),
          meta : { clearSession : ['approvalProcess'] , root : true}
        },
        // 审批流程
        { path: 'approval/process',
          name: 'approvalProcess',
          component: resolve => require(['../views/approval/process.vue'], resolve),
        },
        // 发起审批列表
        { path: 'approval/list',
          name: 'approvallist',
          component: resolve => require(['../views/approval/list.vue'], resolve),
          meta : { clearSession : ['approvalProcess', 'apply'] , root : true}
        },
        // 请假申请
        { path: 'approval/leave',
          name: 'approvalleave',
          component: resolve => require(['../views/approval/leaveApply.vue'], resolve),
        },
        // 加班申请
        { path: 'approval/overtime',
          name: 'approvalovertime',
          component: resolve => require(['../views/approval/overtimeApply.vue'], resolve),
        },
        // 补打卡申请
        { path: 'approval/card',
          name: 'approvalpatch_card',
          component: resolve => require(['../views/approval/patchCardApply.vue'], resolve),
        },
        // 审批-外出申请
        { path: 'approval/goOut',
          name: 'approvalgo_out',
          component: resolve => require(['../views/approval/goOut.vue'], resolve),
        },
        // 审批-通用
        { path: 'approval/common',
          name: 'approvalcommon',
          component: resolve => require(['../views/approval/common.vue'], resolve),
        },
        // 审批-报销付款审批
        { path: 'approval/payment',
          name: 'approvalpayment',
          component: resolve => require(['../views/approval/payment.vue'], resolve)
        },
         // 审批-出差申请
         { path: 'approval/travel',
         name: 'approvaltravel',
         component: resolve => require(['../views/approval/busTravel.vue'], resolve),
        },
        // 考勤汇总
        { path: 'attendance/list',
        name: 'attendanceList',
        component: resolve => require(['../views/attendance/list.vue'], resolve),
        meta : { root : true}
       },
       // 同步云考勤
       { path: 'attendance/sync',
       name: 'attendanceSync',
       component: resolve => require(['../views/attendance/sync.vue'], resolve),
       meta : { root : true}
      },
       // 考勤规则
       { path: 'attendance/rule',
       name: 'attendanceRule',
       component: resolve => require(['../views/attendance/rule.vue'], resolve),
      },
      // 考勤详情
      { path: 'attendance/info',
      name: 'attendanceInfo',
      component: resolve => require(['../views/attendance/info.vue'], resolve),
     }
      ]
    },
    // 考试
    {
      path: '/exam',
      name: 'exam',
      component:  resolve => require(['../views/exam/exam.vue'], resolve)
    },
    // 移动端页面
    {
      path: '/h5',
      name: 'h5',
      component: resolve => require(['../views/homePage/indexh5.vue'], resolve),
      meta :{ root : true},
      redirect : '/h5/login',
      children : [
        {
          path: 'login',
          name: 'loginh5',
          component:  resolve => require(['../views/loginPage/loginH5.vue'], resolve),
          meta :{init : false , root : true}
        },
        {
          path: 'examlist',
          name: 'examlisth5',
          component:  resolve => require(['../views/exam/examlisth5.vue'], resolve),
          meta :{root : true}
        },
        {
          path: 'exam',
          name: 'examh5',
          component:  resolve => require(['../views/exam/examh5.vue'], resolve),
          meta :{root : true}
        },
        {
          path: ':id/examResult',
          name: 'examResulth5',
          component:  resolve => require(['../views/exam/examResulth5.vue'], resolve),
          meta :{root : true}
        },
      ]
    },
  ]
})

route.beforeEach((to,from,next)=>{
    if(to.meta.init == false){
      storeRoute(to,from,next);
    }else{
      let token = to.params.token;
      if(token){
        token = util.b64DecodeUnicode(token);
      }
      store.dispatch('init',{token}).then(_=>{
        if(to.meta.isHome){
          switch(store.state.userAgentType){
            case "mobile":
            window.location.href = '/indexh5.html#/h5/examlist';
            break;
            case "pc":
            storeRoute(to,from,next);
            break;
          }
        }else{
          storeRoute(to,from,next);
        }
      });
    }
})
function storeRoute (to,from,next){
  if (to.matched.length ===0 && !to.name) {                             
      next('/home/errorPage/404');   
  }else{
    // 页面为错误页面不添加记录  防止用户刷新 还出来此页面
    if(to.name != 'errorPage'){
      if(window.sessionStorage['routeTrack']){
        global.ROUTELENGTH = JSON.parse(window.sessionStorage['routeTrack']).children.length;
      }
      if(to.meta.hasOwnProperty('root')){
        if(to.meta.root){
          window.sessionStorage['routeTrack'] =  JSON.stringify({root : to.fullPath , children :[{name : to.name , fullPath : to.fullPath, nav : store.state.userMenuObj[to.fullPath]  || to.meta.pathName }]});
        }
      }else{
        if(!window.sessionStorage['routeTrack']){
            if(to.meta.back){
              window.sessionStorage['routeTrack'] =  JSON.stringify({root : to.meta.back, children :[]});
            }else{
              window.sessionStorage['routeTrack'] =  JSON.stringify({root : '/home', children :[{name : to.name , fullPath : to.fullPath, nav : store.state.userMenuObj[to.fullPath]  || to.meta.pathName }]});
            }
          }
          let routeTrack = JSON.parse(window.sessionStorage['routeTrack']);
          //判断原有路由是否存在相同路由  并且记录路由
          if(!to.meta.noRouteTrack){
            let result = routeTrack.children.some((v,i)=>{
              if(v.name == to.name){
                routeTrack.children.splice(i+1,);
                routeTrack.children[i] = {name : to.name , fullPath : to.fullPath, nav : store.state.userMenuObj[to.fullPath]  || to.meta.pathName };
              }
              return v.name == to.name;
            })
            if(!result){
              routeTrack.children.push({name : to.name  , fullPath : to.fullPath , nav : store.state.userMenuObj[to.fullPath] || to.meta.pathName});
            }
          }
        window.sessionStorage['routeTrack'] = JSON.stringify(routeTrack);
      }
    }
    next();
  }
}
export default route;