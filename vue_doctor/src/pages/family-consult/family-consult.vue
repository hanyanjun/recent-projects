<template>
  <div class="container">
    <hw-switch :config="hwSwitch" v-on:event="change"></hw-switch>
    <div class="price" v-show="set.switch == '2'">
      <h6 class="title"><span>价格设置</span><span>{{set.price ?  price[priceIndex] + '元' : '未设置'}}/月</span></h6>
      <section>
        <span v-for="(item,index) in price">
          <!--<input type="radio" :id="index" :name="price.name" :value="item" >-->
          <label @click.stop="selectPrice(index)" :class="{'label-active' : index == priceIndex}">
          <h6>{{item}}{{item == '自定义' ? '' : '元'}}<span>每月</span><i v-show="index == 3">>></i></h6>
        </label>
        </span>
      </section>
    </div>
    <ul class="service" v-show="set.switch == '2'">
      <li class="title">服务选择</li>
      <!--<li @click.stop="selectService(index)" v-for="(item,index) in set.month"   :class="{'default' : index == 'm1'}">-->
      <li @click.stop="selectService(index)" v-for="(item,index) in set.month"  >
        <span class="service-price">
          <template v-if="index.split('m')[1] == '1'">
            {{index.split('m')[1] + '个月'}}/{{set.price ?  price[priceIndex]*index.split('m')[1]+'元' : '未设置'}}
          </template>
          <template v-else-if="index.split('m')[1] == '3'">
            {{index.split('m')[1] + '个月'}}/{{set.price ?  Math.floor(price[priceIndex]*index.split('m')[1]*0.9)+'元' : '未设置'}}
            <i v-show="index.split('m')[1] != '1'">9折</i>
          </template>
          <template v-else-if="index.split('m')[1] == '6'">
            半年/{{set.price ?  Math.floor(price[priceIndex]*index.split('m')[1]*0.8)+'元' : '未设置'}}
            <i v-show="index.split('m')[1] != '1'">8折</i>
          </template>
          <template v-else-if="index.split('m')[1] == '12'">
            全年/{{set.price ?  Math.floor(price[priceIndex]*index.split('m')[1]*0.7)+'元' : '未设置'}}
            <i v-show="index.split('m')[1] != '1'">7折</i>
          </template>
          <!--<span v-show="index == 'm1'">一个月为最短服务时间，默认必须开通</span>-->
        </span>
        <!--<label :class="{'checkActive' : item == 'on'}">{{index == 'm1' ?  (item == 'on' ? '默认开通' : '未设置') : (item == 'on' ? '已开通' : '点击开通')  }}</label>-->
        <label :class="{'checkActive' : item == 'on'}">{{item == 'on' ? '已开通' : '点击开通' }}</label>
      </li>
    </ul>
    <hw-button  config="保存" @event="submit" v-show="set.switch == '2'"></hw-button>
    <div class="tip" v-show="set.switch == '1'">
      <h6>推荐开通图文咨询（按期）服务</h6>
      <p>线上仅提供在线咨询服务，不作为诊断和治疗<br>医生可以自己设定咨询收费价格</p>
    </div>
  </div>
