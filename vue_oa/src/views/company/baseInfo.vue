<template>
<div class="baseInfo companyCommon ">
    <el-form ref="form" class="formInline" size="medium" :rules="rules" :model="baseInfo" label-width="114px">
        <el-form-item label="银行账户是否开立" size="medium" >
            <previewInfo :visible="pre" :info="children.obj[baseInfo.isOpenAccount]"></previewInfo> 
            <el-radio  v-show="!pre" v-model="baseInfo.isOpenAccount" label="Y">是</el-radio>
            <el-radio v-show="!pre"  v-model="baseInfo.isOpenAccount" label="N">否</el-radio>
        </el-form-item>
        <el-form-item label="银行信息" size="medium" prop="bankInfo" >
            <previewInfo :visible="pre" :info="baseInfo.bankInfo"></previewInfo>
            <el-input    v-show="!pre" v-model.trim="baseInfo.bankInfo" placeholder="请输入银行信息"></el-input>
        </el-form-item>
        <el-form-item label="账户信息" size="medium"  prop="accountInfo">
            <previewInfo :visible="pre" :info="baseInfo.accountInfo"></previewInfo>
            <el-input    v-show="!pre" v-model.trim="baseInfo.accountInfo" placeholder="请输入账户信息"></el-input>
        </el-form-item>
        <el-form-item label="秘书公司" size="medium"  prop="secretaryCompany">
            <previewInfo :visible="pre" :info="baseInfo.secretaryCompany"></previewInfo>
            <el-input    v-show="!pre" v-model.trim="baseInfo.secretaryCompany" placeholder="请输入秘书公司"></el-input>
        </el-form-item>
        <el-form-item label="是否有子母公司" size="medium"    >
            <previewInfo :visible="pre" :info="children.obj[baseInfo.isRelationCompany]"></previewInfo>
            <el-radio  v-show="!pre" v-model="baseInfo.isRelationCompany" label="Y">是</el-radio>
            <el-radio  v-show="!pre" v-model="baseInfo.isRelationCompany" label="N">否</el-radio>
        </el-form-item>
       <el-form-item :label="`监事${num[index + 1]}`" size="medium" v-for="(item,index) in baseInfo.supervisorOne" v-show="item" :key="`one_${index}`">
            <previewInfo :visible="pre" :info="item.value"></previewInfo>
            <el-input   v-show="!pre"  v-model.trim="item.value" :placeholder="`请输入监事${num[index + 1]}`"></el-input>
            <i class="iconfont  pointer icon-plus-circle"  v-show="!pre" @click.stop="add('supervisorOne')"></i>
            <i class="iconfont  pointer icon-minus-circle" v-show="index != 0 && !pre" @click.stop="dele('supervisorOne',index)"></i>
        </el-form-item>
       <!-- <el-form-item :label="`监事${num[index + 1]}`" size="medium" v-for="(item,index) in baseInfo.supervisorTwo" v-show="item" :key="`two_${index}`">
            <previewInfo :visible="pre" :info="item.value"></previewInfo>
            <el-input   v-show="!pre"  v-model="item.value" :placeholder="`请输入监事${num[index + 1]}`"></el-input>
            <i class="iconfont  pointer icon-plus-circle"  v-show="!pre" @click.stop="add('supervisorTwo')"></i>
            <i class="iconfont  pointer icon-minus-circle" v-show="index != 0 && !pre" @click.stop="dele('supervisorTwo',index)"></i>
        </el-form-item> -->
       <el-form-item :label="`董事${num[index + 1]}`" size="medium" v-for="(item,index) in baseInfo.director" v-show="item" :key="`dir_${index}`">
            <previewInfo :visible="pre" :info="item.value"></previewInfo>
            <el-input   v-show="!pre"  v-model.trim="item.value" :placeholder="`请输入董事${num[index + 1]}`"></el-input>
            <i class="iconfont  pointer icon-plus-circle"  v-show="!pre" @click.stop="add('director')"></i>
            <i class="iconfont  pointer icon-minus-circle" v-show="index != 0 && !pre"   @click.stop="dele('director',index)"></i>
        </el-form-item>
        <el-form-item label="总经理" size="medium"  prop="generalManager">
            <previewInfo :visible="pre" :info="baseInfo.generalManager"></previewInfo>
            <el-input  v-show="!pre"   v-model.trim="baseInfo.generalManager" placeholder="请输入总经理"></el-input>
        </el-form-item>
        <div class="btns" v-show="!pre">
            <span class="submit pointer" @click="submit('form')" >保存</span>
        </div>
    </el-form>
    
            <editBtn :isPre.sync="pre">

            </editBtn> 
</div>   
</template>

<script>
import previewInfo from "../../components/previewInfo"
import editBtn from "./editBtn"
export default {
    name : 'baseInfo',
    data(){return{
        type : 'preview',
        supervisorOne : [],
        supervisorTwo : [],
        director : [],
        num : {
            1 : '一',
            2 : '二',
            3 : '三',
            4 : '四',
            5 : '五',
            6 : '六',
            7 : '七',
            8 : '八',
            9 : '九',
            10 : '十'
        }
    }},
    computed:{
        pre:{
            get : function(){
                return this.type == 'preview';
            },
            set : function(newValue){
                    this.type = newValue ? 'preview' : 'edit';
            }
        },
        baseInfo(){
            return this.$store.state.company.otherBaseInfo;
        },
        rules(){
            return this.$store.state.company.otherInfoRules;
        },
        children(){
            return this.$store.state.selectData.trueFlase;
        }
    },
   components : {previewInfo,editBtn},
    methods:{
        submit(formName){
             this.$refs[formName].validate((valid) => {
                if (valid) {
                    let base = Object.assign({},this.baseInfo);
                    let arr = [];
                    let arr1 = [];
                    base.supervisorOne.forEach((v)=>{
                        arr.push(v.value);
                    })
                    base.supervisorOne = JSON.stringify(arr);
                    base.director.forEach((v)=>{
                        arr1.push(v.value);
                    })
                    base.director = JSON.stringify(arr1);
                    this.$api.companyEditBase(base).then(obj=>{
                         this.$message({
                            message: '信息修改成功',
                            type: 'success'
                        });
                        this.type = 'preview';
                        this.$store.dispatch('getCompanyInfo',{tab :0});
                    })
                }
        })
        },
        add(v){
            if(this.$store.state.company.otherBaseInfo[v].length > 9){
                this.$message.error('最多添加10个');
            }else{
                this.$store.state.company.otherBaseInfo[v].push({value : ''});
            }
        },
        dele(v,i){
            this.$store.state.company.otherBaseInfo[v].splice(i,1);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
@import "./common.scss";
.baseInfo{
    position: relative;
    padding: 32px 40px 25px 40px;
}
.el-input{
    width: 500px;
}
.el-form-item{
     width: 614px;
     margin-right: 150px;
}
.icon-plus-circle{
    font-size: 20px;
    color: $icon_g;
    border: none;
    position: absolute;
    right: -30px;
    top: 0px;
}
.icon-minus-circle{
    font-size: 20px;
    color:$red_c;
    border: none;
    position: absolute;
    right: -56px;
    top: 0px;
}
</style>
