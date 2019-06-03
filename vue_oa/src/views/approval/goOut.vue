<template lang="pug">
  #goOut
    div.rightTitle  {{templateName}}
    i.backIcon(class="iconfont icon-fanhui pointer", @click="backManage")
    div.clearBoth
      //- contentDivShow 当为true时，form的宽度要-450px
      div.editContentDiv(v-bind:class='{contentDivShow: waitRecord}')
        el-form.elForm(:model='editForm', :rules="editFormRules", ref="editForm",v-bind:class='[wait==0? "waitFormClass":""]', label-width="120px",size='medium')  
          el-form-item.padleft12(label='审批单号')
            span.color5CD(v-if='!waitRecord') 提交后系统自动生成
            span.fontC6(v-else) {{editForm.approveNum}}
          div.floatLeft.width614
            el-form-item.padleft12(label='申请人')
              span.fontC6(v-if='wait') {{baseForm.name}}
              span.fontC6(v-else) {{baseRes.approveUserName}}
            el-form-item.padleft12(label='部门')
              span.fontC6(v-if='wait') {{baseForm.deptName}}
              span.fontC6(v-else) {{baseRes.approveUserPositionName}}
          div.floatLeft
            el-form-item.padleft12(label='申请人职位')
              span.fontC6(v-if='wait') {{baseForm.position}}
              span.fontC6(v-else) {{baseRes.approveUserDeptName}}
            el-form-item.padleft12(label='申请日期')
              span.fontC6 {{editForm.approveDate}}
          el-row.clearBoth
            div.floatLeft.width614
              el-form-item(label='外出时间', prop='goOutTime')
                el-date-picker.width80(v-model='editForm.goOutTime',v-if='wait',type='datetime',:clearable='clearable',value-format='yyyy-MM-dd HH:mm',format='yyyy-MM-dd HH:mm')
                span.fontC6(v-else) {{editForm.goOutTime}}
            div.floatLeft.width614
              el-form-item(label='预计返回时间', prop='goBackTime')
                el-date-picker.width80(v-model='editForm.goBackTime',v-if='wait',type='datetime',:clearable='clearable',value-format='yyyy-MM-dd HH:mm',format='yyyy-MM-dd HH:mm')
                span.fontC6(v-else) {{editForm.goBackTime}}
          el-form-item.clearBoth(label='外出原因', prop='reason')
            el-input.width70(v-model='editForm.reason',v-if='wait', type='textarea',placeholder='1-1000位字符',maxLength='1000')
            span.fontC6.spanText(v-else) {{editForm.reason}}
          el-form-item.dialog-footer.applyBtn(v-if='applyBtn')
            el-button(@click="formsubmit('editForm')",size='medium',type='primary') 提 交
            el-button(@click="backManage",size='medium') 取 消  
          el-form-item.dialog-footer.waitButton(v-if='listBtn')
            el-button(@click="formAgree('editForm')",size='medium',type='primary') 同意
            el-button(@click="formDisagree('editForm')",size='medium', type='danger',plain) 不同意
            el-button(@click="formRecall('editForm')",size='medium', type='success',plain) 退回给申请人
            el-button(@click="backManage",size='medium') 返 回 
          el-form-item.dialog-footer.agreeBtn(v-if="agreeBtn")
            el-button(@click="backManage",size='medium') 返 回 
          //- todo(:row='todoRow',@backManage='backManage',v-if='waitTodo')
      div.status.floatLeft.rightRecord(v-if='waitRecord')
        speed(:list="record")
    //- 确认撤销
    el-dialog(:title='title', :visible.sync='revokeFormShow', style='margin:0 auto', :close-on-click-modal='false',width="570px")
        el-form.elForm(:model='revokeParam',ref='revokeParam',:rules='revokeRules',label-width="80px",size='medium')  
          el-form-item(v-if='title=="同意申请"?true:false',label='原因')
            el-input.width360.cancelReason(v-model.trim='revokeParam.cancelReason',type='textarea', placeholder='0-100字符')
          el-form-item(v-else,label='原因',prop='cancelReason')
            el-input.width360.cancelReason(v-model.trim='revokeParam.cancelReason',type='textarea', placeholder='1-100字符',maxLength = '100')
        .dialog-footer(slot='footer')
          el-button(v-if='title=="同意申请"?true:false',type='primary', @click="revokeFormsubmit",size='medium') 确 定
          el-button(v-else,type='primary', @click="submitForm('revokeParam',revokeFormsubmit)",size='medium') 确 定
          el-button(@click="termFilterFormReset",size='medium') 取 消  
