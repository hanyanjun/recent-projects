<template lang='pug'>
#powerList.companyCommon.companyList
  div.topTitlediv.listHead
    div.tableTitleRight 权限配置
    div.tableTitleLeft
      el-form.searchForm(:model='pageParam', label-width="70px", size="small", @submit.native.prevent='')
        el-row
          el-col(:span='9')
            el-form-item(label='名称：')
              el-input(v-model.trim='pageParam.name')
          el-col(:span='9')
            el-form-item(label='URL:')
              el-input(v-model.trim='pageParam.url')
          el-col(:span='3')
              button.powerAddBtn(@click='searchBtnClick') 搜索
          el-col(:span='3')
            //- .search
            <el-button class='powerAddBtn' type="primary" @click.stop="addNewPowerBtn">添加</el-button>
            //- button.powerAddBtn(type="primary",@click.stop='addNewPowerBtn') 添加
    div(style="clear:both")
  el-tabs(style="background:#fff",v-model="tabList0", @tab-click='tabsClick')
    el-tab-pane(v-for="val in tabList", :key="val.code", :label="val.name",:name='val.code', class="listWrapNoScroll")
      div.tableContent.listWrapNoScroll     
        el-table(:data='powerListTable', style='width: 100%',height="200" , class="tableContentScroll" , v-loading='loading')
          el-table-column(label='ID', prop='id', width='60px')
          el-table-column(label='名称', prop='name', width='150px')
          el-table-column(label='角色', prop='roleCodes', min-width='200px')
          el-table-column(label='URL地址', prop='url', min-width='400px')
          el-table-column(label='备注', prop='remark', width='100px')
          el-table-column(label='操作', width='150px')
            template(slot-scope='scope')
              el-button(size='mini', type='primary', plain, @click='editHandle(scope.row)') 编辑
              el-button(size='mini', type='danger', plain, @click='deleteHandle(scope.row)') 删除
          empty(slot="empty",:visible="visible") 
    //- 分页
    pagination(:current.sync="inpageNum",@size-change='SizeChange', @current-change='CurrentChange',background, :sizes='[10, 20, 30, 40]', :size='20', layout='total, sizes, prev, pager, next, jumper', :total='TolPage')
        
  el-dialog.addNewPowerDiv(v-if='addNewPowerDivShow',:title='isAddOrEdit === "add" ? "添加新权限" : "编辑权限"', :visible.sync='addNewPowerDivShow', style='margin:0 auto', :close-on-click-modal='false',width="570px")
    el-form(:model='addNewPowerForm', :rules="addNewRules", ref="addNewPowerForm", label-width="100px", size="medium")
      el-form-item(label='权限名称：', prop='name')
        el-input.width360(v-model.trim='addNewPowerForm.name')
      el-form-item(label='菜单名称：', prop='menuIds')
        el-cascader.width360(placeholder='可输入关键字检索', v-model='addNewPowerForm.menuIds', :options='menuDataList',:props="props", filterable='', change-on-select='')
      el-form-item(label='URL地址：', prop='url')
        el-input.width360(type='textarea', v-model.trim='addNewPowerForm.url')
      el-form-item(label='用户角色：', prop='roleCodes')
        el-select.width360(v-model='addNewPowerForm.roleCodes',multiple, placeholder='请选择')
          el-option(v-for='item in roleList', :key="item.roleName", :label="item.roleName", :value="item.roleCode")
      el-form-item.padleft12(label='备注：')
        el-input.width360(type='textarea', v-model.trim='addNewPowerForm.remark')
    .dialog-footer(slot='footer')
      el-button(type='primary', @click.stop="submitForm('addNewPowerForm',addNewPowerFormSubmit)", size="medium") 提 交
      el-button(@click="addResetForm('addNewPowerForm')", size="medium") 取 消 
  
  
</template>
<script>
import '../../commons/publicCss/outside.sass'
import tree from '../../util/listToTree'
import pagination from "../../components/pagination"
import core from '@/api/core'
import util from '../../util'
import empty from "@/components/empty"

