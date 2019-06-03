<template>
  <ul class="setPassword">
    <li class="b-1px-b">
      <input type="password" maxlength="16" v-model="old_password" name="" value="" placeholder="请输入旧密码" class="old"><router-link to="/setPassword/resetIphone" class="forget">忘记密码?</router-link>
    </li>
    <li class="b-1px-b">
      <input type="password" maxlength="16" v-model="password" name="" value="" placeholder="请输入新密码" class="new">
    </li>
    <li class="b-1px-b">
      <input type="password" maxlength="16" name="" v-model="cPassword" value="" placeholder="请确认新密码" class="confirm">
    </li >
    <hw-button :config="btnText" v-on:event="submit"></hw-button>
  </ul>
</template>

<script>
  import  {Toast} from '../../components/hw-components'
export default{
    data(){return{
        btnText : '提交', old_password:'',password:'',cPassword:''
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '修改密码',fn : '', router : '/my', fShow : false, hShow : true});
    },
    methods : {
      submit(){
        let old_password = this.old_password;
        let password = this.password;
        if(!old_password || !password || !this.cPassword){
            Toast('请输入完成内容!');
        }else{
            if(password != this.cPassword){
              Toast('两次密码不一致!');
            }else{
              this.$api.revisePassword({old_password,password})
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
<style scoped>
  input, li {
    font-size: 0.30rem
  }

  ul {
    width: 100%;
    background: #fff;
    height: 100%;
  }

  li {
    height: 0.85rem;
    width: 6.76rem;
    margin: auto;
    line-height: 0.85rem;
    position: relative;
    -webkit-box-pack: space-between;
    -webkit-justify-content: space-between;
    display: flex;
    justify-content: space-between
  }
  .arrow, input {
    display: inline-block
  }
  input {
    width: 70%;
    background: rgba(0, 0, 0, 0)
  }

  .arrow {
    background: url(../../assets/media/img/Rectangle.png) no-repeat;
    background-size: 100% 100%;
    width: 0.18rem;
    height: 0.29rem;
    position: absolute;
    right: 0.06rem;
    top: 50%;
    margin-top: -0.145rem
  }
  .forget {
    color: #0693fc
  }
</style>