</template>
<script>
  import hwSwitch from '../../btns/hwSwitch'
  import serviceTips from '../../components/serviceTips'
  import {Toast,MessageBox} from '../../components/hw-components'
  //  import prompt from '../../components/prompt'
  export default{
    components : {
      hwSwitch,
      serviceTips
    },
    data(){return{
      price :  ['299','999','499','自定义','699'],
      priceIndex : 99,
      set : {price : '',switch : '',month : []},
      initSwitch : '',
      prompt : {show : false ,title : '请输入自定义价格',holder : '最多输入2000元',value : '',type : 'number',tip : '',limit : 2}
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '图文咨询设置', fn : '服务介绍', back : '',fShow : false, hShow : true});
      this.$api.gFamilySwitch().then(obj=>{
          delete obj.code;
          if(obj.price){
            obj.price = (obj.price).split('.')[0];
            this.set =  obj;
            this.price.forEach((v,i)=>{
              if(v == obj.price){
                this.priceIndex = i;
              }
            })
            if(this.priceIndex == 99){
              this.price[3] = obj.price;
              this.priceIndex = 3;
            }
          }
          this.set = obj;
          this.initSwitch = obj.switch;
//      设置prompt
        this.$store.commit('SET_PROMPT',this.prompt);
      })
    },
    computed : {
      hwSwitch(){
        return {
          title : '图文咨询（按期）',
          tip : this.set.switch == '2' ? '关闭后将不再为会员提供图文咨询（按期）服务' : '开启后将为会员提供图文咨询（按期）服务',
          status : this.set.switch == '2' ? true : false
        }
      }
    },
    mounted(){
      document.querySelector('.nav_back').onclick =()=>{
        if(this.set.switch == '2'){
          MessageBox.confirm('是否保存当前设置?').then(obj=>{
            this.submit();
          }).catch(obj=>{
            this.$router.routeBack();
          })
        }else{
          this.$router.routeBack();
        }
      };
      document.querySelector('.nav_submit').onclick=()=>{
          this.$router.push({path : '/family/serviceIntro'});
      }
    },
    methods : {
      change(v){
        if(this.initSwitch == '2' && v == '1'){
          MessageBox.confirm('确定关闭家庭咨询?').then(obj=>{
            this.set.switch = v;
            this.$api.sFamilySwitch(this.set).then(obj=>{
              this.$store.commit('IS_UPDATE_DOCINFO',true);
            });
          })
        }else{
          this.set.switch = v;
        }
      },
      selectPrice(i){
        if(i == 3){
          this.prompt.show = true;
          this.prompt.callback =(t)=>{
            if(t == '取消'){
              this.prompt.show = false;
            }else{
              this.prompt.value = t;
              if(parseFloat(t) > 2000){
                this.prompt.tip = '价格不得超过2000';
              }
              else if(parseFloat(t) < 1){
                this.prompt.tip = '价格不得小于1';
              }
              else if(t){
                this.prompt.tip = '';
                this.price[i] =  parseFloat(t);
                this.price = Object.assign({},this.price);
                this.priceIndex = i;
                this.set.price = parseFloat(t);
                this.prompt.show = false;
              }else{
                this.prompt.tip = '请输入价格！';
              }
            }
          }
        }else{
          this.priceIndex = i;
          this.set.price = this.price[i];
        }
      },
      selectService(i){
          if(this.set.price){
//              if(i != 'm1'){
                this.set.month[i] = this.set.month[i] == 'on' ? 'off' : 'on';
//              }
          }else{
              Toast('请先设置价格!');
          }
      },
      submit(){
        let set;
        set = Object.assign({},this.set);
        Object.assign(set,this.set.month);
        delete  set.month;
          if(set.switch == '2'){
              if(!set.price){
                Toast('请设置价格!');
              }else{
                  if(set.m1 == 'off' && set.m3 == 'off' && set.m6 == 'off' && set.m12 == 'off'){
                       Toast('请选择一种服务类型开通');
                  }else{
                    this.$api.sFamilySwitch(set).then(obj=>{
                      this.$store.commit('IS_UPDATE_DOCINFO',true);
                      this.$router.routeBack();
                    });
                  }
              }
          }else{
            this.$router.routeBack();
          }
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  span,h6{
    position: relative;
  }
  .price{
    height: 3.3rem;
    background: white;
    margin-top: 0.2rem;
    font-size: 0.32rem;
    padding:  0 0.3rem;
    .title{
      height: 0.76rem;
      line-height: 0.76rem;
      display: flex;
      justify-content: space-between;
    }
    span:nth-of-type(2){
      font-size: 0.26rem;
      color: $baseBlue;
    }
    section{
      padding:  0.2rem 0;
      height: 2.5rem;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      justify-content: space-between;
      align-content: space-between;

      input{
        display: none;
      }
      input[type=radio]:checked + label{
        color: $baseBlue;
      }
      label{
        display: inline-block;
        width: 2rem;
        height: 0.94rem;
        padding-top: 0.1rem;
        box-sizing: border-box;
        border-radius: 0.06rem;
        border: 1px solid $baseBlue;
        color: $fGray;
        position: relative;
        h6{
          text-align: center;
          font-size: 0.32rem;
          height: 0.74rem;
          line-height: 0.37rem;
          span{
            display: block;
            font-size: 0.26rem;
          }
          i{
            font-size: 0.26rem;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right:0.1rem;
            color: $baseBlue;
          }
        }
      }
      .label-active{
        background: $baseBlue;
        color: white;
      }
    }
  }
  .count{
    height: 1rem;
    line-height: 1rem;
    font-size: 0.32rem;
    background: white;
    margin-top: 0.2rem;
    padding: 0 0.76rem 0 0.3rem;
    display: flex;
    justify-content: space-between;
    span:nth-of-type(2){
      color: $fGray;
      font-size: 0.28rem;
    }
  }
  .fn-intro{
    display: block;
    margin-top: 0.2rem;
    height: 0.90rem;
    line-height: 0.90rem;
    padding:  0 0.3rem;
    font-size: 0.32rem;
    background: white;
  }
  .service{
    margin-top: 0.2rem;
    background: white;
    li{
      height: 1rem;
      border-bottom: 1px solid $gray;
      font-size: 0.32rem;
      line-height: 1rem;
      display: flex;
      padding:  0 0.3rem;
      justify-content: space-between;
      align-items: center;
      label{
        font-size: 0.26rem;
        color: $fGray;
        display: inline-block;
        width: 1.2rem;
        height: 0.5rem;
        text-align: center;
        line-height: 0.5rem;
        border-radius: 0.06rem;
        border: 1px solid $fGray;
      }
    }
    input{
      display: none;
    }
    .title{
      height: 0.7rem;
      line-height: 0.7rem;
    }
    .default{
      height: 1.36rem;
      line-height: 0.46rem;
      .service-price{
        span{
          display: block;
          font-size: 0.26rem;
          color: $fGray;
        }
      }
      label{
        border: 1px solid $fGray;
      }
      .checkActive{
          color: $baseBlue;
          border: 1px solid $baseBlue;
      }
    }
    .service-price{
      display: flex;
      align-items: center;
        i{
          display: inline-block;
          width: 0.6rem;
          height: 0.3rem;
          background: $orange;
          line-height: 0.3rem;
          color: white;
          font-size: 0.22rem;
          text-align: center;
          margin-left: 0.2rem;
          border-radius: 0.2rem;
        }
    }

    .checkActive{
      color: $baseBlue;
      border: 1px solid $baseBlue;
    }
    /* input[type=checkbox]:checked + label{
       color: $baseBlue;
       border: 1px solid $baseBlue;
     }*/
  }
  .icon-return-boldleft{
    color: $iconGray;
    transform: translateY(-50%) rotateY(180deg);
    font-size: 0.4rem;
    position: absolute;
    right: 0.3rem;
    top: 50%;
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
</style>
