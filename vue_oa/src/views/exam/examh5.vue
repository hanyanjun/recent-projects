<template>
<div class="exam">
    <div class="head">
        <span class="title">剩余时长：{{detail()}}</span>
        <span :class="['rightStatus',{'rightStatus1' :isLast}]" v-if="curQues" @click.stop="topSubmit">交卷</span>
    </div>
    <div class="queCon" v-if="curQues">
        <div class="type">
          
            {{topicType.obj[curQues.questionType]}}题
        </div>
        <div class="queTitle">
            <span>{{(index + 1) ?  (index + 1) :  ('0' + index + 1)}}</span>/{{examInfo.totalQues > 10 ? examInfo.totalQues : '0'+ examInfo.totalQues}}&nbsp;&nbsp;{{curQues.questionName}}
        </div>
        <div class="queSelect">
          <template v-if="curQues.questionType == 1">
            <label :for="item.optionSort" v-for="(item,index) in curQues.choiceList" :key="index">
                <input type="radio" :name="curQues.sortInPaper"  :value="item.optionSort"  :id="item.optionSort" v-model="curQues.answer">
                <div class="info">
                    <span class="r">{{item.optionSort}}<span class="point">.</span></span>
                    <span class="t">{{item.choiceContent}}</span>
                </div>
            </label>
          </template>
          <template v-else-if="curQues.questionType == 2">
            <label :for="item.optionSort" v-for="(item,index) in curQues.choiceList" :key="index">
              <input type="checkbox" name="aaa" :value="item.optionSort" :id="item.optionSort" v-model="curQues.answer">
                <div class="info">
                    <span class="r">{{item.optionSort}}<span class="point">.</span></span>
                    <span class="r r1"></span>
                    <span class="t">{{item.choiceContent}}</span>
                </div>
            </label>
          </template>
          <template v-else-if="curQues.questionType == 3">
            <label :for="item.code" v-for="(item,index) in truefalseques.list" :key="index">
              <input type="radio" name="aaa" :value="item.code" :id="item.code" v-model="curQues.answer">
                <div class="info " v-if="item.code == 'Y'"> 
                    <span class="r"></span>
                      <span class="r r1"></span>
                    <span class="t">{{item.name}}</span>
                </div>
                <div class="info info2" v-if="item.code == 'N'"> 
                    <span class="r"></span>
                      <span class="r r2"></span>

                    <span class="t">{{item.name}}</span>
                </div>
            </label>
          </template>
        </div>
    </div>
    <div class="btns" v-if="curQues">
        <button :class="['pre',{'active' : index > 0}]" @click.stop="pre(index >0)">上一题</button>
        <button :class="['next', {'active2' :  (curQues.answer.length > 0 && curQues.questionType != 2  ) || (curQues.questionType == 2 &&curQues.answer.length >= 2)  }]" 
                @click.stop="submitOne(false)" v-if="!isLast  || index != allQuesEmpty.length - 1">确认，下一题</button>
        <button class="next active2" @click.stop="confirmS1 = true" v-if=" isLast && index ==  allQuesEmpty.length-1">提交试卷</button>
    </div>
    <!-- 考试说明的弹窗 -->
    <div class="mask explain" v-show="examTipShow">
        <div class="explainCon">
            <h6 class="explainT">
                考试说明
            </h6>
            <ul class="explainTip">
                <li><span class="sort">1.</span>考试时间{{info1.examDuration}}分钟，共{{examInfo.totalQues}}题；满分{{examInfo.totalScore}}分，及格分{{examInfo.qualifiedScore}}分；</li>
                <li><span class="sort">2.</span>分单选、多选、判断3种题型，请看清题型后再答题；</li>
                <li><span class="sort">3.</span>请确保所有答案都提交后在交卷；</li>
                <li><span class="sort">4.</span>有疑问请找当地HR一对一咨询。</li>
                <li v-if="examInfo.examDesc"><span class="sort">5.</span>{{examInfo.examDesc}}</li>
            </ul>
            <span class="agree" @click.stop="agree">我已阅读并开始考试</span>
            <img src="../../commons/imgs/h5_tip.png" class="explainB" alt="">
        </div>
    </div>
    <!-- 确认交卷的弹窗 -->
    <div class="mask" v-show="confirmS1">
        <div class="confirmCon">
            <h6 class="title1">确认交卷</h6>
            <h6 class="title2">考试时间尚未截止，确认交卷？</h6>
            <div class="confrimBtns">
                <button class="cancle" @click.stop="confirmS1 = false">取消</button>
                <button class="confirm" @click.stop="submit(true)">确认</button>
            </div>
        </div>
    </div>
    <!-- 确认答案是否都提交的弹窗 -->
    <div class="mask" v-show="confirmS3">
        <div class="confirmCon">
            <h6 class="title1">提示</h6>
            <h6 class="title2">确认修改答案后已重新提交？</h6>
            <div class="confrimBtns">
                <button class="cancle" @click.stop="confirmS3 = false">取消</button>
                <button class="confirm" @click.stop="submit1">确认</button>
            </div>
        </div>
    </div>
    <!-- 自动交卷弹窗 -->
    <div class="mask" v-show="confirmS2">
        <div class="confirmCon">
            <h6 class="title1">考试时间到了</h6>
            <h6 class="title2">考试时间到了，系统自动交卷</h6>
            <div class="confrimBtns ">
                <button class="confirm confirm1" @click.stop="skip">确认</button>
            </div>
        </div>
    </div>
