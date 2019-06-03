<template lang="pug">
#timeRecord
  div.info
    el-row.infoDiv
      el-col(:span='12')
        span.spanLable 本年可用年假
        span.spanData {{info.validAnnual || '--'}}小时
        //- span.spanEdit(v-if='!myself',@click='changeAnnual')
        //-   i.iconfont.icon-bianji 
        //-   | 编辑
      el-col(:span='8')
        span.spanLable 本年已用年假
        span.spanData {{info.usedAnnual || '--'}}小时
        span.spanEdit(@click='seeUsedAnnual')
          i.iconfont.icon-sousuo
          | 查看
      el-col(v-if='myself',:span='4')
        span 司龄(年)                     
        span.spanData &nbsp;&nbsp;&nbsp;{{info.inCompYears || '--'}}
    el-row.infoDiv
      el-col(:span='12')
        span.spanLable 可用调休
        span.spanData {{info.validRest || '--'}}小时
        span.spanEdit(@click='seeValidRest')
          i.iconfont.icon-sousuo 
          | 查看
      el-col(:span='8')
        span.spanLable 已用调休
        span.spanData {{info.usedRest || '--'}}小时
        span.spanEdit(@click='seeUsedRest')
          i.iconfont.icon-sousuo
          | 查看
    el-row.infoDiv
      el-col(:span='24')
        span.spanLable 考勤设备
        span.spanData.padRight12(v-for='(item,key) in info.list') {{item.deviceRemark}}({{item.deviceNo}})
        span.spanEdit(v-if='!myself',@click='editDevice')
          i.iconfont.icon-bianji 
          | 编辑
  //- div.listWrapNoScroll.companyCommon(v-if="!is_personal")
  div.listWrapNoScroll.companyCommon
    div.topTitlediv
      el-row
        div.tableTitleRight
          el-date-picker.width150(v-model="listParam.recordDate", :disabled="is_personal"  @change='getList',type="month",:clearable='false',size='medium',placeholder="请选择",format='yyyy年MM',value-format='yyyy-MM')
          | 打卡记录
    div.tableContent
      el-table.tableContentScroll100(:data='tableList', height='200')
        el-table-column(label='序号',type='index', width='80')
        el-table-column(v-for='(column, key) in colums',:width='column.width', :sortable="column.pro  == 'testRank' || column.pro  ==  'testScore' ", :prop='column.pro', :label='column.label', :key='column.pro')
          template(slot-scope='scope')
            template(v-if="column.pro == 'list'")
              template(v-if='scope.row.list.length > 0')
                span(v-for="(item,index) in scope.row['list']")
                  span.font.fontBlue.pointer(@click.stop="skipForm(item)")
                    | {{item.approveNum}}<br>
              template(v-else='')
                | ---
            template(v-else='')
              | {{scope.row[column.pro] || '---'}}
        empty(slot="empty",:visible='visible')      
      //- 分页
      //- pagination(@size-change='SizeChange', @current-change='CurrentChange',background, :sizes='[10, 20, 30, 40]', :size='10', layout='total, sizes, prev, pager, next, jumper', :total='totlePage')
  timeDialog(:dialogShow='dialogShow',:dialogCode = 'dialogCode',@dialogShowFalse='dialogShowFalse',:deviceSn='deviceSn',:is_personal="is_personal")
