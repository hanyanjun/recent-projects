<template>
<div class="bench">
   <h6 class="title">欢迎 <span>{{titleInfo.userName}}</span> ，今天是您和公司共同成长的第{{titleInfo.entryDays}}天&nbsp;
            <span class="titleInfo">最近登录时间：{{titleInfo.lastLoginDate}}</span>&nbsp;&nbsp;
            <i :class="['tri','pointer',{'tri_active' : is_showIp}]" @click.stop="is_showIp = !is_showIp"><span></span>
            </i> <span class="titleInfo" >
                <template v-if="!is_showIp">
                    IP:{{titleInfo.lastIp}}&nbsp;&nbsp;{{titleInfo.city}}
                </template>    
                </span>
        <button @click.stop="addModel" class="addModelBtn pointer" v-if="drop_data.length > 0">添加部件</button>            
    </h6>

    <draggable v-model="drop_data" v-if="drop_data.length != 0"  @end="editLayout">
            <div  v-for="item in drop_data" :key="item.code"  :class="['head', item.class]" v-if="item">
                    <heads 
                        :title="bench_obj[item.code].name" 
                        infoClass="headInfoT1" 
                        :itemInfo="item"
                        :preIcon="bench_obj[item.code].icon" 
                        :is_fn="true" 
                        :dropItems="['更多','删除']" 
                        emptyImg="img1" 
                        :num="item.code == 'pendingapprove' ? pendingapproveNum : 0" 
                        :is_empty = "emptyObj[item.code]"
                        @optionClick="optionClick">
                        <!-- , 
                         {'benchTablePos' : item.code == 'endexam' },
                         {'benchTablePos1' : item.code == 'endapprove'},
                         {'benchTablePos2' :  item.code == 'pendingexam'}, -->
                    <div :class="['content', 'benchTable',
                        {'contentNo' : 
                            item.code == 'startapprove' && approvelList.length == 0  ||
                            item.code == 'endexam' && examList.length == 0 || 
                            item.code == 'pendingexam' && noExamList.length == 0 ||
                            item.code == 'pendingapprove' && noApproveList.length == 0 ||
                            item.code == 'endapprove' && approveList.length == 0 ||
                            item.code == 'hrstatistics' &&   Object.keys(memsInfo).length == 0 ||
                            item.code == 'recordlog' && recordList.length == 0},
                        ]" slot="content">
                       <div class="con_content" v-if="item.code == 'startapprove' && approvelList.length > 0">
                            <!-- 发起审批模块 -->
                            <div class="model pointer" v-for="(item,index) in approvelList" :key="index"  @click.stop="apply(item)">
                                <img :src="imgs[item.relationFormCode]" alt=""><span class="text">{{item.templateName}}申请</span>
                            </div>
                       </div>    
                        <!-- 已考试模块 -->
                       <div class="con_content benchTablePos" v-if="item.code == 'endexam' && examList.length > 0">
                            <el-table :data="examList" >
                                <el-table-column v-for="(column, key) in examPro "  :label="column.label"  :key="column.pro">
                                    <template slot-scope="scope">
                                        <template v-if="column.pro == 'isQualified'">
                                            <template v-if="scope.row[column.pro] == 'N'">
                                                <span class="s1 s2 s3">不合格</span>
                                            </template>
                                            <template v-if="scope.row[column.pro] == 'Y'">
                                                <span class="s1">合格</span>
                                            </template>
                                            <!-- <span class="s1 s2 s3">{{scope.row[column.pro] || '---'}}</span> -->
                                        </template>
                                        <template v-else>
                                            {{scope.row[column.pro] || '---'}}
                                        </template>
                                    </template>
                                </el-table-column>
                            </el-table>
                       </div>
                        <!-- 未考试模块 -->
                       <div class="con_content benchTablePos2" v-if="item.code == 'pendingexam' && noExamList.length > 0">
                            <el-table :data="noExamList" >
                                <el-table-column v-for="(column, key) in noExamPro "  :label="column.label"  :key="column.pro">
                                    <template slot-scope="scope">
                                            {{scope.row[column.pro] || '---'}}
                                    </template>
                                </el-table-column>
                            </el-table>
                       </div>
                        <!-- 待我处理的审批 -->
                       <div class="con_content " v-if="item.code == 'pendingapprove' && noApproveList.length > 0">
                             <div class="info_model pointer" v-for="(item,index) in noApproveList" :key="index"  @click.stop="handleSkip(item)">
                                <div class="left">
                                    <img  v-img1="item.portraitUrl" alt="">
                                    <span class="name">{{item.applyUserName}}</span>
                                </div>
                                <div class="right">
                                    {{processFormType.obj[item.relationFormCode]}}申请
                                </div>
                            </div>
                       </div>
                        <!-- 已处理的审批 -->
                       <div class="con_content benchPointerTr benchTablePos1" v-if="item.code == 'endapprove' && approveList.length > 0">
                             <el-table :data="approveList"  @row-click="handleSkip1" >
                                <el-table-column v-for="(column, key) in approvePro "  :label="column.label"  :key="column.pro">
                                    <template slot-scope="scope">
                                        <div>
                                            <template v-if="column.pro == 'prcessStatus'">
                                            <template v-if="scope.row[column.pro] == 0">
                                                <span class="s1 s2">审批中</span>
                                            </template>
                                            <template v-else-if="scope.row[column.pro] == 4">
                                                <span class="s1">审批完成</span>
                                            </template>
                                            <template v-else-if="scope.row[column.pro] == 1">
                                                <span class="s1 s2 s3">不同意</span>
                                            </template>
                                            <template v-else-if="scope.row[column.pro] == 2">
                                                <span class="s1 s2 s3">退回</span>
                                            </template>
                                            <template v-else-if="scope.row[column.pro] == 3">
                                                <span class="s1 s2 s3">已撤销</span>
                                            </template>
                                        </template>
                                        <template v-else-if="column.pro == 'relationFormCode'">
                                            {{processFormType.obj[scope.row[column.pro]]}}
                                        </template>
                                        <template v-else>
                                            {{scope.row[column.pro] || '---'}}
                                        </template>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                       </div>
                        <!-- 人事统计 -->
                       <div class="con_content" v-if="item.code == 'hrstatistics' &&   Object.keys(memsInfo).length > 0">
                            <div class="mems_model" v-for="(item,index) in memsInfo" :key="index">
                                <div class="left">
                                    <span class="type">{{memsPro[index]}}</span>
                                    <div class="proress">
                                        <el-progress  :stroke-width="10" :show-text="false" :percentage="Number((item/2).toFixed(1))"></el-progress>
                                        <!-- <el-progress  :stroke-width="10" :show-text="false" :percentage="Math.floor(200/2)"></el-progress> -->
                                    </div>
                                </div>
                                <div class="right">
                                    {{item}}人
                                </div>
                            </div>
                       </div>
                        <!--打卡记录  -->
                       <div class="con_content" v-if="item.code == 'recordlog' && recordList.length > 0">
                            <el-table :data="recordList"  v-if="recordList.length > 0">
                                <el-table-column v-for="(column, key) in recordPro "  :label="column.label"  :key="column.pro">
                                    <template slot-scope="scope">
                                            {{scope.row[column.pro] || '---'}}
                                    </template>
                                </el-table-column>
                            </el-table>
                       </div>
                    </div>
                    </heads>
            </div>
        </draggable>
        <template v-if="drop_data.length == 0">
            <div class="emptyLogo">
                <scrollContent>
                    <img src="../../commons/imgs/bench_empty.png" alt="">
                    <p>啊哦，一个部件都木有啊～</p>
                    <button class="pointer" @click.stop="addModel">立即添加</button>
                </scrollContent>
            </div>
        </template>
   <!-- <div class="head head1">
       <heads title="快捷操作" infoClass="headInfoT1" preIcon="icon-approval" :is_fn="true" :dropItems="['更多','删除']" emptyImg="img1" :num="100" @optionClick="optionClick">
           <div class="content" slot="content" empty="img1">
               <div class="model pointer" v-for="(item,index) in processFormType.list" :key="index">
                   <img :src="imgs[item.code]" alt=""><span class="text">{{item.name}}申请</span>
               </div>
           </div>
       </heads>
   </div>
   <div class="head head2">
       <heads title="已处理审批" infoClass="headInfoT1" preIcon="icon-approval" :is_fn="true" :dropItems="['更多','删除']" emptyImg="img1" @optionClick="optionClick">
           <span slot="titleTip" class="titleTip">统计时间：03.01 — 03.31</span>
           <div class="content" slot="content">

           </div>
       </heads>
   </div>
   
   <div class="head head2 head3">
       <heads title="人事统计" infoClass="headInfoT1" preIcon="icon-approval" :is_fn="true" :dropItems="['更多','删除']" emptyImg="img1" @optionClick="optionClick">
           <span slot="titleTip" class="titleTip">统计时间：03.01 — 03.31</span>
           <div class="content benchTable"  slot="content">
               <div class="mems_model" v-for="(item,index) in list3" :key="index">
                   <div class="left">
                       {{item.type}}
                   </div>
                   <div class="proress">
                    <el-progress  :stroke-width="10" :show-text="false" :percentage="Math.floor(item.num/2)"></el-progress>
                   </div>
                   <div class="right">
                       {{item.num}}人
                   </div>
               </div>
           </div>
       </heads>
   </div>
   <div class="head head1 head3">
       <heads title="打卡记录" infoClass="headInfoT1" preIcon="icon-approval" :is_fn="true" :dropItems="['更多','删除']" emptyImg="img1" @optionClick="optionClick">
           <div class="content benchTable"  slot="content">
                <el-table :data="list" >
                    <el-table-column v-for="(column, key) in colums "  :label="column.label"  :key="column.pro">
                        <template slot-scope="scope">
                                {{scope.row[column.pro] || '---'}}
                        </template>
                    </el-table-column>
                </el-table>
           </div>
       </heads>
   </div>
   <div class="head head2">
       <heads title="已处理审批" infoClass="headInfoT1" preIcon="icon-approval" :is_fn="true" :dropItems="['更多','删除']" emptyImg="img1" @optionClick="optionClick">
           <div class="content benchTable"  slot="content">
                <el-table :data="list1" >
                    <el-table-column v-for="(column, key) in colums1 "  :label="column.label"  :key="column.pro">
                        <template slot-scope="scope">
                            <template v-if="column.pro == '3'">
                                <span class="s1 s2 s3">{{scope.row[column.pro] || '---'}}</span>
                            </template>
                            <template v-else>
                                {{scope.row[column.pro] || '---'}}
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
           </div>
       </heads>
   </div>
   <div class="head head2 head3">
       <heads title="待我处理的审批" :num="100" infoClass="headInfoT1" preIcon="icon-approval" :is_fn="true" :dropItems="['更多','删除']" emptyImg="img1" @optionClick="optionClick">
           <div class="content"  slot="content">
               <div class="info_model" v-for="(item,index) in list2" :key="index">
                   <div class="left">
                       <img src="../../commons/imgs/overtime.png" alt="">
                       <span class="name">{{item.name}}</span>
                   </div>
                   <div class="right">
                       {{item.type}}
                   </div>
               </div>
           </div>
       </heads>
   </div> -->

    <reDialog 
        :visible.sync="diaShow" 
        title="添加部件"
        class="checkbox_no_label checkbox_label_type1"
        @close="diaShow = false"
        @submit="editCompoent">
        <template slot="body">
              <draggable v-model="drop_data_dialog"   @end="sortList">
                 <div class="checks" v-for="item in drop_data_dialog"  :key="item.code" >
                    <div class="left"><i :class="['iconfont',bench_obj[item.code].icon]"></i>{{bench_obj[item.code].name}}</div>
                    <el-checkbox  :label="item.code" v-model="checkedList"></el-checkbox>
                </div>
            </draggable>
        </template>
    </reDialog>
