<template>
 <div class="examResult">
     <div class="head">
         <h6 class="title">考试成绩</h6>
     </div>
     <div class="score">
         <span class="num">{{record.testScore}}</span>分
     </div>
     <h6 class="type">
       <!-- {{record.isQualified == 'Y' ? '及格' : '不及格'}} -->
        <span class="blue" v-if='record.isQualified == "Y"'>及格</span>
        <span class="red" v-else >不及格</span>
     </h6>
     <h6 class="tip">请登录电脑端查看试卷解析</h6>
     <button class="back" @click.stop="back">返回</button>

</div>   
</template>

<script>
export default {
  name: "examResulth5",
  data() {
    return {
      record: {testScore : '' ,isQualified : '' }
    };
  },
  created() {
    let id = this.$route.params.id;
    this.$api.resultExamPage({ recordId: id }).then(obj => {
      this.record.testScore = obj.data.data.testScore || "0";
      this.record.isQualified = obj.data.data.isQualified || "N";
    });
  },
  methods:{
    back(){
      this.$router.push({name : 'examlisth5'})
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.examResult {
  width: 100%;
  height: 100%;
  background: #f4f6f8;
  .head {
    width: 100%;
    height: 4.4rem;
    background: url("../../commons/imgs/h5_examResult.png") left top -0.4rem no-repeat;
    background-size: 100% 4.8rem;
    .title {
      font-size: 0.34rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 0.74rem;
      text-align: center;
    }
  }
  .score {
    width: 2.5rem;
    height: 2.5rem;
    background: rgba(255, 255, 255, 1);
    border: 3px solid rgba(37, 154, 251, 1);
    border-radius: 50%;
    margin: -1.44rem auto 0;
    text-align: center;
    color: rgba(37, 154, 251, 1);
    font-size: 0.3rem;
    .num {
      font-size: 0.6rem;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      line-height: 2.5rem;
    }
  }
  .type {
    font-size: 0.3rem;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    // color: rgba(37, 154, 251, 1);
    line-height: 1;
    margin: 0.4rem auto;
    text-align: center;
    .blue {
      color: rgba(37, 154, 251, 1);
    }
    .red {
      color: #E96F6F;
    }
  }
  .tip {
    font-size: 0.28rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    line-height: 1;
    text-align: center;
  }
  .back {
    display: block;
    width: 7.02rem;
    height: 0.88rem;
    background: rgba(37, 154, 251, 1);
    border-radius: 0.04rem;
    font-size: 0.34rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 0.88rem;
    text-align: center;
    margin: 0.8rem auto 0;
  }
}
</style>
