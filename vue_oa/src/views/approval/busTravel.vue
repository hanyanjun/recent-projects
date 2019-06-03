<template lang="pug">
  #busTravel
    div.rightTitle  {{templateName}}
    i.backIcon(class="iconfont icon-fanhui pointer", @click="backManage")
    div.clearBoth
      div.editContentDiv(v-bind:class='{contentDivShow: waitRecord}')
        el-form.elForm(:model='editForm', :rules="editFormRules", ref="editForm",v-bind:class='[wait==0 ? "waitFormClass" : ""]', label-width="120px",size='medium')  
          el-form-item.padleft12.margin6(label='审批单号')
            span.color5CD(v-if='!waitRecord') 提交后系统自动生成
            span.fontC6(v-else) {{editForm.approveNum}}
          div.floatLeft.width614
            el-form-item.padleft12(label='申请人')
              span.fontC6(v-if='wait') {{baseForm.name}}
              span.fontC6(v-if='!wait') {{baseRes.approveUserName}}
            el-form-item.padleft12(label='部门')
              span.fontC6(v-if='wait') {{baseForm.deptName}}
              span.fontC6(v-if='!wait') {{baseRes.approveUserPositionName}}
          div.floatLeft
            el-form-item.padleft12(label='申请人职位')
              span.fontC6(v-if='wait') {{baseForm.position}}
              span.fontC6(v-if='!wait') {{baseRes.approveUserDeptName}}
            el-form-item.padleft12(label='申请日期')
              span.fontC6 {{editForm.approveDate}}
          el-row.clearBoth
            div.floatLeft.width614
              el-form-item(label='出发日期', prop='tripStartTime')
                el-date-picker.width80(v-model='editForm.tripStartTime',v-if='wait',type='date',value-format="yyyy-MM-dd")
                span.fontC6(v-if='!wait') {{editForm.tripStartTime}}
            div.floatLeft.width614
              el-form-item(label='预计返回日期', prop='tripReturnTime')
                el-date-picker.width80(v-model='editForm.tripReturnTime',v-if='wait',type='date',value-format="yyyy-MM-dd")
                span.fontC6(v-if='!wait') {{editForm.tripReturnTime}}
          el-row.clearBoth
            div.floatLeft.width614
              el-form-item(label='出发地', prop='origin')
                el-input.width80(v-model='editForm.origin',v-if='wait',maxlength="20",placeholder='1-20位字符')
                span.fontC6(v-if='!wait') {{editForm.origin}}
            div.floatLeft.width614
              el-form-item(label='目的地', prop='destination',maxlength="20")
                el-input.width80(v-model='editForm.destination',v-if='wait',placeholder='1-20位字符')
                span.fontC6(v-if='!wait') {{editForm.destination}}
          el-form-item(label='出差事由', prop='reason')
            el-input.width70(v-model='editForm.reason',v-if='wait', type='textarea',maxlength="1000",placeholder='1-1000位字符')
            span.fontC6.spanText(v-if='!wait') {{editForm.reason}}
          //- el-form-item.tableScroll.padleft12(label='出差费用', prop='')
            table.vehicleTable
              tr.bgF9
                td(colspan='5') 1.交通费用
              tr
                td(colspan='4') 出发交通工具信息
                td(width='300px') 金额（元）
              tr.line34
                td(colspan='4')
                  el-form-item(prop='startTraffic')
                    el-checkbox-group(v-model='editForm.startTraffic',v-if='wait')
                      el-checkbox(v-for='item in traffiType', :value='item.code', :label='item.code', :key='item.code') {{item.name}}
                    span.fontC6.spanText(v-if='!wait') {{editForm.startTraffic}}  
                td
                  el-form-item(prop='startFee')
                    el-input.width300(v-model='editForm.startFee',v-if='wait',placeholder='0-100000元')
                  span.fontC6.spanText(v-if='!wait') {{editForm.startFee}}
              tr
                td(colspan='4') 返回交通工具信息
                td(width='300px') 金额（元）
              tr.line34
                td(colspan='4')
                  el-form-item(prop='returnTraffic')
                    el-checkbox-group(v-model='editForm.returnTraffic',v-if='wait')
                      el-checkbox(v-for='item in traffiType', :value='item.code', :label='item.code', :key='item.code') {{item.name}}
                  span.fontC6.spanText(v-if='!wait') {{editForm.returnTraffic}}
                td
                  el-form-item(prop='returnFee')
                    el-input.width300(v-model='editForm.returnFee',v-if='wait',placeholder='0-100000元')
                  span.fontC6.spanText(v-if='!wait') {{editForm.returnFee}}
              tr.bgF9
                td(colspan='5') 2.住宿费用
              tr
                td 住宿限额(元/天)
                td 入住日期
                td 退房日期
                td 住宿天数
                td 金额（元）
              tr
                td
                  el-form-item(prop='accommodationFee')
                    el-input.width150(v-model='editForm.accommodationFee',v-if='wait',placeholder='0-100000元')
                    span.fontC6.spanText(v-if='!wait') {{editForm.accommodationFee}}
                td
                  el-form-item(prop='stayBeginDate')
                    el-date-picker.width130(v-model='editForm.stayBeginDate',v-if='wait',type='date',value-format="yyyy-MM-dd")
                  span.fontC6.spanText(v-if='!wait') {{editForm.stayBeginDate}}
                td
                  el-form-item(prop='stayEndDate')
                    el-date-picker.width130(v-model='editForm.stayEndDate',v-if='wait',type='date',value-format="yyyy-MM-dd")
                  span.fontC6.spanText(v-if='!wait') {{editForm.stayEndDate}}
                td
                  span.fontC6 {{editForm.dayNum}}
                td
                  el-form-item(prop='accommodationFeeTotal')
                    el-input(v-model='editForm.accommodationFeeTotal',v-if='wait',placeholder='0-100000元')
                  span.fontC6.spanText(v-if='!wait') {{editForm.accommodationFeeTotal}}  
              tr.bgF9
                td(colspan='5') 3.其他费用
              tr
                td(colspan='4') 项目及具体费用
                td(width='300px') 金额（元）
              tr
                td(colspan='4')
                  el-form-item(prop='otherFeeInfo')
                    el-input.otherText(v-model='editForm.otherFeeInfo',type='textarea',v-if='wait',placeholder='1-200位字符',maxlength="200")
                    span.fontC6.spanText(v-if='!wait') {{editForm.otherFeeInfo}}
                td
                  el-form-item(prop='otherFee')
                    el-input.width300(v-model='editForm.otherFee',v-if='wait',placeholder='0-100000元')
                    span.fontC6.spanText(v-if='!wait') {{editForm.otherFee}}
              tr.bgF9
                td(colspan='5') 费用总计
              tr
                td 预计总金额（元）
                td
                  //- el-input(v-model='editForm.totalFee',v-if='wait',placeholder='请填写')
                  span.fontC6.spanText {{editForm.expectedFee}}
                td(colspan='2') 暂支金额（元）
                td
                  el-form-item(prop='totalFee')
                    el-input.width300(v-model='editForm.totalFee',v-if='wait',placeholder='0-100000元')
                  span.fontC6.spanText(v-if='!wait') {{editForm.totalFee}}
              
          //- div.expectedFeeSpan(v-if='applyBtn')
            span 备注：若不暂支金额请填写 0
          el-form-item.dialog-footer.applyBtn(v-if='applyBtn')
            el-button(@click="formsubmit('editForm')",size='medium',type='primary') 提 交
            el-button(@click="backManage",size='medium') 取 消  
          el-form-item.dialog-footer.waitButton(v-if='listBtn')
            el-button(@click="formAgree('editForm')",size='medium',type='primary') 同意
            el-button(@click="formDisagree('editForm')",size='medium', type='danger',plain) 不同意
            el-button(@click="formRecall('editForm')",size='medium', type='success',plain) 退回给申请人
            el-button(@click="backManage",size='medium') 返 回 
          el-form-item.dialog-footer.applyBtn(v-if="agreeBtn")
            el-button(@click="backManage",size='medium') 返 回 
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
import validate from "../../util/validate.js"
import moment from 'moment'
import {mapState} from "vuex"
import speed from "./speed"
export default {
  name: 'busTravel',
  components: {speed},
  data(){
    var feeVal = (rule,value,callback) => {
      value = Number(value)
      if(value<0 || value>100000 ||  value%1!=0 ){
        callback(new Error('仅支持0-100000的整数'));
      }else{
        callback();
      }
    }
    // var otherfeeVal = (rule,value,callback) => {
    //   value = Number(value)
    //   if(value<0 || value>100000  || value%1!=0 ){
    //     callback(new Error('仅支持0-100000的整数'));
    //   }else{
    //     callback();
    //   }
    // }
    var backTime = (rule, value, callback) => {
      if(value === '') {
        callback(new Error('请选择返回日期'));
      }else if (!moment(this.editForm.tripReturnTime).isAfter(this.editForm.tripStartTime)) {
        callback(new Error('返回日期要大于出发日期'))
      }else{
        callback();
        this.$refs['editForm'].clearValidate(['tripStartTime','tripReturnTime'])
      }
    }
    var outTime = (rule, value, callback) => {
      if(value === '') {
        callback(new Error('请选择出发日期'));
      }else if ((!moment(this.editForm.tripStartTime).isBefore(this.editForm.tripReturnTime)) && this.editForm.tripReturnTime !== '') {
        callback(new Error('出发日期要小于返回日期'))
      }else{

        callback();
        this.$refs['editForm'].clearValidate(['tripStartTime','tripReturnTime'])
      }
    }
    var stayEnd = (rule, value, callback) => {
      if(value === '') {
        callback(new Error('请选择退房日期'));
      }else if (!moment(this.editForm.stayEndDate).isAfter(this.editForm.stayBeginDate)) {
        callback(new Error('退房日期要大于入住日期'))
      }else{
        callback();
        this.$refs['editForm'].clearValidate(['stayBeginDate','stayEndDate'])
        this.stayEndDateC()
      }
    }
    var stayBegin = (rule, value, callback) => {
      if(value === '') {
        callback(new Error('请选择入住日期'));
      }else if ((!moment(this.editForm.stayBeginDate).isBefore(this.editForm.stayEndDate)) && this.editForm.stayEndDate !== '') {
        callback(new Error('入住日期要小于退房日期'))
      }else{

        callback();
        this.stayEndDateC()
        this.$refs['editForm'].clearValidate(['stayBeginDate','stayEndDate'])
      }
    }
    return {
      templateName:'',
      wait:false,
      listBtn:false,
      applyBtn: false,
      agreeBtn: false,
      clearable: false,
      waitRecord: false,
      isClicked : false,
      dataTable:[],
      baseRes:{},
      editForm: {
        approveNum:'',//审批单号
        // name: '谁谁',//申请人
        // position: '职位',//职位
        // depName: '部门',//部门
        approveDate: '',
        tripStartTime: '',//出发日期
        tripReturnTime: '',//预计返回日期
        origin: '',//出发地
        destination: '',//目的地
        reason: '',
        startFee: '',//出发金额
        startTraffic: [],//出发交通工具多选,
        returnTraffic: [],//返回交通工具多选
        returnFee: '',//返回金额
        accommodationFee: '',//住宿限额
        stayBeginDate: '',//入住日期
        stayEndDate: '',//退房日期
        dayNum: '',//住宿天数
        accommodationFeeTotal: '',//住宿金额

        otherFeeInfo: '',//其他费用项目
        otherFee: '',//其他费用

        expectedFee: '',//预计总金额
        totalFee: '',//暂支金额

      },
      editFormRules:{
        tripStartTime:[
          {required:true, validator:outTime, trigger: 'blur'}
        ],
        tripReturnTime:[
          {required:true, validator:backTime, trigger: 'blur'}
        ],
        origin:[
          {required:true,message: '请填写出发地', trigger: 'blur'},
          {pattern:/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,20}$/ , message:'仅支持1-20位中文、英文字符与下划线',trigger:'blur'}
        ],
        destination:[
          {required:true,message: '请填写目的地', trigger: 'blur'},
          {pattern:/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,20}$/ , message:'仅支持1-20位中文、英文字符与下划线',trigger:'blur'}
        ],
        reason:[
          {required:true,message: '请填写事由', trigger: 'blur'},
          // {pattern:/^[\u4e00-\u9fa5a-zA-Z0-9\s]{1,1000}$/ , message:'仅支持1-1000位中、英、数字字符',trigger:'blur'}
          // {pattern:/^[\u4e00-\u9fa5a-zA-Z0-9\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5\s]{1,1000}$/ , message:'仅支持1-1000位中、英、数字字符',trigger:'blur'}

        ],
        startFee:[
          {required:true,message: '请填写出发交通金额', trigger: 'blur'},
          {validator:feeVal, trigger: 'blur'},
          // {pattern:/^([1-9]\d{0,3})|10000|0$/ , message:'仅支持0-100000的1212整数',trigger:'blur'}
        ],
        startTraffic:[
          {type: 'array', required: true, message: '请选择出发交通工具', trigger: 'change' }
        ],
        returnFee:[
          {required:true,message: '请填写返回交通金额', trigger: 'blur'},
          {validator:feeVal, trigger: 'blur'},
        ],
        returnTraffic:[
          {type: 'array', required: true, message: '请选择出发交通工具', trigger: 'change' }
        ],
        accommodationFee:[
          {required:true,message: '请填写住宿限额', trigger: 'blur'},
          {validator:feeVal, trigger: 'blur'},
        ],
        stayBeginDate:[
          {required:true, validator:stayBegin, trigger: 'blur'}
        ],
        stayEndDate:[
          {required:true, validator:stayEnd, trigger: 'blur'}
        ],
        accommodationFeeTotal:[
          {required:true,message: '请填写住宿金额', trigger: 'blur'},
          {validator:feeVal, trigger: 'blur'},
        ],
        otherFeeInfo:[
          {pattern:/^[\u4e00-\u9fa5a-zA-Z0-9\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5\s]{1,200}$/ , message:'仅支持1-200位中、英、数字字符',trigger:'blur'}
        ],
        otherFee:[
          {validator:feeVal, trigger: 'blur'},
        ],
        totalFee:[
          {required:true,message: '请填写暂支金额', trigger: 'blur'},
          {validator:feeVal, trigger: 'blur'},
        ],
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
      // 记录
      record: []
    }
  },
  computed:{
    ...mapState({
      "traffiType" : state => state.selectData.traffiType.list,
    }),
    // baseForm(){
    //   return this.$store.state.headInfo
    // }
  },
  watch: {
    'editForm.startFee' (val) {
      this.totalFee()
    },
    'editForm.returnFee' (val) {
      this.totalFee()
    },
    'editForm.accommodationFeeTotal' (val) {
      this.totalFee()
    },
    'editForm.otherFee' (val) {
      this.totalFee()
    },
    revokeFormShow(val){
      if(!val){
        this.$refs['revokeParam'].resetFields()
      }
    },
    // 预计总金额
    'editForm.expectedFee' (val){
      if(isNaN(val)){
        this.editForm.expectedFee = ''
      }
    }
  },
  created(){
    this.baseForm = this.$store.state.headInfo
    this.editForm.approveDate = this.$util.timestampToTime(global.NOWTIME)
    this.editForm.approveDate=String(this.editForm.approveDate).substr(0,10)
    // 待处理状态 - 1 查看状态 然后按钮 四个按钮
    let code = sessionStorage.applyState
    let info = window.sessionStorage["apply"]
    info = JSON.parse(info)
    // 加载title
    this.templateName = info.templateName
    if(code === '0'){//发起审批 提交-0
      this.wait = true
      this.applyBtn = true
      // this.agreeBtn = false
      // 判断是否有单号，如果有：就先load已有的信息
      if(info.formNo){
        this.loadFormInfo(info)
        this.waitRecord=true
      }
    }else if(code === '1'){//待处理审批 同意 不同意 -1
      this.listBtn = true
      // this.agreeBtn = false
      this.waitRecord=true
       // 1.load表单信息
      this.loadFormInfo(info)
    }else{     //其他 已处理，我发起，抄送 查看-2
      this.wait = false
      this.waitRecord=true
      this.listBtn = false
      this.applyBtn = false
      this.agreeBtn = true
       // 1.load表单信息
      this.loadFormInfo(info)
    }
  },
  methods:{
    loadFormInfo(info){
      if (info) {
        // 2.load表单信息
        this.$store.dispatch("gainProcess", info).then(res=>{
          // 所有信息
          this.editForm = res.form
          // 单号
          this.editForm.approveNum = res.form.approveNum
          if(this.wait){
            // this.editForm.startTraffic = (res.form.startTraffic).split(',')
            // this.editForm.returnTraffic = (res.form.returnTraffic).split(',')
          }else{
            // 初始化交通
            var thisTraffic = ''
            let This = this
            // this.initTraffic(res.form.startTraffic,thisTraffic,function(thisTraffic){
            //   This.editForm.startTraffic = thisTraffic
            // })
            // this.initTraffic(res.form.returnTraffic,thisTraffic,function(thisTraffic){
            //   This.editForm.returnTraffic = thisTraffic
            // })
          }
          // 2.发起后的基本信息
          this.baseRes = res.form.approveUserInfo
          // 预计总金额
          this.editForm.expectedFee = res.form.expectedFee
          // 记录
          this.record = res.record
          if(info.prcessStatus == 4){
            this.record.unshift({nodeName : '结束审批' , handleOpinionCode : '0', process : '4'})
          }
        })
      }
    },
    // 初始化交通工具
    initTraffic(traffic,thisTraffic,callback){
      traffic = traffic.split(',')
      let trafficArr = this.$store.state.selectData.traffiType.list
      traffic.forEach(a => {
        trafficArr.forEach(b => {
          if(a === b.code){
            thisTraffic = thisTraffic +b.name+ ',' 
          }
        })
      })
      thisTraffic = thisTraffic.substring(0,thisTraffic.length - 1)
      return callback(thisTraffic)
    },
    // 返回列表
    backManage(){
      this.$router.routeBack('',1);
    },
    // 提交申请 确定
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
            let editForm = Object.assign({},this.editForm)
            // 交通工具
            // editForm.startTraffic = editForm.startTraffic.toString()
            // editForm.returnTraffic = editForm.returnTraffic.toString()
            // 费用数字
            editForm.startFee = Number(this.editForm.startFee)
            editForm.returnFee = Number(this.editForm.returnFee)
            editForm.accommodationFeeTotal = Number(this.editForm.accommodationFeeTotal)
            editForm.otherFee = Number(this.editForm.otherFee)
            editForm.accommodationFee = Number(this.editForm.accommodationFee)
            editForm.totalFee = Number(this.editForm.totalFee)
            this.$api.submittravel(editForm).then(res => {
              this.$refs['editForm'].clearValidate(['startTraffic','returnTraffic'])
              this.$router.push({name:'myselfList'})
              this.$message.success('成功')
            }).catch(()=>{
                this.isClicked = false;
            })   
          }else{
              this.$message.error('上次提交尚未完成!'); 
          }
          // this.editForm.startTraffic = this.editForm.startTraffic.split(',')
          // this.editForm.returnTraffic = this.editForm.returnTraffic.split(',')
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
    stayEndDateC(){
      if(this.editForm.stayEndDate != ''&&this.editForm.stayBeginDate!=''){
        this.editForm.dayNum =moment(moment(this.editForm.stayEndDate) - moment(this.editForm.stayBeginDate)).dayOfYear()-1
      }
    },
    // 计算总额
    totalFee () {
      if(this.wait){
        this.editForm.expectedFee = Number(this.editForm.startFee)+Number(this.editForm.returnFee)+Number(this.editForm.accommodationFeeTotal)+Number(this.editForm.otherFee)
      }
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
#busTravel
  .innerContent
    background: #fff
    clear: both
    padding-bottom: 30px
    border: 1px solid #DCDFE6
  .fontC6
    font-size: 14px
    color: #666666
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
  .width300
    width: 300px
  .width150
    width: 100%
    min-width: 102px
  .width130
    width: 100%
    min-width: 150px
  .spanText
    // padding-right: 100px
    display: inline-block
  .margin6
    margin-bottom: 6px
  .expectedFeeSpan
    float: right
    margin: -20px 30px 0 0
    font-size: 14px
    font-weight: bold
    color: rgb(226, 112, 111)
  .vehicleTable
    border: 1px solid #DCDFE6
    color: #63717F
    width: 98%
    tr
      line-height: 39px
    tr td
      border: 1px solid #DCDFE6
      text-align: center
    .bgF9
      background: #F5F7F9
      line-height: 30px !important
    .line34
      line-height: 34px
    
</style>

