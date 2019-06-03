<template>
<div class="initExamWrap companyCommon companyList">
    <infoHead title="发布考试" @back="back"></infoHead>
    <div class="content">
        <!-- 考试基本信息 -->
        <div class="modules">
            <h6 class="title">考试基本信息</h6>
            <div class="form"> 
                <el-form :model="baseInfo"  class="formLabelTop" :rules="baseRules" ref="baseForm" label-width="114px">
                    <el-form-item   label="考试名称" size="medium" prop="examName">
                        <el-input maxlength="20"  v-model.trim="baseInfo.examName"  placeholder="请输入考试名称20字符以内"></el-input>
                    </el-form-item>
                    <el-form-item label="参考时间" size="medium"  prop="examTime">
                             <el-date-picker
                                v-model="baseInfo.examTime"
                                type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                format="yyyy-MM-dd HH:mm"
                                range-separator="至"
                                start-placeholder="参考开始时间"
                                end-placeholder="参考结束时间">
                              </el-date-picker><span class="tip">在设置的时间范围内，考生才可以参加考试</span>
                    </el-form-item>
                    <el-form-item class="t1"  label="答卷时长" size="medium" prop="examDuration">
                        <el-input  v-model.trim="baseInfo.examDuration"  placeholder="请输入"></el-input><span class="tip">分钟</span>
                    </el-form-item>
                    <el-form-item class="t1"  label="及格分数" size="medium" prop="examQualifiedScore">
                        <el-input  v-model.trim="baseInfo.examQualifiedScore"  placeholder="请输入"></el-input><span class="tip">分</span>
                    </el-form-item>
                    <el-form-item  class="t1" label="组卷形式" size="medium" prop="testType">
                        <el-select  v-model="baseInfo.testType" placeholder="请选择"  @change="change">
                            <el-option
                            v-for="item in examTestType.list"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                            </el-option>
                        </el-select><span class="tip">考试开始时，系统为考试随机生成一份试卷，每个考生的试卷都不一样</span>
                    </el-form-item>
                    <el-form-item   label="考试说明" size="medium" >
                        <el-input type="textarea"  maxlength="500" v-model.trim="baseInfo.examDesc"  placeholder="请输入考试说明500个字符以内"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- 题型信息 -->
        <div class="modules examCheckbox">
            <h6 class="title">题型信息</h6>
            <div class="form"> 
                <el-form :model="baseInfo"  class="formLabelTop"   ref="typeForm">
                    <div class="topicSection"  v-for="(domain, index) in baseInfo.topics" :key="index">
                        <span class="topicTitle"> <span class="red">*</span> 大题{{numToStr.obj[index + 1]}}</span>
                        <el-form-item class="t1 tB tT"  size="medium"   >
                        <el-select  v-model="domain.topicType"  @change="selectTopicType(index,$event)"  placeholder="请选择">
                            <el-option
                            v-for="item in topicType.list"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                            </el-option>
                        </el-select> 
                        </el-form-item>
                        <el-form-item  
                            class="t1"  
                            :prop="'topics.' + index + '.questionScore'"
                            :key="`index_score${index}`"
                            :rules="[{ required: true, message: '请输入1~10之间任意数字', trigger: 'blur' },{ validator: validate.validateFloatLimit1_10, trigger: 'blur' },]">
                            <span class="score"><span class="t">每题</span> <el-input v-model.trim="domain.questionScore"  placeholder="请输入"></el-input> <span class="s">分</span></span>
                        </el-form-item>
                        <span class="btns">
                            <span class="fn select pointer">选择题库 
                                <el-select class="selectExam" multiple  :multiple-limit="10" v-model="domain.detailsId"  @change="changeId(index,$event)" placeholder="请选择" :key="index">
                                    <el-option
                                        v-for="item in examTreeData.list"
                                        :key="item.id"
                                        :label="item.className"
                                        :value="item.id">
                                        <template slot-scope="scope">
                                        <h6 :style="`font-weight:normal;padding-left:${item._level*20}px;width:60%;`" >  
                                  <span :style="{'font-size' : '14px'}">{{item.className}}</span>
                                        <i>{{item.index}}</i>
                                        </h6>
                                        </template>
                                    </el-option>
                                </el-select>
                            </span>
                            <span class="fn delete pointer" @click.stop="deleTopic(index)" v-show="index != 0">删除</span>
                            <el-tooltip class="item" effect="dark" content="提示：分类不包含子分类的题目，如需考核子分类的题目请选择子分类" placement="bottom">
                                <i class="el-icon-info pointer"></i>
                            </el-tooltip>
                        </span>
                         <div class="table tableTDRB"  v-show="domain.details.length > 0">
                            <el-table :data="domain.details" >
                                <el-table-column v-for="(column, key) in  tabList"   :prop="column.pro" :label="column.label"  :key="`${index}_${key}_${column.pro}`" >
                                    <template slot-scope="scope">
                                            <span :class="['font']" >
                                                <template v-if="column.pro == 'topicTypeName'">
                                                    {{scope.row[column.pro] || '---'}}
                                                </template>
                                                <template v-else>
                                                    <template v-if="scope.row['selectQueRules'].length > 0">
                                                        <template v-for="item2 in scope.row['selectQueRules']">
                                                            {{quesDiffLevel.obj[item2.diffLevel || item2.quesLevel]}}:{{item2.quesNum === '' ? '---' : item2.quesNum}}；
                                                        </template>
                                                    </template>
                                                    <template v-else>
                                                        <i class="iconfont pointer icon-plus-circle" @click.stop="addRules(scope.row,index,scope.$index)"></i>
                                                    </template>
                                                </template>
                                            </span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-tooltip effect="dark" content="修改抽题规则" placement="right-end">
                                            <i class="iconfont  pointer icon-bianji" @click.stop="editRules(scope.row,index,scope.$index)"></i>
                                        </el-tooltip>
                                        <el-tooltip effect="dark" content="删除题库" placement="right-end">
                                            <i class="iconfont icon-del  pointer" @click.stop="deleDetail(scope.row,index,scope.$index)" ></i>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div> 
                        <!-- 漏选得分  后面做 -->
                        <!-- <el-checkbox v-model="domain.missSelect" v-show="domain.topicType == '2'">漏选得分</el-checkbox> -->
                    </div>
                </el-form>
                <div class="bottom">
                    <h6 class="text"><span class="num">题目总数：<span>{{allNumScore.num}} <span>题</span></span></span><span class="allScore">题目总分：<span>{{allNumScore.score}} <span> 分</span></span></span></h6>
                    <span class="add pointer" @click.stop="add">+&nbsp;&nbsp;&nbsp;添加</span>
                </div>
            </div>
        </div>
        <!-- 参考人员 -->
        <div class="modules">
            <h6 class="title">参考人员</h6>
            <div class="form"> 
                <el-form :model="baseInfo" :rules="baseRules" ref="memForm" label-width="114px">
                    <el-form-item  label="指定部门" size="medium" prop="test">
                        <el-select  v-model="baseInfo.examDeptIds" multiple  placeholder="请选择指定部门">
                            <el-option
                                v-for="item in treeMem.arr"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                                <template slot-scope="scope">
                                <h6 :style="`font-weight:normal;padding-left:${item._level*20}px;width:60%;`" >  
                                  <span :style="{'font-size' : '14px'}">{{item.text}}</span>
                                <i>{{item.index}}</i>
                                </h6>
                                </template>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  label="指定人员" size="medium" >
                         <div class="el-select__tags mem_select_tag">
                             <span>
                                 <template  v-for="(item,index) in memNames" >
                                    <span class="el-tag el-tag--info el-tag--small" :key="index">
                                        <span class="el-select__tags-text">{{item}}</span>
                                        <i class="el-tag__close el-icon-close" @click.stop="removeTag(index)"></i>
                                    </span>
                                 </template>
                             </span>
                         </div>
                        <el-select  v-model="memNames"  class="formSelectNoTags"   multiple  placeholder="请选择指定人员" >
                              <template slot-scope="scope">
                                  <selectMem  :treeData="treeMem.list" :multiple="true"  :initCheckBox="memInitObj"  @select="selectMem" :clear.sync="mems" ></selectMem>
                                  <el-option  v-for="(item,index) in [0]" :key="index" :value="item.id" >
                                  </el-option>
                              </template>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- 防作弊设置 -->
        <div class="modules examCheckbox">
            <h6 class="title">防作弊设置</h6>
            <div class="form"> 
                <el-form :model="baseInfo"  :rules="baseRules" ref="safeForm" label-width="0">
                    <div class="formSection tP" >
                        <span v-show="false">{{baseInfo.cheatChangePageCount ? cheatChangePageCount =  true : cheatChangePageCount = false}}</span>
                        <el-checkbox class="labelCheckbox" v-model="cheatChangePageCount">切换页面超过</el-checkbox>
                        <el-form-item  class="t1 "  size="medium" prop="cheatChangePageCount"> 
                            <el-input  v-model.trim="baseInfo.cheatChangePageCount"  placeholder="请填写"></el-input>
                            <span class="tip">次将强制交卷。<span>(开始答题后，全屏显示考卷，考生切换屏幕超过设定的次数后，将被强制交卷，可避免考生切屏出去查看答案)</span></span>
                        </el-form-item>
                    </div>
                    <div class="formSection tP tP1">
                        <span v-show="false">{{baseInfo.cheatAnswerTimeout ? cheatAnswerTimeout =  true : cheatAnswerTimeout = false}}</span>
                        <el-checkbox class="labelCheckbox" v-model="cheatAnswerTimeout">停留时间超过</el-checkbox>
                        <el-form-item  class="t1 "  size="medium" prop="cheatAnswerTimeout"> 
                            <el-input  v-model.trim="baseInfo.cheatAnswerTimeout"  placeholder="请填写"></el-input>
                            <span class="tip">秒没有新操作将强制交卷。<span>(没有新操作后会出现10秒倒计时交卷提示，点击屏幕即可取消，可避免考生切屏出去查看答案)</span></span>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
        </div>
        <div class="btnss">
            <!-- 未发布  可以保存 -->
            <span class="submit pointer" v-if="baseInfo.examStatus == 3 || id == ''" @click.stop="newExam(0)">
                保存
            </span>
            <!-- 未开考 可以发布 -->
            <span class="submit pointer" v-if="id == '' || baseInfo.examStatus == 3 || baseInfo.examStatus == 0"  @click.stop="newExam(1)">
                发布
            </span>
        </div>
    </div>
      <!-- 抽题规则的弹窗 -->
    <reDialog
      :visible.sync="seletRulesShow" 
      @submit="selectExamType"
      title="抽取规则">
      <el-form   ref="form" label-width="114px" slot="body">
        <el-form-item  class="t1" size="medium" v-for="(item,index) in examRules" :key="index" :label="quesDiffLevel.obj[item.diffLevel || item.quesLevel]">
            <el-input    v-model.trim="item.quesNum"   type="number"   max="20" placeholder="请填写"></el-input>
            <span class="tip">/{{item.totalQues}} &nbsp;&nbsp;&nbsp;<span>必考题数量：{{item.mustTest}}</span></span>
        </el-form-item>
        <h6 class="rDTitle">抽题提示：</h6>
        <p class="rDText">1.抽题数量不大于必考题数量，则在必考题中抽取考试数目</p>
        <p class="rDText rDText1">2.抽题数量大于必考题则优先抽取必考题目，后在非必考题中抽选剩余考题</p>
      </el-form>
    </reDialog>
      <!-- 新增考试成功弹窗 -->
    <reDialog
      :visible.sync="examSuccess" 
      @submit="confirmExam"
      @close="back"
      @cancle="showExam"
      submit="确定"
      cancle="生成试卷看一下"
      title="考试发布成功">
      <el-form   ref="form" label-width="130px" slot="body">
        <el-form-item  class="t1" size="medium" label="考试名称：">
            <span class="tip">{{noticeInfo.examName}}</span>
        </el-form-item>
        <el-form-item  class="t1" size="medium" label="考试开始时间：">
            <span class="tip">{{noticeInfo.examStartTime}}</span>
        </el-form-item>
        <el-form-item  class="t1" size="medium" label="应考人数：">
            <span class="tip">{{noticeInfo.totalUser}}</span>
        </el-form-item>
        <el-form-item  class="t1" size="medium" label="发送考试通知：">
             <el-checkbox-group v-model="noticeInfo.msgType">
                  <el-checkbox label="0" name="message" :key="0">短信</el-checkbox>
                  <el-checkbox label="1" name="email" :key="1">邮件</el-checkbox>
             </el-checkbox-group>
        </el-form-item>
      </el-form>
    </reDialog>