</div>    
</template>

<script>
export default {
  name: "exam",
  data() {
    return {
      isPre: "",
      examTipShow: false,
      info: {},
      info1: {},
      id: "",
      result: "",
      allQuesEmpty: [],
      allQues: [],
      cookieInfo: {},
      examInfo: { questionTopicList: [] },
      index: "",
      confirmS1: false,
      setOverTime : '',
      confirmS2 : false,
      confirmS3 : false,
      isSubmit : false,
      isLast : false
      
    };
  },
  mounted() {
    this.init();
    if (window.sessionStorage["examInfo"]) {
      this.info1 = JSON.parse(window.sessionStorage["examInfo"]);
    }
  },
  created(){
    this.isLast = window.sessionStorage['isLast']
    console.log(this.isLast)
    console.log(this.index)
  },
  computed: {
    userInfo() {
      return this.$store.state.headInfo;
    },
    orderStaticData() {
      return this.$store.state.selectData.orderStaticData;
    },
    truefalseques() {
      return this.$store.state.selectData.truefalseques;
    },
    curQues() {
      if (this.index < 0) {
        return {
          typeScore: "",
          questionType: "",
          questionScore: "",
          quesNum: "",
          order: ""
        };
      }
      return this.allQuesEmpty[this.index];
    },
    topicType() {
      return this.$store.state.selectData.topicType;
    }
  },
  methods: {
    init() {
      // 预览考试的情况
      let cookieInfo = {};
      this.$store.dispatch("getCookiesExam").then(obj => {
        cookieInfo = obj;
        this.$api
          .newExamPage({ recordId: cookieInfo.id })
          .then(obj => {
            this.isPre = 2;
            this.examInfo = obj.data.data;
            this.cookieInfo = { a: obj, b: cookieInfo };
            this.isShowExamTip(this.cookieInfo);
          })
          .catch(_ => {
            this.isPre = 0;
          });
      });
    },
    agree() {
      let cookieInfo = this.cookieInfo;
      window.localStorage[
        this.userInfo.userId + "_" + this.cookieInfo.b.id + "_isFirst"
      ] = true;
      this.initInfo(cookieInfo.a, cookieInfo.b);
      this.examTipShow = false;
    },
    detail(){
            let  mss = Number(this.info.overageTime || '');
            if(mss){
                var days = parseInt(mss / (1000 * 60 * 60 * 24));
                var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = parseInt(mss % (1000 * 60)) / 1000;
                let h1 = Math.floor(days*24 + hours);
                let m1 = Math.floor(minutes);
                let s1 = Math.floor(seconds);
                return  ( h1 > 0 ? (h1 > 9 ? h1 : '0'+h1) : '00') + ':' + ( m1 > 0 ? (m1 > 9 ? m1 : '0'+m1) : '00')  + ':' + ( s1 > 0 ? (s1 > 9 ? s1 : '0'+s1) : '00');
            }else{
                return '---';
            }
    },
    topSubmit(){
      // 1.点击交卷，如果提交试卷显示说明可以 交卷，条件：如果不是最后一题就提示 3弹窗，如果是最后一题时才把最后一题答案带过去
      if(this.isLast){
        // 如果不是最后一题就提示，确认修改答案后已重新提交-页面显示
        if(this.index != this.allQuesEmpty.length - 1){
          this.confirmS3 = true;
        }else{
          // 如果是最后一题，3页面不显示，1页面显示
          this.submit1();
        }
      }
    },
    submit1(){
      // 考试时间尚未截止，确认交卷-页面显示
      this.confirmS1 = true;
      this.confirmS3 = false;
    },
    submit(v,v1) {
        if (v) {
        clearInterval(this.setOverTime);
        if(this.isPre == '2' && this.$store.state.isExam && !this.isSubmit){
          if(this.index === this.allQuesEmpty.length - 1){
            this.submitOne(v1).then(obj=>{
              this.submitAll(v1)       
            })
          }else{
            this.submitAll(v1)
          }
        }
      }
    },
    submitAll(v1){
      this.$api.submitAllExam({recordId : this.id}).then(obj=>{
          this.isSubmit = true;
          // v1 为false 代表 点击的是弹窗的确定按钮
          if(!v1){
            this.skip();
          }
      }).catch(_=>{
          this.isSubmit = true;
          this.$showToast({message : '提交试卷失败，请手动交卷或者联系管理员！'});
      })  
    },
    skip(){
        window.sessionStorage.removeItem('isLast')
        this.$router.push({path : `${this.id}/examResult`});
    },
    pre(v) {
      if (v) {
        this.index--;
      }
    },
    isShowExamTip(cookieInfo) {
      if (this.isPre == 2) {
        if (
          window.localStorage[
            this.userInfo.userId + "_" + cookieInfo.b.id + "_isFirst"
          ]
        ) {
          this.initInfo(cookieInfo.a, cookieInfo.b);
        } else {
          this.examTipShow = true;
        }
      } else {
        this.initInfo(cookieInfo.a, cookieInfo.b);
      }
    },
    setIndex(v) {
      window.localStorage[
        this.userInfo.userId + "_" + this.id + "_examIndex"
      ] = v;
    },
    // 自动提交时 当然若没有选择答案 直接交卷 选择答案 则先提交当前题目  v为true时为自动提交  自动提交时  不默认提交当前题目
    submitOne(v) {
      return new Promise((resolve,reject)=>{
        if (this.curQues.answer && this.curQues.answer.length > 0) {
          let answer = "";
          if (this.curQues.questionType == "2") {
            answer = this.curQues.answer.join("");
            if(this.curQues.answer.length < 2){
              if(!v){
                this.$showToast({message : '多选至少选择两项答案!'});
                return ;
              }else{
                resolve();
              }
            }
          } else {
            answer = this.curQues.answer;
          }
          if(!v){
            this.$api
            .submitExamOneQues({
              answer: answer,
              recordId: this.id,
              sortInPaper: this.curQues.sortInPaper
            })
            .then(obj => {
              this.allQuesEmpty[this.index].answer = this.curQues.answer;
              window.sessionStorage["_examQues"] = JSON.stringify(
                this.allQuesEmpty
              );
              if(this.index == this.allQuesEmpty.length - 1){
                  this.isLast = true;
                  window.sessionStorage['isLast'] = true;
              }
              if (this.index < this.allQuesEmpty.length - 1) {
                this.index++;
              }
              console.log('提交一个答案')
              this.setIndex(this.index);
              resolve();
            }).catch(_=>{
              reject();
            })
          }
        } else {
          if(!v){
            this.$showToast({message : '请选择答案!'})
          }else{
            resolve();
          }
        }
      })
    },
    setTime() {
      // 时间结束自动交卷
      if (!this.setOverTime) {  
        this.setOverTime = setInterval(() => {
          if (this.info.overageTime > 0) {
            this.info.overageTime -= 1000;
          } else {
            if (this.isPre == "2") {
              // 消除掉第一个确认提交弹窗
              this.confirmS1 = false;
              // 消除确认是否提交的弹窗
              this.confirmS3 = false;
              // 显示第二个自动提交的弹窗
              this.confirmS2 = true;
              this.submit(true,true);
            }
          }
        }, 1000);
      }
    },
    initInfo(obj, cookieInfo) {
      let id = cookieInfo.id;
      let arr = [];
      this.id = id;
      let info = obj.data.data;
      this.info = Object.assign({}, info);
      let cur = info.lastSort;
      info.questionTopicList.forEach((v, i) => {
        if (v.questionList && v.questionList.length > 0) {
          v.questionList.forEach((vv, ii) => {
            let obj = Object.assign({}, vv);
            obj.typeScore = v.typeScore;
            obj.questionType = v.questionType;
            obj.overageTime = v.overageTime;
            obj.questionScore = v.questionScore;
            let len = v.questionList.length;
            obj.quesNum = len > 9 ? len : '0'+len;
            if (obj.questionType == 2) {
              if (vv.answer) {
                obj.answer = vv.answer.split("");
              } else {
                obj.answer = [];
              }
            }
            obj.order = ii + 1 > 9 ? ii + 1 : "0" + (ii + 1);
            arr.push(obj);
          });
        }
      });

      if (cookieInfo.type != "preview") {
        this.setTime();
      }
      this.allQuesEmpty = [...arr];
      if(cur){
        let max = this.allQuesEmpty.length - 1;
        if(cur > max){
          this.isLast = true;
          window.sessionStorage['isLast'] = true;
          cur = max;
        }
        this.index = cur;
        this.setIndex(cur);
      }else{
        this.index = 0;
        this.setIndex(0);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.exam {
  width: 100%;
  height: 100%;
  .head {
    width: 100%;
    height: 1rem;
    background: url("../../commons/imgs/h5_exam_bg.png") left top no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    position: relative;
    justify-content: center;
    .title {
      font-size: 0.34rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 1;
    }
    .rightStatus {
      position: absolute;
      font-size: 0.28rem;
      font-weight: normal;
      color: rgba(255, 255, 255, 1);
      opacity: 0.3;
      line-height: 1;
      right: 0.25rem;
      top: 50%;
      margin-top: -0.14rem;
    }
    .rightStatus1 {
      opacity: 1;
    }
  }
  .queCon {
    height: calc(100% - 2.68rem);
    padding: 0 0.24rem;
    overflow-y: scroll;
    .type {
      border-bottom: 1px solid #dfdfdf;
      font-size: 0.3rem;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 1;
      padding: 0.4rem 0 0.2rem;
      text-align: center;
    }
    .queTitle {
      margin: 0.55rem auto 0.75rem;
      font-size: 0.3rem;
      font-family: PingFangSC-Medium;
      font-weight: bold;
      color: $gray_a;
      line-height: 0.4rem;
      span {
        color: #259afb;
      }
    }
    .queSelect {
      label {
        display: flex;
        align-items: center;
        width: 100%;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 5px 5px 0px rgba(38, 142, 249, 0.16);
        border-radius: 0.06rem;
        margin-bottom: 0.2rem;
        input {
          display: none;
        }
        .info {
          width: 100%;
          height: 100%;
          font-size: 0.28rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          position: relative;
          box-sizing: border-box;
          padding: 0.28rem 0.75rem;
          .r {
            display: inline-block;
            width: 0.44rem;
            height: 0.44rem;
            border-radius: 50%;
            background: white;
            color: rgba(43, 178, 255, 1);
            margin-right: 0.17rem;
            position: absolute;
            left: 0.14rem;
            text-align: center;
            line-height: 0.44rem;
            top: 0.28rem;
          }
          .t {
            line-height: 0.4rem;
            color: $gray_a;
          }
          .r1 {
            display: none;
          }
          .r2 {
            display: none;
          }
        }
        input:checked + .info {
          background: #8fd4fc;
          border: 1px solid #259afb;
          border-radius: 0.06rem;
          .t {
            color: white;
          }
          .r1 {
            display: inline-block;
            color: white;
            background: url("../../commons/imgs/h5_checked.png") white center
              no-repeat;
            background-size: 0.3rem 0.24rem;
          }
          .r2 {
            display: inline-block;
            color: white;
            background: url("../../commons/imgs/h5_check_err.png") white center
              no-repeat;
            background-size: 0.22rem 0.23rem;
          }
          .point {
            display: none;
          }
        }
        input:checked + .info1 {
          .r {
            display: none;
          }
          .r1 {
            display: inline-block;
          }
          .r2 {
            display: inline-block;
          }
        }
        input:checked + .info2 {
          background: #eeb2b3;
          border: 1px solid #e96f6f;
          box-sizing: border-box;
        }
      }
    }
  }
  .btns {
    text-align: center;
    button {
      display: inline-block;
      font-size: 0.34rem;
      line-height: 0.88rem;
      text-align: center;
      background: rgba(223, 223, 223, 1);
      border: 1px solid rgba(153, 153, 153, 1);
      color: $gray_c;
      box-sizing: border-box;
    }
    .pre {
      width: 2rem;
      height: 0.88rem;
      border-radius: 0.04rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
    }
    .next {
      width: 4.82rem;
      height: 0.88rem;
      border-radius: 0.04rem;
    }
    .active {
      background: rgba(37, 154, 251, 1);
      color: white;
      border: none;
    }
    .active2{
      background:#2646f9;
      color: white;
      border: none;
    }
  }
}
.mask {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  left: 0;
  top: 0.1rem;
  .confirmCon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: white;
    width: 6.2rem;
    height: 3.5rem;
    overflow: hidden;
    border-radius: 0.2rem;
    .title1 {
      font-size: 0.36rem;
      font-family: PingFangSC-Medium;
      font-weight: bold;
      color: rgba(0, 0, 0, 1);
      line-height: 1;
      text-align: center;
      margin-top: 0.8rem;
    }
    .title2 {
      font-size: 0.28rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      line-height: 1;
      text-align: center;
      margin-top: 0.3rem;
    }
    .confrimBtns {
      position: absolute;
      left: 0;
      bottom: 0;
      display: flex;
      width: 100%;
      flex-wrap: nowrap;
      height: 1rem;
      border-top: 1px solid #dfdfdf;
      button {
        display: inline-block;
        width: 50%;
        font-size: 0.34rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 1rem;
        height: 1rem;
        background: white;
      }
      .cancle {
        border-right: 1px solid #dfdfdf;
      }
      .confirm {
        color: #259afb;
      }
      .confirm1{
        width: 100%;
      }
    }
  }
}
.explain {
  padding: 0.9rem 0.46rem 0.64rem;
  box-sizing: border-box;
  .explainCon {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(37, 154, 251, 1);
    position: relative;
    .explainT {
      height: 1.07rem;
      border-bottom: 1px solid #dfdfdf;
      line-height: 1.07rem;
      font-size: 0.3rem;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      text-align: center;
    }
    .explainTip {
      padding: 0 0.3rem;
      // max-height: 2rem;
      height: calc(100% - 4rem) ;
      overflow-y: scroll;
      li {
        padding-left: 0.4rem;
        position: relative;
        list-style: none;
        margin-top: 0.4rem;
        font-size: 0.28rem;
        line-height: 0.38rem;
        color: $gray_b;
        .sort {
          position: absolute;
          left: 0;
          top: 0.02rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
        }
      }
    }
    .agree {
      display: block;
      width: 5.6rem;
      height: 0.88rem;
      background: rgba(37, 154, 251, 1);
      border: 1px solid rgba(223, 223, 223, 1);
      border-radius: 40px;
      font-size: 0.34rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 0.88rem;
      position: absolute;
      bottom: 1.6rem;
      left: 50%;
      margin-left: -2.8rem;
      text-align: center;
    }
  }
  .explainB {
    display: inline-block;
    width: 7.5rem;
    height: 1.94rem;
    position: absolute;
    bottom: -0.3rem;
    left: 50%;
    margin-left: -3.75rem;
  }
}
</style>
