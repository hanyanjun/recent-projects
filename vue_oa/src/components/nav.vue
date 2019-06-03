

<template lang="pug">
.wrap
  .wrappTitle(v-if='!isCollapse')
    .wrappTitleImg
    // img.pngTitle(src='../commons/imgs/edaili_v2.png')
  .wrappTitle2(v-else)
    img.pngTitle2(src='../commons/imgs/edaili_min.jpg')
  el-menu.el-menu-vertical-demo(style='border-right: solid 5px #2E315F', :default-active='navIndex', @open='handleOpen', @select='goRouterNow', @close='handleClose', :collapse='isCollapse', background-color="#1C1F3D",
      text-color="#aaa",
      :unique-opened='true',
      active-text-color="#fff")
    //- 1.员工管理
    el-submenu(index='1')
      template(slot='title')
        i.el-icon-news(v-bind:class="{ activeNav: !isCollapse }")
        span.test(slot='title') 员工管理
      // el-menu-item-group
      el-menu-item(index="employeeList") 员工列表
    //- 2.个人中心
    el-submenu(index='2')
      template(slot='title')
        i.el-icon-edit-outline(v-bind:class="{ activeNav: !isCollapse }")
        span.test(slot='title') 个人中心
      // el-menu-item-group
      el-menu-item(index="personalCenter") 个人资料
    //- 3.组织管理
    el-submenu(index='3')
      template(slot='title')
        i.el-icon-menu(v-bind:class="{ activeNav: !isCollapse }")
        span.test(slot='title') 组织管理
      // el-menu-item-group
      el-menu-item(index="orgManagement") 组织架构管理
    //- 4.系统设置
    el-submenu(index='4')
      template(slot='title')
        i.el-icon-setting(v-bind:class="{ activeNav: !isCollapse }")
        span.test(slot='title') 系统设置
      // el-menu-item-group
      el-submenu(index="41")
          template(slot='title') 用户权限
          el-menu-item(index="menuList") 菜单列表
          el-menu-item(index="roleList") 角色列表
          el-menu-item(index="powerList") 权限配置
</template>

<script>
import '../commons/publicCss/nav.sass'
import '../commons/aminte.scss'
// 控制侧边栏显示-隐藏
import store from '@/vuex/store'
// 控制侧边栏展开-收缩
import { mapState } from 'vuex'
export default {
  name: 'Nav',
  data () {
    return {
      // allMenu: [{'id': 10, 'name': '123'}],
      // t1: [],
      // t2: [],
      // t3: [],
      // currentIndex: '1',
      navIndex: 'employeeList'
    }
  },
  computed: {
    ...mapState(['isCollapse'])
    // ...mapGetters(['isCollapse'])
  },
  store,
  methods: {
    // ...mapMutations(['menuToggle', 'allMenuGet']),
    // 侧边栏单个的上下折叠
    handleOpen (key, keyPath) {
      // console.log(key, keyPath) // 1,["0"]
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    },
    // 点击侧边栏导航 传入index，获取相应的页面
    goRouterNow (n1, n2) {
      this.$router.push({name: n1})
      this.navIndex = n1
    }
  },
  created () {
  }
}
</script>

<style lang="sass" scoped>
.iconMargin
  margin-right: 5px
.activeNav
  margin-left: -11px
#wrap
  height: 100%
.wrappTitle2
  width: 70px
  height: 80px
  background-color: #111229
  .pngTitle2
    width: 40px
    height: 40px
    margin-left: 15px
    margin-top: 20px
</style>
