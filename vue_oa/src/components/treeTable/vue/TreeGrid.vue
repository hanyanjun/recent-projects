<template>
  <div id="menuListTreeGrid">
    <el-table :data="data" border highlight-current-row :row-style="showTr" height="200" :class="tabeClass">
    <!--<el-table-column v-for="(column, index) in columns" :key="column.dataIndex"-->
    <el-table-column v-for="(column, index) in columns" :label="column.text"  :key="column.dataIndex" :width='column.width' :class="column.class">
      <template slot-scope="scope">
        <!-- <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" :key="levelIndex" class="ms-tree-space"></span> -->
        <!-- <span v-else-if="index===0" class="ms-tree-space"></span> -->
        <span  :style="level(scope.row['_level'],column.dataIndex)" :class="[column.dataIndex == levelType ? 'left' : '']">
          <button class="haveButton" v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">
            <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
            <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
          </button>
          <!-- {{column}} -->
          {{scope.row[column.dataIndex]}}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="操作" v-if="treeType === 'normal'" width="210">
      <template slot-scope="scope">
        <el-button size='mini' type='primary' plain @click="editChild(scope)">编辑</el-button>
        <el-button size='mini' type='danger' plain @click="deleChild(scope)">删除</el-button>
      </template>
    </el-table-column>
    <empty slot="empty" :visible="true"></empty>
  </el-table>
  </div>
</template>
<script>
  import Utils from '../utils/index.js'
  import empty from "@/components/empty"
//  import Vue from 'vue'
  export default {
    name: 'tree-grid',
    components:{empty},
    props: {
// 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
      treeStructure: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      tabeClass:{
        type : String
      },
// 这是相应的字段展示
      columns: {
        type: Array,
        default: function () {
          return []
        }
      },
      levelType : {
         type : String,
         default : ''
      },
// 这是数据源
      dataSource: {
        type: Array,
        default: function () {
          return []
        }
      },
// 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
      requestUrl: {
        type: String,
        default: function () {
          return ''
        }
      },
// 这个是是否展示操作列
      treeType: {
        type: String,
        default: function () {
          return 'normal'
        }
      },
// 是否默认展开所有树
      defaultExpandAll: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    data () {
      return {
      }
    },
    computed: {
    // 格式化数据源
      data: function () {
        let me = this;
        if (me.treeStructure) {
          let data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
          return data
        }
        return me.dataSource
      }
    },
    methods: {
    // 显示行
      showTr: function (row, index) {
        let show = (row.row._parent ? (row.row._parent._expanded && row.row._parent._show) : true)
        row.row._show = show
        return show ? '' : 'display:none;'
      },
    // 展开下级
      toggle: function (trIndex) {
        let me = this
        let record = me.data[trIndex]
        record._expanded = !record._expanded
      },
    // 显示层级关系的空格和图标
      spaceIconShow (index) {
        let me = this
        if (me.treeStructure && index === 0) {
          return true
        }
        return false
      },
      level(level,type){
        if(type != this.levelType) return '';
        return `padding-left:${level*20}px`;
      },
    // 点击展开和关闭的时候，图标的切换
      toggleIconShow (index, record) {
        let me = this
        if (index === 0 && record.children && record.children.length > 0) {
          return true
        }
        return false
      },
      addChild(value){
        this.$emit('add',value)
      },
      // addNew1c(id){
      //   console.log(id);
      // },
      deleChild(value){
        this.$emit('dele',value)
      },
      editChild(value){
        this.$emit('edit',value)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .ms-tree-space{
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;
    padding-left: 16px
    }
  .ms-tree-space::before{content: ""}
  table td{
    line-height: 26px;
  }
  #menuListTreeGrid{
    .haveButton{
      background:rgba(0, 0, 0, 0);
    }
    .haveButton:hover{
      cursor: pointer;
    }
  }
.left{
  display: inline-block;
  width: 90%;
  height: 100%;
  box-sizing: border-box;
  word-break: break-all;
  text-align: left;
  margin-left: 10px;
}
</style>
