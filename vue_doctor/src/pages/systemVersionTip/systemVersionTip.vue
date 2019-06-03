<template>
<div class="container">
  <div class="content">
    <img src="../../assets/media/img/systemVersion.png" alt="">
    <h6>您的系统版本是IOS{{ver}}<br>请更新系统版本</h6>
  </div>
</div>
</template>

<script>
export default{
    computed:{
        ver(){
            return this.$store.state.isIOS;
        }
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .container{
    background: white;
  }
  .content{
    background: $baseBlue;
    padding-top: 1px;
    height: 7.2rem;
  }
img{
  display: block;
  margin: 2rem auto;
  width: 5.6rem;
  height: 4rem;
}
  h6{
    width: 80%;
    margin: auto;
    font-size: 0.38rem;
    line-height: 0.5rem;
    text-align: center;
    color: $fGray;
  }
</style>
