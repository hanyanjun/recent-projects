<template>
<!-- preSubjectWrap -->
<div :class="['subjectWrap', 'examSubjectWrap', {'preSubjectWrap' : pre == '3'}] ">
    <h6 class="title noselect">{{info.order}}、{{topicType.obj[info.questionType]}}题(本大题共{{info.quesNum}}小题，每题{{info.questionScore}}分，共{{info.quesNum * info.questionScore}}分)</h6>
    <div class="subCon">
        <scrollContent>
            <h6 class="t1 noselect">
                
            <span class="t1_num">{{index + 1}}、     </span>  
             <template v-if="info.questionType == '1'">
                <span class="exam_type"><img src="../../commons/imgs/exam_s.png" alt="" class="exam_type_img"></span>
             </template>
             <template v-else-if="info.questionType == '2'">
                <span class="exam_type"><img src="../../commons/imgs/exam_m.png" alt="" class="exam_type_img"></span>
             </template>
            <span>{{info.questionName}}</span>
            </h6>
            <div class="options">
                <template v-if="info.questionType == '2'">
                    <el-checkbox-group  v-model="info.answer"  @change="changeAnswer">
                        <el-checkbox  
                            v-for="item in info.choiceList" 
                            :disabled="pre != 2"
                            class="block" 
                            :key="item.id"
                            :label="item.optionSort"
                            ref="partLeaderRadio">
                            {{item.choiceContent}}
                        </el-checkbox>
                    </el-checkbox-group>
                </template>
                <template v-else-if="info.questionType == '3'">
                    <el-radio v-model="info.answer" :disabled="pre != 2"  @change="changeAnswer"  :label="item.code" class="block"  v-for="item in truefalseques.list" :key="item.code">{{item.name}}</el-radio>
                </template>    
                <template v-else>
                    <el-radio v-model="info.answer" :disabled="pre != 2"  @change="changeAnswer"  :label="item.optionSort" class="block"  v-for="item in info.choiceList" :key="item.id">{{item.choiceContent}}</el-radio>
                </template>
            </div>
        </scrollContent>   
    </div>
    <div class="bottom">
        <scrollContent>
            <div class="result" v-if="pre == '3'">
                <h6 :class="['resInfo', 'green' , {'red' : info.answerCopy !=  info.rightAnswer}]">
                    答案：
                    <template v-if="info.questionType == '3'">
                        {{truefalseques.obj[info.rightAnswer]}}
                    </template>
                    <template v-else-if="info.questionType == '1'">
                        <span 
                        v-for="item in info.choiceList" 
                        :key="item.optionSort"
                        v-show="item.optionSort == info.rightAnswer"
                        >{{item.choiceContent}}</span>
                    </template>
                    <template v-else-if="info.questionType == '2'">
                        {{checks}}
                    </template>
                </h6>
                <h6 class="analyze">答案解析：{{info.answerAnalysis || '无'}}</h6>
            </div>
            <div class="fn" v-show="pre != '3'">
                <button :class="['gray','pointer',{'active': index >= 1}]"  v-if="pre == 1" @click.stop="preQues"> &lt;&lt;上一题</button>
                <button :class="['sub',  {'pointer' : index >= 1 } , {'opacity0' : index < 1}]"  v-if="pre ==  2" @click.stop="preQues">看上一题</button>
                <button class="sub pointer" v-if="pre != 1" @click.stop="submit">确认提交</button>
                <button :class="['gray','pointer',{'active': index >= 0 && total > 0 && index < total }]" v-if="pre == 1" @click.stop="nextQues"> &gt;&gt;下一题</button>
                <button :class="['sub', {'pointer' : index != total }, 'gray0' ,{'opacity0' : index == total}  ]" v-if="pre ==  2" @click.stop="nextQues">不确定，先跳过</button>
            </div>
        </scrollContent>    
        
    </div>
</div>    
</template>

