<template>
  <div class="container">
    <empty :config="{show : arr.length == 0 , text : '您还没有订单哦！'}"></empty>
    <div class="content loadWrapper">
      <loading-more :data="arr" :pullupLoad="true" @pullup="load" :tip="isTip">
        <div  v-for="item in arr"  v-if="item">
          <ul @click.stop="skip2(item)">
            <li>会员姓名：<span>{{item.pat_name}}</span> <span :class="['status', {'status-active' : item.order_status != '3' && item.order_status != '4'}]">{{status(item)}}</span></li>
            <li>订单类型：<span>{{ '团队咨询'}}</span></li>
            <li>购买时间：<span>{{changeTime(4,item.pay_time)}}</span></li>
            <li>价&nbsp;&nbsp;格：<span>{{item.pay_amount ? item.pay_amount : '免费'}}</span></li>
          </ul>
          <h6 v-show="item.order_status == '3'"><span>取消时间：{{changeTime(3,item.cancel_time)}}</span></h6>
        </div>
      </loading-more>
    </div>
  </div>
</template>

<script>
  import loadingMore from  '../../components/loadingMore'
  import empty from '../../components/empty'
  export default{
    name : 'teamIndent',
    data(){return{
      arr : [''],
      isTip : false,
      filter : { ym : '' ,page : 1},
      control : true
//        empty :{show : false , text : '您还没有订单哦！'}
    }},
    components:{loadingMore,empty},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '团队订单', fn : '筛选',theme : 'green', hShow : true});
//更新待办事项
      this.$store.state.unReplay.status = true;
      let filter = this.$route.query.filter;
      if(filter){
        filter = JSON.parse(filter);
        this.filter.ym = filter.ym == 'all' ? '' : filter.ym;
      }
      this.$api.teamIndentList(this.filter).then(obj=>{
        this.arr  =  obj.orders;
        // alert(obj.orders.length);
        // alert(JSON.stringify(this.arr[0]));
      })
    },
    mounted(){
      window.sessionStorage['walletType'] = JSON.stringify({type : 'team'});
      document.querySelector('.nav_submit').onclick =()=>{
        this.$router.push({path : '/indentFilter', query : {filter : JSON.stringify(this.filter)}});
      }
    },
    methods:{
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
      load(v){
        if(v){
          setTimeout(()=>{
            this.filter.page ++;
            this.$api.teamIndentList(this.filter).then(obj=>{
              if(obj.orders.length == 0){
                this.isTip = true;
              }
              this.arr = this.arr.concat(obj.orders);
            })
          },1000)
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
      changeTime(n,time){
        if(time){
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
              var tt = time.split('-')[2];
              tt = tt.split(':')[0]+':'+tt.split(':')[1];
              return time.split('-')[0]+'/'+time.split('-')[1]+'/'+tt;
            // return time;
          }else if(n == 4){
            return time.substring(0,16).replace(/-/g,'/');
          }
        }else{
          return '';
        }
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .container{
    padding: 0 0.2rem;
    box-sizing: border-box;
    .content{
      height: 100%;
      position: relative;
    }
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
          color: $baseGreen;
        }
      }
    }
    h6 {
      line-height: 0;
      background: white;
      padding: 0 0.15rem;
      span{
        display:block;
        font-size: 0.32rem;
        padding-left: 0.2rem;
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
