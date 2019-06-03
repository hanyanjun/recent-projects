<template>
  <div>
    <div class="content" v-if="joinTeam.length != 0 && joinTeam[0] != ''">
      <template v-for="(item,index) in joinTeam">
        <div class="modules" @click.stop="pre(item)">
          <img src=""  v-img="head(item.headimg)" alt="" class="headImg">
          <h6 class="title">{{item.title}}</h6>
          <h6 class="name">{{item.name}}
            <span class="icon icon-team-lead1">
                <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span>
                </span></h6>
          <p class="skill"  v-html="`团队擅长：${item.skill ? item.skill : '--'}`"></p>
          <i class="bage" v-show="item.review == '3'">等待加入</i>
        </div>
        <h6 class="fn" v-show="item.review == '3'"> <router-link :to="`/${item.id}/teamInfoPre`">了解他的团队 >></router-link> <div class="btns"><button class="reject" @click.stop="select(item,index,'2')">拒绝</button><button class="join" @click.stop="select(item,index,'1')">加入</button></div></h6>
      </template>
    </div>
    <teamEmpty :show="joinTeam.length == 0" text="您目前还没有收到团队邀请"></teamEmpty>
  </div>
</template>

<script>
  import teamEmpty from "../../components/teamEmpty"
  export default {
    name: "joinTeamList",
    computed:{
      joinTeam(){
        return this.$store.state.myTeam.joinTeam;
      }
    },
    components :{teamEmpty},
    mounted(){
      document.querySelector('.nav_submit').onclick=(e)=>{
        this.$router.push({path : '/teamMessage'});
      }
    },
    methods:{
      head(v){
        return `${v}?${Date.parse(new Date())}`
      },
      pre(v){
        this.$router.push(`/${v.id}/teamInfoPre`);
      },
      select(item,i,v){
        this.$store.dispatch('handleCertifiedClick').then(_=>{
          this.$api.joinTeam(item.id,{review : v}).then(obj=>{
            this.$store.dispatch('teamList');
          })
        });
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
    margin-top: 0.2rem;
    .headImg{
      display: inline-block;
      width: 1.7rem;
      height: 1.7rem;
      border-radius: 50%;
      position: absolute;
      border: 1px solid $gray_d_c;
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
      padding-right: 0.9rem;
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
      width: 100%;
      box-sizing: border-box;
      padding-right: 0.2rem;
      box-sizing: border-box;
      font-size: 0.26rem;
      line-height: 0.42rem;
      height: 0.84rem;
      overflow: hidden;
      color: $gray_b;
      word-break: break-all;
      position: relative;
    }
    .bage{
      display: inline-block;
      width: 2.2rem;
      height: 0.38rem;
      position: absolute;
      background: $baseBlue;
      color: white;
      font-size: 0.24rem;
      top: 0.25rem;
      right: -0.7rem;
      text-align: center;
      transform: rotateZ(45deg);
      transform-origin: 50% 50%;
    }
  }
  .modules:nth-child(1){
    margin-top: 0;
  }
  .modules1{
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .fn{
    height: 0.8rem;
    background: white;
    font-size: 0.28rem;
    border-top: 1px solid $gray_e;
    border-bottom-left-radius: 0.04rem;
    border-bottom-right-radius: 0.04rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.2rem;
    box-sizing: border-box;
    a{
      color: $baseGreen;
    }
    .btns{
      button{
        display: inline-block;
        width: 1.2rem;
        height: 0.5rem;
        line-height: 0.5rem;
        font-size: 0.32rem;
        border-radius: 0.04rem;
      }
      .reject{
        background: white;
        border: 1px solid $baseGreen;
        color: $baseGreen;
        margin-right: 0.1rem;
      }
      .join{
        background: $baseGreen;
        color: white;
        border: 1px solid $baseGreen;
      }
    }
  }
</style>
