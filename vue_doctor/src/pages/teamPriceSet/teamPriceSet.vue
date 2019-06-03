<template>
<div class="teamPriceSet">
  <div class="switch">
    <h6 class="type">
      <span>团队咨询</span><span>{{checked ? '关闭后将不再为患者提供图文咨询服务' : '开启后将为患者提供图文咨询服务'}}</span>
    </h6>
    <hwSwitch v-model="checked" @change="change"></hwSwitch>
  </div>
  <div class="priceSet" v-show="checked">
    <h6>价格设置</h6>
    <div class="input">
      <span class="text" @click.stop="input_price">{{price ? `${price}元` : '建议160元/次'}}</span>
      <!--<input type="number" :value="price" @input="handleInput($event)" style="line-height: 0;" placeholder="建议160元/次">-->
      <button @click.stop="price = 160.00">设置推荐</button>
    </div>
  </div>
  <h6 class="module" v-show="checked" @click.stop="numSet"><span class="type">每次回复消息条数</span> <span class="text">{{num ? `${num}条` : '未设置'}}</span><i class="icon icon-return-right"></i> </h6>
  <div class="content" v-show="checked">
    <div class="con_head">
      <span class="type">团队咨询服务说明</span>
    </div>
    <ul class="intro">
      <li><i class="circle"></i>团队咨询服务由领衔专家设置开通，其条数与领衔专家图 文咨询（单次）服务相同，资费由领衔专家设定（建议为 专家个人资费的80%）</li>
      <li><i class="circle"></i>团队成员均可回复会员咨询问题</li>
      <li><i class="circle"></i>在支付咨询24小时后，若未有医生回复，本服订单自动取消，咨询费用返还</li>
      <li><i class="circle"></i>团队咨询收入由领衔专家提现管理或委托智呼吸平台代为分发</li>
    </ul>
  </div>
  <div class="tip" v-show="!checked">
    <h6>推荐设置团队咨询服务</h6>
    <p>会员门诊后可以体验线上咨询的便利，<br>更有付费使用咨询服务的意愿</p>
  </div>
</div>
</template>

<script>
  import {Toast} from '../../components/hw-components'
