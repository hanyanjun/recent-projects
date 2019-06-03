<template>
<div class="companyList companyCommon listWrapNoScroll">
    <el-row class="head">
        <el-col :span="12"><p class="title">系统参数</p></el-col>
        <el-col :span="12">
            <div class="search">
                <span class="search_input"><search  v-model="search" holder="请输入key" @search="searchKey"></search> 
                </span>
                <button class="add pointer" @click.stop="addShow = true;type = 'add';">新增</button>
            </div>
        </el-col>
    </el-row>
    <div class="tableContent">
            <el-table :data="list" height="200" class="tableContentScroll" >
                <el-table-column v-for="(column, key) in colums" :label="column.label" :width="column.width" :key="column.pro" >
                    <template slot-scope="scope">
                        <template v-if="column.pro != 'id'">
                            <el-tooltip class="item" effect="dark" :content="String(scope.row[column.pro]) || '---'" placement="left" >
                                <span :class="['font' ,'nowrap']" >
                                    {{scope.row[column.pro] || '---'}}
                                </span>
                            </el-tooltip>
                        </template>
                        <template v-else>
                            <span :class="['font' ,'nowrap']" >
                               {{scope.row[column.pro] || '---'}}
                            </span>
                        </template>    
                    </template>
                 </el-table-column>
                 <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini " @click.stop="editInfo(scope.row)" icon="el-icon-edit">编辑</el-button>
                    </template>
                 </el-table-column>
                 <empty slot="empty" :visible="visible"></empty>
            </el-table>
            <div class="pageFooter" v-if="allInfo.total">
                <pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :sizes="[10, 20, 30, 40]"
                :size="allInfo.pageSize"
                :current.sync="inpageNum"
                layout="total, sizes, prev, pager, next, jumper"
                :total="allInfo.total">
            </pagination>
            </div>
    </div>
        <reDialog :title="`${type == 'add' ? '新增' : '编辑'}系统参数`" 
                  :visible.sync="addShow" 
                  @close="addShow = false"
                  @submit="submit('form')">
                  <template slot="body">
                     <div class="companyCommon">
                         <el-form :model="addInfo" :rules="rules" class="dialogForm"  ref="form" label-width="114px">
                            <el-form-item label="配置key" size="medium"  prop="configKey">
                                <el-input  v-model.trim="addInfo.configKey"  placeholder="请输入"></el-input>
                            </el-form-item>
                            <el-form-item label="配置value" size="medium" prop="configValue">
                                <el-input  v-model.trim="addInfo.configValue"  placeholder="请输入"></el-input>
                            </el-form-item>
                            <el-form-item label="配置描述" size="medium" >
                                <el-input  v-model.trim="addInfo.remark"  placeholder="请输入"></el-input>
                            </el-form-item>
                     </el-form>
                     </div>
                  </template>
        </reDialog>
</div>
</template>

