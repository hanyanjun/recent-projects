<template>
 <div class="companyCommon companyList listWrapNoScroll" >
        <el-row class="head">
            <el-col :span="8"><p class="title">考试管理</p></el-col>
            <el-col :span="16">
                <div class="search">
                    <div class="search-input"><search  v-model="search"  maxlength="20" holder="请输入考试名称" @search="searchInfo"></search> </div> 
                    <button class="add pointer" @click.stop="dialogVisible = true">筛选</button>
                    <button class="all pointer" @click.stop="initExam">创建考试</button>
                </div>
            </el-col>
        </el-row>
        <div class="filterResult" v-if=" (dialogForm.time && dialogForm.time.length != 0)  || dialogForm.examStatus ">
            筛选结果
            <span class="filterInfo" v-if="dialogForm.time && dialogForm.time.length != 0">
                <i class="circle"></i>
                参考时间&nbsp;{{dialogForm.time[0]}}-{{dialogForm.time[1]}}
                <i class="iconfont icon-del2 pointer" @click.stop="clear(['time'])"></i>
            </span>
            <span class="filterInfo" v-if="dialogForm.examStatus">
                <i class="circle"></i>
                 考试状态&nbsp;{{examStatus.obj[dialogForm.examStatus]}}
                <i class="iconfont icon-del2 pointer" @click.stop="clear(['examStatus'])"></i>
            </span>
            <button class="clear pointer" @click.stop="clear(['time','examStatus'])">清除筛选结果</button>
        </div>
         <div class="content">
             <el-table :data="list"   height="200"  class="tableContentScroll" >
                <el-table-column label='序号' type='index' width='60'></el-table-column>
                <el-table-column v-for="(column, key) in colums"  :prop="column.pro" :label="column.label"  :width="column.width" :key="column.pro" >
                    <template slot-scope="scope">
                        <template v-if="column.pro == 'examName'">
                            <span :class="['font', 'pointer', 'blue' ]" @click.stop="rowClick(scope.row)">
                                {{scope.row[column.pro] || '---'}}
                            </span>
                        </template>
                        <template v-else-if="column.pro == 'examStatus'">
                            <span :class="['font', 'examGray', {'examBlue' : scope.row.examStatus == '1' } , {'examBlack' : scope.row.examStatus == '0' || scope.row.examStatus == '3' }]" >
                                {{examStatus.obj[scope.row[column.pro]] || '---'}}
                            </span>
                        </template>
                        <!-- examStartTime -->
                        <template v-else-if="column.pro == 'examStartTime'">
                            <template v-if="scope.row[column.pro]">
                                <span :class="['font']" >
                                        {{scope.row[column.pro].slice(0,-3)}}至{{scope.row['examEndTime'].slice(0,-3)}}
                                </span>
                            </template>
                            <template v-else>
                                <span :class="['font']" >
                                        ---
                                </span>
                            </template>
                        </template>
                        <template v-else>
                            <span :class="['font']" >
                                    {{scope.row[column.pro] || '---'}}
                            </span>
                        </template>
                    </template>
                 </el-table-column>
                 <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="bottom"  v-show="scope.row.examStatus == '0' || scope.row.examStatus == '3' " >
                            <i class="iconfont  pointer icon-bianji" @click.stop="rowClick(scope.row)" ></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="bottom"  v-show="scope.row.examStatus == '0' || scope.row.examStatus == '3'" >
                            <i class="iconfont pointer icon-del"  @click.stop="deleExam(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="分析" placement="bottom"  v-show="scope.row.examStatus == '2'" >
                            <i class="iconfont  pointer icon-fenxi2"  @click.stop="fenxiExam(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="复制" placement="bottom"  v-show="scope.row.examStatus != '1'" >
                            <i class="iconfont  pointer icon-fuzhi" @click.stop="copyExam(scope.row)" ></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="结束" placement="bottom"  v-show="scope.row.examStatus == '1'" >
                            <i class="iconfont  pointer icon-jinyong"  @click.stop="stopExam(scope.row)"></i>
                        </el-tooltip>
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
        <reDialog title="考试列表筛选" 
                  :visible.sync="dialogVisible"
                  @close="closeFilter" 
                  @submit="filterTime">
                  <template slot="body">
                     <el-form :model="dialogForm"  class="dialogForm" ref="form" label-width="114px">
                        <el-form-item label="考试状态" size="medium" >
                             <el-radio-group v-model="dialogFormCopy.examStatus">
                                <el-radio   v-for="item in examStatus.list" :key="item.code" :label="item.code">{{item.name}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="考试时间范围" size="medium" >
                             <el-date-picker
                                v-model="dialogFormCopy.time"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                              </el-date-picker>
                        </el-form-item>
                     </el-form>
                  </template>
        </reDialog>


        <reDialog
            :visible.sync="deleExamDialog" 
            @submit="confirmDelete"
            submit="确定"
            :title="dialogType == 'delete'?  '确认删除考试？' : '确定统一收卷？' ">
            <el-form   ref="form" label-width="114px" slot="body">
                <el-form-item  class="t1" size="medium" v-for="(item,index) in examDeleteLabel" :key="index" :label="item.label">
                    <span class="tip">{{curInfo[item.pro]}}</span>
                </el-form-item>
            </el-form>
        </reDialog>
 </div>   
</template>

<script>
import search from "@/components/search"
import reDialog from "@/components/reDialog"
import { variableDeclaration } from 'babel-types';
import utils from "../../components/treeTable/utils/index.js"
import pagination from "../../components/pagination"
import empty from "@/components/empty";
export default {
    name :'adList',
    components : {search,reDialog,pagination,empty},
    data(){return { 
        dialogVisible : false,
        deleExamDialog : false,
        search : '',
        visible : false,
        inpageNum:1,
        dialogForm : {
            time : '',
            examStatus : ''
        },
        dialogFormCopy:{
            time : '',
            examStatus :''
        },
        filter : {
             pageNum :  1, //页码
             pageSize  : 20, //页容量
             examEndTime : '',//	参考结束时间	object	
             examName : '',//	考试名称	string	
             examStartTime : '',//	参考开始时间	string	
             examStatus	 : ''//考试状态
        },
        curInfo : {},
        dialogType : '',
        examDeleteLabel : [
            {label : '考试名称：' , pro : 'examName'},
            {label : '考试开始时间：' , pro : 'examStartTime'},
            {label : '应考人数：' , pro : 'totalUser'}
        ],
        time : '',
        id: '', //跳入详细页面需要用的id
        list : [],
        allInfo : { total : 0, pages : 1, pageSize : 20 ,  pageNum : 1 , list :[]},
    }},
    watch : {
        search : function(v,o){
            if(v == ''){
                 this.filter.examName = '';
                 this.init();
            }
        },
        dialogVisible: function(v,o){
            if(v){
                this.dialogFormCopy.time = '';
                this.dialogFormCopy.examStatus = '';
            }
        }
    },
    computed:{
        colums(){
            return this.$store.state.exam.colums;
        },
        examStatus(){
            return this.$store.state.selectData.examStatus;
        }
    },
    methods:{
      handleSizeChange(val) {
         this.filter.pageSize = val.value;
         if(val.isLoad){
          this.init();
         }
      },
      closeFilter(){
          this.time = '';
          this.dialogFormCopy.time = '';
          this.dialogFormCopy.examStatus = '';
      },
      confirmDelete(){
         if(this.dialogType == 'delete'){
            this.$api.deleExam(this.curInfo.id).then(obj=>{
            this.$message({
                type: 'success',
                message: '删除成功!'
                });
                this.init();
                this.deleExamDialog = false;
            }).catch(_=>{
                    this.deleExamDialog = false;
             })
         }
         if(this.dialogType == 'stop'){
             this.$api.submitExamOnHead({examId : this.curInfo.id}).then(obj=>{
                 this.$message({
                    type: 'success',
                    message: '统一收卷成功!'
                 });
                    this.init();
                    this.deleExamDialog = false;
             }).catch(_=>{
                    this.deleExamDialog = false;
             })
         }
      },
      handleCurrentChange(val) {
         this.filter.pageNum = val;
          this.init();
      },
      searchInfo(){
          this.inpageNum = 1
          this.filter.pageNum = 1
          this.filter.examName = this.search;
          this.init();
      },
      rowClick(item){
        //   if(item.examStatus == '0'){
            window.sessionStorage['examEditInfoId'] = item.id;
            // this.$util.fullScreen(document.querySelector('#app'));
            this.$router.push({name : 'initExam'});
        //   }else{
        //       if(item.examStatus == '1'){
        //          this.$message.error('考试中不可编辑');    
        //       }else{
        //          this.$message.error('考试已结束不可编辑');  
        //       }
        //   }
      },
      deleExam(item){
          this.dialogType = "delete";
          this.curInfo = item;
          this.deleExamDialog = true;
      },
      stopExam(item){
          this.dialogType = "stop";
          this.curInfo = item;
          this.deleExamDialog = true;
      },
      fenxiExam(item){
          window.sessionStorage['examId'] = item.id;
          window.sessionStorage['examName'] = item.examName;
          this.$router.push({name : 'examAnalysis'});
        //   console.log('分析考试');
      },
      copyExam(item){
        window.sessionStorage['examEditInfoId'] = item.id;
        window.sessionStorage['examCopy'] = true;
        this.$router.push({name : 'initExam'});
        //   this.$api.copyExam(item.id).then(obj=>{
        //        this.$message({
        //            type: 'success',
        //            message: '复制成功!'
        //        });
        //        this.initFilter();
        //    })
      },
      initFilter(){
          this.filter = Object.assign({},{
             pageNum :  1, //页码
             pageSize  : 20, //页容量
             examEndTime : '',//	参考结束时间	object	
             examName : '',//	考试名称	string	
             examStartTime : '',//	参考开始时间	string	
             examStatus	 : ''//考试状态
        });
        this.dialogForm = Object.assign({}, {
            time : '',
            examStatus : ''
        })
      },
      clear(arr){
          let filter =  Object.assign({},this.filter);
          arr.forEach(v => {
              if(v == 'time'){
                  filter.examStartTime = '';
                  filter.examEndTime = '';
              }
              this.dialogForm[v] = '';
              filter[v] = '';
          });
          filter.pageNum = 1;
          this.inpageNum = 1
          this.filter = Object.assign({},filter);
          this.init();
      },
      filterTime(){
          let filter =  Object.assign({},this.filter);
          if(this.dialogFormCopy.time){
            filter.examStartTime = this.dialogFormCopy.time[0];
            filter.examEndTime = this.dialogFormCopy.time[1];
          }else{
              filter.examStartTime = '';
              filter.examEndTime = '';
          }
          filter.pageNum = 1;
          filter.examStatus = this.dialogFormCopy.examStatus;
          this.filter = Object.assign({},filter);
          this.dialogForm = Object.assign({},this.dialogFormCopy);
          this.dialogVisible = false;
          this.inpageNum = 1
          this.init();
      },
      init(obj){
          this.$api.examList(obj || this.filter).then(obj=>{
            this.allInfo = obj.data.data;
            this.list = obj.data.data.list;
            this.visible = true;
            this.filter.pageSize = this.allInfo.pageSize;
            this.filter.pageNum = this.allInfo.pageNum;
        })
      },
      initExam(){
          let obj = Object.assign({},this.$store.state.exam.examCopyInfo);
          this.$store.state.exam.examInfo =  JSON.parse(JSON.stringify(obj));
          this.$router.push({path :'/home/initExam'});
      }
    },
    created(){
        this.init();
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.listWrapNoScroll{
    background: white;
    border: 1px solid $gray_f1;
}
.content{
    height: calc(100% - 60px);
}

.font{
    color: #63717F;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.blue{
    color: #3C73B1;
}
.examGray{
     color: #D9D9D9;
}
.examBlue{
    color: #1F9EFB;
}
.examBlack{
    color: #63717F;
}

.pointer{
    cursor: pointer;
}
.iconfont{
    color: #63717F ; opacity: 1;
} 
.icon-bianji{
    opacity: 0.5;
}
.icon-fenxi2{
    opacity: 0.5;
}
.icon-jinyong{
    opacity: 0.5;
}
.icon-fuzhi,.icon-del{
    margin-left: 14px;
    opacity: 0.5;
}  
.icon-pdf-shangchuan{
    color: #ce5453; 
}
.iconfont:hover{
    opacity: 1;
}
.icon-pdf{
    opacity: 1;
}
.el-dialog{
    .el-dialog__body{
        padding: 50px 20px;
    }
}
.filterResult{
    padding-left: 26px;
    box-sizing: border-box;
    font-size:12px;
    color:rgba(85,85,85,1);
    background: $btn_bg;
    padding-bottom: 15px;
    .filterInfo{
        display: inline-block;
        padding: 0 50px 0 28px;
        height:26px;
        background:rgba(255,255,255,1);
        border-radius:13px;
        border: 1px solid #c3cbd6;
        position: relative;
        line-height: 26px;
        margin-left: 10px;
        color: #63717F;
        .circle{
            display: inline-block;
            width:8px;
            height:8px;
            background:#c3cbd6;
            border-radius: 50%;
            position: absolute;
            left: 12px;
            top: 7px;
        }
        .iconfont{
            font-size: 20px;
            color: #c3cbd6;
            position: absolute;
            right: 10px;
            top: 5px;
            line-height: 15px;
            opacity: 1;
        }
    }
    .clear{
        font-size:12px;
        color:rgba(60,115,177,1);
        margin-left: 13px;
        background: $btn_bg;
    }
}

        .head{
            background: $btn_bg;
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
            button{
                display: inline-block;
                width:60px;
                height:30px;
                background:rgba(31,158,251,1);
                border-radius:3px;
                font-size:12px;
                color:rgba(255,255,255,1);
                margin-left: 10px;
            }
            .all{
                width:80px;
            }
        }
        .search{
            display: flex;
            height: 30px;
            justify-content: flex-end;
            margin-top: 15px;
            .search-input{
                width: 300px;
                height: 30px;
            }
        }     
 .tip{
    text-align: center;
    height:12px;
    font-size:12px;
    font-weight: normal;
    color:rgba(153,153,153,1);
    margin: 10px 0 15px;
 } 
 .dialogForm{
    .title{
        font-size:16px;
        color:rgba(85,85,85,1);
        line-height:16px;
        margin-bottom: 40px;
    }
 }
 
.page{
        font-size:12px;
        color:rgba(193,197,205,1);
        line-height: 1;
        margin: 8px 0 5px 0; 
}
.fileInfo{
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
}
.title{
        font-size:14px;
        color:rgba(102,102,102,1);
        font-weight: normal;
        .size{
            font-size:12px;
            color: #d4d8de;
        }
}
.title1{
        margin-top:8px;
}
</style>
