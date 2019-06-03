<template>
<div :class="['container',{'team_con' : walletType == 'team'}]">
  <h6 class="teamTitle" v-show="info.order_type  == '8'">
    {{info.team_title}}
    <h6 class="line"></h6>
  </h6>
  <header>
    <template v-if="info.order_status == '1'">
      <span>订单状态：
      <span class="status">{{待付款}}</span></span>
    </template>
    <template v-else-if="info.order_status == '2'">
        <template v-if="info.order_type == '9'">
            <template v-if="info.replay_status == '1'">
              <span>订单状态：<span class="status">待通话</span></span>
                <span class="btns">
                  <template v-if="info.modify_count >= 2">
                     <span class="btn1" @click.stop="callCancle">取消订单</span>
                  </template>
                  <template v-else>
                     <span class="btn1" @click.stop="callModify(info)">修改时间</span>
                  </template>
                <span class="btn1" @click.stop="callPhone">拨打电话</span></span>
            </template>
            <template v-else-if="info.replay_status == '2'">
              <span>订单状态：<span class="status">待通话</span></span>
              <span class="btns"><span class="btn1 btn3"  @click.stop="callPhone">重拨</span></span>
            </template>
            <template v-else-if="info.replay_status == '3'">
              <span>订单状态：<span class="status">已通话</span></span>
              <span class="btns"><span class="btn1 btn3"  @click.stop="callPhone">重拨</span>
                <span class="btn1" @click.stop="callFinish">通话完成</span></span>
            </template>
        </template>
        <template v-else>
        <span>订单状态：<span class="status">进行中</span></span>
          <span class="btn1" @click.stop="skip">
            <template v-if="info.replay_status == '1'">
                  <i class="icon-indent-constult-icon"></i>
                  新咨询
            </template>
            <template v-else-if="info.replay_status == '2'" @click.stop="skip">
                  <i class="circle"></i>
                  待回复
            </template>
            <template v-else-if="info.replay_status == '3'" @click.stop="skip">
                  去交流
            </template></span>
        </template>
    </template>
    <template v-else-if="info.order_status == '3'">
        <span>订单状态：
          <span class="status2">已取消</span></span>
    </template>
    <template v-else-if="info.order_status == '4'">
        <template v-if="info.order_type == '9'">
          <span>订单状态：<span class="status">已完成</span></span>
          <span class="btn1" @click.stop="skipChat">查看交流</span>
        </template>
        <template v-else>
          <span>订单状态：<span class="status1">已完成</span></span>
          <template v-if="walletType == 'team'">
            <template v-if="info.replay_status != '3'">
                <span class="btn1" @click.stop="skip"><i class="circle"></i>待回复</span>
            </template>
            <template v-else>
                <span class="btn1 btn2"  @click.stop="skip">查看咨询内容</span>
            </template>
          </template>
          <template v-else>
            <template v-if="info.replay_status != '3'">
                <span class="btn1" @click.stop="skip"><i class="circle"></i>待回复</span>
            </template>
            <template v-else>
                <span class="btn1 btn2"  @click.stop="skip">查看咨询内容</span>
            </template>
          </template>
        </template>
    </template></header>
  <!--<h6 class="callTime" v-show="info.order_type == '9' && info.order_status == '2' && info.replay_status == '1'">通话时间：<i>{{info.order_start + '-' +  (info.order_end ? info.order_end.substr(-5) : '')}}</i></h6>-->
  <section class="order-plan" @click.stop="orderPlan" v-show="log.content">
    <h6 class="title">预约进度</h6>
    <i class="icon-return-boldleft"></i>
    <!--<img class="img_detail" src="../../assets/media/img/order-gray-arrow_right_icon.png">-->
    <ul>
      <li class="blue">{{log.modify_time ? `医生已将时间调整至${log.modify_time.substr(0,16)}` : log.content }}</li>
    </ul>
  </section>
  <ul class="indentInfo">
    <template v-if="info.order_type == '2'">
      <li>订单类型：<span>图文咨询(￥{{info.pay_amount}}/次)</span></li>
    </template>
    <template v-if="info.order_type == '3'">
      <li>订单类型：<span>图文咨询(￥{{info.pay_amount}}/{{info.count_month}}个月)</span></li>
    </template>
    <template v-if="info.order_type == '8'">
      <li>订单类型：<span>团队咨询(￥{{info.pay_amount}}/次)</span></li>
    </template>
    <template v-if="info.order_type == '9'">
      <li>订单类型：<span>电话咨询(￥{{info.pay_amount}}/{{info.minute_usage}}分钟)</span></li>
    </template>
     <li>订单编号：<span>{{info.order_no}}</span></li>
     <li>创建时间：<span>{{changeTime(info.created)}}</span></li>
     <li v-if="info.order_status == '4'">结束时间：<span>{{changeTime(info.order_end)}}</span></li>
    <li>支付时间：<span>{{changeTime(info.pay_time)}}</span></li>
    <li v-if="info.order_status == '3'">取消时间：<span>{{changeTime(info.cancel_time)}}</span></li>
    <li v-if="info.order_status == '3'">取消原因：<span>{{info.reason}}</span></li>
  </ul>
  <div :class="['orderStatus' , {'orderStatus-active' : c}]" v-show="!(info.order_status == '3' && info.order_type == '2')" >
    <template v-if="info.order_type != '3'">
      <a href="javascript:;" class="monthDetail">
        <p><b>订单结算 <i class="icon-question" @click.stop="tip1"></i></b>
          <span>
            <template v-if="info.statement.date">
               结算时间：{{info.statement.date.substring(5)}}&nbsp;&nbsp;&nbsp;&nbsp;金额：￥{{info.statement.amount}}
            </template>
            <template v-else>
                待结算:￥{{info.statement.amount_total}}(元)
            </template>
          </span>
        </p>
      </a>
    </template>
    <template v-else-if="info.order_type == '3'">
      <a href="javascript:;" class="monthDetail">
        <p><b>订单结算 <i class="icon-question" @click.stop="tip"></i></b>
          <!--<span>已结算：{{info.d}}/{{info.statement.amount_total}}(元)</span>-->
        </p>
        <p class="sti" @click.stop="c =!c">{{ c ? '收起' : '展开'}}<span :class="['arrow',{'arrow-active' : c}]" ></span></p>
      </a>
      <h6 class="unstated" v-show="info.statement.list_stated"> <i></i> 已结算：{{info.d}}/{{info.statement.amount_total}}(元)</h6>
      <ul v-for="(item,index) in info.statement.list_stated">
        <li :class="{'border-none' : index == info.statement.list_unstated - 1}"><span class="data">{{item.date}}</span><span><span class="money">金额</span>：{{item.amount}}</span></li>
      </ul>
      <h6 class="unstated" v-show="info.statement.list_unstated"> <i></i>待结算：{{(info.u)}}/{{info.statement.amount_total}}(元)</h6>
      <ul v-for="(item1,index1) in info.statement.list_unstated">
        <li :class="{'border-none' : index1 == info.statement.list_unstated - 1}"><span class="data">{{item1.date}}</span><span><span class="money">金额</span>：{{item1.amount}}</span></li>
      </ul>
      <h6 class="reason" v-show="info.order_status == '3'">订单取消，余款原路退还用户</h6>
    </template>

  </div>
  <ul class="patInfo">
     <li class="title">
       <template v-if="info.order_type == '9'">
         预约信息
       </template>
       <template v-else>
         就诊人信息
       </template>
     </li>
     <li><span class="span">姓名：<span>{{info.name}}</span></span></li>
     <li><span class="span">性别：<span>{{info.sex}}&nbsp;&nbsp;|&nbsp;&nbsp;{{info.age}}岁</span></span></li>
     <li v-show="info.order_type != 9"><span class="span">所在地：<span>{{info.city ? info.city  : '未填写'}}</span></span></li>
     <template v-if="info.order_type == 9">
       <li><span class="span">接听电话：<span>{{changeNum(info.phone)}}</span></span></li>
       <li><span class="span">通话时间：<span>{{info.order_start + '-' +  (info.order_end ? info.order_end.substr(-5) : '')}}</span></span></li>
     </template>
     <template v-else>
       <li><span class="span">联系方式：<span>{{changeNum(info.phone)}}</span></span></li>
     </template>
  </ul>
  <template v-if="info.order_type != '3'">
    <div class="box">
      <h6 class="title">病情描述</h6>
      <div class="text">
        <p>{{info.inquiry.ill_desc ? info.inquiry.ill_desc : '未填写'}}</p>
        <section class="imgs">
          <img v-img="item.path" src="" alt="" @click.stop="preView(item.path)" v-for="item in info.inquiry_ill_imgs">
        </section>
      </div>
    </div>
    <div class="box">
      <h6 class="title">用药描述</h6>
      <div class="text">
        <p>{{info.inquiry.drug_desc ? info.inquiry.drug_desc : '未填写'}}</p>
        <section class="imgs">
          <img v-img="item.path" src="" alt="" @click.stop="preView(item.path)" alt="" v-for="item in info.inquiry_drug_imgs">
        </section>
      </div>
    </div>
  </template>
  <middle-select :config="selectData"></middle-select>
