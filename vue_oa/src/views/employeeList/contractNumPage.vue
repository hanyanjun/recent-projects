<template lang="pug">
#leavingNumPage
  //- div.leavingNumDiv
  //-   div.employeeHead(style="margin: 2px 0px 10px") 合同到期统计
  //-   div.tableTitle
  //-       el-row(:gutter='20')
  //-         el-col(:span='16')
  //-           div.date-picker(style='line-height: 32px') 查询时间：
  //-           el-date-picker(v-model='contractNumDatePicker',@change='contractNumChange', type='daterange', align='right', unlink-panels='',value-format="yyyy-MM-dd", range-separator='至', start-placeholder='开始日期', end-placeholder='结束日期')
  //-         el-col(:span='8')
  //-           el-row.tableButton(:gutter='20')
  //-             el-col(:span='18')
  //-               el-input.input-with-select(v-model='contractSearchInput',placeholder='请输入姓名或工号', size='mini')
  //-                 el-button(slot='append', icon='el-icon-search',@click="contractSearchClick")
  //-             el-col(:span='4')
  //-               <el-button  @click.stop="exportExcel('CONTRACT_EXP')">导出</el-button>
  div.employeeHead 合同到期统计
  i.backIcon(class="iconfont icon-fanhui pointer", @click="backIconClick")
  div.listWrapNoScroll.companyCommon.companyList.idBorder
    div.topTitlediv
      div.tableTitleRight
        div.date-picker(style='line-height: 32px') 查询时间
        el-date-picker(v-model='contractNumDatePicker',:clearable='false',@change='contractNumChange', type='daterange', align='right', unlink-panels='',value-format="yyyy-MM-dd", range-separator='至', start-placeholder='开始日期', end-placeholder='结束日期')
      div.tableTitleLeft
        el-input.inputSearch.width290(placeholder='请输入姓名或工号',size='small',maxlength="20", v-model='contractSearchInput'  v-on:keyup.native.enter='contractSearchClick')
        i.el-icon-search(@click='contractSearchClick')
        el-button.addBtn(size='small',@click.stop="exportExcel('CONTRACT_EXP')")  导出
        //- 测试提交
      div(style="clear:both")
    div.tableContent
      el-table.tableContentScroll(:data='contractNumTable', height='200')
        el-table-column(label='序号', type="index")
        el-table-column(v-for='(column, key) in colums',:width='column.width', :sortable="column.pro  == 'conNo' || column.pro  ==  'signDate' || column.pro  == 'ourSignBody' ||  column.pro  =='counterPart'", :prop='column.pro', :label='column.label', :key='column.pro')
          template(slot-scope='scope')
            | {{scope.row[column.pro] || '---'}}
        el-table-column(label='操作', width="80px")
          template(slot-scope='scope')
            el-tooltip.rowHandle(effect='dark', content='编辑',popper-class="tips", placement='bottom')
              i.iconfont.icon-bianji(@click='handleEdit(scope.row,"in")')
        //- el-table.entryNumTable.tableContentScroll(:data='contractNumTable', style='width: 100%',height='200')
          el-table-column(label='序号', type="index")
          el-table-column(label='姓名', prop="name")
          el-table-column(label='工号', prop="empNo")
          el-table-column(label='手机号', prop="mobile")
          el-table-column(label='部门', prop="deptName")
          el-table-column(label='聘用形式', prop="empType")
          el-table-column(label='入职日期', prop="entryDate")
          el-table-column(label='现合同开始日期', prop="conStartDate")
          el-table-column(label='现合同结束日期', prop="conEndDate")
          el-table-column(label='合同期限(月)', prop="conDurtation")
          el-table-column(label='操作', width="80px")
            template(slot-scope='scope')
              el-button(size="small", type="success", plain, @click='handleEdit(scope.row,"in")') 编辑
        empty(slot='empty',:visible='visible')
      //- 分页
      pagination(:total="contractNumPage",@size-change="contractNumSizeChange",@current-change="contractNumCurrentChange",
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
      // 1.入职人数
      // 3.合同到期人数
      contractNumTable: [],
      colums:[
        {
          pro : 'name',
          label : '姓名',
        },
        {
          pro : 'empNo',
          label : '工号',
        },{
          pro : 'mobile',
          label : '手机号',
        },
        {
          pro : 'deptName',
          label : '部门',
        },{
          pro : 'empType',
          label : '聘用形式',
        },
        {
          pro : 'entryDate',
          label : '入职日期',
        },{
          pro : 'conStartDate',
          label : '现合同开始日期',
        },
        {
          pro : 'conEndDate',
          label : '现合同结束日期',
        },{
          pro : 'conDurtation',
          label : '合同期限(月)',
        }
      ],
      contractNumDivShow: false,
      contractNumDatePicker: [],
      contractSearchInput: '',
      contractpageNum:'1',
      contractpageSize:'20',
      contractNumPage: 1,
      inpageNum: 1,
      visible: false
    }
  },
  created () {
    this.$util.getNowDate(this.DateValue)
    this.contractNumDatePicker[0] = this.DateValue[0]
    this.contractNumDatePicker[1] = this.DateValue[1]
    this.getcontractNumTable()
  },
  methods: {
    // 获取table
    getcontractNumTable () {
      // 获取table
      this.$api.contractEndEmpStatistics({
        beginDate:this.contractNumDatePicker[0],
        endDate:this.contractNumDatePicker[1],
        searchPara:this.contractSearchInput,
        definedPage:{pageNum:this.contractpageNum,
        pageSize:this.contractpageSize}
      }).then((res) => {
        this.contractNumTable = res.data.data.list
        this.contractNumPage = res.data.data.total
        if(this.contractNumTable.length == 0){
          this.visible = true
        }
      })
    },
    // 日期选择器变化
    contractNumChange () {
      this.contractpageNum = 1
      this.inpageNum = 1
      this.getcontractNumTable()
    },
    // 搜索
    contractSearchClick () {
      this.contractpageNum = 1
      this.inpageNum = 1
      this.getcontractNumTable()
    },
    // 合同到期统计-分页
    contractNumSizeChange (val) {
      this.contractpageSize = val.value
      if(val.isLoad){
        this.getcontractNumTable()
      }
    },
    contractNumCurrentChange (val) {
      this.contractpageNum = val
      this.getcontractNumTable()
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
        beginDate : this.contractNumDatePicker[0],
        endDate : this.contractNumDatePicker[1],
        searchPara : this.contractSearchInput,
        type : 'CONTRACT_EXP'
      }
      // 下载文件
      this.$store.dispatch('downFile',{url : '/admin/empLeaving/employeeExportToExcel', data : this.exportToExcel ,  fileName :'合同到期员工列表.xls'})
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
