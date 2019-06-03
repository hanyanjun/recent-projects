<template lang="pug">
#crumbs(v-if='(importId !== "") &&(importId !== "kong")')
  .wrapperIn
    el-breadcrumb.crumbsWrapper(separator-class='el-icon-arrow-right')
      // el-breadcrumb-item(:to="{ path: '/' }") 首页
      // el-breadcrumb-item(v-for='(item, key) in importId', :key='key') 分页{{item}}
div(v-else-if='importId === "kong"')
#crumbs(v-else)
  .wrapperIn
    el-breadcrumb.crumbsWrapper(separator-class='el-icon-arrow-right')
      // el-breadcrumb-item(style='color:#000 !important', :to="{ path: '/' }") 首页
      // el-breadcrumb-item() 分页{{itemRouter}}
</template>

<script>
// import core from '@/api/core'
// import util from '@/util'
import store from '@/vuex/store'
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  name: 'crumbs',
  data () {
    return {
      isCollapse: false,
      inputSearch: '',
      toggleFont: '展开',
      itemRouter: '',
      currentIndex: '1'
    }
  },
  computed: {
    ...mapState(['userName', 'importId']),
    ...mapGetters(['userName', 'importId'])
  },
  store,
  methods: {
    ...mapMutations([
      'userNameGet',
      'importIdGet',
      'importIdNull'
    ])
  },
  watch: {
    $route (to, from) {
      if (this.$router.currentRoute.name === '/') {
        this.itemRouter = '全部报表'
      } else if (this.$router.currentRoute.name === 'menuManage') {
        this.itemRouter = '菜单管理'
      } else if (this.$router.currentRoute.name === 'reportMan') {
        this.itemRouter = '指标管理'
      } else if (this.$router.currentRoute.name === 'reportManageNew') {
        this.itemRouter = '报表管理'
      } else {
        this.$store.commit('importIdNull')
      }
    }
  },
  created () {
    // if (this.$router.currentRoute.name === '') {
    // }
    // core.parentMenu({
    //   'id': this.$route.params.reportId
    // }).then((res) => {
    //   console.log('res.status:', res)
    // }).catch(util.errorHandle)
  },
  mounted () {
    // if (this.$router.currentRoute.name === '/') {
    //   this.itemRouter = '全部报表'
    // } else if (this.$router.currentRoute.name === 'menuManage') {
    //   this.itemRouter = '菜单管理'
    // } else if (this.$router.currentRoute.name === 'reportMan') {
    //   this.itemRouter = '指标管理'
    // } else if (this.$router.currentRoute.name === 'reportManageNew') {
    //   this.itemRouter = '指标管理'
    // } else {
    //   this.$store.commit('importIdNull')
    // }
  }
}
</script>

<style lang="sass" scoped>
// #crumbs
//   width: 100%
//   // height: 40px
//   // padding: 20px
//   // border: 1px solid rgb(39, 43, 81)
//   // padding-top: 20px
//   // padding-bottom: 10px
//   // padding-left: 20px
//   // padding-right: 20px
//   // background-color: rgb(229, 233, 242)
//   position: relative
//   .wrapperIn
//     // background-color: rgb(211, 220, 230)
//     width: auto
//     height: 48px
//     background: #FFFFFF
//     box-shadow: 0 0 6px 0 rgba(232,232,232,0.46)
//     // margin-top: 20px
//     // box-shadow: 0 0 2px 2px rgba(28, 31, 61, 0.1)
//     // border-radius: 5px
//     // border: 1px solid #aaa
//     // position: absolute
//     // margin-top: 20px
//     .crumbsWrapper
//       position: absolute
//       height: 20px
//       left: 20px
//       top: 13px
//       line-height: 20px
//     .searchInput
//       width: 300px
//       height: 42px
//       position: absolute
//       right: 10px
//       top: 3px
</style>
