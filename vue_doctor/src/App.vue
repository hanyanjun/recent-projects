<template>
  <div id="app">
    <div class="share-window" @click="sClose()" v-show="sShow || shareMask.show">
      <template v-if="shareMask.show">
        <template v-if="shareMask.type == '0'">
        </template>
        <template v-else-if="shareMask.type == '1'">
          <img src="./assets/media/img/share_1.png" alt="" class="img1">
          <img src="./assets/media/img/share_2.png" alt="" class="img2">
        </template>
      </template>
      <template v-else-if="sShow">
        <img src="./assets/media/img/share-bg.png" alt="">
      </template>
    </div>
    <div class="loading" v-show="isLoading">
      <div class="spinner">
        <div class="spinner-container container1">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
          <div class="circle4"></div>
        </div>
        <div class="spinner-container container2">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
          <div class="circle4"></div>
        </div>
        <div class="spinner-container container3">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
          <div class="circle4"></div>
        </div>
      </div>
    </div>
    <!--<transition :name="transitionName">-->
      <a href="javascript:;" :class="['nav',{'nav1' :  nav.fn ? false : true} , {'nav_green' : nav.theme == 'green'}]" v-show="nav.hShow" ><b class="nav_back"><i class="icon-return-boldleft"></i>{{nav.back}}</b> <span class="title">{{nav.title}}</span><span class="nav_submit">{{nav.fn}}</span>  </a>
    <!--</transition>-->
    <div :id="contentId">
      <!--<transition :name="transitionName">-->
          <router-view></router-view>
      <!--</transition>-->
    </div>
    <footer-tab v-show="nav.fShow"></footer-tab>
    <win-rotate v-show="is_rotate"></win-rotate>
    <prompt></prompt>
    <action-sheet></action-sheet>
    <!--之前的引导  现在不需要了-->
    <!--<div class="lead" v-show="docInfo.version < '3.1' && work" >-->
      <!--<img src="./assets/media/img/undo-icon.png" alt="" class="step1" v-show="step == '1'">-->
      <!--<img src="./assets/media/img/undo-icon1.png" alt="" class="step1-1" v-show="step == '1'">-->
      <!--<img src="./assets/media/img/next-step.png" alt="" class="next" v-show="step == '1'" @click.stop="lead">-->
      <!--<img src="./assets/media/img/next-step.png" alt="" class="next" v-show="step == '2'" @click.stop="lead">-->
      <!--<img src="./assets/media/img/fn-text-icon.png" alt="" class="step2" v-show="step == '2'">-->
      <!--<div v-show="step == '2'">-->
        <!--<img src="./assets/media/img/lead-step-patient.png" alt="" v-show="step == '2'">-->
        <!--<img src="./assets/media/img/lead-step-consult.png" alt="" v-show="step == '2'">-->
        <!--<img src="./assets/media/img/lead-step-order.png" alt="" v-show="step == '2'">-->
      <!--</div>-->
      <!--<img src="./assets/media/img/lead-message-text.png" alt="" class="step3" v-show="step == '3'">-->
      <!--<img src="./assets/media/img/lead-step-message.png" alt="" class="step3-1" v-show="step == '3'">-->
      <!--<img src="./assets/media/img/roger-icon.png" alt="" class="step3-2" v-show="step == '3'" @click.stop="lead">-->
    <!--</div>-->
    <!--<div class="lead" v-show="docInfo.version >= '3.1' && docInfo.version < '3.4' && work" >-->
      <!--<img src="./assets/media/img/lead-step-scienceing.png" alt="" class="step4" v-show="step == '4'" @click.stop="lead">-->
      <!--<img src="./assets/media/img/lead-step-groupNews.png" alt=""  class="step5" v-show="step == '5'" @click.stop="lead">-->
    <!--</div>-->
    <div class="lead" v-show="docInfo.version <= '3.6' && work">
      <img src="./assets/media/img/lead-step_1.png" alt="" v-if="step == '1'"  class="step1"  @click.stop="lead">
      <img src="./assets/media/img/lead-step_2.png" alt=""  v-if="step == '2'" class="step2"  @click.stop="lead">
      <img src="./assets/media/img/lead-step_3.png" alt=""  v-if="step == '3'" class="step3"  @click.stop="lead">
      <!--<img src="./assets/media/img/lead-step_2.png" alt=""  class="step7"  @click.stop="lead">-->
      <!--<img src="./assets/media/img/lead-step_3.png" alt=""  class="step8"  @click.stop="lead">-->
    </div>
    <div class="hw-all-mask" v-show="isMask">

    </div>
    <sheetSelect></sheetSelect>
  </div>
</template>

<script>
  import './fetch/link'
  import footerTab from './components/footerTab.vue'
  import {MessageBox,Toast} from './components/hw-components'
  import {mapState,mapMutations,mapActions } from 'vuex'
  import winRotate from './components/winRotate'
  import prompt from './components/prompt'
  import actionSheet from './components/actionsheet'
  import sheetSelect from "./components/sheetSelect"
 export default {
     data(){return{
        work : false,
        transitionName : '',
        step : '',
     }},
//      show 用来判断是需要底部导航还是顶部导航  isloading用来控制首次路由进入的加载动画
    computed : {
      ...mapState({'sShow':'sShow','shareMask' : 'shareMask',  'isLoading' : 'isLoading', 'isMask' : 'isMask', 'nav' : 'nav','doc_status':'is_update_doc','con_status' : 'is_update_contacts','pat_status': 'is_update_pat','docInfo' : 'docInfo','is_rotate' : 'rotateAni','unReplay' : 'unReplay'}),
      contentId(){
        return (this.nav.hShow ? 'appContent1' : (this.nav.fShow ? 'appContent2' : 'appContent3'))
      },
      routeStorage(){
          return window.sessionStorage['routeTrack'];
      }
    },
    methods : {
      lead(){
        let s = this.step;
        switch (s){
          case "1":
            this.step = '2';
            break;
          case '2':
            this.step = '3';
            break;
          case '3':
            this.$api.versionLead('3.7').then(obj=>{
              this.$store.state.docInfo.version = '3.7';
            })
            break;
        }
      },
      stepPos(v){
          this.$nextTick(_=>{
            let dH = document.querySelector('.work-header').getAttribute('data-dh') - 2;
            let arr = [268,50,143];
            let d = 0;
            if(dH > 10){
              if(v == 1){ d = 2*dH};
              if(v == 2){ d = 2.2*dH};
              if(v == 3){ d = 3*dH};
              document.querySelector(`.step${v}`).style.top = arr[v - 1] +  d + 'px';
            }
          })
      },
      sClose (){
        this.$store.state.sShow =  false;
        this.$store.state.shareMask.show = false;
      },
      routeChange (to,from){
        window.sessionStorage['bodyScroll'] = true;
        //更新收入中 账户类型  （个人，团队）
        this.$store.dispatch('gainWalletType');
        if((/login/.test(from.fullPath) || /\/add\/addInfo/.test(from.fullPath)) && window.sessionStorage['userBack'] == 'true'){
           this.$router.push(from.fullPath);
            window.sessionStorage['userBack'] = 'false';
         }
        //获取当前href
          let url = window.location.href;
//          路由切換先將chat里的用户的hx_account去掉
          if(JSON.parse(window.sessionStorage['routeTrack']).children.length >= ROUTELENGTH){
            if(JSON.parse(window.sessionStorage['routeTrack']).children.length == 0){
                this.transitionName = 'slider-in';
            }else{
              if(from.meta.root){
                this.transitionName = 'slider-in1';
              }else{
                this.transitionName = "slider-in";
              }
            }
          }else{
            if(to.meta.root){
              this.transitionName = '';
            }else{
              this.transitionName = "slider-out";
            }
          }
//          执行清除session操作
          if(to.meta.clearSession){
              to.meta.clearSession.forEach((v)=>{
                  sessionStorage.removeItem(v);
              })
          }
//        用户权限操作
        let limit = this.$route.meta.limit;
//        是否在首页显示引导页
        this.work = /#\/work$/g.test(document.URL);
        if(this.docInfo.version <= '3.6'){
          this.stepPos('1');
        }
        this.$store.commit('UPDATE_MASK',false);
        if(limit == 1){
            switch (this.docInfo.is_certified){
              case '2':
                this.$router.routeBack();
                MessageBox.confirm('您还未通过医生认证,是否现在去个人中心提交认证?').then(obj=>{
                  this.$router.push({path : '/certificate/addInfo'});
                });
                break;
              case '3':
                this.$router.routeBack();
                Toast('认证中，功能暂不可用，请耐心等待！')
                break;
            }
        }
        this.$store.dispatch('wxHideShare');
        document.querySelector('.nav_submit').onclick=(e)=>{
            console.log('初始click');
        }
        document.querySelector('.nav_back').onclick=(e)=>{
//          禁止掉填写信息和认证时的返回
          if(((/addInfo/g).test(url)  || (/certificate/g).test(url)) && this.docInfo.isRegister == '2' || to.meta.noBack){
              console.log('不返回');
          }
          else{
            this.$router.routeBack();
          }
        }
//路由切换的时候去更新conn的to为undefined否则会将消息条数清零
        if(this.$store.state.chat.conn){
          this.$store.state.chat.conn.to = 'undefined';
        }
//        初始化组件状态
          this.$store.commit('INIT_PROMPT');
          if(this.doc_status){
            //医生信息延迟更新 防止注册
            setTimeout(()=>{
              this.$store.dispatch('updateDocInfo');
            },30);
          }
          if(this.con_status && !/noAcc/.test(url)){
              this.$store.dispatch('updateContacts');
          }
          //聊天记录（初始化）
          this.$store.dispatch('updatePatinfo',this.$route.params.chat_hx_account).then((obj)=>{
              this.$store.dispatch("updateChatSet");
              if(!this.$store.state.chat.isLoginChat){
                this.$store.dispatch('connConfig');
              }
              if(this.$route.params.chat_hx_account){
                this.$store.dispatch('gainRecord');
              }
              this.$store.dispatch('setDocTitle',this.$route.meta.docTitle);
          })
//          隐藏所有的选择框
         this.$picker1.hide();
         this.$picker2.hide();
         this.$picker3.hide();
         this.$picker4.hide();
         this.$pickerl3.hide();
      }
    },
    created(){
  //          微信相关的初始化
        this.$store.dispatch('wxinitial').then(()=>{
            this.$store.dispatch('wxHideShare');
        });
      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      this.$store.state.isIOS = isiOS;
      let _this = this;
      if(isiOS){
        navigator.appVersion.replace(/OS (\d+)_(\d+)_?(\d+)?/,function (match) {
          match = match.replace(/OS/,'').trim().split('_').join('.');
          _this.$store.state.isIOS = match;
        })
      }
//      if (isiOS &&  v[1] && v[2] && (parseInt(v[1],10) < 8   || (parseInt(v[1],10) == 8 && parseInt(v[2],10) <= 3))) {
      if (isiOS && _this.$store.state.isIOS.split('.')[0].length == 1 && _this.$store.state.isIOS <= '8.3') {
        this.$router.push({path : '/systemVersionTip'});
        this.$store.commit('UPDATE_LOADING',false);
      }else{
        //        进入页面获取信息之后  进行wxsdk的初始化 然后进行分享相关的初始化
        this.$store.dispatch('updateDocInfo').then(obj=>{
//           配置title
          this.$store.dispatch('setDocTitle',this.$route.meta.docTitle);
          this.$store.commit('UPDATE_LOADING',false);
          if(!this.$store.state.chat.isLoginChat){
            this.$store.dispatch('connConfig');
          }
        })
      }
    },
   mounted(){
     //在引导页滑动的时候 禁止掉背景的滑动
     document.querySelector('.lead').addEventListener("touchmove",(e)=>{
       e.preventDefault();
     });
   },
    components : {
      footerTab , winRotate , prompt,actionSheet,sheetSelect
    },
//   检测路由变化
   watch : {
      '$route' : 'routeChange',
      docInfo : {
         handler : function (v) {
           if(v.version <= '3.6'){
             this.step = '1';
           }
         },
         deep : true
      },
     step(v){
        this.stepPos(v);
     }
   }
 }
