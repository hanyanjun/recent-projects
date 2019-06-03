<template>
 <div class="contractPayDetail formInline">
     <el-form ref="form"  size="medium" :model="baseInfo" label-width="114px">
        <div class="content">
             <el-form-item label="我方签约主体" size="medium" prop="ourSignBody">
             {{changeBaseInfo()}}
            <previewInfo :visible="pre" :info="baseInfo.ourSignBodyName"></previewInfo> 
            <!-- <el-input  v-model="baseInfo.ourSignBody" v-show="!pre" placeholder="请输入"></el-input> -->
            <el-select v-model="baseInfo.ourSignBody"  v-show="!pre" placeholder="请选择">
                        <el-option  v-for="(item,index) in cpmpanyList.list" :key="index" :value="item.id" :label="item.companyName">
                         </el-option>
                    </el-select>
        </el-form-item>
        <el-form-item label="主体地位" size="medium" prop="ourBodyPosition">
            <previewInfo :visible="pre" :info="bodyPos.obj[baseInfo.ourBodyPosition]"></previewInfo> 
            <!-- <el-input  v-model="baseInfo.ourBodyPosition" v-show="!pre" placeholder="请输入"></el-input> -->
             <el-select  v-show="!pre" v-model="baseInfo.ourBodyPosition" placeholder="请选择">
                        <el-option
                        v-for="item in bodyPos.list"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select> 
        </el-form-item>
        <el-form-item label="授权代表 " size="medium" prop="ourAuthDeputy">
            <previewInfo :visible="pre" :info="baseInfo.ourAuthDeputy"></previewInfo> 
            <el-input  v-model.trim="baseInfo.ourAuthDeputy" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="签署日期" size="medium" prop="swiftCode">
            <previewInfo :visible="pre" :info="baseInfo.ourSignDate"></previewInfo> 
             <el-date-picker
                  v-model="baseInfo.ourSignDate"
                  type="date"
                  v-show="!pre" 
                  value-format="yyyy/MM/dd">
             </el-date-picker>
            <!-- <el-input  v-model="baseInfo.ourSignDate" v-show="!pre" placeholder="请输入"></el-input> -->
        </el-form-item>
         <el-form-item label="甲方地址 " size="medium" prop="partyAAddress">
            <previewInfo :visible="pre" :info="baseInfo.partyAAddress"></previewInfo> 
            <el-input  v-model.trim="baseInfo.partyAAddress" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="甲方收件人" size="medium" prop="partyAAcceptPerson">
            <previewInfo :visible="pre" :info="baseInfo.partyAAcceptPerson"></previewInfo> 
            <el-input  v-model.trim="baseInfo.partyAAcceptPerson" v-show="!pre" placeholder="请输入"></el-input>
        </el-form-item>
        </div>
        <template v-for="(item,index) in baseInfo.details">
            <div class="content" :key="index">
                <el-form-item label="相对方" size="medium" prop="counterpart" :key="`${index}-counterpart`">
                <previewInfo :visible="pre" :info="item.counterpart"></previewInfo> 
                <el-input  v-model.trim="item.counterpart" v-show="!pre" placeholder="请输入"></el-input>
                <i class="iconfont  pointer icon-minus-circle"  v-show="index != 0 && !pre" @click.stop="deleteM(index)"></i>
            </el-form-item>
            <el-form-item label="主体地位" size="medium" prop="counterpartBodyPosition" :key="`${index}-counterpartBodyPosition`">
                <previewInfo :visible="pre" :info="bodyPos.obj[item.counterpartBodyPosition]"></previewInfo> 
                <el-select  v-show="!pre" v-model="item.counterpartBodyPosition" placeholder="请选择">
                        <el-option
                        v-for="item in bodyPos.list"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select> 
                <!-- <el-input  v-model="item.counterpartBodyPosition" v-show="!pre" placeholder="请输入"></el-input> -->
            </el-form-item>
            <el-form-item label="签署人" size="medium" prop="signPerson" :key="`${index}-signPerson`">
                <previewInfo :visible="pre" :info="item.signPerson"></previewInfo> 
                <el-input  v-model.trim="item.signPerson" v-show="!pre" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="授权代表" size="medium" prop="counterpartAuthDeputy" :key="`${index}-counterpartAuthDeputy`">
                <previewInfo :visible="pre" :info="item.counterpartAuthDeputy"></previewInfo> 
                <el-input  v-model.trim="item.counterpartAuthDeputy" v-show="!pre" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" size="medium" prop="partyBContact" :key="`${index}-partyBContact`">
                <previewInfo :visible="pre" :info="item.partyBContact"></previewInfo> 
                <el-input  v-model.trim="item.partyBContact" v-show="!pre" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="签署日期" size="medium" prop="counterpartSignDate" :key="`${index}-counterpartSignDate`">
                <previewInfo :visible="pre" :info="item.counterpartSignDate"></previewInfo> 
                <el-date-picker
                    v-model="item.counterpartSignDate"
                    type="date"
                    v-show="!pre" 
                    value-format="yyyy/MM/dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="乙方地址" size="medium" prop="partyBAddress" :key="`${index}-partyBAddress`">
                <previewInfo :visible="pre" :info="item.partyBAddress"></previewInfo> 
                <el-input  v-model.trim="item.partyBAddress" v-show="!pre" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="乙方收件人" size="medium" prop="partyBAcceptPerson" :key="`${index}-partyBAcceptPerson`">
                <previewInfo :visible="pre" :info="item.partyBAcceptPerson"></previewInfo> 
                <el-input  v-model.trim="item.partyBAcceptPerson" v-show="!pre" placeholder="请输入"></el-input>
            </el-form-item>
            </div>
        </template>
        <div class="add" style="margin-top:30px" v-show="!pre"> 
            <addButton @add="add"></addButton>
         </div>
        <div class="intro">
            
            <el-form-item label="介绍人" size="medium" prop="introducer">
                    <previewInfo :visible="pre" :info="baseInfo.introducer"></previewInfo> 
                    <el-input  v-model.trim="baseInfo.introducer" v-show="!pre" placeholder="请输入"></el-input>
            </el-form-item>
        </div>
     </el-form>
     <div class="btns" v-show="!pre">
         <span class="submit pointer" @click.stop="submit('form')">提交</span>
         <!-- <span class="cancle pointer">取消</span> -->
     </div>
     
    <editBtn :isPre.sync="pre"  @change="changeEdit"></editBtn>  

 </div>   
