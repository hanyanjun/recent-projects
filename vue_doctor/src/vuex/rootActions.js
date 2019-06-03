/**
 * Created by Hardy on 2017/7/8.
 */
// 全局的action
import api from '../fetch/api'
import * as types from './types'
import axios from 'axios'
import router from "../router/index"
import {MessageBox,Toast} from '../components/hw-components'
import means from "../means/means";
export default {
  updateDocInfo (context){
    let result = means.analysisURL('tokenData');
    if (result){
      let result1 = JSON.parse(result);
      window.localStorage['token'] = result1.token;
      global.TOKEN =  result1.token;
      window.localStorage['refreshToken'] = result1.refreshToken;
      global.REFRESHTOKEN = result1.refreshToken;
      axios.defaults.headers.common['Authorization'] = window.btoa(unescape(encodeURIComponent(TOKEN)));
    }
    return new Promise((resolve)=>{
      let url = window.location.href;
      if(!/inviteDoctor/.test(url)){
        if(/share/.test(url)){
          //判断分享页面有没有account值
          if(!/noAcc/.test(url)){
            url = url.substring(url.indexOf('#/')+2);
            let acc = url.substring(0,url.indexOf('share')-1);
            axios.get(`${DOCLINKAPI}/doctor/share/${acc}`)
            .then(obj=>{
              obj.data.info.account = acc;
              context.commit(types.UPDATE_DOCSELFINFO,obj.data.info);;
              context.commit('IS_UPDATE_DOCINFO',false);
              context.commit(types.UPDATE_LOADING,false);
               resolve(obj.data);
            })
          }else{
            context.state.isLoading=false;
          }
        }else{
          api.initInfo()
            .then(obj=>{
              context.commit('IS_UPDATE_DOCINFO',false);
              let obj1 ={
                name : '',
                sex : '男',
                department : '',
                technical : '',
                skill : '',
                abstract : '',
                hope : '',
                hospital : '',
                hospitals_code : '',
                provinces_area_id : '',
                area_id : ' ',
                version : '0'
              }
              // obj.info.is_certified = '3';
              // if(!window.sessionStorage['test']){
              //     obj.info.isRegister = '2';
              //     obj.info.version = '0';
              // }else{
              //   obj.info.version = '0';
              // }
              // obj.info.long_free_switch = '2';
              console.log('更新医生信息！');
              //未注册情况
              if(obj.code == '10006'){
                obj1.isRegister = '2';
                Object.assign(obj,{info : obj1});
                if(router.history.current.meta !='undefined' && router.history.current.meta.showJudge == '1'){

                }else{
                  router.push({path : '/login'});
                }
              }else{
                context.commit(types.UPDATE_MESSAGE_LIST,obj.messages);
              }
              if(obj.info.isRegister == '2'){
                Object.assign(obj.info,obj1);
              }
              context.commit(types.UPDATE_LOADING,false);
              context.commit(types.UPDATE_DOCSELFINFO,obj.info);
              resolve(obj);
              //未完善信息的情况
              if(!(/addInfo/g).test(url)  && obj.info.isRegister == '2' && obj.code == '0'){
                router.push('/add/addInfo');
                context.commit(types.UPDATE_LOADING,false);
                resolve(obj);
                return;
              }
            })
        }
      }
    })
  },
  unReplayCount({state}){
    state.unReplay.status = false;
    state.unReplay.arr = [];
    api.undo().then((obj)=>{
      for(let key in obj){
        switch (key){
          case 'report_num':
            state.unReplay.arr.push({
              type : 'patientReport',
              count : obj[key],
              to : '/patientReport',
              // t1 : '报到',
              t1 : '[会员报到]',
              t2 : `您有${obj[key]}名新的会员报到！`
            });
            state.unReplay.num['patientReport'] = obj[key];
            break;
          case 'appoint_num':
            state.unReplay.arr.push({
              type : 'patientAppoint',
              count : obj[key],
              to : '/review/myOrder',
              // t1 : '预约',
              t1 : '[门诊预约]',
              t2 : `您有${obj[key]}条门诊预约申请！`
            });
            state.unReplay.num['appoint_num'] = obj[key];
            break;
          case 'order_num':
            state.unReplay.arr.push({
              type : 'patientOrder',
              count : obj[key],
              to : '/myIndent',
              // t1 : '订单',
              t1 : '[订单提醒]',
              t2 : `您有${obj[key]}条新的会员订单！`
            });
            state.unReplay.num['order_num'] = obj[key];
            break;
          case 'inquiry_num':
            state.unReplay.arr.push({
              type : 'patientConsult',
              count : obj[key],
              to : '/1/myItConsult',
              // t1 : '咨询',
              t1 : '[图文咨询]',
              t2 : `您有${obj[key]}条新的图文咨询！`
            });
            state.unReplay.num['inquiry_num'] = obj[key];
            break;
          case 'team_num':
            state.unReplay.arr.push({
              type : 'patientConsult',
              count : obj[key],
              to : '/4/myItConsult',
              // t1 : '咨询',
              t1 : '[团队咨询]',
              t2 : `您有${obj[key]}条新的团队咨询！`
            });
            state.unReplay.num['team_num'] = obj[key];
            break;
          case 'call_num':
            state.unReplay.arr.push({
              type : 'patientConsult',
              count : obj[key],
              to : '/1/callList',
              // t1 : '咨询',
              t1 : '[电话咨询]',
              t2 : `您有${obj[key]}条新的电话咨询！`
            });
            state.unReplay.num['call_num'] = obj[key];
            break;
        }
      }
    })
  },
  setDocTitle({state},payload){
    let setDocumentTitle = function (title) {
      document.title = title;
      // let ua = navigator.userAgent;
      // if (/\bMicroMessenger\/([\d\.]+)/.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
        var i = document.createElement('iframe');
        i.style.display = 'none';
        i.onload = function () {
          setTimeout(function () {
            i.remove();
          }, 0);
        };
        document.body.appendChild(i);
      // }
    };
      switch (payload){
        case 'doctorWork':
          //不是聊天界面  清除掉原来的待回复 队列
          // window.sessionStorage['unReadTipCount'] = '';
          setDocumentTitle( state.docInfo.name == undefined ? '' :  `${state.docInfo.wx_title ||  state.docInfo.name + '医生工作室'}`);
        break;
        case 'patientName':
          setDocumentTitle(`${state.chat.patInfo.remark_name || state.chat.patInfo.name}`);
         break;
        case undefined :
          setDocumentTitle('');
        break;
        default :
          setDocumentTitle(payload);
      }
  },
  wxinitial(context,payload){
    return new Promise((resolve,reject)=>{
      api.wxjsapi(payload)
        .then(obj=>{
          console.log(obj);
          console.log('%c微信jssdk配置初始化成功....','background:green;color:white;')
          wx.config({
            beta: true, //这个很重要，必须配置这个为true,才能调用微信的硬件API
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: obj.JsAppInfo.appId, // 必填，公众号的唯一标识
            timestamp: obj.JsAppInfo.timestamp, // 必填，生成签名的时间戳
            nonceStr: obj.JsAppInfo.nonceStr, // 必填，生成签名的随机串
            signature: obj.JsAppInfo.signature,// 必填，签名，见附录1
            jsApiList: [
              // 隐藏分享相关
              "hideMenuItems",
              //显示分享相关
              "showMenuItems",
              //  分享相关
              'onMenuShareTimeline','onMenuShareAppMessage',
              // 扫一扫
              'scanQRCode',
              // 语音相关s
              "startRecord","stopRecord","onVoiceRecordEnd","downloadVoice","uploadVoice","playVoice","pauseVoice","onVoicePlayEnd",
              // 微信支付
              "chooseWXPay",
              //  获取网络
              // "getNetworkType"
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(function(){
            // wx.getNetworkType({
            //   success: function (res) {
            //     // var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
            //     alert(res.networkType);
            //   }
            // });

            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            // wx.hideMenuItems({
            //   menuList: ["menuItem:share:appMessage","menuItem:favorite","menuItem:share:qq","menuItem:share:timeline","menuItem:share:weiboApp","menuItem:share:QZone","menuItem:share:facebook", "menuItem:copyUrl", "menuItem:openWithQQBrowser", "menuItem:openWithSafari", "menuItem:share:email"]
            //   // menuList: ["menuItem:favorite","menuItem:share:qq","menuItem:share:weiboApp","menuItem:share:QZone","menuItem:share:facebook", "menuItem:openWithQQBrowser", "menuItem:openWithSafari", "menuItem:share:email"]
            //
            //   // menuList: ["menuItem:favorite","menuItem:share:qq","menuItem:share:weiboApp","menuItem:share:QZone","menuItem:share:facebook", "menuItem:copyUrl", "menuItem:openWithQQBrowser", "menuItem:openWithSafari", "menuItem:share:email"]
            // });
            resolve('');
          });
          wx.error(function(res){
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            reject(res);
          });
        })
    })
  },
  wxHideShare(){
    wx.hideMenuItems({
      menuList: ["menuItem:share:appMessage","menuItem:favorite","menuItem:share:qq","menuItem:share:timeline","menuItem:share:weiboApp","menuItem:share:QZone","menuItem:share:facebook","menuItem:openWithQQBrowser", "menuItem:openWithSafari", "menuItem:share:email","menuItem:share:brand","menuItem:readMode","menuItem:originPage","menuItem:delete","menuItem:editTag"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
    });
  },
  wxShowShare(){
    wx.showMenuItems({
      menuList: ["menuItem:share:appMessage","menuItem:share:timeline"] // 要显示的菜单项，所有menu项见附录3
    });
  },
//  设置微信分享相关的配置
  wxShareTimeLineT(context,payload){
    return new Promise((resolve)=>{
      wx.onMenuShareTimeline({
        title: payload.title, // 分享标题
        link: payload.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: payload.img ? payload.img : 'http://doctor-patient.hiwein.com/doctor/media/img/logo-bg.png', // 分享图标
        success: function () {
          context.dispatch('wxHideShare');
          resolve('成功');
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          context.dispatch('wxHideShare');
          resolve('取消');
          // 用户取消分享后执行的回调函数
        }
      });
    })
  },
  wxShareAppMessageT(context,payload){
    return new Promise((resolve)=>{
      wx.onMenuShareAppMessage({
      title: payload.title, // 分享标题
      desc: payload.desc, // 分享描述
      link:payload.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: payload.img ? payload.img : 'http://doctor-patient.hiwein.com/doctor/media/img/logo-bg.png', // 分享图标
      type: '', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function () {
        context.dispatch('wxHideShare');
        resolve('成功');
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        context.dispatch('wxHideShare');
        resolve('取消');
        // 用户取消分享后执行的回调函数
      }
    })
    })
  },




  wxVoiceAuth(){
    let allowRecord = window.localStorage['allowRecord'];
    if(typeof allowRecord == 'undefined' || allowRecord != '1'){
      wx.startRecord({
        success : function(){
          wx.stopRecord();
          window.localStorage['allowRecord'] = '1';
        },
        cancle : function(){
          alert('用户拒绝授权录音')
        }
      })
    }
  },
//  点击 未认证之后的处理
  handleCertifiedClick({state},payload){
    return new Promise((resolve)=>{
      switch (state.docInfo.is_certified){
        case '2':
          MessageBox.confirm('您还未通过医生认证,是否现在去个人中心提交认证?').then(obj=>{
            router.push({path : '/certificate/addInfo'});
          });
          break;
        case '3':
          Toast('认证中，功能暂不可用，请耐心等待！');
          break;
        case '1':
          if(payload && payload.path){
            router.push(payload.path);
          }
          resolve();
      }
    })
  },
  gainWalletType({state}){
       let wallet = window.sessionStorage['walletType'];
       if(wallet){
         state.walletType = JSON.parse(wallet);
       }else{
         state.walletType = {type : 'self'};
       }
  },
//  聊天相关
//图片预览
  wxImgView({state},src){
    wx.previewImage({
      current: src,
      urls: state.img // 需要预览的图片http链接列表
    });
  },
  wxRich(){
    wx.scanQRCode({
      needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
        console.log(result);
      }
    })
  }
}
