<template>
  <span class="editOrPre" @click.stop="change">
      <template v-if="isPre">
        <i class="iconfont icon-bianji" ></i>
        编辑   
      </template>
      <!-- <template v-else>
        <i class="iconfont  icon-yulan"></i>
        预览   
      </template> -->
  </span>  
</template>

<script>
export default {
    props:{
        isPre:{
            type : Boolean,
            default : false
        }
    },
    methods:{
        change(){
            this.$emit("update:isPre",!this.isPre);
            this.$emit('change');
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
.editOrPre:hover{
    cursor: pointer;
}

.iconfont{
    margin-right: 5px;
}
.iconfont{
    color: #63717F;
}
</style>
