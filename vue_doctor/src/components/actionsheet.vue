<template>
  <!--两种配置方式一种是 直接写在config中 一种是直接绑定display属性-->
  <ul class="actionsheet"  v-show="info.show">
    <li v-show="info.title">{{info.title}}</li>
    <button type="button" name="button" :class="item.name == '取消' ? 'cancle' : 'confirm'" v-for="(item,index) in info.btns" @click.stop="btnMethod(item)">{{item.name}}</button>
  </ul>
</template>

<script>
  export default{
    name : 'actionsheet',
    computed :{
      info(){
        return this.$store.state.components.actionSheet;
      }
    },
    methods : {
      btnMethod(v){
        v.method();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .actionsheet {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    z-index: 99999;
  }

  .actionsheet li {
    height: .7rem;
    line-height: .7rem;
    color: #8c8b8b;
    border-bottom: 1px solid #8c8b8b;
    text-align: center;
    font-size: .24rem;
    background: white;
  }

  .actionsheet button {
    display: block;
    width: 100%;
    height: 1rem;
    text-align: center;
    line-height: 1rem;
    font-size: .34rem;
    background: #fff;
    border-bottom: 1px solid #8c8b8b
  }

  .actionsheet .cancle {
    /*color: #fc3608;*/
    margin-top: 0.15rem;
    border-bottom: none;
  }
  .actionsheet .confirm{
    color: #fc3608;;
  }
</style>
