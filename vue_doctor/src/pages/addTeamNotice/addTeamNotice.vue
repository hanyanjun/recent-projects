<template>
  <div class="addTeamNotice">
    <div class="content">
      <hwConInput :is_require="true" title="标题" v-model="title" :trim="true" :br="true" @focus="focus" maxLength="40" holder="请输入标题" code="100"  :err="err"></hwConInput>
      <hwConInput :is_require="true" title="内容" minHeight="400" maxLength="500" v-model="intro"  :trim="true" :br="true" @focus="focus" holder="请输入正文" :err="err"></hwConInput>
      <div class="imgs">
        <photo-upload :config="photo" v-on:event="currentPhoto1" ></photo-upload>
        <!--<div class="upload">-->
          <!--<input type="file">-->
          <!--<img src="../../assets/media/img/notice_photo.png" alt="">-->
          <!--<span>点击上传图片<br>最多6张</span>-->
        <!--</div>-->
      </div>
    </div>
    <hwSubmitBtn text="发布" :activeStyle="{background : '#20c6b4'}" :is_commit="commit"  @submit="submit"></hwSubmitBtn>
  </div>
</template>

<script>
  import hwConInput from "../../components/hw-con-input"
  import hwSubmitBtn from "../../components/hw-submit-btn"
  import photoUpload from '../../components/photoUpload/photoUpload'
  export default {
    name: "addTeamNotice",
    data(){return{
      title : '',
      err : {code : '',errMsg : ''},
      intro : '',
      commit : false ,
      id : '',
      img1 : [],
      photo :{
        holder : '',
        limit : 6,
        photoTip : '点击上传图片<br>最多6张',
        id : '1',
        val : ''
      },
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '新建公告',  hShow : true , theme : 'green'});
      this.id = this.$route.params.id;
    },
    components:{hwConInput,hwSubmitBtn,photoUpload},
    methods:{
      focus(){

      },
      currentPhoto1(v){
        this.img1 = v;
      },
      submit(){
        let fromData = new FormData();
        fromData.append('title',this.title);
        fromData.append('content',this.intro);
        for(let i=0 ; i < (this.img1).length ; i++){
          fromData.append(`file${i+1}[]`,this.$means.BaseToBlob(this.img1[i]))
        }
        this.$api.teamNoticeAdd(this.id,fromData).then(obj=>{
          console.log(obj);
          this.$router.routeBack();
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.addTeamNotice{
  padding: 0 0.2rem;
  overflow: hidden;
  height: 100%;
  .content{
    height: calc(100% - 1.6rem);
    overflow-y: scroll;
  }
  .imgs{
    border-top: 1px solid $gray_e;
    background: white;
    min-height: 2rem;
    width: 100%;
    .upload{
      font-size: 0.28rem;
      color: $input_c;
      margin-left: 0.3rem;
      margin-top: 0.55rem;
      display: flex;
      align-items: center;
      input{
        display: none;
      }
      img{
        display: inline-block;
        width: 1.2rem;
        height: 0.95rem;
        margin-right: 0.2rem;
      }
    }
  }
}
</style>
