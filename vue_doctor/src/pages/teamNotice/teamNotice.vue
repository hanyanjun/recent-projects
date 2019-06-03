<template>
<div class="teatNoticeWrap">
  <div class="modules" v-for="item in arr" v-if="item" @click.stop="$router.push({path : `/${item.id}/teamNoticeDetail`})">
    <h6 class="title">{{item.title}}</h6>
    <h6 class="head"><span class="info"><span class="origin">{{item.technical}}</span><span class="auth">{{item.name}}</span><span class="time">{{item.created}}</span></span><span class="num">{{item.read_count}}人阅读</span></h6>
    <h6 class="line"></h6>
    <p class="content omit-mul">{{item.content ? (item.content.length > 60 ? item.content.substring(0,60) + '....'  : item.content.substring(0,60)) : '-----'}}</p>
  </div>
  <template v-if="acc == docInfo.account">
    <teamEmpty :show="arr.length == 0" text="您目前还没有组建团队"  btn="立即新建团队公告" @submit="skip">
      <i slot="icon" class="icon-team-notice"></i>
    </teamEmpty>
  </template>
  <template v-else>
    <teamEmpty :show="arr.length == 0" text="您目前还没有组建团队" >
      <i slot="icon" class="icon-team-notice"></i>
    </teamEmpty>
  </template>
</div>
</template>

<script>
import teamEmpty from "../../components/teamEmpty"
export default{
    data(){return{id : '',arr : [''], acc : ''}},
    components :{teamEmpty},
    created(){
      this.initHead();
      this.acc = this.$route.params.acc;
      this.id = this.$route.params.id;
      this.$api.teamNoticeList(this.id).then(obj=>{
        this.arr = obj.notices;
      })
    },
    computed:{
      docInfo(){
        return this.$store.state.docInfo;
      }
    },
    mounted(){
      document.querySelector('.nav_submit').onclick=(e)=>{
        this.skip();
      }
    },
    watch :{
      docInfo :{
        handler : function (v) {
          this.initHead();
        },
        deep : true
      }
    },
    methods:{
      skip(){
        this.$router.push({path : `/${this.id}/addTeamNotice`});
      },
      initHead(){
        if(this.docInfo.account){
          if(this.docInfo.account == this.$route.params.acc){
            this.$store.commit('UPDATE_NAV',{title : '团队公告',fn : '新建',  hShow : true , theme : 'green'});
          }else{
            this.$store.commit('UPDATE_NAV',{title : '团队公告', hShow : true , theme : 'green'});
          }
        }
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
.teatNoticeWrap{
  height: 100%;
  overflow: scroll;
  .modules{
    background: white;
    margin-bottom: 0.2rem;
    .title{
      padding: 0.15rem 0.3rem 0;
      font-size: 0.32rem;
      line-height: 0.42rem;
      color: $gray_a;
    }
    .head{
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
      font-size: 0.22rem;
      line-height: 0.32rem;
      color: $gray_c;
      padding: 0 0.3rem 0.07rem;
      span{
        line-height: 0.32rem;
      }
      .origin{
        margin-right: 0.08rem;
      }
      .auth{
        margin-right: 0.22rem;
      }

    }
    .line{
      height: 1px;
      background: $gray_e;
    }
    .content{
      font-size: 0.28rem;
      border-top:0.13rem solid white;
      border-left:0.3rem solid white;
      border-right:0.3rem solid white;
      border-bottom:0.3rem solid white;
      color: $gray_b;
      line-height: 0.42rem;
      position: relative;
      word-break: break-all;
    }
  }
}
</style>
