<template>
<div class="callSet">
  <hw-switch :config="hwSwitch" v-on:event="change" ></hw-switch>
  <div class="tip" v-show="set.switch == '1'">
    <h6>推荐设置电话咨询服务</h6>
    <p>会员门诊后可以体验线上咨询的便利，<br>更有付费使用咨询服务的意愿</p>
  </div>
  <div class="content" v-show="set.switch == '2'">
    <a  href="javascript:;" @click.stop="selectTime" >通话时长设置<span>{{set.minute ? `${set.minute}分钟` : '请选择'}}</span><i class="icon-return-boldleft"></i></a>
    <a  href="javascript:;" @click.stop="selectPrice">价格设置<span>{{set.price ? `${set.price}元`  : '请选择'}}</span><i class="icon-return-boldleft"></i></a>
    <ul class="info">
      <h6><span class="line1"></span>电话咨询服务说明<span class="line2"></span></h6>
      <li><i class="circle"></i>电话咨询是患者向医生发起的有偿电话咨询服务模式</li>
      <li><i class="circle"></i>医生可自主设置通话时长及费用</li>
      <li><i class="circle"></i>患者购买该服务后，医生须在预约时间给患者回电， 若超过24小时未回电，则平台将自动取消该订单</li>
      <li><i class="circle"></i>与患者成功接通后，若完成了本次电话咨询，您可以在挂断电话后，点击“咨询结束”，即表示此次服务完成</li>
      <li><i class="circle"></i>平台将会对电话咨询通话录音。本录音仅为患者未听清医生建议时或作为凭证进行订单申诉时作收听使用，不可进行转录、传播等</li>
      <li><i class="circle"></i>如电话未接通或者有意外情况电话中断，您可以选择向患者重拨</li>
    </ul>
  </div>
  <button class="submit" v-show="set.switch == '2'" @click.stop="submit">保存</button>
</div>
</template>



<script>
import hwSwitch from '../../btns/hwSwitch'
import {MessageBox,Toast} from '../../components/hw-components'
export default {
  name: "callSet",
  data(){return{
    set : {switch : '1', price : '0', minute : '0'},
    prompt : {show : false ,title : '自定义价格',holder : '请输入自定义价格',tip : '',value : '', mold : 'int'},
    initSwitch : '',
  }},
  created(){
    this.$store.commit('UPDATE_NAV',{title : '服务设置', hShow : true , fShow : false});
    this.$api.getCallSetSwitch().then(obj=>{
      this.set = obj;
      this.initSwitch = obj.switch;
    })
  },
  components : {hwSwitch},
  methods:{
    change(v){
      if(this.initSwitch == '2' && v == '1'){
        MessageBox.confirm('确定关闭电话咨询设置?').then(obj=>{
          this.set.switch = '1';
          this.$api.setCallSwitch(this.set).then(_=>{
            this.$store.commit('IS_UPDATE_DOCINFO',true);
            this.set.switch = v;
          })
        })
      }else{
        this.set.switch = v;
      }
    },
    selectTime(){
      let data  = this.$hwdata.callSetMinute;
      this.$picker1.setData(data);
      this.$picker1.show(e=>{
        this.set.minute = e[0].value;
      })
    },
    selectPrice(){
      let data  = this.$hwdata.callSetPrice;
      this.$picker1.setData(data);
      this.$picker1.show(e=>{
        if(e[0].value == 'null'){
          this.$store.commit('SET_PROMPT',this.prompt);
          this.prompt.show = true;
          this.prompt.callback =(t)=>{
            t = t.trim();
            if(t == '取消'){
              this.prompt.show = false;
            }else{
              this.prompt.value = t;
              if(t.length == 0){
                this.prompt.tip = '请输入价格';
              }else if(t > 999){
                this.prompt.tip = '价格不可超过999';
              }else{
                this.prompt.tip = '';
                this.set.price = t;
                this.prompt.show = false;
              }
            }
          }
        }else{
          this.set.price = e[0].value;
        }
      })
    },
    submit(){
      this.$api.setCallSwitch(this.set).then(obj=>{
        this.$store.commit('IS_UPDATE_DOCINFO',true);
        this.$router.routeBack();
      });
    }
  },
  computed : {
    hwSwitch(){
      return {
        title : '电话咨询',
        tip : this.set.switch == '2' ? '关闭后将不再为会员提供电话咨询服务' : '开启后将为会员提供电话咨询服务',
        status : this.set.switch == '2' ? true : false
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.callSet{
  height: 100%;
  overflow: hidden;
  .tip {
    padding-top: 1.5rem;
    h6 {
      font-size: 0.32rem;
      margin-bottom: 0.4rem;
      text-align: center;
    }
    p {
      font-size: 0.28rem;
      color: $fGray;
      text-align: center;
    }
  }
  .content{
    padding-top: 0.2rem;
    height: calc(100% - 3rem);
    overflow: scroll;
    a{
      padding-left: 0.30rem;
      display: block;
      height: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.32rem;
      line-height: 1rem;
      padding-right: 0.74rem;
      margin-bottom: 0.2rem;
      color: $gray_a;
      text-align: left;
      position: relative;
      background: white;
      span{
        font-size: 0.32rem;
        color: $input_c;
      }
      &:nth-child(3){
        color: $gray_c;
      }
    }
  }
  .icon-return-boldleft{
    position: absolute;
    right: 0.4rem;
    color: $gray_c;
    transform: translateY(-50%) rotateY(180deg);
    font-size: 0.26rem;
    top: 50%;
  }
  .info{
    padding: 0.05rem 0.3rem 0.32rem;
    box-sizing: border-box;
    background: white;
    h6{
      font-size: 0.3rem;
      color: $gray_a;
      text-align: center;
      line-height: 0.9rem;
      position: relative;
      span{
        display: inline-block;
        width: 23%;
        height: 1px;
        background: $iconGray;
        position: absolute;
        top: 0.45rem;
      }
      .line1{
        left: 8%;
      }
      .line2{
        right: 8%;
      }
    }
    li{
      font-size: 0.28rem;
      color: $input_c;
      line-height: 0.42rem;
      padding-left: 0.26rem;
      margin-bottom: 0.16rem;
      position: relative;
      .circle{
        display: inline-block;
        width: 0.1rem;
        height: 0.1rem;
        background: $baseBlue;
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: 0.13rem;
      }
    }
  }
  .submit {
    display: block;
    margin: 0.2rem auto;
    width: 6.9rem;
    height: 1rem;
    line-height: 1rem;
    background: rgb(6, 147, 252);
    color: white;
    font-size: 0.4rem;
    text-align: center;
    border-radius: 0.06rem;
  }
}
</style>
