<template>
<div v-show="weixin || cards.length != 0">
  <div class="weixin" v-if="walletType.type == 'self'">
    <span class="icon-weixin-bg" @click.stop="skip2">
      <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span>
    </span>
      <h6>微信钱包<span>{{name}}</span></h6>
      <button class="status" v-show="weixin != '3'"  @click.stop="skip2">{{weixinText}}</button>
  </div>
  <section @click.stop="skip" v-show="cards.length == 0">
      <i class="icon-add-bank"></i>
      <h6><i class="icon-add"></i><span>添加银行卡</span></h6>
  </section>
  <div class="bank" v-for="(item,index) in cards" @click.stop="skip1(item)">
    <span :class="['icon-bank',`icon-${item.bank_code}-bg`]">
                <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span>
  </span>
    <h6 class="name">{{item.bank_name}}</h6>
    <h6 class="num"> <span>****&nbsp;&nbsp;****&nbsp;&nbsp;****&nbsp;&nbsp;</span>{{item.card_number.substring(item.card_number.length - 4)}}</h6>
    <i class="fn" ></i>
    <button class="status1" @click.stop="skip1(item)" v-show="item.activation  != '2'">
          {{item.activation == '1' ? '激活中' : (item.activation == '2' ? '' : '激活失败')}}
    </button>
  </div>
</div>
</template>

<script>
  import {MessageBox,Toast} from '../../components/hw-components'
export default{
    name : 'accountManage',
    data(){return{
        cards : [],
        weixin : '',
        weixinText : ''
    }},
    mounted(){
      switch (this.walletType.type){
        case "team":
          this.$store.commit('UPDATE_NAV',{title : '收款账户', hShow : true , fShow : false,theme : 'green'});
          this.$api.teamBankList(this.walletType.id).then(obj=>{
            this.cards = obj.cards;
          })
        break;
        default :
          this.$store.commit('UPDATE_NAV',{title : '收款账户', hShow : true , fShow : false});
          this.$api.gBankCard().then(obj=>{
            this.cards = obj.cards;
            this.weixin = obj.wechat_real_name;
            switch (obj.wechat_real_name) {
              case '1':
                this.weixinText = '待激活';
                break;
              case '2':
                this.weixinText = '激活中';
                break;
              case '3':
                this.weixinText = '';
                break;
              case '4':
                this.weixinText = '验证失败';
                break;
            }
          })
      }
    },
    computed:{
      name (){
          return this.$store.state.docInfo.nick;
      },
      walletType(){
        return this.$store.state.walletType;
      }
    },
    methods:{
        skip(){
            this.$router.push({path : '/addBank'});
        },
        skip1(v){
            this.$router.push({path : '/deleBank' , query : {info : JSON.stringify(v)}})
        },
        skip2(){
            let status = this.weixin;
            if(status == '1' || status == '4'){
              window.location.href = `${DOCAUTHORIZELINK}?weixinpub_origin=old&location_url=wVertify`;
            }else if(status == '2'){
                Toast('该账户正在激活请耐心等待!');
            }else if(status = '3'){
                Toast('当前账户已激活!');
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../../assets/css/common';
.icon-weixin-bg{
  font-size: 2.1rem;
  display: block;
  text-align: center;
  position: relative;
}
  .weixin{
    padding-top: 0.2rem;
    position: relative;
    h6{
      position: absolute;
      font-size: 0.34rem;
      top:0.34rem;
      left: 1.5rem;
      text-align: left;
      /*padding-top: 0.1rem;*/
      line-height: 0.67rem;
      color: #cfecd7;
      span{
        font-size: 0.4rem;
        display: block;
        color: white;
      }
    }
  }
  .status{
    font-size: 0.28rem;
    color: white;
    position: absolute;
    right: 0.6rem;
    top: 1.08rem;
    padding: 0 0.1rem;
    line-height: 0.48rem;
    background: transparent;
    /*background: #61c17a;*/
    border: 1px solid white;
    border-radius: 0.06rem;
  }
  .status1{
    font-size: 0.28rem;
    color: white;
    position: absolute;
    right: 0.6rem;
    top: 0.92rem;
    padding: 0 0.1rem;
    line-height: 0.48rem;
    background: transparent;
    /*background: #61c17a;*/
    border: 1px solid white;
    border-radius: 0.06rem;
  }
  section{
    width: 6.9rem;
    height: 2.1rem;
    background: white;
    margin: 0.3rem auto;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    .icon-add-bank{
      font-size: 0.9rem;
      position: absolute;
      left: 0.3rem;
      top:0.2rem;
    }
    h6{
      width: 100%;
     color: $fGray;
      text-align: center;
      font-size: 0.4rem;
      height: 0.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-add{
        font-size: 0.5rem;
        margin-right: 0.2rem;
      }
      span{
        line-height: 0.6rem;
        vertical-align: top;
        display: inline-block;
      }
    }
  }
  .icon-bank{
    font-size: 2.12rem;
  }
  .bank{
    margin: 0.3rem auto;
    position: relative;
    font-size: 0.5rem;
    color: white;
    text-align: center;
  }
  .name{
    position: absolute;
    top:0.14rem;
    line-height: 0.67rem;
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
    line-height: 0.67rem;
    box-sizing: border-box;
    span{
      position: absolute;
      top: 0.1rem;
      left: 0;
    }
  }
  .fn{
    position: absolute;
    display: inline-block;
    width: 0.46rem;
    height: 0.1rem;
    background: url(../../assets/media/img/circle.png) no-repeat;
    background-size: 100% 100%;
    right: 0.6rem;
    top: 0.2rem;
    font-size: 0.47rem;
    /*:before{*/
      /*color: white;*/
    /*}*/
  }
</style>
