<template>
<div class="process">
    <h6 class="title">
       <span>{{info.templateName}}</span>
       <i class="iconfont icon-fanhui pointer" @click.stop="back"></i>
    </h6>
    <div class="content">
      <scrollContent>
        <div class="pro" v-for="(item,index) in arr" :key="index">
            <template v-if="index == 0">
              <!-- 
                  edit="编辑" 
                  @edit="edit(0)" 
                  type1="通知给"
                  :m1="item.approvalUserType == '3' ? item.ccUserIdsStr : notice1.obj[item.approvalUserType]" 
                   -->
                <processItem 
                  add="添加流程"  
                  @add="add"  
                  :title="item.nodeName"></processItem>
            </template>
            <template v-else-if="index == arr.length - 1">
                <processItem  
                edit="编辑" 
                type1="通知给"
                :m1="item.approvalUserType == '3' ? item.ccUserIdsStr : notice.obj[item.approvalUserType]"  
                :isLast="true"
                @edit="edit( arr.length - 1)" 
                :title="item.nodeName"></processItem>
            </template>
            <template v-else>
                <processItem  
                edit="编辑" 
                :m1="item.approvalUserType == '3' ? item.assigneeStr : nodeAgginee.obj[item.approvalUserType]"
                :m2="item.ccUserType == '3' ?  item.ccUserIdsStr : nodeAgginee.obj[item.ccUserType]"
                  type1="审批人"
                  type2="抄送人"
                del="删除" 
                @del="del(index)"  
                @edit="edit(index)"  
                  :title="item.nodeName"></processItem>
            </template>
        </div>
      </scrollContent>   
    </div>
       <div class="btn">
    <span :class="['submit', {'pointer' : isSubmit} , {'noActive' : !isSubmit}]" @click.stop="store(false)" >保存</span>
           </div> 

    <!-- 开始审批编辑弹窗 -->
    <reDialog  :title="baseInfo.nodeName" 
                  :visible.sync="dialog" 
                  width="510px"
                  @close="resetForm"
                  @submit="submit('form')">
         <div class="companyCommon examCheckbox" slot="body">
             <el-form :model="baseInfo" label-width="114px" :rules="rules" ref="form">
                <el-form-item  class="dialogForm" label="通知给" size="medium" prop="approvalUserType">
                    <el-select v-model="baseInfo.approvalUserType" @change="changeRange"  placeholder="请选择通知类型">
                                <template v-if="currentIndex == 0">
                                  <el-option
                                  v-for="item in notice1.list"
                                  :key="item.code"
                                  :label="item.name"
                                  :value="item.code">
                                  </el-option>
                                </template>
                                <template v-else>
                                  <el-option
                                  v-for="item in notice.list"
                                  :key="item.code"
                                  :label="item.name"
                                  :value="item.code">
                                  </el-option>
                                </template>
                </el-select>
                </el-form-item>
                <el-form-item  class="dialogForm resetMemSelect" label="指定通知人" size="medium" v-show="baseInfo.approvalUserType == '3' ">
                    <div class="el-select__tags mem_select_tag">
                             <span>
                                 <template  v-for="(item,index) in memNames" >
                                    <span class="el-tag el-tag--info el-tag--small" :key="index">
                                        <span class="el-select__tags-text">{{item}}</span>
                                        <i class="el-tag__close el-icon-close" @click.stop="removeTag(index)"></i>
                                    </span>
                                 </template>
                             </span>
                         </div>
                        <el-select  v-model="memNames"  class="formSelectNoTags"   multiple  placeholder="+添加" >
                              <template slot-scope="scope">
                                  <selectMem  :treeData="treeMem.list" :multiple="true"  :initCheckBox="memInitObj"  @select="selectMem" :clear.sync="mems" ></selectMem>
                                  <el-option  v-for="(item,index) in [0]" :key="index" :value="item.id" >
                                  </el-option>
                              </template>
                        </el-select>
                </el-form-item>
                <el-form-item  class="dialogForm" label="" size="medium" prop="ccUserIds" >
                   <el-select  v-model="baseInfo.ccUserIds" multiple  placeholder=""  v-show="false">
                            <el-option
                                v-for="item in treeMem.arr"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                                <template slot-scope="scope">
                                <h6 :style="`font-weight:normal;padding-left:${item._level*20}px;width:60%;`" >  
                                  <span :style="{'font-size' : '14px'}">{{item.text}}</span>
                                <i>{{item.index}}</i>
                                </h6>
                                </template>
                            </el-option>
                    </el-select>
                </el-form-item>
             </el-form>
         </div>         
    </reDialog>


    <!-- 编辑中间审批节点 -->
    <reDialog  :title="baseInfo.nodeName ? '编辑审批步骤' : '新增审批步骤'" 
                  :visible.sync="dialog1" 
                  width="510px"
                  submit="保存"
                  @close="resetForm"
                  @submit="submit('form1')">
         <div class="companyCommon examCheckbox" slot="body">
             <el-form :model="baseInfo" label-width="114px" :rules="rules1" ref="form1"> 
                 <el-form-item  class="dialogForm"   label="步骤名称" size="medium" prop="nodeName">
                    <el-input  v-model.trim="baseInfo.nodeName" maxlength="50"  placeholder="1-50个字符"></el-input>
                </el-form-item>
                <el-form-item  class="dialogForm" label="选择审批人" size="medium" prop="approvalUserType">
                    <el-select v-model="baseInfo.approvalUserType" @change="changeRange1"  placeholder="指定人员">
                                <el-option
                                v-for="item in nodeAgginee.list"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                                </el-option>
                </el-select>
                </el-form-item>
                <el-form-item  class="dialogForm resetMemSelect" label="选择审批人" size="medium" v-show="baseInfo.approvalUserType == '3' ">
                    <div class="el-select__tags mem_select_tag">
                             <span>
                                 <template  v-for="(item,index) in memNames1" >
                                    <span class="el-tag el-tag--info el-tag--small" :key="index">
                                        <span class="el-select__tags-text">{{item}}</span>
                                        <i class="el-tag__close el-icon-close" @click.stop="removeTag1(index)"></i>
                                    </span>
                                 </template>
                             </span>
                         </div>
                        <el-select  v-model="memNames1"  class="formSelectNoTags"   multiple  placeholder="+添加" >
                              <template slot-scope="scope">
                                  <selectMem  :treeData="treeMem.list" :multiple="true"  :initCheckBox="memInitObj1"  :limit="1"  @select="selectMem1" :clear.sync="mems1" ></selectMem>
                                  <el-option  v-for="(item,index) in [0]" :key="index" :value="item.id" >
                                  </el-option>
                              </template>
                        </el-select>
                </el-form-item>
                <!-- 空的用于做红色文字提示的 -->
                <el-form-item  class="dialogForm" label="" size="medium" prop="assignee" >
                   <el-select  v-model="baseInfo.assignee" multiple  placeholder=""  v-show="false">
                            <el-option
                                v-for="item in treeMem.arr"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                                <template slot-scope="scope">
                                <h6 :style="`font-weight:normal;padding-left:${item._level*20}px;width:60%;`" > 
                                  <span :style="{'font-size' : '14px'}">{{item.text}}</span>
                                <i>{{item.index}}</i>
                                </h6>
                                </template>
                            </el-option>
                    </el-select>
                </el-form-item>
