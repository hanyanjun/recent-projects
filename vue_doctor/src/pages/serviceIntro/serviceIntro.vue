<template>
  <div class="container">
      <!--<h6 class="title">图文咨询（按期）服务介绍</h6>-->
      <template v-for="item in arr">
        <section>
          <h6 v-show="item.content"><i></i>{{item.content}}</h6>
          <template v-for="item1 in item.p">
             <template v-if="item1.class">
               <span class="title">{{item1.content}}</span>
             </template>
            <template v-else>
             <p v-html="item1.content"></p>
            </template>
          </template>
        </section>
      </template>
     <table  cellspacing="0" v-show="$route.params.type == 'familyAll' || $route.params.type == 'inquiry'">
       <tr>
         <caption > <i></i>资费分成说明：</caption>
       </tr><tr>
         <th class="t1">分成</th>
         <th class="t2">分成比例</th>
         <th class="t3">说明</th>
       </tr><tr>
         <td class="t1">医生分成比例</td>
         <td class="t2">80%</td>
         <td class="t3">所有服务收入按80%比例归医生所得，在订单结束后转为可提现余额，医生随时提现。</td>
       </tr><tr>
         <td class="t1">平台分成比例</td>
         <td class="t2">20%</td>
         <td class="t3">智呼吸平台将提供平台业务支持：<br>1、不断优化平台功能、用户体验，打造呼吸咳喘和过敏慢病管理专业化平台，为医生提供更专业、更完善的医疗服务工具；<br>2、专业客服、运营团队，解决会员购买、通知、投诉处理等平台运营、咨询问题；<br>平台大数据成果支持医生学术研究、科普论文，优化和提高治疗效率</td>
       </tr>
     </table>
  </div>
</template>

<script>
  export default{
    name : 'serviceIntro',
    data(){return{
        arr : []
    }},
    created(){
      let origin = this.$route.query.platform_origin;
      let type = this.$route.params.type;
      switch (type){
        case 'family':
          this.arr = this.$hwdata.fServiceIntro;
          if(origin != 'app'){
            this.$store.commit('UPDATE_NAV',{title : '图文咨询(半年)服务介绍',fShow : false, hShow : true});
          }
          break;
        case 'familyAll':
          this.arr = this.$hwdata.fAServiceIntro;
          if(origin != 'app'){
            this.$store.commit('UPDATE_NAV',{title : '图文咨询(一年)服务介绍',fShow : false, hShow : true});
          }
          break;
        case 'inquiry':
          this.arr = this.$hwdata.iServiceIntro;
          if(origin != 'app'){
            this.$store.commit('UPDATE_NAV',{title : '图文咨询(按次)服务介绍',fShow : false, hShow : true});
          }
          break;
        case 'order':
          this.arr = this.$hwdata.oServiceIntro;
          if(origin != 'app'){
            this.$store.commit('UPDATE_NAV',{title : '门诊预约服务介绍',fShow : false, hShow : true});
          }
          break;
        case 'agreement':
          this.arr = this.$hwdata.agreement;
          if(origin != 'app'){
            this.$store.commit('UPDATE_NAV',{title : '智呼吸医生注册服务协议',fShow : false, hShow : true});
          }
          break;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  body{
    background: #edeff0;
  }
  .container{
    width: 100%;
    height: 100%;
  }
  section{
    background: white;
    margin-top: 0.20rem;
    .title{
      font-size: 0.28rem;
      color: $baseBlue;
    }
  }
  section h6{
    font-size: 0.32rem;
    color: #2a8cff;
    padding-left: 0.50rem;
    line-height: .66rem;
    border-bottom: 1px solid #edeff0;
    display: flex;
    align-items: center;
    margin-bottom: 0.24rem;
  }
  section h6 i{
    display: inline-block;
    width: .10rem;
    height: .30rem;
    background: #2a8cff;
    margin-right: .20rem;
  }
  section p{
    padding: 0 .60rem .20rem .50rem;
    font-size: .28rem;
    line-height: .56rem;
    word-break: break-all;
    span{
      color: $lightBlue;
    }
  }
  section span{
    display: block;
    color: #4195ff;
    font-size: .32rem;
    height: .32rem;
    line-height: .32rem;
    padding-left: .50rem;
    margin: .15rem 0 .15rem;

  }
  section .active-title{
    margin-bottom: .2rem;
  }
  section .active-p{
    padding: 0 .60rem .20rem .97rem;
    position: relative;
  }
  section .active-p i{
    display: inline-block;
    width: .22rem;
    height: .22rem;
    border-radius: 50%;
    background: #12c52f;
    position: absolute;
    left: .50rem;
    top: .20rem;
  }
  section .active-p .yellow{
    background: #ffe400;
  }
  section .active-p .red{
    background: #ff0000;
  }
  table{
    width: 100%;
    background:white;
    margin-top: .15rem;
    line-height: 0;
  }

  table caption{
    text-align: left;
    padding-left: 0.5rem;
    height: .76rem;
    line-height: .76rem;
    font-size: .34rem;
    display: flex;
    align-items: center;
    position: relative;
    font-size: 0.32rem;
    color: $baseBlue;
    .icon-docHome-order{
      font-size: 0.38rem;
      margin-right: 0.2rem;
    }
  }
  table tr{
    display: flex;
    width: 100%;
    i{
      display: inline-block;
      width: .10rem;
      height: .30rem;
      background: #2a8cff;
      margin-right: .20rem;
    }
  }
  th,td{
    line-height: .4rem;
    display: inline-block;
    font-size: .28rem;
    font-weight: normal;
    border: 1px solid $gray;
  }
  .t1,.t2{
    width: 26%;
    text-align: center;
  }
  .t3{
    width: 48%;
    text-align: left;
  }
</style>