</script>
<style lang="scss">
  @import "assets/css/common";
  .loading{
    position: fixed;
    z-index: 9999999999;
    @include loading();
  }
  /*html{*/
    /*border: 1px solid blue;*/
  /*}*/
  /*改变默认的picker组件的样式*/
  .mui-poppicker-header,
  .mui-dtpicker-header {
    background: white;
    button{
      color: $baseBlue;
      background: white;
    }
  }
  .mui-dtpicker-header .mui-btn{
    font-size: .32rem;
  }
  .mui-dtpicker-title{
    display: flex;
    h5{
      background: white;
    }
    font-size: 0.26rem;
  }


  .container{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: $gray;
    overflow-y: scroll;
  }
  .mui-poppicker-header .mui-btn{
    font-size: 0.32rem;
  }
  .mui-poppicker-body{
    background: $gray;
  }
  .mui-picker{
    background: white;
  }
  .mui-pciker-list li{
    font-size: 0.44rem;
  }
  #app{
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    overflow: hidden;
    height: 100%;
    box-sizing: border-box;
  }
    /*分享二维码弹窗指引样式*/
  .share-window {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .6);
    top: 0;
    z-index: 100;
    text-align: right;
    position: fixed;
  }

  .share-window img {
    width: 100%;
    height: 2.44rem;
  }
  .share-window .img1{
    width: 1.1rem;
    height: 1.2rem;
    margin-top: 0.47rem;
    margin-right: 0.9rem;
  }
  .share-window .img2{
    width: 6.3rem;
    height: 1.8rem;
    display: block;
    margin: 0.5rem auto 0;
  }
  .nav{
    display: inline-block;
    position: relative;
    height: 0.80rem;
    background: #2a8cff;
    line-height: 0.80rem;
    font-size: 0.34rem;
    text-align: center;
    color: white;
    width: 100%;
    overflow: hidden;
    margin-top: 0;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    .nav_submit{
      font-size: 0.28rem;
    }
    span{
      display: inline-block;
      padding-right: 0.2rem;
      font-size: 0.32rem;
      visibility: visible;
      text-align: right;
    }
  }
  .nav1 .title,
  .nav .title{
    position: absolute;
    left: 50%;
    top: 50%;
    visibility: visible;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 6rem;
    transform: translate(-50%,-50%);
  }
  .nav1{
    span{
      visibility: hidden;
    }
    .nav_submit{
      font-size: 0.30rem;
    }
  }
  .nav_green{
    background: $baseGreen;
  }
  .nav:link{
    color: white;
  }
  .nav b{
    font-size: 0.32rem;
    font-weight: normal;
    text-align: left;
    display: inline-block;
    padding-left: 0.14rem;
    height: 0.80rem;
    line-height: 0.8rem;
    display: flex;
    align-items: center;
    i{
      font-size: 0.36rem;
      color: white;
      margin-right: 0.1rem;
    }
  }
