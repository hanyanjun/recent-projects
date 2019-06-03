<template lang="pug">
#leavingNumPage
  //- div.leavingNumDiv
  //-   div.employeeHead(style="margin: 2px 0px 10px") 调岗&晋升统计
  //-   div.tableTitle
  //-       el-row(:gutter='20')
  //-         el-col(:span='16')
  //-           div.date-picker(style='line-height: 32px') 查询时间：
  //-           el-date-picker(v-model='transferNumDatePicker',@change='transferNumChange', type='daterange', align='right', unlink-panels='',value-format="yyyy-MM-dd", range-separator='至', start-placeholder='开始日期', end-placeholder='结束日期')
  //-         el-col(:span='8')
  //-           el-row.tableButton(:gutter='20')
  //-             el-col(:span='18')
  //-               el-input.input-with-select(v-model='transferSearchInput',placeholder='请输入姓名或工号', size='mini')
  //-                 el-button(slot='append', icon='el-icon-search',@click="transferSearchClick")
  //-             el-col(:span='4')
  //-               <el-button @click.stop="exportExcel('EXCHANGE_JOB')">导出</el-button>
  div.employeeHead 调岗&晋升统计
  i.backIcon(class="iconfont icon-fanhui pointer", @click="backIconClick")
  div.listWrapNoScroll.companyCommon.companyList.idBorder
    div.topTitlediv
      div.tableTitleRight
        div.date-picker(style='line-height: 32px') 查询时间
        el-date-picker(v-model='transferNumDatePicker',:clearable='false',@change='transferNumChange', type='daterange', align='right', unlink-panels='',value-format="yyyy-MM-dd", range-separator='至', start-placeholder='开始日期', end-placeholder='结束日期')
      div.tableTitleLeft
        el-input.inputSearch.width290(placeholder='请输入姓名或工号',size='small',maxlength="20", v-model='transferSearchInput'  v-on:keyup.native.enter='transferSearchClick')
        i.el-icon-search(@click='transferSearchClick')
        el-button.addBtn(size='small',@click.stop="exportExcel('EXCHANGE_JOB')")  导出
        //- 测试提交
      div(style="clear:both")
    div.tableContent
      el-table.tableContentScroll(:data='transferNumTable', height='200')
        el-table-column(label='序号', type="index")
        el-table-column(v-for='(column, key) in colums',:width='column.width', :sortable="column.pro  == 'conNo' || column.pro  ==  'signDate' || column.pro  == 'ourSignBody' ||  column.pro  =='counterPart'", :prop='column.pro', :label='column.label', :key='column.pro')
          template(slot-scope='scope')
            | {{scope.row[column.pro] || '---'}}
        el-table-column(label='操作', width="80px")
          template(slot-scope='scope')
            el-tooltip.rowHandle(effect='dark', content='编辑',popper-class="tips", placement='bottom')
              i.iconfont.icon-bianji(@click='handleEdit(scope.row,"in")')
        //- el-table.entryNumTable.tableContentScroll(:data='transferNumTable', border, style='width: 100%',height='200')
          el-table-column(label='序号', type="index")
          el-table-column(label='姓名', prop="name")
          el-table-column(label='工号', prop="empNo")
          el-table-column(label='员工类型', prop="empType")
          el-table-column(label='手机号', prop="mobile")
          el-table-column(label='入职日期', prop="entryDate")
          el-table-column(label='部门', prop="deptName")
          el-table-column(label='新部门', prop="newDeptName")
          el-table-column(label='新工作', prop="newJob")
          el-table-column(label='新汇报对象', prop="newRepObjName")
          el-table-column(label='旧部门', prop="oldDeptName")
          el-table-column(label='旧工作', prop="oldJob")
          el-table-column(label='旧汇报对象', prop="oldRepObjName")
          el-table-column(label='调岗日期', prop="transferDate")
          el-table-column(label='操作', width="80px")
            template(slot-scope='scope')
              el-button(size="small", type="success", plain, @click='handleEdit(scope.row,"in")') 编辑
        empty(slot='empty',:visible='visible')
      //- 分页
      pagination(:total="transferNumPage",@size-change="transferNumSizeChange",@current-change="transferNumCurrentChange",
                    :sizes="[10, 20, 30, 40]",
                    :size="20",
                    :current.sync="inpageNum",
                    layout="total, sizes, prev, pager, next, jumper",
                    background)
