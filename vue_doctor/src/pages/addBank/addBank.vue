<template>
<div class="container">
   <div class="content">
     <h6 class="title">请绑定持卡本人的银行卡</h6>
     <ul class="info">
       <li class="name">持卡人 <span>{{info.name}}</span> <i class="icon-paraphrase" @click.stop="tip"></i></li>
       <li  @click.stop="selectBank">银行 <span> <i :class="['bank-icon', bank ?  `icon-${bank.code}-icon` : ''] ">
        <i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i>
    </i>{{bank.name}}</span> <i class="icon-return-right"></i>
       </li>
       <hw-input :config="card" @focus="cardFocus"  @input="cardChange"></hw-input>
     </ul>
     <!--<hw-input :config="phone" @focus="phoneFocus" @input="phoneChange"></hw-input>-->
     <h6 class="title">微信智能加密，保障您的用卡安全。
       <!--<a href="">了解安全保障</a>-->
     </h6>
     <button class="submit submit-active" @click.stop="submit">下一步</button>
   </div>
  <num-keyboard></num-keyboard>
</div>
</template>

<script>
  import numKeyboard from '../../components/numKeyboard'
  import hwInput from '../../components/hwInput'
  import {Toast,MessageBox2} from '../../components/hw-components'
export default{
    name : 'addBank',
    data (){return {
        bank : '',
        cardText : '',
        phoneText : '',
        card : {
            type : '卡号',
            holder : '请输入卡号',
            point : false,
            split : '4',
            limit : '21'
        }
//        phone :{
//            type : '手机号',
//            holder : '请输入银行预留手机号码',
//            point : false,
//            limit : '11'
//        }
    }},
    components : {numKeyboard,hwInput},
    computed:{
      info(){
          return this.$store.state.docInfo
      }
    },
    created(){
      this.$store.commit('UPDATE_NAV',{title : '添加银行卡', hShow : true , fShow : false});
      if(this.$route.query.bank){
          this.bank = JSON.parse(this.$route.query.bank);
      }
      if(this.$route.query.card){
          this.card.value = this.$route.query.card;
      }
    },
    methods :{
      selectBank(){
          this.$router.push({path : `/selectBank?card=${this.cardText}`});
      },
      cardChange(v){
          this.cardText = v;
      },
      submit(){
          let obj ={
              bank_code :  this.bank.code,
              bank_name : this.bank.name,
              card_number : this.cardText
          }
          let result = true;
          for(let key in obj){
              if(!obj[key]){
                  Toast('请填写完整内容!');
                  result = false;
              }
          }
          if(!result) return;
          this.$router.push({path : '/addBankVerify',query : {info : JSON.stringify(obj)}});
      },
      confirm(v){
          if(v.type == '卡号'){
              this.cardText = v.value;
          }else{
              this.phoneText = v.value;
          }
      },
      cardFocus(){
          this.phone.show = false;
      },
      tip(){
        MessageBox2.confirm('持卡人姓名默认为注册本人，不支持添加他人银行卡。')
      }
//      phoneFocus(){
//          this.card.show = false;
//      }
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
}
.title{
  height: 0.8rem;
  line-height: 0.8rem;
  padding-left: 0.3rem;
  font-size: 0.26rem;
  color: #595757;
  a{
    color: $baseBlue;
  }
}
.info{
  font-size: 0.32rem;
  background: white;
  margin-bottom: 0.2rem;
  overflow: hidden;
  li{
    height: 1rem;
    line-height: 1rem;
    padding-left: 0.3rem;
    overflow: hidden;
    border-bottom: 1px solid $gray;
  }
  li:nth-of-type(3){
    border-bottom: none;
  }
}
  li{
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }
  li span{
    width: 5.9rem;
    height: 1rem;
    display: flex;
    align-items: center;
    font-size: 0.32rem;
    line-height: 1rem;
    i{
      font-size: 0.6rem;
    }

  }
  .icon-paraphrase{
    font-size: 0.4rem;
    position: absolute;
    right: 0.3rem;
    top:50%;
    transform: translateY(-50%);
  }
  .icon-return-right{
    color: $iconGray;
    font-size: 0.4rem;
    position: absolute;
    right: 0.3rem;
    top: 0.3rem;
  }
  .bank-icon{
    margin-right: 0.26rem;
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
</style>
