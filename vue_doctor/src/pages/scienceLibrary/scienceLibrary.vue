<template>
  <div class="container">
    <h6 class="search">
      <hw-search v-model="text" @click="skip" :isFocus="false" ></hw-search>
    </h6> <div class="switch">
    <a href="javascript:;" @click.stop="change(1)">
      引用最多
      <!--<span class="line"></span>-->
    </a>
    <a href="javascript:;" @click.stop="change(2)">
      阅读最多
      <!--<span class="line"></span>-->
    </a>
    <a href="javascript:;" @click.stop="change(3)">
      最新文章
      <!--<span class="line"></span>-->
    </a>
  </div>
    <empty :config="{show : all.length == 0, text : '您还没有文章哦，快去新建文章吧！' , type : 'article'}"></empty>
    <div class="content loadWrapper">
      <loading-more :data="all" :pullupLoad="true" @pullup="load"  :tip="isTip" spinner="loading1" :scrollTo="scroll">
        <transition-group :name="tranAni" tag="div" >
          <!--<div>-->
          <ul class="modules" v-for="(item,index) in all" @click.stop="preView(item.id)"  :key="item.id ? item.id : '9999999'" v-show="item">
            <li class="title"><span>{{item.title}}</span> <span class="tip">
          <template v-if="filter.type == 1">
            {{item.count_quote}}次引用
          </template>
          <template v-else-if="filter.type == 2">
            {{item.count_read}}人阅读
          </template>
          <template v-else-if="filter.type == 3">
            {{String(item.created).substring(0,10).split('-').join('/')}}发表
          </template>
        </span></li>
            <li class="info"><span class="department">{{item.doc_name}}</span><span class="hospital">{{item.technical}}&nbsp;|&nbsp;{{item.hospital}}</span></li>
          </ul>
          <!--</div>-->
        </transition-group>
      </loading-more>
    </div>
    <span :class="l"></span>
  </div>
</template>

