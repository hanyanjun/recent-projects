<template lang="pug">
  #weQRCode
    //- 二维码
    div.QRCodeDiv(v-if='QRCodeShow',@mouseenter='enter',@mouseleave='leave')
      div.close(v-if='closeShow',@click.stop='closeClick')
        i.iconfont.icon-del
      div.QRCodeContent
        img(:src='QRCodeSrc')
      div.QRText.margin27
        | 微信扫码，完成帐户绑定
    //- 成功
    div.QRCodeDiv(v-if='successShow')
      div.close(v-if='closeShow',@click.stop='closeClick')
        i.iconfont.icon-del
      div.successImg
        img(src='../../commons/imgs/weSuccess.png')
      div.QRText.successText
        | 绑定成功！
      div.QRText
        p 你已成功关注e代理微信服务号，
        p 为了更好的提供服务，请勿取消关注。
    //- 扫一扫
    div.ScanDiv(v-if='ScanDivShow && QRCodeShow')
      img(src='../../commons/imgs/weSao.png')
</template>
<script>
export default {
  name:'weQRCode',
  data(){
    return{
      QRCodeShow: true,//二维码div一直为true
      ScanDivShow:false
    }
  },
  props:{
    // 二维码img
    QRCodeSrc:{
      type: String,
      default: ''
    },
    // 成功后的img
    successShow:{
      type: Boolean,
      default: false
    },
    // 关闭按钮显示
    closeShow:{
      type: Boolean,
      default: false
    }
  },
  watch:{
    successShow(val){
      if(val){
        this.QRCodeShow = false
      }else{
        this.QRCodeShow = true
      }
    }
  },
  methods: {
    closeClick(){
      this.$emit('closeClick')
    },
    // 1.鼠标移入div
    enter(){
      this.ScanDivShow = true
    },
    leave(){
      this.ScanDivShow = false
    }

  }
}
</script>
<style lang="sass" scoped>
#weQRCode
  .QRCodeDiv
    height: 358px
    width: 358px
    border: 1px solid #DCDFE6
    clear: both
    margin: auto
    text-align: center
    border-radius: 5px
    box-shadow: 0px 0px 5px 0px rgba(221,221,221,1)
    .close
      width: 25px
      height: 25px
      background: rgba(0,0,0,1)
      opacity: 0.3
      border-radius: 50%
      right: -14px
      top: -12px
      position: absolute
      cursor: pointer
      .icon-del
        font-size: 14px
        color: #ffffff
      .icon-del:before
        text-align: center
        line-height: 25px
    .QRCodeContent
      width: 244px
      height: 244px
      border: 1px solid #CCCCCC
      margin: 53px auto 0
      img
        height: 244px
        width: 244px
    .successImg
      width: 150px
      height: 157px
      margin: 60px auto 0
    .QRText
      color: #666666
      font-size: 14px
      margin-top: 32px
      padding: 0 60px
    .successText
      color: #10B2FF
      font-size: 18px
    .margin27
      margin-top: 19px
  .ScanDiv
    width: 293px
    height: 348px
    position: absolute
    top: 51%
    left: 50%
    transform: translate(65%,-50%)
</style>


