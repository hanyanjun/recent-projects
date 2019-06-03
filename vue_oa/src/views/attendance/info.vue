<template>
 <div class="attendanceInfowrap ">
     <H6 class="title">考勤详情<span>统计时间：{{info.time}}</span></H6>
     <div class="allInfo">
         <h6 class="tableT">考勤汇总</h6>
            <el-table :data="list">
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
                        :sortable="item1.pro  == 'empNum' || item1.pro  ==  'empName' || item1.pro  ==  'deptName'" 
                        :class-name="item.child ? (index1 == 0 ? 'table-b-l' :  (index1 == item.child.length - 1 ? 'table-b-r' : '')   ) : ''">
                        <template slot-scope="scope">
                            <template v-if="item1.pro == 'empNum'">
                                        <span :class="['font']">
                        {{scope.row[item1.pro] == '' ? '---' : scope.row[item1.pro]}}
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
            </el-table>
     </div>
     <div class="infoList">
         <h6 class="tableT1">打卡记录</h6>
            <el-table :data="list1" >
                  <el-table-column
                    :prop="item.pro"
                    :label="item.label"
                    :width="item.width"
                     v-for="(item,index) in colums1" :key="index" :class-name="'table-b-l b-nonebottom'"> 
                     <template slot-scope="scope">
                       <template v-if="item.pro == 'list'">
                          <template v-if="scope.row[item.pro].length > 0">
                            <span v-for="(item,index) in scope.row['list']" :key="index">
                              <span @click.stop="skipForm(item)"  :class="['font', 'fontBlue','pointer']">
                                {{item.approveNum}}<br>
                              </span>
                            </span>
                          </template>
                          <template v-else>
                            ---
                          </template>  
                        </template>
                        <template v-else>
                        {{scope.row[item.pro] == '' ? '---' : scope.row[item.pro]}}
                        </template> 
                        </template>  
                  </el-table-column>
                  <empty slot="empty" :visible="visible">
                  </empty>
            </el-table>
     </div>
     
 </div>   
</template>

<script>

import empty from "@/components/empty";
export default {
  name: "attendanceInfo",
  components:{empty},
  data() {
    return {
      list: [],
      list1: [],
      info : {},
      visible : false,
      colums1: [
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
  created() {
    let info = window.sessionStorage["attendanceInfo"];
    if (info) {
      info = JSON.parse(info);
      this.list = [info];
      this.info = info;
      this.$api
        .personalRecordLog({ empNo: info.empNum, recordDate: info.recordTime.substring(0,7)})
        .then(obj => {
          this.visible = true;
          this.list1 = obj.data.data;
        });
    }
  },
  methods:{
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
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.attendanceInfowrap {
  .title {
    padding-left: 28px;
    color: #000;
    font-size: 16px;
    line-height: 1;
    margin-bottom: 20px;
    span {
      margin-left: 28px;
      color: #63717f;
      font-weight: normal;
      font-size: 12px;
    }
  }
  .allInfo {
    background: rgba(249, 249, 249, 1);
    border-radius: 2px;
    border: 1px solid #ebeef5;
    box-shadow: 0px 3px 5px 0px rgba(221, 221, 221, 1);
    .tableT {
      height: 60px;
      line-height: 60px;
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold;
      font-weight: bold;
      color: rgba(85, 85, 85, 1);
      border-radius: 2px 2px 0px 0px;
      padding-left: 26px;
    }
  }
  .infoList {
    background: rgba(245, 247, 250, 1);
    border-radius: 2px;
    border: 1px solid #ebeef5;
    box-shadow: 0px 3px 5px 0px rgba(221, 221, 221, 1);
    margin-top: 30px;
    .tableT1 {
      height: 44px;
      line-height: 44px;
      color: $gray_b;
      font-size: 14px;
      padding-left: 26px;
      font-weight: normal;
      background: rgba(245, 247, 250, 1);
      border-radius: 2px 2px 0px 0px;
    }
  }
  .fontBlue {
    color: #3c73b1;
  }
}
</style>
