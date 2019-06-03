<template>
  <ul class="container">
    <img src="../../assets/media/img/logo.png" alt="">
    <li class="register">
      <span class="text b-1px-b"><input type="number" name="username" v-model="username"  value="" placeholder="请输入手机号" class="phone"></span>
      <span class="text b-1px-b"><input type="text"  name="password" value="" maxlength="6"  placeholder="请输入验证码" class="code" v-model="code"> <a href="javascript:;" class="gainCode" @click.stop="gainCode">{{codeText}}</a></span>
      <span class="text"><input type="password"  name="password" maxlength="16"  value=""placeholder="请设置新密码" class="password" v-model="password"></span>
    </li>
    <button class="submit" @click.stop="commit">注册</button>
    <!--<hw-button :config="{text : '注册' , css : {'width' : '6.3rem'}}" v-on:event="commit"></hw-button>-->
    <li class="agreement">点击注册即默认同意<router-link to="/agreement/serviceIntro">用户协议</router-link></li>
    <li class="switch"><i>?</i><router-link to="/login" tag="b">已有账号</router-link></li>
  </ul>

</template>
<script>
  import hwButton from '../../btns/hwButton'
  import {Toast} from '../../components/hw-components'
  export default{
    data (){
      return {
        username : '',
        password : '',
        code : '',
        codeText: '点击获取',
        codeClick : true
      }
    },
    components : {hwButton},
    created () {
      this.$store.commit('UPDATE_NAV',{title : '',fn : '', router : '', fShow : false, hShow : false});
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
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import 'register.scss';
</style>
