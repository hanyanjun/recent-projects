<template lang="pug">
div
  //- 修改1
  el-tabs.topInfo(type='border-card')
    el-tab-pane(label='岗位信息')
      el-form(:model='empPositionVoForm',ref="empPositionVoForm",:rules="empPositionVoRule", label-width="120px", size="mini",style="padding-top: 20px")
        el-form-item(label='入职日期：',prop="entryDate")
          el-date-picker.width600(v-model='empPositionVoForm.entryDate',type="date",value-format="timestamp", placeholder='请选择入职日期')
        el-form-item(label='转正状态：')
          span.disabledInput {{empPositionVoForm.regState}}
        el-form-item(label='转正日期：')
          el-date-picker.width600(v-model='empPositionVoForm.regDate',value-format="timestamp",placeholder='请选择入职日期')
        el-form-item(label='汇报对象：', prop='newRepObjId', style="width:400px")
          el-select.width600(v-model='reportName',clearable,@visible-change="reportNameFocus",@focus='partTreeFocus',placeholder='请选择汇报对象')
            el-option.elOption
              div.partTree(v-if="partTreeShow",@click='treeDivClick')
                div.partTreeLeft
                  el-input(placeholder='输入关键字进行过滤', suffix-icon="el-icon-search", v-model='filterText')
                  el-tree.filter-tree.width200(:data='optionsPartLeader', :props='props', default-expand-all='', :filter-node-method='partLeaderFilter', ref='partLeaderTree',@node-click="handleNodeClick")
                div.partLeaderRight
                  i.el-icon-circle-close-outline(@click='partLeaderClose()')
                  el-radio-group(v-model="leaderGroup")
                  el-radio(v-for='item in partLeaderRadio', :key="item.userId", :label="item.userName", :value="item.userId",@change="changeRadio", ref='partLeaderRadio') {{item.userName}}
        el-form-item(label='聘用形式：')
          el-select.width600(v-model='empPositionVoForm.empType', placeholder='请选择')
            el-option(v-for='item in addEmployeeTypeArr', :key='item.name', :label='item.name', :value='item.code')
        el-form-item(label='司龄：', style="width:400px")
          el-input.width600(v-model='empPositionVoForm.inCompyears')
        el-form-item
          el-button(type='primary', @click="submitForm('empPositionVoForm',employmentInfoSubmit)") 保 存 修 改
    el-tab-pane(label='合同信息')
      el-form(v-model='contractVoForm', label-width="150px", size="mini",style="padding-top: 20px")
        el-form-item(label='现合同开始时间：')
          el-date-picker.width600(v-model='contractVoForm.conStartDate',value-format="timestamp", placeholder='请选择合同开始时间')
        el-form-item(label='现合同结束时间：')
          el-date-picker.width600(v-model='contractVoForm.conEndDate',value-format="timestamp", placeholder='请选择合同结束时间')
        el-form-item(label='合同期限：')
          el-select.width600(v-model='contractVoForm.conDurtation', placeholder='请选择')
            el-option(v-for='item in conDurtationArr', :key='item.code', :label='item.name', :value='item.code') {{item.name}}
        el-form-item(label='合同文件	：')
          el-upload.upload-demo(:action='contractSrc', :headers='headersImg',:limit="1" :on-remove='contractRemove',:file-list='contractList',:on-success="contractUploadSuccess",:on-exceed="contractExceed",:on-preview='getcontractPic')
            el-button(size='mini', type='primary',plain) 点击上传
            // el-input.width600(v-model='empPositionVoForm.conFile')
        el-form-item
          el-button(type='primary', @click="contractVoFormSubmit") 保 存 修 改
    el-tab-pane(label='招聘信息')
      el-form(v-model='recruitVoForm', label-width="150px", size="mini",style="padding-top: 20px")
        el-form-item(label='招聘渠道：')
          el-select.width600(v-model='recruitVoForm.advChannel', placeholder='请选择')
            el-option(v-for='item in recruitVoArr', :key='item.code', :label='item.name', :value='item.code') {{item.name}}
        el-form-item(label='社招/校招：')
          el-select.width600(v-model='recruitVoForm.schSoc', placeholder='请选择' )
            el-option(label='社招',value="2") 社招
            el-option(label='校招',value="1") 校招
        el-form-item(label='推荐人：', style="width:400px")
            el-input.width600(v-model='recruitVoForm.referee')
        el-form-item
          el-button(type='primary', @click="recruitVoFormSubmit") 保 存 修 改
              
