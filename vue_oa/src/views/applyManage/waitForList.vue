<template lang="pug">
#waitForList
  div.listWrapNoScroll.companyList.borderScroll.companyCommon
    div.topTitlediv
      div.tableTitleRight 待处理的审批
      div.tableTitleLeft
        el-input.inputSearch.width290(placeholder='请输入申请人姓名',size='small',maxlength="20", v-model='searchUserName'  v-on:keyup.native.enter='searchBtnClick')
        i.el-icon-search(@click='searchBtnClick')
        el-button.addBtn(size='small',@click='filterHandle')  筛选
        //- 测试提交
      div(style="clear:both")
    //- 筛选icon
    div.termFilterDiv(v-if='termFilterDivShow')
      span 条件筛选：
      el-tag(:key='tag',size='small',type='info', v-for='tag in dynamicTags', closable='', :disable-transitions='false', @close='tagHandleClose(tag)')
        span.punctuation
        | {{tag}}
      span(style="color:rgba(60,115,177,1);cursor: pointer",@click='dynamicTagsCloseAll') 清空筛选条件
    div.tableContent(v-bind:class='{tablemin: termFilterDivShow}')
      el-table.tableContentScroll(:data='tableList', height='200',@selection-change="handleSelectionChange",:row-style="rowClass",:cell-class-name="cellClassName",:row-class-name="rowClassName")
        el-table-column(width='40', type="selection")
        el-table-column(width='40')
          template(slot-scope='scope')
            template(v-if="scope.row.check===true")
              el-dropdown(@command='menuDownClick',trigger='click', placement='right-start')
                span.el-dropdown-link.rowHandle
                  i.el-icon-d-arrow-left
                el-dropdown-menu.dropdownCheck(slot='dropdown')
                  el-dropdown-item(command='00') 批量处理 ( 选中 {{checkNum}} 项 )
                  el-dropdown-item(command='0') 同意
                  el-dropdown-item(command='1') 不同意
                  el-dropdown-item(command='2') 退回
        //- el-table-column(width='40', type="index",label='序号')
        el-table-column(v-for='(column, key) in colums',:min-width='column.width', :sortable="column.pro  == 'endFlowApplyTime'", :prop='column.pro', :label='column.label', :key='column.pro')
          template(slot-scope='scope')
            template(v-if="column.pro === 'relationFormCode'")
              span {{processFormType.obj[scope.row.relationFormCode] || '---'}}
            template(v-else)(slot-scope='scope')
              | {{scope.row[column.pro] || '---'}}
        el-table-column(label='操作',width="80")
          template(slot-scope='scope')
            el-tooltip.rowHandle(effect='dark', content='处理审批',popper-class="tips", placement='bottom')
              i.iconfont.icon-bianji(@click='editRow(scope.row)')   
        empty(slot="empty",:visible='visible')      
      //- 分页
      pagination(@size-change='SizeChange', @current-change='CurrentChange',background, :sizes='[10, 20, 30, 40]', :size='20',:current.sync="inpageNum", layout='total, sizes, prev, pager, next, jumper', :total='totlePage')
    //- 筛选-弹出框
    el-dialog(title='筛选条件', :visible.sync='termFilterFormShow', style='margin:0 auto', :close-on-click-modal='false',width="570px")
      el-form.elForm(:model='listParam',v-if="termFilterFormShow",ref='listParam',:rules='listRules',label-width="120px",size='medium')  
        el-form-item(label='审批名称',prop='templateName')
          el-input.width360(v-model.trim='listParam.templateName', placeholder='请输入')
        el-form-item(label='审批类型')
          el-select.width360(v-model='listParam.relationFormCode',clearable, placeholder='请选择')
            el-option(v-for='item in processFormType.list', :key='item.code', :label='item.name', :value='item.code') {{item.name}}
        el-form-item(label='申请人部门')
          el-cascader.width360(placeholder='请选择',clearable,:options='distributeOptions', :props="props",  filterable, @change='optionChange',v-model="deptId", change-on-select,:show-all-levels="false")
        
        el-form-item(label='发起时间')
          el-date-picker.width360(v-model='datePicker', type='daterange', align='right', unlink-panels='',value-format="yyyy-MM-dd", range-separator='至', start-placeholder='开始时间', end-placeholder='结束时间')
        el-form-item(label='接收时间')
          el-date-picker.width360(v-model='datePicker2', type='daterange', align='right', unlink-panels='',value-format="yyyy-MM-dd", range-separator='至', start-placeholder='开始时间', end-placeholder='结束时间')
      
      .dialog-footer(slot='footer')
        el-button(type='primary', @click="submitForm('listParam',termFilterFormsubmit)",size='medium') 确 定
        el-button(@click="termFilterFormReset('listParam')",size='medium') 取 消    
    //- 同意 不同意 退回 弹窗
    agreeDialog(:agreeDialogShow ='agreeDialogShow',:handleOpinionCode='handleOpinionCode',@agreeDialogCancel='agreeDialogCancel',:checkData='checkData')
