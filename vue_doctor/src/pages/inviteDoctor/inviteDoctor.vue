<template>
<div class="container">
  <div class="title">
      <div class="logo">
        <img src="http://doctor-patient.hiwein.com/doctor/media/img/logo-bg.png" alt="">
        <p>
         <!--  <span>哮喘管理平台</span> -->
          <span>智呼吸儿童咳喘和过敏咨询平台</span>
          <span>高效管理哮喘、精细化服务工具</span>
        </p>
      </div>
      <div class="info">
        <div class="baseInfo">
          <img v-img="head" src="" alt="">
          <span>{{info.name}}</span>
          <span>{{info.technical}}</span>
        </div>
        <div class="tip">
          <h6>我在智呼吸咨询平台</h6>
          <!--<i>诚挚邀请您加入这个专业平台</i>-->
          <p>智呼吸是儿童咳喘和过敏咨询平台。在这里您可免费建立自己的网上工作室，更加高效地管理您的会员！</p>
        </div>
      </div>
  </div>
  <div class="form">
    <li class="register">
      <span class="text b-1px-b"><input type="number" name="username" v-model="username"  value="" placeholder="请输入手机号" class="phone"></span>
      <span class="text b-1px-b"><input type="text"  name="password" value="" maxlength="4"  placeholder="请输入验证码" class="code" v-model="code"> <a href="javascript:;" class="gainCode" @click.stop="gainCode">{{codeText}}</a></span>
      <span class="text"><input type="password"  name="password" maxlength="16"  value=""placeholder="请输入密码" class="password" v-model="password"></span>
    </li>
    <li class="agreement">点击注册即默认同意<router-link to="/agreement/serviceIntro">用户协议</router-link></li>
    <button class="submit" @click.stop="commit">注册</button>
  </div>
</div>
</template>

<script>

  import {Toast} from '../../components/hw-components'
  import axios from 'axios'
export default{
    name : 'iviteDoctor',
    data (){
      return {
        username : '',
        password : '',
        code : '',
        codeText: '点击获取',
        codeClick : true,
        info : ''
      }
    },
    created(){
      this.$store.commit('UPDATE_NAV',{fShow : false,hShow : false});
      let id = this.$route.params.id;
      if(!window.sessionStorage['reload']){
        window.location.href = `${DOCAUTHORIZELINK}?location_url=${id}/inviteDoctor`
        window.sessionStorage['reload'] = 'no';
      }
      if(id){
          axios.get(`${DOCLINKAPI}/doctor/share/${id}`).then(obj=>{
            this.info = obj.data.info;
            this.$store.commit('UPDATE_LOADING',false);
          })
          axios.get(`${DOCLINKAPI}/doctor/initInfo`).then(obj=>{
            if(obj.data.code == '0'){
              this.$store.commit('IS_UPDATE_DOCINFO',true);
              this.$router.push({path: '/work'});
            }
          })
      }
    },
    methods : {
      commit : function () {
        let phone = this.username;
        let password = this.password;
        let code = this.code;
        if(!phone || !password || !code){
          Toast('请填写完成信息!');
        }else{
          if(password.length < 6){
            Toast('密码长度最少6个字符');
          }else{
            this.$api.register({phone,password,code})
              .then(obj=>{
                this.$router.push({path : '/add/addInfo'});
              })
          }
        }
      },
      gainCode (){
        let time;
        let count = 60;
        let phone = this.username;
        if(!(/^1[3|4|5|7|8][0-9]{9}$/g.test(phone))){
          Toast('手机号格式错误!');
        }else{
          if(this.codeClick){
            this.$api.gainCode({phone})
            this.codeText = `${count}s`;
            time = setInterval(()=>{
              count--;
              this.codeText = `${count}s`;
              if(count == 0){
                this.codeText = '重新获取';
                clearInterval(time);
                this.codeClick = true;
              }
            },1000)
          }
          this.codeClick = false;
        }
      }
    },
    computed:{
      head (){
        return `${DOCLINKAPI}/doctor/face/${this.$route.params.id}`;
      },
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
        height: 3.5rem;
        background: white;
        border-radius: 0.1rem;
        padding: 0.66rem 0.34rem 0 0.24rem;
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
</style>
