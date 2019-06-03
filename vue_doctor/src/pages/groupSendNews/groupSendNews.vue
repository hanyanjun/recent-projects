<template>
  <div class="container">
      <div class="chatContent">
        <template  v-if="is_certified">
          <div class="invite_certified">
            <i class="icon-certificate-tip" style="font-size: 0.36rem">
              <span class="path1"></span><span class="path2"></span>
            </i>
            您还未成为认证医生,<router-link to="/certificate/addInfo">点击此处去认证</router-link>
          </div>
        </template>
        <div class="allPat">
          <h6>将给{{Object.keys(accounts).length}}位患者发送消息</h6>
          <p>
            <template v-for="item in accounts">
              {{item}}、
            </template>
          </p>
        </div>
        <div :class="['chatWrap']">
          <div :class="['content']" :style="contentStyle" ref="content">
            <div>
              <template  v-for="(item,index) in chatData" v-show="chatData.length != 0" >
                <template v-if="item">
                  <!--<span class="chatTime" v-show="item.data.time"><span>{{item.data.time}}</span></span>-->
                  <span class="chatTime" v-show="item.data.time"><span></span></span>
                  <div class="doctor" v-if="/doctor/g.test(item.from)">
                    <span class="sendError" v-show="item.relation" ><span class="tip" v-html="item.relation"></span></span>
                    <template v-if="item.data.type == 'text'">
                  <span class="doc-text">
                    <span v-html="item.data.text"></span>
                    <!--<b class="triangle"></b><b class="send-status" v-show="item.relation"></b>-->
                    <b class="triangle"></b>
                    <b class="send-status" v-show="item.relation"></b>
                    <img src="../../assets/media/img/loading2.gif" alt="" class="text-process" v-show="item.data.sendStatus === false">
                  </span>
                    </template>
                    <template v-if="item.data.type == 'doctorOrderTime'">
                      <ul class="doctor-charts" @click.stop="orderTimeBtnShow = false; orderTimeShow = true">
                        <li class="title">{{docInfo.name}}门诊时间表</li>
                        <li class="text">
                          <i class="icon-chat-chart2 icon">
                            <i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i>
                          </i>
                          可以根据我的门诊时间表,安排时间前来门诊就诊
                        </li>
                        <b class="send-status" v-show="item.relation"></b>
                        <b class="triangle"></b>
                        <img src="../../assets/media/img/loading2.gif" alt="" class="text-process" v-show="item.data.sendStatus === false">
                      </ul>
                    </template>
                    <template v-if="item.data.type == 'requestDeviceData'">
                      <ul class="doctor-charts">
                        <li class="title">邀请会员发送肺功能检测数据</li>
                        <li class="text">
                          <i class="icon-chat-chart1 icon">
                            <i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i>
                          </i>
                          请对方提供近两周肺功能检测数据图表
                        </li>
                        <b class="send-status" v-show="item.relation"></b>
                        <b class="triangle"></b>
                        <img src="../../assets/media/img/loading2.gif" alt="" class="text-process" v-show="item.data.sendStatus === false">
                      </ul>
                    </template>
                    <template v-else-if="item.data.type == 'img'">
                      <div class="doc-text-img">
                        <div class="img-mask" v-show="item.data.sendStatus === false">
                          <img src="../../assets/media/img/loading1.gif" alt="">
                          <span class="process">{{item.data.process ? item.data.process : ''}}</span>
                        </div>
                        <img src=""  alt="" :style="chatImgData(item.data.text)"  class="doc-text-img" v-img="item.data.text.src" @click.stop="preView(item.data.text.src)">
                        <b class="send-status" v-show="item.relation"></b>
                      </div>
                    </template>
                    <template v-else-if="item.data.type == 'voice'" >
                      <div class="chat-info"  :style="{width : (4.5 * item.data.text.time+70)/100+'rem'}" @click.stop="palyVoice(item)">
                        <span class="voice-time">{{item.data.text.time}}"</span>
                        <b class="voice-bg"  :data-base="item.data.text.src"></b>
                        <b class="triangle"></b>
                        <b class="send-status" v-show="item.relation"></b>
                        <img src="../../assets/media/img/loading2.gif" alt="" class="text-process" v-show="item.data.sendStatus === false">
                      </div>
                    </template>
                    <img  class="doc-img" :src="docHead" alt="">
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="footer-fn" v-show=" !(
          inputChange && !this.ver) ">
            <i class="icon_sound icon-chat-voice3" @click.stop="soundShow"></i>
            <span class="text" onfocus="this.blur()"  @click.stop="inputMaskChange(true)" readonly="true" >{{msgText}}</span>
            <i class="icon_more icon-chat-more" @click.stop="footerShow"></i>
            <span :class="['send',{'send-active' : msgText}]" @click.stop="sendText">发送</span>
          </div>
          <div class="footer-select" v-show="fnShow">
            <div class="footer-fn-box">
        <span class="photo">
          <i class="icon-chat-footer-photo icon">
                <i class="path1"></i><i class="path2"></i>
          </i>
          <input type="file" name="" value=""  @change.stop="uploadImg($event)"><span class="fn-name">图片</span></span>
              <span class="camera">
          <i class="icon-chat-footer-cerma icon">
                <i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i><i class="path5"></i>
          </i>
          <input type="file" name="" value="" accept="image/*"  capture @change.stop="uploadImg($event)"><span class="fn-name">拍照</span></span>
              <span class="reply" @click.stop="replyShow = replyShow ? false : true">
          <i class="icon-chat-footer-replay icon">
                <i class="path1"></i><i class="path2"></i>
          </i>
          <span class="fn-name">快捷回复</span></span>
              <span class="gainData" @click.stop="requestDeviceData">
          <i class="icon-chat-footer-chart icon">
                <i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i>
          </i>
          <span class="fn-name">请求数据</span></span>
            </div>
            <div class="footer-fn-box footer-fn-box1">
        <span class="fn-order-time" @click.stop="sendOrderTimeDetail">
          <i class="icon-chat-footer-orderTime icon">
                <i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i><i class="path5"></i>
          </i>
          <span class="fn-name">门诊时间</span>
        </span>
            </div>
            <!--  调用相机-->
          </div>
          <!--开始录音-->
          <div class="voiceFn" v-show="vStatus == '1'"  @click.stop="startVoice">
            <span>点击录音</span>
          </div>
        </div>
        <div class="voiceRecord" v-show="vStatus != '0' && vStatus != '1'">
          <div class="voiceContent">
            <h6>
              <img src="../../assets/media/img/vGif1.gif" alt="" class="img1" v-show="vGif == '1'">
              <img src="../../assets/media/img/vGif2.gif" alt="" class="img1" v-show="vGif == '2'">
              00 : {{voiceTimeShow}}
              <img src="../../assets/media/img/vGif1.gif" alt="" class="img2" v-show="vGif == '1'">
              <img src="../../assets/media/img/vGif2.gif" alt="" class="img2" v-show="vGif == '2'">
            </h6>
            <img src="../../assets/media/img/voice2.png" alt="" v-show="vStatus == '2'" @click.stop="stopVoice">
            <img src="../../assets/media/img/play.png" alt="" v-show="vStatus == '3'" @click.stop="playWXvoice">
            <img src="../../assets/media/img/pause.png" alt="" v-show="vStatus == '4'" @click.stop="pauseWXvoice">
            <span v-show="vStatus == '2'" @click.stop="stopVoice">点击停止</span>
            <div class="btns" v-show="vStatus == '3' || vStatus == '4'">
              <button @click.stop="cancleSendVoice">取消</button>
              <button @click.stop="sendVoice">发送</button>
            </div>
          </div>
        </div>
        <div class="reply-dialog" v-show="replyShow">
          <ul class="reply-dialog-text">
            <li v-for="item in reply"  @click.stop="selectReply(item)">{{item.content}}</li>
          </ul>
          <button type="button" name="button" class="editReply_btn" @click.stop="skip">编辑</button>
          <button type="button" name="button" class="cancleReply_btn" @click.stop="replyShow = replyShow ? false : true">返回</button>
        </div>
        <!--发送门诊时间给用户-->
        <div class="order-time" v-show="orderTimeShow">
          <!--<header><i class="icon-return-boldleft" @click.stop="orderTimeShow = false"></i>门诊详情</header>-->
          <!--<ul class="select">-->
          <!--<li v-for="(item,index) in orderSet" :class="{'selected' : index == selectIndex}" @click.stop="select(index)">{{item.hospital}}</li>-->
          <!--</ul>-->
          <div :class="['order-content',{'order-content1' : !orderTimeBtnShow}]" >
            <ul class="section" v-for="item in orderSet">
              <li class="timeData"><span class="day">{{item.time}}</span><span class="time">{{$means.numToday(item.week_day)}}{{$means.numTotime(item.week_time)}}</span></li>
              <li class="hospital">{{item.hospitals}}</li>
              <li class="count">剩余预约数:<span>{{item.set_count == '0' || item.appoint_count == 0  ?   0 : item.appoint_count}}</span>人</li>
              <li class="address">{{item.address ? item.address : '未填写'}}</li>
              <!--<a href="javascript:;"  :class="['order-btn',{'order-btn-deactive' : item.set_count == '0' || item.appoint_count == 0 }]"  @click.stop="orderAdd(item)">立即预约</a>-->
            </ul>
          </div>
          <empty :config="{show : orderSet.length == 0 , text : '您还没有设置可预约门诊！'}"></empty>
          <button class="order-time-send" @click.stop="sendOrderTime" v-show="orderTimeBtnShow">群发给会员</button>
        </div>
      </div>

    <!--<transition name="b-pop">-->
    <div :class="['textMask',{'textMask1' : textMask},{'textMask2' : !ver}]">
      <div class="textMaskContent">
        <div class="maskInputContent" >
          <!--<i class="closeMask" @click.stop="inputMaskChange(false)"></i>-->
          <div class="maskInput">
            <!--<textarea class="text"  v-focus="fs"   v-model.trim="msgText"  v-on:input="changeTextarea($event)" ref="fText"></textarea>-->
            <textarea class="text"  v-focus="fs"   v-model.trim="msgText"  ref="fText"></textarea>
          </div>
          <div class="fn">
            <button class="send cancle" @click.stop="inputMaskChange(false)">取消</button>
            <button :class="['send',{'send-active' : msgText}]" @click.stop="sendText">发送</button>
          </div>
        </div>
      </div>
    </div>
    <transition name="wear">
      <div class="mask" v-show="textMask" @click.stop="inputMaskChange(false)"></div>
    </transition>
  </div>

