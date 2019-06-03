<template>
<div class="container">
  <hw-switch :config="hwSwitch" v-on:event="change" v-show="!patAccount"></hw-switch>
  <div :class="['content', {'content1' : patAccount}]">
    <h6 class="servicetip" v-show="set.switch == '2'">{{patAccount ? '该会员可继续' :  '新会员可'}}<span class="blue">{{set.days == '0' ? '' : `在${set.days}天内`}}</span>免费发送<span class="blue">{{set.num == '0' ? '': set.num +'条' }}</span>消息</h6>
    <div class="set" v-show="set.switch == '2'">
      <h6>免费条数</h6>
      <section>
        <span v-for="(item,index) in count">
          <input type="radio" :id="`c${index}`" @click.stop="c1(item)" name="count" :value="item" :checked="item == selected1" style="display: none">
          <label :for="`c${index}`"><i class="recommend" v-show="index == 0" >荐</i> <span>{{item}}&nbsp;条</span></label>
        </span>
      </section>
    </div>
    <div class="set set1" v-show="set.switch == '2'">
      <h6>免费天数</h6>
      <section>
        <span v-for="(item,index) in select">
          <input type="radio" :id="`d${index}`" name="day" :value="item" @click.stop="c2(item)"  :checked="item == selected2"  style="display: none">
          <label :for="`d${index}`"><i class="recommend" v-show="index == 1">荐</i> <span>{{item}}&nbsp;天</span></label>
        </span>
      </section>
    </div>
    <div class="tip" v-show="set.switch == '1'">
      <h6>推荐设置免费随访服务</h6>
      <p>会员门诊后可以体验线上咨询的便利，<br>更有付费使用咨询服务的意愿</p>
    </div>
    <!--<h6 class="count" @click.stop="setCount" v-show="set.switch == '2'"><span>免费消息条数</span><span>{{set.num == '0' ? '无限制' : `${set.num}条`}}</span><i class="icon-return-boldleft"></i></h6>-->
    <section class="tips"  v-show="set.switch == '2' &&  !patAccount">
      <h6>免费随访服务说明：</h6>
      <span class="tips-text">免费随访服务是指新会员在向医生报到后，能够在医生设置的条数、天数内享受免费咨询服务体验。建议开启，会员在体验线上咨询的便利后，更有付费使用咨询服务的意愿。</span>
    </section>
  </div>
  <button class="submit" v-show="set.switch == '2'" @click.stop="submit">保存</button>
</div>
</template>

<script>
  import hwSwitch from '../../btns/hwSwitch'
  import {MessageBox,Toast} from '../../components/hw-components'
