<template>
 <scrollContent>
  <div class="safeWrap activatingEmail">
    <div class="content">
      <h6 class="conTitle">e代理员工内部管理系统</h6>
        <h6 class="title1">
          请为您的账号{{info.email}}设置登录密码，完成激活
        </h6>
      <div class="input safeForm">
        <el-form ref="form" :rules="rules" :model="form" >
            <el-form-item class="w100" prop="pass1">
              <el-input size="medium"  placeholder="密码" type="password" v-model="form.pass1"></el-input>
            </el-form-item><el-form-item class="w100 pass2" prop="pass2">
              <el-input size="medium" type="password"  placeholder="确认密码" v-model="form.pass2" ></el-input>
            </el-form-item>
        </el-form>
      </div>
      <span :class="['confirm', 'pointer']" @click.stop="submit">激活</span>
    </div>
    <footer>©2018 博恩惠尔信息科技（上海）有限公司 版权所有</footer>
  </div>
 </scrollContent>

</template>



<script>
import scrollContent from "@/components/scrollContent.vue";
import validate from "../../util/validate.js";
import {md5} from '../../util/md5.js'
export default {
  data() {
    return {
      form: {
        pass1: "",
        pass2: "",
        userId: ""
      },
      info : '',
      title: "请为您的账号 设置登录密码，完成激活",
      rules: {
        pass1: [
          { required: true, message: "密码必填", trigger: "change" },
          {pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/, message: '请输入6-20位数字和字母或特殊符号的组合',trigger:'change' }
        ],
        pass2: [
          { required: true, message: "密码必填", trigger: "change" },
          {pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/, message: '请输入6-20位数字和字母或特殊符号的组合',trigger:'change' }
        ],
      }
    };
  },
  components: { scrollContent },
  created() {
    let code = this.$router.history.current.query.code;
    let userId = '';
    if(code){
      userId = code.split('-')[0];
      this.$api.authActiveEmail({code : code}).then(obj=>{
        this.info = obj.data.data;
        if(this.info.status == 2){
          this.$router.push({name : 'invalid'});
          window.sessionStorage['userId'] = userId;
        }else if(this.info.status == 3){
          this.$router.push({name : 'login'});
        }
      }).catch(()=>{
          this.$router.push({name : 'invalid'});
          window.sessionStorage['userId'] = userId;
      })
    }else{
      this.$message.error('邮箱验证失败，参数错误!');
    }
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            this.$api.authActiveSetPwd({pass1 : md5(this.form.pass1)  , pass2 : md5(this.form.pass2) , userId : this.info.userId }).then(obj=>{
              this.$message.success('激活成功!');
              this.$store.dispatch('resetToken',{id : obj.data.data.userId, token : obj.data.data.token}).then(obj=>{  
               this.$router.push({ path: '/home' })
              })
            })
        }
      });
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
  top: 238px;
  //   top: 20%;
  left: 50%;
  box-sizing: border-box;
  border: 10px solid #497491;
  margin-left: -501px;
  background: rgba(0, 0, 0, 0);
  .conTitle {
    height: 34px;
    font-size: 18px;
    font-family: "Microsoft YaHei";
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
    margin: 90px 0 40px;
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
.pass2 {
  margin-top: 20px;
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
  margin-top: 36px;
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