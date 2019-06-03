<template lang="pug">
#loginDiv
  //- 修改1
  div.loginCenterDiv
    p.companyName e代理员工内部管理系统
    div.loginEntryDiv
      div(v-show="loginDivShow")
        div.loginEntryLeft
          img(src="../../commons/imgs/logomy.png" alt="")
          p 连接内外    效率协同
        //- div.loginEntryRight(v-show="phoneEntryShow")
        //-   p(style="color: #eae7e7;margin-bottom: 20px;font-size: 18px;") 
        //-     span(style="cursor: pointer;padding-right:20px",@click='mailSpanClick') 邮箱登录
        //-     span(v-bind:class="{ highLight: highLight }", @click='phoneSpanClick') 手机登录
        //-   el-form.demo-ruleForm(:model='phoneForm', :rules='phoneRules', ref='phoneForm')
        //-     el-form-item(:prop='phoneName')
        //-       el-input.noBorder.padd50(v-if='usernameShow',placeholder='请输入手机号', v-model='phoneForm.username', name='phone')
        //-         el-select.noBorder(@change='codeChange',v-model='phoneForm.mobileInternationalCode',slot='prepend', placeholder='请选择',name='codeBorder')
        //-           el-option.codeOption(v-for="item in selAreaCodeArr" :value="item.code" :label="item.name" :key="item.code") {{item.name}}
        //-       el-input.noBorder.padd50(v-if='username1Show',placeholder='请输入手机号', v-model='phoneForm.username1', name='phone')
        //-         el-select.noBorder(@change='codeChange',v-model='phoneForm.mobileInternationalCode',slot='prepend', placeholder='请选择',name='codeBorder')
        //-           el-option.codeOption(v-for="item in selAreaCodeArr" :value="item.code" :label="item.name" :key="item.code") {{item.name}}
        //-     el-form-item(prop='password')
        //-       el-input.noBorder(placeholder='请输入密码', type="password", v-model='phoneForm.password', v-on:keyup.native.enter="phoneLogin('phoneForm')")
        //-     el-form-item(style="margin-bottom: 0;")
        //-       //- span.accountActive(@click="accountActiveClick") 激活账号
        //-       span.forgetPass(@click="forgetPassClick") 忘记密码？
        //-     el-form-item
        //-       el-button.loginBtn(:class="{loginBtnNo : loginBtnNo}",type='primary', @click="phoneLogin('phoneForm')") 登录
        div.loginEntryRight(v-show="wxLoginShow")
          p(style="color: #eae7e7;margin-bottom: 20px;font-size: 18px;") 
            span(style="cursor: pointer;padding-right:20px",@click='mailSpanClick') 邮箱登录
            //- span(v-bind:class="{ highLight: highLight }", @click='phoneSpanClick') 手机登录
            span(v-bind:class="{ highLight: highLight }", @click='wxLogin') 微信登录
          el-form.demo-ruleForm(:model='phoneForm', :rules='phoneRules', ref='phoneForm')
            iframe(src="https://open.weixin.qq.com/connect/qrconnect?appid=wxfe210beea3ca92f1&scope=snsapi_login&redirect_uri=https://www.edaili.com/api/wechat/oauth&state=oa&login_type=jssdk&self_redirect=false&style=black&href=https://oa.edaili.com/cssoa/oa.css")
            //- el-form-item(prop='password')
            //- el-form-item(style="margin-bottom: 0;")
            //-   span.forgetPass(@click="forgetPassClick") 忘记密码？
            //- el-form-item
            //-   el-button.loginBtn(:class="{loginBtnNo : loginBtnNo}",type='primary', @click="phoneLogin('phoneForm')") 登录
        div.loginEntryRight(v-show="mailEntryShow")
          p(style="color: #eae7e7;margin-bottom: 20px;font-size: 18px;") 
            span(v-bind:class="{ highLight: highLight }", style="padding-right:20px;", @click='mailSpanClick') 邮箱登录
            //- span(style="cursor: pointer", @click='phoneSpanClick') 手机登录
            span(style="cursor: pointer", @click='wxLogin') 微信登录
          el-form.demo-ruleForm(:model='mailForm', :rules='mailRules', ref='mailForm')
            el-form-item(prop='username')
              el-input.noBorder(placeholder='请输入邮箱', v-model='mailForm.username')
              div.emailAfter @edaili.com
            el-form-item(prop='password')
              el-input.noBorder(placeholder='请输入密码', type="password", v-model='mailForm.password', v-on:keyup.native.enter="mailboxLogin('mailForm')")
            el-form-item(style="margin-bottom: 0;")
              //- span.accountActive(@click="accountActiveClick") 激活账号
              span.forgetPass(@click="forgetPassClick") 忘记密码？
            el-form-item
              el-button.loginBtn(:class="{loginBtnNo : loginBtnNo}",type='primary', @click="mailboxLogin('mailForm')") 登录
      div.forgetPassDiv(v-show="accountActiveShow")
        div(v-show='activationAccountShow')
          p(style="color: #eae7e7;margin-bottom: 30px;font-size: 20px;") 激活账号
            i.backPassClose(class="el-icon-circle-close-outline", style="position: absolute;right: 27px;top: 56px;cursor: pointer;", @click='backLogin')
          el-form.demo-ruleForm(:model='accountActiveForm', :rules='accountActiveRules', ref='accountActiveForm')
            el-form-item(:prop='activationPhone')
              el-input.noBorder.padd50(v-if='activationPhoneShow',placeholder='请输入手机号', v-model='accountActiveForm.mobile', name='phone')
                el-select.noBorder(@change="activationPhoneChange",v-model='accountActiveForm.mobileInternationalCode', slot='prepend', placeholder='请选择',name='codeBorder')
                  el-option.codeOption(v-for="item in selAreaCodeArr" :value="item.code" :label="item.name" :key="item.code") {{item.name}}
              el-input.noBorder.padd50(v-if='activationPhone1Show',placeholder='请输入手机号', v-model='accountActiveForm.mobile1', name='phone')
                el-select.noBorder(@change="activationPhoneChange",v-model='accountActiveForm.mobileInternationalCode', slot='prepend', placeholder='请选择',name='codeBorder')
                  el-option.codeOption(v-for="item in selAreaCodeArr" :value="item.code" :label="item.name" :key="item.code") {{item.name}}
            
            el-form-item(prop='activeCode')
              el-input.noBorder(placeholder='请输入激活码', v-model='accountActiveForm.activeCode')
            el-form-item.margin40
              el-button.loginBtn(type='primary', @click="accountActiveBtn('accountActiveForm')") 激活
        div(v-show='setPassWordShow')
          p(style="color: #eae7e7;margin-bottom: 30px;font-size: 20px;") 设置登录密码
            i.backPassClose(class="el-icon-circle-close-outline", style="position: absolute;right: 27px;top: 50px;", @click='backLogin')
          el-form.demo-ruleForm(:model='setPassWordForm', :rules='setPassWordRules', ref='setPassWordForm')
            el-form-item(prop='pass1')
              el-input.noBorder(placeholder='请输入密码', type="password", v-model='setPassWordForm.pass1')
            el-form-item(prop='pass2')
              el-input.noBorder(placeholder='再次确认密码', type="password", v-model='setPassWordForm.pass2')
            el-form-item.margin40
              el-button.loginBtn(type='primary', @click="setPassWordBtn('setPassWordForm')") 确定
      div.forgetPassDiv(v-show="forgetPassDivShow")
        div(v-show="phoneforgetPassShow")
          p(style="color: #eae7e7;margin-bottom: 20px;") 
              span.font18(style="cursor: pointer;padding-right:20px;",@click='mailBack') 邮箱找回
              span.highLight.font18(style="cursor: pointer", @click='phoneBack') 手机找回
              i.backPassClose(class="el-icon-circle-close-outline",@click='backLogin')
          el-steps(:active='active', align-center)
            el-step(title='填写手机号')
            el-step(title='填写验证码')
            el-step(title='设置密码')
          el-form.demo-ruleForm(:model='passFirstStepForm', :rules='PassFirstStepRules', ref='passFirstStepForm', v-show="PassFirstStepShow")
            el-form-item(:prop='mobilePhone')
              el-input.noBorder.padd50(v-if='mobileShow',placeholder='请输入手机号', v-model='passFirstStepForm.mobile', name='passPhone')
                el-select.noBorder(@change='mobileCodeChange',v-model='passFirstStepForm.mobileInternationalCode', slot='prepend', placeholder='请选择',name='codeBorder')
                  el-option.codeOption(v-for="item in selAreaCodeArr" :value="item.code" :label="item.name" :key="item.code") {{item.name}}
              el-input.noBorder.padd50(v-if='mobile1Show',placeholder='请输入手机号', v-model='passFirstStepForm.mobile1', name='passPhone')
                el-select.noBorder(@change='mobileCodeChange',v-model='passFirstStepForm.mobileInternationalCode', slot='prepend', placeholder='请选择',name='codeBorder')
                  el-option.codeOption(v-for="item in selAreaCodeArr" :value="item.code" :label="item.name" :key="item.code") {{item.name}}
            el-form-item
              el-button.loginBtn(type='primary', @click="PassFirstStepBtn('passFirstStepForm')") 确定
          el-form.demo-ruleForm(:model='PassSecondStepForm', :rules='PassSecondStepRules', ref='PassSecondStepForm', v-show="PassSecondStepShow")
            el-form-item(prop='verCode')
              el-input.noBorder(placeholder='请输入验证码', v-model='PassSecondStepForm.verCode')
            el-form-item
              el-button.loginBtn(type='primary', @click="PassSecondStepBtn('PassSecondStepForm')") 确定
          el-form.demo-ruleForm(:model='PassThirdStepForm', :rules='PassThirdStepRules', ref='PassThirdStepForm', v-show="PassThirdStepShow")
            el-form-item(prop='passwordOne')
              el-input.noBorder(placeholder='设置密码', type="password", v-model='PassThirdStepForm.passwordOne')
            el-form-item(prop='passwordTow')
              el-input.noBorder(placeholder='确认密码', type="password", v-model='PassThirdStepForm.passwordTow')
            el-form-item
              el-button.loginBtn(type='primary', @click="PassThirdStepBtn('PassThirdStepForm')") 确定
        div(v-show="mailforgetPassShow")
          p(style="color: #eae7e7;margin-bottom: 20px;") 
              span.highLight.font18(style="cursor: pointer;padding-right:20px;",@click='mailBack') 邮箱找回
              span.font18(style="cursor: pointer", @click='phoneBack') 手机找回
              i.backPassClose(class="el-icon-circle-close-outline", @click='backLogin')
          el-steps(:active='active2', align-center)
            el-step(title='填写邮箱')
            el-step(title='填写验证码')
            el-step(title='设置密码')
          el-form.demo-ruleForm(:model='mailFirstStepForm', :rules='mailFirstStepRules', ref='mailFirstStepForm', v-show="mailFirstStepShow")
            el-form-item(prop='email')
              el-input.noBorder(placeholder='请输入邮箱',v-model='mailFirstStepForm.email')
              div.emailAfter @edaili.com
            el-form-item
              el-button.loginBtn(type='primary', @click="mailFirstStepBtn('mailFirstStepForm')") 确定
          el-form.demo-ruleForm(:model='mailSecondStepForm', :rules='PassSecondStepRules', ref='mailSecondStepForm', v-show="mailSecondStepShow")
            el-form-item(prop='verCode')
              el-input.noBorder(placeholder='请输入验证码', v-model='mailSecondStepForm.verCode')
            el-form-item
              el-button.loginBtn(type='primary', @click="mailSecondStepBtn('mailSecondStepForm')") 确定
          el-form.demo-ruleForm(:model='mailThirdStepForm', :rules='mailThirdStepRules', ref='mailThirdStepForm', v-show="mailThirdStepShow")
            el-form-item(prop='emailPassOne')
              el-input.noBorder(placeholder='设置密码', type="password", v-model='mailThirdStepForm.emailPassOne')
            el-form-item(prop='emailPassTow')
              el-input.noBorder(placeholder='确认密码', type="password", v-model='mailThirdStepForm.emailPassTow')
            el-form-item
              el-button.loginBtn(type='primary', @click="mailThirdStepBtn('mailThirdStepForm')") 确定
  p.loginBottom 
    | ©2018 博恩惠尔信息科技（上海）有限公司 版权所有
