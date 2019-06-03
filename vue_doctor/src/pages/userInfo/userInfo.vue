<template>
  <ul class="container">
    <div class="chatnav">
      <b @click.stop="$router.routeBack()"></b>
      <div class="sele">
        <router-link to="userInfo" class="userInfo">会员档案</router-link>
        <router-link to="chat" class="chat">会员对话</router-link>
        <router-link to="serviceHistory">服务记录</router-link>
      </div>
    </div>
    <div class="content">
      <a href="javascript:;" class="head">
        <li>
          <img :src="info.headimg" alt="">
          <div class="info">
            <h6 class="note"><span class="name" v-show="info.remark_name">{{info.remark_name}}</span> <span class="change" @click.stop="change">修改备注 <i class="icon-edit1"></i></span></h6>
            <h6 class="other"><span class="name">{{info.name}}</span> <span>{{info.sex}}&nbsp;&nbsp;|&nbsp;&nbsp;{{info.age}}岁</span></h6>
          </div>
          <!--<span class="name">{{info.name ? info.name : info.nick}}<br>ID:{{info.account}}</span>-->
          <!--<span class="otherInfo">{{info.sex}}&nbsp;&nbsp;&nbsp;{{info.age}}岁<br>{{info.height ? info.height+'/cm' : ''}}&nbsp;{{info.weight ? info.weight + 'kg' : ''}}</span>-->
        </li>
      </a>
      <a href="javascript:;" @click.stop="pathography" class="describe">
        <li><b class="bg" ></b>病历描述</li>
        <span class="text">{{info.inquiry_note ? info.inquiry_note : '未填写'}}</span>
        <span class="arrow"></span>
      </a>
      <a href="javascript:;" class="group"  @click.stop="skipGro">
        <li><span class="bg"></span>归属分组</li>
        <span class="text">{{info.group_name}}</span>
        <span class="arrow"></span>
      </a>
      <a href="javascript:;" class="chart" @click.stop="skipChat">
        <li><span class="bg"></span>肺功能表
          <table>
            <tr>
              <th>最近PEF测定值</th>
              <th>个人PEF最佳值</th>
              <th>个人PEF预计值</th>
              <!--{{JSON.parse(info.breath)}}-->
            </tr>
            <tr>
              <td class="last_pef">{{info ? (info.breath.last_pef ? info.breath.last_pef : '--') : ''}}L/min</td>
              <td class="best_pef">{{info ? info.breath.best_pef ? info.breath.best_pef : '--' : ''}}L/min</td>
              <td class="expected_pef">{{info ? info.breath.expected_pef ? info.breath.expected_pef : '--' : ''}}L/min</td>
            </tr>
          </table>
        </li>
        <span class="arrow"></span>
      </a>
      <a href="javascript:;" class="health" @click.stop="skipHealth">
        <li><span class="bg"></span>健康测评</li>
        <span class="text"></span>
        <span class="arrow"></span>
      </a>
      <a href="javascript:;" class="detail" @click.stop="skipDetail">
        <li><span class="bg"></span>查看诊前描述</li>
        <span class="text"></span>
        <span class="arrow"></span>
      </a>
    </div>
    <button type="button" name="button" class="delete" @click.stop="deleGro" v-show="info.relation == '4' || info.relation == '2'">解除关系</button>
    <!--<acction-sheet :config="deleAction"></acction-sheet>-->
  </ul>
</template>

<script>
  import {Toast,MessageBox} from '../../components/hw-components'
  import acctionSheet from '../../components/actionsheet'
