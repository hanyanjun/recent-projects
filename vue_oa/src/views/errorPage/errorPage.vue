<template>
<div class="errContent">
    <div class="content">
        <template v-if="status == 404">
            <img src="/static/imgs/404.png" class="status" alt="">
            <h6 class="tip">您访问的页面不存在……</h6>
        </template>
        <template v-else-if="status == 403">
            <img src="/static/imgs/403.png"  class="status" alt="">
            <h6 class="tip">Sorry，您无权限访问该页面……</h6>
        </template>
        <template v-else-if="status == 503">
            <img src="/static/imgs/503.png"  class="status" alt="">
            <h6 class="tip">当前服务正忙，请稍后再访问页面………</h6>
        </template>
        <h6 class="back">即将离开本页，<span class="blue">{{num}}</span>    秒后自动返回上一页</h6>
        <img src="../../commons/imgs/textshadow.png" alt="" class="shadow">
        <button class="backBtn pointer" @click.stop="backPage"> 返回上一页</button>
    </div>
    <img src="/static/imgs/bottombg.png" alt="" class="bottom">
</div>
<!-- <el-row>
    <el-col :span="24"><div>
        页面解析错误，当前状态码为：{{status}}
    </div></el-col>
</el-row> -->
</template>
<script>
export default {
    data(){return{
        status :'',
        num : 10,
        set : ''
    }},
    created(){
        // 根据当前错误状态动态渲染页面
        this.status = this.$route.params.status;
        this.back();
    },
    methods:{
        back(){
            this.set = setInterval(()=>{
                this.num --;
                if(this.num == 0){
                    clearInterval(this.set);
                    this.backPage();
                }
            },1000)
        },
        backPage(){
            clearInterval(this.set);
            this.$router.routeBack('',1);
        }
    },
    beforeDestroy(){
            clearInterval(this.set);
    }
}
</script>
<style lang="scss" scoped>
.errContent{
    background: #f4f4f4;
    position: relative;
    width: 100%;
    height: calc(100vh - 80px);
    .content{
        position: absolute;
        top: 50%;
        left: 50%;
        text-align: center;
        transform: translate(-50%,-50%);
    }
    .status{
        width: 500px;
        height: 250px;
        display: block;
        margin-bottom: 40px;
    }
    .tip{
        font-size:32px;
        font-weight:400;
        line-height: 47px;
        color:#10B2FF;
    }
    .back{
        font-size:24px;
        line-height: 40px;
        font-weight:400;
        color:rgba(102,102,102,1);
    }
    .blue{
        color:rgba(16,178,255,1);
    }
    .shadow{
        display: block;
        margin: 14px auto 63px;
    }
    .backBtn{
        width:150px;
        height:50px;
        background:rgba(16,178,255,1);
        border-radius:3px;
        color: white;
    }
    .bottom{
        position: absolute;
        bottom: -15px;
        left: 50%;
        transform: translate(-50%)
    }


}


</style>


