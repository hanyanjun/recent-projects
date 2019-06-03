<template>
<div class="container">
  <h6 class="type">
    <i :class="['bank-icon',`icon-${info.bank_code}-icon`] ">
      <i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i>
    </i>
    <span>{{info.bank_name}}</span></h6>
   <h6 class="money">{{info.amount}}</h6>
   <h6 :class="['plan-icon',{'plan-icon-1' : info.status == '1'},{'plan-icon-2' : info.status == '2'},{'plan-icon-3' : info.status == '4'} ]">
     <i class="icon-plan-status-1"></i>
     <i class="icon-plan-status-1"></i>
     <i class="icon-plan-status-1 "></i>
   </h6>
  <h6 class="plan-text">
    <span>提现申请</span>
    <span :class="{'plan-text-1' : info.status == '1'}">入账处理中</span>
    <span :class="[{'plan-text-1' : info.status != '3' && info.status != '4'} ,{'plan-text-2' : info.status == '4'}]">{{info.status == '3' ? '已入账' :(info.status == '4' ? '提现失败' : '处理结果')}}</span>
  </h6>
  <ul class="intro">
    <li> <span>提现说明</span> <span>余额-提现到{{info.transfer_type == '1' ? '微信' : '银行卡'}}</span></li>
    <li> <span>提现账户</span> <span>{{info.bank_name}}{{info.card_number == 'weixin'  ? '' :  (info.card_number + '').substring((info.card_number + '').length -4)}}</span></li>
    <li> <span>提现单号</span> <span>{{info.transfer_no}}</span></li>
    <li> <span>提现申请时间</span> <span>{{changeTime(info.created)}}</span></li>
  </ul>
</div>
</template>

<script>
export default{
    name : 'transferDetail',
    data(){return{
        info : ''
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '提现记录', hShow : true , fShow : false});
    },
    mounted(){
      console.log(this.walletType);
      switch (this.walletType.type){
        case 'team':
          this.$api.teamTransferDetail(this.$route.params.id).then(obj=>{
            this.info = obj.record;
          })
          break;
        default:
          this.$api.transferDetail(this.$route.params.id).then(obj=>{
            this.info = obj.record;
          })
          break;
      }
    },
    computed:{
      walletType(){
        return this.$store.state.walletType;
      }
    },
    methods :{
      changeTime(time){
        if(time){
          var t1 = time.split(' ')[0];
          var t2 = time.split(' ')[1];
          return t1.split('-')[0]+'/'+t1.split('-')[1]+'/'+t1.split('-')[2]+' '+t2.split(':')[0]+':'+t2.split(':')[1];
        }
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
.container{
  background: white;
  padding: 0 0.2rem;
  .type{
    margin-top: 1.1rem;
    margin-bottom:0.55rem;
    text-align: center;
    height: 0.55rem;
    display: flex;
    align-items: center;
    justify-content: center;
    span{
      font-size: 0.32rem;
      margin-left: 0.2rem;
    }
  }
  .money{
    font-size: 0.6rem;
    height: 0.6rem;
    line-height: 0.6rem;
    text-align: center;
  }
  .intro{
    padding-top: 0.3rem;
    border-top: 1px dashed $gray;
    li{
      font-size: 0.28rem;
      height: 0.68rem;
      line-height: 0.68rem;
      display: flex;
      justify-content: space-between;
      span:nth-of-type(1){
        color: $fGray;
      }
    }
  }
  .plan-icon{
     margin-top: 0.68rem;
     padding: 0 0.85rem;
    line-height: 0;
    display: flex;
    i{
      color: $baseBlue;
      position: relative;
      &:before{
        color: $baseBlue;
        z-index: 1000;
      }
      &:after{
        content: '';
        position: absolute;
        width: 1.9rem;
        border: 1px solid $baseBlue;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    i:nth-of-type(3){
      &:after{
        display: none;
      }
    }
    justify-content: space-between;
  }
  .plan-icon-2 {
    i:nth-of-type(1){
      &:after{
        border: 1px solid $baseBlue;
      }
    }
    i:nth-of-type(2){
      &:after{
        border: 1px solid $iconGray;
      }
    }
    i:nth-of-type(3){
      &:before{
        color: $iconGray;
      }
    }
  }
  .plan-icon-1 {
    i:nth-of-type(1){
      &:after{
        border: 1px solid $iconGray;
      }
    }
    i:nth-of-type(2){
      &:after{
        border: 1px solid $iconGray;
      }
      &:before{
        color: $iconGray;
      }
    }
    i:nth-of-type(3){
       &:before{
         color: $iconGray;
       }
     }
  }
  .plan-icon-3 {
    i:nth-of-type(3){
      &:before{
        color: $iconGray;
      }
    }
  }
  .plan-text{
    padding: 0.23rem 0.52rem 0.9rem;
    display: flex;
    justify-content: space-between;
    font-size: 0.28rem;
    span{
      display: inline-block;
      min-width: 1.2rem;
      text-align: center;
    }
  }
  .plan-text-1{
    color: $fGray;
  }
  .plan-text-2{
    color: #ff1f1f;
  }
}
</style>
