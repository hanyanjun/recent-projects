<template lang="pug">
#todo
  //- 如果applyState = 3，列表中有退回 撤销按钮，要从父级传过来，以及row信息
  el-form-item.dialog-footer.waitButton
    el-button(@click="todoRow",size='medium',type='primary') 催办
    el-button(@click="revokeRow",size='medium', type='danger',plain) 撤销
  //- 确认撤销
  el-dialog(title='确认撤销', :visible.sync='revokeFormShow', style='margin:0 auto', :close-on-click-modal='false',width="570px")
    el-form.elForm(:model='revokeParam',ref='revokeParam',:rules='revokeRules',label-width="90px",size='medium')  
      el-form-item(label='原因',prop='cancelReason')
        el-input.width360.cancelReason(v-model.trim='revokeParam.cancelReason',type='textarea', placeholder='请输入')
    .dialog-footer(slot='footer')
      el-button(type='primary', @click="submitForm('revokeParam',revokeFormsubmit)",size='medium') 确 定
      el-button(@click="termFilterFormReset('revokeParam')",size='medium') 取 消
</template>
<script>

export default {
  name: 'todo',
  data () {
    return {
      todoBtn: true,
      // 原因弹出框
      revokeFormShow: false,
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
  // 参数
  props:{
    row : {
      type: Object,
      default: false
    },

  },
  created () {
    console.log(this.row.processInstanceId)
  },
  methods: {
    // 催办
    todoRow(){
      this.$api.sendUrgent({processInstanceId:this.row.processInstanceId,templateName:this.row.templateName}).then(res => {
        this.$message.success(res.data.messages)
        // 刷新返回列表
        this.$emit('backManage')
        // this.getList()
      })
    },
    // 撤销
    revokeRow(){
     this.revokeFormShow = true
     this.revokeParam.processInstanceId =  this.row.processInstanceId
     this.revokeParam.relationFormCode =  this.row.relationFormCode
    },
    // 撤销确认
    revokeFormsubmit(){
      this.$api.processCancel(this.revokeParam).then(res => {
        this.$message.success(res.data.messages)
        this.$emit('backManage')
        // this.getList()
        this.revokeFormShow = false
      })
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
<style lang="sass"  scoped>
</style>
