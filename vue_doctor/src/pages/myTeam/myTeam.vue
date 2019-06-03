<template>
<div class="myTeam">
  <template v-if="joinTeam.length == 0 && myTeam.length == 0">
    <div class="myTeamCon" >
      <img src="../../assets/media/img/team-intro.png" alt="">
      <div class="content">
        <h6 class="title">什么是专家团队?</h6>
        <p><i class="circle"></i> 专家团队是由1个领衔专家组织，由多个合作密切的 医生组成的团队，团队间长期保持稳定协作，以团队 方式对外回答患者咨询。</p>
        <h6 class="title">专家团队能做什么?</h6>
        <p class="p1"><i class="circle"></i> 智呼吸专家团队能以团队形式提供咨询服务，助于品 牌推广、形象升华。</p>
        <p class="p1 p2"><i class="circle"></i> 专家团队支持院内科室或院外组织团队，形成有机结 合，团队持续开放更多专用功能。</p>
      </div>
    </div>
    <hwSubmitBtn text="立即新建专家团队" :activeStyle="{background : '#20c6b4'}" @submit="addTeam"></hwSubmitBtn>
  </template>
  <template v-else>
    <div class="myTeamHead">
      <nav>
        <router-link to="/myTeam/createTeamList">我组建的团队</router-link>
        <router-link to="/myTeam/joinTeamList">我加入的团队</router-link>
      </nav>
    </div>
    <div class="myTeamContent">
      <router-view></router-view>
    </div>
  </template>
</div>
</template>

<script>
import hwSubmitBtn from "../../components/hw-submit-btn"
export default {
  created(){
    this.$store.commit('UPDATE_NAV',{title : '我的专家团队',hShow : true , fn : '群组', theme : 'green'});
    // this.$store.commit('UPDATE_NAV',{title : '我的专家团队',hShow : true ,  theme : 'green'});
    this.$store.dispatch('teamList');
    window.sessionStorage['sharePath']= this.$route.fullPath;  //从扫码进来 存储当前路由以便 未登录跳转至登录然后 登录之后重新到这个页面
  },
  mounted(){
    document.querySelector('.nav_submit').onclick=(e)=>{
      this.$router.push({path : '/teamMessage'});
    }
  },
  computed:{
    joinTeam(){
      return this.$store.state.myTeam.joinTeam;
    },
    myTeam(){
      return this.$store.state.myTeam.myTeam;
    }
  },
  components:{hwSubmitBtn},
  methods:{
    addTeam(){
      this.$store.dispatch('handleCertifiedClick',{path : '/addTeam'}).then(_=>{
        window.sessionStorage['teamId']  = '0';
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.myTeam{
  background: white;
  overflow: hidden;
  height: 100%;
  position: relative;
  .myTeamCon{
    height: calc(100% - 1.6rem);
    overflow: scroll;
    img{
      display: inline-block;
      height: 4rem;
    }
    .content{
      padding: 0.14rem 0.3rem 0;
      .title{
        font-size: 0.32rem;
        line-height: 0.64rem;
        padding-left: 0.1rem;
        box-sizing: border-box;
        border-bottom: 1px solid $gray_e;
        font-weight: bold;
        color: $gray_a;
      }
      p{
        /*padding-left: 0.1rem;*/
        box-sizing: border-box;
        padding: 0.23rem 0.11rem 0.12rem 0.34rem;
        font-size: 0.28rem;
        line-height: 0.42rem;
        position: relative;
        color:$gray_b;
        .circle{
          display: inline-block;
          width: 0.14rem;
          height: 0.14rem;
          background: $baseGreen;
          border-radius: 50%;
          position: absolute;
          left: 0.11rem;
          top: 0.32rem;
        }
      }
      .p1{
        padding-bottom: 0.06rem;
      }
      .p2{
        padding-top: 0;
        .circle{
          top: 0.1rem;
        }
      }
    }
  }
  .submit{
    padding: 0.3rem;
    box-sizing: border-box;
    line-height: 0;
    button{
      display: inline-block;
      width: 100%;
      height: 1rem;
      background: $baseGreen;
      color: white;
      font-size: 0.4rem;
      line-height: 1rem;
      text-align: center;
      border-radius: 0.04rem;
    }
  }
}
.myTeamHead{
  height: 2.3rem;
  background: url("../../assets/media/img/team-green-bg.png") no-repeat left top -0.8rem;
  background-size:100% 3.1rem;
  nav{
    display: flex;
    width: 100%;
    padding: 0.14rem 0.2rem 0;
    box-sizing: border-box;
    font-size: 0.32rem;
    color: white;
    flex-wrap: nowrap;
    overflow: scroll;
    a{
      display: inline-block;
      width: 50%;
      border: 1px solid white;
      height: 0.6rem;
      line-height: 0.6rem;
      text-align: center;
      color: white;
    }
    a:nth-of-type(1){
      border-top-left-radius: 0.04rem;
      border-bottom-left-radius: 0.04rem;
    }
    a:nth-of-type(2){
      border-left: none;
      border-top-right-radius: 0.04rem;
      border-bottom-right-radius: 0.04rem;
    }
    .router-link-active{
      background: white;
      color: $baseGreen;
    }
  }
}
.myTeamContent{
  width: 100%;
  height: calc(100% - 1.12rem);
  position: absolute;
  background: $gray_e;
  top: 1.12rem;
  left: 0;
  overflow: scroll;
  box-sizing: border-box;
}
</style>
