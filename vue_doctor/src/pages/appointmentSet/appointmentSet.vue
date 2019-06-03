<template>
  <div class="container">
    <hw-switch :config="hwSwitch" v-on:event="change" style="border: none"></hw-switch>
    <table v-show="hwSwitch.status" ref="table">
      <caption>门诊时间</caption><tr>
        <th></th>
        <th>上午</th>
        <th>下午</th>
        <th>晚上</th>
      </tr>
      <tr>
        <td class="day">周一</td>
        <td class="gray" data-type="上午" @click.stop="skip"></td>
        <td class="gray" data-type="下午" @click.stop="skip"></td>
        <td class="gray" data-type="晚上" @click.stop="skip"></td>
      </tr>
      <tr>
        <td class="day">周二</td>
        <td class="gray" data-type="上午" @click.stop="skip"></td>
        <td class="gray" data-type="下午" @click.stop="skip"></td>
        <td class="gray" data-type="晚上" @click.stop="skip"></td>
      </tr>
      <tr>
        <td class="day">周三</td>
        <td class="gray" data-type="上午" @click.stop="skip"></td>
        <td class="gray" data-type="下午" @click.stop="skip"></td>
        <td class="gray" data-type="晚上" @click.stop="skip"></td>
      </tr>
      <tr>
        <td class="day">周四</td>
        <td class="gray" data-type="上午" @click.stop="skip"></td>
        <td class="gray" data-type="下午" @click.stop="skip"></td>
        <td class="gray" data-type="晚上" @click.stop="skip"></td>
      </tr>
      <tr>
        <td class="day">周五</td>
        <td class="gray" data-type="上午" @click.stop="skip"></td>
        <td class="gray" data-type="下午" @click.stop="skip"></td>
        <td class="gray" data-type="晚上" @click.stop="skip"></td>
      </tr>
      <tr>
        <td class="day">周六</td>
        <td class="gray" data-type="上午" @click.stop="skip"></td>
        <td class="gray" data-type="下午" @click.stop="skip"></td>
        <td class="gray" data-type="晚上" @click.stop="skip"></td>
      </tr>
      <tr>
        <td class="day">周日</td>
        <td class="gray" data-type="上午" @click.stop="skip"></td>
        <td class="gray" data-type="下午" @click.stop="skip"></td>
        <td class="gray" data-type="晚上" @click.stop="skip"></td>
      </tr>
    </table>
    <!--<section class="tips" v-show="hwSwitch.status">-->
      <!--<h6>服务有效时长 <span>48小时</span></h6>-->
      <!--<span class="tips-text">须在48小时内回复会员咨询，若超出48小时未回复咨询，订单自动取消</span>-->
    <!--</section>-->
    <!--<span class="fn-intro" @click.stop="$router.push({path : '/orderIntroduce'})">门诊预约功能介绍</span>-->
  </div>
</template>

<script>
  import hwSwitch from '../../btns/hwSwitch'
  import  {MessageBox,MessageBox2} from '../../components/hw-components'