</template>
<script>
import "../../commons/publicCss/outside.sass"
import {mapState} from 'vuex'
import pagination from "../../components/pagination"
import empty from "@/components/empty";
import agreeDialog from "./agreeDialog"
import { switchCase } from 'babel-types';
export default {
  name: 'waitForList',
  components:{pagination,empty,agreeDialog},
  data () {
    return {
      selectData:[],
      selectRow:[],
      checkNum:0,
      checkData:[],
      visible:false,
      searchUserName: '',
      tableList: [],
      colums:[
        {
          pro : 'formNo',
          label : '审批单号',
          width: '140px'
        },
        {
          pro : 'templateName',
          label : '审批名称'
        },
        {
          pro : 'relationFormCode',
          label : '审批类型',
        },
        {
          pro : 'applyUserName',
          label : '申请人',
        },
        {
          pro : 'applyDeptName',
          label : '申请人部门'
        },
        {
          pro : 'flowApplyTime',
          label : '申请发起时间',
          width: '160px'
        },
        {
          pro : 'lastOperTime',
          label : '接收时间',
          width: '160px'
        }
      ],
      listParam: {
        pageNum:1,
        pageSize:20,
        templateName:'',
        relationFormCode: '',
        startFlowApplyTime: '',
        endFlowApplyTime: '',
        applyUserDeptId: '',
      },
      totlePage: 0,
      inpageNum: 1,
      listRules:{
        templateName:[
          {pattern:/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,20}$/ , message:'仅支持1-20位中文、英文字符与下划线',trigger:'blur'}
        ]
      },
      // 部门
      deptId:[],
      distributeOptions: [],
      props:{
        value: 'id',
        label: 'text',
        children: 'children'
      },
      // 筛选
      termFilterFormShow: false,
      termFilterDivShow: false,
      dynamicTags: [],
      newValFilter:'',
      // 时间区间
      datePicker: [],
      datePicker2:[],
      // 同意弹窗
      agreeDialogShow: false,
      handleOpinionCode:''
    }
  },
  watch: {
    searchUserName (val) {
      this.listParam.applyUserName = val
      if(val === ''){
        this.getList()
      }
    },
    // 筛选数据为空时，div隐藏
    dynamicTags (val) {
      if(val.length === 0){
        this.termFilterDivShow = false
      }else{
        this.termFilterDivShow = true
      }
    },
    termFilterFormShow (val) {
      if(val){
        this.listParam = {
          pageNum:1,
          pageSize:this.listParam.pageSize,
          templateName:'',
          relationFormCode: '',
          startFlowApplyTime: '',
          endFlowApplyTime: '',
          applyUserName: this.listParam.applyUserName,
          applyUserDeptId: '',
        }
        this.deptId=[]
        this.datePicker = []
        this.datePicker2 = []
      }
    },
    // 监听选中行的变化-监听selectData 判断选中行在table列表里面的位置，将所有的index保存在selectRow中
    selectData(data) {
      this.selectRow = [];
      if (data.length > 0) {  
        data.forEach((item, index) => {
          this.selectRow.push(this.tableList.indexOf(item));
        });
      }
    }
  },
  computed:{
    // ...mapState({
    //   "addEmployeeTypeArr" : state => state.selectData.hireform.list//审批类型下拉
    // })
    // 审批类型
    processFormType() {
      return this.$store.state.selectData.processFormType;
    }
  },
  created () {
    // 1.加载table列表
    this.getList()
    // 加载部门下拉框
    this.$store.dispatch('getOrgTreeExtInfo').then( obj =>{
      this.distributeOptions = obj
    })
  },
  methods: {
    // load列表
    getList(){
      this.$api.waittaskList(this.listParam).then(res => {
        this.tableList = res.data.data.list
        this.tableList.forEach((val,i)=>{
          val.check = false
          val.index = i
        })
        this.totlePage = res.data.data.total
        if(this.tableList.length == 0){
          this.visible = true
        }
      })
    },
    // 搜索
    searchBtnClick(){
      this.inpageNum = 1
      this.listParam.pageNum = 1
      this.getList()
    },
    // 分页
    SizeChange (val) {
      this.listParam.pageSize = val.value
      if(val.isLoad){
      this.getList()
      }
    },
    CurrentChange (val) {
      this.listParam.pageNum = val
      this.getList()
    },
    // 点击编辑按钮
    editRow(row){
      window.sessionStorage['applyState'] = 1 // 同意 不同意 返回按钮
      window.sessionStorage['apply'] = JSON.stringify(row)
      this.$router.push({name : 'approval'+row.relationFormCode})
    },
    // 筛选
    filterHandle () {
      this.deptId=[]
      this.termFilterFormShow = true
    },
    // 部门-下拉框改变
    optionChange(val){
      this.listParam.applyUserDeptId = this.deptId[this.deptId.length-1]
    },
    // 初始化部门中文名
    callBackFilter (newValFilter) {
      this.newValFilter = newValFilter
    },
    // 筛选条件提交
    termFilterFormsubmit(){
      // form隐藏
      this.termFilterFormShow = false
      // 加载table
      this.listParam.pageNum = 1
      this.inpageNum = 1
      this.getList()
      // 筛选div显示
      this.termFilterDivShow = true
      // 清空筛选数据
      this.dynamicTags = []
      // 填充div
      // 审批名称
      this.tagsPush(this.listParam.templateName,'审批名称')
      // 审批类型
      let processFormType = this.$store.state.selectData.processFormType.obj[this.listParam.relationFormCode]
      this.tagsPush(processFormType,'审批类型')
      // 部门-根据id 得部门
      if(this.listParam.applyUserDeptId !== '' && this.listParam.applyUserDeptId !== undefined){
        this.$util.findChildrenIds(this.distributeOptions, 'id', this.listParam.applyUserDeptId,this.callBackFilter)
        this.tagsPush(this.newValFilter,'部门')
      }
      // 发起时间
      this.listParam.startFlowApplyTime = this.datePicker[0]
      // 
      this.listParam.endFlowApplyTime = this.datePicker[1]
      let datePicker = this.datePicker[0] + ' 至 ' + this.datePicker[1]
      if(this.datePicker[0]!==undefined){
        this.tagsPush(datePicker,'发起时间')
      }
      // 接收时间
      this.listParam.lastStartFlowApplyTime = this.datePicker2[0]
      this.listParam.lastEndFlowApplyTime = this.datePicker2[1]
      let datePicker2 = this.datePicker2[0] + ' 至 ' + this.datePicker2[1]
      if(this.datePicker2[0]!==undefined){
        this.tagsPush(datePicker2,'接收时间')
      }
    },
    tagsPush(val,name){
      if(val){
        this.dynamicTags.push(name + '：' + val)
      }
    },
    tagHandleClose(tag){
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      // 点击之后初始化参数 调table
      let newVal = tag.split('：')
      switch(newVal[0]){
        case "审批名称":
          this.listParam.templateName = ''
        break;
        case "审批类型":
          this.listParam.relationFormCode = ''
        break;
        case "部门":
          this.listParam.applyUserDeptId = ''
        break;
        case "发起时间":
          this.listParam.startFlowApplyTime = ''
          this.listParam.endFlowApplyTime = ''
          this.datePicker = []
        break;
        case "接收时间":
          this.listParam.lastStartFlowApplyTime = ''
          this.listParam.lastEndFlowApplyTime = ''
          this.datePicker2 = []
        break;
      }
      this.inpageNum = 1
      this.listParam.pageNum = 1
      this.getList()
    },
    // 取消按钮
    termFilterFormReset(formName) {
      this.termFilterFormShow = false
    },
    dynamicTagsCloseAll () {
      this.listParam = {
        pageNum:1,
        pageSize:this.listParam.pageSize,
        templateName:'',
        relationFormCode: '',
        startFlowApplyTime: '',
        endFlowApplyTime: '',
        applyUserDeptId: '',
      }
      this.inpageNum = 1
      this.dynamicTags = []
      this.getList()
    },
    // 批量审批
    handleSelectionChange(val){
      this.checkNum = val.length
      this.checkData = val
      this.tableList.forEach(v=>{
        v.check = false
      })
      val.forEach(v =>{
        v.check = true
      })
      // 1.选中内容保存在 selectData
      this.selectData = val
      // 2.监听选中内容的变化
    },
    // 3.多选高亮选中行
    rowClass({row, rowIndex}){
      if(this.selectRow.includes(rowIndex)){
        return { "background-color": "#1F9EFB" }
      }
    },
    rowClassName({row, column, rowIndex, columnIndex}){
      if(this.selectRow.includes(rowIndex)){
        return 'rowClass'
      }
    },
    cellClassName({row, column, rowIndex, columnIndex}){
      if(this.selectRow.includes(rowIndex)){
        return 'cellClass'
      }
    },
    // 操作
    menuDownClick(command){
      if(command == '00'){
        return false;
      }
      this.agreeDialogShow = true
      this.handleOpinionCode = command
    },
    // 取消
    agreeDialogCancel(val){
      if(val == 'list'){
        this.inpageNum = 1
        this.listParam.pageNum = 1
        this.getList()
      }else{
        this.agreeDialogShow = false
        this.handleOpinionCode = ''
      }
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
<style lang="sass" scoped>
#waitForList
  .cellClass .cell
    color: #FFFFFF !important
  .el-icon-d-arrow-left
    transform: rotate(-90deg)
    -ms-transform:rotate(-90deg)
    -moz-transform:rotate(-90deg)
    -webkit-transform:rotate(-90deg)
    -o-transform:rotate(-90deg)
</style>
