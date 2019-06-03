<template>
  <div class="container">
    <div class="head">
      <i class="icon-return-boldleft" @click.stop="back" v-show="origin != 'app'"></i>
      <img :src="info.face" alt="" class="headImg">
      <span class="name">
        {{info.name}}
        <!--<span class="level">{{info.technical}}</span>-->
      </span>
      <section class="info">
          <!--<span class="type">{{info.department}}</span>-->
          <span class="hospital">{{info.hospital}}</span>
      </section>
    </div>
    <div class="head-fn" v-show="origin != 'app'">
      <span>想要更多人关注工作室?</span>
      <button type="button" name="button" class="attentStatus" @click.stop="share">邀请关注</button>
    </div>
    <section :class="['modules']">
      <div><i class="icon-docHome-skill2"></i><span>擅长</span></div>
      <p :class="{'p-active':skillClass}">{{origin}}{{info.skill ? info.skill : '未填写'}}</p>
      <span :class="['icon-return-boldleft','arrow',{'arrow-active':skillClass}]"   @click.stop="skillClass = skillClass ? false : true"></span>
    </section>
    <ul class="fn">
      <a href="javascript:;"  @click.stop="is_skip('/workServiceSet')" >
        <li class="line-ask">
          <i class="bg icon-myHome-consult"><i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i><i class="path5"></i></i>
          <span class="text1">图文咨询</span>
          <span class="text2">({{info.chat_switch == '2' ||　info.family_switch == '2' ? '已开通' : '未开通'}})</span>
        </li></a>
      <a href="javascript:;" v-todo>
        <li class="phone-ask">
          <span class="bg"></span>
          <span class="text1">电话咨询</span>
          <span class="text2">(开发中)</span>
        </li></a>
      <a  href="javascript:;" @click.stop="is_skip('/appointmentSet')" >
        <li class="serive">
          <i class="bg icon-home-appoint" >
            <i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i><i class="path5"></i><i class="path6"></i><i class="path6"></i><i class="path7"></i>
        </i>
          <span class="text1">门诊预约</span>
          <span class="text2">({{info.appoint_switch == '2' ? '已开通' : '未开通'}})</span>
        </li></a>
    </ul>
    <section :class="['modules']">
      <div><i class="icon-my-area"></i><span>执业地点</span></div>
      <p v-html="hospital" :class="{'p-active' : areaClass}">
      </p>
      <span :class="['icon-return-boldleft','arrow',{'arrow-active':areaClass}]"  @click.stop="areaClass = areaClass ? false : true"></span>
    </section>
    <order-chat></order-chat>
    <section :class="['modules']" v-show="info.account == '109031'">
      <div><i class="icon-myhome-scienceing"></i><span>专家科普</span></div>
      <p :class="{'p-active' : hopeClass}">宜呼吸工作室是侯伟医生建立的宣传正确的疾病防治知 识的平台，在这里您能够了解儿童哮喘防治的最新情况</p>
      <a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzA3NDM1NjIxMQ==&scene=124#wechat_redirect" class="more">查看更多</a>
    </section>
    <section :class="['modules']">
      <div><i class="icon-docHome-intro"></i><span>医生简介</span></div>
      <p :class="{'p-active' : introClass}">{{info.abstract ? info.abstract : '未填写'}}</p>
      <span :class="['icon-return-boldleft','arrow',{'arrow-active':introClass}]"  @click.stop="introClass = introClass ? false : true"></span>
    </section>
    <section :class="['modules']">
      <div><i class="icon-docHome-hope"></i><span>医生寄语</span></div>
      <p :class="{'p-active' : hopeClass}">{{info.hope ? info.hope : '未填写'}}</p>
      <span :class="['icon-return-boldleft','arrow',{'arrow-active':hopeClass}]"  @click.stop="hopeClass = hopeClass ? false : true"></span>
    </section>
    <div class="share-window" v-show="sShow" @click.stop="share">
      <img src="../../assets/media/img/share-bg.png" alt="">
    </div>
  </div>
</template>

<script>
  import orderChat from '../../components/orderChat'
  import {Toast} from '../../components/hw-components'
