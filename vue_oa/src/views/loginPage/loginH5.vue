<template>
 <div class="page">
    <div class="bg">
       <div class="logo">
           <img src="../../commons/imgs/h5_logo.png" alt="">
       </div> 
       <img src="../../commons/imgs/h5_login_text.png" alt="" class="text_img">
    </div>    
    <div class="info">
        <div class="input input1">
            <img src="../../commons/imgs/h5_mem.png" class="pre"  alt="">
            <input type="text" placeholder="请输入手机号" v-model.trim="phone" maxlength="11" @input="input">
            <i class="circle clearPhone" v-show="phone" @click.stop="clearPhone"> 
                <img src="../../commons/imgs/h5_close.png" alt="">
            </i>
            <select name="carlist"  v-model="code">
              <option :value="item.code" :key="index" v-for="(item,index) in areacode.list">{{item.name}}</option>
            </select>
        </div>
        <div class="input">
            <img src="../../commons/imgs/h5_password.png" class="pre pre1"  alt="">
            <input type="password" placeholder="请输入密码" v-model.trim="password" maxlength="20" @input="input">
            <i class="circle" v-show="password" @click.stop="clear"> 
                <img src="../../commons/imgs/h5_close.png" alt="">
            </i>
        </div>
        <button :class="['login',{'active' : isSubmit}]" @click.stop="login">登录</button>
    </div> 
    <img src="../../commons/imgs/h5_login_font.png" class="font" alt=""><span class="company">© 2018 博恩惠尔信息科技（上海）有限公司</span>
 
</div>   
</template>

<script>
import validate from "../../util/validate";
import { md5 } from "../../util/md5.js";
export default {
  name: "loginH5",
  data() {
    return {
      phone: "",
      password: "",
      active: "",
      text: "账号或者密码错误",
      error: true,
      code: "0086",
      isSubmit: false
      // i_h : 0,
      // top : 0,
    };
  },
  created() {},
  mounted() {
    this.$store.state.isExam = false;
  },
  computed: {
    areacode() {
      return this.$store.state.selectData.areacode;
    }
  },
  methods: {
    input() {
      if (
        this.phone &&
        this.password &&
        this.password.length >= 6 &&
        ((new RegExp(validate.regBox.regMobile).test(this.phone) &&
          this.code == "0086") ||
          (this.code == "00852" &&
            new RegExp(validate.regBox.reHKMobile).test(this.phone))) &&
        new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/g).test(
          this.password
        )
      ) {
        this.isSubmit = true;
      } else {
        this.isSubmit = false;
      }
    },
    clear() {
      this.password = "";
      this.input();
    },
    clearPhone() {
      this.phone = "";
      this.input();
    },
    login() {
      this.$api
        .login({
          username: this.phone,
          password: md5(this.password),
          mobileInternationalCode: this.code,
          loginType: 0
        })
        .then(res => {
          if (res.data.code === "200") {
            this.$store
              .dispatch("resetToken", {
                id: res.data.data.userId,
                token: res.data.data.token
              })
              .then(obj => {
                this.$router.push({ path: "/h5/examlist" });
              });
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.page {
  width: 100%;
  height: 100%;
  background: #f4f6f8;
  line-height: 0;
  overflow: scroll;
  position: relative;
  .bg {
    width: 100%;
    height: 5.71rem;
    background: url("../../commons/imgs/h5_login_bg.png") left top no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
  }
  .logo {
    width: 1.65rem;
    height: 1.65rem;
    background: url("../../commons/imgs/h5_logo_bg.png") left top no-repeat;
    background-size: 100% 100%;
    margin: 1.8rem auto 0;
    border: 1px solid rgba(0, 0, 0, 0);
    position: relative;
    img {
      display: block;
      width: 0.73rem;
      height: 0.81rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -0.42rem -0.36rem;
    }
  }
  .text_img {
    display: inline-block;
    width: 3.35rem;
    height: 0.38rem;
    position: absolute;
    top: 3.6rem;
    left: 50%;
    margin-left: -1.67rem;
  }
  .info {
    width: 6.68rem;
    height: 3.81rem;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 10px 10px 0px rgba(38, 142, 249, 0.16);
    border-radius: 4px;
    padding-top: 0.3rem;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    margin: -1.4rem auto 0;
    .input {
      display: flex;
      align-items: center;
      width: 5.9rem;
      height: 0.8rem;
      background: rgba(244, 246, 248, 1);
      border-radius: 4px;
      padding-left: 0.8rem;
      padding-right: 0.7rem;
      box-sizing: border-box;
      margin: 0.2rem auto 0;
      position: relative;
      .pre {
        display: inline-block;
        width: 0.38rem;
        height: 0.38rem;
        position: absolute;
        left: 0.2rem;
        top: 50%;
        margin-top: -0.19rem;
      }
      .pre1 {
        width: 0.28rem;
        height: 0.34rem;
        margin-top: -0.17rem;
        left: 0.26rem;
      }
      .circle {
        display: inline-block;
        width: 0.3rem;
        height: 0.3rem;
        background: #cecece;
        border-radius: 50%;
        position: absolute;
        right: 0.2rem;
        top: 0.25rem;
        img {
          display: block;
          width: 0.15rem;
          height: 0.15rem;
          margin: 0.07rem auto 0;
        }
      }
      .clearPhone{
        margin-right: 1.3rem;
      }
      input {
        display: inline-block;
        width: 100%;
        height: 0.4rem;
        background: rgba(244, 246, 248, 1);
        line-height: 0.4rem;
        font-size: 0.3rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      input::-webkit-input-placeholder {
        font-size: 0.3rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(204, 204, 204, 1);
        line-height: 0.4rem;
      }
      input::-moz-placeholder {
        font-size: 0.3rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(204, 204, 204, 1);
        line-height: 0.4rem;
      }
      input::-ms-input-placeholder {
        font-size: 0.3rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(204, 204, 204, 1);
        line-height: 0.4rem;
      }
      select {
        display: inline-block;
        padding-right: 0.36rem;
        background: url("../../commons/imgs/arrow.png") rgba(244, 246, 248, 1)
          right center no-repeat;
        background-size: 0.2rem 0.1rem;
        text-align: right;
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        font-size: 0.3rem;
        position: absolute;
        right: 0.2rem;
        top: 50%;
        margin-top: -0.15rem;
        color: $gray_a;
      }
      select::-ms-expand {
        display: none;
      }
    }
    .input1 {
      padding-right: 1.3rem;
    }
    .login {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      background: #259afb;
      color: #67b8fc;
      font-size: 0.34rem;
      line-height: 0.88rem;
      text-align: center;
    }
    .active {
      background: #2646f9;
      color: white;
    }
  }
  .font {
    display: block;
    width: 4.64rem;
    height: 0.36rem;
    // position: absolute;
    // bottom: 1.16rem;
    // left: 50%;
    margin: 3rem auto 0.36rem;
    // margin-left: -2.32rem;
  }
  .company {
    display: inline-block;
    width: 100%;
    font-size: 0.24rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    text-align: center;
    line-height: 1;
    // position: absolute;
    // bottom: 0.5rem;
  }
}
</style>
