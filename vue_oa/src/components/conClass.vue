<template>
 <div class="conClassWrap companyCommon">
    <div class="head">
            <span class="title">
                合同分类
            </span>
            <span class="addClass pointer" @click.stop="addClass">
                +新增分类
            </span>
        </div>          
        <div class="search">
             <search v-model="searchT" @search="searchB" holder="请输入合同名称"></search>  
        </div>
        <div class="treeContent">
            <conTree 
            :treeData="conTreeData"
            @edit="edit"
            @selected="selected"
            @dele="dele"
            @add="add">
    </conTree> 
        </div>
    <reDialog 
        :visible.sync="diaShow" 
        :title="type == 'add' ? '新增合同分类' : '编辑合同分类'"
        @close="close"
        @submit="submit">
        <template slot="body">
            <el-form :model="form" ref="form" :rules="rules" class="form"  size="medium"  label-width="110px">
                <el-form-item  class="dialogForm" label="上级分类" size="medium" prop="parentId">
                    <el-select  v-model="form.parentId"  placeholder="请选择">
                        <el-option
                        v-for="item in conTreeData"
                        :key="item.id"
                        :label="item.className"
                        :value="item.id">
                        <template slot-scope="scope">
                            <h6 :style="`font-weight:normal;padding-left:${item._level*20}px`"  @click="selectOptions(item,$event)">  
                            <span style="font-size: 14px">{{item.className}}</span>
                            <i>{{item.index}}</i>
                            </h6>
                        </template>
                        </el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item class="dialogForm" label="分类名称" size="medium" prop="className">
                    <el-input   v-model.trim="form.className" placeholder="请输入分类名称"></el-input>
                </el-form-item>
                <el-form-item class="dialogForm" label="分类管理员" size="medium" prop="classManager">
                            <el-select v-model="form.classManagerName"  placeholder="请选择分类管理员">
                              <template slot-scope="scope">
                                  <selectMem  :treeData="treeMem.list" @select="selectMem" :clear="form.classManagerName"></selectMem>
                                  <el-option  v-for="(item,index) in [0]" :key="index" :value="item.id" >
                                  </el-option>
                              </template>
                            </el-select>
                    <!-- <el-select  v-model="form.classManager"  placeholder="请选择分类管理员">
                        <el-option
                        v-for="item in roles"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId">
                        </el-option>
                    </el-select> -->
                    <!-- <el-input   v-model="form.classManager" placeholder="请选择"></el-input> -->
                </el-form-item>
            </el-form>
        </template>
    </reDialog>
 </div>   
</template>

