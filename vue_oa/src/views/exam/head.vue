<template>
 <div class="examhead">
     <div class="con">
         <h6 class="title">{{info.examName || '---'}}</h6>
         <h6 class="tip">{{info.examDesc || '---'}}</h6>
     </div>
    <img src="/static/imgs/exam_bg.png" alt="">
</div>   
</template>

<script>
export default {
    name : 'examHead',
    props:{
        info : {
            type : Object,
            default : function(){
                return {

                }
            }        
          }
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.examhead{
    height: 324px;
    width: 100%;
    min-width: 1200px;
    position: relative;
    img{
        display: inline-block;
        width: 100%;
        height: 100%;
    }
    .con{
        position: absolute;
        top: 50px;
        left: 50%;
        text-align: center;
        transform: translate(-50%);
        color: white;
        .title{
            font-size: 40px;
            font-weight: bold;
            width: auto;
            line-height: 1;
            display: inline-block;
            text-align: center;
        }
        .tip{
            font-size: 14px;
            line-height: 26px;
            color: #d3e9ff;
            margin-top: 24px;
        }
    }
}
</style>
