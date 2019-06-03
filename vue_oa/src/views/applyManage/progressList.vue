<template lang="pug">
#progressList
  div.listWrapNoScroll.companyCommon.companyList.borderScroll
    div.topTitlediv
      div.tableTitleRight 审批流程监控
      div.tableTitleLeft
        el-input.inputSearch.width290(placeholder='请输入申请人或者审批人',size='small',maxlength="20", v-model='searchUserName'  v-on:keyup.native.enter='searchBtnClick')
        i.el-icon-search(@click='searchBtnClick')
        el-button.addBtn(size='small',@click='filterHandle')  筛选
        //- 测试提交
      div(style="clear:both")
      div.countDiv 异常流程统计 ：
        span.countspan(@click='noExistClick') 
          | 未找到审批人
          span.color73B1 {{monitorParam.noExist}}
        span.countspan(@click='leaveClick') 
          | 审批人离职
          span.color73B1 {{monitorParam.leave}}
        span.color73B1(@click='backList') 返回列表
    //- 筛选icon
    div.termFilterDiv(v-if='termFilterDivShow')
      span 条件筛选：
      el-tag(:key='tag',size='small',type='info', v-for='tag in dynamicTags', closable='', :disable-transitions='false', @close='tagHandleClose(tag)')
        span.punctuation
        | {{tag}}
      span(style="color:rgba(60,115,177,1);cursor: pointer",@click='dynamicTagsCloseAll') 清空筛选条件
    div.tableContent(v-bind:class='{tablemin: termFilterDivShow}')
      el-table.tableContentScroll(:data='tableList', height='200')
        el-table-column(label='序号', type="index")
        el-table-column(v-for='(column, key) in colums',:min-width='column.width', :sortable="column.pro  == 'endFlowApplyTime'", :prop='column.pro', :label='column.label', :key='column.pro')
          template(slot-scope='scope')
            template(v-if="column.pro === 'prcessStatus'")
              span.color9D(v-if='scope.row.prcessStatus === "0"') 处理中
              span.color6F(v-else-if='scope.row.prcessStatus === "1"') 不同意
              span.color6F(v-else-if='scope.row.prcessStatus === "2"') 退回
              span.color6F(v-else-if='scope.row.prcessStatus === "3"') 已撤销
              span.colorFE(v-else-if='scope.row.prcessStatus === "4"') 审批完成
              span(v-else) ---
            template(v-else-if="column.pro === 'relationFormCode'")
              span {{processFormType.obj[scope.row.relationFormCode] || '---'}}
            template(v-else)(slot-scope='scope')
              | {{scope.row[column.pro] || '---'}}
        el-table-column(label='操作',width="120")
          template(slot-scope='scope')
            el-tooltip.rowHandle(effect='dark', content='查看用时',popper-class="tips", placement='bottom')
              i.iconfont.icon-shijian(@click='editRow(scope.row)')  
            template(v-if='scope.row.prcessStatus === "0"')
              el-tooltip.rowHandle(effect='dark', content='强制流转',popper-class="tips", placement='bottom')
                i.iconfont.icon-qiangzhi(@click='roamHandleRow(scope.row)')  
              el-tooltip.rowHandle(effect='dark', content='更改临时审批人',popper-class="tips", placement='bottom')
                i.iconfont.icon-renyuanbianji(@click='changeRow(scope.row)')
            template(v-else)
              span.iconHide
                i.iconfont.icon-qiangzhi(disabled='true')
              span.iconHide
                i.iconfont.icon-renyuanbianji
        empty(slot="empty",:visible = 'visible')      

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
        
      .dialog-footer(slot='footer')
        el-button(type='primary', @click="submitForm('listParam',termFilterFormsubmit)",size='medium') 确 定
        el-button(@click="termFilterFormReset('listParam')",size='medium') 取 消
    //- 1.查看用时
    el-dialog(title='时效分析', :visible.sync='seeFormShow', style='margin:0 auto', :close-on-click-modal='false',width="570px")
      div(style='padding: 0 5px 18px')
        | 审批单号 ： {{seeformNo}}
      div.seetableDiv
        el-table(:data='seetable')
          el-table-column(v-for='(column, key) in seecolums',:min-width='column.width', :sortable="column.pro  == 'endFlowApplyTime'", :prop='column.pro', :label='column.label', :key='column.pro')
            template(slot-scope='scope')
              template(v-if='column.pro === "nodeName"')
                | {{scope.row[column.pro] || '---'}}
              template(v-else)
                | {{scope.row[column.pro]}}
          empty(slot="empty")    
      .dialog-footer(slot='footer')
        el-button(@click="termFilterFormReset('listParam')",size='medium') 取 消
    //- 2.强制流转
    el-dialog(title='强制流转', :visible.sync='roamFormShow', style='margin:0 auto', :close-on-click-modal='false',width="570px")
      el-form.elForm(:model='roamParam',v-if="roamFormShow",ref='roamParam',:rules='roamRules',label-width="120px",size='medium')  
        el-form-item(label='审批单号')
          span {{rowParam.formNo}}
        el-form-item(label='当前审批步骤')
          span {{rowParam.nodeCodeName}}
        el-form-item(label='当前审批人')
          span {{rowParam.curHandleUserName}}
        el-form-item(label='流转至步骤',prop='roamNodeCode')
          el-select.width360(v-model='roamParam.roamNodeCode', placeholder='请选择')
            el-option(v-for='item in roamNodeCodelist', :key='item.nodeCode', :label='item.nodeName', :value='item.nodeCode') {{item.nodeName}}
        el-form-item(label='处理意见',prop='handleOpinionDesc')
          el-input.width360(v-model='roamParam.handleOpinionDesc', type='textarea')
      .dialog-footer(slot='footer')
        el-button(type='primary', @click="submitForm('roamParam',roamFormsubmit)",size='medium') 确 定
        el-button(@click="termFilterFormReset('roamParam')",size='medium') 取 消
    //- 更改临时审批人
    el-dialog(title='更改临时审批人', :visible.sync='changeFormShow', style='margin:0 auto', :close-on-click-modal='false',width="570px")
      el-form.elForm(:model='changeParam',v-if="changeFormShow",ref='changeParam',:rules='changeRules',label-width="120px",size='medium')  
        el-form-item(label='审批单号')
          span {{rowParam.formNo}}
        el-form-item(label='当前审批步骤')
          span {{rowParam.nodeCodeName}}
        el-form-item(label='当前审批人')
          span {{rowParam.curHandleUserName}}
        el-form-item(label='当前步骤审批人',prop='userId')
          el-select.width360(v-model='deptLeaderName', placeholder='请选择当前步骤审批人')
            template(slot-scope='scope')
              selectMem(:treeData='distributeOptions', @select='selectMem', :clear='deptLeaderName')
              el-option(v-for='(item,index) in [0]', :key='index', :value='item.id')
      .dialog-footer(slot='footer')
        el-button(type='primary', @click="submitForm('changeParam',changeFormsubmit)",size='medium') 确 定
        el-button(@click="termFilterFormReset('changeParam')",size='medium') 取 消
