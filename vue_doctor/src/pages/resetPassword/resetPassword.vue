<template>
  <ul class="container">
    <img src="../../assets/media/img/logo.png" alt="">
    <li class="login">
      <span class="text b-1px-b"><input type="password" maxlength="16" name="username" v-model="password"  value="" placeholder="请输入密码" class="phone"></span>
      <span class="text"><input type="password" maxlength="16" name="password" v-model="cPassword" value=""placeholder="请再次确认密码" class="password"></span>
    </li>
    <hw-button :config="{text : '确认' , css : {'width' : '6.3rem'}}" v-on:event="submit"></hw-button>
  </ul>
</template>

<script>
  import {Toast} from '../../components/hw-components'
export default{
    data(){return{
        password : '',cPassword : '',code : '',phone : ''
    }},
    created (){
      this.code = this.$route.params.id;
      this.phone = this.$route.params.phone;
      this.$store.commit('UPDATE_NAV',{title : '重置密码', fn : '',router : '/my', fShow : false, hShow : true});
    },
    methods : {
      submit(){
           let password = this.password;
           let cPassword = this.cPassword;
           let phone = this.phone;
           let code = this.code;
           if(!password || !cPassword){
              Toast('请输入完整内容!');
           }else{
               if(password != cPassword){
                   Toast('两次密码不一致!');
               }else{
                   this.$api.resetPassword({password,code,phone})
                     .then(obj=>{
                        this.$router.push({path : '/my'});
                   })
               }
           }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "./resetPassword";
</style>
