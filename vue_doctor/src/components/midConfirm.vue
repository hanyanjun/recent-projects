<template>
<div class="midConfirm" v-show="visible">
  <div class="midCon">
    <img src="../assets/media/img/phone_icon.png" alt="" v-show="img == 'phone'">
    <h6 class="title">{{title}}</h6>
    <h6 class="tip">{{tip}}</h6>
    <div class="btns">
      <button class="cancle" @click.stop="clickBtn('cancle')" v-show="cancle">{{cancle}}</button>
      <button class="confirm" @click.stop="clickBtn('confirm')" v-show="confirm">{{confirm}}</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
    name: "midConfirm",
    props : {
      img : "",
      title : "",
      tip : "",
      confirm :{
        type : String,
        default : '确认'
      },
      cancle : {
        type : String,
        default : '取消'
      },
      visible:{
        type : Boolean,
        default : false
      }
    },
    methods:{
      clickBtn(v){
        this.$emit(v);
      }
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/common";
.midConfirm{
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  .midCon{
    width: 6rem;
    background: white;
    border-radius: 0.2rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
    overflow: hidden;
    img{
      display: inline-block;
      width: 1rem;
      height: 1rem;
      margin: 0.7rem 0 0.4rem;
    }
    .title{
      font-size: 0.32rem;
      color: $gray_a;
      line-height: 1;
      margin-bottom: 0.2rem;
    }
    .tip{
      font-size: 0.26rem;
      color: $gray_c;
      line-height: 1;
    }
    .btns{
      margin-top: 0.65rem;
      display: flex;
      flex-wrap: nowrap;
      height: 0.9rem;
      button{
        display: inline-block;
        width: 50%;
        height: 100%;
        background: white;
        font-size: 0.32rem;
        line-height: 0.9rem;
        color: #595757;
        border-top: 1px solid $i2Gray;
      }
      .confirm{
        border-left: 1px solid $i2Gray;
        color: $baseBlue;
      }
    }
  }
}
</style>
