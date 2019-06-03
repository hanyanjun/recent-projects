<template>
<div class="annInspInfo companyCommon">
    <el-collapse  @change="handleChange">
        <template v-for="(item,index) in annInspInfo">
            <el-collapse-item :name="index + 1" :key="index">
                <template slot="title">
                  <div class="card_title">
                      {{item.annualInspectionInfo}}
                  </div>
                </template>
                <div class="formContent formInline">    
                <el-form :ref="`form${index}`" size="medium" :model="item" label-width="114px">
                    <el-form-item label="网上公示" size="medium" >
                        <previewInfo :visible="item.editStatus == 'N' || isPreList[index] == 'Y'" :info="item.onlinePublicity"></previewInfo>
                        <el-input   v-show="item.editStatus == 'Y' &&  isPreList[index] == 'N'" v-model.trim="item.onlinePublicity" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="汇算清缴" size="medium" >
                        <previewInfo :visible="item.editStatus == 'N' || isPreList[index] == 'Y'" :info="item.settlementPayment"></previewInfo>
                        <el-input  v-show="item.editStatus == 'Y'  &&  isPreList[index] == 'N'" v-model.trim="item.settlementPayment" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="联合年检" size="medium" >
                        <previewInfo :visible="item.editStatus == 'N' || isPreList[index] == 'Y'" :info="item.jointAnnualInspection"></previewInfo>
                        <el-input  v-show="item.editStatus == 'Y'  &&  isPreList[index] == 'N'" v-model.trim="item.jointAnnualInspection" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="FDI外汇年检" size="medium" >
                        <previewInfo :visible="item.editStatus == 'N' || isPreList[index] == 'Y'" :info="item.fdiFeAnnualInspection"></previewInfo>
                        <el-input   v-show="item.editStatus == 'Y'  &&  isPreList[index] == 'N'" v-model.trim="item.fdiFeAnnualInspection" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="是否完成报税" size="medium" >
                        <previewInfo :visible="item.editStatus == 'N' || isPreList[index] == 'Y'"  :info="isTrue.obj[item.annualReport]"></previewInfo>
                        <el-radio v-show="item.editStatus == 'Y'  &&  isPreList[index] == 'N'" v-model="item.annualReport" label="Y">是</el-radio>
                        <el-radio v-show="item.editStatus == 'Y'  &&  isPreList[index] == 'N'" v-model="item.annualReport" label="N">否</el-radio>
                    </el-form-item>
                    <el-form-item label="年检是否完成" size="medium" >
                        <previewInfo :visible="item.editStatus == 'N' || isPreList[index] == 'Y'" :info="isTrue.obj[item.isAnnualInspectionOver]"></previewInfo>
                        <el-radio  v-show="item.editStatus == 'Y'  &&  isPreList[index] == 'N'" v-model="item.isAnnualInspectionOver" label="Y">是</el-radio>
                        <el-radio v-show="item.editStatus == 'Y'  && isPreList[index] == 'N'" v-model="item.isAnnualInspectionOver" label="N">否</el-radio>
                    </el-form-item>
                    <div class="btns" v-show="isPreList[index] == 'N'" >
                        <span class="submit pointer" @click="submit(`form${index}`,item,index)" >保存</span>
                    </div>
                </el-form>
                    <div class="editBtn" v-show="isPreList[index] == 'Y'">
                        <editBtn @change="change(index,'N')" :isPre='true'>

                        </editBtn> 
                    </div>
                </div>
            </el-collapse-item>
        </template>            
    </el-collapse>
</div>   
</template>

<script>
import previewInfo from "../../components/previewInfo"
import editBtn from "./editBtn"
export default {
    name : 'electronicSign',
    data(){return{
        type : 'preview'
    }},
    computed:{
        pre:{
            get : function(){
                return this.type == 'preview';
            },
            set : function(newValue){
                    this.type = newValue ? 'preview' : 'edit';
            }
        },
        annInspInfo(){
            return this.$store.state.company.annInspInfo;
        },
        isTrue(){
            return this.$store.state.selectData.trueFlase;
        },
        params(){
            return this.$store.state.company.params;
        },
        isPreList(){
            return this.$store.state.company.annInPreList;
        }
    },
   components : {previewInfo,editBtn},
    methods:{
        submit(formName,item,index){
            item.companyId = this.params.id;
            //  this.$refs[formName].validate((valid) => {
                // if (valid) {
                    this.$api.companyEditannInsp(item).then(obj=>{
                         this.$message({
                            message: '信息修改成功',
                            type: 'success'
                        });
                        this.type = 'preview';
                        this.change(index,'Y');
                        this.$store.dispatch('getCompanyInfo',{tab :2});
                    })
                // }
        //  })
        },
        change(index,value){
            let arr = Object.assign([],this.$store.state.company.annInPreList);
            arr[index] = value;
            this.$store.state.company.annInPreList = [...arr];
        },
        
        handleChange(val) {
            console.log(val);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
@import "./common.scss";
.el-input{
    width: 500px;
}
.el-form-item{
     display: inline-block;
     width: 614px;
     margin-right: 150px;
}
.annInspInfo{
    .card_title{
        background: #f5f7fa;
        font-size:14px;
        width: 100%;
        padding-left: 20px;
        color:rgba(143,147,153,1);
    }
    .el-collapse-item{
        border-top: 1px solid #dcdfe6;
        border-left: 1px solid #dcdfe6;
        border-right: 1px solid #dcdfe6;
    }
    .el-collapse-item:nth-last-of-type(1){
        border-bottom: 1px solid #dcdfe6;
    }
    .formContent{
        padding: 30px 27px;
    }
    .el-collapse-item__arrow{
        margin: 0;
    }
}
.editBtn{
    position: absolute;
    right: 0px;
    top: 30px;
    white-space: nowrap;
}
</style>
