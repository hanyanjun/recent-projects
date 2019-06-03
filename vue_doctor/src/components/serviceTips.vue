<template>
  <section class="tips" >
    <h6>服务有效时长 <span>48小时</span></h6>
    <span class="tips-text">{{text}}</span>
  </section>
</template>

<script>
export default{
    name : 'serviceTips',
    props : ['text']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../assets/css/common';
  .tips{
    height: 2rem;
    box-sizing: border-box;
    padding: 0.07rem 0.3rem 0.27rem 0.3rem;
    border-bottom: 1px solid $gray_e;
    background: white;
    line-height: 0;
  }
  .tips h6{
    height: 0.74rem;
    line-height: 0.74rem;
    color: $gray_a;
    font-size: 0.28rem;
    font-weight: normal;
    display: flex;
    justify-content: space-between;
  }
  .tips h6 span{
    color: rgb(3, 137, 251);
    font-size: 0.26rem;
  }
  .tips .tips-text{
    display: inline-block;
    width: 100%;
    font-size: 0.24rem;
    line-height: 0.38rem;
    color: $gray_c;
  }
</style>
