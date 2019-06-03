<template>
  <div class="container">
    <div class="title">
      <div class="logo">
        <img src="http://doctor-patient.hiwein.com/doctor/media/img/logo-bg.png" alt="">
        <p>
          <!-- <span>哮喘管理平台</span> -->
          <span>智呼吸咨询平台</span>
          <span>儿童咳喘和过敏专业平台</span>
        </p>
      </div>
      <div class="info">
        <div class="baseInfo">
          <img v-img="head" src="" alt="">
          <span>{{info.name}}</span>
          <span>{{info.technical}}</span>
        </div>
        <div class="tip">
          <h6>欢迎加入{{info.name}}医生工作室</h6>
          <!--<i>诚挚邀请您加入这个专业平台</i>-->
          <p>智呼吸是儿童咳喘和过敏专业化咨询平台。加入医生工作室，您可获得在线预约、图文咨询（按次）和知识科普等服务！</p>
        </div>
      </div>
      <div class="qr">
        <img src="" alt="" v-img="QRcode">
        <p>长按或使用微信扫此二维码即可<br>申请加入医生工作室</p>
        <button @click.stop="change">分享给其他人</button>
      </div>
    </div>
    <div class="share-window" @click.stop="show = false" v-show="show">
      <img src="../../assets/media/img/share-bg.png" alt="">
    </div>
    <div class="bottom"></div>
  </div>
</template>

