<template>
<div id="tree" :class="`menuTree_${level}`">
    <template v-for="(item,key) in list" v-if="list && item">
        <template v-if="item.children && item.children.length != 0">
            <el-submenu :index="`${keys}_${item.name}`" >
                <template slot="title">
                    <i  :class="[  item.icon ?  'iconfont  '+item.icon  : 'el-icon-setting' ] " v-if="keys == 'root'"></i>
                    <span slot="title" v-show="(!isCollapse || isCollapse && keys != 'root')">
                        {{item.name}}
                    </span>
                  </template>
                <treeMenu :list="item.children" :keys="item.name"  :level="Boolean(level) + 1"></treeMenu>        
            </el-submenu>
        </template>
        <template v-else>
            <template v-if="keys == 'root'">
                <!-- <el-submenu :index="`${keys}_${item.name}`" class="menuNoArrow"> -->
                    <div  @click.stop="select(item)">
                        <template v-if="item.name == '工作流'">
                            <el-menu-item id="noArrow"  :index="`${keys}_${item.name}`" >
                                <i  :class="[item.icon ?  'iconfont  '+item.icon  : 'el-icon-setting'] " v-if="keys == 'root'"></i>
                                <span slot="title">{{item.name}}</span> 
                            </el-menu-item>
                        </template>
                        <template v-else>
                            <el-menu-item :index="item.link || ''" id="noArrow" >
                                <i  :class="[item.icon ?  'iconfont  '+item.icon  : 'el-icon-setting'] " v-if="keys == 'root'"></i>
                                <span slot="title">{{item.name}}</span> 
                            </el-menu-item>
                        </template>
                    </div>
                    <!-- <template slot="title">
                    <i  :class="[ item.icon ?  'iconfont  '+ item.icon  : 'el-icon-setting' ] " v-if="keys == 'root'"></i>
                    <span slot="title" v-show="(!isCollapse || isCollapse && keys != 'root')">
                        {{item.name}}
                    </span>
                  </template> -->
                <!-- </el-submenu> -->
            </template>
            <template v-else>
                <el-menu-item  :index="item.link || ''" >{{item.name}}</el-menu-item>
            </template>
        </template>
    </template>
</div>

</template>
<script>
import {mapState} from 'vuex'

export default {
  name : 'treeMenu',
  computed: {
    ...mapState(['isCollapse'])
  },
  props : {
      list : {
          type : [Array,Object,String],
      },
      keys : {

      },
      level:{

      }
  },
  methods:{
      skip(item){
          if(!item.link) return;
          this.$router.push({"path" : item.link})
      },
      select(item){
          if(item.name == '工作流'){
            window.open("#/home/work");
          }
      }
  }
}
</script>
<style lang="scss" scoped>
@import "../assets/css/common.scss";
.el-menu-item{
    background: $menuBg;
    color:rgb(191, 203, 217) !important
}
.el-menu-item:hover{
    background: #1f2d3d
}


.el-menu-item:hover>i,.el-submenu__title:hover>i{
    color: #10B2FF;
}
.el-menu-item .el-icon-setting{
    font-size: 16px;
    width: 16px;
    margin-right: 0;
    color:rgb(191, 203, 217)
}
.icon-company{
    font-size: 14px;
    color:rgb(191, 203, 217)
}
.el-menu-item>i,.el-submenu>div>i{
    color:rgb(191, 203, 217)
}
.el-menu-item>span{
    padding-left: 22px;
    color:rgb(191, 203, 217)
}
.el-submenu>div>span {
    padding-left: 16px;
    color:rgb(191, 203, 217)
}
.el-submenu{
    background: $menuBg;
}
a:link{
    text-decoration : none;
}
.el-submenu.is-opened{
    // background: #000c17;  //激活菜单的一级菜单是否 变色
    .el-submenu{
        // background: #000c17;
    }
    .el-menu-item{
        background: #1f2d3d
    }
    .el-menu-item:hover{
        background: #001528
    }
    .el-menu-item.is-active{
        // background: $blue_a;
        text-decoration: none;
        color: rgb(64, 158, 255) !important
    }
}

// 侧边菜单
.menuTree_1{
    .el-menu-item{
        padding-left: 60px !important;
    }
}
.menuTree_2{
    .el-menu-item{
        padding-left: 70px !important;
    }
}
.menuTree_3{
    .el-menu-item{
        padding-left: 80px !important;
    }
}
#noArrow.is-active{
    background: #1f2d3d;
    color: #409eff !important;
}
.icon-company{
    margin-left: -2.5px;
}
</style>
