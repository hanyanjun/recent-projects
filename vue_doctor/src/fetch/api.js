import axios from 'axios'
import {Indicator,Toast} from '../components/hw-components'

// window.localStorage.clear();

// window.localStorage['refreshToken'] = 'ac47c1f7f8e8bc4bb5b6360f380cfff3694beec9aec5e7bcee67a553182df43f';
// window.localStorage['refreshToken'] = 'e20bd094874abaa66c32ad28fe8761927357e076e441f9c495ac99e62f4aac1e';


//axios 的默认配置修改
axios.defaults.timeout = 50000000000000;
axios.defaults.baseURL = DOCLINKAPI;
// console.log('当前token为:%c'+TOKEN,'color:#2a8cff')
axios.defaults.headers.common['Authorization'] = window.btoa(unescape(encodeURIComponent(TOKEN)));
// axios.defaults.headers.common['Referer'] = '';
axios.defaults.paramsSerializer =  function (params) {
  return Qs.stringify(params,{arrayFormat:'brackets'})
}
// axios.defaults.onUploadProgress = function (progressEvent) {
//   let pro = progressEvent.loaded / progressEvent.total * 100 ;
//   // 对原生进度事件的处理
//   console.log(pro)
//   Toast(`正在上传进度:${pro}`);
//   // console.log(progressEvent);
// }

