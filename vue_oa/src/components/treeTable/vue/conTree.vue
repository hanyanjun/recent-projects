<template>
  <el-scrollbar>
    <div class="menuListTreeGrid">
        <h6 :class="['tree_cell']" 
                :style="level(item)"
                v-for="(item,index) in treeData">
                <!-- 少渲染一个的情况  只渲染一个情况  不渲染的情况 -->
                <!-- // 每个children的最后一个子元素 少显示个line -->
              <template v-if="((item._broLen  ==  item._index + 1 || item._broLen == 1) )">
                  <template v-if="item._level == 0 && item._expanded">
                    <span class="line" :style="lineLeft(0)"></span>
                  </template>
                  <template v-else>
                    <template v-if="item._level ==1 &&item.children&& item.children.length != 0">
                      <span class="line" :style="lineLeft(0)"></span>
                      <span class="line" v-show="item._expanded" :style="lineLeft(1)"></span>
                    </template>
                    <template v-else>
                      <!-- <template v-if="item._broLen == 1 && item.children.length != 0">
                        <span class="line" :style="lineLeft(index1)" v-for="(item1,index1) in item._level + 1" :key="index1"></span>
                      </template>
                      <template v-else> -->
                        <span class="line" :style="lineLeft(index1)" v-for="(item1,index1) in item._level" :key="index1"></span>
                        <span class="line" v-show="item._expanded && item.children && item.children.length > 0" :style="lineLeft(item._level)"></span>
                      <!-- </template> -->
                    </template>
                  </template>
                </template>
                <template v-else>
                  <span class="line"   :style="lineLeft(index1)" v-for="(item1,index1) in item._level + 1" :key="index1"></span>
                </template> 
            <i :class="['iconfont','pointer','icon2', treeData[index]._expanded ? 'icon-minus-circle' : 'icon-plus-circle']   "
                @click.stop="toggle(index)"
                :style="level1(item)"></i>
            <button :class="['pointer',  {'selected' : item._selected || item._search}]" @click.stop="selected(index)">{{item[namePro]}}</button>
            <span class="btns" v-show="item._isBtn && item._level != 0">
                <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end">
                    <i class="iconfont  pointer  icon-bianji" @click.stop="editChild(item)" ></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="bottom-end">
                    <i class="iconfont pointer  icon-del2" @click.stop="deleChild(item)" ></i>
                </el-tooltip>  
                <el-tooltip class="item" effect="dark" content="添加" placement="bottom-end">
                    <i class="iconfont  pointer  icon-ic_join_dialing_norm"  @click.stop="addChild(item)"></i>
                </el-tooltip>
            </span> 
        </h6>
      </div>
  </el-scrollbar>
</template>
<script>
  export default {
    name: 'conTree',
    props: {
// 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
      treeStructure: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      treeData :{
          type : [Array,Object],
          default : function(){
              return [];
          }
      },
      namePro : {
        type : String,
        default : 'className'
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
    methods: {
    // 显示行
      showTr: function (row) {
        let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
        row._show = show
        return show ? '' : 'display:none;'
      },
      selected(item){
        this.$emit('selected',item);
      },
    // 展开下级
      toggle: function (trIndex) {
        let me = this
        let record = me.treeData[trIndex]
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
        let show = (level._parent ? (level._parent._expanded && level._parent._show) : true)
        level._show = show
        return `padding-left:${level._level*20 + 20}px !important;${show ? '' : 'display:none'}`;
      },
      level1(level,type){
        return `left:${level._level*20}px`;
      },  
      lineLeft(level){
        // console.log(`层级:${item._level};第${level}个Line`)
        // 多出来的线只是在最后一级上
        // 每个children的最后一个子元素 只显示 第0个line
        // if(item._broLen = 1  &&  item._level  == level && level > 0) return "display:none;"
        // if(level){
        //   return 'display:none';
        // }
        return `left:${level*20 + 10}px;`;
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
@import "../../../assets/css/common.scss";
.el-scrollbar{
  height: 100%;
}
.menuListTreeGrid{
    // padding-bottom: 20px;
    position: relative;
    .iconfont{
        color: #777777;
        font-size:20px;
        display: inline-block;
        width: 20px;
        height: 20px;
        background: white;
    }
    .tree_cell{
        display: flex;
        align-items: center;
        position: relative; 
        padding-top: 4px;
        padding-bottom: 4px;
        .line{
            position: absolute;
            height: 100%;
            border-left:1px dotted #777777;
            left:10px;
            top: 9px;   
        }
        .icon2{
            position: absolute;
            left: 0;
            top: 7px;
        }
        .btns{
            display: inline-block;
            width: 60px;
            position: relative;
            .iconfont{
                position: absolute;
                top: 50%;
            }
            .icon-bianji{
                left: 0;
                margin-top: -6px;
                font-size: 12px;
            }
            .icon-del2{
                left: 18px;
                margin-top: -11px;
                font-size: 22px;
            }
            .icon-ic_join_dialing_norm{
                left: 42px;
                margin-top: -5px;
                font-size: 12px;
            }
        }
        button{
            background: white;
            font-size:14px;
            color:rgba(102,102,102,1);
            line-height:30px;
            margin: 0 13px 0 4px;
            padding: 0 10px;
        }
      .selected{
        background: $blue_a;
        color: white;
        border-radius: 4px;
      }
    }
    .cellNoDotted{  
      .line{
        display: none;
      }
    }
}


</style>
