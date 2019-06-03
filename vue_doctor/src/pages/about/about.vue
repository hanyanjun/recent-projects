<template>
  <div class="container">
    <img src="../../assets/media/img/logo.png" alt="">
    <a href="javascript:;" class="QR" @click.stop="change">
      <li class="b-1px-b"><span>关注微信号</span><span class="arrow"></span></li>
    </a>
    <router-link to="/agreement/serviceIntro">
      <li class="b-1px-b"><span>用户协议</span><span class="arrow"></span></li>
    </router-link>
    <a href="http://www.hiwein.com">
      <li><span>官方网站</span><span class="arrow"></span></li>
    </a>
    <div class="window" v-show="show" @click.stop="change">
      <img src="../../assets/media/img/QRcode.jpg" alt="">
      <span>关注微信公众号&nbsp;&nbsp;&nbsp;了解更多</span>
    </div>
  </div>
</template>

<script>
export default{
    data(){return{
        show : false
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '关于智呼吸', router : '', fn : '', fShow : false, hShow : true});
    },
    methods:{
      change(){
        this.show = this.show? false : true;
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    width: 100%;
    height: 100%;
    background: #f0eff5;
    padding-top: 1px;
    position: relative;
  }

  .container img {
    margin: 1rem auto 0.5rem;
    width: 2.5rem;
    height: 2.5rem;
    display: block
  }

  .container a {
    display: block;
    height: 1rem;
    padding: 0 .63rem;
    background: #fff
  }

  .container li {
    display: block;
    position: relative;
    line-height: 1rem;
    font-size: .3rem
  }

  .container .arrow {
    display: inline-block;
    width: .18rem;
    height: .29rem;
    background: url(../../assets/media/img/Rectangle.png) no-repeat;
    background-size: contain;
    position: absolute;
    right: .42rem;
    top: 50%;
    margin-top: -0.15rem
  }

  .window {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #fff;
  }

  .window img {
    width: 3.64rem;
    height: 3.64rem;
    margin: 2.55rem auto 1.18rem
  }

  .window span {
    display: block;
    text-align: center;
    font-size: .3rem
  }

</style>
