<template lang="pug">
  #commonApply
    div.rightTitle  {{templateName}}
    i.backIcon(class="iconfont icon-fanhui pointer", @click="backManage")
    div.clearBoth
      //- contentDivShow 当为true时，form的宽度要-450px
      div.editContentDiv(v-bind:class='{contentDivShow: waitRecord}')
        el-form.elForm(:model='baseForm', label-width="120px",size='medium')  
          el-form-item.padleft12(label='审批单号')
            span.fontC6 {{editForm.approveNum}}
          div.floatLeft.width614
            el-form-item.padleft12(label='申请人')
              span.fontC6 {{baseForm.approveUserName}}
            el-form-item.padleft12(label='部门')
              span.fontC6 {{baseForm.approveUserPositionName}}
          div.floatLeft
            el-form-item.padleft12(label='申请人职位')
              span.fontC6 {{baseForm.approveUserDeptName}}
            el-form-item.padleft12(label='申请日期')
              span.fontC6 {{editForm.approveDate}}
          el-form-item.padleft12.clearBoth(label='标题')
            span.fontC6 {{editForm.title}}
          el-form-item.padleft12(label='正文')
            span.fontC6 {{content}}
          div(v-for='(val,index) in contentList.list')
            el-form-item.padleft12(:label='val.name')
              span.fontC6 {{val.value}}
          el-form-item.dialog-footer.waitButton(v-if='listBtn')
            el-button(@click="formAgree('editForm')",size='medium',type='primary') 同意
            el-button(@click="formDisagree('editForm')",size='medium', type='danger',plain) 不同意
            el-button(@click="formRecall('editForm')",size='medium', type='success',plain) 退回给申请人
            el-button(@click="backManage",size='medium') 返 回 
          el-form-item.dialog-footer.agreeBtn(v-if="agreeBtn")
            el-button(@click="backManage",size='medium') 返 回
      div.status.floatLeft.rightRecord
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
// 右边进度
import speed from "./speed"
export default {
  components: {speed},
  data(){
    return {
      templateName:'通用',
      waitRecord: true,
      baseForm:{
        approveNum:'',
        approveUserName:'',
        approveUserDeptName:'',
        approveUserPositionName:'',
      },
      editForm:{
        title:'',
        approveDate:''
      },
      content:'',
      contentList:{},
       // 右边记录
      record:[],
      listBtn: false,//四个按钮
      agreeBtn: false,//一个返回按钮

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
    }
  },
  created(){
    // 1.load表单信息
    let info = window.sessionStorage["apply"]
    info = JSON.parse(info)
    this.templateName = info.templateName
    // 待处理状态 - 1 查看状态 然后按钮 四个按钮
    let code = sessionStorage.applyState
    if(code === '0'){ // 编辑状态 提交按钮
      // this.wait = true
      // this.applyBtn = true
      // 判断是否有单号，如果有：就先load已有的信息
      if(info.formNo){
        this.loadFormInfo(info)
        // this.waitRecord = true
        this.agreeBtn = true//通用的撤销，已退回只能查看
      }
    }else if(code === '1'){ // 查看状态 同意 不同意 返回按钮
      this.listBtn = true
      // 1.load表单信息
      this.loadFormInfo(info)
      // this.waitRecord = true
    }else{  //查看状态
      // this.wait = false
      // this.listBtn = false
      // this.applyBtn = false
      this.agreeBtn = true
      // this.waitRecord = true
      // 1.load表单信息
      this.loadFormInfo(info)
    }
  },
  methods:{
    loadFormInfo(info){
      // 2.load表单信息
      this.$store.dispatch("gainProcess", info).then(res=>{
        this.baseForm = res.form.approveUserInfo
        this.editForm.title = res.form.title
        this.editForm.approveDate = res.form.approveDate
        this.content = res.form.content.split('&')[0]
        this.contentList = res.form.content.split('&')[1]
        if(typeof(this.contentList) != 'undefined'){
          this.contentList = JSON.parse(this.contentList)//将得到的字符串对象 转化为 对象
        }else{
          this.contentList = {}
        }
        
        // 记录
        this.record = res.record
        if(info.prcessStatus == 4){
          this.record.unshift({nodeName : '结束审批' , handleOpinionCode : '0', process : '4'})
        }
      })
    },
    // 返回列表
    backManage(){
      this.$router.routeBack('',1);
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
#commonApply
  .width614
    width: 614px
  .backIcon
    float: right
    display: block
    color: #666
    cursor: pointer
    padding-right: 20px
    margin: -8px 0 6px 0
  .agreeBtn
    text-align: center
</style>


