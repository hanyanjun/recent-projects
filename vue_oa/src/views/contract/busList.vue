<template>
 <div class="companyCommon companyList listWrapNoScroll" >
        <el-row class="head">
            <el-col :span="8"><p class="title">业务合同列表</p></el-col>
            <el-col :span="16">
                <div class="search">
                    <div class="search-input"><search  v-model="search" holder="请输入合同编号/乙方" @search="searchInfo"></search> </div> 
                    <button class="add pointer" @click.stop="dialogVisible = true">筛选</button>
                    <button class="all pointer" @click.stop="coverVisible = true">生成封面</button>
                    <button class="all pointer" @click.stop="exportData">导出数据</button>
                </div>
            </el-col>
        </el-row>
        <div class="filterResult" v-if=" (time.signDate && time.signDate.length != 0) ||  (time.createDate && time.createDate.length != 0)">
            筛选结果
            <span class="filterInfo" v-if="time.signDate && time.signDate.length != 0">
                <i class="circle"></i>
                签署时间&nbsp;{{time.signDate[0]}}-{{time.signDate[1]}}
                <i class="iconfont icon-del2 pointer" @click.stop="clear(['signDate'])"></i>
            </span>
            <span class="filterInfo" v-if="time.createDate && time.createDate.length != 0">
                <i class="circle"></i>
                创建时间&nbsp;{{time.createDate[0]}}-{{time.createDate[1]}}
                <i class="iconfont icon-del2 pointer" @click.stop="clear(['createDate'])"></i>
            </span>
            <button class="clear pointer" @click.stop="clear(['createDate','signDate'])">清除筛选结果</button>
        </div>
         <div class="content">
             <el-table :data="list"   height="200"  class="tableContentScroll" >
                <el-table-column label='序号' type='index' width='60'></el-table-column>
                <el-table-column v-for="(column, key) in colums" :sortable="column.pro  == 'contractNum' || column.pro  ==  'signDate' || column.pro  == 'partyA' ||  column.pro  =='partyB'"   :prop="column.pro" :label="column.label"  :key="column.pro" >
                    <template slot-scope="scope">
                        <template v-if="column.pro == 'contractName'">
                            <span :class="['font', 'pointer','blue']" @click.stop="rowClick(scope.row)">
                                {{scope.row[column.pro] || '---'}}
                            </span>
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
                        <el-tooltip class="item" effect="dark" content="预览封面" placement="right-end">
                            <i class="iconfont  pointer icon-yulan"   @click.stop="preView(scope)"></i>
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
        <reDialog title="业务合同筛选" 
                  :visible.sync="dialogVisible"
                  @close="closeFilter" 
                  @submit="filterTime">
                  <template slot="body">
                     <el-form :model="filter"  class="dialogForm" ref="form" label-width="114px">
                        <el-form-item label="签署时间范围" size="medium" >
                             <el-date-picker
                                v-model="timeCopy.signDate"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                              </el-date-picker>
                        </el-form-item>
                        <el-form-item label="创建时间范围" size="medium" >
                             <el-date-picker
                                v-model="timeCopy.createDate"
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
        <reDialog title="生成合同封面" 
                  :visible.sync="coverVisible" 
                  @close="closeCover"
                  @submit="submitCover">
                  <template slot="body">
                    <div class="upload">
                        <i :class="['iconfont', file.totalPage ? 'icon-pdf-shangchuan' : 'icon-pdf']"></i>
                        <h6 class="page" v-show="file.totalPage">共{{file.totalPage}}页</h6>
                        <h6 class="fileInfo">
                            <h6 :class="['title',{'title1' : !file.totalPage}]" v-show="file.name">{{file.name}} <span class="size" v-show="file.size">（{{file.size}}）</span></h6>
                            <button :class="['pointer', {'left0' : !baseInfo.contractBusinessFile}]" @click.stop="sUpload">{{baseInfo.contractBusinessFile ?  "重新上传" : '上传PDF'}}</button>
                        </h6>
                        <input type="file" style="display:none;" ref="cover" @change="upload">
                    </div>
                    <h6 class="tip">*格式只能为 PDF ,大小在2MB内。</h6>
                     <div class="companyCommon">
                         <el-form :model="baseInfo"  class="dialogForm" :rules="rules"  ref="coverForm" label-width="114px">
                        <h6 class="title">合同分类</h6>
                        <el-form-item label="归档到" size="medium" prop="contractSortId">
                            <el-select v-model="baseInfo.contractSortId" placeholder="请选择归档分类">
                                <el-option
                                v-for="item in conTreeData.list"
                                :key="item.id"
                                :label="item.className"
                                :value="item.id">
                                <template slot-scope="scope">
                                    <h6 :style="`font-weight:normal;padding-left:${item._level*20}px`" >  
                                    <span>{{item.className}}</span>
                                    <i>{{item.index}}</i>
                                    </h6>
                                </template>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <h6 class="title">封面信息</h6>
                        <el-form-item label="合同名称" size="medium" prop="contractName">
                            <el-input  v-model.trim="baseInfo.contractName"  placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="合同编号" size="medium" prop="contractNum">
                            <el-input  v-model.trim="baseInfo.contractNum" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="甲方 " size="medium" prop="partyA">
                            <!-- <el-input  v-model="baseInfo.partyA"  placeholder="请输入"></el-input> -->
                            <el-select v-model="baseInfo.partyA"  placeholder="请选择">
                                <el-option  v-for="(item,index) in cpmpanyList.list" :key="index" :value="item.id" :label="item.companyName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="乙方 " size="medium" prop="partyB">
                            <el-input  v-model.trim="baseInfo.partyB"  placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="乙方联系方式" size="medium" prop="partyBContact">
                            <el-input  v-model.trim="baseInfo.partyBContact"  placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="渠道经理" size="medium" prop="channelManagerId">
                            <el-select v-model="baseInfo.channelManagerName" class="orgSelect" placeholder="请选择">
                              <template slot-scope="scope">
                                  <selectMem  :treeData="treeMem.list" @select="selectMem"  :clear="baseInfo.channelManagerName"></selectMem>
                                  <el-option  v-for="(item,index) in [0]" :key="index" :value="item.id">
                                  </el-option>
                              </template>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="渠道部门" size="medium" prop="channelDeptId">
                            <!-- <div class="selectInput"> -->
                                <!-- <el-input  @focus="focus"  v-model="treeMem.obj[baseInfo.channelDeptId]" placeholder="请选择"></el-input> -->
                            <!-- </div> -->
                            <el-cascader
                                :options="orgTreeExtInfo"
                                v-model="baseInfo.channelDeptId"
                                :props="{value : 'id' , label : 'text'}"></el-cascader>
                        </el-form-item>
                        <el-form-item label="结算币种" size="medium" prop="billingCurrency">
                            <el-select  v-model="baseInfo.billingCurrency" placeholder="请选择">
                                <el-option
                                v-for="item in settlement_type.list"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生效日期" size="medium" prop="effectiveDate">
                            <el-date-picker
                                v-model="baseInfo.effectiveDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                @change="effectiveDate"
                                placeholder="请选择">
                            </el-date-picker>
                        </el-form-item>      
                        <el-form-item label="终止日期" size="medium" prop="endDate">
                            <el-date-picker
                                v-model="baseInfo.endDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                @change="endDate"
                                placeholder="请选择">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="收到材料" size="medium" prop="receivedMaterial">
                            <el-checkbox-group v-model="baseInfo.receivedMaterial">
                                <template v-for="item in entrymaterials.list">
                                    <el-checkbox :label="item.code" name="receivedMaterial" :key="item.code">{{item.name}}</el-checkbox>
                                </template>
                            </el-checkbox-group>
                        </el-form-item>
                     </el-form>
                     </div>
                  </template>
        </reDialog>
        <previewCover 
            :title="preSources.coverName"
            :num="preSources.contractNum"
            :visible.sync="coverPre"
            :columns="preColums"
            @preview="skipInfo"
            :sources="preSources"></previewCover>
 </div>   
