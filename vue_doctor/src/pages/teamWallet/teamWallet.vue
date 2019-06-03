<template>
  <div class="container">
    <div class="walletHead">
      <div class="pagenav">
        <a href="javascript:;" @click.stop="back" class="icon-return-boldleft"></a>
        <span :class="{'icon-money-show': state == '1','icon-money-none': '0'}" style="font-size: .45rem;" @click.stop="isVisible"></span>
      </div>
      <div class="pagehead">
        <div class="title">可提现余额(元)</div>
        <div class="price"><span >{{ state == '1' ? (money.transfer_amount*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g,'$1,') : '******'}}</span></div>
        <div class="unprice">
          <div>待结算金额：{{state == '1' ? (money.unsettled_amount*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g,'$1,') : '******'}}<span class="icon-question" @click.stop = "intorduce"></span></div>
          <div><a href="javascript:;" @click.stop="jump" class="userInfo">收入记录</a></div>
        </div>
      </div>
      <div class="pagebg">
        <div class="functions">
          <nav>
            <a href="javascript:;" @click.stop="moneyAccount"><i class="icon icon-team-bill"> </i>对账单</a>
            <a href="javascript:;" @click.stop="transfer"><i class="icon icon-team-transfer"> </i>提现</a>
            <a href="javascript:;" @click.stop="account"><i class="icon icon-teamAcc">
              <i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i><i class="path5"></i>
            </i>收款账户</a>
          </nav>
          <router-link :to="`/${id}/teamPriceSet`" class=" trans"><span class="text">团队咨询服务设置</span> <i class="icon-return-boldleft"></i></router-link>
          <a href="javascript:;" class=" trans"><span class="text">团队咨询</span>
            <template v-if="set.switch == '2'">
              <i class="status">已开通</i>
            </template> <template v-else>
              <i class="status unset">未设置</i>
            </template>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {MessageBox2,MessageBox,Toast} from '../../components/hw-components'
  export default{
    name : 'myWallet',
    data(){return{
      param: '1',
      state: '1',
      money: {transfer_amount : 0 , unsettled_amount : 0},
      id : '',
      set : {
        switch : '1'
      }
    }},
    created (){
      this.$store.commit('UPDATE_NAV',{title : '',fn : '', router : '/my', fShow : false, hShow : false});
      this.id = this.$route.params.id;
      window.sessionStorage['walletType'] = JSON.stringify({type : 'team', id : this.id});
      this.$api.checkTeamMoney(this.id).then(obj=>{
        this.money = obj;
      });
      this.$api.teamBankList(this.id).then(obj=>{
        this.$store.commit('BANK_CARDS',obj.cards);
      });
      this.$api.teamDetail(this.id).then(obj=>{
        this.set = obj.teamChatSet;
        window.sessionStorage['teamPrice'] = JSON.stringify(obj.teamChatSet);
      })
    },
    computed:{
      info(){
        return this.$store.state.docInfo;
      },
      cards(){
        return this.$store.state.bankCards;
      }
    },
    methods : {
      isVisible(){
        if(this.state=='1'){
          this.state ='0';
        }else {
          this.state ='1';
        }
      },
      back(){
        this.$router.routeBack();
      },
      intorduce(){
        MessageBox2.confirm('该金额将在订单开始T+7天后转入可提现余额。')
      },
      jump(){
        this.$router.push({path : '/incomeDetail'});
      },
      transfer(){
        if(this.cards.length == 0){
          this.$router.push({path : 'teamBankManage'});
        }else{
          if(this.money.transfer_amount <= 1){
            Toast('您的可提现余额需大于1元。');
          }else{
            this.$router.push({path : '/transferAccount',query : { amount : (this.money.transfer_amount).toString()}});
          }
        }
      },
      account(){
        if(this.cards.length == 0){
          this.$router.push({path : 'teamBankManage'});
        }else{
          this.$router.push({path : '/accountManage'});
        }
      },
      moneyAccount(){
        this.$router.push({path : '/moneyAccount'});
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/common";
  .walletHead{
    background: url(../../assets/media/img/teamWalletBg.png) no-repeat left top;
    background-size: 100% 4.2rem;
  }
  .pagenav{
    height: .87rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: space-between;
    span,a{
      display: inline-block;
      font-size: 0.36rem;
      height: 0.87rem;
      line-height: 0.87rem;
      color: #fff;
      padding: 0 .3rem;
    }
  }
  .pagehead{
    font-size: 0.32rem;
    overflow-y: visible;
    color: #fff;
    .title{
      height: 0.32rem;
      line-height: 0.32rem;
      text-align: center;
      margin-bottom: .55rem;
    }
    .price{
      font-size: .8rem;
      height: .8rem;
      line-height: .8rem;
      text-align: center;
    }
    .unprice{
      height: 0.94rem;
      display: flex;
      justify-content: space-between;
      overflow-y: visible;
      div{
        font-size: .28rem;
        padding-left: .3rem;
        margin-bottom: 0.12rem;
        /*height: 100%;*/
        /*line-height: 1.48rem;*/
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        span{
          display: inline-block;
          font-size: 0.28rem;
          margin-left: .3rem;
          margin-bottom: 0.04rem;
          /*height: 1.48rem;*/
          /*line-height: 1.48rem;*/
        }
        a{
          color: #fff;
          border-left: 1px solid #fff;
          border-top: 1px solid #fff;
          border-bottom: 1px solid #fff;
          text-align: center;
          height: .52rem;
          line-height: .52rem;
          width: 1.8rem;
          -webkit-border-radius: .15rem 0 0 .15rem;
          -khtml-border-radius: .15rem 0 0 .15rem;
          -moz-border-radius: .15rem 0 0 .15rem;
          -ms-border-radius: .15rem 0 0 .15rem;
          -o-border-radius: .15rem 0 0 .15rem;
          border-radius: .15rem 0 0 .15rem;
        }
      }
      div:nth-of-type(2){
        margin-bottom: 0;
      }
    }
  }
  .pagebg{
    height: 1.38rem;
    position: relative;
    .functions{
      width:7.5rem;
      /*height:2.85rem;*/
      /*background:#fff;*/
      position: absolute;
      top: 0.6rem;
      left: 0;

      .trans{
        background: #fff;
        height: 1rem;
        display: flex;
        padding: 0 .35rem 0 0.5rem;
        position:relative;
        margin-top: 0.2rem;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid $gray_e;
        color: $gray_a;
        .text{
          font-size: 0.32rem;
          line-height:1rem;
        }
        .icon-return-boldleft{
          color: #c9caca;
          -webkit-transform: translateY(-50%) rotateY(180deg);
          transform: translateY(-50%) rotateY(180deg);
          font-size: 0.4rem;
          position: absolute;
          right: 0.3rem;
          top: 50%;
        }
      }
      &>:nth-child(3){
        margin-top: 0;
      }
      .status{
        color: $baseGreen;
        font-size: 0.24rem;
        line-height: 1rem;
      }
      .unset{
        color: $gray_c;
      }
    }
    nav{
      padding: 0.66rem 0.8rem 0.3rem;
      box-sizing: border-box;
      background: white;
      display: flex;
      justify-content: space-between;
      font-size: 0.28rem;
      border-bottom: 1px solid $gray;
      a{
        display: flex;
        font-size: 0.28rem;
        line-height: 0.88rem;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: space-between;
        text-align: center;
        .icon{
          display: inline-block;
          width: 1.2rem;
          height: 1.2rem;
          border-radius: 50%;
          text-align: center;
          line-height: 1.2rem;
          font-size: 0.6rem;
        }
        &:nth-child(1) > .icon{
          background: $lightBlue_c;
        }
        &:nth-child(2) > .icon{
          background: $grange_c_3;
        }
        &:nth-child(3) > .icon{
          background: $lightBlue_b;
          font-size: 0.5rem;
          &:before{
            color: white;
          }
        }
        i{
          display: block;
          margin: auto;
        }
      }
    }
  }
  .operate{
    background: #fff;
    font-size: .32rem;
    margin-bottom: .2rem;
    div{
      height: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 .3rem;
      border-bottom: 1px solid $gray;
      span{
        display: inline-block;
        font-size: 0.28rem;
        color: #c9caca;
      }
    }
    div:nth-last-of-type(1){
      border-bottom: none
    }
  }
  .myService{
    font-size: 0.32rem;
    height: .8rem;
    line-height: .8rem;
    background: #fff;
    border-bottom: 1px solid $gray;
    padding: 0 .3rem;
    // margin-top: 1.67rem;
    margin-top: 2.27rem;
  }
</style>
