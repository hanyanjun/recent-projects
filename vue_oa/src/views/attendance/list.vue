<template>
<div class="companyList companyCommon listWrapNoScroll attendanceWrap">
    <el-row class="head">
        <el-col :span="4"><p class="title">考勤汇总 </p></el-col>
        <el-col :span="20">
            <div class="search">
            <el-date-picker
            type="month"
            v-if="String(filter.yearAndMonth).length == 7"
            v-model="filter.yearAndMonth"
            value-format="yyyy-MM"
            format="yyyy-MM"
            :clearable="false"
            @change="changeMonth"
            placeholder="日期">
            </el-date-picker>
            <el-date-picker
            type="month"
            v-if="String(filter.yearAndMonth).length > 7"
            v-model="filter.yearAndMonth"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :clearable="false"
            @change="changeMonth"
            placeholder="日期">
            </el-date-picker>
            <el-cascader
                :options="orgTreeExtInfo"
                @change="changeDep"
                :clearable="true"
                placeholder="选择部门"
                change-on-select
                                v-model="filter.deptIds"
                                :props="{value : 'id' , label : 'text'}"></el-cascader>
                <span class="search_input"><search  v-model="empName" holder="请输入员工姓名" @search="searchName"></search> 
                </span>
                <button class="add all pointer" @click.stop="detailAll">手动汇总</button>
                <button class="add all pointer" @click.stop="rule">考勤规则</button>
                <button class="  add  pointer" @click.stop="exportData">导出</button>
            </div>
        </el-col>
    </el-row>
    <!-- 筛选结果 -->
     <!-- <div class="filterResult" v-if="filter.yearAndMonth || filter.deptId || filter.empName">
            筛选结果
            <span class="filterInfo" v-if="filter.yearAndMonth">
                <i class="circle"></i>
                时间:&nbsp;{{filter.yearAndMonth}}
                <i class="iconfont icon-del2 pointer" v-if="false"  @click.stop="clear(['yearAndMonth'])"></i>
            </span>
            <span class="filterInfo"  v-if="filter.deptId">
                <i class="circle"></i>
                部门:&nbsp;{{filter.depName}}
                <i class="iconfont icon-del2 pointer" @click.stop="clear(['deptId','deptIds', 'depName'])"></i>
            </span>
            <span class="filterInfo" v-if="filter.empName">
                <i class="circle"></i>
                姓名:&nbsp;{{filter.empName}}
                <i class="iconfont icon-del2 pointer" @click.stop="clear(['empName'])"></i>
            </span>
            <button class="clear pointer" v-show="filter.deptId || filter.empName" @click.stop="clear(['empName','deptId','deptIds','depName'])">清除筛选结果</button>
        </div> -->
    <div class="content">
            <el-table :data="list" :default-sort="defaultSort"  @sort-change="sort" height="200" class="tableContentScroll100" @selection-change="handleSelectionChange">
               <el-table-column
                type="selection"
                width="40">
              </el-table-column>
                  <el-table-column
                    :prop="item.pro"
                    :label="item.label"
                    width="70"
                     v-for="(item,index) in colums" :key="index" :class-name="'table-b-l b-nonebottom'"> 
                    <el-table-column
                        :prop="item1.pro"
                        :label="item1.label"
                        :width="item1.width" 
                        v-for="(item1,index1) in item.child" :key="index + '_' + index1" 
                        v-if="item.child" 
                        :sortable="(item1.pro  == 'empNum' || item1.pro  ==  'empName' || item1.pro  ==  'deptName') ? 'custom' : false" 
                        :class-name="item.child ? (index1 == 0 ? 'table-b-l' :  (index1 == item.child.length - 1 ? 'table-b-r' : '')   ) : ''">
                        <template slot-scope="scope">
                            <template v-if="item1.pro == 'empNum'">
                                        <span :class="['font', 'blue','pointer']" @click.stop="rowClick(scope.row)">
                                            {{scope.row[item1.pro]}}
                                        </span>
                            </template>   
                            <template v-else-if="item1.pro=='attendanceNeed'">
                              {{scope.row.attendanceNeedHour}}/{{scope.row.attendanceNeedDay}}
                            </template>
                            <template v-else-if="item1.pro=='attendanceFact'">
                              {{scope.row.attendanceFactHour}}/{{scope.row.attendanceFactDay}}
                            </template>
                            <template v-else-if="item1.pro=='attendanceLack'">
                              {{scope.row.lackHour}}/{{scope.row.lackDay}}
                            </template>
                            <template v-else>
                              
                                        <span class="font">
                                            {{ (!scope.row[item1.pro] && scope.row[item1.pro] !== 0)  ? '---' : scope.row[item1.pro]}}
                                        </span>
                            </template>
                        </template>



                    </el-table-column>
                  </el-table-column>
                  <empty slot="empty" :visible="visible">
                  </empty>
            </el-table>
    </div>
