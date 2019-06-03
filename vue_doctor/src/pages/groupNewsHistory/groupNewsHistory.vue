<template>
  <div class="container">
    <div class="content">
      <div class="loadWrapper">
        <loading-more :data="arr" :pulldownLoad="true" @pulldown="load" :tip="isTip">
          <div class="modules" v-for="(item,index) in arr" v-show="item.content">
            <h6 class="title"><i class="icon-group-news-1">
            </i>{{Object.keys(JSON.parse(item.accounts)).length}}位会员已{{Object.keys(JSON.parse(item.accounts)).length == '1' ? '' : '分别'}}收到消息
              <i class="circle" @click.stop="dele(index)"><span></span><span></span><span></span></i></h6>
            <template v-if="item.type == 'text'">
              <p>{{item.content}}</p>
            </template>
            <template v-else-if="item.type == 'doctorOrderTime'">
              <p class="appint" @click.stop="orderTimeShow = !orderTimeShow">
                <i class="icon-chat-chart2 icon">
                  <i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i>
                </i>
                <span>
                  可以根据我的门诊时间表，安排时间前来门诊就诊
                </span>
              </p>
            </template>
            <template v-else-if="item.type == 'requestDeviceData'">
              <p class="appint">
                <i class="icon-chat-chart1 icon">
                  <i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i>
                </i>
                <!--<span>-->
                  请对方提供近两周肺功能检测数据图表
                <!--</span>-->
              </p>
            </template>
            <template v-else-if="item.type == 'popularArticle'">
              <p class="appint1" @click.stop="preViewArticle(item.content.id)">
                <span class="popularArticle icon"></span>
                <!--<span>-->
                {{item.content ? item.content.title : '邀请会员阅读科普文章'}}
                <!--</span>-->
              </p>
            </template>
            <template v-else-if="item.type == 'img'">
              <p class="img">
                <img :src="item.content.src" :style="chatImgData(item.content)" @click.stop="preView(item.content.src)">
              </p>
            </template>
            <template v-else-if="item.type == 'voice'">
              <p class="voice">
                <i class="icon-chat-voicePlay" @click.stop="palyVoice(item)">
                </i>
              </p>
            </template>
            <h6 class="fn" @click.stop="send(item)">{{changeTime(item.created)}}<button>继续发送</button></h6>
          </div>
          <empty :config="{show : arr.length == 0 , text : '您还没有群发消息哦！'}"></empty>
        </loading-more>
      </div>
    </div>
    <button class="submit" @click.stop="skip">新建群发</button>
    <!--发送门诊时间给用户-->
    <div class="order-time" v-show="orderTimeShow" >
      <header><i class="icon-return-boldleft" @click.stop="orderTimeShow = false"></i>门诊详情</header>
      <!--<ul class="select">-->
      <!--<li v-for="(item,index) in orderSet" :class="{'selected' : index == selectIndex}" @click.stop="select(index)">{{item.hospital}}</li>-->
      <!--</ul>-->
      <div :class="['order-content','order-content1']" >
        <ul class="section" v-for="item in orderSet">
          <li class="timeData"><span class="day">{{item.time}}</span><span class="time">{{$means.numToday(item.week_day)}}{{$means.numTotime(item.week_time)}}</span></li>
          <li class="hospital">{{item.hospitals}}</li>
          <li class="count">剩余预约数:<span>{{item.set_count == '0' || item.appoint_count == 0  ?   0 : item.appoint_count}}</span>人</li>
          <li class="address">{{item.address ? item.address : '未填写'}}</li>
          <!--<a href="javascript:;"  :class="['order-btn',{'order-btn-deactive' : item.set_count == '0' || item.appoint_count == 0 }]"  @click.stop="orderAdd(item)">立即预约</a>-->
        </ul>
      </div>
      <empty :config="{show : orderSet.length == 0 , text : '您还没有设置可预约门诊！'}"></empty>
      <!--<button class="order-time-send" @click.stop="sendOrderTime" v-show="orderTimeBtnShow">发送给会员</button>-->

    </div>
  </div>
</template>

<script>
  import loadingMore from  '../../components/loadingMore'
  import empty from '../../components/empty'
  import Voice from '../../libs/voice'
  import {Toast} from "../../components/hw-components";
