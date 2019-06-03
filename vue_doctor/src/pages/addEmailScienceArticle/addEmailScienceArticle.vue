<template>
<div class="container">
   <div class="head"></div>
  <img src="../../assets/media/img/science-bg.png" alt="" class="c-icon">
  <img src="../../assets/media/img/science-bg-content.png" alt="" class="c-content">
  <i class="icon-return-boldleft" @click.stop="back"></i>
</div>
</template>

<script>
export default{
  created(){
    this.$store.commit('UPDATE_NAV',{title : '', fShow : false, hShow : false});
//      this.$store.commit('UPDATE_MASK',true);
  },
  methods :{
    back(){
        this.$router.push({path : '/myScienceing'});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
  .container{
    background: $baseBlue;
    line-height: 0;
    .head{
      display: inline-block;
      width: 100%;
      height: 3.74rem;
      background: url(../../assets/media/img/science-bg-head.png)left top;
      background-size: 100% 100%;
      overflow: hidden;
      /*background: white;*/
    }
    .c-icon{
      /*position: absolute;*/
      display: inline-block;
      width: 4.2rem;
      height: 0.9rem;
      margin-top: -0.5rem;
      margin-left: calc(50% - 2.1rem);
      /*top : 3.3rem;*/
      /*left: 1.7rem;*/
    }
    .c-content{
      display: inline-block;
      height: 7.45rem;
      width: 100%;
      margin-top: -0.58rem;
    }
    .icon-return-boldleft{
      position: absolute;
      left: 0.2rem;
      top:0.28rem;
      color: white;
      font-size: 0.34rem;
    }
  }
</style>
