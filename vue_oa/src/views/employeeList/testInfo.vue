<template lang="pug">
#testInfo
  el-form(:model='elForm',ref="elForm",:rules='formRule', label-width="120px", size="mini",style="padding-top: 20px")
    el-form-item.floatLeft(label='体检日期：',prop='phyExamDate')
      el-date-picker.width300(v-model='elForm.phyExamDate', type='date',value-format="yyyy-MM-dd",format="yyyy-MM-dd")
    el-form-item.floatLeft(label='体检医院：',prop='phyExamHospital')
      el-input.width300(placeholder='1-50位字符', v-model.trim='elForm.phyExamHospital', maxLength='50')
    el-form-item.clearBoth(label='体检报告：',prop='phyExamReportUrl')
      uploadImg(:list.sync="list", v-model='elForm.phyExamReportUrl', canvasType="base",:dele="true",:holdShow="false", :size="2",:limit='1',typeFile='pdf',:isUpload = 'isUpload',holder="体检报告仅支持PDF文件，大小在2M以内",@listEmpty='listEmpty')
    el-form-item
      el-button(type='primary', @click="saveSubmit('elForm')") 保 存 修 改
</template>
<script>
import '../../commons/publicCss/outside.sass'
import uploadImg from './uploadImg'
export default {
  name:'testInfo',
  components:{uploadImg},
  data () {
    return {
      elForm:{
        phyExamDate:'',
        phyExamHospital:'',
        phyExamReportUrl:'',
        userId:''
      },
      list:[],
      isUpload:false,
      formRule:{
        phyExamDate:[
          {required: true,message:'请选择体检日期',trigger:'blur'}
        ],
        phyExamHospital:[
          {required:true,message:'请填写体检医院',trigger:'blur'},
          {pattern:/^[a-zA-Z0-9\u4e00-\u9fa5]{1,50}$/, message: '仅支持1-50位中文、英文及数字',trigger:'blur' }
        ],
        phyExamReportUrl: [
          {required: true, message: '请上传体检报告', trigger: 'change' }
        ],
      }
      
    }
  },
  created(){
    this.elForm.userId =  Number(localStorage.getItem('editUserId'))
    // 首先加载体检信息
    this.$api.getEmpExtPhyExam({userId:this.elForm.userId}).then(res=>{
      // this.$message.success(res.data.messages)
      if(res.data.data == null){
        return
      }
      this.elForm = res.data.data
      if(res.data.data.phyExamReportUrl != ''){
        this.list[0] = res.data.data.phyExamReportUrl
        console.log(this.list)
        // 将上传框隐藏
        this.isUpload = true
      }
      
    })
  },
  methods:{
    saveSubmit(formName){
      this.elForm.userId = Number(localStorage.getItem('editUserId'))
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.empExtPhyExamDataSave(this.elForm).then(res=>{
            this.$message.success(res.data.messages)
          })
        }
      })
    },
    listEmpty(val){
      if(val.list.length != 0){
        this.elForm.phyExamReportUrl = val.list[0]
        this.$refs['elForm'].clearValidate(['phyExamReportUrl'])
      }else{
        this.elForm.phyExamReportUrl = ''
      }
      this.isUpload = val.isUpload
    }
  }
}
</script>

