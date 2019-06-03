<template>
<div class="examOrderWrap">
    <h6 class="title">
        <span class="type">题卡</span>
        <span :class="['label',{'label1' : pre == 1}]"><i :class="['circle', {'redCircle' : pre == 3}] "></i>{{pre == 3 ?'错误' : '已作答'}}</span>
    </h6>
    <div :class="['content',{'content_height' : pre != 2}]">
      <scrollContent>
          <div class="con">
            <span 
            :class="[
                'circleBtn',
                'pointer', 
                {'status1' : item.isPre},
                {'status3' : allQues[index].isSubmit || (item.answerCopy == item.rightAnswer && item.answerCopy.length > 0) } ,   
                {'status2' : currentIndex == index} ,  
                {'status4' : pre == '3' && item.answerCopy != item.rightAnswer  && item.answerCopy} ,
                {'status5' : pre == '3' &&  currentIndex == index && item.answerCopy != item.rightAnswer && item.answerCopy}]" 
            v-for="(item,index) in allQues" 
            @click.stop="setIndex(index)" 
            :key="index">
            {{index + 1}}
            <!-- {{item.answer}} -->
            </span>
            <!-- 已预览未做的情况 -->
            <!-- <span class="circleBtn status1">12</span>   -->
            <!-- 当前停留的的题目 -->
            <!-- <span class="circleBtn status2">12</span> -->
            <!--  已作答的题目 -->
            <!-- <span class="circleBtn status3">12</span> -->
            <!-- 错误的题目 -->
            <!-- <span class="circleBtn status4">12</span> -->
            <!-- 当前停留的错误题目 -->
            <!-- <span class="circleBtn status5">12</span> -->
          </div>
      </scrollContent>  
     
    </div>
    <div class="fn" v-if="pre == 2">
        <button  class="pointer"  @click.stop="submitPage">交卷</button>
    </div>
            <reDialog
            :visible.sync="isSkipShow" 
            @submit="isSkip"
            @close="isSkipShow = false"
            submit="确定"
            cancle="取消"
            title="未作答提示">
            <div slot="body" class="titles"> 
                未提交答案，确认跳过该题目吗？
            </div>
            </reDialog>
    
</div>    
</template>

<script>
import scrollContent from "@/components/scrollContent"
import reDialog from "@/components/reDialog"
export default {
    name : 'examOrder',
    components:{scrollContent,reDialog},
    data(){return{
        oldIndex : -1,
        isSkipShow : false,
        newIndex : -1
    }},
    props : {
        allQues : {
            type : Array,
            default : function(){
                return [];
            }
        },
        pre : {
            type : [String,Number],
            default : '0'
        },
        currentIndex : {
            type : [String,Number],
            default : -1
        },
        preIndex : {
            type : [String,Number],
            default : -1
        },
        allAnser:{
            type : Array,
            default : function(){
                return [];
            }
        }
    },
    watch :{
        currentIndex:function(v,o){
            this.oldIndex = v;
            this.newIndex = v;
        }
    },
    methods:{
        isSkip(){
                this.$emit('update:currentIndex',this.newIndex);
                this.oldIndex = this.newIndex;
                this.isSkipShow = false;
        },
        setIndex(index){
            if(this.pre == 2){
                if(!this.allQues[this.oldIndex].isSubmit && this.oldIndex != index){
                    this.isSkipShow = true;
                    this.newIndex = index;
                }else{
                    this.$emit('update:currentIndex',index);
                    this.oldIndex = index;
                    this.newIndex = index;
                }
            }else{
                this.$emit('update:currentIndex',index);
                this.oldIndex = index;
                this.newIndex = index;
            }
            // if(this.allQues[this.oldIndex] == '')
            // if(index < this.currentIndex){
            // this.$emit('preview',index)
            // }else{
            //     this.$message.error('');
            // }
        },
        submitPage(){
            this.$emit('submitPage');
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.examOrderWrap{
    width: 100%;
    min-height: 580px;
    box-sizing: border-box;
    border-left: 1px solid #eeeeee;
    padding-left: 15px;
    .title{
        padding-top: 5px;
        height: 50px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-bottom: 1px solid #eeeeee;
        .type{
            font-size:16px;
            font-weight:bold;
            color:rgba(51,51,51,1);
        }
        .label{
            font-size:12px;
            font-weight:400;
            color:rgba(102,102,102,1);
            .circle{
                display: inline-block;
                width:9px;
                height:9px;
                vertical-align: top;
                background:rgba(255,255,255,1);
                border: 1px solid #2BB2FF;
                margin-right: 7px;
                border-radius:50%;
            }
            .redCircle{
                border: 1px solid #ff6a6a;
            }
        }
        .label1{
            opacity: 0;
        }
    }
    .fn{
        text-align: center;
        border-top: 1px solid #eeeeee;
        button{
            width:120px;
            height:36px;
            background:rgba(255,255,255,1);
            border-radius:3px;
            border: 1px solid #2BB2FF;
            color: #2BB2FF;
            margin-top: 18px;
        }
    }
    .content{
        width: 100%;
        height: 457px;
        padding-top: 8px;
        padding-bottom: 10px;
        padding-left: 12px;
        overflow: hidden;
        box-sizing: border-box;
        .con{
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
        }
        span{
            display: inline-block;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            font-size: 12px;
            border: 1px solid #d1d1d1;
            line-height: 30px;
            text-align: center;
            color: #d1d1d1;
            margin-top: 9px;
            margin-right: 15px;
        }
        .status1{
            color: $gray_b;
            border: 1px solid $gray_b;
        }
        .status3{
            border: 1px solid #2BB2FF;
            color: #2BB2FF;
        }
        .status2{
            background: #2BB2FF;
            border: 1px solid #2BB2FF;
            color: white;
        }
        .status4{
            color: #ff6a6a;
            border: 1px solid #ff6a6a;
        }
        .status5{
            background: #ff6a6a;
            border: 1px solid #ff6a6a;
            color: white;
        }
    }
    .content_height{
        height: 500px;
    }

    .titles{
        text-align: center;
        margin: 40px 0;
    }
}


</style>
