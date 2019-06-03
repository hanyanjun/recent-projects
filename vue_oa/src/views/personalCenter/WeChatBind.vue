<template lang="pug">
#WeChatBind
  div.weDiv
    div.headimg
      i.iconfont.icon-weixindenglu(v-if='ifBinding == "0" || headimgurl == ""')
      img(v-else,:src='headimgurl')
    div.bindDiv
      p 
        span.colorBlod 微信：
        span.colorBlod(v-if='ifBinding == "1"') {{nickname}}
        span.color666(v-if='ifBinding == "0"') 未绑定
        span.colorpad(v-else) 已绑定
      p 绑定微信后可接收审批推送信息及账号异常提醒
    div.padd20
      el-button(v-if='ifBinding == "0"',type='primary', @click="bindcClick", size="medium") 立即绑定
      el-button.CancelBtn(v-else,type='primary', plain, @click="bindCancel", size="medium") 解除绑定
  div.QRCodeDiv(v-if='QRCodeDivShow')
    weQRCode(:QRCodeSrc='QRCodeSrc',:successShow='successShow',:closeShow='closeShow',@closeClick='closeClick')
  div.messageBox(v-if='messageBoxShow')
    .el-message-box
      .el-message-box__header
        .el-message-box__title
          span 提示
        button.el-message-box__headerbtn(type='button', aria-label='Close',@click.stop='cancelBtn')
          i.el-message-box__close.el-icon-close
      .el-message-box__content
        .el-message-box__status.el-icon-warning
        .el-message-box__message
          p 是否继续微信绑定?
        .el-message-box__input(style='display: none;')
          .el-input 
            input.el-input__inner(type='text', autocomplete='off', placeholder='')
          .el-message-box__errormsg(style='visibility: hidden;')
      .el-message-box__btns
        button.el-button.el-button--default.el-button--small(@click.stop='cancelBtn',type='button')
          span
            | 取消
        button.el-button.el-button--default.el-button--small.el-button--primary(@click.stop='sureBtn',type='button')
          span
            | 确定
    
</template>
<script>
import weQRCode from './weQRCode'
export default {
  name:'WeChatBind',
  components:{weQRCode},
  data(){
    return {
      ifBinding:'0',
      nickname: '',
      headimgurl:'',
      ticket:'',
      QRCodeSrc:'',
      timeOut: null,
      ScanDivShow: false,
      QRCodeDivShow: false,
      successShow: false,
      closeShow: true,
      num:0,
      messageBoxShow:false
    }
  },
  created(){
    // 获取用户绑定微信信息
    let weData = window.sessionStorage['weData']
    weData = JSON.parse(weData)
    // 加载信息
    this.ifBinding = weData.ifBinding
    if(weData.wechatUser !=null){
      // 微信昵称
      let Base64 = require('js-base64').Base64
      this.nickname = Base64.decode(weData.wechatUser.nickname)
      this.headimgurl = weData.wechatUser.headimgurl
    }
  },
  methods:{
    getWechatBinding(){
      this.$api.getWechatBinding().then(res =>{
        let data = res.data.data
        this.ifBinding = data.ifBinding
        // 关闭定时器
        if(this.ifBinding == '1'){
          clearInterval(this.timeOut)
          this.num = 0
          this.successShow = true
        }
        if(data.wechatUser !=null){
          // 微信昵称
          let Base64 = require('js-base64').Base64
          this.nickname = Base64.decode(data.wechatUser.nickname)
          this.headimgurl = data.wechatUser.headimgurl
        }
      })
    },
    bindcClick(){
      clearInterval(this.timeOut)
      this.num = 0
      this.QRCodeDivShow = true
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
        // console.log(this.num)
        if(this.num < 10){
          this.getWechatBinding()
          this.num = this.num + 1
        }else{
          clearInterval(this.timeOut)
          // 提示是否继续绑定
          this.num = 0
          this.continueBind()
        }
      },2000)
    },
    // 是否继续绑定
    continueBind(){
      this.messageBoxShow = true
    },
    sureBtn(){
      // 确定开始计时器
      this.timeOutStart()
      this.messageBoxShow = false
    },
    cancelBtn(){
      // 取消在调取一次
      this.getWechatBinding()
      this.QRCodeDivShow = false
      this.messageBoxShow = false
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
        this.QRCodeDivShow = false
      })
    },
    // 解除绑定
    bindCancel(){
      const h = this.$createElement
      this.$msgbox({
        title:'解除绑定提醒',
        message: h('p', null, [
            h('p', null, '确定要解除微信绑定吗？'),
            // h('p', null, '解除后将无法收到审批通知消息及账号异常提醒')
          ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$api.deleteWechatBinding().then(res =>{
          this.$message.success(res.data.messages)
          this.QRCodeDivShow = false
          this.successShow = false
          this.getWechatBinding()
        })
      }).catch(() => {
      })
    },
    closeClick(){
      this.num = 0
      clearInterval(this.timeOut)
      this.QRCodeDivShow = false
      this.successShow = false
    },
  }
}
</script>

<style lang="sass" scoped>
#WeChatBind
  position: relative
  height: 98%
  border: 1px solid #dcdfe6
  background: #fff
  -moz-box-shadow: 0 0 10px #d9d9d9
  -webkit-box-shadow: 0 0 10px #d9d9d9
  box-shadow: 0 0 10px #d9d9d9
  margin: 20px 0px 20px 10px
  .weDiv
    padding: 47px 0 0 67px
    .headimg img
      height: 40px
      border-radius: 50%
    div
      float: left
      margin-right: 20px
    .padd20
      padding-left: 30px
    .icon-weixindenglu
      font-size: 40px
      color: #00C800
    .bindDiv
      font-size: 14px
      color: #999999
      line-height: 22px
      .colorBlod
        color: #666666
        font-weight: bold
      .colorpad
        color: #666666
        padding-left: 15px
      .color666
        color: #666666
  .messageBox
    position: absolute
    top: -247px
    bottom: 0
    left: 0
    right: 0
    margin: auto
    text-align: center
    width: 424px
    height: 136px
    width: 422px
    height: 134px
    border: 1px solid #dcdfe6
    box-shadow: 0 0 10px #d9d9d9
    border-radius: 4px
  .QRCodeDiv
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    height: 358px
    width: 358px
    clear: both
    margin: auto
    text-align: center
</style>

