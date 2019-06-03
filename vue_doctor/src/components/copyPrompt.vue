<template>
<div class="hw-copy-prompt" v-show="show">
   <h6 class="title">{{title}}</h6>
   <span class="line"></span>
   <textarea name="" id="" :placeholder="holder" :value="value" @input="change"></textarea>
   <div class="btns">
     <button @click.stop="cancle">取消</button>
     <button @click.stop="confirm">确认</button>
   </div>
</div>
</template>

<script>
export default{
    props : {
        show : {
            type : Boolean,
            default : true
        },
        value : {
            default : ''
        },
        title : {
          default :'粘贴或输入链接'
        },
        holder: {
          default : '请点击输入或长按粘贴文章链接'
        }
    },
    methods :{
        cancle(){
            this.maskShow = false;
            this.$emit('cancle',false);
        },
        confirm(){
          this.maskShow = false;
          this.$emit('confirm',this.value);
        },
        change(e){
            this.$emit('input',e.target.value);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../assets/css/common";
.hw-copy-prompt{
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  line-height: 0;
  top:2.8rem;
  background: white;
  z-index: 100;
  border-radius: 0.16rem;
  padding-bottom: 0.34rem;
  .title{
    font-size: 0.32rem;
    color: #595757;
    min-width: 3.6rem;
    padding: 0.3rem 0.76rem;
    line-height: 0.32rem;
    white-space: nowrap;
    border-bottom: 1px solid $gray;
  }
  .line{
    display: inline-block;
    width: 70%;
    height: 1px;
    background: $gray;
    position: absolute;
    top: 2.4rem;
    left: 15%;
  }
  textarea{
    border-top: 0.24rem solid white;
    border-left: 0.76rem solid white;
    border-right: 0.76rem solid white;
    border-bottom: 0.5rem solid white;
    display: inline-block;
    width: 100%;
    height: 1.9rem;
    box-sizing: border-box;
    color: $i2Gray;
    font-size: 0.32rem;
  }
  ::-webkit-input-placeholder{
     color: $i2Gray;
  }
  .btns{
    font-size: 0.32rem;
    display: flex;
    justify-content: space-around;
    button{
      display: inline-block;
      line-height: 0.32rem;
      padding: 0.24rem 0.7rem;
      color: white;
      border-radius: 0.09rem;
    }
    button:nth-of-type(1){
      background: $iconGray;
    }
    button:nth-of-type(2){
      background: $baseBlue;
    }
  }
}
</style>
