<template>
<div class="leaveApply  companyList  companyCommon">
    <infoHead :title="info.templateName" @back="back">
    </infoHead>   
    <div :class="[{'wrap' : pre || record.length > 0}]">
    <div class="leaveApplyCon formInline companyCommon companyList">
        <el-form ref="form" class="formLabelTop" :rules="rules" size="medium" :model="baseInfo" label-width="114px">
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
                <el-form-item label="补打卡信息" size="medium" class="labelTop"  prop="records" :style="{display: 'block', width: '100%'}">
                    <span class="addTime pointer" @click.stop="addItem"   v-show="status == 0"> <i class="iconfont icon-ic_join_dialing_norm icon"></i>添加补卡时间</span>
                    <el-input  v-model.trim="baseInfo.records"   v-show="false"></el-input>
                    <div class="table tableTDRB" v-show="records.length  > 0">
                                <el-table :data="records"     >
                                <el-table-column v-for="(column, key) in  tabList"   :prop="column.pro" :label="column.label"  :key="`${key}_${column.pro}`" :width="column.width">
                                    <template slot-scope="scope">
                                        <span :class="['font']" >
                                            <template v-if="column.pro == 'punchTime'">
                                                {{String(scope.row[column.pro]).substr(0,16)}}
                                            </template>
                                            <template v-else>
                                               {{scope.row[column.pro] || '---'}}
                                            </template>
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" v-if="status == 0">
                                    <template slot-scope="scope">
                                        <el-tooltip effect="dark" content="编辑补卡时间" placement="right-end">
                                                <i class="iconfont  pointer icon-bianji" @click.stop="editRules(scope.row,scope.$index)"></i>
                                            </el-tooltip>
                                            <el-tooltip effect="dark" content="删除补卡时间" placement="right-end">
                                                <i class="iconfont icon-del  pointer" @click.stop="deleDetail(scope.row,scope.$index)" ></i>
                                            </el-tooltip>
                                    </template>
                                </el-table-column>
                            </el-table>
                    </div>
                </el-form-item>

                 <div class="content1">
                    <span class="type type1" >证明材料</span>
                    <span class="previewInfoWrap" v-if="list.length  == 0 && pre">
                        <previewInfo :visible="pre" holder="未上传"></previewInfo> 
                    </span>
                    <div class="conUp">
                    <uploadImg  :list.sync='list' :isOriginImg="true" canvastype='base' :allowType="['img','pdf']"  type='patch_card'  :dele='true' :isPre="pre"  :size='2' holder='格式为 PDF/JPG/JPEG/PNG 大小在2M以内'>

                    </uploadImg>
                    </div>
                </div>
                <div class="btnsOpper" >
                    <span class="ssubmit pointer" v-if="status == 0" @click="submit('form')" >提交</span>
                    <el-button size="medium"  :style="{width : '150px', height : '44px' ,margin : '0 0 20px 20px'}" v-if="status == 0"  @click.stop="back">取消</el-button>
                    <opper :status="status"  :isComplate="info.prcessStatus == 4" @confirm="opper"></opper>
                </div>
            </el-form>
    </div>
    <div class="status">
        <speed :list="record"></speed>
    </div>

    </div>


    <!-- 添加时间的弹窗 -->
    <reDialog  :title="dialogTitle" 
                  :visible.sync="dialog" 
                  width="510px"
                  @close="resetForm"
                  @cancle="resetForm"
                  @submit="submit1('form1')">
         <div class=" examCheckbox " slot="body">
             <el-form  class="companyCommon" :model="dialogForm" label-width="114px" :rules="dialogRules" ref="form1">
                <el-form-item  class="dialogForm" label="补打卡时间" size="medium" prop="punchTime">
                    <el-date-picker
                    v-model="dialogForm.punchTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择打卡时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item  class="dialogForm" label="补打卡原因" size="medium" prop="reason" >
                    <el-input  v-model.trim="dialogForm.reason" maxlength="100"  type="textarea"  :rows="4"  placeholder="1-100个字符（非交通故障请填写2位证明人）"></el-input>
                </el-form-item>
             </el-form>
         </div>         
    </reDialog>
</div>    
</template>

<script>
import infoHead from "../../components/infoHead";
import previewInfo from "../../components/previewInfo";
import uploadImg from "./uploadImg";

