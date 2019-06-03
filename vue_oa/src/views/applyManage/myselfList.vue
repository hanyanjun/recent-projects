<template lang="pug">
#myselfList
  div.listWrapNoScroll.companyCommon.companyList.borderScroll
    div.topTitlediv
      div.tableTitleRight 我发起的审批
      div.tableTitleLeft
        //- el-input.inputSearch.width290(placeholder='请输入',size='small',maxlength="20", v-model='searchUserName'  v-on:keyup.native.enter='searchBtnClick')
        //- i.el-icon-search(@click='searchBtnClick')
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
        el-table-column(label='操作',width="130")
          template(slot-scope='scope')
            //- 退回 已撤销-能编辑
            template(v-if='scope.row.prcessStatus === "2" || scope.row.prcessStatus === "3"')
              span(v-if='scope.row.relationFormCode != "common"')
                el-tooltip.rowHandle(effect='dark', content='编辑',popper-class="tips", placement='bottom')
                  i.iconfont.icon-bianji(@click='editRow(scope.row)')
              span(v-else)
                //- i.iconfont.icon-bianji
                el-tooltip.rowHandle(effect='dark', content='查看',popper-class="tips", placement='bottom')
                  i.iconfont.icon-yulan(@click='editRow(scope.row)')
            //- 否者 只能查看
            template(v-else)
              el-tooltip.rowHandle(effect='dark', content='查看',popper-class="tips", placement='bottom')
                i.iconfont.icon-yulan(@click='editRow(scope.row)')
            template(v-if='scope.row.prcessStatus === "0"')
              template(v-if='scope.row.urgent === "Y"')
                el-tooltip.rowHandle(effect='dark', content='已催办',popper-class="tips", placement='bottom',style='cursor: no-drop;')
                  i.iconfont.icon-cuiban
              template(v-if='scope.row.urgent === "N"')
                el-tooltip.rowHandle(effect='dark', content='催办',popper-class="tips", placement='bottom')
                  i.iconfont.icon-cuiban(@click='todoRow(scope.row)')
              el-tooltip.rowHandle(effect='dark', content='撤销',popper-class="tips", placement='bottom')
                i.iconfont.icon-chexiao1(@click='revokeRow(scope.row)')   
            template(v-else)
              span.iconHide
                i.iconfont.icon-cuiban
              span.iconHide
                i.iconfont.icon-chexiao1
        empty(slot="empty", :visible='visible')          
      //- 分页
      pagination(@size-change='SizeChange', @current-change='CurrentChange',background, :sizes='[10, 20, 30, 40]', :size='20', layout='total, sizes, prev, pager, next, jumper', :total='totlePage')
    //- 筛选-弹出框
    el-dialog(title='筛选条件', :visible.sync='termFilterFormShow', style='margin:0 auto', :close-on-click-modal='false',width="570px")
      el-form.elForm(:model='listParam',v-if="termFilterFormShow",ref='listParam',:rules='listRules',label-width="120px",size='medium')  
        el-form-item(label='审批状态')
          el-select.width360(v-model='listParam.prcessStatus',clearable, placeholder='请选择')
            el-option(v-for='item in processStatus.list', :key='item.code', :label='item.name', :value='item.code') {{item.name}}
        el-form-item(label='审批名称',prop='templateName')
          el-input.width360(v-model.trim='listParam.templateName', placeholder='请输入')
        el-form-item(label='审批类型')
          el-select.width360(v-model='listParam.relationFormCode',clearable, placeholder='请选择')
            el-option(v-for='item in processFormType.list', :key='item.code', :label='item.name', :value='item.code') {{item.name}}
        //- el-form-item(label='发起时间')
        //-   el-date-picker.width360(v-model='listParam.startFlowApplyTime', type='date',value-format="yyyy-MM-dd")
        //- el-form-item(label='最后审批时间')
        //-   el-date-picker.width360(v-model='listParam.endFlowApplyTime', type='date',value-format="yyyy-MM-dd")
        el-form-item(label='发起时间')
          el-date-picker.width360(v-model='datePicker', type='daterange', align='right', unlink-panels='',value-format="yyyy-MM-dd", range-separator='至', start-placeholder='开始时间', end-placeholder='结束时间')
        el-form-item(label='最后审批时间')
          el-date-picker.width360(v-model='datePicker2', type='daterange', align='right', unlink-panels='',value-format="yyyy-MM-dd", range-separator='至', start-placeholder='开始时间', end-placeholder='结束时间')
      
      .dialog-footer(slot='footer')
        el-button(type='primary', @click="submitForm('listParam',termFilterFormsubmit)",size='medium') 确 定
        el-button(@click="termFilterFormReset('listParam')",size='medium') 取 消
  //- 确认撤销
  el-dialog(title='确认撤销', :visible.sync='revokeFormShow', style='margin:0 auto', :close-on-click-modal='false',width="570px")
    el-form.elForm(:model='revokeParam',ref='revokeParam',:rules='revokeRules',label-width="90px",size='medium')  
      el-form-item(label='原因',prop='cancelReason')
        el-input.width360.cancelReason(v-model.trim='revokeParam.cancelReason',type='textarea', placeholder='请输入')
    .dialog-footer(slot='footer')
      el-button(type='primary', @click="submitForm('revokeParam',revokeFormsubmit)",size='medium') 确 定
      el-button(@click="termFilterFormReset('revokeParam')",size='medium') 取 消   
