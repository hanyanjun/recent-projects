<template>
<scrollContent>
    <div class="examWrap">
            <examHead :info="info">
            </examHead>
            <div class="content" >
                <baseInfo :testNo="info.testNo" :pre="isPre" :userName="info.userName"  :testScore="String(info.testScore) || '---'"  :time="Number(info.overageTime || '')" ></baseInfo>
                <div class="subject">
                    <div class="left">
                        <subject :pre="isPre" :index.sync="index" :info.sync="curQues" :total="allQues.length - 1" @submit="submitOne"  @changeAnswer="changeAnswer"></subject>
                    </div>
                    <div class="right">
                        <examOrder :allQues="allQuesEmpty" :allAnser="allQues" :pre="isPre" :currentIndex.sync="index" @submitPage="confirmSubmit"></examOrder>
                    </div>
                </div>     
            </div>
            <footer>博恩惠尔信息科技（上海）有限公司 版权所有© </footer>
            <resultDailog :result="record" :visible="resultVisible"></resultDailog>
            <reDialog
            :visible.sync="submitAllShow" 
            @submit="submitAll"
            @cancle="submitAllShow = false"
            submit="确定"
            cancle="取消"
            title="提交试卷">
            <div slot="body" class="title"> 
                    {{subTitle}}
            </div>
            </reDialog>
            <reDialog
            :visible.sync="tabChange.show" 
            @submit="resetTime2"
            @close="resetTime2"
            submit="确定"
            cancle=""
            title="提示">
            <div slot="body" class="title"> 
                    {{tabChange.text}}
            </div>
            </reDialog> 
            <reDialog
            :visible="examTipShow" 
            @submit="examTipRead"
            @close="examTipClose"
            submit="知道了"
            cancle=""
            title="考试须知">
            <div slot="body" class="examTip"> 
                <ul>
                    <li>1.每次选择答案后务必点击下方 <span class="blue">[确认提交]</span>按钮，提交答案，未提交答案不算有效答案；</li>
                    <li>2.点击右侧答题卡的题号可跳转相对应的题目；</li>
                    <li>3.请不要切换浏览器或停留页面长时间无操作，否则系统会自动判定为作弊，将强制交卷；</li>
                    <li>4.答题卡颜色对应的答题状态：</li>
                    <li class="examTipMes"><span class="status2"><i class="circle"></i>有效作答</span> <span class="status1"><i class="circle "></i>未提交</span> <span><i class="circle"></i>题目未阅读</span></li>
                    <li>5.题目完成后请点击<span class="blue">[交卷]</span>按钮，否则成绩将无效；</li>
                    <li class="hope">预祝各位考生考试成功</li>
                </ul>
            </div>
            </reDialog>
    </div>
    <div class="mask" v-show="downTime.show" @click.stop="resetTime1">
        <div class="maskCon">
           {{downTime.text}}
        </div>
    </div>
    <div class="errToast" v-for="(item,index) in errorToast" :key="index" v-if="item">
       {{item}}
    </div>
   
</scrollContent>   
</template>

