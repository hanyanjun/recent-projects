<template>
<div class="approvalList">
<h6 class="title">
       <span>发起审批</span>
    </h6>
    <div class="model" v-for="(item , index ) in  arr" :key="index" >
        <heads :title="(processClassType.obj[item.classTypeCode] || '---')+'('+item.flowTempList.length+')'" v-if="item.flowTempList.length > 0">
          <div class="content" slot="content">
              <div class="item pointer"  @click.stop="apply(item1)" v-for="(item1,index1) in item.flowTempList" :key="index1">
                     <img :src="imgs[item1.relationFormCode]" alt=""><span class="text">{{item1.templateName}}</span>
              </div>
          </div>
      </heads>
    </div>
    <div class="empty" v-show="arr[0].flowTempList.length == 0 && visible">
      <empty :visible="visible"></empty>
    </div>
   


</div>
</template>

<script>
import imgs from "./imgs"
import heads from "../../components/heads";
import empty from "@/components/empty";
// 发起人列表
export default {
  name: "list",
  data() {
    return {
      arr: [{ classTypeCode: "", flowTempList: [] }],
      imgs : imgs,
      visible : false
    };
  },
  components: { heads , empty},
  computed: {
    processClassType() {
      return this.$store.state.selectData.processClassType;
    },
    processFormType() {
      return this.$store.state.selectData.processFormType;
    }
  },
  created() {
    this.$api.getTempListForUser().then(obj => {
      if(obj.data.data && obj.data.data.length > 0){
        this.arr = Object.assign([], obj.data.data);
      }
      this.visible = true;
    });
  },
  methods : {
    apply(item){
      window.sessionStorage['apply'] = JSON.stringify(item);
      window.sessionStorage['applyState'] = 0;
      this.$router.push({name : 'approval'+item.relationFormCode});
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.approvalList {
  height: 100%;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    span {
      font-size: 16px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      line-height: 56px;
    }
    i {
      font-size: 26px;
      color: $gray_b;
    }
  }
  .content {
    padding: 35px 20px 20px 65px;
    display: flex;
    background: white;
    flex-wrap: wrap;
  }
  .model {
    margin-bottom: 20px;
    width: 100%;
    .item {
      margin-right: 85px;
      padding-bottom: 20px;
        line-height: 0;
      img {
        display: inline-block;
        width: 120px;
        height: 120px;
      }
      .text {
        font-size: 14px;
        font-family:"Microsoft YaHei";
        font-weight: 400;
        color: $gray_b;
        line-height: 1;
        display: block;
        text-align: center;
        word-break: break-all;
        width: 120px;
        margin: 20px 0 0 0;
      }
    }
  }
  .empty{
    display: flex;
    justify-content: center;
    text-align: center;
    padding-top: 130px;
  }
}
</style>
