<template>
 <div class="changeRecord">
   <h6 class="title">个人记录</h6>
   <div class="recordCon">
       <!-- 值：1：新增员工,2：账号激活，3：转正,4：调岗,5：离职,6：再入职 -->
       <template v-for="item in record" v-if="item">
        <template v-if="item.recordStatus == 1">
            <changeItem :title="item.nodeName"    :description="[`入职时间：${detailTime(item.recordDate)}`]"></changeItem>
        </template><template v-else-if="item.recordStatus == 2">
            <changeItem :title="item.nodeName" :description="[`激活时间：${detailTime(item.activeDate)}`]"></changeItem>
        </template><template v-else-if="item.recordStatus == 3">
            <changeItem :title="item.nodeName"    :description="`转正时间：${detailTime(item.regDate)}`"></changeItem>
        </template><template v-else-if="item.recordStatus ==4">
            <changeItem :title="item.nodeName"    :description="[`新部门：${item.newDept}`,`新岗位：${item.newJob}`,`新汇报对象：${item.newObjId}`,`调岗时间：${detailTime(item.transferDate)}`]"></changeItem>
        </template><template v-else-if="item.recordStatus == 5">
            <changeItem :title="item.nodeName"    :description="[`离职类型：${item.leavingJobType}`,`离职时间：${detailTime(item.leavingJobDate)}`,`办理离职时间：${detailTime(item.resignDate)}`]"></changeItem>
        </template><template v-else-if="item.recordStatus == 6">
            <changeItem :title="item.nodeName"    :description="`再入职时间：${detailTime(item.entryDate)}`"></changeItem>
        </template>
     </template> 
     <template v-if="record.length == 0">
         <h6 class="empty">暂无个人记录</h6>
     </template>    
   </div>
 </div>   
</template>

<script>
import changeItem from "./changeItem"
import scrollContent from "../../components/scrollContent"
import core from '@/api/core'
export default {
   name : "changeRecord",
   props : {
     record : {type : [Object,Array]}
   },
   components:{changeItem,scrollContent},
   methods:{
       detailTime(v){
           if(!v) return '暂无记录时间';
           return v.substring(0,10);
       }
   }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.changeRecord{
    .title{
        color: #333333;
        font-size: 16px;
        line-height: 1;
        margin-bottom: 6px;
        font-weight: bold;
    }
    .recordCon{
        background: white;
        border-radius: 2px;
        box-shadow: 0 0 3pt #D1D1D1;
        padding-top: 30px;
        padding-right: 30px;
    }
    .empty{
       text-align: center;
       font-weight: normal;
       padding-bottom: 30px;
       font-size: 14px;
       color: $gray_c;
    }
}

</style>
