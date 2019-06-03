<template>
    <div class="companyInfo companyCommon">
        <h6 class="title">
            <span>{{baseInfo.companyName}}</span>
             <i class="iconfont icon-fanhui pointer" @click.stop="back"></i>
        </h6>
        <div class="content">
        <!-- 基础信息 -->
        <div class="baseTitleInfo formInline">
            <el-form ref="form" :rules="rules" size="medium" :model="baseInfo" label-width="114px">
                <el-form-item label="公司名称" size="medium" prop="companyName">
                    <previewInfo :visible="pre" :info="baseInfo.companyName"></previewInfo> 
                    <el-input  v-model.trim="baseInfo.companyName" v-show="!pre" placeholder="请输入公司名称"></el-input>
                </el-form-item>
                <el-form-item label="英文名" size="medium" prop="companyEname">
                    <previewInfo :visible="pre" :info="baseInfo.companyEname"></previewInfo> 
                    <el-input  class="w400" v-model.trim="baseInfo.companyEname" v-show="!pre" placeholder="请输入英文名"></el-input>
                </el-form-item>
                <el-form-item label="企业资料编码" size="medium"  prop="companyDataCode">
                    <previewInfo :visible="pre" :info="baseInfo.companyDataCode"></previewInfo> 
                    <el-input  class="w400" v-model.trim="baseInfo.companyDataCode" v-show="!pre" placeholder="请输入企业资料编码"></el-input>
                </el-form-item>
                <el-form-item label="注册地" size="medium"  prop="registrationAddress"> 
                    <previewInfo :visible="pre" :info="baseInfo.registrationAddress"></previewInfo> 
                    <el-input  class="w400" v-model.trim="baseInfo.registrationAddress" v-show="!pre" placeholder="请输入注册地"></el-input>
                </el-form-item>
                <el-form-item label="注册时间" size="medium"  prop="registrationTime">
                    <previewInfo :visible="pre" :info="baseInfo.registrationTime"></previewInfo> 
                      <el-date-picker
                        v-model="baseInfo.registrationTime"
                        type="date"
                        class="w400"
                        value-format="yyyy-MM-dd"
                        v-show="!pre" >
                      </el-date-picker>
                </el-form-item>
                <el-form-item label="法人" size="medium"  prop="legalPerson">
                    <previewInfo :visible="pre" :info="baseInfo.legalPerson"></previewInfo> 
                    <el-input  class="w400" v-model.trim="baseInfo.legalPerson" v-show="!pre" placeholder="请输入法人"></el-input>
                </el-form-item>
                <el-form-item label="是否有与其他单位订立合约"  prop="isUnitsContract" >
                  <previewInfo :visible="pre" :info="isTrue.obj[baseInfo.isUnitsContract]"></previewInfo> 
                  <el-radio v-model="baseInfo.isUnitsContract" v-show="!pre" label="Y">是</el-radio>
                  <el-radio v-model="baseInfo.isUnitsContract" v-show="!pre" label="N">否</el-radio>
                </el-form-item>
                <el-form-item label="公司开设负责人" size="medium"  prop="companyPrincipal">
                    <previewInfo :visible="pre" :info="baseInfo.companyPrincipal"></previewInfo> 
                    <el-input  class="w400" v-model.trim="baseInfo.companyPrincipal" v-show="!pre" placeholder="请输入公司开设负责人"></el-input>
                </el-form-item>
                <el-form-item label="合同编号前缀" size="medium"  prop="contractNumPrefix">
                    <previewInfo :visible="pre" :info="baseInfo.contractNumPrefix"></previewInfo> 
                    <el-input  class="w400" v-model.trim="baseInfo.contractNumPrefix" v-show="!pre" placeholder="请输入合同编号规则前缀"></el-input>
                </el-form-item>
                <div class="btns" v-show="!pre">
                    <span class="submit pointer" @click="submit('form')" >保存</span>
                    <!-- <span class="cancle pointer">取消</span> -->
                </div>
            </el-form>
            <editBtn :isPre.sync="pre">

            </editBtn> 
        </div>
        <!-- 其他的公司信息 -->
        <div class="otherInfo">
                <el-tabs type="border-card" :value="params.tab" @tab-click="tabClick">
                <el-tab-pane label="基本信息">
                    <baseInfo></baseInfo>
                </el-tab-pane>
                <el-tab-pane label="财务信息">
                    <financeInfo></financeInfo>
                </el-tab-pane>
                <el-tab-pane label="年检信息">
                    <annInspInfo></annInspInfo>
                </el-tab-pane>
            </el-tabs>
        </div>

        </div>
    </div>
