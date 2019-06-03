<template>
  <div class="container">
    <div class="content">
      <div class="title">
        <i :class="status.pro == '1' ? 'icon-verify-success': (status.pro== '2' ? 'icon-time' : 'icon-verify-fail')"></i>
        {{status.tip}}
        <div class="bg" v-show="status != '3'"></div>
        <div class="question" v-show="status == '3'"  @click.stop = "intorduce">
          <span>如何实名认证</span>&nbsp;&nbsp;
          <span class="icon-question"></span>
        </div>
      </div>
      <hw-button  config="知道了" @event="submit"></hw-button>
    </div>
    <h6 class="tel" v-show="status != '3'">联系我们：<a href="tel:400-608-1028">400-608-1028</a></h6>
  </div>
</template>

<script type="text/javascript">
  export default{
    name: 'vetifyResult',
    data(){return{
        status : '',
        jump:false,
        path:''
    }},
    created(){
      let status = JSON.parse(this.$route.query.status);
      this.status = status;
      this.$store.commit('UPDATE_NAV',{title : status.title, fShow : false, hShow : true});
    },
    methods : {
      submit(){
        // var paths = JSON.parse(window.sessionStorage['routeTrack']).children;
        // for(var i=0; i<paths.length;i++){
        //   if(paths[i].fullPath.match('expertDetails') != null){
        //     this.jump = true;
        //     // var id = paths[i].fullPath.split('/')[1];
        //     // this.path=`/${id}/expertDetails`;
        //     this.path = paths[i].fullPath;
        //   }else {
        //     // console.log(paths[i].fullPath)
        //     // console.log(paths[i].fullPath.split('/')[1]);
        //   }
        // }
        // console.log(this.path)
        //判断是否从分享专家合作名片过来的，如果是注册完成后返回专家合作详情
        if(sessionStorage['sharePath']){
          this.$router.push({path : sessionStorage['sharePath']});
        }else{
          this.$router.push({path : this.status.route});
        }

      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/common";
  .content{
    padding: .4rem .3rem;
    box-sizing: border-box;
    height: calc(100% - 1.4rem);
    .title{
      // height: 3rem;
      width: 6.9rem;
      background: #fff;
      font-size: .32rem;
      text-align: center;
      padding: 0 0.3rem;
      box-sizing: border-box;
      i{
        font-size: 1.15rem;
        display: inline-block;
        width: 100%;
        text-align: center;
        padding: .55rem 0;
      }
      .bg{
        height: .9rem;
        background: #fff;
      }
      .question{
        padding-left: 2.3rem;
        padding-bottom: .2rem;
        height: 1rem;
        color: $baseBlue;
        // background: yellow;
        display: flex;
        span{
          display: inline-block;
          line-height: 1rem;
          font-size: .32rem;
        }
        .icon-question{
          display: inline-block;
          line-height: 1rem;
          font-size: .32rem;
        }

      }
    }
    .div-active{
      padding: 0;
      margin-top: .3rem;
    }
  }

  .tel{
    color: $fGray;
    font-size: 0.32rem;
    height: 0.4rem;
    line-height: 0.4rem;
    text-align: center;
    a{
      color: $baseBlue;
    }
  }
</style>
