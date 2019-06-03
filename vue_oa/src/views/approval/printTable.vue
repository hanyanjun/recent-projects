<template>
<div class="previewCoverWrap" v-if="visible"  >
    <div class="content" id="printJS-form">
        <div class="table" >
            <div class="table-con" >
                <div class="head">
                    <h6 class="title" style="font-size: 16px;color: #333333;padding: 24px 0;">{{title || '合作协议'}}</h6>
                </div>
                <div class="infoTitle">
                    <span>申请日期：{{info.approveDate}}</span>
                    <span>申请单号：{{info.approveNum}}</span>
                    <!-- <span>附件张数：</span> -->
                </div>
                <table>
                    <tr>
                        <th class="flex span6"><span class="center  span12">经办人</span>  <span>{{info.approveUserInfo.approveUserName}}</span></th>
                        <th class="flex span6"><span class="center  span12">经办部门</span> <span>{{info.approveUserInfo.approveUserDeptName}}</span></th>
                        <th class="flex span6"><span class="center  span12">开支归属部门</span> <span>{{info.payFromDept}}</span></th>
                        <th class="flex span6"><span class="center  span12">开支归属预算</span> <span>{{paymentFromBudget.obj[info.payFromBudget]}}</span></th>
                    </tr>
                    <tr>
                        <td class="flex span24"> <span class="center col2">开支类型</span> <span>{{paymentType.obj[info.payType]}}</span> </td>
                    </tr>
                    <tr>
                        <template v-if="info.invoiceSituation == 'wd' && info.writeoffDate">
                            <td class="flex span12"> <span class="center span6">发票情况</span> <span>{{paymentInvoiceSituation.obj[info.invoiceSituation]}}</span> </td>
                            <td class="flex span12"> <span class="center span6 ">预计销账时间</span> <span >{{info.writeoffDate }}</span> </td>
                        </template>
                        <template v-else>
                            <td class="flex span24"> <span class="center col2">发票情况</span> <span>{{paymentInvoiceSituation.obj[info.invoiceSituation]}}</span> </td>
                        </template>
                    </tr>
                    <template v-if="info.isContract == 1">
                        <tr>
                            <td  class="flex span6"> <span  class="center span12">合同编号</span> <span>{{info.contractNum}}</span> </td>
                            <td  class="flex span6"> <span  class="center span12">合同总金额</span> <span>{{info.contractAmount}}</span> </td>
                            <td  class="flex span6"> <span  class="center span12">已付/已请款金额</span> <span>{{info.contractAmountPaid}}</span> </td>
                            <td  class="flex span6"> <span  class="center span12">本次申请金额</span> <span>{{info.contractAmountApply}}</span> </td>
                        </tr>
                    </template>
                    <tr>
                        <td  class="flex span24"> <span  class="center col3">单位全称/姓名</span>  <span>{{info.payName}}</span> </td>
                    </tr>
                    <tr>
                        <td  class="flex span24"> <span  class="center span3">支付方式</span> <span>{{paymentWay.obj[info.payWay]}}</span> </td>
                    </tr>
                    <tr>
                        <td  class="flex span12"> <span class="center span12">开户银行</span> <span>{{info.payBankName}}</span> </td>
                        <td  class="flex span12"> <span class="center span6">银行账号</span> <span class="center span18 noRight">{{info.payBankAccount}}</span>  </td>
                    </tr>
                    <template v-if="info.payBankType == 'swiftcode'">
                        <tr>
                            <td class="flex span3"> <span class="center">序号</span>  </td>
                            <td class="flex span9"> <span class="center ">费用内容摘要</span>  </td>
                            <td class="flex span3 noRight"> <span class="center">币种</span>  </td>
                            <td class="flex span9 noRight"> <span class="center noRight">金额</span>  </td>
                        </tr>
                        <tr v-for="(item,index) in list1" :key="index" v-if="index <= 4">
                            <td class="flex span3"> <span class="center">{{index+1}}</span>  </td>
                            <td class="flex span9"> <span class="center ">{{item.costContent}}</span>   </td>
                            <td class="flex span3 noRight"> <span class="center">{{paymentCurrency.obj[item.costCurrency]}}</span>  </td>
                            <td class="flex span9 noRight"> <span class="center noRight">{{'￥' + item.costAmount }}</span>  </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td class="flex span3"> <span class="center">序号</span>  </td>
                            <td class="flex span9"> <span class="center">费用内容摘要</span>  </td>
                            <td class="flex span3"> <span class="center">币种</span>  </td>
                            <td class="flex span3"> <span class="center">原币金额</span>  </td>
                            <td class="flex span3"> <span class="center">汇率</span>  </td>
                            <td class="flex span3"> <span class="center noRight">人民币金额</span>  </td>
                        </tr>
                        <tr v-for="(item,index) in list1" :key="index" v-if="index <= 4">
                            <td class="flex span3"> <span class="center">{{index+1}}</span>  </td>
                            <td class="flex span9"> <span class="center ">{{item.costContent}}</span>   </td>
                            <td class="flex span3"> <span class="center">{{paymentCurrency.obj[item.costCurrency]}}</span>  </td>
                            <td class="flex span3"> <span class="center">{{item.costAmount}}</span>  </td>
                            <td class="flex span3"> <span class="center">{{item.costRate}}</span>  </td>
                            <td class="flex span3"> <span class="center noRight">￥{{item.costAmountRmb}}</span>  </td>
                        </tr>
                    </template>
                    <tr>
                        <td  class="flex span3"> <span class="center">合计</span></td>
                        <td  class="flex span12"> <span class="center noRight">￥{{info.costAmountSum && $util.numToText(info.costAmountSum)}}</span></td>
                        <!-- <td  class="flex span3"> <span class="center"></span></td> -->
                        <td  class="flex span9"> <span class="center noRight">{{info.costAmountSum ? '￥' + info.costAmountSum : ''}}</span></td>
                    </tr>
                    <tr v-if="list2.length > 0 " v-for="(item,index) in list2"   :key="item.nodeCode">
                        <td class="flex" :style="{width : (100/list2.length)+'%'}"> <span :class="['center', index == list2.length - 1 ? 'noRight' : '']">{{item.nodeName}}</span></td>
                    </tr>
                    <tr v-if="list2.length > 0 " v-for="(item,index) in list2"   :key="item.nodeCode">
                        <td class="flex" :style="{width : (100/list2.length)+'%'}"> <span :class="['center', index == list2.length - 1 ? 'noRight' : '']">{{item.handleUserName}}</span></td>
                    </tr>
                    <tr v-if="list2.length > 0 && item.operTime" v-for="(item,index) in list2"   :key="item.nodeCode">
                        <td class="flex" :style="{width : (100/list2.length)+'%'}"> <span :class="['center', index == list2.length - 1 ? 'noRight' : '']">{{item.operTime}}</span></td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="btns" id="btns" v-show="isPrint || isDetail">
                <button class="next pointer"  v-show="isPrint" @click.stop="next"><i class="icon el-icon-printer"></i>打印封面</button>
        </div>
    </div>
      <i class=" close    iconfont   pointer icon-del2 " @click.stop="close"></i>
