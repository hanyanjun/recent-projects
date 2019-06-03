<template lang="pug">
#timeDialog
  el-dialog.turnEmployeeDialog(:title='title',:dialogShow='dialogShow',:visible.sync='visibleDialogShow', style='margin:0 auto', :close-on-click-modal='false',:width='widthDialog')
    //- 修改年假
    //- el-form.elForm.dialogForm(:model='changeFrom',ref='changeFrom',:rules='changeFromRule',v-if='dialogCode=="1" ? true: false',label-width="140px",size="medium")
      el-form-item(label='本年可用年假时长', prop='validAnnual')
        el-input.width360(v-model='changeFrom.validAnnual')
    //- .dialog-footer(slot='footer',v-if='dialogCode=="1" ? true: false')
        el-button(type='primary', @click="submitForm('changeFrom',changeFormsubmit)",size='medium') 确 定
        el-button(@click="reset('changeFrom')",size='medium') 取 消  
    //- 编辑考勤设备
    el-form.elForm.dialogForm(:model='editDeviceFrom',ref='editDeviceFrom',:rules='editDeviceRule',v-if='dialogCode=="2"?true:false',label-width="130px",size="medium")
      el-form-item(label='考勤设备', prop='sn')
        el-checkbox-group(v-model='editDeviceFrom.sn')
          el-checkbox(v-for='item in deviceArr', :value='item.deviceNo', :label='item.deviceNo', :key='item.deviceNo') {{item.deviceRemark}} ({{item.deviceNo}})
    .dialog-footer(slot='footer',v-if='dialogCode=="2" ? true: false')
      el-button(type='primary', @click="submitForm('editDeviceFrom',editDevicesubmit)",size='medium') 确 定
      el-button(@click="reset('editDeviceFrom')",size='medium') 取 消
    //- 查看时间
    el-form.elForm.dialogForm(:model='seeTimeFrom',ref='seeTimeFrom',v-if='dialogCode=="3"||dialogCode=="4"||dialogCode=="5" ?true:false',size="medium")
      el-form-item(label='')
        el-select(v-model='seeTimeFrom.queryTime',@change='changedate')
          el-option(v-for='item in dateArr', :value='item.code', :label='item.name', :key='item.code') {{item.name}}  
      div.seetableDiv
        el-table(:data='seetable',height='381px')
          //- 加班table
          el-table-column(v-if='dialogCode=="5"',v-for='(column, key) in jiabancolums',:min-width='column.width', :sortable="column.pro  == 'endFlowApplyTime'", :prop='column.pro', :label='column.label', :key='column.pro')
            template(slot-scope='scope')
              template(v-if="column.pro === 'approveNum'")
                span.class11(@click.stop='skipForm(scope.row)') {{scope.row.approveNum}}
              template(v-else-if="column.pro === 'prcessStatus'")
                span {{processState.obj[scope.row.prcessStatus]}}
              template(v-else-if="column.pro === 'datePro'")
                span {{scope.row.startTime}} 至 {{scope.row.endTime}}
              template(v-else)
                | {{scope.row[column.pro]}}
          //- 请假table
          el-table-column(v-if='dialogCode=="3"||dialogCode=="4"',v-for='(column, key) in seecolums',:min-width='column.width', :sortable="column.pro  == 'endFlowApplyTime'", :prop='column.pro', :label='column.label', :key='column.pro')
            template(slot-scope='scope')
              template(v-if="column.pro === 'approveNum'")
                span.class11(@click.stop='skipForm(scope.row)') {{scope.row.approveNum}}
              template(v-else-if="column.pro === 'prcessStatus'")
                span {{processState.obj[scope.row.prcessStatus]}}
              template(v-else-if="column.pro === 'datePro'")
                span {{scope.row.leaveStartTime}} 至 {{scope.row.leaveEndTime}}
              template(v-else)
                | {{scope.row[column.pro]}}
          empty(slot="empty",:visible='visible')
    .dialog-footer(slot='footer',v-if='dialogCode=="3"||dialogCode=="4"||dialogCode=="5" ? true: false')
      el-button(@click="reset()",size='medium') 取 消  
