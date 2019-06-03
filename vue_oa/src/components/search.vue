<template>
  <div class="search-container">
    <form action=""  @submit.stop="submit">
      <template v-if="isFocus">
        <input type="search" v-model="text" :maxlength="maxlength"  :placeholder="holder" @focus.stop="efocus"  :class="[{'close': close}]" ref="input" :style="inputStyle">
      </template>
      <template v-else>
        <input type="search"  readonly="true" :maxlength="maxlength"  :placeholder="holder"  v-model="text"  onfocus="this.blur()"  :class="[{'close': close}]"  @click.stop="click" :style="inputStyle">
      </template>
      <span :class="['icon',pos]" v-show="!text" @click.stop="iFocus">
    <!--<i class="icon-search"></i>-->
    <!--{{holder}}-->
  </span>
    </form>
    <i class="iconfont icon-sousuo pointer" @click.stop="search"></i>
    <!-- <span class="close-icon pointer"  @click.stop="clear"> -->
    <!-- <i class="icon-close" v-show="text && close"></i> -->
  <!-- </span> -->
  </div>
</template>

<script>
  export default{
    data(){return {
      text : this.value,
    }},
    props : {
      value : {
        default : ''
      },
      pos :{
        type : String,
        default : ''
      },
      close : {
        type : Boolean,
        default : true
      },
      isFocus : {
        type : Boolean,
        default : true
      },
      focus : {
        type : Boolean,
        default : false
      },
      holder :{
        type : String,
        default : '搜索姓名、备注'
      },
      maxlength: {
        type : String,
        default : ''
      },
      inputStyle:{
        type : [Object,Array],
        default : function () {
          return {};
        }
      },
    },
    watch:{
      text(v){
        this.$emit('input',v);
      },
      value(v){
        this.text = v;
      }
    },
    methods:{
      efocus(){
        this.$emit('focus');
      },
      clear(){
        this.$emit('clear');
        this.text = '';
      },
      submit(e){
        e.preventDefault();
        this.$emit('submit');
      },
      click(){
        this.$emit('click');
      },
      search(){
        this.$emit('search');
      },
      iFocus(){
        if(this.isFocus){
          this.$refs.input.focus();
        }else{
          this.click();
        }
      }
    },
    mounted(){
      if(this.focus){
        this.iFocus();
      }
      this.$refs.input.addEventListener('keydown',(e)=>{
        if(e.keyCode == 13){
          this.$emit('search');
        }
      },false)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../assets/css/common";
  .search-container{
    height: 100%;
    width: 100%;
    line-height: 0;
    position: relative;
    form,input{
      display: inline-block;
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      font-size: 18px;
      border-radius: 5px;
      position: relative
    }
    input{
      padding-left: 12px;
      padding-right: 34px;
      line-height: 1;
      border-radius: 5px;
      font-size: 12px;
      border: 1px solid $gray_f1;
    }
    input::-webkit-input-placeholder{
        color: #d3d3d3;
        font-size: 12px;
    }
    input::-moz-placeholder{
      color: #d3d3d3;
        font-size: 12px;
    }
    input::-moz-placeholder {
      color: #d3d3d3;
        font-size: 12px;
    }
    input:-ms-input-placeholder{
      color: #d3d3d3;
        font-size: 12px;
    }
    ::-webkit-search-cancel-button{
      -webkit-appearance: none;//此处只是去掉默认的小×
    }
    // .close-icon{
    //   padding: 20px;
    //   position: absolute;
    //   right:0;
    //   top: 50%;
    //   transform: translateY(-50%);
    //   .icon-close{
    //     font-size: 20px;
    //     &:before{
    //         color: #d3d3d3;
    //     }
    //   }
    // }
    .icon-sousuo{
      position: absolute;
      font-size: 17px;
      right: 10px;
      top: 50%;
      margin-top: 0px;
      color: $gray_c;
    }
  }
</style>
