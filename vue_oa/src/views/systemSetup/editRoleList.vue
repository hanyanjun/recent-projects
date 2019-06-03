<template>
<div id="editRoleList">
  <div class="topInfo">
    <div>
      <tree-table :columns="columns" :tree-structure="false" :data-source="roleTreeTableArr" levelType="name"></tree-table>
    </div>
  </div>
</div>
</template>
<script>
import '../../commons/publicCss/outside.sass'
import Utils from "@/components/treeTable/utils/index.js"
import treeTable from '@/components/treeTable/vue/roleTreeTable'
import utils from "@/util/index.js"
export default {
  name: '',
  components: {
    treeTable
  },
  data () {
    return {
      id:'',
      roleCode:'',
      columns:[
        {
          text: '菜单列表',
          dataIndex: 'name',
          class: 'textLeft',
          width: 100
        }, {
          text: '权限',
          dataIndex: 'requestmaps',
          width: 300
        }],
      roleTreeTableArr: [],
      handle:'',
      permission:''
    }
  },
  created () {
    this.permission = sessionStorage.getItem('permission')
    // 1.菜单对应权限
    this.$api.menuRequestmaps({permission:this.permission}).then(res => {
      if(res.data.data !=null){
        let data = Utils.MSDataTransfer.treeToArray(res.data.data, null, null, true)
        this.roleTreeTableArr = data
      }
    })
  },
  methods:{
  },
  computed:{
    maxIndex(){
      return this.roleTreeTableArr.length - 1;
    },
  }
}
</script>
<style lang="sass"  scoped>
.topInfo
  border: 1px solid #ece9e9
  background: #fff
  padding: 20px 20px
  // -webkit-box-shadow: 0 0 10px #d9d9d9
  // box-shadow: 0 0 10px #d9d9d9
  // margin: 20px
  .el-checkbox
    margin-right: 30px
    margin-left: 0px !important
</style>