export default{
    name : 'groupNewsHistory',
    components:{loadingMore,empty},
    data(){return{
        page : 1,
        arr : [],
        isTip : false,
        index : '',
        orderSet : [],
        voiceContext : '',
        orderTimeShow : false,
        actionsheetConfig :{
          show : false,
          btns :[
            {name:'删除',method:()=>{
              this.$api.dGroupNotify(this.arr[this.index].id).then(obj=>{
                this.actionsheetConfig.show = false;
                this.arr.splice(this.index,1)
              })
              this.actionsheetConfig.show = false;}},
            {name:'取消',method:()=>{
              this.actionsheetConfig.show = false;
            }},
          ]
        }
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{fShow : false, hShow : true,title : '群发消息'});
      this.$store.commit('SET_IMG_ARR',{way : 'clear' });
      this.$api.gGroupNotify(1).then(obj=>{
          this.arr = obj.notifies;
          this.$store.commit('SET_IMG_ARR',{way : 'clear' });
          this.arr.forEach((v)=>{
              if(v.type == 'img'){
                v.content = JSON.parse(v.content);
                  this.$store.commit('SET_IMG_ARR',{way : 'push' ,msg : v.content.src});
              }
              if(v.type == 'popularArticle'){
                v.content = JSON.parse(v.content);
              }
          })
      })
      this.$api.appointSetList().then(obj=>{
        this.orderSet = obj.set;
      })
    },
   methods:{
     dele(v){
       this.index = v;
       this.actionsheetConfig.show = true;
       this.$store.commit('SET_ACTION_SHEET',this.actionsheetConfig);
     },
     preViewArticle(v){
       if(v){
         this.$router.push({path : `/${v}/2/collectScienceArticle`});
       }
     },
     skip(){
       this.$router.push({path : '/groupNews'});
     },
     send(v){
       if(v.accounts != '[]'){
         let acc = v.accounts;
         acc = JSON.parse(v.accounts);
         for(let k in acc){
           acc[k]  =  {name : acc[k]};
         }
          window.sessionStorage['groupNews'] = JSON.stringify(acc);
          if(v.type == 'popularArticle'){
            window.sessionStorage['sendScienceing'] = JSON.stringify({id : v.content.id, link : v.content.link ,title : v.content.title});
          }
          this.$router.push({path : '/groupSendNews'});
       }else{
         Toast('没有要发送的会员，请新建群发！');
       }
     },
     chatImgData(text){
       let arr3 = [];
       if (/@/.test(text)) {
         var arr1 = text.split('@');
         var arr2 = arr1[1].split('x');
         var width = parseInt(arr2[0]);
         var height = parseInt(arr2[1]);
         var scale = width/height;
         var imgHeight = height;
         var imgWidth = width;
         if (width > 300 || height > 300) {
           if (scale > 1) {
             imgHeight = 300/scale;
             imgWidth = 300;
           }else{
             imgWidth = 300*scale;
             imgHeight = 300;
           }
         }
         arr3 = [arr1[0],imgWidth,imgHeight];
       }else{
         if (text.hasOwnProperty('width')) {
           var scale1 = text.width/text.height;
           if (text.width > 400 || text.height > 400) {
             if (scale1 > 1) {
               text.height = 400/scale1;
               text.width = 400;
             }else{
               text.width = 400*scale1;
               text.height = 400;
             }
           }
           arr3 =  [text.src,text.width,text.height];
         }
       }
       if(arr3[1] == '0'  || !arr3[1]){
         return '';
       }else{
         return `width:${parseFloat(arr3[1])/100}rem;height:${parseFloat(arr3[2])/100}rem`
       }
     },
     palyVoice(item){
       item = JSON.parse(item.content);
       if(this.voiceContext){
         this.voiceContext.close();
         this.voiceContext = '';
       }
       let src = item.src;
       let time = item.time.toString();
       let s = new Voice(src);
       s.play()
       this.voiceContext = s.context;
       let target = event.target;
       if(target.className == 'icon-chat-voicePlay'){
         target.className = 'icon-chat-voicePause';
       }
       setTimeout(function(){
         target.className = 'icon-chat-voicePlay';
       },parseInt(time.replace(/"/g,''))*1000);
     },
     preView(src){
       this.$store.dispatch('wxImgView',src);
     },
     load(v){
       if(v){
         setTimeout(()=>{
           this.page ++;
           this.$api.gGroupNotify(this.page).then(obj=>{
             if(obj.notifies.length == 0){
               this.isTip = true;
             }
             this.arr = this.arr.concat(obj.notifies);
           })
         },1000)
       }

     },
     changeTime(time){
      var tt = time.split(' ')[0];
      var t1 = time.split(' ')[1];
      var t2 = t1.split(':')[0] + ':' + t1.split(':')[1];
      return tt.split('-')[0]+'/'+tt.split('-')[1]+'/'+tt.split('-')[2]+' '+t2;
     },
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
  .container {
    padding: 0 0.2rem;
    overflow: hidden;
    .modules{
      background: white;
      padding: 0 0.4rem 0 0.35rem;
      margin: 0.2rem;
      .title{
        padding-top: 0.2rem;
        height: 0.8rem;
        display: flex;
        align-items: center;
        font-size: 0.32rem;
        position: relative;
        i{
          font-size: 0.4rem;
          margin-right: 0.16rem;
        }
        .circle{
          display: flex;
          height: 0.4rem;
          align-items: center;
          width: 0.45rem;
          justify-content: space-between;
          position: absolute;
          right: 0;
          top: 0.4rem;
          span{
            display: inline-block;
            width: 0.1rem;
            height: 0.1rem;
            border-radius: 50%;
            background: $iconGray;
          }
        }
      }
      p{
        font-size: 0.28rem;
        color: $fGray;
        /*word-break: break-all;*/
        /*word-wrap: break-word;*/
        line-height: 0.4rem;
        padding: 0.1rem 0.34rem;
        border: 1px solid $borderGray;
        border-radius: 0.1rem;
      }

      .fn{
        padding: 0.36rem 0;
        font-size: 0.28rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        button{
          display: inline-block;
          height: 0.6rem;
          line-height: 0.6rem;
          padding: 0 0.34rem;
          border-radius: 0.06rem;
          background: $baseBlue;
          color: white;
          font-size: 0.28rem;
        }
      }
      .appint{
        padding: 0.24rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .icon{
          font-size: 0.86rem;
          margin-right: 0.2rem;
        }
        span{
          display: inline-block;
          height: 0.8rem;
        }
      }
      .appint1{
        display: flex;
        align-items: center;
      }
      .img{
        border: none;
        border-radius: 0;
        border-bottom: 1px solid $borderGray;
        padding: 0.27rem 0 0.38rem 0.24rem;
      }
      .voice{
        padding: 0.5rem 0;
        display: flex;
        justify-content: center;
        i{
          font-size: 1rem;
        }
      }
    }
    .content{
      height: calc(100% - 1.4rem);
      position: relative;
      /*border: 1px solid red;*/
      overflow: hidden;
    }
    .loadWrapper{
      height: 100%;
      overflow: hidden;
    }
    .submit{
      display: block;
      margin: 0.2rem auto;
      width: 6.9rem;
      height: 1rem;
      line-height: 1rem;
      background: rgb(6, 147, 252);
      color: white;
      font-size: 0.4rem;
      text-align: center;
      border-radius: 0.06rem;
    }
  }


//门诊时间表样式
.order-time {
  background: url(../../assets/media/img/my-oreder_bg.png) rgb(240,239,245) no-repeat top left;
  padding-top: 1px;
  background-size: 100% 2.95rem;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  left: 0;
  top: 0;
  z-index: 56;
  header{
    position: relative;
    i{
      position: absolute;
      font-size: 0.34rem;
      transform: translateY(-50%);
      top: 50%;
      left: 0.3rem;
    }
  }
  .order-content{
    height: calc(100% - 2.8rem);
    overflow: scroll;
    padding-bottom: 0.3rem;
    box-sizing: border-box;

  }
  .order-content1{
    height: calc(100% - 1rem);
  }
  .order-time-send{
    display: block;
    margin: 0.3rem  auto 0;
    width: 6.9rem;
    height: 1rem;
    line-height: 1rem;
    background: rgb(6, 147, 252);
    color: white;
    font-size: 0.4rem;
    text-align: center;
    border-radius: 0.06rem;
  }
}
.order-time header{
  width: 7.2rem;
  height: .6rem;
  line-height: .6rem;
  font-size: .32rem;
  color: white;
  //background: url(../../assets/media/img/arrow-white_down_icon.png) rgb(74, 157, 254) no-repeat right .6rem center;
  text-align: center;
  margin: 0.2rem  auto;
  background-size: 0.37rem 0.2rem;
  box-sizing: border-box;
  padding:  0 .95rem;
  -webkit-border-radius: .16rem .16rem 0 0;
  -moz-border-radius:  .16rem .16rem 0 0;
  -ms-border-radius:  .16rem .16rem 0 0;
  -o-border-radius:  .16rem .16rem 0 0;
  border-radius:  .16rem .16rem 0 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.order-time  .select{
  position: absolute;
  width: 7.2rem;
  left: 50%;
  margin-left: -3.60rem;
  top: .8rem;
  z-index: 20;
  height: 0;
  background: white;
  -webkit-border-radius:  0 0 .16rem .16rem;
  -moz-border-radius:  0 0 .16rem .16rem;
  -ms-border-radius:  0 0 .16rem .16rem;
  -o-border-radius:  0 0 .16rem .16rem;
  border-radius:  0 0 .16rem .16rem;
  overflow: hidden;
}
.order-time .content-deactive{
  visibility: hidden;
}
.order-time  .select li{
  height: .9rem;
  font-size: .34rem;
  text-align: center;
  background: white;
  line-height: .9rem;
  color: rgb(132, 188, 252);
}
.order-time  .select  .selected{
  color: rgb(42, 140, 255);
  font-weight: bolder;
}
/*选择列表 活跃状态*/
.order-time   .select-active{
  height: auto;
}
.order-time  .select .select-li-active{
  color: rgb(42, 140, 255);
}
/*每个box*/
.order-time .section{
  width: 7.2rem;
  height: 2.66rem;
  background: white;
  -webkit-border-radius:.2rem;
  -moz-border-radius: .2rem;
  -ms-border-radius: .2rem;
  -o-border-radius:  .2rem;
  border-radius:  .2rem;
  margin:  .1rem auto;
  box-sizing: border-box;
  padding: .2rem .46rem .42rem .45rem;
  position: relative;
}
.order-time .section .timeData{
  font-size: .34rem;
  padding-left: .8rem;
  height: .7rem;
  line-height: .7rem;
  background: url(../../assets/media/img/my-order_day_icon.png) no-repeat left center;
  position: relative;
  background-size: 0.44rem 0.44rem;
}
.order-time .section .timeData .time{
  margin-left: .5rem;
}
//.order-time .section .timeData .order-status{
//  height: .7rem;
//  padding-left: .3rem;
//  position: absolute;
//  right: 0;
//  background: url(../../assets/media/img/green-circle_icon.png) no-repeat left center;
//  background-size: 0.16rem 0.16rem;
//}
///*约满*/
//.order-time .section .timeData .maxOrder{
//  background: url(../../assets/media/img/red-circle_icon.png) no-repeat left center;
//  color: rgb(156, 155, 155);
//  background-size: 0.16rem 0.16rem;
//}
///*出诊不可约*/
//.order-time .section .timeData .noOrder{
//  background: url(../../assets/media/img/gray-circle_icon.png) no-repeat left center;
//  color: rgb(156, 155, 155);
//  background-size: 0.16rem 0.16rem;
//}
.order-time .section .hospital{
  height: .6rem;
  line-height: .6rem;
  color: rgb(114, 113, 113);
  font-size: .32rem;
}
.order-time .section .count{
  height: .5rem;
  line-height: .5rem;
  font-size: .26rem;
  color: rgb(114, 113, 113);
}
.order-time .section .count span{
  color: rgb(42, 140, 255);
  font-size: .34rem;
}
.order-time .section .address{
  font-size: .26rem;
  padding-left: .45rem;
  height: .5rem;
  line-height: .5rem;
  color: rgb(114, 113, 113);
  background: url(../../assets/media/img/order-address_icon.png) no-repeat left center;
  background-size: 0.3rem 0.36rem;
}
/*免费预约按钮*/
.order-time .section .order-btn{
  display: inline-block;
  width: 1.75rem;
  height: .5rem;
  line-height: .5rem;
  text-align: center;
  color: rgb(42, 140, 255);
  border: 1px solid rgb(42, 140, 255);
  background: white;
  font-size: .34rem;
  position: absolute;
  right: .46rem;
  bottom: .4rem;
  -webkit-border-radius:.12rem;
  -moz-border-radius: .12rem;
  -ms-border-radius: .12rem;
  -o-border-radius:  .12rem;
  border-radius:  .12rem;
}
.order-time .section .order-btn-deactive{
  background: rgb(204, 201, 201);
  color: white;
  border: 1px solid rgb(204, 201, 201);
}
.popularArticle{
  display: block;
  min-width: 0.85rem;
  height: 0.85rem;
  background: url(../../assets/media/img/chat-scienceing-icon.png);
  background-size: 100% 100%;
  margin-right: 0.2rem;
}
</style>
