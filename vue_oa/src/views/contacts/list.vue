<template>
 <div class="contractList companyList">
     <!-- <div class="classify">
        <contactsTree  @selected="selected" @search="searchT"></contactsTree>    
     </div> -->
     <div class="content companyCommon">
        <el-row class="head">
            <el-col :span="8"><p class="title">通讯录列表</p></el-col>
            <el-col :span="16">
                <div class="search">
                    <div class="search-input"><search  v-model="search" holder="请输入员工姓名或者部门" @search="searchInfo"></search> </div>
                </div>
            </el-col>
        </el-row>
        <div class="filterResult" v-if="time.signDate.length != 0 || time.fileDate.length != 0  || time.workplace">
            筛选结果
            <span class="filterInfo" v-if="time.signDate.length != 0">
                <i class="circle"></i>
                签署时间&nbsp;{{time.signDate[0].replace(/\//g,'-')}}-{{time.signDate[1].replace(/\//g,'-')}}
                <i class="iconfont icon-del2 pointer" @click.stop="clear(['signDate'])"></i>
            </span>
            <span class="filterInfo" v-if="time.fileDate.length != 0">
                <i class="circle"></i>
                归档时间&nbsp;{{time.fileDate[0].replace(/\//g,'-')}}-{{time.fileDate[1].replace(/\//g,'-')}}
                <i class="iconfont icon-del2 pointer" @click.stop="clear(['fileDate'])"></i>
            </span>
            <span class="filterInfo" v-if="time.workplace">
                <i class="circle"></i>
                职场&nbsp;{{time.workplace}}
                <i class="iconfont icon-del2 pointer" @click.stop="clear(['workplace'])"></i>
            </span>
            <button class="clear pointer" @click.stop="clear(['signDate','fileDate','workplace'])">清除筛选结果</button>
        </div>
        <div class="tableContent">
            <!-- <el-scrollbar> -->
                <!-- <el-row> -->
                <el-table :data="list" sort-change="change" height="200" class="tableContentScroll">
                <el-table-column label='序号' type='index' width='60'></el-table-column>
                        <el-table-column v-for="(column, key) in colums" :sortable="column.pro  == 'userName' || column.pro  ==  'enName'"  :prop="column.pro"  :label="column.label"  :key="column.pro" >
                            <template slot-scope="scope">
                                <template v-if="column.pro == 'portraitUrl'">
                                    <div class="headWrap">
                                        <img class="headImg" v-img="scope.row[column.pro]" alt="">
                                    </div>
                                </template>
                                <template v-else-if="column.pro == 'mobile'">
                                    <span  class="font">
                                        {{scope.row[column.pro]}}
                                        <span class="blue pointer"  v-show="head.btn.btn1 == 'Y'" @click.stop="setPhone(scope.row)">{{/\*/.test(scope.row[column.pro])   ? '取消隐藏' : '设置隐藏' }}</span>    
                                    </span>
                                </template>
                                <template v-else>
                                    <template v-if="column.pro == 'userName'">
                                        <span :class="['font', 'pointer','blue']" @click.stop="rowClick(scope.row)">
                                            {{scope.row[column.pro] || '---'}}
                                        </span>
                                    </template>
                                    <template v-else-if="column.pro == 'email'">
                                        <template v-if="scope.row[column.pro]">
                                            <a :class="['font', 'pointer','blue']" :href="`mailto:${scope.row[column.pro]}?subject=&body=`">
                                                {{scope.row[column.pro] || '---'}}
                                            </a>
                                        </template>
                                        <template v-else>
                                            <span :class="['font','blue']" >
                                              ---
                                            </span>
                                        </template>
                                    </template>
                                    <template v-else>
                                        <span :class="['font']" >
                                            {{scope.row[column.pro] || '---'}}
                                        </span>
                                    </template>
                                </template>
                            </template>
                        </el-table-column>
                        <empty slot="empty" :visible="visible"></empty>
                </el-table>
                <div class="pageFooter" v-if="allInfo.total">
                 <pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :sizes="[10, 20, 30, 40, 100]"
                    :size="20"
                    :current.sync="inpageNum"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="allInfo.total">
                </pagination>
                </div>
                <!-- </el-row> -->
            <!-- </el-scrollbar> -->
        </div>
     </div>  
 </div>   
</template>

<script>
import search from "@/components/search"
import empty from "@/components/empty"
import contactsTree from "./contactsTree"
import pagination from "../../components/pagination"
export default {
    name : "contactsList",
    components:{contactsTree,pagination,search,empty},
    data(){return{
        time : {
            signDate : [],
            fileDate :[],
            workplace :''
        },
        colums : [
            {
                pro : 'portraitUrl',
                label :'头像'
            },
            {
                pro : 'userName',
                label :'姓名'
            },
            {
                pro : 'enName',
                label :'英文名'
            },
            // {
            //     pro : 'mobile',
            //     label :'手机号'
            // },
            {
                pro : 'email',
                label :'邮箱'
            },
            {
                pro : 'cityName',
                label :'工作城市'
            },
            {
                pro : 'position',
                label :'职位'
            },

        ],
        list : [],
        allInfo : { total : 0, pages : 1, pageSize : 20 ,  pageNum : 1 , list :[]},
        filter : {
            definedPage :{
                pageNum : 1,//页码
                pageSize : 20//页容量
            },
            // deptId : [],	//部门id
            deptId : '',	//部门id
            userName : '',	//姓名
        },
        inpageNum: 1,
        search:'',
        visible : false
    }},
    created(){
        this.init();
        this.filter.deptId = this.head.deptId
    },
    computed:{
        head(){
            return this.$store.state.headInfo;
        }
    },
    watch:{
        search : function(v){
            if(v == ''){
                this.filter.userName = ''
                this.init()
            }
        },
    },
    methods:{
        rowClick(item){
            window.sessionStorage['contactId'] = item.userId;
            this.$router.push({name : 'contactsInfo'}); 
        },
        change(){
            console.log(2);
        },
        init(){
            
            this.$api.getAddrList(this.filter).then(obj=>{
                this.allInfo = obj.data.data;
                this.list = obj.data.data.list;
                this.visible = true;
                // this.filter['definedPage.pageSize'] = this.allInfo.pageSize;
                // this.filter['definedPage.pageNum'] = this.allInfo.pageNum;
                // console.log(obj.data.data);
            })
        },
        gainImg(item){
            if(!item.portraitUrl) return LOADINGIMG;
            this.$store.dispatch('imgUrlToBlob',item.portraitUrl).then(obj=>{
                item.portraitUrl = obj;
                this.list.push('');
                this.list.pop();
            })
        },
        // 搜索的时候 一个是关键字  一个是是否匹配到部门树
        searchT(item){
            let obj = {
                definedPage : {
                    pageNum : 1,
                    pageSize : 20
                },
                deptId : [],	//部门id 
                // deptId : '',	//部门id 
                userName : '',	//姓名
            };
            if(item.selected){
                obj.deptId = [item.selected.id];
                // obj.deptId = item.selected.id
            }else{
                obj.userName = item.search;
            }
            this.filter = Object.assign({},obj);
            this.init();
        },
        // 选中的时候  是选中的部门树
        selected(item){
            let obj = {
                definedPage : {
                    pageNum : 1,
                    pageSize : 20
                },
                deptId : [],	//部门id
                userName : '',	//姓名
            };
            obj.deptId = [item.id];
            this.filter = Object.assign({},obj);
            this.init();
        },
        setPhone(item){
            this.$api.contactSwitchStatus({ status : /\*/.test(item.mobile) ? "N" :  "Y"  , type : 'MOBILE' , userId : item.userId}).then(obj=>{
                this.init();
                this.$message({
                    message :'设置成功',
                    type : 'success'
                })
            })
        },
        handleSizeChange(val){
            this.filter.definedPage.pageSize = val.value;
            if(val.isLoad){
                this.init();
            }
        },
        handleCurrentChange(val) {
            this.filter.definedPage.pageNum = val;
            this.init();
        },
        // 搜索
        searchInfo(){
          this.filter.definedPage.pageNum = 1
          this.inpageNum = 1
          this.filter.userName = this.search;
          this.init();
      },
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.contractList{
    display: flex;
    height: 100%;
    .search{
        display: flex;
        height: 30px;
        justify-content: flex-end;
        margin-top: 15px;
        .search-input{
            width: 300px;
            height: 30px;
        }
    }
    .treeHide{
        position: absolute;
        z-index: 12;
        height: 80px;
        width: 290px;
        top: -21px;
        right: 24px;
    }
    .classify{
        width: 300px;
        height: 100%;
        background: white;
        border-radius:2px;
        border: 1px solid $gray_f1;
        box-sizing: border-box;
        padding: 24px 26px 0;
    }
        // .search{
        //     height: 30px;
        // }
    .content{
        // width: calc(100% - 320px);
        width: 100%;
        border: 1px solid $gray_f1;
        background: white;
        border-radius:2px;
        height: 100%;
        // margin-left: 20px;
        .head{
            background: $btn_bg;
            height: 60px;
            padding-right: 12px;
            .title{
                width:96px;
                font-size:16px;
                color: $gray_a2;
                margin-left: 26px;
                font-weight: bold;
                line-height: 60px;
            }
            .all{
                width:80px;
            }
        }
    }
}
.font{
    color: #63717F;
    font-size: 12px;
}
.blue{
    color: #3C73B1;
}

.pointer{
    cursor: pointer;
}
.iconfont{
    color: #63717F ; opacity: 0.5;
}
.iconfont:hover{
    opacity: 1;
}
.headImg{
    display: inline-block;
    width: 36px;
    height: 36px;
    border-radius: 50%;
}
.headWrap{
    display: flex;
    justify-content: center;
    align-items: center;
}
// .tabeContent{
//     height: calc(100% - 150px);
//     overflow: scroll;
// }
</style>
