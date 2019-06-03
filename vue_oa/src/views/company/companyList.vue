<template>
<div class="companyList companyCommon listWrapNoScroll">
    <el-row class="head">
        <el-col :span="12"><p class="title">公司管理列表</p></el-col>
        <el-col :span="12">
            <div class="search">
                <span class="search_input"><search  v-model="search" holder="请输入公司名称" @search="searchCompany"></search> 
                    <!-- <el-input placeholder="请输入公司名称" v-model="search" ref="input"></el-input>
                    <el-button icon="el-icon-search" size="small" @click.stop="searchCompany"></el-button> -->
                </span>
                <button class="add pointer" @click.stop="addCompany">新增</button>
            </div>
        </el-col>
    </el-row>
    <div class="content">
        <!-- <el-row> -->
            <el-table :data="list" height="200" class="tableContentScroll">
                <el-table-column
                    label="序号"
                    type="index"
                    width="60">
                </el-table-column>
                <el-table-column v-for="(column, key) in colums" :label="column.label"  :key="column.pro" >
                    <template slot-scope="scope">
                        <template v-if="column.pro == 'companyName'">
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
                        <el-switch
                        active-value="是"
                        inactive-value="否"
                        v-model="scope.row.status"
                        active-color="#6DD8AF"
                        @change="changeStatus(scope)"
                        inactive-color="#C3CBD6">
                        </el-switch>
                    </template>
                 </el-table-column>
                 <empty slot="empty" :visible="visible"></empty>
            </el-table>
        <!-- </el-row> -->
        <!-- <el-row> -->
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
        <!-- </el-row> -->
    </div>
    <div class="dialog"> 
        <el-dialog :visible.sync="addShow"  :center="true">
            <h6 class="title">新增公司 <i class="el-icon-close" @click.stop="addShow = false"></i></h6>
            <el-form ref="form" :rules="rules" class="dialogForm" size="medium" :model="addInfo" label-width="110px">
                <el-form-item label="公司名称" size="medium" prop="companyName">
                    <el-input  class="w400" v-model.trim="addInfo.companyName" placeholder="请输入公司名称"></el-input>
                </el-form-item>
                <el-form-item label="英文名" size="medium" prop="companyEname">
                    <el-input  class="w400" v-model.trim="addInfo.companyEname" placeholder="请输入英文名"></el-input>
                </el-form-item>
                <el-form-item label="企业资料编码" size="medium"  prop="companyDataCode">
                    <el-input  class="w400" v-model.trim="addInfo.companyDataCode" placeholder="请输入企业资料编码"></el-input>
                </el-form-item>
                <el-form-item label="注册地" size="medium"  prop="registrationAddress"> 
                    <el-input  class="w400" v-model.trim="addInfo.registrationAddress" placeholder="请输入注册地"></el-input>
                </el-form-item>
                <el-form-item label="注册时间" size="medium"  prop="registrationTime">
                      <el-date-picker
                        v-model="addInfo.registrationTime"
                        type="date"
                        class="w400"
                        value-format="yyyy-MM-dd">
                      </el-date-picker>
                </el-form-item>
                <el-form-item label="法人" size="medium"  prop="legalPerson">
                    <el-input  class="w400" v-model.trim="addInfo.legalPerson" placeholder="请输入法人"></el-input>
                </el-form-item>
                <el-form-item label="是否有与其他单位订立合约"  prop="isUnitsContract" >
                  <el-radio-group v-model="addInfo.isUnitsContract">
                    <el-radio  label="Y">是</el-radio>
                    <el-radio  label="N">否</el-radio>
                  </el-radio-group>
                    <!-- <el-input  class="w400" v-model="addInfo.isUnitsContract" placeholder="请输入"></el-input> -->
                </el-form-item>
                <el-form-item label="公司开设负责人" size="medium"  prop="companyPrincipal">
                    <el-input  class="w400" v-model.trim="addInfo.companyPrincipal" placeholder="请输入公司开设负责人"></el-input>
                </el-form-item>
                <el-form-item label="合同编号前缀" size="medium"  prop="contractNumPrefix">
                    <el-input  class="w400" v-model.trim="addInfo.contractNumPrefix" placeholder="请输入合同编号规则前缀"></el-input>
                </el-form-item>
            </el-form>
            <div class="btns">
                <button class="submit pointer" @click.stop="submit('form')">提交</button><button class="cancle pointer" @click.stop="addShow = false">取消</button>
            </div>
        </el-dialog>
    </div>
