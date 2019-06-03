<template>
  <div class="con-window" @click.stop="close1">
    <ul class="content">
      <li class="btns">
        {{type ? '邀请医生' : '邀请会员'}}
      </li>
      <li class="info">
        <img v-img="head" alt="">
        <div>
          <h6><span>{{docInfo.name}}</span></h6>
          <h6>{{docInfo.hospital}}</h6>
        </div>
        <button class="choose" v-show="!type" @click.stop="choose">领取物料</button>
      </li>
      <template v-if="!type">
        <img src="" v-img="QRcode" alt="" class="QRcode">
        <li class="mes-tip">患者使用微信扫此二维码即可加入您的个人工作室</li>
        <button  type="button" name="button" class="share" @click.stop="close">发送名片</button>
      </template>
      <template v-else>
        <img src="" v-img="qr"  alt="" class="QRcode">
        <li class="mes-tip">医生使用微信扫此二维码即可免费开通个人工作室</li>
        <button  type="button" name="button" class="share" @click.stop="close">发送邀请链接给医生</button>
      </template>
    </ul>
  </div>
</template>
<script>
export default{
  name : 'shareWindow',
  props :['type'],
  data(){return{
     share : true
  }},
  methods : {
        choose(){
          this.$router.push({path : `/${this.docInfo.account}/sharenoAcccollectMaterial`});
        },
        close (){
          this.$store.dispatch('wxShowShare');
              if(!this.type){
                let title;
                if(this.docInfo.hm_title){
                  title = `我向您隆重推荐${this.docInfo.hm_title}，请关注智呼吸平台`
                }else{
                  // title = `我是${this.docInfo.name}医生，请关注智呼吸平台`
                  title = `我是${this.docInfo.name}医生，诚挚邀请您加入我的医生工作室`
                }
              this.$store.dispatch('wxShareTimeLineT',{
                title : title,
                link : `${DOCSTATICLINK}/index.html#/${this.docInfo.account}/share`
              }).then(_=>{
                this.$store.state.sShow = false;
              });
              this.$store.dispatch('wxShareAppMessageT',{
                title : title,
                desc : '加入医生工作室，您可获得在线预约、图文在咨询、知识科普的专业化服务',
                link : `${DOCSTATICLINK}/index.html#/${this.docInfo.account}/share`
              }).then(_=>{
                this.$store.state.sShow = false;
              });
            }else{
              let title;
              if(this.docInfo.hm_title){
                title = `我向您隆重推荐${this.docInfo.hm_title}，请关注智呼吸医生平台`
              }else{
                // title = `我是${this.docInfo.name}医生，请关注智呼吸医生平台`
                title = `我是${this.docInfo.name}医生，隆重邀请您加入智呼吸平台`
              }
              this.$store.dispatch('wxShareTimeLineT',{
                title : title,
                link : `${DOCSTATICLINK}/index.html#/${this.docInfo.account}/inviteDoctor2`
              }).then(_=>{
                this.$store.state.sShow = false;
              });
              this.$store.dispatch('wxShareAppMessageT',{
                title : title,
                desc : '加入智呼吸咨询平台免费开通您的个人工作室',
                link : `${DOCSTATICLINK}/index.html#/${this.docInfo.account}/inviteDoctor2`
              }).then(_=>{
                this.$store.state.sShow = false;
              });
            }
          this.$emit('close');
          this.$emit('sClose');
        },
        close1(){
          this.$emit('close');
        }
  },
  computed : {

      QRcode () {
          if(this.$store.getters.docAcc){
            return `${DOCLINKAPI}/doctor/profileQRcode/${this.$store.getters.docAcc}`;
          }
      },
      head (){
          if(this.$store.getters.docAcc){
            return `${DOCLINKAPI}/doctor/face/${this.$store.getters.docAcc}`;
          }else{
              return "";
          }
      },
      docInfo (){
        return this.$store.state.docInfo;
      },
      qr(){
          if(this.$store.getters.docAcc){
            return `${DOCLINKAPI}/doctor/platformInviteQRcode/${this.$store.getters.docAcc}`;
          }
      },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../assets/css/common";
  .con-window {
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    width:100%;
    height:100%;
    overflow: hidden;
    background: rgba(0, 0, 0, .7);
    display: flex
  }
.con-window .content {
    width: 6.60rem;
    /*height: 8rem;*/
    background: #fff;
    margin: auto;
    border-radius: 0.18rem;
    position: relative;
    overflow: hidden;
    .btns{
      height: 0.8rem;
      border-bottom: 1px solid $gray;
      font-size: 0.3rem;
      text-align: center;
      color: white;
      font-size: 0.4rem;
      line-height: 0.8rem;
      background: $baseBlue;
    }
   .info{
     padding-left: 0.45rem;
     margin-top: 0.34rem;
     display: flex;
     justify-content: flex-start;
     align-items: center;
     position:relative;

     .choose{
      font-size:.24rem;
      color:$baseBlue;
      border:1px solid $baseBlue;
      border-radius:.06rem;
      background:#fff;
      line-height:.4rem;
      width:1.15rem;
      position:absolute;
      top: 0;
      right:.4rem;
     }
     img{
       display: inline-block;
       width: 1rem;
       height: 1rem;
       border-radius: 50%;
     }
     div{
      font-size: 0.26rem;
       margin-left: 0.4rem;
     }
     h6{
       display: block;
     }
     h6:nth-of-type(1){
       color: $fGray;
       span{
         color: black;
         font-size: 0.3rem;
         font-weight: bolder;
         margin-right: 0.2rem;
       }
     }
     h6:nth-of-type(2){
       margin-top: 0.1rem;
     }
   }
    .QRcode{
      display: block;
      width: 3.4rem;
      height: 3.4rem;
      /*margin: 0.4rem auto 0.26rem;*/
      margin: auto;
    }
    .mes-tip{
      padding: 0 1.1rem;
      font-size: 0.26rem;
      text-align: center;
    }
    .share{
      display: block;
      width: 4rem;
      height: 0.74rem;
      background: $baseBlue;
      color: white;
      font-size: 0.32rem;
      border-radius: 0.37rem;
      margin: 0.44rem auto 0.66rem;
      /*margin-top: 0.44rem;*/
    }
  }
</style>
