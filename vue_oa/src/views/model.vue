<template lang="pug">
#wrapperAllData
</template>
<script>
import core from '@/api/core'
import util from '../../util'
export default {
  name: '',
  data () {
    return {
    }
  },
  created () {
    // 获取个人信息/admin/employee/getAllDatas
    core.getAllDatas().then((res) => {
      util.codeConfirm(res.data,this)
      if(res.data.code === '200'){
      }
    }).catch(util.errorHandle)
  },
  methods: {
    // this.$message.success('成功')
    // 提交校验格式
    submitForm (formName, callBack) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          return callBack()
        } else {
          console.log('格式 error')
          setTimeout(() => {this.loading = false}, 1000)
          return false
        }
      })
    },
    addResetForm(formName) {
      this.addNewPowerDivShow = false
      this.$refs[formName].resetFields()
      
      this.$confirm("此操作将删除此权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
      })
    }
  }
}
</script>
<style lang="sass"  scoped>
</style>
