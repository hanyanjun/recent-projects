import api from "../../api/core.js"
import validate from "../../util/validate.js"
import util from '../../util'
import { resolve } from "url";
const exam ={
    state : {
        colums : [
            {
              pro : 'examName',
              label : '考试名称',
              width : 240
            },
            {
              pro : 'examStartTime',
              label : '参考时间',
              width : 240
            },
            {
              pro : 'examDuration',
              label : '答卷时长(分钟)'
            },
            {
              pro : 'totalScore',
              label : '总分'
            },
            {
              pro : 'qualifiedScore',
              label : '及格分数'
            },
            {
              pro : 'totalUser',
              label : '应考人数'
            },
            {
              pro : 'examStatus',
              label : '考试状态'
            },
        ],
        topicDetail : {
            selectQueRules:[
            ],//		抽提规则	array<object>	非空
            topicTypeId: '',//		题型分类主键值	number	@mock= 49 非空
            topicTypeName :''
        },
        topicItem :{
            details : [],//	规则详细列表	array<object>	非空
            missSelect : '',//	漏选是否得分（Y / N）	string	@mock=N
            questionScore : '',//	每题分值	number	@mock=2 非空
            topicType : '',//	题目类型（1：单选题:2：多选题:3：判断题等）	string	@mock=1 非空
        },
        examInfo : {
            examName	: '',//考试名称	string	@mock=港险业务知识考试 非空
            examEndTime: '',//	参考结束时间	string	@mock=2018-09-14 13:45:00 非空
            examTime : '',
            examStatus : '0',
            examStartTime	: '',//参考开始时间	string	@mock=2018-09-14 13:30:00 非空
            examDuration: '',//	答卷时长	number	@mock=30
            examQualifiedScore: '',//	及格分数	number	@mock=80 非空
            testType: '0',//	组卷方式 (0：随机组卷)	string	@mock=0 非空
            examDesc: '',//	考试说明	string	@mock=港险业务知识测试
            examDeptIds	: [],//参考人员-部门id列表	array<number>	@mock=$order(1,2,3) （部门和人字段至少有一个不为空）
            examUserIds	: [],//参考人员-参考人userid列表	array<number>	@mock=$order(1002,2056) （部门和人字段至少有一个不为空）
            cheatChangePageCount: '',//	防作弊设置-切换页面次数	number	@mock=5
            cheatAnswerTimeout : '',//	防作弊设置-答题时超（秒）	number	@mock=20
            topics : [
                {
                    details : [],//	规则详细列表	array<object>	非空
                    missSelect : '',//	漏选是否得分（Y / N）	string	@mock=N
                    questionScore : '',//	每题分值	number	@mock=2 非空
                    topicType : '',//	题目类型（1：单选题:2：多选题:3：判断题等）	string	@mock=1 非空
                    detailsId : [],
                },
                
            ]
        },
        examCopyInfo : {
            examName	: '',//考试名称	string	@mock=港险业务知识考试 非空
            examEndTime: '',//	参考结束时间	string	@mock=2018-09-14 13:45:00 非空
            examTime : '',
            examStatus : '0',
            examStartTime	: '',//参考开始时间	string	@mock=2018-09-14 13:30:00 非空
            examDuration: '',//	答卷时长	number	@mock=30
            examQualifiedScore: '',//	及格分数	number	@mock=80 非空
            testType: '0',//	组卷方式 (0：随机组卷)	string	@mock=0 非空
            examDesc: '',//	考试说明	string	@mock=港险业务知识测试
            examDeptIds	: [],//参考人员-部门id列表	array<number>	@mock=$order(1,2,3) （部门和人字段至少有一个不为空）
            examUserIds	: [],//参考人员-参考人userid列表	array<number>	@mock=$order(1002,2056) （部门和人字段至少有一个不为空）
            cheatChangePageCount: '',//	防作弊设置-切换页面次数	number	@mock=5
            cheatAnswerTimeout : '',//	防作弊设置-答题时超（秒）	number	@mock=20
            topics : [
                {
                    details : [],//	规则详细列表	array<object>	非空
                    missSelect : '',//	漏选是否得分（Y / N）	string	@mock=N
                    questionScore : '',//	每题分值	number	@mock=2 非空
                    topicType : '',//	题目类型（1：单选题:2：多选题:3：判断题等）	string	@mock=1 非空
                    detailsId : [],
                },
                
            ]
        },
        examRules:{
            examName : [
                { required: true, message: '请输入考试名称', trigger: 'blur' },
            ],
            examTime : [
                { required: true, message: '请选择参考时间', trigger: 'blur' },
            ],
            examDuration: [
                { required: true, message: '请输入答卷时长', trigger: 'blur' }, //输入范围 0 ~ 999分钟
                { validator: validate.validateFloatLimit10_180, trigger: 'blur' },
            ],
            examQualifiedScore : [
                { required: true, message: '请输入及格分数', trigger: 'blur' }, //不大于题目总分
                { validator: validate.validateFloat, trigger: 'blur' },
            ],
            // 默认选中随机组卷
            testType:[
                { required: true, message: '请选择组卷方式', trigger: 'blur' },
            ],
            examDesc:[
                { min: 1 ,max: 50, message: '请输入考试说明', trigger: 'blur' }
            ],
            cheatAnswerTimeout : [
                { validator: validate.validateIntLimit0_99, trigger: 'blur' },
            ],
            cheatChangePageCount : [
                { validator: validate.validateIntLimit0_99, trigger: 'blur' },
            ],
            questionScore : [
                { validator: validate.validateFloatLimit1_10, trigger: 'blur' },
            ],
        }
    },
    mutations:{

    },
    actions:{
        setCookiesExam({rootState,state},payload){
            // setTimeout(()=>{
            window.sessionStorage.removeItem('_examQues');
            window.sessionStorage.removeItem('_examIndex');
            // },400)
            util.setCookie(rootState.headInfo.userId + '_examId', payload.id);
            util.setCookie(rootState.headInfo.userId + '_examType', payload.type);
            util.setCookie(rootState.headInfo.userId + '_examTestId', payload.examId);
        },
        getCookiesExam({rootState,state},payload){
            return new Promise(resolve=>{
                let id =  util.getCookie(rootState.headInfo.userId + '_examId');
                let type =  util.getCookie(rootState.headInfo.userId + '_examType');
                let examId =  util.getCookie(rootState.headInfo.userId + '_examTestId');
                resolve ({id : id,type : type , examId : examId});
            })
        }
    }
}
export default exam;