<template lang="pug">
#dictionaryData.listWrapNoScroll
  div.electronicSignDiv
    div.topdiv
      div.electronicTitle(style="float:left") 字典数据
      div(style="float:right;position: relative;")
        el-input.inputSearch.width290(placeholder='请搜索', v-model='searchUserName', size='small',  v-on:keyup.native.enter='searchBtnClick')
        i.el-icon-search(@click='searchBtnClick')
        el-button.addBtn(icon='el-icon-plus',size='small',@click='addBtnClick')  新增
        //- 测试提交
      div(style="clear:both")
    div.tableDiv.tableContent
      el-table(:data='dictionaryTable', height="200", class="tableContentScroll")
        el-table-column(v-for='(column, key) in colums', :label='column.label',:width='column.width')
          template(slot-scope='scope')
            //- | {{scope.row[column.pro] || '---'}}
            | {{scope.row[column.pro]}}
        el-table-column(label='操作')
          template(slot-scope='scope')
            el-button(size='mini', type='primary', plain, @click='editHandle(scope.row)') 编辑
            el-button(size='mini', type='danger', plain, @click='deleteHandle(scope.row)') 删除
        empty(slot="empty",:visible="visible")    
      //- 分页
      pagination(@size-change='electSizeChange', @current-change='electCurrentChange', :total='electTolPage',background, :sizes='[10, 20, 30, 40]', :size='20',:current.sync="inpageNum", layout='total, sizes, prev, pager, next, jumper')
    //- 新增编辑字典数据
    el-dialog.elecSignDialog(:title='addEditTitle === "add" ? "新增字典" : "编辑字典"', :visible.sync='addEditDialog', style='margin:0 auto', :close-on-click-modal='false',width='570px')
      el-form.elForm(:model='addEditForm',ref='addEditForm',:rules="addEditFormRule", label-width="96px", size="medium")
        el-form-item(label='code值',prop='code')
          el-input.width360(v-model.trim='addEditForm.code', placeholder='请输入code值')
        el-form-item(label='类型',prop='type')
          el-input.width360(v-model.trim='addEditForm.type', placeholder='请输入类型')
        el-form-item(label='名称',prop='name')
          el-input.width360(v-model.trim='addEditForm.name', placeholder='请输入名称')
        el-form-item(v-if='addEditTitle === "add" ? false : true',label='排序：',prop='sort')
          el-input.width360(v-model.trim='addEditForm.sort', placeholder='请输入排序')
        el-form-item(label='类型说明',prop='memo')
          el-input.width360(v-model.trim='addEditForm.memo', placeholder='请输入类型说明')
      .dialog-footer(slot='footer')
        el-button(@click='addEditBtnSave("addEditForm")',type='primary',size="medium") 保 存
        el-button(@click="resetForm('addEditForm')",size="medium") 取 消
      
