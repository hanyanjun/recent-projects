<template>
 <div class="examList">
    <div class="head">
        <span class="title">在线考试</span>
        <span class="rightStatus">{{userInfo.name}} <img src="../../commons/imgs/h5_out.png" alt="" @click.stop="backLogin = true"></span>
    </div>
    <div class="listCon">
        <div class="tabs">
            <span :class="['item',{'activeItem' : type == 1}]" @click.stop="changeStatus('1')">未考试 <span :class="['line',{'active' : type == 1}]" ></span></span>
            <span :class="['item',{'activeItem' : type == 2}]"  @click.stop="changeStatus('2')">已考试 <span :class="['line',{'active' : type == 2}]" ></span></span>
        </div>
        <empty :visible="arr.length == 0" :text="type == 1 ?   '同学，介里还木有你滴考试安排哦～' : '同学，介里还木有你滴考试记录哦～'"></empty>
        <div class="infoCon loadWrapper" v-show="arr.length != 0">
       <loading-more :pulldownRefresh="isDown" @pulldown="refresh" :data="arr"  :downTip="downTip"   :upTip="upTip"   :pullupLoad="isUp" @pullup="loaded"  >
            <div :class="['defaultCon' , {'defaultEmpty' : arr.length == 0}  ]">
                <div class="model" v-for="(item,index) in arr" :key="index" v-if="item">
                <div class="title"><span class="text">{{item.examName}}</span>
                    <template v-if="item.testStatus == '0'">
                        <span class="status status1">未开考</span>
                    </template>
                    <template v-else-if="item.testStatus == '1'">
                        <span class="status status1">考试中</span>
                    </template>
                    <template v-else-if="item.testStatus == '2' && type == '1'">
                        <span class="status status1 status2">缺考</span>
                    </template>
                    <template v-if="item.isQualified == 'Y'">
                        <span class="sstatus">及格</span>
                    </template>
                    <template v-else-if="item.isQualified == 'N'">
                        <span class="sstatus sstatus1">不及格</span>
                    </template>
                </div>
                <div class="info">
                    <span class="type">参考时间</span>
                    <span class="time">{{item.examStartTime}} 至 {{item.examEndTime}}</span>
                </div>
                <div class="info">
                    <span class="type">答卷时长</span>
                    <span class="time">{{item.examDuration}}分钟</span>
                </div>
                <div class="info" v-if="type == 2">
                    <span class="type">考试成绩</span>
                    <span class="time">{{item.testScore || 0}}</span>
                </div>
                <button :class="['exam', {'examActive' : item.testStatus == '1'}]" v-show="item.testStatus != '2' && type == '1' && item.testStatus"  @click.stop="exam(item)">{{item.isJoin == 1 ? '继续考试' : '参加考试'}}</button>
            </div>
            </div>
       </loading-more>
        </div>
    </div>
    <!-- 退出登录 -->
    <div class="mask" v-show="backLogin">
        <div class="confirmCon">
            <h6 class="title1">提示</h6>
            <h6 class="title2">确认是否退出？</h6>
            <div class="confrimBtns">
                <button class="cancle" @click.stop="backLogin = false">取消</button>
                <button class="confirm" @click.stop="backLoginClick">确认</button>
            </div>
        </div>
    </div>
     
 </div>   
</template>

