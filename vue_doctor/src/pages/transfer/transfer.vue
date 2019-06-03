<template>
<div class="container">
  <div class="content">
    <section class="acc">
      <i :class="`icon-${info.bank_code}-icon`">
        <span class="path1"></span><span class="path2"></span>
      </i>
      <span class="acc-type">{{info.bank_name}}<span class="acc-name">{{info.name}}</span></span>
    </section>
    <ul class="money">
      <li class="title"><span>提现金额</span> <span>无手续费</span></li>
      <li class="money-num"><i class="icon-RMB"></i><span :class="[{'font1' : count.value.length > 8},{'font2' : count.value.length > 12}]" @click.stop="focus">{{count.value}}<b class="cursor"></b></span><button @click.stop="all">全部提现</button></li>
      <li class="tip"><span :class="{'warning' : tip}">{{tip ? `金额已超过可提现金额`: `可提现余额￥${info.amount}`}}</span><a href="javascript:;" @click.stop="intro">提现功能介绍>></a></li>
    </ul>
    <button :class="['submit' , {'submit-active' : !tip && count.value > 0.99}]" @click.stop="submit">提现</button>
  </div>
  <key-board></key-board>
</div>
</template>

<script>
  import {MessageBox2,Toast} from  '../../components/hw-components'
  import keyBoard from '../../components/keyBoard'
export default{
    name : 'transfer',
    components : {keyBoard},
    data(){return{
        count : {
          show : false,
          point : true,
          value : '',
          limit : 16,
          keyShow : true
        },
        tip : false,
        info : ''
    }},
    mounted(){
          document.querySelector('.nav_submit').onclick =()=>{
              this.$router.push({path : '/transferHistory'});
          }
    },
    watch :{
      count :{
        handler : function(val,oldVal) {
          this.count.value = val.value.substring(0,this.count.limit);
          let money = this.info.amount;
          if(parseFloat(val.value) > parseFloat(money)){
              this.tip = true;
          }else{
              this.tip = false;
          }
        },
        deep: true
      }
    },
    methods:{
      all(){
          this.count.value = this.info.amount;
      },
      focus(){
        this.count.keyShow = true;
      },
      intro(){
        MessageBox2.confirm('智呼吸平台提现功能是实名认证医生将平台服务收入转入其本人微信钱包或银行卡的操作。<br> 规则说明：<br> 1.可提现余额是扣除平台分成比例后的可提现金额。<br> 2.除银行或微信钱包规定以外，平台不收取任何形式手续费。<br> 3.提现必须是实名认证医生且提现的账户为本人账户。<br> 4.银行卡提现额度每天最高额度5W；微信提现单笔最多2W，每天最高额度２W。<br> 5.申请提现后，受理日期1-3天，具体到账时间以短信通知为准。<br> 6.单笔最小提现金额1元。')
      },
      submit(){
          let obj ={
            transfer_type : this.info.bank_code == 'weixin' ? '1' : '2',
            amount : this.count.value,
            phone : this.info.phone,
            bank_name : this.info.bank_name
          }
          if(obj.amount < 1){
              Toast('提现金额不小于1元');
          }else{
            if(parseFloat(obj.amount) <= 20000){
              if(!this.tip && obj.amount){
                this.$router.push({path : 'addBankVerify',query : { amount : JSON.stringify(obj)}})
              }else{
                console.log('不提交申请');
              }
            }else{
                Toast('当日单笔最大提现金额为20000')
            }
          }
      }
    },
    created(){
      this.$store.commit('UPDATE_NAV',{title : '余额提现', fn:'提现记录',hShow : true , fShow : false});
      this.$store.commit('INIT_INPUT');
      this.count.show = true;
      this.$store.commit('SET_INPUT',this.count);
      this.info = JSON.parse(this.$route.query.info);
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
 @import "../../assets/css/common";
.container{
  overflow: hidden;
  .content{
    overflow-y: scroll;
    padding: 0.2rem 0.3rem;
    height: calc(100% - 5rem);
  }
  .acc{
    height: 1.35rem;
    border-bottom: 1px solid $gray;
    background: white;
    padding-left: 0.3rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    i{
      font-size: 0.78rem;
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
  }
  .money{
    padding:0  0.3rem;
    background: white;
    margin-bottom: 0.5rem;
      .title{
        padding-top: 0.1rem;
        height: 1rem;
        box-sizing: border-box;
        font-size: 0.28rem;
        line-height: 0.9rem;
        display: flex;
        padding-right: 0.5rem;
        justify-content: space-between;
      }
    .money-num{
      padding: 0.35rem 1.8rem 0.35rem 0.5rem;
      /*height: 1.3rem;*/
      display: flex;
      justify-content: flex-start;
      box-sizing: border-box;
      border-bottom: 1px solid $gray;
      position: relative;
      i{
        font-size: 0.42rem;
        position: absolute;
        left: 0;
        bottom: 0.46rem;
      }
      span{
        height: 0.7rem;
        line-height: 0.7rem;
        font-size: 0.8rem;
        width: 100%;
        position: relative;
        .cursor {
          display: inline-block;
          font-size: 0.32rem;
          width: 0.02rem;
          height: 90%;
          border-right: 1px solid $baseBlue;
          padding-right: 0.06rem;
          animation: ani 2s infinite alternate linear;
        }
        @keyframes ani {
          0%, 50%, 100% {
            border-right: 1px solid $baseBlue;
          }
          51% {
            border-right: 1px solid transparent;
          }
        }
      }
      .font1{
        font-size: 0.6rem;
      }
      .font2{
        font-size: 0.4rem;
      }
      button{
        font-size: 0.28rem;
        color: $baseBlue;
        position: absolute;
        bottom: 0.46rem;
        right: 0.5rem;
        background: white;
      }
    }
    .tip{
      font-size: 0.28rem;
      display: flex;
      height: 1rem;
      align-items: center;
      justify-content: space-between;
      .warning{
        color: red;
      }
    }
  }

  .submit{
    display: block;
    width: 6.9rem;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    font-size: 0.4rem;
    border-radius: 0.06rem;
    margin: auto;
    background: #66acff;
    color: #94c5ff;
  }
  .submit-active{
    color: white;
    background: $baseBlue;
  }
}
</style>
