<template>
<button v-show="text" @click.stop="submit" :style="[is_disabled ? inActiveStyle : activeStyle , {commitStyle : is_commit}]">
  <template v-if="is_commit">
    <slot name="commit"></slot>
  </template>
  {{text}}
</button>
</template>

<script>
export default {
  props :{
    text : String,  //按钮内容
    is_disabled : {
      type : Boolean,
      default : false
    }, //是否是不可点击状态
    is_commit : {
      type : Boolean,
      default : false
    },  //是否是提交中状态
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
@import "../assets/css/common";
button{
  display: inline-block;
  width: 100%;
  height: 100%;
  border-radius: 0.06rem;
}
</style>
