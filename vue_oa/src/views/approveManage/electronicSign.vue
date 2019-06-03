<template lang="pug">
#electronicSign.listWrapNoScroll.companyCommon.companyList
  div.electronicSignDiv
    div.topdiv
      div.electronicTitle(style="float:left") 电子签名管理
      div(style="float:right;position: relative;")
        el-input.inputSearch.width290(placeholder='请输入员工姓名', v-model='searchUserName', size='small',  v-on:keyup.native.enter='searchBtnClick')
        i.el-icon-search(@click='searchBtnClick')
        el-button.addBtn(size='small',@click='addBtnClick')  新增电子签名
        //- 测试提交
      div(style="clear:both")
    div.tableContent
      el-table(:data='electronicTable', style='width: 100%', height="200", class="tableContentScroll", v-loading="false")
        el-table-column(label='序号', type="index")
        el-table-column(label='姓名', prop="userName")
        el-table-column(label='部门', prop="deptName")
        el-table-column(label='个人签名', prop="signUrl",width="130px")
          template(slot-scope='scope')
            img.headImg(v-if="scope.row.signUrl",v-img="scope.row.signUrl" alt="")
            //- .img(v-else) --
        el-table-column(label='最后修改人', prop="lastUpdatedPerson")
        el-table-column(label='最后修改时间', prop="lastUpdated")
        el-table-column(label='操作',width="80")
          template(slot-scope='scope')
            el-tooltip.rowHandle(effect='dark', content='重新上传签名',popper-class="tips", placement='bottom')
              i.el-icon-upload2(@click='editRowPic(scope.row)')
            el-tooltip.rowHandle(effect='dark', content='删除', placement='bottom')
              i.el-icon-close(@click='addRomoveRow(scope.row)')
        empty(slot="empty",:visible='visible')      
      //- 分页
      pagination(@size-change='electSizeChange', @current-change='electCurrentChange', :total='electTolPage',background, :sizes='[10, 20, 30, 40]', :size='20',:current.sync="inpageNum", layout='total, sizes, prev, pager, next, jumper')
      //- 新增电子签名
      el-dialog.elecSignDialog(:title='addEditTitle', :visible.sync='addDialog', style='margin:0 auto', :close-on-click-modal='false',width='570px')
        el-form.elForm(:model='addDialogForm',ref='addDialogForm',:rules='addDialogRules', label-width="120px", size="medium")
          el-form-item(label='签名归属人', prop='userId')
            el-select.width360(v-model='deptLeaderName', placeholder='请选择签名归属人')
              template(slot-scope='scope')
                selectMem(:treeData='optionsPartLeader', @select='selectMem',:clear="deptLeaderName")
                el-option(v-for='(item,index) in [0]', :key='index', :value='item.id')
          el-form-item.formPicItem(label='签名图片', prop='signUrl')
            el-upload.elecSignPic(:action='elecActionSrc', :headers='headersImg',:limit='limit',:file-list="elecImgList", list-type='picture-card', :on-preview='elecImgCardPreview',:before-upload='limitUpload', :before-remove='elecImgRemove',:on-success="elecImgSuccessUpload")
              i.el-icon-plus
            el-dialog(:visible.sync='elecImgDialog', :modal='false',width='620px',class='dialogPic')
              img(width='100%', :src='elecImgDialogUrl', alt='')
          p.picMark 图片尺寸为200*80 格式为 JPG/JPEG/PNG，大小在2MB内，手写扫描进行上传。
        .dialog-footer(slot='footer')
          el-button(type='primary', @click='addDialogFormDialogBtn("addDialogForm")', size="medium") 保 存
          el-button(@click="resetForm('addDialogForm')", size="medium") 取 消
