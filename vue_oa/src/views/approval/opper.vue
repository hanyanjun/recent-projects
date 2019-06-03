<template>
  <div  v-show="status && status!= 0">
    <div class="opperButton">
      <el-button
      @click.stop="agree"
      size="medium"
      v-show="status == 1"
      type="primary"
      :style="{width : '150px', height : '44px',marginBottom : '20px' }"
    >同意</el-button>
    <el-button
      @click.stop="noAgree"
      size="medium"
      type="danger "
      v-show="status == 1"
      :style="{width : '150px', height : '44px' ,marginBottom : '20px'}"
      plain
    >不同意</el-button>
    <el-button
      @click.stop="reBack"
      size="medium"
      v-show="status == 1"
      type="success "
      :style="{width : '150px', height : '44px' ,marginBottom : '20px'}"
      plain
    >退回给申请人</el-button>
    <el-button size="medium" type="primary" :style="{width : '150px', height : '44px' ,marginBottom : '20px'}" @click.stop="print" v-if="status != 0">打印预览</el-button>
    <el-button size="medium"  :style="{width : '150px', height : '44px' ,marginBottom : '20px'}" @click.stop="back">返回</el-button>
    </div>
    <reDialog
      :title="title"
      :visible.sync="dialog"
      width="510px"
      @close="resetForm"
      @submit="submit1('form1')"
    >
      <div slot="body">
        <el-form
          class="formLabelTop"
          :model="dialogForm"
          label-width="114px"
          :rules="dialogRules"
          ref="form1"
        >
          <template v-if="type == '0'">
            <el-form-item class="dialogForm" label="原因" size="medium">
              <el-input
                v-model="dialogForm.reason"
                type="textarea"
                :rows="3"
                placeholder="1-100个字符"
                maxlength="100"
              ></el-input>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item class="dialogForm" label="原因" size="medium" prop="reason">
              <el-input
                v-model="dialogForm.reason"
                type="textarea"
                :rows="3"
                placeholder="1-100个字符"
                maxlength="100"
              ></el-input>
            </el-form-item>
          </template>
        </el-form>
      </div>
    </reDialog>
  </div>
</template>

<script>
//  0 同意  1 不同意  1 退回
import reDialog from "../../components/reDialog";
import validate from "../../util/validate.js";
export default {
  name: "opper",
  components: { reDialog },
  data() {
    return {
      dialog: false,
      dialogForm: {
        reason: ""
      },
      type: "",
      title: "同意申请",
      dialogRules: {
        reason: [
          { required: true, message: "请输入原因", trigger: "blur" },
          // { validator: validate.validateCharacter, trigger: "blur" }
        ]
      },
      dialogRules1: {
        reason: [{ validator: validate.validateCharacter, trigger: "blur" }]
      }
    };
  },
  props: {
    require: {
      type: Boolean,
      default: false
    },
    isPrint: {
      type: Boolean,
      default: false
    },
    status : {
      type : [String,Number],
      default : ''
    }
  },
  methods: {
    agree() {
      this.dialog = true;
      this.title = "同意申请";
      this.type = "0";
    },
    back(){
      this.$router.routeBack("", 1);
    },
    noAgree() {
      this.dialog = true;
      this.title = "不同意申请";
      this.type = "1";
    },
    reBack() {
      this.dialog = true;
      this.title = "退回给申请人";
      this.type = "2";
    },
    print(){
      this.$emit('print')
    },
    resetForm() {
      this.dialog = false;
      this.$nextTick(() => {
        this.dialogForm.reason = "";
      });
    },
    submit1(formName) {
      this.$refs[formName].validate(valite => {
        if (valite) {
          this.$emit("confirm", {
            type: this.type,
            reason: this.dialogForm.reason
          });
          this.resetForm();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.cancle {
  display: inline-block;
  width: 150px;
  height: 36px;
  box-sizing: border-box;
  background: rgba(249, 249, 249, 1);
  border: 1px solid rgba(204, 204, 204, 1);
  border-radius: 4px;
  color: $gray_b;
  font-size: 14px;
  line-height: 36px;
  margin-left: 20px;
}
</style>
