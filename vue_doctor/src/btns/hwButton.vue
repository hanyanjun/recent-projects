<template>
  <div :class="config.class ? '' : 'div-active'">
    <button :style="config.css" @click="submit" :class="['submit' , config.class]">{{config.text ? config.text : config}}</button>
  </div>
</template>

<script>
  export default{
    name : 'hwButton',
    props : ['config','event'],
    methods : {
      submit(){
        this.$emit('event');
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  div{
    width:100%;
    height:auto;
    /*padding: 0.6rem 0;*/
    /*background: #f0eff5;*/
  }
  .div-active{
    padding: 0.6rem 0;
  }
  button{
    display: block;
    margin: 0 auto;
    width: 6.9rem;
    height: 1rem;
    line-height: 1rem;
    background: rgb(6, 147, 252);
    color: white;
    font-size: 0.4rem;
    text-align: center;
    border-radius: 0.06rem;
  }
  .bottom{
    position: absolute;
    bottom: 0.3rem;
    left: 50%;
    margin-left: -3.45rem;
  }
</style>
