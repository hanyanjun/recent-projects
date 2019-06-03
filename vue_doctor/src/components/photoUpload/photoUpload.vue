<template>
  <!-- 详细问题内容 -->
  <div class="que_content">
    <h6 class="title" v-show="config.title">{{config.title}}</h6>
    <div :class="['photoes' , {'photoes1' : config.title}]" >
      <div class="images"><img :src="item"  :class="{'img1' : !config.title}" v-for="(item,index) in imgs" :index="index" @click.stop="operate(index)">
        <label :for="'p'+config.id" v-show="imgs.length < config.limit"><span :class="{'firstimage':imgs.length==0,'addimages': imgs.length>0}"></span>
      </label><input type="file" name="" value="" :id="'p'+config.id" @change="addImg($event)" class="photo" ref="photo">
      </div>
      <p v-if="imgs.length == 0" v-html="config.photoTip"></p>
    </div>
    <h6 class="bottom" v-show="config.title"></h6>
  </div>
</template>
<script>
  //  import actionsheet from '../../components/actionsheet'
  import {Toast} from '../hw-components'
  export default{
    name : 'photoUpload',
    props : ['config','value'],
    data(){return{
      select:'',
      imgs: [],
      inde: '',
      countlength: '',
      actionsheetConfig : {show: false,
        btns:[
          {name:'重新上传',method: ()=>{
              document.getElementById('p'+this.config.id).click();
            }},
          {name:'删除',method:()=>{
              (this.imgs).splice(this.inde, 1);
            }},
          {name:'取消',method:()=>{
              this.actionsheetConfig.show = false;
              this.inde = '';
            }},
        ]
      }
    }},
    methods : {
      addImg(e){
//        if(this.imgs.length < this.config.limit){
        if(this.inde === ''){
          let f = document.getElementById('p'+this.config.id).files[0];
          this.FtoBase(f,(v)=>{
            (this.imgs).push(v);
          });
        }else{
          let f2 = document.getElementById('p'+this.config.id).files[0];
          this.FtoBase(f2,(v)=>{
            this.imgs[this.inde] = v;
            this.imgs = Object.assign([],this.imgs);
          });
        }
        e.target.value = '';
      },
      FtoBase(v,callback){
        let f = new FileReader();
        f.readAsDataURL(v);
        f.onload = ()=>{
          callback.call(this,f.result);
        }
      },
      operate(index){
        this.inde = index;
        this.$store.commit('SET_ACTION_SHEET',this.actionsheetConfig);
        this.actionsheetConfig.show = true;
      }

    },
    watch : {
      // countlength(v){
      //   sessionStorage[this.config.type] = v;
      //   this.$emit('input', v);
      // },
      'config.val':{
        handler:function(v){
          sessionStorage[this.config.type] = v;
          this.countlength = v.length;
          this.$emit('input', v);
        },
        deep:true
      },
      imgs(v){
        this.$emit('event',this.imgs);
        this.inde = '';
        this.actionsheetConfig.show = false;
        sessionStorage[`${this.config.type}_imgs`] = JSON.stringify(v);
      },
    },
    created(){
      this.$emit('input', this.config.val);
      this.countlength = this.config.val.length;
      if(this.config.type && window.sessionStorage[this.config.type]){
        this.countlength = window.sessionStorage[this.config.type];
      }
      if(this.config.type && window.sessionStorage[`${this.config.type}_imgs`]){
        this.imgs = JSON.parse(window.sessionStorage[`${this.config.type}_imgs`]);
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .container{
    overflow-y: hidden;
  }
  .que_content{
    margin-top: .2rem;
    width: 100%;
    /*width: 6.94rem;*/
    line-height: 0;
    background: #fff;
    padding: 0 0.25rem;
    box-sizing: border-box;
    .title{
      height: 0.74rem;
      line-height: 0.74rem;
      font-size: 0.32rem;
      border-bottom: 1px solid $iconGray;
    }
    .bottom{
      height: 0.3rem;
      border-top: 1px solid $iconGray;
    }
    .con{
      position: relative;
      height: 1.86rem;
    }
    textarea{
      width: 100%;
      /*width: 6.3rem;*/
      // width: 6.44rem;
      padding: .3rem .1rem .1rem .1rem;
      /*margin: .3rem .1rem .1rem .1rem;*/
      border: none;
      height: 1.7rem;
      font-size: 0.3rem;
      box-sizing: border-box;
      // background: yellow;
      /*margin: 0 .25rem;*/

    }
    /*.style1{*/
    /*border: 1;*/
    /*}*/
    .count{
      position: absolute;
      right: .4rem;
      font-size: .28rem;
      display: block;
      bottom: .05rem;
      line-height: .28rem;
      color:#c2c0c0;
    }
    .photoes{
      display: flex;
      margin-top: 0.54rem;
      .images{
        display: inline-block;
        min-width: 1.2rem;
        img{
          float:left;
          display: inline-block;
          width: 1.2rem;
          height: 1rem;
          margin-right: .18rem;
          margin-bottom: .2rem;
        }
        .img1{
          margin-right: .14rem;
        }
        /*img:nth-child(4n){*/
          /*margin-right: 0;*/
        /*}*/
        label{
          width: 1.2rem;
          height: 1rem;
          line-height:0;
          /*margin-bottom: .2rem;*/
          display:flex;
          justify-content: center;
          align-items: center;
          .firstimage{
            display: inline-block;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: url(./img/firstimage.png) no-repeat;
            background-size:100%;
          }
          .addimages{
            display: inline-block;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: url(./img/addimage.png) #eee center no-repeat ;
            background-size:0.54rem 0.54rem;
          }
        }
        input{
          display:none;
        }
      }
      p{
        display: inline-block;
        display: flex;
        align-items: center;
        font-size: .28rem;
        line-height: 1.5;
        margin-left: .2rem;
        color: $input_c;
      }
    }
    .photoes1{
      border-top: 1px solid transparent;
    }
  }
</style>
