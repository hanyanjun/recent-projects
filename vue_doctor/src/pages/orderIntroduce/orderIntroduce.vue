<template>
  <div class="appointDoc container">
    <h6 class="title">智呼吸门诊预约须知</h6>
    <h6 class="littleTitle">欢迎使用智呼吸儿童咳喘和过敏咨询平台，您在门诊预约服务前，请仔细阅读本须知：</h6>
    <ul>
      <li>1.智呼吸儿童咳喘和过敏咨询平台门诊预约是医生为会员提供预约门诊的一项服务，在智呼吸平台注册并认证的医生有开通或停止此项服务的权利。</li>
      <li>智呼吸平台在线门诊预约服务是医生在正常门诊挂号之外，医生牺牲休息时间延长门诊时间，为病情需要的会员提供的额外加号就诊机会，是医生的个人行为，与医院无关，门诊预约不占用医院正常挂号资源。</li>
      <li>3.用户须填写就诊人的病情资料（包括就诊人的基本资料、病情描述等信息），所有信息必须真实，提交并由医生确认后用户才可获得预约机会。</li>
      <li>4.用户获得预约资格后，到预约门诊地址找到医生并得到医生确认，拿到医生开具的加号单后到挂号处挂号，然后返回门诊等待叫号，排队就诊。</li>
      <li>5.预约成功以智呼吸微信公众号消息通知为准，同时会发送预约成功短信通知。如因用户本人操作或手机自动屏蔽通知而导致的用户未收到通知信息，智呼吸平台和医生个人均不承担任何责任。</li>
      <li>6.成功申请门诊预约的用户有权利在就诊日期前一天18:00之前取消预约，如未取消预约且未履约，将被记作爽约记录。一旦您出现爽约记录，智呼吸平台保留限制爽约用户再次使用门诊预约服务的权利。</li>
      <li>7.预约门诊加号如遇医生遇到抢救、急诊等特殊事件时，医生可以延后甚至取消门诊，我们会在获悉后第一时间通知用户，出诊时间以医院当日公布出诊日期为准，并通知用户选择其他时间再次预约。<br>由此产生的以下问题智呼吸平台、医生、医院均不承担任何赔偿责任：<br>交通、餐饮、住宿等费用<br>会员延误门诊导致的病情延误<br>以及其他由于门诊延误导致的问题</li>
      <li>8.智呼吸平台提供的门诊预约是免费的服务，仅特指线上预约服务不收取费用，不包括线下医院必须缴纳的挂号费、检查费、治疗费以及药品购买等费用。且智呼吸平台不对医院及医生的就医费用、诊疗效果、等其他后果承担责任。</li>
    </ul>
  </div>
</template>

<script>
export default{
    name : 'orderIntroduce',
    created (){
      this.$store.commit('UPDATE_NAV',{title : '预约功能介绍', fn : '',router : '/appointmentSet', fShow : false, hShow : true});
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .appointDoc{
    width: 100%;
    background: white;
    padding-bottom: .2rem;
  }
  .appointDoc .title{
    text-align: center;
    font-size: .36rem;
    font-weight:bold;
    padding: .1rem 0;
  }
  .appointDoc .littleTitle{
    text-align: center;
    font-size: .32rem;
    font-weight: normal;
    padding: .1rem 0;
  }
  .appointDoc li{
    margin:  .2rem 0;
    line-height: .5rem;
    padding: 0 .1rem;
    font-size: .28rem;
  }
  .appointDoc button{
    background: rgb(4, 142, 252);
    display: block;
    width: 2rem;
    height: .6rem;
    font-size: .32rem;
    color: white;
    text-align: center;
    margin:  .2rem auto;
    -webkit-border-radius: .15rem;
    -khtml-border-radius: .15rem;
    -moz-border-radius: .15rem;
    -ms-border-radius: .15rem;
    -o-border-radius: .15rem;
    border-radius: .15rem;
  }
</style>
