<template>
  <div :class="['hw-switch',{'hw-switch1': !config.tip}]" v-show="config" >
    <h6 v-show="config.title" :style="config.t1">{{config.title}}</h6>
    <span class="info" v-show="config.tip">{{config.tip}}</span>
    <b @click="btnChange()" :class="config.status ? 'bg bg-active' : 'bg'"><b class="circle" ></b></b>
  </div>
</template>

<script>
export default{
  name : 'hw-switch',
  props : ['config'],
  methods : {
      btnChange(){
          this.$emit('event',(this.config.status ? 1 : 2));
      }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../assets/css/common";
  .hw-switch{
    width: 100%;
    background: white;
    /*height: 1.50rem;*/
    padding: 0.08rem 0.3rem 0.26rem 0.3rem;
    position: relative;
    box-sizing: border-box;
  }
  .hw-switch h6{
    font-size: 0.28rem;
    line-height: 0.68rem;
    font-weight: normal;
    text-align: left;
    color: $gray_a;
  }
  .hw-switch .info{
    display: block;
    width: 100%;
    box-sizing: border-box;
    text-align: left;
    font-size: 0.24rem;
    color: $gray_c;
  }
  .hw-switch .bg{
    display: inline-block;
    background: $switch_c;
    width: 1rem;
    height: 0.50rem;
    border-radius: 0.25rem;
    position: absolute;
    top:0.16rem;
    right:0.3rem;
  }
  .hw-switch .circle{
    display: inline-block;
    width: 0.46rem;
    height: 0.46rem;
    background: white;
    -webkit-border-radius: 50%;
    -moz-border-radius:  50%;
    -ms-border-radius:  50%;
    -o-border-radius:  50%;
    border-radius:  50%;
    position: absolute;
    left: 0.02rem;
    top: 0.02rem;
    transition: all 0.5s;
  }
  .hw-switch .bg-active{
    background: $baseGreen;
  }
  .hw-switch .bg-active  .circle{
    left: 0.52rem;
  }
  .hw-switch1{
    padding-bottom: 0;
    display: flex;
    align-items: center;
    height: 1rem;
    h6{
      line-height: 0.32rem;
    }
  }
</style>
