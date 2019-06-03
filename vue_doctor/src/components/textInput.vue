<template>
<div :class="['hw-text-input',resize ? 'hw-textarea' : 'hw-input',{'hw-text-input_err' : err.code == code && code && !focused} ]">
    <div class="text-padding" >
      <div class="text-wrap" :style="[{'height' : `${wH}px`},{'overflow' : scroll ? 'scroll' : 'hidden'}]">
        <textarea class="text" ref="input" :style="[{'height' : `${min_h}px`}]" >{{$means.br_n(value)}}</textarea>
        <template v-if="resize">
          <textarea name="" id="" cols=""  rows="" :maxlength="maxLength"   :placeholder="holder"  @keydown="operate" @input="handleInput" @blur="blur" @focus="focus"  :style="[{'height' : `${wH}px`}]"  :value="$means.br_n(value)"></textarea>
        </template>
        <template v-else>
          <input type="text"  :placeholder="holder" @blur="blur" :value="$means.br_n(value)" :maxlength="maxLength"  @keydown="operate"  @focus="focus"  @input="handleInput" :style="[{'height' : `${wH}px`}]">
        </template>
      </div>
    </div>
  <h6 class="input_err">{{err.errMsg}}</h6>

</div>
</template>

<script>
import calcTextareaHeight from './calcTextareaHeight';
export default{
    data(){return{
      focused : false,
      text : this.value,
      wH : '',
      i_h : 0, //初始基准的高度值  可以在css里面设置
      min_h : '',//最小高度 通过i_h*minRows获得
      scroll : false,
      s : 0
    }},
    props:{
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
      minRows : {
          type : Number,
          default : 1
      },
      maxHeight : String,
      minHeight : String,
      mold: String,
      operate:{
        type : Function,
        default : function () {

        }
      },
      trim: Boolean,  //是否去掉收尾空格
      br : Boolean //是否去掉换行符
    },
    mounted(){
      this.i_h = this.$refs.input.offsetHeight;
      this.s = document.documentElement.clientWidth;
      if(!this.minHeight &&  !this.minRows) return;
      if(this.minRows){
        this.min_h = this.minRows*this.i_h;
        this.$nextTick(()=>{
          this.resizeTextarea();
        })
      }
      if(this.minHeight){
        this.min_h = parseInt(this.minHeight)*this.s/750;
        this.$nextTick(()=>{
          this.resizeTextarea();
        })
      }
    },
    methods:{
      handleInput(event){
        let mold = this.mold;
        let v = event.target.value;
        // if(this.trim){
        //   if(/\s/.test(v[v.length - 1]) && !/\n/.test(v[v.length - 1])){
        //      v = v.substring(0, v.length - 1);
        //      event.target.value = v;
        //   }
        // }
        if(this.br){
          if(/\n/.test(v[v.length - 1])){
            v = v.substring(0, v.length - 1);
            event.target.value = v;
          }
        }
        switch (mold){
          case 'number':
          if (!/[0|1|2|3|4|5|6|7|8|9]/.test(v[v.length - 1])) {
            event.target.value = v.substring(0, v.length - 1);
          }
          break;
          case 'float':
             if(/./.test(v)){
                 if(v[v.length - 1] == '.' && v[v.length - 2] == '.'){
                     event.target.value = v.substring(0,v.length - 1);
                 }
                 if(v[0] == '.'){
                     event.target.value = '0.';
                 }
                 let arr =v.split('.');
                 if(arr.length >= 3){
                   event.target.value =  arr[0] + '.'+arr[1];
                 }
             }
          break;
        }
        const value = event.target.value;
        this.$emit('input', value);
        this.setCurrentValue(value);
      },
      setCurrentValue(value) {
        if (value === this.text) return;
        this.text = value;
      },
      resizeTextarea(){
        let mH = this.$refs.input.scrollHeight;
        let cH = this.$refs.input.clientHeight;
        let dH = mH - cH ;
        this.scroll = false;
        if(dH && this.maxRows && (this.maxRows - 1)*this.i_h  <=  dH){
          dH = (this.maxRows - 1)*this.i_h;
          this.scroll = true;
        }
        if(this.maxHeight){
          let max = parseInt(this.maxHeight)*this.s/750 - this.min_h;
          if(dH && max <= dH){
            dH = max;
            this.scroll = true;
          }
        }
        this.wH = dH + parseInt(this.min_h);
      },
      focus(){
          this.focused = true;
          this.$emit('focus');
      },
      blur(e){
        if(this.trim){
          event.target.value = event.target.value.trim();
          this.$emit('input', event.target.value);
        }
        this.focused = false;
        this.$emit('blur');
      }
    },
    watch : {
      value(o,v){
        //当数据从无到有的时候  自动计算一次高度
        this.$nextTick(_=>{
           this.resizeTextarea();
        })
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../assets/css/common";
.hw-text-input{
  word-break: break-all;
  box-sizing: border-box;
  line-height: 0;
  position: relative;
  border: 1px solid transparent;
  .text-padding{
    background: white;
    border-top: .33rem solid transparent;
    border-bottom: .33rem solid transparent;
    border-left: .20rem solid transparent;
    border-right: .20rem solid transparent;
    box-sizing: border-box;
  }
  input,textarea{
    width: 100%;
    line-height: .34rem;
    height: .34rem;
    /*height: auto;*/
    font-size: 0.28rem;
    color: $input_c;
    overflow: hidden;
  }
  .text-wrap{
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .text{
    position: absolute;
    width: 100%;
    opacity: 0;
    z-index: -2;
    height: 0.34rem;
    line-height: .34rem;
    font-size: 0.28rem;
  }
  ::-webkit-input-placeholder {
     color: $gray_d;
     font-size: 0.28rem;
  }
  .input_err{
    display: none;
    font-size: 0.26rem;
    line-height: 0.26rem;
    margin-top: 0.1rem;
    text-align: right;
    color: $red_e;
    position: absolute;
    right: 0;
  }
}
.hw-text-input_err{
  border: 1px solid $red_e;
  .input_err{
    display: inline-block;
  }
}
</style>
