<template>
  <div class="work container">
    <div class="work-header" :data-dh="dh" :style="{background : docInfo.banner_color}">
      <span class="stage f32 ">{{docInfo.hm_title ||  '儿童咳喘和过敏咨询平台'}}</span>
      <img v-img="head"  src="" alt="" :class="['headImg',{'headImg_act' : (/defaultDoctor/g).test(this.head)}]" @click.stop="changeInfo">
      <span class="name f34">
        <span>{{docInfo.sub_title || `${docInfo.name}医生`}}<i :class="certificate">
        <i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i><i class="path5"></i><i class="path6"></i><i class="path7"></i>
      </i></span>
      </span>
      <span class="hospital f24">{{docInfo.hospital}}</span>
    </div>
    <div class="work-fn f26">
      <a class="work-fn-patient" @click.stop="iShow = true; inviteType = false;"><i class="icon-home-invite"></i>邀请会员</a>
      <a href="javascript:;" @click.stop="iShow = true; inviteType = true;" class="group"><i class="icon-invite-doctor"></i>邀请医生</a>
      <router-link  to="/groupNewsHistory">
        <i class="icon-home-group"></i>
        群发消息
      </router-link>
      <router-link to="/sendAppoint" class="message">
        <i class="icon-home-news "></i>停/出诊通知
        <!--<nav v-show="toolShow">-->
          <!--<b></b>-->
          <!--<router-link href="javascript:;" to="/groupNewsHistory"><i class="icon-home-group"></i>群发</router-link>-->
          <!--<router-link to="/sendAppoint"><i class="icon-home-news"></i>发布停\出诊</router-link>-->
          <!--&lt;!&ndash;<a href="javascript:;" v-todo><i class="icon-home-intro-collect"></i>信息采集表</a>&ndash;&gt;-->
          <!--&lt;!&ndash;<a href="javascript:;" v-todo><i class="icon-home-wenzhen"></i>问诊表</a>&ndash;&gt;-->
        <!--</nav>-->
      </router-link>
      <!--<router-link to="/workServiceSet" class="work-fn-service">-->
        <!--<i class="icon-home-service"></i>服务设置</router-link>-->
    </div>
    <div class="message-tip b-1px-t f26">
      <span class="undoIcon"></span>
      <!--<span class="sound"><i class="sound1"></i><i :class="['sound2',{'sound3':arr.length != 1}]"></i></span>-->
      <div class="msgScrollFalse">
        <template v-for="item in arr">
          <span v-show="item.count != 0" @click.stop="skip(item)">
            <i class="f22">{{item.t1}}</i>{{item.t2}}
          </span>
        </template>
        <template v-for="item in arr">
          <span v-show="item.count != 0"  @click.stop="skip(item)">
            <i class="f22">{{item.t1}}</i>{{item.t2}}
          </span>
        </template>
         <template v-show="consultCount == 0 && indentCount == 0 && reportCount == 0 && orderCount == 0">
            您当前还没有待办事项！
         </template>
      </div>
      <!--<button @click.stop="skip" v-show="currentIndex != 0" >点击查看</button>-->
    </div>
    <div class="work-content f26">
      <section>
        <router-link to="/contacts">
          <i class="patient icon-home-patient">
            <span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
            <template v-if="num.report_num > 0">
              <span class="font1" ></span>
            </template>
          <span class="font">我的会员</span>
        </router-link><router-link to="/1/myItConsult">
        <i class="consult icon-home-consult">
          <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span>
          <template v-if="num.inquiry_num > 0 || num.team_num > 0">
            <span class="font1" ></span>
          </template>
          <template v-else>
            <span class="font2"  v-if="docInfo.chat_switch == '1' &&　docInfo.family_switch == '1' && docInfo.long_free_switch != '2'"></span>
          </template>
        </i>
          <span class="font">我的咨询</span>
      </router-link><router-link to="/1/callList">
        <i class="consult icon-home-phone" >
          <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path6"></span><span class="path7"></span>
          <template v-if="num.call_num > 0 ">
            <span class="font1" ></span>
          </template>
          <template v-else>
            <span class="font2"  v-if="docInfo.call_switch == '1'"></span>
          </template>
        </i>
        <span class="font">电话咨询</span>
      </router-link><router-link to="/review/myOrder">
        <i class="consult icon-home-appoint" >
          <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path6"></span><span class="path7"></span>
          <template v-if="num.appoint_num > 0">
            <span class="font1" ></span>
          </template>
          <template v-else>
            <span class="font2"  v-if="docInfo.appoint_switch == '1'"></span>
          </template>
        </i>
        <span class="font">我的预约</span>
        <!--<span class="font1"  v-if="docInfo.appoint_switch != '2'">立即开通</span>-->
      </router-link>
      </section>
      <section class="list2">
        <a href="javascript:;"  @click.stop="skipMyTeam" >
          <i class="science icon-home-myGroup">
            <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span>
          </i>
          <span class="font">我的团队</span>
        </a><router-link to="/myScienceing">
          <i class="science icon-home-scienceing">
            <span class="path1"></span><span class="path2"></span><span class="path3"></span>
            <!--<span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span>-->
            <!--<span class="text">开发中</span>-->
          </i>
          <span class="font">我的科普</span>
        </router-link><router-link to="/myResearch">
        <i class="science icon-home-study" ><span class="path1"></span><span class="path2"></span><!-- <span class="path3"></span><span class="path4"></span><span class="text f20">开发中</span> --></i>
          <span class="font">我的研究</span>
      <!--</a><a v-todo>-->
      </router-link><router-link to="/workServiceSet">
        <i class="science icon-home-set">
          <span class="path1"></span><span class="path2"></span><span class="path3"></span>
          <!--<span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span>-->
          <!--<span class="text">开发中</span>-->
        </i>
        <span class="font">服务设置</span>
      </router-link>
      </section>
    </div>
    <transition name="slide-fade">
      <share-window v-show="iShow" :type="inviteType" v-on:close="iClose" v-on:sClose="sClose"></share-window>
    </transition>
    <!-- <div class="share-window" @click="sClose()" v-show="sShow">
      <img src="../../assets/media/img/share-bg.png" alt="">
    </div> -->

  </div>
