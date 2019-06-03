<template>
<div class="container">
  <!--<template v-if="frame">-->
    <!--<div :class="['content',{'content1' : !btns}]">-->
      <!--<iframe  src="https://caniuse.com/#search=SRCDOC" frameborder="0" srcdoc="'<h6>哈回复哈市分行会计啊</h6>'" sandbox="allow-scripts"></iframe>-->
    <!--</div>-->
  <!--</template>-->
  <!--<template v-else>-->
    <div :class="['content',{'content1' : !btns},{'content2' : selfArticle}]" v-html="content" id="science_showArticle">
    </div>
  <!--</template>-->
  <div class="btns" v-show="btns && content">
    <button :class="['undo',{'done' : is_collected == 1}]" @click.stop="collect">{{is_collected == 1 ? '取消收藏' : '收藏'}}</button>
    <button @click.stop="send">发送</button>
  </div>
</div>
</template>

<script>
  import axios from 'axios'
  import {Toast,MessageBox} from "../../components/hw-components"
  export default{
    created(){
      this.$store.commit('UPDATE_NAV',{title : '', fShow : false, hShow : true});
      this.id = this.$route.params.id;
      this.btns = this.$route.params.status == '1';
      this.$api.articleDetail(this.id).then(obj=>{
        this.is_collected = obj.article.is_collected;
        this.info = obj.article;
        if(obj.article.content){
          this.$store.dispatch('wxShowShare');
          let desc;
          if(this.docInfo.hm_title){
            desc = `${this.docInfo.hm_title}从智呼吸分享了一篇文章，请仔细阅读，如有问题可在线咨询。`;
          }else{
            desc = `${this.docInfo.name}医生从智呼吸分享了一篇文章，请仔细阅读，如有问题可在线咨询。`;
          }
          this.$store.dispatch('wxShareTimeLineT',{
            title : this.info.title,
            link : `${PATSTATICLINK}/index.html#/${this.info.id}/shareScienceArticle`
          }).then(obj=>{
            this.$store.dispatch('wxShowShare');
          })
          this.$store.dispatch('wxShareAppMessageT',{
            title : this.info.title,
            desc : desc,
            link : `${PATSTATICLINK}/index.html#/${this.info.id}/shareScienceArticle`
          }).then(obj=>{
            this.$store.dispatch('wxShowShare');
          })
          this.content = obj.article.content;
          this.selfArticle = true;
        }else{
          axios.get(`${DOCLINKAPI}/articles/url?url=${window.encodeURIComponent(obj.article.link)}`).then((obj)=>{
            if(obj.data){
              obj.data = obj.data.replace(/data-src="/g, `src="`).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, '').replace(/https/g,'http');
              obj.data = obj.data.replace(/<meta.+name="viewport".+>/,function (match){
                return '';
              })
//              科普文章视频预览
              obj.data = obj.data.replace(/http:\/\/v\.qq\.com\/iframe\/preview.+?>/,function (match){
                  match = match.replace('http','https').replace('preview','player');
                  let arr = match.split('&');
                  arr.forEach((v,i)=>{
                      if(/width/.test(v)){
                          arr[i] = 'amp;width=300';
                      }
                      if(/height/.test(v)){
                        arr[i] = 'amp;width=150';
                      }
                  })
                return arr.join('&');
              })
              this.$store.dispatch('wxShowShare');
              let desc;
              if(this.docInfo.hm_title){
                desc = `${this.docInfo.hm_title}从智呼吸分享了一篇文章，请仔细阅读，如有问题可在线咨询。`;
              }else{
                desc = `${this.docInfo.name}医生从智呼吸分享了一篇文章，请仔细阅读，如有问题可在线咨询。`;
              }
              this.$store.dispatch('wxShareTimeLineT',{
                title : this.info.title,
                link : `${PATSTATICLINK}/index.html#/${this.info.id}/shareScienceArticle`
              }).then(obj=>{
                this.$store.dispatch('wxShowShare');
              })
              this.$store.dispatch('wxShareAppMessageT',{
                title : this.info.title,
                desc : desc,
                link : `${PATSTATICLINK}/index.html#/${this.info.id}/shareScienceArticle`
              }).then(obj=>{
                this.$store.dispatch('wxShowShare');
              })
              this.content = obj.data;
            }else{
                Toast('解析文章内容失败!');
            }
          })
        }

        this.$store.commit('UPDATE_NAV',{title : obj.article.title, fShow : false, hShow : true});
      })
    },
    data(){return{
        content : '',
        is_collected : '',
        id : '',
        info : '',
        btns : false,
        frame : '',
        selfArticle:false,
    }},
    computed:{
      conn(){
        return this.$store.state.chat.conn;
      },
      docInfo(){
        return this.$store.state.docInfo;
      },
    },
    mounted(){
      document.querySelector('.nav_back').onclick=(e)=>{
        this.$router.routeBack({status : this.$route.query.status});
      }
    },
    methods:{
        send(){
            let send = window.sessionStorage['sendScienceing'];
            if(send && JSON.parse(send).acc){
                send = JSON.parse(send);
                let obj1 = this.conn.createMsg({
                  from : this.docInfo.hx_account,
                  to : send.hx_acc,
                  data : {
                    type : 'popularArticle',
                    text : {
                        title : this.info.title,
                        link : this.info.link,
                        id : this.info.id
                    },
                    sendStatus : false,
                    relation : '',
                    toName : send.toName
                  }
                });
                this.$store.commit('UPDATE_CHAT_DATA',obj1);
                this.$store.commit('UPDATE_CHAT_PATINFO',{account : send.acc, hx_account : send.hx_acc});
                this.storeMessage(obj1);
                let index = this.$store.getters.chatDataIndex;
                this.$store.dispatch('sendMsg',{msg : obj1, index : index }).then(()=>{
                    setTimeout(()=>{
                      this.$router.push({path : `/${send.acc}/chat`});
                    },300);
                })
                if(this.is_collected == '2'){
                  this.$api.collectArticles(this.id).then(obj=>{
                    this.is_collected = '1';
                  })
                }
            }else{
                window.sessionStorage['sendScienceing'] = JSON.stringify({id : this.info.id, link : this.info.link ,title : this.info.title});
                this.$router.push({path : '/groupNews'});
            }
        },
        storeMessage(data){
          let m1 = window.localStorage['errMessage'];
          let send = JSON.parse(window.sessionStorage['sendScienceing']);
          m1 = m1 ? JSON.parse(m1) : {[this.docInfo.account] : {[send.acc] : {}}};
          if(!m1[this.docInfo.account]){
            m1[this.docInfo.account] = {[send.acc] : {}};
          }
          if(!m1[this.docInfo.account][send.acc]){
            m1[this.docInfo.account][send.acc] = {[data.id] : data};
          }else{
            m1[this.docInfo.account][send.acc][data.id] = data;
          }
          window.localStorage['errMessage'] = JSON.stringify(m1);
        },
        collect(){
            if(this.is_collected == '2'){
                this.$api.collectArticles(this.id).then(obj=>{
                    Toast('收藏成功！');
                    this.is_collected = '1';
                })
            }else{
              MessageBox.confirm('确认取消收藏？').then(()=>{
                this.$api.deleArticles(JSON.stringify([this.id])).then(obj=>{
                  this.is_collected = '2';
                })
              })
            }
        }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
.container{
  height: 100%;
  /*overflow: hidden;*/
  .content{
    height: calc(100% - 1.4rem);
    overflow: scroll;
  }
  .content2{
    background: #fff;
    height: calc(100% - 1.8rem);
    width: calc(100% - 0.6rem);
    padding:.2rem .3rem;
    word-wrap: break-word;
    font-size:16px;
  }
  iframe{
    display: block;
    width: 100%;
    height: 100%;
  }
  .content1{
    height: 100%;
  }
  .content2{
    background: #fff;
    height: calc(100% - 1.8rem);
    width: calc(100% - 0.6rem);
    padding:.2rem .3rem;
    word-wrap: break-word;
    font-size:16px;
  }
  .btns{
    display: flex;
    justify-content: space-around;
    height: 1.4rem;
    align-items: center;
    button{
      display: inline-block;
      font-size: 0.32rem;
      padding: 0.24rem 1.14rem;
      color: white;
      background: $baseBlue;
      border-radius: 0.08rem;
    }
    .undo{
      background: $orange;
      letter-spacing: 0.14rem;
    }
    .done{
      background: $iconGray;
      letter-spacing: 0.02rem;
    }
  }
}
</style>