</template>
<script>
import "../../commons/publicCss/outside.sass"
import pagination from "../../components/pagination"
import empty from "@/components/empty";
export default {
  name: '',
  components : {pagination,empty},
  data () {
    return {
      searchUserName:'',
      dictionaryTable:[],
      visible : false,
      colums:[
        {
          pro : 'id',
          label : 'id',
          width : 100
        },
        {
          pro : 'code',
          label : 'code'
        },
        {
          pro : 'type',
          label : '类型'
        },
        {
          pro : 'name',
          label : '名称'
        },
        {
          pro : 'sort',
          label : '排序'
        },
        {
          pro : 'memo',
          label : '类型说明'
        }
      ],
      electronicParam: {
        pageNum:'1',
        pageSize:'20',
        type : ''
      },
      electTolPage: 0,
      inpageNum:1,
      addEditDialog: false,
      addEditTitle: '',
      addEditForm: {
        code:'',
        type:'',
        name:'',
        sort:'',
        memo:'',
      },
      addEditFormRule: {
        code: [
          {required: true, message: '请输入code值', trigger: 'blur' }
        ],
        type: [
          {required: true, message: '请输入类型', trigger: 'blur' }
        ],
        name: [
          {required: true, message: '请输入名称', trigger: 'blur' }
        ],
        sort: [
          {required: true, message: '请输入排序', trigger: 'blur' }
        ],
        memo: [
          {required: true, message: '请输入类型说明', trigger: 'blur' }
        ],
      }

    }
  },
  created () {
    this.getDicForAllByPageTable()
    
  },
  watch: {
    addEditDialog (val) {
      if(!val){
        this.$refs['addEditForm'].resetFields()
      }
    },
    searchUserName(v,o){
      if(v == ''){
      this.electronicParam.type = '';
      this.getDicForAllByPageTable()

      }
    }
  },
  methods: {
    getDicForAllByPageTable (){
      this.$api.getDicForAllByPage(this.electronicParam).then(res => {
        this.visible = true;
        this.dictionaryTable = res.data.data.list
        this.electTolPage = res.data.data.total
      })
    },
    // 搜索
    searchBtnClick () {
      this.inpageNum = 1
      this.electronicParam.pageNum = 1
      this.electronicParam.type = this.searchUserName
      this.getDicForAllByPageTable()
      // this.$api.getDicForAllByPage({
      //   pageSize: this.electronicParam.pageSize,
      //   pageNum: this.electronicParam.pageNum,
      //   type: this.searchUserName
      // }).then(res => {
      //   this.dictionaryTable = res.data.data.list
      //   this.electTolPage = res.data.data.total
      // })
    },
    // 新增
    addBtnClick () {
      
      this.addEditTitle = 'add'
      this.addEditForm = {
        code:'',
        type:'',
        name:'',
        memo:''
      },
      this.addEditDialog = true
      this.$nextTick(() => {
        this.$refs['addEditForm'].resetFields()
      })
    },
    // 分页
    electSizeChange (val) {
      this.electronicParam.pageSize = val.value;
      if(val.isLoad){
      this.getDicForAllByPageTable()
      }
    },
    electCurrentChange (val) {
      this.electronicParam.pageNum = val
      this.getDicForAllByPageTable()
    },
    // 编辑
    editHandle (row) {
      this.addEditTitle = ''
      this.addEditForm.id = row.id
      this.addEditForm.code = row.code
      this.addEditForm.type = row.type
      this.addEditForm.name = row.name
      this.addEditForm.sort = row.sort
      this.addEditForm.memo = row.memo
      this.addEditDialog = true
      setTimeout(() => {
        this.$refs.addEditForm.clearValidate()
      },4)
    },
    // 删除
    deleteHandle(row){
      this.$confirm('确定要删除此数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.removeDic({id: row.id,type: row.type}).then(res => {
            this.getDicForAllByPageTable()
            this.$message.success(res.data.messages)
            this.addEditDialog = false
          })
        }).catch(() => {
          this.$message({type: 'info',message: '已取消'});
        })
    },
    // 保存
    addEditBtnSave (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.addEditTitle === 'add'){
              this.$api.addDic({
                code:this.addEditForm.code,
                type:this.addEditForm.type,
                name:this.addEditForm.name,
                memo:this.addEditForm.memo
              }).then(res => {
              this.getDicForAllByPageTable()
              this.$message.success(res.data.messages)
              this.addEditDialog = false
            })
          }else{
            this.$api.updateDic(this.addEditForm).then(res => {
              this.getDicForAllByPageTable()
              this.$message.success(res.data.messages)
              this.addEditDialog = false
            })
          }
        } else {
          console.log('格式 error')
          return false
        }
      })
    },
    // 取消
    resetForm () {
      this.addEditDialog = false
    }
  }
}
</script>
<style lang="sass" scoped>
#dictionaryData
  border-bottom: 1px solid #DCDFE6
.electronicSignDiv
  border: 1px solid #DCDFE6
  background: #FFFFFF
  height: 100%
  box-sizing: border-box
  .topdiv
    padding: 14px 26px
    background: rgba(249,249,249,1)
    border-bottom: 1px solid #DCDFE6
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
      right: 90px
      color: #999999
      padding: 5px 10px
      cursor: pointer
    .addBtn
      background: #1F9EFB
      color: #FFFFFF
.width290
  width: 290px
.width400
  width: 400px
</style>
