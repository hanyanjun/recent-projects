<template>
 <el-dialog class="largeDialog" :title="title" :visible.sync="visibleE" @close="close" width='570px'>
    <template v-if="!isUpload">
      <el-row class="btnDiv">
            <el-button class="selectBtn" size="small" type="primary"  @click="uploadFile()">选取文件</el-button>
            <input type="file" @change="importFile" ref="imFile" style="display: none"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
            <el-button class="loadBtn" type="text" @click.stop="xzmb">下载导入模板</el-button>
      </el-row>
      <el-row>
          <el-col :span="24">
            <div class="con" v-if="type=='question' ? true : false">
              <p class='firstP'>上传提示</p>
              <p>1.一次最多添加1000题;</p>
              <p>2.支持WPS、excel2003以上版本文件;</p>
              <p>3.请不要加密模板文件，将导致错误;</p>
              <p>4.请不要上传带宏的文件，将导致错误;</p>
              <p>5.请不要过多的使用格式，如背景色和边框，将可能导致超时;</p>
              <p>6.内容设置为文本格式;</p>
              <p>7.请按照示例行的格式填写内容，填写后请删除示例数据。</p>
            </div>
        </el-col>
      </el-row>
    </template>
</el-dialog>
</template>

<script>
import {mapState} from "vuex"
import core from "../../api/core.js"
export default {
    name : 'leadingFile',
    props : {
        visible : false,
        type:'',
    },
    data(){return{
        title:'',
        imgAction:'/admin/batch/import/employee',
        fileList30 : [],
        isUpload : false,
        isActive : false,
        visibleE : false,
        currentFile : {},
        label : []
    }},
    computed:{
        ...mapState({
            headers : state => state.auth
        }),
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
        }
      }
    },
    created(){
      switch(this.type){
        case 'question':
          this.title = '导入考试试题'
        break;
        case 'annual':
          this.title = '导入员工假期'
        break;
      }
    },
    methods:{
      // 下载完成 读取文件里面的title
      xzmb(){
        // 下载模板文件接口
        this.$store.dispatch('downFile',{url : '/admin/exam/quesBank/download/empTem', fileName :'试题模板.xls'})
      },
      uploadFile(){
        this.$refs.imFile.click()
        this.clear();
      },
      clear(){
        this.label = [];
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
        // 导入接口
        this.$http.post('/admin/ques/import/ques', from , config).then(obj=>{
          // 预览
          //  this.isUpload = true;
          //  this.tableData = obj.data.data.emps;
          //  let illMsg = obj.data.data.illMsg;
          //  if(illMsg.length == 0) return ;
          //  this.$message.error(illMsg.join(';'));
          //  更新table
          // this.$message({
          //   message: '导入成功',
          //   type: 'success'
          // });
          this.isUpload = false;
          this.$emit('submit',obj.data.data);
        })
      },
      importFile: function (e){ // 导入excel
        let obj = this.$refs.imFile
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
  margin: 12px 0 15px;
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
.firstP{
  font-weight: bold;
  margin-bottom: 10px
}
</style>