</div>    
</template>

<script>
import infoHead from "@/components/infoHead.vue"
import reDialog from "@/components/reDialog"
import selectMem  from "@/components/selectMem"
import validate from "../../util/validate.js"
export default {
    name : 'initExam',
    components:{infoHead,selectMem,reDialog},
    data(){return{
        tabList : [   
            {pro : 'topicTypeName',label : '所选题库'},
            { pro : 'selectQueRules' , label : '抽取规则'},
        ],
        currentRules : {
            rules : [],
            item : '',
            index : -1,
            detailIndex : -1
        },
        topicsTypeArr : [-1],
        id : '',
        examStatus : '',
        selectedType : [],
        empty: [],
        examRules : [],
        validate : validate,
        seletRulesShow : false,
        examSuccess: false,
        cheatChangePageCount : '',
        cheatAnswerTimeout : '',
        noticeInfo : {
            examName : '',
            examStartTime : '',
            totalUser : '',
            id : '',
            msgType : []
        },
        mems : [], //所有参考人员id数组
        memNames : [], //所有参考人员name数组
        memInitObj : {},
    }},
    computed:{
        // 指定参考人员
      treeMem(){
          return this.$store.state.selectData.orgTreeBaseInfo;
      },
      allNumScore(){
          let num = 0;
          let score = 0;
          this.baseInfo.topics.forEach((v)=>{
              let n1 = 0;
              if(v.details){
                v.details.forEach((vv)=>{
                    if(vv.selectQueRules){
                        vv.selectQueRules.forEach(vvv=>{
                            n1 = n1 + Number(vvv.quesNum);
                        })
                    }
                })
                score = score +  n1 * v.questionScore;
                num = num + n1;
              }
          })
          return {num : num , score : score};
      },
      baseInfo(){
          return this.$store.state.exam.examInfo;
      },
      baseRules(){
          return this.$store.state.exam.examRules;
      },
      numToStr(){
          return this.$store.state.selectData.orderStaticData;
      },
    //    题库分类
      examTreeData(){
        return this.$store.state.selectData.contractTreeData;
      },
    //  组卷数据
      examTestType(){
          return this.$store.state.selectData.examTestType;
      },
    //   题目类型
      topicType(){
          return this.$store.state.selectData.topicType;
      },
    //   每个空题型数据
      topicItem(){
          return this.$store.state.exam.topicItem;
      },
    //   每个空的题库图表数据
      topicDetail(){
          return this.$store.state.exam.topicDetail;
      },
    //   抽题规则难易
      quesDiffLevel(){
          return this.$store.state.selectData.quesDiffLevel;
      }
    },
    created(){
        this.$store.dispatch('getOrgTreeInfo').then(obj=>{})
        this.$store.state.selectData.contractTreeData.list = [];  
        this.$store.dispatch('getContractTreeData','Q').then(obj=>{
            // 如果有id那么就是编辑考试
            let id = window.sessionStorage['examEditInfoId']; 
            if(id){
                this.$api.gainExamInfo(id).then(obj=>{  
                    // 是否是复制考试
                    if(window.sessionStorage['examCopy']){
                        delete obj.data.data.id;
                        obj.data.data.examStatus = '3';
                    }else{
                        this.id = id;
                    }
                    let arr = [];
                    let info = obj.data.data;
                    // 处理时间
                    info.examTime = [info.examStartTime,info.examEndTime];
                    // 处理题库选择
                    this.$store.state.exam.examInfo = info;
                    if(info.userIdAndNames.length > 0){
                        let isPush = false;
                        if(!info.examUserIds){
                                info.examUserIds = [];
                        }
                        if(info.examUserIds.length == 0){
                            isPush = true;
                        }
                        info.userIdAndNames.forEach(v=>{
                            this.mems.push(String(v.userId));
                            this.memNames.push(v.name);
                            this.memInitObj[v.userId] = v.name;
                            if(isPush){
                                info.examUserIds.push(v.userId);
                            }
                        })
                    }
                    info.cheatAnswerTimeout = String(info.cheatAnswerTimeout) == 'null' ?  '' : String(info.cheatAnswerTimeout); 
                    info.cheatChangePageCount = String(info.cheatChangePageCount)== 'null' ?  '' : String(info.cheatChangePageCount); 
                    info.topics.forEach((v,i)=>{
                        info.topics[i].detailsId = [];
                        v.details.forEach((v1,i1)=>{
                            info.topics[i].detailsId.push(v1.topicTypeId);
                        })
                        if(i == 0  && v.topicType){
                            this.topicsTypeArr[0] = v.topicType;
                        }else{
                            if(v.topicType){
                                this.topicsTypeArr.push(v.topicType);
                            }else{
                                this.topicsTypeArr.push(-1);
                            }
                        }
                        this.changeId(i);
                    })
                    console.log(info);
                    Object.assign(this.$store.state.exam.examInfo,info);
                })
            }
        })
    },
    methods:{
        selectMem(item){
            this.$store.state.exam.examInfo.examUserIds = item.checkIds;
            this.memNames = item.checkMems;
        },
        newExam(status){
            // 0保存 1发布
            let base  =  Object.assign({},this.baseInfo);
            base.operFlag = status;
            base.examStartTime = base.examTime[0];
            base.examEndTime = base.examTime[1];
            if(!this.cheatChangePageCount){
                base.cheatChangePageCount = '';
            }
            if(!this.cheatAnswerTimeout){
                base.cheatAnswerTimeout = '';
            }
            
            if(this.id == ''){
                this.$api.addExam(base).then(obj=>{
                    Object.assign(this.noticeInfo,base);
                    this.noticeInfo.id = obj.data.data.id;
                    this.noticeInfo.totalUser = obj.data.data.totalUser;
                    this.noticeInfo.examStartTime = base.examStartTime;
                    if(status == 1){
                        this.examSuccess = true;
                    }else{
                        this.$message.success('保存成功!');
                        this.back();
                    }
                })
            }else{
                this.$api.editExamPage(base).then(obj=>{
                    Object.assign(this.noticeInfo,base);
                    this.noticeInfo.id = obj.data.data.id;
                    this.noticeInfo.totalUser = obj.data.data.totalUser;
                    this.noticeInfo.examStartTime = base.examStartTime;
                    if(status == 1){
                        this.examSuccess = true;
                    }else{
                        this.$message.success('保存成功!');
                        this.back();
                    }
                })
            }
        },
        changeId(index,item){
            // let arr =  this.$store.state.exam.examInfo.topics[index].details;
            // this.$store.state.exam.examInfo.topics[index].details =  [...new Set([...arr,item])];
            // 需要加判断 如果选了 父类 则 子类全都不可选
            let all = this.examTreeData.objAll;
            let arr = [];
            let ids = this.baseInfo.topics[index].detailsId;
            let str = '';
            function gainStr(id){
                if(all[id]){
                    str = str + all[id].className +  '/'; 
                    let parId = all[id].parentId;
                    if(parId){
                        gainStr(parId);
                    }
                }else{
                    str = '';
                }
            }
            ids.forEach((v,i) => {
                let m =  Object.assign({},this.topicDetail);
                str = '';
                gainStr(v);
                str = str.substring(0,str.length - 1);
                let details = this.baseInfo.topics[index].details;
                if(details.length >10){
                    this.$message.error('每道大题最多可选10个题库');
                }else{
                    Object.assign(m,this.baseInfo.topics[index].details[i]);
                    m.topicTypeName =  str;
                    m.topicTypeId = v;
                    arr.push(m)
                }
            });
            this.$store.state.exam.examInfo.topics[index].details = Object.assign([],[...arr]);
        },
        addRules(item,index,$index){
            let id = item.topicTypeId;
            let type = this.baseInfo.topics[index].topicType;
            if(type){
                this.$api.examRules({topicId : id, topicType : type}).then(obj=>{
                    this.seletRulesShow = true;
                    this.examRules = obj.data.data;
                    // 生成抽查规则表单验证
                    this.currentRules.index =  index;
                    this.currentRules.item = item;
                    this.currentRules.detailIndex = $index;
                    this.examRules.forEach(v=>{
                        v.quesNum =  0;
                        v.quesLevel = v.diffLevel;
                    })
                }).catch(obj=>{
                    this.seletRulesShow = false;
                })
            }else{
                this.$message.error('请先选择大题分类');
            }
        },
        editRules(item,index,$index){
            let type = this.baseInfo.topics[index].topicType;
            let id = item.topicTypeId;
            if(item.selectQueRules.length > 0){
                this.currentRules.index =  index;
                this.currentRules.item = item;
                this.currentRules.detailIndex = $index;
                let arr = Object.assign([],item.selectQueRules);
                this.$api.examRules({topicId : id, topicType : type}).then(obj=>{
                    this.seletRulesShow = true;
                    obj.data.data.forEach(v=>{
                        arr.forEach((vv,ii)=>{
                            if(v.diffLevel == vv.diffLevel || v.diffLevel  == vv.quesLevel){
                                arr[ii].mustTest = v.mustTest;
                                arr[ii].totalQues = v.totalQues;
                            }
                        })
                    })
                    this.examRules = Object.assign([],item.selectQueRules);
                }).catch(obj=>{
                    this.seletRulesShow = false;
                })
            }else{
                this.addRules(item,index,$index);
            }
        },
        // 输入文字大小限制
        inputNum(item,i,value){
            console.log(value);
            if(value > this.examRules[i].totalQues){
                this.examRules[i].quesNum = this.examRules[i].totalQues;
            }
            this.examRules[i].quesNum = Number(this.examRules[i].quesNum);
            this.examRules.push('');
            this.examRules.pop();
        },
        selectTopicType(index,id){
            let ii = -1;
            var isHas = this.topicsTypeArr.some((v,i)=>{
                if(v == id){
                    ii = i;
                }
                return v == id;
            })
            if(isHas){
               this.$message.error('该类型已存在');
               this.$store.state.exam.examInfo.topics[index].topicType = '';
               if(ii > -1){
                this.topicsTypeArr[index] = -1;
               }
            }else{
                // 不为0 这判断已存的value  和 新选择的 value是否相同
                if(this.topicsTypeArr.length != 0){
                    if(this.topicsTypeArr[index] == -1){
                        this.topicsTypeArr[index] = id;
                    }else{
                        // 切换选项 清楚所有题库 规则
                        this.topicsTypeArr[index] = id;
                        // 删除多选存储的id
                        this.$store.state.exam.examInfo.topics[index].detailsId = [];
                        // 删除对应的行table
                        this.$store.state.exam.examInfo.topics[index].details = [];
                    }
                }
                this.selectedType[index] = id;
            }
        },
        add(){
            let arr = this.$store.state.exam.examInfo.topics;
            if(arr.length < this.topicType.list.length){
                let item = Object.assign({},this.topicItem);
                this.topicsTypeArr.push(-1);
                this.$store.state.exam.examInfo.topics.push(item);
            }else{
                this.$message.error(`最多增加${this.topicType.list.length}道大题`);
            }
        },
        selectExamType(){
            let isSubmit = true;
            this.examRules.forEach((v)=>{
                if(v.quesNum > v.totalQues){
                    isSubmit = false;
                    this.$message.error(this.quesDiffLevel.obj[v.quesLevel] + '题的数目不能大于可选择题目数');
                }
                if(v.quesNum > 100){
                    isSubmit = false;
                    this.$message.error('抽题规则不能超过100道');
                }
            })
            if(isSubmit){
                this.seletRulesShow = false;
                this.$store.state.exam.examInfo.topics[this.currentRules.index].details[this.currentRules.detailIndex].selectQueRules = Object.assign([],this.examRules);
            }
        },
        deleDetail(item,index,$index){
            this.$confirm('此操作将移除该题库及规则, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '移除成功!'
                });
                // 删除多选存储的id
                this.$store.state.exam.examInfo.topics[index].detailsId.splice($index,1);
                // 删除对应的行table
                this.$store.state.exam.examInfo.topics[index].details.splice($index,1);
            })
        },
        deleTopic(i){
            this.$confirm('此操作将移除该大题题型, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '移除成功!'
                });
                this.topicsTypeArr.splice(i,i);
                this.$store.state.exam.examInfo.topics.splice(i,1);
            })
        },
        back(){
            this.$router.routeBack('',1);
        },
        change(){
            console.log(this.baseInfo);
        },
        confirmExam(){
            // console.log(({id : this.noticeInfo , msgType : this.noticeInfo.msgType.length > 0 ? JSON.stringify(this.noticeInfo.msgType) : ''}));
            this.$api.sendExamMsg({id : this.noticeInfo.id , msgType : this.noticeInfo.msgType.length > 0 ?  this.noticeInfo.msgType : ''}).then(obj=>{
                this.$message.success('发送通知成功!');
                this.examSuccess = false;
                this.back();
            })
        },
        showExam(){ 
            window.open('#/exam');
            this.$store.dispatch('setCookiesExam',{id : this.noticeInfo.id, type : 'view'});
            this.examSuccess = true;
        },
        removeTag(index){
            this.mems.splice(index,1);
            this.memNames.splice(index,1);
            this.$store.state.exam.examInfo.examUserIds = [...this.mems];
        }
    }
}
</script>

