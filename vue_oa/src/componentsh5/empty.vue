<template>
<div class="empty" v-show="visible">
    <img src="../commons/imgs/empty.png" alt="" class="emptyIcon">
    <h6 class="emptyText">{{text}}</h6>
</div>    
</template>

<script>
export default {
  name: "empty",
  props : {
      visible : {
          type :Boolean,
          default : false
      },
      text : {
          type : String,
          default :''
      }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/common";
.empty {
    display: block;
    width: 100%;
    margin: 1.18rem auto 0;
    text-align: center;
    .emptyIcon{
        display: inline-block;
        width: 4rem;
        height: 3.4rem;
        margin-bottom: 0.4rem;
    }
  .emptyText {
    height: .28rem;
    font-size: .28rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(204, 204, 204, 1);
    line-height: 1;
  }
}
</style>