<!-- 选择抄送人 -->
                 <el-form-item  class="dialogForm" label="选择抄送人" size="medium" prop="ccUserType">
                    <el-select v-model="baseInfo.ccUserType" @change="changeRange"  placeholder="指定人员">
                                <el-option
                                v-for="item in nodeAgginee.list"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                                </el-option>
                </el-select>
                </el-form-item>
                <el-form-item  class="dialogForm resetMemSelect" label="选择抄送人" size="medium"  v-show="baseInfo.ccUserType == '3' ">
                    <div class="el-select__tags mem_select_tag">
                             <span>
                                 <template  v-for="(item,index) in memNames" >
                                    <span class="el-tag el-tag--info el-tag--small" :key="index">
                                        <span class="el-select__tags-text">{{item}}</span>
                                        <i class="el-tag__close el-icon-close" @click.stop="removeTag(index)"></i>
                                    </span>
                                 </template>
                             </span>
                         </div>
                        <el-select  v-model="memNames"  class="formSelectNoTags"   multiple  placeholder="+添加" >
                              <template slot-scope="scope">
                                  <selectMem  :treeData="treeMem.list" :multiple="true"  :initCheckBox="memInitObj"  @select="selectMem" :clear.sync="mems" ></selectMem>
                                  <el-option  v-for="(item,index) in [0]" :key="index" :value="item.id" >
                                  </el-option>
                              </template>
                        </el-select>
                </el-form-item>
                <!-- 空的用于做红色文字提示的 -->
                <el-form-item  class="dialogForm" label="" size="medium" prop="ccUserIds" >
                   <el-select  v-model="baseInfo.ccUserIds" multiple  placeholder=""  v-show="false">
                            <el-option
                                v-for="item in treeMem.arr"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                                <template slot-scope="scope">
                                <h6 :style="`font-weight:normal;padding-left:${item._level*20}px;width:60%;`" > 
                                  <span :style="{'font-size' : '14px'}">{{item.text}}</span>
                                <i>{{item.index}}</i>
                                </h6>
                                </template>
                            </el-option>
                    </el-select>
                </el-form-item>
             </el-form>
         </div>         
    </reDialog>
