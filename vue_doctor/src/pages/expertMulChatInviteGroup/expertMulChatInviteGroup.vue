<template>
<div class="expertMulChatInviteGroup">
  <h6 class="search">
    <hw-search v-model="text" :wrapStyle="{background: 'white'}"  pos="middle" ></hw-search>
  </h6>
  <div class="content">
    <div class="module">
      <h6 class="title">我的团队</h6>
      <div class="info">
        <img src="" alt="">
        <span class="teamName">儿童哮喘标准化专家团队团儿童哮喘标准化专家团队团</span><span>(20)</span>
      </div>
      <div class="info">
      <img src="" alt="">
      <span class="teamName">儿童哮喘标准化专家团队团儿童哮喘标准化专家团队团</span><span>(20)</span>
    </div>
    </div>
    <div class="module">
      <h6 class="title">专家合作</h6>
      <div class="info">
        <img src="" alt="">
        <span class="teamName">儿童哮喘标准化专家团队团儿童哮喘标准化专家团队团</span><span>(20)</span>
      </div>
      <div class="info">
        <img src="" alt="">
        <span class="teamName">儿童哮喘标准化专家团队团儿童哮喘标准化专家团队团</span><span>(20)</span>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import hwSearch from "../../components/hwSearch"
export default {
    name: "expertMulChatInviteGroup",
    components : {hwSearch},
    data(){return{text : '' }},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '选中群组',fn : '', fShow : false, hShow : true});
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.expertMulChatInviteGroup{
  height: 100%;
  overflow: hidden;
  .content{
    height: calc(100% - 1rem);
    overflow: scroll;
    .module{
      padding-bottom: 0.5rem;
      background: white;
      margin-bottom: 0.2rem;
      .title{
        font-size: 0.28rem;
        margin-top: 0.1rem;
        line-height: 0.68rem;
        padding-left: 0.2rem;
        color: $gray_c;
        border-bottom: 1px solid $line;
      }
      .info{
        margin-left: 0.2rem;
        border-bottom: 1px solid $line;
        font-size: 0.32rem;
        color: $gray_c;
        padding: 0.2rem 0;
        display: flex;
        align-items: center;
        img{
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 1px solid red;
          margin-right: 0.3rem;
        }
        .teamName{
          color: $gray_a;
          display: inline-block;
          max-width: 4.14rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 0.1rem;
        }
      }
    }
  }
}
.search{
  padding: 0.2rem 0.15rem;
  height: 0.6rem;
  background: $gray_e;
  form{
    background: white;
  }
}
</style>