export default{
    name : 'freeSetting',
    data(){return{
        set : {switch : '', days : '0', num : '0'},
        select : ['2','3','5','7','15','30'],
        count : ['3','5','10','15','20','30'],
        initSwitch : '',
        selected2 : '',
        selected1 : '',
        patAccount : ''
    }},
    components : {hwSwitch},
    created(){
      let q  = this.$route.query.acc;
      if(q){
          this.patAccount = q;
          this.set.switch = '2';
          this.$store.commit('UPDATE_NAV',{title : '赠送免费咨询',fShow : false, hShow : true});
      }else{
        this.$store.commit('UPDATE_NAV',{title : '免费随访',fShow : false, hShow : true});
        this.$api.gFreeSetting().then(obj=>{
          this.set = obj;
          this.initSwitch = obj.switch;
          this.selected2 = obj.days  ? obj.days : '0';
          this.selected1 = obj.num ? obj.num : '0';
        })
      }
    },
    mounted(){
      document.querySelector('.nav_back').onclick =()=>{
          if(!this.patAccount && this.set.switch == '2'){
            MessageBox.confirm('是否保存当前设置?').then(obj=>{
              this.submit();
            }).catch(obj=>{
              this.$router.routeBack();
            })
          }else{
            this.$router.routeBack();
          }
      }
    },
    computed : {
      hwSwitch(){
        return {
          title : '免费随访',
          tip : this.set.switch == '2' ? '关闭后将不再为新会员提供免费随访服务' : '开启后将为新会员提供免费随访服务',
          status : this.set.switch == '2' ? true : false
        }
      }
    },
    watch:{
      selected2(){
        this.set.days = this.selected2;
      },
      selected1(){
        this.set.num = this.selected1;
      }
    },
    methods :{
        change(v){
          if(this.initSwitch == '2' && v == '1'){
            MessageBox.confirm('确定关闭随访设置?').then(obj=>{
              this.set.switch = v;
              this.$api.sFreeSetting(this.set).then(obj=>{
                this.$store.commit('IS_UPDATE_DOCINFO',true);
              });
            })
          }else{
            this.set.switch = v;
          }
        },
      setCount(){
            let count = this.count;
            this.$picker1.setData(count);
            this.$picker1.show(e=>{
              this.set.num = e[0].value;
            })
      },
      submit(){
          if(this.set.swich == '2' && (this.set.days == '0' || this.set.num == '0')){
              Toast('请至少选择一个！');
          }else{
              if(this.patAccount){
                 this.$api.psFreeSetting(this.patAccount,this.set).then(obj=>{
                   this.$router.routeBack();
                 })
              }else{
                this.$api.sFreeSetting(this.set).then(obj=>{
                  this.$store.commit('IS_UPDATE_DOCINFO',true);
                  this.$router.routeBack();
                })
              }
          }
      },
      c1(v){
          if(this.selected1 == v){
              this.selected1 = '0';
          }else{
            this.selected1 = v
          }
      },
      c2(v){
        if(this.selected2 == v){
          this.selected2 = '0';
        }else{
          this.selected2 = v;
        }
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../../assets/css/common';
.container {
  overflow: hidden;
  .content {
    height: calc(100% - 3rem);
    overflow-y: scroll;
    box-sizing: border-box;
    .set {
      padding-left: 0.3rem;
      background: white;
      margin-top: 0.2rem;
    }
    .count {
      height: 1rem;
      line-height: 1rem;
      position: relative;
      font-size: 0.32rem;
      background: white;
      margin-top: 0.2rem;
      padding: 0 0.76rem 0 0.3rem;
      display: flex;
      overflow-y: hidden;
      justify-content: space-between;
      span:nth-of-type(2) {
        color: $fGray;
        font-size: 0.28rem;
      }
    }
    h6 {
      padding-top: 0.1rem;
      font-size: 0.32rem;
      height: 0.68rem;
      line-height: 0.68rem;
      border-bottom: 1px solid $gray;
    }
    .tips h6{
      border-bottom: none;
    }
    section {
      font-size: 0.32rem;
      padding: 0.25rem 0.4rem 0.25rem 0;
      height: 2.2rem;
      display: flex;
      flex-wrap: wrap;
      box-sizing: border-box;
      align-content: space-between;
      justify-content: space-between;
      span {
        input[type=radio]:checked + label > i {
          color: $baseBlue;
          background: linear-gradient(to bottom right, white 50%, $baseBlue 50%);
        }
        input[type=radio]:checked + label {
          background: $baseBlue;
          color: white;
        }
        label {
          display: inline-block;
          width: 1.76rem;
          height: 0.65rem;
          border-radius: 0.06rem;
          text-align: center;
          border: 1px solid $baseBlue;
          line-height: 0.65rem;
          color: $baseBlue;
          position: relative;
          .recommend {
            position: absolute;
            left: 0;
            top: 0;
            display: inline-block;
            width: 0.6rem;
            height: 0.4rem;
            font-size: 0.22rem;
            line-height: 0.3rem;
            padding-left: 0.04rem;
            box-sizing: border-box;
            text-align: left;
            color: white;
            background: linear-gradient(to bottom right, $baseBlue 50%, white 50%);
          }
        }
      }
    }
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
    .servicetip {
      background: white;
      margin: 0.2rem 0;
      padding-left: 0.3rem;
      font-size: 0.28rem;
      .blue {
        color: $baseBlue;
      }
    }
    .set1 {
      margin-top: 0;
      padding-bottom: 0.4rem;
    }

    .tips {
      height: auto;
      box-sizing: border-box;
      padding: 0.20rem 0.54rem 0.27rem 0.3rem;
      /*border-bottom: 1px solid rgb(210, 210, 210);*/
      background: white;
      margin-top: 0.2rem;
      line-height: 0;
    }
    .tips h6 {
      height: 0.67rem;
      line-height: 0.67rem;
      font-size: 0.32rem;
      font-weight: normal;
      display: flex;
      justify-content: space-between;
    }
    .tips h6 span {
      color: rgb(3, 137, 251);
      font-size: 0.29rem;
    }
    .tips .tips-text {
      display: inline-block;
      width: 100%;
      font-size: 0.26rem;
      line-height: 0.44rem;
      color: $fGray;
    }
    /*}*/

    .icon-return-boldleft {
      color: $iconGray;
      top: 50%;
      transform: translateY(-50%) rotate(180deg);
      font-size: 0.4rem;
      position: absolute;
      right: 0.3rem;
    }
  }
  .content1{
    height: calc(100% - 1.5rem);
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