export default{
    name : 'myHome',
    components : {orderChat},
    data(){return{
        skillClass : false,
        introClass : false,
        hopeClass : false,
        areaClass : false,
        sShow : false,
        origin : ''
    }},
    created (){
      this.$store.commit('UPDATE_NAV',{title : '',fn : '', router : '/work', fShow : false, hShow : false});
      let origin = this.$route.query.platform_origin;
      if(origin){
        this.origin = origin;
      }
    },
    computed :{
      info(){
          return this.$store.state.docInfo;
      },
      hospital(){
          let h = '';
          if(this.info.hospitals){
            this.info.hospitals.forEach((v,i)=>{
              return  h+= (v.hospital +  '<br>');
            })
          }
          return h;
      }
    },
    methods : {
      is_skip(v){
        if(this.origin != 'app'){
          this.$router.push({path : v});
        }
      },
      share(){
          this.sShow = this.sShow ? false : true;
          this.$store.dispatch('wxShowShare');
          let title;
          if(this.info.hm_title){
            title = `我向您隆重推荐${this.info.hm_title}，请关注智呼吸平台`
          }else{
            title = `我向您隆重推荐${this.info.name}医生，请关注智呼吸平台`
          }
          this.$store.dispatch('wxShareTimeLineT',{
            title : title,
            link : `${DOCSTATICLINK}/index.html#/${this.info.account}/share`
          }).then(_=>{
            this.sShow = false;
          });
          this.$store.dispatch('wxShareAppMessageT',{
            title : title,
            desc : '加入医生工作室，您可获得在线预约、图文在咨询、知识科普的专业化服务',
            link : `${DOCSTATICLINK}/index.html#/${this.info.account}/share`
          }).then(_=>{
            this.sShow = false;
          });
          // this.$store.dispatch('wxShareTimeLine');
          // this.$store.dispatch('wxShareAppMessage');
      },
      back(){
          this.$router.push({path : '/my'});
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .container{
    height: 100%;
    background: rgb(240, 239, 245);
    overflow-y: scroll;
  }
  .container .head{
    width: 100%;
    height:3.4rem;
    position: relative;
    background: linear-gradient(45deg ,#2ac0ff 20%, $baseBlue 100%);
    overflow: hidden;
    i{
      position: absolute;
      left: 0.22rem;
      top:0.22rem;
      color: white;
      font-size: 0.34rem;
    }
    .info{
      width: 6.3rem;
      margin: 0.2rem auto 0;
      color:white;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      font-size: 0.3rem;
      line-height: 0.3rem;
      .type{
        display: inline-block;
        padding-right: 0.36rem;
        border-right: 1px solid white;
        white-space: nowrap;
        /*width:1.6rem;*/
        text-align: left;
      }
      .hospital{
        padding-left: 0.3rem;
      }
    }
  }
  .container .head .headImg{
    display: block;
    width: 1.2rem;
    height: 1.2rem;
    -webkit-boreder-radius: 50%;
    -khtml-border-radius : 50%;
    -moz-border-radius : 50%;
    -ms-border-radius : 50%;
    -o-border-radius : 50%;
      border-radius: 50%;
      margin: .7rem auto 0.22rem;
    border: .06rem solid white;
  }
  .container .head .name{
    display: block;
    font-size: .35rem;
    white-space: nowrap;
    vertical-align: middle;
    line-height: .35rem;
    height: 0.35rem;
    color: white;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .container .head .level{
    font-size: .26rem;
    margin-left: .2rem;
  }
  .container  .head-fn{
    background: white;
    height: .7rem;
    line-height: .7rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: .15rem 0 .1rem 0;
    position: relative;
    padding: 0 0.2rem;
  }
  .container .head-fn span{
    display: inline-block;
    font-size: .32rem;
  }
  .container .head-fn button{
    display: inline-block;
    height: .5rem;
    line-height: .5rem;
    border: 1px solid $baseBlue;
    color: $baseBlue;
    font-size: .3rem;
    text-align: center;
    background: none;
    border-radius: .09rem;
    padding: 0 0.08rem;
  }
  /*关注公众号弹窗*/
  .attentionWeixin{
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.5);
    display: none;
  }
  .attentionWeixin img{
    width: 5.84rem;
    height: 6.63rem;
    display: block;
    margin: 1.9rem auto 0;
  }
  .container .fn{
    padding: .28rem .8rem;
    /*height: 1.8rem;*/
    background: rgb(255, 255, 255);
    margin-top: .2rem;
    display: flex;
    justify-content: space-between;
    line-height: 0;
    span{
      display: block;
      text-align: center;
    }
    .bg{
      display: block;
      width:1.03rem;
      margin: auto;
      height: 1.03rem;
      font-size: 1.03rem;
    }
    .phone-ask .bg{
      background: url(./img/iphone.png);
      background-size: 100% 100%;
    }
    a{
      display: inline-block;
      width: 1.2rem;
    }
    .text1{
      font-size: 0.28rem;
      line-height: 0.6rem;
      color: $fGray;
    }

    .text2{
      font-size: 0.22rem;
      color: $fGray;
      line-height: 0.24rem;
    }
    .line-ask span,
    .serive  span{
      color: black;
    }
  }
  /*home skill hope  intro*/
  .modules{
    /*max-height: 1.56rem;*/
    background: white;
    border-bottom: 0.2rem solid white;
    margin-top: 0.2rem;
    overflow: hidden;
    position: relative;
    line-height: 0;
    div{
      padding: 0 0.3rem;
      height: 0.7rem;
      font-size: 0.32rem;
      line-height: 0.7rem;
      border-bottom: 1px solid $gray;
      display: flex;
      align-items: center;
      text-align: left;
      box-sizing: border-box;
    }
    i{
      font-size: 0.38rem;
      margin-right: 0.2rem;
      /*margin-bottom: 0.02rem;*/
    }
    p{
      color: $fGray;
      max-height: 0.67rem;
      padding: 0 0.3rem;
      margin-top: 0.2rem;
      font-size: 0.28rem;
      line-height: 0.34rem;
      word-break: break-all;
    }
    .p-active{
      max-height: none;
    }
    .arrow{
      display: inline-block;
      position: absolute;
      font-size: 0.3rem;
      top: .25rem;
      right: .23rem;
      transform: rotate(90deg);
      color: $iconGray;
      transform-origin: 50% 50%;
      background-size: contain;
      }
     .more{
       display: inline-block;
       height: 0.7rem;
       line-height: 0.7rem;
       position: absolute;
       top: 0;
       right: 0.4rem;
       color: $baseBlue;
       font-size: 0.28rem;
     }
    .arrow-active{
      transform-origin: 50% 50%;
      transform: rotate(-90deg);
    }
  }
  .modules-active{
    max-height: none;
      height: auto;
  }




  /*分享弹窗*/
  .share-window {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .6);
    top: 0;
    left: 0;
    position: fixed;
    z-index: 20
  }

  .share-window img {
    width: 100%;
    height: 2.44rem
  }

</style>