<script>
import loadingMore from "../../componentsh5/loadingMore";
import empty from "../../componentsh5/empty";
export default {
  name: "examlisth5",
  components: { loadingMore , empty },
  data() {
    return {
      arr: [''],
      isTip: false,
      params: {
        pageNum: 1,
        pageSize: 10
      },
      type: "1",
      hasMore: false,
      isUp: true,
      isDown: true,
      downTip: false,

      upTip: false,
      initUp : true,
      backLogin: false

    };
  },
  created() {
    this.load(true, true);
  },
  computed: {
    userInfo() {
      return this.$store.state.headInfo;
    }
  },
  methods: {
    backLoginClick() {
      this.$api.loginout().then(res => {
        this.backLogin = false
        this.$store.dispatch("clearAllInfo");
        this.$router.push({ name: "loginh5" });
      });
    },
    changeStatus(v) {
      if (this.type == v) return;
      this.type = v;
      this.downTip = false;
      this.isDown = true;
      if(this.initUp){
        this.isUp = true;
      }
      this.upTip = false;
      this.arr[''];
      this.params = { pageNum: 1, pageSize: 10 };
      this.load(true, true);
    },
    refresh(v) {
      if (v) {
        this.params = { pageNum: 1, pageSize: 10 };
        this.load(true, true);
      }
    },
    loaded(v) {
      if (v) {
        this.params.pageNum++;
        this.load(true);
      }
    },
    exam(item){
        if(item.testStatus == 1){
            this.$store.dispatch('setCookiesExam',{id : item.recordId, type : 'exam' });
            this.$router.push({name : 'examh5'});
            window.sessionStorage['examInfo'] = JSON.stringify(item);
        }
    },
    load(v, clear) {
      if (v) {
        if (this.type == "1") {
          this.$api.getNotOverExamList(this.params).then(obj => {
            if (clear) {  
              this.arr[''];
              this.arr = [...obj.data.data.list];
              this.upTip = false;
              if(obj.data.data.list.length < 4){
                  this.initUp = false;
                  this.isUp = false;
              }else{
                  this.initUp = true;
                  this.isUp = true;
              }
            } else {
              this.arr = [...this.arr, ...obj.data.data.list];
              if (obj.data.data.list.length == 0) {
                this.upTip = true;
                this.isUp = false;
              }
            }
          });
        } else {
          this.$api.getOverExamList(this.params).then(obj => {
            if (clear) {
              this.arr[''];
              this.arr = [...obj.data.data.list];
              this.upTip = false;
            //   如果数目小于4 默认不开启上拉加载
              if(obj.data.data.list.length < 4){
                  this.initUp = false;
                  this.isUp = false;
              }else{
                  this.initUp = true;
                  this.isUp = true;
              }
            } else {
              this.arr = [...this.arr, ...obj.data.data.list];
              if (obj.data.data.list.length == 0) {
                this.upTip = true;
                this.isUp = false;
              }
            }
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.examList {
  width: 100%;
  height: 100%;
  line-height: 0;
  background: #f4f6f8;
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
      line-height: 1;
      padding-right: 0.5rem;
      right: 0.38rem;
      top: 50%;
      margin-top: -0.14rem;
      img {
        display: inline-block;
        width: 0.34rem;
        height: 0.34rem;
        position: absolute;
        right: 0;
        top: -0.03rem;
      }
    }
  }
  .listCon {
    width: 100%;
    height: calc(100% - 1rem);
    .tabs {
      width: 100%;
      height: 0.88rem;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 5px 5px 0px rgba(38, 142, 249, 0.16);
      border-radius: 4px;
      z-index: 10;
      display: flex;
      flex-wrap: nowrap;
      .item {
        display: inline-block;
        width: 50%;
        line-height: 0.88rem;
        font-size: 0.3rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: $gray_a;
        text-align: center;
        position: relative;
        .line{
          position: absolute;
          display: inline-block;
          width: 0;
          height: 2px;
          background: #259afb;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
        .active{
          width: 100%;
          transition: width 0.2s linear;
        }
      }
      .activeItem{
        color: #259afb;
        font-weight: bold
      }
      // .active {
      //   border-bottom: 2px solid #259afb;
      //   color: #259afb;
      // }
    }
  }
  .infoCon {
    height: calc(100% - 0.88rem);
    overflow: hidden;
    padding: 1px 0.2rem;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    .model {
      width: 100%;
      margin-top: 0.3rem;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 5px 5px 0px rgba(38, 142, 249, 0.16);
      border-radius: 4px;
      padding: 0 0.25rem 0.3rem;
      box-sizing: border-box;
      .title {
        width: 100%;
        height: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #dfdfdf;
        margin-bottom: 0.3rem;
        span {
          display: inline-block;
        }
        .text {
          // width: 4.55rem;
          width: 70%;
          font-size: 0.3rem;
          line-height: 1rem;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: rgba(51, 51, 51, 1);
        }
        .status {
          font-size: 0.28rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(37, 154, 251, 1);
          line-height: 1;
        }
        .status1 {
          color: #ffa646;
        }
        .status2 {
          color: $gray_d1;
        }
        .sstatus {
          padding-right: 0.55rem;
          background: url("../../commons/imgs/h5_exam_1.png") right top
            no-repeat;
          background-size: 0.44rem 0.3rem;
          font-size: 0.24rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(37, 154, 251, 1);
          height: 0.3rem;
          line-height: 0.3rem;
        }
        .sstatus1 {
          padding-right: 0.55rem;
          background: url("../../commons/imgs/h5_exam_2.png") right top
            no-repeat;
          background-size: 0.44rem 0.3rem;
          color: #e96f6f;
        }
      }
      .info {
        margin-top: 0.2rem;
        display: flex;
        justify-content: space-between;

        line-height: 1;
        font-size: 0.24rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
      .exam {
        display: inline-block;
        width: 100%;
        height: 0.88rem;
        background: rgba(223, 223, 223, 1);
        border: 1px solid rgba(153, 153, 153, 1);
        border-radius: 0.04rem;
        font-size: 0.34rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        line-height: 0.88rem;
        color: rgba(204, 204, 204, 1);
        margin-top: 0.6rem;
      }
      .examActive {
        background: rgba(37, 154, 251, 1);
        border: 1px solid rgba(223, 223, 223, 1);
        color: white;
      }
    }
  }
  .defaultCon{
    min-height: calc(100vh - 1.875rem);
  }
  .defaultEmpty{
      min-height: none;
  }
  .mask {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 0;
    top: 0;
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
}
</style>
