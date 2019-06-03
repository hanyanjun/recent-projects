<template>
<div class="container">
  <h6 class="search">
     <div class="search-input">
       <hw-search v-model="text" @submit="submit"  :focus="true" holder="请输入文章标题关键字"></hw-search>
     </div>
     <button class="cancle" @click.stop="submit">搜索</button>
  </h6>
  <empty :config="{show : emptyShow, text : '没有搜索到结果，换个关键词试试？' , type : 'article'}"></empty>
  <div class="wrap loadWrapper">
      <loading-more :data="arr" :pullupLoad="filter.origin_type != ''" @pullup="load"  :tip="isTip" spinner="loading1">
        <div>
            <template v-if="!filter.origin_type">
              <div class="content" v-show="all.myArticles.length != 0">
                <h6 class="type"><span>我的文库&nbsp;&nbsp;&nbsp;(为你找到{{all.myArticleNum}}篇文章)</span><span class="more" @click.stop="more(2)">全部 <i class="icon-return-boldleft"></i></span></h6>
                <span class="line"></span>
                <ul class="modules"  v-for="(item,index) in all.myArticles"  @click.stop="preView(item.id)">
                  <li class="title"><span v-html="item.title"></span> <span class="tip">{{item.count_quote}}次引用</span></li>
                  <li class="info"><span class="department">{{item.doc_name}}</span><span class="hospital">{{item.technical}}&nbsp;|&nbsp;{{item.hospital}}</span></li>
                </ul>
              </div>
              <div class="content" v-show="all.articles.length != 0">
                <h6 class="type"><span>科普文库&nbsp;&nbsp;&nbsp;(为你找到{{all.articleNum}}篇文章)</span><span class="more" @click.stop="more(1)">全部 <i class="icon-return-boldleft"></i></span></h6>
                <span class="line"></span>
                <ul class="modules" v-for="(item,index) in all.articles"  @click.stop="preView(item.id)">
                  <li class="title"><span v-html="item.title"></span> <span class="tip">{{item.count_quote}}次引用</span></li>
                  <li class="info"><span class="department">{{item.doc_name}}</span><span class="hospital">{{item.technical}}&nbsp;|&nbsp;{{item.hospital}}</span></li>
                </ul>
              </div>
              <!--<div class="content">-->
              <!--<h6 class="type"><span>微信文章&nbsp;&nbsp;&nbsp;(以下文章来源微信搜索)</span><span class="more">全部 <i class="icon-return-boldleft"></i></span></h6>-->
              <!--<span class="line"></span>-->
              <!--<ul class="modules">-->
              <!--<li class="title"><span>儿科必读</span> <span class="tip">11111111次引用</span></li>-->
              <!--<li class="info"><span class="department">鲍一笑</span><span class="hospital">上海医院</span></li>-->
              <!--</ul>-->
              <!--</div>-->
            </template>
            <template v-else>
              <div class="content" v-show="arr">
                <h6 class="type"><span>
                <template v-if="filter.origin_type == 1">
                  科普文库&nbsp;&nbsp;&nbsp;(为你找到{{all.articleNum}}篇文章)
                </template>
                <template v-else-if="filter.origin_type == 2">
                   我的文库&nbsp;&nbsp;&nbsp;(为你找到{{all.myArticleNum}}篇文章)
                </template>
              </span></h6>
                <span class="line"></span>
                <ul class="modules"  v-for="(item,index) in arr"  @click.stop="preView(item.id)">
                  <li class="title"><span v-html="item.title"></span> <span class="tip">{{item.count_quote}}次引用</span></li>
                  <li class="info"><span class="department">{{item.doc_name}}</span><span class="hospital">{{item.technical}}&nbsp;|&nbsp;{{item.hospital}}</span></li>
                </ul>
              </div>
            </template>

        </div>
      </loading-more>
  </div>
</div>
</template>

