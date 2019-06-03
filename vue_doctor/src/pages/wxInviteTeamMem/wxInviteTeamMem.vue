<template>
<div class="share-content">
  <template v-if="link == true">
    <div class="head">
    <h6>智呼吸平台</h6>
    <h6>儿童咳喘和过敏专业平台</h6>
    </div>
    <div class="content">
    <div class="info">
    <img src="" v-img="info.face" alt="">
    <h6 class="name">{{info.name}}</h6><h6 class="other">{{info.technical}}</h6>
    </div>
    <h6 class="title">诚挚邀请您加入我创建的专家团队</h6>
    <p class="text">加入专家团队，以团队形式提供咨询服务有助于提升专<br>&nbsp;&nbsp;&nbsp;业能力、团队品牌推广、形象升华，形成专家有机合作。</p>
    <img src=""  alt=""  class="qrcode"  id="qrcode">
    <h6 class="tip">使用微信扫此二维码加入专家团队</h6>
    <p class="blue">因您的加入，专家团队更有吸引力</p>
    </div>
  </template>
  <template v-else-if="link == false">
    <div class="nolink">
      <i class="icon-verify-fail"></i>
      <h6>该邀请链接已失效</h6>
      <button @click.stop="close">关闭</button>
    </div>
  </template>
</div>
</template>
<script>
import axios from 'axios'
export default {
    name: "wxInviteTeamMem",
    created(){
      this.$store.commit('UPDATE_LOADING',true);
      this.$store.commit('UPDATE_NAV',{fShow : false,hShow : false});
    },
    methods:{
      qr(v){
        this.$nextTick(_=>{
          var qrcode =  new QRCode(document.getElementById("qrcode"),{
            width : 200,//设置宽高
            height : 200
          });
          qrcode.makeCode(v);
        })
      },
      close(){
        wx.closeWindow();
      }
    },
    data(){return{info : {}, code : '', link : '' }},
    mounted(){
      this.$store.dispatch('wxShowShare');
      let acc = this.$route.params.acc;
      let id = this.$route.params.id;
      this.link = true;
      this.$store.commit('UPDATE_LOADING',true)
      axios.get(`${DOCLINKAPI}/doctor/share/${acc}`).then(obj=>{
        this.info = obj.data.info;
        this.link = true;
        this.$store.commit('UPDATE_LOADING',true);
        this.$api.teamTmpQrcode(id,window.localStorage[`teamTag_${acc}_${id}`]).then(obj=>{
          this.$store.commit('UPDATE_LOADING',false);
          this.link = true;
          window.localStorage[`teamTag_${acc}_${id}`] = obj.team_tag;
          this.qr(obj.qrcode);
        }).catch(_=>{
          this.$store.commit('UPDATE_LOADING',false);
          this.link = false;
        })
      });
      axios.get(`${DOCLINKAPI}/team/teamInfo/${id}`).then(obj=>{
        this.$store.dispatch('setDocTitle',obj.data.team.title);
      });
    },
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.share-content{
  line-height: 0;
  padding-top: 1px;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  height: 100%;
  overflow: scroll;
  .head{
    padding-top: 1px;
    color: white;
    height: 3.2rem;
    text-align: center;
    background: url("../../assets/media/img/team-green-bg.png") no-repeat left top;
    background-size: 100% 3.2rem;
    h6:nth-child(1){
      font-size: 0.38rem;
      margin-top: 0.4rem;
      line-height: 0.58rem;
    }h6:nth-child(2){
       font-size: 0.34rem;
       line-height: 0.54rem;
     }
  }
  .content{
    position: absolute;
    top: 1.8rem;
    width: 7rem;
    height: 9.47rem;
    padding: 0.05rem 0.1rem 0.85rem;
    box-sizing: border-box;
    left: 50%;
    transform: translateX(-51%);
    background: url("../../assets/media/img/inviteTeamMemBg.png") no-repeat left top;
    background-size: 102% 8.62rem;
    text-align: center;
    .info{
      height: 1.76rem;
      border-bottom: 1px solid $gray_e;
      margin-left: 0.1rem;
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-wrap: wrap;
      align-content: center;
      padding: 0.25rem 0 0.25rem 1.94rem;
      img{
        display: inline-block;
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;
        position: absolute;
        left: 0.37rem;
        bottom: 0.25rem;
        background: $gray_d_c;
      }
      .name{
        font-size: 0.32rem;
        color: $gray_a;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 0.52rem;
        text-align: left;
      }
      .other{
        font-size: 0.28rem;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: $gray_b;
        text-align: left;
        line-height: 0.48rem;
      }
    }
  }
  .title{
    font-size: 0.28rem;
    color: $gray_a;
    margin-top: 0.08rem;
    line-height: 0.72rem;
  }
  .text{
    font-size: 0.24rem;
    color: $gray_b;
    line-height: 0.32rem;
  }
  .qrcode{
    display: inline-block;
    width: 3.5rem;
    height: 3.5rem;
    margin:0.42rem auto;
    img{
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
  .tip{
    font-size: 0.26rem;
    color: $gray_b;
    text-align: center;
    line-height: 0.62rem;
  }
  .blue{
    font-size: 0.26rem;
    color: $baseBlue;
    position: absolute;
    bottom: 0;
    display: inline-block;
    width: 100%;
    text-align: center;
    line-height: 0.3rem;
    left: 0;
  }
  .nolink{
    background: white;
    width: 100%;
    height: 100%;
    text-align: center;
    i{
      display: inline-block;
      font-size: 0.8rem;
      margin-top: 2.5rem;
    }
    h6{
      font-size: 0.32rem;
      margin-top: 0.53rem;
      line-height: 0.73rem;
    }
    button{
      color: white;
      display: inline-block;
      margin-top: 2.5rem;
      width: 2rem;
      height: 0.7rem;
      border-radius: 0.06rem;
      font-size: 0.32rem;
      line-height: 0.7rem;
      background: $baseBlue;
    }
  }
}
</style>
