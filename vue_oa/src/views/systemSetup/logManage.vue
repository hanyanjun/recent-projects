<template lang="pug">
#logManage.companyList.listWrapNoScroll.companyCommon
  div.logManageDiv
    div.logTopdiv(style="padding-bottom: 25px !important")
      el-form(:model='logManageParam',ref="logSearchForm",label-width="100px", size="small")
        el-form-item(label='日志标题：', prop='logTitle')
          el-input.width200(v-model='logManageParam.logTitle')
        el-form-item(label='请求地址：', prop='reqAddr')
          el-input.width200(v-model='logManageParam.reqAddr')
        el-form-item(label='客户端ip：', prop='ip')
          el-input.width200(v-model='logManageParam.ip')
        el-form-item(label='操作人：', prop='userName')
          el-input.width200(v-model='logManageParam.userName')
        el-form-item(label='日志类型：', prop='logType')
          el-select.width105(v-model='logManageParam.logType', clearable='', placeholder='请选择')
            el-option(v-for='item in options', :key='item.value', :label='item.label', :value='item.value')
        el-form-item(label='操作用户：', prop='userName')
          el-select.width105(v-model='deptLeaderName',clearable,@clear="clearUserId", placeholder='请选择')
            template(slot-scope='scope')
              selectMem.width360(:treeData='optionsPartLeader', @select='selectMem',:clear="deptLeaderName")
              el-option(v-for='(item,index) in [0]', :key='index', :value='item.id')
        el-form-item(label='是否异常：', prop='operStatus')
          el-select.width105(v-model='logManageParam.operStatus', clearable='', placeholder='请选择')
            el-option(label='是',value='Y') 是
            el-option(label='否',value='N') 否
        el-form-item(label='操作时间：', prop='operTime')
          el-date-picker.width230(v-model='logSearchDatePicker', type='daterange', align='right', unlink-panels='',value-format="yyyy-MM-dd", range-separator='至', start-placeholder='开始日期', end-placeholder='结束日期')
        el-form-item
          <el-button type="primary" @click='searchClick'>查询</el-button>
          <el-button @click='resetSearchClick'>重置</el-button>    
    //- div.tableBorder
    el-table.tableContentScroll(:data='logManageTable', style='width: 100%', v-loading="false",height='300')
      el-table-column(label='序号', type="index")
      el-table-column(label='日志标题', prop="logTitle")
      el-table-column(label='请求地址', prop="reqAddr",min-width="200px")
      el-table-column(label='请求方式', prop="reqMethod",width="70px")
      el-table-column(label='请求数据	',prop="repData",width="100px")
        template(slot-scope='scope')
          el-tooltip.item(:content= 'scope.row.repData' ,popper-class="tips", placement='left')
            span.hiddenSpan(style="") {{scope.row.repData}}
      el-table-column(label='日志类型', prop="logType",width="80px")
      el-table-column(label='操作用户', prop="userName",width="70px")
      el-table-column(label='是否异常', prop="operStatus",width="40px")
      el-table-column(label='用户代理', prop="userProxy",width="100px")
        template(slot-scope='scope')
          el-tooltip.item(:content= 'scope.row.userProxy' ,popper-class="tips", placement='left')
            span.hiddenSpan(style="") {{scope.row.userProxy}}
      el-table-column(label='操作时间', prop="operTime",width='150px')
      el-table-column(label='客户端ip', prop="ip",width='100px')
      el-table-column(label='设备名称', prop="equipment",width="90px")
      el-table-column(label='浏览器名称',prop="browser",width="90px")
      el-table-column(label='响应时间',prop="respTime",width="70px")
      empty(slot="empty",:visible="visible")
    //- 分页
    pagination(@size-change='logManageChange', @current-change='logManageCurrentChange', :total='logManageTolPage',background, :sizes='[10, 20, 30, 40]', :size='20',:current.sync="inpageNum", layout='total, sizes, prev, pager, next, jumper')
      