<script>
  import hwSearch from "../../components/hwSearch.vue"
  import empty from "../../components/empty.vue"
  import hwButton from '../../btns/hwButton.vue'
  import loadingMore from '../../components/loadingMore'
  export default{
    created(){
      this.$store.commit('UPDATE_NAV',{title : '搜索文章', fShow : false, hShow : true});
    },
    data(){return{
       text : '',
       filter : {keyword : '' ,origin_type : '',page : 1},
       old : {keyword : '' ,origin_type : '',page : ''},
       all : {
         articles : [],
         myArticles : []
       },
       arr : [],
       emptyShow : false,
       isTip : false,
    }},
    methods :{
      submit(){
          this.filter.keyword = this.text;
      },
      more(v){
        this.filter.origin_type = v;
      },
      preView(v){
        this.$router.push({path : `/${v}/1/collectScienceArticle`});
      },
      load(v){
        if(v && this.filter.keyword){
          setTimeout(()=>{
            this.filter.page++;
            this.$api.searchArticles(this.filter).then(obj=>{
//              if(this.filter.origin_type){
                for(let key in obj){
                  if(key!='code'){
                    if(obj[key].length == 0){
                      this.isTip = true;
                    }else{
                      this.arr.forEach((v)=>{
                        v.title = v.title.replace(this.filter.keyword,`<i style="color:#2a8cff">${this.filter.keyword}</i>`);
                      })
                      this.arr = this.arr.concat(obj[key]);
                      this.isTip = false;
                    }
                  }
                }
//              }
            })
          },1000)
        }
      },
      reload(){
        this.$api.searchArticles(this.filter).then(obj=>{
            this.isTip = false;
            if(this.filter.origin_type){
                this.arr = [];
                for(let key in obj){
                    if(key!='code'){
                        this.arr = obj[key];
                        this.arr.forEach((v)=>{
                          v.title = v.title.replace(this.filter.keyword,`<i style="color:#2a8cff">${this.filter.keyword}</i>`);
                        })
                    }
                }
            }else{
                this.all =  obj.data;
                let arr = [];
                for(let key in obj.data){
                    arr.push(obj.data[key].length || 0);
                    if(typeof obj.data[key] == 'object'){
                      obj.data[key].forEach((v)=>{
                        v.title = v.title.replace(this.filter.keyword,`<i style="color:#2a8cff">${this.filter.keyword}</i>`);
                      })
                    }
                    this.arr = [...obj.data[key]];
                }
                this.emptyShow = arr.every((v,i)=>{
                     return !v;
                });
            }
        })
      },
    },
    watch : {
       filter : {
           handler : function (val) {
               if(val.keyword != this.old.keyword){
                 this.filter.page = 1;
                 this.filter.origin_type = '';
                 Object.assign(this.old,this.filter);
                 this.reload();
               }else if(val.origin_type != this.old.origin_type){
                 this.filter.page = 1;
                 Object.assign(this.old,this.filter);
                 this.reload();
               }
           },
         deep : true
       }
    },
    components : {hwSearch,empty,hwButton,loadingMore}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
.container{
  height: 100%;
  overflow: hidden;
}
.search{
  padding: 0.2rem 0.3rem;
  background: white;
  display: flex;
  justify-content: space-between;
  height: 0.6rem;
  .search-input{
    width: 5.9rem;
  }
  button{
    background: white;
    font-size: 0.32rem;
    color: $baseBlue;
  }
}
.content{
  padding-left: 0.36rem;
  background: white;
  margin-bottom: 0.2rem;
  position: relative;
  .line{
    display: inline-block;
    width: 100%;
    height:1px;
    background: $gray;
    position: absolute;
    left: 0;
    top:0.8rem;
  }
  .type{
    height: 0.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.28rem;
    padding-right: 0.3rem;
    position: relative;
    .more{
      font-size: 0.32rem;
      line-height: 0.32rem;
      color: $baseBlue;
      margin-right: 0.4rem;
    }

    .icon-return-boldleft{
      color: $baseBlue;
      transform: translateY(-50%) rotateY(180deg);
      font-size: 0.35rem;
      position: absolute;
      right: 0.3rem;
      top: 50%;
    }
  }
  .modules{
    /*height: 1.3rem;*/
    box-sizing: border-box;
    border-bottom: 1px solid $gray;
    padding-top: 1px;
    position: relative;
    padding-right: 0.3rem;
    .title{
      font-size: 0.32rem;
      line-height: 0.34rem;
      margin-top: 0.27rem;
      display: flex;
      justify-content: space-between;
      .tip{
        color: $i2Gray;
        white-space: nowrap;
        font-size: 0.28rem;
      }
    }
    .info{
      font-size: 0.28rem;
      line-height: 0.28rem;
      margin-top: 0.17rem;
      margin-bottom: 0.25rem;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      color: $i2Gray;
      .department{
        margin-right: 0.2rem;
      }
    }
  }
}
.myContent{
  margin-top: 0;
}
  .wrap{
    height: calc(100% - 1rem);
    overflow: hidden;
    position: relative;
  }
</style>
