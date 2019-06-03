<template>
 <h6 class="title">
            <span>{{title || '---'}}</span>
             <i class="iconfont icon-fanhui pointer" @click.stop="back"></i>
 </h6>   
</template>

<script>
export default {
    name : 'infoHead',
    props: {
        title : {
            type : String,
            default : ''
        },
    },
    methods:{
        back(){
            this.$emit('back');
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/common";
.title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    span{
        font-size:16px;
        font-weight: bold;
        color:rgba(51,51,51,1);
        line-height:56px;
    }
    i{
        font-size: 26px;
        color: $gray_b;
        font-weight: normal;
    }
}
</style>
