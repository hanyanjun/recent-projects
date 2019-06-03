<template lang="pug">
#examAnalysis
  div
    div.rightTitle 
      | 考试分析 - {{examName}}
    i.backIcon(class="iconfont icon-fanhui pointer", @click="backManage")
  div.clearBoth.info()
    el-row.infoDiv
      el-col(:span='8')
        span.spanLable 应考人数
        span.spanData {{info.totalUser }}人
      el-col(:span='8')
        span.spanLable 及格分数
        span.spanData {{info.examQualifiedScore}}分
        span.spanrate （及格率{{info.passRate}}%）
      el-col(:span='8')
        span.spanLable 最高分
        span.spanData {{info.maxScore}}分
    el-row.infoDiv
      el-col(:span='8')
        span.spanLable 实考人数
        span.spanData {{info.realNumber}}人
        span.spanrate （参考率{{info.joinRate}}%）
      el-col(:span='8')
        span.spanLable 及格
        span.spanData {{info.qualifiedNumber}}人
      el-col(:span='8')
        span.spanLable 最低分
        span.spanData {{info.minScore}}分
    el-row.infoDiv
      el-col(:span='8')
        span.spanLable 缺考
        span.spanData {{info.missingNumber}}人
      el-col(:span='8')
        span.spanLable 答题时长
        span.spanData {{info.examDuration}}分钟
        span.spanrate （平均答题时长{{info.avgTestDuration}}）
      el-col(:span='8')
        span.spanLable 平均分
        span.spanData {{info.avrScore}}分
  div.listWrapNoScroll.companyCommon.companyList
    div.topTitlediv
      el-row
        el-col(:span='4')
          div.tableTitleRight 考试成绩分析
        el-col(:span='20')
          div.tableTitleLeft
            el-form(label-width='100px')
              el-row
                el-col(:span='8')
                  el-form-item(label='部门')
                    el-cascader(v-model='deptId',@change="optionChange",size='small',placeholder='请选择',:options='distributeOptions',clearable, :props="props",filterable, change-on-select,:show-all-levels='false')
                el-col(:span='8')
                  el-form-item(label='是否及格')
                    el-select(v-model='listParam.isQualified',@change='isQualifiedChange' placeholder='请选择',size='small')
                      el-option(label='全部', value='')
                      el-option(label='及格', value='Y')
                      el-option(label='不及格', value='N')
                el-col(:span='8')
                  el-form-item(label='考试状态')
                    el-select(v-model='listParam.testStatus', @change='testStatusClick',placeholder='请选择',size='small')
                      el-option(label='全部', value='')
                      el-option(label='缺考', value='2')
                      el-option(label='已考', value='3')
      div(style="clear:both")
    div.tableContent
      el-table.tableContentScroll(:data='tableList', height='200')
        el-table-column(label='序号',type='index', width='80')
        el-table-column(v-for='(column, key) in colums',:width='column.width', :sortable="column.pro  == 'testRank' || column.pro  ==  'testScore' ", :prop='column.pro', :label='column.label', :key='column.pro')
          template(slot-scope='scope')
            template(v-if="column.pro === 'testNo'")
              span.class11(v-if='scope.row.testStatus === "已考"',@click="testNoClick(scope.row)") {{scope.row[column.pro] || '---'}}
              span(v-else) ---
            template(v-else-if="column.pro === 'isQualified'")
              span(v-if='scope.row.testStatus === "已考"') {{scope.row[column.pro] || '---'}}
              span(v-else) ---
            template(v-else-if="column.pro === 'testRank'")
              span(v-if='scope.row.testStatus === "已考"') {{scope.row[column.pro] || '---'}}
              span(v-else) ---
            template(v-else-if="column.pro === 'testScore'")
              span(v-if='scope.row.testStatus === "已考"') {{scope.row[column.pro] || '---'}}
              span(v-else) ---
            template(v-else)
              | {{scope.row[column.pro] || '---'}}
      //- 分页
      pagination(@size-change='SizeChange', @current-change='CurrentChange',background, :sizes='[10, 20, 30, 40]', :size='10', layout='total, sizes, prev, pager, next, jumper', :total='totlePage')
        
</template>
<script>

