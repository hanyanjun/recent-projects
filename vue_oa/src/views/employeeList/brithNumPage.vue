<template lang="pug">
#leavingNumPage
  //- div.leavingNumDiv
  //-   div.employeeHead(style="margin: 2px 0px 10px") 生日统计
  //-   div.tableTitle
  //-       el-row(:gutter='20')
  //-         el-col(:span='16')
  //-           div.date-picker(style='line-height: 32px') 查询时间：
  //-           el-date-picker(v-model='birthNumDatePicker',@change='birthNumChange', type='daterange', align='right', unlink-panels='',format="MM-dd",value-format="yyyy-MM-dd", range-separator='至', start-placeholder='开始日期', end-placeholder='结束日期')
  //-         el-col(:span='8')
  //-           el-row.tableButton(:gutter='20')
  //-             el-col(:span='18')
  //-               el-input.input-with-select(v-model='birthSearchInput',placeholder='请输入姓名或工号', size='mini')
  //-                 el-button(slot='append', icon='el-icon-search',@click="birthSearchClick")
  //-             el-col(:span='4')
  //-               <el-button @click.stop="exportExcel('BIR')">导出</el-button>
  div.employeeHead 生日统计
  i.backIcon(class="iconfont icon-fanhui pointer", @click="backIconClick")
  div.listWrapNoScroll.companyCommon.companyList.idBorder
    div.topTitlediv
      div.tableTitleRight
        div.date-picker(style='line-height: 32px') 查询时间
        el-date-picker(v-model='birthNumDatePicker',@change='birthNumChange', :clearable='false' ,type='daterange', align='right', unlink-panels='',value-format="yyyy-MM-dd", range-separator='至', start-placeholder='开始日期', end-placeholder='结束日期')
      div.tableTitleLeft
        el-input.inputSearch.width290(placeholder='请输入姓名或工号',size='small',maxlength="20", v-model='birthSearchInput'  v-on:keyup.native.enter='birthSearchClick')
        i.el-icon-search(@click='birthSearchClick')
        el-button.addBtn(size='small',@click.stop="exportExcel('BIR')")  导出
        //- 测试提交
      div(style="clear:both")
    div.tableContent
      el-table.tableContentScroll(:data='birthNumTable', height='200')
        el-table-column(label='序号', type="index")
        el-table-column(v-for='(column, key) in colums',:width='column.width', :sortable="column.pro  == 'conNo' || column.pro  ==  'signDate' || column.pro  == 'ourSignBody' ||  column.pro  =='counterPart'", :prop='column.pro', :label='column.label', :key='column.pro')
          template(slot-scope='scope')
            | {{scope.row[column.pro] || '---'}}
        el-table-column(label='操作', width="80px")
          template(slot-scope='scope')
            el-tooltip.rowHandle(effect='dark', content='编辑',popper-class="tips", placement='bottom')
              i.iconfont.icon-bianji(@click='handleEdit(scope.row)')
        //- el-table.tableContentScroll(:data='birthNumTable', style='width: 100%',height='200')
        //- el-table-column(label='序号', type="index")
        //- el-table-column(label='姓名', prop="name")
        //- el-table-column(label='工号', prop="empNo")
        //- el-table-column(label='员工类型', prop="empType")
        //- el-table-column(label='星座', prop="constellation")
        //- el-table-column(label='部门', prop="deptName")
        //- el-table-column(label='入职日期', prop="entryDate")
        //- el-table-column(label='年龄', prop="age")
        //- el-table-column(label='生日', prop="birth")
        //- el-table-column(label='性别', prop="sex")
        //- el-table-column(label='操作', width="80px")
        //-   template(slot-scope='scope')
        //-     el-tooltip.rowHandle(effect='dark', content='编辑',popper-class="tips", placement='bottom')
        //-       i.iconfont.icon-bianji(@click='handleEdit(scope.row)')
        empty(slot='empty',:visible='visible')
      //- 分页
      pagination(:total="birthNumPage",@size-change="birthNumSizeChange",@current-change="birthNumCurrentChange",
                    :sizes="[10, 20, 30, 40]",
                    :size="20",
                    :current.sync="inpageNum",
                    layout="total, sizes, prev, pager, next, jumper",
                    background)
</template>
<script>
import '../../commons/publicCss/outside.sass'
import store from '@/vuex/store'
import {mapState,mapMutations} from "vuex"
import pagination from "../../components/pagination"
import empty from '@/components/empty'
export default {
  name: '',
  components:{pagination,empty},
  data () {
    return {
      DateValue:[],
      // 4.birth人数
      birthNumTable: [],
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
            pro : 'constellation',
            label : '星座',
          },
          {
            pro : 'deptName',
            label : '部门',
          },
          {
            pro : 'entryDate',
            label : '入职日期',
          },{
            pro : 'age',
            label : '年龄',
          },
          {
            pro : 'birth',
            label : '生日',
          },
          {
            pro : 'sex',
            label : '性别',
          },
      ],
      birthNumDivShow: false,
      birthNumDatePicker: [],
      birthSearchInput: '',
      birthpageNum:'1',
      birthpageSize:'20',
      birthNumPage: 1,
      exportToExcel:'',
      inpageNum: 1,
      visible: false
    }
  },
  computed:{
    constellation () {
      return this.$store.state.selectData.constellation
    },
    sex () {
      return this.$store.state.selectData.sex
    }
  },
  created () {
    this.$util.getNowDate(this.DateValue)
    this.birthNumDatePicker[0] = this.DateValue[0]
    this.birthNumDatePicker[1] = this.DateValue[1]
    this.getbirthNumTable()
  },
  methods: {
    // 获取table
    getbirthNumTable () {
      // 获取table
      this.$api.birthEmpStatistics({
        beginDate:this.birthNumDatePicker[0],
        endDate:this.birthNumDatePicker[1],
        searchPara:this.birthSearchInput,
        definedPage:{pageNum:this.birthpageNum,
        pageSize:this.birthpageSize}
      }).then((res) => {
        this.birthNumTable = res.data.data.list
        this.birthNumPage = res.data.data.total
        this.visible = true
      })
    },
    // 日期选择器变化
    birthNumChange () {
      this.birthpageNum = 1
      this.inpageNum = 1
      this.getbirthNumTable()
    },
    birthSearchClick () {
      this.birthpageNum = 1
      this.inpageNum = 1
      this.getbirthNumTable()
    },
    // birth人数统计-分页
    birthNumSizeChange (val) {
      this.birthpageSize = val.value
      if(val.isLoad){
        this.getbirthNumTable()
      }
    },
    birthNumCurrentChange (val) {
      this.birthpageNum = val
      this.getbirthNumTable()
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
        beginDate : this.birthNumDatePicker[0],
        endDate : this.birthNumDatePicker[1],
        searchPara : this.birthSearchInput,
        type : 'BIR'
      }
      // 下载文件
      this.$store.dispatch('downFile',{url : '/admin/empLeaving/employeeExportToExcel', data : this.exportToExcel ,  fileName :'生日统计员工列表.xls'})
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
