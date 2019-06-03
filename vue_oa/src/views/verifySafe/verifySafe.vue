<template>
  <scrollContent>
    <div class="safeWrap">
      <div class="content">
        <h6 class="conTitle">e代理员工内部管理系统</h6>
        <template v-if="step == '1'">
          <h6 class="title">
            <i class="iconfont icon-weixian"></i>
            {{title}}
          </h6>
        </template>
        <template v-else>
          <h6 class="title1">{{title}}</h6>
        </template>
        <h6 class="btns" v-show="step == 1">
          <span :class="['pointer',{'no-active' : !active}]" @click.stop="active = true">邮箱验证</span>
          <span
            :class="['pointer' ,'phoneBtn' ,{'no-active' : active}]"
            @click.stop="active = false"
          >手机验证</span>
        </h6>
        <div class="input safeForm">
          <el-form ref="form" :model="form" @submit.native.prevent>
            <template v-if="step == 1 && !active">
              <el-form-item size="medium" class="w100 phoneInput">
                <span class="aPhone">{{areacode.obj[form.aPhone]}}</span>
                <el-input
                  class="noBorder padd100"
                  placeholder="请输入手机号"
                  @input="validate('phone')"
                  v-model="form.phone"
                  name="phone"
                >
                  <el-select
                    class="noBorder"
                    v-model="form.aPhone"
                    slot="prepend"
                    placeholder="请选择"
                  >
                    <el-option
                      class="codeOption"
                      v-for="item in areacode.list"
                      :value="item.code"
                      :label="item.name"
                      :key="item.code"
                    >{{item.name}}</el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </template>
            <template v-if="step == 1 && active">
              <el-form-item class="w100">
                <el-input
                  size="medium"
                  placeholder="请输入您的工作邮箱"
                  @input="validate('email')"
                  v-model="form.email"
                  name="email"
                ></el-input>
              </el-form-item>
            </template>
            <template v-if="step == 2 && active">
              <el-form-item class="w100 code">
                <el-input
                  size="medium"
                  placeholder="请输入邮箱验证码"
                  @input="validate('emailCode')"
                  v-model="form.emailCode"
                  name="emailCode"
                ></el-input>
                <span
                  :class="['reSend', 'pointer',{'time' : time}]"
                  @click.stop="sendMsg"
                >{{time ? time+'秒后重发' : '重新发送'}}</span>
              </el-form-item>
            </template>
            <template v-if="step == 2 && !active">
              <el-form-item class="w100 code">
                <el-input
                  size="medium"
                  placeholder="请输入手机验证码"
                  @input="validate('phoneCode')"
                  v-model="form.phoneCode"
                  name="phoneCode"
                ></el-input>
                <span
                  :class="['reSend', 'pointer' ,{'time' : time}]"
                  @click.stop="sendMsg"
                >{{time ? time+'秒后重发' : '重新发送'}}</span>
              </el-form-item>
            </template>
          </el-form>
        </div>
        <span :class="['confirm', 'pointer', {'noActive' : !is_submit}]" @click.stop="submit">确定</span>
      </div>
      <footer>©2018 博恩惠尔信息科技（上海）有限公司 版权所有</footer>
    </div>
  </scrollContent>
</template>