export default{
    name : 'userInfo',
    components : {acctionSheet},
    data(){return {
      prompt : {show : false ,title : '请输入备注信息',holder : '最长输入8个字符',tip : '',value : ''}
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '会员档案',fn : '', router : '', fShow : false,hShow : false});
//      设置prompt
      this.$store.commit('SET_PROMPT',this.prompt);
    },
  computed:{
    info(){
        return this.$store.state.chat.patInfo;
    },
    service(){
        return this.$store.state.chat.patService;
    }
  },
    methods : {
        change(){
          this.prompt.show = true;
          this.prompt.callback = (t) =>{
              if(t == '取消'){
                this.prompt.show = false;
                this.prompt.tip = '';
              }else{
                  t = t.trim();
                  this.prompt.value = t;
                  if(t.length  == 0 ){
                      this.prompt.tip = '请输入备注信息!';
                  }else if(t.length > 8){
                    this.prompt.tip = '备注信息最长八个字符!';
                  }else{
                     this.$api.changeRemark(this.info.account,t).then(obj=>{
                       this.prompt.tip = '';
                       this.prompt.show = false;
                       this.info.remark_name = t;
                       this.$store.commit('IS_UPDATE_DOCINFO',true);
                     })
                  }
              }
          }
        },
      skipChat(){
          if(this.info.breath.uid){
              window.location.href = `${BREATHE}/frontend/ui/day?isExternal=true&uid=${this.info.breath.uid}`;
          }else{
              Toast('该用户未绑定设备!');
        }
      },
      skipHealth(){
        if(this.info.breath.uid){
            window.location.href = `${BREATHE}/frontend/wap/allHistory/${this.info.breath.uid}`;
        }else{
          Toast('该用户未绑定设备!');
        }
      },
      skipDetail(){
          this.$router.push({path : `inquiryDetail`});
      },
      deleGro(){
//          if(this.service.order_status == '2'){
//              Toast('该会员还在服务期间，不能删除!');
//          }else{
            MessageBox.confirm('解除关系后，该会员将被从我的会员中移除,确定删除?').then(obj=>{
              this.$api.deletePat(this.info.account)
                .then(obj=>{
                    this.$store.commit('IS_UPDATE_CONTACTS',true);
                    this.$router.routeBack();
                })
            })
//          }
      },
      skipGro(){
          this.$router.push({path : `/${this.$route.params.chat_hx_account}/${this.info.group_id ? this.info.group_id : ' '}/userGroup`});
      },
      pathography(){
        this.$router.push({path : `pathography`});
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .chatnav{
    height: 0.8rem;
    background: #2a8cff;
    display: flex;
  }
  .chatnav b{
    width: 0.68rem;
    text-align: center;
    display: inline-block;
    background: url(../.././assets/media/img/nav-back_icon.png) no-repeat left .2rem center;
    background-size: .2rem .34rem;
  }
  .chatnav .sele{
    margin-left: 0.2rem;
    width: 6.62rem;
    height:0.8rem;
    display:flex;
  }
  .chatnav .sele a{
    display: inline-block;
    background: #2a8cff;
    font-size: 0.32rem;
    color: #95c6ff;
    height: 0.8rem;
    line-height: 0.8rem;
    width: 1.4rem;
    margin-right:0.87rem;
    padding: 0;
  }
  .chatnav .sele .userInfo{
    color: #fff;
    position: relative;
  }
  .sele .userInfo p{
    border: 0.12rem solid #fff;
    border-left: 0.12rem solid transparent ;
    border-right: 0.12rem solid transparent ;
    border-top: 0.12rem solid transparent ;
    position: absolute;
    bottom:0;
    left: 0.58rem;
  }
  .container .chart table td:last-child, .container .chart table th:last-child {
    border-left: 1px solid #dcdcdc
  }
  .container .chart li, .container .chart table th:last-child, .container .chart table th:nth-of-type(2),  .container .health li {
    border-bottom: 1px solid #dcdcdc
  }
  .container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $bg;
    .content{
      width: 100%;
      height: calc(100% - 1.8rem);
      overflow: scroll;
    }
  }
  .container a {
    display: block;
    background: #fff;
    padding: 0 .43rem 0 .24rem;
    position: relative;
    height: 1.2rem
  }
  .container span {
    display: inline-block
  }
  .container a>li {
    height: 100%;
    position: relative;
    display: flex;
    align-items: center
  }
  .container a>.arrow {
    width: .18rem;
    height: .29rem;
    background: url(../../assets/media/img/Rectangle.png) no-repeat;
    background-size: contain;
    position: absolute;
    right: .43rem;
    top: 50%;
    margin-top: -0.12rem
  }
  .container .head {
    height: 1.7rem
  }
  .container .chart {
    height: 2.35rem
  }
  .container .head img {
    width: 1.2rem;
    height: 1.2rem;
    -webkit-border-radius: 50%;
    -khtml-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
    border-radius: 50%;
    margin-right: .26rem
  }
  .info{
    height: 1.2rem;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    line-height: 0;
    h6{
      display: block;
      width: 100%;
      height: 0.5rem;
      line-height: 0.5rem;
    }
    .note{
      font-size: 0.28rem;
      color: $fGray;
      .name{
        font-size: 0.34rem;
        color: black;
        margin-right: 0.38rem;
      }
      i{
        margin-left: 0.1rem;
        &:before{
          font-size: 0.28rem;
        }
      }
    }
    .other{
      font-size: 0.3rem;
      color: $fGray;
      .name{
        font-size: 0.28rem;
        margin-right: 0.5rem;
      }
    }
  }
  .container .describe {
    margin-top: .2rem;
    /*border-top: 1px solid #dcdcdc;*/
    font-size: .34rem;
    line-height: .46rem
  }
  .container .describe .bg {
    background: url(../../assets/media/img/detail.png) no-repeat;
    width: .34rem;
    height: .44rem;
    background-size: contain;
    margin-right: .16rem
  }
  .container .describe .text, .container .detail .text, .container .group .text, .container .health .text {
    position: absolute;
    font-size: .3rem;
    height: 1.2rem;
    line-height: 1.2rem;
    vertical-align: middle;
    color: #787879;
    right: .62rem;
    width: 3.87rem;
    text-align: right;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    top: 0
  }
  .container .group {
    font-size: .34rem;
    line-height: .46rem
  }
  .container .group li {
    border-top: 1px solid #dcdcdc
  }
  .container .group .bg {
    background: url(../../assets/media/img/group.png) no-repeat;
    width: .39rem;
    height: .38rem;
    background-size: contain;
    margin-right: .11rem
  }
  .container .chart {
    font-size: .34rem;
    padding-top: .6rem;
    line-height: .46rem;
    margin-top: .2rem;
    padding-bottom: .02rem;
    position: relative
  }
  .container .chart .bg {
    background: url(../../assets/media/img/chart.png) no-repeat;
    width: .36rem;
    height: .33rem;
    background-size: contain;
    margin-right: .14rem
  }
  .container .chart li {
    position: relative;
    -webkit-align-items: flex-start;
    display: flex;
    align-items: flex-start
  }
  .container .chart table {
    position: absolute;
    display: block;
    font-size: .26rem;
    color: #787879;
    left: .15rem;
    top: .8rem;
    border: 1px solid #dcdcdc;
    -webkit-border-radius: .08rem;
    -khtml-border-radius: .08rem;
    -moz-border-radius: .08rem;
    -ms-border-radius: .08rem;
    -o-border-radius: .08rem;
    border-radius: .08rem
  }
  .mask .content .group-status, .mask .content .new-group {
    border-top: 1px solid #d2d2d2
  }
  .container .chart table td, .container .chart table th {
    text-align: center;
    width: 2.1rem;
    height: .63rem;
    line-height: .63rem
  }
  .container .chart table td:first-child {
    border-right: 1px solid #dcdcdc
  }
  .container .chart table th:first-child {
    border-right: 1px solid #dcdcdc;
    border-bottom: 1px solid #dcdcdc
  }
  .container .health {
    font-size: .34rem;
    line-height: .46rem;
    padding-bottom: .02rem;
  }
  .container .health .bg {
    background: url(../../assets/media/img/health.png) no-repeat;
    width: .39rem;
    height: .46rem;
    background-size: contain;
    margin-right: .11rem
  }
  .container .detail {
    font-size: .34rem;
    line-height: .46rem
  }
  .container .delete, .mask .submit {
    color: #fff;
    line-height: 1rem;
    font-size: .38rem;
    text-align: center
  }
  .container .detail .bg {
    background: url(../../assets/media/img/see.png) no-repeat;
    width: .36rem;
    height: .4rem;
    background-size: contain;
    margin-right: .14rem
  }
  .container .delete {
    width: 100%;
    display: block;
    font-size: 0.32rem;
    background: white;
    height: 1rem;
    color: $baseBlue;
  }
</style>
