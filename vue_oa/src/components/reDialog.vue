<template>
    <div class="dialog re_el_dialog "> 
        <el-dialog :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" :width='width'>
            <h6 :class="['title',{'title_left':!center}]">{{title}} <i class="el-icon-close" v-show="isClose" @click.stop="hidden('close')"></i></h6>
            <div class="content">
                <slot name="body"></slot>
            </div>
            <div class="redialogBtns">
                <span class="submit pointer" @click.stop="confirm">{{submit}}</span><el-button size="medium"  :style="{width : '150px', height : '36px' ,marginLeft : '20px'}"  v-show="cancle"  @ @click.stop="hidden('cancle')">{{cancle}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
  name : "reDialog",
  data(){return{
      isSubmit : false
  }},
  props:{
      visible: {
          type : Boolean,
          default : true
      },
      center : {
          type : Boolean,
          default : true
      },
      isClose : {
         type : Boolean,
         default : true
      },
      title: "",
      submit : {      
          type : [String,Boolean,Number],
          default : '提交'
      },
      cancle : {
          type : [String,Boolean,Number],
          default : '取消'
      },
      width : {
          type : String,
          default : '600px'
      }
  },
  watch:{
      visible : function(v){
          if(v){
              this.isSubmit = false;
          }else{
              if(!this.isSubmit){
                  this.$emit('close');
              }
          }
      }
  },
  methods:{
      hidden(type){
          this.$emit("update:visible",false);
          if(type == 'cancle'){
            this.$emit("cancle");
          }
          if(type == 'close'){
              this.$emit('close');
          }
      },
      confirm(){
          this.isSubmit = true;
          this.$emit("submit");
      },
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/common.scss";
.dialog{
    .title{
        width: 100%;
        text-align: center;
        background:rgba(245,247,250,1);
        border-radius:2px;
        position: absolute;
        left: 0;
        top: 0;
        height: 50px;
        font-size:16px;
        font-weight: bold;
        color:rgba(85,85,85,1);
        border-bottom: 1px solid $gray_f1;
        line-height:50px;
        .el-icon-close{
            position: absolute;
            font-size: 16px;
            top: 18px;
            right: 18px;
            &:hover{
                cursor: pointer;
            }
        }
    }
    .title_left{
        text-align: left;
    }
}
    .redialogBtns{
        text-align: center;
        padding-top: 20px;
        .cancle,.submit{
            display: inline-block;
            width:150px;
            height:36px;
            font-size: 14px;
            line-height: 36px;
            background:$base_blue;
            border-radius:4px;
            color: white;
            box-sizing: border-box;
        }
        .cancle{
            background:$btn_bg;
            color: $gray_b;
            border: 1px solid $gray_d1;
            margin-left: 20px;
        }
    }

</style>