</div>   
</template>

<script>
import processItem from "./processItem";
import selectMem from "@/components/selectMem";
import reDialog from "@/components/reDialog";
import validate from "../../util/validate.js";
import scrollContent from "../../components/scrollContent";
export default {
  name: "process",
  components: { processItem, selectMem, reDialog, scrollContent },
  data() {
    var deptIds = (rule, value, callback) => {
      if (this.baseInfo.approvalUserType == 3 && value.length == 0) {
        callback(new Error("请选择指定人员"));
      } else {
        callback();
      }
    };
    var deptIds1 = (rule, value, callback) => {
      if (this.baseInfo.ccUserType == 3 && value.length == 0) {
        callback(new Error("请选择指定人员"));
      } else {
        callback();
      }
    };
    return {
      info: {},
      mems: [], //人员id数组
      memNames: [], //人员name数组
      memInitObj: {},
      mems1: [], //人员id数组
      memNames1: [], //人员name数组
      memInitObj1: {},
      type: "add",
      dialog: false,
      oneClick : false,
      currentIndex: "",
      isSubmit: false,
      
      dialog1: false,
      baseInfo: {},
      arr: [],
      rules: {
        nodeName: [
          { required: true, message: "请输入审批名称", trigger: "blur" },
          { validator: validate.validateApprovalProName, trigger: "blur" }
        ],
        approvalUserType: [
          { required: true, message: "请选择通知类型", trigger: "blur" }
        ],
        ccUserIds: [{ validator: deptIds, trigger: "blur" }]
      },
      rules1: {
        nodeName: [
          { required: true, message: "请输入审批名称", trigger: "blur" },
          { validator: validate.validateApprovalProName, trigger: "blur" }
        ],
        approvalUserType: [
          { required: true, message: "请选择审批人", trigger: "change" }
        ],
        assignee: [{ validator: deptIds, trigger: "blur" }],
        ccUserIds: [{ validator: deptIds1, trigger: "blur" }]
      }
    };
  },
  mounted() {
    if (window.sessionStorage["approvalProcess"]) {
      this.info = JSON.parse(window.sessionStorage["approvalProcess"]);
      //   新增的模板进来  不查询流程
      if (this.info.procdefId) {
        this.gainProcess();
      } else {
        this.type = "add";
        // 给arr中添加默认的开始 和结束节点
        this.arr.push({
          approvalUserType: "", //审核人类型 开始节点为发起人
          assignee: "", //	指定审核人	string	@mock=$order('','','','','1030,1031')
          ccUserIds: "", //	抄送人	string	@mock=$order('1030','1030','1030','1030','')
          id: "", //	节点主键	number	@mock=$order(26,27,28,29,30)
          nodeCode: "", //	节点code	string	@mock=$order('task_0','task_1','task_2','task_3','task_4')
          nodeName: "发起审批", //	节点名称
          assigneeStr: "",
          ccUserType : '',
          ccUserIdsStr: ""
        });
        this.arr.push({
          approvalUserType: "", //审核人类型 开始节点为发起人
          assignee: "", //	指定审核人	string	@mock=$order('','','','','1030,1031')
          ccUserIds: "", //	抄送人	string	@mock=$order('1030','1030','1030','1030','')
          id: "", //	节点主键	number	@mock=$order(26,27,28,29,30)
          nodeCode: "", //	节点code	string	@mock=$order('task_0','task_1','task_2','task_3','task_4')
          nodeName: "结束审批", //	节点名称
          assigneeStr: "",
          ccUserType : '',
          ccUserIdsStr: ""
        });
        this.isSubmit = true;
      }
    }
  },
  computed: {
    treeMem() {
      return this.$store.state.selectData.orgTreeBaseInfo;
    },
    notice() {
      return this.$store.state.selectData.processEndNodeAdvice;
    },
    notice1() {
      return this.$store.state.selectData.processStartNodeAdvice;
    },
    nodeAgginee() {
      return this.$store.state.selectData.processNodeAgginee;
    }
  },
  created() {
    this.$store.dispatch("getOrgTreeInfo"); //获取部门人员树
  },
  methods: {
    back() {
      this.$router.routeBack('',1);
    },
    add() {
      this.dialog1 = true;
      this.currentIndex = -1;
      this.type = 'add';
      this.oneClick = false;
      this.$nextTick(() => {
        if (this.$refs["form1"]) {
          this.memNames1 = [];
          this.mems1 = [];
          this.memNames = [];
          this.mems = [];
          this.$refs["form1"].resetFields();
          this.baseInfo = Object.assign(
            {},
            {
              approvalUserType: "",
              assignee: [],
              ccUserIds: [],
              id: "",
              nodeCode: "",
              nodeName: "",
              assigneeStr: "",
              ccUserIdsStr: ""
            }
          );
        }
      });
    },
    gainProcess(){
      this.$api.getApprovalModelProcess(this.info).then(obj => {
          this.type = "edit";
          let arr = obj.data.data.nodeList;
          arr.forEach((v, i) => {
            if (v.userIdAndNamesForAssignee.length != 0) {
              let str = "";
              v.userIdAndNamesForAssignee.forEach((vv, ii) => {
                str = str + vv.userName + ",";
                this.memInitObj[vv.userId] = vv.userName;
                this.memInitObj1[vv.userId] = vv.userName;
              });
              arr[i].assigneeStr = str.substring(0, str.length - 1);
            } else {
              arr[i].assigneeStr = "";
            }
            if (v.userIdAndNamesForCc.length != 0) {
              let str = "";
              v.userIdAndNamesForCc.forEach((vv, ii) => {
                str = str + vv.userName + ",";
                this.memInitObj[vv.userId] = vv.userName;
                this.memInitObj1[vv.userId] = vv.userName;
              });
              arr[i].ccUserIdsStr = str.substring(0, str.length - 1);
            } else {
              arr[i].ccUserIdsStr = "";
            }
            if (arr[i].ccUserIds) {
              arr[i].ccUserIds = arr[i].ccUserIds.split(",");
            } else {
              arr[i].ccUserIds = [];
            }
            if (arr[i].assignee) {
              arr[i].assignee = arr[i].assignee.split(",");
            } else {
              arr[i].assignee = [];
            }
          });
          this.arr = [...arr];
        });
    },
    changeRange(item) {
      // 说明是指定人员 需要清除信息
        this.baseInfo.ccUserIds = [];
        this.mems = [];
        this.memNames = [];
        this.baseInfo.ccUserIdsStr = "";
    },
    changeRange1() {
      this.baseInfo.assignee = [];
      this.mems1 = [];
      this.memNames1 = [];
      this.baseInfo.assigneeStr = "";
    },
    edit(index) {
      this.currentIndex = index;
      this.type = 'edit';
      this.oneClick = false;
      if (index == 0 || index == this.arr.length - 1) {
        this.dialog = true;
      } else {
        this.dialog1 = true;
      }
      this.memNames1 = [];
      this.mems1 = [];
      this.memNames = [];
      this.mems = [];
      this.$nextTick(() => {
        if (this.$refs["form"]) {
          this.$refs["form"].resetFields();
        }
        if (this.$refs["form1"]) {
          this.$refs["form1"].resetFields();
        }
        let baseInfo = Object.assign({}, this.arr[index]);
        if (baseInfo.assigneeStr) {
          this.memNames1 = baseInfo.assigneeStr.split(",");
          this.mems1 = baseInfo.assignee;
        }
        if (baseInfo.ccUserIdsStr) {
          this.memNames = baseInfo.ccUserIdsStr.split(",");
          this.mems = baseInfo.ccUserIds;
        }
        this.baseInfo = Object.assign({}, baseInfo);
      });
    },
    del(v) {
      this.$confirm("确认删除该节点?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // 如果是编辑模式那么 就删除该节点请求接口 否则 放到最后去一次保存
        this.currentIndex = '';
        this.arr.splice(v, 1);
        if (this.type == "edit") {
          this.isSubmit = true;
        }
      });
    },
    selectMem(item) {
      this.baseInfo.ccUserIds = item.checkIds;
      this.memNames = item.checkMems;
      if(this.memNames.length > 0){
          this.$refs.form1.clearValidate(['ccUserIds'])
      }
    },
    selectMem1(item) {
      this.baseInfo.assignee = item.checkIds;
      this.memNames1 = item.checkMems;
      if(this.memNames1.length > 0){
          this.$refs.form1.clearValidate(['assignee'])
      }
    },
    removeTag1(index) {
      this.mems1.splice(index, 1);
      this.memNames1.splice(index, 1);
      this.baseInfo.assignee = [...this.mems1];
    },
    removeTag(index) {
      // console.log(this.mems);
      this.mems.splice(index, 1);
      this.memNames.splice(index, 1);
      this.baseInfo.ccUserIds = [...this.mems];
    },
    resetForm() {},
    resetBaseInfo() {
      // 表示添加指定人员  需要解析指定人员数组
      let str = "";
      let str1 = "";
      if (this.baseInfo.approvalUserType == 3) {
        if (
          this.currentIndex == 0 ||
          this.currentIndex == this.arr.length - 1
        ) {
          str = this.memNames.join(",");
          this.baseInfo.ccUserIdsStr = str;
        } else {
          str = this.memNames1.join(",");
          this.baseInfo.assigneeStr = str;
        }
      }
      if (this.memNames.length != 0) {
        str1 = this.memNames.join(",");
        this.baseInfo.ccUserIdsStr = str1;
      }else{
        this.baseInfo.ccUserIdsStr = '';
      }
    },
    store(value) {
      if(this.isSubmit || value){
        // if (!this.arr[0].approvalUserType) {
        //   this.$message.error("请完善开始审批节点信息!");
        // } else
         if (!this.arr[this.arr.length - 1].approvalUserType) {
          this.$message.error("请完善结束审批节点信息!");
        } else if (this.arr.length == 2) {
          this.$message.error("请完善模板流程!");
        } else {
          let base = JSON.parse(JSON.stringify(this.info));
          let arr =  JSON.parse(JSON.stringify(this.arr));
          arr.forEach((v, i) => {
            if (arr[i].assignee && typeof arr[i].assignee == "object") {
              arr[i].assignee = arr[i].assignee.join(",");
            } else {
              arr[i].assignee = "";
            }
            if (arr[i].ccUserIds && typeof arr[i].ccUserIds == "object") {
              arr[i].ccUserIds = arr[i].ccUserIds.join(",");
            } else {
              arr[i].ccUserIds = "";
            }
          });
          if(this.currentIndex != -1){
              let baseInfo = Object.assign({}, this.baseInfo);
              if (baseInfo.assignee && typeof baseInfo.assignee == "object") {
                baseInfo.assignee = baseInfo.assignee.join(",");
              } else {
                baseInfo.assignee = "";
              }
              if (baseInfo.ccUserIds && typeof baseInfo.ccUserIds == "object") {
                baseInfo.ccUserIds = baseInfo.ccUserIds.join(",");
              } else {
                baseInfo.ccUserIds = "";
              }
            arr[this.currentIndex] =  Object.assign(baseInfo);
          }
          base.nodeList = [...arr];
          // console.log(base);
          this.$api.saveApprovalModelProcess(base).then(obj => {
            this.$message.success("保存成功");
            if(!value){
              this.back();
            }else{
              // 保存后之后 更新本地info 防止刷新之后id不是最新的
              this.info.procdefId = obj.data.data.procdefId;
              window.sessionStorage["approvalProcess"] = JSON.stringify(this.info);
              this.gainProcess();
            }
          });
        }
      }
    },
    submit(formName) {
      console.log(formName)
      this.$refs[formName].validate(valid => {
        if (valid &&　!this.oneClick) {
          this.oneClick = true;
          //   首次进入编辑 保存  只是插入到arr中
          if (this.type == "add") {
            // 增加新的节点
            if (this.currentIndex == -1) {
              this.resetBaseInfo();
                this.arr.splice(
                  this.arr.length - 1,
                  0,
                  Object.assign({}, this.baseInfo)
                );
              this.isSubmit = true;
            } else {
              this.resetBaseInfo();
              this.arr[this.currentIndex] = Object.assign({}, this.baseInfo);
              this.arr = Object.assign([], this.arr);
            }
            this.dialog1 = false;
            this.dialog = false;
          } else {
            //   是编辑流程 每个节点操作进行 接口请求操作
            if (this.currentIndex == -1) {
              this.resetBaseInfo();
              this.arr.splice(
                this.arr.length - 1,
                0,
                Object.assign({}, this.baseInfo)
              );
              this.isSubmit = true;
            } else {
              this.resetBaseInfo();
              // // 保存当前节点请求操作
              this.arr[this.currentIndex] = Object.assign({}, this.baseInfo);
              console.log(this.arr);
              if(this.info.procdefId){
                this.store(true);
              }
            }
            this.dialog1 = false;
            this.dialog = false;
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.process {
  height: 100%;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    span {
      font-size: 16px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      line-height: 56px;
    }
    i {
      font-size: 26px;
      color: $gray_b;
    }
  }
  .content {
    height: calc(100vh - 254px);
    background: white;
    box-sizing: border-box;
    overflow: hidden;

    padding-top: 40px;
    text-align: center;
    .pro {
      width: 100%;
      text-align: center;
    }
    .pro:nth-last-of-type(1) {
      padding-bottom: 5px;
    }
  }
  .btn {
    margin: 0 auto;
    padding-right: 110px;
    background: white;
    text-align: center;
    padding: 20px 110px 20px 0;
  }
  .submit {
    display: inline-block;
    text-align: center;
    width: 150px;
    height: 44px;
    background: $base_blue;
    line-height: 44px;
    border-radius: 4px;
    color: white;
    box-sizing: border-box;
    margin-left: -30px;
  }
  .noActive {
    background: $gray_c;
  }
}
.examCheckbox {
  padding-top: 20px;
}

.resetMemSelect .mem_select_tag{
  max-width: 324px !important;
  z-index: 100;
}
</style>
