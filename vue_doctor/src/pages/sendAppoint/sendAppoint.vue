<template>
  <div class="container">
    <header>
      <span :class="{'active' : filter.status == 'stop'}" @click.stop="filter.status = 'stop';filter.page = 1">停诊通知</span>
      <span :class="{'active' : filter.status == 'open'}" @click.stop="filter.status = 'open';filter.page = 1">门诊时间</span>
    </header>
    <div class="content  loadWrapper" v-show="all">
      <loading-more :data="all" :pullupLoad="true" @pullup="load"  :tip="isTip" >
        <template v-if="filter.status == 'stop'">
          <ul v-for="(item,index) in all">
            <h6 :class="['title',{'gray1' : item.is_cancel == '1'}]"><span class="time"><i :class="['circle','bblue',{'bgray': item.is_cancel == '1'}]">停</i>停诊</span></h6>
            <li>停诊时间：<span class="gray">{{item.date_start == item.date_end ? `${item.date_start}当日` : `${item.date_start}至${item.date_end}`}}</span></li>
            <li>停诊备注：<span class="gray">{{item.note || '未填写'}}</span></li>
            <li>发布日期：<span class="gray">{{item.created}}</span></li>
            <!--<li></li>-->
            <h6 class="btn btn1" v-show="item.is_cancel != '1'">
            <!--<span class="address gray">-->
              <!--一楼-->
            <!--</span>-->
              <!--<template v-if="item.is_cancel == '1'">-->
                 <!--<i @click.stop="stopAppoint(item)">-->
                   <!--复用-->
                 <!--</i>-->
              <!--</template>-->
              <!--<template v-else-if="item.is_cancel == '2'">-->
                <i @click.stop="cancleAppoint(item)">
                  取消停诊
                </i>
              <!--</template>-->
            </h6>
          </ul>
        </template>
        <template v-else-if="filter.status == 'open'">
          <ul v-for="(item,index) in all">
            <h6 :class="['title',{'gray1' : item.is_cancel == '1'}]">
              <span class="time">
                <i class="icon-system-order-icon">
                <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span>
              </i>
                {{item.appoint_date ? item.appoint_date.replace(/-/g,'/') : '' }}&nbsp;&nbsp;&nbsp;&nbsp;{{$means.numToday(item.appoint_day)}}{{$means.numTotime(item.appoint_time)}}
              </span>
              <template v-if="item.is_cancel == '1'">
                <span class="status gray">
                     停诊
                  </span>
              </template>
              <template v-else>
                <template v-if="item.appoint_count == 0">
                  <span class="status gray">
                     不可约
                  </span>
                </template>
                <template v-else>
                  <template v-if="item.remain_count == 0">
                   <span class="status gray">
                    约满
                   </span>
                  </template>
                  <template v-else>
                  <span class="status blue">
                    可约
                  </span>
                  </template>
                </template>
              </template>
            </h6>
            <li>门诊地点：<span class="gray">{{item.hospital}}</span></li>
            <li>门诊备注：<span class="gray">{{item.appoint_note || '未填写'}}</span></li>
            <li v-show="item.is_cancel != '1'">剩余预约数：<span class="blue">{{item.remain_count}}人</span></li>
            <h6 class="btn">
              <span class="address gray">
                {{item.address || '未填写'}}
              </span>
              <i @click.stop="appointCancle(item)" v-show="item.is_cancel != '1'">
                取消门诊
              </i>
              <!--</template>-->
            </h6>
          </ul>
        </template>
      </loading-more>
      <empty :config="{show : all.length == 0 , text : '暂时还没有停\\出诊通知哦！'}"></empty>
    </div>
    <button class="submit" @click.stop="skip">
      {{filter.status == 'stop' ? '发布停诊通知' : '发布门诊时间'}}
    </button>
  </div>
</template>

<script>
  import loadingMore from '../../components/loadingMore'
  import {MessageBox} from '../../components/hw-components'
  import empty from '../../components/empty'
