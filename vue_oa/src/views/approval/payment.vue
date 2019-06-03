<template lang="pug">
  #payment
    div.rightTitle  {{editForm.templateName}}
    i.backIcon(class="iconfont icon-fanhui pointer", @click="backManage")
    div.clearBoth.clearBoth1
      div.editContentDiv(v-bind:class='{contentDivShow: pre || record.length > 0}')
        el-form.elForm(:model='editForm', :rules="editFormRules", ref="editForm",v-bind:class='[applyState!="0" ? "waitFormClass":""]', label-width="140px",size='medium')  
          el-form-item.padleft12(label='审批单号')
            span.fontC6 {{editForm.approveNum || '提交后系统自动生成' }}
          div.floatLeft.width614
            el-form-item.padleft12(label='申请人')
              span.fontC6 {{baseRes.approveUserInfo.approveUserName || userInfo.name}}
            el-form-item.padleft12(label='部门')
              span.fontC6 {{baseRes.approveUserInfo.approveUserDeptName || userInfo.deptName}}
          div.floatLeft
            el-form-item.padleft12(label='申请人职位')
              span.fontC6 {{baseRes.approveUserInfo.approveUserPositionName || userInfo.position}}
            el-form-item.padleft12(label='申请日期')
              span.fontC6 {{baseRes.approveDate ? String(baseRes.approveDate).substr(0,10) :   String(editForm.approveDate).substr(0,10)}}
          div.clearBoth
            el-form-item.fontB(label='申请公司名称', prop='companyId')
              el-select.width360(v-if='applyState=="0"',v-model="editForm.companyId",placeholder="请选择")
                el-option(v-for="item in paymentCompany.list", :key="item.code", :label="item.name", :value="item.code") {{item.name}}
              span(v-else) {{editForm.companyName}}
          //- div.float20
          el-form-item.float20(label='开支类型', prop='payType')
            el-select.width360(v-if='applyState=="0"',v-model="editForm.payType",placeholder="请选择")
              el-option(v-for="item in paymentType.list", :key="item.code", :label="item.name", :value="item.code") {{item.name}}
            span.fontC6(v-else) {{paymentType.obj[editForm.payType]}}
          el-form-item.float20(label='开支归属部门', prop='payFromDept')
              el-input.width360(v-if='applyState=="0"',v-model='editForm.payFromDept',placeholder='1-50位字符',maxlength="50")
              span.fontC6(v-else) {{editForm.payFromDept}}
          el-form-item.float20(label='发票情况', prop='invoiceSituation')
            el-select.width360(v-if='applyState=="0"',v-model="editForm.invoiceSituation",placeholder="请选择")
              el-option(v-for="item in paymentInvoiceSituation.list", :key="item.code", :label="item.name", :value="item.code") {{item.name}}
            span.fontC6(v-else) {{paymentInvoiceSituation.obj[editForm.invoiceSituation]}}
          //- div.float20
          el-form-item.float20.padleft12(label='预计销账时间', prop='',v-if='editForm.invoiceSituation=="wd"')
            el-date-picker.width360(v-if='applyState=="0"',v-model='editForm.writeoffDate',type='date',value-format="yyyy-MM-dd")
            span.fontC6(v-else) {{editForm.writeoffDate}}
          //- div.floatLeft
          el-form-item.float20(label='开支归属预算', prop='payFromBudget')
            el-select.width360(v-if='applyState=="0"',v-model="editForm.payFromBudget",placeholder="请选择")
              el-option(v-for="item in paymentFromBudget.list", :key="item.code", :label="item.name", :value="item.code") {{item.name}}
            span.fontC6(v-else) {{paymentFromBudget.obj[editForm.payFromBudget]}}
            el-tooltip.item(effect='dark', placement='bottom')
              pre(slot="content") {{tipContent}}
              i.el-icon-info.pointer(v-if="!pre")
            //- span.tip(v-if="!pre") <br>
            //-   div(v-if="  tipObj[item.code]" ,v-for="item in  paymentFromBudget.list") {{item.name +'：' +  tipObj[item.code] + '； '}} 
          el-form-item.float20(label='是否合同报销', prop='isContract')
            el-radio-group(v-if='applyState=="0"',v-model="editForm.isContract")
              el-radio(label="0") 否
              el-radio(label="1") 是
            span.fontC6(v-else) {{editForm.isContract == 1 ? '是' : '否'}}
          div.clearBoth(v-if='editForm.isContract == "1"' )
            el-form-item.float20(label='合同编号', prop='contractNum')
              el-input.width360(v-if='applyState=="0"',v-model='editForm.contractNum',placeholder='1-20位字符',maxlength="20")
              span.fontC6(v-else) {{editForm.contractNum}}
            el-form-item.float20(label='合同总金额', prop='contractAmount')
              el-input.width360(v-if='applyState=="0"',v-model='editForm.contractAmount',placeholder='数字格式')
              span.fontC6(v-else) {{editForm.contractAmount}}
            el-form-item.float20(label='已付/已请款金额', prop='contractAmountPaid')
              el-input.width360(v-if='applyState=="0"',v-model='editForm.contractAmountPaid',placeholder='数字格式')
              span.fontC6(v-else) {{editForm.contractAmountPaid}}
            el-form-item.float20(label='本次申请金额', prop='contractAmountApply')
              el-input.width360(v-if='applyState=="0"',v-model='editForm.contractAmountApply',placeholder='数字格式')
              span.fontC66(v-if='applyState=="0"') (退款写负数)
              span.fontC6(v-else) {{editForm.contractAmountApply}}
          div.clearBoth.fontB 收款银行信息
          el-form-item.float20(label='支付方式', prop='payWay')
            el-select.width360(v-if='applyState=="0"',v-model="editForm.payWay",placeholder="请选择")
              el-option(v-for="item in paymentWay.list", :key="item.code", :label="item.name", :value="item.code") {{item.name}}
            span.fontC6(v-else) {{paymentWay.obj[editForm.payWay]}}
          el-form-item.float20(label='单位全称/姓名', prop='payName')
            el-input.width360(v-if='applyState=="0"',v-model='editForm.payName',placeholder='1-50字符',maxlength="50")
            span.fontC6(v-else) {{editForm.payName}}
          el-form-item.float20(label='银行账号', prop='payBankAccount')
            el-input.width360(v-if='applyState=="0"',v-model='editForm.payBankAccount',placeholder='数字格式')
            span.fontC6(v-else) {{editForm.payBankAccount}}
          el-form-item.clearBoth(label='银行', prop='payBankName')
            el-select.width160(v-if='applyState=="0"',v-model="editForm.payBankType",placeholder="开户银行名称",@change="changeBank")
              el-option(v-for="item in paymentBank.list", :key="item.code", :label="item.name", :value="item.code") {{item.name}}
            el-input.width360(v-if='applyState=="0"',v-model='editForm.payBankName',placeholder='1-50字符', maxlength='50')
            span.fontC66(v-if='applyState=="0"',style='display:block') (中国境内银行请选择"银行支行名称",海外及香港银行请选择SWIFT Code)
            span.fontC6(v-else) {{editForm.payBankName}}
          
          //- el-form.tableDiv(:model='addForm', :rules="addFormRules", ref="addForm",class="waitFormClass", label-width="125px",size='medium')  
          div.tableDiv
            div(:class="['fontB', {'fontB1' : !pre}]") 付款明细
            table.vehicleTable
              tr.bgF9
                td(width='90px') 序号
                td(width='600px') 费用内容摘要
                td(width='120px') 币种
                td(v-if='editForm.payBankType=="swiftcode"',width='100px') 金额
                td(v-else,width='100px') 原币金额
                td(v-if='editForm.payBankType!="swiftcode"',width='100px') 汇率
                td(v-if='editForm.payBankType!="swiftcode"',width='100px') 人民币金额
                td(width='100px',v-if="!pre") 操作
              tr(v-for='(item,i) in detailList',v-if="applyState != 0")
                td {{i+1}}
                td {{item.costContent}}
                td {{paymentCurrency.obj[item.costCurrency]}}
                td {{editForm.payBankType == 'swiftcode' ?  '￥' + item.costAmount : item.costAmount}}
                td(v-if='editForm.payBankType!="swiftcode"') {{item.costRate}}
                td(v-if='editForm.payBankType!="swiftcode"') ￥{{item.costAmountRmb}}
                td(v-if="!pre") 
                  span.btnDelete 删除
              tr(v-if="applyState == 0",v-for="(item,index) in detailList")
                td {{index + 1}}
                td(v-if="item.status == 0")
                  el-input(v-model.trim='item.costContent', placeholder='1-50字符', maxlength='50')
                td(v-else) {{item.costContent}}

                td(v-if="item.status == 0")
                  el-select(v-if='applyState=="0"',v-model="item.costCurrency",placeholder="请选择")
                    el-option(v-for="item1 in paymentCurrency.list", :key="item1.code", :label="item1.name", :value="item1.code") {{item1.name}}
                td(v-else) {{paymentCurrency.obj[item.costCurrency]}}

                td(v-if="item.status == 0")
                  el-input(v-model.trim='item.costAmount', @change='changeCostRate(index)',placeholder='数字格式')
                td(v-else) {{item.costAmount}}

                td(v-if='editForm.payBankType!="swiftcode" && item.status == 0')
                  el-input(v-model.trim='item.costRate',@change='changeCostRate(index)', placeholder='数字格式')
                td(v-if='editForm.payBankType!="swiftcode" && item.status == 1') {{item.costRate}}

                td(v-if='editForm.payBankType!="swiftcode" && item.status == 0') ￥{{item.costAmountRmb}}
                  //- el-input(v-model.trim='item.costAmountRmb', placeholder='数字12格式')
                td(v-if='editForm.payBankType!="swiftcode" && item.status == 1') ￥{{item.costAmountRmb}}

                td(v-if="item.status == 0") 
                  span.btnSave(@click.stop="storeTableOne(index)") 保存
                  span.btnCancel(@click.stop="deleteTableOne(index)") 取消
                td(v-if="item.status == 1")
                  span.btnCancel(@click.stop="deleteTableOne(index)") 删除  
              tr(v-if="!pre")
                td(:colspan = 'editForm.payBankType!="swiftcode"? "7" : "5"',@click.stop='addFeeInfo')
                  i(class="iconfont icon-add pointer")   添加一条费用信息
              tr
                td(:colspan = 'editForm.payBankType!="swiftcode"? "4" : "2"',) {{ editForm.costAmountSum &&  $util.numToText(editForm.costAmountSum)}}
                td 合计 ：
                td(colspan = '2') {{editForm.costAmountSum ? '￥' +  editForm.costAmountSum : ''}}
              tr
                td 打款备注
                td(colspan = '6')
                  el-input(v-model.trim='editForm.remark', placeholder='1-200字符', maxlength='200',v-if="!pre")
                  preview-info(:visible='pre', :info='editForm.remark || "未填写"')
          .content1
            span.type.type1 附件
            span.previewInfoWrap(v-if='list.length  == 0 && pre')
              preview-info(:visible='pre', holder='未上传')
            .conUp
              upload-img(:list.sync='list', :isOriginImg="true" canvastype='base', :allowType="['img','pdf']", type='payment', :dele='true', :isPre="pre", :size='2', holder='格式为 PDF/JPG/JPEG/PNG 大小在2M以内')
                        
          el-form-item.dialog-footer.applyBtn
            el-button(@click="submitForm('editForm',formsubmit)",size='medium',type='primary',v-if="applyState == 0") 提 交
            el-button(@click="backManage",size='medium',v-if="applyState == 0") 取 消 
            opper(:status="applyState",@confirm="opper",:isPrint="true",@print="printVisible = true")      
      .status(v-show="record.length > 0")
        speed(:list="record")      
    print-table(:visible.sync="printVisible",:title="editForm.companyName + '付款申请单'",:info="editForm",:list1="detailList", :list2="printRecord")
