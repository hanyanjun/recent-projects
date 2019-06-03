<template>
 <div class="attendanceRuleWrap ">
     <infoHead title="考勤规则" @back="back">
     </infoHead>
     <div class="ruleContent">
            <el-form  label-position="left"  :model="form" ref="form" :rules="rules"   size="medium"  label-width="110px">
                <el-form-item label="每天" size="medium" prop="day"  width="200px" >
                    <el-input   v-model.trim="baseInfo.attendBaseTime"  :disabled="true"  :style="{width : '200px'}"></el-input><span class="tip">开始当天考勤</span>
                </el-form-item>
                <el-form-item label="考勤时间" size="medium" class="noBottom">
                    <div class="companyList">
                    <el-table  :data="list" >
                        <el-table-column 
                        :prop="item.pro"
                        :label="item.label"
                    width="300"
                        v-for="(item,index) in  colums" 
                        :key="index">
                        <template slot-scope="scope">
                            <template v-if="scope.row.baseTime.type == 'time' && item.pro == 'baseTime'"  >
                                <span class="time">{{scope.row.baseTime.text}}</span>
                                <el-time-picker
                                    v-model="scope.row.baseTime.value"
                                    format="HH:mm"
                                    @change="setTime"
                                value-format="HH:mm"
                                    placeholder="时间">
                                </el-time-picker>
                            </template>
                            <template v-else-if="scope.row.endTime.type == 'timeRang' && item.pro == 'endTime'">
                                <el-time-select
                                  class="timePicker"
                                  placeholder="起始时间"
                                  @change="setStart"
                                  v-model="baseInfo.restStartTime"
                                  :picker-options="{
                                    start: '00:00',
                                    step: '00:30',
                                    end: '24:00'
                                  }"></el-time-select>至<el-time-select
                                  placeholder="结束时间"
                                  class="timePicker"
                                  @change="setEnd"
                                  v-model="baseInfo.restEndTime"
                                  :picker-options="{
                                    start: '00:00',
                                    step: '00:30',
                                    end: '24:00'
                                  }"></el-time-select>
                            </template>
                            <template v-else>
                                <span class="timeAll">共计{{baseInfo.restHours}}小时</span>
                            </template>
                        </template>
                        </el-table-column>
                    </el-table>
                    </div>
                </el-form-item>
                <el-form-item prop="time" >
                  <el-input v-model="form.time" v-show="false"></el-input>
                </el-form-item>
                <el-form-item   label="工作日设置" size="medium" class="noBottom">
                    <div class="daySet">
                        <div class="checkboxs">
                        <el-checkbox-group v-model="baseInfo.workdayWeeks">
                            <el-checkbox :label="item.code"  v-for="(item,index) in days.list" :key="index">{{item.name}}</el-checkbox>
                        </el-checkbox-group>
                        </div>
                        <div class="model model1">
                            <h6 class="title">排除日期 <span class="title_tip">（不用打卡的日期，如法定节假日等） </span></h6>
                            <el-date-picker
                                v-model="excludeDays"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                            <span class="add pointer"  @click.stop="addTime1"><i class="iconfont icon-add"></i> 添加</span>
                            <div class="selectedList" v-if="baseInfo.excludeDays.length > 0">
                                <span class="selectItem" v-for="(item,index) in baseInfo.excludeDays" :key="index">{{types[index]}}: &nbsp;{{item}} <i class="iconfont icon-del pointer"  @click.stop="deleTime(index,'excludeDays')"></i></span>
                            </div>
                        </div>
                        <div class="model">
                            <h6 class="title">增加日期 <span class="title_tip">（必须打卡的日期，如补班日等） </span></h6>
                            <el-date-picker
                                v-model="addingDays"
                                type="daterange"
                                range-separator="至"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                            <span class="add pointer"  @click.stop="addTime('addingDays')"><i class="iconfont icon-add"></i> 添加</span>
                            <div class="selectedList" v-if="baseInfo.addingDays.length > 0">
                                <span class="selectItem" v-for="(item,index) in baseInfo.addingDays" :key="index">{{item}} <i class="iconfont icon-del pointer" @click.stop="deleTime(index,'addingDays')"></i></span>
                            </div>
                        </div>
                    </div>
                </el-form-item> 
                <el-form-item prop="set" >
                  <el-input v-model="form.set" v-show="false"></el-input>
                </el-form-item>
            </el-form>

        <el-button type="primary" class="store" @click.stop="submit('form')">保存</el-button>

     </div>
     <div class="companyCommon">
      <reDialog 
          :visible.sync="diaShow" 
          title="类别"
          @close="close"
          @submit="addType">
          <template slot="body">
              <el-form :model="baseType" ref="typeForm" :rules="rules1" class="form dialogForm"  size="medium"  label-width="110px">
                  <el-form-item class="dialogForm" label="日期类别" size="medium" prop="type">
                      <el-input   v-model.trim="baseType.type" placeholder="请输入日期类别"></el-input>
                  </el-form-item>
              </el-form>
          </template>
      </reDialog>
     </div>