</template>

<script>
import baseInfo from "./baseInfo"
import financeInfo from "./financeInfo"
import annInspInfo from "./annInspInfo"
import previewInfo from "../../components/previewInfo"
import editBtn from "./editBtn"
export default {
   name :'companyInfo',
   data(){return{
       type : 'preview'
   }},
   components : {baseInfo,financeInfo,annInspInfo,previewInfo,editBtn},
   created(){
      //   获取路由参数
      Object.assign(this.params,this.$route.params);
    //   重置机构信息折叠控制
      this.$store.state.company.annInPreList = [];
       if(!window.sessionStorage['companyInfo']){
          console.log('页面出错');
      }else{
        this.$store.state.company.params =   JSON.parse(window.sessionStorage['companyInfo']);
        this.$store.dispatch('getCompanyInfo',{upTab0 : true});
      }
   },
   mounted(){

        this.$refs['form'].resetFields();  //初始化弹窗
   },
  computed:{
      rules(){
          return this.$store.state.company.baseInfoRules;
      },
      params(){
          return this.$store.state.company.params || 0;
      },
      baseInfo(){
          return this.$store.state.company.baseInfo;
      },
        isTrue(){
            return this.$store.state.selectData.trueFlase;
        },
      pre:{
          get : function(){
              return this.type == 'preview';
          },
          set : function(newValue){
                this.type = newValue ? 'preview' : 'edit';
          }
      }
  },
   methods:{
      submit(formName){
        this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$api.companyEditCore(this.baseInfo).then(obj=>{
                         this.$message({
                            message: '信息修改成功',
                            type: 'success'
                        });
                        this.$store.dispatch('getCompanyInfo',{upTab0 : true});
                        this.type = 'preview';
                    })
                }
        })
      },
      storeTab(v){
          let s = JSON.parse(window.sessionStorage['companyInfo']);
          s.tab = v;
          window.sessionStorage['companyInfo'] = JSON.stringify(s);
      },
      tabClick(e){
          this.storeTab(e.index);
          this.$store.state.company.params.tab = e.index;
          this.$store.dispatch('getCompanyInfo',{tab :e.index});
      },
      back(){
        this.$router.routeBack('',1);
      }
   }

}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
@import "./common.scss";
.companyInfo{
    box-sizing: border-box;
    .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 56px;
        span{
            font-size:16px;
            font-weight: bold;
            color:rgba(51,51,51,1);
            line-height:56px;
        }
        i{
            font-size: 26px;
            color: $gray_b;
        }
    }
    .content{
        height: calc(100% - 56px);
        overflow: hidden;
    }
    .baseTitleInfo{
        padding: 35px 50px 47px;
        background: white;
        box-shadow:0px 0px 5px 0px rgba(221,221,221,1);
        position: relative;
        .el-input{
            width: 500px;
        }
        .el-form-item{
            width: 614px;
            margin-right: 150px;
        }
    }
    .otherInfo{
        background: white;
        margin-top: 23px;
        box-shadow:0px 0px 5px 0px rgba(221,221,221,1);
        .el-tabs--border-card{
            box-shadow: none;
            height: 100%;
          .el-tabs__header{
            box-shadow: none;
          }
        }
    }
}
</style>
