<template>
 <div class="selfInfo companyCommon">
     <h6 class="title">
            <span>通讯详情</span>
             <i class="iconfont icon-fanhui pointer" @click.stop="back"></i>
     </h6>
     <div class="content infoContent">
         <scrollContent>

         <div class="head">
             <img src="../../commons/imgs/infobg.png" alt="" class="bg">
             <img src="" v-img="info.portraitUrl" alt="" class="headImg">

         </div>
         <h6 class="name">{{info.userName}}</h6>
         <div class="otherInfo">
                <span class="modules">
                    <span class="mtitle">英文名</span>
                    <span :class="['info',{'gray': !info.enName}]">{{info.enName || '未填写'}}</span>
                </span><span class="modules">
                    <span class="mtitle">工号</span>
                    <span :class="['info',{'gray': !info.empNo}]">{{info.empNo}}</span>
                </span><span class="modules">
                    <span class="mtitle">职位</span>
                    <span :class="['info',{'gray': !info.position}]">{{info.position || '未填写'}}</span>
                </span>
                <span class="modules" v-if="false">
                    <span class="mtitle">手机号</span>
                    <span @click.stop='changePhone' :class="['info','phoneShow',{'gray': !info.mobile}]">{{info.mobile ?  area.obj[info.mobileInternationalCode] + ' '+ info.mobile : '未填写'}}</span>
                    <!-- <template v-if="/\*/.test(info.mobile) "> -->
                    <template v-if="info.mobileViewFlag =='Y'">
                        <span class="fn pointer" @click.stop="setPre({type : 'MOBILE' , status : 'N'})"
                            v-show="info.mobileViewFlag =='Y' && head.btn.btn1 == 'Y'">取消隐藏</span>
                    </template>
                    <template v-else>
                        <span class="fn pointer" @click.stop="setPre({type : 'MOBILE' , status : 'Y'})"
                            v-show=" info.mobileViewFlag == 'N' && head.btn.btn1 == 'Y'">设置隐藏</span>
                    </template>
                </span>
                <span class="modules">
                    <span class="mtitle">部门</span>
                    <span :class="['info',{'gray': !info.deptName}]" >{{info.deptName || '未填写'}}</span>
                </span><span class="modules">
                    <span class="mtitle">工作城市</span>
                    <span :class="['info',{'gray': !info.cityName}]">{{info.cityName || '未填写'}}</span>
                </span><span class="modules">
                    <span class="mtitle">工作邮箱</span>
                    <span :class="['info',{'gray': !info.email}]">{{info.email || '未填写'}}</span>
                </span><span class="modules">
                    <span class="mtitle">分机号码</span>
                    <span :class="['info',{'gray': !info.extTelNum}]">{{info.extTelNum || '未填写'}}</span>
                    <template v-if="/\*/.test(info.extTelNum) ">
                        <span class="fn pointer"    @click.stop="setPre({type : 'EXTTEL' , status : 'N'})"
                              v-show="info.extTelNum && head.btn.btn1 == 'Y'">取消隐藏</span>
                    </template>
                    <template v-else>
                        <span class="fn pointer"    @click.stop="setPre({type : 'EXTTEL' , status : 'Y'})"
                              v-show="info.extTelNum && head.btn.btn1 == 'Y'">设置隐藏</span>
                    </template>
                </span><span class="modules">
                    <span class="mtitle">职级</span>
                    <span :class="['info',{'gray': !info.level}]">{{info.level || '未填写'}}</span>
                </span><span class="modules">
                    <span class="mtitle">微信</span>
                    <span :class="['info',{'gray': !info.wechat}]">{{info.wechat || '未填写'}}</span>
                </span><span class="modules">
                    <span class="mtitle">QQ</span>
                    <span :class="['info',{'gray': !info.qq}]">{{info.qq || '未填写'}}</span>
                </span><span class="modules">
                    <span class="mtitle">工位</span>
                    <span :class="['info',{'gray': !info.station}]">{{info.station || '未填写'}}</span>
                </span><span class="modules">
                    <span class="mtitle">座右铭</span>
                    <span :class="['info',{'gray': !info.motto}]">{{info.motto || '未填写'}}</span>
                </span>
         </div>
         </scrollContent>
     </div>




</div>   
</template>

<script>
import scrollContent from "@/components/scrollContent.vue"
export default {
    name : 'contactsInfo',
    data(){return {
        info :{},
        id : ''
    }},
    components:{scrollContent},
    created(){
        let id = window.sessionStorage['contactId'];
        this.id = id;  
        this.init();
    },
    computed:{
        head(){
            return this.$store.state.headInfo;
        },
        area(){
            return this.$store.state.selectData.areacode;
        }
    },
    methods:{
        back(){
            this.$router.routeBack('',1);
        },
        init(){
            if(this.id){
                this.$api.getAddrListEmpDetail(this.id).then(obj=>{
                    this.info = obj.data.data;
                    console.log(this.info.mobileViewFlag)
                })
            }else{

            }
        },
        setPre(item){
            let obj = Object.assign({},item);
            obj.userId = this.id;
            this.$api.contactSwitchStatus(obj).then(obj=>{
                this.init();
                this.$message({
                    message :'设置成功',
                    type : 'success'
                })
            })
        },
        // 改变手机号
        changePhone(){
            this.$confirm("查看手机号会记录留痕哦！", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$api.getMobile({userId:this.id}).then(res=>{
                    this.info.mobile = res.data.data.mobile
                    console.log(this.info.mobile)
                    if(this.info.mobile == '***********'){
                        this.changeBack()
                        return
                    }
                })
            }).catch(() => {
            })
        },
        changeBack(){
            this.$confirm("该手机号已经设置为隐藏！", "提示", {
                confirmButtonText: "返回",
                cancelButtonText: "",
                type: "warning",
                showCancelButton: false
            }).then(() => {
            }).catch(() => {
            })
        }

    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.selfInfo{
    .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 56px;
        span{
            font-size:16px;
            font-weight: bold;
            color:rgba(51,51,51,1);
            line-height:56px;
        }
        i{
            font-size: 26px;
            font-weight: normal;
            color: $gray_b;
        }
    }
    .content{
        width: 100%;
        background: white;
        .head{
            position: relative;
            height: 144px;
            position: relative;
        }
        .bg{
            display: inline-block;
            height: 100%;
            width: 100%;
        }
        .headImg{
            width:140px;
            height:140px;
            background: white;
            border: 2px solid white;
            position: absolute;
            border-radius: 50%;
            left: 50%;
            margin-left: -70px;
            top: 40px;

        }
        .name{
            height:17px;
            font-size:16px;
            color: $gray_a;
            margin-top: 60px;
            text-align: center;
            margin-bottom: 35px;
        }
        .otherInfo{
            text-align: left;
            padding-left: 200px;
            padding-bottom: 80px;
            display: flex;
            flex-wrap: wrap;
            div{
                display: inline-block;
            }
            .modules{
                    font-size:14px;
                    line-height:1.2;
                    margin-bottom: 45px;
                    display: flex;
                    text-align: left;
                    min-width: 400px;
                .mtitle{
                    display: inline-block;
                    width:110px;
                    font-size:14px;
                    color: $gray_b;
                    white-space: nowrap;
                    box-sizing: border-box;
                    padding-right: 50px;
                }
                .info{
                    display: inline-block;
                    padding-right: 12px;
                    word-break: break-all;
                }
                .phoneShow{
                    cursor: pointer;
                    color: #3C73B1;
                }
                .gray{
                    color: #C1C5CD;
                }
                .fn{
                    color: #3C73B1;
                }
            }
        }
    }

}



</style>