let time;
let arr = [];
//请求拦截
axios.interceptors.request.use(function (config) {
    if(! /chat/.test(location.href)){
      time = setTimeout(function () {
        Indicator.open('加载中...');
      },1000);
      arr.push(time);
    }
    return config;
},function (error) {
   return Promise.reject(error);
})
//返回状态的拦截
axios.interceptors.response.use(function (response) {
  clearTimeout(arr[0]);
  arr.shift();
  Indicator.close();
  return response;
},function (error) {
  clearTimeout(arr[0]);
  arr.shift();
  Indicator.close();
  // 跨域之类的请求失败
  Toast( '请求失败');
  return Promise.reject(error);
})
//封装get
export function gAJAX(url,params,type) {
  return new Promise((resolve,reject)=>{
    axios.get(url,params,type)
       .then(response=>{
         if(response.data.code == 0 || response.data.code == '10006'){
           resolve(response.data);
         }else{
           if(response.data.errMsg){
             Toast(response.data.errMsg);
           }
           reject();
           detailCode(response.data)
         }
       },err=>{
         // eval(err.response);
         // Toast(err.response.status);
         Toast('当前无网络服务!');
       })
       .catch(error=>{
         Toast(error);
       })
  })
}
//封装post
export function pAJAX(url,params,config) {
  return new Promise((resolve,reject)=>{
    let data ;
    //序列化数据
    if(!config){
      data = new FormData();
      if(typeof params === 'object'){
        for( let key in params){
          if(params.hasOwnProperty(key) && params[key] !== undefined){
            data.append(key,params[key]);
            config = {
              headers:{'Content-Type':'multipart/form-data'}
            };
          }
        }
      }
    }else{
      data = params;
    }
    axios.post(url,data,config)
      .then(response=>{
        if(response.data.code == 0){
          if(response.data.msg){
            Toast(response.data.msg);
          }else if(response.data.errMsg){
            Toast(response.data.errMsg);
          }
          resolve(response.data);
        }else{
          if(response.data.errMsg){
            Toast(response.data.errMsg);
            reject();
          }
          detailCode(response.data)
        }
      },err=>{
        Toast('当前无网络服务!');
      })
      .catch(error=>{
        Toast(error);
      })
  })
}
export function dAJAX(url,params) {
  return new Promise((resolve)=>{
    axios.delete(url,params)
      .then(response=>{
        if(response.data.code == 0){
          if(response.data.msg){
            Toast(response.data.msg);
          }else if(response.data.errMsg){
            Toast(response.data.errMsg);
          }
          resolve(response.data);
        }else{
          if(response.data.errMsg){
            Toast(response.data.errMsg);
          }
          detailCode(response.data)
        }
      },err=>{
        Toast(err);
      })
      .catch(error=>{
        Toast(error);
      })
  })
}
function detailCode(obj) {
  if(obj.code == 99999){
    axios.post('/authorize/refreshToken','refreshToken='+window.btoa(unescape(encodeURIComponent(window.localStorage['refreshToken']))))
      .then(function (obj) {
          if(obj.data.code == '0'){
            window.localStorage['token'] = obj.data.access_token;
            window.localStorage['tokenTime'] = Date.parse(new Date());
            var number = Date.parse(new Date());
            var url = window.location.href;
            if(/\?/.test(url)){
              url = url.substring(0,url.indexOf('?'));
            }
            window.location.href = url + '?' + number;
            window.location.reload();
          }
          else if(obj.data.code == '90001'){
            let url = window.location.href;
            let index = url.indexOf('#');
            window.location.href = DOCAUTHORIZELINK+'?location_url=' + escape(url.substring(index+2,));
          }
      })
  }
}
//接口的封装
export  default{
//  获取登录信息
  loginInfo (params){
    return gAJAX('/login/info',params);
  },
//  获取医生基本信息
  gainDocInfo (){
    return gAJAX('/doctor/info');
  },
  // http://testwx.hiwein.com/docv1/authorizeauthorize?location_url=certificate/addInfo
  //初始化
  initInfo(){
    return gAJAX('/doctor/initInfo');
  },
  /********************************************************************************************
   *                                  通讯录相关
   * *****************************************************************************************/
  gainAllPat(){
      return gAJAX('/contactsManage/allPatients');
  },
  //获取我的会员字母排序
  gainMyPat(){
    return gAJAX('/contacts/myPatients');
  },
  deletePatient(id1,id2){
     return dAJAX(`/contactsManage/deletePatient/${id1}/${id2}`);
  },
  editGroup(id){
    let gId = id ? `?group_id=${id}` : '';
     return gAJAX(`/contactsManage/groupQuery${gId}`);
  },
  deleteGroup(id){
     return dAJAX(`/contactsManage/deleteGroup/${id}`);
  },
  saveGroup(formData){
    let config = {
      headers:{'Content-Type':'multipart/form-data'}
    };
    return pAJAX('/contactsManage/saveGroup',formData,config);
  },

  //获取通讯录联系人
  // gainAllPat(){
  //   return gAJAX('/contacts/groups/patients');
  // },
  addGroup(params){
    return pAJAX(`/contacts/groups`,params);
  },
  movePat(params){
    return pAJAX(`/contacts/groups/${params.groId}/patients`,{patients_accounts : params.patId});
  },
//  获取所有分组
  gainAllGro(){
    return gAJAX('/contacts/groups');
  },
  //删除会员
  deletePat(params){
    return dAJAX(`/contacts/patients/${params}`);
  },
//  是否开启自动回复功能
  reviewSwitch(params){
    return pAJAX('/set/reviewSwitch',{switch : params});
  },
//  获取执业地信息
  gainDocHospital(params){
    return gAJAX('/doctor/hospitals'+ ( params ?　'/' + params: ''))
  },
//  删除执业地点
  deleteHospital(params){
    return dAJAX('/doctor/hospital/'+params)
  },
  /*******************************************服务开关*********************************************************/
//  服务开关
  gChatSwitch(){
    return gAJAX('/set/chatSwitch');
  },
  sChatSwitch(params){
    return pAJAX('/set/chatSetting',params);
  },
  gFamilySwitch(){
    return gAJAX('set/familySwitch');
  },
  sFamilySwitch(params){
    return pAJAX('/set/familySetting',params);
  },
  gFreeSetting(){
    return gAJAX('/set/freeSwitch');
  },
  sFreeSetting(params){
    return pAJAX(`/set/freeSetting`,params);
  },
  psFreeSetting(id,params){
    return pAJAX(`/set/freeSetForPatient/${id}`,params);
  },
  /*******************************************预约状态*********************************************************/
//  预约状态
  appointStatus(){
    return gAJAX('/set/appointSwitch');
  },
  appointSwitchSet(params){
    return pAJAX('/set/appointSetting',{switch : params});
  },
    gainAppointSet(params){
    let id = params ? `/getOne/${params}` : '/get';
    return gAJAX(`/appoint${id}`);
  },
  appointTimeSet(params){
    delete params['hospitalText'];
    if(params.id == 'null'){delete params['id']};
    return pAJAX('/appoint/set',params);
  },
  gainProvince(){
    return gAJAX('/hospitals/provinces');
  },
  gainAreas(params){
    return gAJAX(`/hospitals/${params}/areas`)
  },
  gainAHospital(d1,d2){
    return gAJAX(`/hospitals/${d1}/${d2}/all`)
  },
  searchHospital(params){
    return pAJAX('/hospitals', {keyword : params});
  },
  addDocHospital(params){
    let id = params.id ? `/${params.id}` : '';
    return pAJAX(`/doctor/hospital${id}`,params);
  },
  gainOrderDesc(id){
     return gAJAX(`/appoint/desc/${id}`);
  },
  appointSetList(){
    return gAJAX('/appoint/list')
  },


  /*******************************************预约相关*********************************************************/
//  预约相关
  appointList(params){
    return gAJAX(`/appoint/status/${params.status}?page=${params.page}`);
  },
  appointReview(params){
    return pAJAX('/appoint/review',params);
  },
  appointCancle(params){
    return pAJAX(`/appoint/cancel/${params.id}`,{reason : params.reason});
  },
  OrderCompleteSymbol(params){
    return pAJAX('/appoint/noArrive',params);
  },
  addOrderDesc(params){
    return pAJAX('/appoint/addDesc',params);
  },
  appointDetailInfo(params){
    return gAJAX(`/appoint/info/${params}`);
  },
  appointLog(params){
    return gAJAX(`/appoint/log/${params}`);
  },
  oAppointSet(params){
    return pAJAX('/appoint/setAppointTemporary',params);
  },
  oAppointStop(params){
    return pAJAX('/appoint/setAppointClosure',params);
  },
  appointStopList(params){
    return pAJAX('/appoint/appointClosures',params);
  },
  appointStopCancle(id){
    return pAJAX(`/appoint/cancelAppointClosure/${id}`);
  },
  appointTemporaries(params){
    return pAJAX('/appoint/appointTemporaries',params);
  },
  appointTemporaryDetail(id){
    return gAJAX(`/appoint/appointTemporaryDetail/${id}`);
  },
  appointeRecord(params){
    return pAJAX('/appoint/appointRecords',params);
  },
  /*******************************************会员信息*********************************************************/
  //会员信息
  patInfo(params){
    return gAJAX(`/patients/${params}/info`);
  },
  patInquiry(params){
    return gAJAX(`/patients/${params}/inquiry`);
  },
  patNotes(params){
    return gAJAX(`/patients/${params}/inquiry/notes`);
  },
  addPatNote(params){
    return pAJAX(`/patients/${params.id}/inquiry/notes`,{note : params.note});
  },
  delPatNote(params){
    return dAJAX(`/patients/${params.patId}/inquiry/notes/${params.noteId}`);
  },
  changeRemark(id,params){
    return pAJAX(`/patients/${id}/remark`,{remark : params});
  },
  /*******************************************聊天相关*********************************************************/
//  聊天相关
  chatToken(params){
    return gAJAX('/chat/token');
  },
  // hxPatInfo(params){
  //   return gAJAX(`/patients/hxAccountInfo/${params}`);
  // },
  inviteSubscribe(id){
    return pAJAX(`/patients/inviteSubscribe/${id}`);
  },
  addOldRecord(id,params){
    return gAJAX(`/chat/messages/${id}/?page=${params.page}&timestamp=${params.timestamp}`);
  },
  newChatRecord(id,params){
    return gAJAX(`/chat/history/${id}/?page=${params.page}`);
  },
  getRelation(params){
    if(params.id){
      return pAJAX(`/chat/getRelation/${params.id}`,{msg : params.msg});
    }else{
      return '';
    }
  },
  chatImage(params){
    let config = {
      headers:{'Content-Type':'multipart/form-data'}
    };
    return pAJAX('/chat/images',params,config);
  },
  sendVoice(params){
      return pAJAX(`/chat/media/${params}`);
  },
  gainReply(){
     return gAJAX('/chat/commonReply/get');
  },
  editReply(params){
    return pAJAX('/chat/commonReply/edit',params);
  },
  addReply(params){
    return pAJAX('/chat/commonReply/add',params);
  },
  deleteReply(params){
    return pAJAX('/chat/commonReply/delete',{id : params});
  },
  chatService(params){
     return pAJAX('/doctor/switch/chat',params);
  },
  serviceHistory(id,params){
    return pAJAX(`/order/patient/${id}`,params);
  },
  replayed(id){
    return pAJAX(`/chat/replayed/${id}`);
  },
  /*******************************************wx签名*********************************************************/
//  wx签名
  wxjsapi(params){
    return gAJAX(`/api/js${params ? `?url=${params}` : ''}`);
  },
  /*******************************************登录注册相关*********************************************************/
//  登录注册相关
  login(params){
      return pAJAX('/login',params);
  },
  gainCode(params){
    return pAJAX('/login/getSmsCode',params);
  },
  register(params){
    return pAJAX('/login/register',params);
  },
  getNewsSwitch(){
    return gAJAX('/getSwitch');
  },
  setNewsReportTime(params){
    return pAJAX('/set/messageSwitch',params);
  },
  resetIphone(params){
    return pAJAX('/login/resetPhone',params);
  },
  revisePassword(params){
    return pAJAX('/login/updatePass',params);
  },
  resetPassword(params){
    return pAJAX('/login/restPass',params);
  },
  /*******************************************医生信息相关*********************************************************/
//  医生信息相关
  updateFace(params){
    let config = {
      headers:{'Content-Type':'multipart/form-data'}
    };
    return pAJAX('/doctor/face',params,config);
  },
  updateDocInfo(params){
    return pAJAX('/doctor/info',params);
  },
  uploadCertify(params){
    let config = {
      headers:{'Content-Type':'multipart/form-data'}
    };
    return pAJAX('/doctor/certify',params,config);
  },
  undo(){
    return gAJAX('/doctor/todoNum');
  },
  /*******************************************会员报到相关*********************************************************/
//会员报到 相关
  reportList(){
    return gAJAX('/contacts/checkInList')
  },
//同意会员报到
  reportPass(params){
    return pAJAX(`/contacts/patients/${params}/reviewPass`)
  },
//  获取会员报到信息
  gainReportPat(){
    return gAJAX('/contacts/patients');
  },
//  详细月份报到情况
  monthReport(params){
    return gAJAX(`/contacts/checkInStat?month=${params}`);
  },
  /*******************************************钱包相关*********************************************************/
  bankList(){
    return gAJAX('/wallet/banks');
  },
  addBankCard(params){
    return pAJAX('/wallet/addBankCard',params);
  },
  transfer(params){
    return pAJAX('/wallet/transfer',params);
  },
  gBankCard(){
    return gAJAX('/wallet/bankCards');
  },
  dBankCard(id){
    return pAJAX(`/wallet/unbindBankCard`,{bank_card_id : id})
  },
//  绑卡验证码
  bankCardCode(id){
    return pAJAX('/wallet/bandCardVerifyCode',id);
  },
//  微信账户验证码
  weixinCode(id){
    return pAJAX('/wallet/sendWechatTransferCode',id)
  },
  addWeixin(params){
    return pAJAX('/wallet/addWechatTransfer',params)
  },
//  提现验证码
  amountCode(id){
    return pAJAX('/wallet/transferVerifyCode',id);
  },
  transferRecord(){
    return gAJAX('/wallet/transferRecords');
  },
  transferDetail(id){
    return gAJAX(`/wallet/transferDetail/${id}`);
  },
  //按月转出授权
  transferAuthorized(authorized){
    return pAJAX('/wallet/transferAuthorized',{authorized : authorized});
  },
  /*******************************************我的钱包*********************************************************/
  //查看钱包余额
  checkMoney(){
    return gAJAX('/wallet/amount');
  },
  incomeDeatil(params){
    return pAJAX('/wallet/income',params);
  },
  walletDetail(params){
    return pAJAX('/wallet/statement',params);
  },
  /*******************************************订单相关*********************************************************/
  gIndentList(params){
    return pAJAX('/order/myOrders',params);
  },
  gIndentDetail(params){
    return gAJAX(`/order/detail/${params}`);
  },
  myInquiries(params){
    return pAJAX('/order/myInquiries',params);
  },
  teamIndentList(params){
    return pAJAX('/team/orderList',params);
  },
  /*******************************************版本引导*********************************************************/
  versionLead(params){
    return pAJAX('/doctor/updateVersion',{version : params});
  },
  /*******************************************群发*********************************************************/
  gGroupNotify(page){
    return pAJAX('/tool/getPatientsNotify',{page : page});
  },
  dGroupNotify(page){
    return dAJAX(`/tool/patientsNotify/${page}`);
  },
  pGroupNotify(params){
    return pAJAX('/tool/sendPatientsNotify',params);
  },
  /*******************************************我的科普*********************************************************/
  addArticles(params){
    return pAJAX('/articles/addArticles',params);
  },
  myArticles(params){
    return pAJAX('/articles/myArticles',{page : params});
  },
  articles(params){
    return pAJAX('/articles/articles',params);
  },
  deleArticles(params){
    return pAJAX('/articles/disCollectArticles',{articles_id : params});
  },
  articleDetail(params){
    return gAJAX(`/articles/detailArticles/${params}`);
  },
  collectArticles(params){
    return pAJAX('/articles/collectArticles',{articles_id : params});
  },
  searchArticles(params){
    return pAJAX('/articles/articlesSearch',params);
  },
  articleUrl(url){
    return gAJAX(`/articles/url?url=${url}`);
  },
  /****************************************我的团队接口***************************************************/
  gainMyTeam(){
    return gAJAX('/team/myTeam');
  },
  getInfoByPhone(phone){
    return gAJAX(`/doctor/getInfoByPhone/${phone}`);
  },
  addTeam(params) {
    return pAJAX('/team/create', params);
  },
  updateTeam(id,params){
    return pAJAX(`/team/update/${id}`,params);
  },
  teamDetail(id){
    return gAJAX(`/team/detail/${id}`)
  },
  inviteTeamByPhone(id,params){
    return pAJAX(`/team/inviteByPhone/${id}`,params);
  },
  deleTeamMem(id,d_id){
    return dAJAX(`/team/delMember/${id}/${d_id}`)
  },
  teamChatSet(id,params){
    return pAJAX(`/team/chatSetting/${id}`,params)
  },
  joinTeam(id,params){
    return pAJAX(`/team/joinTeam/${id}`,params);
  },
  checkTeamMoney(team_id){
    return gAJAX(`/team/getAmount/${team_id}`);
  },
  teamBankList(team_id){
    return gAJAX(`/team/bankCards/${team_id}`)
  },
//  绑卡验证码
  teamBankCardCode(id){
    return pAJAX('/team/bandCardVerifyCode',id);
  },
  teamAddBankCard(id,params){
    return pAJAX(`/team/addBankCard/${id}`,params);
  },
  teamTransferRecord(id){
    return gAJAX(`/team/transferRecord/${id}`);
  },
  teamTransferDetail(id){
    return gAJAX(`/team/transferDetail/${id}`);
  },
  teamDBankCard(id){
    return pAJAX(`/team/unbindBank`,{team_bank_card_id : id})
  },
  teamIncomeDeatil(id,params){
    return pAJAX(`/team/income/${id}`,params);
  },
  gTeamIndentDetail(params){
    return gAJAX(`/team/orderDetail/${params}`);
  },
  teamWalletDetail(id,params){
    return pAJAX(`/team/statement/${id}`,params);
  },
  teamNoticeList(team_id){
    return gAJAX(`/team/notices/${team_id}`,);
  },
  teamNoticeAdd(team_id,fromData){
    let config = {
      headers:{'Content-Type':'multipart/form-data'}
    };
    return pAJAX(`/team/createNotice/${team_id}`,fromData,config);
  },
  teamNoticeDetail(team_id){
    return gAJAX(`/team/detailNotice/${team_id}`);
  },
  teamRejectMsg(team_id,status){
    return pAJAX(`/team/rejectMsg/${team_id}`,status);
  },
  teamChatHistory(params){
    return gAJAX(`/teamChat/history/${params.id}/${params.acc}?page=${params.page}`);
  },
  teamChatDocHistory(params){
    return gAJAX(`/teamChat/chatDocHistory/${params.id}?page=${params.page}${params.time ? '&timestamp='+params.time : ''}`);
  },
  teamDocChart(id){
    return gAJAX(`/team/teamDocCharterList/${id}`);
  },
  patTeamAtDoctor(params){
    return pAJAX(`/teamChat/patTeamAtDoctor/${params.id}/${params.acc}/${params.docAcc}`);
  },
  docTeamAtDoctor(params){
    return pAJAX(`/teamChat/docTeamAtDoctor/${params.id}/${params.docAcc}`);
  },
  teamReplayed(id,acc){
    return pAJAX(`/teamChat/replayed/${id}/${acc}`);
  },
  teamAmountCode(params){
    return pAJAX(`/team/transferVerifyCode`,params);
  },
  teamTransfer(id,params){
    return pAJAX(`/team/transfer/${id}`,params);
  },
  teamPatService(acc,id){
    return gAJAX(`/team/patientTeamOrder/${acc}/${id}`);
  },
  /****************************************专家合作团队***************************************************/
  myMeeting(){
    return gAJAX('/meeting/myMeeting');
  },
  createMeeting(params){
    let config = {
      headers:{'Content-Type':'multipart/form-data'}
    };
    return pAJAX('/meeting/createMeeting',params,config);
  },
  meetingView(id){
    return gAJAX(`/meeting/meetingView/${id}`);
  },
  expertsTeamqQrcode(id){
    return gAJAX(`/meeting/qrcode/${id}`);
  },
  meetingHelp(){
    return pAJAX('/meeting/meetingHelp');
  },
  meetingInfo(id){
    return gAJAX(`/meeting/meetingInfo/${id}`);
  },
  teamTmpQrcode(id,tag){
    return gAJAX(`/team/teamTmpQrcode/${id}${tag ? `?team_tag=${tag}` : ''}`);
  },
  addTeamTag(id){
    return pAJAX(`/team/inviteWxTeam/${id}`);
  },
  /****************************************电话咨询***************************************************/
  callList(params){
    return pAJAX('/call/callList',params);
  },
  getCallSetSwitch(){
    return gAJAX('/set/callSwitch');
  },
  setCallSwitch(params){
    return pAJAX('/set/callSetting',params);
  },
  callOrderDetail(id){
    return gAJAX(`/call/orderDetail/${id}`)
  },
  modifyCallTime({id,modify_time,content = ''}){
    return pAJAX(`/call/modifyCallTime/${id}`,{modify_time,content});
  },
  callbackPhone({id,from_phone,to_phone}){
    return pAJAX(`/call/callback/${id}`,{from_phone,to_phone});
  },
  callFinish(id){
    console.log(id);
    return pAJAX(`/call/finish/${id}`);
  },
  cancelCallOrder(id,reason){
    return pAJAX(`/call/cancelOrder/${id}`,{reason});
  },
  callPlan(order_no){
    return gAJAX(`/call/orderLog/${order_no}`);
  },
  /****************************************领取物料***************************************************/
  receiveAddressDetail(){
    return gAJAX('/doctorsReceive/receiveAddressDetail');
  },
  updatedReceiveAddress(params){
    return pAJAX('/doctorsReceive/updatedReceiveAddress',params);
  },
  createReceiveOrder(params){
    return pAJAX('/doctorsReceive/createReceiveOrder',params);
  }

}
