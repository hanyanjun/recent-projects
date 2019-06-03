<template lang="pug">
#waitForList
  div.listWrapNoScroll.companyCommon.companyList.borderScroll
    div.topTitlediv
      div.tableTitleRight 年假调休统计
      div.tableTitleLeft
        el-input.inputSearch.width290(placeholder='请输入员工姓名',size='small',maxlength="20", v-model='searchUserName'  v-on:keyup.native.enter='searchBtnClick')
        i.el-icon-search(@click='searchBtnClick')
        el-cascader.inputSearch.width290(v-model='deptId',@change="optionChange",size='small',placeholder='请选择部门',:options='distributeOptions',clearable, :props="props",filterable, change-on-select)
        //- el-button.addBtn(size='small',@click='leadingFileVisible = true')  导入假期
        //- 测试提交
      div(style="clear:both")
    div.tableContent
      el-table.tableContentScroll(:data='tableList', height='200')
        el-table-column(v-for='(column, key) in colums',:min-width='column.width', :sortable="column.pro  == 'endFlowApplyTime'", :prop='column.pro', :label='column.label', :key='column.pro')
          template(slot-scope='scope')
            template(v-if="column.pro === 'empNo'")
              span.class11(@click.stop='empNoClick(scope.row)') {{scope.row.empNo}}
            template(v-else)(slot-scope='scope')
              | {{scope.row[column.pro] || '---'}}
        empty(slot="empty",:visible='visible')      
      //- 分页
      pagination(@size-change='SizeChange', @current-change='CurrentChange',background, :sizes='[10, 20, 30, 40]', :size='20',:current.sync="inpageNum", layout='total, sizes, prev, pager, next, jumper', :total='totlePage')
</template>
<script>
import "../../commons/publicCss/outside.sass"
import empty from "@/components/empty";
import {mapState} from 'vuex'
import pagination from "../../components/pagination"
export default {
  name: 'annualRestList',
  components:{pagination,empty},
  data () {
    return {
      searchUserName: '',
      tableList: [],
      colums:[
        {
          pro : 'empNo',
          label : '工号',
        },
        {
          pro : 'userName',
          label : '姓名'
        },
        {
          pro : 'deptName',
          label : '部门',
        },
        {
          pro : 'inCompYears',
          label : '司龄(年)',
        },
        {
          pro : 'validAnnual',
          label : '可用年假(小时/天)'
        },
        {
          pro : 'usedAnnual',
          label : '已用年假(小时/天)',
        },
        {
          pro : 'validRest',
          label : '可用调休(小时/天)',
        },
        {
          pro : 'usedRest',
          label : '已用调休(小时/天)',
        }
      ],
      listParam: {
        pageNum:1,
        pageSize:20,
        userName:'',
        deptId:''
      },
      totlePage: 0,
      inpageNum: 1,
      // 部门
      deptId:[],
      distributeOptions: [],
      props:{
        value: 'id',
        label: 'text',
        children: 'children'
      },
      visible: false
    }
  },
  watch: {
    searchUserName (val) {
      this.listParam.userName = val
      if(val === ''){
        this.getList()
      }
    },
  },
  computed:{
    // 审批类型
    processFormType() {
      return this.$store.state.selectData.processFormType;
    }
  },
  created () {
    // 1.加载table列表
    this.getList()
    // 加载部门下拉框
    this.$store.dispatch('getOrgTreeExtInfo').then( obj =>{
      this.distributeOptions = obj
    })
  },
  methods: {
    // load列表
    getList(){
      this.$api.getAnnualRestList(this.listParam).then(res => {
        this.tableList = res.data.data.list
        this.totlePage = res.data.data.total
        if(this.tableList.length == 0){
          this.visible = true
        }
      })
    },
    // 搜索
    searchBtnClick(){
      this.listParam.pageNum = 1
      this.inpageNum = 1
      this.getList()
    },
    // 分页
    SizeChange (val) {
      this.listParam.pageSize = val.value
      if(val.isLoad){
      this.getList()
      }
    },
    CurrentChange (val) {
      this.listParam.pageNum = val
      this.getList()
    },
   
    // 部门-下拉框改变
    optionChange(val){
      this.listParam.pageNum = 1
      this.inpageNum = 1
      this.listParam.deptId = this.deptId[this.deptId.length-1]
      this.getList()
    },
    // 跳转到编辑-考勤记录(员工详情-考勤记录页)
    empNoClick(row){
      console.log(row)
      window.localStorage['empNoClick'] = true
      // 用户id 加载考勤基本信息
      window.localStorage["editUserId"] = row.userId
      // 用户工号，加载打卡记录
      window.localStorage["empNo"] = row.empNo
      this.$router.push({name:'editInfo'})
    }
  }
}
</script>
<style lang="sass" scoped>  
</style>
