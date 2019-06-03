<template lang="pug">
#seeRoleList
  div.listWrapNoScroll.companyCommon.companyList
    div.topTitlediv
      div.tableTitleRight 查看人员
      div.tableTitleLeft
        i.backIcon(class="iconfont icon-fanhui pointer", @click="backIconClick")
    div.tableContent
      el-table.tableContentScroll(:data='tableList', height='200')
        el-table-column(label='序号',type='index', width='80')
        el-table-column(v-for='(column, key) in colums',:min-width='column.width', :sortable="column.pro  == 'userId1' || column.pro  ==  'testScore1' ", :prop='column.pro', :label='column.label', :key='column.pro')
          template(slot-scope='scope')
            | {{scope.row[column.pro] || '---'}}
      //- 分页
      el-pagination(@size-change='SizeChange', @current-change='CurrentChange',background, :page-sizes='[10, 20, 30, 40]', :page-size='20', layout='total, sizes, prev, pager, next, jumper', :total='totlePage')
    
</template>
<script>

import "../../commons/publicCss/outside.sass"
export default {
  name: '',
  data () {
    return {
      tableList: [],
      colums:[
        {
          pro : 'deptName',
          label : '部门名称'
        },
        {
          pro : 'employeeNo',
          label : '工号'
        },
        {
          pro : 'name',
          label : '姓名'
        },
        {
          pro : 'email',
          label : '邮箱',
        },
        {
          pro : 'roleNames',
          label : '角色名称',
        }
      ],
      listParam: {
        pageNum:1,
        pageSize:20,
        roleId: '',
      },
      totlePage: 0,
     
    }
  },
  watch: {
  },
  created () {
    this.listParam.roleId = sessionStorage.getItem('roleId')
    // 1.加载table列表
    this.getScoreAnalysisList()
  },
  methods: {
    // load列表
    getScoreAnalysisList(){
      this.$api.roleEmpList(this.listParam).then(res => {
        this.tableList = res.data.data.list
        this.totlePage = res.data.data.total
      })
    },
    // 分页
    SizeChange (val) {
      this.listParam.pageSize = val
      this.getScoreAnalysisList()
    },
    CurrentChange (val) {
      this.listParam.pageNum = val
      this.getScoreAnalysisList()
    },
    // 返回按钮
    backIconClick () {
      this.$router.push({name:'roleList'})
    }
  }
}
</script>
<style lang="sass"  scoped>
#seeRoleList
  .topTitlediv
   height: 31px
  .listWrapNoScroll
    background: #ffffff !important
    border: 1px solid #DCDFE6 !important
</style>
