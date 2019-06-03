<template lang="pug">
#examResults
  div.listWrapNoScroll.companyCommon.companyList
    div.topTitlediv
      div.tableTitleRight 考生历史成绩查询
      div.tableTitleLeft
        el-input.inputSearch.width290(placeholder='请输入工号或姓名',size='small',maxlength="20", v-model='searchUserName'  v-on:keyup.native.enter='searchBtnClick')
        i.el-icon-search(@click='searchBtnClick')
        el-button.addBtn(size='small',@click='filterHandle')  筛选
        //- 测试提交
      div(style="clear:both")
    //- 筛选icon
    div.termFilterDiv(v-if='termFilterDivShow')
      span 条件筛选：
      el-tag(:key='tag',size='small',type='info', v-for='tag in dynamicTags', closable='', :disable-transitions='false', @close='tagHandleClose(tag)')
        span.punctuation
        | {{tag}}
      span(style="color:rgba(60,115,177,1);cursor: pointer",@click='dynamicTagsCloseAll') 清空筛选条件
          
    div.tableContent
      el-table.tableContentScroll(:data='tableList', height='200')
        el-table-column(label='序号',type='index', width='80')
        el-table-column(v-for='(column, key) in colums',:min-width='column.width', :sortable="column.pro  == 'userId1' || column.pro  ==  'testScore1' ", :prop='column.pro', :label='column.label', :key='column.pro')
          template(slot-scope='scope')
            template(v-if="column.pro === 'testNo'")
              span.class11(v-if='scope.row.testStatus === "已考"',@click="testNoClick(scope.row)") {{scope.row[column.pro] || '---'}}
              span(v-else) {{scope.row[column.pro] || '---'}}
            template(v-else-if="column.pro === 'testScore'")
              span(v-if='scope.row.testStatus === "已考"') {{scope.row[column.pro] || '---'}}
              span(v-else) ---
            template(v-else-if="column.pro === 'testRank'")
              span(v-if='scope.row.testStatus === "已考"') {{scope.row[column.pro] || '---'}}
              span(v-else) ---
            template(v-else-if="column.pro === 'isQualified'")
              span(v-if='scope.row.testStatus === "已考"') {{scope.row[column.pro] || '---'}}
              span(v-else) ---
            template(v-else-if="column.pro === 'examName'")
              el-tooltip.item(effect='dark', v-bind:content="scope.row['tip']", placement='top')
                div(slot="content")
                  span.tipSpan 参考时间：{{scope.row.examStartTime || '---'}}至{{scope.row.examEndTime || '---'}}
                  br
                  span.tipSpan 答卷时长：{{scope.row.examDuration || '---'}}分钟
                  br
                  span.tipSpan 试卷总分：{{scope.row.totalScore || '---'}}
                  br
                  span.tipSpan 及格分数：{{scope.row.examQualifiedScore || '---'}}
                span {{scope.row[column.pro] || '---'}}
            template(v-else)
              | {{scope.row[column.pro] || '---'}}
        empty(slot="empty",:visible="visible")      
      //- 分页
      pagination(@size-change='SizeChange', @current-change='CurrentChange',background, :sizes='[10, 20, 30, 40]', :size='20',:current.sync="inpageNum", layout='total, sizes, prev, pager, next, jumper', :total='totlePage')
    //- 筛选-弹出框
    el-dialog(title='筛选条件', :visible.sync='termFilterFormShow', style='margin:0 auto', :close-on-click-modal='false',width="570px")
      el-form.elForm(v-model='listParam',v-if="termFilterFormShow",ref='listParam',label-width="120px",size='medium')  
        el-form-item(label='考试状态')
          el-radio-group(v-model='listParam.testStatus')
            el-radio(label='3',value='已考') 已考
            el-radio(label='2',value='未考') 缺考
        el-form-item(label='是否及格')
          el-radio-group(v-model='listParam.isQualified')
            el-radio(label='Y',value='及格') 及格
            el-radio(label='N',value='不及格') 不及格
        el-form-item(label='部门')
          el-cascader.width290(placeholder='请选择',clearable,:options='distributeOptions', :props="props",  filterable, @change='optionChange',v-model="deptId", change-on-select,:show-all-levels="false")
        el-form-item(label='考试名称')
          el-input.width290(v-model.trim='listParam.examName', placeholder='请输入考试名称')
        el-form-item(label='实际参考时间')
          el-date-picker.width290(v-model='testTime', type='daterange', align='right', unlink-panels='',format="yyyy-MM-dd",value-format="yyyy-MM-dd", range-separator='至', start-placeholder='开始日期', end-placeholder='结束日期')
      
      .dialog-footer(slot='footer')
        el-button(type='primary', @click="termFilterFormsubmit('listParam')",size='medium') 确 定
        el-button(@click="termFilterFormReset('listParam')",size='medium') 取 消    
</template>
<script>

