<template>
<div class="previewCoverWrap" v-show="visible"  >
    <div class="content" id="printJS-form">
        <div class="table" >
            <div class="table-con" >
                <div class="head">
                    <h6 class="title" style="font-size: 16px;color: #333333;padding: 24px 0;">{{title || '合作协议'}}</h6>
                    <h6 class="num">合同编号：{{num || '未编号'}}</h6>
                </div><table>
                    <template  v-for="(item,index) in columns" v-if="item">
                        <template v-if="item.pro == 'signBodyDetailResp'">
                            <tr :key="`${item.pro}_${index}`">
                                <template v-if="!sources[item.pro]">
                                    <th>甲方</th>
                                    <th>---</th>
                                </template>
                                <template v-else>
                                    <th>{{bodyPos.obj[sources[item.pro].ourBodyPosition] ?  bodyPos.obj[sources[item.pro].ourBodyPosition] + '方' : '甲方'}}</th>
                                    <th>{{companyList.obj[sources[item.pro].ourSignBody] || '---'}}</th>
                                </template>
                            </tr>
                            <template v-if="sources[item.pro] && sources[item.pro].counterpartList">
                                <tr  v-for="(item1,index1) in sources[item.pro].counterpartList" :key="`${item1.counterpart}_${index}_${index1}`" >
                                    <th>{{bodyPos.obj[item1.counterpartBodyPosition]  ? bodyPos.obj[item1.counterpartBodyPosition] + '方' : '乙方'  }}</th>
                                    <th>{{item1.counterpart || '---'}}</th>
                                </tr>
                            </template>
                        </template>
                        <template v-else>
                            <tr :key="item.pro">
                                <th>{{item.label}}</th>
                                <template v-if="item.pro == 'receivedMaterial' && sources[item.pro]">
                                    <th>
                                        <span v-for="(item1,index) in JSON.parse(sources.receivedMaterial)" :key="`receivedMaterial${index}`">
                                            {{contractmaterials.obj[item1]}}
                                        </span>
                                    </th>
                                </template>
                                <template v-else-if="item.pro == 'payForm'">
                                    <th>{{settlement_type.obj[sources[item.pro]] || '---'}}</th>
                                </template>
                                <template v-else-if="item.pro == 'billingCurrency'">
                                    <th>{{settlement_type.obj[sources[item.pro]] || '---'}}</th>
                                </template>
                                <!-- <template v-else-if="item.pro == 'partyA'">
                                    <th>{{companyList.obj[sources[item.pro]] || '---'}}</th>
                                </template> -->
                                <template v-else-if="item.pro == 'ourSignBody'">
                                    <th>{{companyList.obj[sources[item.pro]] || '---'}}</th>
                                </template>
                                <template v-else>
                                    <th>{{sources[item.pro] || '---'}}</th>
                                </template>
                            </tr>
                        </template>
                    </template> 
                </table>
            </div>
        </div>
        <div class="btns" id="btns" v-show="isPrint || isDetail">
                <button class="next pointer"  v-show="isPrint" @click.stop="next"><i class="icon el-icon-printer"></i>打印封面</button>
                <button class="pre pointer" v-show="isDetail" @click.stop="pre"><i class="iconfont icon-changyong"></i>查看详情</button>
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
        num:{
            type : String,
            default : ''
        },
        columns :{
            type : [Array,Object],
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
        // 合同收到的材料
        contractmaterials(){
            return this.$store.state.selectData.busi_material;
        },
        // 货币类型
        settlement_type(){
            return this.$store.state.selectData.settlement_type;
        },
        // 公司列表
        companyList(){
            return this.$store.state.selectData.allCompanyList;
        },
        // 主题地位
        bodyPos(){
            return this.$store.state.selectData.body_position;
        }
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
@import "../assets/css/common.scss";
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
                .num{
                    font-size:14px;
                    color:$gray_b;
                    padding-left: 85px;
                    text-align: left;
                    padding-bottom: 10px;
                }
            }
        }
        table{
            display: inline-block;
            width: 710px;
            background: white;
            border-top: 1px solid $gray_b;
            tr{
                display: flex;
                width: 100%;
                line-height: 1.2;
                th{
                    padding: 16px 0;
                }
            }
            tr>th{
                border-bottom: 1px solid $gray_b;
                width: 540px;
            }
            tr:nth-last-of-type(1) > th{
                border-bottom: none;
            }
            tr>th:nth-of-type(1){
                width: 170px;
                font-size: 15px;
                color: $gray_b;
                border-right: 1px solid $gray_b;
            }
            tr>th:nth-of-type(2){
                padding-left: 14px;
                font-size: 14px;
                color: #a3a3a3;
                text-align: left;
                word-break: break-all;
                
            }
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
</style>