</template>
<script>
import core from '@/api/core'
import util from '../../util'
import store from '@/vuex/store'
import {md5} from '../../util/md5.js'
import { mapState, mapMutations } from 'vuex'
import { switchCase } from 'babel-types';
export default {
  name: '',
  data () {
    var passwordOne = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.PassThirdStepForm.passwordTow !== '') {
          this.$refs.PassThirdStepForm.validateField('passwordTow')
        }
        callback()
      }
    };
    var passwordTow = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.PassThirdStepForm.passwordOne) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var emailPassOne = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.mailThirdStepForm.emailPassTow !== '') {
          this.$refs.mailThirdStepForm.validateField('emailPassTow')
        }
        callback()
      }
    };
    var emailPassTow = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.mailThirdStepForm.emailPassOne) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var pass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.setPassWordForm.pass2 !== '') {
          this.$refs.setPassWordForm.validateField('pass2')
        }
        callback()
      }
    };
    var pass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.setPassWordForm.pass1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    //  var passPhone = (rule, value, callback) => {
    //   if (!(new RegExp(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/)).test(value)) {
        
    //     callback(new Error('请输入正确的11位手机号'));
    //   }else{
    //     callback();
    //   }
    // }
    return {
      loginBtnNo: true,
      phoneEntryShow: true,
      wxLoginShow : false,
      mailEntryShow: false,
      loginDivShow: true,
      accountActiveShow: false,
      forgetPassDivShow: false,
      PassFirstStepShow: true,
      PassSecondStepShow: false,
      PassThirdStepShow: false,
      mailFirstStepShow: true,
      mailSecondStepShow: false,
      mailThirdStepShow: false,
      phoneforgetPassShow: true,
      mailforgetPassShow: false,
      activationAccountShow: true,
      setPassWordShow: false,
      // 登录手机
      phoneName:'username',
      usernameShow:true,
      username1Show:false,
      // 找回密码-手机
      mobilePhone:'mobile',
      mobileShow:true,
      mobile1Show:false,
      // 激活-手机
      activationPhone:'mobile',
      activationPhoneShow:true,
      activationPhone1Show:false,
      phoneForm: {
        username: '',
        username1:'',
        password: '',
        mobileInternationalCode: '0086',
        loginType: 0
      },
      phonepassword: '',
      mailForm: {
        username: '',
        password: '',
        mobileInternationalCode: '0086',
        loginType: 1
      },
      accountActiveForm: {
        mobile: '',
        mobile1: '',
        activeCode: '',
        mobileInternationalCode: '0086'
      },
      setPassWordForm: {
        activeCode: '',
        mobile: '',
        pass1: '',
        pass2: '',
        mobileInternationalCode: '0086'
      },
      // 忘记密码-第1步
      passFirstStepForm: {
        mobile: '',
        mobile1: '',
        mobileInternationalCode: '0086'
      },
      // 忘记密码-第2步
      PassSecondStepForm: {
        verCode: '',
        vkey: ''
      },
      // 忘记密码-第3步
      PassThirdStepForm: {
        passwordOne: '',
        passwordTow: '',
        vkey: ''
      },
      // 邮箱-第1步
      mailFirstStepForm: {
        email: ''
      },
      // 邮箱-第2步
      mailSecondStepForm: {
        verCode: '',
        vkey: ''
      },
      // 邮箱-第3步
      mailThirdStepForm: {
        emailPassOne: '',
        emailPassTow: '',
        vkey: ''
      },
      highLight: true,
      active: 0,
      active2: 0,
      phoneRules: {
        username:[
          {required:true,message:'手机号码必填',trigger:'change'},
          {pattern:/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$|^(5|6|8|9)\\d{7}$/, message: '请输入正确的11位手机号',trigger:'change' },
        ],
        username1:[
          {required:true,message:'手机号码必填',trigger:'change'},
          {pattern:/^(5|6|8|9)\d{7}$/, message: '请输入正确的8位手机号',trigger:'change' }
        ],
        password:[
          {required:true,message:'密码必填',trigger:'change'},
          {pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/, message: '请输入6-20位数字和字母或特殊符号的组合',trigger:'change' }
        ]
      },
      mailRules: {
        password:[
          {required:true,message:'密码必填',trigger:'change'},
          {pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/, message: '请输入6-20位数字和字母或特殊符号的组合',trigger:'change' }
        ],
        username:[
          {required:true,message:'邮箱必填',trigger:'change'},
          {pattern:/^[a-zA-Z0-9_.-]+/, message: '请输入正确的邮箱',trigger:'change' }
        ]
      },
      accountActiveRules: {
        mobile:[
          {required:true,message:'手机号码必填',trigger:'change'},
          {pattern:/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/, message: '请输入正确的11位手机号',trigger:'change'}
        ],
        mobile1:[
          {required:true,message:'手机号码必填',trigger:'change'},
          {pattern:/^(5|6|8|9)\d{7}$/, message: '请输入正确的8位手机号',trigger:'change' }
        ],
        activeCode:[
          {required:true,message:'激活码必填',trigger:'blur'}
        ]
      },
      // 忘记密码
      PassFirstStepRules: {
        mobile:[
          {required:true,message:'手机号码必填',trigger:'change'},
          {pattern:/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/, message: '请输入正确的11位手机号',trigger:'change'}
        ],
        mobile1:[
          {required:true,message:'手机号码必填',trigger:'change'},
          {pattern:/^(5|6|8|9)\d{7}$/, message: '请输入正确的8位手机号',trigger:'change' }
        ],
      },
      PassSecondStepRules: {
        verCode:[
          {required:true,message:'验证码必填',trigger:'blur'}
        ]
      },
      PassThirdStepRules: {
        passwordOne:[
          {validator: passwordOne,trigger:'change'},
          {pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/, message: '请输入6-20位数字和字母或特殊符号的组合',trigger:'change' }
        ],
        passwordTow:[
          {validator: passwordTow,trigger:'change'}
        ]
      },
      mailThirdStepRules: {
        emailPassOne:[
          {validator: emailPassOne,trigger:'change'},
          {pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/, message: '请输入6-20位数字和字母或特殊符号的组合',trigger:'change' }
        ],
        emailPassTow:[
          {validator: emailPassTow,trigger:'change'}
        ]
      },
      mailFirstStepRules: {
        email:[
          {required:true,message:'邮箱必填',trigger:'blur'},
          {pattern:/^[a-zA-Z0-9_.-]+/, message: '请输入正确的邮箱',trigger:'change' }
        ]
      },
      setPassWordRules: {
        pass1:[
          {validator: pass1,trigger:'change'},
          {pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/, message: '请输入6-20位数字和字母或特殊符号的组合',trigger:'change' }
        ],
        pass2:[
          {validator: pass2,trigger:'change'}
        ]
      }
    }
  },
  computed: {
    ...mapState({"selAreaCodeArr" : state => state.selectData.areacode.list}),
  },
  store,
  created () {
    setTimeout(() => {
      this.$refs['phoneForm'].resetFields()
      this.$refs['mailForm'].resetFields()
    },100)
    // 区号
    this.$store.dispatch('getData','areacode')
    this.mailSpanClick();
  },
  watch: {
    // 手机登录
    phoneEntryShow (val) {
      if(!val){
        this.$refs['phoneForm'].resetFields()
      }
    },
    // 邮箱登录
    mailEntryShow (val) {
      if(!val){
        this.$refs['mailForm'].resetFields()
      }
    },
    // 激活账号
    accountActiveShow (val) {
      if(!val){
        this.$refs['accountActiveForm'].resetFields()
      }
    },
    // 忘记密码-手机号 邮箱-点击X号
    forgetPassDivShow (val) {
      if(!val){
        this.$refs['passFirstStepForm'].resetFields()
        this.$refs['PassSecondStepForm'].resetFields()
        this.$refs['PassThirdStepForm'].resetFields()
        this.$refs['mailFirstStepForm'].resetFields()
        this.$refs['mailSecondStepForm'].resetFields()
        this.$refs['mailThirdStepForm'].resetFields()
      }
    },
    // 忘记密码-tab手机号
    phoneforgetPassShow (val) {
      if(!val){
        this.$refs['passFirstStepForm'].resetFields()
        this.$refs['PassSecondStepForm'].resetFields()
        this.$refs['PassThirdStepForm'].resetFields()
        this.$refs['mailFirstStepForm'].resetFields()
        this.$refs['mailSecondStepForm'].resetFields()
        this.$refs['mailThirdStepForm'].resetFields()
      }
    },
    // 忘记密码-tab邮箱
    mailFirstStepShow (val) {
      if(!val){
        this.$refs['passFirstStepForm'].resetFields()
        this.$refs['PassSecondStepForm'].resetFields()
        this.$refs['PassThirdStepForm'].resetFields()
        this.$refs['mailFirstStepForm'].resetFields()
        this.$refs['mailSecondStepForm'].resetFields()
        this.$refs['mailThirdStepForm'].resetFields()
      }
    },
    // 手机号
    // 'phoneForm.username' (val){this.phoneBtn()},
    // 密码
    // 'phoneForm.password' (val){this.phoneBtn()},
  },
  methods: {
    ...mapMutations([
      'userNameGet'
    ]),
    // 手机号code切换
    codeChange(val){
      switch(val){
        case '0086':
          this.phoneForm.username = ''
          this.phoneForm.username1 = ''
          this.usernameShow = true
          this.username1Show = false
          this.phoneName = 'username'
        break;
        case '00852':
          this.phoneForm.username = ''
          this.phoneForm.username1 = ''
          this.usernameShow = false
          this.username1Show = true
          this.phoneName = 'username1'
        break;
      }
    },
    wxLogin(){
      this.wxLoginShow = true;
      this.mailEntryShow = false;
      // window.location.href = "https://open.weixin.qq.com/connect/qrconnect?appid=wxfe210beea3ca92f1&scope=snsapi_login&redirect_uri=https://www.edaili.com/api/wechat/oauth&state=oa&login_type=jssdk&self_redirect=false&style=black";
    },
    // 找回密码code切换
    mobileCodeChange(val){
      switch(val){
        case '0086':
          this.mobilePhone = 'mobile'
          this.passFirstStepForm.mobile = ''
          this.passFirstStepForm.mobile1 = ''
          this.mobileShow = true
          this.mobile1Show = false
        break;
        case '00852':
          this.passFirstStepForm.mobile = ''
          this.passFirstStepForm.mobile1 = ''
          this.mobileShow = false
          this.mobile1Show = true
          this.mobilePhone = 'mobile1'
        break;
      }
    },
    // 激活code切换
    activationPhoneChange(val){
      switch(val){
        case '0086':
          this.accountActiveForm.mobile = ''
          this.accountActiveForm.mobile1 = ''
          this.activationPhoneShow = true
          this.activationPhone1Show = false
          this.activationPhone = 'mobile'
        break;
        case '00852':
          this.accountActiveForm.mobile = ''
          this.accountActiveForm.mobile1 = ''
          this.activationPhoneShow = false
          this.activationPhone1Show = true
          this.activationPhone = 'mobile1'
        break;
      }
    },
    // 1.手机登录-按钮颜色切换
    phoneBtn(){
      this.$refs['phoneForm'].validate((valid) =>{
        if(valid){
          this.loginBtnNo = false
        }else{
          this.loginBtnNo = true
        }
      })
    },
    // 1.手机登录页面显示
    phoneSpanClick () {
      this.phoneEntryShow = true
      this.mailEntryShow = false
    },
    // 2.邮箱页面显示
    mailSpanClick () {
      this.phoneEntryShow = false
      this.mailEntryShow = true
      this.wxLoginShow = false
    },
    // 1.点击手机号登录
    phoneLogin (formName) {
      this.$refs[formName].validate((valid) => {
        if(valid){
          if(this.phoneForm.username1){
            this.phoneForm.username = this.phoneForm.username1
          }
          core.login({
            username: this.phoneForm.username,
            password: md5(this.phoneForm.password),
            mobileInternationalCode: this.phoneForm.mobileInternationalCode,
            loginType: 0
          }).then((res) => {
            util.codeConfirm(res.data,this)
            if(res.data.code === '200'){
              this.$store.commit('userNameGet', res.data.data.username)
              this.$store.dispatch('resetToken',{id : res.data.data.userId, token : res.data.data.token}).then(obj=>{
               this.$router.push({ path: '/home' })
              })
            }
          }).catch(util.errorHandle)
        }
      })
    },
    // 2.点击邮箱登录
    mailboxLogin (formName) {
      let emaliLogin = this.mailForm.username + '@edaili.com'
      this.$refs[formName].validate((valid) => {
        if(valid){
          core.login({
            username: emaliLogin,
            password: md5(this.mailForm.password),
            mobileInternationalCode: '0086',
            loginType: 1
          }).then((res) => {
            util.codeConfirm(res.data,this)
            if(res.data.code === '200'){
              this.$store.commit('userNameGet', res.data.data.username)
              this.$store.dispatch('resetToken',{id : res.data.data.userId, token : res.data.data.token}).then(obj=>{
               this.$router.push({ path: '/home' })
              })
            }
          }).catch(util.errorHandle)
        }
      })
    },
    // 激活账号页面show
    accountActiveClick () {
      this.loginDivShow = false
      this.accountActiveShow = true
      this.activationAccountShow = true
      this.setPassWordShow = false
      this.accountActiveForm.mobile = ''
      this.accountActiveForm.activeCode = ''
      this.setPassWordForm.pass2 = ''
      this.setPassWordForm.pass1 = ''
    },
    // 激活
    accountActiveBtn (formName) {
      this.$refs[formName].validate((valid) => {
        if(valid){
          if(this.accountActiveForm.mobile1){
            this.accountActiveForm.mobile = this.accountActiveForm.mobile1
          }
          core.activeAccount({
            mobile: this.accountActiveForm.mobile,
            activeCode: this.accountActiveForm.activeCode,
            mobileInternationalCode: this.accountActiveForm.mobileInternationalCode,
          }).then((res) => {
            util.codeConfirm(res.data,this)
            if(res.data.code === '200'){
              // 设置密码
              this.setPassWordShow = true
              this.activationAccountShow = false
            }
          }).catch(util.errorHandle)
        }
      })
    },
    // 激活
    setPassWordBtn (formName) {
      this.$refs[formName].validate((valid) => {
        if(valid){
          core.resetPwd({
            activeCode: this.accountActiveForm.activeCode,
            mobile: this.accountActiveForm.mobile,
            pass1: md5(this.setPassWordForm.pass1),
            pass2: md5(this.setPassWordForm.pass2),
            mobileInternationalCode: this.accountActiveForm.mobileInternationalCode
          }).then((res) => {
            util.codeConfirm(res.data,this)
            if(res.data.code === '200'){
              // 设置密码
              this.setPassWordShow = false
              this.activationAccountShow = false
              this.loginDivShow = true
              this.$message.success('设置成功，请登录')
            }
          }).catch(util.errorHandle)
        }
      })
    },
    // 忘记密码页面show
    forgetPassClick () {
      this.loginDivShow = false
      this.forgetPassDivShow = true
      this.phoneforgetPassShow = true
      this.PassFirstStepShow = true
      this.PassSecondStepShow = false
      this.PassThirdStepShow = false
      this.mailforgetPassShow = false
      // 86-825
      this.mobilePhone = 'mobile'
      this.passFirstStepForm.mobile = ''
      this.passFirstStepForm.mobile1 = ''
      this.mobileShow = true
      this.mobile1Show = false
      this.passFirstStepForm.mobileInternationalCode = '0086'
      this.mailBack();
    },
    // 手机找回show
    phoneBack () {
      // 邮箱隐藏，密码显示 密码第一显示，其他步隐藏
      this.mailforgetPassShow = false
      this.phoneforgetPassShow = true
      this.PassFirstStepShow = true
      this.PassSecondStepShow = false
      this.PassThirdStepShow = false
      // 清空密码form表单项-watch -将颜色始终定位第一个
      this.active = 0 
      
    },
    // 邮箱找回show
    mailBack () {
      this.mailforgetPassShow = true
      this.phoneforgetPassShow = false
      this.mailFirstStepShow = true
      this.mailSecondStepShow = false
      this.mailThirdStepShow = false
      // 清空密码form表单项 -将颜色始终定位第一个
      this.active2 = 0 
    },
    // 手机找回步骤第1步
    PassFirstStepBtn (formName) {
      // 1.验证手机号
      this.$refs[formName].validate((valid) => {
        if(valid){
          if(this.passFirstStepForm.mobile1){
            this.passFirstStepForm.mobile = this.passFirstStepForm.mobile1
          }
          core.mobileVerCode({
            mobile: this.passFirstStepForm.mobile,
            mobileInternationalCode: this.passFirstStepForm.mobileInternationalCode
          }).then((res) => {
            util.codeConfirm(res.data,this)
            if(res.data.code === '200'){
              this.active++
              this.PassSecondStepForm.vkey = res.data.data.vkey
              this.PassFirstStepShow = false
              this.PassSecondStepShow = true
              this.$message.success(res.data.messages)
            }
          }).catch(util.errorHandle)
        }
      })
    },
    // 手机找回步骤第2步
    PassSecondStepBtn (formName) {
      // 1.验证手机号
      this.$refs[formName].validate((valid) => {
        if(valid){
          core.passVerCode(this.PassSecondStepForm).then((res) => {
            util.codeConfirm(res.data,this)
            if(res.data.code === '200'){
              this.active++
              this.PassThirdStepForm.vkey = this.PassSecondStepForm.vkey
              this.PassSecondStepShow = false
              this.PassThirdStepShow = true
              this.$message.success(res.data.messages)
            }
          }).catch(util.errorHandle)
        }
      })
    },
    // 手机找回步骤第3步
    PassThirdStepBtn (formName) {
      // 1.验证手机号
      this.$refs[formName].validate((valid) => {
        if(valid){
          // this.PassThirdStepForm.passwordOne = md5(this.PassThirdStepForm.passwordOne);
          // this.PassThirdStepForm.passwordTow = md5(this.PassThirdStepForm.passwordTow);
          core.passResetPwd({
            passwordOne: md5(this.PassThirdStepForm.passwordOne),
            passwordTow: md5(this.PassThirdStepForm.passwordTow),
            vkey: this.PassThirdStepForm.vkey
          }).then((res) => {
            util.codeConfirm(res.data,this)
            if(res.data.code === '200'){
              this.active++
                this.forgetPassDivShow = false
                this.loginDivShow = true
                this.active = 0
                this.$message.success(res.data.messages)
            }
          }).catch(util.errorHandle)
        }
      })
    },
    // 邮箱找回步骤第1步
    mailFirstStepBtn (formName) {
      // 1.验证邮箱
      let email = this.mailFirstStepForm.email + '@edaili.com'
      this.$refs[formName].validate((valid) => {
        if(valid){
          core.emailVerCode({email:email }).then((res) => {
            util.codeConfirm(res.data,this)
            if(res.data.code === '200'){
              this.active2++
              this.mailSecondStepForm.vkey = res.data.data.vkey
              this.mailFirstStepShow = false
              this.mailSecondStepShow = true
              this.$message.success(res.data.messages)
            }
          }).catch(util.errorHandle)
        }
      })
    },
    // 邮箱找回步骤第2步
    mailSecondStepBtn (formName) {
      // 1.验证手机号
      this.$refs[formName].validate((valid) => {
        if(valid){
          core.passVerCode(this.mailSecondStepForm).then((res) => {
            util.codeConfirm(res.data,this)
            if(res.data.code === '200'){
          //     console.log('密码找回第2步')
              this.active2++
              this.mailThirdStepForm.vkey = this.mailSecondStepForm.vkey
                this.mailSecondStepShow = false
                this.mailThirdStepShow = true
             this.$message.success(res.data.messages)
            }
          }).catch(util.errorHandle)
        }
      })
    },
    // 邮箱找回步骤第3步
    mailThirdStepBtn (formName) {
      // 1.验证手机号
      this.$refs[formName].validate((valid) => {
        if(valid){
          core.passResetPwd({
            passwordOne: md5(this.mailThirdStepForm.emailPassOne),
            passwordTow: md5(this.mailThirdStepForm.emailPassTow),
            vkey: this.mailThirdStepForm.vkey
          }).then((res) => {
            util.codeConfirm(res.data,this)
            if(res.data.code === '200'){
              console.log('密码找回第3步')
              this.active2++
              // if (this.active === 2) {
                this.forgetPassDivShow = false
                this.loginDivShow = true
                this.active2 = 0
                this.$message.success(res.data.messages)
              // }
            }
          }).catch(util.errorHandle)
        }
      })
    },
    backLogin () {
      // 1.返回登录
      this.loginDivShow = true
      this.forgetPassDivShow = false
      this.accountActiveShow = false
      this.setPassWordShow = false
      this.active = 0
      this.active2 = 0
    }
  }
}
</script>
<style lang="sass">
#loginDiv
  height: 100%
  width: 100%
  background: url(/static/imgs/login_bg2.jpg) top left  no-repeat 
  background-size: 100% 100% 
  .el-input
  // width: 280px!important
  // .el-form-item.is-success .el-input__inner
  //   border-color: #f7c57a
  .loginCenterDiv
    position: absolute
    top: 50%
    left: 50%
    z-index: 10
    -webkit-transform: translate(-50%, -50%)
    -moz-transform: translate(-50%, -50%)
    -o-transform: translate(-50%, -50%)
    -ms-transform: translate(-50%, -50%)
    transform: translate(-50%, -50%)
    .companyName
      color: #eae7e7
      text-align: right
      font-size: 18px
      padding-bottom: 6px
    .loginEntryDiv
      height: 295px
      width: 982px
      border: 10px solid rgba(255, 255, 255, 0.2)
      padding: 46px 0 60px 0
      .loginEntryLeft
        float: left
        height: 206px
        width: 459px
        text-align: center
        // margin-top: 76px
        padding-top: 83px
        border-right: 1px solid rgba(255, 255, 255, 0.4)
        p
          color: #eae7e7
          padding-top: 20px
          font-size: 18px
      .loginEntryRight
        float: left
        margin: 10px 0 0 100px
        width: 280px
        text-align: center
  .emailAfter
    position: absolute
    right: 20px
    top: 0px
    color: #e4dfdf
  .highLight
    font-weight: bold
    cursor: pointer
  .noBorder .el-input__inner,.noBorder .el-input-group__prepend
    background: none !important
    border-radius: 0 !important
    color: #eae7e7
  .noBorder .el-input-group__prepend
    border: 0
    position: absolute
    z-index: 1
    color: #eae7e7
    width: 168px
    left: -117px
    top: 10px
    border-right: 1px solid #d8d0d0
  input.el-input__inner[name='phone']
    padding-left: 106px
  input.el-input__inner[name='passPhone']
    padding-left: 106px
    width: 280px
  .noBorder.el-select
    margin-left: 100px
  .loginBtn
    background-color: #00B2FB
    font-size: 16px
    font-weight: bold
    width: 280px
    border: 0
    border-radius: 0
    color: #ffffff
  .loginBtnNo
    // background-color: #CCCCCC
    background-color: #00B2FB
  .codeOption
    left: 100px
  .accountActive
    display: inline-block
    color: #fff
    float: left
    padding: 0 6px
    cursor: pointer
  .forgetPass
    display: inline-block
    color: #fff
    float: right
    padding: 0 6px
    cursor: pointer
  .accountActiveDiv
    margin: 12px 245px !important
  .forgetPassDiv
    text-align: center
    // margin-top: 20px
    .backPassClose
      float: right
      font-size: 20px
      line-height: 16px
      padding-right: 17px
      cursor: pointer
    form
      width: 280px
      margin: 40px auto 0
    .el-steps
      margin-top: 48px
    .el-step__icon
      background: none
      width: 60px
      height: 60px
      top: -18px
    .el-step__line
      margin-right: 0px
      width: 250px
      left: 202px
    .el-step__title
      line-height: 10px
      font-size: 14px
    .el-step__head.is-finish
      color: #00B2FB
      border-color: #00B2FB !important
    .el-step__title.is-finish
      color: #00B2FB
    .el-step__head.is-process
      color: #00B2FB
      border-color: #00B2FB
    .el-step__title.is-process
      color: #00B2FB
    .is-process .el-step__line-inner
      border-width: 1px !important
      width: 100% !important
      border: #c0c4cc
    .is-finish .el-step__line-inner
      border-width: 1px !important
      width: 100% !important
      border-color: #00B2FB !important
  .loginBottom
    position: absolute
    bottom: 50px
    text-align: center
    width: 100%
    color: #FFFFFF
    font-size: 14px
  .el-form-item.is-error .el-input__inner
    border-color: #00B2FB
  .el-form-item.is-error .el-input__inner[name='codeBorder']
    border: 0
  
  .el-form-item.is-success .el-input__inner
    border-color: #ffffff
  .el-form-item.is-success .el-input__inner[name='codeBorder']
    border: 0
  .el-form-item__error
    color: #00B2FB
  .font18
    font-size: 18px
  .margin40
    margin-top: 40px
  iframe 
    height: 300px
    overflow: hidden 
    transform: scale(0.9,0.9)
    margin-top: -10px
    border: none
    margin-left: -8px

  </style>
