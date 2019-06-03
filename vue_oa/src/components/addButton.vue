<template>
 <div class="addBtn pointer" @click.stop="add">
     <i class="iconfont icon-ic_join_dialing_norm"></i>
     {{text || '添加'}}
 </div>   
</template>

<script>
export default {
  name : "addButton",
  props:{
      text : {
          type : String,
          default : ''
      }
  },
  methods:{
      add(){
          this.$emit("add");
      }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/common.scss";
.addBtn{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fbfdff;
    border-radius: 5px;
    font-size: 14px;
    color: $gray_b;
    border: 1px dotted $gray_f1;
    .iconfont{
        color: #9b9fa6;
        font-size: 20px;
        margin-right: 8px;
    }
}
</style>