import hwSwitch from "../../components/hwSwitch"
export default {
   name: "teamPriceSet",
    created(){
      this.$store.commit('UPDATE_NAV',{title : '团队咨询服务设置',theme : 'green', fn : '保存',hShow : true});
      this.id  = this.$route.params.id;
      this.$store.commit('SET_PROMPT',this.prompt);
      if(window.sessionStorage['teamPrice']){
        let set = JSON.parse(window.sessionStorage['teamPrice']);
        this.checked = set.switch == '2' ? true : false;
        this.price = set.price;
        this.num = set.num;
      }
    },
    mounted(){
      document.querySelector('.nav_submit').onclick = _=>{
        this.$api.teamChatSet(this.id,{
          switch : this.checked ? '2' : '1',
          price : this.price,
          num : this.num
        }).then(obj=>{
          window.sessionStorage.removeItem('teamPrice');
          this.$router.routeBack();
        })
      }
    },
    components:{hwSwitch},
    data(){return{checked : false, id : '' , price : '' , num : '',
      prompt : {show : false ,title : '请设置价格',holder : '建议160元/次',tip : '',value : '',  mold  : 'int'},}},
    methods:{
      change(){

      },
      input_price(){
        this.prompt.show = true;
        this.prompt.callback = (t) =>{
          let t1 = t;
          if(t1 == '取消'){
            this.prompt.show = false;
            this.prompt.tip = '';
          }else{
            if(t1.length  == 0 ){
              this.prompt.tip = '请输入合理价格';
            }else if(parseFloat(t1) > 300){
              this.prompt.tip = '价格最高300';
              this.prompt.value = '';
            }else{
              this.prompt.tip = '';
              this.prompt.value = t1;
              this.price = t1;
              this.prompt.show = false;
            }
          }
        }
      },
      numSet(){
        this.$picker1.setData(this.$hwdata.constultCount);
        this.$picker1.show(e=>{
          this.num = e[0].text;
        })
      }
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.teamPriceSet{
  line-height: 0;
  .switch{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding:  0 0.36rem 0 0.3rem;
    flex-wrap: wrap;
    height: 1.3rem;
    background: white;
    .type{
      line-height: 0;
      display: flex;
      flex-wrap: wrap;
      width: 4.8rem;
      span:nth-child(1){
        font-size: 0.32rem;
        display: block;
        color: $gray_a;
        line-height: 0.42rem;
        padding-top: 0.05rem;
      }
      span:nth-child(2){
        font-size: 0.26rem;
        color: $gray_b;
        line-height: 0.36rem;
      }
    }
  }
  .priceSet{
    margin-top: 0.2rem;
    background: white;
    padding: 0 0.3rem 0.5rem;
    margin-bottom: 0.2rem;
    h6{
      font-size: 0.32rem;
      color: $gray_a;
      line-height: 0.92rem;
    }
    .input{
      height: 0.6rem;
      line-height: 0.6rem;
      background: $gray_e;
      position: relative;
      padding-right: 1.3rem;
      .text{
        display: inline-block;
        width: 100%;
        height: 100%;
        font-size: 0.28rem;
        background: $gray_e;
        color: $gray_c;
        vertical-align: top;
        padding-left: 0.2rem;
        box-sizing: border-box;
      }
      input::-webkit-input-placeholder{
        color: $gray_c;
        font-size: 0.28rem;
        line-height: 0.5rem;
      }
      button{
        font-size: 0.28rem;
        color: $baseGreen;
        position: absolute;
        right: 0.1rem;
        top: 0;
        background: transparent;
      }
    }
  }
}

.module{
  font-size: 0.32rem;
  padding: 0 0.76rem 0 0.3rem;
  line-height: 1rem;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid $gray_e;
  background: white;
  color: $gray_a;
  position: relative;
  margin-bottom: .2rem;
  .icon{
    position: absolute;
    font-size: 0.34rem;
    color: $gray_c;
    line-height: 0.98rem;
    right: 0.3rem;
  }
  .text{
    font-size: 0.28rem;
    color: $gray_c;
    display: inline-block;
    text-align: right;
  }
}

.content{
  background: white;
  height: 6.4rem;
  .con_head{
    box-sizing: border-box;
    padding:0.28rem 0 0.12rem;
    width: calc(100% - 0.6rem);
    background: white;
    margin: 0 auto;
    font-size: 0.32rem;
    line-height: 0.4rem;
    color: $gray_a;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $gray_e;
    justify-content: space-between;
    .pre{
      font-size: 0.34rem;
      color: $gray_c;

    }
    .count{
      color: $gray_b;
      font-size: 0.32rem;
    }
  }
  .intro{
    font-size: 0.26rem;
    color: $gray_b;
    box-sizing: border-box;
    padding: 0.15rem 0.3rem 0.25rem;
    li{
      line-height: 0.36rem;
      padding: 0.1rem 0.1rem 0 0.34rem;
      box-sizing: border-box;
      position: relative;
      .circle{
        display: inline-block;
        width: 0.14rem;
        height: 0.14rem;
        border-radius: 50%;
        background: $gray_d;
        position: absolute;
        left: 0.1rem;
        top: 0.2rem;
      }
    }
  }
  .title{
    font-size: 0.28rem;
    line-height: 0.34rem;
    height: 0.68rem;
    overflow: hidden;
    color: $gray_b;
    border-top: 0.17rem solid white;
    border-bottom: 0.27rem solid white;
    padding: 0 0.3rem;
    margin-bottom: 0.2rem;
    background: white;
  }
}

.tip {
  padding-top: 1.5rem;
  h6 {
    line-height: 0.68rem;
    font-size: 0.32rem;
    margin-bottom: 0.4rem;
    text-align: center;
  }
  p {
    font-size: 0.28rem;
    line-height: 0.38rem;
    color: $fGray;
    text-align: center;
  }
}
</style>
