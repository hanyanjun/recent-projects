<template>
    <div class="contractFile">
        <div class="content">
            <i :class="['iconfont', baseInfo.contractUrl ? 'icon-pdf-shangchuan' : 'icon-pdf']"></i>
            <h6 class="page" v-show="file.totalPage">共{{file.totalPage}}页</h6>
            <h6 :class="['title',{'title1' : !file.totalPage}]" v-show="file.totalPage">{{fileRealName}} <span class="size" v-show="file.size">（{{file.size}}）</span></h6>
            <h6 class="rebtns">
                <button class="reFtp pointer" @click.stop="reUpload">{{baseInfo.contractUrl || f ?'重新上传' : '点击上传'}}</button>
                <button  @click.stop="prePdf" 
                class="pointer pre" 
                v-if="fileRealPath">
                预览合同</button>
                <button class="pointer pre" @click.stop="downFile"   v-if="fileRealPath">{{fileRealName}} 下载</button>
            </h6>
        </div>
        <div class="btns" >
            <span class="submit pointer" @click.stop="store" >保存</span>
            <!-- <span class="cancle pointer">取消</span> -->
        </div>
        <input type="file" style="display:none" @change="change" ref="uploadFile">
    </div>
</template>

<script>
export default {
   name : 'contractFile',
   data(){{return{
        file : {
            name : '',
            filePath : '',
            size : '',
            totalPage : ''
        },
        pdf : '',
        f : ''
   }}},
   computed:{
      params(){
          return this.$store.state.contract.params || 0;
      },
      baseInfo(){
          return this.$store.state.contract.adBaseInfo;
      },
      fileRealPath(){
          return this.file.filePath || this.baseInfo.contractUrl;
      },
      fileRealName(){
          return this.detailFilePath(this.file.filePath || this.baseInfo.contractUrl);
      }
   },
   methods:{
       prePdf(){
           this.$store.dispatch('gainFileBlob',{url : `/admin/file/download/file?filePath=${encodeURIComponent(this.fileRealPath)}` , sign : {'filePath' : this.fileRealPath} }).then(obj=>{
               var reader = new FileReader();
               reader.readAsDataURL(obj);
               reader.onload = (e)=>{ 
                   let result = reader.result;
                   this.$showPDF(result);
               }
           })
       },
       downFile(){
           let name = '合同.pdf';
           if(this.fileRealName){
               name = this.fileRealName + '.pdf';
           }
            this.$store.dispatch('downFile',{type : 'get', url : ` /admin/file/download/file` ,  data : {filePath : this.fileRealPath} , fileName : name });
       },
       detailFilePath(path){
           if(!path) return '';
           var arr = path.split('/');
           if( !arr[3]) return path;
           if(/_/g.test(arr[3])){
               let str = arr[3];
               let arr1 = str.split('_');
               arr[3] = arr1[1];
               let str3 = arr1[0].replace(/\^/g,'/')
               let arr2 = (this.$util.b64DecodeUnicode(str3)).split('.');
               return arr2[0];
           }
       },
       reUpload(){
           this.$refs.uploadFile.click();
       },
       change(e){
           let target = e.target || e.srcElement;  
           let f = target.files[0];
           target.value = '';
           if(f){
            let size = f.size/1024/1024;
            let name = f.name;
            if(size > 2 ){
                this.$message.error('文件大小需在2M内！');
            }else{
                if(this.fileType(f.name) != 'pdf'){
                    this.$message.error("文件必须是pdf格式");
                }if(name.length > 54){
                    this.$message.error("文件名不能大于50个字符");
                }else{   
                        this.f = f;
                        let src = window.URL.createObjectURL(f);
                        let formData = new FormData();
                        formData.append('file', f);
                        let type = this.fileType(name);
                        this.$store.dispatch("uploadFile",{type : 'inrecoag' , formData : formData , showName : 'Y'}).then(obj=>{
                                this.file = Object.assign({},obj.data.data);
                                //TODO 需继续请求 添加文件的接口
                        })
                }
                }
           }
       },
        fileType(item){
            if(!item) return '';
            let type = item.slice(item.lastIndexOf(".")+1).toLowerCase();
            if(/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(type)){
                return 'img';
            }
            return type;
        },
       store(){
           if(this.file.filePath){
            this.$api.contractAdminFileAddOrEdit({conId : this.params.id, contractUrl : this.file.filePath}).then(obj=>{
                this.$store.state.contract.adBaseInfo.contractUrl = this.file.filePath;
                this.$message({
                    message: '保存成功',
                    type: 'success'
                });
            })
           }else{
               this.$message.error('请先上传文件!');
           }
       }
   }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.content{
    width:610px;
    height:144px;
    background:#fbfdff;
    border-radius:5px;
    border: 1px solid $gray_f1;
    margin: 13px 0 0 40px;
    padding-right: 10px;
    text-align: center;
    .iconfont{
        display: block;
        margin-top: 20px;
        font-size: 30px;
        color: #8592a5;
    }
    .icon-pdf-shangchuan{
        color: #ce5453; 
    }
    .page{
        font-size:12px;
        color:rgba(193,197,205,1);
        line-height: 1;
        margin: 8px 0 10px;
    }
    .title{
        font-size:14px;
        color:rgba(102,102,102,1);
        font-weight: normal;
        .size{
            font-size:12px;
            color: #d4d8de;
        }
    }
    .title1{
        margin-top:8px;
    }
    .rebtns{
        margin-top: 10px;
        button{
            min-width:70px;
            padding: 0 10px;
            box-sizing: border-box;
            background:rgba(255,255,255,1);
            border-radius:2px;
            color: #9b9fa6;
            border: 1px solid #9b9fa6;
            line-height: 1.2;
            margin-bottom: 6px;
        }
        .pre{
            margin-left: 20px;
        }
    }
}
.preview{
    display: inline-block;
    width: 500px;
    height: 500px;
}
</style>
