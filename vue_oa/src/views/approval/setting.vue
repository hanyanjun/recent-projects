<template>
<div class="approvalSet">
    <div :class="[index == 0 ? 'model1' : 'model2']" v-for="(item , index) in arr" :key="index">
      <h6 class="navTitle" v-if="index == 0">
         <span>审批设置</span>
         <button class="pointer" @click.stop="add">新增</button>
      </h6>
      <heads :title="(processClassType.obj[item.classTypeCode] || '---')+'('+item.flowTempList.length+')'">
          <div class="content" slot="content">
              <div class="item" v-for="(item1,index1) in item.flowTempList" :key="index1">
                  <setModel 
                  :type="item1.templateName" 
                  :range="processSeeType.obj[item1.applyRange]" 
                  :date="item1.lastUpdated" 
                  :status="item1.isDel == 0"
                  :id="item1.id"
                  :info="item1" 
                  :copy="true"
                  @copy="copyProcess(item1)"
                  @editPro="editPro"
                  @editRange="editRange"
                  @change="change"
                  @delectClick="delectClick"
                  :icon="item1.relationFormCode"></setModel>
              </div>
          </div>
      </heads>
    </div>
    <reDialog  title="新增审批" 
                  :visible.sync="dialogShow" 
                  width="510px"
                  @close="resetForm"
                  @submit="submit('form')">
         <div class="companyCommon examCheckbox" slot="body">
             <el-form :model="baseInfo" label-width="114px" :rules="rules" ref="form">
                <el-form-item  class="dialogForm"   label="审批名称" size="medium" prop="templateName">
                    <el-input  v-model.trim="baseInfo.templateName" maxlength="20"  placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item  class="dialogForm" label="审批分类" size="medium"  prop="classTypeCode">
                    <el-select v-model="baseInfo.classTypeCode"  placeholder="请选择审批分类">
                                <el-option
                                v-for="item in processClassType.list"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                                </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  class="dialogForm" label="分类可见权限" size="medium" prop="applyRange">
                    <el-select v-model="baseInfo.applyRange" @change="changeRange"  placeholder="请选择可见范围">
                                <el-option
                                v-for="item in processSeeType.list"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                                </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  class="dialogForm resetMemSelect" label="指定人员" size="medium" v-show="baseInfo.applyRange == '1' ">
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
                             <i class="close-icon  pointer el-icon-circle-close"  @click.stop="clearMems" ></i>
                        <el-select  v-model="memNames"  class="formSelectNoTags"   multiple  placeholder="请选择指定人员" >
                              <template slot-scope="scope">
                                  <selectMem  :treeData="treeMem.list" :multiple="true"  :initCheckBox="memInitObj"  @select="selectMem" :clear.sync="mems" ></selectMem>
                                  <el-option  v-for="(item,index) in [0]" :key="index" :value="item.id" >
                                  </el-option>
                              </template>
                        </el-select>
                </el-form-item>
                <el-form-item  class="dialogForm resetMemSelect" label="指定部门" size="medium" v-show="baseInfo.applyRange == '1' ">
                             <i class="close-icon  pointer el-icon-circle-close"  @click.stop="clearDeps" ></i>
                    <el-select  v-model="baseInfo.assignationDeptIds" multiple  placeholder="请选择指定部门" >
                            <el-option
                                v-for="(item,index) in treeMem.arr"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                                <template slot-scope="scope">
                                <h6 :style="`font-weight:normal;padding-left:${item._level*20}px;width:60%;`" @click.stop="changeDep(treeMem.arr,index)" >  
                                <span :style="{'font-size' : '14px'}">{{item.text}}</span>
                                <i>{{item.index}}</i>
                                </h6>
                                </template>
                            </el-option>
                        </el-select>
                </el-form-item>
                <el-form-item  class="dialogForm" label="" size="medium" prop="assignationDeptIds" >
                   <el-select  v-model="baseInfo.assignationDeptIds" multiple  placeholder=""  v-show="false">
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
                <el-form-item  class="dialogForm" label="选择审批类型" size="medium" prop="relationFormCode">
                    <div class="formContent">
                        <div class="scroll">
                            <scroll-content>
                          <label :for="index" v-for="(item,index) in processFormType.list" :key="index">
                            <input type="radio" :id="index" :value="item.code"   v-model="baseInfo.relationFormCode">
                            <i class="isChecked"></i>
                            <img :src="imgs[item.code]" alt="" class="icon">
                            {{item.name}}
                         </label>
                        </scroll-content>
                        </div>
                    </div>
                    <el-input  v-model="baseInfo.relationFormCode"  placeholder="请输入" v-show="false"></el-input>
                </el-form-item>
             </el-form>
         </div>         
    </reDialog>
  <!-- 编辑权限 -->
  
    <reDialog  title="编辑权限" 
                  :visible.sync="dialogShow1" 
                  width="510px"
                  @close="resetForm"
                  @submit="submit('form1')">
         <div class="companyCommon examCheckbox" slot="body">
             <el-form :model="baseInfo" label-width="114px" :rules="rules1" ref="form1">
                <el-form-item  class="dialogForm" label="可见范围" size="medium" prop="applyRange">
                    <el-select v-model="baseInfo.applyRange" @change="changeRange"  placeholder="请选择可见范围">
                                <el-option
                                v-for="item in processSeeType.list"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                                </el-option>
                </el-select>
                </el-form-item>
                <el-form-item  class="dialogForm resetMemSelect" label="指定人员" size="medium" v-show="baseInfo.applyRange == '1' ">
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
                             <i class="close-icon  pointer el-icon-circle-close"  @click.stop="clearMems" ></i>
                        <el-select  v-model="memNames"  class="formSelectNoTags"   multiple  placeholder="请选择指定人员" >
                              <template slot-scope="scope">
                                  <selectMem  :treeData="treeMem.list" :multiple="true"  :initCheckBox="memInitObj"  @select="selectMem" :clear.sync="mems" ></selectMem>
                                  <el-option  v-for="(item,index) in [0]" :key="index" :value="item.id" >
                                  </el-option>
                              </template>
                        </el-select>
                </el-form-item>
                <el-form-item  class="dialogForm resetMemSelect" label="指定部门" size="medium" v-show="baseInfo.applyRange == '1' ">
                             <i class="close-icon  pointer el-icon-circle-close"  @click.stop="clearDeps" ></i>
                    <el-select  v-model="baseInfo.assignationDeptIds" multiple  placeholder="请选择指定部门">
                            <el-option
                                v-for="(item,index) in treeMem.arr"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                                <template slot-scope="scope">
                                <h6 :style="`font-weight:normal;padding-left:${item._level*20}px;width:60%;`"  @click.stop="changeDep(treeMem.arr,index)">  
                                  <span :style="{'font-size' : '14px'}">{{item.text}}</span>
                                <i>{{item.index}}</i>
                                </h6>
                                </template>
                            </el-option>
                        </el-select>
                </el-form-item>
                <el-form-item  class="dialogForm" label="" size="medium" prop="assignationDeptIds" >
                   <el-select  v-model="baseInfo.assignationDeptIds" multiple  placeholder=""  v-show="false">
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
import heads from "../../components/heads";
import setModel from "./setModel";
import reDialog from "@/components/reDialog";
import selectMem from "@/components/selectMem";
import scrollContent from "@/components/scrollContent.vue";
import validate from "../../util/validate.js";
import imgs from "./imgs";
export default {
  name: "approvalSetting",
  components: { heads, setModel, reDialog, selectMem, scrollContent },
  data() {
    var deptIds = (rule, value, callback) => {
      if (
        this.baseInfo.applyRange == 1 &&
        this.baseInfo.assignationUserIds.length == 0 &&
        value.length == 0
      ) {
        callback(new Error("请选择指定人员或者指定部门"));
      } else {
        if(this.dialogShow1){
        this.$refs.form1.clearValidate(['assignationDeptIds'])
        }else{
        this.$refs.form.clearValidate(['assignationDeptIds'])
        }
        callback();
      }
    };
    return {
      arr: [{ classTypeCode: "", flowTempList: [] }],
      dialogShow: false,
      editInfo: {
        applyRange: "", //应用范围
        assignationDeptIds: [], //指定部门
        assignationUserIds: [] //指定人员
      },
      baseInfo: {
        applyRange: "", //应用范围
        assignationDeptIds: [], //指定部门
        assignationUserIds: [], //指定人员
        classTypeCode: "", //模板分类
        relationFormCode: "", //关联表单
        templateName: "" //模板名称
      },
      infoCopy: {
        applyRange: "", //应用范围
        assignationDeptIds: [], //指定部门
        assignationUserIds: [], //指定人员
        classTypeCode: "", //模板分类
        relationFormCode: "", //关联表单
        templateName: "" //模板名称
      },
      type: "add",
      dialogShow1: false,
      mems: [], //人员id数组
      memNames: [], //人员name数组
      memInitObj: {},
      imgs: imgs,
      id: "", //编辑权限的id
      rules: {
        templateName: [
          { required: true, message: "请输入审批名称", trigger: "blur" },
          { validator: validate.validateApprovalModelName, trigger: "blur" }
        ],
        applyRange: [
          { required: true, message: "请选择可见范围", trigger: "change" }
        ],
        assignationDeptIds: [{ validator: deptIds, trigger: "change" }],
        classTypeCode: [
          { required: true, message: "请选择审批分类", trigger: "change" }
        ],
        relationFormCode: [
          { required: true, message: "请选择审批类型", trigger: "change" }
        ]
      },
      rules1: {
        applyRange: [
          { required: true, message: "请选择可见范围", trigger: "change" }
        ],
        assignationDeptIds: [{ validator: deptIds, trigger: "change" }]
      }
    };
  },
  computed: {
    processClassType() {
      return this.$store.state.selectData.processClassType;
    },
    processSeeType() {
      return this.$store.state.selectData.processSeeType;
    },
    treeMem() {
      return this.$store.state.selectData.orgTreeBaseInfo;
    },
    processFormType() {
      return this.$store.state.selectData.processFormType;
    }
  },
  created() {
    // 默认先初始化信息
    this.baseInfo = Object.assign({}, this.infoCopy);
    this.$store.dispatch("getOrgTreeInfo");
    this.init();
    console.log(this.$store.state.selectData.processFormType)
  },
  methods: {
    resetForm() {
      this.$nextTick(() => {
        if (this.$refs["form"]) {
          this.$refs["form"].resetFields();
        }
        if (this.$refs["form1"]) {
          this.$refs["form1"].resetFields();
        }
        if (this.type == "add") {
          this.mems = [];
          this.memNames = [];
          this.baseInfo = Object.assign({}, this.infoCopy);
        } else {
          this.baseInfo = Object.assign({}, this.editInfo);
        }
      });
    },
    copyProcess(item){
      this.$api.deployCopy({tempId : item.id}).then(obj=>{
        this.$message.success('复制成功!');
        this.arr = Object.assign([],[{ classTypeCode: "", flowTempList: [] }])
        this.init();
      })
    },
    changeDep(arr,index){
      let arr1 = Object.assign([],arr);
      let arr2 = [arr1[index].id];
      getArr(arr1[index]);
      function getArr(item){
        if(item.children){
          item.children.forEach((v,i)=>{
            arr2.push(v.id);
            if(v.children && v.children.length > 0){
              getArr(v);
            }
          })
        }
      }
       this.baseInfo.assignationDeptIds = Object.assign([],arr2);
    },
      // 增加指定人员的一键清除
      clearMems(){
        this.memNames = [];
        this.mems = [];
        this.baseInfo.assignationUserIds = [];
      },
      clearDeps(){
        this.baseInfo.assignationDeptIds = Object.assign([],[]);
      },
    editPro(obj) {
      window.sessionStorage["approvalProcess"] = JSON.stringify(obj.info);
      this.$router.push({ name: "approvalProcess" });
    },
    editRange(obj) {
      this.mems = [];
      this.memNames = [];
      this.editInfo = Object.assign({}, obj.info);
      if(this.editInfo.assignationDeptIds.length >0){
        let str = obj.info.assignationDeptIds;
        let arr = str.split(",");
        arr.forEach((v,i)=>{
          arr[i] = Number(v);
        })
        this.editInfo.assignationDeptIds = [...arr];
      }else{
        this.editInfo.assignationDeptIds = [];
      }
      this.id = obj.id;
      this.type = "edit";
      this.resetForm();
      this.dialogShow1 = true;
      if (obj.info.userIdAndNames.length > 0) {
        obj.info.userIdAndNames.forEach(v => {
          this.mems.push(String(v.userId));
          this.memNames.push(v.userName);
          this.memInitObj[v.userId] = v.userName;
        });
      } else {
        this.mems = [];
        this.memNames = [];
      }
    },
    add() {
      this.type = "add";
      this.resetForm();
      this.dialogShow = true;
    },
    selectMem(item) {
      this.baseInfo.assignationUserIds = item.checkIds;
      this.memNames = item.checkMems;
      if(this.dialogShow1){   
        if(this.memNames.length > 0){
          this.$refs.form1.clearValidate(['assignationDeptIds'])
        }
      }else{
        if(this.memNames.length > 0){
          this.$refs.form.clearValidate(['assignationDeptIds'])
        }
      }
    },

    removeTag(index) {
      this.mems.splice(index, 1);
      this.memNames.splice(index, 1);
      this.baseInfo.assignationUserIds = [...this.mems];
    },
    init() {
      this.$api.getTempListForManager().then(obj => {
        let arr = obj.data.data;
        if (arr && arr.length > 0) {
          arr.forEach((v,i)=>{
            if(v.flowTempList &&  v.flowTempList.length > 0){
              v.flowTempList.forEach((vv,ii)=>{
                // if(vv.assignationDeptIds){
                //   arr[i].flowTempList[ii].assignationDeptIds =  vv.assignationDeptIds.split(',');
                // }else{
                //   arr[i].flowTempList[ii].assignationDeptIds = [];
                // }
                if(vv.assignationUserIds){
                  arr[i].flowTempList[ii].assignationUserIds =  vv.assignationUserIds.split(',');
                }else{
                  arr[i].flowTempList[ii].assignationUserIds = [];
                }
              })
            }
          })
          this.arr = Object.assign([],arr);
        }
      });
    },
    changeRange() {
      this.baseInfo.assignationUserIds = [];
      this.baseInfo.assignationDeptIds = [];
    },
    change(obj) {
      this.$api
        .approvalModeIsOn({
          closeFlag: obj.status ? "0" : "1",
          templateId: obj.id
        })
        .then(obj => {
          this.$message.success("修改状态成功!");
          this.init();
        })
        .catch(obj => {
          this.$message.success("修改状态失败!");
        });
    },
    // 删除设置
    delectClick(){
      this.init()
      this.$message.success("删除成功!")
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            let base = Object.assign({}, this.baseInfo);
            base.assignationUserIds = base.assignationUserIds.join(",");
            base.assignationDeptIds = base.assignationDeptIds.join(",");
          if (formName == "form") {
            this.$api.createApprovalMode(base).then(obj => {
              this.dialogShow = false;
              window.sessionStorage["approvalProcess"] = JSON.stringify(obj.data.data);
              this.$router.push({ name: "approvalProcess" });
            });
          } else {
            this.$api
              .approvalUpdateModelApply({
                applyRange: base.applyRange,
                assignationDeptIds: base.assignationDeptIds,
                assignationUserIds: base.assignationUserIds,
                id: this.id
              })
              .then(obj => {
                this.$message.success("编辑权限成功!");
                this.init();
                this.dialogShow1 = false;
              });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.model1 {
  background: $btn_bg;
  .navTitle {
    height: 60px;
    border-radius: 2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 14px 0 26px;
    border: 1px solid rgba(220, 223, 230, 1);
    border-bottom: none;
    span {
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold;
      font-weight: bold;
      color: rgba(85, 85, 85, 1);
    }
    button {
      display: inline-block;
      width: 60px;
      height: 30px;
      background: $blue_a;
      border-radius: 3px;
      font-size: 12px;
      font-family:"Microsoft YaHei";
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      text-align: center;
    }
  }
}
.content {
  padding: 4px 25px 40px 0;
  background: white;
  display: flex;
  flex-wrap: wrap;
  .item {
    margin-top: 30px;
    display: inline-block;
    margin-left: 60px;
  }
}
.formContent {
  vertical-align: top;
  width: 100%;
  height: 260px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(220, 223, 230, 1);
  border-radius: 5px;
  box-sizing: border-box;
  overflow: hidden;
  line-height: 1;
  padding-left: 20px;
  label {
    cursor: pointer;
    display: inline-block;
    position: relative;
    width: 60px;
    text-align: center;
    line-height: 1;
    font-size: 12px;
    font-family:"Microsoft YaHei";
    font-weight: 400;
    color: $gray_b;
    line-height: 18px;
    margin: 0 20px 20px 0;
    input {
      display: none;
    }
  }
  .icon {
    display: block;
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
    border-radius: 8px;
  }
  .isChecked {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: rgba(0, 0, 0, 0.99);
    border: 1px solid rgba(220, 223, 230, 1);
    opacity: 0.3;
    position: absolute;
    top: 1px;
    right: 1px;
    border-radius: 50%;
    box-sizing: border-box;
  }
  label > input:checked + .isChecked {
    background: url(../../commons/imgs/checked.png) no-repeat;
    border: none;
    opacity: 1;
    background-size: 100% 100%;
  }
}
.scroll {
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding-top: 17px;
}
.scroll label:nth-of-type(1),
.scroll label:nth-of-type(2),
.scroll label:nth-of-type(3),
.scroll label:nth-of-type(4) {
  margin-top: 20px;
}
.model2 {
  margin-top: 20px;
}
.examCheckbox {
  padding-top: 20px;
}
.dialogForm1{
  margin-bottom: 0 !important;
}
.resetMemSelect .mem_select_tag{
  max-width: 324px !important;
  z-index: 100;
}
</style>
