<template>
 <div class="contractPayDetail formInline">
     <el-form ref="form"  size="medium" :rules="rules" :model="baseInfo" label-width="114px">
        <el-form-item label="银行卡号" size="medium" prop="bankCardNo">
            <previewInfo :visible="pre" :info="baseInfo.bankCardNo"></previewInfo> 
            <el-input  v-model.trim="baseInfo.bankCardNo" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="银行名称" size="medium" prop="bankName">
            <previewInfo :visible="pre" :info="baseInfo.bankName"></previewInfo> 
            <el-input  v-model.trim="baseInfo.bankName" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="银行归属地 " size="medium" prop="bankCardAttribution">
            <previewInfo :visible="pre" :info="baseInfo.bankCardAttribution"></previewInfo> 
            <el-input  v-model.trim="baseInfo.bankCardAttribution" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="swift code" size="medium" prop="swiftCode">
            <previewInfo :visible="pre" :info="baseInfo.swiftCode"></previewInfo> 
            <el-input  v-model.trim="baseInfo.swiftCode" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="持卡人身份证" size="medium" prop="cardholderNum">
            <previewInfo :visible="pre" :info="baseInfo.cardholderNum"></previewInfo> 
            <el-input  v-model.trim="baseInfo.cardholderNum" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="持卡人拼音" size="medium" prop="cardholderChNamePy">
            <previewInfo :visible="pre" :info="baseInfo.cardholderChNamePy"></previewInfo> 
            <el-input  v-model.trim="baseInfo.cardholderChNamePy" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="持卡人姓名" size="medium" prop="cardholderChName">
            <previewInfo :visible="pre" :info="baseInfo.cardholderChName"></previewInfo> 
            <el-input  v-model.trim="baseInfo.cardholderChName" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
     </el-form>
     <div class="btns" v-show="!pre">
         <span class="submit pointer" @click.stop="submit('form')">提交</span>
         <!-- <span class="cancle pointer">取消</span> -->
     </div> 
     <editBtn :isPre.sync="pre">

     </editBtn> 

 </div>   
</template>

<script>
import validate from "../../util/validate.js"
import previewInfo from "../../components/previewInfo"
import editBtn from "./editBtn"
export default {
  name : "busTab3",
  components:{previewInfo,editBtn},
  data(){return {
      type : "preview",
      rules : {
            cardholderChNamePy : [
                { validator: validate.validateEn, trigger: 'blur' }
            ]
      }
  }},
  computed:{
      baseInfo(){
          return this.$store.state.contract.receiptInfo;
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
  created(){

  },
  methods:{
      submit(formName){
        this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$api.receiptEditBusInfoG(this.baseInfo).then(obj=>{
                        this.$message({
                            message: '收款信息修改成功',
                            type: 'success'
                        });
                        this.pre = 'preview';
                        this.$store.dispatch('getBusContractInfo',{tab :2});
                    })
                }
        })
      },
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
@import "./common.scss";
.contractPayDetail{
    padding: 28px  0 28px 50px;
    .el-input, .el-select{
       width: 500px;
    }
    .el-form-item{
       width: 614px;
       padding-right: 30px;
       // display: inline-block;
       margin-right: 80px;
    }
}
</style>