</template>
<script>
import '../../commons/publicCss/outside.sass'
import pagination from "../../components/pagination"
import empty from '@/components/empty'
export default {
  name: '',
  components:{pagination,empty},
  data () {
    return {
      DateValue:[],
      // 5.transfer人数
      transferNumTable: [],
      colums:[
        {
          pro : 'name',
          label : '姓名',
        },
        {
          pro : 'empNo',
          label : '工号',
        },{
          pro : 'empType',
          label : '员工类型',
        },
        {
          pro : 'mobile',
          label : '手机号',
        },
        {
          pro : 'entryDate',
          label : '入职日期',
        },{
          pro : 'deptName',
          label : '部门',
        },
        {
          pro : 'newDeptName',
          label : '新部门',
        },{
          pro : 'newJob',
          label : '新工作',
        },{
          pro : 'newRepObjName',
          label : '新汇报对象',
        },{
          pro : 'oldDeptName',
          label : '旧部门',
        },
        {
          pro : 'oldJob',
          label : '旧工作',
        },{
          pro : 'oldRepObjName',
          label : '旧汇报对象',
        },
        {
          pro : 'transferDate',
          label : '调岗日期',
        }
      ],
      transferNumDivShow: false,
      transferNumDatePicker: [],
      transferSearchInput: '',
      transferpageNum:'1',
      transferpageSize:'20',
      transferNumPage: 1,
      inpageNum: 1,
      exportToExcel:'',
      visible: false
    }
  },
  created () {
    this.$util.getNowDate(this.DateValue)
    this.transferNumDatePicker[0] = this.DateValue[0]
    this.transferNumDatePicker[1] = this.DateValue[1]
    this.gettransferNumTable()
  },
  methods: {
    // 获取table
    gettransferNumTable () {
      // 获取table
      this.$api.transferEmpStatistics({
        beginDate:this.transferNumDatePicker[0],
        endDate:this.transferNumDatePicker[1],
        searchPara:this.transferSearchInput,
        definedPage:{pageNum:this.transferpageNum,
        pageSize:this.transferpageSize}
      }).then((res) => {
        this.transferNumTable = res.data.data.list
        this.transferNumPage = res.data.data.total
        if(this.transferNumTable.length == 0){
          this.visible = true
        }
      })
    },
    // 日期选择器变化
    transferNumChange () {
      this.transferpageNum = 1
      this.inpageNum = 1
      this.gettransferNumTable()
    },
    transferSearchClick () {
      this.transferpageNum = 1
      this.inpageNum = 1
      this.gettransferNumTable()
    },
    // birth人数统计-分页
    transferNumSizeChange (val) {
      this.transferpageSize = val.value
      if(val.isLoad){
        this.gettransferNumTable()
      }
    },
    transferNumCurrentChange (val) {
      this.transferpageNum = val
      this.gettransferNumTable()
    },
    // 编辑
    handleEdit(row,valueShow) {
      // sessionStorage.setItem('editUserId',row.userId)
      // sessionStorage.setItem('editValueShow',valueShow)
      // this.$router.push({name: 'editInfo'})

      localStorage.setItem('editUserId',row.userId)
      localStorage.setItem('editValueShow',valueShow)
      const {href} = this.$router.resolve({
        name: 'editInfo',
      })
      window.open(href, '_blank')
    },
    // 导出
    exportExcel () {
      this.exportToExcel = {
        beginDate : this.transferNumDatePicker[0],
        endDate : this.transferNumDatePicker[1],
        searchPara : this.transferSearchInput,
        type : 'EXCHANGE_JOB'
      }
      // 下载文件
      this.$store.dispatch('downFile',{url : '/admin/empLeaving/employeeExportToExcel', data : this.exportToExcel ,  fileName :'调岗&晋升统计员工列表.xls'})
    },
    // 返回按钮
    backIconClick () {
      this.$router.push({name:'employeeList'})
    }
  }
}
</script>
<style lang="sass"  scoped>
#leavingNumPage .listWrapNoScroll
  height: calc(100vh - 142px)
.idBorder
  background: #f9f9f9 !important
  border: 1px solid #DCDFE6 !important
  clear: both
.backIcon
  float: right
  display: block
  font-size: 26px
  color: #666
  cursor: pointer
  margin-top: -8px
.employeeHead
  padding: 0 4px 9px
  font-size: 16px
  font-weight: bold
  float: left
.date-picker
  float: left
  height: 30px
  padding-right: 20px
  font-weight: normal
  font-size: 14px
.tableButton .el-col
  .el-button
    height: 30px
    line-height: 6px
  .el-input input
    height: 30px
    line-height: 6px
.el-table td, .el-table th
  padding: 3px
  text-align: center
.el-range-editor.el-input__inner
  padding: 0px 10px
  height: 30px
</style>
