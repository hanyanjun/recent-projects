<template lang="pug">
#personalCenter
  div.left
    el-tabs.topTabs(v-model='activeName', @tab-click='topInfoTabClick')
      el-tab-pane(label='个人信息', name='personalInfo')
        //- el-row
          //- el-col(:span="20")
        div.topInfo
          el-form(:model='personalInfoForm', label-width="120px", size="mini")
            el-row
              //- el-col(:span="4",style="width:150px")
              div.floatLeft
                el-upload.headerPic(:action='headerActionSrc',ref="uploadImg",:before-upload='limitUpload', :headers='headersImg',:limit='limit',:file-list="headerList", list-type='picture-card', :on-preview='headerCardPreview',:before-remove='headerRemove', :on-success="headerSuccessUpload")
                  i.el-icon-plus
                re-dialog(:visible="reDialog.visible",title="上传头像",@submit="confirmUpload",@close="closeClipImg",@cancle="closeClipImg")
                  div(slot="body",class="clipImgWrap")
                    vue-cropper(ref="cropper",:img="reDialog.img",:outputSize="reDialog.size",:autoCrop="true",:outputType="reDialog.outputType")
                    div.icons
                      el-tooltip(effect="dark",content="放大",placement="top-start")
                        el-button(circle,icon="el-icon-circle-plus-outline",@click.stop="changeScale(1)")
                      el-tooltip(effect="dark",content="缩小",placement="top-start")
                        el-button(circle,icon="el-icon-remove-outline",@click.stop="changeScale(-1)")
                      el-tooltip(effect="dark",content="左旋转90℃",placement="top-start")
                        el-button(circle,@click.stop="rotateLeft")
                          i.iconfont.icon-rotate-90
                      el-tooltip(effect="dark",content="右旋转90℃",placement="top-start")
                        el-button(circle,@click.stop="rotateRight")
                          i.iconfont.icon-rotate90
                el-dialog(:visible.sync='headerDialog',class='dialogPicEdit')
                  img(width='100%', :src='headerDialogImageUrl', alt='')
                p.color666(style='text-align: center;padding: 10px 0;display:inline-block;width:200px') 工号 {{personalInfoForm.employeeNo}}
              //- el-col(:span="20", style='padding:26px 0 0px 0')
              div.floatLeft(style='width:40%;min-width:240px')
                el-form-item(label='姓名：')
                  span.color666 {{personalInfoForm.name}}
                el-form-item(label='部门：')
                  span.color666 {{personalInfoForm.deptName}}
                el-form-item(label='职级：')
                  span.color666 {{personalInfoForm.level}}
              div.floatLeft
                el-form-item(label='手机号：')
                  span.color666(style="display:block") {{personalInfoForm.mobileInternationalCode}} {{personalInfoForm.mobile}}
                el-form-item(label='职位：')
                  span.color666 {{personalInfoForm.position}}
              div.clearable
        div.bottomInfo(style="margin: 20px 0px 20px 10px;clear:both")
          el-tabs(type='border-card')
            el-tab-pane(label='基本信息')
              el-form(v-model='baseInfoForm', :rules="baseInfoRules", ref="baseInfoForm", label-width="120px", size="mini",style="padding-top: 20px")
                div(style="float:left")
                  el-form-item(label='英文名称：')
                    el-input.width300(placeholder='请输入英文名称', v-model.trim='baseInfoForm.enname')
                    el-input.width300(style='opacity: 0; position: absolute; z-index: -100', ref='inputTest', placeholder='请输入英文名称', v-model='baseInfoForm.enname')
                  el-form-item(label='星座：')
                    el-select.width300(v-model='baseInfoForm.constellation',clearable, placeholder='请选择星座')
                      el-option(v-for='item in constellationArr', :key='item.value', :label='item.label', :value='item.value') {{item.label}}
                div(style="float:left")
                  el-form-item(label='出生日期：')
                    el-date-picker.width300(v-model='baseInfoForm.birth',value-format='yyyy-MM-dd')
                  el-form-item(label='座右铭：')
                    el-input.width300(placeholder='请输入座右铭', v-model.trim='baseInfoForm.motto')
                el-form-item(label='近期目标：', style="clear:both")
                  el-input.width720(type='textarea', v-model.trim='baseInfoForm.recentTarget')
                el-form-item(label='兴趣爱好：')
                  el-input.width720(type='textarea', v-model.trim='baseInfoForm.hobby')
                el-form-item
                  // el-button(@click="baseInfoReset('baseInfoForm')") 取 消
                  el-button(type='primary', @click="baseInfoSubmit") 保 存 修 改
            el-tab-pane(label='联系信息')
              el-form(v-model='contactInfoForm', label-width="120px", size="mini",style="padding-top: 20px")
                el-form-item(label='工位：')
                    // el-input.width300(v-model='editContactstation', :disabled="true")
                    span.disabledInput {{editContactstation}}
                el-form-item(label='分机号码：')
                    span.disabledInput {{extTelNum}}
                el-form-item(label='工作邮箱：')
                    // el-input.width300(v-model='editContactemail', :disabled="true")
                    span.disabledInput {{editContactemail}}
                el-form-item(label='微信：')
                  el-input.width300(placeholder='请输入微信', v-model.trim='contactInfoForm.wechat')
                el-form-item(label='QQ：')
                  el-input.width300(v-model.trim='contactInfoForm.qq')
                el-form-item
                  el-button(type='primary', @click="contactInfoSubmit") 保 存 修 改
            el-tab-pane(label='账户信息')
              el-form(v-model='accountInfoForm', label-width="120px", size="mini",style="padding-top: 20px")
                el-form-item(label='公积金账号：')
                    span.disabledInput {{accountInfoForm.fundAcc}}
                el-form-item(label='银行卡号1：')
                  // el-input.width300(v-model='jobInfoForm.bankAcc1', :disabled="true")
                  span.disabledInput {{accountInfoForm.bankAcc1}}
                el-form-item(label='开户行：')
                    // el-input.width300(v-model='jobInfoForm.deposit1', :disabled="true")
                    span.disabledInput {{accountInfoForm.deposit1}}
                el-form-item(label='银行卡号2：')
                  // el-input.width300(v-model='jobInfoForm.bankAcc2', :disabled="true")
                  span.disabledInput {{accountInfoForm.bankAcc2}}
                el-form-item(label='开户行：')
                    // el-input.width300(v-model='jobInfoForm.deposit2', :disabled="true")
                    span.disabledInput {{accountInfoForm.deposit2}}
            el-tab-pane(label='岗位信息')
              el-form(v-model='jobInfoForm', label-width="120px", size="mini",style="padding-top: 20px")
                el-form-item(label='转正信息：')
                    // el-input.width300(v-model='jobInfoForm.turnPositive', :disabled="true")
                    span.disabledInput {{jobInfoForm.turnPositive}}
                el-form-item(label='转正日期：')
                  // el-input.width300(v-model='jobInfoForm.turnDate', :disabled="true")
                  span.disabledInput {{jobInfoForm.turnDate}}
                el-form-item(label='汇报对象：')
                  // el-input.width300(v-model='jobInfoForm.reportLeader', :disabled="true")
                  span.disabledInput {{jobInfoForm.reportLeader}}
                el-form-item(label='聘用方式：')
                  // el-input.width300(v-model='jobInfoForm.hireWay', :disabled="true")
                  span.disabledInput {{jobInfoForm.hireWay}}
            el-tab-pane.electronicSign(label='电子签名', style='padding-left: 30px;')
              el-upload.elecActionPic(:action='elecActionSrc',:before-upload='limitUpload', :headers='headersImg',:limit='limit',:file-list="elecImgList", list-type='picture-card', :on-preview='elecImgCardPreview', :before-remove='elecImgRemove',:on-success="elecImgSuccessUpload")
                i.el-icon-plus
              el-dialog(:visible.sync='elecImgDialog',class='dialogPicEdit')
                img(width='100%', :src='elecImgDialogUrl', alt='')
              el-button(type='primary', size="mini", @click="electronicSignSubmit", style='margin:12px 45px !important') 保 存 修 改
          //- el-col(:span="4")
            changeRecord(:record="changeRecord")
      el-tab-pane(label='账号安全', name='accountSecurity')
        //- el-row
        //-   el-col(:span='20')
        div.topInfo
          p(style='padding-left: 30px;font-weight: bold') 修改密码
          el-form(:model='editPassForm',ref="editPassForm",:rules="editPassRule", label-width="120px", size="mini",style="padding-top: 20px")
            el-form-item(label='原密码：',prop="lgOldPwd")
                el-input.width300(v-model='editPassForm.lgOldPwd',type="passWord", placeholder='请输入原密码')
            el-form-item(label='新密码：',prop="lgnewPwd1")
              el-input.width300(v-model='editPassForm.lgnewPwd1',type="passWord", placeholder='请输入新密码')
            el-form-item(label='确认新密码：',prop="lgnewPwd2")
                el-input.width300(v-model='editPassForm.lgnewPwd2',type="passWord", placeholder='请确认新密码')
            el-form-item
              el-button(type='primary', @click="submitForm('editPassForm',editPassSubmit)") 确 认
          //- el-col(:span='4')
              changeRecord(:record="changeRecord")
      el-tab-pane(label='考勤记录',name="record")
        //- el-row
        //-   el-col(:span='20')
        timeRecord(v-if='timeRecordLoad',type="1", is_personal=true )
          //- el-col(:span='4')
            changeRecord(:record="changeRecord")
      el-tab-pane.tabDiv(label='微信绑定')
        //- el-row
        //-   el-col(:span='20')
        //- 微信信息
        WeChatBind(v-if='WeChatBind')
          //- el-col(:span='4')
            changeRecord(:record="changeRecord")
  div.right
    changeRecord(:record="changeRecord")
  //- 第一次二维码
  div(v-if='weDialogShow')
    weDialog(:dialogShow='weDialogShow')
   
