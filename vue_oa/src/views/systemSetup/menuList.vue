<template>
<div id="menuList" class="companyCommon companyList">
  <el-row class="listHead">
            <el-col :span="8"><p class="title">菜单列表</p></el-col>
            <el-col :span="16">
                <div class="search">
                    <button class="add pointer" @click.stop="addNew1F">添加新菜单</button>
                </div>
            </el-col>
  </el-row>
  <el-tabs v-model="tabList0" style="background:#fff" @tab-click='tabsClick'>
    <el-tab-pane v-for="val in tabList" :key="val.code" :label="val.name" :name='val.code' class="listWrapNoScroll">
      <!-- OA -->
      <tree-table 
        :columns="columns" 
        :tree-structure="false" 
        :data-source="menuTableData" 
        v-on:add="addNew1F" 
        v-on:edit="editChildF" 
        levelType="name"
        class="tableContent"
        tabeClass="tableContentScroll100"
        v-on:dele="deleChild">
        <empty slot="empty" :visible="visible"></empty>
        </tree-table>
    </el-tab-pane>
  </el-tabs>
  <div id="inlineFormInput" class="">
    <!-- 
       @close="closeCover" -->
    <reDialog 
       :visible.sync="dialogShow"
       @submit="submit('form')"
       :title="type == 'add' ? '添加新菜单' : '编辑菜单'">
      <template slot="body">
          <el-form :model="form" :rules="rules" class="dialogForm" ref="form" label-position="right" label-width="114px">
            <el-form-item label="名称" prop="name" size="medium"> 
                <el-input class="w400" v-model.trim="form.name"></el-input>
            </el-form-item> 
            <el-form-item label="图标" prop="icon" size="medium">
                <el-input class="w400" v-model.trim="form.icon"></el-input>
            </el-form-item>
            <el-form-item label=" 地址" prop="link" size="medium">
                <el-input class="w400" v-model.trim="form.link"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort" size="medium">
                <el-input class="w400" v-model.trim="form.sort" type="number"></el-input>
            </el-form-item>
            <el-form-item label="父菜单" prop="parent" size="medium">
              <el-select class="w400" v-model="form.parentId" @change="changeId" placeholder="请选择">
                  <el-option
                    v-for="item in menuTableData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    <template slot-scope="scope">
                      <h6 :style="`font-weight:normal;padding-left:${item._level*20}px`" >  
                      <span>{{item.name}}</span>
                      <i>{{item.index}}</i>
                      </h6>
                    </template>
                  </el-option>
                </el-select>
            </el-form-item>
          </el-form>
      </template>
    </reDialog>
  </div>
