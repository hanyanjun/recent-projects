<template>
<div class="team-empty" v-show="show">
   <div class="team-empty-icon">
      <slot name="icon"></slot>
      <i class="icon-team-ico" v-show="!$slots.icon"></i>
   </div>
   <h6 class="team-empty-text" v-show="text">
     {{text}}
   </h6>
   <button class="team-empty-btn" v-show="btn" @click.stop="handleClick">{{btn}}</button>
</div>
</template>

<script>
export default {
  name: "teamEmpty",
  props:{
    text : String,
    btn : String,
    show : {
      type : Boolean,
      default : false
    }
  },
  methods:{
    handleClick(){
      this.$emit('submit')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/common";
.team-empty{
  width: 100%;
  height: 100%;
  background: $gray_e;
  padding-top: 1px;
  box-sizing: border-box;
  .team-empty-icon{
    margin: 3.04rem 0 0;
    text-align: center;
    line-height: 0;
    i{
      font-size: 1.1rem;
    }
  }
  .team-empty-text{
    text-align: center;
    font-size: 0.3rem;
    color: $gray_c;
    line-height: 0.4rem;
    margin: 0.4rem 0;
  }
  .team-empty-btn{
    display: block;
    height: 0.6rem;
    line-height: 0.6rem;
    padding: 0 0.14rem;
    font-size: 0.32rem;
    border: 1px solid $baseGreen;
    color: $baseGreen;
    background: $gray_e;
    border-radius: 0.04rem;
    margin: 0.75rem auto 0;
  }
}
</style>
