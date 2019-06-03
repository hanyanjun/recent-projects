<template>
<div class="hw-search-container">
  <form action=""  @submit.stop="submit" :style="wrapStyle">
    <template v-if="isFocus">
        <input type="search" v-model="text"  @focus.top="efocus"  :class="[{'close': close}]" ref="input">
    </template>
    <template v-else>
      <input type="search"  readonly="true"  v-model="text"  onfocus="this.blur()"  :class="[{'close': close}]"  @click.stop="click">
    </template>
    <span :class="['icon',pos]" v-show="!text" @click.stop="iFocus">
    <i class="icon-search"></i>
    {{holder}}
  </span>
  </form>
  <span class="close-icon"  @click.stop="clear">
    <i class="icon-close" v-show="text && close"></i>
  </span>
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
          default : '搜索'
      },
      wrapStyle:{
        type : Object,
        default : function () {
          return {};
        }
      }
    },
    watch:{
        text(v){
            this.$emit('input',v);
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
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../assets/css/common";
.hw-search-container{
  height: 100%;
  line-height: 0;
  position: relative;
  form,input{
    display: inline-block;
    height: 100%;
    width: 100%;
    padding-left: 0.35rem;
    box-sizing: border-box;
    font-size: 0.28rem;
    border-radius: 0.1rem;
  }
  form{
    padding-left: 0;
    background: #f1f2f2;
  }
  .close{
    padding-right: 0.6rem;
  }
  ::-webkit-search-cancel-button{
    -webkit-appearance: none;//此处只是去掉默认的小×
  }
  .icon{
    display: flex;
    align-items: center;
    height: 100%;
    font-size: 0.28rem;
    position: absolute;
    left: 0.35rem;
    color: $i2Gray;
    top:0;
    i{
      font-size: 0.36rem;
      margin-right: 0.16rem;
    }
  }
  .middle{
    left: 50%;
    transform: translateX(-50%);
  }
  .close-icon{
     padding: 0.2rem;
     position: absolute;
     right:0;
     top: 50%;
    transform: translateY(-50%);
    .icon-close{
      font-size: 0.38rem;
      &:before{
        color: $fGray;
      }
    }
  }
}
</style>