</template>
<script>
import { mapState } from 'vuex'
import selectMem from "../../components/selectMem"
import pagination from "../../components/pagination"
import empty from "@/components/empty";
export default {
  name: '',
  components : {selectMem,pagination,empty},
  data () {
    return {
      logManageTable: [],
      logManageParam: {
        endOperTime:'',
        ip:'',
        userName:'',
        logTitle:'',
        logType:'',
        operStatus:'',
        reqAddr:'',
        startOperTime:'',
        userId:'',
        pageNum:1,
        pageSize:20
      },
      visible : false,
      logManageTolPage: 0,
      logSearchDatePicker: [],
      options: [{
          value: '接入日志',
          label: '接入日志'
        }, {
          value: '修改日志',
          label: '修改日志'
        }, {
          value: '删除日志',
          label: '删除日志'
        }, {
          value: '查询日志',
          label: '查询日志'
        }, {
          value: '登录日志',
          label: '登录日志'
        }, {
          value: '登出日志',
          label: '登出日志'
        }],
      deptLeaderName: '',
      optionsPartLeader: [],
      // currpageSize: 20,
      // currpageNum: 1
      inpageNum: 1,
    }
  },
  computed:{
    ...mapState(['headInfo']),
  },
  created () {
    this.getlogManageTable()
    // 获取部门负责人-汇报对象
    this.$api.orgTreeBaseInfo().then((res) => {
        this.optionsPartLeader = JSON.parse(JSON.stringify(res.data.data))
    })
  },
  methods: {
    getlogManageTable () {
      if(this.logManageParam.userId === "" ||　this.logManageParam.userId === null){
        this.logManageParam.userId = null
      }else{
        this.logManageParam.userId = Number(this.logManageParam.userId)
      }
      this.$api.getLoglist(this.logManageParam).then( res => {
        this.visible = true;
        this.logManageTable = res.data.data.list
        this.logManageTolPage = res.data.data.total
      })
    },
    // 分页
    logManageChange (val) {
      this.logManageParam.pageSize = val.value;
      if(val.isLoad){
      this.getlogManageTable()
      }
    },
    logManageCurrentChange (val) {
      this.logManageParam.pageNum = val
      this.getlogManageTable()
    },
    selectMem(obj){
      this.logManageParam.userId = obj.mem.userId
      this.deptLeaderName = obj.mem.userName
    },
    searchClick () {
      if(this.logSearchDatePicker === null){
        this.logManageParam.endOperTime = ''
        this.logManageParam.startOperTime = ''
      }else{
        this.logManageParam.endOperTime = this.logSearchDatePicker[1]
        this.logManageParam.startOperTime = this.logSearchDatePicker[0]
      }
      // this.currpageSize = 20
      // this.currpageNum=1
      this.inpageNum = 1
      this.logManageParam.pageNum= 1
      // this.logManageParam.pageSize = 20
      this.getlogManageTable()
    },
    resetSearchClick () {
      this.logManageParam = {
        endOperTime:'',
        ip:'',
        userName:'',
        logTitle:'',
        logType:'',
        operStatus:'',
        reqAddr:'',
        startOperTime:'',
        userId:'',
        pageNum:this.logManageParam.pageNum,
        pageSize:'20'
      }
      this.logSearchDatePicker = []
      this.deptLeaderName = ''
      this.inpageNum = 1
      this.getlogManageTable()
    },
    clearUserId () {
      console.log(1)
      this.logManageParam.userId = ""
    }
  }
}
</script>
<style lang="sass"  scoped>
#logManage
  .tableContentScroll
    // background: #f9f9f9
    // border: 1px solid #DCDFE6
    height: calc(100vh - 310px) !important
.logManageDiv
  border: 1px solid #DCDFE6
  background: #FFFFFF
  height: 100%
  -webkit-box-sizing: border-box
  box-sizing: border-box
  padding-bottom: 30px
  padding-top: 10px
.width230
  width: 230px !important
.width200
  width: 140px !important
.width105
  width: 105px !important
.el-form-item
  float: left
.hiddenSpan
  width: 100px
  overflow: hidden
  text-overflow: ellipsis
  -o-text-overflow: ellipsis
  -webkit-text-overflow: ellipsis
  -moz-text-overflow: ellipsis
  white-space: nowrap

</style>