</template>
<script>
import "../../commons/publicCss/outside.sass"
import moment from 'moment'
// 右边进度
import speed from "./speed"
// 列表中的撤销，退回按钮
import todo from "./todo"
export default {
  name: 'goOut',
  components: {speed,todo},
  data(){
    var backTime = (rule, value, callback) => {
      if(value === '') {
        callback(new Error('请选择返回时间'));
      }else if (!moment(this.editForm.goBackTime).isAfter(this.editForm.goOutTime)) {
        callback(new Error('返回时间要大于外出时间'))
      }else{
        callback();
        this.$refs['editForm'].clearValidate(['goOutTime','goBackTime'])
      }
    }
    var outTime = (rule, value, callback) => {
      if(value === '') {
        callback(new Error('请选择外出时间'));
      }else if ((!moment(this.editForm.goOutTime).isBefore(this.editForm.goBackTime)) && this.editForm.goBackTime !== '') {
        callback(new Error('外出时间要小于返回时间'))
      }else{

        callback();
        this.$refs['editForm'].clearValidate(['goOutTime','goBackTime'])
      }
    }
    return {
      templateName:'',
      wait:false,
      listBtn: false,
      applyBtn: false,
      agreeBtn: false,
      waitRecord: false,
      clearable: false,
      isClicked : false,
      baseForm: {
        name: '',//申请人
        position: '',//职位
        deptName: '',//渠道部门
        approveDate: '',// 申请日期
      },
      editForm: {
        goOutTime: '', //外出时间
        goBackTime: '', // 返回时间
        reason: ''
      },
      baseRes: {},
      editFormRules:{
        goOutTime:[
          {required:true, validator:outTime, trigger: 'blur'}
        ],
        goBackTime:[
          {required:true, validator:backTime, trigger: 'blur'}
        ],
        reason:[
          {required:true,message: '请填写外出原因', trigger: 'blur'},
          // {pattern:/^[\u4e00-\u9fa5a-zA-Z0-9\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5\s]{1,1000}$/ , message:'仅支持1-1000位中、英、数字字符',trigger:'blur'}

        ]
      },
      // 流程-处理审批（同意/不同意/退回）参数
      title: '',
      handleOpinionCode:'',
      revokeFormShow: false,
      revokeParam:{
        cancelReason: ''
      },
      revokeRules:{
        cancelReason:[
          {required:true,message: '请填写原因', trigger: 'blur'}
        ]
      },
      // 右边记录
      record:[],
      // 列表里催办参数
      todoRow: {},
      waitTodo: false

    }
  },
  computed: {
    // baseForm(){
    //   return this.$store.state.headInfo;
    // }
  },
  watch : {
    revokeFormShow(val){
      if(!val){
        this.$refs['revokeParam'].resetFields()
      }
    }
  },
  created(){
    this.editForm.approveDate = this.$util.timestampToTime(global.NOWTIME)
    this.editForm.approveDate=String(this.editForm.approveDate).substr(0,10)
    this.baseForm = this.$store.state.headInfo
    // 待处理状态 - 1 查看状态 然后按钮 四个按钮
    let code = sessionStorage.applyState
    let info = window.sessionStorage["apply"]
    info = JSON.parse(info)
    // 加载title
    this.templateName = info.templateName
    this.todoRow = info
    // 列表中的表单可以催办
    if(info.urgent === 'N'){
      this.waitTodo = true
    }
    if(code === '0'){ // 编辑状态 提交按钮
      this.wait = true
      this.applyBtn = true
      // 判断是否有单号，如果有：就先load已有的信息
      if(info.formNo){
        this.loadFormInfo(info)
        this.waitRecord = true
      }
    }else if(code === '1'){ // 查看状态 同意 不同意 返回按钮
      this.listBtn = true
      // 1.load表单信息
      this.loadFormInfo(info)
      this.waitRecord = true
    }else{  //查看状态
      this.wait = false
      this.listBtn = false
      this.applyBtn = false
      this.agreeBtn = true
      this.waitRecord = true
      // 1.load表单信息
      this.loadFormInfo(info)
    }
  },
  methods:{
    // 1.load表单信息
    loadFormInfo(info){
      if (info) {
        // 2.load表单信息
        this.$store.dispatch("gainProcess", info).then(res=>{
          // 所有信息
          console.log(info)
          // this.editForm = res.form
          // 单号
          this.editForm.approveNum = res.form.approveNum
          // 日期
          this.editForm.approveDate = res.form.approveDate
          if(this.wait){//如果有提交按钮 就将日期转为今天得
            // this.editForm.approveDate = this.$util.timestampToTime(global.NOWTIME)
            // this.editForm.approveDate=String(this.editForm.approveDate).substr(0,10)
          }
          // 1.发起时基本信息
          // this.baseForm.name = res.form.approveUserInfo.approveUserName
          // this.baseForm.position = res.form.approveUserInfo.approveUserDeptName
          // this.baseForm.deptName = res.form.approveUserInfo.approveUserPositionName
          
          // 2.发起后的基本信息
          this.baseRes = res.form.approveUserInfo
          // 外出
          this.editForm.goOutTime = res.form.goOutTime
          // 返回
          this.editForm.goBackTime = res.form.goBackTime
          // 原因
          this.editForm.reason = res.form.reason
          // 记录
          this.record = res.record
          if(info.prcessStatus == 4){
            this.record.unshift({nodeName : '结束审批' , handleOpinionCode : '0', process : '4'})
          }
        })
      }
    },
    // 返回列表
    backManage(){
      this.$router.routeBack('',1);
    },
    // 确定
    formsubmit(formName){
      this.$refs[formName].validate((valid) => {
        if(valid){
          if(!this.isClicked){
            this.isClicked = true;
            // 格式化 id
            let info = window.sessionStorage["apply"];
            info = JSON.parse(info)
            if (info.id) {
              this.editForm.templateId = info.id
            }else{
              this.editForm.templateId = info.templateId
            }
            this.$api.submitgoOut(this.editForm).then(res => {
              this.$message.success('提交成功')
              this.$router.push({name:'myselfList'})
            }).catch(()=>{
                this.isClicked = false;
            })   
          }else{
              this.$message.error('上次提交尚未完成!'); 
          }
        }
      })
    },
    // 同意
    formAgree(){
      this.title = '同意申请'
      this.revokeFormShow = true
      this.handleOpinionCode = 0
    },
    // 不同意
    formDisagree(){
      this.title= '不同意申请'
      this.revokeFormShow = true
      this.handleOpinionCode = 1
    },
    // 退回给申请人
    formRecall(){
      this.title = '退回给申请人'
      this.revokeFormShow = true
      this.handleOpinionCode = 2
    },
    // 同意弹出框
    revokeFormsubmit(){
      let info = window.sessionStorage["apply"]
      info=JSON.parse(info)
      info.handleOpinionDesc= this.revokeParam.cancelReason
      info.handleOpinionCode = this.handleOpinionCode
      this.$api.processRoam(info).then(res=>{
        this.$message.success(res.data.messages)
        this.revokeFormShow = false
        this.backManage()
      })
    },
    // 取消按钮
    termFilterFormReset(){
      this.revokeFormShow = false
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
#goOut
  .fontC6
    font-size: 14px
    color: #666666
  .listWrapNoScroll
    // height: calc(100vh - 213px)
  .color5CD
    color: #C1C5CD
  .backIcon
    float: right
    display: block
    color: #666
    cursor: pointer
    padding-right: 20px
    margin: -8px 0 6px 0
  .width80
    min-width: 140px
    width: 78% !important
  .width70
    width: 74%
    min-width: 200px
  .spanText
    padding-right: 100px
    display: inline-block
  
</style>

