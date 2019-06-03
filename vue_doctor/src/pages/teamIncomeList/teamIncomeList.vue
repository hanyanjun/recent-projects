<template>
<div class="teamIncomeList">
  <div class="modlue" v-for="(item,index) in myTeam" @click.stop="skipWallet(item)">
    <template v-if="item.review == 3">
      <img src="../../assets/media/img/teamList-reviewbg.png" alt="" data="nopre">
    </template>
    <template v-else>
      <template v-if="index % 2 == 0">
        <img src="../../assets/media/img/teamList-bluebg.png" alt="" data="nopre">
      </template>
      <template v-else>
        <img src="../../assets/media/img/teamList-greenbg.png" alt="" data="nopre">
      </template>
    </template>
     <i class="circle">{{item.title ? item.title.substring(0,1) : ''}}</i>
     <span class="title">{{item.title}}</span>
     <i class="icon icon-team-wallet"></i>
  </div>
  <router-link to="/addTeam" class="addTeam" v-show="myTeam.length != 0">+新建专家团队</router-link>
  <teamEmpty text="目前您没有团队还不能使用该功能" btn="立即新建团队" :show="myTeam.length == 0" @submit="skip"></teamEmpty>
</div>
</template>

<script>
import teamEmpty from "../../components/teamEmpty"
export default {
  created(){
    this.$store.commit('UPDATE_NAV',{title : '团队收入',fn : '', router : '', theme : 'green',hShow : true});
    this.$store.dispatch('teamList');
    window.sessionStorage['teamId'] = '0';
  },
  computed:{
    myTeam(){
      return this.$store.state.myTeam.myTeam;
    },
  },
  methods:{
    skipWallet(v){
      if(v.review != 3){
        this.$router.push({path : `/${v.team_id}/teamWallet`});
      }
    },
    skip(){
      this.$router.push({path : '/addTeam'});
    }
  },
  components:{teamEmpty}

}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.teamIncomeList{
  height: 100%;
  overflow: scroll;
  .modlue{
    width: 7.1rem;
    height: 1.8rem;
    margin: 0.2rem auto 0;
    position: relative;
    overflow: hidden;
    border-radius: 0.06rem;
    img{
      display: inline-block;
      width: 104%;
      height: 110%;
      margin-left: -2%;
    }
    .circle{
      background: white;
      display: inline-block;
      width: 0.63rem;
      height: 0.63rem;
      border-radius: 50%;
      font-size: 0.32rem;
      text-align: center;
      line-height: 0.63rem;
      color: $baseBlue;
      position: absolute;
      top: 0.6rem;
      left: 0.36rem;
    }
    .title{
      display: inline-block;
      width: 4.5rem;
      word-break: break-all;
      font-size: 0.32rem;
      line-height: 0.42rem;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      color: white;
      left: 1.2rem;
    }
    .icon{
      position: absolute;
      right: 0.25rem;
      font-size: .44rem;
      top: 0.68rem;
    }
  }
  .addTeam{
    display: inline-block;
    width: 100%;
    margin-top: 0.5rem;
    background: white;
    color: $baseGreen;
    font-size: 0.32rem;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
  }
}
</style>