</div>    
</template>

<script>
export default {
    name : 'previewCover',
    props: {
        visible:{
            type : Boolean,
            default : false
        },
        title:{
            type : String,
            default : ''
        },
        info :{
            type : [Array,Object],
            default : function(){
                return {approveUserInfo: {approveUserName : '', approveUserDeptName : ''}};
            }
        },
        list1:{
            type : [Array],
            default : function(){
                return [];
            }
        },
        list2:{
            type : [Array],
            default : function(){
                return [];
            }
        },
        isDetail:{
            type : Boolean,
            default : true
        },
        isPrint:{
            type : Boolean,
            default : true
        },
        sources : {
            type : [Array,Object],
            default :  function(){
                return {};
            }
        }
    },
    computed:{
        paymentInvoiceSituation() {
            return this.$store.state.selectData.paymentInvoiceSituation;
        },
        paymentFromBudget() {
        return this.$store.state.selectData.paymentFromBudget;
        },
        paymentType() {
        return this.$store.state.selectData.paymentType;
        },
        paymentWay() {
        return this.$store.state.selectData.paymentWay;
        },
        paymentCurrency() {
        return this.$store.state.selectData.paymentCurrency;
        },
    },
    methods:{
        pre(){
            this.$emit('preview');
        },
        next(){
            this.isShow = false;
            window.print();
            // this.$print({
            //     printable: 'printJS-form',
            //     type: 'html',
            //     ignoreElements :'btns',
            //     // 继承原来的所有样式
            //     targetStyles: ['*']
            // })
        },
        close(){
           this.$emit("update:visible",false);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.previewCoverWrap{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 99999;
    overflow: scroll;
    .content{
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-top: 40px;
        padding-bottom: 40px;
        .btns{
            display: inline-block;
            margin-left: 20px;
            .iconfont,.icon{
                font-size: 16px;
                color: white;
                margin-right: 5px;
            }
        }
        .noprint{
            display: none;
        }
        button{
            width:150px;
            height:36px;
            border-radius:4px;
            color: white;
            display: block;
        }
        .next{
            border: 1px solid white;
            background: rgba(0,0,0,0);
            margin-bottom: 14px;
        }
        .pre{
            width:150px;
            height:36px;
            background:rgba(16,178,255,1);
            border-radius:4px;
        }
        .table{
            padding: 20px;
            height: 100%;
            box-sizing: border-box;
            background: white;
            .table-con{
                border: 1px solid $gray_b;
                height: 100%;
                padding: 1px;
                box-sizing: border-box;
            }
            .head{
                .title{
                    font-size: 16px;
                    color: $gray_a;
                    padding: 24px 0;
                }
            }
        }
        table{
            display: inline-block;
            width: 900px;
            background: white;
            border-top: 1px solid $gray_b;
            tr{
                display: flex;
                width: 100%;
                line-height: 1.2;
                th,td{
                    border-bottom: 1px solid $gray_b;
                }
            }
            tr>th:nth-last-of-type(1){
                border-right: none;
            }
            tr>td:nth-last-of-type(1){
                border-right: none;
            }
            tr:nth-last-of-type(1)>td{
                border-bottom: none;
            }
            .flex{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                box-sizing: border-box;
            }
            .right{
                    border-right: 1px solid $gray_b;
            }
            .center{
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: normal;
                height: 100%;
                width: 100%;
                box-sizing: border-box;
                border-right: 1px solid $gray_b;
            }
            .center1{
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: normal;
                height: 100%;
                box-sizing: border-box;
            }
            span{
                font-weight: normal;
                color: $gray_b;
                padding: 8px 10px;
                font-size: 13px;
                box-sizing: border-box;
            }
            .span6{
                width: 25%;
                border-right: 1px solid $gray_b;
            }
            .span3{
                width: 12.5%;
            }
            .span2{
                width: 8.33%;
            }
            .span9{
                width: 37.5%;
            }
            .span10{
                width:41.6666%;
            }
            .span24{
                width: 100%;
            }
            .span18{
                width: 75%;
            }
            .span4{
                width: 16.67%;
            }
            .span12{
                width: 50%;
                border-right: 1px solid $gray_b;
            }
            .span15{
                width: 62.5%;
            }
            .col3{
                width: calc(25% - 1px);
            }
            .col2{
                width: calc(12.5% - 1px);
            }
            .noRight{
                border-right: none;
            }
            // tr>th{
            //     border-bottom: 1px solid $gray_b;
            //     width: 540px;
            // }
            // tr:nth-last-of-type(1) > th{
            //     border-bottom: none;
            // }
            // tr>th:nth-of-type(1){
            //     width: 170px;
            //     font-size: 15px;
            //     color: $gray_b;
            //     border-right: 1px solid $gray_b;
            // }
            // tr>th:nth-of-type(2){
            //     padding-left: 14px;
            //     font-size: 14px;
            //     color: #a3a3a3;
            //     text-align: left;
            //     word-break: break-all;
                
            // }
        }
    }
    
.close{
  color: white;
  font-size: 30px;
  position: absolute;
  top: 50px;
  right: 50px;
}

        .noprint{
            display: none;
        }
}
.infoTitle{
    display: flex;
    justify-content: flex-start;
    margin-bottom: 15px;
    span{
        padding-left: 25px;
        display: inline-block;
        width: 38%;
        text-align: left;
        color: $gray_b;
    }
}
</style>
