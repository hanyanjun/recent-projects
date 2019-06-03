<template lang="pug">
#roleTableDiv.listWrapNoScroll.companyList.companyCommon
  //- 修改1 
  el-row.listHead
    el-col(:span='8')
      p.title 角色列表
    el-col(:span='16')
      .search
        button.add.pointer(@click.stop='addNewRole') 添加新角色
  el-tabs(style="background:#fff",v-model="tabList0", @tab-click='tabsClick')
    el-tab-pane(v-for="val in tabList", :key="val.code", :label="val.name",:name='val.code', class="listWrapNoScroll")
      div.tableContent
        el-table(:data='roleTable', style='width: 100%', height="200" , class="tableContentScroll100" ,v-loading='loading')
          el-table-column(label='ID', prop='id', width='60px')
          el-table-column(label='角色名称', prop='roleName')
          el-table-column(label='角色编码', prop='roleCode')
          el-table-column(label='创建人', prop='createdBy')
          el-table-column(label='创建人名字', prop='createdByUserName')
          el-table-column(label='创建时间', prop='dateCreated')
          
          el-table-column(label='更新人', prop='updatedBy')
          el-table-column(label='更新人名字', prop='updatedByUserName')
          el-table-column(label='操作', width='250px')
            template(slot-scope='scope')
              el-button(size='mini', plain, @click='seeHandle(scope.row)') 查看人员
              el-button(size='mini', type='primary', plain, @click='editHandle(scope.row)') 编辑
              el-button(size='mini', type='danger', plain, @click='deleteHandle(scope.row)') 删除
          empty(slot="empty",:visible="visible")    
</template>
<script>
import '../../commons/publicCss/outside.sass'
import empty from "@/components/empty";
export default {
  name: '',
  components:{empty},
  data () {
    return {
      tabList:[],
      tabList0:'',
      permission:'',
      roleTable: [],
      visible : false,
      loading: false,
    }
  },
  created () {
    // 1.根据头部获取tab名字
    this.tabList = this.$store.state.headInfo.moduleTypes
    this.tabList0 = this.tabList[0].code
    this.switchTab(this.tabList[0].code)
  },
  methods: {
    switchTab(name){
      switch(name){
        case 'oa':
          this.columns = this.columnsOA
        break;
        case 'eclub':
          this.columns = this.columnsOA
        break;
        default:
          this.columns = this.columnsOA
        break;
      }
      this.permission = name
      this.getRoleTable();
    },
    tabsClick(tab,event){
      this.switchTab(tab.name)
    },
    // 获取table数据
    getRoleTable () {
      this.$api.roleList({permission:this.permission}).then(res => {
        this.visible = true;
        this.roleTable = res.data.data
        this.loading = false
      })
    },
    // 查看人员
    seeHandle (row) {
      sessionStorage.setItem('roleId', row.id)
      this.$router.push({ name: 'seeRoleList'})
    },
    // 编辑
    editHandle (row) {
      // 经所有的参数放入vuex中
      this.$store.commit('getCheckData',{id: row.id,code:row.roleCode,name:row.roleName,handle:'edit'})
      sessionStorage.setItem('roleId', row.id)
      sessionStorage.setItem('roleCode', row.roleCode)
      sessionStorage.setItem('roleName', row.roleName)
      sessionStorage.setItem('handle', 'edit')
      sessionStorage.setItem('permission', this.permission)
      this.$router.push({ name: 'editRoleList'})
    },
    // 删除
    deleteHandle (row) {
      this.$confirm("此操作将删除此角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$api.roleDel({id: row.id,roleCode: row.roleCode}).then( res => {
          this.getRoleTable()
          this.$message.success(res.data.messages)
        })
      })
    },
    // 添加新角色
    addNewRole () {
      this.$store.commit('getCheckData',{handle:'add'})
      sessionStorage.setItem('handle', 'add')
      sessionStorage.setItem('permission', this.permission)
      this.$router.push({ name: 'editRoleList'})
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.companyCommon{
  border: 1px solid $gray_f1;
  // box-sizing: border-box
}
</style>
