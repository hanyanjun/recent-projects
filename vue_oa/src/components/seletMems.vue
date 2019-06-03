<template>
 <div class="orgManageSelectTree" v-show="visible">
  <div class="partTreeLeft">
    <el-input class="search" placeholder="输入部门搜索" suffix-icon="el-icon-search" v-model="filterText"></el-input>
    <h6 class="line"></h6>
    <el-tree class="filter-tree width200" :data="treeData" :props="props" default-expand-all="" :filter-node-method="partLeaderFilter" ref="partLeaderTree" @node-click="handleNodeClick"></el-tree>
  </div>
  <div class="partLeaderRight">
    <template v-if="multiple">
      <el-checkbox-group  v-model="multipleBox">
        <el-checkbox  
          v-for="(item,index) in partLeaderRadio" 
          :key="item.userId"
          :label="item.userId" 
          :value="item.userId" 
          @change="changeCheckbox(index,$event)" ref="partLeaderRadio">
          {{item.userName}}
        </el-checkbox>
      </el-checkbox-group>
    </template>
    <template v-else>
      <el-radio-group v-model="leaderGroup">
        <el-radio v-for="(item,index) in partLeaderRadio" :key="item.userId" :label="item.userName" :value="item.userId" @change="changeRadio(index,$event)" ref="partLeaderRadio">{{item.userName}}</el-radio>
      </el-radio-group>
    </template>
    <template v-if="partLeaderRadio.length == 0 && this.selected.org ">
       <h6 class="empty">暂无数据</h6>
    </template>
  </div>
</div>
</template>

<script>
export default {
  name : 'selectMems',
  props :{
     visible : {
         type : Boolean,
         default : true
     },
    //  是否多选
     multiple:{
        type : Boolean,
        default :false
     },
     initCheckBox : {
       type : Object,
       default : function(){
         return {}
       }
     },
     limit: {
       type : Number,
       default : -1
     },
     clear: {
       type : [String,Number,Array],
       default : ''
     }  
  },
  computed:{  
      treeData() {
        return this.$store.state.selectData.orgTreeBaseInfo.list;
      },
  },
  data(){return{
      filterText :'',
      multipleBox : this.clear, //多选框的内容
      props:{
        value: 'id',
        label: 'text',
        children: 'children'
      },
      checkboxValue : [],
      isRadio : false,
      leaderGroup : '',
      selected : {mem : '',org : '',  checkIds : []},
      motionDepart : '',
      partLeaderRadio : [],
      partLeaderRadioObj : this.initCheckBox,
      props:{
        value: 'id',
        label: 'text',
        children: 'children'
      },
      partTreeShow : false

  }},
  watch : {
    visible : function(v){
        if(!v){
            this.isRadio = false;
            this.selected.mem = '';
            this.selected.org = '';
        }
    },
    clear: function(v){
      if(v == '' || v == 0 || v.length == 0){
        this.partLeaderRadio = [];
        this.leaderGroup = '';
      }
      if(v.length != this.multipleBox.length){
        this.multipleBox = [...v];
      }
    },
     // 部门负责人tree过滤值监测
    filterText (val) {
      this.$refs.partLeaderTree.filter(val)
    }
  },
  methods:{
    // 添加中部门负责人的tree过滤
    partLeaderFilter (value, data) {
      if (!value) return true
      return data.text.indexOf(value) !== -1
    },
    partLeaderClose () {
        this.$emit("update:visible",false);
    },
    handleNodeClick (data) {
      // 点击之后将内容传给后端，获取负责人
      this.selected.org = Object.assign({},data);
      this.isRadio = false;
      this.$api.getEmpsByDeptId({deptId:data.id}).then((res) => {
          this.partLeaderRadio = res.data.data;
          this.partLeaderRadio.forEach((v)=>{
            this.partLeaderRadioObj[v.userId] = v.userName;
          })
      })
    },
    // 点击radio事件
    changeRadio (value,e) {
      this.isRadio = false;
      this.selected.mem = Object.assign({},this.partLeaderRadio[value]);
      this.$emit("select",this.selected);
      this.$parent.$parent.$parent.$el.click();
    },
    changeCheckbox(value,e){
      // let arr = [...this.checkboxValue];
      // if(e){
      //   arr.push(this.partLeaderRadio[value].userId);
      // }else{
      //   arr = arr.filter((v)=>{
      //      return v != this.partLeaderRadio[value].userId;
      //   })
      // }
      // this.checkboxValue = [...arr];
      if(this.limit != -1){
        if(this.multipleBox.length > this.limit){
          this.$message.error(`最多添加${this.limit}个人`);
          this.multipleBox.pop();
        }
      }
      let arr = [...this.multipleBox];
      let arr1 = [];
      arr.forEach(v=>{
        arr1.push(this.partLeaderRadioObj[v]);
      })
      this.selected.mem = Object.assign({},this.partLeaderRadio[value]);
      this.selected.checkIds = Object.assign([],arr);
      this.selected.checkMems = Object.assign([],arr1);
      this.$emit("update:clear",arr);
      this.$emit("select",this.selected);
    }
  }

}
</script>

<style lang="scss" scoped>
.orgManageSelectTree{
  width: 100%;
  height: 243px;
  background: #fff;
  border-radius: 4px;
  display: flex;
  .partTreeLeft{
    width: 50%;
    height: 243px;
    overflow-y: auto;
    border-right: 1px solid #f3ecec;
  }
  .search{
    width: 90%;
    margin: 4px 5% 0;
    .el-input__inner{
    height: 24px;
    line-height: 24px;
    }
  } 
  .partLeaderRight{
    width: 50%;
    height: 243px;
    overflow-y: auto;
    .el-radio,.el-checkbox{
      display: block;
      margin-left: 20px !important;
      margin-top: 20px;
    }
    i{
      display: inherit;
      text-align: right;
      font-size: 20px;
      padding-right: 6px;
      margin-bottom: 20px;
      cursor: pointer;
    }
  }
}
.line{
  height: 1px;
  background: #eeeeee;
  margin-top: 6px;
}
.empty{
    text-align: center;
    color: #999999;
    margin-top: 40%;
}
</style>
