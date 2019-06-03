<template>
<div class="expertInviteMulChat">
  <h6 class="search">
    <hw-search v-model="text"  pos="middle" ></hw-search>
  </h6>
  <div class="members">
    <div class="module">
      <label for="1">
        <input type="checkbox" id="1">
        <i class="icon-select"></i>
      </label>
      <div class="content">
        <div class="img">
          <img src="" alt="">
          <span>未注册</span>
        </div>
        <p class="con-top"><span class="name">鲍一笑</span><span class="type">主任医生  教授</span></p>
        <p><span class="hospital">上海儿童医学中心</span><span class="department">儿呼吸科</span></p>
      </div>
    </div>
    <div class="module">
      <label for="2">
        <input type="checkbox" id="2">
        <i class="icon-select"></i>
      </label>
      <div class="content">
        <div class="img">
          <img src="" alt="">
          <span>未注册</span>
        </div>
        <p class="con-top"><span class="name">鲍一笑</span><span class="type">主任医生  教授</span></p>
        <p><span class="hospital">上海儿童医学中心</span><span class="department">儿呼吸科</span></p>
      </div>
    </div>
  </div>
  <hwSubmitBtn text="立即邀请" :activeStyle="{background : '#2a8cff'}" :is_commit="false"  @submit="submit"></hwSubmitBtn>
</div>
</template>
<script>
import hwSearch from "../../components/hwSearch"
import hwSubmitBtn from "../../components/hw-submit-btn"
export default {
    name: "expertInviteMulChat",
    components : {hwSearch,hwSubmitBtn},
    data(){return{text : ''}},
    created(){
      var id = this.$route.params.id;
      this.$store.commit('UPDATE_NAV',{title : '邀请新成员',fn : '', fShow : false, hShow : true});
      this.$api.meetingView(id).then(obj=>{

      })
    },
    methods:{
      submit(){
        this.$router.push({path : '/expertMulChatInviteGroup'});
      }
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.expertInviteMulChat{
  height: 100%;
  overflow: hidden;
}
.search{
  padding: 0.2rem 0.15rem;
  height: 0.6rem;
  background: white;
}
.members{
  height: calc(100% - 2.6rem);
  overflow: scroll;
}
.module{
  padding: 0.3rem 0.2rem 0 0.9rem;
  background: white;
  box-sizing: border-box;
  position: relative;
  label{
    display: inline-block;
    background: white;
    border-radius: 50%;
    position: absolute;
    left: 0.2rem;
    top: 50%;
    line-height: 0;
    margin-top: -0.23rem;
    i{
      font-size: 0.48rem;
      line-height: 0.45rem;
      display: inline-block;
      width: 0.45rem;
      height: 0.45rem;
      box-sizing: border-box;
      border-radius: 50%;
      border: 1px solid $img_b;
      &:before{
        color: white;
        margin-left: -0.03rem;
        opacity: 0;
      }
    }
    input[type=checkbox]:checked+i{
      border: none;
    }
    input[type=checkbox]:checked+i:before{
      color: $baseBlue;
      opacity: 1;
    }
  }
  .content{
    font-size: 0.26rem;
    color: $gray_b;
    padding-left: 1.4rem;
    padding-bottom: 0.2rem;
    position: relative;
    min-height: 1.2rem;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    border-bottom: 1px solid $line;
    .img{
      display: inline-block;
      width: 1.2rem;
      height: 1.2rem;
      position: absolute;
      border-radius: 50%;
      left: 0;
      top: 50%;
      margin-top: -0.6rem;
      border: 1px solid $img_b;
      overflow: hidden;
      span{
        position: absolute;
        font-size: 0.24rem;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        line-height: 0.36rem;
        padding-bottom: 0.06rem;
        background: rgba(42,140,255,0.8);
        color: white;
      }
    }
    .con-top{
      margin-bottom: 0.24rem;
    }
    p span{
      line-height: 1;
    }
    .name{
      font-size: 0.32rem;
      color: $gray_a;
      margin-right: 0.2rem;
    }
    .hospital{
      margin-right: 0.18rem;
    }
  }
}
</style>
