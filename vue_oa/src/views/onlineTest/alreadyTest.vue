<template lang="pug">
#alreadyTest.listWrapNoScroll.companyCommon.companyList
  div.topTitlediv
    div.tableTitleLeft
      el-input.inputSearch.width290(placeholder='请输入考试名称',size='small',maxlength="20", v-model='searchUserName'  v-on:keyup.native.enter='searchBtnClick')
      i.el-icon-search(@click='searchBtnClick')
      //- el-button.addBtn(size='small',@click='leadingFileVisible = true')  导入
    div(style="clear:both")
  el-tabs(v-model='activeName', @tab-click='handleClick',v-bind:class="{'activeIsShow': isShow}")
    el-tab-pane(label='未考试', name='first')
    el-tab-pane.listWrapNoScroll.companyCommon.companyList(label='已考试', name='second')
      div.tableContent
        el-table.tableContentScroll(:data='tableList', height='200')
          el-table-column(label='序号',type='index', width='80')
          el-table-column(v-for='(column, key) in colums',:width='column.width', :sortable="column.pro  == 'conNo' || column.pro  ==  'signDate' || column.pro  == 'ourSignBody' ||  column.pro  =='counterPart'", :prop='column.pro', :label='column.label', :key='column.pro')
            template(slot-scope='scope')
              template(v-if="column.pro === 'time'")
                span {{scope.row.examStartTime}} 至 {{scope.row.examEndTime}}
              template(v-else-if="column.pro === 'isQualified'")
                span(v-if='scope.row.isQualified === "Y"')
                  span 及格
                span(v-if='scope.row.isQualified === "N"')
                  span.classRed 不及格
              template(v-else)
                | {{scope.row[column.pro] || '---'}}
          el-table-column(label='操作',width='120')
            template(slot-scope='scope')
              span.class11(v-if="scope.row.examStatus === '2'",@click='seeTestAnalysis(scope.row)') 查看试卷详情
              span.classCC(v-else) 查看试卷详情
          empty(slot="empty",:visible="visible")    
        //- 分页
        pagination(@size-change='SizeChange', @current-change='CurrentChange',background, :sizes='[10, 20, 30, 40]', :size='20',:current.sync="inpageNum", layout='total, sizes, prev, pager, next, jumper', :total='totlePage')
        
</template>
<script>

import "../../commons/publicCss/outside.sass"
import pagination from "../../components/pagination"
import empty from "@/components/empty";
export default {
  name: '',
  components:{pagination,empty},
  data () {
    return {
      isShow: false,
      activeName: 'second',
      searchUserName: '',
      visible : false,
      tableList: [],
      colums:[
        {
          pro : 'examName',
          label : '考试名称',
        },
        {
          pro : 'time',
          label : '参考时间',
          width : 350
        },
        {
          pro : 'examDuration',
          label : '考试时长(分钟)',
          width : 120
        },
        {
          pro : 'testStartTime',
          label : '实际参考时间',
          width : 120
        },
        {
          pro : 'testSubmitTime',
          label : '交卷时间',
          width : 120
        },
        {
          pro : 'testScore',
          label : '成绩分数(分)',
          width : 100
        },
        {
          pro : 'isQualified',
          label : '是否及格',
          width : 100
        }
      ],
    listParam: {
      pageNum: 1,
      pageSize: 20
    },
    totlePage: 0,
    inpageNum: 1,
    }
  },
  watch: {
    searchUserName (val) {
      this.listParam.examName = val
      if(val === ''){
        this.getNotOverExamList()
      }
    },
  },
  created () {
    this.getNotOverExamList()
  },
  methods: {
    // tab切换
    handleClick(tab, event) {
      if(tab.label === "未考试"){
        this.$router.push({name: 'noTest'})
      }else {
        this.$router.push({name: 'already'})
      }
    },
    // load列表
    getNotOverExamList(){
      this.$api.getOverExamList(this.listParam).then(res => {
        this.visible = true;
        this.tableList = res.data.data.list
        this.totlePage = res.data.data.total
      })
    },
    // 搜索
    searchBtnClick(){
      this.inpageNum = 1
      this.listParam.pageNum = 1
      this.getNotOverExamList()
    },
    // 分页
    SizeChange (val) {
      this.listParam.pageSize = val.value;
      if(val.isLoad){
        this.getNotOverExamList()
      }
    },
    CurrentChange (val) {
      this.listParam.pageNum = val
      this.getNotOverExamList()
    },
    // 操作-查看试卷详情
    seeTestAnalysis (item) {
      this.$router.push({name : 'exam'});
      this.$store.dispatch('setCookiesExam',{id : item.testNo, type : 'preview' , examId : item.examTestBasId});
    }
  }
}
</script>
<style lang="sass"  scoped>
#alreadyTest
  background: #f9f9f9
  border: 1px solid #DCDFE6
  .topTitlediv
    padding: 0
    position: absolute
    right: 27px
    top: 60px
    z-index: 100
  .classCC
    color: #CCCCCC
    cursor: no-drop
.class1
  color: #2CD48F
.class0
  color: #FFA646
.class11
  color: #3C73B1
  cursor: pointer
.classRed
  color: #FF4E31
</style>
