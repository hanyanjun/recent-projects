/**
 * Created by Hardy on 2017/7/13.
 */
import {md5} from '../means/md5'

const color = '#2a8cff';
  var WS = function(){
    // 版本
    this.version = '1.0';
    // 消息来源
    this.origin = null;
    // 消息类型
    this.chatType = null;
    // 消息发送方
    this.from = null;
    // 消息接收方
    this.to = null;
    // 是否被挤下线
    this.relogin = true;
  //  心跳机制所需变量
    this.beatTime  = 2000;
    this.beatInterval = null;
    this.beatTimeout = null;
    this.beatOut = 4000;
  };
  WS.prototype = {
    init : function(link,from){
      this.link = link ? link : this.link;
      this.from = from ? from : this.from;
      this.con = new WebSocket(this.link);
    },
    beatReset : function () {
      clearTimeout(this.beatTimeout);
      this.beatTest();
    },
    beatTest : function () {
       var _this = this;
       this.beatTimeout = setTimeout(function () {
         console.log('网络较差，连接已断!');
         clearInterval(_this.beatInterval);
       },this.beatOut)
    },
    beatStart : function () {
      var _this = this;
      this.beatInterval = setInterval(function(){
        _this.con.send(JSON.stringify({
          version :"1.0",
          origin : "server",
          action :"beat",
          data :"pong",
          to : _this.to
        }));
      }, _this.beatTime)
    },
    login : function(){
     let account = this.from;
      var obj =  {
        origin : 'chat',
        action : 'login',
        chatType : 'single',
        loginType: "wx",
        from : account
      }
      this.con.send(JSON.stringify(obj));
      this.beatStart();
      this.beatTest();
    },
    listen : function(options){
      var _this = this;
      this.options = options;
      this.con.onmessage = function(mes){
        var data = JSON.parse(mes.data);
        if (data.hasOwnProperty('code')) {
          // 登录成功1000 登录失败1001 重复登录1002 消息发送成功2000 发送失败2001 离线消息成功 2010 失败 2011 连接成功9000 连接失败 9001
          switch(data.code){
            case 1000 :
              options.onLogin("登录成功");
              console.log('%c登录成功',`color:${color}`)
              break;
            case 9000 :
              options.onOpen("连接成功");
              console.log('%c连接成功',`color:${color}`)
              break;
            case 2000:
              options.onSendState(data);
              break;
            case 2010 :
              options.onSendState(data);
              break;
            case 2001:
              options.onSendState(data);
              break;
            case 2011 :
              options.onSendState(data);
              break;
            case 1002:
              _this.relogin = false;
              break;
            case 9001:
              _this.relogin = true;
              break;
          }
        }else{
          if (data.hasOwnProperty('id')) {
            switch(data.origin){
              // 接收到消息
              case "chat" :
                var msg = data.data;
                //接收到单聊消息
                switch (data.chatType){
                  case 'single':
                    _this.detailSingle(data,options);
                  break;
                //接收到多人聊天
                  case 'multiple':
                    _this.detailMul(data,options);
                  break;
                }
                break;
              // 收到关系相关消息
              case 'system' :
                options.onSysMessage(data);
                break;
              // 收到阅读状态消息
              case "readState" :
                options.onReadState(data);
                break;
            }
          }else{
             if(data.origin == 'server'){
               _this.beatReset()
             }
          }
        }
      }
      this.con.onerror =  function(mes){
        if (_this.relogin) {
          return options.onError(mes);
        }else{
          return options.onOffLine(mes);
        }
      }
      this.con.onclose = function(mes){
        if (_this.relogin) {
          return options.onClose(mes);
        }else{
          return options.onOffLine(mes);
        }
      }
    },
    detailSingle : function(data,options){
      switch(data.data.type){
        // 收到文本消息
        case "text" :
          options.onTextMessage(data);
          break;
        case "inquiry_service" :
          options.onTextMessage(data);
          break;
        case "family_service" :
          options.onTextMessage(data);
          break;
        case "patient_order":
          options.onTextMessage(data);
          break;
        // 收到语音消息
        case "voice" :
          options.onVoiceMessage(data);
          break;
        // 收到文本消息
        case "img" :
          options.onImgMessage(data);
          break;
        // 收到图表消息
        case "chart" :
          options.onChartMessage(data);
          break;
        // 收到数据消息
        case "data" :
          options.onDataMessage(data);
          break;
      }
    },
    detailMul : function(data,options){
      options.onMultipleChat(data);
    },
    chatMsgSet :  function(data){
      // 设置基础信息
      this.origin = data.origin;
      this.chatType = data.chatType;
      this.action  = data.action || this.action;
      this.from = data.from || this.from;
      this.to = data.to || this.to;
    },
    id : function () {
      var from = this.from;
      var time =  (Date.parse(new Date())).toString();
      var id = md5(from + time);
      return id;
    },
    // 发送消息
    send : function(data){
      console.log(data);
      // var version = this.version;
      // var from = this.from;
      // var to = this.to;
      // var chatType = this.chatType;
      // var origin = this.origin;
      // var time =  (Date.parse(new Date())).toString();
      // var id = md5(from + time);
      this.options.onSendState({code : 2100, id : data.id , msg : '消息发送中'});
      // alert('消息发送中');
      if (this.con.readyState == 1) {
        // var obj = {
        //   version : version,
        //   origin : origin,
        //   action : 'sendMsg',
        //   chatType : chatType,
        //   from : data.from,
        //   to : data.to,
        //   data : data,
        //   id : id,
        //   timestamp : time
        // }
        // console.log(obj);
        this.con.send(JSON.stringify(data));
      }else{
        this.options.onSendState({code : 2101, id : data.id , msg : '消息发送失败'});
      }
    },
    createMsg(data){
      var version = this.version;
      var from = this.from;
      var chatType = data.chatType ||  this.chatType;
      var origin = data.origin || this.origin;
      var action = data.action || this.action;
      var time =  (Date.parse(new Date())).toString();
      data.data.timestamp = time;
      var id = md5(from + time);
      return{
        version : version,
        origin : origin,
        action : action,
        chatType : chatType,
        from : data.from,
        to : data.to,
        data : data.data,
        id : id,
        timestamp : time
      }
    },
    close : function(){
      this.con.close();
    }
  };

export  default WS;