<script>
import examHead from "./head.vue";
import baseInfo from "./baseInfo.vue";
import subject from "./subject.vue";
import examOrder from "./examOrder.vue";
import resultDailog from "./resultDailog.vue";
import scrollContent from "@/components/scrollContent";
import reDialog from "@/components/reDialog";
export default {
  name: "exam",
  components: {
    examHead,
    baseInfo,
    scrollContent,
    subject,
    examOrder,
    resultDailog,
    reDialog
  },
  data() {
    return {
      info: {},
      isPre: 0, //1 考官预览 2考生作答 3考生预览试卷
      allQues: [],
      allQuesEmpty: [],
      index: -1,
      id: "",
      submitAllShow: false,
      submitNum: 0, //已提交题目数
      subTitle: "确认提交试卷？",
      setOverTime: "",
      record: { testScore: "", isQualified: "" }, //考试成绩
      resultVisible: false,
      safeCount: 0,
      curCount: 0,
      safeTimeout: "",
      safeInter: "",
      isSubmit: false, //是否已交卷
      downTime: {
        show: false,
        text: ""
      },
      tabChange: {
        show: false,
        text: ""
      },
      examTipShow: false,
      cookieInfo: {},
      errorToast: [],
      errorToastTime: []
    };
  },
  watch: {
    userInfo: {
      function(v) {
        this.init();
      },
      deep: true
    },
    index: function(v, o) {
      this.setIndex(v);
    },
    id: function(v) {
      this.gainIndex(v);
    },
    safeTimeout: function(v) {}
  },
  computed: {
    userInfo() {
      return this.$store.state.headInfo;
    },
    curQues() {
      if (this.index < 0)
        return {
          typeScore: "",
          questionType: "",
          questionScore: "",
          quesNum: "",
          order: ""
        };
      if (this.isPre == 2) {
        return this.allQuesEmpty[this.index];
      } else {
        return this.allQues[this.index];
      }
    },
    orderStaticData() {
      return this.$store.state.selectData.orderStaticData;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    gainIndex(id) {
      let index = window.sessionStorage["_examIndex"];
      if (index) {
        this.index = Number(index);
      } else {
        this.index = 0;
      }
    },
    addMoveEvent() {
      if (!this.isSubmit && this.$store.state.isExam) {
        this.addTimeOut();
      }
      document.querySelector(".examWrap").addEventListener(
        "mousemove",
        () => {
          clearInterval(this.safeInter);
          clearTimeout(this.safeTimeout);
          this.downTime.show = false;
          if (!this.isSubmit && this.$store.state.isExam) {
            this.addTimeOut();
          }
        },
        false
      );
    },
    resetTime1() {
      clearInterval(this.safeInter);
      clearTimeout(this.safeTimeout);
      this.safeTimeout = "";
      this.downTime.show = false;
      if (!this.isSubmit && this.$store.state.isExam) {
        this.addTimeOut();
      }
    },
    resetTime2() {
      clearInterval(this.safeInter);
      clearTimeout(this.safeTimeout);
      this.safeTimeout = "";
      this.tabChange.show = false;
      if (!this.isSubmit && this.$store.state.isExam) {
        this.addTimeOut();
      }
    },
    showToast(mes) {
      this.errorToast.push(mes);
      let time = setTimeout(() => {
        this.errorToast.shift();
        let t = this.errorToastTime.shift();
        clearTimeout(t);
      }, 1500);
      this.errorToastTime.push(time);
    },
    addTimeOut() {
      if (
        this.info.answerTimeOutNum &&
        !this.isSubmit &&
        this.$store.state.isExam
      ) {
        console.log("重新添加" + this.info.answerTimeOutNum + "秒的倒计时");
        this.safeTimeout = setTimeout(() => {
          console.log("倒计时10秒后讲自动交卷");
          // 出现弹窗
          let num = 10;
          if (!this.isSubmit && this.$store.state.isExam) {
            this.downTime.show = true;
            this.downTime.text = `${num}秒后将自动交卷，点击屏幕取消`;
            this.safeInter = setInterval(() => {
              num--;
              console.log(num);
              this.downTime.text = `${num}秒后将自动交卷，点击屏幕取消`;
              if (num == 0) {
                //    将自动交卷
                this.downTime.show = false;
                clearInterval(this.safeInter);
                clearTimeout(this.safeTimeout);
                if (!this.isSubmit && this.$store.state.isExam) {
                  this.submitAll();
                }
              }
            }, 1000);
          }
        }, this.info.answerTimeOutNum * 1000);
      }
    },
    setPre(index) {
      if (this.allQuesEmpty.length > 0) {
        this.allQuesEmpty[index].isPre = true;
        if (index - 1 >= 0 && this.allQues[index - 1].answer) {
          this.allQuesEmpty[index - 1].answer = this.allQues[index - 1].answer;
        }
        window.sessionStorage["_examQues"] = JSON.stringify(this.allQuesEmpty);
      }
    },
    changeAnswer(index) {
      this.allQuesEmpty = Object.assign([],this.allQuesEmpty);
      window.sessionStorage["_examQues"] = JSON.stringify(this.allQuesEmpty);
    },
    setIndex(v) {
      window.sessionStorage["_examIndex"] = v;
      this.setPre(v);
    },
    // 确认是否交卷操作
    confirmSubmit() {
      let done = 0;
      let undo = 0;
      let submit = 0;
      this.$api.proExamPage({ recordId: this.id }).then(obj => {
        if (obj.data.data.progressRate) {
          submit = Number(obj.data.data.progressRate.split("/")[0]);
          this.allQues.forEach(v => {
            if (v.answer.length > 0) {
              done++;
            } else {
              undo++;
            }
          });
          this.submitAllShow = true;
          this.subTitle = "确认提交试卷？";
          if (done > submit) {
            this.subTitle =
              "当前还有" + (done - submit) + "道题未提交，确认提交试卷?";
            return;
          }
          if (undo) {
            this.subTitle = "当前还有" + undo + "道题未填写完成，确认提交试卷?";
          }
          console.log(this.subTitle);
          console.log("没有答案" + undo);
        }
      });
    },
    submitAll() {
      clearInterval(this.safeInter);
      clearTimeout(this.safeTimeout);
      console.log("提交试卷！");
      if (this.isPre == "2" && this.$store.state.isExam && !this.isSubmit) {
        this.submitAllShow = false;
        this.downTime.show = false;
        this.tabChange.show = false;
        console.log("提交试卷");
        this.$api
          .submitAllExam({ recordId: this.id })
          .then(obj => {
            this.isSubmit = true;
            this.$api.resultExamPage({ recordId: this.id }).then(obj => {
              this.record.testScore = obj.data.data.testScore || "0";
              this.record.isQualified = obj.data.data.isQualified || "N";
              this.resultVisible = true;
            });
          })
          .catch(_ => {
            this.isSubmit = true;
            this.showToast("提交试卷失败，请手动交卷或者联系管理员！");
            // this.$message.error('提交试卷失败，请手动交卷或者联系管理员！');
          });
      }
    },
    submitOne() {
      if (this.curQues.answer && this.curQues.answer.length > 0) {
        let answer = "";
        if (this.curQues.questionType == "2") {
          answer = this.curQues.answer.join("");
          if (this.curQues.answer.length < 2) {
            this.showToast("多选至少选择两项答案!");
            // this.$message.error('多选至少选择两项答案!');
            return;
          }
        } else {
          answer = this.curQues.answer;
        }
        this.$api
          .submitExamOneQues({
            answer: answer,
            recordId: this.id,
            sortInPaper: this.curQues.sortInPaper
          })
          .then(obj => {
            this.allQuesEmpty[this.index].isSubmit = true;
            this.allQuesEmpty[this.index].answer = this.curQues.answer;
            this.allQuesEmpty = Object.assign([],this.allQuesEmpty);
            this.allQues[this.index].answer = this.curQues.answer;
            this.allQues = Object.assign([],this.allQues);
            this.setIndex(this.index);
            this.submitNum++; //提交成功 提交数目加1
            // this.$message.success('提交答案成功!');
            window.sessionStorage["_examQues"] = JSON.stringify(
              this.allQuesEmpty
            );
            if (this.index < this.allQues.length - 1) {
              this.index++;
            }
          });
      } else {
        this.showToast("请选择答案!");
        // this.$message.error('请选择答案!');
      }
    },
    setTime() {
      // 时间结束自动交卷
      if (!this.setOverTime) {
        this.setOverTime = setInterval(() => {
          if (this.info.overageTime > 0) {
            this.info.overageTime -= 1000;
          } else {
            if (this.isPre == "2") {
              this.submitAll();
            }
          }
        }, 1000);
      }
    },
    initInfo(obj, cookieInfo) {
      let id = cookieInfo.id;
      let arr = [];
      if (window.sessionStorage["_examQues"]) {
        this.allQuesEmpty = JSON.parse(window.sessionStorage["_examQues"]);
      }
      this.id = id;
      let info = obj.data.data;
      this.info = Object.assign({}, info);
      info.questionTopicList.forEach((v, i) => {
        if (v.questionList && v.questionList.length > 0) {
          v.questionList.forEach((vv, ii) => {
            let obj = Object.assign({}, vv);
            obj.typeScore = v.typeScore;
            obj.questionType = v.questionType;
            obj.overageTime = v.overageTime;
            obj.questionScore = v.questionScore;
            obj.quesNum = v.questionList.length;
            obj.answerCopy = vv.answer;
            if (obj.answer) {
              obj.isSubmit = true;
            } else {
              obj.isSubmit = false;
            }
            if (obj.questionType == 2) {
              if (vv.answer) {
                obj.answer = vv.answer.split("");
              } else {
                obj.answer = [];
              }
            }
            obj.order = this.orderStaticData.obj[i + 1];
            obj.isPre = false;
            arr.push(obj);
          });
        }
      });
      if (this.allQuesEmpty.length > 0) {
        this.allQuesEmpty.forEach((v, i) => {
          if (v.answer) {
            arr[i].answerCopy = v.answerCopy;
          }
        });
      }
      this.allQues = [...arr];
      if (this.allQuesEmpty.length == 0) {
        this.allQuesEmpty = [...arr];
      }
      if (cookieInfo.type != "preview") {
        this.setTime();
      }
      //  增加切屏事件
      if (info.cheatChangePageCount > 0 && cookieInfo.type == "exam") {
        window.onblur = () => {
          if (!this.isSubmit && this.$store.state.isExam) {
            this.$api
              .changeExamPage({ num: 1, recordId: this.id })
              .then(obj => {
                let res = obj.data.data;
                if (res.isSafe) {
                  this.tabChange.show = true;
                  this.tabChange.text = `已离开${this.info
                    .cheatChangePageCount - res.safeNum}次，超过${
                    this.info.cheatChangePageCount
                  }次将自动交卷`;
                } else {
                  this.submitAll();
                }
              });
          }
        };
      }
      //增加某个时间不动鼠标自动交卷
      if (info.answerTimeOutNum && cookieInfo.type == "exam") {
        this.addMoveEvent();
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
    examTipRead() {
      let cookieInfo = this.cookieInfo;
      window.localStorage[
        this.userInfo.userId + "_" + this.cookieInfo.b.id + "_isFirst"
      ] = true;
      this.initInfo(cookieInfo.a, cookieInfo.b);
      this.examTipShow = false;
    },
    examTipClose() {
      let cookieInfo = this.cookieInfo;
      this.examTipShow = false;
      this.initInfo(cookieInfo.a, cookieInfo.b);
    },
    init() {
      // 预览考试的情况
      let cookieInfo = {};
      this.$store.dispatch("getCookiesExam").then(obj => {
        cookieInfo = obj;
        switch (cookieInfo.type) {
          case "view":
            this.$api
              .viewExamPage({ examTestBaseId: cookieInfo.id })
              .then(obj => {
                this.isPre = 1;
                obj.data.data.userName = "";
                obj.data.data.cheatChangePageCount = "";
                obj.data.data.answerTimeOutNum = "";
                obj.data.data.testScore = "";
                this.cookieInfo = { a: obj, b: cookieInfo };
                this.isShowExamTip(this.cookieInfo);
                // this.initInfo(obj,cookieInfo);
              })
              .catch(_ => {
                this.isPre = 0;
                this.$router.push({ path: "errorPage/404" });
              });
            break;
          case "exam":
            this.$api
              .newExamPage({ recordId: cookieInfo.id })
              .then(obj => {
                this.isPre = 2;
                this.cookieInfo = { a: obj, b: cookieInfo };
                this.isShowExamTip(this.cookieInfo);
                // this.initInfo(obj,cookieInfo);
              })
              .catch(_ => {
                this.isPre = 0;
                // this.$router.push({path : 'errorPage/404'});
              });
            break;
          case "preview":
            this.$api
              .analyExamPage({
                testNo: cookieInfo.id,
                examTestBaseId: cookieInfo.examId
              })
              .then(obj => {
                this.isPre = 3;
                this.cookieInfo = { a: obj, b: cookieInfo };
                this.isShowExamTip(this.cookieInfo);
                // this.initInfo(obj,cookieInfo);
              })
              .catch(_ => {
                this.isPre = 0;
                this.$router.push({ path: "errorPage/404" });
              });
            break;
        }
      });
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.examWrap {
  width: 100vw;
  height: 100%;
  box-sizing: border-box;
  background: #f4f4f4;
  overflow: hidden;
  .content {
    width: 1200px;
    margin: 36px auto 0;
  }
  .subject {
    margin-top: 18px;
    background: rgba(255, 255, 255, 1);
    display: flex;
    flex-wrap: nowrap;
    box-shadow: 0px 0px 5px 0px rgba(221, 221, 221, 1);
    .right {
      width: 266px;
      height: 100%;
    }
    .left {
      display: inline-block;
      width: calc(100% - 266px);
      height: 100%;
    }
  }
  footer {
    font-size: 12px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 1;
    text-align: center;
    margin: 34px 0 30px;
  }
  .title {
    text-align: center;
    margin: 40px 0;
  }
}
.mask {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  .maskCon {
    color: white;
    width: 420px;
    height: 140px;
    background: rgba(0, 0, 0, 0.5);
    text-align: center;
    line-height: 140px;
    position: absolute;
    top: 50%;
    left: 50%;
    // margin-left: -100px;
    border-radius: 4px;
    transform: translate(-50%, -50%);
  }
}
.errToast {
  color: white;
  padding: 10px 20px;
//   background: #fde2e2;
//   color: #E96F6F;
  background: rgba(0, 0, 0, 0.5);
  text-align: center;
  line-height: 1;
  position: fixed;
  z-index: 1000;
  top: 15%;
  left: 50%;
  // margin-left: -100px;
  border-radius: 4px;
  transform: translate(-50%, -50%);
}
.examTip {
  margin: 1rem auto;
  width: 90%;
  color: $gray_b;
  li {
    list-style: none;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 14px;
    .blue {
      color: $base_blue;
    }
    .circle {
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 1px solid #d1d1d1;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
  .examTipMes {
    height: 30px;
    display: flex;
    align-items: center;
    margin-left: 20px;
    line-height: 30px;
    span {
      display: flex;
      align-items: center;
      margin-left: 20px;
      color: #d1d1d1;
    }
    .status1 {
      i {
        border: 1px solid $gray_b;
      }
      color: $gray_b;
    }
    .status2 {
      i {
        border: 1px solid #2bb2ff;
      }
      color: #2bb2ff;
    }
  }
  .hope {
    text-align: center;
    font-size: 24px;
    margin: 30px auto 0;
  }
}
</style>
