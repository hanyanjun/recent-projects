<template lang="pug">
div
  // transition(name="el-zoom-in-left")
  div.employeeDiv()
  div
    el-tabs(type="border-card", style="box-shadow: initial",@tab-click='')
      el-tab-pane(label="在职员工")
      el-tab-pane(label="离职员工")
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
    console.log('离职员工')
  },
  methods: {
    // this.$message.success('成功')
  }
}
</script>
<style lang="sass"  scoped>
  .employeeHead
    padding: 10px 0
    font-size: 20px
    font-weight: bold
</style>
