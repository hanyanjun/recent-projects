<template>
<div class="changeItem">
        <div class="changeItemCon">
            <h6 class="title">
                {{title}}
            </h6>
            <template v-if="typeof description == 'string'">
                <p class="des">
                    {{description}}
                </p>
            </template>
            <template v-else>
                <p class="des" v-for="item in description">
                    {{item}}
                </p>
            </template>
        </div>
</div>
        
</template>

<script>
export default {
   name : "changeItem",
   props:{
       title : {type : String , default : ""},
       description : {type : [Array,Object,String]}
   }
}
</script>

<style lang="scss" scoped>
.changeItem{
    padding-left: 45px;
    padding-bottom: 23px;
    position: relative;
    .title{
        font-size: 14px;
        color: #666;
        line-height: 1;
        margin-bottom: 7px;
        font-weight: bold;
    }
    .des{
        font-size: 14px;
        color: #666;
        line-height: 28px;
        width: 100%;
        word-break: break-all
    }
    &:after{
        content: "";
        position: absolute;
        display: inline-block;
        width: 1px;
        background: #e9eaec;
        height: 100%;
        left: 26px;
        top: 0;
    }
    
    &:before{
        content: "";
        position: absolute;
        display: inline-block;
        border: 1px solid #1596ee;
        border-radius: 50%;
        display: inline-block;
        width: 14px;
        height: 14px;
        box-sizing: border-box;
        left: 20px;
        background: white;
        top: 0;
        z-index: 2;
    }

}
.changeItem:nth-last-of-type(1){
    &:after{
        display: none;
    }
}
</style>
