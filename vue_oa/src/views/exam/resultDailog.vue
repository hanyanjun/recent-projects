<template>
<div class="resultWrap" v-show="visible">
    <div class="resCon">
        <img src="/static/imgs/exam_dialog_bg.png" alt="">
        <i class="iconfont icon-del2 pointer " @click.stop="close"></i>
        <h6 class="title">考试成绩</h6>
        <div class="score"><span>{{result.testScore == '' ? '0' : result.testScore}}</span>分</div>
        <h6 class="res">是否及格: <span class="blue">{{result.isQualified == 'Y' ? '及格' : '不及格'}}</span></h6>
        <h6 class="tip">考试结束后别忘了查看试题分析哦~   </h6>
        <div class="btns">
            <button class="sub pointer" @click.stop="confirm">确认</button>
        </div>
    </div>
</div>    
</template>

<script>
export default {
    name : 'resultDialog',
    props:{
        visible : {
            type : Boolean,
            default : false
        },
        result: {
            type : Object,
            default : function(){
                return {}
            }
        }
    },
    methods:{
        confirm(){
            this.$util.exitScreen();
            this.$router.push({name : 'already'});
        },
        close(){
            this.$util.exitScreen();
            this.$router.push({name : 'already'});
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.resultWrap{
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    .resCon{
        width:420px;
        height:500px;
        background:rgba(255,255,255,1);
        border-radius:6px;
        box-shadow:0px 0px 5px 0px rgba(221,221,221,1);
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -250px -210px; 
        img{
            display: inline-block;
            width: 100%;
            height: 210px;
        }
        .title{
            font-size:20px;
            font-weight:bold;
            color:rgba(255,255,255,1);
            position: absolute;
            top: 35px;
            width: 200px;
            left: 50%;
            margin-left: -100px;
            text-align: center;
        }
        .score{
            width:136px;
            height:136px;
            background:rgba(255,255,255,1);
            border-radius:50%;
            position: absolute;
            top: 129px;
            left: 142px;
            text-align: center;
            line-height: 136px;
            font-size: 16px;
            border: 3px solid #2BB2FF;
            span{
                font-size:32px;
                font-weight:bold;
            }
            color:rgba(16,178,255,1);
        }
        .res{
            height:19px;
            font-size:18px;
            font-weight:400;
            color:rgba(102,102,102,1);
            margin: 77px auto 20px;
            text-align: center;
            .blue{
                color: #10B2FF;
                font-weight: bold;
            }
        }
        .tip{
            font-size:14px;
            font-weight:400;
            color:rgba(102,102,102,1);
            text-align: center;
        }
    }
    .btns{
       position: absolute;
       bottom: 44px;
       left: 0;
       text-align: center;
       width: 100%;
       button{
           display: inline-block;
           width:150px;
           height:36px;
           border-radius:4px;
           font-size:14px;
           font-weight:400;
       }
       .sub{
           background:rgba(16,178,255,1);
           color: white;
       }
       .close{
            background:rgba(249,249,249,1);
            border: 1px solid #cccccc;
            color:rgba(102,102,102,1);
            margin-left: 20px;
       }
    }
    .icon-del2{
        font-size: 32px;
        color: #95ccff;
        position: absolute;
        top: 5px;
        right: 5px;
    }
}

</style>
