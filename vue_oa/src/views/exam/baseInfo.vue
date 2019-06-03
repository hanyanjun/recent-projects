<template>
<div class="baseInfoTop">
  <span class="num">试卷编号：{{testNo || '---'}}</span>  
  <span class="name">考生：{{userName || '---'}}</span>  
  <span class="score" v-show="pre == '3'">成绩：{{testScore == '' ? '---' : testScore}}</span>  
  <span class="time" v-show="pre != '3'">考试剩余时间: <span>{{detail()}}</span></span>      
</div>  
</template>

<script>
export default {
    name : 'baseInfo',
    props :{
        testNo : {
            type : String,
            default : ''
        },
        userName : {
            type : String,
            default : ''
        },
        testScore : {
            type : String,
            default : ''
        },
        time : {
            type : Number,
            default : ''
        },
        pre : {
            type: [String,Number],
            defualt : 3
        }
    },
    methods:{
        detail(){
            let  mss = Number(this.time);
            if(mss){
                var days = parseInt(mss / (1000 * 60 * 60 * 24));
                var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = parseInt(mss % (1000 * 60)) / 1000;
                return  (Math.floor(days*24 + hours)  > 0 ? Math.floor(days*24 + hours)  : 0)+ " 小时 " + (Math.floor(minutes) > 0 ? Math.floor(minutes) : 0) + " 分钟 " + (Math.floor(seconds)  > 0 ? Math.floor(seconds) : 0) +'秒';
            }else{
                return '---';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.baseInfoTop{
    width: 100%;
    height:45px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 5px 0px rgba(221,221,221,1);
    display: flex;
    align-items: center;
    justify-content: space-around;
    span{
        font-size:16px;
        font-weight:400;
        color: $gray_b;
        line-height:45px;
    }
    .time > span{
        color: #2BB2FF;
        font-weight: bold;
    }
}

</style>
