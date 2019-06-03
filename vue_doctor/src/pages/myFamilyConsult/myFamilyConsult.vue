<template>
  <div class="container">
    <header>
      <!--<span :class="{'active' : filter.replay_status == '1'}" @click.stop="filter.replay_status = '1';filter.page = 1">通话申请 <i>({{c1}})</i></span>-->
      <span :class="{'active' : filter.replay_status == '1'}" v-todo>通话申请 <i>({{c1}})</i></span>
      <span :class="{'active' : filter.replay_status == '2'}" @click.stop="filter.replay_status = '2';filter.page = 1">待回复 <i>({{c2}})</i></span>
      <span :class="{'active' : filter.replay_status == ''}" @click.stop="filter.replay_status = '';filter.page = 1">全部 <i>({{c3}})</i></span>
    </header>
    <div class="content  loadWrapper">
      <loading-more :data="all" :pullupLoad="true" @pullup="load" :tip="isTip">
        <ul v-for="item in all" @click.stop="skip1(item)">
          <li>会员姓名：<span class="gray">{{item.name}}</span>
            <template v-if="item.order_status == '3'">
              <span class="status3">已取消</span>
            </template>
            <template v-if="item.order_status == '2'">
              <template v-if="item.replay_status == '1'">
                <!--<span class="status">待通话</span>-->
                <span class="status">新咨询</span>
              </template>
              <template v-else-if="item.replay_status == '2'">
                <span class="status1">待回复</span>
              </template>
              <template v-else-if="item.replay_status == '3'">
                <span class="status2">服务中</span>
              </template>
            </template>
            <template v-else-if="item.order_status == '4'">
              <span class="status2">已完成</span>
            </template>
          </li>
          <li>会员信息：<span class="gray">{{item.sex}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{{item.age}}岁</span><span class="address" v-show="item.city"><i class="icon-hospital-area"></i>{{item.city ? item.city : '未填写'}}</span></li>
            <template v-if="item.order_status == '3'">
              <li>最新动态：<span class="gray">{{item.content}}</span></li>
              <li class="fn">取消时间：{{item.inquiry_time}}
              </li>
            </template>
            <template v-else-if="item.order_status == '2'">
              <template v-if="item.replay_status == '1'">
                <!--<li>通话申请：<span class="gray">{{item.content}}</span></li>-->
                <li>新咨询：<span class="gray">{{item.content}}</span></li>
                <li class="fn">购买时间：{{item.inquiry_time}}
                  <!--<button v-todo>拨打电话</button>-->
                </li>
              </template>
              <template v-else-if="item.replay_status == '2'">
                <li>咨询内容：<span class="gray">{{item.content}}</span></li>
                <li class="fn">咨询时间：{{item.inquiry_time}}
                  <button class="btn1" @click.stop="skip(item)">去回复</button>
                </li>
              </template>
              <template v-else-if="item.replay_status == '3'">
                <li>最新动态：<span class="gray">{{item.content}}</span></li>
                <li class="fn">回复时间：{{item.inquiry_time}}
                  <button class="btn3" @click.stop="skip(item)">去交流</button>
                </li>
              </template>
            </template>
            <template v-else-if="item.order_status == '4'">
              <li>最新动态：<span class="gray">{{item.content}}</span></li>
              <li class="fn">回复时间：{{item.inquiry_time}}
              <button class="btn2" @click.stop="skip(item)">去交流</button>
              </li>
            </template>
        </ul>
      </loading-more>
      <empty :config="{show : all.length == 0 , text : '暂时还没咨询哦！'}"></empty>
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
      filter : {replay_status : '' , page : 1},
      all : [],
      isTip : false,
      c1 : '',
      c2 : '',
      c3 : '',
      old : {replay_status : '',page : 1}
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '图文咨询（按期）', fn : '设置', fShow : false, hShow : true});
      if(this.$route.params.status != '0'){
        this.filter.replay_status = this.$route.params.status;
      }
      this.$api.gFamilyList(this.filter).then(obj=>{
        this.c1 = obj.count1;
        this.c2 = obj.count2;
        this.c3 = obj.count3;
        this.all = obj.orders;
      })
    },
    computed:{
      arr(){
        return  this.filter.replay_status == '' ? this.all : ( this.filter.replay_status == '1' ? this.newConsult : this.unRead);
      }
    },
    watch : {
      filter : {
        handler: function (val,oldVal) {
          if(this.old.replay_status != val.replay_status){
            this.filter.page == 1;
            Object.assign(this.old,this.filter);
            this.reload();
          }
        },
        deep: true
      }
    },
    mounted(){
      document.querySelector('.nav_submit').onclick =()=>{
        this.$router.push({path : '/family-consult'});
      }
    },
    methods:{
      load(v){
        if(v){
            setTimeout(()=>{
              this.filter.page++;
              this.$api.gFamilyList(this.filter).then(obj=>{
                this.c1 = obj.count1;
                this.c2 = obj.count2;
                this.c3 = obj.count3;
                if(obj.orders.length == 0){
                  this.isTip = true;
                }
                if(this.old.replay_status != this.filter.replay_status){
                  this.all = obj.orders;
                }else{
                  this.all = this.all.concat(obj.orders);
                }
              })
            },1000)
        }
      },
      reload(){
        this.$api.gFamilyList(this.filter).then(obj=>{
          this.c1 = obj.count1;
          this.c2 = obj.count2;
          this.c3 = obj.count3;
          this.all = obj.orders;
          if(obj.orders.length == 0){
            this.isTip = true;
          }
        })
      },
      skip(v){
        this.$router.push({path : `/${v.account}/chat`});
      },
      skip1(v){
        this.$router.push({path : `/${v.order_no}/indentDetail`});
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .container{
    overflow: hidden;
    background: url(../../assets/media/img/my-oreder_bg.png)  rgb(240, 239, 245) no-repeat left top -1rem;
    background-size: 100% 2.95rem;
    header{
      width: 7rem;
      height: 0.6rem;
      font-size: 0.32rem;
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
        font-size: 0.32rem;
        width: 7rem;
        margin: 0.2rem auto 0;
        background: white;
        border-radius: 0.06rem;
        padding: 0.24rem 0.3rem;
        line-height: 0.58rem;
        box-sizing: border-box;
        li{
          position: relative;
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
        }
      }
      ul:nth-of-type(1){
        margin-top: 0;
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
        font-size: 0.28rem;
      }
      .fn{
        padding-top: 0.3rem;
        margin-top: 0.2rem;
        border-top: 1px solid $gray;
        line-height: 0.6rem;
        color: $fGray;
        display: flex;
        font-size: 0.28rem;
        justify-content: space-between;
        button{
          line-height: 0.6rem;
          padding: 0 0.3rem;
          background: $baseBlue;
          font-size: 0.32rem;
          color: white;
          border-radius: 0.06rem;
        }
        /*待回复*/
        btn1{
          background: $orange;
        }
        /*去交流*/
        .btn2{
          border : 1px solid $gray;
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
