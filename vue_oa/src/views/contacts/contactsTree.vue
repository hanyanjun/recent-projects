<template>
 <div class="conClassWrap companyCommon">
    <div class="head">
            <span class="title">
                部门
            </span>
        </div>          
        <div class="search">
             <search v-model="searchT" @search="searchB" holder="请输入员工姓名或者部门"></search>  
        </div>
        <div class="treeContent">
            <conTree 
                :treeData="conTreeData"
                namePro="text"
                @selected="selected">
            </conTree> 
        </div>
 </div>   
</template>

<script>
import search from "@/components/search"
import utils from "@/components/treeTable/utils/index.js"
import conTree from "@/components/treeTable/vue/conTree"
export default {
  name : "conClass",
  components : {search,conTree},
  data(){return{
        conTreeData: [],
        originTreeData : [],
        current : '',
        searchT : ''
      }},
  watch : {
    searchT : function(v){
        if(v == ''){
            this.conTreeData.forEach((v)=>{
                v._search = false;
          })
        }
    }
  },
  methods:{
      init(){
        this.$api.getAddrListTree().then(obj=>{
            this.conTreeData =  utils.MSDataTransfer.treeToArray(obj.data.data, null, null, true);
            this.originTreeData = Object.assign([],this.conTreeData);
        })
      },
      searchB(){
        //   if(this.searchT.trim()){
            let isRex = false;
            this.conTreeData.forEach((v)=>{
                let newExp = new RegExp(this.searchT);
                if(newExp.test(v.text) && !isRex){
                    isRex = true;
                    v._selected = true;
                    this.$emit("search",{selected : v, search : this.searchT});
                    if(v.parentId){
                        v._parent._expanded = true;
                        v._parent._show = true;
                    }
                    return v;
                }else{
                    v._selected = false;
                    return v;
                }
            })
            if(!isRex){
                this.$emit('search',{search : this.searchT});
            }
        //   }else{
        //       this.$message.error('请输入内容!');
        //   }
      },
      selected(index){
        this.conTreeData.forEach((v,i)=>{
              if(i == index){
                  this.$emit("selected",v);
                  v._selected = true;
                  if(v._level != 0){
                      v._parent._expanded = true;
                      v._parent._show = true;
                  }
                  return v;
              }else{
                  v._selected = false;
                  return v;
              }
          })
      },
  },    
  created(){
      this.init();
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.conClassWrap{
    height: 100%;
}
.treeContent{
    width: 100%;
    height: calc(100% - 120px);
    overflow: hidden;
    margin-top: 25px;
    white-space: nowrap;
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