<script>
export default{
    name : 'share',
    data(){return{show : false}},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '',fn : '', router : '/work', fShow : false, hShow : false});
    },
    computed:{
      info(){
          return this.$store.state.docInfo;
      },
      head (){
        return `${DOCLINKAPI}/doctor/face/${this.$route.params.id}`;
      },
      QRcode(){
          return `${DOCLINKAPI}/doctor/profileQRcode/${this.$route.params.id}`;
      }
    },
    mounted(){
      this.$store.dispatch('wxinitial',window.encodeURIComponent(document.URL));
    },
    methods:{
      change(){
          this.$store.dispatch('wxShowShare');
          let title;
          if(this.info.hm_title){
            title = `我向您隆重推荐${this.info.hm_title}，请关注智呼吸医生平台`
          }else{
            title = `我向您隆重推荐${this.info.name}医生，请关注智呼吸医生平台`
          }
          this.$store.dispatch('wxShareTimeLineT',{
            title : title,
            link : `${DOCSTATICLINK}/index.html#/${this.info.account}/share`
          })
          this.$store.dispatch('wxShareAppMessageT',{
            title : title,
            desc : '加入医生工作室，您可获得在线预约、图文在咨询、知识科普的专业化服务',
            link : `${DOCSTATICLINK}/index.html#/${this.info.account}/share`
          })
          this.show = this.show ? false : true;
      }
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .container{
  .title{
    width: 100%;
    height: 5.75rem;
    position: absolute;
    z-index: 2;
    left: 0;
    top:0;
    background: url('../../assets/media/img/inviteDoctor-bg.png') no-repeat left top -0.86rem;
    background-size: 100% 5.74rem;
    padding: 0.01rem 0.24rem 0;
    box-sizing: border-box;
  .logo{
    margin-top: 0.66rem;
    height: 1.15rem;
    display: flex;
  img{
    display: inline-block;
    width: 1.15rem;
    height: 1.15rem;
    border-radius: 0.2rem;
  }
  p{
    color: white;
    display: flex;
    flex-wrap: wrap;
    margin-left: 0.3rem;
    align-content: space-between;
  span{
    display: block;
  }
  span:nth-of-type(1){
    font-size: 0.4rem;
    font-weight: bolder;
    line-height: 0.4rem;
    height: 0.4rem;
  }
  span:nth-of-type(2){
    font-size: 0.3rem;
    line-height: 0.3rem;
    height: 0.3rem;
  }
  }
  }
  .info{
    background: white;
    border-radius: 0.1rem;
    padding: 0.4rem 0.34rem 0.2rem 0.24rem;
    box-sizing: border-box;
    display: flex;
    flex-wrap: nowrap;
    margin-top: 0.5rem;
  .baseInfo{
    font-size: 0.24rem;
    line-height: 0.24rem;
    width: 1.65rem;
    margin-right: 0.5rem;
  img{
    display: inline-block;
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
  }
  span{
    display: block;
    text-align: center;
    height: 0.24rem;
    color: $fGray;
  }
  span:nth-of-type(1){
    font-size: 0.28rem;
    font-weight: bolder;
    line-height: 0.68rem;
    height: 0.68rem;
    color: black;
  }
  }
  .tip{
    font-size: 0.3rem;
  h6{
    height: 0.3rem;
    padding-bottom: 0.3rem;
    border-bottom: 1px solid $gray;
    font-weight: bolder;
  }
  i{
    color: $baseBlue;
    height: 0.8rem;
    line-height: 0.8rem;
    font-style: italic;
  }
  p{
    color: $fGray;
    font-size: 0.26rem;
    margin-top: 0.1rem;
  }
  }
  }
  .qr{
    background: white;
    padding-bottom: 0.3rem;
  img{
    display: block;
    width: 4rem;
    height: 4rem;
    margin:  auto;
  }
  p{
    font-size: 0.28rem;
    text-align: center;
    padding: 0.08rem 0;
  }
    button{
      background: $baseBlue;
      display: block;
      margin: 0.2rem auto 0.2rem;
      color: white;
      font-size: 0.3rem;
      padding: 0.1rem 0.2rem;
      border-radius: 0.1rem;
    }
  }
  }
  }

  .container .form{
    margin-top: 0.27rem;
    padding: 0 0.24rem;
  }
  .container .register {
    width: 100%;
    box-sizing: border-box;
    line-height: 1.05rem;
    background: #fff;
    border-radius: 0.06rem;
    font-size: 0.32rem;
    border: 1px solid $gray;
  }

  .container .register .text {
    height: 1.05rem;
    display: block;
    margin: auto;
    line-height: 0.98rem;
    position: relative;
    box-sizing: border-box;
    padding-left: 1.1rem;
  }

  .container .register .text:nth-of-type(1){
    background: url(../../assets/media/img/account.png) no-repeat left 0.33rem center;
    background-size: 0.4rem 0.36rem;
  }
  .container .register .text:nth-of-type(2){
    background: url(../../assets/media/img/password.png) no-repeat left 0.33rem center;
    background-size: 0.35rem 0.46rem;
  }
  .container .register .text:nth-of-type(3){
    background: url(../../assets/media/img/code.png) no-repeat left 0.33rem center;
    background-size: 0.46rem 0.32rem;
  }
  .container .commit{
    width: 100%;
    text-align: center
  }
  .container .register input {
    font-size: 0.28rem;
    display: inline-block;
    width: 100%;
    height: 0.96rem;
    line-height: 0.96rem
  }

  .container .submit {
    display: block;
    margin: 0.3rem  auto ;
    width: 6.3rem;
    height: 1rem;
    line-height: 1rem;
    background: rgb(6, 147, 252);
    color: white;
    font-size: 0.4rem;
    text-align: center;
    border-radius: 0.06rem;
  }

  .container .fn {
    font-size: 0.3rem;
    padding: 0 0.4rem;
    text-align: center;
    color:$baseBlue;
  }
  .container .fn a:nth-of-type(1){
    color:$baseBlue;
    padding-right: 0.48rem;
  }
  .container .fn a:nth-of-type(2){
    padding-left: 0.48rem;
    color:#505050;
  }


  .container .register .gainCode {
    position: absolute;
    display: inline-block;
    width: 2.15rem;
    height: 100%;
    text-align: center;
    color: $baseBlue;
    top:0;
    right: 0;
  }

  .container .agreement{
    width: 100%;
    text-align: center;
    font-size: .22rem;
    color: $fGray;
    margin-top: 0.8rem;
  }
  .container .agreement a {
    color: #0395fc
  }
  .bottom{
    background: $baseBlue;
    height: 2.8rem;
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
  }

  /*分享二维码弹窗指引样式*/
  .share-window {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .6);
    top: 0;
    z-index: 20;
    position: fixed;
  }

  .share-window img {
    width: 100%;
    height: 2.44rem
  }
</style>
