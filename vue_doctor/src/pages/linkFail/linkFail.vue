<template>
  <div class="nolink">
    <i class="icon-verify-fail"></i>
    <h6>该链接已失效</h6>
    <button @click.stop="back">回首页</button>
  </div>
</template>

<script>
export default {
    name: "linkFail",
    methods:{
      back(){
        this.$router.push({path : '/work'});
      }
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.nolink{
  background: white;
  width: 100%;
  height: 100%;
  text-align: center;
  i{
    display: inline-block;
    font-size: 0.8rem;
    margin-top: 2.5rem;
  }
  h6{
    font-size: 0.32rem;
    margin-top: 0.53rem;
    line-height: 0.73rem;
  }
  button{
    color: white;
    display: inline-block;
    margin-top: 2.5rem;
    width: 2rem;
    height: 0.7rem;
    border-radius: 0.06rem;
    font-size: 0.32rem;
    line-height: 0.7rem;
    background: $baseBlue;
  }
}
</style>
