<template>
<div class="setModel">
    <img :src="imgs[icon]" alt="">
    <div class="modelInfo">
        <h5 class='deleteIcon'><i class="el-icon-close" @click="delectClick"></i></h5>
        <i class="iconfont  pointer icon-fuzhi" v-if="copy" @click.stop="copyClick"> </i>
        <h6 class="modeTitle">
            <span v-if="editShow">
              {{typeVal || '---'}}
              <i class="el-icon-edit" @click="editNameClick"></i>
            </span>
        
            <span v-else>
              <el-input class='editNameInput' :ref="'editNameRef'+id" autofocus v-model="editName" placeholder="请输入内容" @blur="editNameBlur"></el-input>
            </span>
              <!-- <el-popover
                placement="top"
                width="360"
                class="elPopper"
                v-model="visible2">
                <p class="editName">审批设置名称修改</p>
                <div class=editName><el-input v-model="editName" placeholder="请输入内容"></el-input></div>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button>
                </div>
                <i class="el-icon-edit" slot="reference"></i>
              </el-popover> -->
            
            
            <el-switch
            v-model="val"
            @change="change"
            active-color="#6dd8af"
            inactive-color="#C3CBD6">
            </el-switch>
        </h6>
        <span class="tip">最后更新时间&nbsp;&nbsp;&nbsp;<span class="tip">id：{{id}}</span><br>{{date  || '---'}}<br>可见权限:{{range || '---'}}</span>
        <div class="setBtns">
            <span class="edit pointer" @click.stop="editPro">编辑流程</span>
            <span class="pointer" @click.stop="editRange">编辑权限</span>
        </div>
    </div>
</div>   
</template>

<script>
import imgs from "./imgs"
export default {
  name: "setModel",
  data() {
    return {
      imgs : imgs,
      visible2: false,
      editName:'',
      editShow: true,
      typeVal:''
    };
  },
  props: {
    type: {
      type: String,
      default: ""
    },
    date: {
      type: String,
      default: ""
    },
    range: {
      type: String,
      default: ""
    },
    status: {
      type: Boolean,
      default: false
    },
    copy : {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: "leave"
    },
    id : {
        type :[String,Number],
        default : ''
    },
    info:{
      type : Object,
      default : function(){
        return {};
      }
    }
  },
  computed:{
      val:{
          get :function(){
              return this.status;
          },
          set : function(newValue){
              return newValue;
          }
      },
  },
  created(){
     this.typeVal = this.type
  },
  methods:{
      change(e){
          this.$emit('change',{status : e , id : this.id});
      },
      editPro(){
          this.$emit('editPro',{id : this.id , info :this.info});
      },
      editRange(){
          this.$emit('editRange',{id : this.id , info :this.info});
      },
      copyClick(){
        this.$emit('copy');
      },
      editNameClick(){
        this.editShow = false
        this.editName = this.typeVal;
        this.$nextTick(()=>{
          this.$refs['editNameRef'+this.id].focus()
        })
      },
      editNameBlur(){
        this.editShow = true
        if(this.editName!=this.typeVal){
          this.typeVal= this.editName
          this.$api.tempNameEdit({id:this.id,templateName:this.typeVal}).then(obj=>{
            this.$message.success("修改名称成功!")
          })
        }
      },
      delectClick(){
        this.$confirm('确认删除该设置吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            
            this.$api.tempDel({id:this.id}).then(obj=>{
              this.$emit('delectClick');
            })
          })
      }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.setModel {
  width: 340px;
  height: 120px;
  display: flex;
  flex-wrap: nowrap;
  border: 1px solid rgba(220, 223, 230, 1);
  box-shadow: 0px 3px 5px 0px rgba(221, 221, 221, 1);
  img {
    display: inline-block;
    width: 120px;
    height: 120px;
  }
  .modelInfo {
    display: inline-block;
    width: 220px;
    height: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    position: relative;
  }
  .deleteIcon{
    text-align: right;
    margin: 0px -20px -6px 0;
    i{
      padding: 6px;
    }
  }
  .modeTitle {
    font-size: 14px;
    height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family:"Microsoft YaHei";
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    margin-bottom: 12px;
  }
  .tip {
    display: inline-block;
    font-size: 14px;
    font-family:"Microsoft YaHei";
    font-weight: 400;
    color: rgba(193, 197, 205, 1);
    line-height: 18px;
    text-align: left;
  }
  .setBtns {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 30px;
    background: rgba(46, 65, 85, 0.7);
    box-shadow: 0px 3px 5px 0px rgba(221, 221, 221, 1);
    display: none;
    span {
      display: inline-block;
      width: 50%;
      font-size: 12px;
      font-family:"Microsoft YaHei";
      font-weight: 400;
      text-align: center;
      height: 16px;
      line-height: 16px;
      color: rgba(255, 255, 255, 1);
    }
    .edit {
      border-right: 1px solid white;
    }
    .el-popover{
      padding: 20px 15px !important
    }
  }
}
.setModel:hover {
  cursor: pointer;
  .setBtns {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }
}
.elPopper{
  border: 1px solid #f5ebec;
  border-radius: 0px;
}
.editName {
  padding: 12px;
}
.icon-fuzhi{
  font-size: 10px;
  position: absolute;
  top: 6px;
  left: 7px;
  color: #c1c5cd;
}
.el-icon-close{
  color: #c1c5cd;
}
.editNameInput .el-input__inner {
  border: 0 !important;
  border-bottom: 1px solid #1758da;
  border-radius: 0;
  color: #1758da;
}
</style>
