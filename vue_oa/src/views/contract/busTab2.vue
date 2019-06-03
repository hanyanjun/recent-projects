<template>
 <div class="contractPayDetail formInline">
     <el-form ref="form"  size="medium" :model="baseInfo" label-width="114px">
        <el-form-item label="甲方地址 " size="medium" prop="partyAAddress">
            <previewInfo :visible="pre" :info="baseInfo.partyAAddress"></previewInfo> 
            <el-input  v-model="baseInfo.partyAAddress" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="甲方联系方式" size="medium" prop="partyAContact">
            <previewInfo :visible="pre" :info="baseInfo.partyAContact"></previewInfo> 
            <el-input  v-model="baseInfo.partyAContact" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="甲方收件人" size="medium" prop="partyAAcceptPerson">
            <previewInfo :visible="pre" :info="baseInfo.partyAAcceptPerson"></previewInfo> 
            <el-input  v-model="baseInfo.partyAAcceptPerson" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <template v-for="(item,index) in baseInfo.details">
            <el-form-item label="乙方地址" size="medium" prop="partyBAddress" :key="`${index}-partyBAddress`">
                <previewInfo :visible="pre" :info="item.partyBAddress"></previewInfo> 
                <el-input  v-model="item.partyBAddress" v-show="!pre" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="乙方联系方式" size="medium" prop="partyBContact" :key="`${index}-partyBContact`">
                <previewInfo :visible="pre" :info="item.partyBContact"></previewInfo> 
                <el-input  v-model="item.partyBContact" v-show="!pre" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="乙方收件人" size="medium" prop="partyBAcceptPerson" :key="`${index}-partyBAcceptPerson`">
                <previewInfo :visible="pre" :info="item.partyBAcceptPerson"></previewInfo> 
                <el-input  v-model="item.partyBAcceptPerson" v-show="!pre" placeholder="请输入"></el-input>
            </el-form-item>
        </template>
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
export default {
  name : "busTab2",
  components:{previewInfo,editBtn},
  data(){return {
      type : "edit"
  }},
  computed:{
      baseInfo(){
          return this.$store.state.contract.busSignInfo;
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
                    this.$api.signEditBusInfo(this.baseInfo).then(obj=>{
                        this.$message({
                            message: '付款信息修改成功',
                            type: 'success'
                        });
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
}
</style>
