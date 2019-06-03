<template lang="pug">
#inOffice
  //- 修改1
  //- 1.员工列表
  // transition(name="el-zoom-in-left")
  div.employeeDiv(v-if="employeeDivShow")
    //- 在职离职tab切换
    //- 在职table
    div
      el-tabs.employeeTab(type="", style="box-shadow: initial",@tab-click='tabsClick')
        el-tab-pane(label="在职员工")
          div.font14
            div.floatLeft.width870.padleft23
              el-row.tableType(:gutter='20',v-model="statisticalNumber",v-if="head.btn.btn2 == 'Y'")
                el-col.color555(:span='8',style="font-weight:bold;text-align:left") 本月统计
                  span （{{DateValue1}} - {{DateValue2}}）
                el-col(:span='2') 在职 
                  span(style="font-weight:bold") {{statisticalNumber.onJobSize}}
                el-col(:span='2')
                  div(@click="entryNumClick()") 入职 
                    span.color-type {{statisticalNumber.entrySize}}
                el-col(:span='2')
                  div(@click="leavingNumClick()") 离职 
                    span.color-type {{statisticalNumber.leaveSize}}
                el-col(:span='3')
                  div(@click="contractNumClick()") 合同到期 
                    span.color-type {{statisticalNumber.contractEndSize}}
                el-col(:span='2')
                  div(@click="birthNumClick()") 生日 
                    span.color-type {{statisticalNumber.birthSize}}
                el-col(:span='3')
                  div(@click="transferNumClick()") 调岗&晋升 
                    span.color-type {{statisticalNumber.transferJobSize}}
            div.floatRight.leftDiv
              el-row.tableButton(:gutter='20')
                el-col(:span='4')
                  span
                el-col(:span='11')
                  div.inputSearchDiv
                    el-input.inputSearch.width290(placeholder='请输入姓名或工号', v-model='inOfficeSearch', size='small',  v-on:keyup.native.enter='inOfficeSearchBtn')
                    i.el-icon-search.searchIcon(@click='inOfficeSearchBtn')
                el-col(:span='3')
                  <el-button type="primary" @click.stop="leadingFileVisible = true">导入</el-button>
                el-col(:span='3')
                  <el-button type="primary" @click.stop="exportExcel">导出</el-button>
                el-col(:span='3')
                  el-button(type="primary", @click='filterHandle') 筛选
                el-col(:span='3')
                  el-button(type="primary", @click='addEmployeeBtn') 新增员工
            div(style="clear:both")
          //- 筛选icon
          div.termFilterDiv(v-if='termFilterDivShow',style="clear:both")
            span 条件筛选：
            el-tag(:key='tag',size='small',type='info', v-for='tag in dynamicTags', closable='', :disable-transitions='false', @close='tagHandleClose(tag)')
              span.punctuation
              | {{tag}}
            span(style="color:rgba(60,115,177,1);cursor: pointer",@click='dynamicTagsCloseAll') 清空筛选条件
          div.tableContentScrollDiv
            el-table.inOfficeTable.tableContentScroll.tableBorder(:data='inOfficeTable', style='width: 100%', v-loading="false",height='400px')
              el-table-column(label='序号', type="index")
              el-table-column(v-for='(column, key) in columsIn',:min-width='column.width', :prop='column.pro', :label='column.label', :key='column.pro')
                template(slot-scope='scope')
                  template(v-if='column.pro==="depName"')
                    div(v-if="scope.row.deptName==='未分配'", @click='deptNameHandle(scope.row)',style="cursor:pointer")
                      el-tooltip.item(content='分配',popper-class="tips", placement='right')
                        span(style="color:#3C73B1") {{scope.row.deptName}}
                    span(v-else) {{scope.row.deptName || ''}}
                  template(v-else-if='column.pro==="state"')
                    div(v-if="scope.row.state==='未激活'", @click='stateHandle(scope.row)',style="cursor:pointer")
                      el-tooltip.item(content='发送激活邮箱',popper-class="tips", placement='right')
                        span(style="color:#3C73B1") {{scope.row.state}}
                    span(v-else) {{scope.row.state|| '---'}}
                  template(v-else)
                    | {{scope.row[column.pro] || '---'}}
              el-table-column(label='操作', width="200")
                template(slot-scope='scope')
                  el-tooltip.rowHandle(effect='dark', content='编辑',popper-class="tips", placement='bottom')
                    i.iconfont.icon-bianji(@click='handleEdit(scope.row)')
                  template(v-if="scope.row.turnBtn==='转正'")
                    el-tooltip.rowHandle(effect='dark', content='转正',popper-class="tips", placement='bottom')
                      i.iconfont.icon-zhuanzheng(@click='turnEmployeeHandle(scope.row)')
                  template(v-if="scope.row.leaveBtn==='离职'")
                    el-tooltip.rowHandle(effect='dark', content='离职',popper-class="tips", placement='bottom')
                      i.iconfont.icon-lizhi(@click='leaveHandle(scope.row)')
                  template(v-if="scope.row.transferBtn==='调岗'")
                    el-tooltip.rowHandle(effect='dark', content='调岗',popper-class="tips", placement='bottom')
                      i.iconfont.icon-tiaogang(@click='transferPositionHandle(scope.row)')
                  template(v-if="scope.row.disableBtn==='禁用'")
                    el-tooltip.rowHandle(effect='dark', content='禁用',popper-class="tips", placement='bottom')
                      i.iconfont.icon-Switch_open(@click='disableHandle(scope.row)')
                  template(v-if="scope.row.opendisableBtn==='解禁'")
                    el-tooltip.rowHandle(effect='dark', content='解禁',popper-class="tips", placement='bottom')
                      i.iconfont.icon-Switch_close(@click='openDisableHandle(scope.row)')
              empty(slot="empty",:visible='visible1')
            //- 分页
            pagination.backgFFF(:total="inOfficeTolPage",@size-change="inofficeSizeChange",@current-change="inofficeCurrentChange",
                    :sizes="[10, 20, 30, 40]",
                    :size="20",
                    :current.sync="inpageNum",
                    layout="total, sizes, prev, pager, next, jumper",
                    background)
        // 离职员工
        el-tab-pane(label="离职员工", ref='leaveEmployeeTab')
          div.font14
            div.floatLeft.width870.padleft23
              el-row.tableType(:gutter='20',v-model="statisticalNumber",v-if="head.btn.btn2 == 'Y'")
                el-col.color555(:span='8',style="font-weight:bold;text-align:left") 本月统计
                  span （{{DateValue1}} - {{DateValue2}}）
                el-col(:span='2') 在职 
                  span(style="font-weight:bold") {{statisticalNumber.onJobSize}}
                el-col(:span='2')
                  div(@click="entryNumClick()") 入职 
                    span.color-type {{statisticalNumber.entrySize}}
                el-col(:span='2')
                  div(@click="leavingNumClick()") 离职 
                    span.color-type {{statisticalNumber.leaveSize}}
                el-col(:span='3')
                  div(@click="contractNumClick()") 合同到期 
                    span.color-type {{statisticalNumber.contractEndSize}}
                el-col(:span='2')
                  div(@click="birthNumClick()") 生日 
                    span.color-type {{statisticalNumber.birthSize}}
                el-col(:span='3')
                  div(@click="transferNumClick()") 调岗&晋升 
                    span.color-type {{statisticalNumber.transferJobSize}}
            div.floatRight.leftDiv
              el-row.tableButton(:gutter='20')
                el-col(:span='4')
                  span
                el-col(:span='6')
                  //- el-input.input-with-select(placeholder='请输入姓名或工号', v-model='leaveingSearch', size='mini')
                  //-   el-button(slot='append', icon='el-icon-search', @click='leaveingSearchBtn', size='mini')
                  div.inputSearchDiv
                    el-input.inputSearch.width290(placeholder='请输入姓名或工号', v-model='leaveingSearch', size='small',  v-on:keyup.native.enter='leaveingSearchBtn')
                    i.el-icon-search.searchIcon(@click='leaveingSearchBtn')
            div(style="clear:both")
          div.leaveScroll
            el-table.inOfficeTable.tableContentScroll.tableBorder(:data='leaveingTable', style='width: 100%', v-loading="false",height='400px')
              el-table-column(label='序号', type="index")
              el-table-column(v-for='(column, key) in colums',:width='column.width', :prop='column.pro', :label='column.label', :key='column.pro')
                template(slot-scope='scope')
                  | {{scope.row[column.pro] || '---'}}
              el-table-column(label='操作', width="130px")
                template(slot-scope='scope')
                  el-tooltip.rowHandle(effect='dark', content='编辑',popper-class="tips", placement='bottom')
                    i.iconfont.icon-bianji(@click='handleEdit(scope.row,"leave")')
                  el-tooltip.rowHandle(effect='dark', content='再入职',popper-class="tips", placement='bottom')
                    i.iconfont.icon-zairuzhi(@click='againEmployeeHandle(scope.row)')
              empty(slot="empty",:visible='visible2')    
            //- 分页
            pagination.backgFFF(:total="leaveingTolPage",@size-change="leaveingSizeChange",@current-change="leaveingCurrentChange",
                    :sizes="[10, 20, 30, 40]",
                    :size="20",
                    :current.sync="lepageNum",
                    layout="total, sizes, prev, pager, next, jumper",
                    background)
  // 新增员工
  el-dialog.addEmployeeDialog(:title='addTitle', :visible.sync='addEmployeeDialog', style='margin:0 auto', :close-on-click-modal='false',width='700px')
    p(v-if='addP',style="font-weight: bold;margin-bottom: 10px; padding: 0 0 7px 22px; color: #e2706f;") 注：请按照入职日期从小到大创建员工账号，顺序会影响员工工号的生成!</p>
    el-form.elForm(v-if='addEmployeeDialog',:model='addEmployeeForm', label-width="135px", size="medium",ref="addEmployeeForm", :rules='addEmployeeRules')
      el-form-item(label='姓名', prop='name')
        el-input.addInputWidth(v-model.trim='addEmployeeForm.name')
      el-form-item(label='邮箱', prop='email')
        el-input.width360(placeholder='请输入邮箱', v-model='addEmployeeForm.email',@blur='blurEmail(addEmployeeForm.email)')
        div.emailAfter @edaili.com
      el-form-item(label='手机号', :prop='addPhone')
        el-input.width360(v-if='addPhoneShow',v-model='addEmployeeForm.mobile')
          el-select.selAreaCode(@change='addCodeChange',v-model='addEmployeeForm.mobileInternationalCode', slot='prepend', placeholder='请选择', style='width:100px')
            el-option(v-for='item in selAreaCodeArr', :value='item.code', :label='item.name', :key='item.code')
        el-input.width360(v-if='addPhoneShow1',v-model='addEmployeeForm.mobile1')
          el-select.selAreaCode(@change='addCodeChange',v-model='addEmployeeForm.mobileInternationalCode', slot='prepend', placeholder='请选择', style='width:100px')
            el-option(v-for='item in selAreaCodeArr', :value='item.code', :label='item.name', :key='item.code')
      el-form-item.padleft12(label='是否开启考勤')
        el-switch(v-model='ifAttend',active-text="是",inactive-text="否", active-color='#13ce66', inactive-color='#ff4949')
      el-form-item.padleft12(label='考勤设备',v-if='ifAttend')
        el-select.width360(v-model='addEmployeeForm.sn',placeholder='请选择考勤设备',multiple)
          el-option(v-for='item in deviceArr', :value='item.deviceNo', :label='item.deviceRemark', :key='item.deviceNo') {{item.deviceRemark}}
      el-form-item(label='入职日期', prop='entryDate')
        el-date-picker.addInputWidth(v-model='addEmployeeForm.entryDate', type='date',value-format="yyyy-MM-dd",format="yyyy-MM-dd")
      //- el-form-item(label='员工角色', prop='roleIds')
        el-select.addInputWidth(v-model='addEmployeeForm.roleIds',clearable,multiple, placeholder='请选择') 
          el-option(v-for='item in addEmployeeRoleArr', :key='item.roleId', :label='item.roleName', :value='item.roleId') {{item.roleName}}
      el-form-item.padleft12(label='聘用形式')
        el-select.addInputWidth(v-model='addEmployeeForm.empType',clearable, placeholder='请选择')
          el-option(v-for='item in addEmployeeTypeArr', :key='item.name', :label='item.name', :value='item.code')
      el-form-item(label='职位', prop='position')
        el-input.addInputWidth(v-model.trim='addEmployeeForm.position')
      el-form-item(label='部门', prop='deptId')
        el-cascader.addInputWidth(placeholder='可搜索',:options='distributeOptions', :props="props",  filterable, @change='distributeChange',v-model="distributeInput", change-on-select)
      el-form-item.padleft12(label='所在城市')
        el-select.addInputWidth(v-model='addEmployeeForm.cityId',clearable, placeholder='请选择所在城市')
          el-option(v-for='item in citys', :key='item.name', :label='item.name', :value='item.code') {{item.name}}
      el-form-item.padleft12(label='转正日期')
        el-date-picker.addInputWidth(v-model='addEmployeeForm.regDate', type='date',value-format="yyyy-MM-dd")
      el-form-item.padleft12(label='入职递交材料')
        el-checkbox-group(v-model='addMaterial')
          el-checkbox(v-for='item in selCheckboxArr', :value='item.code', :label='item.code', :key='item.code') {{item.name}}
      el-form-item.padleft12(label='发送激活码到邮箱')
        el-switch(v-model='isSendMsg',active-text="开",inactive-text="关", active-color='#13ce66', inactive-color='#ff4949')  
    .dialog-footer(slot='footer')
      el-button(type='primary', @click='addEmployeeDialogBtn("addEmployeeForm")', size="medium") 确 定
      el-button(@click="resetForm('addEmployeeForm')", size="medium") 取 消
      
  // 转正
  el-dialog.turnEmployeeDialog(title='员工转正', :visible.sync='turnEmployeeDialog', style='margin:0 auto', :close-on-click-modal='false',width='620px')
    el-form.elForm.dialogForm(:model='turnEmployeeDiv', label-width="90px", size="medium")
      div(style="float:left;padding-right:30px")
        img.avatar(v-if="turnImageUrl", :src='turnImageUrl')
        img.avatarEmpty(v-else,src='../../commons/imgs/emptyHead.png')
      div.floatLeft.width400
        div.width60(style="float:left;padding-right: 50px")
          el-form-item(label='姓名：')
            span {{turnEmployeeDiv.name}}
          el-form-item(label='性别：')
            span {{turnEmployeeDiv.sex}}
          el-form-item(label='部门：')
            span {{turnEmployeeDiv.deptName}}
        div(style="float:left")
          el-form-item(label='手机号：')
            span {{turnEmployeeDiv.mobile}}
          el-form-item(label='入职时间：')
            span {{turnEmployeeDiv.entryDate}}
    el-form.elForm(:model='turnEmployeeForm', ref="turnEmployeeForm", label-width="85px", size="medium",style="clear:both; padding-top:16px",)
      span.turnSpan *
      el-form-item(label='转正日期', prop='regDate')
        el-date-picker.addInputWidth(v-model='turnEmployeeForm.regDate',  type="date")
    .dialog-footer(slot='footer')
      el-button(type='primary', @click="submitForm('turnEmployeeForm',turnFormSubmit)", size="medium") 提 交
      el-button(@click="resetForm('turnEmployeeForm')", size="medium") 取 消
  // 离职-turn
  el-dialog.turnEmployeeDialog(title='员工离职', :visible.sync='leaveDialog', style='margin:0 auto', :close-on-click-modal='false',width='620px')
    el-form.elForm.dialogForm(:model='leaveEmployeeDiv',label-width="90px",size="medium")
      div(style="float:left;padding-right:30px;")
        img.avatar(v-if='leaveImageUrl', :src='leaveImageUrl')
        img.avatarEmpty(v-else,src='../../commons/imgs/emptyHead.png')
      div.floatLeft.width400
        div.width60(style="float:left;padding-right: 50px")
          el-form-item(label='姓名：')
            span {{leaveEmployeeDiv.name}}
          el-form-item(label='性别：')
            span {{leaveEmployeeDiv.sex}}
          el-form-item(label='部门：')
            span {{leaveEmployeeDiv.deptName}}
        div(style="float:left")
          el-form-item(label='手机号：')
            span {{leaveEmployeeDiv.mobile}}
          el-form-item(label='入职时间：')
            span {{leaveEmployeeDiv.entryDate}}
    el-form.elForm(:model='leaveEmployeeForm', :rules="leaveRules", ref="leaveEmployeeForm", label-width="120px", size="medium")
      el-form-item(label='离职日期', style="clear:both; padding-top:10px", prop='leavingJobDate')
        el-date-picker.addInputWidth(v-model='leaveEmployeeForm.leavingJobDate', type='date')
      el-form-item(label='离职类型', style="clear:both", prop='leavingJobType')
        el-select.addInputWidth(v-model='leaveEmployeeForm.leavingJobType',clearable, placeholder='请选择')
          el-option(v-for='item in leaveTypeArr', :key='item.code', :label='item.name', :value='item.code')
      el-form-item.padleft12(label='办理离职日期', style="clear:both", prop='')
        el-date-picker.addInputWidth(v-model='leaveEmployeeForm.resignDate', type='date')
      el-form-item.padleft12(label='离职原因', prop='leavingReason')
        el-input.addInputWidth(type='textarea', v-model='leaveEmployeeForm.leavingReason')
    .dialog-footer(slot='footer')
      el-button(type='primary', @click="submitForm('leaveEmployeeForm',leaveFormSubmit)",size="medium") 提 交
      el-button(@click="resetForm('leaveEmployeeForm')",size="medium") 取 消
  // 调岗-弹框
  el-dialog.transferPositionDialog(title='员工调岗', :visible.sync='transferPositionDialog', style='margin:0 auto', :close-on-click-modal='false',width='700px')
    el-form.elForm.dialogForm(:model='transferPositionDiv', label-width="90px", size="medium",style="margin: 0 20px 20px")
      div.dialogAvatar(style="float:left;")
        img.avatar(v-if='transferImageUrl', :src='transferImageUrl')
        img.avatarEmpty(v-else,src='../../commons/imgs/emptyHead.png')
      div.floatLeft.width400
        div.width60(style="float:left;padding-right: 50px")
          el-form-item(label='姓名：')
            span {{transferPositionDiv.name}}
          el-form-item(label='性别：')
            span {{transferPositionDiv.sex}}
          el-form-item(label='部门：')
            span {{transferPositionDiv.deptName}}
        div(style="float:left")
          el-form-item(label='手机号：')
            span {{transferPositionDiv.mobile}}
          el-form-item(label='入职时间：')
            span {{transferPositionDiv.entryDate}}
    el-form.elForm(:model='transferPositionForm', :rules="transferPositionRules", ref="transferPositionForm", label-width="100px", size="medium")
      el-form-item.padleft12(label='原部门', style="clear:both; padding-top:2px; float:left; width:240px")
        span {{transferPositionDiv.deptName}}
      el-form-item(label='新部门', prop='newDeptId', style="float:left; width:400px")
        el-cascader(placeholder='可搜索',:options='distributeOptions', :props="props",  filterable, @change='distributeChange',v-model="distributeInput", change-on-select,style="width:300px")
      el-form-item.padleft12(label='原职位', style="clear:both; padding-top:2px; float:left; width:240px")
        span {{transferPositionDiv.position}}
      el-form-item(label='新职位', prop='newJob', style="float:left; width:400px")
        el-input(placeholder="请填写新职位", v-model="transferPositionForm.newJob")
      el-form-item.padleft12(label='原汇报对象', style="clear:both; padding-top:2px;width:240px")
        span {{transferPositionDiv.repObjName}}
      el-form-item(label='新汇报对象', prop='newRepObjId', style="width:400px")
        el-select.addInputWidth(v-model='deptLeaderName', placeholder='请选择新汇报对象')
          template(slot-scope='scope')
            selectMem(:treeData='optionsPartLeader', @select='selectMem',:clear="deptLeaderName")
            el-option(v-for='(item,index) in [0]', :key='index', :value='item.id')
      el-form-item(label='调岗时间', prop='transferDate', style="clear:both")
        el-date-picker.addInputWidth(v-model='transferPositionForm.transferDate', type='date',value-format="yyyy-MM-dd")
      el-form-item.padleft12(label='调岗原因')
        el-input.addInputWidth(type='textarea', v-model='transferPositionForm.transferReason')
    .dialog-footer(slot='footer')
      el-button(type='primary', @click="submitForm('transferPositionForm',transferPositionSubmit)", size="medium") 提 交
      el-button(@click="resetForm('transferPositionForm')", size="medium") 取 消
  //- 编辑个人信息页面
  //- 分配弹出框
  el-dialog.distributeDiv(title='分配部门', :visible.sync='distributeShow', style='margin:0 auto', :close-on-click-modal='false',width="660px")
    el-form(label-width="120px")  
      el-form-item(label='上级部门：')
        el-cascader.addInputWidth(placeholder='可搜索',:options='distributeOptions', :props="props",  filterable, @change='departmentChange',v-model="distributeInput", change-on-select)
    .dialog-footer(slot='footer')
      el-button(@click="distributeReset") 取 消
      el-button(type='primary', @click="distributesubmit") 确 定
  //- 导入
  leadingFile(:visible.sync="leadingFileVisible" @submit="leadSubmit")
  //- 筛选-弹出框
  el-dialog(title='筛选条件', :visible.sync='termFilterFormShow', style='margin:0 auto', :close-on-click-modal='false',width="570px")
    el-form.elForm(:model='inOfficeParam',v-if="termFilterFormShow",ref='inOfficeParam',label-width="90px",size='medium')  
      el-form-item(label='汇报对象')
        el-radio-group(v-model='inOfficeParam.hasRepObj')
          el-radio(label='Y', value='Y') 有
          el-radio(key='N', label='N' ) 无
      el-form-item(label='部门')
        el-cascader.addInputWidth(placeholder='请选择',clearable,:options='distributeOptions', :props="props",  filterable, @change='termFilterChange',v-model="termFilterDeptId", change-on-select)
      el-form-item(label='邮箱', prop='email')
        el-input.width360(placeholder='请输入邮箱', v-model='inOfficeParam.email',@blur='blurEmail(inOfficeParam.email)')
        div.emailAfter2 @edaili.com
      el-form-item(label='手机号', :prop='addPhone')
        el-input.width360(v-if='',v-model='inOfficeParam.mobile')
          //- el-select.selAreaCode(@change='addCodeChange',v-model='inOfficeParam.mobileInternationalCode', slot='prepend', placeholder='请选择', style='width:100px')
            el-option(v-for='item in selAreaCodeArr', :value='item.code', :label='item.name', :key='item.code')
        //- el-input.width360(v-if='addPhoneShow1',v-model='inOfficeParam.mobile1')
          el-select.selAreaCode(@change='addCodeChange',v-model='inOfficeParam.mobileInternationalCode', slot='prepend', placeholder='请选择', style='width:100px')
            el-option(v-for='item in selAreaCodeArr', :value='item.code', :label='item.name', :key='item.code')
      el-form-item(label='聘用形式')
        el-select.addInputWidth(v-model='inOfficeParam.empType',clearable, placeholder='请选择',@change='empTypeChange')
          el-option(v-for='item in addEmployeeTypeArr', :key='item.code', :label='item.name', :value='item.code') {{item.name}}
      el-form-item(label='账号状态')
        el-checkbox-group(v-model='inOfficeParam.accountStates')
          el-checkbox(label='Y', name='accountStates') 激活
          el-checkbox(label='N', name='accountStates') 未激活
          el-checkbox(label='D', name='accountStates') 已禁用
      el-form-item(label='入职日期')
        el-date-picker.addInputWidth(v-model='inOfficeParam.entryDate', type='date',value-format="yyyy-MM-dd")
    .dialog-footer(slot='footer')
      el-button(type='primary', @click="termFilterFormsubmit('inOfficeParam')",size='medium') 确 定
      el-button(@click="termFilterFormReset('inOfficeParam')",size='medium') 取 消
