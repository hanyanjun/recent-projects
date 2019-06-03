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
                <div class="row">
                    <el-form-item label="合同名称" size="medium" prop="contractName">
                        <previewInfo :visible="pre" :info="baseInfo.contractName"></previewInfo> 
                        <el-input  v-model.trim="baseInfo.contractName" v-show="!pre" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item :inline="true" label="合同编号" size="medium" prop="contractNum">
                        <previewInfo :visible="pre" :info="baseInfo.contractNum"></previewInfo> 
                        <el-input  v-model.trim="baseInfo.contractNum" v-show="!pre" placeholder="请输入"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="甲方 " size="medium" prop="partyA">
                    <previewInfo :visible="pre" :info="companyList.obj[baseInfo.partyA]"></previewInfo> 
                    <!-- <el-input  v-model="baseInfo.partyA" v-show="!pre" placeholder="请输入"></el-input> -->
                    <el-select v-model="baseInfo.partyA"   v-show="!pre"  placeholder="请选择">
                        <el-option  v-for="(item,index) in companyList.list" :key="index" :value="item.id" :label="item.companyName">
                         </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="乙方 " size="medium" prop="partyB">
                    <previewInfo :visible="pre" :info="baseInfo.partyB"></previewInfo> 
                    <el-input  v-model.trim="baseInfo.partyB" v-show="!pre" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="渠道部门" size="medium" prop="channelDeptId">
                    <previewInfo :visible="pre" :info="treeMem.obj[baseInfo.channelDeptId[baseInfo.channelDeptId.length - 1]]"></previewInfo> 
                    <!-- <div class="selectInput">
                        <el-input  @focus="focus1"  v-model="treeMem.obj[baseInfo.channelDeptId]" v-show="!pre" placeholder="请选择"></el-input>
                        <selectMem :visible.sync="selectMemShow1" :treeData="treeMem.list" @select="selectMem1"></selectMem>
                    </div> -->
                    <el-cascader
                                :options="orgTreeExtInfo"
                                v-model="baseInfo.channelDeptId"
                                 v-show="!pre"
                                :props="{value : 'id' , label : 'text'}"></el-cascader>
                </el-form-item>
                <el-form-item label="渠道经理" size="medium" prop="channelManagerId">
                    <previewInfo :visible="pre" :info="baseInfo.channelManagerName"></previewInfo> 
                    <!-- <div class="selectInput">
                        <el-input  @focus="focus2"   v-model="baseInfo.channelManagerName" v-show="!pre" placeholder="请选择"></el-input>
                        <selectMem :visible.sync="selectMemShow2" :treeData="treeMem.list" @select="selectMem2"></selectMem>
                    </div> -->
                    <el-select v-model="baseInfo.channelManagerName"  placeholder="请选择"  v-show="!pre">
                              <template slot-scope="scope">
                                  <selectMem  :treeData="treeMem.list" @select="selectMem" :clear="baseInfo.channelManagerName"></selectMem>
                                  <el-option  v-for="(item,index) in [0]" :key="index" :value="item.id">
                                  </el-option>
                              </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="生效日期" size="medium" prop="effectiveDate">
                    <previewInfo :visible="pre" :info="baseInfo.effectiveDate"></previewInfo> 
                      <el-date-picker
                        v-model="baseInfo.effectiveDate"
                        type="date"
                        v-show="!pre" 
                        value-format="yyyy-MM-dd"
                        @change="effectiveDate">
                      </el-date-picker>
                </el-form-item>
                <el-form-item label="终止日期" size="medium" prop="endDate">
                    <previewInfo :visible="pre" :info="baseInfo.endDate"></previewInfo> 
                     <el-date-picker
                        v-model="baseInfo.endDate"
                        type="date"
                        v-show="!pre" 
                        value-format="yyyy-MM-dd"
                        @change="endDate">
                      </el-date-picker>
                </el-form-item>
                <el-form-item label="归档分类" size="medium" prop="contractSortId">
                    <previewInfo :visible="pre" :info="conTreeData.obj[baseInfo.contractSortId]"></previewInfo> 
                    <el-select v-show="!pre" v-model="baseInfo.contractSortId" placeholder="请选择归档分类">
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
                <el-form-item label="结算币种" size="medium" prop="billingCurrency">
                    <previewInfo :visible="pre" :info="settlement_type.obj[baseInfo.billingCurrency]"></previewInfo>
                    <el-select  v-show="!pre" v-model="baseInfo.billingCurrency" placeholder="请选择">
                        <el-option
                        v-for="item in settlement_type.list"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收到材料" size="medium" prop="effectiveDate">
                    <previewInfo :visible="pre" :info="gainInfo()"></previewInfo>
                    <el-checkbox-group v-show="!pre" v-model="baseInfo.receivedMaterial">
                        <template v-for="item in entrymaterials.list">
                           <el-checkbox :label="item.code" name="receivedMaterial" :key="item.code">{{item.name}}</el-checkbox>
                       </template>
                    </el-checkbox-group>
                </el-form-item>
                <div class="btns" v-show="!pre"> 
                    <span class="submit pointer"  @click.stop="submit('form')" >保存</span>
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
                    <busTab0></busTab0>
                </el-tab-pane>
                <el-tab-pane label="签署信息">
                    <busTab1></busTab1>
                </el-tab-pane>
                <!-- <el-tab-pane label="联系信息">
                    <busTab2></busTab2>
                </el-tab-pane> -->
                <el-tab-pane label="收款信息">
                    <busTab3></busTab3>
                </el-tab-pane>
                <el-tab-pane label="机构授权">
                    <busTab4></busTab4>
                </el-tab-pane>
            </el-tabs>
        </div>
        </div>

            <!-- :visible.sync="pre" -->
        <previewCover 
            :title="preSources.coverName"
            :num="preSources.contractNum"
            :columns="preColums"
            :visible.sync="preTable"
            :isPrint="false"
            :isDetail="false"
            :sources="preSources"></previewCover>
    </div>
