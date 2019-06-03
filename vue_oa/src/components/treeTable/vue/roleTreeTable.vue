<template>
<div id="roleTreeGrid">
  <el-form :model="editRoleListForm" label-width="120px" ref="editRoleListForm" :rules="editRoleRule" size="medium">
    <el-form-item label="角色名称：" style="width:400px;" prop="roleName">
      <el-input class="width600" v-model.trim="editRoleListForm.roleName"></el-input>
    </el-form-item>
    <el-form-item label="角色编码：" style="width:400px;" prop="roleCode">
      <el-input class="width600" v-model.trim="editRoleListForm.roleCode" v-if="handle==&quot;add&quot;"></el-input><span v-else="handle==&quot;edit&quot;">{{editRoleListForm.roleCode}}</span>
    </el-form-item>
    <el-form-item v-if="false">
      <el-button @click="formSubmit('editRoleListForm')">add</el-button>
    </el-form-item>
  </el-form>
  <el-tabs v-model="activeName" @tab-click='tabClick'>
    <el-tab-pane label="功能权限" name="first">
      <el-table :data="data" border="" ref="roleTreeTable" highlight-current-row="" :row-style="showTr" @selection-change="handleSelectionChange" @row-click="checkRowClick">
        <el-table-column v-for="(column, index) in columns" :label="column.text" :key="column.dataIndex" :min-width="column.width" :class="column.class">
          <template slot-scope="scope"><span :style="level(scope.row['_level'],column.dataIndex)" :class="[column.dataIndex == levelType ? 'left' : '']">
              <button class="haveButton" v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)"><i class="el-icon-caret-right" v-if="!scope.row._expanded" aria-hidden="true"></i><i class="el-icon-caret-bottom" v-if="scope.row._expanded" aria-hidden="true"></i></button><span v-if="column.dataIndex == &quot;requestmaps&quot;">
                <el-checkbox-group v-model="checkedPowers" @change="changeCheckbox(scope.row)">
                  <el-checkbox v-for="powers in scope.row.requestmaps" :label="powers.id" :key="powers.id">{{powers.name}}</el-checkbox>
                </el-checkbox-group>
              </span><span v-else="">{{scope.row[column.dataIndex]}}</span></span></template>
        </el-table-column>
        <el-table-column type="selection" width="70">
          <template slot-scope="scope" v-for="(column, index) in columns"></template>
        </el-table-column>
      </el-table>
      <div style="width:100%;margin:auto;margin-top:20px;text-align: center;">
        <el-button type="primary" @click="powersEditSubmit" size="medium">确定提交 </el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="数据权限" name="second" v-if='dataShow'>
      <div class="model pointer" v-for="(item,index) in dataacl.list" :key="index" @click.stop="editAva(item)">{{item.name}}<i class="el-icon-arrow-right"></i></div>
      <div class="model pointer" @click.stop="editSysTypes">统一框架多系统权限<i class="el-icon-arrow-right"></i></div>
      <div class="model pointer" @click.stop="editBenchTypes">工作台部件<i class="el-icon-arrow-right"></i></div>
      <!-- <div class="model pointer" v-for="(item,index) in baseInfoArr" :key="index"  @click.stop="ediaAva(item,index)">{{dataacl.obj[item.ctrlType]}}<i class="el-icon-arrow-right"></i></div> -->
      <!-- <div class="emptyText">
        <empty  :visible="dataacl.list.length == 0"></empty>
      </div> -->
    </el-tab-pane>
  </el-tabs>
  <!-- 编辑权限 -->
    <reDialog  title="编辑权限" 
                  :visible.sync="dialogShow" 
                  width="510px"
                  @close="resetForm"
                  @submit="submit('form1')">
         <div class="companyCommon examCheckbox" slot="body">
             <el-form :model="baseInfo" label-width="114px" :rules="rules1" ref="form1">
                <el-form-item  class="dialogForm" label="可见范围" size="medium" prop="ctrlPermi">
                    <el-select v-model="baseInfo.ctrlPermi" @change="changeRange"  placeholder="请选择可见范围">
                                <el-option
                                v-for="item in processSeeType.list"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                                </el-option>
                </el-select>
                </el-form-item>
                <el-form-item  class="dialogForm resetMemSelect" label="指定人员" size="medium" v-show="baseInfo.ctrlPermi == '1' ">
                    <div class="el-select__tags mem_select_tag">
                             <span>
                                 <template  v-for="(item,index) in memNames" >
                                    <span class="el-tag el-tag--info el-tag--small reset-tag" :key="index">
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
                <el-form-item  class="dialogForm" label="指定部门" size="medium" v-show="baseInfo.ctrlPermi == '1' ">
                    <el-select  v-model="baseInfo.deptIdList" multiple  placeholder="请选择指定部门">
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
                <el-form-item  class="dialogForm" label="" size="medium" prop="deptIdList" >
                   <el-select  v-model="baseInfo.deptIdList" multiple  placeholder=""  v-show="false">
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
    
              <reDialog title="编辑权限" :visible.sync="dialogShow1" width="510px" @close="resetForm" @submit="submit('form2')">
                  <div class="companyCommon examCheckbox" slot="body">
                    <el-form :model="baseInfo" label-width="114px" :rules="rules1" ref="form2">
                      <el-form-item class="dialogForm" label="可见系统范围" size="medium" prop="deptIdList">
                        <el-select v-model="baseInfo.deptIdList" multiple placeholder="请选择可见系统范围">
                          <el-option v-for="item in sysTypes.list" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </div>
              </reDialog>
              <reDialog title="编辑权限" :visible.sync="dialogShow2" width="510px" @close="resetForm" @submit="submit('form3')">
                  <div class="companyCommon examCheckbox" slot="body">
                    <el-form :model="baseInfo" label-width="114px" :rules="rules1" ref="form3">
                      <el-form-item class="dialogForm" label="可见部件范围" size="medium" prop="deptIdList">
                        <el-select v-model="baseInfo.deptIdList" multiple placeholder="请选择可见部件范围">
                          <el-option v-for="item in workbenchcard.list" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </div>
              </reDialog>
