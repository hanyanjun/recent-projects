import {get,post} from "./api.js"
export default {
  // 修改1
  // 权限table
  powerTable: (data) => post({ url: '/admin/sys/requestmapList', data }),
  roleRequestmaps: (data) => post({ url: '/admin/sys/roleRequestmaps', data }),
  menuRequestmaps: (data) => get({ url: `/admin/sys/menuRequestmaps?permission=${data.permission}`, data }),
  roleEdit: (data) => post({ url: '/admin/sys/roleEdit', data }),
  roleAdd: (data) => post({ url: '/admin/sys/roleAdd', data }),
  roleDel: (data) => post({ url: '/admin/sys/roleDel', data }),
  // 增加一行新权限
  addNewPowerList: (data) => post({ url: '/admin/sys/requestmapAdd',  data }),
  // 增加一行新权限
  requestmapEdit: (data) => post({ url: '/admin/sys/requestmapEdit',  data }),
  // 菜单父子列表
  menuDataList: (data) => post({ url: '/admin/sys/menuList',  data }),
  // 角色列表
  roleList: (data) => post({ url: '/admin/sys/roleList',  data }),
  // 查看角色人员
  roleEmpList: (data) => post({ url: '/admin/sys/roleEmpList',  data }),
  // 删除一行
  deletePowerTableRow: (data) => post({ url: '/admin/sys/requestmapDel',  data }),
  // 日志记录
  getLoglist: (data) => post({ url: '/admin/log/list',  data }),

  // 登录
  login: (data) => post({ url: '/admin/auth/login',  data }),
  loginout: (data) => get({ url: '/admin/auth/loginout',data }),
  // 激活验证码
  activeAccount: (data) => post({ url: '/admin/auth/activeAccount',  data }),
  // 激活邮箱
  activeAccountEmail: (data) => get({ url: `/admin/auth/again/sendActivatingMail?userId=${data.userId}`,  data }),
  // 验证激活邮箱
  authActiveEmail : (data)=>get ( {url : `/admin/auth/activating?code=${data.code}`,data}),
// 激活设置密码
  authActiveSetPwd : (data)=>post({url : `/admin/auth/setPwd?pass1=${data.pass1}&pass2=${data.pass2}&userId=${data.userId}`,data}),
  

  resetPwd: (data) => post({ url: '/admin/auth/activeAccount/resetPwd',  data }),
  // 忘记password-第一步
  mobileVerCode: (data) => post({ url: '/admin/forget/mobileVerCode',  data }),
  // 忘记password-第2步
  passVerCode: (data) => post({ url: '/admin/forget/checkVerCode',  data }),
  // 忘记password-第3步
  passResetPwd: (data) => post({ url: '/admin/forget/resetPwd', data }),
  // 邮箱忘记password-第一步
  emailVerCode: (data) => post({ url: '/admin/forget/emailVerCode',  data }),

  // 个人中心
  getAllDatas: (data) => post({ url: '/admin/employee/myself/getAllDatas', data }),
  // 编辑基本信息
  editBase: (data) => post({ url: '/admin/employee/myself/editBase',  data }),
  // 编辑修改联系信息
  editContact: (data) => post({ url: '/admin/employee/myself/editContact', data }),
  // 编辑修改签名
  editPic: (data) => post({ url: '/admin/employee/myself/editPic',data }),
  // 修改密码
  editpwd: (data) => post({ url: '/admin/reset/pwd',  data }),
  /***********************组织架构************************/ 
  // 组织架构树形-首页
  getOrgTreeExtInfo: (data) => get({ url: '/admin/dept/getOrgTreeExtInfo', data }),
  // 组织架构树  包含人员

  getOrgPersonTree : (data)=>get({url : '/admin/dept/getOrgPersonTree',data}),
  // 部门删除
  removeDept: (data) => post({ url: '/admin/dept/removeDept', data }),
  // 部门负责人tree
  orgTreeBaseInfo: (data) => get({ url: '/admin/dept/getOrgTreeBaseInfo', data }),
  // 获取头像
  getHeadPic: (data) => get({ url: '/admin/file/download/file?' + 'filePath=' + data.filePath, data}),
  getEmpsByDeptId: (data) => get({ url: '/admin/dept/getEmpsByDeptId?' + 'deptId=' + data.deptId, data}),
  createDept: (data) => post({ url: '/admin/dept/createDept', data }),
  editDept: (data) => post({ url: '/admin/dept/editDept', data }),
  listEmpsInDept: (data) => post({ url: '/admin/dept/listEmpsInDept', data }),
  distributeDept: (data) => post({ url: '/admin/dept/distributeDept', data }),
  //
  getDicOptions: (data) => get({ url: `/admin/dic/getDicOptions?type=${data.type}`,data}),
  getToBeAssignedEmp: (data) => post({ url: '/admin/dept/getToBeAssignedEmp', data }),
  //
  getInOfficeList: (data) => post({ url: '/admin/employee/incumbent/list',  data }),
  getLeavingList: (data) => post({ url: '/admin/empLeaving/leavingEmp/list',  data }),
  addEmployee: (data) => post({ url: '/admin/employee/add',  data }),
  reentry: (data) => post({ url: '/admin/empLeaving/reentry',  data }),
  turnPositive: (data) => post({ url: '/admin/employee/turn/positive',  data }),
  leavingJob: (data) => post({ url: '/admin/employee/leaving/job', data }),
  transPosition: (data) => post({ url: '/admin/employee/trans/position',  data }),
  accountDisable: (data) => get({ url: '/admin/account/disable?' + 'userId=' + data.userId,  data }),
  endisable: (data) => get({ url: '/admin/account/endisable?' + 'userId=' + data.userId, data }),
  sendVerCode: (data) => get({ url: `/admin/employee/agin/sendVerCode?userId=${data.userId}`, data}),
  monthlyStatistics: (data) => get({ url: '/admin/empLeaving/monthlyStatistics?' + 'beginDate=' + data.beginDate + '&endDate=' + data.endDate, data }),
  getEmpCoreData: (data) => get({ url: '/admin/empLeaving/getEmpCoreData?' + 'userId=' + data.userId,  data }),
  idsAndNames: (data) => get({ url: `/admin/sys/role/idsAndNames?permission=${data.permission}`, data }),
  empCoreDataSave: (data) => post({ url: '/admin/empLeaving/empCoreDataSave',  data }),
  empExtBaseDataSave: (data) => post({ url: '/admin/empLeaving/empExtBaseDataSave',  data }),
  // get初始信息
  getEmpExtBase: (data) => get({ url: '/admin/empLeaving/getEmpExtBase?' + 'userId=' + data.userId, data }),
  getEmpExtContact: (data) => get({ url: '/admin/empLeaving/getEmpExtContact?' + 'userId=' + data.userId,  data }),
  getEmpExtAccount: (data) => get({ url: '/admin/empLeaving/getEmpExtAccount?' + 'userId=' + data.userId, data }),
  getEmpExtEducation: (data) => get({ url: '/admin/empLeaving/getEmpExtEducation?' + 'userId=' + data.userId,  data }),
  getEmpExtEmployment: (data) => get({ url: '/admin/empLeaving/getEmpExtEmployment?' + 'userId=' + data.userId, data }),
  getEmpPositionInfo: (data) => get({ url: ' /admin/empLeaving/getEmpPositionInfo?' + 'userId=' + data.userId, data }),
  getEmpLeavingInfo: (data) => get({ url: ' /admin/empLeaving/getEmpLeavingInfo?' + 'userId=' + data.userId, data }),
  getEmpRoleInfo: (data) => get({ url: `/admin/empLeaving/getEmpRoleInfo?userId=${data.userId}&permission=${data.permission}`, data }),
  getEmpExtPhyExam: (data) => post({ url: '/admin/empLeaving/getEmpExtPhyExam',  data }),
  
  headBase: (data) => get({ url: '/admin/head/base',  data }),
  provinceCity: (data) => get({ url: '/admin/dic//provinceCity',  data }),
  // post保存
  orgDragSave: (data) => post({ url: '/admin/dept/orgDragSave', data }),
  empExtContractDataSave: (data) => post({ url: '/admin/empLeaving/empExtContractDataSave', data }),
  empExtAccountDataSave: (data) => post({ url: '/admin/empLeaving/empExtAccountDataSave',  data }),
  empExtEducationDataSave: (data) => post({ url: '/admin/empLeaving/empExtEducationDataSave', data }),
  empExtEmploymentDataSave: (data) => post({ url: '/admin/empLeaving/empExtEmploymentDataSave',  data }),
  leavingInfoSave: (data) => post({ url: '/admin/empLeaving/leavingInfoSave', data }),
  empRoleSave: (data) => post({ url: '/admin/empLeaving/empRoleSave', data }),
  empPsnBaseInfoSave: (data) => post({ url: '/admin/empLeaving/empPsnBaseInfoSave', data }),
  empPsnContractInfoSave: (data) => post({ url: '/admin/empLeaving/empPsnContractInfoSave', data }),
  empPsnRecruitInfoSave: (data) => post({ url: '/admin/empLeaving/empPsnRecruitInfoSave',  data }),
  empExtPhyExamDataSave: (data) => post({ url: '/admin/empLeaving/empExtPhyExamDataSave',  data }),
  
  // 统计
  entryEmpStatistics: (data) => post({ url: '/admin/empLeaving/entryEmpStatistics',  data }),
  leavingEmpStatistics: (data) => post({ url: '/admin/empLeaving/leavingEmpStatistics',  data }),
  contractEndEmpStatistics: (data) => post({ url: ' /admin/empLeaving/contractEndEmpStatistics',  data }),
  birthEmpStatistics: (data) => post({ url: ' /admin/empLeaving/birthEmpStatistics', data }),
  transferEmpStatistics: (data) => post({ url: ' /admin/empLeaving/transferEmpStatistics',  data }),


// 用户权限菜单
  userMenu: (data)=> get({url : '/admin/sys/userMenu',data}),
  // 其他用户个人记录信息
  getChangeRecord : (id)=> get ({url : `/admin/employee/getChangeRecord?userId=${id}`, data : {'userId' : id}}),
  // 个人记录
  getMyselfRecord : (data)=> get ({url : '/admin/employee/getMyselfRecord',data}),
  

// 获取所有字典数据
  getDicForAll : (data)=> get({url : '/admin/dic/getDicForAll',data}),
// 批量导入员工
  batchImport : (data)=> post({url : '/admin/employee/submit/employee',data}),
  // 菜单管理
  // 菜单删除
  menuDel : (data)=> post({url : '/admin/sys/menuDel',data}),
  // 菜单增加
  menuAdd : (data)=> post({url : '/admin/sys/menuAdd',data}),
  // 菜单修改
  menuEdit : (data)=> post({url : '/admin/sys/menuEdit',data}),
  /***********************公司模块************************/ 
  companyList : (data)=>post({url : '/admin/company/list',data}), //公司列表

  companyBaseInfo : (data)=>get({url : `/admin/company/info/base?companyId=${data}`,data : {'companyId' : data}}), //公司基本信息

  companyEditBase : (data)=>post({url : `/admin/company/edit/base`,data}), //编辑公司基本信息
  companyannInspInfo : (data)=>get({url : `/admin/company/info/annInsp?companyId=${data}`,data : {'companyId' : data}}), //公司年检信息
  companyEditannInsp : (data)=>post({url : `/admin/company/edit/annInsp`,data}), //编辑公司年检信息
  companyDetail : (data)=>get({url : `/admin/company/info/detail?companyId=${data.companyId}`,data}), //公司详情

  companyEditCore : (data)=>post({url : `/admin/company/edit/core`,data}), //编辑公司核心
  companyfinanceInfo : (data)=>get({url : `/admin/company/info/finance?companyId=${data}`,data : {'companyId' : data}}), //公司财务信息
  
  companyEditFinance : (data)=>post({url : `/admin/company/edit/finance`,data}), //编辑公司财务
  companyAdd : (data)=> post({url : '/admin/company/add',data}),//新增公司
  companyStatus : (data)=> get({url : `/admin/company/edit/status?companyId=${data.companyId}&status=${data.status}` , data}),//是否使用

  companyIdName : (data)=>get({url : '/admin/company/idAndName',data}),//公司列表键值对形式


  
  /***********************行政合同模块************************/ 
  adContractList : (data)=>post({url : `/admin/contract/admin/getContractAdminList`,data}), //列表
  adContractBaseAdd : (data)=>post({url : '/admin/contract/admin/contractAdminBaseAdd',data}), //基本信息新增
  adContractBaseEdit : (data)=>post({url : '/admin/contract/admin/contractAdminBaseEdit',data}), //基本信息编辑
  contractAdminSignBodyAddOrEdit : (data)=>post({url : '/admin/contract/admin/contractAdminSignBodyAddOrEdit',data}), //-签约主体新增或编辑
  getConAdminPaymentDetail : (data)=>get({url : `/admin/contract/admin/getConAdminPaymentDetail?conId=${data}`,data : {'conId' : data}}), //-付款信息
  getConAdminPaymentEdit : (data)=>post({url : '/admin/contract/admin/contractAdminPaymentAddOrEdit',data}), //-编辑付款信息
  getConAdminBaseDetail : (data)=>get({url : `/admin/contract/admin/getConAdminBaseDetail?conId=${data}`,data: {'conId':data}}), //-基本信息
  getConAdminSignBodyDetail : (data)=>get({url : `/admin/contract/admin/getConAdminSignBodyDetail?conId=${data}`,data: {'conId':data}}), //--签约主体
  getCoverPreviewMsg : (data)=>get({url : `/admin/contract/admin/getCoverPreviewMsg?conId=${data}`,data : {'conId':data}}), //封面预览
  /***********************合同管理分类模块************************/ 
  getConClassTree : (data)=>get({url :`/admin/contract/getConClassTree?classType=${data}`, data : {'classType' : data}  }), //合同分类 树
  contractClassInsert  : (data)=>post({url : '/admin/contract/contractClassInsert',data}),//新增
  contractClassEdit : (data)=>post({url : '/admin/contract/contractClassEdit',data}), //编辑
  contractClassDel : (data)=>post({url : '/admin/contract/contractClassDel',data}), //删除
  getConClassDetail : (data)=>get({url : ` /admin/contract/getConClassDetail?classId=${data}`,data : {'classId' : data}}), // 详情
/***********************业务合同模块************************/ 
  busContractList :(data)=>post({url :'/admin/contract/business/list',data}), // 业务合同列表
  busContractDetail :(data)=>get({url :`/admin/contract/business/detail/show?contractId=${data}`, data : {'contractId' :data}}), // 业务合同详情
  exportBusContract : (data)=>post({url : '/admin/contract/business/export',data}), //导出列表数据
  viewBusContract : (data)=>get({url :`/admin/contract/business/cover/view?contractId=${data}`,data : {'contractId' : data} }),//封面预览
  receiptBusInfo : (data)=>get({url :`/admin/contract/business/receipt/info?contractId=${data}`,data : {'contractId' : data} }),//收款信息
  authReceiptBusInfo : (data)=>get({url :`/admin/contract/business/authReceipt/info?contractId=${data}`,data : {'contractId' : data} }),//机构信息
  annexBusInfo : (data)=>post({url : '/admin/contract/business/edit/annex', data}), //编辑业务合同文件信息

  signBusInfo :(data)=>get({url : `/admin/contract/business/sign/info?contractId=${data}`,data : {'contractId' : data} }),//签署信息

  addBusCover : (data)=>post({url :'/admin/contract/business/add/cover',data}), //生成封面
  editBusCover : (data)=>post({url : '/admin/contract/business/edit/cover',data}), // 编辑封面
  receiptEditBusInfoG : (data)=>post({url : '/admin/contract/business/edit/receipt',data}), // 编辑收款信息
  receiptEditBusInfo : (data)=>post({url : '/admin/contract/business/edit/authReceipt',data}),//编辑授权信息

  signEditBusInfo : (data)=>post({url : '/admin/contract/business/edit/sign',data}),//编辑签署信息
  contractAdminFileAddOrEdit : (data)=>post({url : '/admin/contract/admin/contractAdminFileAddOrEdit',data}), //新增或修改行政合同附件
/***********************通讯录模块************************/ 
  getAddrListTree : (data)=>get({url : '/admin/dept/getAddrListTree',data}), //通讯录 结构树
  getAddrListEmpDetail : (data)=>get({url : `/admin/dept/getAddrListEmpDetail?userId=${data}`,data : {'userId' : data} }), // 通讯录详情
  contactSwitchStatus :  (data)=>post({url : '/admin/dept/switchStatus',data}), // 手机号隐藏显示
  getAddrList : (data)=>post({url : `/admin/dept/getAddrList`,data}), //通讯录列表


/***********************安全验证模块************************/ 


  sendAuthCodeToMobile : (data)=>post({url : '/admin/sys/sendAuthCodeToMobile',data}),//发送验证码
  sendAuthCodeToEmail :  (data)=>post({url : `/admin/sys/sendAuthCodeToEmail`,data}),//发送验证码
  checkAuthCodeMobile : (data)=>post({url : '/admin/sys/checkAuthCodeMobile',data}), //校验手机号
  checkAuthCodeEmail : (data)=>post({url : '/admin/sys/checkAuthCodeEmail',data}),//校验邮箱
/***********************电子签名管理************************/
getElecSignList : (data)=>post({url : `/admin/empLeaving/getElecSignList`,data}),
elecSignSaveOrEdit: (data) => post({ url: '/admin/empLeaving/elecSignSaveOrEdit',  data }),
/***********************系统配置模块************************/ 
sysConfigList : (data)=>get({url : `/admin/sysConfig/list?key=${data.key || ''}&pageNum=${data.pageNum || ''}&pageSize=${data.pageSize || ''}`,data}),
addSysConfig : (data)=>post({url : '/admin/sysConfig/add',data}),
editSysConfig : (data)=>post({url : '/admin/sysConfig/update',data}),
/***********************系统配置模块************************/ 
getDicForAllByPage: (data)=>post({url : '/admin/dic/getDicForAllByPage',data}),
addDic: (data)=>post({url : '/admin/dic/addDic',data}),
removeDic: (data)=>post({url : '/admin/dic/removeDic',data}),
updateDic: (data)=>post({url : '/admin/dic/updateDic',data}),
timedTaskList : (data)=>post({url : '/admin/task/list',data}),
addTimedTask : (data)=>post({url : '/admin/task/save',data}),
editTimedTask : (data)=>post({url : '/admin/task/update',data}),
changeTimedTask : (data)=>get({url : `/admin/task/changeStatus?cmd=${data.cmd}&id=${data.id}`,data}),
deleTimedTask : (data)=>get({url : `/admin/task/delete?id=${data}`,data : {'id':data}}),
/***********************考试管理************************/
examList : (data)=>post({url : '/admin/exam/manage/exam/list',data}), // 考试列表
deleExam : (data)=>get({url : ` /admin/exam/manage/exam/delete?id=${data}`,data : {'id':data}}), //删除考试
sendExamMsg : (data)=>get({url : `/admin/exam/manage/exam/sendMsg?id=${data.id}&msgType=${data.msgType || ''}`,data}), //发送考试通知
copyExam : (data)=>get({url :  `/admin/exam/manage/exam/copy?id=${data}`,data : {'id':data}}), //复制考试
addExam :(data)=>post({url : ` /admin/exam/manage/exam/add`,data}),//新增考试
gainExamInfo : (data)=>get({url : `/admin/exam/manage/exam/show?id=${data}`, data : {id : data}  }),//查询考试信息
editExamInfo : (data)=>post({url : '/admin/exam/manage/exam/edit',data}),//编辑考试信息
examRules : (data)=>get({url : `/admin/exam/manage/exam/rule?topicId=${data.topicId}&topicType=${data.topicType}`,data}),//抽取考试规则
submitExamOnHead : (data)=>post({url : '/admin/exam/manage/submitExamOnHead',data}), //统一提前交卷
/***********************在线考试************************/
viewExamPage : (data)=>post({url : '/admin/exam/online/viewExamPaper', data}), // 预览考试
newExamPage : (data)=>post({url : '/admin/exam/online/joinExam', data}), // 生成考试
submitExamOneQues : (data)=>post({url : '/admin/exam/online/submitQues',data}), // 提交单个答案
proExamPage : (data)=>post({url : '/admin/exam/online/getTestProgress' , data}), //考试进度
editExamPage: (data)=>post({url : '/admin/exam/manage/exam/edit',data}),//编辑考试
submitAllExam : (data)=>post({url : '/admin/exam/online/submitTest',data}),//交卷
resultExamPage : (data)=>post ( {url : '/admin/exam/online/getTestResult' , data}), //查看成绩
changeExamPage: (data)=>post({url : '/admin/exam/online/changePageWarning',data}), //切换页面记录
analyExamPage : (data)=>post({url : '/admin/exam/online/getTestAnalysis', data}), //查看试卷分析

// /admin/exam/online/getTestAnalysis


/***********************题目管理************************/
quesBankList : (data)=>post({url : '/admin/exam/quesBank/quesBankList',data}),
switchStatus : (data)=>post({url : '/admin/exam/quesBank/switchStatus',data}),
quesBankAdd : (data)=>post({url : '/admin/exam/quesBank/quesBankAdd',data}),
quesBankDel : (data)=>post({url : '/admin/exam/quesBank/quesBankDel',data}),
quesBankDetail : (data)=>post({url : '/admin/exam/quesBank/quesBankDetail',data}),
quesBankEdit : (data)=>post({url : '/admin/exam/quesBank/quesBankEdit',data}),
getNotOverExamList : (data)=>post({url : '/admin/exam/online/getNotOverExamList',data}),
getOverExamList : (data)=>post({url : '/admin/exam/online/getOverExamList',data}),
// 考试分析
scoreAnalysis : (data)=>post({url : '/admin/exam/manage/scoreAnalysis',data}),
scoreAnalysisList : (data)=>post({url : '/admin/exam/manage/scoreAnalysisList',data}),
historyScoreList : (data)=>post({url : '/admin/exam/manage/historyScoreList',data}),

/***********************工作流************************/

createWorkModel : (data)=>get({url : '/admin/model/create',data}), //新建模型

// 数据权限
roleDataAclQuery : (data)=>post({url : '/admin/dataAcl/roleDataAclQuery',data}), //角色权限查询
roleDataAclEdit : (data)=>post({url :'/admin/dataAcl/roleDataAclEdit',data}), //角色权限编辑
userDataAclQuery : (data)=>post({url : '/admin/dataAcl/userDataAclQuery', data}), //用户权限查询
userDataAclEdit : (data)=>post({url : '/admin/dataAcl/userDataAclEdit',data}), //用户权限编辑

/***********************审批管理************************/
waittaskList : (data)=>post({url : '/admin/process/wait/taskList',data}),//待处理的审批列表
myselfList : (data)=>post({url : '/admin/process/myself/apply',data}),//我发起的审批列表
alreadyList : (data)=>post({url : '/admin/process/already/handle',data}),//已处理的审批列表
ccmine : (data)=>post({url : '/admin/process/cc/mine',data}),//抄送我的审批列表
monitorList : (data)=>post({url : '/admin/process/monitor',data}),//流程监控的审批列表

// 查看流程信息（表单+流程记录）
processshow:(data)=>get({url : `/admin/process/show?flowDefinitionId=${data.flowDefinitionId}&formNo=${data.formNo}&processInstanceId=${data.processInstanceId}&relationFormCode=${data.relationFormCode}`,data}),
// 流程-处理审批（同意/不同意/退回）
processRoam : (data)=>post({url : '/admin/process/roam',data}),
// 流程-撤销
processCancel : (data)=>post({url : '/admin/process/cancel',data}),
// 流程-催办
sendUrgent : (data)=>post({url : '/admin/process/send/urgent',data}),
// 流程-时效分析
analysis : (data)=>get({url : `/admin/process/aging/analysis?flowDefinitionId=${data.flowDefinitionId}&processInstanceId=${data.processInstanceId}`,data}),
// 流程-询审批剩余节点
lastnode : (data)=>get({url : `/admin/process/last/node?curNodeCode=${data.curNodeCode}&processInstanceId=${data.processInstanceId}`,data}),
// 流程-强制流转
forceroam : (data)=>post({url : '/admin/process/force/roam',data}),
// 流程-更改临时审批人
assignee : (data)=>post({url : '/admin/process/change/assignee',data}),
// 异常流程统计
exceptionMonitor : (data)=>get({url : '/admin/process/exception/monitor',data}),

/***********************审批设置************************/
getTempListForManager : (data)=>get({url : '/admin/model/getTempListForManager'}), //审批设置模板列表
createApprovalMode : (data)=>post({url : '/admin/model/create',data}), //新增审批模板
approvalModeIsOn : (data)=>post({url :'/admin/model/offOrOn',data}), //是否使用模板
approvalUpdateModelApply : (data)=>post({url : '/admin/model/updateModelApply',data}), //编辑模板权限
getApprovalModelProcess : (data)=>post({url : '/admin/model/getModelProcess',data}), //审批流程查询
saveApprovalModelProcess : (data)=>post({url : '/admin/model/saveDeploy',data}), // 保存整个流程
updateNodeApprovalModel : (data)=>post({url : '/admin/model/updateNode',data}), //更新某个节点
getTempListForUser : (data)=>get({url : '/admin/model/getTempListForUser',data}), //查看用户的审批列表
approvalSubmitLeave : (data)=>post({url : '/admin/form/submit/leave',data}),//发起请假审批
approvalSubmitOvertime : (data)=>post({url : '/admin/form/submit/overtime',data}),//发起加班申请
approvalSubmitPatchcard : (data)=>post({url :'/admin/form/submit/patchcard',data}),//发起补打卡申请
submittravel : (data)=>post({url : '/admin/form/submit/travel',data}), //提交出差申请
approvalDuration : (data)=>post({url : '/admin/form/count/duration',data}), // 获取时长
submitgoOut : (data)=>post({url : '/admin/form/submit/goout',data}), //提交外出申请
approvalFormShow : (data)=>get({url : `/admin/process/show?flowDefinitionId=${data.flowDefinitionId}&formNo=${data.formNo}&processInstanceId=${data.processInstanceId}&relationFormCode=${data.relationFormCode}`,data}),
agreebatch : (data)=>post({url : '/admin/process/batch',data}), //提交外出申请
payment : (data)=>post({url : '/admin/form/submit/payment',data}), //付款单
deployCopy :(data)=>post({url :　'/admin/model/deployCopy' ,data}),  


// 改变手机号
getMobile : (data)=>post({url : `/admin/dept/getMobile`,data}),
tempNameEdit : (data)=>post({url : `/admin/model/tempNameEdit`,data}),
tempDel : (data)=>post({url : `/admin/model/tempDel`,data}),

/***********************考勤管理************************/
getAnnualBaseInfoSelf : (data)=>post({url :'/admin/attend/getAnnualRestBaseInfoPersonal',data}), //年假调休基本信息
getAnnualBaseInfo : (data)=>post({url :'/admin/attend/getAnnualRestBaseInfo',data}), //年假调休基本信息
getAvailableDevice : (data)=>post({url :'/admin/attend/getAvailableDevice',data}), //打卡设备列表
validAnnualEdit : (data)=>post({url :'/admin/attend/validAnnualEdit',data}), //可用年假编辑
getLeaveLog : (data)=>post({url :'/admin/attend/getLeaveLog',data}), //请假调休列表
getOwnLeaveLog : (data)=>post({url :'/admin/attend/getLeaveLogOwn',data}), //请假调休个人列表
getOverTimeLog : (data)=>post({url :'/admin/attend/getOverTimeLog',data}), //加班记录列表
getOwnOverTimeLog : (data)=>post({url :'/admin/attend/getOverTimeLogOwn',data}), //加班记录列表
deviceEdit : (data)=>post({url :'/admin/attend/deviceEdit',data}), //编辑考勤设备
personalRecordLogSelf : (data)=>post({url :'/admin/attend/personalRecordLogOwn',data}), //打卡考勤记录
personalRecordLog : (data)=>post({url :'/admin/attend/personalRecordLog',data}), //打卡考勤记录
attendanceList : (data)=>post({url :'/admin/attendance/getAttendCollectList',data}),//考勤汇总列表
getAnnualRestList : (data)=>post({url :'/admin/attend/getAnnualRestList',data}), //年假调休统计列表
getClockInList : (data)=>post({url :'/admin/attend/getClockInList',data}), //打卡记录列表
getAnnualRule : (data)=>get({url : '/admin/attendance/getRule',data}),//获取考勤规则
updateAnnualRule : (data)=>post({url : '/admin/attendance/updateRule',data}),//更新考勤规则
attendanceListCount : (data)=>post({url : '/admin/attendance/count',data}), //考勤手动汇总
newEmployee : (data)=>post({url : '/admin/attend/newEmployee',data}), // 考勤云同步
attendCheckLog : (data)=>post({url : '/admin/attend/attendCheckLog',data}), // 考勤校对日志列表
attendPersonTree : (data)=>get({url : '/admin/dept/attendPersonTree',data}), // 打卡记录权限树

/***********************绑定微信************************/
getWechatBinding : (data)=>get({url : '/admin/wechat/getWechatBinding',data}),
getQRScene : (data)=>get({url : `/admin/wechat/getQRScene?sceneId=${data.sceneId}`,data}),
deleteWechatBinding : (data)=>get({url : `/admin/wechat/deleteWechatBinding`,data}),
getResultOfFirstLoad : (data)=>get({url : `/admin/wechat/getResultOfFirstLoad`,data}),

getCommonAuthMenu : (data)=>post({url : '/admin/dataAcl/getCommonAuthMenu',data}),


/***********************工作台************************/
getWelcomeInfo : (data)=>post({url : '/admin/workbench/getWelcomeInfo',data}), //获取欢迎语信息
insertUserCardRelation : (data)=>post({url : '/admin/workbench/insertUserCardRelation',data}),  //保存部件
delUserCardRelation : (data)=>post({url : '/admin/workbench/delUserCardRelation',data}), //删除部件
getRelationList : (data)=>post({url : '/admin/workbench/getRelationList',data}), //获取可用部件列表
getSelectRelationList  : (data)=>post({url : '/admin/workbench/getSelectRelationList',data}), //获取已选择部件


}
