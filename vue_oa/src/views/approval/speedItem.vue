<template>
<div :class="['speedItem' , {'noBefore' : !isFirst }]">
    <h6 class="title">
        <span class="type">{{type || info.type}}</span>
         <span class="status  status1" v-if="status == 1 || status == 2 || status == 3 || status == 4">{{statusObj[status] || statusObj[info.status]  || '---'}}</span>
         <span class="status  status2" v-if="!status && info.nodeCode != 'task_0'">审核中</span>
         <span class="status" v-if=" status && status == 0  &&  !isLast"  >{{statusObj[status] || statusObj[info.status]}}</span>
    </h6>
    <h6 class="name">{{name || info.name }}</h6>
    <h6 class="time" v-show="date || info.date || isStatus">{{date || info.date || '---'}}</h6>
    <h6 class="detail">{{detail || info.detail}}</h6>
    <i :class="['icon', 'iconfont' , icons[status]]"></i>
    <template v-if="!status">
      <i class="icon iconfont icon-shijian" v-show="info.nodeCode == 'task_0' "></i>
      <i class="icon iconfont icon-jinxingzhong" v-show="info.nodeCode != 'task_0'"></i> 
    </template>
</div>    
</template>

<script>
export default {
  name: "speedItem",
  data(){return{
    // 0 同意  1 不同意 2 退回  3 撤销 4强制流转
    icons : {
       0 : 'icon-jieshu',
       1 : 'icon-guanbi',
       2 : 'icon-tuihui',
       3 : 'icon-shenpi-chexiao',
       4 : 'icon-tuihui'
    }
  }},
  props: {
    type: {
      type: String,

      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    date: {
      type: String,
      default: ""
    },
    index: {
      type: [String,Number],
      default: ""
    },
    detail: {
      type: String,
      default: ""
    },
    status: {
      type: [String, Number],
      default: ""
    },
    info: {
      type: Object,
      default: function() {
        return {};
      }
    },
    isStatus: {
      type: Boolean,
      default: false
    },
    isFirst:{
      type: Boolean,
      default: false
    },
    isLast:{
      type: Boolean,
      default: false
    },
    statusObj: {
      type: Object,
      default: function() {
        return {};
      }
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.speedItem {
  padding-bottom: 26px;
  position: relative;
}
.title {
  font-size: 14px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  color: $gray_b;
  line-height: 1;
  margin-bottom: 13px;
  display: flex;
  justify-content: space-between;
  .type{
    display: inline-block;
    width: 65%;
    word-break: break-all;
    
  }
}
.status {
  color: $base_blue;
  font-size: 14px;
  font-weight: normal;
}
.status1 {
  color: $red_c;
}
.status2 {
  color: $green_c;
}
.name {
  font-size: 16px;
  line-height: 22px;
  color: $gray_b;
  font-weight: normal;
}
.time {
  color: #adafaf;
  font-size: 12px;
  line-height: 18px;
  font-weight: normal;
}
.detail {
  font-size: 12px;
  line-height: 18px;
  color: $gray_b;
  margin-top: 3px;
}
.icon {
  background: white;
  font-size: 18px;
  position: absolute;
  left: -30px;
  top: -3px;
  line-height: 18px;
  display: inline-block;
  width: 18px;
  height: 18px;
}
.icon-jieshu {
  color: $base_blue;
}
.icon-shijian {
  color: #adafaf;
}
.icon-jinxingzhong {
  color: $green_c;
}
.icon-tuihui,
.icon-shenpi-chexiao,
.icon-guanbi {
  color: $red_c;
}
.speedItem::before {
  content: "";
  display: inline-block;
  position: absolute;
  width: 1px;
  height: 100%;
  background: $gray_f1;
  left: -22px;
  top: 0;
}
.noBefore::before{
  display: none;
}
</style>
