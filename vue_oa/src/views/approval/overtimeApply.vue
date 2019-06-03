<template>
<div class="leaveApply  companyList   companyCommon">
    <infoHead :title="info.templateName" @back="back">
    </infoHead>   
    <div :class="[{'wrap' : pre || record.length > 0}]">
    <div class="leaveApplyCon formInline companyCommon companyList">
        <el-form ref="form" :rules="rules" size="medium" :model="baseInfo" label-width="114px">
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
                <el-form-item label="加班原因" size="medium"  prop="reason" :style="{display: 'block'}">
                    <previewInfo :visible="pre" :info="form.reason || baseInfo.reason"></previewInfo> 
                    <el-input  v-model.trim="baseInfo.reason"  type="textarea"  :rows="2"  maxlength="1000" v-show="!pre" placeholder="1-1000位字符"></el-input>
                </el-form-item>
                <el-form-item label="加班时间" size="medium" class="labelTop"  prop="records" :style="{display: 'block'}">
                    <span class="addTime pointer" @click.stop="addTime" v-show="status == 0"> <i class="iconfont icon-ic_join_dialing_norm icon" ></i>添加加班时间</span>
                    <el-input  v-model.trim="baseInfo.records"   v-show="false"></el-input>
                    <div class="table tableTDRB" v-show="records.length > 1  &&  status == 0">
                                <el-table :data="records"     :span-method="arraySpanMethod" >
                                <el-table-column v-for="(column, key) in  tabList"   :prop="column.pro" :label="column.label"  :key="`${key}_${column.pro}`" :width="column.width">
                                    <template slot-scope="scope">
                                        <template v-if="scope.$index != records.length - 1">
                                            <template v-if="column.pro == 'type'">
                                                <span :class="['font']" >
                                                        {{overtimeType.obj[scope.row[column.pro]]}}
                                                </span>
                                             </template>
                                             <template v-else-if="column.pro == 'startTime'">
                                                <span :class="['font']" >
                                                    {{String(scope.row[column.pro]).substr(0,16)}}~{{String(scope.row['endTime']).substr(0,16)}}
                                                </span>
                                             </template>
                                            <template v-else>
                                                <span :class="['font']" >
                                                    {{scope.row[column.pro]}}
                                                </span>
                                             </template>
                                        </template>
                                        <!-- 最后一行 -->
                                        <template v-else>
                                            <template v-if="column.pro == 'startTime'">
                                                <span :class="['font']" >
                                                    {{scope.row['duration']}}
                                                </span>
                                             </template>
                                            <template v-else>
                                                <span :class="['font']" >
                                                    {{scope.row[column.pro]}}
                                                </span>
                                             </template>
                                        </template>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <template v-if="scope.$index != records.length - 1">
                                            <el-tooltip effect="dark" content="编辑加班时间" placement="right-end">
                                                <i class="iconfont  pointer icon-bianji" @click.stop="editRules(scope.row,scope.$index)"></i>
                                            </el-tooltip>
                                            <el-tooltip effect="dark" content="删除加班时间" placement="right-end">
                                                <i class="iconfont icon-del  pointer" @click.stop="deleDetail(scope.row,scope.$index)" ></i>
                                            </el-tooltip>
                                        </template>
                                    </template>
                                </el-table-column>
                            </el-table>
                    </div>
                    <!-- 展示时 -->
                     <div class="table tableTDRB" v-show="records.length > 0  &&  status != 0">
                                <el-table :data="records"  :span-method="arraySpanMethod"   >
                                <el-table-column v-for="(column, key) in  tabList"   :prop="column.pro" :label="column.label"  :key="`${key}_${column.pro}`" :width="column.width">
                                    <template slot-scope="scope">
                                        
                                        <template v-if="scope.$index != records.length - 1">
                                            <template v-if="column.pro == 'type'">
                                                <span :class="['font']" >
                                                        {{overtimeType.obj[scope.row[column.pro]]}}
                                                </span>
                                             </template>
                                             <template v-else-if="column.pro == 'startTime'">
                                                <span :class="['font']" >
                                                    {{String(scope.row[column.pro]).substr(0,16)}}~{{String(scope.row['endTime']).substr(0,16)}}
                                                </span>
                                             </template>
                                            <template v-else>
                                                <span :class="['font']" >
                                                    {{scope.row[column.pro]}}
                                                </span>
                                             </template>
                                        </template>
                                        <!-- 最后一行 -->
                                        <template v-else>
                                            <template v-if="column.pro == 'startTime'">
                                                <span :class="['font']" >
                                                    {{scope.row['duration']}}
                                                </span>
                                             </template>
                                            <template v-else>
                                                <span :class="['font']" >
                                                    {{scope.row[column.pro]}}
                                                </span>
                                             </template>
                                        </template>
                                    </template>
                                </el-table-column>
                            </el-table>
                    </div>
                </el-form-item>

                <div class="btnsOpper" >
                    <span class="ssubmit pointer" v-if="status == 0" @click="submit('form')" >提交</span>
                    <el-button size="medium"  :style="{width : '150px', height : '44px' ,margin : '0 0 20px 20px'}" v-if="status == 0"  @click.stop="back">取消</el-button>
                    <opper  :status="status"    @confirm="opper"></opper>
                </div>
            </el-form>
    </div>
    <div class="status">
        <speed :list="record"></speed>
    </div>

    </div>


    <!-- 添加时间的弹窗 -->
    <reDialog  title="添加时间" 
                  :visible.sync="dialog" 
                  width="510px"
                  @close="resetForm"
                  @cancle="resetForm"
                  @submit="submit1('form1')">
         <div class=" examCheckbox " slot="body">
             <el-form  class="companyCommon" :model="dialogForm" label-width="114px" :rules="dialogRules" ref="form1">
                <el-form-item  class="dialogForm" label="加班类型" size="medium" prop="type">
                    <el-select v-model="dialogForm.type"  placeholder="请选择" @change="autoTime('type')">
                        <el-option  v-for="(item,index) in overtimeType.list" :key="index" :value="item.code" :label="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                  <el-form-item  class="dialogForm" label="开始日期" size="medium" prop="startTime">
                      <el-date-picker
                      v-model="dialogForm.startTime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择开始时间">
                      </el-date-picker>
                  </el-form-item>
                  <el-form-item  class="dialogForm" label="结束日期" size="medium" prop="endTime">
                      <el-date-picker
                      v-model="dialogForm.endTime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择结束时间">
                      </el-date-picker>
                  </el-form-item>

                <el-form-item  class="dialogForm" label="加班时长(小时)" size="medium" prop="duration" >
                    <el-input   :disabled="true" v-model.trim="dialogForm.duration"   placeholder="自动生成"></el-input>
                </el-form-item>
             </el-form>
         </div>         
    </reDialog>
