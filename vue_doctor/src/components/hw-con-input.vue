<template>
<div class="hw-con-input">
  <h6 class="hw-con-input_title" v-show="title">{{title}}<span v-show="is_require">*</span> <span>{{maxLength ? `（${maxLength}字以内）` : ''}}</span> </h6>
  <textInput v-bind="$props" :value="value" @input="input" @focus="focus" @blur="blur"></textInput>
</div>
</template>

<script>
import textInput from "./textInput.vue"
export  default{
  props:{
    title : String,
    maxLength : String,
    is_require: Boolean,
    type : {
      type : String,
      default :  'textarea'
    },
    value: [String, Number],
    maxLength : String,
    row : {
      type : Number,
      default : 1
    },
    holder:{
      type : String,
      default : '请输入标题'
    },
    err :{
      type : Object,
      default : function () {
        return {code : '',errMsg : ''}
      }
    },
    code: '',
    resize:{
      type : Boolean,
      default : true
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    maxRows : [Number],
    minRows : [Number],
    maxHeight : String,
    minHeight :String,
    mold: String,
    operate:{
      type : Function,
      default : function () {

      }
    },
    trim: Boolean,
    br : Boolean //是否去掉换行符
  },
  components :{textInput},
  methods:{
     focus(){
         this.$emit('focus');
     },
     blur(){
         this.$emit('blur');
     },
    input(v){
        this.$emit('input',v);
    },
    // handleFun(){
    //   this.operate();
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../assets/css/common";
.hw-con-input{
  padding-top: 0.2rem;
  .hw-con-input_title{
    font-size: 0.32rem;
    line-height: 0.72rem;
    color: $gray_a;
    &>span:nth-of-type(1){
      color: $red_e;
    }
    &>span:nth-of-type(2){
      line-height: 0.72rem;
      font-size: 0.26rem;
      color: $gray_c;
    }
  }
}
</style>
