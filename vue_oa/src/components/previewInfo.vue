<template>
    <span :class="info ? 'previewInfo' :'previewInfo noCon'" v-show="visible"  :style="infoStyle">
        {{info || holder}}
    </span>
</template>

<script>
export default {
    props : {
        info : {
            type :[String,Number,Array,Object,Date],
            default : ''
        },
        type : {
            type :String,
            default : ''
        },
        visible : {
            type :Boolean,
            default : false
        },
        infoStyle : {
            type : Object,
            default : function(){
                return {}
            }
        },
        holder : {
            type : String,
            default : '未填写'
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/common.scss";
    .previewInfo{
        display: inline-block;
        width:100%;
        font-size:14px;
        color:$gray_b;
        word-break: break-all;
    }
    .noCon{
        color: $gray_d1;
    }
</style>