</template>

<script>
import search from "@/components/search"
import reDialog from "@/components/reDialog"
import selectMem from "../../components/selectMem"
import { variableDeclaration } from 'babel-types';
import utils from "../../components/treeTable/utils/index.js"
import empty from "@/components/empty";
import previewCover from "@/components/previewCover"
import pagination from "../../components/pagination"
export default {
    name :'adList',
    components : {search,reDialog,selectMem,previewCover,pagination,empty},
    data(){return { 
        list : [],
        dialogVisible : false,
        coverVisible : false,
        selectMemShow : false,
        coverPre : false,
        visible : false,
        search : '',
        file :{
            name : '',
            size : '',
            totalPage : ''
        },
        name1 : '',
        name2 : '',
        filter : {
             pageNum :  1, //页码
             pageSize  : 20, //页容量
             createDateEnd	: '', // 查询结束创建日期
             createDateStart	: '', // 查询开始创建日期
             key	: '', // 	合同编号或乙方
             signDateEnd	: '', // 	查询结束签署签署
             signDateStart	: '', // 	查询开始签署日期
             classType :'B'	
        },
        preSources : {},
        time : {
            signDate : '',
            createDate :''
        },
        timeCopy : {
            signDate : '',
            created : ''
        },
        id: '', //跳入详细页面需要用的id
        list : [],
        inpageNum: 1,
        allInfo : { total : 0, pages : 1, pageSize : 20 ,  pageNum : 1 , list :[]},
    }},
    watch : {
        classId: function(v){
            let filter = Object.assign({},this.filter);
            this.inpageNum = 1
            filter.pageNum = 1;
            // filter.pageSize = 20;
            filter.classId = v,
            this.closeFilter();
            this.filter = Object.assign({},filter);
            this.init();
        },
        search : function(v,o){
            if(v == ''){
             this.filter.key = '';
             this.init();
            }
        },
        coverVisible: function(v){
            if(v){
                this.$nextTick(()=>{
                    this.$store.state.contract.busBaseInfo = Object.assign({},this.$store.state.contract.busBaseInfoCopy); //重新设置form的值
                    this.file.name = '';
                    this.file.size = '';
                    this.file.totalPage = '';
                    this.$nextTick(()=>{
                        this.$refs['coverForm'].resetFields();
                    })
                })
            }
        },
        dialogVisible: function(v,o){
            if(v){
                this.timeCopy.signDate = '';
                this.timeCopy.createDate = '';
            }
        }
    },
    computed:{
        colums(){
            return this.$store.state.contract.busColums;
        },
        cpmpanyList(){
            return this.$store.state.selectData.allCompanyList;
        },
        classId(){
            return this.$store.state.contract.filterClassId;
        },
        rules(){
            return this.$store.state.contract.busBaseRules;
        },
        preColums(){
            return this.$store.state.contract.busPreColums;
        },
        baseInfo(){
            return this.$store.state.contract.busBaseInfo;
        },
        conTreeData(){
            return this.$store.state.selectData.contractTreeData;
        },
        treeMem(){
            return this.$store.state.selectData.orgTreeBaseInfo;
        },
        settlement_type(){
            return this.$store.state.selectData.settlement_type;
        },
        entrymaterials(){
            return this.$store.state.selectData.busi_material;
        },
        orgTreeExtInfo(){
            return this.$store.state.selectData.orgTreeExtInfo;
        }
    },
    methods:{
      handleSizeChange(val) {
         this.filter.pageSize = val.value;
         if(val.isLoad){
            this.init();
         }
          
      },
      effectiveDate(item){
          if(this.baseInfo.endDate && Date.parse(new Date(item)) > Date.parse(new Date(this.baseInfo.endDate))){
              this.$store.state.contract.busBaseInfo.effectiveDate = '';
              this.$message.error('生效日期不能大于终止日期!');
          }
        //   this.$store.state.contract.busBaseInfo.effectiveDate = '';
        //   console.log(Date.parse(new Date(item)));
      },
      endDate(item){
        if(this.baseInfo.effectiveDate && Date.parse(new Date(item)) < Date.parse(new Date(this.baseInfo.effectiveDate))){
              this.$store.state.contract.busBaseInfo.endDate = '';
              this.$message.error('终止日期不能小于生效日期!');
          }
      },
      sUpload(){
        this.$refs.cover.click();
      },
      closeFilter(){
          this.timeCopy = Object.assign({},{signDate : '',createDate :''})
      },
      upload(e){
        let target = e.target || e.srcElement;  
        let f = target.files[0];
        target.value = '';
        if(f){
            let size = f.size/1024/1024;
            if(size > 2 ){
                this.$message.error('文件大小需在2M内！');
            }else{
                if(this.fileType(f.name) != 'pdf'){
                    this.$message.error("文件必须是pdf格式");
                }else{
                    this.file.name = f.name;
                    let formData = new FormData();
                    formData.append('file', f);
                    this.$store.dispatch("uploadFile",{type : 'inrecoag' , formData : formData}).then(obj=>{
                        this.$store.state.contract.busBaseInfo.contractBusinessFile = obj.data.data.filePath;
                        this.file.totalPage = obj.data.data.totalPage;
                        this.file.size = obj.data.data.size;
                    })
                }
            }
        }
      },
      fileType(item){
            if(!item) return '';
            let type = item.slice(item.lastIndexOf(".")+1).toLowerCase();
            if(/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(type)){
                return 'img';
            }
            return type;
        },
      submitCover(){
        this.$refs['coverForm'].validate((valid) => {
                if (valid) {
                    let base  =  Object.assign({},this.baseInfo);
                    delete base.contractId;
                    base.channelDeptId = base.channelDeptId[base.channelDeptId.length - 1];
                    base.receivedMaterial =  JSON.stringify(base.receivedMaterial);
                    this.$api.addBusCover(base).then(obj=>{
                        this.closeCover();
                        this.closeFilter();
                        this.search = '';
                        this.$message({
                            message: '封面生成成功',
                            type: 'success'
                        });
                        this.init({ pageNum :  1, pageSize  : 20 , classType :'B'});
                        this.coverVisible = false;
                    })
                }
        })
      },
      closeCover(){
          this.$nextTick(()=>{  
              this.timeCopy.signDate = '';
              this.timeCopy.created = '';
            //   this.$refs['coverForm'].resetFields();
          })
      },
      handleCurrentChange(val) {
         this.filter.pageNum = val;
          this.init();
      },
      selectMem(obj){
          this.$store.state.contract.busBaseInfo.channelManagerId = obj.mem.userId;
          this.$store.state.contract.busBaseInfo.channelManagerName = obj.mem.userName;
      },
      focus(e){
          this.selectMemShow = true;
          e.target.blur();
      },
      searchInfo(){
          this.inpageNum = 1
          this.filter.pageNum = 1
          this.filter.key = this.search;
          this.init();
      },
      preView(data){
        this.id = data.row.contractId;
         this.$api.viewBusContract(data.row.contractId).then(obj=>{
             this.preSources= obj.data.data;
             this.coverPre = true;
         })
      },
      skipInfo(){
         window.sessionStorage['contractBusInfo']= JSON.stringify({
              id : this.id,
              tab : 0
          })
          this.$router.push({name : 'contractBusInfo'});
      },
      rowClick(item){
        window.sessionStorage['contractBusInfo']= JSON.stringify({
              id : item.contractId,
              tab : 0
          })
          this.$router.push({name : 'contractBusInfo'});
      },
      clear(arr){
          let filter =  Object.assign({},this.filter);
          arr.forEach(v => {
              this.time[v] = [];
              if(v == 'signDate'){
                  filter.signDateEnd = '';
                  filter.signDateStart = '';
              }
              if(v == 'createDate'){
                  filter.createDateStart = '';
                  filter.createDateEnd = '';
              }
          });
          filter.pageNum = 1;
          this.inpageNum = 1
          this.filter = Object.assign({},filter);
          this.init();
      },
      filterTime(){
          let filter =  Object.assign({},this.filter);
          if(this.timeCopy.signDate){
            filter.signDateStart = this.timeCopy.signDate[0];
            filter.signDateEnd = this.timeCopy.signDate[1];
          }else{
             filter.signDateStart  = '';
             filter.signDateEnd  = '';  
          }
          if(this.timeCopy.createDate){
            filter.createDateStart = this.timeCopy.createDate[0];
            filter.createDateEnd = this.timeCopy.createDate[1];
          }else{
              filter.createDateStart = '';
              filter.createDateEnd = '';
          }
          this.inpageNum = 1
          filter.pageNum = 1;
          this.time = Object.assign({},this.timeCopy);
          this.filter = Object.assign({},filter);
          this.dialogVisible = false;
          this.init();
      },
      init(obj){
          this.$api.busContractList(obj || this.filter).then(obj=>{
            this.allInfo = obj.data.data;
            this.list = obj.data.data.list;
            this.visible = true;
            // this.filter.pageSize = this.allInfo.pageSize;
            // this.filter.pageNum = this.allInfo.pageNum;
                
        })
      },
      exportData(){
        let filter = Object.assign({},this.filter);
        for ( var key in filter) {
            if (filter.hasOwnProperty(key) && (filter[key] == null || filter[key] == undefined || filter[key] == '')) {
                delete filter[key];
            }
        }
        this.$store.dispatch("downFile",{type : 'get', url :`/admin/contract/business/export`, data: filter, fileName : '合同列表.xls'});
      }
    },
    created(){
        this.$store.dispatch('getOrgTreeInfo');
        this.$store.dispatch('getOrgTreeExtInfo');
        this.$store.dispatch('getAllCompanyList'); //获取所有公司
        this.$store.state.contract.busBaseInfo = Object.assign({},this.$store.state.contract.busBaseInfoCopy); //重新设置form的值
        this.$store.state.contract.filterClassId = '';
        this.init();
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.content{
    height: calc(100% - 60px);
}

.font{
    color: #63717F;
    font-size: 12px;
}
.blue{
    color: #3C73B1;
}

.pointer{
    cursor: pointer;
}
.iconfont{
    color: #63717F ; opacity: 1;
} 
.icon-yulan{
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
                white-space: nowrap;
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
 .upload{
    width:474px;
    height:110px;
    border-radius:5px;
    margin: 0 auto;
    text-align: center;
    background: #fbfdff;
    border: 1px dotted $gray_f1;
    .iconfont{
        display: inline-block;
        font-size: 32px;
        margin-top: 20px;
    }
    button{
        display: block;
        width:70px;
        height:20px;
        border-radius:2px;
        background: #fbfdff;
        border: 1px solid #9b9fa6;
        font-size:12px;
        color:#9b9fa6;
        line-height:20px;
        margin-left: 15px;
    }
    .left0{
        margin-left: 0;
        margin-top: 20px;
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
