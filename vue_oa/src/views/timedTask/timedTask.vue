<template>
<div class="companyList companyCommon listWrapNoScroll">
    <el-row class="head">
        <el-col :span="12"><p class="title">定时任务</p></el-col>
        <el-col :span="12">
            <div class="search">
                <span class="search_input"><search  v-model="search" holder="请输入任务名" @search="searchKey"></search> 
                </span>
                <button class="add pointer" @click.stop="addShow = true;type = 'add';">新增</button>
            </div>
        </el-col>
    </el-row>
    <!-- <div class="content"> -->
        <div class="tableContent">                
            <el-table :data="list" height="200" class="tableContentScroll" >
                <el-table-column v-for="(column, key) in colums" :label="column.label" :width="column.width" :key="column.pro" >
                    <template slot-scope="scope">
                        <template v-if="column.pro == 'isConcurrent'">
                            <span :class="['font' ,'nowrap']" >
                            {{radio[scope.row[column.pro]]  || '---'}}
                            </span>
                        </template>
                        <template v-else-if="column.pro == 'jobStatus' || column.pro == 'prevExecStatus'">
                            <span :class="['font' ,'nowrap']" >
                            {{task[scope.row[column.pro]]  || '---'}}
                            </span>
                        </template>
                        <template v-else-if="column.pro == 'lastUpdated'">
                            <span :class="['font' ,'nowrap']" >
                            {{time(scope.row[column.pro])  || '---'}}
                            </span>
                        </template>
                        <template v-else-if="column.pro == 'nextExecTime' || column.pro == 'prevExecTime'">
                            <span :class="['font' ,'nowrap']" >
                            {{time1(scope.row[column.pro]) || '---'}}
                            </span>
                        </template>
                        <template v-else>
                            <template v-if="column.pro != 'id'">
                                <el-tooltip class="item" effect="dark" :content="String(scope.row[column.pro]) || '---'" placement="left" >
                                        <template v-if="column.pro == 'dateCreated'">
                                            <span class="font">
                                                {{time(scope.row[column.pro])  || '---'}}
                                            </span>
                                        </template>
                                        <template v-else>
                                            <span class="font nowrap">
                                            {{scope.row[column.pro] || '---'}}
                                            </span>
                                        </template>
                                </el-tooltip>
                            </template>
                            <template v-else>
                                <span :class="['font' ,'nowrap']" >
                                    {{scope.row[column.pro] || '---'}}
                                </span>
                            </template>
                        </template>
                    </template>
                 </el-table-column>
                 <el-table-column label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button type="success" size="mini " @click.stop="changeInfo(scope.row)">{{scope.row.jobStatus == 0  ? '执行' : '停止' }}</el-button>
                        <el-button type="primary" size="mini " @click.stop="editInfo(scope.row)" icon="el-icon-edit">编辑</el-button>
                        <el-button type="danger" size="mini " @click.stop="deleInfo(scope.row)" icon="el-icon-delete">删除</el-button>
                    </template>
                 </el-table-column>
                 <empty slot="empty" :visible='visible'></empty>
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
            <!-- </div> -->
    </div>
        <reDialog :title="`${type == 'add'  ? '新增' : '编辑'}定时任务`" 
                  :visible.sync="addShow" 
                  @close="addShow = false"
                  @submit="submit('form')">
                  <template slot="body">
                     <div class="companyCommon">
                         <el-form :model="addInfo"  :rules="rules"  class="dialogForm"  ref="form" label-width="114px">
                            <el-form-item label="任务名称" size="medium" prop="jobName">
                                <el-input  v-model.trim="addInfo.jobName"  placeholder="请输入任务名称"></el-input>
                            </el-form-item>
                            <el-form-item label="任务分组" size="medium"  prop="jobGroup">
                                <el-input  v-model.trim="addInfo.jobGroup"  placeholder="请输入任务分组"></el-input>
                            </el-form-item>
                            <el-form-item label="类路径" size="medium"  prop="beanClass">
                                <el-input  v-model.trim="addInfo.beanClass"  placeholder="请输入类路径"></el-input>
                            </el-form-item>
                            <el-form-item label="方法名" size="medium"  prop="methodName">
                                <el-input  v-model.trim="addInfo.methodName"  placeholder="请输入方法名"></el-input>
                            </el-form-item>
                            <el-form-item label="springBean" size="medium"  prop="springBean">
                                <el-input  v-model.trim="addInfo.springBean"  placeholder="请输入springBean"></el-input>
                            </el-form-item>
                            <el-form-item label="时间表达式" size="medium"  prop="cronExpression">
                                <el-input  v-model.trim="addInfo.cronExpression"  placeholder="请输入时间表达式"></el-input>
                            </el-form-item>
                            <el-form-item label="是否同步"  prop="isConcurrent" >
                                <el-radio-group v-model="addInfo.isConcurrent">
                                    <el-radio  label="0">是</el-radio>
                                    <el-radio  label="1">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="描述" size="medium"  prop="description">
                                <el-input  v-model.trim="addInfo.description"  type="textarea" :rows="2"  placeholder="请输入描述"></el-input>
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
  name : 'timedTaskList',
  data(){return{
    search : '', //搜索内容
    addInfo : {
        jobName : '', //任务名称 必填
        jobGroup : '', //任务分组 必填
        beanClass : '', //类路径 必填
        methodName : '', //方法名 必填
        springBean : '', //springBean 选
        cronExpression : '', //时间表达式 必填
        isConcurrent : '', //是否同步 必填
        description : '', //描述  选
    },
    visible : false,
    curInfo : {},
    radio :{
        0 : '是',
        1 : '否'
    },
    task:{
        0 : '停止',
        1 : '执行'
    },
    rules : {
        jobName: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
        ],
        jobGroup: [
            { required: true, message: '请输入任务分组', trigger: 'blur' },
        ],
        beanClass: [
            { required: true, message: '请输入类路径', trigger: 'blur' },
        ],
        methodName: [
            { required: true, message: '请输入方法名', trigger: 'blur' },
        ],
        cronExpression: [
            { required: true, message: '请输入时间表达式', trigger: 'blur' },
        ],
        isConcurrent: [
            { required: true, message: '请选择是否同步', trigger: 'change' },
        ],
    },
    
    type : 'add',
    colums:[
        {
            pro : 'id',
            label : 'ID',
            width : 40
        },
        {
            pro : 'jobGroup',
            label : '任务分组',
            width : 60
        },
        {
            pro : 'jobName',
            label : '任务名称',
            width : 70
        },
        {
            pro : 'description',
            label : '任务描述',
            width : 100
        },
        {
            pro : 'beanClass',
            label : '类路径',
            width : 80
        },
        {
            pro : 'jobStatus',
            label : '任务状态',
            width : 60
        },
        {
            pro : 'cronExpression',
            label : '时间表达式',
            width : 80
        },
        {
            pro : 'isConcurrent',
            label : '是否同步',
            width : 60
        },
        {
            pro : 'methodName',
            label : '方法名',
            width : 80
        },
        {
            pro : 'prevExecTime',
            label : '上次执行时间',
            width : 150
        },
        {
            pro : 'prevExecStatus',
            label : '上次执行状态'
        },
        {
            pro : 'nextExecTime',
            label : '下次执行时间',
            width : 150
        },
        {
            pro : 'dateCreated',
            label : '创建时间',
            width : 90
        },
        {
            pro : 'lastUpdated',
            label : '更新时间',
            width : 150
        },
        {
            pro : 'springBean',
            label : 'SpringBean',
            width : 100
        },
    ],
    addShow : false,
    list : [],
    inpageNum:1,
    allInfo : { total : 10, pages : '', pageSize : 20 ,  pageNum : 1 , list :[]},
    filter : {page : {pageNum : 1 , pageSize : 20} , value :''}
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
    search:function(v){
        if(v == ''){
            this.filter.value = '';
            this.init();
        }
    }
  },
  methods:{
      init(obj){
        this.$api.timedTaskList(obj || this.filter).then(obj=>{
            this.allInfo = obj.data.data;
            this.visible = true;
            this.list = obj.data.data.list;
            this.filter.page.pageSize = this.allInfo.pageSize;
            this.filter.page.pageNum = this.allInfo.pageNum;
        });
      },
      initAddInfo(){
          let obj = {
            jobName : '', //任务名称 必填
            jobGroup : '', //任务分组 必填
            beanClass : '', //类路径 必填
            methodName : '', //方法名 必填
            springBean : '', //springBean 选
            cronExpression : '', //时间表达式 必填
            isConcurrent : '', //是否同步 必填
            description : '', //描述  选
          };
          this.curInfo = Object.assign({},obj);
      },
      submit(formName){
        this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.type == 'add'){
                        let addInfo = Object.assign({},this.addInfo);
                        delete addInfo.id;
                        this.$api.addTimedTask(this.addInfo).then(obj=>{
                            this.$message({
                                message : '新增成功',
                                type : 'success'
                            })
                            this.addShow = false;
                            this.search = '';
                            this.init({page : {pageNum : 1 , pageSize : 20} , value :''});
                        })
                    }else{
                        this.$api.editTimedTask(this.addInfo).then(obj=>{
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
      changeInfo(item){
          this.$api.changeTimedTask({cmd : item.jobStatus == 0 ? 'start' : 'stop' , id : item.id}).then(obj=>{
              this.$message({
                      message :`${item.jobStatus == 0 ? '已开启任务' : '已停止任务'}`,
                      type : 'success'
               })
               this.init();
          })
      },
      deleInfo(item){
        this.$confirm('此操作将删除任务, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
        }).then(() => {
                this.$api.deleTimedTask(item.id).then(obj=>{
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.init();
                })
        })
      },
      handleSizeChange(val) {
         this.filter.page.pageSize = val.value;
         if(val.isLoad){
         this.init();
         }
      },
      handleCurrentChange(val) {
        this.filter.page.pageNum = val;
        this.init();
      },
      editInfo(item){
          this.type = 'edit';
          this.curInfo = Object.assign({},item);
          this.addShow = true;
      },
      searchKey(){
        this.inpageNum = 1
        this.filter.page.pageNum = 1
        this.filter.value = this.search;
        this.init();
      },
      time(item){
          if(!item) return "---";
          return item;
      },
      time1(item){
          if(!item) return "---";
          return this.formatUnixtimestamp(item);
      },
      formatUnixtimestamp (unixtimestamp){
        var unixtimestamp = new Date(unixtimestamp);
        var year = 1900 + unixtimestamp.getYear();
        var month = "0" + (unixtimestamp.getMonth() + 1);
        var date = "0" + unixtimestamp.getDate();
        var hour = "0" + unixtimestamp.getHours();
        var minute = "0" + unixtimestamp.getMinutes();
        var second = "0" + unixtimestamp.getSeconds();
        return year + "-" + month.substring(month.length-2, month.length)  + "-" + date.substring(date.length-2, date.length)
            + " " + hour.substring(hour.length-2, hour.length) + ":"
            + minute.substring(minute.length-2, minute.length) + ":"
            + second.substring(second.length-2, second.length);
      }
 
  }

}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.companyList{
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
    height: calc(100% - 60px);
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
.btns{
    text-align: center;
    button{
        display: inline-block;
        width:150px;
        height:36px;
        border-radius:4px;
        box-sizing:border-box;
    }
    .submit{
        background:rgba(16,178,255,1);
        color: white;
    }
    .cancle{
        height:36px;
        border: 1px solid $gray_d1;
        background: #f9f9f9;
        margin-left: 20px;
    }
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