<script>
import scrollContent from "@/components/scrollContent"
export default {
    name : "subject",
    data(){return{
        radio : '',
        type : 'exam'
    }},
    props:{
        pre : {
            type : [String,Number],
            default : '0'
        },
        index  : {
            type : Number,
            default : -1
        },
        info : {
            type : Object,
            default : function(){
                return {}
            }
        },
        total:{
            type : Number,
            default : 0
        }
    },
    computed:{
      topicType(){
          return this.$store.state.selectData.topicType;
      },
      truefalseques(){
          return this.$store.state.selectData.truefalseques;
      },
      checks(){
          let arr = this.info.rightAnswer.split('');
          let str = '';
          arr.forEach(v => {
              this.info.choiceList.forEach(v1=>{
                  if(v == v1.optionSort){
                      str += `${v1.choiceContent}；`;
                  }
              })
          });
          return str;
      }    
    },
    components:{scrollContent},
    methods:{
        nextQues(){
            if(this.index == this.total){
                if(this.pre != 2){
                    this.$message.error('当前已是最后一题!');
                }
            }else{
                this.$emit("update:index",this.index + 1);
            }
        },
        changeAnswer(){
              this.$emit('changeAnswer',this.index);
        },
        preQues(){
            if(this.index == 0){
                if(this.pre != 2){
                    this.$message.error('当前已是第一题!');
                }
            }else{
                this.$emit("update:index",this.index - 1);
            }
        },
        submit(){
            this.$emit('submit');
        }
    }
}
</script>

<style lang="scss"  scoped>
@import "../../assets/css/common.scss";
h6{
    font-weight: normal;
}
.subjectWrap{
    height: 580px;
    padding:  0 10px 0 20px;
    .subCon{
        height: 410px;
        border: 1px solid rgba(0, 0, 0, 0);
        box-sizing: border-box;
        padding-top: 29px;
        .t1{
            width:708px;
            font-size:14px;
            font-weight:400;
            color:rgb(51, 47, 47);
            line-height:30px;
            margin-bottom: 22px;
            padding-left: 36px;
            box-sizing: border-box;
            position: relative;
            word-break: break-all;
            .t1_num{
                position: absolute;
                left: 14px;
                top: 0;
            }
            span{
                vertical-align: top;
                line-height: 30px;
            }
        }
        .options{
            padding-left: 40px;
        }
        .block{
            display: block;
        }
        .el-radio,.el-checkbox{
            margin-bottom: 35px;
        }
        .el-radio + .el-radio,.el-checkbox + .el-checkbox{
            margin-left: 0;
        }
    }
    .exam_type{
        display: inline-block;
        width: 41px;
        height: 30px;
        padding-top: 5px;
        box-sizing: border-box;
        .exam_type_img{
            display: inline-block;
            width: 41px;
            height: 20px;
        }
        // position: absolute;
        // left: 36px;
        // top: 5px;
    }
    .bottom{
        width: 100%;
        height: 120px;
        overflow: hidden;
        box-sizing: border-box;
        padding: 60px 25px 0 10px;
        .fn{         
            display: flex;
            width: 100%;
            justify-content: space-between;  
        }
        button{
            display: inline-block;
            vertical-align: top;
            background: white;
        }
        .gray{
            font-size:14px;
            font-weight:400;
            color:rgba(102,102,102,1);
        }
        .active:hover{
            font-size:14px;
            font-weight:400;
            color:rgba(43,178,255,1);
            text-decoration: underline;
        }
        .sub{
            width:220px;
            height:40px;
            background:rgba(43,178,255,1);
            border-radius:3px;
            color: white;
            font-weight:400;
            font-size: 14px;
        }
        .opacity0{
            opacity: 0;
        }
        .gray0{
            background:$btn_bg;
            color: $gray_b;
            border: 1px solid $gray_d1;
        }
    
    }
    
}
.preSubjectWrap{
    height: 100%;
    .bottom{
        overflow: hidden;
        padding: 20px 50px;
        box-sizing: border-box;
        border-top: 1px solid #eeeeee;
        font-weight:400;
        line-height:30px;
        h6{
            font-size:14px;
            word-break: break-all;
        }
    }
    .green{
        color: #24B985;
    }
    .red{
        color: #ff6a6a;
    }
}
.title{
    padding-top: 4px;
    font-size:16px;
    font-weight:bold;
    box-sizing: border-box;
    color:rgba(51,51,51,1);
    line-height: 45px;
    border-bottom: 1px solid #eeeeee;
}



</style>