</div>
</template>
<script>
import '../../commons/publicCss/outside.sass'
import treeTable from '@/components/treeTable/vue/TreeGrid'
import utils from "@/util/index.js"
import reDialog from "@/components/reDialog"
import empty from "@/components/empty"
export default {
  name: '',
  components: {
    treeTable,reDialog,empty
  },
  data () {
    return {   
      visible : false,
      tabList:[],
      tabList0:"",
      permission:'',
      searchName :'',
      curInfo : {},
      dialogShow : false,
      form : {icon : '',link: '',sort :'',parentId : '',name : ''},
      current : {},
      type : 'add',
      index : 0,
      rules : {
          name: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
            { max: 15, message: '长度在 0 到 15 个字符', trigger: 'blur' }
          ],
          icon: [
            { max: 15, message: '长度在 0 到 15 个字符', trigger: 'blur' }
          ],
          link: [
            { max: 200, message: '长度最多200个字符', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '请输入排序', trigger: 'blur' }
          ]
      },
      columns:[],
      columnsOA: [
        {
          text: '菜单名称',
          dataIndex: 'name',
          class: 'textLeft'
        }, {
          text: 'ID',
          dataIndex: 'id',
          width: 50
        }, {
          text: '创建时间',
          dataIndex: 'dateCreated'
        }, {
          text: '修改时间',
          dataIndex: 'lastUpdated'
        },{
          text: '链接',
          dataIndex: 'link'
        }, {
          text: '排序',
          dataIndex: 'sort',
          width: 50
        }
      ],
      columnsEclub:[],
      originData:[]
    }
  },
  created () {
    // 1.根据头部获取tab名字
    this.tabList = this.$store.state.headInfo.moduleTypes
    this.tabList0 = this.tabList[0].code
    this.switchTab(this.tabList[0].code)
    
  },
  computed:{
    menuTableData(){
      // 先加载菜单，再将菜单数组返回到页面
      return this.$store.state.menuList.menuData;
    }
  },
  watch : {
    dialogShow:function(v){
      if(v){
        if(this.type == 'add'){
          this.current = {};
        }
        this.$nextTick(()=>{
          this.form = Object.assign({},this.curInfo);
          this.$refs['form'].resetFields();
        })
      }
    }
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
      this.init();
    },
    tabsClick(tab,event){
      this.switchTab(tab.name)
    },
    // this.$message.success('成功')
    addNew1F (value) {
      this.dialogShow = true;
      this.form = {
        icon : '',
        link : '',
        name : '',
        parentId : '',
        permission:this.permission,
        sort : '',
      };
      this.curInfo = Object.assign({},this.form);
      this.type = 'add';    //在当前层级下添加元素
    },
    changeId(item){
      if(this.current.id == item){
        this.$message.error('不可选择自己为父级菜单');
        this.form.parentId = '';
      }else{
        this.form.parentId = item;
        this.form = Object.assign({},this.form);
      }
    },
    init(){
      let permission = this.permission
      // 得到对应的菜单
      this.$store.dispatch('gainMenuList',{permission: permission});
    },
    copyCurrent(value){
      this.index = value.$index;
      this.current = value.row;  //存储当前要添加的容器
    },
    gainNewData(){
      let time = Date.parse(new Date());
      let obj = Object.assign({},this.current);
      obj.children = [];
      obj._parent = this.current;
      ++obj._level;
      obj.parentId = obj.id;
      ++obj.id;
      obj.dateCreated = utils.format();
      obj.lastUpdated = utils.format();
      obj.link = '';
      obj._show = false;
      obj.name = '';
      return obj;
    },
    editChildF (value) {
      this.dialogShow = true;
      this.type = 'edit';
      this.copyCurrent(value);
      this.form.id = this.current.id;
      this.form.name = this.current.name;
      this.form.link = this.current.link;
      this.form.sort = this.current.sort;
      this.form.parentId = this.current.parentId;
      this.form.icon = this.current.icon;
      this.form.permission = this.permission
      this.curInfo = Object.assign({},this.form);
    },
    gainInitNewData(){   
      let time = Date.parse(new Date()); 
        return Object.assign({
          name : '',
          link : '',
          sort :'',
          _expanded : false,
          _parent : null,
          children : [],
          _show : false,
          icon : '',
          lastUpdated : utils.format(),
          dateCreated : utils.format(),
          parentId : null,
        },this.form); 
    },
    submit(formName){
         this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.type == 'add'){   //添加的话重新请求接口获取数据
               this.$api.menuAdd(this.form).then(obj=>{
                this.$store.state.menuList.isUpdateMenuData = true;
                this.init();
                this.dialogShow = false;
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
              })
            }else{
              this.$api.menuEdit(this.form).then(obj=>{
                this.$store.state.menuList.isUpdateMenuData = true;
                this.init();
                this.dialogShow = false;
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
              })
            }
          }
        });
    },
    deleChild (value) {
        this.$confirm('确认删除该菜单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.menuDel({id : value.row.id}).then(obj=>{
            this.$store.state.menuList.isUpdateMenuData = true;
            this.init();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        })
    }
  }
}
</script>
<style lang='scss' scoped>
@import "../../assets/css/common.scss";
.companyCommon{
  border: 1px solid $gray_f1;
}
.head{
.name{
  display: inline-block;
  line-height: 40px;
  height: 40px;
}
.input{
  padding-right: 18px;
  // font-weight: normal
}
}
.w400{
  width: 95%;
}
.el-form-item__label{
  width: 120px;
}

  .el-table .cell{
    background: red
  }
</style>
