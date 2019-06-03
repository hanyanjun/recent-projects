<template>
<div>
  <template v-if="myTeam[0] != '' && myTeam.length != 0">
    <div class="content">
      <div class="modules" v-for="item in myTeam" @click.stop="pre(item)">
        <img src="" alt="" v-img="head(item.headimg)" class="headImg">
        <h6 class="title">{{item.title}}</h6>
        <h6 class="name">{{docInfo.name}}
          <span class="icon icon-team-lead1">
                <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span>
                </span></h6>
        <p class="skill" v-html="`团队擅长：${item.skill ? item.skill : '--'}`"></p>
        <i class="bage" v-show="item.review == '3'">待审核</i>
      </div>
    </div>
    <a href="javascript:;" @click.stop="skip" class="addTeam">+新建团队</a>
  </template>
  <teamEmpty :show="myTeam.length == 0" text="您目前还没有组建团队" btn="立即新建团队" @submit="skip"></teamEmpty>
</div>
</template>

<script>
import teamEmpty from "../../components/teamEmpty"
export default {
    name: "createTeamList",
    computed:{
      myTeam(){
        return this.$store.state.myTeam.myTeam;
      },
      docInfo(){
        return this.$store.state.docInfo;
      }
    },
    mounted(){
      document.querySelector('.nav_submit').onclick=(e)=>{
        this.$router.push({path : '/teamMessage'});
      }
    },
   components :{teamEmpty},
   methods:{
     head(v){
       return `${v}?${Date.parse(new Date())}`
     },
     skip(){
       this.$store.dispatch('handleCertifiedClick',{path : '/addTeam'}).then(_=>{
         window.sessionStorage['teamId']  = '0';
       });
     },
     pre(v){
       this.$router.push(`/${v.id}/teamInfoPre`);
     }
   }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.content{
  padding: 0 0.2rem;
}
.modules{
  height: 2.4rem;
  background: white;
  border-radius: 0.04rem;
  position: relative;
  padding-left: 2.1rem;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  overflow: hidden;
  margin-bottom: 0.2rem;
  .headImg{
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    border-radius: 50%;
    border: 1px solid $gray_d_c;
    position: absolute;
    top: 0.3rem;
    left: 0.24rem;
  }
  .title{
    display: block;
    width: 4.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.32rem;
    line-height: 0.62rem;
    height: 0.62rem;
    color: $gray_a;
  }
  .name{
    display: block;
    font-size: 0.26rem;
    line-height: 0.46rem;
    height: 0.46rem;
    padding-right: 0.88rem;
    color: $gray_a;
    position: relative;
    .icon{
      position: absolute;
      font-size: 0.28rem;
      right: 0;
      top: 0.08rem;
    }
  }
  .skill{
    padding-right: 0.2rem;
    box-sizing: border-box;
    font-size: 0.26rem;
    line-height: 0.42rem;
    height: 0.84rem;
    overflow: hidden;
    width: 100%;
    color: $gray_b;
    word-break: break-all;
    position: relative;
  }
  .bage{
    display: inline-block;
    width: 2.2rem;
    height: 0.38rem;
    position: absolute;
    background: $grange_c;
    color: white;
    font-size: 0.24rem;
    top: 0.25rem;
    right: -0.66rem;
    text-align: center;
    transform: rotateZ(45deg);
    transform-origin: 50% 50%;
  }
}
.addTeam{
  margin-top: 0.5rem;
  display: inline-block;
  width: 100%;
  text-align: center;
  font-size: 0.32rem;
  color: $baseGreen;
  background: white;
  height: 1rem;
  line-height: 1rem;
}
</style>
