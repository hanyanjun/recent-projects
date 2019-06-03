<template lang='pug'>
.contractList
  // 1.题库分类组件
  .classify.listWrapNoScroll
    <questClass :classType='classType' @search="selected" @selected="selected"></questClass>    
  .content
    .companyList.listWrapNoScroll.companyCommon
      div.topTitlediv
        div.tableTitleRight 题库管理
        div.tableTitleLeft
          el-input.inputSearch.width290(placeholder='请输入题目名称',size='small',maxlength="20", v-model='searchUserName',  v-on:keyup.native.enter='searchBtnClick')
          i.el-icon-search(@click='searchBtnClick')
          el-button.addBtn(size='small',@click='leadingFileVisible = true')  导入
          el-button.addBtn(size='small',@click='addEdit("add")')  新增题目
          //- 测试提交
        div(style="clear:both")
      div.tableContent
        el-table.tableContentScroll(:data='tableList', height='200')
          el-table-column(label='序号',type='index', width='80')
          el-table-column(v-for='(column, key) in colums',:width='column.width', :sortable="column.pro  == 'conNo' || column.pro  ==  'signDate' || column.pro  == 'ourSignBody' ||  column.pro  =='counterPart'", :prop='column.pro', :label='column.label', :key='column.pro')
            template(slot-scope='scope')
              template(v-if="column.pro === 'ifExam'")
                el-switch(active-value="Y",
                          inactive-value="N",
                          v-model="scope.row.ifExam",
                          active-color="#6DD8AF",
                          @change="changeStatus(scope.row)",
                          inactive-color="#C3CBD6")
              template(v-else-if="column.pro == 'title'")
                span.hiddenSpan
                  | {{scope.row[column.pro] || '---'}}
              template(v-else='')
                span(:class="['font']")
                  | {{scope.row[column.pro] || '---'}}
          el-table-column(label='操作',width='100')
            template(slot-scope='scope')
              el-tooltip.rowHandle(effect='dark', content='编辑',popper-class="tips", placement='bottom')
                i.iconfont.icon-bianji(@click='addEdit(scope.row)')
              el-tooltip.rowHandle(effect='dark', content='删除', placement='bottom')
                i.el-icon-close(@click='addRomoveRow(scope.row)')
          empty(slot="empty",:visible='visible')      
        //- 分页
        pagination(@size-change='SizeChange', @current-change='CurrentChange',background, :sizes='[10, 20, 30, 40]', :size='20',:current.sync="inpageNum", layout='total, sizes, prev, pager, next, jumper', :total='totlePage')
        
    //- 导入
    leadingFile(:visible.sync="leadingFileVisible",type='question', @submit="leadSubmit") 
</template>

<script>
import "../../commons/publicCss/outside.sass"
import questClass from "./questionClass.vue"
import leadingFile from "./leadingFile"
import empty from "@/components/empty";
import pagination from "../../components/pagination"

export default {
    name : "questionManage",
    components:{questClass,leadingFile,pagination,empty},
    data () {
      return{
        leadingFileVisible : false, //导入说明的显示和隐藏
        classType:'Q',
        searchUserName: '',
        tableList:[],
        visible : false,
        colums:[
          {
            pro : 'title',
            label : '题目名称',
          },
          {
            pro : 'className',
            label : '所属分类',
            width : 160
          },
          {
            pro : 'titleType',
            label : '题型分类',
            width : 120
          },
          {
            pro : 'quesDifficult',
            label : '题目难度',
            width : 120
          },
          {
            pro : 'ifExam',
            label : '是否必考',
            width : 100
          },
          {
            pro : 'lastUpdated',
            label : '更新时间',
            width : 150
          }
        ],
        // list参数
        listParam: {
          definedPage:{
            pageNum:1,
            pageSize:20,
          },
          // 'pageNum':1,
          // 'pageSize':20,
          classType: 'Q',
          classId: ''
        },
        inpageNum: 1,
        totlePage: 0
      }
    },
    created(){
        this.getQuestTableList()
    },
    methods:{
      // 1.获取table列表
      getQuestTableList () {
        this.$api.quesBankList(this.listParam).then(res => {
          this.visible = true;
          this.tableList = res.data.data.list
          this.totlePage = res.data.data.total
        }) 
      },
      // 搜索
      searchBtnClick () {
        this.inpageNum = 1
        this.listParam.definedPage.pageNum = 1
        this.getQuestTableList()
      },
      // 选中-搜索题库分类
      selected(item){
        // 1. 刷新table列表
        this.listParam.definedPage.pageNum = 1
        this.inpageNum = 1
        this.listParam.classId = item
        this.getQuestTableList()
      },
      // 是否必考
      changeStatus(row){
        this.$api.switchStatus({quesId: row.quesId,status: row.ifExam}).then(res => {
          this.$message.success('切换成功')
        })
      },
      SizeChange (val) {
        this.listParam.definedPage.pageSize = val.value;
        if(val.isLoad){
        this.getQuestTableList()
        }
      },
      CurrentChange (val) {
        this.listParam.definedPage.pageNum = val
        this.getQuestTableList()
      },
      // 编辑-新增
      addEdit (row) {
        // 1.要将此行的数据带到编辑页面
        // 编辑JSON.stringify(row)
        if(row === 'add'){
          sessionStorage.setItem('addName', 'add')
        }else{
          sessionStorage.setItem('addName', '')
        }
        sessionStorage.setItem('quesId', row.quesId)
        sessionStorage.setItem('classId', this.listParam.classId)
        this.$router.push({name : 'addEdit'});
      },
      // 删除
      addRomoveRow (row) {
        this.$confirm('确认删除题目，删除后该题目不可恢复。确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.quesBankDel({quesId: row.quesId}).then(res => {
            this.getQuestTableList()
          })
        }).catch(() => {
          this.$message({type: 'info',message: '已取消'});
        })
      },
      // 导入
      leadSubmit(obj){
        this.leadingFileVisible = false
        setTimeout(()=>{
          
          // 导出确定弹框
          this.$confirm('单选题：'+obj.singles+' 道，多选题：'+obj.mutils+' 道，判断题：'+obj.rightWrongs+' 道。', '上传成功', {
            confirmButtonText: '确定',
            showCancelButton: false,
            closeOnClickModal: true,
          }).then(() => {

            // 刷新table列表
            this.getQuestTableList()
          }).catch(() => {
            this.getQuestTableList()
          })
        },200);
           
      },
    },
    watch : {
      // 监控搜索
      searchUserName (val) {
        this.listParam.title = val
        if(val === ''){
          this.getQuestTableList()
        }
      },
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.contractList{
    display: flex;
    height: 100%;
    .classify{
        width: 300px;
        background: white;
        border-radius:2px;
        border: 1px solid $gray_f1;
        box-sizing: border-box;
        padding: 24px 26px;
    }
        .search{
            height: 30px;
        }
    .content{
        width: calc(100% - 320px); 
        height: 100%; 
        border: 1px solid $gray_f1;
        background: white;
        border-radius:2px;
        margin-left: 20px;
        overflow: hidden;
    }
    .hiddenSpan{
      width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      -webkit-text-overflow: ellipsis;
      -moz-text-overflow: ellipsis;
      white-space: nowrap;
    }
}
</style>
