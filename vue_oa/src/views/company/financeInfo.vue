<template>
<div class="baseInfo companyCommon">
    <div class="formInline">
        <el-form ref="form"  size="medium" :model="financeInfo" label-width="114px">
            <el-form-item label="网银信息" size="medium" >
                <previewInfo :visible="pre" :info="financeInfo.onlineBankInfo"></previewInfo> 
                <el-input  v-show="!pre"   v-model.trim="financeInfo.onlineBankInfo" placeholder="请输入网银信息"></el-input>
            </el-form-item>
            <el-form-item label="税种核定" size="medium" >
                <previewInfo :visible="pre" :info="financeInfo.taxApproval"></previewInfo> 
                <el-input   v-show="!pre"  v-model.trim="financeInfo.taxApproval" placeholder="请输入税种核定"></el-input>
            </el-form-item>
            <el-form-item label="是否有业务发生" size="medium" >
                <previewInfo :visible="pre" :info="isTrue.obj[financeInfo.isBusHappen]"></previewInfo> 
                <el-radio v-show="!pre"  v-model="financeInfo.isBusHappen" label="Y">是</el-radio>
                <el-radio v-show="!pre"  v-model="financeInfo.isBusHappen" label="N">否</el-radio>
            </el-form-item>
            <el-form-item label="税种" size="medium" >
                <previewInfo :visible="pre" :info="tax_type.obj[financeInfo.taxType]"></previewInfo> 
                <el-select v-show="!pre" v-model="financeInfo.taxType"  placeholder="请选择税种">
                            <el-option
                            v-for="item in tax_type.list"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                            </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="税务专管员" size="medium" >
                <previewInfo :visible="pre" :info="financeInfo.taxCommissioner"></previewInfo> 
                <el-input    v-show="!pre" v-model.trim="financeInfo.taxCommissioner" placeholder="请输入税务专管员"></el-input>
            </el-form-item>
            <el-form-item label="专管员地址" size="medium" >
                <previewInfo :visible="pre" :info="financeInfo.commissionerAddress"></previewInfo> 
                <el-input   v-show="!pre"  v-model.trim="financeInfo.commissionerAddress" placeholder="请输入专管员地址"></el-input>
            </el-form-item>
            <el-form-item label="专管员联系方式" size="medium">
                <previewInfo :visible="pre" :info="financeInfo.commissionerContact"></previewInfo> 
                <el-input   v-show="!pre"  v-model.trim="financeInfo.commissionerContact" placeholder="请输入专管员联系方式"></el-input>
            </el-form-item>
            <div class="btns" v-show="!pre">
                <span class="submit pointer" @click="submit('form')" >保存</span>
                <!-- <span class="cancle pointer">取消</span> -->
            </div>
        </el-form>
    </div>
    
            <editBtn :isPre.sync="pre">

            </editBtn> 
</div>   
</template>

<script>
import previewInfo from "../../components/previewInfo"
import editBtn from "./editBtn"
import validate from "../../util/validate.js"
export default {
    data(){return{
        type : 'preview',
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
        financeInfo(){
            return this.$store.state.company.financeInfo;
        },
        isTrue(){
            return this.$store.state.selectData.trueFlase;
        },
        tax_type(){
            return this.$store.state.selectData.tax_type;
        }
    },
    components : {previewInfo,editBtn},
    methods:{
        submit(formName){
             this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$api.companyEditFinance(this.financeInfo).then(obj=>{
                         this.$message({
                            message: '信息修改成功',
                            type: 'success'
                        });
                        this.type = 'preview';
                        this.$store.dispatch('getCompanyInfo',{tab :1});
                    })
                }
        })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
@import "./common.scss";
.baseInfo{
    position: relative;
    padding: 32px 40px 25px 40px;
}
.el-select{
    width: 500px;
}
.el-form-item{
     width: 614px;
     margin-right: 150px;
}
</style>
