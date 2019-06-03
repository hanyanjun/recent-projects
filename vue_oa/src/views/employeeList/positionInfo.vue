<template lang="pug">
#positionInfo
  //- 修改1
  el-tabs.topInfo(type='border-card')
    el-tab-pane(label='岗位信息')
      el-form(:model='empPositionVoForm',ref="empPositionVoForm",:rules="empPositionVoRule", label-width="120px", size="mini",style="padding-top: 20px")
        el-form-item(label='入职日期：',prop="entryDate")
          el-date-picker.width600(v-model='empPositionVoForm.entryDate',@change='dayChange',type="date",:clearable='false',value-format="yyyy-MM-dd",format="yyyy-MM-dd")
        el-form-item(label='转正状态：')
          span.disabledInput {{empPositionVoForm.regState}}
        el-form-item(label='转正日期：')
          el-date-picker.width600(v-model='empPositionVoForm.regDate',type="date")
        el-form-item(label='汇报对象：', prop='newRepObjId', style="width:400px")
          el-select.width600(v-model='deptLeaderName', placeholder='请选择汇报对象', clearable,@clear="clearLeaderName")
            template(slot-scope='scope')
              selectMem(:treeData='optionsPartLeader', @select='selectMem',:clear="deptLeaderName")
              el-option(v-for='(item,index) in [0]', :key='index', :value='item.id')
        el-form-item(label='聘用形式：')
          el-select.width600(v-model='empPositionVoForm.empType',clearable, placeholder='请选择')
            el-option(v-for='item in addEmployeeTypeArr', :key='item.name', :label='item.name', :value='item.code')
        el-form-item(label='司龄(年)：', style="width:400px")
          span {{empPositionVoForm.inCompyears}}
        el-form-item
          el-button(type='primary', @click="submitForm('empPositionVoForm',employmentInfoSubmit)") 保 存 修 改
    el-tab-pane(label='合同信息')
      el-form(v-model='contractVoForm', label-width="150px", size="mini",style="padding-top: 20px")
        el-form-item(label='现合同开始时间：')
          el-date-picker.width600(v-model='contractVoForm.conStartDate', @change='chooseEnd')
        el-form-item(label='合同期限：')
          el-select.width600(v-model='contractVoForm.conDurtation',clearable, placeholder='请选择', @change='chooseEnd')
            el-option(v-for='item in conDurtationArr', :key='item.code', :label='item.name', :value='item.code') {{item.name}}  
        el-form-item(label='现合同结束时间：')
          el-date-picker.width600(v-if="conEndDateShow",v-model='contractVoForm.conEndDate')
          span(v-else,style="padding-left: 15px; color: #606266;font-size: 12px") {{timeFormat(contractVoForm.conEndDate)}}
        el-form-item(label='合同文件	：')
          el-upload.upload-demo.width600(:action='contractSrc', :headers='headersImg',:limit="1",:file-list='contractList',:before-upload='limitUploadFile',:before-remove='contractRemove',:on-success="contractUploadSuccess",:on-exceed="contractExceed",:on-preview='getcontractPic')
            el-button(size='mini', type='primary',plain) 点击上传
        el-form-item
          el-button(type='primary', @click="contractVoFormSubmit") 保 存 修 改
    el-tab-pane(label='招聘信息')
      el-form(v-model='recruitVoForm', label-width="150px", size="mini",style="padding-top: 20px")
        el-form-item(label='招聘渠道：')
          el-select.width600(v-model='recruitVoForm.advChannel',clearable, placeholder='请选择')
            el-option(v-for='item in recruitVoArr', :key='item.code', :label='item.name', :value='item.code') {{item.name}}
        el-form-item(label='社招/校招：')
          el-select.width600(v-model='recruitVoForm.schSoc',clearable, placeholder='请选择' )
            el-option(label='社招',value="2") 社招
            el-option(label='校招',value="1") 校招
        el-form-item(label='推荐人：', style="width:400px")
            el-input.width600(v-model.trim='recruitVoForm.referee')
        el-form-item
          el-button(type='primary', @click="recruitVoFormSubmit") 保 存 修 改
