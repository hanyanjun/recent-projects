<template>
<div class="editTeamNotice">
  <div class="title">
     <hwConInput title="标题" maxLength="40" holder="请输入标题" v-model="title"></hwConInput>
  </div>
  <div class="title">
    <hwConInput title="内容" maxLength="200"  holder="请输入正文" v-model="content"  minHeight="334" ></hwConInput>
    <div class="photos">

    </div>
  </div>
</div>
</template>

<script>
import hwConInput from "../../components/hw-con-input.vue"
export default{
    created(){
      this.$store.commit('UPDATE_NAV',{title : '编辑公告',  hShow : true});
    },
    data(){return{
      title : '',
      content : ''
    }},
    components:{hwConInput}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
.editTeamNotice{
  padding: 0 0.2rem;
  .title:nth-of-type(1){
    margin-bottom: 0.3rem;
  }
  .photos{
    height: 2rem;
    background: white;
    border-top: 1px solid $gray_e;
  }
}
</style>