</template>
<script>
import "../../commons/publicCss/outside.sass"
import {mapState} from 'vuex'
import pagination from "../../components/pagination"
import empty from "@/components/empty";
export default {
  name: 'myselfList',
  components:{pagination,empty},
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
        },
        {
          pro : 'relationFormCode',// 代号
          label : '审批类型',
          width: '90px'
        },
        {
          pro : 'nodeCodeName',
          label : '当前步骤',
          width: '100px'
        },
        {
          pro : 'curHandleUserName',
          label : '当前审批人',
          width: '100px'
        },
        {
          pro : 'flowApplyTime',
          label : '申批发起时间',
          width: '160px'
        },
        {
          pro : 'lastOperTime',
          label : '最后审批时间',
          width: '160px'
        },
        {
          pro : 'prcessStatus',
          label : '状态',
        }
      ],
      listParam: {
        pageNum:1,
        pageSize:20,
        prcessStatus: '',
        templateName:'',//名称
        relationFormCode: '',//审批类型
        startFlowApplyTime: '',//发起时间
        endFlowApplyTime: '',//最后审批时间
      },
      totlePage: 0,
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
      // 撤销
      revokeFormShow: false,
      revokeParam:{
        cancelReason: '',
        processInstanceId: '',//流程实例id
        relationFormCode:''//表单类型代号
      },
      revokeRules:{
        cancelReason:[
          {required:true,message: '请填写撤销原因', trigger: 'change'}
        ]
      },
      // 时间区间
      datePicker: [],
      datePicker2: [],
      inpageNum:1
    }
  },
  watch: {
    searchUserName (val) {
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
          prcessStatus: '',
          templateName:'',
          relationFormCode: '',
          startFlowApplyTime: '',
          endFlowApplyTime: '',
        }
        this.datePicker = []
        this.datePicker2 = []
      }
    },
    revokeFormShow (val){
      if(!val){
        this.$refs['revokeParam'].resetFields()
      }
    }
  },
  computed:{
    // 审批状态
    processStatus(){
      return this.$store.state.selectData.processStatus;
    },
    // 审批类型
    processFormType() {
      return this.$store.state.selectData.processFormType;
    }
  },
  created () {
    // 1.加载table列表
    this.getList()
  },
  methods: {
    // load列表
    getList(){
      this.$api.myselfList(this.listParam).then(res => {
        this.tableList = res.data.data.list
        this.totlePage = res.data.data.total
        if(this.tableList.length == 0){
          this.visible = true
        }
      })
    },
    // 搜索
    searchBtnClick(){
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
      if(row.prcessStatus === "0"){//审批中
        window.sessionStorage['applyState'] = 3 //催办，撤销按钮显示
      }else if(row.prcessStatus === "2" || row.prcessStatus === '3'){ //已撤销，退回
         window.sessionStorage['applyState'] = 0 //提交按钮显示
      }else{
         window.sessionStorage['applyState'] = 2 //查看表单
      }
      window.sessionStorage['apply'] = JSON.stringify(row);
      this.$router.push({name : 'approval'+row.relationFormCode})
    },
    // 催办
    todoRow(row){
      this.$api.sendUrgent({processInstanceId:row.processInstanceId,templateName:row.templateName}).then(res => {
          this.$message.success(res.data.messages)
          this.getList()
      })
    },
    // 撤销
    revokeRow(row){
     this.revokeFormShow = true
     this.revokeParam.processInstanceId =  row.processInstanceId
     this.revokeParam.relationFormCode =  row.relationFormCode
     this.revokeParam.templateName =  row.templateName
    },
    // 撤销确认
    revokeFormsubmit(){
      this.$api.processCancel(this.revokeParam).then(res => {
        this.$message.success(res.data.messages)
        this.getList()
        this.revokeFormShow = false
      })
    },
    // 筛选
    filterHandle () {
      this.termFilterFormShow = true
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
      // 审批类型
      let prcessStatus = this.$store.state.selectData.processStatus.obj[this.listParam.prcessStatus]
      this.tagsPush(prcessStatus,'审批状态')
      // 审批名称
      this.tagsPush(this.listParam.templateName,'审批名称')
      // 审批类型
      let processFormType = this.$store.state.selectData.processFormType.obj[this.listParam.relationFormCode]
      this.tagsPush(processFormType,'审批类型')
      // 发起时间
      this.listParam.startFlowApplyTime = this.datePicker[0]
      this.listParam.endFlowApplyTime = this.datePicker[1]
      let datePicker = this.datePicker[0] + ' 至 ' + this.datePicker[1]
      if(this.datePicker[0]!==undefined){
        this.tagsPush(datePicker,'发起时间')
      }
      
      // 最后审批时间
      this.listParam.lastStartFlowApplyTime = this.datePicker2[0]
      this.listParam.lastEndFlowApplyTime = this.datePicker2[1]
      let datePicker2 = this.datePicker2[0] + ' 至 ' + this.datePicker2[1]
      if(this.datePicker2[0]!==undefined){
        this.tagsPush(datePicker2,'最后审批时间')
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
        case "审批状态":
          this.listParam.prcessStatus = ''
        case "审批名称":
          this.listParam.templateName = ''
        break;
        case "审批类型":
          this.listParam.relationFormCode = ''
        break;
        case "发起时间":
          this.listParam.startFlowApplyTime = ''
          this.listParam.endFlowApplyTime = ''
          this.datePicker = []
        break;
        case "最后审批时间":
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
      // 筛选
      this.termFilterFormShow = false
      // 撤销
      this.revokeFormShow = false
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
#myselfList
</style>