<script>
import search from "./search"
import reDialog from "./reDialog"
import utils from "./treeTable/utils/index.js"
import conTree from "./treeTable/vue/conTree"
import selectMem from "./selectMem"
export default {
  name : "conClass",
  components : {search,conTree,reDialog,selectMem},
  data(){return{
        originTreeData : [],
        diaShow : false,
        current : '',
        type : 'add',
        // 编辑 多一个  classId 分类id
        form : {
            parentId : '',//父节点id
            className : '', //分类名称
            classManager : '', //分类管理员
            classType : '' ,
            classManagerName : '', //分类管理员姓名           
        },
        rules : {
            className : [
                { required: true, message: '请输入分类名称', trigger: 'blur' },
            ],
            parentId : [
                { required: true, message: '请选择上级分类', trigger: 'blur' },
            ],   
            classManager : [
                { required: true, message: '请选择分类管理员', trigger: 'blur' },
            ],
        },
        searchT : ''
      }},
  props:{
      classType : {
          type : String,
          default : ''
      }
  }, 
  computed:{
      roles(){
          return this.$store.state.selectData.idsAndNames;
      },
      conTreeData(){
          return this.$store.state.selectData.contractTreeData.list;
      },
      treeMem(){
          return this.$store.state.selectData.orgTreeBaseInfo;
      },
  }, 
  watch : {
    searchT : function(v){
        if(v == ''){
            this.conTreeData.forEach((v)=>{
                v._search = false;
                v._isBtn = false;
                v._selected = false;
          })
        }
    },
    classType: function(v){
        this.searchT = '';
        this.form.classType = v;
        this.init();
    },
    'form.parentId': function(val){
      if(val){
        this.$refs['form'].clearValidate('parentId')
      }
    },
    'form.classManagerName': function(val){
      if(val){
        this.$refs['form'].clearValidate('classManager')
      }
    }
  },
  methods:{
    //   changeId(item){
    //         if(this.current.id == item){
    //             this.$message.error('不可选择自己为父级菜单');
    //             this.form.parentId = '';
    //         }else{
    //             this.form.parentId = item;
    //             this.form = Object.assign({},this.form);
    //         }
    //   },
      selectOptions(item,$event){
          if(item._level > 3){
              this.$message.error('最多添加至第5级');
              this.$nextTick(()=>{
                  this.form.parentId = '';
              })
          }else{
              if(this.current.id == item){
                this.$message.error('不可选择自己为父级菜单');
                this.form.parentId = '';
            }else{
                this.form.parentId = item.id;
                this.form = Object.assign({},this.form);
            }
          }
      },
      close(){
        this.$refs['form'].resetFields();
      },
      addClass(){
          this.type = 'add';
          this.diaShow = true;
          this.form = Object.assign({},{    
            parentId : '',//父节点id
            className : '', //分类名称
            classManager : '', //分类管理员   
            classManagerName : '',//分类管理员姓名
            classType : this.classType         
        });
      },
      add(item){
          this.type = 'add';
          if(item._level > 3){
              this.$message.error('最多添加至第5级');
          }else{
            this.diaShow = true;
            this.$nextTick(()=>{
            this.$refs['form'].resetFields();
            this.form.parentId = item.id;
            this.form.className = '';
            this.form.classManager = '';
            this.form.classManagerName = '';
            this.form.classId = '';
            })
          }
      },
      edit(item){
          this.type = 'edit';
          this.diaShow = true;
          this.$nextTick(()=>{
               this.$refs['form'].resetFields();
                this.form.parentId = item.parentId || '';
                this.form.className = item.className;
                this.form.classManager = item.classManagerId;
                this.form.classManagerName = item.classManagerName;
                this.form.classId = item.id;
          });
      },
      selectMem(item){
          this.form.classManager = item.mem.userId;
          this.form.classManagerName = item.mem.userName;
      },
      init(){
        this.$store.state.selectData.contractTreeData.list = [];  
        this.$store.dispatch('getContractTreeData',this.classType);
      },
      searchB(){
        //   if(this.searchT.trim()){
            let isRex = false;
            this.conTreeData.forEach((v)=>{
                let newExp = new RegExp(this.searchT);
                if(newExp.test(v.className) && !isRex && this.searchT){
                    v._search = true;
                    v._isBtn = true;
                    if(v.parentId){
                        v._parent._expanded = true;
                        v._parent._show = true;
                    }
                    this.$emit("search", v.id);
                    isRex = true;
                    return v;
                }else{
                    v._search = false;
                    v._isBtn = false;
                    v._selected = false;
                    return v;
                }
            })
            if(!isRex){
                this.$emit('search', '');
            }
        //   }else{
        //       this.$message.error('请输入内容!');
        //   }
      },
      selected(index){ 
        this.conTreeData.forEach((v,i)=>{
              if(i == index){
                  v._selected = true;
                  v._isBtn = true;
                  if(v._level != 0){
                      v._parent._expanded = true;
                      v._parent._show = true;
                  }
                  this.$emit("selected",v.id);
                  return v;
              }else{
                  v._selected = false;
                  v._isBtn = false;
                  v._search = false;
                  return v;
              }
          })
      },
      dele(item){
        this.$confirm('确认删除该分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.contractClassDel({classId : item.id ,  classType : this.classType   }).then(obj=>{
            this.init();
            this.diaShow = false;
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        })
      },
      submit(){
         this.$refs['form'].validate((valid) => {
            if(valid){
                this.form.classType = this.classType;
                if(this.type == 'add'){
                        this.$api.contractClassInsert(this.form).then(obj=>{
                        this.$refs['form'].resetFields();
                            this.init();
                            this.diaShow = false;
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            });
                        })
                }else{
                    this.$api.contractClassEdit(this.form).then(obj=>{
                            this.init();
                            this.diaShow = false;
                            this.$message({
                                message: '编辑成功',
                                type: 'success'
                            });
                    })

                }
            }
         })
      }
  },    
  created(){
      this.$store.dispatch('getIdsAndNames');
      if(this.classType){
        this.init();
      }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/common.scss";
.conClassWrap{
    height: 100%;
}
.treeContent{
    width: 100%;
    height: calc(100% - 100px);
    margin-top: 25px;
}

        .head{
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 21px;
        }
        .title{
            font-size:16px;
            color:$gray_a2;
            font-weight: bold;
            line-height: 1;
        }
        .addClass{
            font-size:12px;
            color:#3C73B1;
            line-height: 1;
        }
        .search{
            height: 30PX        ;
        }
</style>