<style lang="scss"  scoped>
@import "../../assets/css/common.scss";
.el-input,.el-textarea,.el-select,.el-date-editor--datetimerange{
    width: 500px;
}
.t1 .el-input, .t1 .el-select{
    width: 200px;
}
.topicSection {
    padding-left: 114px;
    position: relative;
    margin-bottom: 40px;
    .topicTitle{
        font-size:14px;
        font-weight:400;
        color:$gray_b;
        position: absolute;
        left: 0;
        top: 10px;
        padding-left: 10px;
        .red{
            color: red;
        }
    }
    .el-form-item{
        display: inline-block;
        margin-top: 0px;
        margin-bottom: 0;
        vertical-align: top;
    }
}
.topicSection:nth-last-of-type(1){
    margin-bottom: 0;
}
.tB {
    .el-input,.el-select{
        margin-bottom: 24px;
    }
}
.tT{
    margin-top: 30px;
}
.tP{
    padding-top: 30px;
    .labelCheckbox{
        padding-top: 10px;
        box-sizing: border-box;
    }
}
.tP1{
    padding-top: 0;
}
.cell{
    display: flex !important;
}
.initExamWrap{
    .content{
        width:100%;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        overflow: hidden;
        background:rgba(255,255,255,1);
        border-radius:2px;
        box-shadow:0px 0px 5px 0px rgba(221,221,221,1);
        .modules{
            .title{
                background:rgba(245,247,250,1);
                border-radius:2px 2px 0px 0px;
                font-size:14px;
                font-weight:400;
                height: 44px;
                line-height: 44px;
                padding-left: 20px;
                box-sizing: border-box;
                width: 100%;
                color:$gray_b;
            }
            .form{
                padding: 35px 50px 18px;
            }
            .score{
                font-size: 14px;
                margin-left: 30px;
                color: $gray_b;
                margin-right: 40px;
                .t{
                    margin-right: 20px;
                }
                .s{
                    margin-left: 10px;
                }
            }
            .btns{
                display: inline-block;
                height: 36px;
                line-height: 36px;
                margin-bottom: 24px;
                padding-top: 0 !important;
                .fn{
                    display: inline-block;
                    text-align: center;
                    width:100px;
                    height:36px;
                    box-sizing: border-box;
                    border:1px solid #10B2FF;
                    color: #10B2FF;
                    background: white;
                    border-radius:4px;
                    margin-bottom: 24px;
                    // margin-top: 10px;
                }
                .el-icon-info{
                    display: inline-block;
                    vertical-align: top;
                    line-height: 36px;
                    height:36px;
                    color: #63717F ; opacity: 0.8;
                    
                }
                .el-icon-info:hover{
                    opacity: 1;
                }
                .select{
                    margin-right: 20px;
                    position: relative;
                    overflow: hidden;
                    line-height: 36px;
                    vertical-align: bottom;
                    .selectExam{
                        position: absolute;
                        height: 36px;
                        left: 0;
                        top: 0;
                        opacity: 0;
                    }
                }
                .delete{
                    color: #E96F6F;
                    border: 1px solid #E96F6F;
                    margin-right: 15px;
                    line-height: 36px;
                }
            }
            .table{
                width: 800px;
                border-left: 1px solid $gray_f1;
                border-right: 1px solid $gray_f1;
                margin-bottom: 10px;
                .iconfont{
                    color: $icon_g;
                }
                .icon-del{
                    font-size: 14px;
                    margin-left: 15px;
                } 
                .icon-plus-circle{
                    font-size: 18px;
                }
            }
            .text{
                font-size:14px;
                font-weight:400;
                color: $gray_b;
                text-align: center;
                margin-top: 28px;
                .num,.allScore{
                    span{
                        color: #10B2FF;
                        font-size: 20px;
                        span{
                            font-size: 14px;
                        }
                    }
                }
                .num{
                    margin-right: 25px;
                }
            }
            .add{
                display: block;
                width: 500px;
                margin: 40px auto 52px;
                border: 1px dotted $gray_f1;
                background: #fbfdff;
                border-radius:5px;
                font-size:14px;
                font-weight:400;
                height: 34px;
                line-height: 34px;
                color:#9b9fa6;
                text-align: center;
            }
            .bottom{
                width: 800px;
                margin-left: 114px;
            }
        }
        .examCheckbox{
            .form{
                padding: 35px 50px 18px;
                .formSection{
                    display: flex;

                }
            }
        }
        .tip{
            font-size: 14px;
            color: #858585;
            margin-left: 9px;
            span{
                font-size: 12px;
            }
        }
        .btnss{
            width: 100%;
            text-align: center;
            margin: 30px auto 40px;
        }
        .submit{
            display: inline-block;
            width:150px;
            height:44px;
            color: white;
            background:rgba(16,178,255,1);
            border-radius:4px;
            text-align: center;
            line-height: 44px;
            font-size:14px;
            font-weight:400;
        }
    }
    .diaCon{
        height: 400px;
    }
    .rDTitle{
        margin-top: 30px;
        color: $gray_b;
        font-size: 14px;
        line-height: 40px;
    }
    .rDText{
        line-height: 30px;
        font-size: 12px;
        color: $gray_b;
    }
    .rDText1{
        margin-bottom: 20px;
    }
    .el-tag__close.el-icon-close{
        background: #c0c4cc;
        right: 0;
        top: -1px;
        color: white;
    }
    .el-tag{
        box-sizing: border-box;
        border-color: transparent;
        margin: 2px 0 2px 6px;
        background-color: #f0f2f5
    }
    .el-tag--small{
        padding: 0 4px 0 8px;
    }
    .mem_select_tag{
        z-index: 100;
        max-width: 468px;
    }
}

</style>