</div>
</template>
<script>
  import Utils from '../utils/index.js'
  import tree from "../../tree.vue"
  import reDialog from "@/components/reDialog";
  import selectMem from "@/components/selectMem";
  import empty from "@/components/empty";
  export default {
    name: 'tree-grid',
    components : {tree,reDialog,selectMem,empty},
    props: {
// 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
      treeStructure: {
        type: Boolean,
        default: function () {
          return false
        }
      },
// 这是相应的字段展示
      columns: {
        type: Array,
        default: function () {
          return []
        }
      },
// 这是数据源
      dataSource: {
        type: Array,
        default: function () {
          return []
        }
      },
// 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
      requestUrl: {
        type: String,
        default: function () {
          return ''
        }
      },
// 这个是是否展示操作列
      treeType: {
        type: String,
        default: function () {
          return 'normal'
        }
      },
// 是否默认展开所有树
      defaultExpandAll: {
        type: Boolean,
        default: function () {
          return true
        }
      },
      levelType : {
         type : String,
         default : ''
      },
    },
    data () {
      var deptIds = (rule, value, callback) => {
        if (
          this.baseInfo.ctrlPermi == 1 &&
          this.baseInfo.userIds.length == 0 &&
          value.length == 0
        ) {
          callback(new Error("请选择指定人员或者指定部门"));
        } else {
          if(this.dialogShow){
          this.$refs.form1.clearValidate(['deptIdList'])
          }
          callback();
        }
      };
      return {
        dataShow: false,//判断数据权限是否显示，只有oa才显示
        isIndeterminate: true,
        checkAll: false,
        editRoleListForm:{
          roleName:'',
          roleCode:''
        },
        dialogShow : false,
        dialogShow1 : false,
        dialogShow2 : false,
        sysTypes : {
          list : [],
          obj : {}
        },
        baseInfoObj : {},
        baseInfo : {},
        mems: [], //人员id数组
        memNames: [], //人员name数组
        memInitObj: {},
        rules1: {
          ctrlPermi: [
            { required: true, message: "请选择可见范围", trigger: "change" }
          ],
          // deptIdList: [{ validator: deptIds, trigger: "change" }]  
        },
        activeName : 'first',
        checkedPowers: [],
        checkedInit: [],
        checked: 0,
        editRoleRule:{
          roleName:[
            {required:true,message:'角色名称必填',trigger:'blur'},
          ],
          roleCode:[
            {required:true,message:'权限标识必填',trigger:'blur'},
          ],
        },
        handle: '',
        permission:'',
        multipleSelection: [],
        id : '',
        initFirst:true,
        CheckedKeys : {}
      }
    },
    computed: {
      // 格式化数据源
      data: function () {
        let me = this;
        if (me.treeStructure) {
          let data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
          // return data
        }
        return me.dataSource
      },
      dataacl(){
        return this.$store.state.selectData.dataacl;
      },
      processSeeType() {
        return this.$store.state.selectData.processSeeType;
      },
      workbenchcard(){
        return this.$store.state.selectData.workbenchcard;
      },
      treeMem() {
        return this.$store.state.selectData.orgTreeBaseInfo;
      },
      treeData(){
         return this.$store.state.selectData.orgPersonTree;
      }
    },
    created () {
      // handle
      this.handle = sessionStorage.getItem('handle')
      this.permission = sessionStorage.getItem('permission')
      if(this.permission == 'oa'){
        this.dataShow = true
      }
      this.$store.state.selectData.orgPersonTree = {list : [], obj : {}};
      // this.$store.dispatch('getOrgPersonTree')
      this.$store.dispatch("getOrgTreeInfo");
      // 获取编辑时的所有初始化 checkbox
      if(this.handle === 'edit'){
        // 接收store中的数据
        let checkId = sessionStorage.getItem('roleId')
        let checkCode = sessionStorage.getItem('roleCode')
        this.id = sessionStorage.getItem('roleId');
        // code
        this.editRoleListForm.roleCode = checkCode
        this.editRoleListForm.roleName = sessionStorage.getItem('roleName')
        this.$api.roleRequestmaps({id:checkId,roleCode:checkCode,permission:this.permission}).then(res => {
          this.checkedPowers = res.data.data
          this.checkedInit = res.data.data
          let arr=[]
          this.checkedPowers.forEach(val =>{
            arr.push(String(val))
          })
          this.checkedPowers = arr
        })
      }
    },
    mounted(){
      // this.init();
    },
    methods: {
      // tab切换
      tabClick(tab,event){
        switch(tab.label){
          case '数据权限':
            if(this.initFirst){
              this.init();
              // this.initFirst = false//只加载一次
            }
          break;
        }
      },
      // 总-多选框
      handleSelectionChange(row){
        this.checkedPowers= []//其实不能清空
        row.forEach(val => {
          val.requestmaps.forEach(v => {
            this.checkedPowers.push(String(v.id))
          })
        })
        // 去重
        this.checkedPowers = this.removeSameArr(this.checkedPowers)
      },
      editSysTypes(){
        this.dialogShow1 = true;
        this.baseInfo = Object.assign({},this.baseInfoObj['unifyMenu']);
      },
      editBenchTypes(){
        this.dialogShow2 = true;
        this.baseInfo = Object.assign({},this.baseInfoObj['workbenchcard']);
      },
      init(){
        if(this.id){
          // 获取数据权限中所选取的数据
        this.$api.roleDataAclQuery({roleId : this.id}).then(obj=>{
          if(obj.data.data){
            obj.data.data.forEach((v,i)=>{
              this.baseInfoObj[v.ctrlType] = v;
            })
          }
        })
      }
        this.$api.getCommonAuthMenu().then(obj=>{
          if(obj.data.data){
            let sysTypes = {list :[] , obj : {}}
            obj.data.data.forEach((v)=>{
              sysTypes.obj[v.code] = v.name;
            })
            sysTypes.list = [...obj.data.data];
            this.sysTypes  = Object.assign({},sysTypes);
          }
        })
      },
      // ediaAva(item,index){
      //  
      // },
      editAva(item){
          this.mems = [];
          this.memNames = [];
          let obj =  {
            ctrlPermi : '',
            ctrlType : item.code,
            deptIdList : [],
            userIdList : [],
            userIds : []
          };
        if(this.baseInfoObj[item.code]){
          obj = this.baseInfoObj[item.code];
          if(obj.userIdList.length > 0){
            obj.userIdList.forEach(v => {
              this.mems.push(String(v.userId));
              this.memNames.push(v.userName);
              this.memInitObj[v.userId] = v.userName;
            });
          }

          if(obj.deptIdList.length > 0){
            let arr = obj.deptIdList.map(v=>{
              return Number(v);
            })
            obj.deptIdList = [...arr];
          }
        }
        this.baseInfo = Object.assign({},obj);
        this.baseInfo.userIds= [...this.mems];
        this.dialogShow = true;
      },
      resetForm(){
        this.$nextTick(() => {
          if (this.$refs["form1"]) {
            this.$refs["form1"].resetFields();
            this.baseInfo = Object.assign({},{
            ctrlPermi : '',
            ctrlType : '',
            deptIdList : [],
            userIdList : [],
            userIds : []
          });
          }
          if (this.$refs["form2"]) {
            this.$refs["form2"].resetFields();
            this.baseInfo = Object.assign({},{
            ctrlPermi : '',
            ctrlType : 'unifyMenu',
            deptIdList : [],
            userIdList : [],
            userIds : []
          });
          }
          if (this.$refs["form3"]) {
            this.$refs["form3"].resetFields();
            this.baseInfo = Object.assign({},{
            ctrlPermi : '',
            ctrlType : 'workbenchcard',
            deptIdList : [],
            userIdList : [],
            userIds : []
          });
          }
        });
      },
      changeRange() {
        this.baseInfo.userIds = [];
        this.mems = [];
        this.memNames = [];
        this.baseInfo.deptIdList = [];
      },
      removeTag(index) {
        this.mems.splice(index, 1);
        this.memNames.splice(index, 1);
        this.baseInfo.userIds = [...this.mems];
      },
      selectMem(item) {
        this.baseInfo.userIds = item.checkIds;
        this.memNames = item.checkMems;
        if(this.dialogShow){   
          if(this.memNames.length > 0){
            this.$refs.form1.clearValidate(['deptIdList'])
          }
        }
      },
      // 增加指定人员的一键清除
      clearMems(){
        this.memNames = [];
        this.mems = [];
        this.baseInfo.userIds = [];
        this.baseInfo.userIdList = [];
      },
      submit(formName){    
        this.$refs[formName].validate(valid => {
          if (valid) {
            if(this.id){
              let base = Object.assign({},this.baseInfo);
              base.roleId = this.id;
              this.dialogShow = false;
              base.deptIds = base.deptIdList;
              if(formName == 'form2'){
                base.ctrlType = 'unifyMenu';
                base.ctrlPermi = '1';
                this.dialogShow1 = false;
              }
              if(formName == 'form3'){
                base.ctrlType = 'workbenchcard';
                base.ctrlPermi = '1';
                this.dialogShow2 = false;
              }
              this.$api.roleDataAclEdit(base).then(obj=>{
                this.$message.success('修改成功!');
                this.init();
              }).catch(obj=>{
                this.$message.error('保存失败!');
              })
            }else{
              this.$message.error('请先设置角色权限!');
            }
            }
          });
        },
      // 点击数据权限多选框触发
      treeCheck(val){
        this.CheckedKeys[val.treeInfo.code] = val.obj.checkedKeys;
        // console.log(this.CheckedKeys[val.treeInfo.code]);
      },
      // 行-总
      changeCheckboxRow(row){
      },
      // 单个选择
      changeCheckbox(row){
        // console.log('点击单个选择框')
      },
      checkRowClick(row,event){
        // console.log('点击行')
        if(event.target.tagName == 'SPAN' || event.target.tagName == 'INPUT'){
            return false
        }
        // 1.先全选-将这一行的数据push数组中
        row.requestmaps.forEach(val => {
          if(!row._isBtn){
            // 将这一行数据添加
            this.checkedPowers.push(val.id)
          }else{
            this.removeItem(this.checkedPowers,val.id)
          }
        })
        // 去重
        this.checkedPowers = this.removeSameArr(this.checkedPowers)
        row._isBtn = !row._isBtn
        console.log(row._isBtn)
      },
      // 删除已知元素
      removeItem(arr,item){
        var newarr = []
        for(var i=0;i<arr.length;i++){
        // 判断原数组的元素不等于指定元素
            if(arr[i] != item){
            // 把元素添加到新的数组
              newarr.push(arr[i]);
            }
        }
        this.checkedPowers = newarr
        // 返回新数组
        return newarr
      },
      // 删除数组中相同的元素
      removeSameArr (arr) {
        // 遍历arr，把元素分别放入tmp数组(不存在才放)
        var tmp = new Array()
        for(var i in arr){
          //该元素在tmp内部不存在才允许追加
          if(tmp.indexOf(arr[i])==-1){
            tmp.push(arr[i]);
          }
        }
        return tmp
      },
    // 显示行
      showTr: function (row, index) {
        let show = (row.row._parent ? (row.row._parent._expanded && row.row._parent._show) : true)
        row.row._show = show
        return show ? '' : 'display:none;'
      },
    // 展开下级
      toggle: function (trIndex) {
        let me = this
        let record = me.data[trIndex]
        record._expanded = !record._expanded
      },
    // 显示层级关系的空格和图标
      spaceIconShow (index) {
        let me = this
        if (me.treeStructure && index === 0) {
          return true
        }
        return false
      },
    // 点击展开和关闭的时候，图标的切换
      toggleIconShow (index, record) {
        let me = this
        if (index === 0 && record.children && record.children.length > 0) {
          return true
        }
        return false
      },
      powersEditSubmit () {
        this.formSubmit('editRoleListForm')
      },
      formSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
              let id=sessionStorage.getItem('roleId')
              let requestmapIds = this.checkedPowers.toString()
              if(this.handle === 'edit'){
                this.$api.roleEdit({permission:this.permission,id:id,roleName:this.editRoleListForm.roleName,requestmapIds:requestmapIds}).then( res => {
                  this.$message.success(res.data.messages)
                })
              }else if(this.handle === 'add'){
                this.$api.roleAdd({permission:this.permission,roleName:this.editRoleListForm.roleName,roleCode:this.editRoleListForm.roleCode,requestmapIds:requestmapIds}).then( res => {
                  this.$message.success(res.data.messages)
                  this.id = res.data.data.roleId;
                })
              }
          } else {
            console.log('格式 error')
            return false
          }
        })
      },
      level(level,type){
        // console.log(level)
        if(type != this.levelType) return '';
        return `padding-left:${level*20}px`;
      },
    }
  }
</script>
<style lang="scss" scoped>
  .ms-tree-space{
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;
    padding-left: 16px
    }
  .ms-tree-space::before{content: ""}
  table td{
    line-height: 26px;
  }
  #TreeGrid{
    .haveButton:hover{
      cursor: pointer;
    }
  }
  .el-icon-caret-right:before {
    content: "\E602";
  }
  .el-icon-caret-bottom:before {
    content: "\E63C";
  }
  .haveButton{
    background: none;
    padding-right: 2px;
  }
  .emptyText{
    text-align: center;
  }
  .model{
    display: inline-block;
    width: 400px;
    height: 50px;
    background: white;
    border: 1px solid #ebeef5;
    padding-left: 10px;
    padding-right: 10px;
    position: relative;
    box-sizing: border-box;
    font-size: 13px;
    color: #303133;
    line-height: 50px;
    margin-bottom: 20px;
    margin-right: 60px;
    i{
      position: absolute;
      right: 10px;
      top: 18px;
    }

  }
</style>