</div>
</template>

<script>
import search from "@/components/search"
import pagination from "../../components/pagination"
import empty from "@/components/empty";
export default {
  name : 'companyList',
  data(){return{
    search : '', //搜索内容
    inpageNum:1,
    addInfo : {
        companyName : '', //公司名称  必填 1-50
        companyEname : '', //英文名
        companyDataCode : '', //企业资料编码  必填 1-50
        registrationAddress : '', //注册地  必填 1-50
        registrationTime : '',//注册时间  必填
        legalPerson : '',//法人
        isUnitsContract : '', //是否有与其他单位订立合约（Y / N）
        companyPrincipal : '',//	公司开设负责人
        contractNumPrefix : ''    //	合同编号规则前缀
    },
    addShow : false,
    list : [],
    visible :false,
    allInfo : { total : 10, pages : '', pageSize : 20 ,  pageNum : 1 , list :[]},
    filter : {pageSize : 20 , pageNum : 1 , companyName : ''}
  }},
  created(){
      this.init();
    //   this.scrollH = window
  },
  components : {search,pagination,empty},
  computed:{
      colums(){
          return this.$store.state.company.colums;
      },
      rules(){
          return this.$store.state.company.baseInfoRules;
      }
  },
  watch : {
    search : function(v){
        if(v == ''){
            this.filter.companyName = '';
            this.init();
        }
    }
  },
  methods:{
      init(){
        this.$api.companyList(this.filter).then(obj=>{
            this.allInfo = obj.data.data;
            this.list = obj.data.data.list;
            this.filter.pageSize = this.allInfo.pageSize;
            this.filter.pageNum = this.allInfo.pageNum;
            this.visible = true;
        });
      },
      addCompany(){
          this.addShow = true;
          this.$nextTick(()=>{    
            this.$refs['form'].resetFields();  //初始化弹窗
          })
      },
      changeStatus(item,$event){
          let status = item.row.status == '是' ?  'Y' : 'N';
          this.$api.companyStatus({companyId : item.row.companyId , status : status}).then(obj=>{
              this.$message({
                  message : '修改状态成功',
                  type : 'success'
              })
          }).catch(()=>{
              item.row.switch = !item.row.switch;
          })
      },
      rowClick(item,$event){
          if(!$event || $event.target.className != 'el-switch__core'){
                window.sessionStorage['companyInfo']= JSON.stringify({
              id : item.companyId,
              tab : 0
          })
          this.$router.push({name : 'companyInfo'});
          }
      },
      initAddInfo(){
          let obj = {companyName : '', //公司名称  必填 1-50
                    companyEname : '', //英文名
                    companyDataCode : '', //企业资料编码  必填 1-50
                    registrationAddress : '', //注册地  必填 1-50
                    registrationTime : '',//注册时间  必填
                    legalPerson : '',//法人
                    isUnitsContract : '', //是否有与其他单位订立合约（Y / N）
                    companyPrincipal : '',//	公司开设负责人
                    contractNumPrefix : ''    //	合同编号规则前缀
          }
          Object.assign(this.addInfo,obj);
      },
      submit(formName){
        this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$api.companyAdd(this.addInfo).then(obj=>{
                         this.$confirm('公司添加成功', '添加成功', {
                            confirmButtonText: '完善公司信息',
                            cancelButtonText: '继续添加公司'
                        }).then(() => {
                            let data = obj.data.data;
                            this.rowClick(data);
                        }).catch(() => {
                            this.initAddInfo();
                            this.addShow = true;
                            this.$nextTick(()=>{    
                                this.$refs['form'].resetFields();  //初始化弹窗
                            })
                        });
                        this.addShow = false;
                        this.init();
                    })
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
      searchCompany(){
        this.inpageNum = 1
        this.filter.pageNum = 1
        this.filter.companyName = this.search;
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
.blue{
    color: #3C73B1;
}
.search_input{
    width: 300px;
    height: 30px;
}
</style>