</template>
<script>
import core from '@/api/core'
import util from '../../util'
import axios from 'axios'
import {mapState,mapMutations} from "vuex"
import leadingFile from "./leadingFile"
import { switchCase } from 'babel-types';
import selectMem from "../../components/selectMem"
import '../../commons/publicCss/outside.sass'
import empty from "@/components/empty"
import pagination from "../../components/pagination"
export default {
  name: 'inOffice',
  components :{leadingFile,selectMem,pagination,empty},
  data () {
    var validateRoleCodes = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请选择用户角色'))
      }else {
        callback();
      }
    }
    return {
      leadingFileVisible : false, //导入说明的显示和隐藏
      // 1.tab-在职table
      addTitle: '新增员工',
      inOfficeTable: [],
      // 在职员工分页总数
      inOfficeTolPage: 1,
      // 在职筛选弹出框-InOffice参数
      inOfficeParam: {
        key:'',
        pageNum:1,
        pageSize:20,
        hasRepObj:'',
        empType:'',
        mobile: '',
        mobile1: '',
        email:'',
        mobileInternationalCode: '0086',
        deptId:'',
        entryDate:'',
        accountStates: []
      },
      columsIn:[
        {
          pro : 'name',
          label : '姓名',
          width: '100px'
        },
        {
          pro : 'employeeNo',
          label : '工号',
          width: '100px'
        },
        {
          pro : 'mobile',
          label : '手机号',
          width: '100px'
        },{
          pro : 'email',
          label : '邮箱',
          width: '150px'
        },
        {
          pro : 'deptName',
          label : '部门',
          width: '100px'
        },
        {
          pro : 'empType',
          label : '聘用形式',
          width: '100px'
        },
        {
          pro : 'position',
          label : '职位',
          // width: '120px'
        },
        {
          pro : 'level',
          label : '职级',
        },{
          pro : 'repObjName',
          label : '汇报对象',
        },
        {
          pro : 'entryDate',
          label : '入职日期',
          width: '100px'
        },
        {
          pro : 'state',
          label : '状态',
          width: '100px'
        },
      ],
      inOfficeSearch: '',
      // inOfficeNums: '',
      statisticalNumber: {
        birthSize: '',
        contractEndSize: '',
        entrySize: '',
        leaveSize: '',
        onJobSize: '',
        transferJobSize: ''
      },
      inpageNum:1,
      lepageNum:1,
      // 2.离职员工
      leaveingTable: [],
      leaveingTolPage: 1,
      leaveingtotleP : '',
      colums:[
        {
          pro : 'name',
          label : '姓名',
        },
        {
          pro : 'employeeNo',
          label : '工号'
        },
        {
          pro : 'mobile',
          label : '手机号',
          width: '100px'
        },
        {
          pro : 'deptName',
          label : '部门',
        },
        {
          pro : 'empTypeName',
          label : '聘用形式'
        },
        {
          pro : 'position',
          label : '职位',
        },
        {
          pro : 'level',
          label : '职级',
        },
        {
          pro : 'entryDate',
          label : '入职日期',
        },
        {
          pro : 'leavingJobDate',
          label : '离职日期'
        },
      ],
      leaveingParam: {
        key:'',
        pageNum:'1',
        pageSize:'20'
      },
      // 导出员工统计数据到excel并下载
      exportToExcel : {},
      leaveingSearch: '',
      // 新增员工
      addEmployeeDialog: false,
      addP: false,
      // 找回密码-手机
      addPhone:'mobile',
      addPhoneShow:true,
      addPhoneShow1:false, 
      addEmployeeForm: {
        name: '',
        mobile: '',
        mobile1: '',
        email:'',
        entryDate: '',
        mobileInternationalCode: '0086',
        roleIds: [],
        sn:[],
        empType: '',
        regDate: '',
        deptId: '',
        position: '',
        cityId: '',
        entryMaterial:'',
        isSendMsg: 'Y'
      },
      deviceArr:[],
      isSendMsg: true,
      ifAttend: true,
      addEmployeeRules:{
        name:[
          {required:true,message:'姓名必填',trigger:'blur'},
          {pattern:/^.{1,20}$/, message: '请输入1-20位字符',trigger:'change' }
        ],
        email:[
          {required:true,message:'邮箱必填',trigger:'blur'},
          {pattern:/^[a-zA-Z0-9\s_.-]+/, message: '请输入正确的邮箱',trigger:'blur' }
        ],
        mobile:[
          {required:true,message:'手机号必填',trigger:'change'},
          {pattern:/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/, message: '请输入正确的11位手机号',trigger:'change' }
        ],
        mobile1:[
          {required:true,message:'手机号必填',trigger:'change'},
          {pattern:/^(5|6|8|9)\d{7}$/, message: '请输入正确的8位手机号',trigger:'change' }
        ],
        entryDate:[
          {required:true,message:'入职日期必填',trigger:'change'},
        ],
        sn:[
          {required:true,message:'请选择考勤设备',trigger:'change'},
        ],
        roleIds:[
          {required: true, validator:validateRoleCodes, trigger: 'change' }
        ],
        position:[
          {required:true,message:'员工职位必填',trigger:'blur'},
        ],
        deptId:[
          {required:true,message:'员工部门必填',trigger:'change'},
        ],
      },
      addMaterial: [],
      addEmployeeRoleArr: [],
      // citysModel: [],
      // 部门
      distributeOptions: [],
      props:{
        value: 'id',
        label: 'text',
        children: 'children'
      },
      // input值先清空
      distributeInput: [],
      addSectionFilter: '',
      addSectionTree: [],
      addSectionProps: {
        children: 'children',
        label: 'label'
      },
      tree: '0', // 判断添加部门的tree的选择状态
      addSectionTreeDivShow: false,
      formLabelWidth: '120px',
      // 转正员工-弹窗
      turnEmployeeDialog: false,
      turnEmployeeDiv: {
        name: '',
        deptName: '',
        sex: '',
        mobile: '',
        entryDate: ''
      },
      turnEmployeeForm: {
        regDate: '',
        userId: ''
      },
      turnRules: {
        regDate: [
          { type: 'date', required: true, message: '请选择转正日期', trigger: 'change' }
        ]
      },
      turnImageUrl: '',
      // 离职-弹窗leaveEmployeeForm
      leaveDialog: false,
      leaveEmployeeDiv: {
        name: '',
        deptName: '',
        sex: '',
        mobile: '',
        entryDate: ''
      },
      leaveEmployeeForm: {
        leavingJobType: '',
        leavingJobDate: '',
        resignDate: '',
        leavingReason: '',
        userId: ''
      },
      leaveRules: {
        leavingJobDate: [
          { type: 'date', required: true, message: '请选择离职日期', trigger: 'change' }
        ],
        leavingJobType: [
          { required: true, message: '请选择离职类型', trigger: 'change' }
        ]
      },
      leaveImageUrl: '',
      // 调岗-transferPositionForm
      transferPositionDialog: false,
      transferPositionDiv: {
        name: '',
        deptName: '',
        sex: '',
        mobile: '',
        position: '',
        repObjName: '',
        entryDate: ''
      },
      transferPositionForm: {
        newDeptId: '',
        newJob: '',
        newRepObjId: '',
        transferDate: '',
        transferReason: '',
        userId: ''
      },
      transferPositionRules: {
        newDeptId: [
          {required: true, message: '请选择新部门', trigger: 'blur' }
        ],
        newJob: [
          {required: true, message: '请填写新职位', trigger: 'blur' }
        ],
        newRepObjId: [
          {required: true, message: '请选择汇报对象', trigger: 'blur' }
        ],
        transferDate: [
          { required: true, message: '请选择调岗日期', trigger: 'blur' }
        ],
        transferReason: [
          { required: true, message: '请填写离职原因', trigger: 'change' }
        ]
      },
      transferImageUrl: '',
      // tree
      partTreeShow: false,
      filterText: '',
      optionsPartLeader: [],
      props:{
        value: 'id',
        label: 'text',
        children: 'children'
      },
      leaderGroup: '',
      partLeaderRadio: [],
      deptLeaderName: '',
      // 编辑个人信息
      
      // loading
      loading: false,
      employeeDivShow: true,
      // 分配
      distributeShow: false,
      distributeId: '',
      userIds: [],
      // 城市
      optionsCitys: [],
      // 筛选div
      termFilterFormShow: false,
      termFilterForm:{
        sex:'',
        empType:'',
        deptId:'',
        entryDate:'',
        accountStates: []
      },
      termFilterDivShow: false,
      termFilterDeptId: [],
      dynamicTags: [],
      newValFilter:'',
      disableBtn: true,
      visible1: false,
      visible2: false
    }
  },
  computed:{
    ...mapState({
      "selAreaCodeArr" : state => state.selectData.areacode.list ,
      // "addEmployeeRoleArr" : state => state.selectData.idsAndNames ,
      "selCheckboxArr" : state => state.selectData.entrymaterials.list ,
      "addEmployeeTypeArr" : state => state.selectData.hireform.list ,
      "leaveTypeArr" : state => state.selectData.quittype.list ,
      "citys" : state => state.selectData.city.list,
      // "sex" : state => Object.assign([],state.selectData.sex.list)
      "sexArr" : state => state.selectData.sex.list,
      "head" : state=>state.headInfo
      }),
  },
  created () {
    // 1.获取在职员工列表
    this.getInOfficeList()
    // 2.部门tree-搜索使用这，否则会报错
    // core.orgTreeBaseInfo().then((res) => {
    //   util.codeConfirm(res.data,this)
    //   if(res.data.code === '200'){
    //     this.distributeOptions = JSON.parse(JSON.stringify(res.data.data))
    //     // 获取部门负责人-汇报对象
    //     this.optionsPartLeader = JSON.parse(JSON.stringify(res.data.data))
    //     this.$util.findChildren(this.distributeOptions, 'children')
    //   }
    // }).catch(util.errorHandle)
    this.$store.dispatch('getOrgTreeExtInfo').then( obj =>{
      this.distributeOptions = obj
      this.optionsPartLeader = obj
    })
    // 区号
    // this.$store.dispatch('getData','areacode')
    // 日期转换
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
        m = date.getMonth()
    this.DateValue1 = new Date(y, m, 1).Format("yyyy-MM-dd");
    this.DateValue2 = new Date(y, m + 1, 0).Format("yyyy-MM-dd");
    this.brithDateValue1 = new Date(y, m, 1).Format("yyyy-MM-dd");
    this.brithDateValue2 = new Date(y, m + 1, 0).Format("yyyy-MM-dd");
    // 统计 人数展现
    this.getMonthlyStatistics()
    // 城市
    // this.$store.dispatch('getCity').then(obj => {
    //   this.optionsCitys = obj
    // })
    // 1.先得到列表 - 第二种
    // this.$store.dispatch('getIdsAndNames').then(obj => {
    //   obj.forEach(val => {
    //     if(val.roleName !== "管理员"){
    //       this.addEmployeeRoleArr.push(val)
    //     }
    //   })
    // })
    // 关闭tree
    // this.closeTree()
    // 2.加载设备列表
    this.$api.getAvailableDevice().then(res=>{
      this.deviceArr = res.data.data
    })
  },
  methods: {
    // 新增code切换
    addCodeChange(val){
      switch(val){
        case '0086':
          // this.addEmployeeForm.mobile = ''
          // this.addEmployeeForm.mobile1 = ''
          this.addPhoneShow = true
          this.addPhoneShow1 = false
          this.addPhone = 'mobile'
        break;
        case '00852':
          this.addPhone = 'mobile1'
          this.addPhoneShow = false
          this.addPhoneShow1 = true
        break;
      }
    },
    getMonthlyStatistics () {
      // 统计 人数展现
      if(this.head.btn.btn2 == 'Y'){
        core.monthlyStatistics({beginDate: this.DateValue1,endDate: this.DateValue2}).then((res) => {
          this.statisticalNumber = res.data.data
        })
      }
    },
    leadSubmit(){
      setTimeout(()=>{
        this.getInOfficeList();
        // 刷新统计列表
        this.getMonthlyStatistics()
        this.leadingFileVisible = false;
      },100);
    },
    // 1.在职列表
    getInOfficeList () {
      let inOfficeParam = Object.assign({},this.inOfficeParam)
      // 初始化手机号 邮箱
      // if(inOfficeParam.mobileInternationalCode === '00852'){
      //   inOfficeParam.mobile = inOfficeParam.mobile1
      // }
      // 初始化邮箱
      // if(inOfficeParam.email!=''){
      //   inOfficeParam.email = inOfficeParam.email + '@edaili.com'
      // }
      core.getInOfficeList(inOfficeParam).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          // 遍历row 截取逗号
          res.data.data.list.forEach(list => {
            let value = list.operItems.split(",")
            for (let i in value){
              switch (value[i]) {
                case "转正": list.turnBtn = "转正"
                  break
                case "离职": list.leaveBtn = "离职"
                  break
                case "调岗": list.transferBtn = "调岗"
                  break
                case "禁用": list.disableBtn = "禁用"
                  break
                case "解禁": list.opendisableBtn = "解禁"
                  break
              }
            }
          })
          this.inOfficeTable = res.data.data.list
          this.inOfficeTolPage = res.data.data.total
          this.visible1 = true
        }
      }).catch(util.errorHandle)
    },
    // 下载文件
    downFile(fileName){
      this.$store.dispatch('downFile',{type:'get',url : '/admin/employee/export/incumbent', data : this.exportToExcel ,  fileName :fileName})
    },
    // 入职列表导出为excel文件
    exportExcel(){
      let accountStates =  this.inOfficeParam.accountStates
      accountStates = accountStates.toString()
      this.exportToExcel = {
        entryDate : this.inOfficeParam.entryDate,
        deptId : this.inOfficeParam.deptId,
        email : this.inOfficeParam.email,
        empType : this.inOfficeParam.empType,
        key : this.inOfficeParam.key,
        mobile : this.inOfficeParam.mobile,
        hasRepObj : this.inOfficeParam.hasRepObj,
        accountStates: accountStates,
      }
      if(this.inOfficeParam.entryDate == ''){
        delete this.exportToExcel.entryDate
      }
      console.log(this.exportToExcel)
      this.downFile('在职员工列表.xls');
    },
    // 在职搜索
    inOfficeSearchBtn () {
      this.inOfficeParam.pageNum = 1
      this.inpageNum = 1
      this.inOfficeParam.key = this.inOfficeSearch
      this.getInOfficeList()
    },
    // 在职列表列表分页
    inofficeSizeChange (val) {
      this.inOfficeParam.pageSize = val.value
      if(val.isLoad){
        this.getInOfficeList()
      }
    },
    inofficeCurrentChange (val) {
      this.inOfficeParam.pageNum = val
      this.getInOfficeList()
    },
    // 新增员工
    addEmployeeBtn () {
      this.addP = true
      this.addTitle= '新增员工'
      this.distributeInput = []
      this.addMaterial = []
      this.isSendMsg =true
      this.addPhoneShow = true
      this.addPhoneShow1 = false
      this.addPhone = 'mobile'
      // 初始化
      this.addEmployeeForm = {
        name: '',
        mobile: '',
        entryDate: '',
        email: '',
        mobileInternationalCode: '0086',
        roleIds: [],
        empType: '',
        regDate: '',
        sn:[],
        deptId: '',
        position: '',
        cityId: '',
        entryMaterial:'',
        isSendMsg: 'Y'
      }
      this.addEmployeeDialog = true
    },
    // 分配选择部门时获取父级部门id
    distributeChange (value) {
      this.transferPositionForm.newDeptId = value[value.length-1]
    },
    termFilterChange (value) {
      this.inOfficeParam.deptId = value[value.length-1]
    },
    empTypeChange(value) {
      console.log(value)
    },
    // 确定-新增员工
    addEmployeeDialogBtn (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let addEmployeeForm = Object.assign({},this.addEmployeeForm)
          // 初始化手机号
          if(addEmployeeForm.mobileInternationalCode === '00852'){
            addEmployeeForm.mobile = addEmployeeForm.mobile1
          }
          // 初始化部门
          addEmployeeForm.deptId = this.distributeInput[this.distributeInput.length-1]
          // 用户角色-后端字符串类型
          addEmployeeForm.roleIds = addEmployeeForm.roleIds.toString()
          addEmployeeForm.sn = addEmployeeForm.sn.toString()
          // 初始化材料
          var materialString = ''
          this.addMaterial.forEach(val => {
            materialString += val + ','
          })
          // 过滤邮箱
          let email = addEmployeeForm.email.replace(/\s*/g,"")//空格
          email = email.toLowerCase()//大写转化为小写
          let emailLast = email.substring(email.length-11,email.length)
          if(emailLast == '@edaili.com'){ //去掉末尾的 @edaili.com
            email = email.substring(0,email.length-11)
          }
          // let email = addEmployeeForm.email
          addEmployeeForm.email = email + '@edaili.com'
          // 是否参与考勤
          if(this.ifAttend === true){
            addEmployeeForm.ifAttend = "Y"
            // 判断是否选择了考勤设备
            if(this.addEmployeeForm.sn.length == 0){
              this.$message.error('请选择考勤设备！')
              return false;
            }
          }else{
            addEmployeeForm.ifAttend = "N"
          }
          // 初始化激活码
          if(this.isSendMsg === true){
            addEmployeeForm.isSendMsg = "Y"
          }else{
            addEmployeeForm.isSendMsg = "N"
          }
          addEmployeeForm.entryMaterial = materialString
          if(this.addTitle === '新增员工'){
            this.$api.addEmployee(addEmployeeForm).then((res) => {
              // util.codeConfirm(res.data,this)
              if(res.data.code === '200'){
                // 刷新员工列表
                this.getInOfficeList()
                // 刷新统计列表
                this.getMonthlyStatistics()
                this.$refs['addEmployeeForm'].resetFields()
                // 继续
                this.$confirm('添加新员工成功', '提示', {
                  distinguishCancelAndClose: true,
                  confirmButtonText: '继续新增员工',
                  cancelButtonText: '完善员工详情'
                }).then(() => {
                  // 继续新增员工-弹出框出现
                  // 初始化弹窗
                  this.addEmployeeDialog = false
                  this.addEmployeeBtn()
                }).catch((action ) => {
                  if(action === 'cancel'){
                    // 完善员工详情-跳转到编辑页面
                    this.addEmployeeDialog = false
                    // sessionStorage.setItem('editUserId',res.data.data.userId)
                    // sessionStorage.setItem('editValueShow','in')
                    // this.$router.push({ name: 'editInfo'})     
                    localStorage.setItem('editUserId',res.data.data.userId)
                    localStorage.setItem('editValueShow','in')
                    const {href} = this.$router.resolve({
                      name: 'editInfo',
                    })
                    window.open(href, '_blank')
                  
                  }else{
                    this.addEmployeeDialog = false
                  }
                })
              }
            }).catch(res=>{
            })
          } else if(this.addTitle === '再入职'){
            core.reentry(addEmployeeForm).then((res) => {
              util.codeConfirm(res.data,this)
              if(res.data.code === '200'){
                // 刷新离职员工列表
                this.getleaveingList()
                // 刷新统计列表
                this.getMonthlyStatistics()
                // 刷新在职列表
                this.getInOfficeList()
                this.$message.success(res.data.messages)
                this.addEmployeeDialog = false
              }
            }).catch(util.errorHandle)
          } 
        } else {
          console.log('格式 error')
          return false
        }
      })
    },
    // tab切换table操作按钮
    // 编辑按钮
    handleEdit (row,valueShow) {
      // sessionStorage.setItem('editUserId',row.userId)
      // sessionStorage.setItem('editValueShow',valueShow)
      // window.sessionStorage['empNoClick'] = false
      // this.$router.push({ name: 'editInfo'})
      // 打开一个新的页面
      localStorage.setItem('editUserId',row.userId)
      localStorage.setItem('editValueShow',valueShow)
      window.localStorage['empNoClick'] = false
      const {href} = this.$router.resolve({
        name: 'editInfo',
      })
      window.open(href, '_blank')
    },
    // 转正按钮
    turnEmployeeHandle (row) {
      this.turnEmployeeDialog = true
      this.turnEmployeeDiv = row
      // 加载头像
      this.$store.dispatch('imgUrlToBlob',row.heardPic).then(src=>{
        this.turnImageUrl = src;
      })
      this.loadHeaderImg({src : row.heardPic , key : 'turnImageUrl'});
      // 初始化
      this.turnEmployeeForm.regDate = row.regDate
      this.initialSex(row.sex,this.turnEmployeeDiv)
      this.turnEmployeeForm.userId = row.userId
    },
    // 离职按钮
    leaveHandle (row) {
      // 初始化，调接口保存
      this.leaveDialog = true
      this.leaveEmployeeDiv = row
      // 加载头像
      this.loadHeaderImg({src : row.heardPic , key : 'leaveImageUrl'});
      this.initialSex(row.sex,this.leaveEmployeeDiv)
      // 初始化
      this.leaveEmployeeForm = {
        leavingJobType: '',
        leavingJobDate: '',
        resignDate: '',
        leavingReason: ''
      },
      this.leaveEmployeeForm.userId = row.userId
    },
    // 调岗日期
    transferPositionHandle (row) {
      // setTimeout(() => {
      //   this.$refs['transferPositionForm'].resetFields()
      //   this.$refs['transferPositionForm'].clearValidate()
      // },200)
      // 先初始化
      this.transferPositionForm = {
        newDeptId: '',
        newJob: '',
        newRepObjId: '',
        transferDate: '',
        transferReason: ''
      }
      this.distributeInput = []
      this.deptLeaderName = ''
      // radio清空
      this.leaderGroup = ''
      this.transferPositionDialog = true
      this.transferPositionDiv = row
      // 加载头像
      this.loadHeaderImg({src : row.heardPic , key : 'transferImageUrl'});
      this.initialSex(row.sex,this.transferPositionDiv)
      this.transferPositionForm.userId = row.userId
      
    },
    // 男女
    initialSex (sex, This) {
      if (sex === 'M') {
        This.sex = '男'
      } else if ( sex === 'F') {
        This.sex = '女'
      }
    },
    // 点击新汇报对象 tree显示
    selectMem(obj){
      this.transferPositionForm.newRepObjId = obj.mem.userId
      this.deptLeaderName = obj.mem.userName
    },
    partTreeFocus () {
      this.partTreeShow = true
    },
     // 添加中部门负责人的tree过滤
    partLeaderFilter (value, data) {
      if (!value) return true
      return data.text.indexOf(value) !== -1
    },
    // 点击部门将内容传给后端，获取负责人
    handleNodeClick (data) {
      core.getEmpsByDeptId({deptId:data.id}).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.partLeaderRadio = res.data.data
        }
      }).catch(util.errorHandle)
    },
    // 点击radio
    changeRadio (value) {
      this.deptLeaderName = value
      this.partLeaderRadio.forEach( d => {
        if(value === d.userName){
          this.transferPositionForm.newRepObjId = Number(d.userId)
          this.partTreeShow = false
        }
      })
    },
    partLeaderClose () {
      this.partTreeShow = false
    },
    handleDelete (index, row) {
    },
    // --新增员工--
    // 新增部门tree
    addSectionTreefilter (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // check:当复选框被点击的时候触发
    checkSectionFilterList (data) {
      this.addEmployeeForm.section = data.label
      this.addSectionTreeDivShow = false
    },
    // tree单选-check-change:节点选中状态发生变化时的回调
    handleClickRadio (data, checked, node) {
      this.tree++
      if (this.i % 2 === 0) {
        if (checked) {
          this.$refs.addSectionTree.setCheckedNodes([])
          this.$refs.addSectionTree.setCheckedNodes([data])
          // 交叉点击节点
        } else {
          this.$refs.addSectionTree.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    addSectionShow () {
      this.addSectionTreeDivShow = !this.addSectionTreeDivShow
    },
    // --转正--
    // 转正提交
    turnFormSubmit () {
      if (this.turnEmployeeForm.regDate) {
        core.turnPositive(this.turnEmployeeForm).then((res) => {
          util.codeConfirm(res.data,this)
          if(res.data.code === '200'){
            this.getInOfficeList()
            this.$message.success(res.data.messages)
            this.turnEmployeeDialog = false
            this.getMonthlyStatistics()
          }
        }).catch(util.errorHandle)
      } else {
        this.$message.error('转正日期不能为空')
      }
    },
    // 离职提交
    leaveFormSubmit () {
      core.leavingJob(this.leaveEmployeeForm).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.getInOfficeList()
          this.$message.success(res.data.messages)
          this.leaveDialog = false
          this.getMonthlyStatistics()
        }
      }).catch(util.errorHandle)
    },
    // 调岗提交-transferPositionSubmit
    transferPositionSubmit () {
      core.transPosition(this.transferPositionForm).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.getInOfficeList()
          this.$message.success(res.data.messages)
          this.transferPositionDialog = false
          this.$refs['transferPositionForm'].resetFields()
          this.getMonthlyStatistics()
        }
      }).catch(util.errorHandle)
    },
    disableChange(row){
      this.disableHandle (row)
    },
    // 禁用-disableHandle
    disableHandle (row) {
      this.$confirm('此操作是禁用账号操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 调用禁用接口
          core.accountDisable({userId:row.userId}).then((res) => {
            util.codeConfirm(res.data,this)
            if(res.data.code === '200'){
              this.getInOfficeList()
              this.$message({type: 'success',message: '禁用成功!'})
            }
          }).catch(util.errorHandle)
        }).catch(() => {
          this.$message({type: 'info',message: '已取消'});
        })
    },
    // 解禁-disableHandle
    openDisableHandle (row) {
      this.$confirm('此操作是解禁账号操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 调用禁用接口
          core.endisable({userId:row.userId}).then((res) => {
            util.codeConfirm(res.data,this)
            if(res.data.code === '200'){
              this.getInOfficeList()
              this.$message({type: 'success',message: '解禁成功!'})
            }
          }).catch(util.errorHandle)
        }).catch(() => {
          this.$message({type: 'info',message: '已取消'});
        })
    },
    // 提交校验格式
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
    // 取消重置
    resetForm (formName) {
      // 此时只是把form里面的内容清空了，但是层级联动必须手动清除
      this.$refs[formName].resetFields()
      this.turnEmployeeDialog = false
      this.leaveDialog = false
      this.transferPositionDialog = false
      this.addEmployeeDialog = false
      // 新增
      this.distributeInput = []
    },
    // 关闭loading
    closeLoading () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 2000)
    },
    // 1.点击在职人数
    entryNumClick () {
      // 加载路由
      this.$router.push({name: 'entryNumPage'})
    },
    // 2.点击离职人数
    leavingNumClick () {
      this.$router.push({name: 'leavingNumPage'})
    },
    // 3.点击合同人数
    contractNumClick () {
      this.$router.push({name: 'contractNumPage'})
    },
    // 4.点击birth人数
    birthNumClick () {
      this.$router.push({name: 'brithNumPage'})
    },
    // 5.点击transfer人数
    transferNumClick () {
      this.$router.push({name: 'transferNumPage'})
    },
    // tab切换时间
    tabsClick (tab, event) {
      if(tab.label === "离职员工"){
        // this.$refs.leaveEmployeeTab.appendChild(leaveEmployeeList)
        // this.$router.push({ name: 'leaveEmployeeList'})
        // 获取table
        this.getleaveingList()
      }
    },
    // 2.离职列表
    getleaveingList () {
      core.getLeavingList(this.leaveingParam).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.leaveingTable = res.data.data.list
          this.leaveingTolPage = res.data.data.total
          this.leaveingtotleP = res.data.data.pages
          this.visible2 = true
        }
      }).catch(util.errorHandle)
    },
    //离职列表搜索
    leaveingSearchBtn () {
      this.leaveingParam.pageNum = 1
      this.lepageNum = 1
      this.leaveingParam.key = this.leaveingSearch
      this.getleaveingList()
    },
    // 离职列表列表分页
    leaveingSizeChange (val) {
      this.leaveingParam.pageSize = val.value
      if(val.isLoad){
        this.getleaveingList()
      }
    },
    leaveingCurrentChange (val) {
      this.leaveingParam.pageNum = val
      this.getleaveingList()
    },
    loadHeaderImg ({src,key}) {
      this.$store.dispatch('imgUrlToBlob',src).then(obj=>{
        this[key] = obj;
      })
    },
    // 再入职
    againEmployeeHandle (row) {
      this.addTitle= '再入职'
      this.addEmployeeForm.mobile1 = ''
      this.addEmployeeForm.mobile = ''
      this.addEmployeeDialog = true
      // 初始化信息
      this.addEmployeeForm.userId = row.userId
      this.addEmployeeForm.name=row.name
      this.addEmployeeForm.mobileInternationalCode=row.mobileInternationalCode
      this.addEmployeeForm.entryDate=''
      // 邮箱
      let emailRow = row.email
      this.addEmployeeForm.email = emailRow.substring(0,emailRow.length-11)
      // 先映射出数组
      if(row.roleIds != ""){
        this.addEmployeeForm.roleIds = []
        let roleIdsArr=row.roleIds.split(",")
        roleIdsArr.forEach(val =>{
          this.addEmployeeForm.roleIds.push(Number(val))
        })

      }else{
        this.addEmployeeForm.roleIds = []
      }
      if(this.addEmployeeForm.mobileInternationalCode === '00852'){
        this.addEmployeeForm.mobile1 = row.mobile
      }else{
        this.addEmployeeForm.mobile = row.mobile
      }
      // 考勤设备
      this.addEmployeeForm.sn = []
      // this.addEmployeeForm.mobile=row.mobile
      this.addEmployeeForm.empType=row.empType
      this.addEmployeeForm.regDate=''
      // 职位
      this.addEmployeeForm.position = row.position
      console.log(row.roleIds)
      // 部门-映射
      this.$store.dispatch('getAllOrgIdInfoObj',Number(row.deptId)).then(obj=>{
        this.distributeInput = obj
      })
      // 城市
      this.addEmployeeForm.cityId=row.cityId
      // 材料显示
      this.addMaterial = []
      this.isSendMsg = true
    },
    // 状态激活
    stateHandle (row) {
      this.$confirm('确定要发送激活邮箱吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送激活邮箱接口
        this.$api.activeAccountEmail({userId : row.userId}).then(obj=>{
          this.$message.success('发送成功！');
          console.log(obj);
        })
        // core.sendVerCode({userId:row.userId}).then((res) => {
        //   util.codeConfirm(res.data,this)
        //   if(res.data.code === '200'){
        //     // row.state = '已激活'
        //     this.$message({type: 'success',message: '激活码发送成功!'})
        //   }
        // }).catch(util.errorHandle)
      }).catch(() => {
        this.$message({type: 'info',message: '已取消'});
      })
    },
    // 分配
    deptNameHandle (row) {
      this.distributeInput =[]
      this.userIds[0] = row.userId
      this.distributeShow = true
    },
    // 分配取消
    distributeReset () {
      this.distributeShow = false
    },
    // 分配选择部门时获取父级部门id
    departmentChange (val) {
      this.distributeId = val[val.length-1]
    },
    // 分配成功提交
    distributesubmit () {
      core.distributeDept({deptId: this.distributeId,userIds: this.userIds}).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.distributeShow = false
          this.getInOfficeList()
          this.$message.success(res.data.messages)
        }
      }).catch(util.errorHandle)
    },
    // 筛选
    filterHandle () {
      this.termFilterDeptId=[]
      this.termFilterFormShow = true
    },
    callBackFilter (newValFilter) {
      this.newValFilter = newValFilter
    },
    termFilterFormsubmit () {
      this.dynamicTags= []
      this.termFilterFormShow = false
      // 初始化条件 性别
      let filterSex = this.inOfficeParam.hasRepObj;
      if(filterSex !== '' && filterSex !== undefined){
        filterSex = "汇报对象：" + (filterSex == 'Y' ? '有' : '无');
        this.dynamicTags.push(filterSex)
      }
      // 部门
      if(this.inOfficeParam.deptId !== '' && this.inOfficeParam.deptId !== undefined){
        this.$util.findChildrenIds(this.distributeOptions, 'id', this.inOfficeParam.deptId,this.callBackFilter)
        this.newValFilter = "部门：" + this.newValFilter
        this.dynamicTags.push(this.newValFilter)
      }
      // 邮箱
      if(this.inOfficeParam.email !== '' && this.inOfficeParam.email !== undefined){
        let email = this.inOfficeParam.email.replace(/\s*/g,"")//空格
        email = email.toLowerCase()//大写转化为小写
        let emailLast = email.substring(email.length-11,email.length)
        if(emailLast == '@edaili.com'){ //去掉末尾的 @edaili.com
          email = email.substring(0,email.length-11)
        }
        this.inOfficeParam.email = email + '@edaili.com'
        email = "邮箱：" + email + '@edaili.com'
        this.dynamicTags.push(email)
      }
      // 手机号
      if(this.inOfficeParam.mobile !== '' && this.inOfficeParam.mobile !== undefined){
        let mobile = "手机号：" + this.inOfficeParam.mobile
        this.dynamicTags.push(mobile)
      }
      // 聘用形式
      let filterEmpType = this.$store.state.selectData.hireform.obj[this.inOfficeParam.empType]
      if(filterEmpType !== '' && filterEmpType !== undefined){
        filterEmpType = "聘用形式：" + filterEmpType
        this.dynamicTags.push(filterEmpType)
      }
      // 账号
      if(this.inOfficeParam.accountStates.length !== 0){
        // let accountFilter = "账号状态："
        this.inOfficeParam.accountStates.forEach(val => {
          let accountFilter = "账号状态："
          switch(val){
            case "Y":
              accountFilter = accountFilter + '激活'
            break;
            case "N":
              accountFilter = accountFilter + '未激活'
            break;
            case "D":
              accountFilter = accountFilter + '已禁用'
            break;
          }
          this.dynamicTags.push(accountFilter)
        })
        // this.dynamicTags.push(accountFilter)
      }
      // 入职日期
      if(this.inOfficeParam.entryDate !== '' && this.inOfficeParam.entryDate !== undefined){
        let entryDate = "入职日期：" + this.inOfficeParam.entryDate
        this.dynamicTags.push(entryDate)
      }
      this.getInOfficeList()
    },
    termFilterFormReset(formName) {
      this.termFilterFormShow = false
    },
    tagHandleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      // 点击之后初始化参数 调table
      let newVal = tag.split('：')
      switch(newVal[0]){
        case "汇报对象":
          this.inOfficeParam.hasRepObj = ''
        break;
        case "部门":
          this.inOfficeParam.deptId = ''
        break;
        case "邮箱":
          this.inOfficeParam.email = ''
        break;
        case "手机号":
          this.inOfficeParam.mobile = ''
        break;
        case "聘用形式":
          this.inOfficeParam.empType = ''
        break;
        case "入职日期":
          this.inOfficeParam.entryDate = ''
        break;
      }
      switch(newVal[1]){
        case "激活":
          this.accountStatesRemove('Y')
        break;
        case "未激活":
          this.accountStatesRemove('N')
        break;
        case "已禁用":
          this.accountStatesRemove('D')
        break;
      }
      this.getInOfficeList()
    },
    accountStatesRemove (param) {
      this.inOfficeParam.accountStates.forEach((val,i)=>{
        if(val === param) {
          this.inOfficeParam.accountStates.splice(i, 1)
          return
        }
      })
    },
    dynamicTagsCloseAll () {
      this.inOfficeParam = {
        key:'',
        pageNum:'1',
        pageSize:'20',
        hasRepObj:'',
        empType:'',
        mobile: '',
        email:'',
        deptId:'',
        entryDate:'',
        accountStates: []
      }
      this.dynamicTags = []
      this.getInOfficeList()
    },
    // 邮箱失去焦点
    blurEmail(val){
      // let val = this.addEmployeeForm.email
      console.log(val)
      let emailLast = val.substring(val.length-11,val.length)
      if(emailLast == '@edaili.com'){ //去掉末尾的 @edaili.com
        if(this.termFilterFormShow){
          this.inOfficeParam.email = val.substring(0,val.length-11)
        }else{
          this.addEmployeeForm.email = val.substring(0,val.length-11)
        }
        
      }
    },
  },
  watch: {
    // 实时监测部门搜索
    addSectionFilter (val) {
      this.$refs.addSectionTree.filter(val)
    },
    // 监测新增部门联动
    distributeInput(val){
      this.addEmployeeForm.deptId = val[val.length-1]
      if(val.length&&this.transferPositionDialog){
        this.$refs['transferPositionForm'].clearValidate('newDeptId')
      }
    },
    // tree搜索
    filterText (val) {
      this.$refs.partLeaderTree.filter(val)
    },
    // tree-radio清楚
    partTreeShow (val) {
      if(val){
        this.leaderGroup = ''
      }
    },
    // 新增
    addEmployeeDialog(val){
      if(val === false){
        this.$refs['addEmployeeForm'].resetFields()
        this.$refs['addEmployeeForm'].clearValidate()
        this.distributeInput = []
        this.roleIds = ""
        this.addP = false
      }
    },
    // 转正
    turnEmployeeDialog(val){
      if(val === false){
        this.$refs['turnEmployeeForm'].resetFields()
      }
    },
    // 离职
    leaveDialog(val){
      if(val === false){
        this.$refs['leaveEmployeeForm'].resetFields()
      }
    },
    // 调岗
    transferPositionDialog(val){
      if(val === false){
        this.$refs['transferPositionForm'].resetFields()
        this.partTreeShow = false
        this.$refs['transferPositionForm'].clearValidate()
      }
    },
    termFilterFormShow (val) {
      if(val){
        // this.$refs['inOfficeParam'].resetFields()
        this.inOfficeParam = {
          key:'',
          pageNum:'1',
          pageSize:'20',
          hasRepObj:'',
          empType:'',
          mobile: '',
          email:'',
          deptId:'',
          entryDate:'',
          accountStates: []
        }
        this.termFilterDeptId=[]
      }
    },
    dynamicTags (val) {
      if(val.length === 0){
        this.termFilterDivShow = false
      }else{
        this.termFilterDivShow = true
      }
    },
    // 新汇报对象
    deptLeaderName(val){
      if(val){
        this.$refs['transferPositionForm'].clearValidate('newRepObjId')
      }
    },
    // 新部门
    // distributeInput(val){
    //   if(val){
    //     this.$refs['transferPositionForm'].clearValidate('newDeptId')
    //   }
    // },
    // 再入职code
    'addEmployeeForm.mobileInternationalCode' (val){
        if(val === '00852'){
          this.addPhone = 'mobile1'
          this.addPhoneShow = false
          this.addPhoneShow1 = true
        }else if(val === '0086'){
          this.addPhoneShow = true
          this.addPhoneShow1 = false
          this.addPhone = 'mobile'
        }
    },
    // 在职搜索
    inOfficeSearch (val) {
      if(val == ''){
        this.inOfficeParam.key = ''
        this.getInOfficeList()
      }
    },
    // 离职搜索
    leaveingSearch(val){
      if(val == ''){
        this.leaveingParam.key = ''
        this.getleaveingList()
      }
    },
  }
}
</script>
<style lang="sass" scoped>
#inOffice
  background: #F9F9F9
  border: 1px solid #DCDFE6
  .backgFFF
    background: #fff
    padding: 29px 5px
  .padleft23
    padding-left: 23px
  .dialogForm
    border: 1px solid #C3CBD6
    // height: 100px
    overflow: hidden
    padding: 20px 0 20px 25px
    margin-bottom: 18px
    background: #F8FAFF
    .el-form-item
      margin-bottom: 0
    .dialogAvatar
      padding: 0 30px
  // 大于等于
  @media (min-width: 1440px)
    .leaveScroll
      height: calc(100vh - 203px) 
      overflow: hidden
  // 小于等于
  @media (max-width: 1440px)
    .leaveScroll
      height: calc(100vh - 226px) 
      overflow: hidden
  @media (min-width: 1710px)
    .tableContentScrollDiv
      height: calc(100vh - 203px) 
      overflow: hidden
  // 小于等于
  @media (max-width: 1710px)
    .tableContentScrollDiv
      height: calc(100vh - 226px) 
      overflow: hidden
  .leftDiv
    // margin-top: -7px
    margin-bottom: 4px
  .employeeHead
    padding: 10px 0
    font-size: 20px
    font-weight: bold
  .titleDate
    padding-bottom: 12px
    padding-left: 5px
    font-size: 14px
  .tableType
    text-align: center
    margin-left: 0 !important
    .el-col
      padding: 0 !important
      line-height: 24px
    .el-col div
      cursor: pointer
    .el-col div:hover
      border-radius: 3px
      line-height: 24px
      border: 1px solid rgba(64,158,255,.2)
      background: #10B2FF
      color: #ffffff
      .color-type
        color: #ffffff !important
  .color-type
    color: #10B2FF
    font-weight: bold
  .tableButton .el-col
    .el-button
      height: 30px
      line-height: 6px
      padding: 12px 17px
      font-size: 12px
    .el-input input
      height: 30px
      line-height: 6px
  .termFilterDiv
    font-size: 12px
    padding-left: 23px
    .el-tag--small
      border-radius: 13px
      margin: 6px 3px
      height: 26px
      line-height: 26px
      padding: 0 10px
      color: #63717F
      background: #fff
      border: 1px solid #D7D7D7
      .punctuation
        width: 8px
        height: 8px
        background: rgba(195,203,214,1)
        border-radius: 50%
        margin-right: 6px
        display: inline-block
      .el-icon-close
        color: #666666 !important
  .inOfficeTable, .entryNumTable
    margin-top: 4px
  .el-table td, .el-table th
    padding: 3px
    text-align: center
  .el-button--mini
    padding: 7px 4px !important
    margin-left: 2px !important
  .backIcon
    float: right
    display: block
    font-weight: bold
    font-size: 30px
    color: #666
    cursor: pointer
    z-index: 1
    position: absolute
    right: 16px
    top: 70px
  .date-picker
    float: left
    height: 30px
    padding-left: 12px
  .el-range-editor.el-input__inner
    padding: 0px 10px
    height: 30px
  // .el-pagination
  //   margin-top: 20px
  //   float: right
  .addInputWidth
    clear: both
    width: 360px !important
  // .addEmployeeDialog .el-dialog
  //   width: 660px
  .addSectionTreeDiv
    position: absolute
    z-index: 10
    border: 1px solid #e2e0e0
    border-radius: 6px
  .turnEmployeeDialog .el-dialog
    width: 600px
  // 调岗
  .transferPositionDialog .el-dialog
    width: 700px
  // 上传头像
  .avatar-uploader .el-upload
    border: 1px dashed #d9d9d9
    border-radius: 50%
    cursor: pointer
    position: relative
    overflow: hidden
  .avatar-uploader .el-upload:hover
    border-color: #409EFF
  .avatar-uploader-icon
    font-size: 28px
    color: #8c939d
    width: 178px
    height: 178px
    line-height: 178px
    text-align: center
  .avatar
    width: 100px
    height: 100px
    display: block
    border-radius: 50%
    border: 1px solid #e4cece
  .avatarEmpty
    width: 100px
    height: 100px
    display: block
  .emailAfter
    position: absolute
    right: 159px
    top: 0px
    color: #606266
  .emailAfter2
    position: absolute
    right: 76px
    top: 0px
    color: #606266
  .partTree
    position: absolute
    z-index: 100
    width: 398px
    background: #fff
    border: 1px solid #f3ecec
    border-radius: 4px
    .partTreeLeft
      float: left
      height: 600px
      width: 210px
      overflow-y: auto
      border-right: 1px solid #f3ecec
    .partLeaderRight
      float: left
      width: 130px
      margin-top: 6px
      .el-radio
        margin-left: 5px !important
        margin-bottom: 8px
        width: 115px
        text-align: left
      i
        display: inherit
        text-align: right
        font-size: 20px
        padding-right: 6px
        margin-bottom: 20px
        cursor: pointer
        width: 170px
  .width300
    width: 300px
  .width600
    width: 500px
  .width870
    width: 870px
  .turnSpan
    color: #f56c6c
    float: left
    padding: 10px 0 10px 15px
  .rowHandle
    position: absolute
    // top: 50%
    margin-top: -12px //这种写法IE不生效
    // top: 0
    // padding-top: 6px
  .icon-bianji
    left: 40px
  .icon-zhuanzheng,.icon-zairuzhi
    left: 66px
  .icon-lizhi
    left: 89px
  .icon-tiaogang
    left: 113px
  .icon-Switch_open
    color: #6DD8AF
  .icon-Switch_close,.icon-Switch_open
    font-size: 22px
    left: 137px
  .width400
    width: 400px
</style>
