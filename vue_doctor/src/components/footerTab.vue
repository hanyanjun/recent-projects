<template>
  <footer>
    <template v-for="(item,index) in arr">
      <router-link :to="item.to" tag="b" @click.native="change(index)"><i :class="['iconfont',item.c]">
        <i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i><i class="path5"></i><i class="path6"></i><i class="path7"></i><i class="path8"></i><i class="path9"></i>
      </i><span class="icon_text">{{item.name}}</span>
        <template v-if="index == '1'">
          <!--<i  :class="msgCount.toString().length < 2 ? 'circle1' : 'circle2'" v-show="msgCount != 0">{{msgCount > 99 ? '99+' : msgCount}}</i>-->
          <i  class="circle1" v-show="msgCount != '0'"></i>
          <!--<i  class="circle1"></i>-->
        </template>
        <!--<template v-else-if="index == '2'">-->
          <!--<i class="circle3" v-show="reportCount != 0"></i>-->
        <!--</template>-->
      </router-link>
    </template>
  </footer>
</template>
<script>
//import {mapMutations,mapGetters } from 'vuex'
  export default{
      name : 'footerTap',
      computed :{
          msgCount(){
              return this.$store.getters.msgCount.count;
          },
          reportCount(){
              return this.$store.getters.msgCount.reportCount;
          },
          arr(){
              return this.$store.state.footerTab;
          }
      },
      methods : {
          change(v){
              this.$store.commit('SET_FOOTER_TAB',v);
          }
     }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../assets/css/common";
  footer {
    width: 100%;
    height: 0.9rem;
    background: white;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid $bg;
    padding: 0 0.7rem;
    /*padding: 0 0.8rem;*/
    box-sizing: border-box;
     b{
       /*padding:0.1rem 0.25rem 0;*/
       width: 1rem;
        text-align: center;
       line-height:0.55rem;
       position: relative;
       display: flex;
       flex-direction: column;
       justify-content: flex-end;
       align-items: center;
       position: relative;
       span {
         display: block;
         text-align: center;
         line-height: 0.52rem;
         text-align: center;
         /*font-size: 0.24rem;*/
         color: #9fa0a0;
       }
       i:before{
         color: $gray_d;
       }
       .circle1{
         @include badge1();
         position: absolute;
         right: 0.26rem;
         top: 0.06rem;
         color: white;
         width: 0.14rem;
         height: 0.14rem;
       }
       .circle2{
         @include badge2();
         position: absolute;
         top:0.1rem;
         right:0.1rem;
       }
       .circle3{
         @include badge1();
         width: 0.16rem;
         height: 0.16rem;
         position: absolute;
         top:0.1rem;
         right:0.28rem;
       }

       //.icon-footer-message,
       //.icon-footer-my{
         //position: absolute;
         //top:0.16rem;
         //left: 50%;
         //transform: translateX(-50%);
       //}
     }
    .icon_text{
      font-size: 0.24rem;
      line-height: 1.6;
    }
    .iconfont{
      font-size: 0.42rem;
    }
  }
  .router-link-active{
    .iconfont{
      color: $baseBlue;
        &:before{
         font-size: 0.42rem;
        color: $baseBlue;
      }
    }
    span{
      color: $baseBlue;
    }
  }
</style>
