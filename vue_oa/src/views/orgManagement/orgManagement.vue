<template lang="pug">
#custom-tree-container
  //- 修改1
  .custom-tree-container(v-if="treeContainerShow")
    el-tree(:data='orgTreeExtInfo', show-checkbox=false, node-key='id', default-expand-all='', :expand-on-click-node='false', :render-content='renderContent', v-loading='loading')
    //- 添加 编辑部门
    el-dialog.addNewPowerDiv(:title='valueTitle', :visible.sync='createDeptShow', style='margin:0 auto',:close-on-click-modal='false',width='570px')
      el-form.elForm(:model='createPartForm', :rules="createPartRules", ref="createPartForm", label-width="100px", size="medium")
        el-form-item(label='部门名称', prop='deptName')
          el-input.width360(v-model.trim='createPartForm.deptName', placeholder='请输入部门名称')
        el-form-item(label='部门类别', prop='deptType')
          el-select.width360(v-if="deptTypeShow",v-model='createPartForm.deptType',clearable, placeholder='请选择部门类别', @visible-change="selectData($event,'depttype')")
            el-option(v-for='item in partTypes', :key="item.code", :label="item.name", :value="item.code")
          span(v-else,style='padding-left: 16px') {{deptTypeSpan}}
        el-form-item(v-if='valueTitle == "添加子部门" ? false : true',label='排序', prop='sort')
          el-input.width360(v-model.trim='createPartForm.sort', placeholder='请输入部门名称')
        el-form-item.padleft12(label='部门负责人')
          el-select.width360(v-model='deptLeaderName', clearable,@clear="clearLeaderName", placeholder='请选择部门负责人')
            template(slot-scope='scope')
              selectMem(:treeData='optionsPartLeader', @select='selectMem',:clear="deptLeaderName")
              el-option(v-for='(item,index) in [0]', :key='index', :value='item.id')
        el-form-item.padleft12(label='所在城市')
          el-select.width360(v-model='createPartForm.cityId',clearable, placeholder='请选择所在城市')
            el-option(v-for='item in citys', :key='item.name', :label='item.name', :value='item.code') {{item.name}}
      .dialog-footer(slot='footer')
        el-button(type='primary', @click="createPartsubmit('createPartForm')", size="medium") 提 交
        el-button(@click="createPartReset('createPartForm')", size="medium") 取 消
  //- 查看人员
  div(v-if="employeeSeeShow")
    div.listWrapNoScroll.companyCommon.companyList.idBorder
      div.topTitlediv
        div.tableTitleRight 员工查询
        div.tableTitleLeft
          el-input.inputSearch.width290(placeholder='请输入员工姓名或工号',size='small',maxlength="20", v-model='selectInput'  v-on:keyup.native.enter='seeSearchInputClick')
          i.el-icon-search(@click='seeSearchInputClick')
          el-button.addBtn(size='small',@click="toggleRowSelection")  批量分配
          i.backIcon(class="iconfont icon-fanhui pointer", @click="backIconClick")
          //- 测试提交
        div(style="clear:both")
      div.tableContent
        el-table.employeeSeeTable.tableContentScroll(:data='employeeSeeTable',ref="employeeSeeTable", style='width: 100%',height='200',@selection-change='seeSelectionChange')
          el-table-column(type='selection', width='55')
          el-table-column(label='序号', type="index")
          el-table-column(label='姓名', prop="userName")
          el-table-column(label='部门', prop="deptName")
          el-table-column(label='工号', prop="empNo", width="100")
          el-table-column(label='邮箱', prop="email", min-width="200")
          el-table-column(label='操作', width="120")
            template(slot-scope='scope')
              el-button(size="small", type="success", plain, @click='employeeSeeHandle(scope.row)') 分 配
          empty(slot="empty",:visible="visible")    
        //- 分页
        //- el-pagination( @size-change='employeeSeeChange', @current-change='employeeSeeCurrent',background,:page-sizes='[10, 20, 50, 100]', :page-size='initSize',:current-page='initCurrent', layout='total, sizes, prev, pager, next, jumper', :total='employeeSeePage')
        pagination(:total="employeeSeePage",@size-change="employeeSeeChange",@current-change="employeeSeeCurrent",
                    :sizes="[10, 20, 50, 100]",
                    :size="20",
                    :current.sync="inpageNum",
                    layout="total, sizes, prev, pager, next, jumper",
                    background)
  //- 待分配员工
  div(v-if="toBeAssignedShow")
    div.listWrapNoScroll.companyCommon.companyList.idBorder
      div.topTitlediv
        div.tableTitleRight 待分配员工查询
        div.tableTitleLeft
          el-input.inputSearch.width290(placeholder='请输入员工姓名或工号',size='small',maxlength="20", v-model='noselectInput'  v-on:keyup.native.enter='toBeAssignedSearchClick')
          i.el-icon-search(@click='toBeAssignedSearchClick')
          el-button.addBtn(size='small',@click="toggleRowSelection")  批量分配
          i.backIcon(class="iconfont icon-fanhui pointer", @click="backIconClick")
          //- 测试提交
        div(style="clear:both")
      div.tableContent
        el-table.employeeSeeTable.tableContentScroll(:data='employeeSeeTable',ref="employeeSeeTable1", style='width: 100%',height='200',@selection-change='seeSelectionChange')
          el-table-column(type='selection', width='55')
          el-table-column(label='序号', type="index")
          el-table-column(label='姓名', prop="userName")
          el-table-column(label='部门', prop="deptName")
          el-table-column(label='工号', prop="empNo", width="100")
          el-table-column(label='邮箱', prop="email", min-width="200")
          el-table-column(label='操作', width="120")
            template(slot-scope='scope')
              el-button(size="small", type="success", plain, @click='employeeSeeHandle(scope.row)') 分 配
          empty(slot="empty",:visible="visible")    
        //- 分页
        //- el-pagination(@size-change='employeeSeeChange', @current-change='employeeSeeCurrent',background, :page-sizes='[10, 20, 50, 100]', :page-size='initSize',:current-page='initCurrent', layout='total, sizes, prev, pager, next, jumper', :total='employeeSeePage')
        pagination(:total="employeeSeePage",@size-change="employeeSeeChange",@current-change="employeeSeeCurrent",
                    :sizes="[10, 20, 50, 100]",
                    :size="20",
                    :current.sync="topageNum",
                    layout="total, sizes, prev, pager, next, jumper",
                    background)
  //- 分配
  el-dialog.distributeDiv(title='分配部门', :visible.sync='distributeShow', style='margin:0 auto', :close-on-click-modal='false',width="570px")
    el-form.elForm(:model='distributeForm', :rules="distributeRules", ref="distributeForm", label-width="100px",size='medium')  
      el-form-item(label='上级部门')
        el-cascader.width360(placeholder='请选择上级部门',:options='distributeOptions', :props="props",  filterable, @change='distributeChange',v-model="distributeInput", change-on-select)
    .dialog-footer(slot='footer')
      el-button(type='primary', @click="distributesubmit('distributionForm')",size='medium') 确 定
      el-button(@click="distributeReset",size='medium') 取 消
  //- 移动到
  el-dialog.distributeDiv(title='移动到', :visible.sync='moveDistributeShow', style='margin:0 auto', :close-on-click-modal='false',width="570px")
    el-form.elForm(:model='distributeForm', :rules="distributeRules", ref="distributeForm", label-width="100px",size='medium')  
      el-form-item(label='上级部门')
        el-cascader.width360(placeholder='请选择上级部门',:options='distributeOptions', :props="props",  filterable, @change='distributeChange',v-model="distributeInput", change-on-select,clearable)
    .dialog-footer(slot='footer')
      el-button(type='primary', @click="moveTosubmit('distributionForm')",size='medium') 确 定
      el-button(@click="distributeReset",size='medium') 取 消
