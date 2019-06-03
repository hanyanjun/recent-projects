<template>
<div id="topBar">
  <div class="navInfo">
     <i :class="['iconfont', 'icon-caidan' ,   isCollapse ?  'rightIcon' : 'leftIcon']"  @click.stop="toggleGo"></i>
    <!-- <div class="toggleIcon"><img style="margin-top: 20px" v-bind:class="isCollapse ? 'leftIcon' : 'rightIcon'" @click="toggleGo" src="https://fb.blackfish.cn/fb/t1/G1/M00/00/34/CiAgxVrkV3eIMmmUAAADoRB6bV8AAF1eAP_-8QAAAQ8409.png" class="toggleImg"/></div> -->
  </div>
  <div class="topNavName">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
      <template v-for="item in routeTrack.children" v-if="item.nav">
        <el-breadcrumb-item :to="item.fullPath">{{item.nav}}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
  <div class="barWrapper">
    <div class="infoApper" v-if="headInfo.type != 'unifypc' && headInfo.type != 'unifyweixin'">
      <div style="float:left;margin: 8px;">
        <img v-if="headInfo.headPic" :src="headInfo.headPic"   @click="selfCenter" class="headImg"/>
        <img v-else src="../commons/imgs/emptyHead.png" @click="selfCenter" class="headImg"/>
      </div>
      <div style="float:left"><span @click.stop="selfCenter" class="outLogin">{{headInfo.name}}</span> <span> | </span><span @click.stop="outLoginClick" class="outLogin">退出登陆</span></div>
    </div>
  </div>
</div>
</template>

<script>
import util from '../util'
import core from '@/api/core'
import crumbs from '@/components/crumbs'
import store from '@/vuex/store'
import axios from 'axios'
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  name: 'topBar',
  components: {
    crumbs
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState(['isCollapse','headInfo','routeTrack']),
  },
  store,
  methods: {
    ...mapMutations([
      'userNameGet',
      'menuToggle',
      'importIdNull',
      ''
    ]),
    goNewData () {
    },
    toggleGo () {
      // 侧边栏折叠按钮点击
      this.$store.commit('menuToggle')
    },
    // 退出登陆
    outLoginClick () {
      // util.delCookie('auth')
      // 调接口
      this.$api.loginout().then(res =>{
        this.$store.dispatch('clearAllInfo');
        this.$router.push({ name: 'login' });
      })
    },
    getHeadPic (param, This) {
      
    },
    selfCenter(){
      window.sessionStorage.removeItem('benchPerTab');
      this.$router.push({name : 'personalCenter'});
    }
  },
  created () {
    // console.log(this.headInfo)
  }
}
</script>

<style lang="sass" scoped>
// 修改1
.iconfont
   color: #333
   font-size: 20px
   transition: transform .3s linear
   position: absolute
.iconfont:hover
   cursor: pointer   
.rightIcon
    transform: rotate(180deg)   
#topBar
  width: 100%
  height: 60px
  color: #fff
  position: relative
  background: #FFFFFF
  // box-shadow: 0 2px 6px 0 rgba(232,232,232,0.46)
  .navInfo
    position: absolute
    left: 0px
    top: 50%
    margin-top: -10px
    left: 10px
  .topNavName
    position: absolute
    left: 50px
    top: 24px
    font-size: 24px
  .infoApper
    line-height: 60px
    color: #666
    position: absolute
    right: 36px
    .headImgBtn
      padding: 14px 16px
      margin-right: 14px
    .headImg
      height: 44px
      width: 44px
      border-radius: 50%
      cursor: pointer
  .outLogin
    cursor: pointer
  .outLogin:hover
    color: #10B2FF
</style>
