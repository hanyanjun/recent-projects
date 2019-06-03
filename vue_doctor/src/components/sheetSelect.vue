<template>
<div class="sheetSelect" v-show="sheetSelect.show">
  <transition name="slider-bTt">
    <div class="sheet-select-con" v-if="sheetSelect.show">
      <h6 class="head" v-for="item in sheetSelect.head" :style="item.style" @click.stop="item.method()">{{item.text}}</h6>
      <div class="select-btn" :style="sheetSelect.selectStyle">
        <div class="btn" v-for="item in sheetSelect.select" :style="item.style" @click.stop="item.method()">
          <i :class="['icon',item.icon]" :style="item.iconStyle"><span class="path1"></span><span class="path2"></span></i>
          <span class="text" v-html="item.text"></span>
          <i :class="['suf',item.suf]"></i>
        </div>
      </div>
      <div class="fn-btn" v-for="item in sheetSelect.btn" :style="item.style" @click.stop="handleClick(item)">
         <button class="btn">{{item.text}}</button>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
export default {
   name: "sheetSelect",
   computed:{
     sheetSelect(){
       return this.$store.state.components.sheetSelect;
     }
   },
   methods:{
     handleClick(v){
       if(v.method){
          v.method();
       }
     }
   }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/common";
.sheetSelect{
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background:rgba(0,0,0,0.4);
  .sheet-select-con{
    width: 100%;
    position: absolute;
    bottom: 0;
    .head{
      font-size: 0.28rem;
      text-align: center;
      height: 0.84rem;
      line-height: 0.84rem;
      border-bottom: 1px solid $gray_e;
      background: white;
    }
    .select-btn{
      font-size: 0.32rem;
      color: $gray_a;
      background: white;
      padding-left: 0.3rem;
      .btn{
        height: 1.15rem;
        position: relative;
        text-align: center;
        display: flex;
        align-items: center;
        text-align: left;
        /*line-height: 1.15rem;*/
        padding-right: 0.2rem;
        border-bottom: 1px solid $gray_e;
        .icon{
          font-size: 0.58rem;
          display: inline-block;
          text-align: center;
        }
        .suf{
          font-size: 0.34rem;
          color: $gray_c;
          position: absolute;
          right: 0.4rem;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
    .fn-btn{
      line-height: 0;
      .btn{
        display: inline-block;
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        font-size: 0.28rem;
        color: $baseGreen;
        background: white;
      }
    }
  }
}
</style>
