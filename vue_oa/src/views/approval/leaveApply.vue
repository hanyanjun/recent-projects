<template>
<div class="leaveApply  companyCommon companyList">
    <infoHead :title="info.templateName" @back="back">
    </infoHead>   
    <div :class="[{'wrap' : pre || record.length > 0}]">
        <div class="leaveApplyCon  ">
        <el-form ref="form" class="formInline" :rules="rules" size="medium" :model="baseInfo" label-width="114px">
                <el-form-item label="审批单号" size="medium"   :style="{display: 'block'}">
                    <previewInfo :visible="true" :info="baseInfo.approveNum || '提交后自动生成'"  :infoStyle="!baseInfo.approveNum ?{color : '#C1C5CD'} : {}"></previewInfo> 
                </el-form-item>
                <el-form-item label="申请人" size="medium">
                    <previewInfo :visible="true" :info="form.approveUserInfo.approveUserName || userInfo.name"></previewInfo>  
                </el-form-item>
                <el-form-item label="申请人职位" size="medium" >
                    <previewInfo :visible="true" :info="form.approveUserInfo.approveUserPositionName || userInfo.position"></previewInfo>
                </el-form-item>
                <el-form-item label="部门" size="medium"> 
                    <previewInfo :visible="true" :info="form.approveUserInfo.approveUserDeptName || userInfo.deptName"></previewInfo> 
                </el-form-item>
                <el-form-item label="申请日期" size="medium"> 
                    <previewInfo :visible="true" :info="form.approveDate ? String(form.approveDate).substr(0,10) :   String(baseInfo.approveDate).substr(0,10)"></previewInfo> 
                </el-form-item>
                <el-form-item label="请假类型" size="medium"  prop="leaveType" :style="{display: 'block', width : '100%'}">
                    <previewInfo :visible="pre" :info="leaveType.obj[form.leaveType]"></previewInfo> 
                    <el-radio-group v-model="baseInfo.leaveType"  v-show="!pre" >
                     <el-radio  v-show="!pre"  :label="item.code" v-for="(item,index) in  leaveType.list" :key="index">{{item.name}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div>
                    <el-form-item label="请假开始时间" size="medium"  prop="leaveStartTime"  class="inline-item">
                    <previewInfo :visible="pre" :info="form.leaveStartTime"></previewInfo> 
                    <el-date-picker
                                v-model="baseInfo.leaveStartTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                @change="autoTime1"
                                format="yyyy-MM-dd"
                                v-show="!pre"
                                placeholder="日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item  size="medium"  prop="leaveStartTime1"  class="inline-item1" label-width="0">
                 <el-time-select
                                  placeholder="时间"
                                  class="timePicker"
                                @change="autoTime1"
                                v-show="!pre"
                                  v-model="baseInfo.leaveStartTime1"
                                  :picker-options="{
                                    start: '09:30',
                                    step: '00:30',
                                    end: '18:30'
                                  }"></el-time-select>
                </el-form-item>
                </div>
                <div>
                    
                <el-form-item label="请假结束时间" size="medium"  prop="leaveEndTime"  class="inline-item">
                    <previewInfo :visible="pre" :info="form.leaveEndTime"></previewInfo> 
                       <el-date-picker
                                v-model="baseInfo.leaveEndTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                @change="autoTime1"
                                format="yyyy-MM-dd"
                                range-separator="至"
                                v-show="!pre"
                                placeholder="日期">
                      </el-date-picker>
                </el-form-item>
                
                <el-form-item  size="medium"  prop="leaveEndTime1" class="inline-item1" label-width="0">
                                <el-time-select
                                  placeholder="时间"
                                  class="timePicker"
                                @change="autoTime1"
                                v-show="!pre"
                                  v-model="baseInfo.leaveEndTime1"
                                  :picker-options="{
                                    start: '09:30',
                                    step: '00:30',
                                    end: '18:30'
                                  }"></el-time-select>
                </el-form-item>
                </div>
                
                <el-form-item label="请假天数(天)" size="medium"  prop="leaveDay">
                    <previewInfo :visible="pre" :info="String(form.leaveDay)"></previewInfo> 
                    <el-input   :disabled="true" v-model.trim="baseInfo.leaveDay" v-show="!pre" placeholder="自动生成"></el-input>
                </el-form-item>
                <el-form-item label="请假时长(小时)"  prop="leaveHour" >
                    <previewInfo :visible="pre" :info="String(form.leaveHour)"></previewInfo> 
                    <el-input  :disabled="true" v-model.trim="baseInfo.leaveHour" v-show="!pre" placeholder="自动生成"></el-input>
                </el-form-item>
                <el-form-item label="请假原因" size="medium"  prop="reason" :style="{display: 'block', width: '100%'}">
                    <previewInfo :visible="pre" :info="form.reason"></previewInfo> 
                    <el-input  v-model.trim="baseInfo.reason"  type="textarea"  :rows="2"  maxlength="1000" v-show="!pre" placeholder="1-1000位字符"></el-input>
                </el-form-item>
                 <div class="content1">
                    <span class="type type1" >说明附件</span>
                    <span class="previewInfoWrap" v-if="list.length  == 0 && pre">
                        <previewInfo :visible="pre" holder="未上传"></previewInfo> 
                    </span>
                    <div class="conUp">
                    <uploadImg :list.sync="list"  canvasType="base" :allowType="['img','pdf','doc','docx','xls','xlsx']"   type="leave"  :dele="true" :isPre="pre" :size="2"  holder="*格式为 JPG/JPEG/PNG/PDF/DOC/DOCX/XLS/XLSX,大小在2M以内">

                    </uploadImg>
                    </div>
                </div>
                <div class="btnsOpper" >
                    <span class="ssubmit pointer" v-if="status == 0" @click="submit('form')" >提交
                        </span><el-button size="medium"  :style="{width : '150px', height : '44px' ,margin : '0 0 20px 20px'}" v-if="status == 0"  @click.stop="back">取消</el-button>
                    <opper  :status="status"  @confirm="opper"></opper>
                </div>
            </el-form>
    </div>
    <div class="status">
        <speed :list="record"></speed>
    </div>
    </div>