</template>

<script>
import previewInfo from "../../components/previewInfo"
import selectMem from "../../components/selectMem"
import utils from "../../components/treeTable/utils/index.js"
import previewCover from "@/components/previewCover"
import busTab0 from "./busTab0"
import busTab1 from "./busTab1"
import busTab2 from "./busTab2"
import busTab3 from "./busTab3"
import busTab4 from "./busTab4"
import editBtn from "./editBtn"
export default {
   name :'companyInfo',
   data(){return{
       preSources : {},
       name2 : '',
       type : 'preview',
       preTable : false
   }},
   components : {previewInfo,editBtn,selectMem,busTab0,busTab1,busTab2,busTab4,busTab3,previewCover},
   created(){
      this.$store.dispatch('getOrgTreeInfo'); //获取所有公司列表
      if(!window.sessionStorage['contractBusInfo']){
          console.log('页面出错');
      }else{
        this.$store.state.contract.params = JSON.parse(window.sessionStorage['contractBusInfo']);
        this.init();
        // // 获取合同分类树
        this.$store.dispatch('getContractTreeData','B');
      }
      
   },
  computed:{
      rules(){
          return this.$store.state.contract.busBaseRules;
      },
      params(){
          return this.$store.state.contract.params || 0;
      },
      preColums(){
        return this.$store.state.contract.busPreColums;
      },
      conTreeData(){
          return this.$store.state.selectData.contractTreeData;
      },
      orgTreeExtInfo(){
           return this.$store.state.selectData.orgTreeExtInfo;
      },
      companyList(){
          return this.$store.state.selectData.allCompanyList;
      },
      baseInfo(){
          return this.$store.state.contract.busBaseInfo;
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
      preCover(){
        this.$api.viewBusContract(this.params.id).then(obj=>{
            this.preSources= obj.data.data;
            this.preTable = true;
        })
      },
      init(){
        this.$store.dispatch('getBusContractInfo',{upTab0 : true}).then(id=>{
            this.$store.dispatch('getOrgTreeExtInfo').then(_=>{
                this.$store.dispatch('getAllOrgIdInfoObj',Number(id)).then(obj=>{
                    this.$store.state.contract.busBaseInfo.channelDeptId = obj;

                })
            })
        })
      },
    //   changeEdit(){
    //       if(!this.companyList.obj[this.baseInfo.partyA]){
    //           this.$store.state.contract.busBaseInfo.partyA = '';
    //       }
    //   },
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
      gainInfo(){
          let a = this.baseInfo.receivedMaterial;
          let s = '';
          a.forEach((v,i)=>{
              s = s + this.entrymaterials.obj[v];
              if(i < a.length - 1){
                  s = s + ',';
              }
          })  
          return s;
      },
      selectMem(obj){
          this.$store.state.contract.busBaseInfo.channelManagerId = obj.mem.userId;
          this.$store.state.contract.busBaseInfo.channelManagerName = obj.mem.userName;
      },
      tabClick(e){
          this.storeTab(e.index);
          this.$store.state.contract.params.tab = e.index;
          if(e.index != 0){
            this.$store.dispatch('getBusContractInfo',{tab :e.index});
          }
      },
      storeTab(v){
          let s = JSON.parse(window.sessionStorage['contractBusInfo']);
          s.tab = v;
          window.sessionStorage['contractBusInfo'] = JSON.stringify(s);
      },
      submit(formName){
        this.$refs[formName].validate((valid) => {
                if (valid) {
                    let baseInfo = Object.assign({},this.baseInfo);
                    delete baseInfo.contractBusinessFile;
                    delete baseInfo.contractBusinessPic;
                    baseInfo.channelDeptId = baseInfo.channelDeptId[baseInfo.channelDeptId.length - 1];
                    this.$api.editBusCover(baseInfo).then(obj=>{
                        this.$message({
                            message: '基本信息修改完成',
                            type: 'success'
                        });
                        this.init();
                        this.pre = 'preview';
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