</template>
<script>
import "../../commons/publicCss/outside.sass"
import core from '@/api/core'
import util from '../../util'
import axios from 'axios'
import { mapState } from 'vuex'
import changeRecord from "./changeRecord"
import {md5} from '../../util/md5.js'
import timeRecord from '../employeeList/timeRecord'
import WeChatBind from './WeChatBind'
import weDialog from './weDialog'
import reDialog from "../../components/reDialog"
export default {
  name: '',
  components:{changeRecord,timeRecord,WeChatBind,weDialog,reDialog},
  data () {
    var lgOldPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'))
      } else {
        if (this.editPassForm.lgnewPwd2 !== '') {
          this.$refs.editPassForm.validateField('lgnewPwd1')
        }
        callback()
      }
    };
    var lgnewPwd1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      }else if(value === this.editPassForm.lgOldPwd){
        callback(new Error('原密码与新密码不能一致!'))
      }else {
        if (this.editPassForm.lgnewPwd2 !== '') {
          this.$refs.editPassForm.validateField('lgnewPwd2')
        }
        callback()
      }
    };
    var lgnewPwd2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认新密码'))
      }else if(value === this.editPassForm.lgOldPwd){
        callback(new Error('原密码与新密码不能一致!'))
      } else if (value !== this.editPassForm.lgnewPwd1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      activeName: 'personalInfo',
      uploadSrc: '/admin/file/upload/pic/',
      changeRecord :{},
      headersImg: {
        'enctype': 'multipart/form-data',
        'auth': this.$store.state.auth
      },
      // 顶部头像
      // 参数路径
      headPicParam:'',
      forUploadTransferValue: true,
      headerActionSrc: '',
      headerDialogImageUrl: '',
      headerDialog: false,
      limit: 1,
      headerList:[],
      headerSignData: {
        id:'',
        picAddr:'',
        type:''
      },
      reDialog : {
        visible : false,
        img : '',
        size : 1,
        outputType : 'png',
        fileName : ''
      },
      // 电子签名
      elecImgParam:'',
      elecActionSrc:'',
      elecImgList:[],
      elecImgDialogUrl:'',
      elecImgDialog: false,
      electronicSignData: {
        id:'',
        picAddr:'',
        type:''
      },
      // downfilePath:'',
      // 头部个人信息
      personalInfoForm: {
        name: '',
        deptName: '',
        level: '',
        mobileInternationalCode: '',
        mobile: '',
        position: '',
        headPic: '',
        employeeNo: ''
      },
      baseInfoForm: {
        baseId:'',
        birth: '',
        constellation: '',
        enname: '',
        hobby: '',
        motto: '',
        recentTarget: ''
      },
      editContactemail: '',
      extTelNum: '',
      editContactstation: '',
      contactInfoForm: {
        contactId:'',
        extTelNum: '',
        qq: '',
        wechat: ''
      },
      jobInfoForm: {
        hireWay:'',
        reportLeader: '',
        turnDate: '',
        turnPositive: ''
      },
      accountInfoForm: {
        bankAcc1:'',
        bankAcc2: '',
        deposit1: '',
        deposit2: '',
        proFundAcc: ''
      },
      editPassForm: {
        lgnewPwd1:'',
        lgnewPwd2: '',
        lgOldPwd: ''
      },
      constellationArr:[{
        value: '1',
        label: '白羊座'
      },{
        value: '2',
        label: '金牛座'
      },{
        value: '3',
        label: '双子座'
      },{
        value: '4',
        label: '巨蟹座'
      },{
        value: '5',
        label: '狮子座'
      },{
        value: '6',
        label: '处女座'
      },{
        value: '7',
        label: '天秤座'
      },{
        value: '8',
        label: '天蝎座'
      },{
        value: '9',
        label: '射手座'
      },{
        value: '10',
        label: '摩羯座'
      },{
        value: '11',
        label: '水瓶座'
      },{
        value: '12',
        label: '双鱼座'
      }],
      baseInfoRules: {},
      changeRecord : {},
      // 修改密码
      editPassRule: {
        lgOldPwd:[
          {validator: lgOldPwd,trigger:'blur',required:true,},
          {pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/, message: '请输入6-20位数字和字母或特殊符号的组合',trigger:'change' }
        ],
        lgnewPwd1:[
          {validator: lgnewPwd1,trigger:'blur',required:true,},
          {pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/, message: '请输入6-20位数字和字母或特殊符号的组合',trigger:'change' }
        ],
        lgnewPwd2:[
          {validator: lgnewPwd2,trigger:'blur',required:true,},
          {pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/, message: '请输入6-20位数字和字母或特殊符号的组合',trigger:'change' }
        ]
      },
      // 考勤记录
      timeRecordLoad: false,
      // 微信绑定
      WeChatBind: false,
      weDialogShow:false,
    }
  },
  computed:{
    ...mapState(['headInfo'])
  },
  created () {
    // 如果从工作台跳入 默认渲染工作台指定的tab
    if(window.sessionStorage['benchPerTab']){
      this.activeName = window.sessionStorage['benchPerTab'];
      this.timeRecordLoad = true
      window.localStorage['myself'] = 'myself'
    };
    // 检测是否第一次绑定微信
    this.$api.getResultOfFirstLoad().then(res=>{
      if(res.data.data.isFirstLoad){
        this.weDialogShow = true//正式
      }
      // else{
      //   this.weDialogShow = true//测试 -mock数据
      // }
    })
    // 调取bind信息
    this.$api.getWechatBinding().then(res =>{
      let data = res.data.data
      // 将信息放到session里
      window.sessionStorage['weData'] = JSON.stringify(data)
    })
    window.forUploadTransferValue = true
    window.sessionStorage['editUserId'] =this.$store.state.headInfo.userId
    // 获取个人信息/admin/employee/getAllDatas
    core.getAllDatas().then((res) => {
      util.codeConfirm(res.data,this)
      if(res.data.code === '200'){
        if(res.data.data.contactInfo !== null){
          this.contactInfoForm = res.data.data.contactInfo
          this.editContactemail = res.data.data.contactInfo.email
          this.extTelNum = res.data.data.contactInfo.extTelNum
          this.editContactstation = res.data.data.contactInfo.station
        }
        if(res.data.data.accountInfo !== null){
          this.accountInfoForm = res.data.data.accountInfo
        }
        this.personalInfoForm = res.data.data.headInfo
        window.localStorage['empNo'] =res.data.data.headInfo.employeeNo
        this.baseInfoForm = res.data.data.baseInfo
        this.jobInfoForm = res.data.data.jobInfo
        // 1.上传图片接口
        this.headerActionSrc = this.uploadSrc + res.data.data.headInfo.type + "/" + res.data.data.headInfo.headId + '/149/149'
        // 2.初始化图片路径参数
        this.headPicParam = res.data.data.headInfo.headPic
        // 3.不为空说明有路径，才去加载图片
        if(this.headPicParam !== ""){
          this.getPersonalPic(this.headPicParam,this.headerList)
        }
        // 4.保存参数
        this.headerSignData.type = res.data.data.headInfo.type
        this.headerSignData.id = res.data.data.headInfo.headId
        
        // 1.初始化电子签名图片接口
        this.elecActionSrc = this.uploadSrc + res.data.data.elecSignature.type + "/" + res.data.data.elecSignature.signatureId + '/149/149'
        // 2.初始化电子签名图片路径参数
        this.elecImgParam = res.data.data.elecSignature.elecSignature
        // 3.不为空说明有路径，才去加载图片
        if(this.elecImgParam !== ""){
          this.getHeadPic(this.elecImgParam,this.elecImgList)
        }
        // 4.保存参数
        this.electronicSignData.type = res.data.data.elecSignature.type
        this.electronicSignData.id = res.data.data.elecSignature.signatureId
      }
    }).catch(util.errorHandle)
    //  获取个人信息
    core.getMyselfRecord().then(obj=>{
        this.changeRecord = obj.data.data;
    })
    // 初始化上传图片cookie
    this.headersImg.auth =  this.$store.state.auth
    
  },
  methods: {
    topInfoTabClick(tab, event) {
        switch(tab.label){
          case '考勤记录':
            this.timeRecordLoad = true
            window.localStorage['myself'] = 'myself'
          break;
          case '微信绑定':
            this.WeChatBind = true
          break;
        }
    },
    // 1.保存基本信息
    baseInfoSubmit () {
      core.editBase(this.baseInfoForm).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
           this.$message.success(res.data.messages)
        }
      }).catch(util.errorHandle)
    },
    // 2.保存基本信息
    contactInfoSubmit () {
      core.editContact(this.contactInfoForm).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
           this.$message.success(res.data.messages)
        }
      }).catch(util.errorHandle)
    },
    // 修改密码
    editPassSubmit () {
      let editPassForm = Object.assign({},this.editPassForm)
      editPassForm.lgOldPwd = md5(editPassForm.lgOldPwd)                
      editPassForm.lgnewPwd1 = md5(editPassForm.lgnewPwd1)                
      editPassForm.lgnewPwd2 = md5(editPassForm.lgnewPwd2)                
      core.editpwd(editPassForm).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
           this.$message.success(res.data.messages)
        }
      }).catch(util.errorHandle)
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
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    // 1.头像初始化
    getPersonalPic (param,This) {
      axios.get('/admin/file/download/myself/portrait',
        {params: {filePath:param},responseType: 'blob' , data : {'filePath' : param}  }).then(function (response) {
          // 头部头像的初始化加载
          var blob = new Blob([response.data]);
          var obj = {}
          obj.url = window.URL.createObjectURL(blob)
          This.push(obj)
        }).catch(util.errorHandle)
    },
    getHeadPic (param,This) {
      axios.get('/admin/file/download/file',
        {params: {filePath:param},responseType: 'blob' , data : {'filePath' : param} }).then(function (response) {
          // 头部头像的初始化加载
          var blob = new Blob([response.data]);
          var obj = {}
          obj.url = window.URL.createObjectURL(blob)
          This.push(obj)
        }).catch(util.errorHandle)
    },
    // 2.头像上传成功
    headerSuccessUpload (res, file) {
      this.headerSignData.picAddr = res.data.filePath
      this.$store.dispatch('imgUrlToBlob',res.data.filePath).then(obj=>{
          this.$store.state.headInfo.headPic = obj;
        })
      // 头像成功就保存给后端
      this.headerSubmit().then(_=>{
        
          //  上传成功 重新下载头像
          this.$store.dispatch('imgUrlToBlob',this.headerSignData.picAddr).then(src=>{
              let obj = {
                url : src
              }
              this.headerList.push(obj);
          });
      })
    },
    // 3.头像-保存
    headerSubmit () {
      return new Promise((resolve,reject)=>{
        // 1.首先获取图片的路径
        core.editPic(this.headerSignData).then((res) => {
          util.codeConfirm(res.data,this)
          if(res.data.code === '200'){
            this.$message.success(res.data.messages);
            if(!this.headerSignData.picAddr){
              this.$store.state.headInfo.headPic = '';
            }
          }
          resolve();
        }).catch(util.errorHandle)
      })
    },
    // 4.弹出框-顶部头像
    headerCardPreview(file) {
      this.headerDialogImageUrl = file.url
      this.headerDialog = true
    },
    // 上传限制
    limitUpload (file,uploadInfo) {
      // util.uploadImgLimit(file)
      window.forUploadTransferValue = false
      setTimeout(() => {
        window.forUploadTransferValue = true
      }, 500)
      this.reDialog.fileName = file.name;
      let testmsg = file.name.substring(file.name.lastIndexOf('.')+1)                 
      const extension1 = testmsg === 'jpg'  
      const extension2 = testmsg === 'jpeg'
      const extension3 = testmsg === 'png'  
      const isLt2M = file.size / 1024 / 1024 < 2  
      if(!((extension1) || (extension2) || (extension3))) {
        return Promise.reject(
          this.$message({
              message: '上传文件只能是jpg/jpeg/png 格式!',  
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
      if(!uploadInfo){
        let  reader = new FileReader();
        reader.readAsDataURL(file);
        let _this = this;
        reader.onload = function(e){
          _this.reDialog.img = this.result;
          _this.reDialog.visible = true;
        }
        return false;
      }
      this.headersImg['sign'] =   this.$util.newHeadersSign('post',{});
      // this.$refs.uploadImg.submit(file);
      let formData = new FormData();
      formData.append('file',file);
      this.$store.dispatch('uploadImg',{
        type : 'portrait',
        width : uploadInfo.width,
        height : uploadInfo.height,
        formData : formData
      }).then(obj=>{
        this.headerSuccessUpload(obj.data);
      })
      return true
    },
    // 确定上传的按钮
    confirmUpload(){
      this.$refs.cropper.startCrop();
      this.$refs.cropper.getCropData((data)=>{
        var arr = data.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        let file = new File([u8arr], this.reDialog.fileName, {type:mime});
        this.limitUpload(file,{
          width : Math.floor(this.$refs.cropper.cropW),
          height : Math.floor(this.$refs.cropper.cropH)
        });
        this.closeClipImg();
      })
    },
    closeClipImg(){
      this.reDialog = Object.assign({},{
        visible : false,
        img : '',
        size : 1,
        fileName : '',
        outputType : 'png'})
    },
    changeScale(value){
      this.$refs.cropper.changeScale(value) 
    },
    rotateLeft(){
      this.$refs.cropper.rotateLeft() 
    },
    rotateRight(){
      this.$refs.cropper.rotateRight() 
    },
    // 删除
    headerRemove () {
      if (window.forUploadTransferValue) {
        return Promise.reject(
          this.$confirm("确定要删除此头像吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.headerSignData.picAddr = ''
            this.headerList = []
            this.headerSubmit()
          }).catch(() => {
            this.$refs.inputTest.focus()
          })
        )
      }
    },
    // 1.电子签名初始化上传
    elecImgSuccessUpload (res, file) {
      this.electronicSignData.picAddr = res.data.filePath;

    },
    // 3.电子签名-保存
    electronicSignSubmit () {
      // 1.首先获取图片的路径
      core.editPic(this.electronicSignData).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
           this.$message.success(res.data.messages)
        }
      }).catch(util.errorHandle)
    },
    // 4.电子签名-弹出框
    elecImgCardPreview (file) {
      this.elecImgDialogUrl = file.url
      this.elecImgDialog = true
    },
    elecImgRemove () {
      if (window.forUploadTransferValue) {
        return Promise.reject(
          this.$confirm("确定要删除此签名吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.electronicSignData.picAddr = ""
            this.elecImgList = []
            // this.headerSubmit()
          }).catch(() => {
            this.$refs.inputTest.focus()
          })
        )
      }
    },
  }
}
</script>
<style lang="sass" scoped>
#personalCenter
  width: 100%
  .tabDiv
    height: calc(100vh - 171px)
  .left
    float: left
    margin-right: 20px
    width: calc(100% - 284px)
  .right
    float: left
    padding-top: 53px
  .topTabs
    width: 100%
    .topInfo
      // height: 200px
      border: 1px solid #dcdfe6
      background: #fff
      padding: 30px 20px 20px 20px
      -moz-box-shadow: 0 0 10px #d9d9d9
      -webkit-box-shadow: 0 0 10px #d9d9d9
      box-shadow: 0 0 10px #d9d9d9
      margin: 20px 0px 20px 10px
// 上传头像
.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9 !important
  border-radius: 50%
  cursor: pointer
  position: relative
  overflow: hidden
.avatar-uploader .el-upload:hover
  border-color: #409EFF
.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center
.avatar
  width: 178px
  height: 178px
  display: block
.width300,.el-date-editor.el-input
  width: 300px
.width720
  width: 600px
.electronicSign
  .avatar-uploader
    width: 188px
    border: 1px dashed #d9d9d9 !important
    border-radius: 6px
    #elecPicImg
      width: 188px
      height: 188px
      display: block
.disabledInput
  color: #666666
.headerPic,.elecActionPic
  height: 150px
  width: 150px
  overflow: hidden
  padding-left: 20px
.color666
  color: #666
.clipImgWrap
  width: 80%
  height: 400px
  margin: 40px auto 70px  
  .icons
    margin: 20px auto
  .iconfont
    font-size: 14px

</style>
