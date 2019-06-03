
var  regBox = {
        regEmail : /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i,//邮箱
        regMobile : '^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}$',//手机
        reHKMobile : '^(5|6|8|9)\\d{7}$',
        regCode : /[0-9]{6}/, //验证码
        regEn : /[^A-Za-z]/, // 字母
        regNum : /[^0-9]/, //数字
        reg1 : /[^_]/, //下划线
        reFloat : /(^[1-9][0-9]*[\.]{0,1}[0-9]*[0-9]$)|(^[0].[0-9]*[0-9]$)|(^[0-9]$)/, //浮点类型
};


var validatePhone = (rule, value, callback) => {
      if (!(new RegExp(regBox.regMobile)).test(value)) {
        callback(new Error('请输入正确的手机号'));
      }else{
        callback();
      }
  };
  var validateHKPhone = (rule, value, callback) => {
        if (!(new RegExp(regBox.reHKMobile)).test(value)) {
          callback(new Error('请输入正确的手机号'));
        }else{
          callback();
        }
    };
  var validateEmail = (rule, value, callback) => {
      if (!(new RegExp(regBox.regEmail)).test(value)) {
        callback(new Error('请输入正确的邮箱'));
      }else{
        callback();
      }
  };
  var validateCode = (rule, value, callback) => {
      if (!(new RegExp(regBox.regCode)).test(value)) {
        callback(new Error('请输入正确的验证码'));
      }else{
        callback();
      }
  }
  var validateEn = (rule, value, callback) => {
      if (value && (new RegExp(regBox.regEn)).test(value)) {
        callback(new Error('请输入正确的英文'));
      }else{
        callback();
      }
  }
  var validateNum = (rule, value, callback) => {
      if (value && (new RegExp(regBox.regNum)).test(value)) {
        callback(new Error('请输入正确的数字'));
      }else{
        callback();
      }
  }
  var validateFloat = (rule,value,callback) =>{
    if(value && !((new RegExp(regBox.reFloat)).test(value)   ||  (new RegExp(regBox.regNum)).test(value)) ){
      callback(new Error('请输入正确的数值'));
    }else{
      callback();
    }
  }
  var validateFloatLimit0_999 = (rule,value,callback)=>{
    if(value && (!(new RegExp(regBox.reFloat)).test(value)   ||  (new RegExp(regBox.regNum)).test(value)) ){
      callback(new Error('请输入正确的数值'));
    }else{
      if(value < 0 || value > 999){
        callback(new Error('数值范围在0-999'));
      }else{
        callback();
      }
    }
  }
  var validateFloatLimit10_180=(rule,value,callback)=>{
    if(value && (!(new RegExp(regBox.reFloat)).test(value)   ||  (new RegExp(regBox.regNum)).test(value)) ){
      callback(new Error('请输入正确的数值'));
    }else{
      if(value < 10 || value > 180){
        callback(new Error('数值范围在10-180'));
      }else{
        callback();
      }
    }
  }
  var validateFloatLimit1_10 = (rule,value,callback)=>{
    if(value && (!(new RegExp(regBox.reFloat)).test(value)   ||  (new RegExp(regBox.regNum)).test(value)) ){
      callback(new Error('请输入1~10之间任意数字'));
    }else{
      if(value < 1 || value > 10){
        callback(new Error('请输入1~10之间任意数字'));
      }else{
        callback();
      }
    }
  }
  var validateFloatLimit1_99 = (rule,value,callback)=>{
    if(value && (!(new RegExp(regBox.reFloat)).test(value)   ||  (new RegExp(regBox.regNum)).test(value)) ){
      callback(new Error('请输入1~99之间任意数字'));
    }else{
      if(value < 1 || value > 99){
        callback(new Error('请输入1~99之间任意数字'));
      }else{
        callback();
      }
    }
  }
  var validateIntLimit0_99 = (rule,value,callback)=>{
    if(value &&   (new RegExp(regBox.regNum)).test(value)){
      callback(new Error('请输入0~99之间任意数字'));
    }else{
      if(value < 0 || value > 99){
        callback(new Error('请输入0~99之间任意数字'));
      }else{
        callback();
      }
    }
  }
  var validateApprovalModelName = (rule,value,callback) =>{
    if(value && (/[^a-zA-Z0-9\u4e00-\u9fa5_]/g.test(value))){
      callback(new Error('仅支持1-20位数字、汉字、英文与下划线'));
    }else{
      callback();
    }
  }
  var validateApprovalProName = (rule,value,callback) =>{
    if(value && (/[^a-zA-Z0-9\u4e00-\u9fa5_]/g.test(value))){
      callback(new Error('仅支持1-50位数字、字符与下划线'));
    }else{
      callback();
    }
  }
  var validateCharacter =(rule,value,callback) =>{
    if(value && (/[^a-zA-Z0-9\u4e00-\u9fa5]/g.test(value))){
      callback(new Error('仅支持中、英文、数字字符'));
    }else{
      callback();
    }
  }
  
  
export default{
    regBox,
    validatePhone,
    validateHKPhone,
    validateEmail,
    validateCode,
    validateEn,
    validateNum,
    validateFloat,
    validateFloatLimit0_999,
    validateFloatLimit1_10,
    validateFloatLimit1_99,
    validateIntLimit0_99,
    validateFloatLimit10_180,
    validateApprovalModelName,
    validateApprovalProName,
    validateCharacter
}