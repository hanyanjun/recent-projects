<template>
 <el-dialog class="largeDialog"   title="导入员工数据" :visible.sync="visibleE" @close="close" :width="widthpx">
    <template v-if="!isUpload">
      <p style="font-weight: bold;margin-bottom: 10px; padding-left: 22px; color: #e2706f;">注：请按照入职日期从小到大创建员工账号，顺序会影响员工工号的生成!</p>
      <el-row class="btnDiv">
            <el-button class="selectBtn" size="small" type="primary"  @click.stop="uploadFile">选取文件</el-button>
            <input type="file" @change.stop="importFile" ref="imFile" style="display: none"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
            <el-button class="loadBtn" type="text" @click.stop="xzmb">下载导入模板</el-button>
      </el-row>
      <el-row>
          <el-col :span="24">
            <div class="con">
              <!-- 修改1 -->
              <p style="font-weight: bold;margin-bottom: 10px">上传提示</p>
              <p>1.请将导入的内容设置为文本格式;</p>
              <p>2.请按照示例行的格式填写内容，填写后请删除示例数据。其中姓名、手机国际区号、手机号，入职日期，职位为必填项;</p>
              <p>3.一次最多添加1000名员工，可添加部分员工信息;</p>
              <p>4.支持WPS、excel2003以上版本文件;</p>
              <p>5.请将要上传的内容放在第一个sheet中;</p>
              <p>6.请不要加密模板文件，将导致错误;</p>
              <p>7.请不要上传带宏的文件，将导致错误;</p>
              <p>8.请不要过多的使用格式，如背景色和边框，将可能导致超时。</p>
            </div>
            <!-- <div class="con">
              <p> 格式说明：</p>
              <p>部门编码：必须是系统里已存在的部门编码，否则会报错</p>
              <p> 开户行：至少给出总行名字，最好细化到支行</p>
            </div> -->
        </el-col>
      </el-row>
    </template>
    <template v-else>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            type="index">
          </el-table-column>
          <template v-for="(item,key) in staticData">
            <el-table-column
              :prop="key"
              :label="item"
              width="180">
            </el-table-column>
          </template>
        </el-table>
        <el-row style="margin-top:20px;">
        发送激活短信
        <el-switch
          v-model="isActive"
          active-color="#13ce66">
        </el-switch>
        </el-row>
        <div class="bottom">
            <el-button size="medium" type="primary" @click.stop="confirmEntry">确认导入</el-button>
            <el-button size="medium" @click.stop="cancle">取消</el-button>
        </div>
    </template>
</el-dialog>
</template>

<script>
import {mapState} from "vuex"
import core from "../../api/core.js"
export default {
    name : 'leadingFile',
    props : {
        visible : false
    },
    data(){return{ 
        imgAction:'/admin/batch/import/employee',
        fileList30 : [],
        isUpload : false,
        isActive : false,
        visibleE : false,
        currentFile : {},
        tableData : [],
        label : [],
        widthpx: '570px'
    }},
    computed:{
        ...mapState({
            headers : state => state.auth
        }),
        staticData(){
          return this.$eData.employee;
        }
    },
    watch: {
      'visible': function(v) {
        this.visibleE = v;
      },
      visibleE: function(v){
        if(v){
          this.isUpload = false;
        }
      },
      isUpload: function(v){
        if(v){
          this.isActive = false;
        }else{
         this.widthpx = '570px'
        }
      }
    },
    methods:{
      // 下载完成 读取文件里面的title
       xzmb(){
        // 下载模板文件
        this.$store.dispatch('downFile',{url : '/admin/file/download/empTem', fileName :'新增员工模板.xls'})
      },
      uploadFile(){
          this.$refs.imFile.click();
          this.clear();
      },
      cancle(){
          this.isUpload = false;
          this.clear();
      },
      clear(){
          this.label = [];
          this.tableData = [];
          this.currentFile = {};
      },
      close(){
        this.$emit("update:visible",false);
      },
      entryFile(f){
        let from = new FormData();
        from.append('file', f);
        let config = {
          headers:{
              'Content-Type':'multipart/form-data'
            }
        }
        this.$http.post('/admin/batch/import/employee', from , config).then(obj=>{
           this.isUpload = true;
           this.widthpx = '1000px'
           this.tableData = obj.data.data.emps;
           let illMsg = obj.data.data.illMsg;
           if(illMsg.length == 0) return ;
           this.$message.error(illMsg.join(';'));
        })
        
      },
      confirmEntry(){
        core.batchImport({	emps : this.tableData , isSendMsg : this.isActive ? 'Y' : 'N'}).then(obj=>{
          this.$message({
            message: '导入成功',
            type: 'success'
          });
          this.clear();
          this.isUpload = false;
          this.$emit('submit');
        })
      },
      importFile: function (e){ // 导入excel
      // alert(3);
        let obj = this.$refs.imFile
        // console.log(obj.files[0]);
        if (!obj.files) {
          return
        }
        var f = obj.files[0];
        if(f){
          this.currentFile = Object.assign({},f);
          let target = e.target || e.srcElement;  
          target.value = '';
          this.entryFile(f);
        }
      }
    }


}
</script>

<style lang="scss" scoped>
.con{
    font-size: 12px;
    padding: 20px;
    line-height: 24px;
}
.bottom{
  text-align: center;
  margin: 30px 0;
}
.btnDiv{
  margin: 26px 0 15px;
}
.selectBtn{
  width: 320px;
  font-size: 16px;
  height: 42px;
  margin: 0 12px 0 20px;
}
.loadBtn{
  font-size:16px;
  color: #35A8FB;
  border: 1px solid #35A8FB;
  width: 150px;
}
</style>
