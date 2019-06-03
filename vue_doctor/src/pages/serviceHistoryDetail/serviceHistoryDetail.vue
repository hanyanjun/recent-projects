<template>
  <div class="container">
    <div class="content loadWrapper">
      <loading-more :data="arr" :pullupLoad="true" @pullup="load">
        <a href="javascript:;" v-for="item in arr" >
          <template v-if="item.order_type == '1'">
            <ul @click.stop="skip1(item)">
              <li>会员姓名：<span>{{item.pat_name}}</span> <span :class="['status', {'status-active' : item.order_status != '3' && item.order_status != '4'}]">{{status(item)}}</span></li>
              <li>订单类型：<span>{{ '门诊预约'}}</span></li>
              <li>预约时间：<span>{{changeTime(1,item.appoint_time)}}</span></li>
            </ul>
            <h6 v-show="item.order_status == '3'"><span>取消时间：{{changeTime(3,item.cancel_time)}}</span></h6>
          </template>
          <template v-else-if="item.order_type == '2'">
            <ul @click.stop="skip2(item)">
              <li>会员姓名：<span>{{item.pat_name}}</span> <span :class="['status', {'status-active' : item.order_status != '3' && item.order_status != '4'}]">{{status(item)}}</span></li>
              <li>订单类型：<span>{{ '图文咨询（按次）'}}</span></li>
              <li>购买时间：<span>{{changeTime(2,item.created)}}</span></li>
              <!-- <li>购买时间：<span>{{$means.timestampTotime(item.created)}}</span></li> -->
              <li>价&nbsp;&nbsp;格：<span>{{item.pay_amount ? item.pay_amount : '免费'}}</span></li>
            </ul>
            <h6 v-show="item.order_status == '3'"><span>取消时间：{{changeTime(3,item.cancel_time)}}</span></h6>
          </template>
          <template v-else-if="item.order_type == '3'">
            <ul @click.stop="skip2(item)">
              <li>会员姓名：<span>{{item.pat_name}}</span> <span :class="['status', {'status-active' : item.order_status != '3' && item.order_status != '4'}]">{{status(item)}}</span></li>
              <li>订单类型：<span>{{'图文咨询（按期）'}}</span></li>
              <li>购买时间：<span>{{changeTime(2,item.created)}}</span></li>
              <!-- <li>购买时间：<span>{{$means.timestampTotime(item.created)}}</span></li> -->
              <li>价&nbsp;&nbsp;格：<span>{{item.pay_amount ? item.pay_amount : '免费'}}</span></li>
            </ul>
            <h6 v-show="item.order_status == '3'"><span>取消时间：{{changeTime(3,item.cancel_time)}}</span></h6>
          </template>
          <template v-else-if="item.order_type == '9'">
            <ul @click.stop="skip3(item)">
              <li>会员姓名：<span>{{item.pat_name}}</span> <span :class="['status', {'status-active' : item.order_status != '3' && item.order_status != '4'}]">{{status(item)}}</span></li>
              <li>订单类型：<span>{{'电话咨询'}}</span></li>
              <li>购买时间：<span>{{changeTime(2,item.created)}}</span></li>
              <!-- <li>购买时间：<span>{{$means.timestampTotime(item.created)}}</span></li> -->
              <li>价&nbsp;&nbsp;格：<span>{{item.pay_amount ? item.pay_amount : '免费'}}</span></li>
            </ul>
            <h6 v-show="item.order_status == '3'"><span>取消时间：{{changeTime(3,item.cancel_time)}}</span></h6>
          </template>
        </a>
      </loading-more>
      <empty :config="{show : arr.length == 0 , text : '您还没有服务记录哦！'}"></empty>
    </div>
  </div>
</template>

<script>
  import loadingMore from  '../../components/loadingMore'
  import empty from '../../components/empty'
  export default{
    name : 'serviceHistory',
    data(){return{arr : [],filter : {page : 0}}},
    components:{loadingMore,empty},
    created (){
      this.$store.commit('UPDATE_NAV',{title : '服务记录详情', fn : '',router : '', fShow : false, hShow : true});
      this.$api.serviceHistory(this.$route.params.id,this.filter).then(obj=>{
        this.arr = obj.orders;
      })
    },
    methods:{
      load(v){
        if(v){
          setTimeout(()=>{
            this.filter.page++;
            this.$api.serviceHistory(this.$route.params.id,this.filter).then(obj=>{
              this.arr = this.arr.concat(obj.orders);
            })
          },1000)
        }
      },
      status(v){
        switch (v.order_status) {
          case '1':
            return '待审核';
            break;
          case '2':
            return '进行中';
            break;
          case '3':
            return '已取消';
            break;
          case '4':
            return '已结束';
            break;
        }
      },
      skip1(v){
        if(v.order_type == '1'){
          switch (v.order_status) {
            case '1':
              this.$router.push({path : `/review/${v.appoint_id}/orderDetail`})
              break;
            case '2':
              this.$router.push({path : `/reviewed/${v.appoint_id}/orderDetail`})
              break;
            case '3':
              this.$router.push({path : `/complete/${v.appoint_id}/orderDetail`})
              break;
            case '4':
              this.$router.push({path : `/complete/${v.appoint_id}/orderDetail`})
              break;
          }
        }
      },
      skip2(v){
        this.$router.push({path : `/${v.order_no}/indentDetail`});
      },
      skip3(v){
        this.$router.push({path : `/${v.order_no}/indentDetail`});
      },
      changeTime(n,time){
          if(n == 1){
            var time1 = time.split('年')[1];
            var time2 = time1.split('月')[1];
            var time3 = time2.split('日')[1];
            return time.split('年')[0]+'/'+time1.split('月')[0]+'/'+time2.split('日')[0]+' '+time2.split('日')[1];
            // return time;
          }else if (n == 2){
            var t = new Date(parseInt(time) * 1000);
            var t1 = t.toLocaleString('chinese',{hour12:false});
            var t2 = t1.split(' ')[1];
            var t3 = t1.split(' ')[0] + ' ' + t2.split(':')[0] + ':' + t2.split(':')[1];
            return t3;
            // return time;
          }else if (n == 3) {
            if(time){
              var tt = time.split('-')[2];
              tt = tt.split(':')[0]+':'+tt.split(':')[1];
              return time.split('-')[0]+'/'+time.split('-')[1]+'/'+tt;
            }
            // return time;
          }

        }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  @import "../../assets/css/common";
  .container{
    overflow: hidden;
  }
  .content{
    padding: 0 0.2rem;
    height: 100%;
    overflow-y: hidden;
    ul{
      background: white;
      padding: 0.14rem 0.32rem;
      margin-top: 0.2rem;
      li{
        font-size: 0.32rem;
        line-height: 0.62rem;
        height: 0.63rem;
        position: relative;
        span{
          color: $fGray;
          display: inline-block;
          height: 0.63rem;
          line-height: 0.63rem;
        }
        .status{
          position: absolute;
          bottom: 0;
          right: 0;
        }
        .status-active{
          color: $baseBlue;
        }
      }
    }
    h6 {
      line-height: 0;
      background: white;
      padding: 0 0.32rem;
      span{
        display:block;
        font-size: 0.28rem;
        // padding-left: 0.2rem;
        color: $fGray;
        padding-bottom: 0.14rem;
        height: 0.72rem;
        line-height: 0.72rem;
        border-top: 1px solid $gray;
        background: white;
      }
    }
  }
</style>
