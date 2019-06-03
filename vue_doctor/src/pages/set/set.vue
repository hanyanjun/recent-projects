<template>
  <div class="container">
    <ul class="set">
      <router-link to="/setPassword"><li class="b-1px-b"><span class="password">修改密码</span><span class="infoShow"></span><i class="icon-return-boldleft"></i></li></router-link>
      <!--<router-link to="/null/resetIphone"><li class="b-1px-b"><span class="iphone">修改手机</span><span class="infoShow phone">{{phone}}</span><i class="icon-return-boldleft"></i></li></router-link>-->
      <router-link to="/newsReportSet"><li class="new"><span>新消息提醒</span><i class="icon-return-boldleft"></i></li></router-link>
    </ul>
    <ul class="aboutHelp">
      <a :href="link"><li class="b-1px-b"><span class="help">帮助与反馈</span><i class="icon-return-boldleft"></i></li></a>
      <router-link to="/about"><li class="noline"><span class="about">关于智呼吸</span><i class="icon-return-boldleft"></i></li></router-link>
    </ul>
    <button type="button" name="button" class="logout" @click.stop="skip">退出登录</button>
  </div>
</template>

<script>
export default{
    created(){
      this.$store.commit('UPDATE_NAV',{title : '个人设置',fn : '', router : '/my', fShow : false, hShow : true});
    },
    computed:{
        phone(){
            return this.$store.state.docInfo.phone;
        },
        link(){
          return `${BREATHE}/feedback/authorize/getCode/doctor`
        }
    },
    methods :{
        skip(){
          //退出登录  将扫码等进入页面 保存的路由清除掉 不然手动退出登录 将不会跳转到work页
          window.sessionStorage.removeItem('sharePath');
          //退出登录更新 用户需要更新信息的初始状态
          this.$router.push({path : '/login'});
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .container {
    background: $bg;
    height: 100%;
    overflow: hidden;
  }
  .icon-return-boldleft{
    color: $iconGray;
    transform: rotateY(180deg);
    font-size: 0.4rem;
  }
  .container a {
    display: block;
    padding: 0 .3rem;
    height: 1rem;
    line-height: 1rem;
    background: #fff;
    position: relative;
    font-size: .3rem;
    border-bottom: 1px solid transparent;
  }

  .container span {
    display: inline-block
  }

  .container span.arrow {
    width: .18rem;
    height: .29rem;
    background: url(../../assets/media/img/Rectangle.png) no-repeat;
    background-size: contain;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -0.15rem
  }

  .container a li {
    height: 100%;
    /*padding-left: .6rem;*/
    position: relative;
    -webkit-align-items: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .container .infoShow {
    width: 5rem;
    height: 100%;
    text-align: right;
    /*margin-right: .7rem;*/
    white-space: nowrap;
    overflow: hidden;
    color: $fGray;
    position: absolute;
    right: 0.64rem;
    text-overflow: ellipsis
  }



  .container .aboutHelp {
    margin-top: .2rem;
    background: #fff;
  }

  .container .about span, .container .help span {
    height: .34rem;
    position: absolute;
    top: 50%;
    left: 0
  }

  .container .logout {
    display: block;
    width: 100%;
    height: 1.1rem;
    text-align: center;
    font-size: .32rem;
    background: white;
    line-height: 1.1rem;
    box-sizing: border-box;
    margin: .2rem auto
  }

</style>
