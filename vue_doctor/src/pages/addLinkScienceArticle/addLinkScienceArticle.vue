<template>
<div class="container">
  <div class="add">
    <input type="text" placeholder="请输入或粘贴文章链接" @click.stop="maskShow(true)" onfocus="this.blur()"   readonly="true"  :value="text"><span class="line">
    </span><input type="text" placeholder="请输入文章标题" v-model="title">
  </div>
  <!--<div class="switch">-->
    <!--<hw-switch :config="hwSwitch" v-on:event="change"></hw-switch>-->
  <!--</div>-->
    <div :class="['content',{'content1' : all}]"  v-show="content">
      <h6 class="title"><i class="icon" @click.stop="change">
        <span :class="all ? 'icon-down-arrow' : 'icon-up-arrow'"></span>
        {{all ? '返回编辑' : '预览全部' }}
      </i></h6>
      <template v-if="!copyShow">
          <!--<div class="iiframe" v-show="content">-->
            <!--<iframe :srcdoc="content" frameborder="0"></iframe>-->
          <!--</div>-->
           <div class="iframe" v-html="content">

           </div>
      </template>
      <div class="mask"></div>
      <div class="submit-con">
        <button class="submit" @click.stop="submit">完成</button>
      </div>
    </div>
  <copy-prompt v-model="text" @cancle="cancle" @confirm="confirm" id="copy"  :show="copyShow"></copy-prompt>
</div>
</template>

<script>
  import hwSwitch from '../../btns/hwSwitch'
  import hwButton from '../../btns/hwButton.vue'
  import copyPrompt from '../../components/copyPrompt.vue'
  import axios from 'axios'
  import {Toast} from '../../components/hw-components'
  export default{
    data(){return{
        set : {switch : 2},
        text : '',
        all : false,
        content : '',
        title : '',
        copyShow : '',
//        frame : ''
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '新建链接科普文章', fShow : false, hShow : true});
      this.maskShow(false);
    },
    computed : {
      hwSwitch(){
        return {
          title : '允许智呼吸平台其他医生查看',
          status : this.set.switch == '2' ? true : false
        }
      },
      isIOS(){
          return this.$store.state.isIOS;
      }
    },
    methods:{
      change(){
        this.all = !this.all;
      },
      confirm(){
        if(this.text && /[http|https]:\/\/.+/.test(this.text)){
//          var link = 'http://mp.weixin.qq.com/s/SGAFQ2zaIK8T8VnJGcc67w';
//          let _this = this;
//          if(/[http|https]:\/\/mp\.weixin\.qq\.com/.test(this.text)){
//            axios.get(`https://cors-anywhere.herokuapp.com/${this.text}`).then((obj)=>{
//              let html = obj.data;
//              html = html.replace(/msg_title.+=.+;/gi, function (match, capture) {
//                _this.title = match.split("\"")[1];
//                return match;
//              });
//            });
//          }
          axios.get(`${DOCLINKAPI}/articles/url?url=${window.encodeURIComponent(this.text)}`).then((obj)=>{
            let _this = this;
            if(obj.data){
              if(/[http|https]:\/\/mp\.weixin\.qq\.com/.test(this.text)){
                obj.data = obj.data.replace(/msg_title.+=.+;/gi, function (match, capture) {
                  _this.title = match.split("\"")[1];
                  return match;
                });
              }else{
                 obj.data = obj.data.replace(/<title.*?>.*?<.*?\/title>/g,function (match) {
                     _this.title = match.slice(match.indexOf('>')+1,match.lastIndexOf('<'));
                     return match;
                 })
              }
              obj.data = obj.data.replace(/data-src="/g, `src="`).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, '').replace(/https/g,'http');
              obj.data = obj.data.replace(/<meta.*?(?:>|\/>)/gi,function (match){
                  if(/name="viewport"/.test(match)){
                    return '';
                  }else{
                      return match;
                  }
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
              this.content = obj.data;
            }else{
                Toast('暂不支持该文章！');
            }
          })
          this.maskShow(false);
        }else{
            Toast('请输入合法链接!');
        }
      },
      maskShow(v){
        this.copyShow = v;
        this.$store.commit('UPDATE_MASK',v);
        if(v){
            this.content = '';
        }
      },
      submit(){
          if(this.text && this.title){
            this.$api.addArticles({link : this.text ,title : this.title}).then(obj=>{
                this.$router.routeBack();
            });
          }else{
              Toast('请填写完成信息！');
          }
      },
      cancle(){
        this.maskShow(false);
        this.text = '';
        this.title = '';
      }
    },
    components : {hwSwitch,copyPrompt,hwButton},
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
.container{
  height: 100%;
  overflow: hidden;
  /*line-height: 0;*/
  .add{
    line-height: 0;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    margin-bottom: 0.57rem;
    input{
      line-height: normal;
      font-size: 0.32rem;
      background: white;
      /*line-height: 0.4rem;*/
      border: 0.44rem solid white;
      display: inline-block;
      width: 100%;
      box-sizing: border-box;
      margin-top: 0;
    }
    ::-webkit-input-placeholder{
      color: $i2Gray;
      font-size: 0.32rem;
    }
    .line{
      display: inline-block;
      width: 100%;
      position: absolute;
      height: 1px;
      background: $gray;
      left: 0.44rem;
      top:1.2rem;
    }
  }
  .switch{
    padding-left: 0.14rem;
    background: white;
  }
  .content{
    overflow: hidden;
    background: white;
    transition: all 0.3s;
    position: fixed;
    width: 100%;
    height: 67%;
    bottom: 0;
    z-index: 999999999999;
    .title{
      height: 0.68rem;
      display: flex;
      justify-content: center;
      .icon{
        display: inline;
        font-size: 0.28rem;
        line-height: 0.28rem;
        height: 0.58rem;
        box-sizing: border-box;
        padding: 0.15rem 0.2rem;
        background: #feb560;
        color: white;
        border-bottom-left-radius: 0.16rem;
        border-bottom-right-radius: 0.16rem;
        box-shadow: 0.0228rem -0.03rem  0.25rem 0.027rem  #cd9d64;
        span{
          font-size: 0.26rem;
        }
      }
    }
    .iframe{
      height: calc(100% - 1.3rem - 0.68rem);
      padding: 0 0.3rem;
      box-sizing: border-box;
      position: relative;
      overflow: scroll;
      iframe{
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      font-size: 0.32rem;
    }
    .mask{
      position: absolute;
      width: 100%;
      height: 0.8rem;
      background: linear-gradient(180deg ,rgba(255,255,255,0) 20%, rgb(255,255,255) 100%);;
      bottom: 1.3rem;
    }
  }
  .content1{
    height: 100%;
    width: 100%;
    position: fixed;
    bottom: 1.8rem;
    width: 100%;
    bottom: 0;
    z-index: 999999999999;
    transition: all 0.3s;
  }
  .submit-con{
    z-index: 9999999999999;
    display: block;
    width: 100%;
    padding-bottom: 0.3rem;
    background: white;
    bottom: 0.3rem;
    position: fixed;
    bottom: 0;
    .submit{
      display: block;
      width: 6.9rem;
      height: 1rem;
      margin: 0 auto;
      line-height: 1rem;
      background: rgb(6, 147, 252);
      color: white;
      font-size: 0.4rem;
      text-align: center;
      border-radius: 0.06rem;
    }
  }

}

</style>