#appContent1{
  width:100%;
  height:calc(100vh - 0.8rem);
  text-align: left;
  background: #edeff0;
  overflow: hidden;
  position: relative;
}
  #appContent2{
    width:100%;
    height:calc(100vh - 0.9rem);
    text-align: left;
    background: #edeff0;
    overflow: hidden;
    position: relative;
  }
  #appContent3{
    width:100%;
    height:100%;
    text-align: left;
    background: #edeff0;
    /*overflow: hidden;*/
    position: relative;
  }
  @font-face {
    font-family: 'icomoon';
    src:  url('../static/font/iconmoon/icomoon.eot?gk251e');
    src:  url('../static/font/iconmoon/icomoon.eot?gk251e#iefix') format('embedded-opentype'),
    url('../static/font/iconmoon/icomoon.ttf?gk251e') format('truetype'),
    url('../static/font/iconmoon/icomoon.woff?gk251e') format('woff'),
    url('../static/font/iconmoon/icomoon.svg?gk251e#icomoon') format('svg');
    font-weight: normal;
    font-style: normal;
  }

  [class^="icon-"], [class*=" icon-"] {
    /* use !important to prevent issues with browser extensions that change fonts */
    font-family: 'icomoon' !important;
    font-size: 0.52rem;
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    position: relative;
    /* Better Font Rendering =========== */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .icon-intro:before {
    content: "\eac3";
    color: #fe6270;
  }
  .icon-rotate:before {
    content: "\e987";
  }
  .icon-certificate-tip .path1:before {
    content: "\e984";
    color: rgb(42, 140, 255);
  }
  .icon-certificate-tip .path2:before {
    content: "\e985";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-line:before {
    content: "\e986";
    color: #000;
  }
  .icon-equipment .path1:before {
    content: "\e976";
    color: rgb(102, 172, 255);
  }
  .icon-equipment .path2:before {
    content: "\e977";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-equipment .path3:before {
    content: "\e978";
    margin-left: -1em;
    color: rgb(102, 172, 255);
  }
  .icon-equipment .path4:before {
    content: "\e979";
    margin-left: -1em;
    color: rgb(102, 172, 255);
  }

  .icon-system-order-icon .path1:before {
    content: "\e97a";
    color: rgb(42, 140, 255);
  }
  .icon-system-order-icon .path2:before {
    content: "\e97b";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-system-order-icon .path3:before {
    content: "\e97c";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-system-order-icon .path4:before {
    content: "\e97d";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-system-order-icon .path5:before {
    content: "\e97e";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-system-order-icon .path6:before {
    content: "\e97f";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-system-order-icon .path7:before {
    content: "\e980";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-system-order-icon .path8:before {
    content: "\e981";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-system-order-icon .path9:before {
    content: "\e982";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-system-order-icon .path10:before {
    content: "\e983";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-docHome-tele:before {
    content: "\e900";
    color: #fff;
  }
  .icon-docHome-order .path1:before {
    content: "\e96e";
    color: rgb(101, 172, 255);
  }
  .icon-docHome-order .path2:before {
    content: "\e96f";
    margin-left: -1em;
    color: rgb(101, 172, 255);
  }
  .icon-docHome-order .path3:before {
    content: "\e970";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-docHome-order .path4:before {
    content: "\e971";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-docHome-order .path5:before {
    content: "\e972";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-docHome-order .path6:before {
    content: "\e973";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-docHome-order .path7:before {
    content: "\e974";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-docHome-order .path8:before {
    content: "\e975";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-docHome-skill:before {
    content: "\e901";
    color: #65acff;
  }
  .icon-docHome-skill2:before {
    content: "\e902";
    color: #65acff;
  }
  .icon-docHome-return:before {
    content: "\e903";
    color: #fff;
  }
  .icon-docHome-consult:before {
    content: "\e904";
    color: #fff;
  }
  .icon-docHome-hope:before {
    content: "\e905";
    color: #65acff;
  }
  .icon-docHome-intro:before {
    content: "\e906";
    color: #65acff;
  }
  .icon-docHome-area:before {
    content: "\e907";
    color: #2a8cff;
  }
  .icon-certificating .path1:before {
    content: "\e908";
    font-size: 1rem;
    color: rgb(255, 255, 255);
  }
  .icon-certificating .path2:before {
    content: "\e955";
    margin-left: -1em;
    font-size: 1rem;
    color: rgb(255, 255, 255);
  }
  .icon-certificating .path3:before {
    content: "\e956";
    margin-left: -1em;
    font-size: 1rem;
    color: rgb(255, 255, 255);
  }
  .icon-certificating .path4:before {
    content: "\e957";
    margin-left: -1em;
    font-size: 1rem;
    color: rgb(42, 140, 255);
  }
  .icon-certificating .path5:before {
    content: "\e958";
    margin-left: -1em;
    font-size: 1rem;
    color: rgb(255, 255, 255);
  }
  .icon-certificating .path6:before {
    content: "\e959";
    margin-left: -1em;
    font-size: 1rem;
    color: rgb(255, 255, 255);
  }
  .icon-certificating .path7:before {
    content: "\e95a";
    margin-left: -1em;
    font-size: 1rem;
    color: rgb(255, 255, 255);
  }
  .icon-uncertificate .path1:before {
    content: "\e909";
    font-size: 1rem;
    color: rgb(255, 255, 255);
  }
  .icon-uncertificate .path2:before {
    content: "\e95b";
    margin-left: -1em;
    font-size: 1rem;
    color: rgb(42, 140, 255);
  }
  .icon-uncertificate .path3:before {
    content: "\e95c";
    margin-left: -1em;
    font-size: 1rem;
    color: rgb(255, 255, 255);
  }
  .icon-uncertificate .path4:before {
    content: "\e95d";
    margin-left: -1em;
    font-size: 1rem;
    color: rgb(255, 255, 255);
  }
  .icon-certificated .path1:before {
    content: "\e927";
    font-size: 1rem;
    color: rgb(255, 255, 255);
  }
  .icon-certificated .path2:before {
    content: "\e928";
    margin-left: -1em;
    font-size: 1rem;
    color: rgb(42, 140, 255);
  }
  .icon-certificated .path3:before {
    content: "\e929";
    margin-left: -1em;
    font-size: 1rem;
    color: rgb(255, 255, 255);
  }
  .icon-certificated .path4:before {
    content: "\e92a";
    margin-left: -1em;
    font-size: 1rem;
    color: rgb(255, 255, 255);
  }
  .icon-area-select .path1:before {
    content: "\e90a";
    color: rgb(42, 140, 255);
  }
  .icon-area-select .path2:before {
    content: "\e95e";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-hospital-area:before {
    content: "\e92b";
    color: #65acff;
  }
  .icon-add-edit:before {
    content: "\e92c";
    color: #cdcdcd;
  }
  .icon-edit:before {
    content: "\e92d";
    color: #fff;
  }


  .icon-contact-consult .path1:before {
    content: "\e921";
    color: rgb(249, 180, 8);
  }
  .icon-contact-consult .path2:before {
    content: "\ea49";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-contact-family .path1:before {
    content: "\ea4f";
    color: rgb(0, 146, 255);
  }
  .icon-contact-family .path2:before {
    content: "\ea50";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-group-news .path1:before {
    content: "\ea51";
    color: rgb(2, 168, 255);
  }
  .icon-group-news .path2:before {
    content: "\ea54";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-group-news .path3:before {
    content: "\ea55";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-group-news .path4:before {
    content: "\ea7e";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-group-news .path5:before {
    content: "\ea7f";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-group-news-1:before {
    content: "\ea95";
    color: #2a8cff;
  }
  .icon-footer-myPatients .path1:before {
    content: "\e92e";
    color: rgb(42, 140, 255);
  }
  .icon-footer-myPatients .path2:before {
    content: "\e92f";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-footer-myPatients .path3:before {
    content: "\e930";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-footer-myPatients .path4:before {
    content: "\e931";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-footer-myPatients .path5:before {
    content: "\ea53";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-footer-myPatients .path6:before {
    content: "\ea7a";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-footer-myPatients .path7:before {
    content: "\ea7b";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-footer-myPatients .path8:before {
    content: "\ea7c";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-footer-myPatients .path9:before {
    content: "\ea7d";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-footer-message .path1:before {
    content: "\ea81";
    color: rgb(42, 140, 255);
  }
  .icon-footer-message .path2:before {
    content: "\ea82";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-footer-message .path3:before {
    content: "\ea83";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-footer-my:before {
    content: "\ea84";
    color: #2a8cff;
  }
  .icon-footer-home:before {
    content: "\ea85";
    color: #2a8cff;
  }
  .icon-footer-msg-default:before {
    content: "\e932";
    color: #cdcdcd;
  }
  .icon-my-service:before {
    content: "\e933";
    color: #65acff;
  }
  .icon-my-set:before {
    content: "\e934";
    color: #65acff;
  }
  .icon-my-idCard:before {
    content: "\e935";
    color: #65acff;
  }
  .icon-my-message:before {
    content: "\e936";
    color: #65acff;
  }
  .icon-my-wallet:before {
    content: "\e937";
    color: #65acff;
  }
  .icon-my-home:before {
    content: "\e938";
    color: #65acff;
  }
  .icon-my-area:before {
    content: "\e939";
    color: #65acff;
  }
  .icon-setgroup-background .path1:before {
    content: "\e93a";
    /*color: rgb(42, 140, 255);*/
  }
  .icon-setgroup-background .path2:before {
    content: "\e95f";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-setgroup-background .path3:before {
    content: "\e960";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-setgroup-background .path4:before {
    content: "\e961";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-deletegroup .path1:before {
    content: "\e93b";
    color: rgb(249, 86, 78);
  }
  .icon-deletegroup .path2:before {
    content: "\e962";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-deletegroup .path3:before {
    content: "\e963";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-addpatient .path1:before {
    content: "\e93c";
    color: rgb(42, 140, 255);
  }
  .icon-addpatient .path2:before {
    content: "\e964";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-addpatient .path3:before {
    content: "\e965";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-report .path1:before {
    content: "\e93d";
    color: rgb(255, 198, 0);
  }
  .icon-report .path2:before {
    content: "\e966";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-report .path3:before {
    content: "\e967";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-scan .path1:before {
    content: "\e93e";
    color: rgb(2, 168, 255);
  }
  .icon-scan .path2:before {
    content: "\e968";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-scan .path3:before {
    content: "\e969";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-scan .path4:before {
    content: "\e96a";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-scan .path5:before {
    content: "\e96b";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-scan .path6:before {
    content: "\e96c";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-edit2:before {
    content: "\e93f";
    color: #bfbfbf;
  }
  .icon-setgroup:before {
    content: "\e940";
    color: #fff;
  }
  .icon-plus:before {
    content: "\e941";
    color: #fff;
  }
  .icon-delete:before {
    content: "\e942";
    color: #fff;
  }
  .icon-selected .path1:before {
    content: "\e943";
    color: rgb(42, 140, 255);
  }
  .icon-selected .path2:before {
    content: "\e96d";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-have-pay:before {
    content: "\e944";
    /*color: #2a8cff;*/
  }
  .icon-return-right:before {
    content: "\e945";
  }
  .icon-home:before {
    content: "\e946";
    color: #2a8cff;
  }
  .icon-contacts:before {
    content: "\e947";
    color: #2a8cff;
  }
  .icon-my:before {
    content: "\e948";
    color: #2a8cff;
  }
  .icon-message:before {
    content: "\e949";
    color: #2a8cff;
  }
  .icon-tele:before {
    content: "\e94a";
    color: #2a8cff;
  }
  .icon-return-boldleft:before {
    content: "\eac0";
  }
  .icon-return-thinleft:before {
    content: "\e94c";
    color: #fff;
  }
  .icon-payed:before {
    content: "\e94e";
    color: #2a8cff;
  }
  .icon-close:before {
    content: "\e94f";
    color: #fff;
  }
  .icon-delay:before {
    content: "\e950";
    color: #2a8cff;
  }
  .icon-calendar:before {
    content: "\e951";
    color: #2a8cff;
  }
  .icon-doctor:before {
    content: "\e952";
    color: #2a8cff;
  }
  .icon-search:before {
    content: "\e953";
    color: #8a8a8a;
  }
  .icon-picture:before {
    content: "\e954";
    color: #2a8cff;
  }

  /*2017-08-25新增的提现  钱包相关的icon*/

  .icon-money-none:before {
    content: "\ea16";
    color: #fff;
  }
  .icon-wallet-phone .path1:before {
    content: "\ea17";
    color: rgb(42, 140, 255);
  }
  .icon-wallet-phone .path2:before {
    content: "\ea18";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-wallet-phone .path3:before {
    content: "\ea19";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-wallet-phone .path4:before {
    content: "\ea1a";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-wallet-phone .path5:before {
    content: "\ea1b";
    margin-left: -1em;
    color: rgb(136, 195, 252);
  }
  .icon-wallet-phone .path6:before {
    content: "\ea1c";
    margin-left: -1em;
    color: rgb(101, 172, 255);
  }
  .icon-wallet-doctor .path1:before {
    content: "\ea1d";
    color: rgb(42, 140, 255);
  }
  .icon-wallet-doctor .path2:before {
    content: "\ea1e";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-wallet-doctor .path3:before {
    content: "\ea1f";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-wallet-doctor .path4:before {
    content: "\ea20";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-wallet-doctor .path5:before {
    content: "\ea21";
    margin-left: -1em;
    color: rgb(136, 195, 252);
  }
  .icon-keyboard:before {
    content: "\ea22";
  }
  .icon-money-show:before {
    content: "\ea23";
    color: #fff;
  }
  .icon-wallet-order .path1:before {
    content: "\ea24";
    color: rgb(42, 140, 255);
  }
  .icon-wallet-order .path2:before {
    content: "\ea25";
    margin-left: -1em;
    color: rgb(136, 195, 252);
  }
  .icon-wallet-order .path3:before {
    content: "\ea26";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-wallet-order .path4:before {
    content: "\ea27";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-wallet-order .path5:before {
    content: "\ea28";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-wallet-order .path6:before {
    content: "\ea29";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-wallet-order .path7:before {
    content: "\ea2a";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-wallet-order .path8:before {
    content: "\ea2b";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-wallet-order .path9:before {
    content: "\ea2c";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-wallet-order .path10:before {
    content: "\ea2d";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-wallet-order .path11:before {
    content: "\ea2e";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-clear:before {
    content: "\ea2f";
  }
  .icon-RMB:before {
    content: "\ea30";
  }
  .icon-time:before {
    content: "\ea31";
    color: #2a8cff;
  }
  .icon-paraphrase:before {
    content: "\ea32";
    color: #2a8cff;
  }
  .icon-wallet-visit .path1:before {
    content: "\ea33";
    color: rgb(42, 140, 255);
  }
  .icon-wallet-visit .path2:before {
    content: "\ea34";
    margin-left: -1em;
    color: rgb(136, 195, 252);
  }
  .icon-wallet-visit .path3:before {
    content: "\ea35";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-mark:before {
    content: "\ea36";
    color: #2a8cff;
  }
  .icon-plan-status-1:before {
    content: "\ea37";
    color: #dbdbdb;
  }
  .icon-plan-status-3:before {
    content: "\ea38";
    color: #2a8cff;
  }
  .icon-plan-status-2:before {
    content: "\ea39";
    color: #2a8cff;
  }
  .icon-add-bank:before {
    content: "\ea3a";
    color: #c9caca;
  }
  .icon-wallet-IT .path1:before {
    content: "\ea3b";
    color: rgb(42, 140, 255);
  }
  .icon-wallet-IT .path2:before {
    content: "\ea3c";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-wallet-IT .path3:before {
    content: "\ea3d";
    margin-left: -1em;
    color: rgb(136, 195, 252);
  }
  .icon-wallet-IT .path4:before {
    content: "\ea3e";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-weixin-icon .path1:before {
    content: "\ea3f";
    color: rgb(69, 196, 93);
  }
  .icon-weixin-icon .path2:before {
    content: "\ea40";
    margin-left: -1em;
    color: rgb(81, 195, 50);
  }
  .icon-arrow-top:before {
    content: "\ea41";
    color: #2a8cff;
  }
  .icon-question:before {
    content: "\ea42";
    // color: #fff;
  }
  .icon-add:before {
    content: "\e98c";
    color: #cdcdcd;
  }

  .icon-my-indent:before {
    content: "\ea4a";
    color: #65acff;
  }
  .icon-indent-constult-icon:before {
    content: "\ea4b";
    color: #2a8cff;
  }
  .icon-verify-success:before {
    content: "\ea4c";
    color: #2a8cff;
  }
  .icon-weixin-safe:before {
    content: "\ea4d";
    color: #00c800;
  }
  .icon-verify-fail:before {
    content: "\ea4e";
    color: #f2564e;
  }
  /*银行的图标*/

  .icon-0403-bg .path1:before {
    content: "\e98e";
    color: rgb(247, 99, 99);
  }
  .icon-0403-bg .path2:before {
    content: "\e98f";
    margin-left: -3.2861328125em;
    /*color: rgb(255, 255, 255);*/
    /*opacity: 0.6;*/
    color: rgba(255,255,255,0.6);
  }
  .icon-0403-bg .path3:before {
    content: "\e990";
    margin-left: -3.2861328125em;
    color: rgb(227, 19, 27);
  }
  .icon-0403-bg .path4:before {
    content: "\e991";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.3;
  }
  .icon-0102-bg .path1:before {
    content: "\e992";
    color: rgb(247, 99, 99);
  }
  .icon-0102-bg .path2:before {
    content: "\e993";
    margin-left: -3.2861328125em;
    /*color: rgb(255, 255, 255);*/
    /*opacity: 0.6;*/
    color: rgba(255,255,255,0.6);
  }
  .icon-0102-bg .path3:before {
    content: "\e994";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
  }
  .icon-0102-bg .path4:before {
    content: "\e995";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.3;
  }
  .icon-0102-bg .path5:before {
    content: "\e996";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.3;
  }
  .icon-0102-bg .path6:before {
    content: "\e997";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.3;
  }
  .icon-0303-bg .path1:before {
    content: "\e998";
    color: rgb(165, 74, 163);
  }
  .icon-0303-bg .path2:before {
    content: "\e999";
    margin-left: -3.2861328125em;
    color: rgb(255, 255, 255);
    opacity: 0.3;
  }
  .icon-0303-bg .path3:before {
    content: "\e99a";
    margin-left: -3.2861328125em;
    color: rgb(165, 74, 163);
  }
  .icon-0303-bg .path4:before {
    content: "\e99b";
    margin-left: -3.2861328125em;
    color: rgb(165, 74, 163);
  }
  .icon-0303-bg .path5:before {
    content: "\e99c";
    margin-left: -3.2861328125em;
    color: rgb(165, 74, 163);
  }
  .icon-0303-bg .path6:before {
    content: "\e99d";
    margin-left: -3.2861328125em;
    color: rgb(165, 74, 163);
  }
  .icon-0303-bg .path7:before {
    content: "\e99e";
    margin-left: -3.2861328125em;
    color: rgb(255, 255, 255);
    opacity: 0.1;
  }
  .icon-0303-bg .path8:before {
    content: "\e99f";
    margin-left: -3.2861328125em;
    color: rgb(255, 255, 255);
    opacity: 0.1;
  }
  .icon-0303-bg .path9:before {
    content: "\e9a0";
    margin-left: -3.2861328125em;
    color: rgb(255, 255, 255);
    opacity: 0.1;
  }
  .icon-0303-bg .path10:before {
    content: "\e9a1";
    margin-left: -3.2861328125em;
    color: rgb(255, 255, 255);
    opacity: 0.1;
  }
  .icon-0306-bg .path1:before {
    content: "\e9a2";
    color: rgb(247, 99, 99);
  }
  .icon-0306-bg .path2:before {
    content: "\e9a3";
    margin-left: -3.2861328125em;
    /*color: rgb(255, 255, 255);*/
    /*opacity: 0.6;*/
    color: rgba(255,255,255,0.6);
  }
  .icon-0306-bg .path3:before {
    content: "\e9a4";
    margin-left: -3.2861328125em;
    color: rgb(189, 0, 22);
    opacity: 0.7;
  }
  .icon-0306-bg .path4:before {
    content: "\e9a5";
    margin-left: -3.2861328125em;
    color: rgb(115, 0, 0);
    opacity: 0.7;
  }
  .icon-0306-bg .path5:before {
    content: "\e9a6";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 32);
    opacity: 0.7;
  }
  .icon-0306-bg .path6:before {
    content: "\e9a7";
    margin-left: -3.2861328125em;
    color: rgb(189, 0, 22);
    opacity: 0.7;
  }
  .icon-0306-bg .path7:before {
    content: "\e9a8";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 32);
    opacity: 0.7;
  }
  .icon-0306-bg .path8:before {
    content: "\e9a9";
    margin-left: -3.2861328125em;
    color: rgb(115, 0, 0);
    opacity: 0.7;
  }
  .icon-0306-bg .path9:before {
    content: "\e9aa";
    margin-left: -3.2861328125em;
    color: rgb(189, 0, 22);
    opacity: 0.3;
  }
  .icon-0306-bg .path10:before {
    content: "\e9ab";
    margin-left: -3.2861328125em;
    color: rgb(115, 0, 0);
    opacity: 0.3;
  }
  .icon-0306-bg .path11:before {
    content: "\e9ac";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 32);
    opacity: 0.3;
  }
  .icon-0306-bg .path12:before {
    content: "\e9ad";
    margin-left: -3.2861328125em;
    color: rgb(189, 0, 22);
    opacity: 0.3;
  }
  .icon-0306-bg .path13:before {
    content: "\e9ae";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 32);
    opacity: 0.3;
  }
  .icon-0306-bg .path14:before {
    content: "\e9af";
    margin-left: -3.2861328125em;
    color: rgb(115, 0, 0);
    opacity: 0.3;
  }
  .icon-0304-bg .path1:before {
    content: "\e9b0";
    color: rgb(247, 99, 99);
  }
  .icon-0304-bg .path2:before {
    content: "\e9b1";
    margin-left: -3.2861328125em;
    /*color: rgb(255, 255, 255);*/
    /*opacity: 0.6;*/
    color: rgba(255,255,255,0.6);
  }
  .icon-0304-bg .path3:before {
    content: "\e9b2";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.3;
  }
  .icon-0304-bg .path4:before {
    content: "\e9b3";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.3;
  }
  .icon-0304-bg .path5:before {
    content: "\e9b4";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
  }
  .icon-0304-bg .path6:before {
    content: "\e9b5";
    margin-left: -3.2861328125em;
    color: rgb(255, 255, 255);
  }
  .icon-0105-bg .path1:before {
    content: "\e9b6";
    color: rgb(89, 121, 224);
  }
  .icon-0105-bg .path2:before {
    content: "\e9b7";
    margin-left: -3.2861328125em;
    /*color: rgb(255, 255, 255);*/
    /*opacity: 0.6;*/
    color: rgba(255,255,255,0.6);
  }
  .icon-0105-bg .path3:before {
    content: "\e9b8";
    margin-left: -3.2861328125em;
    color: rgb(0, 59, 143);
  }
  .icon-0105-bg .path4:before {
    content: "\e9b9";
    margin-left: -3.2861328125em;
    color: rgb(0, 59, 143);
    opacity: 0.3;
  }
  .icon-0105-bg .path5:before {
    content: "\e9ba";
    margin-left: -3.2861328125em;
    color: rgb(0, 59, 143);
    opacity: 0.3;
  }
  .icon-0301-bg .path1:before {
    content: "\e9bb";
    color: rgb(89, 121, 224);
  }
  .icon-0301-bg .path2:before {
    content: "\e9bc";
    margin-left: -3.2861328125em;
    /*color: rgb(255, 255, 255);*/
    /*opacity: 0.6;*/
    color: rgba(255,255,255,0.6);
  }
  .icon-0301-bg .path3:before {
    content: "\e9bd";
    margin-left: -3.2861328125em;
    color: rgb(29, 32, 135);
  }
  .icon-0301-bg .path4:before {
    content: "\e9be";
    margin-left: -3.2861328125em;
    color: rgb(29, 32, 135);
    opacity: 0.3;
  }
  .icon-0305-bg .path1:before {
    content: "\e9bf";
    color: rgb(90, 164, 114);
  }
  .icon-0305-bg .path2:before {
    content: "\e9c0";
    margin-left: -3.2861328125em;
    /*color: rgb(255, 255, 255);*/
    /*opacity: 0.6;*/
    color: rgba(255,255,255,0.6);
  }
  .icon-0305-bg .path3:before {
    content: "\e9c1";
    margin-left: -3.2861328125em;
    color: rgb(29, 32, 135);
  }
  .icon-0305-bg .path4:before {
    content: "\e9c2";
    margin-left: -3.2861328125em;
    color: rgb(90, 164, 114);
  }
  .icon-0305-bg .path5:before {
    content: "\e9c3";
    margin-left: -3.2861328125em;
    color: rgb(255, 255, 255);
    opacity: 0.1;
  }
  .icon-0305-bg .path6:before {
    content: "\e9c4";
    margin-left: -3.2861328125em;
    color: rgb(255, 255, 255);
    opacity: 0.1;
  }
  .icon-0103-bg .path1:before {
    content: "\e9c5";
    color: rgb(1, 140, 119);
  }
  .icon-0103-bg .path2:before {
    content: "\e9c6";
    margin-left: -3.2861328125em;
    /*color: rgb(255, 255, 255);*/
    /*opacity: 0.6;*/
    color: rgba(255,255,255,0.6);
  }
  .icon-0103-bg .path3:before {
    content: "\e9c7";
    margin-left: -3.2861328125em;
    color: rgb(0, 145, 116);
  }
  .icon-0103-bg .path4:before {
    content: "\e9c8";
    margin-left: -3.2861328125em;
    color: rgb(7, 170, 139);
    opacity: 0.3;
  }
  .icon-0103-bg .path5:before {
    content: "\e9c9";
    margin-left: -3.2861328125em;
    color: rgb(7, 170, 139);
    opacity: 0.3;
  }
  .icon-0310-bg .path1:before {
    content: "\e9ca";
    color: rgb(89, 121, 224);
  }
  .icon-0310-bg .path2:before {
    content: "\e9cb";
    margin-left: -3.2861328125em;
    /*color: rgb(255, 255, 255);*/
    /*opacity: 0.6;*/
    color: rgba(255,255,255,0.6);
  }
  .icon-0310-bg .path3:before {
    content: "\e9cc";
    margin-left: -3.2861328125em;
    color: rgb(29, 32, 135);
    opacity: 0.3;
  }
  .icon-0310-bg .path4:before {
    content: "\e9cd";
    margin-left: -3.2861328125em;
    color: rgb(29, 32, 135);
  }
  .icon-0401-bg .path1:before {
    content: "\e9ce";
    color: rgb(214, 180, 37);
  }
  .icon-0401-bg .path2:before {
    content: "\e9cf";
    margin-left: -3.2861328125em;
    /*color: rgb(255, 255, 255);*/
    /*opacity: 0.6;*/
    color: rgba(255,255,255,0.6);
  }
  .icon-0401-bg .path3:before {
    content: "\e9d0";
    margin-left: -3.2861328125em;
    color: rgb(252, 207, 0);
  }
  .icon-0401-bg .path4:before {
    content: "\e9d1";
    margin-left: -3.2861328125em;
    color: rgb(41, 60, 143);
  }
  .icon-0401-bg .path5:before {
    content: "\e9d2";
    margin-left: -3.2861328125em;
    color: rgb(255, 255, 255);
    opacity: 0.2;
  }
  .icon-0401-bg .path6:before {
    content: "\e9d3";
    margin-left: -3.2861328125em;
    color: rgb(255, 255, 255);
    opacity: 0.2;
  }
  .icon-0309-bg .path1:before {
    content: "\e9db";
    color: rgb(89, 120, 226);
  }
  .icon-0309-bg .path2:before {
    content: "\e9dc";
    margin-left: -3.2861328125em;
    /*color: rgb(255, 255, 255);*/
    /*opacity: 0.6;*/
    color: rgba(255,255,255,0.6);
  }
  .icon-0309-bg .path3:before {
    content: "\e9dd";
    margin-left: -3.2861328125em;
    color: rgb(0, 65, 134);
    opacity: 0.3;
  }
  .icon-0309-bg .path4:before {
    content: "\e9de";
    margin-left: -3.2861328125em;
    color: rgb(0, 65, 134);
  }
  .icon-0308-icon:before {
    content: "\e9df";
    color: #e50012;
  }
  .icon-0102-icon:before {
    content: "\e9e0";
    color: #e50012;
  }
  .icon-0103-icon:before {
    content: "\e9e1";
    color: #009174;
  }
  .icon-0104-icon:before {
    content: "\e9e2";
    color: #b81c22;
  }
  .icon-0105-icon:before {
    content: "\e9e3";
    color: #003b8f;
  }
  .icon-0301-icon:before {
    content: "\e9e4";
    color: #1d2087;
  }
  .icon-0100-icon:before {
    content: "\e9e5";
    color: #007e3e;
  }
  .icon-0302-icon .path1:before {
    content: "\e9e6";
    color: rgb(0, 103, 176);
  }
  .icon-0302-icon .path2:before {
    content: "\e9e7";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-0302-icon .path3:before {
    content: "\e9e8";
    margin-left: -1em;
    color: rgb(229, 0, 18);
  }
  .icon-0303-icon .path1:before {
    content: "\e9e9";
    color: rgb(251, 230, 0);
  }
  .icon-0303-icon .path2:before {
    content: "\e9ea";
    margin-left: -1.9453125em;
    color: rgb(190, 41, 119);
  }
  .icon-0303-icon .path3:before {
    content: "\e9eb";
    margin-left: -1.9453125em;
    color: rgb(190, 41, 119);
  }
  .icon-0303-icon .path4:before {
    content: "\e9ec";
    margin-left: -1.9453125em;
    color: rgb(190, 41, 119);
  }
  .icon-0309-icon:before {
    content: "\e9ed";
    color: #004186;
  }
  .icon-0310-icon:before {
    content: "\e9ee";
    color: #1d2087;
  }
  .icon-0306-icon .path1:before {
    content: "\e9ef";
    color: rgb(189, 0, 22);
  }
  .icon-0306-icon .path2:before {
    content: "\e9f0";
    margin-left: -1em;
    color: rgb(115, 0, 0);
  }
  .icon-0306-icon .path3:before {
    content: "\e9f1";
    margin-left: -1em;
    color: rgb(229, 0, 32);
  }
  .icon-0306-icon .path4:before {
    content: "\e9f2";
    margin-left: -1em;
    color: rgb(189, 0, 22);
  }
  .icon-0306-icon .path5:before {
    content: "\e9f3";
    margin-left: -1em;
    color: rgb(229, 0, 32);
  }
  .icon-0306-icon .path6:before {
    content: "\e9f4";
    margin-left: -1em;
    color: rgb(115, 0, 0);
  }
  .icon-0401-icon .path1:before {
    content: "\e9f5";
    color: rgb(252, 207, 0);
  }
  .icon-0401-icon .path2:before {
    content: "\e9f6";
    margin-left: -1em;
    color: rgb(41, 60, 143);
  }
  .icon-0403-icon:before {
    content: "\e9f7";
    color: #e3131b;
  }
  .icon-0304-icon .path1:before {
    content: "\e9f8";
    color: rgb(229, 0, 18);
  }
  .icon-0304-icon .path2:before {
    content: "\e9f9";
    margin-left: -1em;
    color: rgb(219, 220, 220);
  }
  .icon-0305-icon .path1:before {
    content: "\e9fa";
    color: rgb(29, 32, 135);
  }
  .icon-0305-icon .path2:before {
    content: "\e9fb";
    margin-left: -1em;
    color: rgb(90, 164, 114);
  }
  .icon-0100-bg .path1:before {
    content: "\e9fc";
    color: rgb(1, 140, 119);
  }
  .icon-0100-bg .path2:before {
    content: "\e9fd";
    margin-left: -3.2861328125em;
    /*color: rgb(255, 255, 255);*/
    /*opacity: 0.6;*/
    color: rgba(255,255,255,0.6);
  }
  .icon-0100-bg .path3:before {
    content: "\e9fe";
    margin-left: -3.2861328125em;
    color: rgb(0, 126, 62);
  }
  .icon-0100-bg .path4:before {
    content: "\e9ff";
    margin-left: -3.2861328125em;
    color: rgb(255, 255, 255);
    opacity: 0.1;
  }
  .icon-0308-bg .path1:before {
    content: "\ea00";
    color: rgb(247, 99, 99);
  }
  .icon-0308-bg .path2:before {
    content: "\ea01";
    margin-left: -3.2861328125em;
    /*color: rgb(255, 255, 255);*/
    /*opacity: 0.6;*/
    color: rgba(255,255,255,0.6);
  }
  .icon-0308-bg .path3:before {
    content: "\ea02";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
  }
  .icon-0308-bg .path4:before {
    content: "\ea03";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.3;
  }
  .icon-0308-bg .path5:before {
    content: "\ea04";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.3;
  }
  .icon-0308-bg .path6:before {
    content: "\ea05";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.3;
  }
  .icon-0308-bg .path7:before {
    content: "\ea06";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.3;
  }
  .icon-0308-bg .path8:before {
    content: "\ea07";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.3;
  }
  .icon-0308-bg .path9:before {
    content: "\ea08";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.3;
  }
  .icon-0308-bg .path10:before {
    content: "\ea09";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.3;
  }
  .icon-0308-bg .path11:before {
    content: "\ea0a";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.3;
  }
  .icon-0308-bg .path12:before {
    content: "\ea0b";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.3;
  }
  .icon-0308-bg .path13:before {
    content: "\ea0c";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.3;
  }
  .icon-0308-bg .path14:before {
    content: "\ea0d";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.3;
  }
  .icon-0104-bg .path1:before {
    content: "\ea0e";
    color: rgb(247, 99, 99);
  }
  .icon-0104-bg .path2:before {
    content: "\ea0f";
    margin-left: -3.2861328125em;
    /*color: rgb(255, 255, 255);*/
    /*opacity: 0.6;*/
    color: rgba(255,255,255,0.6);
  }
  .icon-0104-bg .path3:before {
    content: "\ea10";
    margin-left: -3.2861328125em;
    color: rgb(184, 28, 34);
  }
  .icon-0104-bg .path4:before {
    content: "\ea11";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.3;
  }
  .icon-0302-bg .path1:before {
    content: "\ea12";
    color: rgb(247, 99, 99);
  }
  .icon-0302-bg .path2:before {
    content: "\ea13";
    margin-left: -3.2861328125em;
    /*color: rgb(255, 255, 255);*/
    /*opacity: 0.6;*/
    color: rgba(255,255,255,0.6);
  }
  .icon-0302-bg .path3:before {
    content: "\ea14";
    margin-left: -3.2861328125em;
    color: rgb(229, 0, 18);
    opacity: 0.7;
  }
  .icon-0302-bg .path4:before {
    content: "\ea15";
    margin-left: -3.2861328125em;
    color: rgb(255, 255, 255);
    opacity: 0.1;
  }


  .icon-chat-voice2:before {
    content: "\e920";
    color: #2a8cff;
  }
  .icon-chat-voicePlay:before {
    content: "\e923";
    color: #2a8cff;
  }
  .icon-chat-voicePause:before {
    content: "\e924";
    color: #2a8cff;
  }
  .icon-chat-more:before {
    content: "\e925";
    color: #6f6e6e;
  }
  .icon-chat-voice3:before {
    content: "\e926";
    color: #6f6e6e;
  }
  .icon-chat-voice1 .path1:before {
    content: "\ea17";
    color: rgb(42, 140, 255);
  }
  .icon-chat-voice1 .path2:before {
    content: "\ea56";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-chat-voice1 .path3:before {
    content: "\ea57";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-chat-free:before {
    content: "\ea5d";
    color: #2a8cff;
  }
  .icon-chat-newPatient:before {
    content: "\ea5e";
    color: #2a8cff;
  }
  .icon-chat-time:before {
    content: "\ea5f";
    color: #2a8cff;
  }
  .icon-chat-chart1 .path1:before {
    content: "\ea60";
    color: rgb(42, 140, 255);
  }
  .icon-chat-chart1 .path2:before {
    content: "\ea61";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-chat-chart1 .path3:before {
    content: "\ea62";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-chat-chart1 .path4:before {
    content: "\ea63";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-chat-chart2 .path1:before {
    content: "\ea64";
    color: rgb(249, 180, 8);
  }
  .icon-chat-chart2 .path2:before {
    content: "\ea65";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-chat-chart2 .path3:before {
    content: "\ea66";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-chat-chart2 .path4:before {
    content: "\ea67";
    margin-left: -1em;
    color: rgb(249, 180, 8);
  }
  .icon-chat-chart3 .path1:before {
    content: "\ea68";
    color: rgb(42, 140, 255);
  }
  .icon-chat-chart3 .path2:before {
    content: "\ea69";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-chat-chart3 .path3:before {
    content: "\ea6a";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-chat-chart3 .path4:before {
    content: "\ea6b";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-chat-chart3 .path5:before {
    content: "\ea6c";
    margin-left: -1em;
    color: rgb(42, 140, 255);
  }
  .icon-chat-evaluate1:before {
    content: "\ea6d";
    color: #ffcc01;
  }
  .icon-chat-evaluate2:before {
    content: "\ea6e";
    color: #c9caca;
  }

  /***************************************修改***********************************************/


  .icon-set-phone:before {
    content: "\e913";
    color: #15c392;
  }
  .icon-set-family .path1:before {
    content: "\e914";
    color: rgb(252, 93, 89);
  }
  .icon-set-family .path2:before {
    content: "\e915";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-set-family .path3:before {
    content: "\e916";
    margin-left: -1em;
    color: rgb(252, 93, 89);
  }
  .icon-set-order .path1:before {
    content: "\e917";
    color: rgb(249, 180, 8);
  }
  .icon-set-order .path2:before {
    content: "\e918";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-set-order .path3:before {
    content: "\e919";
    margin-left: -1em;
    color: rgb(249, 180, 8);
  }
  .icon-set-free:before {
    content: "\e91a";
    color: #3a79f9;
  }
  .icon-set-consult .path1:before {
    content: "\e91b";
    color: rgb(0, 146, 255);
  }
  .icon-set-consult .path2:before {
    content: "\e91c";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-set-consult .path3:before {
    content: "\e91d";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-set-consult .path4:before {
    content: "\e91e";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-group:before {
    content: "\ea9a";
     color: #2a8cff;
   }
  .icon-home-patient .path1:before {
    content: "\ea18";
    color: rgb(58, 121, 249);
  }
  .icon-home-patient .path2:before {
    content: "\ea19";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-patient .path3:before {
    content: "\ea1a";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-consult .path1:before {
    content: "\ea1b";
    color: rgb(0, 158, 255);
  }
  .icon-home-consult .path2:before {
    content: "\ea1c";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-appoint .path1:before {
    content: "\ea1d";
    color: rgb(249, 107, 107);
  }
  .icon-home-appoint .path2:before {
    content: "\ea1e";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-appoint .path3:before {
    content: "\ea1f";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-scienceing .path1:before {
    content: "\eaa5";
    color: rgb(8, 204, 249);
  }
  .icon-home-scienceing .path2:before {
    content: "\eaa6";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-scienceing .path3:before {
    content: "\eaa7";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-study .path1:before {
    content: "\ea2a";
    color: rgb(247, 191, 11);
  }
  .icon-home-study .path2:before {
    content: "\ea2b";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-study .path3:before {
    content: "\ea2c";
    margin-left: -1em;
    color: rgb(255, 255, 255);
    opacity: 0.7;
  }
  .icon-home-study .path4:before {
    content: "\ea2d";
    margin-left: -1em;
    color: rgb(193, 144, 5);
  }
  .icon-home-study .path5:before {
    content: "\ea2e";
    margin-left: -1em;
    color: rgb(193, 144, 5);
  }
  .icon-home-study .path6:before {
    content: "\ea33";
    margin-left: -1em;
    color: rgb(193, 144, 5);
  }
  .icon-home-myGroup .path1:before {
    content: "\ea34";
    color: rgb(21, 195, 146);
  }
  .icon-home-myGroup .path2:before {
    content: "\ea35";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-myGroup .path3:before {
    content: "\ea3b";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-myGroup .path4:before {
    content: "\ea3c";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-myGroup .path5:before {
    content: "\ea3d";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-myGroup .path6:before {
    content: "\ea3e";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-myGroup .path7:before {
    content: "\ea43";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-myGroup .path8:before {
    content: "\ea44";
    margin-left: -1em;
    color: rgb(255, 255, 255);
    opacity: 0.7;
  }
  .icon-home-myGroup .path9:before {
    content: "\ea45";
    margin-left: -1em;
    color: rgb(5, 147, 103);
  }
  .icon-home-myGroup .path10:before {
    content: "\ea46";
    margin-left: -1em;
    color: rgb(5, 147, 103);
  }
  .icon-home-myGroup .path11:before {
    content: "\ea47";
    margin-left: -1em;
    color: rgb(5, 147, 103);
  }
  .icon-education-center:before {
    content: "\ea48";
    color: #2a8cff;
  }
  .icon-home-phone .path6:before {
    content: "\ea43";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-news:before {
    content: "\eabb";
    color: #2a8cff;
  }
  .icon-home-wenzhen:before {
    content: "\ea97";
    color: #2a8cff;
  }
  .icon-home-intro-collect:before {
    content: "\ea98";
    color: #2a8cff;
  }
  .icon-home-invite:before {
    content: "\ea48";
    color: #2a8cff;
  }
  .icon-home-service:before {
    content: "\eabc";
    color: #2a8cff;
  }
  .icon-weixin-bg .path1:before {
    content: "\e90b";
    color: rgb(97, 193, 122);
  }
  .icon-weixin-bg .path2:before {
    content: "\e90c";
    margin-left: -3.2861328125em;
    color: rgba(255, 255, 255, 0.6);
  }
  .icon-weixin-bg .path3:before {
    content: "\e90d";
    margin-left: -3.2861328125em;
    color: rgb(255, 255, 255);
  }
  .icon-weixin-bg .path4:before {
    content: "\e90e";
    margin-left: -3.2861328125em;
    color: rgb(69, 196, 93);
  }
  .icon-weixin-bg .path5:before {
    content: "\e90f";
    margin-left: -3.2861328125em;
    color: rgb(81, 195, 50);
  }
  .icon-weixin-bg .path6:before {
    content: "\e910";
    margin-left: -3.2861328125em;
    color: rgb(255, 255, 255);
    opacity: 0.1;
  }
  .icon-weixin-bg .path7:before {
    content: "\e911";
    margin-left: -3.2861328125em;
    color: rgb(255, 255, 255);
    opacity: 0.1;
  }
  .icon-clear-count:before {
    content: "\e912";
  }
  .icon-message-order .path1:before {
    content: "\e9d4";
    color: rgb(42, 140, 255);
  }
  .icon-message-order .path2:before {
    content: "\e9d5";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-message-order .path3:before {
    content: "\e9d6";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }

  .icon-chat-footer-scienceing .path1:before {
    content: "\ea9b";
    color: rgb(201, 202, 202);
  }
  .icon-chat-footer-scienceing .path2:before {
    content: "\ea9c";
    margin-left: -1em;
    color: rgb(115, 120, 126);
  }
  .icon-chat-footer-scienceing .path3:before {
    content: "\ea9d";
    margin-left: -1em;
    color: rgb(115, 120, 126);
  }
  .icon-chat-footer-photo .path1:before {
    content: "\e9d7";
    color: rgb(201, 202, 202);
  }
  .icon-chat-footer-photo .path2:before {
    content: "\e9d8";
    margin-left: -1em;
    color: rgb(115, 120, 126);
  }
  .icon-chat-footer-cerma .path1:before {
    content: "\e9d9";
    color: rgb(201, 202, 202);
  }
  .icon-chat-footer-cerma .path2:before {
    content: "\e9da";
    margin-left: -1em;
    color: rgb(115, 120, 126);
  }
  .icon-chat-footer-cerma .path3:before {
    content: "\ea58";
    margin-left: -1em;
    color: rgb(115, 120, 126);
  }
  .icon-chat-footer-cerma .path4:before {
    content: "\ea59";
    margin-left: -1em;
    color: rgb(115, 120, 126);
  }
  .icon-chat-footer-cerma .path5:before {
    content: "\ea5a";
    margin-left: -1em;
    color: rgb(115, 120, 126);
  }
  .icon-chat-footer-replay .path1:before {
    content: "\ea5b";
    color: rgb(115, 120, 126);
  }
  .icon-chat-footer-replay .path2:before {
    content: "\ea5c";
    margin-left: -1em;
    color: rgb(201, 202, 202);
  }
  .icon-chat-footer-chart .path1:before {
    content: "\ea6f";
    color: rgb(115, 120, 126);
  }
  .icon-chat-footer-chart .path2:before {
    content: "\ea70";
    margin-left: -1em;
    color: rgb(115, 120, 126);
  }
  .icon-chat-footer-chart .path3:before {
    content: "\ea71";
    margin-left: -1em;
    color: rgb(115, 120, 126);
  }
  .icon-chat-footer-chart .path4:before {
    content: "\ea72";
    margin-left: -1em;
    color: rgb(201, 202, 202);
  }
  .icon-chat-footer-orderTime .path1:before {
    content: "\ea73";
    color: rgb(201, 202, 202);
  }
  .icon-chat-footer-orderTime .path2:before {
    content: "\ea74";
    margin-left: -1em;
    color: rgb(115, 120, 126);
  }
  .icon-chat-footer-orderTime .path3:before {
    content: "\ea75";
    margin-left: -1em;
    color: rgb(115, 120, 126);
  }
  .icon-chat-footer-orderTime .path4:before {
    content: "\ea76";
    margin-left: -1em;
    color: rgb(115, 120, 126);
  }
  .icon-chat-footer-orderTime .path5:before {
    content: "\ea77";
    margin-left: -1em;
    color: rgb(115, 120, 126);
  }
  .icon-chat-footer-orderChart .path1:before {
    content: "\ea78";
    color: rgb(115, 120, 126);
  }
  .icon-chat-footer-orderChart .path2:before {
    content: "\ea79";
    margin-left: -1em;
    color: rgb(201, 202, 202);
  }
  .icon-w-bg:before {
    content: "\ea8f";
    color: #afd4f9;
  }
  .icon-invite-doctor:before {
    content: "\ea99";
    color: #2a8cff;
  }
  .icon-tool:before {
    content: "\ea94";
    color: #2a8cff;
  }
  .icon-edit1:before {
    content: "\ea52";
    color: #2a8cff;
  }
  .icon-footer-home1:before {
    content: "\e946";
    color: #9fa0a0;
  }
  .icon-footer-my1:before {
    content: "\e947";
    color: #9fa0a0;
  }
  .icon-footer-message1:before {
    content: "\e948";
    color: #9fa0a0;
  }
  .icon-footer-myPatients1:before {
    content: "\e949";
    color: #9fa0a0;
  }

  .icon-myHome-consult .path1:before {
    content: "\ea80";
    color: rgb(0, 146, 255);
  }
  .icon-myHome-consult .path2:before {
    content: "\ea86";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-myHome-consult .path3:before {
    content: "\ea87";
    margin-left: -1em;
    color: rgb(0, 146, 255);
  }
  .icon-myHome-consult .path4:before {
    content: "\ea88";
    margin-left: -1em;
    color: rgb(174, 222, 252);
  }
  .icon-myHome-consult .path5:before {
    content: "\ea89";
    margin-left: -1em;
    color: rgb(0, 146, 255);
  }
  .icon-wallet-order:before {
    content: "\ea8a";
    color: #2a8cff;
  }
  .icon-wallet-transfer:before {
    content: "\ea8b";
    color: #2a8cff;
  }
  .icon-wallet-account:before {
    content: "\ea8c";
    color: #2a8cff;
  }
  .icon-select:before {
    content: "\e989";
    color: #2a8cff;
  }

  .icon-chat-consult .path1:before {
    content: "\ea8d";
    color: rgb(0, 146, 255);
  }
  .icon-chat-consult .path2:before {
    content: "\ea8e";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-chat-consult .path3:before {
    content: "\ea90";
    margin-left: -1em;
    color: rgb(0, 146, 255);
  }
  .icon-chat-consult .path4:before {
    content: "\ea91";
    margin-left: -1em;
    color: rgb(174, 222, 252);
  }
  .icon-chat-consult .path5:before {
    content: "\ea92";
    margin-left: -1em;
    color: rgb(0, 146, 255);
  }
  .icon-myhome-scienceing:before {
    content: "\ea96";
    color: #66acff;
  }
  .icon-word:before {
    content: "\ea9e";
    color: #2a8cff;
  }
  .icon-scienceing-library:before {
    content: "\ea9f";
    color: #67b6ff;
  }
  .icon-link:before {
    content: "\eaa0";
    color: #2a8cff;
  }
  .icon-add-article:before {
    content: "\eaa1";
    color: #feb960;
  }
  .icon-e-mail:before {
    content: "\eaa2";
    color: #2a8cff;
  }
  .icon-down-arrow:before {
    content: "\eaa3";
    color: #fff;
  }
  .icon-up-arrow:before {
    content: "\eaa4";
    color: #fff;
  }
  .icon-chat-scienceing1:before {
    content: "\ea20";
    color: #73787e;
  }
  .icon-chat-photo1:before {
    content: "\ea21";
    color: #73787e;
  }
  .icon-chat-device1:before {
    content: "\ea24";
    color: #73787e;
  }
  .icon-chat-order1:before {
    content: "\ea25";
    color: #73787e;
  }

  .icon-team-sms:before {
    content: "\eabe";
    color: #2a8cff;
  }
  .icon-team-num:before {
    content: "\ea26";
    color: #f5d22f;
  }
  .icon-team-income:before {
    content: "\ea27";
    color: #f5d22f;
  }
  .icon-team-phone:before {
    content: "\ea28";
    color: #acacac;
  }
  .icon-team-add:before {
    content: "\ea29";
    color: #34b7a8;
  }
  .icon-team-review:before {
    content: "\eaa8";
    color: #fff;
  }
  .icon-team-addDoc:before {
    content: "\eaa9";
    color: #34b7a8;
  }
  .icon-team-cell:before {
    content: "\eaaa";
    color: #f5d22f;
  }
  .icon-team-intro:before {
    content: "\eaab";
    color: #ffb923;
  }
  .icon-team-skill:before {
    content: "\eaac";
    color: #ffb923;
  }
  .icon-team-consult:before {
    content: "\eaad";
    color: #ffb923;
  }
  .icon-team-del:before {
    content: "\eaaf";
    color: #34b7a8;
  }
  .icon-team-bill:before {
    content: "\eab0";
    color: #fff;
  }
  .icon-team-ico:before {
    content: "\eab1";
    color: #c9caca;
  }
  .icon-team-acc:before {
    content: "\eab2";
    color: #c9caca;
  }
  .icon-team-transfer:before {
    content: "\eab3";
    color: #fff;
  }
  .icon-team-wallet:before {
    content: "\eab4";
    color: #fff;
  }
  .icon-team-indent:before {
    content: "\eab5";
    color: $lightBlue;
    margin-left: -0.04rem;
  }
  .icon-myTeam-income:before {
    content: "\eab6";
    color: $lightBlue;
  }
  .icon-team-horn .path1:before {
    content: "\eab7";
    color: rgb(255, 217, 31);
  }
  .icon-team-horn .path2:before {
    content: "\eab8";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-team-lead1 .path1:before {
    content: "\eac6";
    color: rgb(237, 171, 7);
  }
  .icon-team-lead1 .path2:before {
    content: "\eac7";
    margin-left: -2.357421875em;
    color: rgb(255, 255, 255);
  }
  .icon-team-lead1 .path3:before {
    content: "\eac8";
    margin-left: -2.357421875em;
    color: rgb(252, 216, 66);
  }
  .icon-team-lead1 .path4:before {
    content: "\eac9";
    margin-left: -2.307421875em;
    color: rgb(249, 240, 215);
  }
  .icon-team-lead2 .path1:before {
    content: "\eaca";
    color: rgb(252, 216, 66);
  }
  .icon-team-lead2 .path2:before {
    content: "\eacb";
    margin-left: -1.09765625em;
    color: rgb(249, 240, 215);
  }
  .icon-team-notice:before {
    content: "\eac5";
    color: #c9caca;
  }

  .icon-team-head-b .path1:before {
    content: "\e94c";
    color: $gray_f;
  }
  .icon-team-head-b .path2:before {
    content: "\eaae";
    margin-left: -0.904296875em;
    color: $gray_f;
  }
  .icon-team-head-g .path1:before {
    content: "\eac1";
    color: $gray_f;
  }
  .icon-team-head-g .path2:before {
    content: "\eac2";
    margin-left: -0.904296875em;
    color: $gray_f;
  }
  .icon-teamAcc:before {
    content: "\e91f";
    color: #fff;
  }

  .icon-home-phone .path1:before {
    content: "\e922";
    color: rgb(255, 148, 55);
  }
  .icon-home-phone .path2:before {
    content: "\ea93";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-phone .path3:before {
    content: "\eab9";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-phone .path4:before {
    content: "\eaba";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-phone .path5:before {
    content: "\eabd";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-phone .path6:before {
    content: "\eacc";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-home-set .path1:before {
    content: "\eacd";
    color: rgb(3, 210, 217);
  }
  .icon-home-set .path2:before {
    content: "\eace";
    margin-left: -1em;
    color: rgb(255, 255, 255);
  }
  .icon-footer_home:before {
    content: "\eacf";
    color: #2a8cff;
  }
  .icon-footer_my:before {
    content: "\ead0";
    color: #2a8cff;
  }
  .icon-footer_message:before {
    content: "\ead1";
    color: #2a8cff;
  }
  .icon-footer_message1:before {
    content: "\ead2";
    color: #9fa0a0;
  }
  .icon-footer_my1:before {
    content: "\ead3";
    color: #9fa0a0;
  }
  .icon-footer_home1:before {
    content: "\ead4";
    color: #9fa0a0;
  }

  .lead{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.8);
    position: absolute;
    z-index: 99999999999999999999999;
    top: 0;
    left: 0;
    .step1,.step2,.step3{
      display: inline-block;
      position: absolute;
    }
    .step1{
      width: 7.1rem;
      top: 5.35rem;
      left: 50%;
      margin-left: -3.5rem;
      height: 5.05rem;
    }
    .step2{
      width: 7.16rem;
      height: 9.11rem;
      left: 50%;
      margin-left: -3.58rem;
      top: 1rem;
    }
    .step3{
      width: 6.79rem;
      height: 7.27rem;
      top: 2.86rem;
      left: 0.17rem;
    }
  }
  /*加载动画的iconfont*/
  @font-face {font-family: "hw-indicator-icon";
    src: url('../static/font/hw-indicator/iconfont.eot?t=1500948090824'); /* IE9*/
    src: url('../static/font/hw-indicator/iconfont.eot?t=1500948090824#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('../static/font/hw-indicator/iconfont.woff?t=1500948090824') format('woff'), /* chrome, firefox */
    url('../static/font/hw-indicator/iconfont.ttf?t=1500948090824') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
    url('../static/font/hw-indicator/iconfont.svg?t=1500948090824#iconfont') format('svg'); /* iOS 4.1- */
  }
  .hw-indicator-icon {
    font-family:"hw-indicator-icon" !important;
    font-size: 0.56rem;
    font-style:normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .hw-indicator-jiazaizhong:before { content: "\e660"; }

  .hw-indicator-caozuochenggong:before { content: "\e7f8"; }

  /*.hw-indicator-loading:before { content: "\e613"; }*/














</style>
