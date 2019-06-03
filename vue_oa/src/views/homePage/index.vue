<template >
<div id="app">
  <div id="nav" v-bind:class="isCollapse ? 'widthMin' : 'widthMax'">
    <navbar></navbar>
  </div>
  <div id="content" :class="isCollapse ? 'content2' : 'content1'">
    <div id="topXi">
      <topBar></topBar>
    </div>
    <div class="mainContent">
        <scrollContent>
          <div class="inner">
            <router-view></router-view> 
          </div>
        </scrollContent> 
    </div>
    <!-- <div id="inner"> -->
      <!-- <div class="mainContent"> -->
        
      <!-- </div> -->
    <!-- </div> -->
  </div>
</div>
</template>

<script>
import navbar from '@/components/nav1'
import topBar from '@/components/topBar'
import scrollContent from '@/components/scrollContent'
import store from '@/vuex/store'
import { mapState  } from 'vuex'

export default {
  name: 'app',
  components: {
    navbar,
    topBar,
    scrollContent
  },
  computed: {
    ...mapState({
      'isCollapse' : state => state.isCollapse
    }),

  },
  store,
  data () {
    return {
      toggle: true,
      activeIndex: 0
    }
  },
  methods: {
    isLoginPage () {
      if (this.$route.name === 'Login') {
        this.toggle = true
      } else {
        this.toggle = false
      }
    },
    next () {
      if (this.activeIndex++ >= 2) {
        this.activeIndex = 0
      }
    },
    // // 进入页面初始化信息
    // init(){
    //     // 如果用户的头部信息需要修改那么就去请求接口更改头部信息
    //     this.getBaseInfo().then(_=>{
    //       // 获取权限树
    //       this.getBaseMenu().then(_=>{
    //       })
    //     });
    // }
  }
}
</script>

<style lang="sass">
*
  list-style: none
  margin: 0
  padding: 0
  border: 0
#nav::-webkit-scrollbar
  display: none
html
  width: 100%
  height: 100%
body
  width: 100%
  height: 100%
  // font-family: 'PingHei', 'PingFang SC', 'Microsoft YaHei', '微软雅黑', apple-system, sans-serif
  // font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif
.box
//   background: url('assets/fb26689989fe9e9f074d4ac87fa2973d.png') repeat-x
  background-size: 100%
  padding: 12px
  margin: 10px
  vertical-align: top
  flex: 1
  flex-basis: 20%
  min-width: 300px
#app
  display: flex
  height: 100%
  flex: 1
  box-sizing: border-box
  min-width: 0
  #content
    position: relative
    height: 100%
    background-color: rgb(244,244,244)
    transition: width 0.4s linear .2s
  .content1 
    width: calc(100% - 200px) 
  .content2 
    width: calc(100% - 70px) 
  #nav
    z-index: 2
    height: 100%
    overflow: inherit
    overflow-y: auto!important
    box-sizing: border-box
  .widthMax
    width: 200px
    transition: width 0.4s linear .2s
  .widthMin
    width: 70px
    transition: width 0.4s linear .2s
    .navFooterPng
      width: 178px
      height: 252px
      position: absolute
      z-index: -1
      bottom: 0
#topXi
  top: 0
  background-color: #fff
  position: absolute
  z-index: 5
  width: 100%
  box-shadow: 0px 0px 5px 0px rgba(209,209,209,1)
.mainContent
  height: calc(100% - 60px)
  overflow: hidden
  box-sizing: border-box
  margin-top: 60px
.inner
  padding: 26px 20px
  box-sizing: border-box
  overflow: hidden
  background-color: #f4f4f4
.cell
  padding: 0 !important
.el-table__footer-wrapper
  td
    background:  #e2f0e4 !important
#inner .chart
  width: 100%
  margin: 0 auto
  height: 350px
.el-table td, .el-table th
  padding: 5px !important
  text-align: center !important
.addInputWidth
  width: 400px !important
.el-dialog__footer
  text-align: right
.employeeHead
  padding: 10px 0 5px
  font-size: 20px
  font-weight: bold
</style>
