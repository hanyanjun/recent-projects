<template lang="pug">
#addEditQuest
  div.rightTitle(v-if='addName=="add"') 新增题目
  div.rightTitle(v-else) 编辑题目
  i.backIcon(class="iconfont icon-fanhui pointer", @click="backManage")
  div.editContentDiv
    el-form.elForm(:model='editForm', :rules="editFormRules", ref="editForm", label-width="90px",size='medium')  
      el-form-item.floatLeft(label='内容分类', prop='classId')
        //- el-select.width230(v-model='editForm.aa', placeholder='请选择内容分类')
        //-   el-option(v-for='item in questClassArr', :key='item.code', :label='item.name', :value='item.code') {{item.name}}
        el-select.width230(v-model='editForm.classId', placeholder='请选择内容分类')
          el-option(v-for='item in treeData', :key='item.id', :label='item.className', :value='item.id')
            template(slot-scope='scope')
              h6(:style='`font-weight:normal;padding-left:${item._level*20}px`')
                span {{item.className}}
                i {{item.index}}                
      el-form-item.floatLeft(label='题型分类', prop='titleType')
        el-select.width230(v-model='editForm.titleType',@change='questClassChange', placeholder='请选择题型分类')
          el-option(v-for='item in questClassArr', :key='item.code', :label='item.name', :value='item.code') {{item.name}}
                        
      el-form-item.floatLeft(label='题目难度', prop='quesDifficult')
        el-select.width230(v-model='editForm.quesDifficult', placeholder='请选择题目难度')
          el-option(v-for='item in diffClassArr', :key='item.code', :label='item.name', :value='item.code') {{item.name}}
      el-form-item.clearBoth(label='题目', prop='title')
        el-input.width1000.areaWidth(type='textarea', v-model.trim='editForm.title')
      span.changeSpan *
      el-form-item.floatLeft(label='选项')
        div(v-if='!judgeShow',style='color:#6D7A87') 单选题/多选题最少2题，最多8题
      //- 单选
      el-form-item.changeItem.clearBoth(v-if='radioShow',v-for='(domain, index) in editForm.list', :prop="'list.' + index + '.value'", :rules="{required: true, message: '选项内容不能为空', trigger: 'blur'}")
        el-radio(v-model="editForm.answer",:label="domain.type")
          span
        el-input.width978(type='textarea',v-model.trim='domain.value')
        i.el-icon-remove-outline(ref='removItem',@click.prevent="removeDomain(domain)")
      //- 多选
      el-checkbox-group(v-model="answerCheck",ref='checkChange')
        el-form-item.changeItem.clearBoth(v-if='checkShow',v-for='(domain, index) in editForm.list', :prop="'list.' + index + '.value'", :rules="{required: true, message: '选项内容不能为空', trigger: 'blur'}")
          el-checkbox(:label="domain.type",name='checkBox',class='checkBoxDom')
            span
          el-input.width978(type='textarea',v-model.trim='domain.value')
          i.el-icon-remove-outline(ref='removItem',@click.prevent="removeDomain(domain)")
      //- 判断
      el-form-item(v-show='judgeShow',prop="answer")
        el-radio-group(v-model='editForm.answer')
          el-radio(label="Y") 正确
          el-radio(label="N") 错误
      el-form-item(v-if='!judgeShow')
        el-button.addWidth(icon="el-icon-plus",@click="addDomain") 添加
      el-form-item.answerItem(label='答案解析')
        el-input.width1000.areaWidth(type='textarea', v-model.trim='editForm.answerAnalysis')
      el-form-item.answerItem(label='是否必考')
        el-switch(active-value="Y",
                  inactive-value="N",
                  v-model="editForm.ifExam",
                  active-color="#6DD8AF",
                  @change="",
                  inactive-color="#C3CBD6")
      el-form-item.saveItem
        el-button(type='primary', @click='submitForm("editForm",saveSubmit)') 保存
        //- el-button() 取消