</template>

<script>
  import api from '../../fetch/api'
  import Voice from '../../libs/voice'
  import BScroll from 'better-scroll'
  import {Indicator,Toast,MessageBox} from '../../components/hw-components'
  import loadingMore from '../../components/loadingMore.vue'
  import empty from '../../components/empty'
  export default{
    name : 'chat',
    components :{loadingMore,empty},
    data(){return{
      fnShow : false,
      msgText :'',
      reply : '',
//      存储当前的音频
      voiceContext : '',
//      存储播放音频的dom
      dom : '',
      isTip : false,
      replyShow : false,
//      0不展开状态  1 点击录音状态 2 录音中状态 3 播放状态 4 暂停状态
      vStatus : '0',
      vGif : '0',
//        录音相关使用变量
      voice :{localId : '', time : 0},
//      计算录音时长的计时器
      timmer : '',
      voiceCount : 0,
//      一些状态的变更以及判断  1.当前时间
      currentTime :  '',
      orderSet : [],
      orderTimeShow : false,
      orderTimeBtnShow : true,
      c1 :false,
      c2 : false,
      chatData : [],
//      群发的所有对象
      allPat : [],
//      发送的消息体
      news : '',
//      是否弹出文字输入区域
      textMask : false,
//      是否改变container 及显示textmask的遮罩
      inputChange : false,
//      计算初始屏幕高度
      initHeight : ''
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{fShow : false, hShow : true,title : '群发消息'});
      let time =  new Date();
      this.currentTime = new RegExp(time.getFullYear() +'/'+(time.getMonth()+1)+'/'+time.getDate());
      this.$store.commit('CLEAR_CHAT_STATE');
      this.$api.gainReply().then(obj=>{
        this.reply = this.$hwdata.replyData;
        this.reply = (this.reply).concat(obj.reply);
      })
      this.allPat = JSON.parse(window.sessionStorage['groupNews']);
      this.currentTime = Date.parse(new Date());
      this.$api.appointSetList().then(obj=>{
        this.orderSet = obj.set;
      })
    },
    watch :{
      fnShow(){
        this.$store.state.chat.scrollTo = 'bottom';
      },
      vStatus(){
        if(this.vStatus != '0'){
          this.$store.state.chat.scrollTo = 'bottom';
        }
      },
      orderTimeShow(v,o){
          if(v){
            document.querySelector('.nav_back').onclick=(e)=>{
              this.$store.commit('UPDATE_NAV',{fShow : false, hShow : true,title : '群发消息'});
              this.orderTimeShow = false;
            }
          }else{
            document.querySelector('.nav_back').onclick=(e)=>{
              this.$router.routeBack();
            }
          }
      }
    },
    computed:{
      docHead(){
        return this.$store.getters.docHead;
      },
      ver(){
        return this.$store.state.isIOS;
      },
      accounts(){
        let all = {};
        for(let key in this.allPat){
          if(!Object.hasOwnProperty('name')){
            all =   Object.assign({},this.allPat);
            break;
          }else{
            all[key] = this.allPat[key].name;
          }
        }
        return all;
      },
      sendCount(){
        return this.$store.state.chat.groupNewsCount;
      },
      scrollTo(){
        return this.$store.state.chat.scrollTo;
      },
      docInfo(){
        return this.$store.state.docInfo;
      },
      is_certified(){
        return this.$store.state.docInfo.is_certified != '1';
      },
      voiceTimeShow(){
        return  this.voiceCount == 0 ? ( this.voice.time < 10  ? `0${this.voice.time}` : this.voice.time) :  (this.voiceCount < 10 ?  `0${this.voiceCount}` : this.voiceCount);
      },
      contentStyle(){
        let height = 0.8;
        let margin = 0;
        if(this.is_certified){
          height = 0;
          height += 1.6;
          margin = 0;
        }
        if(this.fnShow  || this.vStatus != '0'){
          margin += -4.4;
        }
        height += 'rem';
        margin += 'rem';
        return { height : `calc(100% - ${height} )` ,marginTop: margin};
      },
    },
    methods : {
      scrollRefresh (v){
        v.show = !v.show
        if(v){
          this.$store.state.chat.scrollTo = '';
          this.$store.commit('UPDATE_CHAT_DATA','');
        }
      },
      inputMaskChange(v){
        window.sessionStorage['bodyScroll'] = !v;
        if(v){
          this.$refs.fText.focus();
          setTimeout(()=>{
            this.inputChange = v;
          },800);
        }else{
          this.$refs.fText.blur();
          this.inputChange = v;
        }
        this.textMask = v;
      },
//      聊天中图片的处理
      chatImgData(text){
        let arr3 = [];
        if (/@/.test(text)) {
          var arr1 = text.split('@');
          var arr2 = arr1[1].split('x');
          var width = parseInt(arr2[0]);
          var height = parseInt(arr2[1]);
          var scale = width/height;
          var imgHeight = height;
          var imgWidth = width;
          if (width > 300 || height > 300) {
            if (scale > 1) {
              imgHeight = 300/scale;
              imgWidth = 300;
            }else{
              imgWidth = 300*scale;
              imgHeight = 300;
            }
          }
          arr3 = [arr1[0],imgWidth,imgHeight];
        }else{
          if (text.hasOwnProperty('width')) {
            var scale1 = text.width/text.height;
            if (text.width > 400 || text.height > 400) {
              if (scale1 > 1) {
                text.height = 400/scale1;
                text.width = 400;
              }else{
                text.width = 400*scale1;
                text.height = 400;
              }
            }
            arr3 =  [text.src,text.width,text.height];
          }
        }
        if(arr3[1] == '0'  || !arr3[1]){
          return '';
        }else{
          return `width:${parseFloat(arr3[1])/100}rem;height:${parseFloat(arr3[2])/100}rem`
        }
      },
      soundShow(){
        if(this.docInfo.is_certified == '1'){
          this.vStatus = this.vStatus == '1' ?  '0' : '1';
          this.msgText = '';
          this.fnShow = false;
          this.$refs.fText.style.height = '0.8rem';
        }else{
          Toast('您还未认证功能暂不可用！');
        }
      },
      playWXvoice(){
        this.vStatus = '4';
        this.vGif = '2';
        this.voiceCount = this.voiceCount == this.voice.time ? 0 : this.voiceCount;
        clearInterval(this.timmer);
        wx.playVoice.call(this,{
          localId : this.voice.localId
        })
        this.timmer = setInterval(()=>{
          if(this.voiceCount < this.voice.time){
            this.voiceCount++;
          }else{
            clearInterval(this.timmer);
          }
        },1000);
        wx.onVoicePlayEnd.call(this,{
          success: res => {
            clearInterval(this.timmer);
            this.vStatus = '3';
            this.vGif = '0';
          }
        });
      },
      pauseWXvoice(){
        this.vStatus = '3';
        this.vGif = '0';
        clearInterval(this.timmer);
        wx.pauseVoice.call(this,{
          localId: this.voice.localId
        });
      },
      cancleSendVoice(){
        this.voice.localId = '';
        this.voice.time = 0;
        this.vGif = '0';
        this.vStatus = '1';
        this.timmer =  '',
          this.voiceCount = 0
      },
      stopVoice(){
        clearInterval(this.timmer);
        wx.stopRecord.call(this,{
          success: res=> {
            this.voice.localId = res.localId;
            if(this.voiceCount < 1){
              Toast('当前录音时间过短,请重新录制!');
              this.vGif = '0';
              this.vStatus = '1';
            }else{
              this.voice.time = this.voiceCount;
              this.vGif = '0';
              this.vStatus = '3';
            }
          },
          fail: function (res) {
            console.log(JSON.stringify(res));
          }
        })
      },
      sendVoice(){
        let obj1;
        if(this.vStatus == '4'){
          Toast('请先暂停当前语音在进行发送!');
        }else{
          obj1 = {
            from : this.docInfo.hx_account,
            data : {
              type : 'voice',
              text : {
                src : '',
                timestamp : Date.parse(new Date()),
                time : this.voice.time
              },
              sendStatus : false
            },
            relation : ''
          }
          this.$store.commit('UPDATE_CHAT_DATA',obj1);
          let index = this.$store.getters.chatDataIndex;
//          发送时候不需要在播放录制语音  将所有状态清除掉
          this.vGif = '0';
          this.vStatus = '0';
          this.timmer =  '';
          this.voiceCount = 0;
          wx.uploadVoice.call(this,{
            localId: this.voice.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: res=> {
              var serverId = res.serverId; // 返回音频的服务器端ID
              this.chatData.push(obj1);
              this.orderTimeShow = false;
              this.sendGroupNews({
                content : serverId,
                type : 'voice',
                time :  this.voice.time
              })
              this.voice.time = 0;
              this.voice.localId = '';
            }
          })
        }
      },
      startVoice(){
        this.fnShow = false;
        this.vGif = '1';
        wx.startRecord.call(this,{
          success: ()=>{
//                  同意授权变成录音状态
            setTimeout(()=>{
              this.vGif = '2';
            },500)
            this.vStatus = '2';
            this.timmer = setInterval(()=>{
              this.voiceCount++;
            },1000);
          },
          cancel:  ()=> {
//                   拒绝录音回到原始状态
            this.vStatus = '1';
          }
        });
        wx.onVoiceRecordEnd.call(this,{
          // 录音时间超过一分钟没有停止的时候会执行 complete 回调
          complete: res => {
            Toast('录音已59s自动停止录音!');
            clearInterval(this.timmer);
            this.voice.localId = res.localId;
            this.vGif = '0';
            this.voice.time = 60;
            this.vStatus = '3';
          }
        });
      },
      sendOrderTimeDetail(){
        this.$store.commit('UPDATE_NAV',{fShow : false, hShow : true,title : '门诊时间'});
        if(this.docInfo.appoint_switch == '1'){
          Toast('您当前未开启门诊预约，请开启之后再发送!');
        }else{
          this.inputMaskChange(false);
          this.orderTimeShow = true;
          this.orderTimeBtnShow = true;
        }
      },
      sendOrderTime(){
        let obj1 = {
          from : this.docInfo.hx_account,
          data : {
            type : 'doctorOrderTime',
            timestamp : Date.parse(new Date()),
            text : '[门诊预约时间表]',
            name : this.docInfo.name,
            sendStatus : false
          },
          relation : ''
        }
        this.chatData.push(obj1);
        this.orderTimeShow = false;
        this.sendGroupNews({
          content : '[门诊预约时间表]',
          type : 'doctorOrderTime'
        })
      },
      requestDeviceData(){
        MessageBox.confirm('是否发送查看设备数据<br>请求？').then(()=>{
          this.inputMaskChange(false);
          let obj1 = {
            from : this.docInfo.hx_account,
            data : {
              type : 'requestDeviceData',
              timestamp : Date.parse(new Date()),
              text : '[请求设备数据]',
              name : this.docInfo.name,
              sendStatus : false
            },
            relation : ''
          }
          this.chatData.push(obj1);
          this.sendGroupNews({
            content : '[请求设备数据]',
            type : 'requestDeviceData'
          })
        })
      },
      changeTextarea(e){
        let target = e.target;
        target.style.height = '0.8rem';
        target.style.height = target.scrollHeight > this.$means.changePX(115) ? '1.2rem' : '0.80rem';
        target.style.lineHeight  = target.scrollHeight > this.$means.changePX(115) ? '0.60rem' : '0.80rem';
      },
      footerShow(){
        if(!this.is_certified){
          this.fnShow = this.fnShow ? false : true;
          this.vStatus = '0';
        }else{
          Toast('您还未认证,功能暂不可用!');
        }
      },
      skip(){
        this.$router.push({path : 'editReply'});
      },
      selectReply(item){
        this.msgText = item.content;
        this.replyShow = this.replyShow ? false : true;
      },
      preView(src){
        this.$store.dispatch('wxImgView',src);
      },
      fs(){
        this.fnShow = false;
        this.$store.state.chat.scrollTo = 'bottom';
        this.$store.commit('UPDATE_CHAT_DATA','');
        this.vStatus = '0';
      },
      palyVoice(item){
        if(this.voiceContext){
          this.voiceContext.close();
          this.voiceContext = '';
        }
        if(this.dom){
          this.dom.removeAttribute('style');
        }
        let src = item.data.text.src;
        let time = item.data.text.time.toString();
        let s = new Voice(src);
        s.play()
        this.voiceContext = s.context;
        let target = event.target;
        let dom;
        if(target.className == 'chat-info'){
          dom = target.children[1];
        }else if(target.className == 'voice-time'){
          dom = target.nextNode;
        }else if(target.className == 'voice-bg'){
          dom = target;
        }
        dom.style.animation = 'ani 2s  infinite linear';
        this.dom = dom;
        setTimeout(function(){
          dom.removeAttribute('style');
        },parseInt(time.replace(/"/g,''))*1000);
      },
      sendText(){
        let obj1;
        if(this.msgText){
          if(!this.is_certified){
            obj1 = {
              from : this.docInfo.hx_account,
              data : {
                type : 'text',
                timestamp : Date.parse(new Date()),
                text : this.msgText,
                name : this.docInfo.name,
                sendStatus : false
              },
              relation : ''
            }
            this.chatData.push(obj1);
            this.sendGroupNews({
              content : this.msgText,
              type : 'text'
            })
            this.$refs.fText.style.height = '0.8rem';
            this.msgText = '';
          }else{
            Toast('您还未认证功能暂不可用!');
          }
        }else{
          this.$refs.fText.style.height = '0.8rem';
          this.msgText = '';
          Toast('请输入内容!');
        }
      },
      uploadImg(e){
        let f = e.target.files[0];
        let src = window.URL.createObjectURL(f);
        let file = new FormData();
        let obj1;
        this.inputMaskChange(false);
        file.append('content',f);
        //加载图片获取图片真实宽度和高度
        var image = new Image();
        image.src= src;
        let _this = this;
        image.onload = function(){
          setTimeout(()=>{
            _this.$store.commit('UPDATE_CHAT_DATA','');
          },300)
        };
        obj1 = {
          from : this.docInfo.hx_account,
          data : {
            type : 'img',
            text : {
              timestamp : Date.parse(new Date()),
              src : src,
              width : '',
              height : ''
            },
            sendStatus : false,
            process : '0%'
          },
          relation : ''
        }
        this.chatData.push(obj1);
        file.append('type','img');
        file.append('accounts',JSON.stringify(this.accounts));
        Indicator.open('发送中...');
        this.fnShow = false;
        this.$http.post('/tool/sendPatientsNotify',file,{
          onUploadProgress :  (progressEvent)=> {
            let pro = parseInt(progressEvent.loaded / progressEvent.total * 100) ;
            // 对原生进度事件的处理
            this.chatData[0].data.process = `${pro}%`;
          },
          headers:{'Content-Type':'multipart/form-data'}
        }).then(obj=>{
          if(obj.data.code == 0){
            this.chatData[0].data.sendStatus = true;
            this.$router.push({path : '/groupNewsHistory'});
          }else{
              Toast(obj.data.errMsg);
              this.chatData.splice(0,1);
          }
        }).catch(obj=>{
          this.chatData.splice(0,1);
        })
      },
      sendGroupNews(v){
        Indicator.open('发送中...');
          v.accounts = JSON.stringify(this.accounts);
          this.$api.pGroupNotify(v).then(obj=>{
            this.chatData[0].data.sendStatus = true;
            this.$router.push({path : '/groupNewsHistory'});
          })
      }
    },
    mounted (){
      this.$refs.content.addEventListener('touchstart',e=>{
        e.preventDefault();
        document.querySelector('.footer .text').blur();
        this.fnShow =false;
        this.vStatus = false;
      });
//  ios 点完成收起键盘
      this.$refs.fText.addEventListener('blur',e=>{
        e.preventDefault();
        setTimeout(()=>{
          this.inputMaskChange(false);
        },0)
      });
//        ios 弹起键盘不滑动
      document.querySelector('body').addEventListener("touchmove",(e)=>{
        if(window.sessionStorage['bodyScroll'] == 'true'){
          document.querySelector('body').removeEventListener(e.type,arguments.callee,false);
        }else{
          e.preventDefault();
        }
      });
//        安卓收起键盘处理
      window.onresize = ()=>{
        if(parseInt(this.initHeight) <= (parseInt(document.body.clientHeight) + 20) && !this.ver){
          this.inputMaskChange(false);
        }
    };
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "./groupSendNews.scss";
</style>
