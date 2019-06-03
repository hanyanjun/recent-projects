<template lang="pug">
#entryNumPage
  div.employeeHead 入职员工统计
  i.backIcon(class="iconfont icon-fanhui pointer", @click="backIconClick")
  div.listWrapNoScroll.companyCommon.companyList.idBorder
    div.topTitlediv
      div.tableTitleRight
        div.date-picker(style='line-height: 32px') 查询时间
        el-date-picker(v-model='entryNumDatePicker',@change='entryNumChange', type='daterange',:clearable='false',align='right', unlink-panels='',value-format="yyyy-MM-dd", range-separator='至', start-placeholder='开始日期', end-placeholder='结束日期')
      div.tableTitleLeft
        el-input.inputSearch.width290(placeholder='请输入姓名或工号',size='small',maxlength="20", v-model='entrySearchInput'  v-on:keyup.native.enter='entrySearchClick')
        i.el-icon-search(@click='entrySearchClick')
        el-button.addBtn(size='small',@click.stop="exportExcel('ENTRY')")  导出
        //- 测试提交
      div(style="clear:both")
    div.tableContent
      el-table.tableContentScroll(:data='entryNumTable', height='200')
        el-table-column(label='序号', type="index")
        el-table-column(v-for='(column, key) in colums',:width='column.width', :sortable="column.pro  == 'conNo' || column.pro  ==  'signDate' || column.pro  == 'ourSignBody' ||  column.pro  =='counterPart'", :prop='column.pro', :label='column.label', :key='column.pro')
          template(slot-scope='scope')
            template(v-if='column.pro == "deptName"')
              div(v-if="scope.row.deptName==='未分配'", @click='deptNameHandle(scope.row)',style="cursor:pointer")
                el-tooltip.item(content='分配',popper-class="tips", placement='right')
                  span(style="color:#3C73B1") {{scope.row.deptName}}
              span(v-else) {{scope.row.deptName}}
            template(v-else-if='column.pro == "activeState"')
              div(v-if="scope.row.activeState==='未激活'", @click='stateHandle(scope.row)',style="cursor:pointer")
                el-tooltip.item(content='发送激活码',popper-class="tips", placement='right')
                  span(style="color:#3C73B1") {{scope.row.activeState}}
              span(v-else) {{scope.row.activeState}}
            template(v-else)
              | {{scope.row[column.pro] || '---'}}
        el-table-column(label='操作', width="80px")
          template(slot-scope='scope')
            el-tooltip.rowHandle(effect='dark', content='编辑',popper-class="tips", placement='bottom')
              i.iconfont.icon-bianji(@click='handleEdit(scope.row,"in")')
      
        //- el-table.entryNumTable.tableContentScroll(:data='entryNumTable', style='width: 100%',height='200')
        //- el-table-column(label='序号', type="index")
        //- el-table-column(label='姓名', prop="name")
        //- el-table-column(label='工号', prop="empNo")
        //- el-table-column(label='员工类型', prop="empType")
        //- el-table-column(label='手机号', prop="mobile")
        //- el-table-column(label='部门', prop="deptName")
        //-   template(slot-scope='scope')
        //-     div(v-if="scope.row.deptName==='未分配'", @click='deptNameHandle(scope.row)',style="cursor:pointer")
        //-       el-tooltip.item(content='分配',popper-class="tips", placement='right')
        //-         span(style="color:#3C73B1") {{scope.row.deptName}}
        //-     span(v-else) {{scope.row.deptName}}
        //- el-table-column(label='汇报对象', prop="repObjectName")
        //- el-table-column(label='职位', prop="position")
        //- el-table-column(label='入职日期', prop="entryDate")
        //- el-table-column(label='缺入职材料', prop="entryMaterial",min-width='200px')
        //- el-table-column(label='状态', prop="activeState",min-width='80px')
        //-   template(slot-scope='scope')
        //-     div(v-if="scope.row.activeState==='未激活'", @click='stateHandle(scope.row)',style="cursor:pointer")
        //-       el-tooltip.item(content='发送激活码',popper-class="tips", placement='right')
        //-         span(style="color:#3C73B1") {{scope.row.activeState}}
        //-     span(v-else) {{scope.row.activeState}}
        //- el-table-column(label='操作', width="80px")
        //-   template(slot-scope='scope')
        //-     el-button(size="mini", type="success", plain, @click='handleEdit(scope.row,"in")') 编辑
        empty(slot="empty",:visible='visible')
      //- 分页
      pagination(:total="entryNumPage",@size-change="entrySizeChange",@current-change="entryCurrentChange",
                    :sizes="[10, 20, 30, 40]",
                    :size="20",
                    :current.sync="inpageNum",
                    layout="total, sizes, prev, pager, next, jumper",
                    background)
    //- 分配弹出框
    el-dialog.distributeDiv(title='分配部门', :visible.sync='distributeShow', style='margin:0 auto', :close-on-click-modal='false',width="660px")
      el-form(label-width="120px")  
        el-form-item(label='上级部门：')
          el-cascader.addInputWidth(placeholder='可搜索',:options='distributeOptions', :props="props",  filterable, @change='departmentChange',v-model="distributeInput", change-on-select)
      .dialog-footer(slot='footer')
        el-button(@click="distributeReset") 取 消
        el-button(type='primary', @click="distributesubmit") 确 定
