<template>
<div class="container">
    <header class="f32">
       <span :class="{'active' : filter.status == '1'}" @click.stop="tab(1)">待回复 <i :class="numClass(c1)">{{num(c1)}}</i></span>
       <span :class="{'active' : filter.status == '2'}" @click.stop="tab(2)">已回复 <i>({{c2}})</i></span>
       <span :class="{'active' : filter.status == '3'}" @click.stop="tab(3)">已结束<i>({{c3}})</i></span>
       <span :class="{'active' : filter.status == '4'}"  @click.stop="tab(4)">团队咨询<i :class="numClass(c4)">{{num(c4)}}</i></span>
    </header>
    <div class="content  loadWrapper" >
       <loading-more :data="all" :pullupLoad="true" @pullup="load"  :tip="isTip">
         <ul v-for="item,index in all" @click.stop="skip1(item)" :class="['f32',{'groupModule'  : item.order_type == '8' }, {'conEmptyCon' : item.next}]">
           <template v-if="!item.empty">
             <li class="teamName" v-show="filter.status == '4'">{{item.title}} <h6></h6></li>
             <li>会员姓名：<span class="gray">{{item.name}}</span>
               <template v-if="item.replay_status != '3'">
                 <span class="status1">待回复</span>
               </template>
               <template v-else>
                 <template v-if="item.order_status == '2'">
                     <span class="status2">已回复</span>
                 </template>
                 <template v-if="item.order_status == '3'">
                   <span class="status3">已取消</span>
                 </template>
                 <template v-else-if="item.order_status == '4'">
                     <span class="status2">已完成</span>
                 </template>
               </template>
             </li>
             <li>就诊人：<span class="gray">{{item.member_name}}</span></li>
             <li>信息：<span class="gray">{{item.sex}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{{item.age}}岁</span>
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
             <template v-if="filter.status != 4">
               <template v-if="item.replay_status == '1'">
                 <li class="fn f28">咨询时间：{{changeTime(2,item.inquiry_time)}}
                   <button @click.stop="skip(item)">去解答</button>
                 </li>
               </template>
               <template v-if="item.replay_status == '2'">
                 <li class="fn f28">咨询时间：{{changeTime(2,item.inquiry_time)}}
                   <button class="btn1" @click.stop="skip(item)">去回复</button>
                 </li>
               </template>
               <template v-if="item.replay_status == '3'">
                 <template v-if="item.order_status == '3'">
                   <li class="fn f28">取消时间：{{changeTime(1,item.cancel_time)}}
                     <!--<button class="btn3">已取消</button>-->
                   </li>
                 </template>
                 <template v-else-if="item.order_status == '4'">
                   <li class="fn f28">咨询时间：{{changeTime(2,item.inquiry_time)}}
                     <button class="btn3"  @click.stop="skip2(item)">添加病历描述</button>
                   </li>
                 </template>
                 <template v-else-if="item.order_status == '2'">
                   <li class="fn f28">回复时间：{{changeTime(2,item.inquiry_time)}}
                     <button class="btn2" @click.stop="skip(item)">去交流</button>
                   </li>
                 </template>
               </template>
             </template>
             <!--团队咨询状态-->
             <template v-else>
               <template v-if="item.replay_status == '1'">
                 <li class="teamFn">
                   <h6 class="consultText">{{item.text}}</h6>
                   <span class="time">{{changeTime(2,item.inquiry_time) || '时间：暂无字段'}} </span>
                   <button class="btn2"  @click.stop="skip(item)">去解答</button>
                 </li>
               </template>
               <template v-if="item.replay_status == '2'">
                 <li class="teamFn">
                   <h6 class="consultText">{{item.text|| '暂无'}}</h6>
                   <span class="time">{{changeTime(2,item.inquiry_time) || '时间：暂无字段'}} </span>
                   <button class="btn2" @click.stop="skip(item)">去回复</button>
                 </li>
               </template>
               <template v-else-if="item.replay_status == '3'">
                 <template v-if="item.order_status == '3'">
                   <li class="teamFn">
                     <h6 class="consultText">取消原因：{{item.text|| '暂无'}}</h6>
                     <span class="time">{{changeTime(1,item.cancel_time)  || '时间：暂无字段' }}</span>
                   </li>
                 </template>
                 <template v-else-if="item.order_status == '4'">
                   <li class="teamFn">
                     <h6 class="consultText">{{item.text || '暂无'}}</h6>
                     <span class="time">{{changeTime(2,item.inquiry_time) || '时间：暂无字段'}} </span>
                     <button class="btn1"  @click.stop="skip2(item)">添加病历描述</button>
                   </li>
                 </template>
                 <template v-else-if="item.order_status == '2'">
                   <li class="teamFn">
                     <h6 class="consultText">{{item.text|| '暂无'}}</h6>
                     <span class="time">{{changeTime(2,item.inquiry_time) || '时间：暂无字段'}} </span>
                     <button class="btn2" @click.stop="skip(item)">去交流</button>
                   </li>
                 </template>
               </template>
             </template>
           </template>
           <template v-else>
              <template v-for="(v,key) in item" v-if="key != 'empty' && v">
                <template v-if="key == 'tip'">
                  <div class="conEmpty">
                    <img src="../../assets/media/img/empty-icon.png" alt="">
                    <h6>{{item.tip}}</h6>
                  </div>
                </template>
                <template v-else-if="key == 'next'">
                  <h6 class="line"><span class="line1"></span>{{item.next}} <span class="line2"></span> </h6>
                </template>
              </template>
           </template>
         </ul>
       </loading-more>
      <empty :config="{show : all.length == 0 ,  btn : is_btn ? '去开通' : '' ,  btnLink : '/workServiceSet/consultSet', text : is_btn ? '暂时还没有开通该功能' : (filter.status == '4' ? '暂时还没团队咨询哦！' : '暂时还没咨询哦！')}"></empty>
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
        c4 : '0',
        old : {status : '',page : ''}
    }},
    mounted(){
      document.querySelector('.nav_submit').onclick =()=>{
        this.$router.push({path : '/workServiceSet/consultSet'});
      }
      document.querySelector('.nav_back').onclick=(e)=>{
        this.$router.push({path : '/work'});
      }
    },
    created(){
      this.$store.commit('UPDATE_NAV',{title : '我的咨询',fn: '设置',fShow : false, hShow : true});
      if(this.$route.params.status != '0'){
          this.filter.status = this.$route.params.status;
      }
      this.$store.dispatch('unReadChatCount',1);
    },
    computed:{
      info(){
        return this.$store.state.docInfo;
      },
      is_btn() {
        if (this.filter.status != 4 && this.info.chat_switch == 1 && this.info.chat_m12_switch == 1 && this.info.chat_m6_switch == 1) return true;
        return false;
      }
    },
    watch : {
      filter : {
          handler: function (val,oldVal) {
              if(this.old.status != val.status){
                  this.filter.page = 1;
                  Object.assign(this.old,this.filter);
                  this.$router.push({path : `/${val.status}/myItConsult`});
                  if(val.status == '4'){
                    this.$store.dispatch('unReadChatCount',4);
                    window.sessionStorage['walletType'] = JSON.stringify({type : 'team'});
                  }else{
                    window.sessionStorage.removeItem('walletType');
                  }
                  this.reload();
              }
          },
          deep: true
      },
      '$route' : 'routeChange',
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
      tab(v){
        this.filter.status = v;
      },
      numClass(v){
        if(v == 0) return "";
        if(v < 100) return "circle1";
        return "circle2"
      },
      num(v){
        if(v == 0) return "(0)";
        if(v < 100) return v;
        return '99+';
      },
      routeChange(){
        document.querySelector('.nav_submit').onclick =()=>{
          this.$router.push({path : '/workServiceSet/consultSet'});
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
                   this.c4 = obj.count4;
                   if(obj.orders.length == 0){
                     this.isTip = true;
                   }
                   if(this.old.status != this.filter.status){
                     this.all = obj.orders;
                   }else{
                     if(this.filter.status == '4'){
                       //没有数据 且上条数据是进行中
                       if(obj.orders.length == 0){
                         if(this.all[this.all.length - 1].order_status == '2'){
                           obj.orders.push({empty : true , next : '以下团队咨询已结束', tip : '暂无已结束的团队咨询' ,});
                         }
                       }else{
                         //有数据 且中间条是已结束
                         obj.orders.every((v,i)=>{
                           if(v.order_status != '2' && v.replay_status == '3'){
                             obj.orders.splice(1,0,{empty : true , tip : '' , next : '以下团队咨询已结束'});
                             return false;
                           }
                           return true;
                         })
                       }
                     }
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
            this.c4 = obj.count4;
            if(obj.orders.length == 0){
                this.isTip = true;
            }else{
                if(this.filter.status == '4'){
                    obj.orders.every((v,i)=>{
                      //第一条就是已结束
                      if(i == 0 && v.order_status != '2' && v.replay_status == '3'){
                        obj.orders.splice(i,0,{empty : true , tip : '暂无待处理的团队咨询' , next : '以下团队咨询已结束' });
                        return false;
                      }
                      //中间条是已结束
                      if(i != 0 && v.order_status != '2' && v.replay_status == '3'){
                        obj.orders.splice(i,0,{empty : true , tip : '' , next : '以下团队咨询已结束'});
                        return false;
                      }
                      return true;
                    })
                //  分页数据每页有50条 如果第一页数据少于50条 则去做下面的判断
                  let len = obj.orders.length;
                  //  replay_status != 3 表示是待回复状态 待回复状态统一为 进行中
                  //末尾是进行中
                  if(len < 50 && obj.orders[len - 1].replay_status != '3'){
                    obj.orders.push({empty : true ,next : '以下团队咨询已结束' , tip : '暂无已结束的团队咨询' });
                  }
                }
                this.isTip = false;
            }
            this.all = obj.orders;
          })
        },
        skip(v){
          if(this.filter.status == '4'){
            this.$router.push({path : `/${v.account}/${v.team_id}/groupConsult`});
          }else{
            this.$router.push({path : `/${v.account}/chat`});
          }
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
    width: 7.1rem;
    height: 0.6rem;
    /*font-size: 0.32rem;*/
    color: white;
    display: flex;
    justify-content: center;
    margin: 0.15rem auto 0;
    border: 1px solid white;
    border-radius: 0.06rem;
    span{
      width: 40%;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 0.6rem;
      font-size: 0.28rem;
      border-right: 1px solid white;
      i{
        line-height: 0.6rem;
      }
    }
    span:nth-of-type(4){
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
      padding: 0.2rem 0.3rem;
      line-height: 0.62rem;
      box-sizing: border-box;
      position: relative;
      li{
        position: relative;
        word-break: break-all;
      }
      .teamName{
        line-height: 0.52rem;
        width: 100%;
        position: relative;
        padding-bottom: 0.05rem;
        h6{
          height: 1px;
          background: $gray_e;
          width: calc(100% + 0.6rem);
          position: absolute;
          left: -0.3rem;
          bottom: 0.05rem;
        }
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
    /*团队咨询的待回复*/
    .status4{
      color: $baseBlue;
      position: absolute;
      right: 0;
    }
    .q{
      padding-left: 0.52rem;
      position: relative;
    }
    .fn{
      padding-top: 0.3rem;
      margin-top: 0.15rem;
      border-top: 1px solid $gray;
      line-height: 0.6rem;
      color: $fGray;
      display: flex;
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
    .teamFn{
      margin-top: 0.15rem;
      padding-bottom: 0.6rem;
      position: relative;
      border-top: 1px solid $gray_e;
      .consultText{
        font-size: 0.28rem;
        color: $gray_c;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 0.8rem;
      }
      .time{
        font-size: 0.24rem;
        line-height: 0.3rem;
        position: absolute;
        left: 0;
        color: $gray_c;
        bottom: 0.17rem;
      }
      button{
        position: absolute;
        border: 1px solid $baseGreen;
        color: $baseGreen;
        border-radius: 0.06rem;
        font-size: 0.28rem;
        line-height: 0.48rem;
        background: white;
        bottom: 0.1rem;
        right: 0;
        display: inline-block;
        width: 1.5rem;
      }
      .btn1{
        width: 2rem;
      }
      .btn2{
        width: 1.5rem;
      }
    }
  }
  .active{
    background: white;
    color: $baseBlue;
  }
  .groupModule{
    .circle{
      background: $baseGreen;
    }
    .status{
      color: $baseGreen;
    }
    .status1{
      color: $baseGreen;
    }
    .status4{
      color: $baseGreen;
    }
    .fn{
      button{
        background: $baseGreen;
      }
    }
    .active{
      color: $baseGreen;
    }
    .btn3{
      border : 1px solid $baseGreen;
      color: $baseGreen;
    }
  }
.circle1{
  display: inline-block;
  border-radius: 0.17rem;
  font-size: 0.24rem;
  width: 0.34rem;
  height: 0.34rem;
  box-sizing: border-box;
  color: white;
  background: red;
  line-height: 1;
  padding: 0.05rem;
  margin-left: 0.1rem;
  vertical-align: center;
}
  .circle2{
    display: inline-block;
    border-radius: 0.17rem;
    font-size: 0.24rem;
    width: 0.5rem;
    height: 0.34rem;
    box-sizing: border-box;
    color: white;
    background: red;
    line-height: 1;
    padding: 0.05rem;
    margin-left: 0.1rem;
    vertical-align: center;
  }
  .conEmpty{
    text-align: center;
    padding-bottom: 0.54rem;
    background: white;
    img{
      display: inline-block;
      width: 1.1rem;
      height: 0.96rem;
      margin-top: 0.54rem;
    }
    h6{
      font-size: 0.32rem;
      color: $gray_d;
      line-height: 1;
      margin-top: 0.37rem;
    }
  }
  .line{
    background: $bg;
    margin: 0.4rem auto;
    font-size: 0.28rem;
    line-height: 1;
    text-align: center;
    color: $gray_c;
    position: relative;
    span{
      display: inline-block;
      height: 1px;
      width: 1.7rem;
      background: #d5d5d5;
      position: absolute;
      top: 50%;
      margin-top: 1px;
    }
    .line1{
      left: 0.17rem;
    }
    .line2{
      right: 0.17rem;
    }

  }
}

.container .content .conEmptyCon{
    padding: 0;
    background: $bg;
}
</style>
