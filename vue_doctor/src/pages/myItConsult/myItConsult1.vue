<template>
<div class="container">
    <header class="f32">
       <span :class="{'active' : filter.status == '1'}" @click.stop="filter.status = '1';filter.page = 1">待回复 <i>({{c1}})</i></span>
       <span :class="{'active' : filter.status == '2'}" @click.stop="filter.status = '2';filter.page = 1">已回复 <i>({{c2}})</i></span>
       <span :class="{'active' : filter.status == '3'}" @click.stop="filter.status = '3';filter.page = 1">已结束<i>({{c3}})</i></span>
    </header>
    <empty :config="{show : all.length == 0 , text : '暂时还没咨询哦！'}"></empty>
    <div class="content  loadWrapper">
       <loading-more :data="all" :pullupLoad="true" @pullup="load"  :tip="isTip">
         <ul v-for="item,index in all" @click.stop="skip1(item)" class="f32">
           <li>会员姓名：<span class="gray">{{item.name}}</span>
             <template v-if="item.order_status == '2'">
               <!--<template v-if="item.replay_status == '1'">-->
                 <!--<span class="status">新咨询</span>-->
               <!--</template>-->
               <template v-if="item.replay_status == '2'">
                 <span class="status1">待回复</span>
               </template>
               <template v-else-if="item.replay_status == '3'">
                 <span class="status2">已回复</span>
               </template>
             </template>
             <template v-if="item.order_status == '3'">
               <span class="status3">已取消</span>
             </template>
             <template v-else-if="item.order_status == '4'">
               <span class="status2">已完成</span>
             </template>
           </li>
           <li>会员信息：<span class="gray">{{item.sex}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{{item.age}}岁</span>
             <!--<span class="address"><i class="icon-hospital-area" v-show="item.city"></i>{{item.city}}</span>-->
           </li>
           <li>所在地区：<span class="gray">{{item.city ? item.city : '未填写'}}</span></li>
           <template v-if="item.order_type == '2'">
             <li>服务项目：<span class="gray">图文咨询（按次）</span>
             </li>
             <template v-if="item.question" >
               <li>希望以下帮助：</li>
               <li class="gray q" v-for="item1 in JSON.parse(item.question)"> <i class="circle"></i>{{item1}}</li>
             </template>
           </template>
           <template v-else-if="item.order_type == '3'">
             <li>服务项目：<span class="gray">图文咨询（按期）</span>
             </li>
           </template>
           <template v-else-if="item.order_type == '4'">
             <li>服务项目：<span class="gray">免费随访</span>
             </li>
           </template>
             <template v-if="item.order_status == '3'">
               <li class="fn f28">取消时间：{{changeTime(1,item.cancel_time)}}
               <!--<button class="btn3">已取消</button>-->
               </li>
             </template>
              <template v-else-if="item.order_status == '2'">
                <template v-if="item.replay_status == '1'">
                  <li class="fn f28">咨询时间：{{changeTime(2,item.inquiry_time)}}
                    <button @click.stop="skip(item)">去解答</button>
                  </li>
                </template>
                <template v-else-if="item.replay_status == '2'">
                  <li class="fn f28">咨询时间：{{changeTime(2,item.inquiry_time)}}
                    <button class="btn1" @click.stop="skip(item)">去回复</button>
                  </li>
                </template>
                <template v-else-if="item.replay_status == '3'">
                  <li class="fn f28">回复时间：{{changeTime(2,item.inquiry_time)}}
                    <button class="btn2" @click.stop="skip(item)">去交流</button>
                  </li>
                </template>
              </template>
             <template v-else-if="item.order_status == '4' && item.order_type != '8'">
               <li class="fn f28">咨询时间：{{changeTime(2,item.inquiry_time)}}
               <button class="btn3"  @click.stop="skip2(item)">添加病历描述</button>
               </li>
             </template>
         </ul>
       </loading-more>
    </div>
</div>
</template>

<script>
  import loadingMore from '../../components/loadingMore'
  import empty from '../../components/empty'
export default{
    name : 'myItConsult',
    components:{loadingMore,empty},
    data(){return{
        filter : {status : '' , page : 1},
        all : [],
        isTip : false,
        c1 : '0',
        c2 : '0',
        c3 : '0',
        old : {status : '',page : ''}
    }},
    mounted(){
      document.querySelector('.nav_submit').onclick =()=>{
        this.$router.push({path : '/workServiceSet/consultSet'});
      }
    },
    created(){
      this.$store.commit('UPDATE_NAV',{title : '我的咨询', fn: '设置',fShow : false, hShow : true});
      if(this.$route.params.status != '0'){
          this.filter.status = this.$route.params.status;
      }
      this.$store.dispatch('unReadChatCount',1);
    },
    watch : {
      filter : {
          handler: function (val,oldVal) {
              if(this.old.status != val.status){
                  this.filter.page = 1;
                  Object.assign(this.old,this.filter);
                  this.reload();
              }
          },
          deep: true
      }
    },
    methods:{
      changeTime(num,time){
          if(time){
            if(num == 1){
              var t1 = time.split(' ')[0];
              var t2 = time.split(' ')[1];
              return t1.split('-')[0]+'/'+t1.split('-')[1]+'/'+t1.split('-')[2]+' '+t2.split(':')[0]+':'+t2.split(':')[1];
            }else if(num == 2){
              return time.split('-')[0]+'/'+time.split('-')[1]+'/'+time.split('-')[2];
            }
          }
      },
        load(v){
             if(v){
               setTimeout(()=>{
                 this.filter.page++;
                 this.$api.myInquiries(this.filter).then(obj=>{
                   this.c1 = obj.count1;
                   this.c2 = obj.count2;
                   this.c3 = obj.count3;
                   if(obj.orders.length == 0){
                     this.isTip = true;
                   }
                   if(this.old.status != this.filter.status){
                     this.all = obj.orders;
                   }else{
                     this.all = this.all.concat(obj.orders);
                   }
                 })
               },1000)
             }
        },
        reload(){
          this.$api.myInquiries(this.filter).then(obj=>{
            this.isTip = false;
            this.c1 = obj.count1;
            this.c2 = obj.count2;
            this.c3 = obj.count3;
            this.all = obj.orders;
            if(obj.orders.length == 0){
              this.isTip = true;
            }else{
                this.isTip = false;
            }
          })
        },
        skip(v){
            this.$router.push({path : `/${v.account}/chat`});
        },
        skip1(v){
            if(v.order_type != '4'){
              this.$router.push({path : `/${v.order_no}/indentDetail`});
            }
        },
        skip2(v){
          this.$router.push({path : `/${v.account}/pathography`});
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
.container{
  overflow: hidden;
  background: url(../../assets/media/img/my-oreder_bg.png)  $bg no-repeat left top -1rem;
  background-size: 100% 2.95rem;
  header{
    width: 7rem;
    height: 0.6rem;
    /*font-size: 0.32rem;*/
    color: white;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    border: 1px solid white;
    border-radius: 0.06rem;
    span{
      display: inline-block;
      width: 40%;
      text-align: center;
      line-height: 0.6rem;
      border-right: 1px solid white;
      i{
        line-height: 0.6rem;
      }
    }
    span:nth-of-type(3){
      border-right: none;
    }
  }
  .content{
    margin-top: 0.2rem;
    height: calc(100% - 0.8rem);
    overflow-y: hidden;
    ul{
      /*font-size: 0.32rem;*/
      width: 7rem;
      margin: 0.2rem auto 0;
      background: white;
      border-radius: 0.06rem;
      padding: 0.24rem 0.3rem;
      line-height: 0.58rem;
      box-sizing: border-box;
      li{
        position: relative;
        word-break: break-all;
      }
      .gray{
        color: $fGray;
      }
      .address{
          i{
            font-size: 0.28rem;
            margin: 0 0.2rem 0 0.4rem;
            &:before{
              color: $iconGray;
            }
          }
      }
      .circle{
        display: inline-block;
        width: 0.18rem;
        height: 0.18rem;
        background: $baseBlue;
        border-radius: 50%;
        margin: 0 0.2rem 0 0.14rem;
        position: absolute;
        left: 0;
        top: 0.18rem;
      }
    }
    .status{
        color: $baseBlue;
        position: absolute;
        right: 0;
    }
    /*待回复*/
    .status1{
      color: $orange;
      position: absolute;
      right: 0;
    }
    /*已回复*/
    .status2{
      color: black;
      position: absolute;
      right: 0;
    }
    /*已取消*/
    .status3{
      color: $fGray;
      position: absolute;
      right: 0;
    }
    .q{
      /*font-size: 0.28rem;*/
      padding-left: 0.52rem;
      position: relative;
    }
    .fn{
      padding-top: 0.3rem;
      margin-top: 0.2rem;
      border-top: 1px solid $gray;
      line-height: 0.6rem;
      color: $fGray;
      display: flex;
      /*font-size: 0.28rem;*/
      justify-content: space-between;
      button{
        line-height: 0.6rem;
        padding: 0 0.3rem;
        background: $baseBlue;
        /*font-size: 0.32rem;*/
        color: white;
        border-radius: 0.06rem;
      }
      /*待回复*/
      btn1{
          background: $orange;
      }
      /*去交流*/
      .btn2{
        border : 1px solid $iconGray;
        background: white;
        color: $fGray;
      }
      /*添加病例描述*/
      .btn3{
        border : 1px solid $baseBlue;
        background: white;
        color: $baseBlue;
      }
      /*超时未回复*/
      .btn4{
        color: $fGray;
        background: white;
      }
    }
  }
  .active{
    background: white;
    color: $baseBlue;
  }
}
</style>