<script>
import search from "@/components/search"
import reDialog from "@/components/reDialog"
import pagination from "../../components/pagination"
import empty from "@/components/empty";
export default {
  name : 'sysparams',
  data(){return{
    search : '', //搜索内容
    addInfo : {
        configKey : '', //配置key
        configValue : '', //配置value
        remark : '', //配置描述
    },
    visible : false,
    type : 'add',
    curInfo : {},
    colums:[
        {
            pro : 'id',
            label : '配置ID',
            width : 100
        },
        {
            pro : 'configKey',
            label : '配置key'
        },
        {
            pro : 'configValue',
            label : '配置value',
            width : 200
        },
        {
            pro : 'remark',
            label : '配置描述',
        },
    ],
    addShow : false,
    list : [],
    inpageNum:1,
    allInfo : { total : 10, pages : '', pageSize : 20 ,  pageNum : 1 , list :[]},
    filter : {pageSize : 20 , pageNum : 1, key : '' },
    rules : {
        configKey :  { required: true, message: '请输入配置key', trigger: 'blur' },
        configValue :  { required: true, message: '请输入配置value', trigger: 'blur' },
    }
  }},
  created(){
      this.init();
  },
  components : {search,reDialog,pagination,empty},
  watch : {
    addShow: function(v){
        if(v){
            this.$nextTick(()=>{
                    this.$refs['form'].resetFields();
                    if(this.type == 'add'){
                        this.initAddInfo();
                        this.addInfo = Object.assign({},this.curInfo);
                    }else{
                        Object.assign(this.addInfo,this.curInfo);
                    }
            })
        }
    },
    search: function(v){
        if(v == ''){
            this.filter.key = '';
            this.init();
        }
    }
  },
  methods:{
      init(obj){
        this.$api.sysConfigList(obj || this.filter).then(obj=>{
            this.allInfo = obj.data.data;
            this.list = obj.data.data.list;
            this.visible = true;
            this.filter.pageSize = this.allInfo.pageSize;
            this.filter.pageNum = this.allInfo.pageNum;
        });
      },
      initAddInfo(){
          let obj = {
            configKey : '', //配置key
            configValue : '', //配置value
            remark : '', //配置描述
          };
          this.curInfo = Object.assign({},obj);
      },
      submit(formName){
        this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.type == 'add'){
                        let addInfo = Object.assign({},this.addInfo);
                        delete addInfo.id;
                        this.$api.addSysConfig(this.addInfo).then(obj=>{
                            this.$message({
                                message : '新增成功',
                                type : 'success'
                            })
                            this.addShow = false;
                            this.search = '';
                            this.init({pageSize : 20 , pageNum : 1 , key : ''});
                        })
                    }else{
                        this.$api.editSysConfig(this.addInfo).then(obj=>{
                            this.$message({
                                message : '更新成功',
                                type : 'success'
                            })
                            this.addShow = false;
                            this.init();
                        })
                    }
                }
        })
      },
      handleSizeChange(val) {
         this.filter.pageSize = val.value;
         if(val.isLoad){
         this.init();
         }
      },
      handleCurrentChange(val) {
        this.filter.pageNum = val;
        this.init();
      },
      editInfo(item){
          this.type = 'edit';
          this.curInfo = Object.assign({},item);
          this.addShow = true;
      },
      searchKey(){
        this.inpageNum = 1
        this.filter.pageNum = 1
        this.filter.key = this.search;
        this.init();
      } 
  }

}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.companyList{
    background: rgba(249,249,249,1);
    border: 1px solid #DCDFE6;
    .head{
        height: 60px;
        padding-right: 12px;
        .title{
            width:96px;
            font-size:16px;
            color: $gray_a2;
            margin-left: 26px;
            font-weight: bold;
            line-height: 60px;
        }
        .add{
            display: inline-block;
            width:60px;
            height:30px;
            background:rgba(31,158,251,1);
            border-radius:3px;
            font-size:12px;
            color:rgba(255,255,255,1);
        }
    }
    .el-form-item{
        margin-top: 10px;
        text-align: right;
    }
    .el-form-item__content{
        width: auto;
    }
}
.content{
    background: white;
}
.dialog{
    .title{
        width: 100%;
        text-align: center;
        background:rgba(245,247,250,1);
        border-radius:2px;
        position: absolute;
        left: 0;
        top: 0;
        height: 50px;
        font-size:16px;
        font-weight: bold;
        color:rgba(85,85,85,1);
        line-height:50px;
        .el-icon-close{
            position: absolute;
            font-size: 14px;
            top: 18px;
            right: 18px;
            &:hover{
                cursor: pointer;
            }
        }
    }
}
.el-form-item__content{
    text-align: left;
}
.font{
    color: #63717F;
    font-size: 12px;
}
.nowrap{
    white-space: nowrap;
}
.blue{
    color: #3C73B1;
}
.search_input{
    width: 300px;
    height: 30px;
}
</style>
