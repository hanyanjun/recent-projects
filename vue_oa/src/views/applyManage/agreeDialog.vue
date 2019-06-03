<template lang="pug">
#agreeDialog
  el-dialog(:title='title', :visible.sync='visibleDialogShow', style='margin:0 auto', :close-on-click-modal='false',width="570px")
    el-form.elForm(:model='revokeParam',ref='revokeParam',v-if='visibleDialogShow',:rules='revokeRules',label-width="80px",size='medium')  
      el-form-item(v-if='title=="同意申请"?true:false',label='原因')
        el-input.width360.cancelReason(v-model.trim='revokeParam.cancelReason',type='textarea', placeholder='0-100字符')
      el-form-item(v-else,label='原因',prop='cancelReason')
        el-input.width360.cancelReason(v-model.trim='revokeParam.cancelReason',type='textarea', placeholder='1-100字符',maxLength = '100')
    .dialog-footer(slot='footer')
      el-button(v-if='title=="同意申请"?true:false',type='primary', @click="revokeFormsubmit",size='medium') 确 定
      el-button(v-else,type='primary', @click="submitForm('revokeParam',revokeFormsubmit)",size='medium') 确 定
      el-button(@click="termFilterFormReset",size='medium') 取 消 
</template>
<script>
import "../../commons/publicCss/outside.sass"
export default {
  name:'agreeDialog',
  data(){
    return{
      // 流程-处理审批（同意/不同意/退回）参数
      title: '',
      visibleDialogShow: false,
      revokeParam:{
        cancelReason: ''
      },
      revokeRules:{
        cancelReason:[
          {required:true,message: '请填写原因', trigger: 'blur'}
        ]
      },
    }
  },
  props:{
    agreeDialogShow: {
      type: Boolean,
      default: false
    },
    handleOpinionCode:{
      type: String,
      default: ''
    },
    checkData:{
      type: Array,
      default(){
        return []
      }

    }
  },
  watch:{
    handleOpinionCode(val){
      switch(val){
        case '0':
          this.title = '同意申请'
        break;
        case '1':
          this.title = '不同意申请'
        break;
        case '2':
          this.title = '退回给申请人'
        break;
      }
    },
    agreeDialogShow(val){
      if(val){
        this.visibleDialogShow = true
      }
    },
    visibleDialogShow(val){
      if(!val){
        if (this.$refs['revokeParam'] !== undefined) {
          this.$refs['revokeParam'].resetFields()
        }
        this.revokeParam.cancelReason = ''
        this.$emit('agreeDialogCancel')
      }
    }
    
  },
  methods: {
    // 同意弹出框
    revokeFormsubmit(){
      let obj = {}
      obj.batchList = this.checkData
      obj.handleOpinionCode = this.handleOpinionCode
      obj.handleOpinionDesc = this.revokeParam.cancelReason
      this.$api.agreebatch(obj).then(res =>{
        this.$message.success(res.data.messages)
        this.visibleDialogShow = false
        // 重新刷新列表
        this.$emit('agreeDialogCancel','list')
      })
    },
    // 取消按钮
    termFilterFormReset(){
      this.visibleDialogShow = false
    },
    // 提交校验格式
    submitForm (formName, callBack) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          return callBack()
        } else {
          console.log('格式 error')
          return false
        }
      })
    },
  }
}
</script>
<style lang='sass' scoped>
</style>


