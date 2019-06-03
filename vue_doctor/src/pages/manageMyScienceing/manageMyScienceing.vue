<template>
<div class="container">
  <empty :config="{show : all.length == 0, text : '您还没有文章哦，快去新建文章吧！' , type : 'article'}"></empty>
  <div class="content loadWrapper">
    <loading-more :data="all" :pullupLoad="true" @pullup="load"  :tip="isTip" spinner="loading1">
      <ul class="modules" v-for="(item,index) in all" v-show="item">
        <li class="title">{{item.title}}</li>
        <li class="info"><span class="department">{{item.doc_name}}</span><span class="hospital">{{item.hospital}}</span></li>
        <label :for="item.id">
          <input type="checkbox" :id="item.id" :value="item.id" v-model="checked">
          <i></i>
        </label>
      </ul>
    </loading-more>
  </div>
  <div class="btns">
    <template v-if="checked.length == 0">
      <button >重选</button>
    </template>
    <template v-else>
      <button id="blue" @click.stop="cancle">重选</button>
    </template>
    <button @click.stop="submit">移出</button>
  </div>
</div>
</template>

<script>
  import empty from "../../components/empty.vue"
  import loadingMore from '../../components/loadingMore'
  import {MessageBox,Toast} from "../../components/hw-components"
  export default{
    created(){
      this.$store.commit('UPDATE_NAV',{title : '我的科普文库', fShow : false, hShow : true});
      this.load(true);
    },
    components : {empty,loadingMore},
    data(){return{
      page : 0,
      all : [''],
      isTip : false,
      checked : []
    }},
    methods:{
      load(v){
        if(v){
          setTimeout(()=>{
            this.page++;
            this.$api.myArticles(this.page).then(obj=>{
              console.log('ggg')
              if(obj.articles.length == 0){
                this.isTip = true;

              }
              if(this.all.length == 1 && this.all[0]==''){
                  this.all = [];
                }
              this.num = obj.num;
              this.all = this.all.concat(obj.articles);
            })
          },1000)
        }
      },
      cancle(){
          if(this.checked.length == 0){
              Toast('当前未选中删除项！');
          }else{
            this.checked = [];
          }
      },
      submit(){
          MessageBox.confirm('确认移出该文章？').then(()=>{
            this.$api.deleArticles(JSON.stringify(this.checked)).then(obj=>{
                this.checked.forEach((v)=>{
                  this.all.forEach((vv,ii)=>{
                    if(vv.id == v){
                      this.all = this.all.removeByValue(vv);
                    }
                  })
                })
                this.all = [...this.all];
            })
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
  .container{
    height: 100%;
    overflow: hidden;
    .content{
      height: calc(100% - 0.8rem);
      overflow: hidden;
    }
    .btns{
      height: 0.8rem;
      box-sizing: border-box;
      padding: 0 0.44rem;
      font-size: 0.32rem;
      display: flex;
      justify-content: space-between;
      button{
        line-height: 0;
        padding: 0.24rem 0;
        background: $bg;
        color: $baseBlue;
      }
      button:nth-of-type(1){
        color: $i2Gray;
      }
      #blue{
        color: $baseBlue;
      }
    }
    .content{
      background: white;
      padding-left: 0.36rem;
      .modules{
        height: 1.3rem;
        box-sizing: border-box;
        border-bottom: 1px solid $gray;
        padding-top: 1px;
        position: relative;
        padding-right: 0.76rem;
        box-sizing: border-box;
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
        label{
          position: absolute;
          right: 0.36rem;
          height: 100%;
          width: 0.4rem;
          top:0;
          input{
            display: none;
          }
          i{
            display: inline-block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: url(../../assets/media/img/order-address_unSelected_icon.png) no-repeat right center;
            background-size: 0.4rem 0.4rem;
          }
          input:checked+i{
            background: url(../../assets/media/img/order-address_selected_icon.png) no-repeat right  center;
            background-size: 0.4rem 0.4rem;
          }
        }
      }
    }
  }
</style>
