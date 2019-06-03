import api from "../../api/core.js"
import validate from "../../util/validate.js"
const company = {
    state : {
        params :{
            id : '',
            tab : 0
        },
        annInPreList : [],
        baseInfoRules : {
            companyName: [
                { required: true, message: '请输入公司名称', trigger: 'blur' },
                // { min: 1 ,max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
            ],
            companyEname: [
                { required: true, message: '请输入英文名', trigger: 'blur' },
                // { min: 1 ,max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
                { validator: validate.validateEn, trigger: 'blur' }
            ],
            companyDataCode: [
                { required: true, message: '请输入企业资料编码', trigger: 'blur' },
                // { min: 1 ,max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
            ],
            registrationAddress: [
                { required: true, message: '请输入注册地', trigger: 'blur' },
                // { min: 1 ,max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
            ],
            registrationTime: [
                { required: true, message: '请选择注册时间', trigger: 'blur' },
            ],
            legalPerson: [
                { required: true, message: '请输入法人', trigger: 'blur' },
                // { min: 1 ,max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
            ],
            // companyPrincipal: [
                // { min: 1 ,max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
            // ],
            isUnitsContract: [
                { required: true, message: '请选择是否与其他单位订立合约', trigger: 'change' }
            ],
            companyPrincipal : [
                { required: true, message: '请输入公司开设负责人', trigger: 'blur' },
                // { min: 1 ,max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
            ],
            contractNumPrefix: [
                { required: true, message: '请输入合同编号规则前缀', trigger: 'blur' },
                // { min: 1 ,max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
            ]
        },
        baseInfo : {
            companyName : '', //公司名称  必填 1-50
            companyEname : '', //英文名
            companyDataCode : '', //企业资料编码  必填 1-50
            registrationAddress : '', //注册地  必填 1-50
            registrationTime : '',//注册时间  必填
            legalPerson : '',//法人
            isUnitsContract : '', //是否有与其他单位订立合约（Y / N）
            companyPrincipal : '',//	公司开设负责人
            contractNumPrefix : ''    //	合同编号规则前缀
        },
        baseInfoCopy:{
            companyName : '', //公司名称  必填 1-50
            companyEname : '', //英文名
            companyDataCode : '', //企业资料编码  必填 1-50
            registrationAddress : '', //注册地  必填 1-50
            registrationTime : '',//注册时间  必填
            legalPerson : '',//法人
            isUnitsContract : '', //是否有与其他单位订立合约（Y / N）
            companyPrincipal : '',//	公司开设负责人
            contractNumPrefix : ''    //	合同编号规则前缀
        },
        annInspInfo : [
            {
                annualInspection : '', //	年检
                annualInspectionInfo : '', //	年检年份
                annualReport : '',  //年报
                companyId : '', //公司id
                fdiFeAnnualInspection : '', //	FDI外汇年检
                id : '',  //年检信息id
                isAnnualInspectionOver : '',  //年检是否完成
                jointAnnualInspection : '',  //		联合年检
                onlinePublicity : '', //网上公示
                settlementPayment : '',  //汇算清缴
            }
        ],
        annInspInfoCopy : [
            {
                annualInspection : '', //	年检
                annualInspectionInfo : '', //	年检年份
                annualReport : '',  //年报
                companyId : '', //公司id
                fdiFeAnnualInspection : '', //	FDI外汇年检
                id : '',  //年检信息id
                isAnnualInspectionOver : '',  //年检是否完成
                jointAnnualInspection : '',  //		联合年检
                onlinePublicity : '', //网上公示
                settlementPayment : '',  //汇算清缴
            }
        ],
        otherInfoRules:{
            // accountInfo: [
                // { min: 1 ,max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
            // ],
            // bankInfo: [
                // { min: 1 ,max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
            // ],
            // generalManager: [
                // { min: 1 ,max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
            // ],
            // secretaryCompany: [
                // { min: 1 ,max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
            // ],
            // value:[
                // { min: 1 ,max: 2, message: '长度在 1 到 50 个字符', trigger: 'blur' }
            // ]
        },
        otherBaseInfo : {
            accountInfo : '', //	账户信息
            bankInfo : '', //银行信息
            companyId : '',  //公司id
            director : [{value : ''}], //董事
            generalManager : '', //总经理
            id : '',  //基本信息id
            isOpenAccount : '',  //银行账户是否开立
            isRelationCompany : '',  //	是否有子母公司
            secretaryCompany : '', //秘书公司
            supervisorOne : [{value : ''}],  //监事一
            supervisorTwo : [{value : ''}], //监事二
        },
        otherBaseInfoCopy:{
            accountInfo : '', //	账户信息
            bankInfo : '', //银行信息
            companyId : '',  //公司id
            director : [{value : ''}], //董事
            generalManager : '', //总经理
            id : '',  //基本信息id
            isOpenAccount : '',  //银行账户是否开立
            isRelationCompany : '',  //	是否有子母公司
            secretaryCompany : '', //秘书公司
            supervisorOne : [{value : ''}],  //监事一
            supervisorTwo : [{value : ''}], //监事二
        },
        financeInfo : {
            commissionerAddress : '', //		专管员地址
            commissionerContact : '', //	专管员联系方式
            id : '',  //	公司财务信息id
            isBusHappen : '', //是否有业务发生
            onlineBankInfo : '', //网银信息
            taxApproval : '',  //	税种核定
            taxCommissioner : '',  //税务专管员	
            taxType : '',  //	税种
        },
        financeInfoCopy:{
            commissionerAddress : '', //		专管员地址
            commissionerContact : '', //	专管员联系方式
            id : '',  //	公司财务信息id
            isBusHappen : '', //是否有业务发生
            onlineBankInfo : '', //网银信息
            taxApproval : '',  //	税种核定
            taxCommissioner : '',  //税务专管员	
            taxType : '',  //	税种
        },
        colums:[
            {
                pro : 'companyName',
                label : '公司名称'
            },
            {
                pro : 'companyEname',
                label : '公司英文名'
            },
            {
                pro : 'companyDataCode',
                label : '企业资料编码'
            },
            {
                pro : 'registrationAddress',
                label : '注册地'
            },
            {
                pro : 'registrationTime',
                label : '注册时间'
            },
            {
                pro : 'legalPerson',
                label : '法人'
            },
            {
                pro : 'status',
                label : '是否使用'
            }
        ],
    },
    mutations : {

    },
    actions : {
        getCompanyInfo({state},payload){
            let params =  state.params;
            if(params.tab == 0   ||  payload.upTab0 ){
                state.otherBaseInfo = Object.assign({},state.otherBaseInfoCopy);
                state.baseInfo = Object.assign({},state.baseInfoCopy);
                api.companyDetail({'companyId' : state.params.id} ).then(obj=>{
                    let data = obj.data.data;
                    if(data.companyBaseInfo){
                        state.otherBaseInfo =  Object.assign({},data.companyBaseInfo);
                        if(state.otherBaseInfo.supervisorOne){
                            let arr = [];
                            JSON.parse(state.otherBaseInfo.supervisorOne).forEach(v => {
                                arr.push({value : v});
                            });
                            state.otherBaseInfo.supervisorOne = arr;
                        }else{
                            state.otherBaseInfo.supervisorOne = [{value :''}];
                        }
                        if(state.otherBaseInfo.director){
                            let arr = [];
                            JSON.parse(state.otherBaseInfo.director).forEach(v => {
                                arr.push({value : v});
                            });

                            state.otherBaseInfo.director = arr;
                        }else{
                            state.otherBaseInfo.director = [{value :''}];
                        }
                    }
                    delete data.companyBaseInfo;
                    Object.assign(state.baseInfo,data);
                    state.baseInfo.companyId = state.params.id;
                    state.otherBaseInfo.companyId = state.params.id;
                    console.log(state.otherBaseInfo);
                })
            }
            if(params.tab == 1   ||payload.tab == 1 ||  payload.upTab1){
                state.financeInfo = Object.assign({},state.financeInfoCopy);
                api.companyfinanceInfo(state.params.id).then(obj=>{
                     let data = obj.data.data;
                     state.financeInfo = Object.assign({},data);
                     state.financeInfo.companyId = state.params.id;
                })
            }else if(params.tab == 2   ||payload.tab == 2 || payload.upTab2){
                state.annInspInfo = Object.assign({},state.annInspInfoCopy);
                api.companyannInspInfo(state.params.id).then(obj=>{
                    let data = obj.data.data;
                    state.annInspInfo = Object.assign({},data);
                    if(state.annInPreList.length == 0){
                        let len = Object.keys(state.annInspInfo).length;
                        let arr = [];
                        for(let i = 0; i < len ; i ++){
                            arr.push('Y');
                        }
                        state.annInPreList = [...arr];
                    }
                    // state.annInspInfo.companyId = state.params.id;
                })
            }
        }
    }
}
export default company;