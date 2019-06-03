<template>
<div class="container">
  <div class="head">
    <a href="javascript:;" @click.stop="add">
      新建文章
      <i class="icon">
        <span class="icon-add-article"></span>
      </i>
    </a>
    <router-link to="/1/scienceLibrary">
      科普文库
      <i class="icon">
        <span class="icon-scienceing-library"></span>
      </i>
    </router-link>
  </div>
  <h6 class="search">
    <hw-search @click="skip" :isFocus="false"></hw-search>
  </h6>
  <h6 class="con-title">
    <span class="type"><i><span>我的</span></i><i><span>科普库</span></i>共{{num}}篇</span>
    <router-link to="manageMyScienceing">管理</router-link>
    <span class="line"></span>
  </h6>
  <empty :config="{show : all.length == 0 && page > 0, text : '您还没有文章哦，快去新建文章吧！' , type : 'article'}"></empty>
  <div class="content loadWrapper">
    <loading-more :data="all" :pullupLoad="true" @pullup="load"  :tip="isTip" spinner="loading1">
      <ul class="modules" @click.stop="preView(item)" v-for="(item,index) in all" v-show="item">
        <li class="title">{{item.title}}</li>
        <li class="info"><span class="department">{{item.doc_name}}</span><span class="hospital">{{item.technical}}&nbsp;|&nbsp;{{item.hospital}}</span></li>
      </ul>
    </loading-more>
  </div>
  <!--<h6 class="bottom">上拉加载更多</h6>-->
  <div class="add-mask" v-show="addMask">
    <h6 @click.stop="addlink"><i class="icon-link"></i>粘贴文章链接</h6>
    <h6 @click.stop="addemail"><i class="icon-e-mail"></i>发送到智呼吸邮箱</h6>
    <span class="icon"></span>
  </div>
</div>
</template>

<script>
  import hwSearch from "../../components/hwSearch.vue"
  import empty from "../../components/empty.vue"
  import loadingMore from '../../components/loadingMore'
export default{
    created(){
      this.$store.commit('UPDATE_NAV',{title : '我的科普', fShow : false, hShow : true});
      this.load(true);
    },
    mounted(){
      document.querySelector('.hw-all-mask').onclick = ()=>{
          this.addMask = false;
          this.$store.commit('UPDATE_MASK',false);
      }
    },
    components : {hwSearch,empty,loadingMore},
    data(){return{
      addMask : false,
      all : [''],
      page : 0,
      isTip : false,
      num : 0
    }},
    methods:{
        addlink(){
            this.$router.push({path : '/addLinkScienceArticle'});
        },
        addemail(){
          this.$router.push({path : '/addEmailScienceArticle'});
        },
        add(){
          this.addMask = !this.addMask;
          this.$store.commit('UPDATE_MASK',true);
        },
        skip(){
          this.$router.push({path : '/scienceSearchResult'});
        },
        preView(v){
          this.$router.push({path : `/${v.id}/1/collectScienceArticle`});
        },
        load(v){
          if(v){
            setTimeout(()=>{
              this.page++;
              this.$api.myArticles(this.page).then(obj=>{
                if(obj.articles.length == 0){
                  this.isTip = true;
                  if(this.all.length == 1){
                      this.all = [];
                  }
                }
                this.num = obj.num;
                this.all = this.all.concat(obj.articles);
              })
            },1000)
          }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
.container{
  height: 100%;
  overflow: hidden;
  background: white;
  .head{
    padding: 0.45rem 0.3rem;
    background: white;
    font-size: 0.32rem;
    display: flex;
    justify-content: space-between;
    a{
      display: flex;
      align-items: center;
      padding: 0 0.4rem;
      box-sizing: border-box;
      justify-content: space-between;
      height: 100%;
      width: 3.3rem;
      height: 1.8rem;
      color: white;
      border-radius: 0.16rem;
    }
    a:nth-of-type(1){
      background: url(../../assets/media/img/science-mask.png)  $orange left bottom no-repeat;
      background-size: 100% 0.8rem;
    }
    a:nth-of-type(2){
      background: url(../../assets/media/img/science-mask.png)  $baseBlue left bottom no-repeat;
      background-size: 100% 0.8rem;
    }
    .icon{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 0.9rem;
      height: 0.9rem;
      border-radius: 50%;
      background: white;
    }
  }

  .search{
    height: 0.6rem;
    padding: 0 0.3rem;
  }

  .con-title{
    padding:  0.16rem 0.35rem 0 0.3rem;
    border-bottom: 1px solid $gray;
    position: relative;
    height: 1.2rem;
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    .line{
      display: inline-block;
      width: 100%;
      height: 1px;
      position: absolute;
      top:0.16rem;
      left: 0;
      background: $gray;
    }
    .type{
      display: inline-block;
      height: 0.6rem;
      font-size: 0.28rem;
      i{
        display: inline-block;
        text-align: center;
        line-height: 0.6rem;
        /*width: 0.9rem;*/
        padding: 0 0.2rem;
        font-size: 0.3rem;
        height: 100%;
        background: $lighterBlue;
        color: $baseBlue;
        transform:skew(-20deg);
        span{
          display: inline-block;
          width: 100%;
          height: 100%;
          /*transform:skew(20deg);*/
        }
      }
      i:nth-of-type(1){
        background: $baseBlue;
        color: white;
        border-bottom-left-radius: 0.1rem;
        border-top-left-radius: 0.1rem;
      }
      i:nth-of-type(2){
        border-top-right-radius: 0.1rem;
        border-bottom-right-radius: 0.1rem;
        margin-right: 0.2rem;
      }
    }
    a{
      font-size: 0.32rem;
      color: $baseBlue;
    }
  }

  .content{
    background: white;
    padding-left: 0.36rem;
    height: calc(100% - 2.7rem - 0.6rem - 1.21rem);
    overflow: hidden;
    .modules{
      height: 1.3rem;
      box-sizing: border-box;
      border-bottom: 1px solid $gray;
      padding-top: 1px;
      position: relative;
      .title{
        font-size: 0.32rem;
        line-height: 0.38rem;
        margin-top: 0.23rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .info{
        font-size: 0.28rem;
        margin-top: 0.13rem;
        color: $i2Gray;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        .department{
          margin-right: 0.2rem;
        }
        span{
          line-height: 1.1;
        }
      }
    }
  }
  .bottom{
    height: 0.6rem;
    line-height: 0.6rem;
    color: $fGray;
    font-size: 0.26rem;
    border-top: 1px solid $gray;
    text-align: center;
  }
  .add-mask{
    background: white;
    position: absolute;
    left: 0.3rem;
    top:2.6rem;
    z-index: 100;
    font-size: 0.32rem;
    padding: 0 0.45rem 0 0.32rem;
    height: 2.16rem;
    line-height: 0.32rem;
    border-radius: 0.2rem;
    h6{
      line-height: 0.46rem;
      display: flex;
      margin-top: 0.4rem;
      /*width: 2.54rem;*/
      i{
        font-size: 0.46rem;
        margin-right: 0.2rem;
      }
    }
    .icon{
      display: inline-block;
      width: 0;
      height: 0;
      border-left : 0.16rem solid transparent;
      border-right : 0.16rem solid transparent;
      border-top : 0.26rem solid transparent;
      border-bottom : 0.26rem solid white;
      position: absolute;
      top:-0.52rem;
      left: 0.4rem;
    }
  }
  .icon-scienceing-library{
    &::before{color: $baseBlue;}
  }
  .icon-add-article{
    &::before{color: $orange}
  }
}
</style>