</template>
<script>
import "../../commons/publicCss/outside.sass"
import empty from "@/components/empty"
export default {
  name: 'timeDialog',
  components:{empty},
  data () {
    return {
      visible: false,
      userId:'',
      title:'',
      widthDialog:'570px',
      visibleDialogShow: false,
      // 1.修改年假
      changeFromShow: false,
      changeFrom:{
        validAnnual:''
      },
      changeFromRule:{
        validAnnual:[
          {required:true,message: '请填写本年可用年假时长', trigger: 'blur'},
        ]
      },
      
      // 2.编辑考勤设备
      deviceArr:[],
      editDeviceShow: false,
      editDeviceFrom:{
        sn:['Q10180110144']
      },
      editDeviceRule:{
        sn:{type:'array',required:true,message: '请至少选择一种考勤设备', trigger: 'blur'}
      },
      // 3.查看时间
      seeTimeFrom: {
        queryTime:1
      },
      dateArr:[
        {name:'近一个月',code:1},
        {name:'近三个月',code:3},
      ],
      seetable:[],
      seecolums:[
        {
          pro:'approveNum',
          label: '审批单号'
        },
        {
          pro:'datePro',
          label: '请假时间',
          width: '210px'
        },
        {
          pro:'leaveHour',
          label: '请假时长（小时）'
        },
        {
          pro:'curStep',
          label: '当前步骤'
        },
        {
          pro:'prcessStatus',
          label: '状态'
        },
        {
          pro:'applyDate',
          label: '申请日期'
        }
      ],
      jiabancolums:[
        {
          pro:'approveNum',
          label: '审批单号'
        },
        // {
        //   pro:'datePro',
        //   label: '加班时间',
        //   width: '210px'
        // },
        {
          pro:'duration',
          label: '加班时长（小时）'
        },
        {
          pro:'curStep',
          label: '当前步骤'
        },
        {
          pro:'prcessStatus',
          label: '状态'
        },
        {
          pro:'applyDate',
          label: '申请日期'
        }
      ],
    }
  },
  computed:{
    // 审批状态
    processState(){
      return this.$store.state.selectData.processStatus
    }
  },
  props:{
    dialogShow:{
      type: Boolean,
      default : false
    },
    dialogCode:{
      type: String,
      default : false
    },
    deviceSn:{
      type: Array,
      default : []
    },
    is_personal:{
      type : Boolean,
      default : false
    }
  },
  watch: {
    // 关键就是父级传过来的props，不能在子级里面随意改变(弹窗的打开、关闭)状态
    dialogShow(val){
      if(val){ //打开弹窗
        this.changeDialog()
        this.visibleDialogShow = true
      }
    },
    visibleDialogShow(val){
      if(!val){ //关闭弹窗 - 传给父级告诉弹窗关闭
        if (this.$refs['changeFrom'] !== undefined) {
          this.$refs['changeFrom'].resetFields()
        }
        if (this.$refs['editDeviceFrom'] !== undefined) {
          this.$refs['editDeviceFrom'].resetFields()
        }

        this.$emit("dialogShowFalse",{do:'close'})
      }else{
        if (this.$refs['changeFrom'] !== undefined) {
          this.$refs['changeFrom'].clearValidate()
        }
        if (this.$refs['editDeviceFrom'] !== undefined) {
          this.$refs['editDeviceFrom'].clearValidate()
        }
        
      }
    }
  },
  created(){
    // 1.编辑用户id
    this.userId = localStorage.getItem('editUserId')

    // 2.加载设备列表
    this.$api.getAvailableDevice().then(res=>{
      this.deviceArr = res.data.data
    })
  },
  methods: {
    changeDialog(){
      if(!this.is_personal){
        this.seeTimeFrom={userId:this.userId ,queryTime:1}
      }else{
        this.seeTimeFrom={queryTime:1}
      }
      switch(this.dialogCode){
        case'1':
          this.widthDialog = '570px'
          this.title = '修改年假'
          // 映射可用年假
          // this.changeFrom.validAnnual = this.validAnnual
        break;
        case'2':
          this.widthDialog = '570px'
          this.title = '修改考勤设备'
          // 映射考勤
          let deviceSn = []
          this.deviceSn.forEach(val => {
            deviceSn.push(val.deviceNo)
          });
          this.editDeviceFrom.sn = deviceSn
        break;
        case'3':
          this.widthDialog = '70%'
          this.title = '年假请假记录'
          this.seeTimeFrom.leaveType = '0'
          // load列表
          this.loadDateTable()
        break;
        case'4':
          this.widthDialog = '70%'
          this.title = '调休记录'
          this.seeTimeFrom.leaveType = '1'
          // load列表
          this.loadDateTable()
        break;
        case'5':
          this.widthDialog = '70%'
          this.title = '加班记录'
          // load列表
          this.loadOvertimeTable()
        break;
      }
    },
    // 1.修改年假
    changeFormsubmit(){
      this.changeFrom.userId = this.userId
      this.$api.validAnnualEdit(this.changeFrom).then(res=>{
        this.$message.success(res.data.messages)
        this.visibleDialogShow = false
        // 将新的数据传给父级
        // this.$emit('dialogShowFalse',this.changeFrom.validAnnual)
      })
    },
    // 2.修改设备
    editDevicesubmit(){
      let editDeviceFrom = Object.assign({},this.editDeviceFrom)
      editDeviceFrom.sn = String(editDeviceFrom.sn)
      editDeviceFrom.userId = this.userId
      this.$api.deviceEdit(editDeviceFrom).then(res=>{
        this.$message.success(res.data.messages)
        this.visibleDialogShow = false
        this.$emit('dialogShowFalse',{do:'change',obj:editDeviceFrom.sn})
      })
    },
    // 3.查看年假切换月份
    changedate(){
      if(this.title === '加班记录'){
        this.loadOvertimeTable()
      }else{
        this.loadDateTable()
      }
    },
    // 请假调休table
    loadDateTable(){
      this.visible = false
      this.seeTimeFrom.leaveType= Number(this.seeTimeFrom.leaveType)
      this.seeTimeFrom.queryTime= Number(this.seeTimeFrom.queryTime)
      if(this.is_personal){
        this.$api.getOwnLeaveLog(this.seeTimeFrom).then(res=>{
          this.seetable = res.data.data
          this.visible = true
        })
      }else{
        this.$api.getLeaveLog(this.seeTimeFrom).then(res=>{
          this.seetable = res.data.data
          this.visible = true
        })
      }
    },
    // 加班table
    loadOvertimeTable(){
      this.visible = false
      if(this.is_personal){
        this.$api.getOwnOverTimeLog(this.seeTimeFrom).then(res=>{
          this.seetable = res.data.data
          this.visible = true
        })
      }else{
        this.$api.getOverTimeLog(this.seeTimeFrom).then(res=>{
          this.seetable = res.data.data
          this.visible = true
        })
      }
    },
    // 取消按钮
    reset(formName){
      this.visibleDialogShow = false
    },
    // 跳转至表单页面
    skipForm(row){ 
      console.log(row)
      window.sessionStorage['applyState'] = 2 //查看表单
      let base =  Object.assign({},row);
      base.prcessStatus = Number(base.prcessStatus)
      base.formNo = row.approveNum;
      if(this.dialogCode == '3'|| this.dialogCode == '4'){
        base.relationFormCode = 'leave'
        this.$router.push({name : 'approvalleave'})
      }else if(this.dialogCode == '5'){
        base.relationFormCode = 'overtime'
        this.$router.push({name : 'approvalovertime'})
      }
      window.sessionStorage['apply'] = JSON.stringify(base);
    },
    // 提交校验格式
    submitForm (formName, callBack) {
      if(this.$refs[formName] !==undefined){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            return callBack()
          } else {
            console.log('格式 error')
            return false
          }
        })
      }
    },
   
  }
}
</script>
<style lang="sass"  scoped>
#timeDialog
  .el-checkbox
    margin: 0 30px 0 0px
  .seetableDiv
    min-height: 381px
    border: 1px solid #DCDFE6
    overflow-x: auto
</style>
