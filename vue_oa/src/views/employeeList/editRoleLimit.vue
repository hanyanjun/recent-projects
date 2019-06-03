<template lang="pug">
#editRoleLimit
  el-form.topInfo(v-model='roleNameForm', label-width='120px', size='mini', style='padding-top: 20px;')
    el-form-item(v-for='val in tabList',:label='val.name')
      el-select.width600(v-model='idStrings[val.code]', multiple='multiple', placeholder='请选择')
        el-option(v-for='item in roleArrs[val.code]', :key='item.roleId', :label='item.roleName', :value='item.roleId') {{item.roleName}}
    el-form-item.roleSavebtn
      el-button(type='primary', @click='roleNameSubmit') 保 存 修 改
    
    
    
  //- div
    el-form-item(label='oa角色名称：')
      el-select.width600(v-model='oaRoleIdString', multiple='multiple', clearable='clearable', placeholder='请选择')
        el-option(v-for='item in oaEmployeeRoleArr', :key='item.roleId', :label='item.roleName', :value='item.roleId') {{item.roleName}}
    
    el-form-item(label='eclub角色名称：')
      el-select.width600(v-model='eclubRoleIdString', multiple='multiple', clearable='clearable', placeholder='请选择')
        el-option(v-for='item in eclubEmployeeRoleArr', :key='item.roleId', :label='item.roleName', :value='item.roleId') {{item.roleName}}
    el-form-item
      el-button(type='primary', @click='roleNameSubmit') 保 存 修 改
</template>

<script>
export default {
  data(){
    return{
      tabList:[],
      roleArrs:[],//所有角色的下拉框
      idStrings:[],// 初始化inpit
      userId:'',
      roleInfo: true,
      roleNameForm:{
        roleId:[]
      },
      oaEmployeeRoleArr: {
        roleId:[],
        userId:''
      },
      oaRoleIdString: [],
      eclubEmployeeRoleArr: {
        roleId:[],
        userId:''
      },
      eclubRoleIdString: [],

    }
  },
  computed: {},
  created() {
    // 获取参数userId
    this.userId = localStorage.getItem('editUserId')
    this.tabList = this.$store.state.headInfo.moduleTypes
    // this.tabList = [{code: "oa", name: "oa"}]
    this.tabList.forEach(v =>{
      this.$store.dispatch('getIdsAndNames',{permission:v.code}).then(obj=>{
        this.roleArrs[v.code]= obj
        let idString = []
        this.$api.getEmpRoleInfo({userId:this.userId,permission:v.code}).then((res) => {
          res.data.data.forEach(val => {
            idString.push(val.roleId)
          })
          this.idStrings[v.code] = idString
        })
      })
    })
    // this.oaInit()
    // this.eclubInit()
  },
  methods:{
    oaInit(){
      this.$store.dispatch('getIdsAndNames',{permission:'oa'}).then(obj=>{
        this.oaEmployeeRoleArr= obj
        this.$api.getEmpRoleInfo({userId:this.userId,permission:'oa'}).then((res) => {
          res.data.data.forEach(val => {
            this.oaRoleIdString.push(val.roleId)
          })
        })
      })
    },
    eclubInit(){
      this.$store.dispatch('getIdsAndNames',{permission:'eclub'}).then(obj=>{
        this.eclubEmployeeRoleArr= obj
        this.$api.getEmpRoleInfo({userId:this.userId,permission:'eclub'}).then((res) => {
          res.data.data.forEach(val => {
            this.eclubRoleIdString.push(val.roleId)
          })
        })
      })
    },
    // 4.角色权限
    roleNameSubmit () {
      this.roleNameForm.userId = this.userId
      this.tabList.forEach(v=>{
        this.idStrings[v.code].forEach(c =>{
          this.roleNameForm.roleId.push(c)
        })
      })
      console.log(this.roleNameForm.roleId)
      this.$api.empRoleSave(this.roleNameForm).then((res) => {
        if(res.data.code === '200'){
          this.$message.success(res.data.messages)
        }
      })
    }
  }
}
</script>
<style lang="sass" scoped>
#editRoleLimit
  .width600
    width: 400px
  .topInfo
    min-height: 240px
    border: 1px solid #dcdfe6
    background: #fff
    padding: 30px 20px 0 20px
    -moz-box-shadow: 0 0 10px #d9d9d9
    -webkit-box-shadow: 0 0 10px #d9d9d9
    box-shadow: 0 0 10px #d9d9d9
    margin: 20px 0px 20px 10px
  .roleSavebtn
    margin-top: 20px
</style>