</template>
<script>
import "../../commons/publicCss/outside.sass";
import pagination from "../../components/pagination";
// 编辑查看基本信息弹出框
import timeDialog from "./timeDialog";
import empty from "@/components/empty";
import moment from "moment";
export default {
  name: "",
  components: { pagination, timeDialog,empty },
  data() {
    return {
      visible: false,
      userId: "",
      myself: false,
      info: {
        list: []
      },
      tableList: [
        {
          empNo: "",
          list : []
        }
      ],
      colums: [
        {
          pro: "recordDate",
          label: "日期"
        },
        {
          pro: "onBaseTime",
          label: "上班时间"
        },
        {
          pro: "onPunchTime",
          label: "上班打卡时间",
          width : '130'
        },
        {
          pro: "offBaseTime",
          label: "下班时间"
        },
        {
          pro: "offPunchTime",
          label: "下班打卡时间",
          width : '130'
        },
        {
          pro: "standardWorking",
          label: "标准工时"
        },
        {
          pro: "factWorking",
          label: "实际工时"
        },
        {
          pro: "onLate",
          label: "迟到"
        },
        {
          pro: "offEarly",
          label: "早退"
        },
        {
          pro: "isAbsenteeism",
          label: "旷工"
        },
        {
          pro: "list",
          label: "审批单号",
          width : '130'
        },
      ],
      listParam: {
        pageNum: 1,
        pageSize: 10,
        recordDate: ""
      },
      totlePage: 0,
      deviceArr: [],
      // 年假弹出框
      dialogShow: false,
      dialogCode: "",
      validAnnual: "",
      deviceSn:[]
    };
  },
  props : {
    // 1 是个人中心 0是员工编辑
    type : {
      type : String,
      default : ''
    },
    is_personal : {
      type : Boolean,
      default : false
    }
  },
  created() {
    this.userId = localStorage.getItem("editUserId");
    this.myself = localStorage.getItem("myself");
    if (this.myself == "myself") {
      this.myself = true;
    } else {
      this.myself = false;
    }
    if(this.type == '0'){
      this.listParam.empNo = window.localStorage.getItem("empNo");
    }
    // 当前日期
    this.listParam.recordDate = this.$util.timestampToTime(global.NOWTIME).substring(0,7)
    // 1.加载考勤基本信息
    this.getInfo();
    // 2.加载打卡记录列表
    this.getList();
  },
  methods: {
    // 基本信息
    getInfo() {
      if(this.type == '1'){  
        this.$api.getAnnualBaseInfoSelf().then(res => {
          this.info = res.data.data;
        });
      }else{  
         this.$api.getAnnualBaseInfo({ userId: this.userId }).then(res => {
            this.info = res.data.data;
          });
      }
    },
    // 跳转至表单页面
    skipForm(row){ 
      if(row.prcessStatus === "0"){//审批中
        window.sessionStorage['applyState'] = 3 //催办，撤销按钮显示
      }else if(row.prcessStatus === "2" || row.prcessStatus === '3'){ //已撤销，退回
         window.sessionStorage['applyState'] = 0 //提交按钮显示
      }else{
         window.sessionStorage['applyState'] = 2 //查看表单
      }
      let base =  Object.assign({},row);
      base.formNo = row.approveNum;
      base.relationFormCode = row.approveType;
      window.sessionStorage['apply'] = JSON.stringify(base);
      this.$router.push({name : 'approval'+row.approveType})
    },
    // 列表
    getList() {
      if(this.type == '1'){
        // 先把打卡记录模块注释掉
        // this.$api.personalRecordLogSelf(this.listParam).then(res => {
        //   this.tableList = res.data.data;
        //   this.visible = true
        // });
      }else{
        this.$api.personalRecordLog(this.listParam).then(res => {
          this.tableList = res.data.data;
          this.visible = true
        });
      }
    },
    // 分页
    SizeChange(val) {
      this.listParam.pageSize = val.value;
      if (val.isLoad) {
        this.getList();
      }
    },
    CurrentChange(val) {
      this.listParam.pageNum = val;
      this.getList();
    },
    // 编辑年假
    changeAnnual() {
      this.dialogShow = true;
      this.dialogCode = "1";
      // this.validAnnual = this.info.validAnnual;
    },
    // 编辑设备
    editDevice() {
      this.dialogShow = true;
      this.dialogCode = "2";
      this.deviceSn = this.info.list;
    },
    // 查看年假请假记录
    seeUsedAnnual() {
      this.dialogShow = true;
      this.dialogCode = "3";
    },
    // 查看调休记录
    seeUsedRest() {
      this.dialogShow = true;
      this.dialogCode = "4";
    },
    // 查看加班记录
    seeValidRest() {
      this.dialogShow = true;
      this.dialogCode = "5";
    },
    dialogShowFalse(val) {
      if (val.do === "close") {
        this.dialogShow = false;
      } else if (val.do === "change") {
        // 加载考勤设备
        this.getInfo();
      } else {
        this.info.validAnnual = val;
      }
    },
    // 更新可用年假数据
    editValidAnnual(val) {
      this.info.validAnnual = val;
    }
  }
};
</script>
<style lang="sass"  scoped>
#timeRecord
  margin: 20px 0px 20px 10px
  .listWrapNoScroll
    background: #f9f9f9
    border: 1px solid #dcdfe6 !important
    height: calc(100vh - 425px)
    -moz-box-shadow: 0 0 10px #d9d9d9
    -webkit-box-shadow: 0 0 10px #d9d9d9
    box-shadow: 0 0 10px #d9d9d9
    
  .info
    height: 140px
    background: rgba(255,255,255,1)
    border-radius: 2px
    box-shadow: 0 0 10px #d9d9d9
    margin-bottom: 20px
    padding: 40px
    border: 1px solid #dcdfe6
    .infoDiv
      margin-bottom: 40px
      font-size: 14px !important
      .spanLable
        width: 100px
        display: inline-block
      .spanData
        color: #666666
      .spanEdit
        color: #C1C5CD
        cursor: pointer 
        .iconfont
          font-size: 16px !important
          padding: 0 6px 0 20px
  .width150
    width: 160px
    margin-right: 10px
    cursor: pointer
  
  .fontBlue 
    display: inline-block
    color: #3c73b1;
    line-height: 18px

</style>
