<template>
 <div class="contractPayDetail formInline">
     <el-form ref="form"  :rules="rules" size="medium" :model="baseInfo" label-width="114px">
        <el-form-item label="付款币种" size="medium" prop="paymentCurrency">
            <previewInfo :visible="pre" :info="settlement_type.obj[baseInfo.paymentCurrency]"></previewInfo>   
             <el-select  v-show="!pre" v-model="baseInfo.paymentCurrency" placeholder="请选择">
                        <el-option
                        v-for="item in settlement_type.list"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select> 
        </el-form-item>
        <el-form-item label="银行卡号" size="medium" prop="cardNo">
            <previewInfo :visible="pre" :info="baseInfo.cardNo"></previewInfo> 
            <el-input  v-model.trim="baseInfo.cardNo" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="银行名称" size="medium" prop="bandName">
            <previewInfo :visible="pre" :info="baseInfo.bandName"></previewInfo> 
            <el-input  v-model.trim="baseInfo.bandName" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="银行归属地 " size="medium" prop="bandHome">
            <previewInfo :visible="pre" :info="baseInfo.bandHome"></previewInfo> 
            <el-input  v-model.trim="baseInfo.bandHome" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="持卡人身份证" size="medium" prop="cardOwnerNo">
            <previewInfo :visible="pre" :info="baseInfo.cardOwnerNo"></previewInfo> 
            <el-input  v-model.trim="baseInfo.cardOwnerNo" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="swift code" size="medium" prop="swiftCode">
            <previewInfo :visible="pre" :info="baseInfo.swiftCode"></previewInfo> 
            <el-input  v-model.trim="baseInfo.swiftCode" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="持卡人姓名" size="medium" prop="cardOwnerName">
            <previewInfo :visible="pre" :info="baseInfo.cardOwnerName"></previewInfo> 
            <el-input  v-model.trim="baseInfo.cardOwnerName" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="收款人拼音" size="medium" prop="cardOwnerSpell">
            <previewInfo :visible="pre" :info="baseInfo.cardOwnerSpell"></previewInfo> 
            <el-input  v-model.trim="baseInfo.cardOwnerSpell" v-show="!pre" placeholder="请输入"></el-input>
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
import previewInfo from "../../components/previewInfo"
import editBtn from "./editBtn"
import validate from "../../util/validate.js"
export default {
  name : "contractPayDetail",
  components:{previewInfo,editBtn},
  data(){return {
      type : "preview",
      rules : {
            cardNo : [
                { validator: validate.validateNum, trigger: 'blur' }
            ],
            cardOwnerSpell : [
                { validator: validate.validateEn, trigger: 'blur' }
            ],
      }
  }},
  computed:{
      baseInfo(){
          return this.$store.state.contract.payInfo;
      },
      pre:{
         get : function(){
            return this.type == 'preview';
         },
         set : function(newValue){
                this.type = newValue ? 'preview' : 'edit';
         }
      },
      settlement_type(){
          return this.$store.state.selectData.settlement_type; 
      }
  },
  created(){

  },
  methods:{
      submit(formName){
        this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$api.getConAdminPaymentEdit(this.baseInfo).then(obj=>{
                        this.$message({
                            message: '付款信息修改成功',
                            type: 'success'
                        });
                        this.pre = 'preview';
                        this.$store.dispatch('getContractInfo',{tab :2});
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
