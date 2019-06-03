<template>
<div class="container">
  <div class="content">
    <p>本次操作需要短信验证确认，请输入<br><span>{{info.phone ? `${info.phone.substr(0, 3)}****${info.phone.substr(7)}` : `${phone.substr(0, 3)}****${phone.substr(7)}`}}</span> 收到的短信校验码</p>
    <h6>校验码 <span class="hw-input-holder" @click.stop="focus">
    <span :class="{'code-active' : code.show && code.value}">{{code.show ?  code.value :  (code.value ? code.value : '请输入验证码')}}</span>
    <i class="cursor" v-show="code.show"></i>
  </span> <i class="icon-clear"  :style="{'visibility' : code.show && code.value ? 'visible' : 'hidden'}"@click.stop="clear"></i> <button @click.stop="sendCode" :class="{'active': codeText != '点击发送'}">{{codeText}}</button></h6>
    <button class="submit submit-active" @click.stop="submit">确定</button>
  </div>
  <num-keyboard></num-keyboard>
</div>
</template>

<script>
  import numKeyboard from '../../components/numKeyboard'
  import {Toast} from '../../components/hw-components'
export default{
    name : 'addBankVerify',
    data(){return{
        info : {},
        codeClick : true,
        codeText : '点击发送',
        code : {
            show : false,
            limit : 6,
            point : false,
            value : '',
            keyShow : true
        },
    }},
    watch :{
      code :{
          handler : function(val,oldVal) {
             this.code.value = val.value.substring(0,this.code.limit)
          },
          deep: true
      }
    },
    computed:{
      phone(){
          return this.$store.state.docInfo.phone;
      },
      walletType(){
        return this.$store.state.walletType;
      }
    },
    components : {numKeyboard},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '手机号验证', hShow : true , fShow : false});
      if(this.$route.query.info){
        this.info = JSON.parse(this.$route.query.info);
      }else if(this.$route.query.amount){
        this.info = JSON.parse(this.$route.query.amount);
      }
      this.$store.commit('INIT_INPUT');
      this.$store.commit('SET_INPUT',this.code);
    },
    mounted(){
      document.querySelector('.nav_back').onclick=(e)=>{
        this.$router.routeBack('',1);
      }
    },
    methods:{
        sendCode(){
          let time;
          let count = 60;
          if(this.codeClick){
            //体现操作
            if(this.$route.query.amount){
                switch (this.walletType.type){
                  case 'team':
                    this.$api.teamAmountCode({phone : this.phone});
                  break;
                  default:
                    this.$api.amountCode({phone : this.phone});
                }
              //绑卡操作
            }else if(this.$route.query.info){
              switch (this.walletType.type){
                case 'team':
                  this.$api.teamBankCardCode({phone : this.phone});
                  break;
                default:
                  this.$api.bankCardCode({phone : this.phone});
              }
              //绑微信钱包操作
            }else{
              switch (this.walletType.type){
                case 'team':
                  break;
                default:
                  this.$api.weixinCode({phone : this.phone});
              }
            }
            this.codeText = `${count}s`;
            time = setInterval(()=>{
              count--;
              this.codeText = `${count}s`;
              if(count == 0){
                this.codeText = '重新获取';
                clearInterval(time);
                this.codeClick = true;
              }
            },1000)
          }
          this.codeClick = false;
        },
        submit(){
            let code = this.code.value;
            if(code){
              this.info.verify_code = code;
              //绑卡操作
              if(this.$route.query.info){
                switch (this.walletType.type){
                  case 'team':
                    this.$api.teamAddBankCard(this.walletType.id,this.info).then(obj=>{
                      this.$router.routeBack('',1);
                    })
                    break;
                  default:
                    this.$api.addBankCard(this.info).then(obj=>{
                      this.$router.routeBack('',1);
                    })
                }
              }
              //提现操作
              else if(this.$route.query.amount){
                switch (this.walletType.type){
                  case 'team':
                    this.$api.teamTransfer(this.walletType.id,this.info).then(obj=>{
                      this.$router.push({path : '/transferPlan' ,query :{ info : JSON.stringify({bank_name : this.info.bank_name , time : obj.transfer_time , order : obj.transfer_no})}});
                    })
                    break;
                  default:
                    this.$api.transfer(this.info).then(obj=>{
                      this.$router.push({path : '/transferPlan' ,query :{ info : JSON.stringify({bank_name : this.info.bank_name , time : obj.transfer_time , order : obj.transfer_no})}});
                    })
                }
              }
              //微信绑定操作
              else{
                this.$api.addWeixin(this.info).then(obj=>{
                  this.$router.push({path : '/vertifyResult'});
                })
              }
            }else{
              Toast('请输入验证码!');
            }
        },
        focus(){
          this.code.show = true;
        },
        clear(){
          this.code.value = '';
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
  .container{
    overflow: hidden;
    .content{
      height: calc(100% - 5rem);
      overflow-y: scroll;
    }
    p{
      font-size: 0.34rem;
      color: $fGray;
      text-align: center;
      padding: 0.7rem 0 0.56rem;
      background: white;
      span{
        color: black;
      }
    }
    h6{

      height: 1rem;
      padding: 0 0.3rem;
      font-size: 0.32rem;
      background: white;
      margin-top: 0.2rem;
      line-height: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      button{
        display: inline-block;
        width: 2rem;
        height: 0.6rem;
        line-height: 0.6rem;
        padding: 0 0.3rem;
        background: $baseBlue;
        color: white;
      }
      .hw-input-holder {
        width: 2.4rem;
        align-items: center;
        height: 100%;
        display: flex;
        color: $fGray;
        align-items: center;
        font-size: 0.32rem;
      }
      .cursor {
        display: inline-block;
        font-size: 0.32rem;
        width: 0.02rem;
        height: 0.32rem;
        border-right: 1px solid $baseBlue;
        padding-right: 0.06rem;
        animation: ani 2s infinite alternate;
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
    .icon-clear{
      font-size: 0.37rem;
      &:before{
        color: #c9caca;
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
      margin: 1.24rem auto 0;
      color: white;
      background: $baseBlue;
    }
    .active{
      color: $fGray;
      background: $gray;
    }
    .code-active{
      color: black;
    }
  }
</style>
