<template>
  <div class="container">
    <span class="icon1" @click.stop = "dele"></span>
    <div class="bank">
    <span :class="['icon-bank',`icon-${cards.bank_code}-bg`]">
                <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span>
    </span>
      <h6 class="name">{{cards.bank_name}}</h6>
      <h6 class="num"> <span>****&nbsp;&nbsp;****&nbsp;&nbsp;****&nbsp;&nbsp;</span>{{cards.card_number.substring(cards.card_number.length - 4)}}</h6>
    </div>
    <ul>
      <li class="title">银行提现限额</li>
      <li class="money">单笔限额  <span>￥50,000</span></li>
      <li class="money">每日限额  <span>￥50,000</span></li>
    </ul>
  </div>
</template>

<script>
export default{
  name : 'deleBank',
  data(){return {
        cards :{},
        actionsheetConfig :{
              show : false,
              btns :[
                {name:'解绑账户',method:()=>{
                  switch (this.walletType.type){
                    case "team":
                      this.$api.teamDBankCard(this.cards.team_bank_card_id).then(obj=>{
                        this.actionsheetConfig.show = false;
                        this.$router.push({path : `/${this.walletType.id}/teamBankManage`});
                      })
                    break;
                    default:
                      this.$api.dBankCard(this.cards.bank_card_id).then(obj=>{
                        this.actionsheetConfig.show = false;
                        this.$router.push({path : '/accountManage'});
                      })
                  }}
                  },
                {name:'取消',method:()=>{
                  this.actionsheetConfig.show = false;
                }},
              ]
        }
    }},
  created(){
    this.$store.commit('UPDATE_NAV',{title : '收款账户', hShow : true , fShow : false});
    if(this.$route.query.info){
        this.cards = JSON.parse(this.$route.query.info);
    }
  },
  mounted(){
    document.querySelector('.nav_back').onclick=(e)=>{
      this.$router.push({path : '/accountManage'});
    }
  },
  computed:{
    walletType(){
      return this.$store.state.walletType;
    }
  },
  methods:{
    dele(){
      this.actionsheetConfig.show = true;
      this.$store.commit('SET_ACTION_SHEET',this.actionsheetConfig);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .container {
    overflow: hidden;
  }
  .icon1{
    position: fixed;
    top: 0;
    right: 0.3rem;
    width: 0.46rem;
    height: 0.8rem;
    background: url(../../assets/media/img/circle.png) no-repeat center center;
    background-size: 100% 0.1rem;
    font-weight: normal;
    text-align: left;
    display: inline-block;
    line-height: 0.8rem;
    align-items: center;
    color: #fff;
  }
  .icon-bank{
    font-size: 2.1rem;
  }
  .bank{
    margin: 0.47rem auto;
    position: relative;
    font-size: 0.5rem;
    color: white;
    text-align: center;
  }
  .name{
    position: absolute;
    top:0.2rem;
    left: 1.4rem;
    text-align: center;
    color: rgba(255,255,255,0.6);
    font-size: 0.34rem;
  }
  .num{
    position: absolute;
    top:0.87rem;
    left: 1.4rem;
    text-align: right;
    padding-left: 2.9rem;
    font-size: 0.4rem;
    box-sizing: border-box;
    span{
      position: absolute;
      top: 0.1rem;
      left: 0;
    }
  }
  ul{
    width: 6.88rem;
    height: 2.72rem;
    font-size: 0.28rem;
    background: white;
    margin: auto;
    li{
      padding:0  0.3rem;
    }
    .title{
      height: 0.8rem;
      line-height: 0.8rem;
      border-bottom: 1px  solid $gray;
      margin-bottom: 0.2rem;
    }
    .money{
      height: 0.66rem;
      line-height: 0.66rem;
      display: flex;
      justify-content: space-between;
      span{
        font-size: 0.32rem;
      }
    }
  }
</style>
