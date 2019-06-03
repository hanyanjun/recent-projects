<template>
<div class="processItem">
    <div class="itemContent">
        <h6 class="conT">
            {{title}}
        </h6>
        <div class="conInfo">
            <span class="info" v-if="type1"><span class="type">{{type1}}：</span><span ref="info" class="text">{{m1 || '无'}}</span></span>
            <span class="info" v-if="type2"><span class="type">{{type2}}：</span><span class="text" :style="infoStyle">{{m2 || '无'}}</span></span>
            {{setStyle()}}
        </div>
    </div>
    <div class="itemFn">
        <span class="pointer" @click.stop="addFn"  v-if="add"><i class="iconfont icon-plus-circle"></i>{{add}}</span>
        <span class="pointer" @click.stop="editFn" v-if="edit"><i class="iconfont icon-bianji"></i>{{edit}}</span>
        <span class="pointer" @click.stop="delFn" v-if="del"><i class="iconfont icon-del"></i>{{del}}</span>
    </div>
    <img src="../../commons/imgs/process.png" alt="" class="pro" v-show="!isLast">
</div>    
</template>

<script>
export default {
    name : 'processItem',
    data(){return{
        infoStyle : {}
    }},
    props : {
        add : {
            type : String,
            default : ''
        },
        edit : {
            type : String,
            default : ''
        },
        del : {
            type : String,
            default : ''
        },
        title : {
            type : String,
            default : ''
        },
        isLast:{
            type : Boolean,
            default : false
        },
        m1 : {
            type : String,
            default : ''
        },
        m2 : {
            type : String,
            default : ''
        },
        type1 : {
            type :String,
            default : ''
        },
        type2:{
            type : String,
            default : ''
        }
    },
    watch : {
        m1 : function(v,o){
            this.$nextTick(()=>{
                if(this.m2 || !this.$refs.info){
                 this.infoStyle = '';
                }else{
                    this.infoStyle = {'width' : this.$refs.info.offsetWidth + 'px' , 'text-align' : 'right'};
                }
            })
        }
    },
    methods:{
        addFn(){
            this.$emit('add');
        },
        editFn(){
            this.$emit('edit');
        },
        delFn(){
            this.$emit('del');
        },
        setStyle(){
            this.$nextTick(()=>{
            if(this.m2 || !this.$refs.info){
                 this.infoStyle = '';
              }else if(Object.keys(this.infoStyle).length == 0){
                 this.infoStyle = {'width' : this.$refs.info.offsetWidth + 'px' , 'text-align' : 'right'};
              }
            })
        }
    }

}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.processItem{
    display: inline-block;
    .itemContent{
        width:350px;
        background:rgba(255,255,255,1);
        box-shadow:0px 3px 5px 0px rgba(16,178,255,1);
        border-radius:2px;
        display: inline-block;
        .conT{
            height:44px;
            background:rgba(46,65,85,1);
            border:1px solid rgba(36, 52, 68, 1);
            border-radius:2px 2px 0px 0px;
            font-size:14px;
            font-family:"Microsoft YaHei";
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height: 44px;
            text-align: center;
            padding: 0 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .conInfo{
            display: flex;
            min-height: 100px;
            height: auto;
            justify-content: center;
            align-content: center;
            flex-wrap: wrap;
            font-size:14px;
            font-family:"Microsoft YaHei";
            font-weight:400;
            color:rgba(36,52,68,1);
            line-height:24px;
            padding: 27px 0;
            box-sizing: border-box;
            .info{
                display: flex;
                width: 100%;
                justify-content: center;
                box-sizing: border-box;
                padding: 0 40px;
            }
            .type{
                white-space: nowrap;
            }
            .text{
                display: inline-block;
                width: auto;
                text-align: left;
                padding: 0;
            }
        }
    }
    .itemFn{
        display: inline-block;
        vertical-align: top;
        height: 144px;
        text-align: left;
        span{
            display: flex;
            align-items: center;
            width: 90px;
            font-size: 14px;
            color: $icon_g;
            margin-left: 20px;
            margin-top: 20px;
        }
        .iconfont{
            color: $icon_g;
            font-size: 18px;
            margin-right: 10px;
            .icon-del{
                font-size: 14px;
                margin-left: 15px;
            } 
            .icon-plus-circle{
                font-size: 18px;
            }
        }
    }
    .pro{
        display: block;
        margin-left: 165px;
        z-index: -1;
    }
}
</style>