export default{
    name : 'appointmentSet',
    data (){
      return {hwSwitch : '',count : '',set : ''}
    },
    mounted(){
        document.querySelector('.nav_submit').onclick = ()=>{
            this.$router.push({path : '/order/serviceIntro'});
        }
//        从发布出诊过来 移除掉M2弹窗；
      MessageBox2.close();
    },
    created(){
      this.$store.commit('UPDATE_NAV',{title : '预约设置', fn : '服务介绍', fShow : false, hShow : true});
      this.$api.appointStatus()
        .then(obj=>{
            this.hwSwitch = {
                title : '门诊预约',
                status : obj.switch == 2 ? true : false,
                tip :  obj.switch == 2  ? '关闭后将不再为会员提供门诊预约服务' : '开启后将为会员提供门诊预约服务'
            }
      this.$api.gainAppointSet()
        .then(obj=>{
            this.set = obj.set[0];
            this.count = obj.count;
            (obj.set).forEach((v,i,a)=>{
                let dom = document.querySelectorAll('tr')[v.week_day].children[v.week_time];
                dom.setAttribute('data-id',v.id);
                if(v.appoint_set_status == '1'){
                  dom.innerText = '出诊';
                  dom.className = 'gray gray-active';
                }
            })
          })
        })
    },
    methods :{
      change(v){
          console.log(v);
         if(this.count ==0){
           this.$api.appointSwitchSet(v)
             .then(obj=>{
               this.$store.commit('IS_UPDATE_DOCINFO',true);
               this.hwSwitch.status =  ( v == 2 ?  true : false);
               this.hwSwitch.tip =  ( v == 2 ? '关闭后将不再为会员提供门诊预约服务' : '开启后将为会员提供门诊预约服务');
             })
         }else{
           if(v == 1){
             MessageBox.confirm('关闭后不再为会员提供服务,当前未结束订单仍然有效。').then(obj=>{
               this.$api.appointSwitchSet(v)
                 .then(obj=>{
                   this.$store.commit('IS_UPDATE_DOCINFO',true);
                   this.hwSwitch.status =  ( v == 2 ?  true : false);
                   this.hwSwitch.tip =  ( v == 2 ? '关闭后将不再为会员提供门诊预约服务' : '开启后将为会员提供门诊预约服务');
                 })
             })
           }else{
             this.$api.appointSwitchSet(v)
               .then(obj=>{
                 this.$store.commit('IS_UPDATE_DOCINFO',true);
                 this.hwSwitch.status =  ( v == 2 ?  true : false);
                 this.hwSwitch.tip =  ( v == 2 ? '关闭后将不再为会员提供门诊预约服务' : '开启后将为会员提供门诊预约服务');
               })
           }
         }
      },
      skip(e){
         let target = e.target;
//         将id time等存起来
         window.sessionStorage['id'] = target.getAttribute('data-id');
         window.sessionStorage['week_day'] = target.parentNode.firstChild.innerText;
         window.sessionStorage['week_time'] = target.getAttribute('data-type');
//         console.log(111);
         this.$router.push({path : `/appointDetailSet/null/null`})
      }
    },
    components : {
      hwSwitch : hwSwitch,
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .container {
    height: 100%;
  }
  table {
    display: block;
    background: white;
    margin-top: 0.2rem;
    line-height: 0;
  }
  table caption{
    background: white;
    display: inline-block;
    width: 100%;
    height: 0.7rem;
    line-height: 0.7rem;
    text-align: left;
    padding-left: 0.3rem;
    box-sizing: border-box;
    font-size: 0.32rem;
    border-bottom: 1px solid $gray;
    /*font-size: 0.3rem;*/
    /*text-align: center;*/
  }
  table tr:nth-last-of-type(1) > td{
    border-bottom: none;
  }
  /*table caption b{*/
    /*display: inline-block;*/
    /*width: 0.62rem;*/
    /*height: 0.57rem;*/
    /*margin-top: 0.10rem;*/
    /*margin-right: 0.35rem;*/
    /*vertical-align: top;*/
    /*background: url(../../assets/media/img/order-set_calendar_icon.png) no-repeat;*/
    /*background-size: 0.62rem 0.57rem;*/
  /*}*/
  tbody,tr{
    display: block;
  }
  tr{
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
  }
  th,td{
    display: inline-block;
    width: 30%;
    height: 0.80rem;
    text-align: center;
    line-height: 0.80rem;
    font-size: 0.32rem;
    font-weight: normal;
    border-right: 1px solid rgb(210, 210, 210);
    border-bottom: 1px solid rgb(210, 210, 210);
  }
  table .day{
    font-size: 0.32rem;
  }
  table .gray{
    background: url(../../assets/media/img/order-set_gray_right_icon.png) no-repeat center;
    background-size: 0.52rem 0.37rem;
  }
  table .gray-active{
    background: #2a8cff;
    color: white;
  }
  .container .tips{
    height: 2rem;
    box-sizing: border-box;
    padding: 0.20rem 0.66rem 0.27rem 0.37rem;
    /*border-bottom: 1px solid rgb(210, 210, 210);*/
    background: white;
    margin-top: 0.2rem;
    line-height: 0;
  }
  .container .tips h6{
    height: 0.67rem;
    line-height: 0.67rem;
    font-size: 0.34rem;
    font-weight: normal;
    display: flex;
    justify-content: space-between;
  }
  .container .tips h6 span{
    color: rgb(3, 137, 251);
    font-size: 0.29rem;
  }
  .container .tips .tips-text{
    font-size: 0.26rem;
    line-height: 0.44rem;
  }
  .container .fn-intro{
    display: block;
    margin-top: 0.26rem;
    margin-bottom: 0.46rem;
    height: 0.90rem;
    line-height: 0.90rem;
    padding:  0 0.32rem 0 0.40rem;
    font-size: 0.34rem;
    background: url(../../assets/media/img/order-set_arrowRight_icon.png) white no-repeat right 0.32rem center;
    background-size: 0.18rem 0.29rem;
  }
</style>
