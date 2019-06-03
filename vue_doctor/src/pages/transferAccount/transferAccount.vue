<template>
<div class="container" v-show="weixin || cards.length != 0">
  <h6>
    提现到账户
  </h6>
  <section @click.stop="skip3" v-if="walletType.type == 'self'">
      <div >
        <i class="icon-weixin-icon">
          <span class="path1"></span><span class="path2"></span>
        </i>
        <span class="acc-type">微信钱包<span class="acc-name">{{info.nick}}</span></span>
        <template v-if="weixin == '1'">
          <span class="status">待激活</span>
        </template>
        <template v-if="weixin == '2'">
          <span class="status">激活中</span>
        </template>
        <template v-if="weixin == '4'">
          <span class="status">激活失败</span>
        </template>
      </div>
      <i class="icon-return-boldleft"></i>
  </section>
  <section v-for="item in cards"  @click.stop="skip2(item)" >
    <!--v-show="item.activation == '2'"-->
    <div>
      <i :class="['icon',`icon-${item.bank_code}-icon`]">
        <span class="path1"></span><span class="path2"></span>
      </i>
      <span class="acc-type">{{item.bank_name}}<span class="acc-name">{{`尾号${item.card_number.substring(item.card_number.length - 4)}储蓄卡`}}</span></span>
      <template v-if="item.activation == '1'">
        <span class="status1">待激活</span>
      </template>
      <template v-if="item.activation == '3'">
        <span class="status1">激活失败</span>
      </template>
    </div>
    <i class="icon-return-boldleft"></i>
  </section>
  <section v-show="cards.length == 0"  @click.stop="skip1">
    <div>
      <i class="icon-add-bank"></i>
      <span class="acc-type">添加银行卡</span>
    </div>
    <i class="icon-return-boldleft"></i>
  </section>
</div>
</template>

<script>
  import {Toast} from '../../components/hw-components'
export default{
    name : 'transferAccount',
    data(){return{
        cards : [],
        weixin : '',
    }},
    computed:{
      info(){
          return this.$store.state.docInfo;
      },
      walletType(){
        return this.$store.state.walletType;
      }
    },
    methods:{
      skip1(){
          this.$router.push({path : '/addBank'});
      },
      skip2(v){
        console.log(v.activation);
          v.name = `尾号${v.card_number.substring(v.card_number.length - 4)}储存卡`;
          v.amount   = this.$route.query.amount;
        if(v.activation != '2'){
          Toast('您当前银行卡还未激活!');
        }else{
          this.$router.push({path : '/transfer' ,query : {info : JSON.stringify(v)}});
        }
      },
      skip3(){
          let obj ={
            bank_code : 'weixin',
            name : this.info.name,
            phone : this.info.phone,
            bank_name : '微信钱包',
            amount : this.$route.query.amount
          }
          if(this.weixin != '3'){
              Toast('您当前微信钱包还未实名请先实名!');
          }else{
            this.$router.push({path : '/transfer' , query : {info : JSON.stringify(obj)}});
          }
      }
    },
    mounted(){
      document.querySelector('.nav_submit').onclick =()=>{
        this.$router.push({path : '/transferHistory'});
      }
      switch (this.walletType.type){
        case "team":
          this.$store.commit('UPDATE_NAV',{title : '余额提现', fn:'提现记录', hShow : true , fShow : false , theme : 'green'});
          this.$api.teamBankList(this.walletType.id).then(obj=>{
            this.cards = obj.cards;
          })
          break;
        default :
          this.$store.commit('UPDATE_NAV',{title : '余额提现', fn:'提现记录', hShow : true , fShow : false});
          this.$api.gBankCard().then(obj=>{
            this.cards = obj.cards;
            this.weixin = obj.wechat_real_name;
          })
      }
    },
    created(){
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
.container{
   h6{
     font-size: 0.28rem;
     padding-left: 0.3rem;
     background: white;
     height: 0.7rem;
     margin-top: 3px;
     line-height: 0.7rem;
     border-bottom: 1px solid $gray;
   }
  section{
    padding-left: 0.3rem;
    height: 1.3rem;
    background: white;
    position: relative;
    div{
      height: 100%;
      border-bottom: 1px solid $gray;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .status{
        font-size: 0.32rem;
        color: $fGray;
        margin-left: 2rem;
      }
      .status1{
        font-size: 0.32rem;
        color: $fGray;
        margin-left: 1.8rem;
      }
    }

    i{
      font-size: 0.78rem;
    }
    .icon{
      font-size: 0.7rem;
    }
    .acc-type{
      font-size: 0.32rem;
      display: block;
      margin-left: 0.24rem;
      line-height: 0.46rem;
    }
    .acc-name{
      font-size: 0.28rem;
      color: $fGray;
      display: block;
      padding-left: 0.08rem;
      line-height: 0.46rem;
    }
    .icon-return-boldleft{
      color: $iconGray;
      transform: translateY(-50%) rotateY(180deg);
      font-size: 0.38rem;
      position: absolute;
      right: 0.3rem;
      top: 50%;
    }
  }
}
</style>
