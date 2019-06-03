<template>
 <div class="syncWrap listWrapNoScroll  companyCommon">
    <el-row class="head">
        <el-col :span="4"><p class="title">同步云考勤 </p></el-col>
    </el-row>
    <div class="formContent dialogForm">
        <el-form   :model="baseInfo"  ref="form" :rules="rules" size="medium" label-width="114px">
            <el-form-item label="邮箱" size="medium"  prop="email">
                <el-input type="textarea" placeholder="请输入邮箱地址，多个邮箱逗号分隔"  :rows="6" v-model="baseInfo.email"></el-input>
            </el-form-item>
            <el-form-item label="考勤设备" size="medium"  prop="sn">
                 <el-select v-model="baseInfo.sn" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.deviceNo"
                    :label="item.deviceRemark"
                    :value="item.deviceNo">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="submit">   
            <el-button
            @click.stop="submit"
            size="medium"
            type="primary"
            :style="{width : '150px', height : '44px',marginBottom : '20px' }"
            >提交</el-button>
        </div>



    </div>




 </div>
</template>

<script>
export default {
    data(){return{
        baseInfo : {
            email : '',
            sn : '',
        },
        options : [],
        rules : {
            email : [
                { required: true, message: '请填写内容', trigger: 'change' },
            ],
            sn : [
                { required: true, message: '请填写内容', trigger: 'change' },
            ]
        }
    }},
    created(){
        this.$api.getAvailableDevice().then(obj=>{
            this.options = obj.data.data;
        })
    },
    methods:{
        submit(){
            this.$refs['form'].validate(valide=>{
                if(valide){
                    let base = Object.assign({},this.baseInfo);
                    this.$api.newEmployee(base).then(obj=>{
                        this.$message.success('同步成功!');
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.syncWrap{
  background: rgba(249, 249, 249, 1);
  border: 1px solid #dcdfe6;
  .head {
    height: 60px;
    padding-right: 12px;
  border-bottom: 1px solid #dcdfe6;
    .title {
      width: 96px;
      font-size: 16px;
      color: $gray_a2;
      margin-left: 26px;
      font-weight: bold;
      line-height: 60px;
    }
  }
  .formContent{
      padding: 50px;
      .el-form-item{
          width: 500px;
          display: block;
          margin-right: 150px;
      }
    background: white;
    height: calc(100% - 60px);
  }
    .submit{
        text-align: center;
        position: absolute;
        width: 100%;
        bottom: 40px;
    }
}



</style>
