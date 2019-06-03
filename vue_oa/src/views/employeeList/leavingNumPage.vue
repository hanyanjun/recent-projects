<template lang="pug">
#leavingNumPage
  div.employeeHead 离职员工统计
  i.backIcon(class="iconfont icon-fanhui pointer", @click="backIconClick")
  
  //- div.leavingNumDiv
  //-   div.employeeHead(style="margin: 2px 0px 10px") 离职员工统计
  //-   div.tableTitle
  //-       el-row(:gutter='20')
  //-         el-col(:span='16')
  //-           div.date-picker(style='line-height: 32px') 查询时间：
  //-           el-date-picker(v-model='leavingNumDatePicker',@change='leavingNumChange', type='daterange', align='right', unlink-panels='',value-format="yyyy-MM-dd", range-separator='至', start-placeholder='开始日期', end-placeholder='结束日期')
  //-         el-col(:span='8')
  //-           el-row.tableButton(:gutter='20')
  //-             el-col(:span='18')
  //-               el-input.input-with-select(v-model='leavingSearchInput',placeholder='请输入姓名或工号', size='mini')
  //-                 el-button(slot='append', icon='el-icon-search',@click="leavingSearchClick")
  //-             el-col(:span='4')
  //-               <el-button @click.stop="exportExcel('LEAVING')">导出</el-button>
  div.listWrapNoScroll.companyCommon.companyList.idBorder
    div.topTitlediv
      div.tableTitleRight
        div.date-picker(style='line-height: 32px') 查询时间
        el-date-picker(v-model='leavingNumDatePicker',:clearable='false',@change='leavingNumChange', type='daterange', align='right', unlink-panels='',value-format="yyyy-MM-dd", range-separator='至', start-placeholder='开始日期', end-placeholder='结束日期')
      div.tableTitleLeft
        el-input.inputSearch.width290(placeholder='请输入姓名或工号',size='small',maxlength="20", v-model='leavingSearchInput'  v-on:keyup.native.enter='leavingSearchClick')
        i.el-icon-search(@click='leavingSearchClick')
        el-button.addBtn(size='small',@click.stop="exportExcel('LEAVING')")  导出
        //- 测试提交
      div(style="clear:both")
    div.tableContent
      el-table.tableContentScroll(:data='leavingNumTable', height='200')
        el-table-column(label='序号', type="index")
        el-table-column(v-for='(column, key) in colums',:width='column.width', :sortable="column.pro  == 'conNo' || column.pro  ==  'signDate' || column.pro  == 'ourSignBody' ||  column.pro  =='counterPart'", :prop='column.pro', :label='column.label', :key='column.pro')
          template(slot-scope='scope')
            | {{scope.row[column.pro] || '---'}}
        el-table-column(label='操作', width="80px")
          template(slot-scope='scope')
            el-tooltip.rowHandle(effect='dark', content='编辑',popper-class="tips", placement='bottom')
              i.iconfont.icon-bianji(@click='handleEdit(scope.row,"leave")')
        //- el-table.entryNumTable.tableContentScroll(:data='leavingNumTable', style='width: 100%',height='200')
          el-table-column(label='序号', type="index")
          el-table-column(label='姓名', prop="name")
          el-table-column(label='工号', prop="empNo")
          el-table-column(label='员工类型', prop="empType")
          el-table-column(label='手机号', prop="mobile")
          el-table-column(label='部门', prop="deptName")
          el-table-column(label='入职日期', prop="entryDate")
          el-table-column(label='离职日期', prop="leavingJobDate")
          el-table-column(label='办理离职日期', prop="resignDate")
          el-table-column(label='操作', width="80px")
            template(slot-scope='scope')
              el-button(size="small", type="success", plain, @click='handleEdit(scope.row,"in")') 编辑
        empty(slot='empty',:visible='visible')
      //- 分页
      pagination(:total="leavingNumPage",@size-change="leavingNumSizeChange",@current-change="leavingNumCurrentChange",
                    :sizes="[10, 20, 30, 40]",
                    :size="20",
                    :current.sync="inpageNum",
                    layout="total, sizes, prev, pager, next, jumper",
                    background)
</template>
<script>
import '../../commons/publicCss/outside.sass'
import pagination from "../../components/pagination"
import empty from "@/components/empty"
export default {
  name: 'leavingNumPage',
  components:{pagination,empty},
  data () {
    return {
      DateValue:[],
      leavingNumTable: [],
      colums:[
        {
          pro : 'name',
          label : '姓名',
        },
        {
          pro : 'empNo',
          label : '工号',
        },
        {
          pro : 'empType',
          label : '员工类型',
        },{
          pro : 'mobile',
          label : '手机号',
        },
        {
          pro : 'deptName',
          label : '部门',
        },
        {
          pro : 'entryDate',
          label : '入职日期',
        },{
          pro : 'leavingJobDate',
          label : '离职日期',
        },
        {
          pro : 'resignDate',
          label : '办理离职日期',
        },
      ],
      leavingNumDivShow: false,
      leavingNumDatePicker: [],
      leavingSearchInput: '',
      leavingpageNum:'1',
      leavingpageSize:'20',
      leavingNumPage: 1,
      exportToExcel:'',
      inpageNum: 1,
      visible: false
    }
  },
  created () {
    this.$util.getNowDate(this.DateValue)
    this.leavingNumDatePicker[0] = this.DateValue[0]
    this.leavingNumDatePicker[1] = this.DateValue[1]
    this.getleavingNumTable()
  },
  methods: {
    // 获取table
    getleavingNumTable () {
      // 获取table
      this.$api.leavingEmpStatistics({
        beginDate:this.leavingNumDatePicker[0],
        endDate:this.leavingNumDatePicker[1],
        searchPara:this.leavingSearchInput,
        definedPage:{pageNum:this.leavingpageNum,
        pageSize:this.leavingpageSize}
      }).then((res) => {
          this.leavingNumTable = res.data.data.list
          this.leavingNumPage = res.data.data.total
          if(this.leavingNumTable.length == 0){
            this.visible = true
          }
      })
    },
    // 日期选择器变化
    leavingNumChange () {
      this.leavingpageNum = 1
      this.inpageNum = 1
      this.getleavingNumTable()
    },
    // 搜索
    leavingSearchClick () {
      this.leavingpageNum = 1
      this.inpageNum = 1
      this.getleavingNumTable()
    },
    // 离职员工统计-分页
    leavingNumSizeChange (val) {
      this.leavingpageSize = val.value
      if(val.isLoad){
        this.getleavingNumTable()
      }
    },
    leavingNumCurrentChange (val) {
      this.leavingpageNum = val
      this.getleavingNumTable()
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
        beginDate : this.leavingNumDatePicker[0],
        endDate : this.leavingNumDatePicker[1],
        searchPara : this.leavingSearchInput,
        type : 'LEAVING'
      }
      // 下载文件
      this.$store.dispatch('downFile',{url : '/admin/empLeaving/employeeExportToExcel', data : this.exportToExcel ,  fileName :'离职员工列表.xls'})
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
.date-picker
  float: left
  height: 30px
  padding-right: 20px
  font-weight: normal
  font-size: 14px
</style>
