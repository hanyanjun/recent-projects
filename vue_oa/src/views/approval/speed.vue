<template>
 <div class="speed">
     <heads :title="title">
       <div class="content" slot="content">
          <speedItem  
               v-for="(item,index) in list"  
               :name="item.handleUserName" 
               :key="index" 
               :type="item.nodeName"
               :status="item.handleOpinionCode"
               :date="item.operTime"
               :statusObj="processHandleOpinion.obj"
               :index="index"
               :isFirst= "index != list.length - 1"
               :isLast=" item.process == '4'"
               :detail="item.handleOpinionDesc"
               :info="item"></speedItem>
       </div>
     </heads>
 </div>   
</template>

<script>
import heads from "../../components/heads";
import speedItem from "./speedItem";
export default {
  name: "speed",
  components: { heads, speedItem },
  computed:{
    // 0 同意  1 不同意 2 退回  3 撤销 4强制流转
    processHandleOpinion(){
      return this.$store.state.selectData.processHandleOpinion
    }
  },
  props: {
    list: {
      type: Array,
      default: function() {
        return [];
      }
    },
    title: {
      type: String,
      default: "审批记录"
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.content {
  background: white;
  padding: 55px 25px 14px 60px;
  border-top: 1px solid $gray_f1;
}
</style>