import "../../commons/publicCss/outside.sass"
import pagination from "../../components/pagination"
export default {
  name: '',
  components : {pagination},
  data () {
    return {
      examName: '',
      info: {
        totalUser: 0,
        examQualifiedScore: 0,
        passRate: 0,
        maxScore: 0,
        realNumber: 0,
        joinRate: 0,
        qualifiedNumber: 0,
        minScore: 0,
        missingNumber: 0,
        examDuration: 0,
        avgTestDuration: 0,
        avrScore: 0,
      },
      searchUserName: '',
      tableList: [],
      colums:[
        {
          pro : 'empNo',
          label : '工号',
          // width : 100
        },
        {
          pro : 'userName',
          label : '考生姓名',
          // width : 100
        },
        {
          pro : 'deptName',
          label : '部门',
          // width : 150
        },
        {
          pro : 'testStartTime',
          label : '参与考试时间',
          width : 150
        },
        {
          pro : 'testSubmitTime',
          label : '提交考卷时间',
          width : 150
        },
        {
          pro : 'testDuration',
          label : '答卷时长',
          // width : 100
        },
        {
          pro : 'testStatus',
          label : '考试状态',
          // width : 100
        },
        {
          pro : 'testNo',
          label : '试卷编号',
          // width : 100
        },
        {
          pro : 'testScore',
          label : '分数',
          // width : 100
        },
        {
          pro : 'testRank',
          label : '分数排名',
          // width : 100
        },
        {
          pro : 'isQualified',
          label : '是否及格',
          // width : 100
        }
      ],
    listParam: {
      definedPage:{
        pageNum:1,
        pageSize:10,
      },
      examId: 98,
      deptId: '',
      isQualified: '',
      testStatus: ''

    },
    totlePage: 0,
    // 部门
    deptId:[],
    distributeOptions: [],
    props:{
      value: 'id',
      label: 'text',
      children: 'children'
    },
    }
  },
  watch: {
    searchUserName (val) {
      this.listParam.userName = val
      if(val === ''){
        this.getScoreAnalysisList()
      }
    },
  },
  created () {
    // 考试name
    this.examName = sessionStorage.getItem('examName')
    // 先得到examId
    this.listParam.examId = Number(sessionStorage.getItem('examId'))
    // 1.加载基本信息
    this.$api.scoreAnalysis({examId:this.listParam.examId}).then(res => {
      if(res.data.data !== null){
        this.info = res.data.data
      }
    })
    // 加载部门下拉框
    this.$store.dispatch('getOrgTreeExtInfo').then( obj =>{
      this.distributeOptions = obj
    })
    // 2.加载table列表
    this.getScoreAnalysisList()
  },
  methods: {
    // load列表
    getScoreAnalysisList(){
      this.$api.scoreAnalysisList(this.listParam).then(res => {
        this.tableList = res.data.data.list
        this.totlePage = res.data.data.total
      })
    },
    // 搜索
    searchBtnClick(){
      this.getScoreAnalysisList()
    },
    // 分页
    SizeChange (val) {
      // this.listParam.pageSize = val
      this.listParam.definedPage.pageSize = val.value
      if(val.isLoad){
        this.getScoreAnalysisList()
      }
    },
    CurrentChange (val) {
      // this.listParam.pageNum = val
      this.listParam.definedPage.pageNum = val
      this.getScoreAnalysisList()
    },
    // 返回
    backManage () {
      this.$router.push({name: 'examList'})
    },
    // 点击试卷编号
    testNoClick(item){
      
      this.$router.push({name : 'exam'});
      this.$store.dispatch('setCookiesExam',{id : item.testNo, type : 'preview' , examId : item.examId});
      // console.log('点击试卷编号-跳转已考试的试卷详情')
    },
    // 部门-下拉框改变
    optionChange(val){
      this.listParam.deptId = this.deptId[this.deptId.length-1]
      this.getScoreAnalysisList()
    },
    isQualifiedChange(val){
      this.listParam.isQualified = val
      this.getScoreAnalysisList()
    },
    // 考试状态-change
    testStatusClick(val){
      this.listParam.testStatus = val
      this.getScoreAnalysisList()
    }
  }
}
</script>
<style lang="sass"  scoped>
#examAnalysis
  .listWrapNoScroll
    background: #f9f9f9
    border: 1px solid #DCDFE6
    height: calc(100vh - 425px)
  .rightTitle
    padding-left: 4px
    float: left
    font-size: 16px
    font-family: MicrosoftYaHei-Bold
    font-weight: bold
    color: rgba(51,51,51,1)
  .backIcon
    float: right
    display: block
    // font-weight: bold
    font-size: 26px
    color: #666
    cursor: pointer
    padding-right: 20px
    margin: -8px 0 6px 0
  .tableTitleLeft
    margin-bottom: -24px
    
  .info
    height: 140px
    background: rgba(255,255,255,1)
    border-radius: 2px
    box-shadow: 0px 0px 5px 0px rgba(221,221,221,1)
    margin-bottom: 20px
    padding: 40px
    .infoDiv
      margin-bottom: 40px
      font-size: 14px
      .spanLable
        width: 100px
        display: inline-block
      .spanData
        color: #666666
      .spanrate
        color: #666666
        font-size: 12px

</style>
