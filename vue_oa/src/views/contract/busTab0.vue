<template>
    <div class="contractFile">
        <div class="content">
            <span class="type">合同文件</span>
            <div class="con">
                <i :class="['iconfont', baseInfo.contractBusinessFile ? 'icon-pdf-shangchuan' : 'icon-pdf']"></i>
                <h6 class="page" v-show="file.totalPage">共{{file.totalPage}}页</h6>
                <h6 :class="['title',{'title1' : !file.totalPage}]" v-show="file.name">{{file.name}} <span class="size" v-show="file.size">（{{file.size}}）</span></h6>
                <h6 class="rebtns">
                    <button class="reFtp pointer" @click.stop="reUpload">{{baseInfo.contractBusinessFile || f ?'重新上传' : '点击上传'}}</button>
                    <button  @click.stop="prePdf" 
                        class="pointer pre" 
                        v-if="baseInfo.contractBusinessFile || this.file.filePath">
                        预览合同</button>
                </h6>
            </div>
        </div>
        <div class="content">
            <span class="type type1">补充协议</span>
            <div class="conUp">
                <uploadImg :list.sync="list" canvasType="base" :size="2">



            </uploadImg>
            </div>
        </div>
        <div class="btns" >
            <span class="submit pointer" @click.stop="store" >保存</span>
        </div>
        <input type="file" style="display:none" @change="change" ref="uploadFile">
    </div>
</template>

<script>
import uploadImg from "./uploadImg.vue";
export default {
   name : 'contractFile',
   components:{uploadImg},
   data(){{return{
        file : {
            name : '',
            filePath : '',
            size : '',
            totalPage : ''
        },
        pdf : '',
        f : '',
        list :[]
   }}},
   computed:{
      baseInfo : {
          get : function(){
              this.list = this.$store.state.contract.busBaseInfo.contractBusinessPic; 
              return this.$store.state.contract.busBaseInfo;
          },
          set : function(newValue){
              
          },
      },
      params(){
         return this.$store.state.contract.params;
      }
   },
   methods:{
       prePdf(){
           let path = this.file.filePath || this.baseInfo.contractBusinessFile;
           this.$store.dispatch('gainFileBlob',{url : `/admin/file/download/file?filePath=${path}`  , sign :  {'filePath' : path}}   ).then(obj=>{
            //    this.$showPDF(obj);
               var reader = new FileReader();
               reader.readAsDataURL(obj);
               reader.onload = (e)=>{ 
                   this.$showPDF(reader.result);
               }
           })
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
            }else if(this.fileType(f.name) != 'pdf'){
                    this.$message.error("文件必须是pdf格式");
            }else{
                this.f = f;   
                let src = window.URL.createObjectURL(f);
                let formData = new FormData();
                formData.append('file', f);
                this.$store.dispatch("uploadFile",{type : 'inrecoag' , formData : formData}).then(obj=>{
                    this.file.name = name;
                    Object.assign(this.file,obj.data.data);
                })
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
           if(this.file.filePath || this.list.length > 0 || this.baseInfo.contractBusinessPic){
            this.$api.annexBusInfo({contractid : this.params.id, contractBusinessFile : this.file.filePath || this.baseInfo.contractBusinessFile , contractBusinessPic : this.list }).then(obj=>{
                this.$store.state.contract.busBaseInfo.contractUrl = this.file.filePath;
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
@import "./common.scss";
.content{
     margin: 25px 0 25px 40px;
     position: relative;
     .type{
        display: inline-block;
        height:14px;
        line-height: 14px;
        font-size:14px;
        color:rgba(102,102,102,1);
        margin-right: 44px;
     }
     .type1{
        position: absolute;
        left: 0;
        top: 0;

     }
    .con{
        width:610px;
        height:144px;
        background:#fbfdff;
        border-radius:5px;
        border: 1px solid $gray_f1;
        text-align: center;
        display: inline-block;
        vertical-align: top;
    }
    .conUp{
        display: inline-block;
        vertical-align: top;
        padding-left: 100px;
    }
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
    .rebtns{
        margin-top: 10px;
        button{
            width:70px;
            height:20px;
            background:rgba(255,255,255,1);
            border-radius:2px;
            color: #9b9fa6;
            border: 1px solid #9b9fa6;
        }
        .reFtp{
            margin-right: 20px;
        }
    }
}
</style>