</div>    
</template>

<script>
import infoHead from "../../components/infoHead";
import previewInfo from "../../components/previewInfo";
import uploadImg from "./uploadImg";
import speed from "./speed";
import validate from "../../util/validate.js";
import opper from "./opper";
export default {
  name: "leaveApply",
  components: { infoHead, previewInfo, uploadImg ,speed  ,opper},
  data() {
    var timeValite1 = (rule, value, callback) => {
      if (
        value &&  
        this.baseInfo.leaveEndTime  &&
        // (this.baseInfo.leaveEndTime + (this.baseInfo.leaveEndTime1 || '')) <  (value  + (this.baseInfo.leaveStartTime1 || ''))
        this.baseInfo.leaveEndTime  <  value 
      ) {
        callback(new Error("开始日期须小于结束日期"));
      } else {
        callback();
        this.autoTime();
        this.$refs['form'].clearValidate(['leaveEndTime','leaveStartTime','leaveEndTime1','leaveStartTime1'])
      }
    };
    var timeValite2 = (rule, value, callback) => {
      if (
        value &&  
        this.baseInfo.leaveStartTime  &&
        // (this.baseInfo.leaveStartTime +  (this.baseInfo.leaveStartTime1 || ''))   >  (value + (this.baseInfo.leaveEndTime1 || ''))
        this.baseInfo.leaveStartTime    >  value
      ) {
        callback(new Error("结束日期须大于开始日期"));
      } else {
        callback();
        this.autoTime();
        this.$refs['form'].clearValidate(['leaveEndTime','leaveStartTime','leaveEndTime1','leaveStartTime1'])
      }
    };
    var timeValite3 = (rule, value, callback) => {
      if (
          value &&  
        this.baseInfo.leaveEndTime  &&
        (this.baseInfo.leaveEndTime + (this.baseInfo.leaveEndTime1 || '')) <  ((this.baseInfo.leaveStartTime || '') + value)
      ) {
        callback(new Error("开始时间须小于结束时间"));
      } else {
        callback();
        this.autoTime();
        this.$refs['form'].clearValidate(['leaveEndTime','leaveStartTime','leaveEndTime1','leaveStartTime1'])
      }
    };
    var timeValite4 = (rule, value, callback) => {
      if (
        value &&  
        this.baseInfo.leaveStartTime  &&
        (this.baseInfo.leaveStartTime +  (this.baseInfo.leaveStartTime1 || ''))   >  ((this.baseInfo.leaveEndTime || '') + value)
      ) {
        callback(new Error("结束时间须大于开始时间"));
      } else {
        callback();
        this.autoTime();
        this.$refs['form'].clearValidate(['leaveEndTime','leaveStartTime','leaveEndTime1','leaveStartTime1'])
      }
    };
    return {
      info: {},
      pre: false,
      list: [],
      status : '',
      isSubmit : false, // 
      form : { approveUserInfo : {}},
      record : [],
      isClicked : false,
      baseInfo : {
            approveDate	: '' ,// 申请日期	object	非空
            approveNum	: '' ,//	审批单号	string	二次提交时必须提交
            leaveDay	: '' ,//	请假天数(天)	number	非空
            leaveEndTime	: '' ,//	结束日期	object	非空
            leaveHour	: '' ,//	请假时长(小时)	number	非空
            leaveStartTime	: '' ,//	开始日期	object	非空
            leaveType	: '' ,//	请假类型（查看字典type=leaveType）	string	非空
            reason	: '' ,//	请假原因	string	非空
            templateId	: '' ,//	模板id
            leaveFiles : [],
            leaveEndTime1 : '', //结束时间
            leaveStartTime : '', //开始时间
      },
        rules : {
            leaveType : [
                { required: true, message: '请选择请假类型', trigger: 'change' },
            ],
            leaveEndTime : [
                { required: true, message: '请选择请假结束日期', trigger: 'blur' },
                {validator : timeValite2 , trigger : 'blur'}
            ],
            leaveStartTime : [
                { required: true, message: '请选择请假开始日期', trigger: 'blur' },
                {validator : timeValite1 , trigger : 'blur'}
            ],
            leaveEndTime1 : [
                { required: true, message: '请选择请假结束时间', trigger: 'blur' },
                {validator : timeValite4 , trigger : 'blur'}
            ],
            leaveStartTime1 : [
                { required: true, message: '请选择请假开始时间', trigger: 'blur' },
                {validator : timeValite3 , trigger : 'blur'}
            ],
            reason : [
                { required: true, message: '请填写请假原因', trigger: 'change' },
                // { validator: validate.validateCharacter, trigger: "blur" }
            ]
        },
    };
  },
  computed: {
    leaveType() {
      return this.$store.state.selectData.leaveType;
    },
    userInfo(){
        return this.$store.state.headInfo;
    }

  },
  created() {
    let info = window.sessionStorage["apply"];
    let status = window.sessionStorage['applyState'];
    this.baseInfo.approveDate = this.$util.timestampToTime(global.NOWTIME);
    this.status = status;
    if (info && status) {
      info = JSON.parse(info);
      this.info = info;
      if(info.formNo){
          this.$store.dispatch("gainProcess", info).then(obj=>{
              this.form = obj.form;
              let   base = Object.assign({},obj.form);
              let a1 = base.leaveStartTime.split(' ');
              let a2 = base.leaveEndTime.split(' ');
              base.leaveStartTime = a1[0];
              base.leaveStartTime1 =  a1[1].substring(0,5);
              base.leaveEndTime = a2[0];
              base.leaveEndTime1 = a2[1].substring(0,5);
              this.baseInfo = Object.assign({},base);
              Object.assign(this.baseInfo,base);
                
              this.record = obj.record;
              if(info.prcessStatus == 4){
                  this.record.unshift({nodeName : '结束审批' , handleOpinionCode : '0', process : '4'})
              }
              if(status != 0){
                this.pre = true;this.rules = {};
              }
              this.list = this.form.leaveFiles;
          })
      }
    }else{
        this.$router.push({path : '/home/errorPage/404'})
    }
  },
  methods:{
      submit(formName){
          this.isSubmit = true;
        this.$refs[formName].validate((valid)=>{
              if(valid){
                  if(!this.isClicked){
                    let base = Object.assign({},this.baseInfo);
                    base.leaveFiles = [...this.list];
                    base.leaveStartTime = base.leaveStartTime + ' '+ base.leaveStartTime1+ ':00';
                    base.leaveEndTime = base.leaveEndTime + ' '+ base.leaveEndTime1+ ':00';
                    if(base.leaveStartTime > base.leaveEndTime){
                        this.$message.error('开始时间需要小于结束时间');
                    }else{
                        this.isClicked = true;
                        base.templateId = (this.info.id || this.info.templateId);
                        this.$api.approvalSubmitLeave(base).then(obj=>{
                            this.$message.success('成功发起请假申请!');
                            this.back();
                        }).catch(()=>{
                            this.isClicked = false;
                        })                  
                    }
                  }else{
                     this.$message.error('上次提交尚未完成!');
                  }
              }
          })
      },
      autoTime1(){
          this.isSubmit = false;
      },
      autoTime(){
          if(!this.baseInfo.leaveStartTime || !this.baseInfo.leaveEndTime) return ;
          if(!this.baseInfo.leaveStartTime1 || !this.baseInfo.leaveEndTime1) return;
          if(this.isSubmit) return;
          this.$api.approvalDuration({
              approveNum : this.baseInfo.approveNum , 
              endTime : this.baseInfo.leaveEndTime + ' ' +this.baseInfo.leaveEndTime1 + ':00',
              formType : 'leave',
              leaveType : '',
              startTime : this.baseInfo.leaveStartTime +  ' '+ this.baseInfo.leaveStartTime1 + ':00',
              }).then(obj=>{
                  this.baseInfo.leaveDay = obj.data.data.days;
                  this.baseInfo.leaveHour = obj.data.data.duration;
              })
      },
      opper(obj){
          let base = Object.assign({},this.info);
          base.handleOpinionCode = obj.type;
          base.handleOpinionDesc = obj.reason; 
          this.$api.processRoam(base).then(obj=>{
              this.$message.success('操作成功!');
              this.back();
          })
      },
      back(){  
            this.$router.routeBack('',1);
      },
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.leaveApply {
  height: 100%;
}
.status{
    display: none;
}
.wrap{
    width: 100%;
    .leaveApplyCon{
     width: calc(100% - 380px);
     display: inline-block;
     vertical-align: top;
    }
    .status{
        display: inline-block;
        width: 350px;
        margin-left: 23px;
    }
}
.leaveApplyCon {
  background: white;
  padding: 35px 50px 47px;
  background: white;
  box-shadow:0px 3px 5px 0px rgba(221,221,221,1);
  border:1px solid rgba(220, 223, 230, 1);
  position: relative;
  box-sizing: border-box;
  .el-input {
    width: 500px;
    display: inline-block;
  }
  .el-date-editor{
      width: 200px;
    display: inline-block;
  }
  .el-form-item {
    width: 614px;
    // margin-right: 150px;
  }
  .inline-item{
      width: 300px;
      margin-right: 0;
  }
  .inline-item1{
      width: 200px;
      margin-right: 0;
      margin-left: 30px;
  }
}
.leaveApplyCon{
     position: relative;
     .type{
        display: inline-block;
        height:14px;
        line-height: 14px;
        font-size:14px;
        color:rgba(102,102,102,1);
        padding-left: 10px;
     }
     .type1{
        position: absolute;
        left: 0;
        top: 0;
     }
    .conUp{
        display: inline-block;
        vertical-align: top;
        padding-left: 114px;
    }
    .content1{
        position: relative;
    }
    .previewInfoWrap{
        margin-left: 114px;
    }
}
.btnsOpper{
        text-align: center;
        padding-top: 20px;
        .ssubmit{
            display: inline-block;
            width:150px;
            height:44px;
            background:$base_blue;
            line-height: 44px;
            border-radius:4px;
            margin-bottom: 20px;
            color: white;
            box-sizing: border-box;
        }
        .cancle{
            display: inline-block;
            width:150px;
            height:44px;
            background:rgba(249,249,249,1);
            border:1px solid rgba(204, 204, 204, 1);
            border-radius:4px;
            color: $gray_b;
            line-height: 44px;
            margin-left: 20px;
        }
    }
</style>
