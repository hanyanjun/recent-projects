/**
 * Created by HIWEIN008 on 2017/7/17.
 */


//聊天模块
import api from '../../fetch/api'
import WS from '../../libs/chat'
import *  as types from '../types'
import meas from '../../means/means'
import {MessageBox} from '../../components/hw-components'
const chat = {
  state : {
     messageList : [],
     chatData : [],
     //存储当前的连接
     conn :'',
  //   聊天对方的一些信息
     patInfo : '',
  //  历史记录的时间
     recordTime : 0,
  //  显示的时间
     showTime : 0,
  //  聊天分页
      page : 0,

  },
  getters :{
     msgCount: state=>{
       let count = 0 ,orderCount = 0 ,reportCount = 0;
       (state.messageList).forEach((v,i)=>{
         switch (v.from ){
           case  'patientReport' :
             reportCount += v.showCount;
           break;
           case  'patientAppoint' :
             orderCount += v.showCount;
             break;
         }
         count += v.showCount;
       })
       count -= reportCount;
       return {count,orderCount,reportCount};
     }
  },
  mutations : {
    [types.UPDATE_MESSAGE_LIST](state,payload){
      console.log(payload);
       state.messageList = payload;
    },
    [types.UPDATE_CHAT_DATA](state,payload){
      let lastTime  = parseInt(state.showTime);
      let time = parseInt(payload.data.timestamp);
      let timer =  new Date();
      let res = new RegExp(timer.getFullYear() +'/'+(timer.getMonth()+1)+'/'+timer.getDate());
      if (lastTime == 0  || (time-lastTime) > 300000) {
        state.showTime = time;
        time = new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/,' ');
        time= time.replace(res,'');
        payload.data.time = time;
        ////          $('.container .content').append('<span class="chatTime"><span>'+time+'</span></span>');
      }else{
        payload.data.time = '';
      }
       state.chatData.push(payload);
    },
    [types.UPDATE_CHAT_RECORD](state,payload){
      let lastTime  = parseInt(state.recordTime);
      let time = parseInt(payload.data.timestamp);
      let timer =  new Date();
      let res = new RegExp(timer.getFullYear() +'/'+(timer.getMonth()+1)+'/'+timer.getDate());
      if (lastTime == 0  || (time-lastTime) < -300000) {
        state.recordTime = time;
        time = new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/,' ');
        time= time.replace(res,'');
        payload.data.time = time;
        ////          $('.container .content').append('<span class="chatTime"><span>'+time+'</span></span>');
      }else{
        payload.data.time = '';
      }
       state.chatData.unshift(payload);
    },
    [types.UPDATE_CHAT_PATINFO](state,payload){
        state.patInfo = payload;
    },
    [types.SET_CHAT_CONN](state,payload){
       state.conn = payload;
    },
    [types.CLEAR_CHAT_STATE](state){
        state.chatData = [];
        state.patInfo = '';
        state.recordTime = 0;
        state.showTime = 0;
        state.page = 0
    }
  },
  actions : {
    messageInit({commit,rootGetters}){
      let docAcc = rootGetters.docAcc;
      let message = window.localStorage['message'];
      let msg = [];
      let result;
      if(typeof message == 'undefined'){
          msg[0] = {
            version : '1.0',
            selfAccount : docAcc,
            content : []
          }
          commit('UPDATE_MESSAGE_LIST',msg[0].content);
          window.localStorage['message'] = JSON.stringify(msg);
      }else{
         message = JSON.parse(message);
         result  = message.some((v,i)=>{
            if(v.selfAccount == docAcc){
              let arr = meas.bubbleSort(v.content);
              message[i].content = arr;
              message[i].content.forEach((vv,ii)=>{
                  if(!vv.hasOwnProperty('hx_acccount') && !vv.hasOwnProperty('system')){
                    api.hxPatInfo(vv.from)
                      .then(obj=>{
                        message[i].content[ii].name = obj.patient.name ? obj.patient.name : obj.patient.nick;
                        message[i].content[ii].account = obj.patient.account;
                        message[i].content[ii].headimg = obj.patient.headimg;
                        commit('UPDATE_MESSAGE_LIST',message[i].content);
                        window.localStorage['message'] = JSON.stringify(message);
                      })
                  }else{
                      commit('UPDATE_MESSAGE_LIST',message[i].content);
                      window.localStorage['message'] = JSON.stringify(message);
                  }
              })
            }
           return v.selfAccount == docAcc;
         })
        if(!result){
          msg[0] = {
            version : '1.0',
            selfAccount : docAcc,
            content : []
          }
          message.unshift(msg[0]);
          commit('UPDATE_MESSAGE_LIST',msg[0].content);
        }
        window.localStorage['message']  = JSON.stringify(message);
      }
    },
    clearSysCount({commit,rootState},payload){
      let message = JSON.parse(window.localStorage['message']);
      message.forEach((v,i)=>{
         if(v.selfAccount == rootState.docInfo.account){
           v.content.forEach((vv,ii)=>{
               if(vv.from == payload){
                 v.content[ii].showCount = 0;
               }
           })
           commit('UPDATE_MESSAGE_LIST',v.content);
         }
      })
      window.localStorage['message'] = JSON.stringify(message);
    },

    connConfig({commit,state,rootState,dispatch}){
      let docAcc = rootState.docInfo.hx_account;
      let patAcc = state.patInfo.hx_account;
        //判断是否有accout 决定是否做登录处理
        if(docAcc){
          api.chatToken()
            .then(obj=>{
              let conn = new WS();
              //连接配置
              conn.init(`${CHATLINK}?chat_token=${obj.chat_token}`);
              commit('SET_CHAT_CONN',conn);
              conn.listen({
                // 连接成功的回调
                onOpen : function(){
                  conn.login(docAcc);
                },
                // 登录成功之后的回调
                onLogin : function(mes){
                  // 聊天基本设置
                  conn.chatMsgSet({origin : 'chat', chatType : 'single' , from : docAcc ,to : patAcc });
                },
                // 接收到文本消息
                onTextMessage : function(mes){
                  dispatch('storeMessage',{type :'text',msg : mes});
                  // _this.handleMessage('text',mes);
                },
                onImgMessage : function(mes){
                  dispatch('storeMessage',{type :'img',msg : mes});
                  commit('SET_IMG_ARR',{way : 'push' , msg : mes},{root : true})
                },
                onVoiceMessage : function(mes){
                  dispatch('storeMessage',{type :'voice',msg : mes});
                },
                onChartMessage : function(mes){
                  dispatch('storeMessage',{type :'chart',msg : mes});
                },
                onDataMessage : function(mes){

                },
                // 收到解除和添加关系
                onRelation : function(mes){
                  dispatch('handlePresence',{type :'relation',msg : mes});
                  // _this.handlePresence(mes);
                },
                onSysMessage : function (mes) {
                  console.log(mes);
                  dispatch('storeMessage',{type :'system',msg : mes});
                },
                // 收到文本的阅读状态
                onReadState : function(mes){
                  dispatch('storeMessage',{type :'text',msg : mes});
                },
                // 收到消息是否发送成功状态
                onSendState : function(data){
                  switch (data.code){
                    case  2000:
                      console.log('在线消息发送成功');
                      dispatch('storeMessage1',{type :data.data.data.type,msg : data.data});
                      if(data.data.data.type == 'img'){
                        commit('SET_IMG_ARR',{way : 'push' , msg : data.data},{root : true});
                      }
                      // _this.handleMessage(data.data.data.msgType,data.data,'sendSuccess');
                      break;
                    case  2001:
                      console.log('在线消息发送失败')
                      break;
                    case  2010:
                      console.log('离线消息发送成功')
                      dispatch('storeMessage1',{type :data.data.data.type,msg : data.data});
                      if(data.data.data.type == 'img'){
                        commit('SET_IMG_ARR',{way : 'push' , msg : data.data},{root : true});
                      }
                      // _this.handleMessage(data.data.data.msgType,data.data,'sendSuccess');
                      break;
                    case  2011:
                      console.log('离线消息发送失败')
                      // dispatch('storeMessage',{type :data.data.data.msgType,msg : mes});
                      break;
                    case  2100:
                      console.log('消息发送中');
                      break;
                    case  2101:
                      console.log('消息发送失败');
                      break;
                  }
                },
                // 连接失败
                onError : function(mes){
                  console.log(mes);
                },
                // 连接失败
                onClose : function(mes){
                  console.log(mes);
                },
                // 被挤下线的回调
                onOffLine : function(mes){
                  MessageBox.confirm('您已断开连接,是否重新登录').then(()=>{
                       dispatch('connConfig');
                  })
                }
              })
            })
        }
    },
    //收到会员的消息
    storeMessage({commit,rootGetters,state},obj){
      console.log(obj);
        let type = obj.type , msg = obj.msg , newss , data = msg.data , message = JSON.parse(window.localStorage['message']);
        let selfId = rootGetters.docAcc;
        let url = window.location.href;
        let isChat = /chat/g.test(url);
        let selfMessage;
        switch (type) {
          case 'text':
            newss = data.text;
            break;
          case 'img':
            newss = '[图片]';
            break;
          case 'chart':
            newss = '[图表]';
            break;
          case 'data':
            newss = '[测评]';
            break;
          case 'voice':
            newss = '[语音]'
            break;
          case 'system':
            newss = data.text;
            break;
        }
      if(type == 'system'){
        obj.msg.from = msg.action;
      }
        let obj1 = {
            from : msg.from,
            to : msg.to,
            newNews : newss,
            timestamp : `${msg.timestamp.toString()}000`,
            version : msg.version
        }
        if(type == 'system'){
           obj1.system = true;
        }
        message.forEach((v,i)=>{
           if(v.selfAccount == selfId){
             console.log('原来数据有自己的数据');
              let result =  v.content.some((vv,ii)=>{
                   //判断消息来源是否在原来数据中存在
                   if(vv.from == msg.from){
                       console.log('原来数据中有聊天对象的数据');
                       let obj2 =  v.content[ii];
                       Object.assign(obj2,obj1);
                        v.content= v.content.removeByValue(v.content[ii]);
                       obj2.showCount ++;
                      //是否是聊天界面
                       if(isChat) {
                         //是否是当前聊天对象
                         console.log('是聊天界面');
                         if (msg.from == state.patInfo.hx_account) {
                           console.log('是当前的聊天对象');
                           obj2.showCount = 0;
                           commit('UPDATE_CHAT_DATA',msg);
                         }
                       }
                       v.content.unshift(obj2);
                       selfMessage = v;
                     window.localStorage['message'] = JSON.stringify(message);
                     commit('UPDATE_MESSAGE_LIST',selfMessage.content);
                   }
                   return  vv.from == msg.from;
               })
             if(!result){
                console.log('找到相同的对象')
                //是否是聊天界面
                 if(isChat){
                   //是否是当前的聊天对象
                   if(msg.from == state.patInfo.hx_account){
                     obj1.showCount = 0;
                     console.log(2)
                     commit('UPDATE_CHAT_DATA',msg);
                   }else{
                     obj1.showCount = 1;
                   }
                 }
                 //不是聊天界面
                 else{
                   obj1.showCount = 1;
                 }
                 if(type != 'system'){
                   api.hxPatInfo(obj1.from)
                     .then(obj=>{
                       obj1.name = obj.patient.name ? obj.patient.name : obj.patient.nick;
                       obj1.account = obj.patient.account;
                       obj1.headimg = obj.patient.headimg;
                       v.content.unshift(obj1);
                       selfMessage = v;
                       commit('UPDATE_MESSAGE_LIST',selfMessage.content);
                       window.localStorage['message'] = JSON.stringify(message);
                     })
                 }else{
                     v.content.unshift(obj1);
                     selfMessage = v;
                     commit('UPDATE_MESSAGE_LIST',selfMessage.content);
                     window.localStorage['message'] = JSON.stringify(message);
                 }
             }
           }
        })
    },
    //收到发送消息的成功的返回
    storeMessage1({commit,rootGetters,state},obj){
      console.log(obj);
      let type = obj.type , msg = obj.msg , newss , data = msg.data , message = JSON.parse(window.localStorage['message']);
      let selfId = rootGetters.docAcc;
      let url = window.location.href;
      let isChat = /chat/g.test(url);
      let selfMessage;
      switch (type) {
        case 'text':
          newss = data.text;
          break;
        case 'img':
          newss = '[图片]';
          break;
        case 'chart':
          newss = '[图表]';
          break;
        case 'data':
          newss = '[测评]';
          break;
        case 'voice':
          newss = '[语音]'
          break;
      }
      //要存在本地的消息列表
      let obj1 = {
        from : msg.to,
        to : msg.from,
        newNews : newss,
        timestamp : `${msg.timestamp.toString()}000`,
        version : msg.version
      }
      message.forEach((v,i)=>{
        if(v.selfAccount == selfId){
          let result =  v.content.some((vv,ii)=>{
            //判断消息来源是否在原来数据中存在
            if(vv.from == msg.to){
              let obj2 =  v.content[ii];
              Object.assign(obj2,obj1);
              v.content = v.content.removeByValue(v.content[ii]);
              obj2.showCount ++;
              //是否是聊天界面
              if(isChat) {
                //是否是当前聊天对象
                if (msg.to == state.patInfo.hx_account) {
                  obj2.showCount = 0;
                  // commit('UPDATE_CHAT_DATA',msg);
                }
              }
              v.content.unshift(obj2);
              selfMessage = v;
              window.localStorage['message'] = JSON.stringify(message);
              commit('UPDATE_MESSAGE_LIST',selfMessage.content);
            }
            return  vv.from == msg.to;
          })
          if(!result){
            //是否是聊天界面
            if(isChat){
              //是否是当前的聊天对象
              if(msg.to == state.patInfo.hx_account){
                obj1.showCount = 0;
                // commit('UPDATE_CHAT_DATA',msg);
              }else{
                obj1.showCount = 1;
              }
            }
            //不是聊天界面
            else{
              obj1.showCount = 1;
            }
            obj1.name = state.patInfo.name ? state.patInfo.name : state.patInfo.nick;
            obj1.account = state.patInfo.account;
            obj1.headimg = state.patInfo.headimg;
            v.content.unshift(obj1);
            selfMessage = v;
            commit('UPDATE_MESSAGE_LIST',selfMessage.content);
            window.localStorage['message'] = JSON.stringify(message);
            // api.hxPatInfo(obj1.from)
            //   .then(obj=>{
            //     obj1.name = obj.patient.name ? obj.patient.name : obj.patient.nick;
            //     obj1.account = obj.patient.account;
            //     obj1.headimg = obj.patient.headimg;
            //     v.content.unshift(obj1);
            //     selfMessage = v;
            //     commit('UPDATE_MESSAGE_LIST',selfMessage);
            //     window.localStorage['message'] = JSON.stringify(message);
            //   })
          }
        }
      })
    },
    handlePresence(){




    },
    sendMsg({commit,state,rootState},payload){
        let t = payload.type;
        let noticeMsg;
        switch (t){
          case 'img':
            noticeMsg = '图片消息';
            break;
          case 'voice':
            noticeMsg = '语音消息';
            break;
          case 'chart':
            noticeMsg = '图表消息'
            break;
          case 'data':
            noticeMsg = "数据消息";
            break;
          case 'text':
            noticeMsg = payload.text;
            break;
        }
        return new Promise((resolve)=>{
          api.isSendNotice({id : state.patInfo.account , msg : noticeMsg})
            .then(obj=>{
              //说明双方是好友关系
              if(obj.relation == '4'){
                if(t == 'img'){
                  api.chatImage(payload.text).then(obj1=>{
                    //    调用conn 的send方法
                      console.log(obj1);
                      let obj2 = {
                        width : obj1.width ,
                        height : obj1.height ,
                        src : obj1.images[0]
                      }
                    state.conn.send({
                      type : t,
                      text : payload.text,
                      from : rootState.docInfo.hx_account,
                      to : state.patInfo.hx_account,
                      fromName : rootState.docInfo.name,
                      toName : state.patInfo.name,
                      timestamp : '',
                      readyState : ''
                    })
                    resolve('');

                  })
                }else{
                    state.conn.send({
                      type : t,
                      text : payload.text,
                      from : rootState.docInfo.hx_account,
                      to : state.patInfo.hx_account,
                      fromName : rootState.docInfo.name,
                      toName : state.patInfo.name,
                      timestamp : '',
                      readyState : ''
                    })
                    resolve('');
                }
              }else{
                if(obj.relation=='2'){
                  resolve('您还未被会员关注,<span>点击发送</span>会员关注!');
                }else if(obj.relation == '3'){
                  resolve('您已删除该会员,请到主页会员报到处重新添加!');
                }else{
                  resolve('你们已解除好友关系,请重新进行互加好友操作!');
                }
              }
            })
        })
    },
    updatePatinfo({commit,dispatch,state},payload){
       let url = window.location.href;
        return new Promise((resolve)=>{
          if(/chat/g.test(url)){
            //清除掉之前所有数据
            commit('CLEAR_CHAT_STATE');
            api.patInfo(payload)
              .then(obj=>{
                //更新用户信息
                commit('UPDATE_CHAT_PATINFO',obj.info);
                //获取聊天记录
                // dispatch('gainRecord');
                // console.log(state.scroll.refresh);
                // state.scroll.update();
                resolve(obj);
              })
          }else{
            resolve();
          }
        })
    },
    updateChatSet({state,rootState}){
      if(/chat/g.test(window.location.href) && state.conn){
         state.conn.chatMsgSet({origin : 'chat', chatType : 'single' , from : rootState.docInfo.hx_account ,to : state.patInfo.hx_account});
      }
    },
    clearCount({commit,rootGetters},payload){
      return new Promise((resovle)=>{
        let message = JSON.parse(window.localStorage['message']);
        let docAcc = rootGetters.docAcc;
        message.forEach((v,i)=>{
           if(v.selfAccount == docAcc){
               v.content.forEach((vv,ii)=>{
                   if(vv.from == payload){
                     v.content[ii].showCount = 0;
                   }
               })
             commit('UPDATE_MESSAGE_LIST',message[i].content);
           }
        })
        window.localStorage['message'] = JSON.stringify(message);
        resovle();
      })
    },
    gainRecord({commit,state}){
      //        初始化聊天相关的信息
      let timestamp = Date.parse(new Date());
      let page = 0;
      //清除掉之前的img
      commit('SET_IMG_ARR',{way : 'clear' },{root : true});
      // api.addOldRecord(state.patInfo.account,{page,timestamp})
      //   .then(obj=>{
      //     if(obj.chats.length == 0){
            api.newChatRecord(state.patInfo.account,{page,timestamp})
              .then(obj=>{
                let length = obj.chats.length;
                for(let i = length-1 ; i > -1 ; i--){
                  commit('UPDATE_CHAT_DATA',obj.chats[i]);
                  if(obj.chats[i].data.type == 'img'){
                    commit('SET_IMG_ARR',{way : 'push' ,msg : obj.chats[i]},{root : true});
                  }
                }
              })
        //   }
        // })
    },
    addRecord({commit},payload){
      if(payload.data.type == 'img'){
        commit('SET_IMG_ARR',{way : 'unshift',msg : payload},{root : true});
      }
      commit('UPDATE_CHAT_RECORD',payload);
    }
  }
}
export default chat;