export default {
  // name: '',
  components : {pagination,empty},
  data () {
    var validateRoleCodes = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请选择用户角色'))
      }else {
        callback();
      }
    }
    return { 
      visible : false,
      tabList:[],
      tabList0:'',
      powerListTable: [],
      pageParam:{
        pageNum:1,
        pageSize:20,
        name:'',
        url:'',
        permission:''
      },
      inpageNum:1,
      TolPage: 0,
      loading: false,
      addNewPowerDivShow: false,
      addNewPowerForm: {
        name: '',
        menuIds: [],
        roleCodes: [],
        url: '',
        remark: '',
      },
      menuDataList:[],
      props:{
        value: 'id',
        label: 'name',
        children: 'children'
      },
      menuList:[],
      // addMap: {roleCodes:[],menuId:[]},
      menuId:[],
      roleList: [],
      addNewRules: {
        name: [
          {required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        menuIds: [
          {required: true, message: '请选择菜单名称', trigger: 'blur' }
        ],
        url: [
          {required: true, message: '请输入地址', trigger: 'blur' }
        ],
        roleCodes: [
          {required: true, validator:validateRoleCodes, trigger: 'blur' }
        ]
      },
      isAddOrEdit:'',
      name: ''
    }
  },
  // 页面初始化
  created () {
    // 1.根据头部获取tab名字，初始化table
    this.tabList = this.$store.state.headInfo.moduleTypes
    // tabList.forEach((val,i) => {
    //   let a=val.split(":")
    //   let b={}
    //   b.key = a[0]
    //   b.val = a[1]
    //   this.tabList.push(b)
    // });
    this.tabList0 = this.tabList[0].code
    // 先加载第一个，再选择哪个加载哪个
    this.switchTab(this.tabList[0].code)
    // 2.获取菜单list
    this.initMenuList(this.tabList[0].code)
    // 3.获取用户角色
    this.initRoleList(this.tabList[0].code)
    this.$store.dispatch('getMenuList',{permission:this.tabList[0].code})
  },
  watch: {
    "pageParam.name" (val) {
      if(!val){
        this.getPowerTable()
      }
    },
    "pageParam.url" (val) {
      if(!val){
        this.getPowerTable()
      }
    }
  },
  // 页面事件
  methods: {
    switchTab(name){
      switch(name){
        case 'o':
          this.columns = this.columnsOA
        break;
        case 'eclub':
          this.columns = this.columnsOA
        break;
        default:
          this.columns = this.columnsOA
        break;
      }
      this.pageParam.permission = name
      this.pageParam.pageNum = 1
      this.getPowerTable();
    },
    tabsClick(tab,event){
      this.switchTab(tab.name)
      // tab切换加载对应的菜单 角色下拉
      this.initMenuList(this.pageParam.permission)
      this.initRoleList(this.pageParam.permission)
      this.$store.dispatch('getMenuList',{permission:this.pageParam.permission})
    },
    getPowerTable () {
      core.powerTable(this.pageParam).then((res) => {
        if(res.data.code === '200'){
          this.visible = true
          this.powerListTable = res.data.data.list
          this.TolPage = res.data.data.total
        } else {
          this.$message.error(res.data.messages)
          return
        }
        setTimeout(() => {this.loading = false}, 1000)}).catch(util.errorHandle)
    },
    // 在职列表列表分页
    SizeChange (val) {
      this.pageParam.pageSize = val.value;
      if(val.isLoad){
      this.getPowerTable()
      }
    },
    CurrentChange (val) {
      this.pageParam.pageNum = val
      this.getPowerTable()
    },
    // get菜单列表
    mapMenu (data) {
      data.map((val) => {
        let menuData = {}
        menuData.value = String(val.id)
        menuData.label = val.name
        menuData.parentId = val.parentId
      });
    },
    initMenuList (permission) {
      core.menuDataList({permission:permission}).then((res) => {
        if(res.data.code === '200'){
          this.menuDataList = JSON.parse(JSON.stringify(res.data.data))
          this.$util.findChildren(this.menuDataList, 'children')
        } else {
          this.$message.error(res.data.messages)
        }
      }).catch(util.errorHandle)
    },
    // get角色列表
    initRoleList (permission) {
      core.roleList({permission:permission}).then((res) => {
        if(res.data.code === '200'){
          this.roleList = res.data.data
        } else {
          this.$message.error(res.data.messages)
          return
        }
      }).catch(util.errorHandle)
    },
    
    // 添加新权限-提交
    addNewPowerFormSubmit () {
      // 角色
      this.addNewPowerForm.menuId = this.addNewPowerForm.menuIds[this.addNewPowerForm.menuIds.length-1]
      // 用户角色
      this.addNewPowerForm.roleCodes = this.addNewPowerForm.roleCodes.toString()
      if(this.isAddOrEdit === 'add'){
        // 1.load-add接口
        // 初始化菜单
        core.addNewPowerList(this.addNewPowerForm).then(res => {
          if (res.data.code == "200") {
            // this.addNewPowerForm = {roleCodes:[], menuIds:[]}
            this.getPowerTable()
            this.$message.success('成功')
            this.addNewPowerDivShow = false
          } else {
            this.$message.error(res.data.messages)
            return
          }
        })
      }else if(this.isAddOrEdit === 'edit'){
        // 2.load-edit接口
        this.$api.requestmapEdit(this.addNewPowerForm).then(res => {
          // this.addNewPowerForm = {roleCodes:[], menuIds:[]}
          this.addNewPowerDivShow = false
          this.getPowerTable()
          this.$message.success('成功')
        })
      }
    },
    // 提交校验格式
    submitForm (formName, callBack) {
      console.log(this.addNewPowerForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          return callBack()
        } else {
          console.log('格式 error')
          return false
        }
      })
    },
    addResetForm(formName) {
      this.addNewPowerDivShow = false
    },
    // 搜索
    searchBtnClick(){
      this.pageParam.pageNum = 1
      this.inpageNum = 1
      // 1.获取权限table
      this.getPowerTable()
    },
    // 点击添加按钮
    addNewPowerBtn () {
      // 1.类型
      this.addNewPowerForm.permission = this.pageParam.permission
      // 3.先清空表单
      this.isAddOrEdit = 'add'
      this.addNewPowerForm.name = ''
      this.addNewPowerForm.menuIds = []
      this.addNewPowerForm.roleCodes = []
      this.addNewPowerForm.url = ''
      this.addNewPowerForm.remark = ''
      this.addNewPowerDivShow = true
      setTimeout(() => {
        this.$refs['addNewPowerForm'].resetFields();
      }, 30)
     
    },
    // 编辑一行
    editHandle (row) {
      // 类型
      this.addNewPowerForm.permission = this.pageParam.permission
      this.isAddOrEdit = 'edit'
      this.addNewPowerDivShow = true
      this.addNewPowerForm.id = row.id
      // 权限名称
      this.addNewPowerForm.name = row.name
      // 菜单名称-映射
      this.$store.dispatch('getAllMenuListObj',Number(row.menuId)).then(obj=>{
        this.addNewPowerForm.menuIds = obj;
      })
      this.addNewPowerForm.url = row.url
      if(row.roleCodes){
        this.addNewPowerForm.roleCodes = row.roleCodes.split(",")
      }else{
        this.addNewPowerForm.roleCodes = []
      }
      this.addNewPowerForm.remark = row.remark
      this.$nextTick(()=>{
        this.$refs['addNewPowerForm'].resetFields();
      })
    },
    // 
    dealMenuList(id) {
      this.menuList.map(val=>{
        if(id == val.id && val.parentId) {
          // unshift-开头添加
          this.menuId.unshift(String(val.parentId))
          this.dealMenuList(val.parentId)
        }
      })
    },
    // 删除一行
    deleteHandle (row) {
      this.$confirm("此操作将删除此配置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        core.deletePowerTableRow({"id": row.id}).then(res => {
          if (res.data.code == "200") {
            this.powerListTable = []
            this.getPowerTable()
            this.$message.success('删除成功')
          } else {
            this.$message.error(res.data.messages)
            return
          }
        })
      })
    }
  }
}
</script>
<style lang='scss' scoped>

@import "../../assets/css/common.scss";

.companyCommon{
  border: 1px solid $gray_f1;
  .tableTitleRight,.tableTitleLeft{
    padding-top: 15px;
  }
}
#powerList {
  .el-dialog__body{
    padding: 30px 58px;
  }
  .tableContentScroll{
    height: calc(100% - 0px) !important
  }
}
.topTitlediv{
  padding: 0 12px 0 26px
}
.searchForm{
  .el-form-item{
    float: left;
    margin-left: 20px;
    margin-bottom: 0;
  }
  .search,.powerAddBtn{
    margin-top: 2px!important;
    cursor: pointer;
  }
}
.employeeHead{
  padding: 10px 0 5px;
  font-size: 20px;
  font-weight: bold;
}
.el-loading-spinner{
  top: 18%
}

.addNewPowerDiv .el-dialog{
 width: 660px
}
 
</style>
