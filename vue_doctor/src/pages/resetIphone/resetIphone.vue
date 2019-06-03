<template>
  <ul class="container">
    <img src="../../assets/media/img/logo.png" alt="">
    <li class="register">
      <span class="text b-1px-b"><input type="number" name="username" v-model="username"  value="" placeholder="请输入手机号" class="phone"></span>
      <span class="text"><input type="text"  name="password" value="" maxlength="6"  placeholder="请输入验证码" class="code" v-model="code"> <a href="javascript:;" class="gainCode" @click.stop="gainCode">{{codeText}}</a></span>
    </li>
    <hw-button :config="{text : '提交' , css : {'width' : '6.3rem'}}" v-on:event="commit"></hw-button>
  </ul>

</template>
<script>
  import hwButton from '../../btns/hwButton'
  import {Toast} from '../../components/hw-components'
  export default{
    data (){
      return {
        username : '',
        code : '',
        codeText: '点击获取',
        codeClick : true,
        origin : ''
      }
    },
    components : {hwButton},
    created () {
      this.origin = this.$route.params.id;
      if(this.origin == 'null'){
        this.$store.commit('UPDATE_NAV',{title : '更换手机',fn : '', router : '/set', fShow : false, hShow : true});
      }else{
        this.$store.commit('UPDATE_NAV',{title : '重置密码', fn : '',router : '/set', fShow : false, hShow : true});
      }
    },
    methods : {
      commit : function () {
        let phone = this.username;
        let code = this.code;
        if(!phone  || !code){
          Toast('请填写完整信息!');
        }else{
           if(this.origin == 'null'){
             this.$api.resetIphone({phone,code})
               .then(obj=>{
                 this.$store.commit('IS_UPDATE_DOCINFO',false);
                 this.$router.push({path : '/work'});
               })
           }else{
               this.$router.push({path : `/${code}/${phone}/resetPassword`})
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
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../../assets/css/function.scss';
  @import "../../assets/css/common";
  .container {
    width: 100%;
    padding: 1.06rem 0.55rem;
    visibility: visible;
    height: 100%;
    background: white;
    box-sizing: border-box;
  }

  .container img {
    display: block;
    margin: 0 auto 0.5rem;
    width: 2.5rem;
    height: 2.5rem;
  }

  .container .register {
    width: 100%;
    box-sizing: border-box;
    line-height: 1.05rem;
    background: #fff;
    border-radius: 0.06rem;
    font-size: rm(32px);
    border: 1px solid $gray;
  }

  .container .register .text {
    height: 1.05rem;
    display: block;
    margin: auto;
    line-height: rm(98px);
    position: relative;
    box-sizing: border-box;
    padding-left: 1.1rem;
  }

  .container .commit{
    width: 100%;
    text-align: center
  }
  .container .register input {
    font-size: rm(28px);
    display: inline-block;
    width: 100%;
    height: rm(96px);
    line-height: rm(96px)
  }

  .container .commit {
    height: rm(100px);
    background: #0395fc;
    color: #fff;
    -webkit-border-radius: rm(28px);
    -khtml-border-radius: rm(28px);
    -moz-border-radius: rm(28px);
    -ms-border-radius: rm(28px);
    -o-border-radius: rm(28px);
    border-radius: rm(28px);
    line-height: rm(100px);
    letter-spacing: rm(28px)
  }

  .container .fn {
    font-size: rm(30px);
    padding: 0 rm(40px);
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
    background: $bg;
    text-align: center;
    color: $fGray;
    top:0;
    right: 0;
  }

  .container .register .text:nth-of-type(1){
    background: url(../../assets/media/img/account.png) no-repeat left 0.33rem center;
    background-size: 0.4rem 0.36rem;
  }
  .container .register .text:nth-of-type(2){
    background: url(../../assets/media/img/code.png) no-repeat left 0.33rem center;
    background-size: 0.46rem 0.32rem;
  }
  .container .agreement{
    width: 100%;
    text-align: center;
    font-size: .3rem;
  }

  .container .commit {
    height: 1rem;
    background: #0395fc;
    color: #fff;
    -webkit-border-radius: .28rem;
    -khtml-border-radius: .28rem;
    -moz-border-radius: .28rem;
    -ms-border-radius: .28rem;
    -o-border-radius: .28rem;
    border-radius: .28rem;
    font-size: .36rem;
    line-height: 1rem;
    letter-spacing: .28rem
  }

  .container .agreement a {
    color: #0395fc
  }

</style>