</div>   
</template>

<script>
import infoHead from "../../components/infoHead";
import reDialog from "../../components/reDialog";
import validate from "../../util/validate.js";
export default {
  name: "attendanceRule",
  components: { infoHead , reDialog},
  data() {
    var validateTime = (rule, value, callback) => {
      if (!this.baseInfo.onBaseTime) {
        callback(new Error("请选择上班打卡时间"));
      }else if(!this.baseInfo.offBaseTime) {
        callback(new Error("请选择下班打卡时间"));
      }else if(!this.baseInfo.restStartTime){
        callback(new Error("请选择休息开始时间"));
      }else if(!this.baseInfo.restEndTime){
        callback(new Error("请选择休息结束时间"));
      }else if(this.baseInfo.onBaseTime > this.baseInfo.offBaseTime){
        callback(new Error("打卡结束日期必须大于开始日期"));
      }else if(this.baseInfo.restStartTime > this.baseInfo.restEndTime){
        callback(new Error("休息结束日期必须大于开始日期"));
      }else {
        let t1 = this.baseInfo.restStartTime.split(':');
        let t2 = this.baseInfo.restEndTime.split(':');
        let num = 0;
        if(Number(t2[1]) - Number(t1[1])   > 0 ){
          num = 0.5
        }
        if(Number(t2[1]) - Number(t1[1])   < 0 ){
          num = -0.5
        }
        
        let str = Number(t2[0] - Number(t1[0]))  + num;
        this.baseInfo.restHours = str;
        callback();
      }
    };
    var validateSet = (rule, value, callback) => {
      if ( this.baseInfo.workdayWeeks.length == 0
      ) {
        callback(new Error("请勾选工作日"));
      } else {
        callback();
      }
    };
    return {
      baseInfo: {
        workdayWeeks: [], //每周工作日设置
        excludeDays: [], //排除工作日
        addingDays: [], //添加工作日
        onBaseTime: "", //上班时间
        offBaseTime: "", //下班时间
        restEndTime: "", //休息结束时间
        restStartTime: "", //休息开始时间
        restHours: "", // 休息时长
        attendBaseTime : '',
        id : ''
      },
      diaShow : false,
      form: {
        set: "",
        time: "",
        day: ""
      },
      resetTime : [],
      excludeDays: "",
      addingDays: "",
      rules: {
        time: [
          { validator: validateTime, trigger: "blur" }
          ],
        set: [
          { validator: validateSet, trigger: "blur" }
          ]
      },
      rules1 : {
        type : [
                { required: true, message: '请填写类别', trigger: 'blur' },
                { validator: validate.validateCharacter, trigger: "blur" }
        ]
      },
      types : [],
      baseType : {
        type : ""
      },
      list: [
        {
          baseTime: { text: "上班打卡", value: "", type: "time" },
          endTime: { value: [], text: "", type: "timeRang" }
        },
        {
          baseTime: { text: "下班打卡", value: "", type: "time" },
          endTime: { value: "", text: "共计0小时" }
        }
      ],
      colums: [
        { pro: "baseTime", label: "打卡时间" },
        { pro: "endTime", label: "休息时间" }
      ]
    };
  },
  computed: {
    days() {
      return this.$store.state.selectData.days;
    }
  },
  created(){
    this.$api.getAnnualRule().then(obj=>{
      let data = obj.data.data;
      if(data.addingDays){
        this.baseInfo.addingDays = data.addingDays.split(',');
      }
      if(data.excludeDays){
        let arr = data.excludeDays.split(',');
        let arr1 = [];
        let arr2 = [];
        arr.forEach((v,i)=>{
          let a = v.split(":");
          arr1.push(a[0]);
          arr2.push(a[1]);
        })
        this.baseInfo.excludeDays = [...arr2];
        this.types = [...arr1];
      }
      if(data.workdayWeeks){
        this.baseInfo.workdayWeeks = data.workdayWeeks.split(',');
      }
      this.baseInfo.offBaseTime = data.offBaseTime;
      this.baseInfo.id = data.id;
      this.baseInfo.attendBaseTime = data.attendBaseTime;
      this.baseInfo.onBaseTime = data.onBaseTime;
      this.baseInfo.restHours = data.restHours;
      this.list[0].baseTime.value = data.onBaseTime;
      this.list[1].baseTime.value = data.offBaseTime;
      this.baseInfo.restStartTime = data.restStartTime || '00:00';
      this.baseInfo.restEndTime = data.restEndTime || '00:00';
    })
  },
  methods: {
    back() {
      this.$router.routeBack("", 1);
    },
    addTime(item) {
      if (this[item]) {
        let arr = this[item];
        let str = "";
        if (arr[0] == arr[1]) {
          str = arr[0];
        } else {
          str = arr[0] + "至" + arr[1];
        }
        this.baseInfo[item].push(str);
        this[item] = "";
      } else {
        this.$message.error("请选择日期");
      }
    },
    addTime1(){
      if(this.excludeDays.length > 0){
      this.diaShow = true;
      }else{
        this.$message.error('清选择日期!');
      }
    },
    setStart(time){
      this.clearForm(['time']);
      this.$refs['form'].validateField(['time']);
    },
    setEnd(time){
      this.clearForm(['time']);
      this.$refs['form'].validateField(['time']);
    },
    setTime(time){
      this.baseInfo.onBaseTime = this.list[0].baseTime.value;
      this.baseInfo.offBaseTime = this.list[1].baseTime.value;
      this.clearForm(['time']);
      this.$refs['form'].validateField(['time']);
    },
    clearForm(arr){
        this.$refs['form'].clearValidate(arr)
    },
    deleTime(index, type) {
      if(type == 'excludeDays'){
        this.types.splice(index, 1);
      }
      this.baseInfo[type].splice(index, 1);
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
          if(valid){
            let base = Object.assign({},this.baseInfo);
              base.workdayWeeks.sort();
              base.workdayWeeks = base.workdayWeeks.join(',');
              let arr = [...base.excludeDays];
              arr.forEach((v,i)=>{
                arr[i] = this.types[i] + ':' + v;
              })
              base.excludeDays = arr.join(',');
              base.addingDays = base.addingDays.join(',');
              this.$api.updateAnnualRule(base).then(obj=>{
                this.$message.success('更新成功!');
              })
          }
      });
    },
    clearTypeForm(){
      this.$nextTick(()=>{
      this.baseType.type = '';
      this.$refs['typeForm'].clearValidate();
      })

    },
    close(){
      this.diaShow = false;
      this.clearTypeForm();
    },
    addType(){
      this.$refs['typeForm'].validate(valid => {
        if(valid){
           this.addTime('excludeDays');
           this.types.push(this.baseType.type);
           this.diaShow =false;
           this.clearTypeForm();
        }
      })

    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.attendanceRuleWrap {
  height: calc(100vh - 112px);
  .form{
      margin-top: 30px;
    }
  .ruleContent {
    height: calc(100% - 56px);
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(220, 223, 230, 1);
    box-shadow: 0px 3px 5px 0px rgba(221, 221, 221, 1);
    border-radius: 2px;
    padding: 40px 40px 40px 60px;
    box-sizing: border-box;
    .tip {
      font-size: 14px;
      color: $gray_b;
      margin-left: 15px;
    }
    .companyList {
      width: 600px;
      border-left: 1px solid #ebeef5;
      border-top: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
    }
    .time {
      font-size: 14px;
      color: $gray_b;
    }
    .timeAll {
      font-size: 14px;
      color: #63717f;
    }
    .daySet {
      padding: 30px 20px 20px;
      box-sizing: border-box;
      background: rgba(249, 249, 249, 1);
      border-radius: 5px;
    }
    .checkboxs {
      padding-left: 20px;
    }
    .model {
      margin-top: 40px;
      .title {
        padding-left: 20px;
        font-size: 14px;
        color: $gray_b;
        line-height: 1;
        margin-bottom: 10px;
        font-weight: normal;
        .title_tip {
          color: #c1c5cd;
          font-size: 14px;
        }
      }
      .add {
        display: inline-block;
        width: 100px;
        height: 36px;
        background: rgba(249, 249, 249, 1);
        border: 1px solid rgba(204, 204, 204, 1);
        border-radius: 5px;
        text-align: center;
        color: #9b9fa6;
        font-size: 14px;
        .iconfont {
          font-size: 14px;
          margin-right: 6px;
          color: #9b9fa6;
        }
      }
      .selectedList {
        padding-left: 20px;
        padding-top: 10px;
        .selectItem {
          display: inline-block;
          padding: 10px 15px 10px 20px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(220, 223, 230, 1);
          border-radius: 5px;
          font-size: 14px;
          font-family:"Microsoft YaHei";
          font-weight: 400;
          line-height: 1;
          color: rgba(102, 102, 102, 1);
          text-align: center;
          margin-right: 10px;
          margin-bottom: 10px;
          .iconfont {
            font-size: 14px;
            margin-left: 24px;
            color: #657381;
          }
        }
      }
    }
    .model1 {
      margin-top: 30px;
    }
    .store {
      display: block;
      width: 100px;
      margin: 0 auto;
    }
  }
}
</style>
