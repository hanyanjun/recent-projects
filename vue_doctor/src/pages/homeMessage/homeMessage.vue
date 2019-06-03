<template>
<div class="homeMessage">
   <nav>
     <h6>
       <router-link to="/teamMessage" tag="b">团队聊天</router-link>
       <router-link to="/message" tag="b">会员咨询</router-link>
     </h6>
   </nav>
  <router-view class="homeMessageContent"></router-view>
</div>
</template>

<script>
export default{
  created(){

  },
  mounted(){
    this.$store.commit('SET_FOOTER_TAB','1');
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
.homeMessage{
  height: 100%;
  overflow: hidden;
  .homeMessageContent{
    height: calc(100% - 1.2rem);
    overflow: scroll;
    background: $bg;
  }
  nav{
    height: 1.2rem;
    background: $baseBlue;
    padding: 0.3rem 0.2rem;
    box-sizing: border-box;
    line-height: 0;
    h6{
      border: 1px solid white;
      border-radius: 0.06rem;
      display: flex;
      flex-wrap: nowrap;
    }
    b{
      font-size: 0.32rem;
      line-height: 0.6rem;
      height: 0.6rem;
      color: white;
      display: inline-block;
      width: 50%;
      text-align: center;
      box-sizing: border-box;
    }
    b:nth-of-type(1){
      border-right: 1px solid white;
    }
  }
  .router-link-active{
    background: white;
    color: $baseBlue;
  }
}
</style>