</template>

<script>
import previewInfo from "../../components/previewInfo"
import addButton from "../../components/addButton"
import editBtn from "./editBtn"
export default {
  name : "busTab1",
  components:{previewInfo,editBtn,addButton},
  data(){return {
      type : "preview"
  }},
  computed:{
      baseInfo(){
          return this.$store.state.contract.busSignInfo;
      },
      bodyPos(){
          return this.$store.state.selectData.body_position;
      },
      cpmpanyList(){
          return this.$store.state.selectData.allCompanyList;
      },
      pre:{
         get : function(){
            return this.type == 'preview';
         },
         set : function(newValue){
                this.type = newValue ? 'preview' : 'edit';
         }
      }
  },
  created(){
      this.$store.dispatch('getAllCompanyList'); //获取所有公司
  },
  methods:{
      add(){
        if(this.$store.state.contract.busSignInfo.details.length > 3){
            this.$message.error('最多添加至4个')
        }else{
            this.$store.state.contract.busSignInfo.details.push({	
                    counterpart	: '',
                    counterpartAuthDeputy	: '',
                    counterpartBodyPosition: '',
                    counterpartSignDate	: '',
                    partyBAcceptPerson: '',
                    partyBAddress: '',
                    partyBContact	: '',
                    signPersionContact: '',
                    signPerson: '',
                })
        }
        
      },
      changeEdit(){
            if(!this.cpmpanyList.obj[this.baseInfo.ourSignBody]){
                this.$store.state.contract.busSignInfo.ourSignBody = '';
            }
      },
        changeBaseInfo(){
            if(this.baseInfo.ourSignBody){
                this.$store.state.contract.busSignInfo.ourSignBodyName =   this.cpmpanyList.obj[this.baseInfo.ourSignBody];
                if(this.cpmpanyList.objAva[this.baseInfo.ourSignBody].status == 'N'){
                    this.$store.state.contract.busSignInfo.ourSignBody = '';
                }
            }
        },
      deleteM(i){
          this.$store.state.contract.busSignInfo.details.splice(i,1);
      },
      submit(formName){
        this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$api.signEditBusInfo(this.baseInfo).then(obj=>{
                        this.$message({
                            message: '签署信息修改成功',
                            type: 'success'
                        });
                        this.pre = 'preview';
                        this.$store.dispatch('getBusContractInfo',{tab :1});
                    })
                }
        })
      },
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
@import "./common.scss";
.contractPayDetail{
    padding: 28px  50px ;
    .el-input, .el-select{
       width: 500px;
    }
    .el-form-item{
       width: 614px;
       padding-right: 30px;
       // display: inline-block;
       margin-right: 80px;
    }
}

.icon-minus-circle{
   font-size: 20px;
   color:$red_c;
   border: none;
   position: absolute;
   right: -30px;
   top: 0px;
}

.add{
    width:500px;
    height:36px;
    margin-left: 114px;
}
.content{
    margin-top: 30px;
    box-shadow:0px 0px 5px 0px rgba(221,221,221,0.8);
    padding: 30px 30px 8px 30px;
    // border: 1px solid $gray_d1;
    // border-radius: 5px;
    // box-shadow: 
    // border-left: 1px dotted $gray_b;
}
.intro{
    margin-top: 20px;
}
</style>
