<template>
  <div :class="['container',{'active':spread}]">
    <a  href="javascript:;" @click.stop="spread = !spread" class="chat ">图文咨询（一年）<span>{{set.switch  == '2' ? '已开通' : '未开通'}}</span><i class="icon-return-boldleft"></i></a>
    <hw-switch :config="hwSwitch" v-on:event="change"></hw-switch>
    <div class="price" v-show="set.switch == '2'">
      <h6 class="title"><span>价格设置</span><span>{{set.price ? `${price[priceIndex]}元` : '未设置'}}</span></h6>
      <section>
        <span v-for="(item,index) in price">
          <label @click.stop="selectPrice(index)" :class="{'label-active' : index == priceIndex}">
          <h6>{{item}}{{item == '自定义' ? '' : '元'}}<i  v-show="index == 3">>></i></h6>
        </label>
        </span>
      </section>
    </div>
    <router-link  to="/familyAll/serviceIntro" class="chat chat_intro "> <i class="icon icon-intro"></i> 图文咨询（一年）服务介绍<i class="icon-return-boldleft"></i></router-link>
  </div>
</template>
<script>
  import hwSwitch from '../../btns/hwSwitch'
  import serviceTips from '../../components/serviceTips'
  import {Toast,MessageBox} from '../../components/hw-components'
  export default{
    components : {
      hwSwitch,
      serviceTips
    },
    data(){return{
      price :  ['1688','4588','2188','自定义','3088'],
      priceIndex : 99,
      set : {num : '' ,switch : '',price : ''},
      initSwitch : '',
      spread : false,
      prompt : {show : false ,title : '请输入自定义价格',holder : '最多输入7988元',value : '',type : 'number',tip : '',limit : 2}
    }},
    created(){
      this.$api.gFamilySwitch().then(obj=>{
        delete obj.code;
        obj.switch = obj.month['m12'] == 'on' ? '2' : '1';
        if(obj.price_whole_year){
          obj.price = parseInt(obj.price_whole_year);
          this.price.forEach((v,i)=>{
            if(v == obj.price){
              this.priceIndex = i;
            }
          })
          if(this.priceIndex == 99){
            this.price[3] = obj.price;
            this.priceIndex = 3;
          }
        }else{
          obj.price = obj.price_whole_year;
        }
        this.set = obj;
        this.initSwitch = obj.switch;
      })
    },
    computed : {
      hwSwitch(){
        return {
          title : '状态设置',
          tip : this.set.switch == '2' ? '关闭后将不再为会员提供图文咨询（按期）服务' : '开启后将为会员提供图文咨询（按期）服务',
          status : this.set.switch == '2' ? true : false
        }
      },
      info(){
        return this.$store.state.docInfo;
      },
      chatService(){
        return this.$store.state.chatService;
      }
    },
    watch : {
      chatService : {
        handler : function(v){
          if(v[1] && !v[2]){
            setTimeout(()=>{
              this.submit();
            },200);
          }
        },
        deep : true
      }
    },
    methods : {
      change(v){
        if(this.initSwitch == '2' && v == '1'){
          MessageBox.confirm('确定关闭图文咨询(一年)?').then(obj=>{
            this.set.switch = v;
          })
        }else{
          this.set.switch = v;
        }
      },
      selectPrice(i){
        this.$picker1.hide();
        if(i == 3){
          this.prompt.show = true;
          this.prompt.callback =(t)=>{
            if(t == '取消'){
              this.prompt.show = false;
            }else{
              this.prompt.value = t;
              if(parseInt(t) > 7988){
                this.prompt.tip = '价格不得超过7988';
              }
              else if(parseInt(t) < 798){
                this.prompt.tip = '价格不得小于798';
              }
              else if(t){
                this.prompt.tip = '';
                this.price[i] =  parseInt(t);
                this.price = Object.assign({},this.price);
                this.priceIndex = i;
                this.set.price = parseInt(t);
                this.prompt.show = false;
              }else{
                this.prompt.tip = '请输入价格！';
              }
            }
          }
//      设置prompt
          this.$store.commit('SET_PROMPT',this.prompt);
        }else{
          this.priceIndex = i;
          this.set.price = this.price[i];
        }
      },
      submit(){
        let set = this.set;
        if(this.set.switch == '2'){
          if(!set.price){
            Toast('请设置价格!');
            this.spread = true;
          }else if(parseInt(set.price) > 7988 || parseInt(set.price) < 798){
            Toast('价格范围798-7988!');
            this.spread = true;
          }else{
            this.$api.sFamilySwitch({
              price_whole_year : set.price,
              m12 : set.switch == '2' ? 'on' : 'off'
            }).then(obj=>{
              this.$store.commit('IS_UPDATE_DOCINFO',true);
              this.$store.state.chatService[2] = true;
              this.$store.state.chatService = Object.assign([],this.$store.state.chatService);
            });
          }
        }else{
          this.$api.sFamilySwitch({
            m12 : 'off'
          }).then(obj=>{
            this.$store.commit('IS_UPDATE_DOCINFO',true);
            this.$store.state.chatService[2] = true;
            this.$store.state.chatService = Object.assign([],this.$store.state.chatService);
          });
        }
      },
      setCount(){
        this.$picker1.setData(this.$hwdata.constultCount);
        this.$picker1.show(e=>{
          this.set.num = e[0].text;
        })
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .container{
    height: 1rem;
    overflow: hidden;
    margin-bottom: 0.2rem;
    .icon-return-boldleft{
      position: absolute;
      right: 0.4rem;
      color: $gray_c;
      transform: translateY(-50%) rotateY(180deg);
      font-size: 0.26rem;
      top: 50%;
      transform-origin: 50% 50%;
    }
  }
  .active{
    height: auto;
    .chat .icon-return-boldleft{
      transform: translateY(-50%) rotateZ(-90deg);
    }
    .chat_intro .icon-return-boldleft{
      transform: translateY(-50%) rotateY(180deg);
    }
  }
  span,h6{
    position: relative;
  }
  .price{
    background: white;
    font-size: 0.28rem;
    padding:  0 0.3rem;
    border-bottom: 1px solid $gray_e;
    .title{
      padding-top: 0.05rem;
      line-height: 0.88rem;
      display: flex;
      border-top: 1px solid $gray_e;
      justify-content: space-between;
    }
    span:nth-of-type(2){
      font-size: 0.26rem;
      color: $baseBlue;
    }
    section{
      padding-bottom: 0.3rem;
      height: 2.4rem;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      justify-content: space-between;
      align-content: space-between;
      position: relative;
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
          line-height: 0.74rem;
          color: $baseBlue;
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
      .label-active {
        background: $baseBlue;
        h6{
          color: white;
        }
      }
    }
  }
  .count{
    height: 1rem;
    line-height: 1rem;
    font-size: 0.28rem;
    background: white;
    padding: 0 0.76rem 0 0.3rem;
    display: flex;
    position: relative;
    color: black;
    justify-content: space-between;
    overflow: hidden;
    span:nth-of-type(2){
      color: $gray_c;
      font-size: 0.28rem;
    }
    .line{
      display: inline-block;
      height: 1px;
      background: $gray_e;
      width: calc(100% - 0.6rem);
      position: absolute;
      left: 0.3rem;
      bottom: 0;
    }
  }
  .fn-intro{
    display: block;
    height: 0.90rem;
    line-height: 0.90rem;
    padding:  0 0.3rem;
    font-size: 0.32rem;
    background: white;
  }
  .service{
    margin-top: 0.2rem;
    background: white;
    height: 5rem;
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
      .service-price span{
        display: block;
        font-size: 0.26rem;
        color: $fGray;
      }
      label{
        color: $baseBlue;
        border: none;
      }
    }
    .checkActive{
      color: $baseBlue;
      border: 1px solid $baseBlue;
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

  .chat{
    padding-left: 0.28rem;
    display: block;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.32rem;
    line-height: 1rem;
    padding-right: 0.74rem;
    color: $gray_a;
    text-align: left;
    position: relative;
    background: white;
    border-bottom: 1px solid $gray_e;
    span{
      font-size: 0.28rem;
      color: $baseBlue;
    }
    &:nth-child(3){
      color: $gray_c;
    }
    .icon{
      /*position: absolute;*/
      font-size: 0.36rem;
      margin-right: 0.16rem;
    }
  }
  .chat_intro{
    justify-content: flex-start;
    font-size: 0.28rem;
  }
</style>
