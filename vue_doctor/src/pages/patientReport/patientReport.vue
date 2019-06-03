<template>
  <ul class="container">
    <div class="report-window">
      <div class="box">
        <section class="autoAgreeReportFn"><span>{{reportSwitch == '2' ? '已开启' : '已关闭'}}会员报到自动同意</span><b :class="reportSwitch == '2' ? 'bg bg-active' : 'bg'"  @click.stop="changeSwitch"><b class="circle"></b></b></section>
        <ul class="content">
            <template v-for="item in info">
                  <h6 class="space"></h6>
                  <div>
                    <li class="title"  @click.stop="$router.push({path : `/${item.year}-${item.month}/reportDetail`})"><p class="time">{{item.month}}月</p><i class="icon-return-right"></i></li>
                    <li v-for="item1 in item.list" style="padding-left:5%;">
                      <p class="date">{{$means.numToday(item1.review_weekday)}}<br>{{item1.review_month}}-{{item1.review_day}}</p>
                      <img src="" alt="" v-img="item1.headimg">
                      <div class="name">
                        <span class="names">{{item1.name}}</span>
                        <span class="origin">{{origin(item1.origin)}}({{item1.created}})</span>
                      </div>
                      <span :class="['status',{'status-active' : item1.is_review != '1'}]" v-text="item1.is_review == '1' ? '已报到' : '同意'"  @click.stop="agree(item1)"></span>
                    </li>
                  </div>
            </template>
        </ul>
      </div>
    </div>
  </ul>
</template>

<script>
  import {Toast} from '../../components/hw-components'
export default{
    data(){return{info : ''}},
    name : 'patientReport',
    created (){
      this.$store.commit('UPDATE_NAV',{title : '会员报到',fn : '', router : '/contacts', fShow : false, hShow : true});
      this.$api.reportList().then(obj=>{
          this.info = obj.list;
      })
    },
    computed :{
      reportSwitch(){
        return  this.$store.state.docInfo.review_switch;
      }
    },
    methods :{
      origin(v){
        switch (v) {
          case '2':
            return "搜索报到"
            break;
          case '3':
            return "邀请报到"
            break;
          case '4':
            return "邀请报到"
            break;
          case '1':
            return "扫码报到"
            break;
          case '5':
            return "会员邀请"
            break;
        }
      },
      changeSwitch(){
        this.$api.reviewSwitch(this.reportSwitch == '2' ? '1' : '2')
          .then(obj => {
             this.$store.commit('UPDATE_REVIEW_SET',this.reportSwitch == '2' ? '1' : '2');
          })
      },
      agree(value){
        //更新待办事项
        this.$store.state.unReplay.status = true;

          if(value.is_review != '1'){
             this.$api.reportPass(value.account).then(obj=>{
                 value.is_review = '1';
                 this.$store.commit('IS_UPDATE_CONTACTS',true);
             });
          }
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .report-window {
    width: 100%;
    height: 100%;
  }
  .space{
    height: 0.2rem;
    background:#f2f3f5;
  }
  .autoAgreeReportFn {
    height: 1.3rem;
    border-top: 1px solid #dcdcdc;
    /*border-bottom: 1px solid #dcdcdc;*/
    line-height: 1.3rem;
    color: #000000;
    font-size: .32rem;
    padding: 0 5%;
    -webkit-box-pack: space-between;
    -webkit-justify-content: space-between;
    display: flex;
    justify-content: space-between;
    background: #fff
  }
  .autoAgreeReportFn .bg {
    display: inline-block;
    width: .75rem;
    margin-top: .44rem;
    height: .42rem;
    background: #b5b5b5;
    position: relative;
    -webkit-border-radius: .21rem;
    -khtml-border-radius: .21rem;
    -moz-border-radius: .21rem;
    -ms-border-radius: .21rem;
    -o-border-radius: .21rem;
    border-radius: .21rem
  }

  .autoAgreeReportFn  .bg .circle {
    display: inline-block;
    width: .38rem;
    height: .38rem;
    background: #fff;
    position: absolute;
    left: .02rem;
    top: .02rem;
    -webkit-border-radius: 50%;
    -khtml-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
    border-radius: 50%
  }
  .autoAgreeReportFn  .bg-active{
    background:  #2a8cff;
  }
  .autoAgreeReportFn  .bg-active .circle{
    left: .35rem;
  }
  .report-window .content li img, .my .header .headImg {
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%
  }
  .report-window .box .content {
    width: 100%;
    background: #fff
  }

  .report-window .box .content li {
    position: relative;
    padding: 0 .32rem 0 .1rem;
    height: 1.3rem;
    border-bottom: 1px solid #dcdcdc;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1px
  }
  .report-window .box .content li:last-child{
    border-bottom: none;
  }
  .report-window .content li img {
    width: .88rem;
    height: .88rem;
    -khtml-border-radius: 50%;
    border-radius: 50%;
    margin-top: .21rem;
  }

  .report-window .content li span {
    display: inline-block;
    line-height: 1.3rem
  }
  .report-window .content .time {
    display: inline-block;
    font-size: .32rem;
    color: #000;
    line-height: .76rem;
  }
  .report-window .content .jumpReport{
    width: 3rem;
    display: flex;
    justify-content: flex-end;
    height: .6rem;
    line-height: .6rem;
    margin-top: .07rem;
  }
  .report-window .content .jumpReport span{
    font-size: .6rem;
    color: #9fa0a0;
    line-height: .6rem;
    height: .6rem;
  }
  .report-window .content .time .special {
    display: inline-block;
    height: .75rem;
    line-height: .75rem;
    font-size: .26rem;
    color: #d2d2d2;
  }
  .report-window .content li .name {
    width: 2.3rem;
    font-size: .32rem;
    text-align: left;
    margin-top: .25rem;
    color: #000;
    span{
      line-height: 0.35rem;
    }
    .names{
      display: inline-block;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .report-window .content li .origin {
    font-size: .26rem;
    color: #9fa0a0;
    line-height: .3rem;
    width: 2.3rem;
    text-align: left;
  }

  .report-window .content li .status {
    font-size: .32rem;
    line-height: 1.3rem;
    -webkit-border-radius: .08rem;
    -khtml-border-radius: .08rem;
    -moz-border-radius: .08rem;
    -ms-border-radius: .08rem;
    -o-border-radius: .08rem;
    border-radius: .08rem;
    color: #9fa0a0
  }

  .report-window .content li .status-active {
    display: inline-block;
    font-size: .32rem;
    height: .6rem;
    line-height: .6rem;
    background: #0693fc;
    color: #fff;
    padding: 0px .2rem;
    margin-top: .35rem;
  }

  .report-window .content li .date{
    height: 1.3rem;
    font-size: .3rem;
    color: #9fa0a0;
    margin-top: .25rem;
  }
  .line{
    display: inline-block;
    width: 7.5rem;
    height: 1px;
    background-color: #dcdcdc;
    margin-top: .1rem;
  }

  .report-window .box .content .title{
    margin-left:0px;
    padding-left:5%;
    height: 0.75rem;
    display: flex;
    align-items: center;
    i{
      color: #c9caca;
      font-size: 0.32rem
    }
  }
  .report-window .box {
    width: 100%;
    background: #f2f3f5;
  }

</style>
