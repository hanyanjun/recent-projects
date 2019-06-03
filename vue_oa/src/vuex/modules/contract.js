import api from "../../api/core.js"
import { rejects } from "assert";
import validate from "../../util/validate.js"
const contract = {
    state : {
        params :{
            id : '',
            tab : 0
        },
        filterClassId: '',
        adColums:[
            {
                pro : 'conNo',
                label : '合同编号'
            },
            {
                pro : 'conName',
                label : '合同名称'
            },
            {
                pro : 'signDate',
                label : '合同签署日期'
            },
            {
                pro : 'ourSignBody',
                label : '甲方'
            },
            {
                pro : 'counterPart',
                label : '乙方'
            },
            {
                pro : 'workPlace',
                label : '职场'
            },
            {
                pro : 'dateCreated',
                label : '归档时间'
            }
        ],
        busColums : [
            {
                pro : 'contractNum',
                label : '合同编号'
            },
            {
                pro : 'contractName',
                label : '合同名称'
            },
            {
                pro : 'signDate',
                label : '合同签署日期'
            },
            {
                pro : 'partyA',
                label : '甲方'
            },
            {
                pro : 'partyB',
                label : '乙方'
            },
            {
                pro : 'createDate',
                label : '创建时间'
            },
        ],
        adBaseInfo : {
            conName :	"", //	合同名称 
            conNo:	"", //	合同编号
            conContent	: "", //	合同内容,
            className:	"", //	归档分类
            applicantName :"", //申请人,
            beginDate :	"", //	起始日期,
            motionDepart:	[], //	提案部门
            signCopies:	"", //	签约份数
            signDate:	"", //	签发日期
            fileSum:	"", //	归档份数
            endDate:	"", //	终止日期
            workplace:	"", //	职场
            conSum:	"", //	合同金额
            payForm:	"", //	结算方式
            applicant: "", //	申请人id,
            contractUrl:	"", //	合同附件
            conId : '', //合同id
            classId : '', //归档分类id
            remark : '' //备注

        },
        adBaseInfoCopy:{
            conName :	"", //	合同名称 
            conNo:	"", //	合同编号
            conContent	: "", //	合同内容,
            className:	"", //	归档分类
            applicantName :"", //申请人,
            beginDate :	"", //	起始日期,
            motionDepart:	[], //	提案部门
            signCopies:	"", //	签约份数
            signDate:	"", //	签发日期
            fileSum:	"", //	归档份数
            endDate:	"", //	终止日期
            workplace:	"", //	职场
            conSum:	"", //	合同金额
            payForm:	"", //	结算方式
            applicant: "", //	申请人id,
            contractUrl:	"", //	合同附件
            conId : '', //合同id
            classId : '', //归档分类id
            remark : '' //备注
        },
        receiptInfo:{
            bankCardAttribution : '',//	银行归属地	string	@mock=上海市黄浦区人民广场邮政支行
            bankCardNo : '',//	银行卡号	number	@mock=61700003569845624
            bankName : '',//	银行名称	string	@mock=邮政银行
            cardholderChName : '',//	持卡人中文姓名	string	@mock=刘备
            cardholderChNamePy : '',//	持卡人拼音	string	@mock=liubei
            cardholderNum	 : '',//持卡人身份证号	string	@mock=400422199009101230
            contractId : '',//	合同id	string	@mock=1 非空
            id : '',//	合同收款信息id	number	@mock=1
            swiftCode	 : '',//swift code
        },
        receiptInfoCopy:{
            bankCardAttribution : '',//	银行归属地	string	@mock=上海市黄浦区人民广场邮政支行
            bankCardNo : '',//	银行卡号	number	@mock=61700003569845624
            bankName : '',//	银行名称	string	@mock=邮政银行
            cardholderChName : '',//	持卡人中文姓名	string	@mock=刘备
            cardholderChNamePy : '',//	持卡人拼音	string	@mock=liubei
            cardholderNum	 : '',//持卡人身份证号	string	@mock=400422199009101230
            contractId : '',//	合同id	string	@mock=1 非空
            id : '',//	合同收款信息id	number	@mock=1
            swiftCode	 : '',//swift code
        },
        busSignInfo:{
            contractId: '',//合同id	number	@mock=1
            details : [
                {	 //签署详细信息	array<object>	
                    contractSignDetailId	: '',//签署详细信息id	number	@mock=1
                    counterpart	: '',//向对方	string	@mock=向对方
                    counterpartAuthDeputy	: '',//授权代表	string	@mock=授权代表
                    counterpartBodyPosition: '',//	主体地位	string	@mock=2 查看数字字典类型 type=body_position
                    counterpartSignDate	: '',//签署日期	string	@mock=2018-01-01
                    partyBAcceptPerson: '',//	乙方收件人	string	@mock=火星人
                    partyBAddress: '',//	乙方地址	string	@mock=火星路666号
                    partyBContact	: '',//乙方联系方式	string	@mock=13066666666
                    signPersionContact: '',//	签署人联系方式	string	@mock=13098745632
                    signPerson: '',//	签署人: '',//	string	@mock=签署人
                }
            ],    
            introducer: '',//	介绍人	string	@mock=张飞
            ourAuthDeputy	: '',//授权代表	string	@mock=某某
            ourBodyPosition: '',//	主体地位	string	@mock=1 查看数字字典类型 type=body_position
            ourSignBody	: '',//我方签约主体	number	@mock=1
            ourSignBodyName : '',
            ourSignDate	: '',//签署日期	object	@mock=2018-01-01
            partyAAcceptPerson : '',//	甲方收件人	string	@mock=小李
            partyAAddress: '',//	甲方地址	string	@mock=仙霞西路
            partyAContact: '',//	甲方联系方式
        },
        busSignInfoCopy:{
            contractId: '',//合同id	number	@mock=1
            details : [
                {	 //签署详细信息	array<object>	
                    contractSignDetailId	: '',//签署详细信息id	number	@mock=1
                    counterpart	: '',//向对方	string	@mock=向对方
                    counterpartAuthDeputy	: '',//授权代表	string	@mock=授权代表
                    counterpartBodyPosition: '',//	主体地位	string	@mock=2 查看数字字典类型 type=body_position
                    counterpartSignDate	: '',//签署日期	string	@mock=2018-01-01
                    partyBAcceptPerson: '',//	乙方收件人	string	@mock=火星人
                    partyBAddress: '',//	乙方地址	string	@mock=火星路666号
                    partyBContact	: '',//乙方联系方式	string	@mock=13066666666
                    signPersionContact: '',//	签署人联系方式	string	@mock=13098745632
                    signPerson: '',//	签署人: '',//	string	@mock=签署人
                }
            ],    
            introducer: '',//	介绍人	string	@mock=张飞
            ourAuthDeputy	: '',//授权代表	string	@mock=某某
            ourBodyPosition: '',//	主体地位	string	@mock=1 查看数字字典类型 type=body_position
            ourSignBody	: '',//我方签约主体	number	@mock=1
            ourSignBodyName : '',
            ourSignDate	: '',//签署日期	object	@mock=2018-01-01
            partyAAcceptPerson : '',//	甲方收件人	string	@mock=小李
            partyAAddress: '',//	甲方地址	string	@mock=仙霞西路
            partyAContact: '',//	甲方联系方式
        },
        busBaseInfo:{
            channelDeptId : [], //	渠道部门id	number	@mock=1 非空
            channelManagerId : '', //	渠道经理id	number	@mock=1 非空
            channelManagerName : '', //渠道经理name
            contractBusinessFile  : '', //	合同文件	string	@mock=file/inrecoag/1/asdgwee48.pdf 非空
            contractBusinessPic : [], //	合同补充信息	array<string>	@mock=$order('pic/inrecoag/1/asdgwee48.jpg','pic/inrecoag/1/asdgwee48.jpg')
            contractId	 : '', //合同id	number	@mock=1 非空
            contractName : '', //	合同名称	string	@mock=sdgegew 非空
            contractNum	 : '', //合同编号	string	@mock=1462363202 非空
            contractSortId : '', //	归档到	number	@mock=1 非空
            effectiveDate  : '', //	生效日期	string	@mock=2018-01-01T12:30:30 非空
            endDate : '', //	终止日期	string	@mock=2018-01-01T12:30:30
            partyA : '', //	甲方	number	@mock=1 非空
            partyB : '', //	乙方	string	@mock=某某 非空
            partyBContact : '', //	乙方联系方式	string	@mock=1300000000 非空
            receivedMaterial : [], //	收到材料
            billingCurrency : '', //币种
            type :'inrecoag',
        },
        busBaseInfoCopy:{
            channelDeptId : [], //	渠道部门id	number	@mock=1 非空
            channelManagerId : '', //	渠道经理id	number	@mock=1 非空
            channelManagerName : '', //渠道经理name
            contractBusinessFile  : '', //	合同文件	string	@mock=file/inrecoag/1/asdgwee48.pdf 非空
            contractBusinessPic : [], //	合同补充信息	array<string>	@mock=$order('pic/inrecoag/1/asdgwee48.jpg','pic/inrecoag/1/asdgwee48.jpg')
            contractId	 : '', //合同id	number	@mock=1 非空
            contractName : '', //	合同名称	string	@mock=sdgegew 非空
            contractNum	 : '', //合同编号	string	@mock=1462363202 非空
            contractSortId : '', //	归档到	number	@mock=1 非空
            effectiveDate  : '', //	生效日期	string	@mock=2018-01-01T12:30:30 非空
            endDate : '', //	终止日期	string	@mock=2018-01-01T12:30:30
            partyA : '', //	甲方	number	@mock=1 非空
            partyB : '', //	乙方	string	@mock=某某 非空
            partyBContact : '', //	乙方联系方式	string	@mock=1300000000 非空
            receivedMaterial : [], //	收到材料
            billingCurrency : '', //币种
            type :'inrecoag',
        },
        authInfo : {
            address	: '',//地址	string	@mock=详情路
            contractAuthData: [],//	授权资料协议附件	array<string>	@mock=$order('img/xx','img/xxx')
            entrustUnit: '',//	委托单位	string	@mock=第三方担保公司
            id: '',//	授权收款信息键值	number	@mock=1
            idCard: '',//	身份证号		@mock=400888256981200
            legalRepresentative: '',//	法定代表人	string	@mock=曹操
            mobile: '',//	手机	string	@mock=188888888888
            openBank: '',//	开户行	string	@mock=邮政银行
            position: '',//	职位	string	@mock=军师
            principalName	: '',//委托人姓名	string	@mock=曹植
            receiptAccount: '',//	收款账号	string	@mock=8888888888888
            sginDate: '',//	签署日期	object	@mock=2018-01-01
            type: 'inrecoag',//	文件分类类型
        },
        authInfoCopy:{
            address	: '',//地址	string	@mock=详情路
            contractAuthData: [],//	授权资料协议附件	array<string>	@mock=$order('img/xx','img/xxx')
            entrustUnit: '',//	委托单位	string	@mock=第三方担保公司
            id: '',//	授权收款信息键值	number	@mock=1
            idCard: '',//	身份证号		@mock=400888256981200
            legalRepresentative: '',//	法定代表人	string	@mock=曹操
            mobile: '',//	手机	string	@mock=188888888888
            openBank: '',//	开户行	string	@mock=邮政银行
            position: '',//	职位	string	@mock=军师
            principalName	: '',//委托人姓名	string	@mock=曹植
            receiptAccount: '',//	收款账号	string	@mock=8888888888888
            sginDate: '',//	签署日期	object	@mock=2018-01-01
            type: 'inrecoag',//	文件分类类型
        },
        busBaseRules : {
            contractName: [
                { required: true, message: '请输入合同名称', trigger: 'blur' },
            ],
            partyBContact: [
                { required: true, message: '请输入联系方式', trigger: 'blur' },
                { validator: validate.validateNum, trigger: 'blur' }
            ],
            contractNum: [
                { required: true, message: '请输入合同编号', trigger: 'blur' },
            ],
            partyA: [
                { required: true, message: '请选择甲方', trigger: 'change' },
            ],
            partyB: [
                { required: true, message: '请输入乙方', trigger: 'blur' },
            ],
            channelDeptId: [
                { required: true, message: '请选择渠道部门', trigger: 'change' },
            ],
            channelManagerId: [
                { required: true, message: '请选择渠道经理', trigger: 'change' },
            ],
            effectiveDate: [
                { required: true, message: '请选择生效日期', trigger: 'change' },
            ],
            contractSortId: [
                { required: true, message: '请选择归档分类', trigger: 'change' },
            ],
            receivedMaterial: [
                { required: true, message: '请选择收到材料', trigger: 'change' },
            ],
            billingCurrency: [
                { required: true, message: '请选择币种', trigger: 'change' },
            ],
        },
        busPreColums: [
            {
                pro : 'partyA',
                label : '甲方'
            },{
                pro : 'partyB',
                label : '乙方'
            },{
                pro : 'channelDept',
                label : '渠道部门'
            },{
                pro : 'channelManager',
                label : '渠道经理'
            },{
                pro : 'partyBContact',
                label : '销售联系方式'
            },{
                pro : 'contractSortName',
                label : '归档分类'
            },{
                pro : 'billingCurrency',
                label : '结算币种'
            },{
                pro : 'receivedMaterial',
                label : '收到证件资料'
            },{
                pro : 'authDeputy',
                label : '授权代表'
            },{
                pro : 'signDate',
                label : '签约日期'
            },
        ],
        adPreColums:[
            {
                pro : 'signBodyDetailResp',
                label : ''
            },{
                pro : 'applicantName',
                label : '申请人'
            },{
                pro : 'motionDepartName',
                label : '申请部门'
            },{
                pro : 'conContent',
                label : '合同内容'
            },{
                pro : 'beginDate',
                label : '生效日期'
            },{
                pro : 'endDate',
                label : '终止日期'
            },{
                pro : 'conSum',
                label : '合同总金额'
            },{
                pro : 'fileSum',
                label : '合同总份数'
            },
            {
                pro : 'payForm',
                label : '结算方式'
            }
            ,{
                pro : 'signCopies',
                label : '存档数'
            },
            // {
            //     pro : 'partyA',
            //     label : '备注'
            // },
        ],
        signBodyInfo : {
            conId : '', //合同id
            ourSignBody :	"", //	我方签约主体 
            ourSignBodyName : '',
            ourBodyPosition:	"", //	我方主体地位
            list : [
                {
                    counterpart	: "", //	对方签约主体,
                    counterpartBodyPosition:	""//	对象主体地位d
                }
            ]
        },
        signBodyInfoCopy:{
            conId : '', //合同id
            ourSignBody :	"", //	我方签约主体 
            ourSignBodyName : '',
            ourBodyPosition:	"", //	我方主体地位
            list : [
                {
                    counterpart	: "", //	对方签约主体,
                    counterpartBodyPosition:	""//	对象主体地位d
                }
            ]
        },
        payInfo :{
            bandHome : '',//	银行卡归属地	string	@mock=上海农业路支行
            bandName: '',//	开户行	string	@mock=建行
            cardNo: '',//	卡号	string	@mock=6217002222222222222
            cardOwnerName: '',//	持卡人姓名	string	@mock=张三
            cardOwnerNo: '',//	持卡人身份证号	string	@mock=410766198524114442
            cardOwnerSpell: '',//	持卡人姓名拼音	string	@mock=zhangsan
            paymentCurrency	: '',//付款币种	string	@mock=RMB
            swiftCode: '',//	swiftCode
        },
        payInfoCopy:{
            bandHome : '',//	银行卡归属地	string	@mock=上海农业路支行
            bandName: '',//	开户行	string	@mock=建行
            cardNo: '',//	卡号	string	@mock=6217002222222222222
            cardOwnerName: '',//	持卡人姓名	string	@mock=张三
            cardOwnerNo: '',//	持卡人身份证号	string	@mock=410766198524114442
            cardOwnerSpell: '',//	持卡人姓名拼音	string	@mock=zhangsan
            paymentCurrency	: '',//付款币种	string	@mock=RMB
            swiftCode: '',//	swiftCode
        },
        signBodyInfoRules:{
            counterpart :[
                // { min: 1 ,max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
            ]
        },
        adBaseRules : {
            conName: [
                { required: true, message: '请输入合同名称', trigger: 'blur' },
            ],
            conNo: [
                { required: true, message: '请输入合同编号', trigger: 'blur' },
            ],
            beginDate: [
                { required: true, message: '请选择起始日期', trigger: 'change' },
            ],
            motionDepart: [
                { required: true, message: '请选择提案部门', trigger: 'change' },
            ],
            signCopies: [
                { required: true, message: '请输入签约份数', trigger: 'blur' },
                { validator: validate.validateNum, trigger: 'blur' }
            ],
            signDate: [
                { required: true, message: '请选择签发日期', trigger: 'change' },
            ],
            endDate: [
                { required: true, message: '请选择终止日期', trigger: 'change' },
            ],
            workplace: [
                { required: true, message: '请输入职场', trigger: 'blur' },
            ],
            payForm: [
                { required: true, message: '请选择结算方式', trigger: 'change' },
            ],
            conContent:[
                { required: true, message: '请输入合同内容', trigger: 'blur' },
            ],
            className:[
                { required: true, message: '请选择归档分类', trigger: 'change' },
            ],
            applicantName:[
                { required: true, message: '请选择申请人', trigger: 'change' },
            ]
        },
    },
    mutations : {

    },
    actions : {
        getContractInfo({state,dispatch},payload){
            return new Promise((resolve,reject)=>{
                let params = state.params;
                if(params.tab == 0 || payload.upTab0){ 
                    state.adBaseInfo = Object.assign({},state.adBaseInfoCopy);   
                    api.getConAdminBaseDetail(state.params.id).then(obj=>{
                        if(obj.data.data){
                            state.adBaseInfo = obj.data.data;
                            state.adBaseInfo.conId = state.params.id;
                        }
                        let id = state.adBaseInfo.motionDepart;
                        state.adBaseInfo.motionDepart = [];
                        resolve(id);
                    })
                }
                if(params.tab == 1  || payload.tab == 1 || payload.upTab1){
                    state.signBodyInfo = Object.assign({},state.signBodyInfoCopy);   
                    api.getConAdminSignBodyDetail(state.params.id).then(obj=>{
                         let data = obj.data.data;
                         if(data){
                            state.signBodyInfo.ourBodyPosition = data.ourBodyPosition;
                            // 选择数据 再映射不上 就看后端是不是又把code值改为数字类型 目前是字符串类型
                            if(data.ourSignBody){
                                state.signBodyInfo.ourSignBody = data.ourSignBody;
                            }
                            state.signBodyInfo.list = Object.assign([],obj.data.data.counterpartList);
                         }
                        state.signBodyInfo.conId = state.params.id;
                    })
                }else if(params.tab == 2  || payload.tab == 2 || payload.upTab2){
                    state.payInfo = Object.assign({},state.payInfoCopy);  
                    api.getConAdminPaymentDetail(state.params.id).then(obj=>{
                        if(obj.data.data){
                            state.payInfo = Object.assign({},obj.data.data);
                        }
                        state.payInfo.conId = state.params.id;
                    })
                }
            })
        },
        getBusContractInfo({state},payload){
            return new Promise((resolve,reject)=>{
                let params = state.params;
                if(params.tab  == 0 ||  payload.upTab0){ 
                    state.busBaseInfo = Object.assign({},state.busBaseInfoCopy);      
                    api.busContractDetail(state.params.id).then(obj=>{
                        if(obj.data.data){
                            state.busBaseInfo = Object.assign(state.busBaseInfo,obj.data.data);
                            state.busBaseInfo.receivedMaterial = JSON.parse(state.busBaseInfo.receivedMaterial);   
                        } 
                        let id = state.busBaseInfo.channelDeptId;
                        state.busBaseInfo.channelDeptId = [];
                        resolve(id);
                    })
                }
                if(params.tab == 1  || payload.tab  == 1 || payload.upTab1){
                    state.busSignInfo = JSON.parse(JSON.stringify(state.busSignInfoCopy));  
                    api.signBusInfo(state.params.id).then(obj=>{
                        if(obj.data.data){                  
                            state.busSignInfo = Object.assign(state.busSignInfo,obj.data.data);
                            if(state.busSignInfo.ourSignBody){
                                state.busSignInfo.ourSignBody = String(state.busSignInfo.ourSignBody);
                            }
                        }
                        state.busSignInfo.contractId = state.params.id;
                    })
                }
                else if(params.tab == 2  || payload.tab == 2 || payload.upTab2) {
                    state.receiptInfo = Object.assign({},state.receiptInfoCopy);  
                    api.receiptBusInfo(state.params.id).then(obj=>{
                        if(obj.data.data){
                            state.receiptInfo = Object.assign(state.receiptInfo,obj.data.data);
                        }
                        state.receiptInfo.contractId = state.params.id;
                        // console.log(obj);
                        // console.log('收款信息');
                    })
                }
                else if(params.tab == 3  || payload.tab == 3 || payload.upTab3){
                    state.authInfo = Object.assign({},state.authInfoCopy); 
                    api.authReceiptBusInfo(state.params.id).then(obj=>{
                        if(obj.data.data){
                            state.authInfo = Object.assign(state.authInfo,obj.data.data);
                        }
                        state.authInfo.contractId = state.params.id;
                        console.log(state.authInfo);
                        // console.log(obj);
                        // console.log('收款信息');
                    })   
                }
            })
        },
    }


}
export default contract;