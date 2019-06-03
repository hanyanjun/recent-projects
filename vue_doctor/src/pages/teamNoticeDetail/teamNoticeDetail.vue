<template>
<div class="noticeWrap">
  <div class="modules">
    <h6 class="title">{{info.title}}</h6>
    <h6 class="head"><span class="info">
      <!--<span class="origin">智呼吸</span><span class="auth">小智</span>-->
      <span class="time">{{info.created}}</span></span><span class="num">{{info.read_count}}人阅读</span></h6>
    <h6 class="line"></h6>
  </div>
  <p class="content">
    {{info.content}}
  </p>
  <!--<h6 class="detail">-->
    <!--<h6 class="title">查看详情：</h6>-->
    <!--<a href="javascript:;"> https://mp.weixin.qq.com/s/DVT_4i8j_UXGMy5wF3 pMA</a>-->
  <!--</h6>-->
  <div class="imgs">
    <template v-for="item in imgs" v-if="item.path">
      <img src="" alt="" v-img="img(item.path)" @click.stop="preView(item.path)">
    </template>
  </div>
</div>
</template>

<script>
export default{
  data(){return{info : {},imgs : [{path : ''}]}},
  created(){
    this.$store.commit('UPDATE_NAV',{title : '公告详情',  hShow : true ,theme : 'green'});
    this.$api.teamNoticeDetail(this.$route.params.id).then(obj=>{
      this.info = obj.teamNotice;
      if(obj.teamNoticeImgs.length != 0){
        this.imgs = obj.teamNoticeImgs;
        if(this.imgs.length  > 0){
          for(let j= 0; j < this.imgs .length ; j ++){
            this.$store.commit('SET_IMG_ARR',{way : 'push' ,msg : `${DOCLINKAPI}${this.imgs[j].path}`});
          }
        }
      }
    })
  },
  methods:{
    img(v){
      return `${DOCLINKAPI}${v}`;
    },
    preView(src){
      this.$store.dispatch('wxImgView',this.img(src));
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
.noticeWrap{
  height: 100%;
  overflow: scroll;
  .modules{
    background: white;
    .title{
      padding: 0.15rem 0.3rem 0;
      font-size: 0.32rem;
      line-height: 0.4rem;
      color: $gray_a;
    }
    .head{
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
      font-size: 0.26rem;
      line-height: 0.4rem;
      color: $gray_c;
      padding: 0.08rem 0.3rem 0.13rem;
      .origin{
        margin-right: 0.08rem;
      }
      .auth{
        margin-right: 0.4rem;
      }

    }
    .line{
      height: 1px;
      background: $gray_e;
    }
  }
  .content{
    font-size: 0.3rem;
    border-top:0.25rem solid white;
    border-left:0.3rem solid white;
    border-right:0.3rem solid white;
    color: $gray_a;
    background: white;
    line-height: 0.40rem;
    position: relative;
    word-break: break-all;
  }
  .detail{
    background: white;
    font-size: 0.28rem;
    line-height: 0.42rem;
    border-top: 0.18rem solid white;
    border-left:0.3rem solid white;
    border-right:0.3rem solid white;
    box-sizing: border-box;
    a{
      color: $baseBlue;
    }
  }
  .imgs{
    padding-top:0.33rem;
    border-left: 0.25rem solid white;
    border-right: 0.25rem  solid white;
    border-right: 0.3rem  solid white;
    background: white;
    box-sizing: border-box;
    img{
      border: 1px solid $gray_b;
      display: inline-block;
      width: 32%;
      height: 1.6rem;
      margin-right: 0.06rem;
      margin-bottom: 0.06rem;
    }
    img:nth-child(3n+3){
      margin-right: 0;
    }
  }
}
</style>
