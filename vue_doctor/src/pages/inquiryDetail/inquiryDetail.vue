<template>
  <div class="container">
    <ul class="ill_desc">
      <h6>病情描述</h6>
      <div class="text">
        {{info.ill_desc ? info.ill_desc : '未填写'}}
      </div>
      <div class="images">
        <img src="" alt="" v-for="item in info.ill_imgs"  v-img="item" @click.stop="preView(item)">
      </div>
    </ul>
    <ul class="drug_desc">
      <h6>药物描述</h6>
      <div class="text">
          {{info.drug_desc ? info.drug_desc : '未填写'}}
      </div>
      <div class="images">
        <img src="" alt="" v-for="item in info.drug_imgs"  v-img="item"  @click.stop="preView(item)">
      </div>
    </ul>
  </div>
</template>

<script>
export default{
    name : 'inquiryDetail',
    data(){return{info : ''}},
    created(){
      this.$store.commit('SET_IMG_ARR',{way : 'clear' });
      let id = this.$route.params.id;
      this.$store.commit('UPDATE_NAV',{title : '诊前描述',fn : '', router : `userInfo`, fShow : false,hShow : true});
      this.$api.patInquiry(id)
        .then(obj=>{
            this.info = obj.inquiryData;
            let img = this.info.ill_imgs.concat(this.info.drug_imgs);
            this.$store.commit('SET_IMG_ARR',{way :'concat',msg : img});
        })
    },
    methods :{
        preView (src){
          this.$store.dispatch('wxImgView',src);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container{width: 100%;height: 100%;background: rgb(240,239,245);}
  ul{padding: 0 .4rem; background: rgb(255,255,255);margin-top: .2rem;}
  h6{font-size: .32rem;line-height: .8rem;}
  .text{font-size: .36rem;word-wrap: break-word;word-break: break-all;line-height: .4rem;color: rgb(209,209,208);min-height: 1.5rem;padding: .1rem 0;}
  .images{border-top: 1px solid rgb(220,220,220);text-align: center;padding: .1rem 0;height: 1.05rem;display: -webkit-box;-webkit-box-align:center;display: -webkit-flex;-webkit-align-items :center;display: flex;align-items: center;}
  .images img{width: 1rem;height: .8rem;margin-left: 1.5%;}
  .dialog-window-img{width: 100vw;height: 100vh;background: rgba(0, 0, 0, 0.6);position: fixed;top: 0;left: 0}
  .dialog-window-img .dialog-content-img{display: block;max-width: 80%;max-height: 80%;margin: auto;}
</style>