</div>
</template>

<script>
import search from "@/components/search";
import empty from "@/components/empty";
import pagination from "../../components/pagination";
export default {
  name: "attendanceList",
  data() {
    return {
      search: "", //搜索内容
      list: [],
      allInfo: { list: [] },
      empName: "",
      textMonth :　'',
      visible : false,
      selected : [],
      defaultSort : {
        order : 'ascending',
        prop : 'empNum'
      },
      filter: {
        deptId: "",
        deptIds: [],
        deptNameSort: "",
        empName: "",
        depName: "",
        month : '',
        empNumSort : '1',
        empNameSort: "",
        yearAndMonth: ""
      },
      colums: [
        {
          pro: "",
          label: "",
          child: [
            {
              pro: "empNum",
              label: "工号",
              width: "70"
            },
            {
              pro: "empName",
              label: "姓名",
              width: "70"
            },
            {
              pro: "deptName",
              label: "部门"
            }
          ]
        },

        {
          pro: "",
          label: "出勤时长(小时/天)",
          child: [
            {
              pro: "attendanceNeed",
              label: "应出勤",
            },
            {
              pro: "attendanceFact",
              label: "实际出勤",
            },
            {
              pro: "attendanceLack",
              label: "缺勤",
            },
            {
              pro: "notWorkday",
              label: "未在职缺勤",
            }
          ]
        },
        {
          pro: "",
          label: "迟到次数",
          child: [
            {
              pro: "lateLessThanHalf",
              label: "≤30分",
              width: "44"
            },
            {
              pro: "lateBetweenHalfAndOne",
              label: ">30分",
              width: "44"
            },
            {
              pro: "lateMoreThanOne",
              label: "≥60分",
              width: "44"
            },
          ]
        },
        {
          pro: "",
          label: "早退次数",
          child: [
            {
              pro: "earlyLessThanHalf",
              label: "≤30分",
              width: "44"
            },
            {
              pro: "earlyBetweenHalfAndOne",
              label: ">30分",
              width: "44"
            },
            {
              pro: "earlyMoreThanOne",
              label: "≥60分",
              width: "44"
            },
          ]
        },
        {
          pro: "",
          label: "打卡/次",
          child: [
            {
              pro: "notPunch",
              label: "未打卡",
              width: "60"
            },
            {
              pro: "patchPunch",
              label: "补打卡",
              width: "60"
            }
          ]
        },
        {
          pro: "",
          label: "",
          child: [
            {
              pro: "extraWorktime",
              label: "额外工时",
              width: "70"
            }
          ]
        },
        {
          pro: "",
          label: "旷工",
          child: [
            {
              pro: "absenteeismNum",
              label: "次数",
              width: "70"
            },
            {
              pro: "absenteeismTime",
              label: "累计时长",
              width: "70"
            }
          ]
        },
        {
          pro: "",
          label: "假/时",
          child: [
            {
              pro: "annualLeave",
              label: "年假",
              width: "50"
            },
            {
              pro: "changeLeave",
              label: "调休",
              width: "50"
            },
            {
              pro: "personLeave",
              label: "事假",
              width: "50"
            },
            {
              pro: "sickLeave",
              label: "病假",
              width: "50"
            },
            {
              pro: "otherLeave",
              label: "其他假",
              width: "50"
            },
            {
              pro: "workOvertime",
              label: "加班",
              width: "50"
            },
            {
              pro: "goOutTime",
              label: "外出",
              width: "50"
            },
            {
              pro: "businessTripTime",
              label: "出差",
              width: "50"
            }
          ]
        }
      ]
    };
  },
  watch:{
    empName : function(v){
      if(v == ''){
        this.filter.empName = '';
        this.init();
      }
    }
  },
  created() {
    this.$store.dispatch("getOrgTreeExtInfo");
    this.filter.yearAndMonth = this.$util.timestampToTime(global.NOWTIME).substring(0,7); 
  },
  components: { search, pagination,empty },
  computed: {
    rules() {
      return this.$store.state.company.baseInfoRules;
    },
    orgTreeExtInfo() {
      return this.$store.state.selectData.orgTreeExtInfo;
    },
    orgObj() {
      return this.$store.state.selectData.orgTreeExtInfoObj;
    }
  },
  methods: {
    init() {
      let base = Object.assign({},this.filter);
      let time = base.yearAndMonth.split('-');
      base.yearAndMonth = time[0]+'-'+time[1];
      this.$api.attendanceList(base).then(obj => {
        this.visible = true;
        this.allInfo.list = obj.data.data.attendLists;
        this.list = obj.data.data.attendLists;
        if(obj.data.data.attendLists.length != 0){
          this.filter.yearAndMonth = obj.data.data.remark.split("至")[1];
          this.textMonth = obj.data.data.remark;
        }else{
          this.filter.yearAndMonth = base.yearAndMonth;
          this.textMonth = base.yearAndMonth;
        }
      });
    },
    sort(c){
      let s = c.order == "ascending" ?  1 : 2;
      this.filter.deptNameSort = '';
      this.filter.empNameSort = '';
      this.filter.empNumSort = '';
      switch(c.prop){
        case "deptName":
        this.filter.deptNameSort = s;
        break;
        case "empName":
        this.filter.empNameSort = s;
        break;
        case "empNum":
        this.filter.empNumSort = s;
        break;
      }
      this.init();
    },
    detailAll(){
      let arr = [...this.selected];
      let empNums = [];
      if(arr.length != 0){
        // this.$message.error('请至少选择一位员工数据!');
        // return ;
        arr.forEach((v,i)=>{
          empNums.push(v.empNum);
        })
      }
      let time = this.filter.yearAndMonth.split('-');
      this.$api.attendanceListCount({empNums : empNums.join(',')  , yearAndMonth	 :  time[0]+'-'+time[1] }).then(obj=>{
        this.$message.success('手动汇总成功!');
        this.init();
      })
    },
    handleSelectionChange(item){
      this.selected = [...item];
    },
    changeMonth(value) {
      this.filter.yearAndMonth = value;
      this.init();
    },
    clear(arr) {
      arr.forEach(v => {
        this.filter[v] = "";
        if (v == "deptIds") {
          this.filter[v] = [];
          this[v] = [];
        } else {
          this.filter[v] = "";
          this[v] = "";
        }
      });
      this.selected = [];
      this.init();
    },
    changeDep(item) {
      let str = "";
      item.forEach(v => {
        str = str + this.orgObj[v].text + "/";
      });
      str = str.substring(0, str.length - 1);
      this.filter.depName = str;
      this.filter.deptId = item[item.length - 1];
      this.selected = [];
      this.init();
    },
    searchName() {
      this.filter.empName = this.empName;
      this.selected = [];
      this.init();
    },
    exportData(){
        if(this.list.length > 0){
        let base = Object.assign({},this.filter);
        if(base.deptIds.length > 0){
          base.deptIds = base.deptIds[base.deptIds.length - 1];
        }else{
          base.deptIds = '';
        };
        base.yearAndMonth = base.yearAndMonth.substring(0,7);
        this.$store.dispatch("downFile",{type : 'get', url :`/admin/attendance/exportAttendRecordList`, data: base, fileName : '考勤汇总.xlsx'});
        }else{
          this.$message.error('当前条件无数据!');
        }
    },
    rule(){
      this.$router.push({name : 'attendanceRule'})
    },
    rowClick(item){
      item.time = this.textMonth;
      item.recordTime = this.filter.yearAndMonth;
      window.sessionStorage['attendanceInfo'] = JSON.stringify(item);
      this.$router.push({name : 'attendanceInfo'});
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.companyList {
  background: rgba(249, 249, 249, 1);
  border: 1px solid #dcdfe6;
  .head {
    height: 60px;
    padding-right: 12px;
    .title {
      width: 96px;
      font-size: 16px;
      color: $gray_a2;
      margin-left: 26px;
      font-weight: bold;
      line-height: 60px;
    }
    .add {
      display: inline-block;
      width: 60px;
      height: 30px;
      background: rgba(31, 158, 251, 1);
      border-radius: 3px;
      font-size: 12px;
      color: rgba(255, 255, 255, 1);
    }
    .all {
      width: 80px;
      margin-right: 10px;
    }
  }
  .el-form-item {
    margin-top: 10px;
    text-align: right;
  }
  .el-form-item__content {
    width: auto;
  }
}
.content {
  background: white;
  height: calc(100% - 60px);
}
.dialog {
  .title {
    width: 100%;
    text-align: center;
    background: rgba(245, 247, 250, 1);
    border-radius: 2px;
    position: absolute;
    left: 0;
    top: 0;
    height: 50px;
    font-size: 16px;
    font-weight: bold;
    color: rgba(85, 85, 85, 1);
    line-height: 50px;
    .el-icon-close {
      position: absolute;
      font-size: 14px;
      top: 18px;
      right: 18px;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
.el-form-item__content {
  text-align: left;
}
.btns {
  text-align: center;
  button {
    display: inline-block;
    width: 150px;
    height: 36px;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .submit {
    background: rgba(16, 178, 255, 1);
    color: white;
  }
  .cancle {
    height: 36px;
    border: 1px solid $gray_d1;
    background: #f9f9f9;
    margin-left: 20px;
  }
}
.font {
  color: #63717f;
  font-size: 12px;
}
.blue {
  color: #3c73b1;
}
.search_input {
  width: 300px;
  height: 30px;
}
.companyCommon .el-cascader {
  width: 290px;
  margin-right: 20px;
}

.filterResult {
  padding-left: 26px;
  box-sizing: border-box;
  font-size: 12px;
  color: rgba(85, 85, 85, 1);
  background: $btn_bg;
  padding-bottom: 15px;
  .filterInfo {
    display: inline-block;
    padding: 0 50px 0 28px;
    height: 26px;
    background: rgba(255, 255, 255, 1);
    border-radius: 13px;
    border: 1px solid #c3cbd6;
    position: relative;
    line-height: 26px;
    margin-left: 10px;
    color: #63717f;
    .circle {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #c3cbd6;
      border-radius: 50%;
      position: absolute;
      left: 12px;
      top: 7px;
    }
    .iconfont {
      font-size: 20px;
      color: #c3cbd6;
      position: absolute;
      right: 10px;
      top: 5px;
      line-height: 15px;
      opacity: 1;
    }
  }
  .clear {
    font-size: 12px;
    color: rgba(60, 115, 177, 1);
    margin-left: 13px;
    background: $btn_bg;
  }
}
</style>
