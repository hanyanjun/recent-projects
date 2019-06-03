<template>
  <div id="app">
      <router-view></router-view>
      <!-- <insertIframe></insertIframe> -->
  </div>
</template>
<script>
import "./api/global.js"
// import insertIframe from "./components/insertIframe"
import { mapState, mapMutations, mapGetters , mapActions } from 'vuex'
export default {
  name: 'App',
  // components : {insertIframe},
  methods:{
    routeChange(to,from){
      if(window.sessionStorage['routeTrack']){
        this.$store.state.routeTrack = JSON.parse(window.sessionStorage['routeTrack']);
      }
      // 考试的话更改为考试状态
      if(to.name == 'exam' || to.name == 'examh5'){
        this.$store.state.isExam =  true;
      }else{
        this.$store.state.isExam =  false;
      }
      // 匹配到子路由 若父级路由需要清除session
      if(to.matched[0].meta.clearSession){
          let sess = to.matched[0].meta.clearSession;
          sess.forEach(v => {
              window.sessionStorage.removeItem(v);
          });
      }
      // 匹配到的当前路由需要清除session
      if(to.meta.clearSession){
          let sess = to.meta.clearSession;
          sess.forEach(v => {
              window.sessionStorage.removeItem(v);
          });
      }
    }
  },
  created(){
    this.$store.state.userAgentType = this.$util.userAgentType();
  },
  watch : {
    "$route" : "routeChange"
  }
}
</script>
<style lang="scss">
@import "./assets/css/resetEl.scss";
a{
  color: #000;
}
html,body,#app{
  height: 100%;
  width: 100%;
  background: #f4f6f8;
  overflow: hidden;
}
.el-upload-list__item.is-success .el-upload-list__item-status-label {
  display: none !important
}
.headerPic .el-upload--picture-card,.headerPic .el-upload-list__item-actions,.headerPic .el-upload-list__item{
  border-radius: 50% !important;
  z-index: 10 !important;
}
.identityPic .el-upload--picture-card,.identityPic .el-upload-list__item-actions,.identityPic .el-upload-list__item,
.bankPicDiv .el-upload--picture-card,.bankPicDiv .el-upload-list__item-actions,.bankPicDiv .el-upload-list__item
{
  height: 175px !important;
  width: 280px !important
}
.disabledInput
  {color: #666666}
#roleTreeGrid .el-table td{
  text-align: left !important;
  padding-left: 15px !important
}
#waitForList .el-table-column--selection{
  text-align: right !important
}
.el-submenu__title:hover{
  background: #1f2d3d !important
}
.menuList .el-icon-arrow-right:before{
    display: none !important;
}
#roleTreeGrid .el-checkbox{
  margin-right: 30px;
  margin-left: 0px !important
}
#logManage{
  padding-bottom: 25px !important
}
.logManageDiv .el-form-item__content{
  margin-top: 7px  !important;
  line-height: 18px !important;
}
.logManageDiv .el-form-item__label{
  text-align: right;
  padding: 0;
}
#alreadyTest .el-tabs__active-bar {
    transition: transform 0s 
  }
.CancelBtn.el-button--primary.is-plain{
  color: #10B2FF;
  background: #ffffff;
  border-color: #10B2FF;
}
.editNameInput .el-input__inner {
  border: 0;
  border-bottom: 1px solid #1758da;
  border-radius: 0;
  color: #1758da;
}
      
  
    /***************************************字体图标****************************************/ 


