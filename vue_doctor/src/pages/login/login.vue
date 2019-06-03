<template>
  <ul class="container">
    <img src="../../assets/media/img/logo.png" alt="">
    <li class="login">
      <span class="text b-1px-b"><input type="number" name="username" v-model="username"  value="" placeholder="请输入手机号" class="phone"></span>
      <span class="text"><input type="password" name="password" value=""placeholder="请输入密码" class="password" v-model="password"></span>
    </li>
    <hw-button :config="{text : '登录' , css : {'width' : '6.3rem'}}" v-on:event="commit"></hw-button>
    <li class="fn">
      <router-link to="/register">医生注册</router-link>|<router-link to="/setPassword/resetIphone">忘记密码</router-link>
    </li>
  </ul>

</template>
<script>
  import hwButton from '../../btns/hwButton'
  import axios from 'axios'
  import {Toast} from '../../components/hw-components'
  export default{
    data (){
      return {
          username : '',
          password : '',
          jumpExpertTeam:false,
          path:''
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
          if(!(/^1[3|4|5|7|8][0-9]{9}$/g.test(phone))){
            Toast('手机号格式错误!');
          }else{
            this.$api.login({phone,password})
              .then(obj=>{
                  window.localStorage['token'] = obj.access_token;
                  axios.defaults.headers.common['Authorization'] = window.btoa(unescape(encodeURIComponent(obj.access_token)));
                  this.$store.commit('IS_UPDATE_DOCINFO',true);
                  this.$store.commit('IS_UPDATE_CONTACTS',true);
                  // this.$router.push({path : '/work'});
                  //判断是否从分享专家合作名片过来的，如果是注册完成后返回专家合作详情
                  if(sessionStorage['sharePath']){
                    this.$router.push({path : sessionStorage['sharePath']});
                  }else{
                    this.$router.push({path : '/work'});
                  }

              })
          }

        }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'login.scss';
</style>
