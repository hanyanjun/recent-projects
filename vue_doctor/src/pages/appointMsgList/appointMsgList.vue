<template>
<div class="mes">
  <section v-for="item in msg"  @click.stop="skip(item)">
    <img  alt="" v-img="item.data.face">
    <ul class="baseInfo">
      <li class="title">{{item.data.name}}</li>
      <li class="text">{{item.data.text}}</li>
    </ul>
    <ul class="other">
      <li class="time">{{$means.timestampTotime(item.timestamp)}}</li>
      <!--<li class="num"><span :class="item.showCount == 0 ? 'no-style' : (item.showCount.toString().length < 2 ? 'one-style' : 'two-style')">{{item.showCount > 99 ? '99+' : item.showCount}}</span></li>-->
    </ul>
  </section>
</div>
</template>

<script>
export default{
    name : 'appointMsgList',
    data(){return{
        msg : []
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '预约消息',fn : '', router : '/message', fShow : false, hShow : true});
      let time = Date.parse(new Date());
      this.$api.sysAppointMsg(0).then(obj=>{
          this.msg = obj.messages;
      })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .mes {
    background: $bg;
    width:100%;
    height:100%;
    padding-top: 0.2rem;
    box-sizing: border-box;
  section{
    line-height: 0;
    background: white;
    padding-left: 0.3rem;
    width: 100%;
    height: 1.3rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    border-bottom: 1px solid $gray;
  img{
    display: inline-block;
    width: 0.9rem;
    height:0.9rem;
    border-radius: 50%;
  }
  .baseInfo{
    margin-left: 0.17rem;
    width: 5.3rem;
    height:0.9rem;
    line-height: 0.45rem;
  .title{
    font-size: 0.32rem;
  }
  .text{
    width:100%;
    font-size: 0.26rem;
    color: #b7b8b8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  }
  .other{
    height:0.9rem;
    line-height: 0.45rem;
    position: absolute;
    right:0.2rem;
    white-space: nowrap;
    top:0.2rem;
    text-align: right;
  .time{
    color: #b7b8b8;
    font-size: 0.22rem;
  }
  .num{
    text-align: right;
    font-size: 0.22rem;
  }
  }
  }
  }
  .mes  .one-style, .mes .two-style {
    color: #fff;

    height: 0.32rem;
    font-size: 0.2rem;
    line-height: 0.34rem;
    text-align: center;
    box-sizing: border-box;
  }
  .mes .one-style {
    padding: 0 0.15rem;
    background: #7ecef4;
    display: inline-block;
    border-radius: 40%;
  }
  .mes .two-style {
    padding: 0 0.17rem;
    background: #fe6d40;
    border-radius: 0.14rem;
  }
  .mes .no-style {
    background: white;
    color: white;
  }
</style>