</template>
<script>
import core from '@/api/core'
import util from '../../util'
import selectMem from "../../components/selectMem"
import empty from "../../components/empty"
import {mapState} from "vuex"
import "../../commons/publicCss/outside.sass"
import pagination from "../../components/pagination"
var i
// let distributeId
let tableId
export default {
  components : {selectMem,pagination,empty},
  data () {
    return {
      loading: false,
      orgTreeExtInfo: [],
      createDeptShow: false,
      seePersonnelShow: false,
      visible : false,
      partTreeShow: false,
      treeContainerShow: true,
      employeeSeeShow: false, 
      distributeShow: false,
      moveDistributeShow: false,
      deptTypeShow: true,
      employeeSeePage: 1,
      employeeSeepageNum:'1',
      employeeSeepageSize:'20',
      initSize:20,
      initCurrent:1,
      selectInput: '',
      createPartForm: {
        cityId: '',
        deptLeader: '',
        deptName: '',
        sort:'',
        deptType: ''
      },
      deptTypeSpan: '',
      deptLeaderName: '',
      deptLeaderModel: [],
      // citysModel: [],
      createPartRules: {
        deptName: [
          {required: true, message: '请输入部门名称', trigger: 'blur' },
          {pattern:/^.{1,30}$/, message: '请输入1-30位字符',trigger:'change' }
        ],
        deptType: [
          { required: true, message: '请选择部门类别', trigger: 'change' }
        ],
        sort: [
          {required: true, message: '请输入排序', trigger: 'blur' }
        ],
      },
      optionsPartLeader: [],
      optionsCitys: '',
      props:{
        value: 'id',
        label: 'text',
        children: 'children'
      },
      propsCity:{
      },
      partTree: [],
      partTreeProps:  {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      partLeaderRadio: [],
      leaderGroup: '',
      employeeSeeTable: [],
      //  选择分配部门
      distributeForm: {},
      distributeRules: {},
      distributeOptions: [],
      userIds: [],
      seeSelectionChangeArr: [],
      seecheckArr: [],
      // input值先清空
      distributeInput: [],
      toBeAssignedShow: false,
      noselectInput: '',
      distributeId:'',
      noDistribute: '',
      moveId:'',
      valueTitle:'',
      inpageNum:1,
      topageNum:1
    }
  },
  computed: {
    ...mapState({
        "partTypes" : state => state.selectData.depttype.list,
        "citys" : state => state.selectData.city.list,
      }),
  },
  created () {
    // 获取组织架构树形
    this.getOrgTreeExtInfo()
    // 获取部门负责人
    this.getOrgTreeBaseInfo()
  },
  watch: {
    // 部门负责人tree过滤值监测
    filterText (val) {
      this.$refs.partLeaderTree.filter(val)
    },
    // 部门负责人tree过滤值监测
    createDeptShow (val) {
      if(!val){
        this.$refs['createPartForm'].resetFields()
        this.$refs['createPartForm'].clearValidate()
      }
    },
    partTreeShow (val) {
      if(val){
        this.leaderGroup = ''
      }
    },
    moveDistributeShow (val) {
      if(!val){
        this.distributeInput = []
        this.distributeId = ""
      }
    },
    distributeShow (val) {
      if(!val){
        this.distributeInput = []
        this.distributeId = ""
      }
    },
  },
  methods: {
    selectData(v1,v2){
      if(v1){
        this.$store.dispatch('getData',v2);
      }
    },
    getOrgTreeBaseInfo () {
      
      core.orgTreeBaseInfo().then((res) => {
        this.optionsPartLeader = JSON.parse(JSON.stringify(res.data.data))
        this.distributeOptions = JSON.parse(JSON.stringify(res.data.data))
        this.$util.findChildren(this.distributeOptions, 'children')
      })
      // 动态改变总公司样式
      // let parentCompany = document.getElementsByClassName("el-tree-node__content")
      // console.log(parentCompany)
      // parentCompany.on(click,function(){
      //   console.log(this.indexOf)
      // })
      // parentCompany[0].parentNode.classList.add("parentCompanyDiv")
      // console.log(parentCompany[0].parentNode)
    },
    // 获取tree结构
    getOrgTreeExtInfo () {
      core.getOrgTreeExtInfo().then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.orgTreeExtInfo = JSON.parse(JSON.stringify(res.data.data))
          this.loading = false
        }
      }).catch(util.errorHandle)
    },
    // 添加子部门
    append (data) {
      i = 0
      this.valueTitle = '添加子部门'
      // 1.弹出框显示
      this.partTreeShow = false
      this.deptTypeShow = true
      // 部门负责人
      this.deptLeaderName = ''
      this.createPartForm.cityId = ''
      this.createPartForm.parentId = data.id
      this.createDeptShow = true
      setTimeout(() => {
        this.$refs['createPartForm'].clearValidate()
        this.$refs['createPartForm'].resetFields()
        // 部门名称
        this.createPartForm.deptName = ''
        this.createPartForm.sort = ''
        this.createPartForm.deptType = ''
      }, 2)
    },
    // 编辑row
    edit (data) {
      i = 1
      this.createDeptShow = true
      // 1.弹出框展示-先将负责人下拉框隐藏
      this.partTreeShow = false
      // 2.title
      this.valueTitle = '编辑子部门'

      // 3.将数据返给from
      // 初始化-部门类别
      if(data.deptType === "HEAD_COMP"){
        this.deptTypeShow = false
        this.deptTypeSpan = '总公司'
      }else{
        this.deptTypeShow = true
      }
      this.createPartForm.deptType = data.deptType
      this.createPartForm.cityId = data.cityId
      this.createPartForm.deptName = data.text
      this.createPartForm.sort = data.sort
      this.createPartForm.deptLeader = data.deptLeader
      this.deptLeaderName = data.deptLeaderName
      this.createPartForm.deptId = data.id
      setTimeout(() => {
        this.$refs['createPartForm'].clearValidate()
      }, 2)
      
    },
    remove (node, data) {
      this.$confirm('此操作是删除操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          core.removeDept({deptId:data.id}).then((res) => {
            util.codeConfirm(res.data,this)
            if(res.data.code === '200'){
              // 重新调用列表
              this.getOrgTreeExtInfo()
              // 重新加载下拉tree
              this.getOrgTreeBaseInfo()
              this.$message.success(res.data.messages)
            }
          }).catch(util.errorHandle)
        }).catch(() => {
          this.$message({type: 'info',message: '已取消'});
        })
    },
    // 查看人员
    seePersonnel (data) {
      this.selectInput = ''
      this.noDistribute =''
      // 查看人员展现
      this.treeContainerShow = false
      this.employeeSeeShow = true
      this.initSize = 20
      this.initCurrent = 1
      this.employeeSeepageSize = 20
      this.employeeSeepageNum = 1
      this.inpageNum = 1
      this.getseePersonnelTable(data.id)
      tableId = data.id
    },
    // 移动部门到
    moveTo (data) {
      // input值先清空
      this.distributeInput = []
      // 弹出框显示
      this.moveDistributeShow = true
      // 接口参数
      this.moveId = data.id
    },
    distributeFocus (data) {
    },
    // 得到分配的员工table
    getseePersonnelTable (id) {
      // 1.已分配员工的table
      core.listEmpsInDept({deptId:id,definedPage:{pageNum:this.employeeSeepageNum,pageSize:this.employeeSeepageSize},searchPara:this.selectInput}).then((res) => {
        this.visible = true;
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.employeeSeeTable = res.data.data.list
          this.employeeSeePage = res.data.data.total
          // 初始化多选
          // this.$nextTick(()=>{
          //   // this.$refs.employeeSeeTable.toggleRowSelection(this.employeeSeeTable[0])
          //   // this.$refs.employeeSeeTable.toggleRowSelection(this.employeeSeeTable[1])
          //   let arr=[]
          //   this.seecheckArr.forEach(row => {
          //     this.employeeSeeTable.forEach(v => {
          //       if(row.mobile === v.mobile){
          //         arr.push(v)
          //       }
          //     })
          //   })
          //   arr.forEach(row => {
          //     this.$refs.employeeSeeTable.toggleRowSelection(row)
          //   })
          //   console.log(arr)
          // })
          
        }
      }).catch(util.errorHandle)
      // 2.待分配员工的table
    },
    // 编辑tree中内容
    renderContent (h, { node, data, store }) {
      if (node.data.deptType === "HEAD_COMP") {
        return (
          <span class="custom-tree-node">
            <span><span class="fontW">{node.data.text}</span> <span>({node.data.subNumber}人)</span><el-tag size="mini"  type="warning">总公司</el-tag></span>
            <span class="three">{node.data.deptLeaderName}</span>
            <span>
              <el-button size="medium" type="success" icon="el-icon-plus" on-click={ () => this.append(data) }>添加子部门</el-button>
              <el-button size="medium" type="primary" icon="el-icon-edit" on-click={ () => this.edit(data) }>编辑</el-button>
              
              <el-button size="medium" type="warning" icon="el-icon-news" on-click={ () => {this.toBeAssignedClick(data); this.visible = false;}  }>待分配员工</el-button>
              <el-button size="medium" icon="el-icon-tickets" on-click={ () =>{ this.seePersonnel(data);this.visible = false;} }>查看人员</el-button>
              
            </span>
          </span>)
      }else if (node.data.deptType === "BU") {
        return (
          <span class="custom-tree-node">
            <span>{node.data.text} ({node.data.subNumber}人)<el-tag size="mini">事业部</el-tag></span>
            <span class="three">{node.data.deptLeaderName}</span>
            <span>
              <el-button size="mini" on-click={ () => {this.seePersonnel(data); this.visible = false;} }>查看人员</el-button>
              <el-button size="mini" on-click={ () => this.moveTo(data) }>移动到</el-button>
              <el-button size="mini" type="success" on-click={ () => this.append(data) }>添加</el-button>
              <el-button size="mini" type="primary" on-click={ () => this.edit(data) }>编辑</el-button>
              <el-button size="mini" type="danger" on-click={ () => this.remove(node, data) }>删除</el-button>
            </span>
          </span>)
      } else if (node.data.deptType === "COMP") {
        return (
          <span class="custom-tree-node">
            <span>{node.data.text} ({node.data.subNumber}人)<el-tag size="mini" type="success">子公司</el-tag></span>
            <span class="three">{node.data.deptLeaderName}</span>
            <span>
              <el-button size="mini" on-click={ () => this.seePersonnel(data) }>查看人员</el-button>
              <el-button size="mini" on-click={ () => this.moveTo(data) }>移动到</el-button>
              <el-button size="mini" type="success" on-click={ () => this.append(data) }>添加</el-button>
              <el-button size="mini" type="primary" on-click={ () => this.edit(data) }>编辑</el-button>
              <el-button size="mini" type="danger" on-click={ () => this.remove(node, data) }>删除</el-button>
            </span>
          </span>)
      }else if (node.data.deptType === "REG") {
        return (
          <span class="custom-tree-node">
            <span>{node.data.text} ({node.data.subNumber}人)<el-tag size="mini" type='danger'>区域</el-tag></span>
            <span class="three">{node.data.deptLeaderName}</span>
            <span>
              <el-button size="mini" on-click={ () => this.seePersonnel(data) }>查看人员</el-button>
              <el-button size="mini" on-click={ () => this.moveTo(data) }>移动到</el-button>
              <el-button size="mini" type="success" on-click={ () => this.append(data) }>添加</el-button>
              <el-button size="mini" type="primary" on-click={ () => this.edit(data) }>编辑</el-button>
              <el-button size="mini" type="danger" on-click={ () => this.remove(node, data) }>删除</el-button>
            </span>
          </span>)
      } else {
        return (
          <span class="custom-tree-node"  on-mouseover={ () => this.changeActive(node,data) }>
            <span>{node.data.text} ({node.data.subNumber}人)</span>
            <span class="three">{node.data.deptLeaderName}</span>
            <span>
              <el-button size="mini" on-click={ () => this.seePersonnel(data) }>查看人员</el-button>
              <el-button size="mini" on-click={ () => this.moveTo(data) }>移动到</el-button>
              <el-button size="mini" type="success" on-click={ () => this.append(data) }>添加</el-button>
              <el-button size="mini" type="primary" on-click={ () => this.edit(data) }>编辑</el-button>
              <el-button size="mini" type="danger" on-click={ () => this.remove(node, data) }>删除</el-button>
            </span>
          </span>)
      }
    },
    // 确定按钮-添加子部门
    createPartsubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 部门类别
          if(this.createPartForm.deptType === "总公司"){
            this.createPartForm.deptType = "HEAD_COMP"
          }
          if (i === 0) {
            // 1.添加
            core.createDept(this.createPartForm).then((res) => {
              util.codeConfirm(res.data,this)
              if(res.data.code === '200'){
                this.getOrgTreeExtInfo()
                this.createDeptShow = false
                this.$refs[formName].resetFields()
                this.$message.success(res.data.messages)
                this.createPartForm = {
                  cityId: '',
                  deptLeader: '',
                  deptName: '',
                  sort:'',
                  deptType: ''
                }
                this.deptLeaderName = ''
                // 重新加载tree
                this.getOrgTreeBaseInfo()
              }
            }).catch(util.errorHandle)
          } else {
            // 2.编辑
            core.editDept(this.createPartForm).then((res) => {
              util.codeConfirm(res.data,this)
              if(res.data.code === '200'){
                this.getOrgTreeExtInfo()
                this.createDeptShow = false
                this.$refs[formName].resetFields()
                this.$message.success(res.data.messages)
                this.createPartForm = {
                  cityId: '',
                  deptLeader: '',
                  deptName: '',
                  sort:'',
                  deptType: ''
                }
                // this.citysModel = []
                this.deptLeaderName = ''
                // 重新加载tree
                this.getOrgTreeBaseInfo()
              }
            }).catch(util.errorHandle)
          }
          // const newChild = { id: id++, text: this.createPartForm.deptName, deptType: this.createPartForm.deptType, children: [] }
          // if (!dataRow.children) {
          //   this.$set(dataRow, 'children', [])
          // }
          // dataRow.children.push(newChild)
          // this.createDeptShow = false
          // this.$refs[formName].resetFields()
        } else {
          console.log('格式 error')
          return false
        }
      })
    },
    // 重置
    createPartReset(formName) {
      this.createDeptShow = false
      this.$refs[formName].resetFields()
      this.createPartForm = {
        cityId: '',
        deptLeader: '',
        deptName: '',
        sort:'',
        deptType: ''
      }
    // this.citysModel = []
    this.deptLeaderName = ''
    },
    // 添加中部门负责人的tree过滤
    
    selectMem(obj){
      this.createPartForm.deptLeader = obj.mem.userId
      this.deptLeaderName = obj.mem.userName
    },
    clearLeaderName () {
      this.deptLeaderName = ""
      this.createPartForm.deptLeader = ""
    },
    partLeaderFilter (value, data) {
      if (!value) return true
      return data.text.indexOf(value) !== -1
    },
    partTreeFocus () {
      this.partTreeShow = true
    },
    partLeaderClose () {
      this.partTreeShow = false
    },
    handleNodeClick (data) {
      // 点击之后将内容传给后端，获取负责人
      core.getEmpsByDeptId({deptId:data.id}).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.partLeaderRadio = res.data.data
        }
      }).catch(util.errorHandle)
    },
    // 点击radio时间
    changeRadio (value) {
      this.deptLeaderName = value
      this.partLeaderRadio.forEach( d => {
        if(value === d.userName){
          this.createPartForm.deptLeader = d.userId
          this.partTreeShow = false
        }
      })
    },
    // 点击返回按钮
    backIconClick () {
      this.treeContainerShow = true
      this.employeeSeeShow = false
      this.toBeAssignedShow = false
      this.initSize = 20
      this.initCurrent = 1
    },
    // 单行分配
    employeeSeeHandle (row) {
      this.userIds[0] = row.userId
      this.distributeShow = true
    },
    // 分配选择部门时获取父级部门id
    distributeChange (val) {
      this.distributeId = val[val.length-1]
    },
    // 分配取消
    distributeReset () {
      // this.$refs[formName].resetFields()
      this.distributeShow = false
      this.moveDistributeShow = false
      this.distributeId = ""
    },
    // 分配成功提交
    distributesubmit () {
      core.distributeDept({deptId: this.distributeId,userIds: this.userIds}).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.distributeShow = false
          if(this.noDistribute === 'no'){
            // 1.待分配员工table刷新
            this.getToBeAssignedTable()
          }else{
            // 2.查看人员table刷新
            this.getseePersonnelTable(tableId)
          }
          // 3.组织架构树形table刷新
          this.getOrgTreeExtInfo()
          // 重新加载下拉tree
          this.getOrgTreeBaseInfo()
          this.userIds = []
          this.$message.success(res.data.messages)
        }
      }).catch(util.errorHandle)
    },
    // 移动到
    moveTosubmit () {
      if(this.distributeId === undefined || this.distributeId === ""){
        this.$message.error('请先选择上级部门')
        return false
      }
      core.orgDragSave({sourceId: this.moveId,targetId: this.distributeId}).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.moveDistributeShow = false
          // 3.组织架构树形table刷新
          this.getOrgTreeExtInfo()
          // 重新加载下拉tree
          this.getOrgTreeBaseInfo()
          this.$message.success(res.data.messages)
        }
      }).catch(util.errorHandle)
    },
    // 分页
    handleSizeChange (val) {
      // console.log(val)
    }, 
    handleCurrentChange (val) {
      // console.log(val)
    },
    // 查看员工
    employeeSeeChange (val) {
      // 初始化多选
      this.employeeSeepageSize = val.value
      if(val.isLoad){
         if(this.noDistribute === 'no') {
          this.getToBeAssignedTable()
        }else {
          this.getseePersonnelTable(tableId)
        }
      }
     
    },
    employeeSeeCurrent (val) {
      this.employeeSeepageNum = val
      if(this.noDistribute === 'no') {
        this.getToBeAssignedTable()
      }else {
        this.getseePersonnelTable(tableId)
      }
      
    },
    // load分配员工的table
    seeSearchInputClick () {
      this.employeeSeepageNum = 1
      this.inpageNum = 1
      this.getseePersonnelTable (tableId)
    },
    toBeAssignedSearchClick () {
      this.employeeSeepageNum = 1
      this.topageNum = 1
      this.getToBeAssignedTable()
    },
    // 单选一行
    seeSelectionChange (val) {
      // 得到选中的行的数组
      // val.forEach(v => {
      //   this.seecheckArr.push(v)
      // })
      this.seeSelectionChangeArr = val
    },
    // 批量分配
    toggleRowSelection () {
      if(this.seeSelectionChangeArr.length === 0){
        this.$message.error('请先选中要分配的员工')
        return false
      }
      this.seeSelectionChangeArr.forEach((val) => {
        // 加载所有的id给后端
        this.userIds.push(val.userId)
        this.distributeShow = true
      })
    },
    // 待分配员工
    toBeAssignedClick () {
      this.noselectInput = ''
      this.employeeSeepageSize = 20
      this.topageNum = 1
      this.employeeSeepageNum = 1
      // 员工分配table 显示,获取未分配数据
      this.getToBeAssignedTable()
      this.noDistribute = 'no'
    },
    getToBeAssignedTable () {
      // 员工分配table 显示,获取未分配数据
      core.getToBeAssignedEmp({definedPage:{pageNum:this.employeeSeepageNum,pageSize:this.employeeSeepageSize},searchPara:this.noselectInput}).then((res) => {
        this.visible = true;
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.treeContainerShow = false
          this.toBeAssignedShow = true
          this.employeeSeeTable = res.data.data.list
          this.employeeSeePage = res.data.data.total
        }
      }).catch(util.errorHandle)
    },
    changeActive(node,data) {
      // const parent = node.parent;
      // const children = parent.data.children || parent.data;
      // const index = children.findIndex(d => d.id === data.id);
      // console.log(parent)
      // console.log(children)
      // console.log(index)
    }
  }
}
</script>
<style lang="sass">
#custom-tree-container
  border: 1px solid #DCDFE6
  .listWrapNoScroll
    // height: calc(100vh - 142px)
  .idBorder
    background: #f9f9f9 !important
    clear: both
  .backIcon
    float: right
    display: block
    font-size: 26px
    color: #666
    cursor: pointer
    margin-left: 20px
  .employeeHead
    padding: 0 4px 9px
    font-size: 16px
    font-weight: bold
    float: left
  .el-button--small
    padding: 8px 15px
  .custom-tree-node
    flex: 1
    display: flex
    align-items: center
    justify-content: space-between
    font-size: 14px
    padding-right: 8px
  .el-tree-node__content
    border-bottom: 1px solid #ebeef5
    position: relative
    padding-top: 6px
    padding-bottom: 6px
    align-items: center
    height: 26px
    cursor: pointer
    font-size: 14px
    .two
      position: absolute
      right: 10%
      // border: 1px solid #e8e4e4
      padding: 5px 20px
    .three
      position: absolute
      right: 50%
      // border: 1px solid #e8e4e4
      // padding: 5px 20px
      border-right: 0
      top: 14px
  .addNewPowerDiv .el-dialog,.distributeDiv .el-dialog
      // width: 660px
  .width200
    width: 250px
  .partTree
    position: absolute
    z-index: 100
    width: 398px
    background: #fff
    border: 1px solid #f3ecec
    border-radius: 4px
    .partTreeLeft
      float: left
      height: 600px
      width: 210px
      overflow-y: auto
      border-right: 1px solid #eadfdf
    .partLeaderRight
      float: left
      width: 170px
      margin-top: 6px
      .el-radio
        margin-left: 5px !important
        margin-top: 10px
        width: 115px
      i
        display: inherit
        text-align: right
        font-size: 20px
        padding-right: 6px
        margin-bottom: 20px
        cursor: pointer
  .fontW
    font-weight: bold
  .el-button--success
    // background-color: #24B985
    // border-color: #24B985
  .el-tree-node__expand-icon.expanded,.el-tree-node__content>.el-tree-node__expand-icon
    font-size: 20px !important
  .el-icon-caret-right:before
    content: "\E602"
  .el-tree-node__expand-icon.expanded
    -webkit-transform: rotate(0deg)
    transform: rotate(0deg)
  .el-icon-caret-right.expanded:before
    content: "\E63C"
  .el-tree>.el-tree-node:first-child > .el-tree-node__children
    background: #fff
  .el-tree>.el-tree-node:first-child > .el-tree-node__content:first-child
    background: #F9F9F9
    padding: 13px !important
    // margin-bottom: 20px
    .el-tree-node__expand-icon
      display: none
    .custom-tree-node
      font-size: 16px !important
  
</style>
