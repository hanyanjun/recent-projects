<template>
  <div class="container">
    <!-- <h6 class="bill-num">预约单号：{{info.number}}</h6> -->
    <div :class="[{'all' : (parseInt(info.appoint_status) < 3 &&info.appoint_break !='1')}]">
    <section class="order-plan" @click.stop="skip2">
      <h6 class="title">预约进度</h6>
      <h6 class="bill-num">预约单号：{{info.number}}</h6>
      <img class="img_detail" src="../../assets/media/img/order-gray-arrow_right_icon.png">
      <ul>
        <li class="blue">{{order.content}}</li>
        <!-- <li class="time"></li> -->
      </ul>
    </section>
    <ul class="docInfo">
      <section>
        <img :src="head" alt="">
        <li class="baseInfo"><span class="name">{{info.name}}</span><span class="level">{{info.technical}}</span></li>
        <li class="baseHospital" v-for="item in info.hospitals"><span class="hospital">{{item.hospital}}</span><span class="type">{{item.department}}</span></li>
      </section>
      <li class="time">预约时间：<span class="text">{{changeTime(info.appoint_time)}}</span></li>
      <li class="selectedHospital">预约医院：<span class="text">{{info.appoint_hospital}}</span></li>
      <li class="address">预约地址：<span class="text">{{info.appoint_address ? info.appoint_address : '未填写'}}</span></li>
      <li class="note">预约备注：<span class="text">{{info.appoint_note ? info.appoint_note : '未填写'}}</span></li>
    </ul>
    <!-- <ul class="otherInfo">
      <li>就诊人<span class="text">{{info.member_name}}</span></li>
      <li>联系方式<span class="text">{{changeNum(info.member_phone)}}</span></li>
      <li @click.stop="skip1"  style="border:none;">查看提交信息</li>
    </ul> -->
    <ul class="patInfo">
      <li class="title">就诊人信息</li>
      <li><span class="span">姓名：<span>{{info.name}}</span></span></li>
      <li><span class="span">性别：<span>{{info.member_info.sex}}&nbsp;&nbsp;|&nbsp;&nbsp;{{(new Date()).getFullYear() - info.member_info.birth_year}}岁</span></span></li>
      <li><span class="span">所在地：<span>{{info.member_info.city ? info.member_info.city  : '未填写'}}</span></span></li>
      <li><span class="span">联系方式：<span>{{changeNum(info.member_phone)}}</span></span></li>
    </ul>
    <div class="box">
      <h6 class="title">病情描述</h6>
      <div class="text">
        <p>{{info.ill_desc ? info.ill_desc : '未填写'}}</p>
        <section class="imgs">
          <img v-img="item" src="" alt="" @click.stop="preView(item)" v-for="item in info.ill_img">
        </section>
      </div>
    </div>
    <div class="box">
      <h6 class="title">用药描述</h6>
      <div class="text">
        <p>{{info.drug_desc ? info.drug_desc : '未填写'}}</p>
        <section class="imgs">
          <img v-img="item" src="" alt="" @click.stop="preView(item)" alt="" v-for="item in info.drug_img">
        </section>
      </div>
    </div>
    </div>
    <div class="btn" v-show="  (parseInt(info.appoint_status) < 3 &&info.appoint_break !='1') "><button type="button" name="button" @click.stop="cancleOrder" class="cancleOrder" >取消预约</button>
    </div>
  </div>
</template>

<script>
  import {MessageBox} from '../../components/hw-components'