</div>    
</template>

<script>
import infoHead from "../../components/infoHead";
import previewInfo from "../../components/previewInfo";
import uploadImg from "../contract/uploadImg";
import reDialog from "../../components/reDialog";
import speed from "./speed";
import opper from "./opper";
export default {
  name: "leaveApply",
  components: { infoHead, previewInfo, uploadImg, reDialog, opper, speed },
  data() {
    var timeValite1 = (rule, value, callback) => {
        var arys1 = new Array();
        arys1 = value.split(' ')[0].split('-');  
        var ssdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
        ssdate = ssdate.getDay() + 1;
        var reg = new RegExp(ssdate);
        if(reg.test(this.workdayWeeks) && value.split(' ')[1] < "20:00:00"){
            this.$refs["form1"].clearValidate(["startTime"]);
            callback(new Error("工作日加班开始时间需在20:00:00之后"));
            return;
        }
      if (value && this.dialogForm.endTime && this.dialogForm.endTime < value) {
        callback(new Error("开始时间须小于结束时间"));
      }
       else if (value > this.$util.timestampToTime(global.NOWTIME)) {
        callback(new Error("开始时间须小于当前时间"));
      }
       else {
        callback();
        this.autoTime('startTime');
        this.$refs["form1"].clearValidate(["endTime", "startTime"]);
      }
    };
    var timeValite2 = (rule, value, callback) => {
      if (
        value &&
        this.dialogForm.startTime &&
        this.dialogForm.startTime > value
      ) {
        callback(new Error("结束时间须大于开始时间"));
      } else if (value > this.$util.timestampToTime(global.NOWTIME)) {
        callback(new Error("结束时间须小于当前时间"));
      } else {
        callback();
        this.autoTime('endTime');
        this.$refs["form1"].clearValidate(["endTime", "startTime"]);
      }
    };
    return {
      info: {},
      pre: false,
      dialog: false,
      form: { approveUserInfo: {} },
      record: [],
      list: [],
      isClicked : false,
      isInWordDay : false,
      tabList: [
        { pro: "type", label: "加班类型" },
        { pro: "startTime", label: "开始时间-结束时间", width: "300" },
        { pro: "duration", label: "时长(小时)" }
      ],
      curIndex: "",
      dialogForm: {
        duration: "", //	加班时长	number	非空
        endTime: "", //	结束时间	object	非空
        startTime: "", //	开始时间	object	非空
        type: "" //加班类型（查看字典type=overtimeType）	string	非空
      },
      baseInfo: {
        approveDate: "", //	申请日期	object	非空
        approveNum: "", //	审批单号	string	二次提交时必须填写
        reason: "", //	加班原因	string	非空
        records: "", //	加班明细	array<object>	非空
        templateId: "" //	模板id
      },
      records: [{ type: "加班总时长", startTime: "2018-11-05", duration: "" }],
      dialogFormCopy: {
        duration: "", //	加班时长	number	非空
        endTime: "", //	结束时间	object	非空
        startTime: "", //	开始时间	object	非空
        type: "" //加班类型（查看字典type=overtimeType）	string	非空
      },
      dialogRules: {
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "change" },
          { validator: timeValite1, trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "change" },
          { validator: timeValite2, trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择加班类型", trigger: "change" }]
      },
        overtimeInfoRules : {
            reason : [
                { required: true, message: '请填写加班原因', trigger: 'change' },
                // { validator: validate.validateCharacter, trigger: "blur" }
            ],
            records : [
                { required: true, message: '请添加加班明细', trigger: 'change' },
            ]
        },
    };
  },
  computed: {
    rules() {
      if (this.status == 0) return this.overtimeInfoRules;
      return {};
    },
    overtimeType() {
      return this.$store.state.selectData.overtimeType;
    },
    userInfo() {
      return this.$store.state.headInfo;
    }
  },
  created() {
    let info = window.sessionStorage["apply"];
    let status = window.sessionStorage["applyState"];
    // 获取当前工作日设置
    this.$api.getAnnualRule().then(obj=>{
      this.workdayWeeks = obj.data.data.workdayWeeks;
    })
    this.baseInfo.approveDate = this.$util.timestampToTime(global.NOWTIME);
    this.status = status;
    if (info && status) {
      info = JSON.parse(info);
      this.info = info;
      if (info.formNo) {
        this.$store.dispatch("gainProcess", info).then(obj => {
          this.form = obj.form;
          Object.assign(this.baseInfo, obj.form);
          this.record = obj.record;
          this.baseInfo.records = "";
          if (info.prcessStatus == 4) {
            this.record.unshift({
              nodeName: "结束审批",
              handleOpinionCode: "0",
              process: "4"
            });
          }
          let arr = obj.form.records;
          this.records = [...arr,...this.records];
          // 预览和编辑表单都加总时长
          // this.records.push({
          //     type: "加班总时长",
          //     startTime: "2018-11-05",
          //     duration: ""
          //   });
          this.resetNum();
          if(status != 0){
            this.pre = true;
          }
        });
      }
    } else {
      this.$router.push({ path: "/home/errorPage/404" });
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(!this.isClicked){
            this.isClicked = true;
            let base = Object.assign({}, this.baseInfo);
            base.templateId = this.info.id || this.info.templateId;
            let arr = [...this.records];
            arr.splice(arr.length - 1, 1);
            base.records = [...arr];
            this.$api.approvalSubmitOvertime(base).then(obj => {
              this.$message.success("成功发起加班申请!");
              this.back();
            }).catch(()=>{
                this.isClicked = false;
            })    
          }else{
              this.$message.error('上次提交尚未完成!'); 
          }
        }
      });
    },
    autoTime(value){
          if(!this.dialogForm.startTime || !this.dialogForm.endTime) return ;
          if(!this.dialogForm.type) return;
          this.$api.approvalDuration({
              approveNum : this.baseInfo.approveNum , 
              endTime : this.dialogForm.endTime,
              formType : 'overtime',
              leaveType : '',
              overtimeType : this.dialogForm.type,
              startTime : this.dialogForm.startTime,
              }).then(obj=>{
                  this.dialogForm.duration = obj.data.data.duration;
              }).catch(obj=>{
                this.dialogForm[value] = '';
              })
    },
    submit1(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let arr = [...this.baseInfo.records];
          if (this.curIndex) {
            this.records.splice(
              this.curIndex,
              1,
              Object.assign({}, this.dialogForm)
            );
          } else {
            this.records.splice(
              arr.length - 1,
              0,
              Object.assign({}, this.dialogForm)
            );
          }
          this.dialog = false;
          this.resetForm();
          this.resetNum();
          this.$refs.form.clearValidate(['records']);
        }
      });
    },
    editRules(item, index) {
      this.dialog = true;
      this.dialogForm = Object.assign({}, item);
      this.curIndex = String(index);
    },
    addTime(item, index) {
      this.dialog = true;
      this.dialogForm = Object.assign(
        {},
        {
          duration: "",
          endTime: "",
          startTime: "",
          type: ""
        }
      );
      this.curIndex = "";
    },
    deleDetail(item, index) {
      this.$confirm("确认删除该加班时间?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.records.splice(index, 1);
      });
    },
    resetForm() {
      this.$nextTick(() => {
        if (this.$refs["form1"]) {
          this.$refs["form1"].resetFields();
        }
        this.dialogForm = Object.assign({}, this.dialogFormCopy);
      });
    },
    opper(obj) {
      let base = Object.assign({}, this.info);
      base.handleOpinionCode = obj.type;
      base.handleOpinionDesc = obj.reason;
      this.$api.processRoam(base).then(obj => {
        this.$message.success("操作成功!");
        this.back();
      });
    },
    back() {
      this.$router.routeBack("", 1);
    },
    resetNum() {
      let n = 0;
      let len = this.records.length - 1;
      this.records.forEach((v, i) => {
        if (i != len) {
          n = n + Number(v.duration);
        }
      });
      if (len > 0) {
        this.baseInfo.records = 1;
      }
      this.records[this.records.length - 1].duration = n;
      this.records = Object.assign([], this.records);
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == this.records.length - 1) {
        if (columnIndex === 0) {
          return [1, 2];
        } else if (columnIndex === 1) {
          return [0, 0];
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.leaveApply {
  height: 100%;
}
.status {
  display: none;
}
.wrap {
  width: 100%;
  .leaveApplyCon {
    width: calc(100% - 480px);
    display: inline-block;
    vertical-align: top;
  }
  .status {
    display: inline-block;
    width: 350px;
    margin-left: 23px;
  }
}
.leaveApplyCon {
  background: white;
  padding: 35px 50px 47px;
  background: white;
  position: relative;
  box-shadow: 0px 3px 5px 0px rgba(221, 221, 221, 1);
  border: 1px solid rgba(220, 223, 230, 1);
  .el-input {
    width: 500px;
  }
  .el-form-item {
    min-width: 614px;
    margin-right: 150px;
  }
  .table {
    max-width: 1000px;
    border-left: 1px solid $gray_f1;
    border-right: 1px solid $gray_f1;
    margin-bottom: 10px;
    .iconfont {
      color: $icon_g;
    }
    .icon-del {
      font-size: 14px;
      margin-left: 15px;
    }
    .icon-plus-circle {
      font-size: 18px;
    }
  }
}
.leaveApplyCon {
  position: relative;
  .type {
    display: inline-block;
    height: 14px;
    line-height: 14px;
    font-size: 14px;
    color: rgba(102, 102, 102, 1);
    padding-left: 10px;
  }
  .type1 {
    position: absolute;
    left: 0;
    top: 0;
  }
  .conUp {
    display: inline-block;
    vertical-align: top;
    padding-left: 114px;
  }
  .addTime {
    width: 150px;
    height: 36px;
    background: #f9f9f9;
    border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 5px;
    font-size: 14px;
    font-family:"Microsoft YaHei";
    font-weight: 400;
    color: rgba(155, 159, 166, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 22px;
  }
  .icon {
    font-size: 16px;
  }
  .icon-ic_join_dialing_norm{
    margin-right: 8px;
  }
}
.examCheckbox{
  padding-bottom: 10px;
}
.btnsOpper {
  text-align: center;
  padding-top: 20px;
  .ssubmit {
    display: inline-block;
    width: 150px;
    height: 44px;
    background: $base_blue;
    line-height: 44px;
    border-radius: 4px;
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