</div>
</template>

<script>
  import {MessageBox2} from '../../components/hw-components'
  import middleSelect from '../../components/middleSelect'
export default{
    name : 'indentDetail',
    data(){return{
        info : {
            phone : '',
            statement : {},
            inquiry : {}
        },
        c : false,
        walletType : '',
        log : '',
        prompt : {show : false ,title : '取消原因',holder : '请输入取消原因',tip : '',value : ''},
        selectData :{
          title :'请选择取消原因',
          text: ['门诊数量过多','门诊时间需要调整','工作时间有冲突','自定义'],
          show : false,
          method : (v)=>{
            if(v){
              if(v == '自定义'){
                this.$store.commit('SET_PROMPT',this.prompt);
                this.prompt.tip = '';
                this.selectData.show = false;
                this.prompt.show = true;
                this.prompt.callback =(t)=>{
                  t = t.trim();
                  if(t == '取消'){
                    this.prompt.show = false;
                    this.selectData.show = true;
                  }else{
                    this.prompt.value = t;
                    if(t.length == 0){
                      this.prompt.tip = '请输入修改原因';
                    }else if(t.length > 100){
                      this.prompt.tip = '不能超过100个字符';
                    }else{
                      this.$api.cancelCallOrder(this.info.order_no,t).then(obj=>{
                         this.info.order_status = '3';
                      })
                      this.prompt.show = false;
                    }
                  }
                }
              }else{
                this.$api.cancelCallOrder(this.info.order_no,v).then(obj=>{
                  this.info.order_status = '3';
                })
                this.selectData.show = false;
                this.prompt.show = false;
              }
            }else{
              this.selectData.show = false;
            }
          }
        },
    }},
    components : {middleSelect},
    mounted(){
      let order_no = this.$route.params.id;
      switch (order_no.substring(0,1)){
        case "8":
        this.walletType = 'team';
        break;
        case "2":
        this.walletType = 'consult';
        break;
        case "3":
        this.walletType = 'consult';
        break;
        case "9":
        this.walletType = 'call';
        break;
      }
      this.gain().then(obj=>{
        this.info = obj.data;
        this.log = obj.log || {};
        this.$store.commit('SET_IMG_ARR',{way : 'clear' });
        if(obj.data.order_type == '2' || obj.data.order_type == '9'){
          if(obj.data.inquiry_ill_imgs.length != 0){
            let ill_img = obj.data.inquiry_ill_imgs;
            for(let j= 0; j < ill_img.length ; j ++){
              this.$store.commit('SET_IMG_ARR',{way : 'push' ,msg : ill_img[j].path});
            }
          }
          if(obj.data.inquiry_drug_imgs.length != 0){
            let drug_img = obj.data.inquiry_drug_imgs;
            for(let k= 0; k < drug_img.length ; k ++){
              this.$store.commit('SET_IMG_ARR',{way : 'push' ,msg : drug_img[k].path});
            }
          }
        }
        this.info.d = 0;
        this.info.u = 0;
        let list1 = obj.data.statement.list_stated;
        if(list1){
          list1.forEach(v=>{
            this.info.d += parseFloat(v.amount);
          })
        }else{
          this.info.d = 0;
        }
        let list2 = obj.data.statement.list_unstated;
        if(list2){
          list2.forEach(v=>{
            this.info.u += parseFloat(v.amount);
          })
        }else{
          this.info.u = 0;
        }
      })
    },
    methods :{
        skip(){
          switch (this.walletType){
            case "team":
              this.$router.push({path : `/${this.info.patient_account}/${this.info.team_id}/groupConsult`});
            break;
            default :
              this.$router.push({path : `/${this.info.patient_account}/chat`});
          }
        },
        changeNum(num) {
          if (num) {
            var str = num.substr(0, 3) + "****" + num.substr(7);
            return str;
          }
        },
        orderPlan(){
          this.$router.push({path : `/call/${this.info.order_no}/orderPlan`});
        },
        skipChat(){
          this.$router.push({path : `/${this.info.patient_account}/chat`});
        },
        callCancle(){
          this.selectData.show = this.selectData.show ? false : true;
        },
        callModify(v){
          let t = v.order_end.replace(/-/g,'/');
          let t1 = Date.parse(new Date(t));
          let t2 = Date.parse(new Date());
          let t3 = new Date();
          var Y = t3.getFullYear() + '-',
            M = (t3.getMonth()+1 < 10 ? '0'+(t3.getMonth()+1) : t3.getMonth()+1) + '-',
            D = t3.getDate() + ' ',
            h = t3.getHours() + ':',
            m = t3.getMinutes() + ':',
            s = t3.getSeconds();
          let t4 = Y+M+D+h+m+s;
          if(t1 >= t2){
            this.$router.push({path : `/${v.order_no}/callSetModify`, query : {time : v.order_end} });
          }else{
            this.$router.push({path : `/${v.order_no}/callSetModify`, query : {time : t4} });
          }
        },
        callPhone(){
          this.$router.push({path : `/${this.info.order_no}/callPhone`});
        },
        callFinish(){
            this.$api.callFinish(this.info.order_no).then(obj=>{
              this.info.order_status = 4;
            })
        },
        gain(){
          return new Promise((resolve)=>{
            switch (this.walletType){
              case "team":
                this.$store.commit('UPDATE_NAV',{title : '订单详情',hShow : true , theme : 'green'});
                this.$api.gTeamIndentDetail(this.$route.params.id).then(obj=>{
                  resolve(obj);
                })
                break;
              case "call":
                this.$store.commit('UPDATE_NAV',{title : '订单详情',hShow : true });
                this.$api.callOrderDetail(this.$route.params.id).then(obj=>{
                  resolve(obj);
                })
              break;
              default:
                this.$store.commit('UPDATE_NAV',{title : '订单详情',fShow : false, hShow : true});
                this.$api.gIndentDetail(this.$route.params.id).then(obj=>{
                  resolve(obj);
                })
            }
          })
        },
        preView(src){
          this.$store.dispatch('wxImgView',src);
        },
        tip(){
          MessageBox2.confirm('我们会在每月服务完成当天中午12点，将当月资费扣除平台分成比例,自动转入 我的收入 — 可提现余额');
        },
        tip1(){
          MessageBox2.confirm('订单服务完成后，订单金额将扣除平台分成比例，自动转入可提现余额');
        },
        changeTime(time){
          if(time){
            return time.split('-')[0]+'/'+time.split('-')[1]+'/'+time.split('-')[2];
          }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
.container{
  overflow-x: hidden;
  header{
    line-height: 1rem;
    font-size: 0.32rem;
    padding: 0 0.3rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    .status{
      color: $baseBlue;
    }
    .status1{
      color: black;
    }
    .status2{
      color: $fGray;
    }
    .btn1{
      padding: 0 0.14rem;
      height: 0.5rem;
      line-height: 0.5rem;
      border: 1px solid $baseBlue;
      border-radius: 0.06rem;
      color: $baseBlue;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn2{
      padding: 0 0.28rem;
    }
    .btn3{
      width: 1.28rem;
      /*box-sizing: border-box;*/
    }
    .btns{
      display: flex;
      flex-wrap: nowrap;
      span{
        margin-right: 0.17rem;
      }
      span:nth-last-of-type(1){
        margin-right: 0;
      }
    }
    .circle{
      display: inline-block;
      width: 0.16rem;
      height: 0.16rem;
      border-radius: 50%;
      background: #fd6239;
      margin-right: 0.12rem;
    }
    .icon-indent-constult-icon {
      font-size: 0.3rem;
      margin-right:0.16rem;
      &:before{
        color: $baseBlue;
      }
    }
  }
  .indentInfo{
    padding: 0.4rem 0.3rem;
    background: white;
    margin-top: 0.2rem;
    li{
      font-size: 0.32rem;
      height: 0.32rem;
      line-height: 0.32rem;
      margin-bottom: 0.34rem;
      span{
        color: $fGray;
      }
    }
    li:nth-last-of-type(1){
      margin-bottom: 0;
    }
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
}
  /*订单状态*/

@mixin bordergray{
  border-bottom: 1px solid $gray;
}
.orderStatus{
  height: 1.2rem;
  overflow: hidden;
  ul{
    background: white;
    li{
      display: flex;
      justify-content: space-between;
      height: 1rem;
      padding: 0 0.3rem;
      border-bottom: 1px solid $gray;
      font-size: 0.32rem;
      line-height: 1rem;
      .data{
        color: $fGray;
      }
      .money{
        font-size: 0.26rem;
      }
    }
    .border-none{
      border-bottom: none;
    }
  }
  margin-top: 0.2rem;
  .monthDetail{
    display: flex;
    width: 6.9rem;
    padding: .25rem .3rem;
    height: 0.7rem;
    justify-content: space-between;
    background: #fff;
    @include bordergray;
    font-size: .32rem;
    color: #9fa0a0;
    p{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      height: 0.7rem;
      color: #000;
      span{
        display: block;
        width: 100%;
        color: #9fa0a0;
        font-size: .26rem;
        // margin-top: .2rem;
        display: inline-block;
        .condition{
          color: $baseBlue;
        }
      }
      i{
        font-size: 0.3rem;
        color: $baseBlue;
      }
    }
    .sti{
      width: 2.9rem;
      justify-content : flex-end;
      text-align: right;
      font-size: 0.26rem;
      color: $baseBlue;
      position: relative;
      padding-right: 0.44rem;
      .arrow{
        display: inline-block;
        width: .3rem;
        height: .2rem;
        position: absolute;
        background: url(../../assets/media/img/gray-arrow.png) no-repeat;
        background-size: contain;
        top: .26rem;
        right: 0;
      }
      .arrow-active{
        background: url(../../assets/media/img/doc-home_arrow_up_icon.png) no-repeat;
        background-size: contain;
      }
    }
  }
  .unstated{
    height: 0.7rem;
    background: white;
    line-height: 0.7rem;
    font-size: 0.26rem;
    padding: 0 0.3rem;
    position: relative;
    color: $fGray;
    width: 100%;
    i{
      width: 100%;
      position: absolute;
      left: 0;
      top:0.7rem;
      height: 0.18rem;
      background: url(../../assets/media/img/line.png) no-repeat;
    }
  }
  .reason{
    height: 1rem;
    background: white;
    line-height: 1rem;
    font-size: 0.26rem;
    padding: 0 0.3rem;
    text-align: center;
    border-top: 1px solid $gray;
  }
}
  .orderStatus-active{
    height: auto;
  }
  .teamTitle{
    background: white;
    padding: 0.1rem 0.26rem 0;
    font-size: 0.32rem;
    line-height: 0.72rem;
    box-sizing: border-box;
    position: relative;
    .line{
      width: calc(100% - 0.52rem);
      background: $line;
      height: 1px;
      position: absolute;
      bottom: 0;
      left: 0.26rem;
    }
  }

.team_con{
  header{
    .status{
      color: $baseGreen;
    }
    .circle{
      background: #ffa518;
    }
    .btn1{
      border: 1px solid $baseGreen;
      color: $baseGreen;
    }
    .icon-indent-constult-icon {
      &:before{
        color: $baseGreen;
      }
    }
  }
  .orderStatus{
    .monthDetail{
      p{
        span{
          .condition{
            color: $baseGreen;
          }
        }
        i{
          color: $baseGreen;
        }
      }
      .sti{
        color: $baseGreen;
      }
    }
  }
}
.callTime{
  height: 1rem;
  background: white;
  font-size: 0.32rem;
  color: $gray_a;
  line-height: 1rem;
  padding-left: 0.3rem;
  margin-top: 0.2rem;
  i{
    font-size: 0.32rem;
    color: $input_c;
  }
}

.order-plan{
  background: white;
  border-radius:  1px;
  margin-top: 0.2rem;
  padding: 0 .3rem;
  position: relative;
  .title{
    padding-top: .4rem;
    line-height: 1;
    font-size: 0.32rem;
    color: $gray_a;
  }
  .img_detail{
    width: 0.2rem;
    height: 0.35rem;
    position: absolute;
    top: .68rem;
    right: .3rem;
  }
  ul{
    /*padding-left: 0.40rem;*/
    position: relative;
    overflow: hidden;
    li{
      height: 0.96rem;
      line-height: 0.96rem;
      padding-left: 0.25rem;
    }
    .blue{
      font-size: 0.28rem;
      color: #2a8cff;
    }
    .time{
      font-size: 0.28rem;
    }
    &::before{
      content : '';
      position: absolute;
      left: 0.14rem;
      top: 0.44rem;
      width: 1px;
      height: 100%;
      background: rgb(191, 191, 191);
    }
    &::after{
      content : '';
      position: absolute;
      display: inline-block;
      width: 0.1rem;
      left: 0.10rem;
      height: 0.1rem;
      border-radius: 50%;
      top: 0.44rem;
      background: $baseBlue;
    }
  }
}

.icon-return-boldleft{
  position: absolute;
  right: 0.4rem;
  color: $gray_d;
  transform: translateY(-50%) rotateY(180deg);
  font-size: 0.35rem;
  top: 50%;
}
</style>
