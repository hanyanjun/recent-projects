/**
 * Created by HIWEIN008 on 2017/8/16.
 */
/**
 * Created by HIWEIN008 on 2017/7/17.
 */


//聊天模块
import api from '../../fetch/api'
import WS from '../../libs/chat'
import *  as types from '../types'
import route  from '../../router/index'
import {MessageBox,Toast,Indicator} from '../../components/hw-components'
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
    page : 1,
  //  用户的服务状态
    patService : {},
  //  用户是否登录聊天的状态
    isLoginChat : false,
  //  滚动插件状态
    scrollTo : 'bottom',
  // 群发时候已发送的条数
    groupNewsCount : 0,
  //  团队id
    teamId : 0,
    chatType : '',
    groubackReply : false,
    is_member : true, //是否是团队成员的状态
  },
  getters :{
    msgCount: state=>{
      let count = 0 ,orderCount = 0 ,reportCount = 0,indentCount = 0;
      (state.messageList).forEach((v,i)=>{
        if (v.from === 'patientReport') {
          reportCount += v.unread_num;
        } else if (v.from === 'patientAppoint') {
          orderCount += v.unread_num;
        } else if (v.from === 'patientOrder') {
          indentCount += v.unread_num;
        }
        count += v.unread_num;
      })
      count -= reportCount;
      return {count,orderCount,reportCount,indentCount};
    },
    chatDataIndex : state=>{
      return state.chatData.length-1;
    }
  },
  mutations : {
    [types.UPDATE_MESSAGE_LIST](state,payload){
      state.messageList = [];
      // console.log(payload);
      // payload.forEach((v)=>{
      //   if(v.from.split('_')[1]){
      //     v.face =  `${PATLINKAPI}/patient/face/${v.from.split('_')[1]}?${Date.parse(new Date())}`;
      //   }
      // })
      state.messageList = Object.assign([],payload);
    },
    [types.IS_LOGIN_CHAT](state,payload){
      state.isLoginChat = payload;
    },
    [types.UPDATE_CHAT_SERVICE](state,payload){
      //转化剩余天数
      let start = payload.order_start;
      let end = payload.order_end;
      let  replay = payload.replay_time;
      payload.data = {};
      // let obj;
      if(payload) {
        payload.data = {};
      }
      // }else{
      //   obj = {
      //     data : {
      //       type : 'chat_replay_tip'
      //     },
      //     count_remain: "1",  //剩余次数
      //     count_usage: "1",  //购买时可用次数，0无限
      //     order_end: 1512403199, //服务开始时间
      //     order_start: 1504512512,  //服务结束时间
      //     order_status: "4",  // 服务状态2进行中3取消4结束
      //     order_type: "3",  //服务类型2图文咨询（按次）3图文咨询（按期）4随访/免费
      //     replay_status: "2", //医生回复状态1新咨询2待回复3已回复
      //     replay_time: ""  //医生最后回复时间
      //   }
      //   state.patServiceSet = obj;
      // }
      if(start  && start == end){
        payload.day = 0;
        payload.hour = 0;
      }else{
        //为待回复状态 计算时间是否超过
        if(payload.replay_status == '2' || payload.replay_status == '1'){
          let starttime = Date.parse(new Date()).toString();
          starttime = starttime.substr(0,10);
          let endtime = payload.order_end;
          let timeCha = Math.ceil((endtime-starttime)/86400);
          let timeCha2 = Math.ceil((endtime-payload.order_start)/86400);
          if(timeCha == timeCha2){
            --timeCha;
          }
          payload.day = timeCha;
          if(replay == ''){
            payload.hour = 0;
          }else{
            payload.hour =  Math.ceil((Date.parse(new Date()) - parseInt(`${replay}000`)) /(60 * 60 * 1000 ));
          }
        }
      }
      payload.data.type = 'chat_replay_tip';
      console.log(payload);
      state.patService = payload;
    },
    [types.UPDATE_CHAT_DATA](state,payload){
      if(payload && payload.data){
        let lastTime  = parseInt(state.showTime);
        let time = parseInt(payload.data.timestamp);
        let timer =  new Date();
        let res = new RegExp(timer.getFullYear() +'/'+(timer.getMonth()+1)+'/'+timer.getDate());
        if (lastTime == 0  || (time-lastTime) > 300000) {
          state.showTime = time;
          time = new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/,' ');
          time= time.replace(res,'');
          if(time){
            if(/GMT\+8/.test(time)){
              time = time.replace(/GMT\+8/,'');
            }
          }
          payload.data.time = time;
        }else{
          payload.data.time = '';
        }
      }
      state.chatData.push(payload);
    },
    [types.UPDATE_CHAT_RECORD](state,payload){
      let lastTime  = parseInt(state.recordTime);
      let time = parseInt(payload.data.timestamp);
      let timer =  new Date();
      let res = new RegExp(timer.getFullYear() +'/'+(timer.getMonth()+1)+'/'+timer.getDate());
      //团队成员加入 提醒 不计算时间   其他不需要显示时间的类似
      if(payload.data.type != 'team_join'){
        if (lastTime == 0  || (time-lastTime) < -300000) {
          state.recordTime = time;
          time = new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/,' ');
          time= time.replace(res,'');
          if(time){
            if(/GMT\+8/.test(time)){
              time = time.replace(/GMT\+8/,'');
            }
          }
          payload.data.time = time;
        }else{
          payload.data.time = '';
        }
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
    connConfig({commit,state,rootState,dispatch}){
      let docAcc = rootState.docInfo.hx_account;
      //判断是否有accout 决定是否做登录处理
      if(docAcc){
        commit('IS_LOGIN_CHAT',true);
        let conn = new WS();
        api.chatToken()
          .then(obj=>{
            //连接配置
            conn.init(`${CHATLINK}?chat_token=${obj.chat_token}`,docAcc);
            commit('SET_CHAT_CONN',conn);
            conn.listen({
              // 连接成功的回调
              onOpen : function(){
                conn.login();
              },
              // 登录成功之后的回调
              onLogin : function(mes){
                // 聊天基本设置
                dispatch('updateChatSet');
                // conn.chatMsgSet({origin : 'chat', chatType : 'single' , from : docAcc ,to : state.patInfo.hx_account });
              },
              // 接收到文本消息
              onTextMessage : function(mes){
                dispatch('storeMessage',{type :'text',msg : mes});
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
                commit('IS_UPDATE_CONTACTS',true);
                dispatch('handlePresence',{type :'relation',msg : mes});
                // _this.handlePresence(mes);
              },
              onSysMessage : function (mes) {
                //被移除团队的系统消息
                if(mes.action == 'teamDoctorRemoved'){
                   if(state.teamId == mes.data.team_id){
                     state.is_member = false;
                     commit('UPDATE_CHAT_DATA',mes);
                   }
                }else{
                  dispatch('storeMessage',{type :'system',msg : mes});
                }
              },
              onMultipleChat : function(mes){
                //如果是在 团队咨询列表页面 则刷新列表页面数据
                if(/teamMessage/g.test(document.URL) && mes.action ==  'sendDocTeam'){
                  dispatch('teamList');
                }
              //  多人聊天 ：有医生之间 和 用户与医生之间
                if(mes.action == state.chatType && state.teamId == mes.team_id ){
                  switch (state.chatType){
                    case "sendPatDocTeam":
                    if(mes.from == state.patInfo.hx_account || /doctor/.test(mes.from)){
                      if(mes.data.type != '@'){
                        if(mes.from == state.patInfo.hx_account){
                          state.patService.replay_status = '2';
                        }else{
                          state.patService.replay_status = '3';
                        }
                        commit('UPDATE_CHAT_SERVICE',state.patService);
                      }
                      commit('UPDATE_CHAT_DATA',mes);
                      if(mes.data.type == 'img'){
                        commit('SET_IMG_ARR',{way : 'push' , msg : mes},{root : true})
                      }
                    }
                    break;
                    case "sendDocTeam" :
                      commit('UPDATE_CHAT_DATA',mes);
                      if(mes.data.type == 'img'){
                        commit('SET_IMG_ARR',{way : 'push' , msg : mes},{root : true})
                      }
                    break;
                    default :
                      console.log('多人');
                  }
                }
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
                    //消息发送成功 改变订单服务状态
                    state.patService.replay_status = '3';
                    commit('UPDATE_CHAT_SERVICE',state.patService);
                    // setTimeout(()=>{
                      dispatch('storeMessage1',{type :data.data.data.type,msg : data.data});
                      if(data.data.data.type == 'img'){
                        commit('SET_IMG_ARR',{way : 'push' , msg : data.data},{root : true});
                      }
                    // },3000);
                    // _this.handleMessage(data.data.data.msgType,data.data,'sendSuccess');
                    break;
                  case  2001:
                    console.log('在线消息发送失败')
                    break;
                  case  2010:
                    console.log('离线消息发送成功');
                    //消息发送成功 改变订单服务状态
                    state.patService.replay_status = '3';
                    commit('UPDATE_CHAT_SERVICE',state.patService);


                    // setTimeout(()=>{
                      dispatch('storeMessage1',{type :data.data.data.type,msg : data.data});
                      if(data.data.data.type == 'img'){
                        commit('SET_IMG_ARR',{way : 'push' , msg : data.data},{root : true});
                      }
                    // },3000);
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
                // MessageBox.confirm('您已断开连接,是否重新连接？').then(()=>{
                  dispatch('connConfig');
                // })
              },
              // 被挤下线的回调
              onOffLine : function(mes){
                MessageBox.confirm('您已断开连接,是否重新登录',{btn : ['登录','下线']}).then(()=>{
                  dispatch('connConfig');
                })
              }
            })
          })
      }
    },
    //收到会员或者医生的消息
    storeMessage({commit,rootGetters,state,rootState,dispatch},obj){
      state.scrollTo = 'bottom';
      let type = obj.type , msg = obj.msg , newss , data = msg.data , message = state.messageList;
      let selfId = rootGetters.docAcc;
      let url = window.location.href;
      let isChat = /chat/g.test(url);
      let selfMessage;
      switch (type) {
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
        default :
           newss =  data.text;
           break;
      }
      if(type == 'system'){
        msg.from = msg.action;
      }
      if((data.type == 'patient_order'  || data.type == 'inquiry_service' || data.type == 'family_service' ) ){
        dispatch('updateDocInfo');
        if(data.type == 'inquiry_service' || data.type == 'family_service'){
          api.gIndentDetail(data.order_no).then(obj1=>{
            if(data.from == state.patInfo.hx_account){
              commit('UPDATE_CHAT_SERVICE',obj1.data);
            }
          })
        }else{
          if(state.patInfo.account && isChat){
            api.patInfo(state.patInfo.account).then(obj1=>{
              if(data.from == state.patInfo.hx_account){
                commit('UPDATE_CHAT_SERVICE',obj1.order);
              }
            })
          }
        }
      }
      //patient_order是咨询结束的消息  咨询结束不需要
      if(data.type != 'patient_order'){
        let is_doctor = /doctor/.test(msg.from);
        let obj1 = {
          from : type == 'system' ? msg.action : msg.from,
          to : msg.to,
          name : data.fromName,
          text : newss,
          timestamp : `${msg.timestamp.toString()}000`,
          version : msg.version
        }
        let result =  message.some((vv,ii)=>{
          //判断消息来源是否在原来数据中存在
          if(vv.from == msg.from || vv.from ==  msg.to){
            console.log('原来消息列表中有聊天对象的数据');
            let obj2 =  message[ii];
            Object.assign(obj2,obj1);
            message = message.removeByValue(message[ii]);
            obj2.unread_num ++;
            //是否是聊天界面
            if(isChat) {
              //是否是当前聊天对象
              console.log('是聊天界面');
              if (msg.from == state.patInfo.hx_account || msg.to == state.patInfo.hx_account) {
                console.log('是当前的聊天对象');
                obj2.unread_num = 0;
                commit('UPDATE_CHAT_DATA',msg);
              }
            }
            if(is_doctor){
              [obj2.from,obj2.to] = [obj2.to,obj2.from];
            }
            message.unshift(obj2);
            commit('UPDATE_MESSAGE_LIST',message);
          }
          return  vv.from == msg.from || vv.from ==  msg.to;
        })
        if(!result){
          console.log('消息列表找不到相同的对象');
          obj1.unread_num = 1;
          //是否是聊天界面
          if(isChat && (msg.from == state.patInfo.hx_account || msg.to == state.patInfo.hx_account)){
            obj1.unread_num = 0;
            console.log('是聊天界面且是当前聊天对象!');
            commit('UPDATE_CHAT_DATA',msg);
          }
          if(is_doctor){
            [obj1.from,obj1.to] = [obj1.to,obj1.from];
          }
          let acc = obj1.from.substring(8);
          api.patInfo(acc).then(obj=>{
            obj1.headimg =  obj.info.headimg;
            obj1.account = acc;
            message.unshift(obj1);
            commit('UPDATE_MESSAGE_LIST',message);
          });
        }
      }
    },
    //收到发送消息的成功的返回
    storeMessage1({commit,rootGetters,rootState,state,dispatch},obj){
      //可能是单聊 也  也可能是团队咨询
      state.scrollTo = 'bottom';
      let type = obj.type , msg = obj.msg , newss , data = msg.data , message = state.messageList;
      if(type != 'img'){
        // 将本地的未发出去的消息清空；
        let m =  JSON.parse(window.localStorage['errMessage']);
        if(msg.to == 'empty'){
          delete m[rootState.docInfo.account][`team_${state.teamId}`][msg.id];
        }else{
          delete m[rootState.docInfo.account][state.patInfo.account][msg.id];
        }
        window.localStorage['errMessage'] = JSON.stringify(m);
      };
      let url = window.location.href;
      let isChat = /chat/g.test(url);
      switch (type) {
        case 'text':
          newss = data.text;
          break;
        case 'img':
          newss = '[图片]';
          // state.chatData[data.index].data.text.src = data.text.src;
          break;
        case 'chart':
          newss = '[图表]';
          break;
        case 'data':
          newss = '[测评]';
          break;
        case 'voice':
          newss = '[语音]'
          state.chatData[data.index].data.text.src = data.text.src;
          break;
        case 'doctorOrderTime':
          newss = '[门诊预约时间表]'
          break;
        case 'requestDeviceData':
          newss = "[请求肺功能检测数据]";
          break;
        case 'popularArticle':
          newss = "[科普文章]";
          Toast('发送成功！');
          break;
      }
      //要存在本地的消息列表
      let obj1 = {
        from : msg.to,
        to : msg.from,
        name : data.toName,
        text : newss,
        timestamp : `${msg.timestamp.toString()}000`,
        version : msg.version
      }
      //将 发送状态变更掉
      state.chatData[data.index].data.sendStatus = true;
      if(state.chatType == 'single'){
        let result =  message.some((vv,ii)=>{
          //判断消息来源是否在原来数据中存在
          if(vv.from == msg.to){
            let obj2 =  message[ii];
            Object.assign(obj2,obj1);
            message =message.removeByValue(message[ii]);
            obj2.unread_num ++;
            //是否是聊天界面
            if(isChat) {
              //是否是当前聊天对象
              if (msg.to == state.patInfo.hx_account) {
                obj2.unread_num = 0;
                // commit('UPDATE_CHAT_DATA',msg);
              }
            }
            message.unshift(obj2);
            commit('UPDATE_MESSAGE_LIST',message);
          }
          return  vv.from == msg.to;
        })
        if(!result){
          //是否是聊天界面
          if(isChat){
            //是否是当前的聊天对象
            if(msg.to == state.patInfo.hx_account){
              obj1.unread_num = 0;
            }else{
              obj1.unread_num = 1;
            }
          }
          //不是聊天界面
          else{
            obj1.unread_num = 1;
          }
          obj1.name = state.patInfo.name ? state.patInfo.name : state.patInfo.nick;
          obj1.account = state.patInfo.account;
          obj1.headimg = state.patInfo.headimg;
          message.unshift(obj1);
          commit('UPDATE_MESSAGE_LIST',message);
        }
      }
      //消息发送成功 删除掉本地存的消息副本 更新消息列表之后 才可以返回
      Toast('消息发送成功!');
      Indicator.close();
    },
    sendMsg({commit,state,rootState,rootGetters},payload){
      state.scrollTo = 'bottom';
      let msg = JSON.parse(JSON.stringify(payload.msg));
      let i = payload.index;
      //团队群聊 和 用户群聊中需要判断该用户是否属于该群聊成员
      return new Promise((resolved)=>{
        switch (state.chatType){
          case "sendDocTeam":
            console.log(state.is_member);
            if(state.is_member){
              Object.assign(msg.data,{
                fromName : rootState.docInfo.name,
                index : i,
                readyState : null,
              });
              msg.team_id = state.teamId;
              delete msg.data.sendStatus;
              delete msg.data.relation;
              state.conn.send(msg);
              state.chatData[i].data.relation = '';
              resolved('');
            }else{
              state.chatData[i].data.sendStatus = 'fail';
              state.chatData[i].data.relation = '';
              Indicator.close();
              resolved('');
            }
          break;
          case "sendPatDocTeam":
            if(state.is_member){
              Object.assign(msg.data,{
                fromName : rootState.docInfo.name,
                toName : msg.data.toName || state.patInfo.remark_name || state.patInfo.name || state.patInfo.nick,
                index : i,
                toAcc : state.patInfo.account,
                readyState : null
              });
              msg.team_id = state.teamId;
              delete msg.data.sendStatus;
              delete msg.data.relation;
              state.conn.send(msg);
              state.chatData[i].data.relation = '';
              resolved('');
            }else{
              state.chatData[i].data.sendStatus = 'fail';
              state.chatData[i].data.relation = '';
              Indicator.close();
              resolved('');
            }
          break;
          default:
            api.getRelation({id : state.patInfo.account})
              .then(obj=>{
                //说明双方是好友关系
                if(obj.relation == '4'){
                  Object.assign(msg.data,{
                    fromName : rootState.docInfo.name,
                    toName : msg.data.toName || state.patInfo.remark_name || state.patInfo.name || state.patInfo.nick,
                    index : i,
                    toAcc : state.patInfo.account,
                    readyState : null
                  });
                  delete msg.data.sendStatus;
                  delete msg.data.relation;
                  state.conn.send(msg);
                  state.chatData[i].data.relation = '';
                  resolved('');
                }else{
            obj.relation
                  state.chatData[i].data.sendStatus = true;
                  // state.chatData[i].data.relation = '';
                  state.chatData[i].data.relation = obj.relation;
                  Indicator.close();
                  resolved('');
                }
              })
        }
      })
    },
    updatePatinfo({commit,dispatch,state},payload){
      let url = window.location.href;
      return new Promise((resolve)=>{
        // if(/chat/g.test(url) ){
        if(payload && payload != 'empty'){
          //清除掉之前所有数据
          commit('CLEAR_CHAT_STATE');
          api.patInfo(payload)
            .then(obj=>{
              //更新用户信息
              commit('UPDATE_CHAT_PATINFO',obj.info);
              commit('UPDATE_CHAT_SERVICE',obj.order);
              resolve();
            })
        }else{
          commit('UPDATE_CHAT_PATINFO','');
          resolve();
        }
      })
    },
    updateChatSet({state,rootState}){
        let params = route.history.current.params;
        //团队聊天中
        if(params.chat_team_id){
          state.teamId = params.chat_team_id;
          //团队咨询 医生之间内部聊天
          if(params.chat_hx_account == 'empty'){
            state.chatType = 'sendDocTeam';
            state.patInfo = {
              account : 'empty',
              hx_account : 'empty'
            }
            if(state.conn){
              state.conn.chatMsgSet({origin : 'chat', chatType : 'multiple',  action : 'sendDocTeam', from : rootState.docInfo.hx_account ,to : `team_${params.chat_team_id}`});
            }
          }else{
            //团队咨询  医生和用户之间聊天
            if(params.chat_hx_account){
              state.chatType = 'sendPatDocTeam';
              if(state.conn){
                state.conn.chatMsgSet({origin : 'chat', chatType : 'multiple', action : 'sendPatDocTeam', from : rootState.docInfo.hx_account ,to : params.chat_hx_account});
              }
            }
          }
        }else{
          state.chatType = 'single';
           if(state.conn){
             state.conn.chatMsgSet({origin : 'chat', chatType : 'single' , action:'sendMsg', from : rootState.docInfo.hx_account ,to : params.chat_hx_account});
           }
        }
    },
    clearCount({commit,rootGetters,state},payload){
      return new Promise((resovle)=>{
        let message = state.messageList;
            message.forEach((vv,ii)=>{
              if(vv.from == payload){
                vv.unread_num = 0;
              }
            })
        commit('UPDATE_MESSAGE_LIST',message);
        resovle();
      })
    },
    gainRecord({commit,rootState,state,dispatch}){
      //        初始化聊天相关的信息
      let timestamp = Date.parse(new Date());
      let page = 1;
      //清除掉之前的img
      commit('SET_IMG_ARR',{way : 'clear' },{root : true});
      switch (state.chatType){
        case 'sendPatDocTeam':
          // commit('UPDATE_CHAT_DATA',[]); //删除之前所有聊天记录
          // state.patService = Object.assign({},{});  //删除之前的服务状态
          api.teamChatHistory({
            id : state.teamId,
            acc: route.history.current.params.chat_hx_account,
            page : page
          }).then(obj=>{
              dispatch('detailFirstRecord',obj);
            })
        break;
        case 'sendDocTeam':
          commit('UPDATE_CHAT_DATA',[]); //删除之前所有聊天记录
          state.patService = Object.assign({},{});  //删除之前的服务状态
          window.sessionStorage.removeItem('unReadTipCount');
          api.teamChatDocHistory({
            id : state.teamId,
            page : page
          }).then(obj=>{
            dispatch('detailFirstRecord',obj);
          })
        break;
        default :
          api.newChatRecord(route.history.current.params.chat_hx_account,{page,timestamp})
            .then(obj=>{
              dispatch('detailFirstRecord',obj);
            })
      }

    },
    detailFirstRecord({commit,rootState,state},obj){
      let length = obj.chats.length;
      state.scrollTo = 'bottom';
      for(let i = length-1 ; i > -1 ; i--){
        commit('UPDATE_CHAT_DATA',obj.chats[i]);
        if(obj.chats[i].data.type == 'img'){
          commit('SET_IMG_ARR',{way : 'push' ,msg : obj.chats[i]},{root : true});
        }
        if(obj.chats[i].data.type == 'inquiry_service' || obj.chats[i].data.type == 'call_service'){
          if(obj.chats[i].data.ill_imgs.length != 0){
            let ill_img = obj.chats[i].data.ill_imgs;
            for(let j= 0; j < ill_img.length ; j ++){
              commit('SET_IMG_ARR',{way : 'push' ,msg : ill_img[j].path},{root : true});
            }
          }
          if(obj.chats[i].data.drug_imgs.length != 0){
            let drug_img = obj.chats[i].data.drug_imgs;
            for(let k= 0; k < drug_img.length ; k ++){
              commit('SET_IMG_ARR',{way : 'push' ,msg : drug_img[k].path},{root : true});
            }
          }
        }
      }
      let msg = window.localStorage['errMessage'];
      let acc = route.history.current.params.chat_hx_account;
      if(msg && JSON.parse(msg)[rootState.docInfo.account]){
        switch (state.chatType){
          case 'sendPatDocTeam':
            msg = JSON.parse(msg)[rootState.docInfo.account][acc];
          break;
          case 'sendDocTeam':
            msg = JSON.parse(msg)[rootState.docInfo.account][`team_${state.teamId}`];
          break;
          default:
            msg = JSON.parse(msg)[rootState.docInfo.account][acc];
          break;
        }
        for (let key in msg){
          if(msg[key].id){
            msg[key].data.sendStatus = 'fail';
            commit('UPDATE_CHAT_DATA',msg[key]);
          }
        }
      }
      if(state.chatType == 'sendPatDocTeam'){
        api.teamPatService(state.patInfo.account,state.teamId).then(obj=>{
          commit('UPDATE_CHAT_SERVICE',obj.order);
          commit('UPDATE_CHAT_DATA',state.patService);
        })
      }else{
        //将当前的服务状态放到聊天数据当中去
        commit('UPDATE_CHAT_DATA',state.patService);
      }
    },
    addRecord({commit},payload){
      if(payload.data.type == 'img'){
        commit('SET_IMG_ARR',{way : 'unshift',msg : payload},{root : true});
      }
      if(payload.data.type == 'inquiry_service'){
        if(payload.data.ill_imgs.length != 0){
                  let ill_img = payload.data.ill_imgs;
                  for(let j= 0; j < ill_img.length ; j ++){
                    commit('SET_IMG_ARR',{way : 'unshift' ,msg : ill_img[j].path},{root : true});
                  }
        }
        if(payload.data.drug_imgs.length != 0){
                let drug_img = payload.data.drug_imgs;
                for(let k= 0; k < drug_img.length ; k ++){
                  commit('SET_IMG_ARR',{way : 'unshift' ,msg : drug_img[k].path},{root : true});
                }
              }
      }
      commit('UPDATE_CHAT_RECORD',payload);
    },
      unReadChatCount({commit,state},payload){
      let arr = [];
      api.myInquiries({status : payload , page : 0}).then(obj=>{
        arr = [{status : payload} , {arr : []}];
        obj.orders.forEach((v)=>{
          if(v.team_id){
            arr[1].arr.push({account : v.account , team_id : v.team_id});
          }else{
            arr[1].arr.push({account : v.account });
          }
        })
        window.sessionStorage['unReadTipCount'] = JSON.stringify(arr);
      })
    },
    groupBackReply({state,commit},payload){

    }
  },
}
export default chat;
