<template>
<div :class="['hw-switch','switch_checked']"
     :style="[{width : `${w}rem`},
              {height : `${h}rem`},
              {'background' : `${checked ? activeColor : inactiveColor}`},
              {'border-radius':`${h}rem`}]"
              @click.stop="switchValue">

  <input type="checkbox"
         ref="input"
         @change="handleChange"
         :true-value="activeValue"
         :false-value="inactiveValue"
         :disabled="disabled"
         @keydown.enter="switchValue">
  <span class="hw-switch_cricle" :style="[{width : `${w1}rem`},{height : `${w1}rem`},pos]"></span>
</div>
</template>

<script>
//可配置项
//开关的宽和高
//初始的value值
//开关时的色值
export default{
  data(){return{
      w : this.width,
      h : this.height,
      w1 : this.height - 0.04
  }},
  props:{
      value: {
        type: [Boolean, String, Number],
        default: true
      },
      width : {
          type : Number,
          default : 1
      },
      height : {
          type : Number,
          default : 0.5
      },
      activeColor :{
          type : String,
          default : '#20c6b4'
      },
      inactiveColor : {
          type : String,
          default : '#a6a7a7'
      },
      activeValue: {
        type: [Boolean, String, Number],
        default: true
      },
      inactiveValue: {
        type: [Boolean, String, Number],
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
  },
  methods:{
    switchValue(){
      this.$refs.input.click();
    },
    handleChange(event) {
      this.$emit('input', !this.checked ? this.activeValue : this.inactiveValue);
      this.$emit('change', !this.checked ? this.activeValue : this.inactiveValue);
      this.$nextTick(() => {
        this.$refs.input.checked = this.checked;
      });
    },
  },
  watch:{
    checked() {
      this.$refs.input.checked = this.checked;
    }
  },
  computed:{
    checked() {
      return this.value === this.activeValue;
    },
    pos() {
      return {"right" : `${this.checked ?  '0.02rem' : `${this.w - this.w1 - 0.02}rem` }`}
    }
  },
  mounted() {
    this.$refs.input.checked = this.checked;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../assets/css/common";
.hw-switch{
  display: inline-block;
  position: relative;
  input{
    display: none;
  }
  .hw-switch_cricle{
    display: inline-block;
    border-radius: 50%;
    background: white;
    position: absolute;
    top: 0.02rem;
    transition: right 0.3s ease;
  }
}
</style>