</template>
<script>
import "../../commons/publicCss/outside.sass"
import { switchCase } from 'babel-types';
export default {
  name: 'addEdit',
  data () {
    return {
      addName:'',
      editForm:{
        classId: '', //内容分类
        titleType: '1', //题型分类
        quesDifficult: '', //题目难度
        title: '', //题目
        answer: '', // 选择项
        list:[{ // 选项内容
          value: '',
          type: 'A'
        },{
          value: '',
          type: 'B'
        },{
          value: '',
          type: 'C'
        },{
          value: '',
          type: 'D'
        }],
        answerAnalysis: '',//答案解析
        ifExam: '', //是否必考
      },
      answerCheck: [],
      answerType: '',
      radioShow: true,
      checkShow: false,
      judgeShow: false,
      editType: false,
      editFormRules: {
        classId: [
          {required:true,message: '请选择内容分类', trigger: 'change'}
        ],
        titleType: [
          {required:true,message: '请选择题型分类', trigger: 'change'}
        ],
        quesDifficult: [
          {required:true,message: '请选择题目难度', trigger: 'change'}
        ],
        title: [
          {required:true,message: '请输入题目', trigger: 'change'}
        ],
        // answer: [
        //   {required:true,message: '请选择正确答案', trigger: 'change'}
        // ]
      },
      questClassArr: [
        {
          code: '1',
          name: '单选'
        },
        {
          code: '2',
          name: '多选'
        },
        {
          code: '3',
          name: '判断'
        },
      ],
      diffClassArr: [
        {
          code: '1',
          name: '简单'
        },
        {
          code: '2',
          name: '一般'
        },
        {
          code: '3',
          name: '困难'
        },
      ],
    }
  },
  watch: {
  },
  created () {
    this.$store.dispatch('getContractTreeData','Q');
    // 1.编辑内容-获取管理页面的内容
    let classId = sessionStorage.getItem('classId')
    let quesId = sessionStorage.getItem('quesId')
    this.addName = sessionStorage.getItem('addName')
    // 1.编辑
    if(quesId !== 'undefined'){
      this.$api.quesBankDetail({quesId:quesId}).then(res => {
        this.editForm = res.data.data
        this.editForm.quesId = Number(quesId)
        // 编辑状态
        this.editType = true
        // 多选-答案映射
        if(this.editForm.titleType === '2'){
          this.answerCheck = this.editForm.answer.split('')
        }if(this.editForm.titleType === '3'){
          this.editForm.list  = [{value: '',type: 'A'},{value: '',type: 'B'},{value: '',type: 'C'},{value: '',type: 'D'}]
        }
        // 映射是什么题型内容
        this.questClassChange(this.editForm.titleType)
      })
    }else{// 2.新增
      this.editForm={
        titleType: '1', //题型分类
        quesDifficult: '', //题目难度
        title: '', //题目
        answer: '', // 选择项
        list:[{value: '',type: 'A'},{value: '',type: 'B'},{value: '',type: 'C'},{value: '',type: 'D'}],
        answerAnalysis: '',//答案解析
        ifExam: '', //是否必考
      }
      // 1.映射-内容分类
      if(classId !== ''){
        this.editForm.classId = Number(classId)
      }
      // 1.映射-内容分类
      this.radioShow = true
      this.checkShow = false
      this.judgeShow = false
    }
    
  },
  computed:{
    treeData(){
      return this.$store.state.selectData.contractTreeData.list
    }
  },  
  methods: {
    // 返回
    backManage () {
      this.$router.push({name: 'questionManage'})
    },
    // 改变题型分类
    questClassChange (val) {
      switch(val){
        case '1':
          if(!this.editType){
            this.editForm.list  = [{value: '',type: 'A'},{value: '',type: 'B'},{value: '',type: 'C'},{value: '',type: 'D'}]
          }
          this.radioShow = true
          this.checkShow = false
          this.judgeShow = false
        break
        case '2':
          if(!this.editType){
            this.editForm.list  = [{value: '',type: 'A'},{value: '',type: 'B'},{value: '',type: 'C'},{value: '',type: 'D'}]
          }
          this.radioShow = false
          this.checkShow = true
          this.judgeShow = false
        break
        case '3':
          // this.editForm.list = []
          this.radioShow = false
          this.checkShow = false
          this.judgeShow = true
        break
      }
    },
    // 新增
    addDomain() {
      let num = this.editForm.list.length
      if(num >= 8 ){
        this.$message.error('最多有8个选项')
        return
      }
      this.switchAnswer(num)
      this.editForm.list.push({
        value: '',
        type: this.answerType
      })
    },
    switchAnswer(num){
      switch(num){
        // 判断
        case 'Y': this.answerType = 'Y'
        break
        case 'N': this.answerType = 'N'
        break
        // 单选
        case 0: this.answerType = 'A'
        break
        case 1: this.answerType = 'B'
        break
        case 2: this.answerType = 'C'
        break
        case 3: this.answerType = 'D'
        break
        case 4: this.answerType = 'E'
        break
        case 5: this.answerType = 'F'
        break
        case 6: this.answerType = 'G'
        break
        case 7: this.answerType = 'H'
        break
      }
    },
    // 多选框改变选择
    checkChange(val){
    },
    // 删除题目选项
    removeDomain(item) {
      // 第几个，不是总个数
      var index = this.editForm.list.indexOf(item)
      let num = this.editForm.list.length
      if(num <= 2){
        this.$message.error('至少有2个选项')
        return
      } 
      if (index !== -1) {
        this.editForm.list.splice(index, 1)
      }
      let listArr = []
      // 删除以后要重新规划ABCD
      this.editForm.list.forEach((val,i) => {
        this.switchAnswer(i)
        let obj = {}
        obj.type = this.answerType
        obj.value = val.value
        listArr.push(obj)
      })
      this.editForm.list = listArr

    },
    // 保存
    saveSubmit () {
      // 多选
      if(this.checkShow){
        // 判断哪些是选中状态
        this.editForm.answer = ''
        let checkDom = document.getElementsByClassName("checkBoxDom")
        let checkArr = []
        for(var i=0; i<checkDom.length; i++){
          // 截取class
          let classArr = checkDom[i].className.split(' ')
          // 第几个选中，第几个重新赋选项
          classArr.forEach(val => {
            if(val === 'is-checked'){
              this.switchAnswer(i)
              this.editForm.answer = this.editForm.answer + this.answerType
            }
          })
        }
        // 处理答案
        if(this.editForm.answer === ''){
          this.$message.error('请选择正确答案')
          return
        }
      }else{
        // 处理答案
        if(this.editForm.answer === ''){
          this.$message.error('请选择正确答案')
          return
        }
      }
      
      // 1.编辑
      if(this.editType){
        this.$api.quesBankEdit(this.editForm).then(res => {
          this.$message.success(res.data.messages)
          this.editForm.answer = ''
          this.$router.push({name: 'questionManage'})
        })
      }else{//新增
        this.$api.quesBankAdd(this.editForm).then(res => {
          this.$message.success(res.data.messages)
          this.editForm.answer = ''
          this.$router.push({name: 'questionManage'})
        })
      }
    },
    // 必填项，提交校验格式
    submitForm (formName, callBack) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          return callBack()
        } else {
          console.log('格式 error')
          return false
        }
      })
    },
  }
}
</script>
<style lang="sass"  scoped>
#addEditQuest
  .width230
    width: 230px
    padding-right: 65px
  .width1000
    max-width: 1000px
  .width978
    max-width: 978px
  .changeSpan
    padding: 12px 0 0 2px
    margin-right: 3px
    color: #f56c6c
    float: left
    font-size: 14px
  .rightTitle
    padding-left: 4px
    float: left
    font-size: 16px
    font-family: MicrosoftYaHei-Bold
    font-weight: bold
    color: rgba(51,51,51,1)
  .backIcon
    float: right
    display: block
    // font-weight: bold
    font-size: 26px
    color: #666
    cursor: pointer
    padding-right: 20px
    margin: -8px 0 6px 0
  .editContentDiv
    padding: 20px 2px 10px 40px
    clear: both
    height: auto
    border-radius: 2px
    border: 1px solid #DCDFE6
    background: #fff
  .changeItem
    .el-icon-remove-outline:before
      font-size: 20px
      color: red
      padding-left: 20px
      cursor: pointer
    .el-textarea
      width: 80%
  
  .areaWidth
    width: 83%
  .addWidth
    width: 80%
    max-width: 978px
    margin-left: 25px
    border: 1px dashed #c0c4cc
  .saveItem
    text-align: center
    .el-button
      height: 44px
      width: 150px
</style>