</template>
<script>
import '../../commons/publicCss/outside.sass'
import core from '@/api/core'
import util from '../../util'
import pagination from "../../components/pagination"
import empty from "@/components/empty"
export default {
  name: 'entryNumPage',
  components:{pagination,empty},
  data () {
    return {
      DateValue:[],
      // 1.入职人数
      entryNumTable: [],
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
          pro : 'repObjectName',
          label : '汇报对象',
        },{
          pro : 'position',
          label : '职位',
        },
        {
          pro : 'entryDate',
          label : '入职日期',
        },
        {
          pro : 'entryMaterial',
          label : '缺入职材料',
          width: '200px'
        },{
          pro : 'activeState',
          label : '状态',
          width: '80px'
        },
      ],
      entryNumDivShow: false,
      entryNumDatePicker: [],
      entrySearchInput: '',
      entryNumpageNum:'1',
      entryNumpageSize:'20',
      entryNumPage: 0,
      inpageNum: 1,
      exportToExcel:'',
       // 分配// 部门
      distributeShow: false,
      distributeId: '',
      userIds: [],
      distributeOptions: [],
      distributeInput: [],
      props:{
        value: 'id',
        label: 'text',
        children: 'children'
      },
      visible: false
    }
  },
  created () {
    this.$util.getNowDate(this.DateValue)
    this.entryNumDatePicker[0] = this.DateValue[0]
    this.entryNumDatePicker[1] = this.DateValue[1]
    this.getentryNumTable()
    // 2.部门tree
    
    core.orgTreeBaseInfo().then((res) => {
      util.codeConfirm(res.data,this)
      if(res.data.code === '200'){
        this.distributeOptions = JSON.parse(JSON.stringify(res.data.data))
        this.$util.findChildren(this.distributeOptions, 'children')
      }
    }).catch(util.errorHandle)
  },
  methods: {
    // 获取table
    getentryNumTable () {
      // 获取table
      this.$api.entryEmpStatistics({
        beginDate:this.entryNumDatePicker[0],
        endDate:this.entryNumDatePicker[1],
        searchPara:this.entrySearchInput,
        definedPage:{pageNum:this.entryNumpageNum,
        pageSize:this.entryNumpageSize}
      }).then((res) => {
          this.entryNumTable = res.data.data.list
          this.entryNumPage = res.data.data.total
          if(this.entryNumTable.length == 0){
            this.visible = true
          }
      })
    },
    // 日期选择器变化
    entryNumChange () {
      this.entryNumpageNum = 1
      this.inpageNum = 1
      this.getentryNumTable()
    },
    // 搜索
    entrySearchClick () {
      this.entryNumpageNum = 1
      this.inpageNum = 1
      this.getentryNumTable()
    },
    // 入职员工统计-分页
    entrySizeChange (val) {
      // this.entryNumpageSize = val
      // let mun=Math.ceil(Number(this.entryNumPage)/Number(val))
      // if(this.entryNumpageNum <= mun){
      //   this.getentryNumTable()
      // }
      this.entryNumpageSize = val.value
      if(val.isLoad){
        this.getentryNumTable()
      }
    },
    entryCurrentChange (val) {
      this.entryNumpageNum = val
      this.getentryNumTable()
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
    // 分配
    deptNameHandle (row) {
      this.distributeInput =[]
      this.userIds[0] = row.userId
      this.distributeShow = true
    },
    // 分配选择部门时获取父级部门id
    departmentChange (val) {
      this.distributeId = val[val.length-1]
    },
    // 分配成功提交
    distributesubmit () {
      core.distributeDept({deptId: this.distributeId,userIds: this.userIds}).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.distributeShow = false
          this.getentryNumTable()
          this.$message.success(res.data.messages)
        }
      }).catch(util.errorHandle)
    },
    // 激活
    stateHandle(row) {
      this.$confirm('确定要发送激活码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送激活码接口
        this.$api.activeAccountEmail({userId : row.userId}).then(obj=>{
          this.$message.success('发送成功！');
          console.log(obj);
        })
      }).catch(() => {
        this.$message({type: 'info',message: '已取消'});
      })
    },
    // 导出
    exportExcel () {
      this.exportToExcel = {
        beginDate : this.entryNumDatePicker[0],
        endDate : this.entryNumDatePicker[1],
        searchPara : this.entrySearchInput,
        type : 'ENTRY'
      }
      // 下载文件
      this.$store.dispatch('downFile',{url : '/admin/empLeaving/employeeExportToExcel', data : this.exportToExcel ,  fileName :'入职员工列表.xls'})
    },
    // 分配取消
    distributeReset () {
      this.distributeShow = false
    },
    // 返回按钮
    backIconClick () {
      this.$router.push({name:'employeeList'})
    }
  }
}
</script>
<style lang="sass"  scoped>
#entryNumPage .listWrapNoScroll
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
.date-picker
  float: left
  height: 30px
  padding-right: 20px
  font-weight: normal
  font-size: 14px
.el-range-editor.el-input__inner
  padding: 0px 10px
  height: 30px
// .el-pagination
//   margin-top: 20px
//   float: right
</style>