</template>
<script>
import "../../commons/publicCss/outside.sass"
import util from '../../util'
import selectMem from "../../components/selectMem"
import empty from "@/components/empty";
import pagination from "../../components/pagination"
export default {
  name: 'electronicSign',
  components : {selectMem,pagination,empty},
  data () {
    return {
      visible: false,
      electronicTable: [],
      electronicParam: {
        pageNum:'1',
        pageSize:'20',
        userName:'',
      },
      searchUserName:'',
      electTolPage: 1,
      inpageNum:1,
      // 新增
      addDialog: false,
      addDialogForm: {
        userId:'',
        signUrl:''
      },
      addEditTitle: '',
      // tree
      deptLeaderName:'',
      selectMemShow : false,
      partTreeShow: false,
      filterText: '',
      optionsPartLeader: [],
      props:{
        value: 'id',
        label: 'text',
        children: 'children'
      },
      leaderGroup: '',
      spanRadioShow: false,
      partLeaderRadio: [],
      // tree结束
      
      // 电子签名
      uploadSrc: '/admin/file/upload/pic/elecsign/',
      headersImg: {
        'enctype': 'multipart/form-data',
        'auth': this.$store.state.auth,
        'sign' : ''
      },
      limit: 1,
      elecImgParam:'',
      elecActionSrc:'',
      elecImgList:[],
      elecImgDialogUrl:'',
      elecImgDialog: false,
      electronicSignData: {
        id:'',
        picAddr:'',
        type:''
      },
      addDialogRules: {
        userId:[
          {required:true,message: '请选择签名归属人', trigger: 'blur'},
        ],
        signUrl:[
          {required:true,message: '请上传签名', trigger: 'change'},
        ]
      },
      removeFirst: false
    }
  },
  computed:{   
    treeMem () {
      return this.$store.state.selectData.orgTreeBaseInfo;
    }
  },
  created () {
    this.getElecSignTable()
    // this.$store.dispatch('getOrgTreeExtInfo'); //获取公司所有人物信息
    // 2.部门tree
    this.$api.orgTreeBaseInfo().then((res) => {
        // 获取部门负责人-汇报对象
        this.optionsPartLeader = JSON.parse(JSON.stringify(res.data.data))
    })
    // 初始化上传图片cookie
    this.headersImg.auth =  this.$store.state.auth
    window.forUploadTransferValue = true
  },
  watch: {
    searchUserName (val) {
      this.electronicParam.userName = val
      if(val === ''){
        this.getElecSignTable()
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
    addDialog (val) {
      if(!val){
        setTimeout(() => {
          this.$refs['addDialogForm'].resetFields()
        },3)
        this.deptLeaderName = ''
        this.addDialogForm.signUrl = ""
        this.addDialogForm.userId = ""
        this.elecImgList = []
      }
    },
    deptLeaderName(val){
      if(val){
        this.$refs['addDialogForm'].clearValidate('userId')
      }
    }
  },
  methods: {
    // 得到table
    getElecSignTable () {
      let obj = {
        definedPage:{pageNum: this.electronicParam.pageNum,
        pageSize: this.electronicParam.pageSize},
        'userName' : this.electronicParam.userName
      }
      this.$api.getElecSignList(obj).then(res =>{
        this.electronicTable = res.data.data.list
        this.electTolPage = res.data.data.total
        this.visible = true
      })
    },
    // 分页
    electSizeChange (val) {
      this.electronicParam.pageSize = val.value
      if(val.isLoad){
        this.getElecSignTable()
      }
    },
    electCurrentChange (val) {
      this.electronicParam.pageNum = val
      this.getElecSignTable()
    },
    // 搜索
    searchBtnClick () {
      this.inpageNum = 1
      this.electronicParam.pageNum = 1
      this.getElecSignTable()
    },
    // 新增
    addBtnClick () {
      this.addEditTitle = '新增电子签名'
      this.addDialog = true
    },
    // 确定
    addDialogFormDialogBtn (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.elecSignSaveOrEdit(this.addDialogForm).then(res => {
            this.getElecSignTable()
            this.addDialog = false
          })
        } else {
          console.log('格式 error')
          return false
        }
      })
    },
    resetForm () {
      this.addDialog = false
    },
    // 编辑
    editRowPic (row) {
      // 1.初始话form
      this.deptLeaderName = row.userName
      this.addDialogForm.userId = row.userId
      this.elecActionSrc=this.uploadSrc + this.addDialogForm.userId + '/400/56'
      this.addDialogForm.signUrl = row.signUrl
      this.addEditTitle = '重新上传签名'
      // 2.初始图片
      this.elecImgParam = row.signUrl
      this.$util.getDownImgBlob(this.elecImgParam,this.elecImgList)
      this.addDialog = true
      setTimeout(() => {
        this.$refs['addDialogForm'].clearValidate(['userId'])
      },2)
    }, 
    // 删除row
    addRomoveRow (row) {
      this.$confirm("确定要删除该条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.addDialogForm.userId = row.userId
        this.addDialogForm.signUrl = ''
        this.$api.elecSignSaveOrEdit(this.addDialogForm).then(res => {
          this.getElecSignTable()
        })
      })
    },
    // 点击新汇报对象 tree显示
    partTreeFocus (e) {
      this.selectMemShow = true;
      let target = e.target || e.srcElement;  
      target.blur();
    },
    selectMem(obj){
      this.addDialogForm.userId = obj.mem.userId;
      this.deptLeaderName = obj.mem.userName;
      this.removeFirst = true
      this.elecActionSrc=this.uploadSrc + this.addDialogForm.userId + '/400/56'
    },
    // 上传电子签名-实现预览效果
    elecImgCardPreview (file) {
      this.elecImgDialogUrl = file.url
      this.elecImgDialog = true
    },
    elecImgRemove () {
      // // if(this.removeFirst){
      //   if (window.forUploadTransferValue) {
      //     return Promise.reject(
      //       this.$confirm("确定要删除此头像吗?", "提示", {
      //         confirmButtonText: "确定",
      //         cancelButtonText: "取消",
      //         type: "warning"
      //       }).then(() => {
      //         this.addDialogForm.signUrl = ""
      //         this.elecImgList = []
      //       }).catch(() => {
      //         // this.$refs.inputTest.focus()
      //       })
      //     )
      //   // }
      // }
      this.addDialogForm.signUrl = ""
    },
    // 电子签名上传成功
    elecImgSuccessUpload (res, file) {
      this.addDialogForm.signUrl = res.data.filePath
      this.$refs['addDialogForm'].clearValidate(['signUrl'])
    },
    // 上传限制
    limitUpload (file) {
      // util.uploadImgLimit(file)
      if(this.addDialogForm.userId === ""){
        this.$message.error('请先选择签名归属人')
        return false
      }
      window.forUploadTransferValue = false
      setTimeout(() => {
        window.forUploadTransferValue = true
      }, 500)
      let testmsg = file.name.substring(file.name.lastIndexOf('.')+1)                 
      const extension1 = testmsg === 'jpg'  
      const extension2 = testmsg === 'jpeg'
      const extension3 = testmsg === 'png'  
      const isLt2M = file.size / 1024 / 1024 < 2  
      if(!((extension1) || (extension2) || (extension3) )) {
        return Promise.reject(
          this.$message({
            message: '上传文件只能是jpg/jpeg/png 格式!',  
            type: 'warning'  
          })
        )
        return false
      }
      if(!isLt2M) {
        return Promise.reject(
          this.$message({  
            message: '上传文件大小不能超过 2MB!',  
            type: 'warning'  
          })
        )
        return false
      }
      this.headersImg['sign'] =   this.$util.newHeadersSign('post',{});
      return true
    },
  }
}
</script>
<style lang="sass"  scoped>
// import "../../commons/publicCss/outside.sass"
.electronicSignDiv
  border: 1px solid #DCDFE6
  background: #FFFFFF
  height: 100%
  box-sizing: border-box
  // padding-bottom: 20px
  .topdiv
    padding: 14px 26px
    background: rgba(249,249,249,1)
    .electronicTitle
      font-size: 16px
      font-weight: bold
      font-family: MicrosoftYaHei-Bold !important
      line-height: 32px
    .inputSearch
      margin-right: 10px
      height: 30px
    .el-icon-search
      position: absolute
      right: 114px
      color: #999999
      padding: 5px 10px
      cursor: pointer
    .addBtn
      background: #1F9EFB
      color: #FFFFFF
// .item
//   margin: 4px
.el-table
  font-size: 12px
.headImg
  height: 26px
  width: 120px
.el-table--group, .el-table--border
  border-top: 1px solid #DCDFE6
.width290
  width: 290px
.width400
  width: 400px
// tree开始
.deptLeaderP
  height: 36px
  width: 383px
  border: 1px solid #dcdfe6
  border-radius: 4px
  color: #606266
  padding-left: 15px
  cursor: pointer
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
// tree结束
.elecSignPic
  height: 56px
  width: 400px
  overflow: hidden
.picMark
  line-height: 24px
  padding: 16px 0 0 120px
  width: 360px
.el-dialog__headerbtn
  top: 15px !important
.dialogPic
  .el-dialog
    min-height: 384px
  .el-dialog__headerbtn
    top: 2px !important
.el-button--small
  padding: 8px 15px

</style>
