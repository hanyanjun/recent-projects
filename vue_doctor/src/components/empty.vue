<template>
  <div class="empty" v-show="config.show">
    <template v-if="config.type == 'article'">
      <img src="../assets/media/img/empty-science.png" alt="" class="article">
    </template>
    <template v-else>
      <img src="../assets/media/img/empty-icon.png" alt="">
    </template>
    <h6>{{config.text}}</h6>
    <a href="javascript:;" class="set" v-show="config.btn" @click.stop="$router.push({path : config.btnLink})">{{config.btn}}</a>
  </div>
</template>

<script>
export default{
    name : 'empty',
    props : ['config']
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
 @import "../assets/css/common";
  .empty{
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 0;
  img{
    display: inline-block;
    width: 1.78rem;
    height: 1.53rem;
    margin-bottom: 0.55rem;
    margin-top: 2.1rem;
  }
    .article{
      width: 1.8rem;
      height: 2.1rem;
    }
  h6{
    font-size: 0.36rem;
    color: $gray_d;
    text-align: center;
    line-height: 1;
  }
  }
  .set{
    display: inline-block;
    width: 2.2rem;
    height: 0.7rem;
    background: $baseBlue;
    color: white;
    font-size: 0.32rem;
    line-height: 0.7rem;
    border-radius: 0.06rem;
    margin-top: 0.8rem;
  }
</style>