@font-face {font-family: "iconfont";
  src: url('../static/font/iconfont/iconfont.eot?t=1550576488287'); /* IE9*/
  src: url('../static/font/iconfont/iconfont.eot?t=1550576488287#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('../static/font/iconfont/iconfont.woff?gk251e') format('woff'),
  url('../static/font/iconfont/iconfont.ttf?t=1550576488287') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
  url('../static/font/iconfont/iconfont.svg?t=1550576488287#iconfont') format('svg'); /* iOS 4.1- */
}
.iconfont {
  font-family:"iconfont" !important;
  font-size:16px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-yulan:before {
  content: "\e601";
}

.icon-cuiban:before {
  content: "\e639";
}

.icon-delete:before {
  content: "\e61a";
}

.icon-weixian:before {
  content: "\e616";
}

.icon-chexiao1:before {
  content: "\e716";
}

.icon-fenxi2:before {
  content: "\e60d";
}

.icon-riliriqi:before {
  content: "\e807";
}

.icon-stop:before {
  content: "\e647";
}

.icon-company:before {
  content: "\e637";
}

.icon-shouye:before {
  content: "\e6a5";
}

.icon-jinyong:before {
  content: "\e73b";
}

.icon-fileword:before {
  content: "\e611";
}

.icon-kulian:before {
  content: "\e638";
}

.icon-fuzhi:before {
  content: "\e615";
}

.icon-pdf:before {
  content: "\e698";
}

.icon-Excel:before {
  content: "\e625";
}

.icon-changyong:before {
  content: "\e699";
}

.icon-shijian:before {
  content: "\e623";
}

.icon-guanbi:before {
  content: "\e641";
}

.icon-gongsiguanli-fill:before {
  content: "\e63b";
}

.icon-yuangong:before {
  content: "\e60b";
}

.icon-tuichu:before {
  content: "\e648";
}

.icon-manage:before {
  content: "\e6c1";
}

.icon-setting:before {
  content: "\e60e";
}

.icon-zhuanzheng:before {
  content: "\e644";
}

.icon-lizhi:before {
  content: "\e645";
}

.icon-tiaogang:before {
  content: "\e646";
}

.icon-ruzhi:before {
  content: "\e649";
}

.icon-fanhui:before {
  content: "\e652";
}

.icon-qiangzhi:before {
  content: "\e636";
}

.icon-self:before {
  content: "\e618";
}

.icon-jieshu:before {
  content: "\e624";
}

.icon-jinxingzhong:before {
  content: "\e7ab";
}

.icon-contact:before {
  content: "\e658";
}

.icon-caidan:before {
  content: "\e655";
}

.icon-sanjiao:before {
  content: "\e619";
}

.icon-del2:before {
  content: "\e600";
}

.icon-Shapecopy:before {
  content: "\e604";
}

.icon-bianji:before {
  content: "\e68d";
}

.icon-exam:before {
  content: "\e61c";
}

.icon-sousuo:before {
  content: "\e606";
}

.icon-renyuanbianji:before {
  content: "\e628";
}

.icon-minus-circle:before {
  content: "\e780";
}

.icon-plus-circle:before {
  content: "\e781";
}

.icon-eye:before {
  content: "\e78f";
}

.icon-upload:before {
  content: "\e7ef";
}

.icon-yidong:before {
  content: "\e620";
}

.icon-jia:before {
  content: "\e782";
}

.icon-jian:before {
  content: "\e783";
}

.icon-approval:before {
  content: "\e61e";
}

.icon-ic_join_dialing_norm:before {
  content: "\e62c";
}

.icon-contract:before {
  content: "\e610";
}

.icon-pdf-shangchuan:before {
  content: "\e60c";
}

.icon-rotate90:before {
  content: "\e65c";
}

.icon-del:before {
  content: "\e808";
}

.icon-tuihui:before {
  content: "\e621";
}

.icon-shenpi-chexiao:before {
  content: "\e60f";
}

.icon-weixindenglu:before {
  content: "\e63a";
}

.icon-add:before {
  content: "\e809";
}

.icon-Switch_close:before {
  content: "\e612";
}

.icon-Switch_open:before {
  content: "\e613";
}

.icon-zairuzhi:before {
  content: "\e614";
}

.icon-rotate-90:before {
  content: "\e80a";
}



</style>
