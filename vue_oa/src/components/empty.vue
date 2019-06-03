<template>
 <div :class="`emptyCon ${otherClass}`" v-if="visible">
     <img src="/static/imgs/empty.png" alt="" class="emptyIcon" v-show="!img"><br>
     <span class="emptyText" v-show="!img">{{text}}</span>
     <img :src="img1" alt=""  class="img1" v-show="img"><br>
 </div>   
</template>

<script>
import img1 from "../commons/imgs/empty_light.png";
export default {
    data(){return{
        img1 : img1
    }},
    props:{
        text : {
            type : String,
            default : '介里什么都木有啊～'
        },
        visible : {
            type : Boolean,
            default : false
        },
        otherClass:{
            type : String,
            default : ''
        },
        img:{
            type : String,
            default : ''
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/common.scss";
.emptyCon{
    display: inline-block;
    padding: 50px 0;
    .emptyIcon{
        display: inline-block;
        width: 372px;
        height: 262px;
    }
    .emptyText{
        display: inline-block;
        width:372px;
        line-height: 24px;
        font-size:24px;
        font-family:"Microsoft YaHei";
        font-weight:400;
        color:rgba(16,178,255,1);
        margin-top: 8px;
    }
}
.emptyCon1{
    height: 355px;
    box-sizing: border-box;
    padding:  57px 0 129px 0;
    .img1{
        display: inline-block;
        width: 200px;
        height: 164px;
    }
}

</style>