export default{
    name : 'sendAppoint',
    created(){
      this.$store.commit('UPDATE_NAV',{title : '停\\出诊通知', fn : '执业地点', fShow : true, hShow : true});
      window.sessionStorage.removeItem('appoint_date_start');
      let f = this.$route.query.filter;
      if(f){
          this.filter = JSON.parse(f);
      }else{
        this.filter.status = 'stop';
      }
    },
    mounted (){
      document.querySelector('.nav_submit').onclick =()=>{
        this.$router.push({path : '/workArea'});
      }
    },
  components:{loadingMore,empty},
  data(){return{
    filter : {status : '' , page : 1},
    all : [],
    isTip : false,
    old : {status : '',page : 1}
  }},
  watch : {
    filter : {
      handler: function (val,oldVal) {
        if(this.old.status != val.status){
          Object.assign(this.old,this.filter);
          this.reload();
        }
      },
      deep: true
    }
  },
  methods: {
    load(v){
      if (v) {
        setTimeout(() => {
          this.filter.page++;
          if(this.filter.status == 'stop'){
            this.$api.appointStopList(this.filter).then(obj => {;
              if (obj.closures.length == 0) {
                this.isTip = true;
              }
              if (this.old.status != this.filter.status) {
                this.all = obj.closures;
              } else {
                this.all = this.all.concat(obj.closures);
              }
            })
          }else{
            this.$api.appointeRecord(this.filter).then(obj => {;
              if (obj.appionts.length == 0) {
                this.isTip = true;
              }
              if (this.old.status != this.filter.status) {
                this.all = obj.appionts;
              } else {
                this.all = this.all.concat(obj.appionts);
              }
            })
          }
        }, 1000)
      }
    },
    reload(){
        if(this.filter.status == 'stop'){
          this.all = [];
          this.$api.appointStopList(this.filter).then(obj => {
            this.isTip = false;
            this.all = obj.closures;
            if (obj.closures.length == 0) {
              this.isTip = true;
            }
          })
        }else{
          this.all = [];
          this.$api.appointeRecord(this.filter).then(obj => {
            this.isTip = false;
            this.all = obj.appionts;
            if (obj.appionts.length == 0) {
              this.isTip = true;
            }
          })
        }
      },
    skip(){
        if(this.filter.status == 'stop'){
            this.$router.push({path : 'appointNoticeS'});
        }else{
          this.$router.push({path : 'appointNoticeB'});
        }
    },
    cancleAppoint(v){
        MessageBox.confirm('确定取消停诊？').then(()=>{
          this.$api.appointStopCancle(v.id).then(obj=>{
            v.is_cancel = '1';
          })
        })
    },
//    stopAppoint(v){
//          this.$router.push({path : '/appointNoticeS',query : {note : JSON.stringify(v)}});
//    },
    appointCancle(v){
        MessageBox.confirm('取消门诊将会通知该时间内已经预约的会员，确认取消？').then(()=>{
              this.$router.push({path : '/appointNoticeS',query : {info : JSON.stringify(v)}});
        })
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
    font-size: 0.32rem;
    color: white;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    border: 1px solid white;
    border-radius: 0.06rem;
  span{
    display: inline-block;
    width: 50%;
    text-align: center;
    line-height: 0.6rem;
    border-right: 1px solid white;
  i{
    line-height: 0.6rem;
  }
  }
  span:nth-of-type(2){
    border-right: none;
  }
  }
  .content {
    margin-top: 0.2rem;
    height: calc(100% - 0.8rem - 1.4rem);
    overflow-y: hidden;
    padding: 0 0.2rem;
    ul{
      background: white;
      border-radius: 0.06rem;
      padding: 0.18rem 0.3rem 0;
      margin-top: 0.2rem;
      .title{
        font-size: 0.32rem;
        height: 0.72rem;
        display: flex;
        line-height: 0.72rem;
        align-items: center;
        /*font-weight: bold;*/
        justify-content: space-between;
        /*border: 1px solid red;*/
        .circle{
          font-size: 0.27rem;
          font-weight: normal;
          font-weight: normal;
          display: inline-block;
          width: 0.44rem;
          height: 0.44rem;
          border-radius: 50%;
          line-height: 0.44rem;
          text-align: center;
          color: white;
          margin-right: 0.17rem;
        }
        .time{
          display: flex;
          align-items: center;
          font-weight: bold;
        }
        .status{
          font-weight: normal;
        }
      }
      li{
        font-size: 0.32rem;
        line-height: 0.52rem;
        font-weight: bold;
        span{
          font-weight: normal;
          word-break: break-all;
        }
      }
      li:nth-last-of-type(1){
        padding-bottom: 0.1rem;
      }
      .btn{
        height: 1.05rem;
        border-top: 1px solid $gray;
        font-size: 0.28rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: nowrap;
        i{
          font-size: 0.3rem;
          color: $baseBlue;
          border: 1px solid $baseBlue;
          display: inline-block;
          height: 0.5rem;
          white-space: nowrap;
          line-height: 0.5rem;
          padding: 0 0.3rem;
          border-radius: 0.06rem;
          background: white;
        }
        .address{
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          background: url(../../assets/media/img/order-address_icon.png) no-repeat left center;
          background-size: 0.3rem 0.36rem;
          padding-left: 0.53rem;
        }
      }
      .btn1{
        justify-content: flex-end;
      }
    }
  }
  .active{
    background: white;
    color: $baseBlue;
  }
    .gray{
      color: $fGray;
    }
    .blue{
      color: $baseBlue;
    }
    .bblue{
      background: $baseBlue;
    }
    .bgray{
      background:$iconGray;
    }
    .gray1{
      color: $iconGray;
    }
    .submit{
      display: block;
      margin: 0.2rem auto;
      width: 6.9rem;
      height: 1rem;
      line-height: 1rem;
      background: #0693fc;
      color: white;
      font-size: 0.4rem;
      text-align: center;
      border-radius: 0.06rem;
    }
  }
  .icon-system-order-icon{
    margin-right: 0.17rem;
    font-size: 0.45rem;
  }
</style>
