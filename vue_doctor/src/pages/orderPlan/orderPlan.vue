<template>
  <div class="container">
    <div class="content">
      <h6 class="log">预约进度</h6>
      <ul>
        <li v-for="item in info" :class="item.class">
          <h6>{{item.modify_time ? `医生已将时间调整至${item.modify_time.substr(0,16)}` : item.content }}</h6>
          <p v-html="item.text ? item.text : '('+$means.timestampTotime(item.created)+')'"></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default{
    name : 'orderPlan',
    data (){return {
      type : '',
      info : ''
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '预约进度',fn : '', router : `orderDetail`, hShow : true , fShow : false});
      let id = this.$route.params.id;
      switch (this.$route.params.type){
        case "call":
          this.callLog(id);
        break;
        default :
          this.appointLog(id);
        break;
      }

    },
    methods:{
      callLog(v){
        this.$api.callPlan(v).then(obj=>{
          this.info = obj.log;
          this.info[this.info.length-1].class = 'l1';
        })
      },
      appointLog(v){
        this.$api.appointLog(v)
          .then(obj=>{
              let result = obj.list.some((v,i,a)=>{
                  return v.content == '会员未按时抵达' || v.content == '医生取消了预约';
              })
             if(!result && obj.list.length > 2){
               let step = {
                 created : obj.appoint_time,
                 content : '门诊就诊',
                 text : `(${obj.appoint_time})<br>就诊步骤<br>1.找到医生领取加单号<br>2.凭加单号到门诊挂号处挂号<br>3.耐心等待叫号`
               }
               obj.list.splice(2,0,step);
             }
             this.info = obj.list;
             this.info[this.info.length-1].class = 'l1';
          })
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    width: 7.2rem;
    height: 100%;
    overflow: scroll;
    border-radius:  .2rem;
    margin: .2rem auto;
  }
  .content{
    background: white;
  }
  .container .log{
    line-height: .8rem;
    border-bottom: 1px solid rgb(191, 191, 191);
    font-size: .34rem;
    padding-left: .36rem;
  }
  .container .title{
    border: none;
    height: .46rem;
    line-height: .46rem;
    font-size: .3rem;
  }
  .container  ul{
    padding-left: .35rem;
    position: relative;
    overflow: hidden;
    padding-bottom: .6rem;
    box-sizing: content-box;
  }
  .container  ul li{
    min-height: 1rem;
    padding-left: .6rem;
    background: url(../../assets/media/img/order-plan-gray_circle_icon.png) no-repeat left .05rem top .4rem;
    background-size: 0.19rem 0.19rem;
    position: relative;
  }
  .container ul li h6{

    border: none;
    padding-top: .3rem;
    line-height: .4rem;
    font-size: .32rem;
  }
  .container ul li h6 p{
    font-size: .3rem;
    line-height: .45rem;
    font-weight: normal;
  }
  /*当前进度的状态*/
  .container ul .l1{
    background: url(../../assets/media/img/order-plan-blue_circle_icon.png) no-repeat left top .36rem;
    background-size: 0.28rem 0.28rem;
  }
  .container .l1 h6{
    color: rgb(42, 140, 252);
  }
  .container p{
    font-size: .3rem;
    color: rgb(114, 113, 113);

  }
  .container ul:before{
    content : '';
    position: absolute;
    left: .49rem;
    top: .58rem;
    width: 1px;
    height: calc(100% - 1.2rem);
    background: rgb(191, 191, 191);
  }
</style>