<script>
  import hwSearch from "../../components/hwSearch.vue"
  import empty from "../../components/empty.vue"
  import loadingMore from '../../components/loadingMore'
  export default{
    created(){
      this.$store.commit('UPDATE_NAV',{title : '科普文库', fShow : false, hShow : true});
      //根据当前状态去（如从预览科普返回回到上次的分栏） 初始化
      if(this.$route.query.status){
        this.filter.type = Number(this.$route.query.status);
      }else{
        this.filter.type = Number(this.$route.params.type);
      }
    },
    data(){return{
      text : '',
      l : '',
      i : 0,
      filter : {page : 1 , type : 0},
      old : {page : 1 , type : 0},
      all : [''],
      isTip : false,
      tranAni : '',
      scroll : ''
    }},
    components:{loadingMore,empty,hwSearch},
    methods:{
      skip(){
        this.$router.push({path : '/scienceSearchResult'});
      },
      preView(v){
        this.$router.push({path : `/${v}/1/collectScienceArticle?status=${this.filter.type}`});
      },
      change(v){
        this.filter.type = v;
      },
      load(v){
        if(v){
          setTimeout(()=>{
            this.filter.page++;
            this.$api.articles(this.filter).then(obj=>{
              if(obj.articles.length == 0){
                this.isTip = true;
              }else{
                this.all = this.all.concat(obj.articles);
              }
            })
          },1000)
        }
      },
      reload(){
        switch (this.filter.type){
          case 1:
            this.l = 'line';
            break;
          case 2:
            this.l = 'line1';
            break;
          case 3:
            this.l = 'line2';
            break;
        }
        this.$api.articles(this.filter).then(obj=>{
          this.isTip = false;
          if(obj.articles.length == 0){
            this.isTip = true;
            if(this.all.length == 1){
              this.all = [];
            }
          }else{
            this.all = obj.articles;
            this.isTip = false;
          }
        })
      },
    },
    watch : {
      filter : {
        handler: function (val,oldVal) {
          if(this.old.page < val.page){
            this.scroll = '';
          }else{
            this.scroll = 'top';
          }
          if(this.old.type != val.type){
            this.all = [''];
            this.filter.page = 1;
            if(val.type < this.old.type){
              this.tranAni = 'slider-out';
            }else{
              this.tranAni = 'slider-in';
            }
            Object.assign(this.old,this.filter);
            setTimeout(()=>{
              this.reload();
            },30)
          }
        },
        deep: true
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .container{
    overflow: hidden;
  }
  .search{
    padding: 0.2rem 0.3rem;
    height: 0.6rem;
    background: white;
  }
  .con-fn {
    height: .94rem;
    background: #fff;
    border-bottom: 1px solid $gray;
  }

  .con-fn .search {
    padding: .2rem .2rem;
    -webkit-justify-content: space-between;
    display: flex;
    justify-content: space-between
  }

  .con-fn .search .con-sear {
    display: inline-block;
    width: 7.1rem;
    height: .5rem;
    padding-left: 0.6rem;
    line-height: .5rem;
    background: url(../../assets/media/img/home-contact-search2.png) #f2f2f2 no-repeat center;
    background-size: .28rem;
    font-size: .26rem;
    box-sizing: border-box;
    background-position: 2.8rem 0.11rem;
  }
  .con-fn .search .con-sear-active{
    background: #f2f2f2;
  }
  .con-fn .search .con-sear-addnew{
    background-image: none;
    background: #f2f2f2;
  }
  .con-fn .search .con-position{
    display: inline-block;
    line-height: .5rem;
    position: absolute;
    font-size: .26rem;
    color: #9FA0A0;
    left: 3.42rem;
    margin-top: 0.02rem;
  }
  .switch{
    height: 0.8rem;
    font-size: 0.32rem;
    background: white;
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 0.4rem;
    box-sizing: border-box;
    border-bottom: 1px solid $gray;
    a{
      color: $fGray;
      padding-right: 0.6rem;
      line-height: 0.32rem;
      border-right: 1px solid $gray;
      position: relative;
    }
    a:nth-last-of-type(1){
      border-right: none;
      padding-right: 0;
    }
  }

  .line{
    position: fixed;
    width: 1.28rem;
    border-bottom: 2px solid $baseBlue;
    left: 0.66rem;
    margin-left: 0;
    top:2.56rem;
    transition: all 0.5s;
  }
  .line1{
    position: fixed;
    width: 1.28rem;
    border-bottom: 2px solid $baseBlue;
    left: 50%;
    margin-left: -0.64rem;
    top:2.56rem;
    transition: all 0.5s;
  }
  .line2{
    position: fixed;
    width: 1.28rem;
    border-bottom: 2px solid $baseBlue;
    margin-left: 0;
    left: 50%;
    margin-left: 1.8rem;
    top:2.56rem;
    transition: all 0.5s;
  }
  .content{
    height: calc(100% - 0.8rem - 0.96rem);
    overflow-y: scroll;
    background: white;
    padding-left: 0.36rem;
    .modules{
      /*height: 1.3rem;*/
      box-sizing: border-box;
      border-bottom: 1px solid $gray;
      padding-top: 1px;
      position: relative;
      padding-right: 0.3rem;
      .title{
        font-size: 0.32rem;
        line-height: 0.38rem;
        margin-top: 0.23rem;
        display: flex;
        justify-content: space-between;
        .tip{
          color: $i2Gray;
          white-space: nowrap;
          font-size: 0.28rem;
          margin-left: 0.2rem;
        }
      }
      .info{
        font-size: 0.28rem;
        margin-top: 0.13rem;
        margin-bottom: 0.25rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: $i2Gray;
        .department{
          margin-right: 0.2rem;
        }
        span{
          line-height: 1.1;
        }
      }
    }
  }
</style>