</template>
<script>
import core from '@/api/core'
import util from '../../util'
import store from '@/vuex/store'
import axios from 'axios'
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  name: '',
  data () {
    return {
      // 1.岗位信息
      empPositionVoForm: {
        empType: '',
        entryDate: '',
        inCompyears: '',
        regDate: '',
        regState: '',
        reportObjId: ''
      },
      reportName: '',
      empPositionVoRule:{
        entryDate: [
          {type:'date',required: true, message: '请选择入职日期', trigger: 'change' }
        ]
      },
      // 合同信息
      contractVoForm: {
        conDurtation: '',
        conEndDate: '',
        conFile: '',
        conStartDate: ''
      },
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
        'auth': util.getCookie('auth')
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
        this.reportName = res.data.data.empPositionVo.reportName
        if(res.data.data.empPositionVo.regState === 'Y'){
          this.empPositionVoForm.regState = '转正'
        }else if(res.data.data.empPositionVo.regState === 'N'){
          this.empPositionVoForm.regState = '未转正'
        }
        this.contractVoForm = res.data.data.empContractVo
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
      }
    }).catch(util.errorHandle)
  },
  methods: {
    
    // 负责人-汇报对象 开始
    // 点击新汇报对象 tree显示
    partTreeFocus () {
      // this.partTreeShow = true
    },
    treeDivClick(){
      console.log('1212')
      this.partTreeShow = true
    },
    reportNameFocus(val){
      console.log(val)
      if(val){
        this.partTreeShow = true
      }else{
        this.partTreeShow = false
      }
    },
    selectData(v1,v2){
      if(v1){
        this.$store.dispatch('getData',v2);
      }
    },
    // 添加中部门负责人的tree过滤
    partLeaderFilter (value, data) {
      if (!value) return true
      return data.text.indexOf(value) !== -1
    },
    // 点击部门将内容传给后端，获取负责人
    handleNodeClick (data) {
      this.partTreeShow = true
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
          this.empPositionVoForm.reportObjId = Number(d.userId)
          this.reportName = d.userName
          this.partTreeShow = false
        }
      })
    },
    partLeaderClose () {
      this.partTreeShow = false
    },
    // 负责人-汇报对象 结束
    // 1.岗位信息保存
    employmentInfoSubmit () {
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
      axios.get('/admin/file/download/file',
        {params: {filePath: this.contractParam},responseType: 'blob' , data : {'filePath' : this.contractParam}}).then(function (response) {
          var blob = new Blob([response.data]);
          // 头部头像的初始化加载
          var tOrW = This.contractParam.split(".")
          const resumeLink = document.createElement('a')
          resumeLink.download = '简历.' + tOrW[tOrW.length-1]
          resumeLink.style.display = 'none'
          resumeLink.href = window.URL.createObjectURL(blob)
          document.body.appendChild(resumeLink)
          resumeLink.click()
        }).catch(util.errorHandle)
    },
    // 2.简历文件上传成功
    contractUploadSuccess (res, file) {
      this.contractVoForm.conFile = res.data.filePath
    },
    // 3.限制条数-简历文件
    contractExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件')
    },
    // 4.删除上传图片
    contractRemove () {
      this.contractVoForm.conFile = ""
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
  border: 1px solid #e6dede
  -moz-box-shadow: 0 0 10px #d9d9d9
  -webkit-box-shadow: 0 0 10px #d9d9d9
  box-shadow: 0 0 10px #d9d9d9
  margin: 20px
.elOption
  height: auto
  .partTree
    // position: absolute
    z-index: 10000
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
