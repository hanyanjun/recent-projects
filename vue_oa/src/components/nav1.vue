<template>
    <div :class="['leftMenu' ,{'leftMenu1' : isCollapse} ]">
    <div class="menuWrap" v-if="!isHideLogo">
        <template v-if="isCollapse">
          <img src="../commons/imgs/logo_icon.png" alt="">
        </template>
        <template v-else>
          <img src="../commons/imgs/logo3x.png"/>
        </template>
    </div>
    <div :class="['menuList',{'menuListH100': isHideLogo}]">
      <scrollContent>
        <el-menu 
            style="border-right: solid 5px #2E315F" 
            :default-active="navIndex" 
            router
            @open="handleOpen" 
            @select="goRouterNow" 
            @close="handleClose" 
            text-color="#a6aaae"
            :collapse="isCollapse" 
            :unique-opened="true" 
            :collapse-transition="true"
            active-text-color="#fff"
            class="el-menu-vertical-demo">
            <treeMenu :list="userMenu" keys="root" :level="0">
            </treeMenu>
        </el-menu>
      </scrollContent>
    </div>
</div>
</template>
<script>
// import '../commons/publicCss/nav.sass'
// import '../commons/publicCss/index.scss'
import '../commons/aminte.scss'
import treeMenu from "./treeMenu"
import scrollContent from "./scrollContent.vue"
// 控制侧边栏显示-隐藏
// 控制侧边栏展开-收缩
import { mapState } from 'vuex'
export default {
  name: 'Nav',
  data () {
    return {
      navIndex: '/home/company/list'
    }
  },
  components:{treeMenu,scrollContent},
  computed: {
    ...mapState(['isCollapse','userMenu','headInfo']),
    isHideLogo(){
      return this.headInfo.type == 'unifypc' || this.headInfo.type == 'unifyweixin';
    }
  },
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

    }
  },
  created () {
    this.navIndex = this.$route.path;
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/common.scss";
.leftMenu{
  height: 100%;
  .menuList{
    width: 100%;
    transition: width 0.4s linear .2s;
    height: calc(100% - 60px);
    background: $menuBg;
    overflow: hidden;
  }
  .menuListH100{
    height: 100%;
  }
  .menuWrap{
      width: 100%;
      height: 60px;
      background: $blue_a;
      text-align: center;
      img{
        width: 100px;
        height: 34px;
        margin-top: 12px;
        margin-left: -8px;
      }
  }
  .el-submenu__title{
    overflow: hidden
  }
  .el-submenu__title:hover{
    background: #001528 !important
  }
}
.leftMenu1{
  .menuWrap{
      height: 60px;
      img{
        width: 26px;
        height: 28px;
        margin-top: 16px;
      }
  }
}



</style>
