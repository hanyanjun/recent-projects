<template lang='pug'>
.contractList
  .classify.listWrapNoScroll
    .conClassWrap.companyCommon
      .head
        span.title 部门
      .search
        search(v-model='searchT', @search='searchB',maxlength="20", holder='请输入员工姓名或部门')
      .treeContent
        conTree(:treeData='treeData',:namePro='namePro',@selected='selected')
  .content
    .companyList.listWrapNoScroll.companyCommon
      div.topTitlediv
        div.tableTitleRight  打卡记录
        div.tableTitleLeft
          el-date-picker.width290.marRight12(v-model='datePicker',clearable, type='daterange', align='right', unlink-panels='',value-format="yyyy-MM-dd", range-separator='至', start-placeholder='请选择时间', end-placeholder='请选择时间',size='small')
          el-select.width290(v-model='attendDevice',size='small',placeholder='请选择考勤设备',clearable)
            el-option(v-for='item in deviceArr', :value='item.deviceNo', :label='item.deviceRemark', :key='item.deviceNo') {{item.deviceRemark}}  
        
          //- el-button.clearBtn(size='small',@click='clearContent',type='primary')  清空
        div(style="clear:both")
      div.tableContent
        el-table.tableContentScroll(:data='tableList', height='200')
          el-table-column(v-for='(column, key) in colums',:width='column.width', :sortable="column.pro  == 'conNo' || column.pro  ==  'signDate' || column.pro  == 'ourSignBody' ||  column.pro  =='counterPart'", :prop='column.pro', :label='column.label', :key='column.pro')
            template(slot-scope='scope')
              template(v-if="column.pro === 'attendDate'")
                | {{scope.row.attendDate}}&nbsp;&nbsp;{{scope.row.dayOfTheWeek}}
              template(v-else='')
                | {{scope.row[column.pro] || '---'}}
          empty(slot="empty",:visible='visible')      
        //- 分页
        pagination(@size-change='SizeChange', @current-change='CurrentChange',background, :sizes='[10, 20, 30, 40]',:size='20',:current.sync="inpageNum", layout='total, sizes, prev, pager, next, jumper', :total='totlePage')
</template>

<script>
import "../../commons/publicCss/outside.sass"
import search from "../../components/search"
import conTree from "../../components/treeTable/vue/conTree"
import pagination from "../../components/pagination"
import empty from "@/components/empty";
import utils from "@/components/treeTable/utils/index.js"
export default {
    name : "questionManage",
    components:{pagination,search,conTree,empty},
    data () {
      return{
        // 左边tree
        namePro: 'text',
        searchT : '',
        tableList:[],
        colums:[
          {
            pro : 'attendDate',
            label : '日期',
            width : 160
          },
          {
            pro : 'attendUId',
            label : '考勤编号',
            // width : 160
          },
          {
            pro : 'userName',
            label : '姓名',
            // width : 120
          },
          {
            pro : 'attendType',
            label : '打卡方式',
            // width : 120
          },
          {
            pro : 'attendTime',
            label : '打卡时间',
            width : 200
          },
          {
            pro : 'deviceRemark',
            label : '打卡设备名称',
            // width : 150
          },
        ],
        // list参数
        listParam: {
          pageNum:1,
          pageSize:20,
        },
        totlePage: 0,
        inpageNum: 1,
        // 搜索框
        datePicker:[],
        DateValue:[],
        deviceArr:[],
        attendDevice:'',
        clear: true,
        visible: false
      }
    },
    computed:{
      treeData(){
        let treeData = this.$store.state.selectData.attendPersonTree.list
        treeData =  utils.MSDataTransfer.treeToArray(treeData, null, null, true)
        return treeData
      }
    },
    watch: {
      attendDevice(val){
        this.listParam.attendDevice = val
        this.listParam.pageNum = 1
        this.inpageNum = 1
        if(this.clear){
          this.getList()
        }
      },
      datePicker(val){
        if(val){
          this.listParam.pageNum = 1
          this.inpageNum = 1
          this.listParam.recordStartTime = val[0]
          this.listParam.recordEndTime = val[1]
        }else{
          this.listParam.pageNum = 1
          this.inpageNum = 1
          this.listParam.recordStartTime = ''
          this.listParam.recordEndTime = ''
        }
        if(this.clear){
          this.getList()
        }
      }
    },
    created(){
        // 1.加载组织架构
        this.$store.dispatch('getAttendPersonTree')
        // 2.加载设备列表
        this.$api.getAvailableDevice().then(res=>{
          this.deviceArr = res.data.data
        })
        // 3.加载table
        this.getList()
        // 3.加载当前日期
        this.$util.getNowDate(this.DateValue)
        this.datePicker[0] = this.DateValue[0]
        this.datePicker[1] = this.DateValue[1]
        this.listParam.recordStartTime = this.DateValue[0]
        this.listParam.recordEndTime = this.DateValue[1]
    },
    methods:{
      // 1.获取table列表
      getList () {
        this.$api.getClockInList(this.listParam).then(res => {
          this.tableList = res.data.data.list
          this.totlePage = res.data.data.total
          this.clear = true
          if(this.tableList.length == 0){
            this.visible = true
          }
        }) 
      },
      // 选中部门后重新加载table
      selectedTab(item){
        this.listParam.deptId = ''
        this.listParam.userId = ''
        if(item.id != undefined){
          this.listParam.deptId = item.id
        }else{
          let val=item.treeId.split('_')
          this.listParam.userId = val[1]
        }
        // 1. 刷新table列表
        this.listParam.pageNum = 1
        this.inpageNum = 1
        this.getList()
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
      // 从输入框中搜索后加载table
      searchB(){
        if(this.searchT.trim()){
          let isRex = false;
          this.treeData.forEach((v)=>{
            let newExp = new RegExp(this.searchT);
            if(newExp.test(v.text) && !isRex){
              v._search = true;
              v._isBtn = false;
              if(v.parentId){
                  v._parent._expanded = true;
                  v._parent._show = true;
              }
              this.selectedTab(v)
              isRex = true;
              return v;
            }else{
              v._search = false;
              v._isBtn = false;
              v._selected = false;
              // this.$message.error('未找到该内容!');
              return v;
            }
          })
        }else{
          this.$message.error('请输入内容!');
        }
      },
      // 点击选中状态后加载table
      selected(index){
        this.treeData.forEach((v,i)=>{
          if(i == index){
            v._selected = true;
            v._isBtn = false;
            if(v._level != 0){
                v._parent._expanded = true;
                v._parent._show = true;
            }
            this.selectedTab(v)
            return v;
          }else{
            v._selected = false;
            v._isBtn = false;
            v._search = false;
            return v;
          }
        })
      },
      clearContent(){
        this.listParam.pageNum = 1
        this.listParam.pageSize = 20
        this.clear = false
        this.datePicker = []
        this.listParam.recordStartTime = ''
        this.listParam.recordEndTime = ''
        this.attendDevice = ''
        this.listParam.userId = ''
        this.listParam.deptId = ''
        this.searchT = ''
        this.treeData.forEach((v,i)=>{
          v._selected = false
        })
        this.getList()
      }
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
      height: 30px;
      top: 2px
    }
    .clearBtn{
      margin-left: 12px
    }
}
</style>
