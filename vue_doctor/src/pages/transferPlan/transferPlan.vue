<template>
<div class="container">
   <div class="content">
     <i class="icon-time"></i>
     <h6>提现申请已提交</h6>
     <ul>
       <li>到账时间 <span>1~3个工作日</span></li>
       <li>提现账户 <span>{{info.bank_name}}</span></li>
       <li>提现单号 <span>{{info.order}}</span> </li>
       <li>提现申请时间 <span>{{info.time}}</span></li>
     </ul>
   </div>
</div>
</template>

<script>
export default{
    name : 'transferPlan',
    data(){return {
        info : ''
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '余额提现', fn:'完成',hShow : true , fShow : false});
      if(this.$route.query.info){
          this.info = JSON.parse(this.$route.query.info);
      }
    },
    mounted(){
        document.querySelector('.nav_submit').onclick=()=> {
          switch (this.walletType.type){
            case "team":
              this.$router.push({path : `/${this.walletType.id}/teamWallet`});
            break;
            default :
              this.$router.push({path : '/myWallet'});
          }
        }
    },
    computed:{
      walletType(){
        return this.$store.state.walletType;
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
.container{
  .content{
    background: white;
    padding: 0.01rem 0.2rem 0;
    ul{
      padding: 0.35rem 0.55rem;
      font-size: 0.28rem;
      li{
        padding: 0.2rem 0;
        display: flex;
        justify-content: space-between;
        color: $fGray;
        span{
          color: black;
        }
      }
    }
  }
  .icon-time{
    font-size: 1.34rem;
    display: block;
    margin: 1rem auto 0.46rem;
    text-align: center;
  }
  h6{
    font-size: 0.32rem;
    color: $fGray;
    text-align: center;
    padding-bottom: 0.74rem;
    border-bottom: 1px dashed $gray;
  }
}
</style>