</template>
<script>
import "../../commons/publicCss/outside.sass"
import {mapState} from 'vuex'
import pagination from "../../components/pagination"
import selectMem from "../../components/selectMem"
import empty from "@/components/empty";
export default {
  name: 'progressList',
  components:{pagination,selectMem,empty},
  data () {
    return {
      visible: false,
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
          label : '审批名称',
          width: '200px'
        },
        {
          pro : 'relationFormCode',
          label : '审批类型',
          width: '100px'
        },
        {
          pro : 'applyUserName',
          label : '申请人',
          width: '100px'
        },
        {
          pro : 'applyDeptName',
          label : '申请人部门',
          width: '150px'
        },
        {
          pro : 'flowApplyTime',
          label : '申请发起时间',
          width: '160px'
        },
        {
          pro : 'nodeCodeName',
          label : '当前步骤',
          width: '200px'
        },
        {
          pro : 'curHandleUserName',
          label : '当前审批人',
          width: '100px'
        },
        {
          pro : 'curHandleCostTime',
          label : '当前步骤停留用时(小时)',
        },
        {
          pro : 'prcessStatus',
          label : '状态',
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
      inpageNum:1,
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
      // 1.查看用时
      seeFormShow: false,
      seetable:[],
      seeformNo:'',
      seecolums:[
        {
          pro:'nodeName',
          label: '步骤名称'
        },
        {
          pro:'agingTime',
          label: '步骤用时（小时）'
        }
      ],
      // 强制流转
      roamFormShow: false,
      rowParam:{
        formNo:'--',
        nodeCodeName:'--',
        curHandleUserName:'--',
      },
      roamParam:{
        roamNodeCode:'',
        handleOpinionDesc:''
      },
      roamNodeCodelist:{},
      roamRules:{
        roamNodeCode:[
          {required:true, message: '请选择流转的步骤', trigger: 'change'}
        ],
        handleOpinionDesc:[
          {required:true,message: '请填写', trigger: 'change'},
          {max: 100,required:true,message: '最多100个字符', trigger: 'change'}
        ]
      },
      // 更改临时审批人
      changeFormShow: false,
      deptLeaderName:'',
      changeParam:{
        userId:''
      },
      changeRules:{
        userId: [
          {required: true, message: '请选择汇报对象', trigger: 'blur' }
        ]
      },
      // 异常
      monitorParam: {
        noExist:'0',
        leave:'0'
      },
      // 时间区间
      datePicker: [],
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
      }
    },
    roamFormShow(val){
      if(!val){
        this.$refs['roamParam'].resetFields()
      }
    },
    // 更改审批联系人
    changeFormShow(val){
      if(!val){
        this.changeParam.userId = ''
        this.deptLeaderName = ''
      }
    },
    deptLeaderName(val){
      if(val){
        this.$refs['changeParam'].clearValidate('userId')
      }
    }
    
  },
  computed:{
    // 审批类型
    processFormType() {
      return this.$store.state.selectData.processFormType;
    },
    // treeMem(){
    //   return this.$store.state.selectData.orgTreeBaseInfo;
    // },
  },
  created () {
    // 1.加载table列表
    this.getList()
    // 加载部门下拉框
    this.$store.dispatch('getOrgTreeExtInfo').then( obj =>{
      this.distributeOptions = obj
    })
    // 2.加载异常列表
    this.$api.exceptionMonitor().then(res => {
      if(res.data.data!=null){
        this.monitorParam = res.data.data
      }
    })
  },
  methods: {
    // 返回列表
    backList(){
      this.listParam.curHandleUserStatus = ''
      this.getList()
    },
    // load列表
    getList(){
      this.$api.monitorList(this.listParam).then(res => {
        this.tableList = res.data.data.list
        this.totlePage = res.data.data.total
        if(this.tableList.length == 0){
          this.visible = true
        }
      })
    },
    // 搜索
    searchBtnClick(){
      this.listParam.pageNum = 1
      this.inpageNum = 1
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
    // 查看用时
    editRow(row){
      this.seeformNo = row.formNo
      this.seeFormShow = true
      this.$api.analysis({flowDefinitionId:row.flowDefinitionId,processInstanceId:row.processInstanceId}).then(res=>{
        // console.log(res.data)
        this.seetable = res.data.data.nodeAgingList
        this.seetable.push({nodeName:'总用时(小时)',agingTime:res.data.data.totalTime})
      })
    },
    // 强制流转
    roamHandleRow(row){
      this.rowParam = row
      this.roamParam = row
      this.$api.lastnode({curNodeCode:row.curNodeCode,processInstanceId:row.processInstanceId}).then(res=>{
        this.roamNodeCodelist = res.data.data
        this.roamFormShow = true
      })
    },
    // 强制流转 确定
    roamFormsubmit(row){
      this.$api.forceroam(this.roamParam).then(res=>{
        this.$message.success(res.data.messages)
        this.roamFormShow = false 
        this.getList()
      })
    },
    // 列表-更改临时审批人
    changeRow(row){
      this.rowParam = row
      // this.changeParam = row
      this.changeFormShow = true
    },
    // input-临时审批人
    selectMem(obj){
      this.changeParam.userId = obj.mem.userId
      this.deptLeaderName = obj.mem.userName
    },
    // 提交-更改临时审批人
    changeFormsubmit(){
      this.rowParam.handleUserId = this.changeParam.userId
      this.$api.assignee(this.rowParam).then(res => {
        this.$message.success(res.data.messages)
        this.changeFormShow = false
        this.getList()
      })
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
      this.listParam.endFlowApplyTime = this.datePicker[1]
      let datePicker = this.datePicker[0] + ' 至 ' + this.datePicker[1]
      if(this.datePicker[0]!==undefined){
        this.tagsPush(datePicker,'发起时间')
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
      }
      this.inpageNum = 1
      this.listParam.pageNum = 1
      this.getList()
    },
    // 取消按钮
    termFilterFormReset(formName) {
      this.termFilterFormShow = false
      // 分析
      this.seeFormShow = false
      // 流转
      this.roamFormShow = false
      this.changeFormShow = false
    },
    // 
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
    // 异常统计点击-未找到
    noExistClick(){
      if(this.monitorParam.noExist == '0'){
        this.$message.error('暂无数据')
        return;
      }
      this.listParam.curHandleUserStatus = 1
      this.getList()
    },
    // 异常统计点击-离职
    leaveClick(){
      if(this.monitorParam.leave == '0'){
        this.$message.error('暂无数据')
        return;
      }
      this.listParam.curHandleUserStatus = 2
      this.getList()
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
    }
  }
}
</script>
<style lang="sass" scoped>
#progressList
  .tableContent
    height: calc(100% - 85px)
  .tablemin
    height: calc(100% - 110px) !important
  .seetableDiv
    min-height: 263px
    border: 1px solid #DCDFE6
    overflow-x: auto
  .countDiv
    font-size: 12px
    margin-top: 10px
    color: #555555
    .countspan
      cursor: pointer
      padding: 5px 8px
    .countspan:hover
      border-radius: 3px
      background: #10B2FF
      color: #ffffff
      .color73B1
        color: #ffffff !important
  .color73B1
    color: #3ab9f7 !important
    padding-left: 10px
    cursor: pointer
</style>
