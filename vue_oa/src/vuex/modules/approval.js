import api from "../../api/core.js"
import validate from "../../util/validate.js"
import { resolve } from "path";
const approval = {
    state : {
        leaveApplyInfo : {
            approveDate	: '' ,// 申请日期	object	非空
            approveNum	: '' ,//	审批单号	string	二次提交时必须提交
            leaveDay	: '' ,//	请假天数(天)	number	非空
            leaveEndTime	: '' ,//	结束日期	object	非空
            leaveHour	: '' ,//	请假时长(小时)	number	非空
            leaveStartTime	: '' ,//	开始日期	object	非空
            leaveType	: '' ,//	请假类型（查看字典type=leaveType）	string	非空
            reason	: '' ,//	请假原因	string	非空
            templateId	: '' ,//	模板id
        },
        leaveApplyInfoCopy : {
            approveDate	: '' ,// 申请日期	object	非空
            approveNum	: '' ,//	审批单号	string	二次提交时必须提交
            leaveDay	: '' ,//	请假天数(天)	number	非空
            leaveEndTime	: '' ,//	结束日期	object	非空
            leaveHour	: '' ,//	请假时长(小时)	number	非空
            leaveStartTime	: '' ,//	开始日期	object	非空
            leaveType	: '' ,//	请假类型（查看字典type=leaveType）	string	非空
            reason	: '' ,//	请假原因	string	非空
            templateId	: '' ,//	模板id
        },
        overtimeInfo : {
            approveDate : '',//	申请日期	object	非空
            approveNum: '',//	审批单号	string	二次提交时必须填写
            reason: '',//	加班原因	string	非空
            records: [
                {type : '工作日加班' ,startTime : '2018-11-05' , duration : '3'  },
                {type : '加班总时长' ,startTime : '2018-11-05' , duration : ''  },
            ],//	加班明细	array<object>	非空
            templateId: '',//	模板id
        },
        overtimeItem :{
            duration: '',//	加班时长	number	非空
            endTime: '',//	结束时间	object	非空
            startTime: '',//	开始时间	object	非空
            type	: '',//加班类型（查看字典type=overtimeType）	string	非空
        },
        overtimeInfoRules : {
            reason : [
                { required: true, message: '请填写加班原因', trigger: 'blur' },
                // { validator: validate.validateCharacter, trigger: "blur" }
            ],
            records : [
                { required: true, message: '请添加加班明细', trigger: 'change' },
            ]
        },
    },
    mutations : {

    },
    actions : {
        gainProcess({state},payload){
            return new Promise((resolve,reject)=>{
                if(payload){
                    let params = {flowDefinitionId : payload.flowDefinitionId ,formNo : payload.formNo , processInstanceId : payload.processInstanceId ,relationFormCode : payload.relationFormCode }
                    api.approvalFormShow(params).then(obj=>{
                        resolve(obj.data.data);
                    }).catch(obj=>{
                        reject(obj);
                    })
                }else{
                    reject('参数错误');
                }
            })
        }
    }
}
export default approval;