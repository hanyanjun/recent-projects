<template>
<div :class="`headInfo ${infoClass}`">
    <h6 class="headTop" @mouseenter="fn_show = true"> 
        <i :class="`iconfont icon1 ${preIcon}`" v-show="preIcon">
        </i><span class="title" v-show="title">
            {{title}}
        </span>
        <span class="reset_badge_num" v-show="num">
            <el-badge :value="num" :max="99" class="item"></el-badge>
        </span>
        <slot name="titleTip"></slot>
        <span class="fn pointer" v-show="fn">
            {{fn}}
        </span>
        <span class="bench_fnIcon"  v-show="is_fn && fn_show" >
            <el-popover trigger="hover" width="143px" placement="bottom" @show="fn_show = true"  @hide="fn_show = false"  popper-class="paddingTop_4px" >
                <img src="../commons/imgs/spread.png" class="fnIconImg pointer" alt=""  v-show="fn_show" slot="reference">
                <div class="dropList" @mouseenter="fn_show = true" @mouseleave="fn_show = false">
                    <span v-for="(item,index) in dropItems" :key="index" @click.stop="clickItem(item)">{{item}}</span>
                </div>
            </el-popover>
        </span>
        
    </h6>
    <div class="infoTop">
        <slot name="infoTop"></slot>
    </div>
    <div class="com_content"> 
        <slot name="content"></slot>
        <template v-if="!$slots.content ||  !$slots.content[0].children || $slots.content[0].children.length == 0 ||　is_empty">
            <div class="empty">
                <empty :visible="true" otherClass="emptyCon1" :img="emptyImg"></empty>
            </div>
        </template>
    </div>
</div>    
</template>

<script>
import empty from "./empty";
export default {
    components:{empty},
    data(){return{
        drop_visible : false,
        fn_show : false
    }},
    props : {
        title : {
            type : String,
            default : ''
        },
        fn : {
            type : String,
            default : ''
        },
        num : {
            type : Number,
            default : 0
        },
        infoClass:{
            type : String,
            default : ''
        },
        preIcon:{
            type : String,
            default : ''
        },
        is_fn:{
            type : Boolean,
            default : false
        },
        is_empty : {
            type : Boolean,
            default : false
        },
        dropItems:{
            type : Array,
            default : function(){
                return [];
            }
        },
        itemInfo:{
            type : [Array,Object],
            default : function(){
                return {};
            }
        },
        emptyImg:{
            type : String,
            default : ''
        }
    },
    methods:{
        clickItem(item){
            this.$emit('optionClick',{btnText : item , itemInfo : this.itemInfo});
        }
    },
}
</script>

<style lang="scss" scoped>
@import "../assets/css/common";
.headInfo{
    box-shadow:0px 3px 5px 0px rgba(221,221,221,1);
    border:1px solid rgba(220, 223, 230, 1);
    .headTop{
        width: 100%;
        height:44px;
        background:#f5f7fa;
        border-radius:2px 2px 0px 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 35px 0 20px;
        box-sizing: border-box;
    }
    .title{
        font-size:14px;
        font-family:"Microsoft YaHei";
        font-weight:400;
        color:$gray_b;
        line-height:24px;
    }
    .num{
        display: flex;
        align-items: center;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color: white;
        text-indent: 0;
    }
    .fn{
        font-size:14px;
        font-family:"Microsoft YaHei";
        font-weight:400;
        color:#3C73B1;
    }
        .empty{
            background: white;
            display: flex;
            justify-content: center;
            text-align: center;
        }
}
.headInfoT1{
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 5px 0px rgba(221,221,221,1);
    border-radius:6px;
    border: none;
    overflow: hidden;
    .headTop{
        width: 100%;
        height:70px;
        background: white;
        justify-content: flex-start;
        padding: 0 35px 0 22px;
        position: relative;
        .icon1{
            margin-right: 14px;
            color: $gray_a;
            font-size: 16px;
        }
        .title{
            font-size: 16px;
            font-family:"Microsoft YaHei";
            color:rgba(51,51,51,1);
        }
        .bench_fnIcon{
            display: inline-block;
            width: 14px;
            height: 5px;
            position: absolute;
            right: 18px;
            top: 24px;
        }
        .fnIconImg{
            display: inline-block;
            width: 100%;
            height: 100%;
        }
    }
}
.headInfoT1:hover{
    box-shadow:0px 8px 7px 1px rgba(221,221,221,1);
}
</style>