</div>    
</template>

<script>
import  heads from "../../components/heads";
import imgs from "../approval/imgs.js";
import reDialog from "../../components/reDialog";
import draggable from 'vuedraggable';
import bench_obj from "./bench.js";
import empty from "../../components/empty";
import scrollContent from "../../components/scrollContent";
export default {
    name : 'bench',
    components:{reDialog,heads,draggable,empty,scrollContent},
    computed:{
        processFormType() {
        return this.$store.state.selectData.processFormType;
        },
        titleInfo(){
            return this.$store.state.welcomeInfo;
        }
    },
    data(){return{
        is_showIp : true, //控制ip的显示
        diaShow : false,
        bench_obj : bench_obj,
        drop_data:[''], //页面布局部件 list
        drop_data_dialog:[], //弹窗部件编辑 list
        checkedList : [], //选中的部件的code  list
        approvelList : [], //发起审批类型数组
        imgs : imgs, //发起审批的图片
        pendingapproveNum : 0,
        examPro : [
            {
            pro : 'examName',
            label : '考试名称',
            },
            {
            pro : 'testScore',
            label : '分数',
            width : 300
            },
            {
            pro : 'isQualified',
            label : '是否合格',
            width : 120
            }
        ],
        noExamPro : [
            {
            pro : 'examName',
            label : '考试名称',
            },
            {
            pro : 'examStartTime',
            label : '考试开始时间'
            },
            {
            pro : 'examEndTime',
            label : '考试结束时间'
            }
        ],
        allOptions : [],
        examList : [],
        noExamList : [],
        approvePro : [   
            {
            pro : 'relationFormCode',
            label : '审批类型',
            },
            {
            pro : 'applyUserName',
            label : '申请人',
            },
            {
            pro : 'prcessStatus',
            label : '状态',
            },
        ],
        approveList : [],
        noApproveList : [],
        recordList : [], //打卡记录
        memsInfo : {
            birthSize: 0,
            contractEndSize: 0,
            entrySize: 0,
            leaveSize: 0,
            onJobSize: 0,
            transferJobSize: 0
        },
        memsPro : {
            birthSize : '生日人数',
            contractEndSize : '合同到期',
            entrySize : '入职人数',
            leaveSize : '离职人数',
            onJobSize : '在职人数',
            transferJobSize : '调岗人数'
        },
        emptyObj : {

        },
        recordPro :[
            {
                pro : 'recordDate',
                label : '日期'
            },
            {
                pro : 'onPunchTime',
                label : '上班打卡时间'
            },
            {
                pro : 'offPunchTime',
                label : '下班打卡时间'
            },
            {
                pro : 'onLate',
                label : '迟到'
            },
            {
                pro : 'offEarly',
                label : '早退'
            },
            {
                pro : 'isAbsenteeism',
                label : '矿工'
            },

        ],
        historyName : {
            // 已考试列表
            endexam : {
                name : 'already'
            },
            // 已处理审批
            endapprove : {
                name : 'alreadyList'
            },
            // 发起审批
            startapprove : {
                name : 'approvallist'
            },
            // 打卡记录
            recordlog : {
                name : 'personalCenter',
                methods(){
                    window.sessionStorage['benchPerTab'] = 'record'
                }
            },
            // 带考试列表
            pendingexam : {
                name : 'noTest'
            },
            // 待处理审批
            pendingapprove : {
                name : 'waitForList'
            },
            // 人事统计
            hrstatistics : {
                name : 'employeeList'
            }
        }
    }},
    created(){
        this.$store.dispatch("getWelcomeInfo"); //获取欢迎语头部信息
        this.getLayout(); //获取页面布局
    },
    methods:{
        getLayout(){
            // 获取已选部件列表
            this.$api.getSelectRelationList().then(obj=>{
                let arr = Object.assign([],obj.data.data);
                let arr1 = arr.map((v,i)=>{
                    let o =   this.bench_obj[v.code];
                    this.checkedList.push(v.code);
                    this.emptyObj[v.code] = false;
                    return {...v,...o};  
                })
                this.checkedList = Object.assign([], [...new Set(this.checkedList)]);
                this.drop_data = Object.assign([],arr1);
                this.getDialogList();
                this.gainAllData();
            })
        },
        handleSkip(row){
            window.sessionStorage['applyState'] = 1
            window.sessionStorage['apply'] = JSON.stringify(row)
            this.$router.push({name : 'approval'+row.relationFormCode})
        },
        handleSkip1(row){
            window.sessionStorage['applyState'] = 2; // 查看表单
            window.sessionStorage['apply'] = JSON.stringify(row);
            this.$router.push({name : 'approval'+row.relationFormCode})
        },
        getDialogList(){
            this.$api.getRelationList().then(obj=>{
                let arr = Object.assign([],obj.data.data);
                let arr1 = arr.map((v,i)=>{
                      let o =   this.bench_obj[v.code];
                      this.allOptions.push(v.code);
                      return {...v,...o};  
                })
                this.drop_data_dialog = Object.assign([],arr1);
                this.sortList();
            })
        },
        editLayout(){
            let codeList =  [];
            this.drop_data.map((v)=>{
                codeList.push(v.code);
            })
            codeList = codeList.join(',');
            this.$api.insertUserCardRelation({codeList}).then(obj=>{
                this.$message.success('保存成功!');
            })
        },
        sortList(){
            let str = this.checkedList.join(',');
            let arr = [];
            this.drop_data_dialog.forEach(v=>{
                if((new RegExp(v.code)).test(str)){
                    arr.push(v.code);
                }
            })
            this.checkedList = Object.assign([],arr);
        },
        // 提交此次编辑部件的结果
        editCompoent(type){
            let codeList = this.checkedList.join(',');
            let sortCodeList  = [];
            this.drop_data_dialog.forEach(v=>{
                sortCodeList.push(v.code);
            })
            sortCodeList = sortCodeList.join(',');
            this.$api.insertUserCardRelation({codeList,sortCodeList}).then(obj=>{
                this.$message.success('保存成功!');
                this.diaShow = false;
                this.is_store_layout = false;
                this.getLayout();
            })
        },
        // 新增和编辑部件弹窗
        addModel(){
            // 获取可用部件列表
            this.diaShow = true;
            this.getDialogList();
        },
        // 更多 删除 点击对应处理
        optionClick(item){
            let {btnText , itemInfo} = item;
            switch(btnText){
                case "更多":
                if(this.historyName[item.itemInfo.code].methods){
                    this.historyName[item.itemInfo.code].methods();
                }
                this.$router.push({name : this.historyName[item.itemInfo.code].name});
                //   switch(item.code){

                //   }
                break;
                case "删除":
                    this.$confirm('确认删除'+this.bench_obj[itemInfo.code].name+'卡片?','提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        this.$api.delUserCardRelation({code : itemInfo.code}).then(obj=>{
                            let arr = [];
                            let arr1 = [];
                            arr = this.checkedList.filter((v)=>{
                                return v != itemInfo.code;
                            })
                            this.drop_data.forEach((v)=>{
                                if( v.code != itemInfo.code){
                                    arr1.push(v);
                                }
                            })
                            this.checkedList = Object.assign([],arr);
                            this.drop_data = Object.assign([],arr1);
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        })
                    })
                break;
            }
        },
        gainAllData(){
            this.drop_data.forEach((v)=>{
                switch(v.code){
                    case "startapprove":
                        this.getApproveList(v.code);
                    break;
                    case "endexam":
                        this.getEndExamList(v.code);
                    break;
                    case "pendingexam":
                        this.getNoExamList(v.code);
                    break;
                    case "pendingapprove":
                        this.getNoApproveList(v.code);
                    break;
                    case "endapprove":
                        this.getEndApproveList(v.code);
                    break;
                    case "recordlog":
                        this.getRecordList(v.code);
                    break;
                    case "hrstatistics":
                        this.getMemsList(v.code);
                    break;
                }
            })
        },
        // 人事统计
        getMemsList(code){
            Date.prototype.Format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
            }
            var date = new Date(),
            y = date.getFullYear(),
            m = date.getMonth();
            let DateValue1 = new Date(y, m, 1).Format("yyyy-MM-dd");
            let DateValue2 = new Date(y, m + 1, 0).Format("yyyy-MM-dd");
            this.$api.monthlyStatistics({beginDate: DateValue1,endDate: DateValue2}).then((res) => {
               this.memsInfo =  Object.assign({},res.data.data);
                this.setIsEmpty(Object.keys(res.data.data),code);
            })
        },
        apply(item){
            window.sessionStorage['apply'] = JSON.stringify(item);
            window.sessionStorage['applyState'] = 0;
            this.$router.push({name : 'approval'+item.relationFormCode});
        },
        setIsEmpty(arr,code){
            let obj = Object.assign({},this.emptyObj);
            obj[code] = arr.length == 0;
            this.emptyObj = Object.assign({},obj);
        },
        //考试记录
        getRecordList(code){
            let listParam = {
                pageNum : 1 , 
                pageSize : 20,
                recordDate : this.$util.timestampToTime(global.NOWTIME).substring(0,7)
            }
            if(this.recordList.length != 0) return;
            this.$api.personalRecordLogSelf(listParam).then(res => {
                if(res.data.data.length > 7 ){
                    res.data.data.length = 7;
                }
                this.setIsEmpty(res.data.data,code);
                this.recordList = Object.assign([],res.data.data);
            });
        },
        // 已审批列表
        getEndApproveList(code){
            if(this.approveList.length != 0) return;
            this.$api.alreadyList({pageNum : 1 , pageSize : 4}).then(res => {
                if(res.data.data.list.length > 4 ){
                    res.data.data.list.length = 4;
                }
                this.setIsEmpty(res.data.data.list,code);
                this.approveList = Object.assign([],res.data.data.list);
            })
        },
        // 待审批列表
        getNoApproveList(code){
            if(this.noApproveList.length != 0) return;
            this.$api.waittaskList({pageNum : 1, pageSize : 4}).then(res => {
                let len =  res.data.data.list.length;
                let total = res.data.data.total;
                this.pendingapproveNum = (total > 4  ? total :　0);
                if(len > 4 ){
                    res.data.data.list.length = 4;
                }
                this.setIsEmpty(res.data.data.list,code);
                this.noApproveList = Object.assign([],res.data.data.list);
            })
        },
        // 为考试列表
        getNoExamList(code){
            if(this.noExamList.length != 0) return;
            this.$api.getNotOverExamList({pageNum : 1 , pageSize : 7}).then(res => {
                if(res.data.data.list.length > 7 ){
                    res.data.data.list.length = 7;
                }
                console.log(res.data.data.list);
                this.setIsEmpty(res.data.data.list,code);
                this.noExamList = Object.assign([],res.data.data.list);
            })
        },
        // 已考试列表
        getEndExamList(code){
            if(this.examList.length != 0) return;
            this.$api.getOverExamList({pageNum : 1 , pageSize : 7}).then(res => {
                if(res.data.data.list.length > 7 ){
                    res.data.data.list.length = 7;
                }
                console.log(res.data.data.list);
                this.setIsEmpty(res.data.data.list,code);
                this.examList = Object.assign([],res.data.data.list);
            })
        },
        // 获取发起审批列表
        getApproveList(code){
            let arr = [];
            if(this.approvelList.length != 0) return;
            this.$api.getTempListForUser().then(obj=>{
                if(obj.data.data && obj.data.data.length > 0){
                    obj.data.data.forEach((v)=>{
                        arr = [...arr,...v.flowTempList];
                    })
                }
                this.setIsEmpty(arr,code);
                if(arr.length > 10 ){
                    arr.length = 10;
                }
                this.approvelList = Object.assign([],arr);
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.bench{
    width: calc(100% + 40px);
    margin-left: -20px;
    .title{
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 4px;
        color: $gray_a;
        margin-left: 20px;
        position: relative;
        padding-right: 120px;
        span{
            color: $blue_a;
        }
        .titleInfo{
            font-size:14px;
            font-family:"Microsoft YaHei";
            font-weight:400;
            color:rgba(102,102,102,1);
        }
        .tri{   
            display: inline-block;
            position: relative;
            width: 8px;
            height: 4px;
            span{
                display: inline-block;
                width: 0;
                height: 0;
                border-top: 4px solid transparent;
                border-left: 4px solid transparent;
                border-bottom: 4px solid transparent;
                border-right: 4px solid #C2CBD5;
                position: absolute;
                top: -5px;
                left: -2px;
            }
        }
        .tri_active{
            span{
                border-right: 4px solid transparent;
                border-left: 4px solid #C2CBD5;
                left: 2px;
            }    
        }
        .addModelBtn{
            display: inline-block;
            width:80px;
            height:30px;
            background:rgba(31,158,251,1);
            border-radius:3px;
            font-size:12px;
            font-family:"Microsoft YaHei";
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height:30px;
            position: absolute;
            right: 36px;
            top: 50%;
            margin-top: -15px;

        }
    }
    .head{
        // min-width: 100%;
        display: inline-block;
        margin-top: 16px;
        margin-left: 1.5%;
        .content{
            height: 355px;
            .model{
                display: inline-block;
                text-align: center;
                margin-bottom: 40px;
                margin-left: 74px;
                width: 80px;

            }
            img{
                display: inline-block;
                width: 80px;
                height: 80px;
                border-radius: 10px;
            }
            .text{
                display: block;
                line-height: 1;
                font-size:14px;
                font-family:"Microsoft YaHei";
                font-weight:400;
                margin-top: 20px;
                color:$gray_b;
            }
            .info_model{
                width: 100%;
                display: flex;
                height: 80px;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #E3E8EE;
                .left{
                    display: flex;
                    align-items: center;
                    img{
                        display: inline-block;
                        width: 54px;
                        height: 54px;
                        border-radius: 50%;
                        margin-left: 10px;
                    }
                    .name{
                        font-size:14px;
                        font-family:"Microsoft YaHei";
                        color: $gray_b;
                        margin-left: 10px;
                        line-height: 1.2;
                    }
                }
                    .right{
                        font-size:14px;
                        font-family:"Microsoft YaHei";
                        font-weight:400;
                        color: $gray_b;
                        line-height: 1.2;
                    }
            }
            .mems_model{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .left,.right{
                    font-size:14px;
                    font-family:"Microsoft YaHei";
                    font-weight:400;
                    color: $gray_b;
                    line-height: 54px;
                    display: flex;
                    align-items: center;
                    white-space: nowrap;
                }
            }
            .info_model:last-of-type{
                border: none;
            }
            .info_model:first-of-type{
                margin-top: -8px;
            }
            .mems_model:first-of-type{
                margin-top: -10px;
            }
        }
        .con_content{
            width: 100%;
            height: 355px;
            box-sizing: border-box;
            background: white;
            border-top: 1px solid transparent;
            overflow: hidden;
        }
        .titleTip{
            font-size:12px;
            font-family:"Microsoft YaHei";
            font-weight:400;
            clear: $gray_a;
            margin-left: 10px;
            margin-top: 3px;
        }
        .proress{
            width: 220px;
            height: 10px;
            position: relative;
            margin-left: 20px;
        }
    }
    .head:hover{
        cursor: move;
    }
    .head1{
        width: 47.5%;
        // min-width: 900px;
        .content{
            padding: 5px 0  34px 0;
            height: 355px;
            box-sizing: border-box;
        }
        .con_content{
            height: 321px !important;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            height: 100%;
            padding-right:  80px;
        }
    }
    // 小的model
    .head2{
        width: 23%;
        // min-width: 440px;
    }
    // 有表格的model
    .head3{
        .con_content{
            padding: 0px 20px;
        }
    }
    .s1{
        color: #1F9EFB;
    }
    .s2{
        color: #52D99E;
    }
    .s3{
        color: #E96F6F;
    }
}

.checks{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    height: 40px;
    position: relative;
    margin-bottom: 1px;
    .iconfont{
        margin-right: 10px; 
    }
    .left{
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2;
    }
}
.emptyLogo{
    width: calc(100% - 40px);
    height: calc(100vh - 145px);
    margin-left: 20px;
    padding-top: 1px;
    margin-top: 16px;
    overflow: hidden;
    background: white;
    box-shadow:0px 0px 5px 0px rgba(221,221,221,1);
    border-radius:2px;
    img{
        display: block;
        width: 372px;
        height: 262px;
        margin: 200px auto 0;
    }
    p{
        text-align: center;
        font-size:24px;
        font-family:"Microsoft YaHei";
        font-weight:400;
        color:rgba(16,178,255,1);
    }
    button{
        display: block;
        width:150px;
        height:50px;
        background:rgba(16,178,255,1);
        border-radius:3px;
        font-size:20px;
        font-family:"Microsoft YaHei";
        font-weight:bold;
        color:rgba(255,255,255,1);
        margin: 50px auto 0;
    }
}
.contentNo{
    display: none !important;
}
@media screen and(max-width: 1700px){
    .bench{
        .head1{
           width: 96.5%;
        }
        .head2{
            width: 47.5%;
        }
        .title .addModelBtn{
            right: 2%;
        }
    }
}
@media screen and(max-width: 950px){
    .bench{
        .head1{
           width: 96.5%;
        }
        .head2{
            width: 96.5%;
        }
    }
}
</style>

