<template lang='pug'>
.contractList
  //- .content
  .companyList.listWrapNoScroll.companyCommon.borderScroll
    div.topTitlediv
      div.tableTitleRight  考勤校对日志
      div.tableTitleLeft
        //- el-date-picker.width290.marRight12(v-model='datePicker',clearable, type='daterange', align='right', unlink-panels='',value-format="yyyy-MM-dd", range-separator='至', start-placeholder='请选择时间', end-placeholder='请选择时间',size='small')
        el-date-picker.width290.marRight12(v-model='queryDate',size='small', type='date',value-format="yyyy-MM-dd",format="yyyy-MM-dd",placeholder='请选择日期')
        el-select.width290(v-model='errorType',size='small',placeholder='请选择是否异常',clearable)
          el-option(v-for='item in deviceArr', :value='item.key', :label='item.name', :key='item.key') {{item.name}}  
      div(style="clear:both")
    div.tableContent
      el-table.tableContentScroll(:data='tableList', height='200')
        el-table-column(label='序号', type="index")
        el-table-column(v-for='(column, key) in colums',:width='column.width', :sortable="column.pro  == 'conNo' || column.pro  ==  'signDate' || column.pro  == 'ourSignBody' ||  column.pro  =='counterPart'", :prop='column.pro', :label='column.label', :key='column.pro')
          template(slot-scope='scope')
            | {{scope.row[column.pro] || '---'}}
        empty(slot="empty",:visible='visible')      
      //- 分页
      pagination(@size-change='SizeChange', @current-change='CurrentChange',background, :sizes='[10, 20, 30, 40]',:size='20',:current.sync="inpageNum", layout='total, sizes, prev, pager, next, jumper', :total='totlePage')
</template>

<script>
import "../../commons/publicCss/outside.sass"
import pagination from "../../components/pagination"
import empty from "@/components/empty"
export default {
    name : "timeLogList",
    components:{pagination,empty},
    data () {
      return{
        // 左边tree
        tableList:[],
        colums:[
          {
            pro : 'logDate',
            label : '考勤日期',
            width : 150
          },
          {
            pro : 'errorType',
            label : '是否异常',
            width : 200
          },
          {
            pro : 'attendId',
            label : '记录id',
            // width : 200
          },
        ],
        // list参数
        listParam: {
          pageNum:1,
          pageSize:20,
          queryDate:''
        },
        totlePage: 0,
        inpageNum: 1,
        // 搜索框
        queryDate:'',
        deviceArr:[
          {
            key: 0,
            name: '正常'
          },
          {
            key: 1,
            name: '异常'
          }
        ],
        errorType:'',
        clear: true,
        visible: false
      }
    },
    watch: {
      errorType(val){
        this.listParam.errorType = val
        this.listParam.pageNum = 1
        this.inpageNum = 1
        if(this.clear){
          this.getList()
        }
      },
      queryDate(val){
        this.listParam.pageNum = 1
        this.inpageNum = 1
        this.listParam.queryDate = val
        if(this.clear){
          this.getList()
        }
      }
    },
    created(){
        // 1.加载table
        this.getList()
        // 2.加载当前日期
    },
    methods:{
      // 1.获取table列表
      getList () {
        this.$api.attendCheckLog(this.listParam).then(res => {
          this.tableList = res.data.data.list
          console.log(this.tableList)
          if(res.data.data.list.length === 0){
            this.visible = true
          }
          this.totlePage = res.data.data.total
          this.clear = true
        }) 
      },
      SizeChange (val) {
        this.listParam.pageSize = val.value;
        if(val.isLoad){
        this.getList()
        }
      },
      CurrentChange (val) {
        this.listParam.pageNum = val
        this.getList()
      },
    },
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.contractList{
    display: flex;
    height: 100%;
    .conClassWrap{
      height: 100%;
    }
    .treeContent{
      width: 100%;
      height: calc(100% - 100px);
      margin-top: 25px;
    }

    .head{
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 21px;
    }
    .title{
      font-size:16px;
      color:$gray_a2;
      font-weight: bold;
      line-height: 1;
    }
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
    .marRight12{
      margin-right: 12px;
      // height: 30px;
      // top: 2px
    }
    .clearBtn{
      margin-left: 12px
    }
}
</style>
