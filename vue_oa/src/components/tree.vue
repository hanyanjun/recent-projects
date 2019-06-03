<template>
<div class="treeContent">
    <el-collapse v-model="active">
    <el-collapse-item :title="title">
       <div class="treeItem">
            <el-tree
        :title="title"
        :data="arr"
        show-checkbox
        node-key="treeId"
        @check="check"
        :default-checked-keys="defaultKeys"
        :props="defaultProps">
        </el-tree>  
       </div>
    </el-collapse-item>
</el-collapse> 

</div>
</template>

<script>
export default {
    props:{
        arr : {
            type : Array,
            default : function(){
                return [{id : '', text : '', children : []}]
            }
        },
        title : {
            type : String,
            default :'成绩查询树'
        },
        keys :{
            type : String,
            default :'1'
        },
        treeInfo:{
            type : [String,Object],
            default : ''
        },
        defaultKeys : {
            type : Array,
            default : function(){
                return []
            }
        }
    },
    methods:{
        check(val,checked){
            this.$emit('check', {e : val , obj : checked , treeInfo : this.treeInfo});
        }
    },
    watch : {
        treeInfo : {
            function(v){
                console.log(v);
            },
            deep : true
        },
        defaultCheckedKeys : {
            function(v){
                console.log(v);
            },
            deep : true

        }
    },
    data() {
      return {
          data2: [{
          id: 1,
          text: '一级 1',
          children: [{
            id: 4,
            text: '二级 1-1',
            children: [{
              id: 9,
              text: '三级 1-1-1'
            }, {
              id: 10,
              text: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          text: '一级 2',
          children: [{
            id: 5,
            text: '二级 2-1'
          }, {
            id: 6,
            text: '二级 2-2'
          }]
        }, {
          id: 3,
          text: '一级 3',
          children: [{
            id: 7,
            text: '二级 3-1'
          }, {
            id: 8,
            text: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        active : '1'
      };
    }
  };
</script>

<style lang="scss">
@import "../assets/css/common.scss";
.treeContent{
  display: inline-block;
  width: auto;
  min-width: 400px; 
  margin: 10px 0;
  background: white; 
  .treeItem{
      padding-left: 10px;
  }
//   .el-tree-node__content
  .el-collapse-item__header{
     background: white; 
      border-left: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
      padding-left: 10px;
  }
  .el-collapse-item__wrap{
      border-left: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
  }
}
</style>