<script>
import scrollContent from "@/components/scrollContent.vue";
import validate from "../../util/validate.js";
export default {
  data() {
    return {
      phone: "",
      aPhone: "0086",
      email: "",
      step: 1,
      time: 0,
      setTime: "",
      active: true,
      is_submit: false,
      phoneCode: "",
      emailCode: "",
      form: {
        aPhone: "0086",
        email: "",
        phoneCode: "",
        emailCode: "",
        phone: ""
      }
    };
  },
  components: { scrollContent },
  watch: {
    active: function() {
      this.$refs["form"].resetFields();
    }
  },
  created() {
    if (window.sessionStorage["verifyPhone"]) {
      this.step = 2;
      this.form.phone = window.sessionStorage["verifyPhone"];
      this.form.aPhone = window.sessionStorage["verifyPhoneCode"];
      this.active = false;
    }
    if (window.sessionStorage["verifyEmail"]) {
      this.step = 2;
      this.form.email = window.sessionStorage["verifyEmail"];
    }
  },
  computed: {
    areacode() {
      return this.$store.state.selectData.areacode;
    },
    title() {
      if (this.step == 1) {
        return "检测到您的账号不在常用地址登录需验证您的个人身份";
      }
      if (this.step == 2) {
        if (!this.active) {
          let arr = this.form.phone.split("");
          arr.splice(3, 4, "****");
          return `请输入手机号为${
            this.areacode.obj[this.form.aPhone]
          }${arr.join().replace(/,/g, "")} 收到的手机验证码`;
        } else {
          let arr = this.form.email.split("");
          let s = this.form.email.indexOf(".") + 1;
          let e = this.form.email.indexOf("@");
          arr.splice(s, e - s, "****");
          return `请输入邮箱号为${arr.join().replace(/,/g, "")} 收到的验证码`;
        }
      }
    }
  },
  methods: {
    timeChange() {
      if (!this.setTime) {
        this.time = 60;
        this.setTime = setInterval(() => {
          this.time--;
          if (this.time == 0) {
            clearInterval(this.setTime);
            this.setTime = "";
          }
        }, 1000);
      }
    },
    sendMsg() {
      if (!this.setTime) {
        if (!this.active) {
          this.$api
            .sendAuthCodeToMobile({
              mobile: this.form.phone,
              mobileInternationalCode: this.form.aPhone
            })
            .then(obj => {
              console.log(obj);
              this.$message({
                type: "success",
                message: "验证发送成功!"
              });
              window.sessionStorage["verifyPhone"] = this.form.phone;
              window.sessionStorage["verifyPhoneCode"] = this.form.aPhone;
              this.next();
            });
        } else {
          this.$api
            .sendAuthCodeToEmail({ email: this.form.email })
            .then(obj => {
              console.log(obj);
              this.$message({
                type: "success",
                message: "验证发送成功!"
              });
              window.sessionStorage["verifyEmail"] = this.form.email;
              this.next();
            });
        }
      }
    },
    validate(type) {
      switch (type) {
        case "phone":
          let p = this.form.aPhone;
          if (p == "00852") {
            validate.validateHKPhone("", this.form[type], v => {
              console.log(v);
              if (v) return (this.is_submit = false);
              this.is_submit = true;
            });
          }
          if (p == "0086") {
            validate.validatePhone("", this.form[type], v => {
              if (v) return (this.is_submit = false);
              this.is_submit = true;
            });
          }
          break;
        case "email":
          validate.validateEmail("", this.form[type], v => {
            if (v) return (this.is_submit = false);
            this.is_submit = true;
          });
          break;
        case "phoneCode":
          if (this.form[type]) {
            this.is_submit = true;
          }
          break;
        case "emailCode":
          if (this.form[type]) {
            this.is_submit = true;
          }
          break;
      }
    },
    removeSess() {
      window.sessionStorage.removeItem("verifyPhone");
      window.sessionStorage.removeItem("verifyPhoneCode");
      window.sessionStorage.removeItem("verifyEmail");
    },
    next() {
      this.step = 2;
      this.timeChange();
      this.is_submit = false;
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.step == 1) {
            this.sendMsg();
          } else {
            if (this.active) {
              console.log("做邮箱验证码验证");
              this.$api
                .checkAuthCodeEmail({
                  authCode: this.form.emailCode,
                  email: this.form.email
                })
                .then(obj => {
                  this.$message({
                    type: "success",
                    message: "验证成功!"
                  });
                  this.$store
                    .dispatch("resetToken", {
                      id: obj.data.data.userId,
                      token: obj.data.data.token
                    })
                    .then(obj => {
                      this.removeSess();
                      this.$router.push({ path: "/home" });
                    });
                });
            } else {
              console.log("做手机验证");
              this.$api
                .checkAuthCodeMobile({
                  authCode: this.form.phoneCode,
                  mobile: this.form.phone,
                  mobileInternationalCode: this.form.aPhone
                })
                .then(obj => {
                  this.$message({
                    type: "success",
                    message: "验证成功!"
                  });
                  this.$store
                    .dispatch("resetToken", {
                      id: obj.data.data.userId,
                      token: obj.data.data.token
                    })
                    .then(obj => {
                      this.removeSess();
                      this.$router.push({ path: "/home" });
                    });
                });
            }
          }
        }
      });
      // console.log(this.$refs);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.safeWrap {
  width: 100%;
  overflow: hidden;
  background: url("/static/imgs/login_Bg.jpg") no-repeat;
  background-size: 100% 100%;
  position: relative;
  height: 100vh;
  min-height: 975px;
}
footer {
  text-align: center;
  position: absolute;
  bottom: 30px;
  left: 0;
  width: 100%;
  height: 15px;
  font-size: 14px;
  font-weight: 400;
  color: #b8c8d3;
}
.content {
  width: 1002px;
  height: 421px;
  position: absolute;
  // top: 20%;
  top: 238px;
  left: 50%;
  box-sizing: border-box;
  border: 10px solid #497491;
  margin-left: -501px;
  background: rgba(0, 0, 0, 0);
  .conTitle {
    height: 34px;
    font-size: 18px;
    font-family:"Microsoft YaHei";
    font-weight: 400;
    color: #d2dce5;
    line-height: 34px;
    text-align: right;
    top: -44px;
    position: absolute;
    right: -10px;
  }
  .title {
    height: 17px;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    color: #0698d8;
    margin-top: 67px;
  }
  .title1 {
    text-align: center;
    font-size: 18px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    margin: 100px 0 50px;
  }
  .icon-weixian {
    margin-right: 10px;
  }
}
.el-form {
  text-align: center;
}
.el-form-item {
  display: block;
  margin: 0 auto;
  .el-input__inner {
    border-radius: 0 !important;
  }
}
.w100 {
  width: 280px;
}
.phoneInput {
  width: 280px;
}
.aPhone {
  position: absolute;
  padding: 3px 10px;
  width: 56px;
  box-sizing: border-box;
  display: flex;
  left: 0;
  height: 40px;
  z-index: 5;
  align-items: center;
  top: 0;
  background: rgba(0, 0, 0, 0);
  border: 1px solid #90aabd;
  border-right: none;
  color: white;
  box-sizing: border-box;
}
.content {
  text-align: center;
  .input {
    height: 40px;
  }
}
.btns {
  margin-top: 60px;
  margin-bottom: 20px;
  padding-top: 0;
  text-align: center;
  span {
    display: inline-block;
    font-size: 18px;
    font-weight: bold;
    line-height: 38px;
    color: white;
    background: none;
  }
  .no-active {
    color: #d2dce5;
  }
  .phoneBtn {
    margin-left: 33px;
  }
}
.input {
  .el-select {
    width: 30px;
  }
}
.confirm {
  display: inline-block;
  width: 280px;
  height: 40px;
  background: $base_blue;
  line-height: 40px;
  color: white;
  margin-top: 37px;
}
.noActive {
  background: #cccccc;
}
.reSend {
  display: inline-block;
  width: 90px;
  text-align: center;
  position: absolute;
  right: 0;
  line-height: 24px;
  font-size: 14px;
  top: 8px;
  color: #bfc6d0;
  height: 24px;
  border-left: 1px solid #4a6c89;
}
.time {
  color: #5d86a9;
}
</style>