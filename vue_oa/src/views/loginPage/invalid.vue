<template>
 <scrollContent>
  <div class="safeWrap activatingEmail">
    <div class="content">
      <h6 class="conTitle">e代理员工内部管理系统</h6>
        <img src="../../commons/imgs/invalid.png" class="warn" alt="">
        <span class="t1">激活链接已失效</span>
        <span class="t2">可再次申请，新激活链接将会发送到你的工作邮箱。</span>
      <span :class="['confirm', 'pointer']" @click.stop="submit">再次发送激活码</span>
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
      userId : ''
    };
  },
  components: { scrollContent },
  created() {
     this.userId = window.sessionStorage['userId'];
  },
  methods: {
    submit() {
      if(this.userId){
      this.$api.activeAccountEmail({userId : this.userId}).then(obj=>{
        this.$message.success('激活码发送成功!');
      })
      }else{
        this.$message.error('发送激活码失败，请从邮箱链接从新进入再次发送!');
      }
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
.warn{
    display: block;
    width: 40px;
    height: 35px;
    margin: 108px auto 0;   
}
.t1{
    display: block;
    width:126px;
    height:19px;
    font-size:18px;
    font-family:"Microsoft YaHei";
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:19px;
    margin: 20px auto 0;
}
.t2{
    display: block;
    height:14px;
    font-size:14px;
    font-family:"Microsoft YaHei";
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:14px;
    margin: 20px auto 0;
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

}

.content {
  text-align: center;
}

.confirm {
  display: inline-block;
  width: 280px;
  height: 40px;
  background: $base_blue;
  line-height: 40px;
  color: white;
  margin-top: 40px;
}


</style>