import "../../commons/publicCss/outside.sass"
import pagination from "../../components/pagination"
import empty from "@/components/empty";
export default {
  name: 'examResults',
  components:{pagination,empty},
  data () {
    return {
      searchUserName: '',
      tableList: [],
      visible : false,
      colums:[
        {
          pro : 'examName',
          label : '考试名称',
          width : '300px'
        },
        {
          pro : 'empNo',
          label : '工号'
        },
        {
          pro : 'userName',
          label : '考生姓名',
        },
        {
          pro : 'deptName',
          label : '部门',
        },
        {
          pro : 'testStartTime',
          label : '实际参考时间',
          width : 150
        },
        {
          pro : 'testStatus',
          label : '考试状态',
        },
        {
          pro : 'testNo',
          label : '试卷编号',
        },
        {
          pro : 'testScore',
          label : '分数',
        },
        {
          pro : 'testRank',
          label : '分数排名',
        },
        {
          pro : 'isQualified',
          label : '是否及格',
        }
      ],
      listParam: {
        definedPage:{
          pageNum:1,
          pageSize:20,
        },
        testStatus:'',
        examName: '',
        isQualified: '',
        deptId: '',
        testStartTime: '',
        testSubmitTime: '',
        searchPara: ''
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
      // 筛选
      termFilterFormShow: false,
      termFilterDivShow: false,
      dynamicTags: [],
      newValFilter:'',
      testTime: []
    }
  },
  watch: {
    searchUserName (val) {
      this.listParam.searchPara = val
      if(val === ''){
        this.getScoreAnalysisList()
      }
    },
    // 筛选数据为空时，div隐藏
    dynamicTags (val) {
      if(val.length === 0){
        this.termFilterDivShow = false
      }else{
        this.termFilterDivShow = true
      }
    },
    termFilterFormShow (val) {
      if(val){
        // this.$refs['inOfficeParam'].resetFields()
        this.listParam = {
          definedPage:{
            pageNum:1,
            pageSize:this.listParam.definedPage.pageSize,
          },
          testStatus:'',
          examName: '',
          isQualified: '',
          deptId: '',
          testStartTime: '',
          testSubmitTime: '',
          searchPara: ''
        }
        this.deptId=[]
      }
    }
  },
  created () {
    // 1.加载table列表
    this.getScoreAnalysisList()
    // 加载部门下拉框
    this.$store.dispatch('getOrgTreeExtInfo').then( obj =>{
      this.distributeOptions = obj;
    })
  },
  methods: {
    // load列表
    getScoreAnalysisList(){
      this.$api.historyScoreList(this.listParam).then(res => {
        this.tableList = res.data.data.list;
        this.totlePage = res.data.data.total;
        this.visible = true;
      })
    },
    // 搜索
    searchBtnClick(){
      this.inpageNum = 1
      this.listParam.definedPage.pageNum = 1
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
    // 点击试卷编号
    testNoClick(row){
      this.$router.push({name : 'exam'});
      this.$store.dispatch('setCookiesExam',{id : row.testNo, type : 'preview' , examId : row.examId});
    },
    // 筛选
    filterHandle () {
      this.deptId=[]
      this.testTime = []
      this.termFilterFormShow = true
    },
    // 部门-下拉框改变
    optionChange(val){
      this.listParam.deptId = this.deptId[this.deptId.length-1]
    },
    callBackFilter (newValFilter) {
      this.newValFilter = newValFilter
    },
    // 筛选条件提交
    termFilterFormsubmit(){
      // form隐藏
      this.termFilterFormShow = false
      this.listParam.testStartTime = this.testTime[0]
      this.listParam.testSubmitTime = this.testTime[1]
      // 加载table
      this.inpageNum = 1
      this.listParam.definedPage.pageNum = 1
      this.getScoreAnalysisList()
      // 筛选div显示
      this.termFilterDivShow = true
      // 清空筛选数据
      this.dynamicTags = []
      // 填充div
      // 考试状态
      if(this.listParam.testStatus === '3'){
        this.dynamicTags.push("考试状态：已考")
      }else if(this.listParam.testStatus === '2'){
        this.dynamicTags.push("考试状态：缺考")
      }
      // 是否及格
      if(this.listParam.isQualified === 'Y'){
        this.dynamicTags.push('是否及格：及格')
      }else if(this.listParam.isQualified === 'N'){
        this.dynamicTags.push("是否及格：不及格")
      }
      // 部门-根据id 得部门
      if(this.listParam.deptId !== '' && this.listParam.deptId !== undefined){
        this.$util.findChildrenIds(this.distributeOptions, 'id', this.listParam.deptId,this.callBackFilter)
        this.newValFilter = "部门：" + this.newValFilter
        this.dynamicTags.push(this.newValFilter)
      }
      // 考试名称
      if(this.listParam.examName !== ''){
        this.dynamicTags.push('考试名称：' + this.listParam.examName)
      }
      // 实际参考时间
      if(this.testTime.length>0){
        this.dynamicTags.push('实际参考时间：' + this.listParam.testStartTime + '至' + this.listParam.testSubmitTime)
      }
    },
    tagHandleClose(tag){
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      // 点击之后初始化参数 调table
      let newVal = tag.split('：')
      switch(newVal[0]){
        case "考试状态":
          this.listParam.testStatus = ''
        break;
        case "是否及格":
          this.listParam.isQualified = ''
        break;
        case "部门":
          this.listParam.deptId = ''
        break;
        case "考试名称":
          this.listParam.examName = ''
        break;
        case "实际参考时间":
          this.listParam.testStartTime = ''
          this.listParam.testSubmitTime = ''
        break;
      }
      this.inpageNum = 1
      this.listParam.definedPage.pageNum = 1
      this.getScoreAnalysisList()
    },
    // 取消按钮
    termFilterFormReset(formName) {
      this.termFilterFormShow = false
    },
    // 
    dynamicTagsCloseAll () {
      this.listParam = {
        definedPage:{
          pageNum:1,
          pageSize:this.listParam.definedPage.pageSize,
        },
        testStatus:'',
        examName: '',
        isQualified: '',
        deptId: '',
        testStartTime: '',
        testSubmitTime: ''
      }
      this.inpageNum = 1
      this.dynamicTags = []
      this.getScoreAnalysisList()
    }
  }
}
</script>
<style lang="sass"  scoped>
#examResults
  .listWrapNoScroll
    background: #f9f9f9 !important
    border: 1px solid #DCDFE6 !important
.tipSpan
  display: inline-block
  margin: 4px    
</style>
