<template>
 <div class="contractSingBody formInline">
     <el-form ref="form" :rules="rules" size="medium" :model="baseInfo" label-width="114px">
         <div class="form_content">
            <el-form-item label="我方签约主体" size="medium" prop="ourSignBody">
                {{changeBaseInfo()}}
                <previewInfo :visible="pre" :info="baseInfo.ourSignBodyName"></previewInfo> 
                <!-- {{baseInfo.ourSignBody}} -->
                <!-- <el-select v-model="baseInfo.ourSignBody"   v-show="!pre"  placeholder="请选择">
                        <el-option  v-for="(item,index) in cpmpanyList.list" :key="index" :value="item.id" :label="item.companyName">
                         </el-option>
                    </el-select> -->
                    <el-select v-model="baseInfo.ourSignBody" v-show="!pre" placeholder="请选择">
                        <el-option
                                v-for="item in companyList.listAva"
                                :key="item.id"
                                :label="item.companyName"
                                :value="item.id">
                        </el-option>
                        <!-- <el-option  v-for="(item,index) in companyList.list" :key="index" :value="item.id" :label="item.companyName">
                         </el-option> -->
                    </el-select>
                <!-- <el-input  v-model="baseInfo.ourSignBody" v-show="!pre" placeholder="请输入"></el-input> -->
            </el-form-item>
            <el-form-item label="主体地位" size="medium" prop="ourBodyPosition">
                <previewInfo :visible="pre" :info="bodyPos.obj[baseInfo.ourBodyPosition]"></previewInfo>
                <el-select  v-show="!pre" v-model="baseInfo.ourBodyPosition" placeholder="请选择">
                        <el-option
                        v-for="item in bodyPos.list"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select> 
            </el-form-item>
         </div>
         <div class="form_content" v-for="(item,index)  in baseInfo.list" :key="index">
            <el-form-item label="相对方" size="medium" prop="counterpart">
                <previewInfo :visible="pre" :info="item.counterpart"></previewInfo> 
                <el-input  v-model.trim="item.counterpart" v-show="!pre" placeholder="请输入"></el-input>
                <i class="iconfont  pointer icon-minus-circle"   v-show="index != 0 && !pre" @click.stop="deleteM(index)"></i>
            </el-form-item>
            <el-form-item label="主体地位" size="medium" prop="counterpartBodyPosition">
                <previewInfo :visible="pre" :info="bodyPos.obj[item.counterpartBodyPosition]"></previewInfo> 
                <el-select  v-show="!pre" v-model="item.counterpartBodyPosition" placeholder="请选择">
                        <el-option
                        v-for="item in bodyPos.list"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select> 
            </el-form-item>
         </div>
         <div class="add" v-show="!pre"> 
            <addButton @add="add"></addButton>
         </div>
        <editBtn :isPre.sync="pre" @change="changeEdit"></editBtn> 
         <div class="btns" v-show="!pre">
             <span class="submit pointer" @click.stop="store">保存</span>
             <!-- <span class="cancle pointer">取消</span> -->
         </div>
     </el-form>
 </div>   
</template>

<script>
import previewInfo from "../../components/previewInfo"
import addButton from "../../components/addButton"
import editBtn from "./editBtn"
export default {
    name : "contractSignBody",
    components:{previewInfo,addButton,editBtn},
    data(){return{
        type : 'preview'
    }},
    
    computed:{
        baseInfo(){
            return this.$store.state.contract.signBodyInfo;
        },
        companyList(){
            return this.$store.state.selectData.allCompanyList;
        },
        rules(){
            return this.$store.state.contract.signBodyInfoRules;
        },
        pre:{
            get : function(){
                return this.type == 'preview';
            },
            set : function(newValue){
                    this.type = newValue ? 'preview' : 'edit';
            }
        },
        bodyPos(){
            return this.$store.state.selectData.body_position;
        }
    },
    created(){
      this.$store.dispatch('getAllCompanyList'); //获取所有公司
    },
    methods:{
        add(){
            if(this.$store.state.contract.signBodyInfo.list.length > 3){
             this.$message.error('最多添加至4个')
            }else{
                this.$store.state.contract.signBodyInfo.list.push({
                    counterpart	: "", //	对方签约主体,
                    counterpartBodyPosition:	""//	对象主体地位d
                })
            }
                
        },
        changeEdit(){
            if(!this.companyList.obj[this.baseInfo.ourSignBody]){
                this.$store.state.contract.signBodyInfo.ourSignBody = '';
            }
        },
        changeBaseInfo(){
            if(this.baseInfo.ourSignBody){
                this.$store.state.contract.signBodyInfo.ourSignBodyName =   this.companyList.obj[this.baseInfo.ourSignBody];
                if(this.companyList.objAva[this.baseInfo.ourSignBody].status == 'N'){
                    this.$store.state.contract.signBodyInfo.ourSignBody = '';
                }
            }
        },
        deleteM(i){
            this.$store.state.contract.signBodyInfo.list.splice(i,1);
        },
        store(){
             this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$api.contractAdminSignBodyAddOrEdit(this.baseInfo).then(obj=>{
                        this.$message({
                            message: '签约主体修改完成',
                            type: 'success'
                        });
                        this.pre = 'preview';
                        this.$store.dispatch('getContractInfo',{tab :1});
                    })
                }
        })
        }
    }
}
</script>

<style lang="scss" coped>
@import "../../assets/css/common.scss";
@import "./common.scss";
    .contractSingBody{
        padding: 28px  0 28px 50px;
        .el-input, .el-select{
            width: 500px;
        }
        .el-form-item{
            width: 614px;
            padding-right: 30px;
            // display: inline-block;
            margin-right: 80px;
        }
        .form_content{
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
        }
        .add{
            width:500px;
            height:36px;
            margin-left: 114px;
            margin-bottom: 20px;
        }
        .icon-minus-circle{
           font-size: 20px;
           color:$red_c;
           border: none;
           position: absolute;
           right: -30px;
           top: 0px;
        }
    }

</style>
