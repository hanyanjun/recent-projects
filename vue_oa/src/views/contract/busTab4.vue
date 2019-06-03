<template>
 <div class="contractPayDetail formInline">
     <el-form ref="form"  :rules="rules" size="medium" :model="baseInfo" label-width="114px">
        <el-form-item label="委托人姓名" size="medium" prop="principalName">
            <previewInfo :visible="pre" :info="baseInfo.principalName"></previewInfo> 
            <el-input  v-model.trim="baseInfo.principalName" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="职位" size="medium" prop="position">
            <previewInfo :visible="pre" :info="baseInfo.position"></previewInfo> 
            <el-input  v-model.trim="baseInfo.position" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="收款账号 " size="medium" prop="receiptAccount">
            <previewInfo :visible="pre" :info="baseInfo.receiptAccount"></previewInfo> 
            <el-input  v-model.trim="baseInfo.receiptAccount" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="开户行" size="medium" prop="openBank">
            <previewInfo :visible="pre" :info="baseInfo.openBank"></previewInfo> 
            <el-input  v-model.trim="baseInfo.openBank" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" size="medium" prop="idCard">
            <previewInfo :visible="pre" :info="baseInfo.idCard"></previewInfo> 
            <el-input  v-model.trim="baseInfo.idCard" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机" size="medium" prop="mobile">
            <previewInfo :visible="pre" :info="baseInfo.mobile"></previewInfo> 
            <el-input  v-model.trim="baseInfo.mobile" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="住址" size="medium" prop="address">
            <previewInfo :visible="pre" :info="baseInfo.address"></previewInfo> 
            <el-input  type="textarea" :row="2" v-model.trim="baseInfo.address" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="法定代表人" size="medium" prop="legalRepresentative">
            <previewInfo :visible="pre" :info="baseInfo.legalRepresentative"></previewInfo> 
            <el-input  v-model.trim="baseInfo.legalRepresentative" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="委托单位" size="medium" prop="entrustUnit">
            <previewInfo :visible="pre" :info="baseInfo.entrustUnit"></previewInfo> 
            <el-input  v-model.trim="baseInfo.entrustUnit" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="签署日期" size="medium" prop="sginDate">
            <previewInfo :visible="pre" :info="baseInfo.sginDate"></previewInfo> 
            <el-date-picker
                  v-model="baseInfo.sginDate"
                  type="date"
                  v-show="!pre"
                  value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="授权协议附件资料" size="medium" prop="cardholderChName">
            <previewInfo :visible="pre" :info="baseInfo.cardholderChName"></previewInfo> 
            <el-input  v-model="baseInfo.cardholderChName" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item> -->
     </el-form>
     <div class="content">
            <span class="type type1">补充协议</span>
            <div class="conUp">
                <span class="empty"> {{list.length == 0 && pre ? '未上传' : ''}}</span>
                <uploadImg :list.sync="list" :isPre="pre" canvasType="auth" :size="2">



            </uploadImg>
            </div>
     </div>
     <div class="btns" v-show="!pre">
         <span class="submit pointer" @click.stop="submit('form')">提交</span>
         <!-- <span class="cancle pointer">取消</span> -->
     </div> 
     <editBtn :isPre.sync="pre">

     </editBtn> 

 </div>   
</template>

<script>
import uploadImg from "./uploadImg.vue";
import previewInfo from "../../components/previewInfo"
import editBtn from "./editBtn"
import validate from "../../util/validate.js"
export default {
  name : "busTab4",
  components:{previewInfo,editBtn,uploadImg},
  data(){return {
      type : "preview",
      list : [],
      rules : {
            receiptAccount : [
                { validator: validate.validateNum, trigger: 'blur' }
            ],
            mobile: [
                { validator: validate.validateNum, trigger: 'blur' }
            ]

      }
  }},
  computed:{
      baseInfo(){
          this.list = this.$store.state.contract.authInfo.contractAuthData || []; 
          return this.$store.state.contract.authInfo;
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
                    let base = Object.assign({},this.baseInfo);
                    base.contractAuthData = this.list;
                    this.$api.receiptEditBusInfo(this.baseInfo).then(obj=>{
                        this.$message({
                            message: '机构授权信息修改成功',
                            type: 'success'
                        });
                        this.pre = "preview";
                        this.$store.dispatch('getBusContractInfo',{tab :3});
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

@import "./common.scss";
.content{
     position: relative;
     margin: 25px 0 ;
     .type{
        display: inline-block;
        width: 114px;
        line-height: 14px;
        font-size:14px;
        padding: 0 10px ;
        box-sizing: border-box;
        color:#606266;
     }
     .type1{
        position: absolute;
        left: 0;
        top: 0;

     }
    .con{
        width:610px;
        height:144px;
        background:#fbfdff;
        border-radius:5px;
        border: 1px solid $gray_f1;
        text-align: center;
        display: inline-block;
        vertical-align: top;
    }
    .conUp{
        display: inline-block;
        vertical-align: top;
        padding-left: 114px;
    }
    .empty{
        color: #CCCCCC;
        font-size: 14px;
    }
}
</style>
