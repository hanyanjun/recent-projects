<template>
<div class="hw-submit-btn">
  <hwBtn v-bind="$props" @submit="submit"></hwBtn>
</div>
</template>

<script>
import hwBtn from "./hw-btn"
export default {
  props :{
    text : String,  //按钮内容
    is_disabled : Boolean, //是否是不可点击状态
    is_commit : Boolean,  //是否是提交中状态
    inActiveStyle : {
      type : Object,
      default : function(){
        return {};
      }
    }, //不可点击状态样式
    activeStyle : {
      type : Object,
      default : function(){
        return {};
      }
    }, //可点击状态样式
    commitStyle : {
      type : Object,
      default : function(){
        return {};
      }
    }, //提交中的样式
  },
  components:{hwBtn},
  methods:{
    submit(){
      if(!this.is_disabled && !this.is_commit){
        this.$emit('submit');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hw-submit-btn{
  padding: 0.3rem;
  box-sizing: border-box;
  height: 1.6rem;
  line-height: 0;
  button{
    font-size: 0.4rem;
    line-height: 1rem;
    color: white;
  }
}
</style>
