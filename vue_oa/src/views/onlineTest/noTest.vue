<template lang="pug">
#alreadyTest.listWrapNoScroll.companyCommon.companyList
  div.topTitlediv
    div.tableTitleLeft
      el-input.inputSearch.width290(placeholder='请输入考试名称',size='small',maxlength="20", v-model='searchUserName'  v-on:keyup.native.enter='searchBtnClick')
      i.el-icon-search(@click='searchBtnClick')
      //- el-button.addBtn(size='small',@click='leadingFileVisible = true')  导入
      //- el-button.addBtn(size='small',@click='addEdit')  新增题目
    div(style="clear:both")
  el-tabs(v-model='activeName', @tab-click='handleClick')
    el-tab-pane.listWrapNoScroll.companyCommon.companyList(label='未考试', name='first')
      div.tableContent
        el-table.tableContentScroll(:data='tableList', height='200')
          el-table-column(label='序号',type='index', width='80')
          el-table-column(v-for='(column, key) in colums',:width='column.width', :sortable="column.pro  == 'conNo' || column.pro  ==  'signDate' || column.pro  == 'ourSignBody' ||  column.pro  =='counterPart'", :prop='column.pro', :label='column.label', :key='column.pro')
            template(slot-scope='scope')
              template(v-if="column.pro === 'time'")
                span {{scope.row.examStartTime}} 至 {{scope.row.examEndTime}}
              template(v-else-if="column.pro === 'testStatus'")
                span(v-if='scope.row.testStatus === "0"')
                  span.class0 未开考
                span(v-if='scope.row.testStatus === "1"')
                  span.class1 考试中
                span(v-if='scope.row.testStatus === "2"')
                  span.class2 已结束
              template(v-else)
                | {{scope.row[column.pro] || '---'}}
          el-table-column(label='操作',width='100')
            template(slot-scope='scope')
              span(v-if='scope.row.testStatus === "0"')
                span.classCC 考试未开启
              span(v-if='scope.row.testStatus === "1"', @click='startTest(scope.row)')
                span.class11 参加考试
              span(v-if='scope.row.testStatus === "2"')
                span.classCC 缺考
          empty(slot="empty",:visible="visible")      
              //- el-tooltip.rowHandle(effect='dark', content='编辑',popper-class="tips", placement='bottom')
              //-   i.el-icon-edit(@click='addEdit(scope.row)')
              //- el-tooltip.rowHandle(effect='dark', content='删除', placement='bottom')
              //-   i.el-icon-close(@click='addRomoveRow(scope.row)')
        //- 分页
        pagination(@size-change='SizeChange', @current-change='CurrentChange',background, :sizes='[10, 20, 30, 40]', :size='20',:current.sync="inpageNum", layout='total, sizes, prev, pager, next, jumper', :total='totlePage')
        
    el-tab-pane(label='已考试')
  
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
      activeName: 'first',
      searchUserName: '',
      tableList: [],
      visible : false,
      colums:[
        {
          pro : 'examName',
          label : '考试名称',
        },
        {
          pro : 'time',
          label : '参考时间',
          width : 300
        },
        {
          pro : 'examDuration',
          label : '考试时长(分钟)',
          width : 120
        },
        {
          pro : 'testStatus',
          label : '考试状态',
          width : 120
        }
      ],
    listParam: {
      pageNum: 1,
      pageSize: 20
    },
    inpageNum: 1,
    totlePage: 0
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
  computed:{
    headInfo(){
      return this.$store.state.headInfo;
    },
    isHideLogo(){
      return this.headInfo.type == 'unifypc' || this.headInfo.type == 'unifyweixin';
    }
  },
  methods: {
    // tab切换
    handleClick(tab, event) {
      if(tab.label === "已考试"){
        this.$router.push({name: 'already'})
      }else if(tab.label === "未考试") {
        this.$router.push({name: 'noTest'})
      }
    },
    // load列表
    getNotOverExamList(){
      this.$api.getNotOverExamList(this.listParam).then(res => {
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
    // 操作-开始考试
    startTest (item) {
      // recordId
      this.$store.dispatch('setCookiesExam',{id : item.recordId, type : 'exam' });
      console.log(this.isHideLogo)
      if(this.isHideLogo){
          window.open(window.location.origin + '/#/exam');
      }else{
         this.$util.fullScreen(document.querySelector('#app'));
         this.$router.push({name : 'exam'});
      }
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
.class1
  color: #2CD48F
.class0
  color: #FFA646
.class11
  color: #3C73B1
  cursor: pointer
.classCC
  color: #CCCCCC
</style>
