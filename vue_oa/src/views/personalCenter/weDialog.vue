<template lang="pug">
#weDialog
  el-dialog(title='绑定微信提醒',v-if='dialogShow',:visible.sync='visibleDialogShow',style='margin:0 auto', :close-on-click-modal='false',width="570px")
    div(v-if='bindTip')
      div.margin70
        i.iconfont.icon-weixindenglu
      div.QRText
        p 您的账号未绑定【e代理官方微信服务号】
        //- p 绑定后可接收审批推送信息及帐号异常提醒服务
      div.bindBtn
        el-button(type='primary', @click="bindcClick", size="medium") 立即绑定
    div.QRCodeDiv(v-if='QRCodeDivShow')
      weQRCode(:QRCodeSrc='QRCodeSrc',:successShow='successShow',:closeShow='closeShow')
    div.bindNo(v-bind:class="{margin57: QRCodeDivShow}")
      el-tooltip(v-if='!successShow',class="item", effect="dark", content="可在个人中心绑定微信", placement="top")
        span(@click.stop='bindNoClick') 暂不绑定
</template>
<script>
import weQRCode from './weQRCode'
export default {
  name:'weDialog',
  components:{weQRCode},
  data(){
    return{
      visibleDialogShow: true,
      bindTip:true,
      QRCodeDivShow: false,
      QRCodeSrc:'',
      successShow:false,
      closeShow:false,
      num: 0
    }
  },
  props:{
    dialogShow:{
      type: Boolean,
      default: false
    }
  },
  watch: {
    visibleDialogShow(val){
      if(!val){
        clearInterval(this.timeOut)
      }
    }
  },
  methods:{
    getWechatBinding(){
      this.$api.getWechatBinding().then(res =>{
        let data = res.data.data
        // 关闭定时器
        if(data.ifBinding == '1'){
          clearInterval(this.timeOut)
          this.successShow = true
          let data = res.data.data
          // 将信息放到session里
          window.sessionStorage['weData'] = JSON.stringify(data)
        }
      })
    },
    bindcClick(){
      this.QRCodeDivShow = true
      this.bindTip = false
      // 获取永久二维码ticket
      this.$api.getQRScene({sceneId:1}).then(res =>{
        this.ticket = res.data.data.ticket
        this.QRCodeSrc = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + this.ticket
        // 开启定时器
        this.timeOutStart()
      })
      
    },
    timeOutStart(){
      this.timeOut= setInterval(() =>{
        // 调取接口 是否扫一扫 二维码
        if(this.num < 10){
          this.getWechatBinding()
          this.num = this.num + 1
        }else{
          clearInterval(this.timeOut)
          // 提示是否继续绑定
          this.num = 0
          this.continueBind2()
        }
      },2000)
    },
    continueBind2 () {
      this.$confirm('是否继续微信绑定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定开始计时器
        this.timeOutStart()
      }).catch(() => {
        // 取消在调取一次
        this.getWechatBinding()
        this.visibleDialogShow = false
      })
    },
    // 暂时不绑定
    bindNoClick(){
      this.visibleDialogShow = false
      clearInterval(this.timeOut)
    }
  }
}
</script>
<style lang="sass" scoped>
#weDialog
  text-align: center
  .margin70
    margin-top: 70px
  .icon-weixindenglu
    font-size: 40px
    color: #00C800
  .QRText
    color: #666666
    font-size: 14px
    margin-top: 47px
    line-height: 22px
  .bindBtn
    margin-top: 74px
    .el-button--medium
      padding: 10px 46px
  .QRCodeDiv
    margin-top: 50px
  .bindNo
    margin-top: 150px
    cursor: pointer
    color: #999999
  .margin57
    margin-top: 57px
</style>

