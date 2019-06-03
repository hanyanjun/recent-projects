<template>
  <span class="editOrPre">
      <template v-if="isPre">
        <span class="edit" @click.stop="change"><i class="iconfont icon-bianji" ></i>
        编辑</span>   
      </template>
      <template v-if="preShow">
        <span @click.stop="preview"><i class="iconfont  icon-yulan"></i>
        预览   </span>
      </template>
  </span>  
</template>

<script>
export default {
    props:{
        isPre:{
            type : Boolean,
            default : false
        },
        preShow: {
            type : Boolean,
            default : false
        }
    },
    methods:{
        change(){
            this.$emit("update:isPre",!this.isPre);
            this.$emit("change");
        },
        preview(){
            this.$emit("preview");
        }
    }
}
</script>

<style lange="scss" scoped>
.editOrPre{
    height:14px;
    font-size:14px;
    line-height: 1;
    color:rgba(99,113,127,1);
    position: absolute;
    right: 35px;
    top: 35px;
}
.iconfont{
    margin-right: 5px;
}
.editOrPre:hover{
    cursor: pointer;
}
.iconfont{
    color: #63717F;
}
.edit{
    margin-right: 10px;
}
</style>
