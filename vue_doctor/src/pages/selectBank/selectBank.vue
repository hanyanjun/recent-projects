<template>
<div class="container">
  <h6>支持银行</h6>
  <ul>
    <li v-for="item in bank" @click.top="back(item)"> <i :class="`icon-${item.code}-icon`"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i> {{item.name}}</li>
  </ul>
</div>
</template>

<script>
export default{
    name : 'selectBank',
     data(){return{bank :''}},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '选择银行', hShow : true , fShow : false});
//      if(this.$route.query.card){
//        this.bank = JSON.parse(this.$route.query.bank);
//      }
      this.$api.bankList().then(obj=>{
          this.bank = obj.banks;
      })
    },
    methods : {
      back(v){
        let obj = {
          code : v.code,
          name : v.name
        }
        // console.log(v);
          this.$router.routeBack({bank : JSON.stringify(obj) , card : this.$route.query.card});
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
  .container{
    h6{
      font-size: 0.26rem;
      height: 0.66rem;
      line-height: 0.66rem;
      padding-left: 0.3rem;
      color: #595757;
    }
    ul{
      padding-left: 0.5rem;
      background: white;
      li{
        height: 1rem;
        font-size: 0.32rem;
        line-height: 1rem;
        display: flex;
        padding-left: 0.02rem;
        align-items: center;
        border-bottom: 1px solid $borderGray;
        i{
          margin-right: 0.28rem;
        }
        .icon-0303-icon{
          font-size: 0.3rem;
          margin-right: 0.2rem;
        }
        .icon-0309-icon{
          margin-right: 0.2rem;
        }
      }
    }
  }
</style>
