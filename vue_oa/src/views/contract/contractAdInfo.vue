<template>
    <div class="contractAdInfo companyCommon">
        <h6 class="title">
            <span>合同详情</span>
             <i class="iconfont icon-fanhui pointer" @click.stop="back"></i>
        </h6>
        <div class="infoContent">

        <!-- 基础信息 -->
        <div class="baseTitleInfo formInline">
            <el-form ref="form" :rules="rules" size="medium" :model="baseInfo" label-width="114px">
                <el-form-item label="合同名称" size="medium" prop="conName">
                    <previewInfo :visible="pre" :info="baseInfo.conName"></previewInfo> 
                    <el-input  v-model.trim="baseInfo.conName" v-show="!pre" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item  label="合同编号" size="medium" prop="conNo">
                    <previewInfo :visible="pre" :info="baseInfo.conNo"></previewInfo> 
                    <el-input  v-model.trim="baseInfo.conNo" v-show="!pre" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item  :class="pre ? 'block' : ''" label="合同内容" size="medium" prop="conContent">
                    <previewInfo :visible="pre" :info="baseInfo.conContent"></previewInfo> 
                    <el-input  type="textarea" :rows="2" v-model.trim="baseInfo.conContent" v-show="!pre" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="归档分类" size="medium" prop="className">
                    <previewInfo :visible="pre" :info="baseInfo.className"></previewInfo> 
                    <el-select v-show="!pre" v-model="baseInfo.className" @change="changeId" placeholder="请选择归档分类">
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
                <el-form-item label="申请人" size="medium" prop="applicantName">
                    <previewInfo :visible="pre" :info="baseInfo.applicantName"></previewInfo> 
                    <!-- <div class="selectInput">  
                        <el-input  @focus="focus"   v-model="baseInfo.applicantName" v-show="!pre" placeholder="请选择"></el-input>
                        <selectMem :visible.sync="selectMemShow" :treeData="treeMem.list" @select="selectMem"></selectMem>
                    </div> -->
                    <el-select v-model="baseInfo.applicantName" v-show="!pre"  placeholder="请选择">
                       <template slot-scope="scope">
                           <selectMem  :treeData="treeMem.list" @select="selectMem" :clear="baseInfo.applicantName"></selectMem>
                           <el-option  v-for="(item,index) in [0]" :key="index" :value="item.id">
                           </el-option>
                       </template>
                     </el-select>
                </el-form-item>
                <el-form-item label="起始日期" size="medium" prop="beginDate">
                    <previewInfo :visible="pre" :info="baseInfo.beginDate"></previewInfo>  
                    <el-date-picker
                        v-model="baseInfo.beginDate"
                        type="date"
                        v-show="!pre" 
                        @change="beginDate"
                        value-format="yyyy-MM-dd">
                      </el-date-picker>
                </el-form-item>
                <el-form-item label="提案部门" size="medium" prop="motionDepart">
                    <previewInfo :visible="pre" :info="treeMem.obj[baseInfo.motionDepart[baseInfo.motionDepart.length - 1]]"></previewInfo> 
                    <!-- <el-input  @focus="focus"   v-model="treeMem.obj[baseInfo.motionDepart]" v-show="!pre" placeholder="请选择"></el-input> -->
                    <el-cascader
                                :options="orgTreeExtInfo"
                                v-show="!pre"
                                v-model="baseInfo.motionDepart"
                                :props="{value : 'id' , label : 'text'}"></el-cascader>
                </el-form-item>
                <el-form-item label="签约份数" size="medium" prop="signCopies">
                    <previewInfo :visible="pre" :info="baseInfo.signCopies"></previewInfo> 
                    <el-input  v-model.trim="baseInfo.signCopies" v-show="!pre" placeholder="请输入"></el-input>
                    <!-- <el-select  v-show="!pre" v-model="baseInfo.signCopies" placeholder="请选择"> -->
                    <!-- </el-select> -->
                </el-form-item>
                <el-form-item label="签发日期" size="medium" prop="signDate">
                    <previewInfo :visible="pre" :info="baseInfo.signDate"></previewInfo> 
                      <el-date-picker
                        v-model="baseInfo.signDate"
                        type="date"
                        v-show="!pre" 
                        @change="signDate"
                        value-format="yyyy-MM-dd">
                      </el-date-picker>
                </el-form-item>
                <el-form-item label="归档份数" size="medium" prop="fileSum">
                    <previewInfo :visible="pre" :info="baseInfo.fileSum"></previewInfo> 
                    <el-input  v-model.trim="baseInfo.fileSum" v-show="!pre" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="终止日期" size="medium" prop="endDate">
                    <previewInfo :visible="pre" :info="baseInfo.endDate"></previewInfo> 
                     <el-date-picker
                        v-model="baseInfo.endDate"
                        type="date"
                        v-show="!pre" 
                        @change="endDate"
                        value-format="yyyy-MM-dd">
                      </el-date-picker>
                </el-form-item>
                <el-form-item label="职场" size="medium" prop="workplace">
                    <previewInfo :visible="pre" :info="baseInfo.workplace"></previewInfo> 
                    <el-input  v-model.trim="baseInfo.workplace" v-show="!pre" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="合同金额" size="medium" prop="conSum">
                    <previewInfo :visible="pre" :info="baseInfo.conSum"></previewInfo> 
                    <el-input  v-model.trim="baseInfo.conSum" v-show="!pre" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="结算方式" size="medium" prop="payForm">
                    <previewInfo :visible="pre" :info="settlement_type.obj[baseInfo.payForm]"></previewInfo>
                    <el-select  v-show="!pre" v-model="baseInfo.payForm" placeholder="请选择">
                        <el-option
                        v-for="item in settlement_type.list"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" size="medium" prop="remark">
                    <previewInfo :visible="pre" :info="baseInfo.remark"></previewInfo>
                    <el-input   v-show="!pre" type="textarea" maxlength="100"  v-model.trim="baseInfo.remark"  placeholder="请输入"></el-input>
                </el-form-item>
                <div class="btns" v-show="!pre">
                    <span class="submit pointer" @click.stop="submit('form')" >保存</span>
                    <!-- <span class="cancle pointer">取消</span> -->
                </div>
            </el-form>
            <editBtn :isPre.sync="pre"  @preview="preCover"  :preShow="true">

            </editBtn> 
        </div>
        <!-- 其他的公司信息 -->
        <div class="otherInfo">
            <el-tabs type="border-card" :value="params.tab" @tab-click="tabClick" >
                <el-tab-pane label="合同附件">
                    <contractFile></contractFile>
                </el-tab-pane>
                <el-tab-pane label="签约主体">
                    <contractSignBody ></contractSignBody>
                </el-tab-pane>
                <el-tab-pane label="付款信息">
                    <contractPayDetail></contractPayDetail>
                </el-tab-pane>
            </el-tabs>
        </div>
        </div>
    
        <previewCover 
            :title="companyList.obj[preSources.signBodyDetailResp.ourSignBody] || '无数据'"
            :num="preSources.conNo"
            :visible.sync="preTable"
            :columns="preColums"
            :isPrint="false"
            :isDetail="false"
            :sources="preSources"></previewCover>
    </div>