</template>
<script>
import "../../commons/publicCss/outside.sass"
import uploadImg from "./uploadImg";
import previewInfo from "../../components/previewInfo";
import opper from "./opper";
import speed from "./speed";
import printTable from './printTable'
export default {
  name:'payment',
  data(){
    return{
      tipContent : '办公费：办公用品、快递费、零星开支、名片等；\n差旅费：需要填写出差申请单的费用；\n宣传费：为做推广传声的费用；\n运营费：接送机、促销活动、充值；\n会议费：总监会议；\n咨询费：律师费、专业问题咨询费；\n开办费：新城市开始之初的装修、搬厂、材料；\n通讯费：电信费；\n市内交通费：因公办事的差旅费(填写外出申请单)；\n福利费：午餐、聚餐、体检；',
      applyState:'',
      pre : false,
      list : [],
      info : '',
      templateName:'报销付款申请',
      waitRecord:false,//是否显示进程
      printVisible: false,
      editForm:{
      },//编辑form
      baseForm:{ approveUserInfo : {}},//发起审批code === '0'，baseForm-直接从headInfo里面的信息
      baseRes:{approveUserInfo : {}},//其他 已处理，我发起，抄送 查看code === '0'，baseRes-从列表进入后的基本信息
      editFormRules:{
          companyId:[
            {required:true,message: '请选择', trigger: 'change'},
          ],
          payType:[
            {required:true,message: '请选择', trigger: 'change'},
          ],
          invoiceSituation:[
            {required:true,message: '请选择', trigger: 'change'},
          ],
          payFromDept:[
            {required:true,message: '请填写', trigger: 'blur'},
          ],
          writeoffDate:[
            {required:true,message: '请选择', trigger: 'change'},
          ],
          payFromBudget:[
            {required:true,message: '请选择', trigger: 'change'},
          ],
          contractNum:[
            {required:true,message: '请填写', trigger: 'blur'},
          ],
          contractAmount:[
            {required:true,message: '请填写', trigger: 'blur'},
            {pattern:/((\d+$)|(\d+[\.]+\d+$))/, message: '请输入正确数字',trigger:['blur','change'] },
          ],
          contractAmountPaid:[
            {required:true,message: '请填写', trigger: 'blur'},
            {pattern:/((\d+$)|(\d+[\.]+\d+$))/, message: '请输入正确数字',trigger:['blur','change']  },
          ],
          contractAmountApply:[
            {required:true,message: '请填写', trigger: 'blur'},
            {pattern:/((-?\d+$)|(-?\d+[\.]+\d+$))/g, message: '请输入正确数字',trigger:['blur','change']},
          ],
          isContract:[
            {required:true,message: '请选择', trigger: 'change'},
          ],
          payWay:[
            {required:true,message: '请选择', trigger: 'change'},
          ],
          payName:[
            {required:true,message: '请填写', trigger: 'blur'},
          ],
          payBankAccount:[
            {required:true,message: '请填写', trigger: 'blur'},
            {pattern:/((\d+$)|(\d+[\.]+\d+$))/, message: '请输入正确数字',trigger:['blur','change'] },
          ],
          payBankName:[
            {required:true,message: '请填写', trigger: 'blur'},
          ],
          payBankType:[
            {required: true, message: '请选择', trigger: 'change' }
          ],
      },
      detailList : [ {costContent:'',costCurrency:'',costAmount:'',costRate:'',costAmountRmb:'0',status  : 0},
      ],
      tableModel : {costContent:'',costCurrency:'',costAmount:'',costRate:'',costAmountRmb:'0',status  : 0},
      tableLeng:'',
      addForm:{},
      addFormRules:{},
      record : [],
      printRecord : []
    }
  },
  computed:{
    paymentCompany() {
      return this.$store.state.selectData.paymentCompany;
    },
    paymentType() {
      return this.$store.state.selectData.paymentType;
    },
    paymentInvoiceSituation() {
      return this.$store.state.selectData.paymentInvoiceSituation;
    },
    paymentWay() {
      return this.$store.state.selectData.paymentWay;
    },
    paymentBank() {
      return this.$store.state.selectData.paymentBank;
    },
    paymentFromBudget() {
      return this.$store.state.selectData.paymentFromBudget;
    },
    paymentCurrency() {
      return this.$store.state.selectData.paymentCurrency;
    },
    userInfo() {
      return this.$store.state.headInfo;
    }
  },
  components:{uploadImg,previewInfo,opper,speed,printTable},
  created(){
    let info = window.sessionStorage["apply"];
    let status = window.sessionStorage["applyState"];
    this.applyState = status;
    if (info && status) {
      info = JSON.parse(info);
      this.editForm = info;
      this.editForm.isContract = '0';
      this.editForm.approveDate = this.$util.timestampToTime(global.NOWTIME);
      this.editForm = Object.assign({},this.editForm);
      if (info.formNo) {
        this.$store.dispatch("gainProcess", info).then(obj => {
          this.baseRes = obj.form;
          this.editForm = {...info,...obj.form};
          Object.assign(this.editForm, obj.form);
          this.detailList  = Object.assign([],obj.form.detailList);
          this.list = Object.assign([],obj.form.paymentFiles);
          this.record = obj.record;
          this.printRecord = Object.assign([],obj.record);
          this.printRecord.pop()
          this.printRecord = Object.assign([],this.printRecord);
          if (info.prcessStatus == 4) {
            this.record.unshift({
              nodeName: "结束审批",
              handleOpinionCode: "0",
              process: "4"
            });
          }
          // 退回重新编辑状态 重新设置表单
          if(status == 0){
            this.changeBank('swiftcode');
            this.changeBank('yhzhmc');
            this.detailList.forEach((v,i)=>{
              this.detailList[i].status = 0;
            })
            this.resetMoneyNum();
          }
          this.$refs['editForm'].clearValidate();
          if(status != 0){
            this.pre = true;
          }
          console.log(this.editForm)
        });
      }
    } else {
      this.$router.push({ path: "/home/errorPage/404" });
    }
  },
  methods:{
    // 点击添加一条费用信息
    addFeeInfo(){
      this.detailList.push(Object.assign({},this.tableModel));
    },
    deleteTableOne(i){
      if(this.detailList[i].status == 1){
        this.$confirm('确认删除该条记录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.detailList.splice(i,1)
            this.resetMoneyNum();
          })
      }else{
            this.detailList.splice(i,1)
            this.resetMoneyNum();
      }
    },
    resetMoneyNum(){
      let num = 0;
      this.detailList.forEach((v,i)=>{
        if(v.status == 1){
          console.log(v);
          let n = this.editForm.payBankType == 'yhzhmc' ? v.costAmountRmb : v.costAmount ;
         num = num + Number( n);
        }
      })
      this.editForm.costAmountSum = (num == 0 ? '' : num);
    },
      opper(obj){
          let base = Object.assign({},this.editForm);
          base.handleOpinionCode = obj.type;
          base.templateId = (this.editForm.templateId || this.editForm.id);
          base.handleOpinionDesc = obj.reason; 
          this.$api.processRoam(base).then(obj=>{
              this.$message.success('操作成功!');
              this.back();
          })
      },
    // 返回列表
    backManage(){
      this.$router.routeBack('',1);
    },
    changeBank(item){
      console.log(item);
      if(this.editForm.payBankType != 'swiftcode'){
      let arr = Object.assign([],this.detailList);
      arr.forEach((v,i)=>{
           arr[i].status = this.isChangeStatus(v) ? 0 : 1;
      })
      this.detailList = Object.assign([],arr);
      }
      this.resetMoneyNum()
    },
    isChangeStatus(info){
      let result = false;
      for(let key in info){
        if(!String(info[key])){
          if((key == 'costRate' ||  key == 'costAmountRmb') && this.editForm.payBankType == 'swiftcode'){
             console.log('不做处理')
          }else{
             result = true;
          }
        }
      }
      return result;
    },
    // 金额校验
    changeCostAmount(val){
      if(val &&  !/((\d+$)|(\d+[\.]+\d+$))/.test(val)){
        this.$message.error('原币金额值须为数字格式');
        return;
      }
    },
    changeCostRate(index){
      if(this.detailList[index].costAmount && !/((\d+$)|(\d+[\.]+\d+$))/.test(this.detailList[index].costAmount)){
        this.$message.error('原币金额值须为数字格式');
        return;
      }
      if(this.detailList[index].costRate && !/((\d+$)|(\d+[\.]+\d+$))/.test(this.detailList[index].costRate)){
        this.$message.error('原币金额值须为数字格式');
        return;
      }
      // this.detailList[index].costAmountRmb = Number(this.detailList[index].costAmount) * (Number(this.detailList[index].costRate) * 10000) / 10000
      this.detailList[index].costAmountRmb = this.costAmountRmbArg(this.detailList[index].costAmount, this.detailList[index].costRate)
      
    },
    // 精确计算人民币金额
    costAmountRmbArg(arg1, arg2) {  
      var m = 0, s1 = arg1.toString(), s2 = arg2.toString();  
      try {  
        m += s1.split(".")[1].length;  
      }  
      catch (e) {  
      }  
      try {  
        m += s2.split(".")[1].length;  
      }  
      catch (e) {  
      }  
      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);  
    },
    storeTableOne(i){
      let info = this.detailList[i];
     let result = this.isChangeStatus(info);
      if(result){
        this.$message.error('请填写完整信息!');
        return;
      }
      // 检测原币金额等是否为数字
      if(info.costAmount  &&  !/((\d+$)|(\d+[\.]+\d+$))/.test(info.costAmount)){
        this.$message.error('原币金额值须为数字格式');
        return;
      }
      if(info.costAmountRmb && !/((\d+$)|(\d+[\.]+\d+$))/.test(info.costAmountRmb) ){
        this.$message.error('人民币金额须为数字格式');
        return;
      }
      if(info.costRate && !/((\d+$)|(\d+[\.]+\d+$))/.test(info.costRate) ){
        this.$message.error('汇率须为数字格式');
        return;
      }
      if(!this.editForm.payBankType){
        this.$message.error('请先选择银行类型');
        return;
      }
      console.log(this.editForm)
      this.detailList[i].status = 1;
      this.resetMoneyNum();
    },
    formsubmit(){
      console.log('vvvvv')
    },
    // 提交校验格式
    submitForm (formName, callBack) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let baseInfo = Object.assign({},this.editForm);
          baseInfo.detailList =  this.detailList.filter(v=>{
            return v.status == 1;
          })
          baseInfo.companyName = this.paymentCompany.obj[baseInfo.companyId];
          baseInfo.templateId = (this.editForm.templateId || this.editForm.id);
          baseInfo.paymentFiles = Object.assign([],this.list);
          if(!baseInfo.costAmountSum){
            this.$message.error('请完善付款明细');
            return;
          }
          this.$api.payment(baseInfo).then(obj=>{
              this.$message.success('成功发起付款申请!');
              this.backManage();
          })
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
<style lang="sass" scoped>
#payment
  .float20
    width: 555px
  .editContentDiv
    position: relative
    .type
      display: inline-block
      height: 14px
      line-height: 14px
      font-size: 14px
      color: rgba(102,102,102,1)
      padding-left: 10px
    .type1
      position: absolute
      left: 0
      top: 0
    .conUp
      display: inline-block
      vertical-align: top
      padding-left: 114px
    .content1
      margin-top: 20px
      position: relative
    .previewInfoWrap
      margin-left: 114px    
  .clearBoth1
     .status
        display: inline-block
        width: 350px
        margin-left: 23px          
  .fontC6
    font-size: 14px
    color: #666666
    width: 200px
    display: block
  .fontC66
    font-size: 14px
    color: #666666
  .backIcon
    float: right
    display: block
    color: #666
    cursor: pointer
    padding-right: 20px
    margin: -8px 0 6px 0
  .width160
    width: 130px
  .width80
    min-width: 360px
    width: 50% !important
    max-width: 600px
  .width40
    min-width: 360px
    width: 40% !important
    max-width: 440px
  .margin20
    margin-right: 20px
  .float20
    float: left
    margin-right: 20px
  .fontB
    font-weight: bold
    font-size: 15px
    margin-bottom: 20px
    color: #606266
  .fontB1:before
    content: '*';
    color: #f56c6c;
    margin-right: 4px;  
  .tableDiv
    overflow-x: auto
    white-space: nowrap
    overflow-y: hidden
    .vehicleTable
      border: 1px solid #DCDFE6
      color: #63717F
      width: 98%
      font-size: 14px
      tr
        line-height: 39px
      tr td
        border: 1px solid #DCDFE6
        text-align: center
      .bgF9
        background: #F5F7F9
        line-height: 30px !important
      .line34
        line-height: 34px
      .btnDelete,.btnSave,.btnCancel
        margin: 0 3px
        cursor: pointer
        padding: 6px 3px
      .btnSave
        color: #10B2FF
      .btnCancel
        color: #E96F6F
.tip  
  color: #C1C5CD
  margin-left: 10px
.el-icon-info
  display: inline-block
  vertical-align: top
  line-height: 36px
  height: 36px
  margin-left: 10px
  color: #63717F 
  opacity: 0.8
.el-icon-info:hover
  opacity: 1
</style>