</template>
<script>
  import {Toast,MessageBox} from '../../components/hw-components'
  import * as link from '../../fetch/link'
  import shareWindow from '../../components/inviteWindow.vue'
export default{
    name : 'work',
    data () {
      return {
        iShow : false,
        // sShow : false,
        currentIndex : 0,
        time : '',
        inviteType : false,
        toolShow : false,
        setTime : '',
        step : '1',
        dh :''
      }
    },
    computed : {
      arr(){
          return this.$store.state.unReplay.arr;
      },
      num(){
        return this.$store.state.unReplay.num;
      },
      head (){
          return this.$store.getters.docHead;
      },
      docInfo (){
          return this.$store.state.docInfo;
      },
      certificate(){
          return this.docInfo.is_certified == '1' ? 'icon-certificated' : (this.docInfo.is_certified == '2' ? 'icon-uncertificate' : 'icon-certificating');
      }
    },
    watch :{
      arr(){
        setTimeout(()=>{
          this.ani();
        },30)
      }
    },
    created (){
      this.$store.dispatch('unReplayCount');
      this.$store.commit('UPDATE_NAV',{title : '',fn : '', router : '', fShow : true, hShow : false});
      if(this.$store.state.unReplay.status){
        this.$store.dispatch('unReplayCount');
      }
    },
    components : {
      shareWindow : shareWindow
    },
    mounted(){
      this.$store.commit('SET_FOOTER_TAB','0');
      setTimeout(()=>{
        this.ani();
      },30);
      this.$nextTick(_=> {
        let arr = [document.querySelector('.work-header'), document.querySelector('.work-fn'), document.querySelector('.work-content')];
        let p = arr[2].getBoundingClientRect();
        let c = document.querySelector('.work').getBoundingClientRect();
        let dH = c.bottom - p.bottom;
        if (dH > 0) {
          dH = Math.floor(dH / 3);
          arr.forEach((v, i) => {
            v.style.height = v.offsetHeight + dH + 'px';
            this.dh = dH;
          })
        }
      })
    },
    methods : {
//      邀请会员的弹窗
      iClose (){
        this.iShow =   (this.iShow ? false : true);
      },
      skipMyTeam(){
        this.$store.dispatch('handleCertifiedClick',{path : '/myTeam'});
      },
      ani(){
          let timmer = 60;
          clearInterval(this.setTime);
         let pDom = document.querySelector('.msgScrollFalse');
         let cDom =  document.querySelectorAll('.msgScrollFalse span');
         let arr = this.arr.concat(this.arr);
         arr = arr.filter((v)=> {return v.count !=0});
         let h = pDom.offsetHeight;
         let c = 1;
         if(arr.length > 2){
           this.setTime = setInterval(()=>{
               pDom.style.marginTop =  -c*h + 'px';
               c++;
               if(c == arr.length - 1){
                 setTimeout(()=>{
                   pDom.style.transition = 'all 0s';
                   pDom.style.marginTop = -(arr.length/2 - 2)*h + 'px';
                   c = 1;
                 },500)
               }else{
                 pDom.style.transition = 'all 0.5s';
               }
           },3000)
         }
      },
//      分享区域的弹窗
      sClose (){
        this.$store.state.sShow = (this.$store.state.sShow ? false : true);
      },
      value (v){
        this.addTextData.message = v;
        this.show = false
      },
      skip(v){
         if(v.type != 'patientConsult'){
            this.$store.dispatch('clearCount',v.type).then(()=>{
             this.$router.push({path : v.to});
           });
        }else{
             this.$router.push({path : v.to});
         }
      },
      changeInfo(){
        if((/defaultDoctor/g).test(this.head)){
          this.$router.push({path : '/change/addInfo'});
        }
      }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";

  .work-content .consult{
    position: relative;
    .text{
      position: absolute;
      /*font-size: 0.20rem;*/
      bottom: 0.13rem;
      display: block;
      width: 100%;
      text-align: center;
      color: #11996f;
    }
  }
  .work-content .science {
    position: relative;
    .text{
      position: absolute;
      /*font-size: 0.20rem;*/
      bottom: 0.13rem;
      display: block;
      width: 100%;
      text-align: center;
      color: #1da6db;
    }
  }
  .work-content{
    .icon-home-myGroup .text{
      color: #3bc385;
    }
    .icon-home-scienceing .text{
      color: #1fbaf6;
    }
    .icon-home-study .text{
      color: #f9c608;
    }
  }
  .work-header {
    padding-top: 1px;
    width: 100%;
    height: 3.8rem;
    box-sizing: border-box;
    background: url("../../assets/media/img/work_head_circle.png") #1898ff left top   no-repeat;
    background-size: cover;
    span{
      display: block;
      text-align: center;
      color: #fff;
    }
    .name{
      vertical-align: top;
      height: 0.34rem;
      position: relative;
      vertical-align: top;
      box-sizing: border-box;
      text-align: center;
      line-height: 1;
      span{
        display: inline-block;
        padding-right: 1.2rem;
        padding-left: 1.2rem;
        position: relative;
      }
    }
    .icon-certificated{
      position: absolute;
      top: -0.36rem;
      right: 0;
    }
    .icon-certificating{
      position: absolute;
      top: -0.26rem;
      right: 0;
    }
    .icon-uncertificate{
      position: absolute;
      top: -0.26rem;
      right: 0;
    }
    .stage{
      line-height: 1;
      /*font-size: 0.32rem;*/
      margin-top: 0.38rem;
    }
    .hospital{
      margin-top: 0.2rem;
      line-height: 1;
      /*font-size: 0.24rem;*/
      padding: 0 0.6rem;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .message-tip{
    height: 0.8rem;
    line-height: 0.7rem;
    background: white;
    /*font-size: 0.26rem;*/
    overflow: hidden;
    background-size: 1.18rem 0.27rem;
    display: flex;
    /*justify-content: flex-start;*/
    align-items: center;
    position: relative;
    .undoIcon{
      display: inline-block;
      width: 1.2rem;
      height: 0.4rem;
      margin-left: 0.22rem;
      padding-right: 0.2rem;
      background: url(../../assets/media/img/workUndo1.png) white no-repeat left center;
      background-size: 100% 100%;
      border-right: 1px solid $iconGray;
    }
    /*.sound{*/
      /*padding-left: 0.2rem;*/
      /*width: 0.5rem;*/
      /*height: 0.7rem;*/
      /*display: flex;*/
      /*align-items: center;*/
      /*.sound1{*/
        /*display: inline-block;*/
        /*width: 0.21rem;*/
        /*height: 0.27rem;*/
        /*background: url(./img/sound1.png) no-repeat;*/
        /*background-size: contain;*/
      /*}*/
      /*.sound2{*/
        /*display: inline-block;*/
        /*width:0.08rem;*/
        /*height: 0.27rem;*/
        /*margin-left: 0.06rem;*/
        /*background: url("./img/sound2.png") no-repeat;*/
        /*background-size: contain;*/
      /*}*/
      /*.sound3{*/
        /*animation: ani 1.5s infinite;*/
      /*}*/
    /*}*/
    button{
      line-height: 0.4rem;
      padding: 0 0.2rem;
      border: 1px solid $baseBlue;
      position: absolute;
      right: 0.2rem;
      top: 50%;
      transform: translateY(-50%);
      background: white;
      border-radius: 0.06rem;
      color: $baseBlue;
    }
    .msgScrollFalse{
      height: 0.8rem;
      vertical-align: top;
      line-height: 0.7rem;
      padding-left: 0.26rem;
      position: absolute;
      /*border: 1px solid red;*/
      top:0;
      left: 1.6rem;
      span{
        display: flex;
        width: 100%;
        height: 100%;
        line-height: 0.7rem;
        align-items: center;
      }
      span i{
        font-size: 0.22rem;
        line-height: 0.28rem;
        padding: 0.02rem 0.1rem;
        color: #fdaa28;
        border-radius: 0.06rem;
        margin-right: 0.11rem;
      }
     }
  }
  @keyframes scroll {
      0%{
        top:0;
      }
      33%{
        transform: translateY(-50%);
      }
      66%{
        top:0;
      }
      99%{
        transform: translateY(-50%);
      }
  }
  @keyframes ani {
     from {
       opacity: 0;
     }
    to{
      opacity: 1;
    }
  }
  .work-header .headImg {
    display: block;
    width: 1.46rem;
    height: 1.46rem;
    border: 0.06rem solid white;
    margin: 0.3rem auto 0.23rem;
    border-radius: 50%;
  }
  .work-header .headImg_act{
    transform-origin: 50% 50%;
    animation: biger 2s ease infinite;
  }
  .work-fn{
    width:100%;
    display: flex;
    align-items: center;
    line-height: 0;
    justify-content: space-between;
    height: 1.55rem;
    background: white;
    padding: 0 0.3rem 0 0.5rem;
    box-sizing: border-box;
  }
  .work-fn a {
    display: inline-block;
    text-align: center;
    position: relative;
    font-weight: normal;
    line-height: 1;
    i{
      display: block;
      margin-bottom: 0.23rem;
    }
    .icon-home-group{
      line-height: 0.5rem;
      margin-bottom: 0.26rem;
    }
  }
  .work-fn{
    .message{
      position: relative;
      nav{
        position: absolute;
        background: white;
        padding: 0.1rem 0.2rem;
        left: -0.15rem;
        top: 1.16rem;
        z-index: 4;
        border-radius: 0.14rem;
        -webkit-filter:drop-shadow(0 0  8px  #dcdcdc);
        filter: drop-shadow(0 0  8px  #dcdcdc);
        a{
          display: flex;
          height: 0.8rem;
          line-height: 0.8rem;
          width: 2.3rem;
          align-items: center;
          /*font-size: 0.24rem;*/
          i{
            margin-bottom: 0;
            margin-right: 0.2rem;
            font-size: 0.5rem;
          }
        }
        b{
          display: inline-block;
          position: absolute;
          border-top: .1rem solid transparent;
          border-left: .2rem solid transparent;
          border-right: .2rem solid transparent;
          border-bottom: .1rem solid white;
          left: 0.55rem;
          top: -.2rem
        }
      }
    }
  }
  .work-content {
    width: 100%;
    padding: 0.1rem 0.55rem 0;
    height: 4.1rem;
    display: flex;
    flex-wrap: wrap;
    background:white;
    margin-top: 0.2rem;
    box-sizing: border-box;
  }
  .work-content section{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    line-height: 0;
    justify-content: space-between;
    align-content: space-between;
  }
  .work-content a{
    display: inline-block;
    box-sizing: border-box;
    text-align: center;
    position: relative;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    i{
      font-size: 0.8rem;
      margin-bottom: 0.24rem;
      position: relative;
      .font1{
        position: absolute;
        font-size: 0.24rem;
        white-space: nowrap;
        left: 0.1rem;
        color: white;
        display: inline-block;
        width: 0.6rem;
        height: 0.24rem;
        background: url("../../assets/media/img/home_undo.png") left top no-repeat;
        background-size: 100%  100%;
        border-radius: 0.12rem;
        bottom: -0.1rem;
      }
      .font2{
        position: absolute;
        font-size: 0.24rem;
        white-space: nowrap;
        left: 0.1rem;
        color: white;
        display: inline-block;
        width: 0.6rem;
        height: 0.24rem;
        border-radius: 0.12rem;
        bottom: -0.1rem;
        background: url("../../assets/media/img/home_set.png") left top no-repeat;
        background-size: 100%  100%;
      }
    }
    .font{
      font-size: 0.26rem;
      line-height: 1;
      color: $gray_a;
    }
  }
  /*分享二维码弹窗指引样式*/
  .share-window {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .6);
    top: 0;
    z-index: 20;
    position: fixed;
  }
  .share-window img {
    width: 100%;
    height: 2.44rem
  }
  .iconGray{
    &:before{
      color: $i2Gray;
    }
  }
  /*引导页*/
  .step4{
    position: absolute;
  }
</style>