</template>
<script>
import core from '@/api/core'
import util from '../../util'
import selectMem from "../../components/selectMem"
import store from '@/vuex/store'
import axios from 'axios'
import moment from 'moment'
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  name: '',
  components : {selectMem},
  data () {
    return {
      // 1.岗位信息
      empPositionVoForm: {
        empType: '',
        entryDate: '',
        inCompyears: '',
        regDate: '',
        regState: '',
        repObjId: ''
      },
      deptLeaderName: '',
      empPositionVoRule:{
        entryDate: [
          {required: true, message: '请选择入职日期', trigger: 'change' }
        ],
        inCompyears: [
          // {message: '请选择入职日期', trigger: 'change' },
          // {pattern:/((?=^[1-9]?\d(\.\d)?$)(^.*[1-9].*$))|(^100$)|(^100.0$)/, message: '请输入大于1小于100的数字且只能保留一位小数',trigger:'change' }
        ]
      },
      // 合同信息
      contractVoForm: {
        conDurtation: '',
        conEndDate: '',
        conFile: '',
        conStartDate: ''
      },
      conEndDateShow: false,
      // 招聘渠道
      recruitVoForm: {
        advChannel: '',
        schSoc: '2',
        referee: ''
      },
      // 负责人-汇报对象 开始
      partTreeShow: false,
      optionsPartLeader: [],
      props:{
        value: 'id',
        label: 'text',
        children: 'children'
      },
      leaderGroup: '',
      partLeaderRadio: [],
      filterText: '',
      uploadFileSrc: '/admin/file/upload/file/',
      headersImg: {
        'enctype': 'multipart/form-data',
        'auth': this.$store.state.auth
      },
      // 合同附件
      contractParam:'',
      contractSrc: '',
      contractList:[]
    }
  },
  computed: {
    ...mapState({
      "addEmployeeTypeArr" : state => state.selectData.hireform.list,
      "conDurtationArr" : state => state.selectData.contractterm.list,
      "recruitVoArr" : state => state.selectData.hirechannel.list,
    }),
    ...mapGetters(['userId'])
  },
  store,
  watch: {
    //
    filterText (val) {
      this.$refs.partLeaderTree.filter(val)
    },
    partTreeShow (val) {
      if(val){
        this.leaderGroup = ''
      }
    }
  },
  created () {
     // 获取部门负责人-汇报对象
    core.orgTreeBaseInfo().then((res) => {
      util.codeConfirm(res.data,this)
      if(res.data.code === '200'){
        this.optionsPartLeader = JSON.parse(JSON.stringify(res.data.data))
      }
    }).catch(util.errorHandle)
    // 岗位信息
    core.getEmpPositionInfo({userId:this.$store.state.userId}).then((res) => {
      if(res.data.code === '200'){
        this.empPositionVoForm = res.data.data.empPositionVo
        this.empPositionVoForm.entryDate = new Date(res.data.data.empPositionVo.entryDate)
        this.deptLeaderName = res.data.data.empPositionVo.reportName
        if(res.data.data.empPositionVo.regState === 'Y'){
          this.empPositionVoForm.regState = '转正'
        }else if(res.data.data.empPositionVo.regState === 'N'){
          this.empPositionVoForm.regState = '未转正'
        }
        this.contractVoForm = res.data.data.empContractVo
        if(this.contractVoForm.conDurtation === "00"){
          this.conEndDateShow = true
        }
        this.recruitVoForm = res.data.data.empRecruitVo
        // 初始化社招
        if(res.data.data.empRecruitVo.schSoc === ""){
          this.recruitVoForm.schSoc = "2"
        }
        this.empPositionVoForm.userId = this.$store.state.userId
        this.contractVoForm.userId = this.$store.state.userId
        this.recruitVoForm.userId = this.$store.state.userId
        // 1.初始化合同接口
        this.contractSrc = this.uploadFileSrc + res.data.data.empContractVo.type + '/' + this.$store.state.userId
        // 2.初始化合同路径参数
        this.contractParam = res.data.data.empContractVo.conFile
        // 3.不为空说明有路径，才去加载合同
        if(this.contractParam === ""){
          this.contractList = []
        }else {
          var tOrW = this.contractParam.split(".")
          var obj = {}
          obj.name = '合同.' + tOrW[tOrW.length-1]
          this.contractList.push(obj)
        }
        setTimeout(() => {
          this.$refs['empPositionVoForm'].clearValidate()
        }, 1)
      }
    }).catch(util.errorHandle)
    // 初始化上传图片cookie
    this.headersImg.auth =  this.$store.state.auth
  },
  methods: {
    timeFormat (n) {
      if (n) {
        return moment(n).format('YYYY-MM-DD')
      }
    },
    // 负责人-汇报对象 开始
    // 点击新汇报对象 tree显示
    selectMem(obj){
      this.empPositionVoForm.repObjId = obj.mem.userId
      this.deptLeaderName = obj.mem.userName
    },
    clearLeaderName () {
      this.deptLeaderName = ""
      this.empPositionVoForm.repObjId = ""
    },
    partTreeFocus () {
      this.partTreeShow = true
    },
    selectData(v1,v2){
      if(v1){
        this.$store.dispatch('getData',v2);
      }
    },
    chooseEnd (val) {
      if(this.contractVoForm.conDurtation === "00" || val === "00"){
        this.conEndDateShow = true
        return
      }else{
        this.conEndDateShow = false
        if (this.contractVoForm.conDurtation && this.contractVoForm.conStartDate) {
          this.contractVoForm.conEndDate = moment(this.contractVoForm.conStartDate).add(this.contractVoForm.conDurtation, 'M').format('YYYY-MM-DD')
          this.contractVoForm.conEndDate = moment(this.contractVoForm.conEndDate).subtract(1, 'days')
        }
      }
      
    },
    // 添加中部门负责人的tree过滤
    partLeaderFilter (value, data) {
      if (!value) return true
      return data.text.indexOf(value) !== -1
    },
    // 点击部门将内容传给后端，获取负责人
    handleNodeClick (data) {
      core.getEmpsByDeptId({deptId:data.id}).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.partLeaderRadio = res.data.data
        }
      }).catch(util.errorHandle)
    },
    // 点击radio
    changeRadio (value) {
      this.partLeaderRadio.forEach( d => {
        if(value === d.userId){
          this.empPositionVoForm.repObjId = Number(d.userId)
          this.deptLeaderName = d.userName
          this.partTreeShow = false
        }
      })
    },
    partLeaderClose () {
      this.partTreeShow = false
    },
    dayChange(){
      // 计算司龄 当前日期-入职时间）/365
      let c = this.$util.timestampToTime(global.NOWTIME).substring(0,10)
      let b = moment(c).diff(this.empPositionVoForm.entryDate,'days')
      b = Number(b/365).toFixed(1)
      if(b<=0){
        this.empPositionVoForm.inCompyears = "0.0"
      }else{
        this.empPositionVoForm.inCompyears = b
      }
    },
    // 负责人-汇报对象 结束
    // 1.岗位信息保存
    employmentInfoSubmit () {
      this.$refs['empPositionVoForm'].clearValidate()
      core.empPsnBaseInfoSave(this.empPositionVoForm).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.$message.success(res.data.messages)
        }
      }).catch(util.errorHandle)
    },
    // 2.合同信息保存
    contractVoFormSubmit () {
      core.empPsnContractInfoSave(this.contractVoForm).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.$message.success(res.data.messages)
        }
      }).catch(util.errorHandle)
    },
    // 3.招聘渠道保存
    recruitVoFormSubmit () {
      core.empPsnRecruitInfoSave(this.recruitVoForm).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.$message.success(res.data.messages)
        }
      }).catch(util.errorHandle)
    },
    // 1.简历文件初始化
    getcontractPic () {
      // 头像初始化下载图片接口--load各个图片不同根据参数
      var This = this
      var tOrW = This.contractParam.split(".")
      var aType = tOrW[tOrW.length-1]
      this.$store.dispatch('downFile',{url : '/admin/file/download/file', data : {'filePath' : this.contractParam} ,  fileName :'合同.'+aType})
      // axios.get('/admin/file/download/file',
      //   {params: {filePath: this.contractParam},responseType: 'blob' , data : {'filePath' : this.contractParam}}).then(function (response) {
      //     var blob = new Blob([response.data]);
      //     // 头部头像的初始化加载
      //     var tOrW = This.contractParam.split(".")
      //     const resumeLink = document.createElement('a')
      //     resumeLink.download = '合同.' + tOrW[tOrW.length-1]
      //     resumeLink.style.display = 'none'
      //     resumeLink.href = window.URL.createObjectURL(blob)
      //     document.body.appendChild(resumeLink)
      //     resumeLink.click()
      //   }).catch(util.errorHandle)
    },
    // 2.简历文件上传成功
    contractUploadSuccess (res, file) {
      this.contractVoForm.conFile = res.data.filePath
      this.contractParam = res.data.filePath
    },
    // 3.限制条数-简历文件
    contractExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件')
    },
    // 4.删除上传图片
    contractRemove () {
      if (window.forUploadTransferValue) {
        return Promise.reject(
          this.$confirm("确定要删除此合同吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.contractVoForm.conFile = ""
            this.contractList = []
          }).catch(() => {
            // this.$refs.inputTest.focus()
          })
        )
      }
      // this.contractVoForm.conFile = ""
    },
    // 文件-上传限制
    limitUploadFile (file) {
      // util.uploadImgLimit(file)
      window.forUploadTransferValue = false
      setTimeout(() => {
        window.forUploadTransferValue = true
      }, 500)
      let testmsg = file.name.substring(file.name.lastIndexOf('.')+1)
      // DOC/DOCX/PDF/ZIP/RAR               
      const extension1 = testmsg === 'doc'  
      const extension2 = testmsg === 'docx'
      const extension3 = testmsg === 'pdf'  
      const extension4 = testmsg === 'zip'  
      const extension5 = testmsg === 'rar'  
      const isLt2M = file.size / 1024 / 1024 < 2  
      if(!((extension1) || (extension2) || (extension3) || (extension4) || (extension5) )) {
        return Promise.reject(
          this.$message({
              message: '上传文件只能是doc/docx/pdf/zip/rar 格式!',  
              type: 'warning'  
          })
        )
        return false
      }
      if(!isLt2M) {
        return Promise.reject(
          this.$message({  
              message: '上传文件大小不能超过 2MB!',  
              type: 'warning'  
          })
        )
        return false
      }
      this.headersImg['sign'] =   this.$util.newHeadersSign('post',{});
      return true
    },
    // 必填项，提交校验格式
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
<style lang="sass"  scoped>
  .topInfo
    border: 1px solid #dcdfe6
    -moz-box-shadow: 0 0 10px #d9d9d9
    -webkit-box-shadow: 0 0 10px #d9d9d9
    box-shadow: 0 0 10px #d9d9d9
    margin: 20px 0px 20px 10px
    .partTree
      // position: absolute
      z-index: 100
      width: 398px
      background: #fff
      border: 1px solid #efe3e3 !important
      border-radius: 4px
      position: fixed
      height: auto
      .partTreeLeft
        float: left
        height: 600px
        width: 210px
        overflow-y: auto
        border-right: 1px solid #f3ecec
      .partLeaderRight
        float: left
        width: 130px
        margin-top: 6px
        .el-radio
          margin-left: 5px !important
          width: 115px
          text-align: left
        i
          display: inherit
          text-align: right
          font-size: 20px
          padding-right: 6px
          margin-bottom: 20px
          cursor: pointer
          width: 170px
    .width600
      width: 400px
    .width200
      width: 200px
</style>