</template>

<script>
import previewInfo from "../../components/previewInfo"
import selectMem from "../../components/selectMem"
import contractFile from "./contractFile"
import contractSignBody from "./contractSignBody"
import contractPayDetail from "./contractPayDetail"
import utils from "../../components/treeTable/utils/index.js"
import previewCover from "@/components/previewCover"
import editBtn from "./editBtn"
export default {
   name :'companyInfo',
   data(){return{
       selectMemShow : false,
       preSources : {signBodyDetailResp : {ourSignBody : ''}},
       type : 'preview',
       preTable : false
   }},
   components : {previewInfo,editBtn,selectMem,contractFile,contractSignBody,contractPayDetail,previewCover},
   created(){
      this.$store.dispatch('getOrgTreeInfo');
      this.$store.dispatch('getAllCompanyList'); //获取所有公司
      if(!window.sessionStorage['contractInfo']){
          console.log('页面出错');
      }else{
        this.$store.state.contract.params = JSON.parse(window.sessionStorage['contractInfo']);
        // 获取合同分类树
        this.init();
        this.$store.dispatch('getContractTreeData','A');
      }
      
   },
  computed:{
      rules(){
          return this.$store.state.contract.adBaseRules;
      },
      params(){
          return this.$store.state.contract.params || 0;
      },
      preColums(){
          return this.$store.state.contract.adPreColums;
      },
      conTreeData(){
          return this.$store.state.selectData.contractTreeData;
      },
      baseInfo(){
          return this.$store.state.contract.adBaseInfo;
      },
      treeMem(){
          return this.$store.state.selectData.orgTreeBaseInfo;
      },
      settlement_type(){
          return this.$store.state.selectData.settlement_type;
      },
      companyList(){
          return this.$store.state.selectData.allCompanyList;
      },
      orgTreeExtInfo(){
         return this.$store.state.selectData.orgTreeExtInfo;
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
      selectMem(obj){
          this.selectMemShow = false;
          this.$store.state.contract.adBaseInfo.applicantName = obj.mem.userName;
          this.$store.state.contract.adBaseInfo.applicant = obj.mem.userId;
      },
      init(){
        this.$store.dispatch('getContractInfo',{upTab0 : true}).then(id=>{
            this.$store.dispatch('getOrgTreeExtInfo').then(_=>{
                this.$store.dispatch('getAllOrgIdInfoObj',Number(id)).then(obj=>{
                    this.$store.state.contract.adBaseInfo.motionDepart = obj;
                })
            })
        })
      },
      changeId(item){
        if(this.$store.state.contract.adBaseInfo.classId == item){
            this.$message.error('不可选择自己为父级菜单');
            this.$store.state.contract.adBaseInfo.classId = '';
        }else{
            this.$store.state.contract.adBaseInfo.classId = item;
        }
      },
      beginDate(item){
          if(this.baseInfo.endDate && Date.parse(new Date(item)) > Date.parse(new Date(this.baseInfo.endDate))){
              this.$store.state.contract.adBaseInfo.beginDate = '';
              this.$message.error('起始日期不能大于终止日期!');
          }
      },
      signDate(item){
          if(this.baseInfo.endDate && Date.parse(new Date(item)) > Date.parse(new Date(this.baseInfo.endDate))){
              this.$store.state.contract.adBaseInfo.signDate = '';
              this.$message.error('签发日期不能大于终止日期!');
          }
      },
      endDate(item){
        if(this.baseInfo.beginDate && Date.parse(new Date(item)) < Date.parse(new Date(this.baseInfo.beginDate))){
              this.$store.state.contract.adBaseInfo.endDate = '';
              this.$message.error('终止日期不能小于起始日期!');
          }
        if(this.baseInfo.signDate && Date.parse(new Date(item)) < Date.parse(new Date(this.baseInfo.signDate))){
              this.$store.state.contract.adBaseInfo.endDate = '';
              this.$message.error('终止日期不能小于签发日期!');
          }
      },
      preCover(){
          this.$api.getCoverPreviewMsg(this.params.id).then(obj=>{
              let info = Object.assign({},obj.data.data);
             if(!info.signBodyDetailResp){
                 info.signBodyDetailResp = {'ourSignBody' : ''};
             }
             this.preSources = info;
             this.preTable = true;
         })
      },
      focus(e){
          this.selectMemShow = true;
          let target = e.target || e.srcElement;  
          target.blur();
      },
      tabClick(e){
          this.storeTab(e.index);
          this.$store.state.contract.params.tab = e.index;
          if(e.index != 0){
            this.$store.dispatch('getContractInfo',{tab :e.index});
          }
      },
      storeTab(v){
          let s = JSON.parse(window.sessionStorage['contractInfo']);
          s.tab = v;
          window.sessionStorage['contractInfo'] = JSON.stringify(s);
      },
      submit(formName){
        this.$refs[formName].validate((valid) => {
                if (valid) {
                    let baseInfo = Object.assign({},this.baseInfo);
                    delete baseInfo.contractUrl;
                    console.log('提交信息');
                    baseInfo.motionDepart = baseInfo.motionDepart[baseInfo.motionDepart.length - 1];
                    this.$api.adContractBaseEdit(baseInfo).then(obj=>{
                        this.$message({
                            message: '基本信息修改完成',
                            type: 'success'
                        });
                        this.init();
                        this.type = 'preview';
                    })
                }
        })
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
.contractAdInfo{
    height: 100%;
    overflow: hidden;
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
            font-weight: normal;
            color: $gray_b;
        }
    }
    .baseTitleInfo{
        padding: 35px 50px 47px;
        background: white;
        // height: 400px;
        box-shadow:0px 0px 5px 0px rgba(221,221,221,1);
        position: relative;
        .el-input, .el-select{
            width: 500px;
        }
        .el-form-item{
            width: 614px;
            // display: inline-block;
            // margin-right: 100px;
        }
        .block{
            width: 80%;
        }
    }
    .otherInfo{
        // height: 420px;
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
