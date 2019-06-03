<template>
  <div class="container">
    <div class="title">
      <div class="logo">
        <img src="http://doctor-patient.hiwein.com/doctor/media/img/logo-bg.png" alt="">
        <p>
          <!-- <span>哮喘管理平台</span> -->
          <span>智呼吸儿童咳喘和过敏咨询平台</span>
          <span>高效管理哮喘、精细化服务工具</span>
        </p>
      </div>
      <div class="info">
        <div class="tip">
          <i>诚挚邀请您加入这个专业平台</i>
          <p>这里有优秀的专家医师，让我们为哮喘治疗标准化建设和规范管理共同努力！</p>
          <img src="../../assets/media/img/QRcode.jpg" alt="">
          <p>扫描二维码，进入个人工作室</p>
        </div>
      </div>
    </div>
    <div class="bottom"></div>
  </div>
</template>

<script>

  import {Toast} from '../../components/hw-components'
  import axios from 'axios'
  export default{
    name : 'iviteDoctor1',
    created(){
      this.$store.commit('UPDATE_NAV',{fShow : false,hShow : false});
      this.$store.commit('UPDATE_LOADING',false);
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
      top:0;
      left: 0;
      z-index: 2;
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
        padding: 1.2rem 0.34rem 1.2rem 0.24rem;
        box-sizing: border-box;
        display: flex;
        flex-wrap: nowrap;
        margin-top: 0.5rem;
        .tip{
          font-size: 0.3rem;
          text-align: center;
          i{
            color: $baseBlue;
            height: 0.8rem;
            line-height: 0.8rem;
            font-size: 0.36rem;
            font-style: italic;
          }
          p{
            font-size: 0.32rem;
            margin-top: 0.1rem;
          }
          img{
            display: block;
            width: 4rem;
            height: 4rem;
            margin: 0.2rem auto;
          }
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
    height: 3rem;
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
  }
</style>