import speed from "./speed";
import opper from "./opper";
import validate from "../../util/validate.js";
import reDialog from "../../components/reDialog";
export default {
  name: "leaveApply",
  components: { infoHead, previewInfo, uploadImg, reDialog, opper, speed },
  data() {
    var timeValite = (rule, value, callback) => {
      if (value && value > this.$util.timestampToTime(global.NOWTIME)) {
        callback(new Error("打卡时间须小于当前时间"));
      } else if (value > this.$util.timestampToTime(global.NOWTIME)) {
        callback(new Error("打卡时间须小于当前时间"));
      } else {
        callback();
        this.$refs["form1"].clearValidate(["punchTime"]);
      }
    };
    return {
      info: {},
      pre: false,
      dialog: false,
      curIndex : '',
      isClicked : false,
      form: { approveUserInfo: {} },
      record: [],
      dialogTitle: "补打卡时间",
      list: [],
      tabList: [
        { pro: "punchTime", label: "补打卡时间" },
        { pro: "reason", label: "补打卡原因" }
      ],
      dialogForm: {
        punchTime: "", //	加班时长	number	非空
        reason: "" //	结束时间	object	非空
      },
      baseInfo: {
        templateId: "",
        approveNum: "",
        records: "" //	补卡明细	array<object>	非空
      },
      records: [],
      dialogFormCopy: {
        punchTime: "", //	加班时长	number	非空
        reason: "" //	结束时间	object	非空
      },
      rules: {
        records: [
          { required: true, message: "请添加补打卡明细", trigger: "blur" }
        ]
      },
      dialogRules: {
        punchTime: [
          { required: true, message: "请选择打卡时间", trigger: "change" },
          { validator: timeValite, trigger: "blur" }
        ],
        reason: [
          { required: true, message: "请填写打卡原因", trigger: "change" },
          // { validator: validate.validateCharacter, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
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
    this.baseInfo.approveDate = this.$util.timestampToTime(global.NOWTIME);
    this.status = status;
    if (info && status) {
      info = JSON.parse(info);
      this.info = info;
      if (info.formNo) {
        this.$store.dispatch("gainProcess", info).then(obj => {
          this.form = obj.form;
          Object.assign(this.baseInfo, obj.form);
          this.baseInfo.records = "1";
          this.record = obj.record;
          if (info.prcessStatus == 4) {
            this.record.unshift({
              nodeName: "结束审批",
              handleOpinionCode: "0",
              process: "4"
            });
          }
          if (status != 0) {
            this.pre = true;
            this.rules = {};
          }
          this.records = [...obj.form.records];
          this.list = this.form.attachments;
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
            base.records = [...this.records];
            base.attachments = Object.assign([],this.list);
            this.$api.approvalSubmitPatchcard(base).then(obj => {
              this.$message.success("成功发起补打卡申请!");
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
          if (this.records.length > 0) {
            this.baseInfo.records = "1";
          }
          this.dialog = false;
          this.resetForm();
          this.$refs.form.clearValidate(['records']);
        }
      });
    },
    editRules(item, index) {
      this.dialog = true;
      this.dialogTitle = "编辑时间";
      this.dialogForm = Object.assign({}, item);
      this.curIndex = String(index);
    },
    addItem() {
      this.dialog = true;
      this.dialogTitle = "添加时间";
      this.dialogForm = Object.assign(
        {},
        {
        punchTime: "", //	加班时长	number	非空
        reason: "" //	结束时间	object	非空
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
        if (this.records.length == 0) {
          this.baseInfo.records = "";
        }
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
    resetForm() {
      this.$nextTick(() => {
        if (this.$refs["form1"]) {
          this.$refs["form1"].resetFields();
        }
        this.dialogForm = Object.assign({}, this.dialogFormCopy);
      });
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
    width: calc(100% - 380px);
  min-width: 540px;
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
  box-shadow: 0px 3px 5px 0px rgba(221, 221, 221, 1);
  border: 1px solid rgba(220, 223, 230, 1);
  position: relative;
  box-sizing: border-box;
  .el-input {
    width: 500px;
  }
  .el-form-item {
    width: 614px;
    // margin-right: 150px;
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
    font-family: "Microsoft YaHei";
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
    .content1{
        position: relative;
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
