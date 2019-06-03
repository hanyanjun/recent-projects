<template>
<div class="container">
  <teamEmpty  :show="cards.length == 0" text="您还没有绑定银行卡作为账户，快去绑定吧" btn="去绑定" @submit="skip">
    <i class="icon-team-acc" slot="icon"></i>
  </teamEmpty>
</div>
</template>

<script>
import teamEmpty from "../../components/teamEmpty"
export default {
   name: "teamBankManage",
   created(){
      this.$store.commit('UPDATE_NAV',{title : '绑定', fShow : false,hShow : true});
      this.id = this.$route.params.id;
      this.$api.teamBankList(this.id).then(obj=>{
        let myCard;
         this.$store.commit('BANK_CARDS',obj.cards);
         myCard = obj.my_card;
         if(!myCard){
           this.t.select = [{icon : 'icon-team-acc' , text : '添加新的银行卡', suf : 'icon-return-right',style : [{paddingLeft : '0.34rem'}],iconStyle :[{marginRight : '0.26rem'}],method:()=>{
               this.t.show = false;
               this.$router.push({path : '/addBank'});
             }}]
         }else{
           this.t.select = [
             {icon : `icon-${myCard.bank_code}-icon` , text : myCard.bank_name + '</br> <i style="font-size: 0.24rem;color: #999;">选择个人收款账户为团队收款账户</i>', suf : 'icon-return-right',style : [{paddingLeft : '0.34rem'}],iconStyle :[{marginRight : '0.26rem'}],
              method:()=>{
                this.t.show = false;
                this.$router.push({path : '/addBankVerify',query : {info : JSON.stringify(myCard)}});
              }},
             {icon : 'icon-team-acc' , text : '添加新的银行卡', suf : 'icon-return-right',style : [{paddingLeft : '0.34rem'}],iconStyle :[{marginRight : '0.26rem'}],method:()=>{
                 this.t.show = false;
                 this.$router.push({path : '/addBank'});
               }}];
         }
       });
   },
   components:{teamEmpty},
   data(){return {
      t : {
        show : false,
        head : [{text : '绑定银行卡'}],
        selectStyle : [{height : '4.5rem',borderBottom : '1px solid #edeff0'}],
        select : [],
          btn : [{text : '取消', method : ()=> {
              this.t.show = false;
            }}]
      },
      id: '',
      myCard : ''
   }},
   methods:{
     skip(){
       this.t.show =  true;
       this.$store.commit('SET_SHEET_SELECT',this.t);
     }
   },
   computed:{
     cards(){
       return this.$store.state.bankCards;
     }
   }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
</style>