export default{
  name : 'orderDetail',
  data(){return{
     info : '',order :''
  }},
  computed : {
    head (){
        return this.$store.getters.docHead;
    }
  },
  created(){
    this.$store.commit('UPDATE_NAV',{title : '预约详情',fn : '', router : `/${this.$route.params.type}/myOrder`, hShow : true , fShow : false});
    this.$api.appointDetailInfo(this.$route.params.id)
      .then(obj=>{
          this.info = obj.order;
          this.order = obj.order.last_log;
      })
  },
  methods : {
      preView(src){
        this.$store.dispatch('wxImgView',src);
      },
      skip1(){
          this.$router.push({path : `orderInfo`});
      },
      skip2(){
        this.$router.push({path : `orderPlan`});
      },
    cancleOrder(){
          let id = this.$route.params.id;
      MessageBox.confirm('确定拒绝该会员的预约申请吗?').then(obj=>{
        this.$api.appointReview({id : id , review : 'no'})
          .then(obj=>{
            this.info.appoint_break = '1';
          })
      })
    },
    changeTime(time){
      if(time){
        var time1 = time.split('年')[1];
        var time2 = time1.split('月')[1];
        var time3 = time2.split('日')[1];
        return time.split('年')[0]+'/'+time1.split('月')[0]+'/'+time2.split('日')[0]+' '+time2.split('日')[1];
      }

    },
    changeNum(num){
        if(num){
          var str = num.substr(0,3)+"****"+num.substr(7);
          return str;
        }
    }

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
  body{
    background: rgb(242, 243, 245);
  }
  .container {
    text-align: left;
  }
  .container .order-plan{
    height: 2.05rem;
  }
  .container .bill-num{
    height: 0.50rem;
    /*padding-left: 0.45rem;
    color: white;
    background: rgb(42, 140, 252);*/
    font-weight: normal;
    line-height: 0.50rem;
    font-size: 0.28rem;
    border-bottom: 1px solid #edeff0;
    color: #c9caca;
  }
  .container .order-plan{
    /*width: 7.20rem;*/
    /*height: 260px;*/
    background: white;
    border-radius:  1px;
    /*margin: 0.25rem auto 0.20rem;*/
    /*margin-top: .2rem;*/
    padding: 0 .3rem;
    position: relative;
  }
  .container .order-plan .title{
    padding-top: .2rem;
    height: 0.5rem;
    line-height: 0.5rem;
    /*border-bottom: 1px solid rgb(220, 220, 220);
    padding: 0 0.40rem;
    background: url(../../assets/media/img/order-gray-arrow_right_icon.png) no-repeat right 0.40rem center;
    background-size: 0.18rem 0.29rem;*/
    font-size: 0.32rem;
  }
  .container .order-plan .img_detail{
    height: .3rem;
    position: absolute;
    top: .45rem;
    right: .5rem;
  }
  .container .order-plan ul{
    /*padding-left: 0.40rem;*/
    position: relative;
    overflow: hidden;
  }
  .container .order-plan ul li{
    height: 0.85rem;
    line-height: 0.85rem;
    padding-left: 0.50rem;
  }
  .container .order-plan ul .blue{
    background: url(../../assets/media/img/order-plan-blue_circle_icon.png) no-repeat left top 0.29rem;
    background-size: 0.28rem 0.28rem;
    /*font-size: 0.30rem;
    color: rgb(42, 142, 252);*/
    font-size: 0.28rem;
    color: #2a8cff;
  }
  .container .order-plan ul .time{
    /*background: url(../media/img/order-plan-gray_circle_icon.png) no-repeat left 5px top 35px;*/
    font-size: 0.28rem;
  }
  .container .order-plan ul::before{
    content : '';
    position: absolute;
    left: 0.14rem;
    top: 0.58rem;
    width: 1px;
    height: 100%;
    background: rgb(191, 191, 191);
  }
  .container .all{
    height: calc(100vh - 2.4rem);
    overflow: auto;
  }
  /*医生信息*/
  .container .docInfo{
    /*width: 7.20rem;*/
    box-sizing: border-box;
    /*padding: 0.25rem;*/
    padding:0 0.3rem;
    /*border-radius:  0.20rem;*/
    background: white;
    margin: 0.20rem auto;
  }
  /*.container .docInfo section{
    border-bottom: 1px solid rgb(210, 210, 210);
    padding-left: 1.40rem;
    position: relative;
    min-height: 1.5rem;
  }*/
  .container .docInfo section{
    padding: .4rem 0 .3rem 0;
    border-bottom: 1px solid #edeff0;
    padding-left: 1.40rem;
    position: relative;
  }
  .container .docInfo section img{
    /*width: 1.30rem;
    height: 1.30rem;*/
    width: 1rem;
    height: 1rem;
    border: 1px solid #edeff0;
    position: absolute;
    left: 0;
    top: 0.4rem;
    border-radius:  50%;
  }
  .container .docInfo section .baseInfo{
    height: 0.50rem;
    line-height: 0;
    /*font-weight: bolder;*/
    font-size: .28rem;
  }
  .container .docInfo section .baseInfo .name{
    display: inline-block;
    font-size: 0.32rem;
    height:0.5rem;
    line-height: 0.5rem;
    margin-right: 0.24rem;
  }
  .container .docInfo section .baseInfo .level{
    font-size: 0.28rem;
    display: inline-block;
    height:0.5rem;
    line-height: 0.5rem;
  }
  .container .docInfo section .baseHospital{
    height: auto;
    line-height: 0.4rem;
  }
  .container .docInfo section .baseHospital span{
    display: inline-block;
    font-size: 0.28rem;
    /*margin-top: 0.11rem;*/

    height: .28rem;
    /*line-height: .28rem;*/
    line-height:0; 
    padding:.17rem .18rem .17rem 0rem;
    color: #6f6e6e;
  }
  .container .docInfo section .baseHospital .hospital{
    max-width: 3.50rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    /*padding-right: 0.22rem;*/
    box-sizing: border-box;
    /*border-right: 1px solid rgb(42, 140, 255);*/
    border-right: 1px solid #2a8cff;
  }
  .container .docInfo section .baseHospital .type{
    max-width: 1.70rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-left: 0.18rem;
    box-sizing: border-box;
  }
  .container .docInfo .time,
  .container .docInfo .selectedHospital,
  .container .docInfo .address,
  .container .docInfo .note{
    margin-left: .15rem;
    min-height: 0.40rem;
    line-height: 0.40rem;
    background: url(../../assets/media/img/order-infoAdd-blue-circle_icon.png) no-repeat left  top 0.12rem;
    background-size: 0.14rem 0.14rem;
    font-size: 0.28rem;
    padding-left: 0.25rem;
    margin-bottom: .1rem;
  }
  .container .docInfo .time{
    margin-top: 0.3rem;
  }
  .container .docInfo  .text{
    color: #6f6e6e;
    display: inline-block;
    max-width: 5rem;
    vertical-align: top;
  }
  .container .docInfo .note{
    padding-bottom: .3rem;
  }
  .container .docInfo .note .text{
    overflow: auto;
    white-space: normal;
  }
  /*其他信息*/
  .container .otherInfo{
   /* width: 7.2rem;
    height: 2.70rem;*/
    background: white;
    margin: 0 auto;
    /*border-radius:  0.20rem;*/
    /*padding: 0 0.40rem;*/
    padding: 0.1rem 0.50rem;
    box-sizing: border-box;
  }
  .container .otherInfo li{
    height: 0.90rem;
    line-height: 0.90rem;
    /*border-bottom: 1px solid rgb(220, 220, 220);*/
    border-bottom: 1px solid #edeff0;
    font-size: 0.32rem;
    /*font-weight: bolder;*/
    position: relative;
  }
  .container .otherInfo li .text{
    position: absolute;
    right: 0;
    top: 0;
    height: 0.9rem;
    line-height: 0.9rem;
    font-size: 0.32rem;
    /*font-weight: normal;*/
    /*color: rgb(114, 113, 113);*/
    color: #6f6e6e;
  }
  .container .otherInfo li:nth-of-type(3){
    background: url(../../assets/media/img/order-gray-arrow_right_icon.png) no-repeat right center;
    background-size: 0.18rem 0.29rem;
  }
  .btn{
        width: 6.9rem;
        padding: .3rem .3rem;
        background: #edeff0;
      }
  .container .cancleOrder{
    display: block;
    margin: 0 auto;
    width: 6.9rem;
    height: 1rem;
    line-height: 1rem;
    /* background: rgb(6, 147, 252); */
    background: #2a8cff;
    color: white;
    font-size: 0.4rem;
    text-align: center;
    border-radius: 0.06rem;
  }
.patInfo{
  background: white;
  margin-top: 0.2rem;
  padding-bottom: 0.16rem;
  li{
    padding-left: 0.3rem;
    height: 0.65rem;
    line-height: 0.7rem;
    font-size: 0.32rem;
    .span{
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      span{
        text-align: left;
        display: inline-block;
        width: 5.5rem;
        height: 100%;
        line-height: 0.7rem;
        color: $input_c;
      }
    }
  }
  li:nth-of-type(2){
    margin-top: 0.16rem;
  }
  .title{
     /*height: 0.7rem;*/
     /*line-height: 0.7rem;*/
     border-bottom: 1px solid $gray;
   }
}
.box{
  font-size: 0.32rem;
  background: white;
  padding: 0 0.3rem 0.3rem;
  margin-top: 0.22rem;
  .title{
    height: 0.7rem;
    line-height: 0.7rem;
  }
  .text{
    border: 1px solid #a6a6a6;
    padding: 0 0.22rem;
    p{
      padding: 0.24rem 0 0.38rem;
      line-height: 0.44rem;
      font-size: 0.28rem;
      color: $fGray;
      word-break: break-all;
    }
    .imgs{
      padding-bottom: 0.33rem;
      border-top: 1px solid $gray;
      img{
        display: inline-block;
        width: 1.46rem;
        height: 1.16rem;
        margin-right: 0.18rem;
        margin-top: 0.33rem;
      }
      img:nth-of-type(4n){
        margin-right: 0;
      }
    }
  }
}
</style>
