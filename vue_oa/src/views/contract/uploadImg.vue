<template>
 <div class="uploadWrap">
     <div class="modules" v-for="(item,index) in list" v-if="item" :key="index">
         <template v-if="fileType(item) == 'img'">
            <img  v-imgNoBg="item"  src="" alt="" class="img">
         </template>
         <template v-else-if="fileType(item) == 'pdf'">
             {{dowFile(item,`${canvasType}_canvas_${index}`)}}
            <span class="img pointer">
                <canvas :id="`${canvasType}_canvas_${index}`"></canvas>
            </span>
         </template>
         <!-- <span class="text">*格式为 JPG/JPEG/PNG,大小在2M以内</span> -->
         <div class="mask">
             <span class="up pointer" v-show="!isPre" @click.stop="reUpload(index)">重新上传</span>
             <span class="pre pointer" @click.stop="preview(item)">预览</span>
         </div>
     </div>
     <div class="modules" v-show="!isPre">
         <span class="img pointer" @click.stop="upload"><i class="iconfont icon-Shapecopy"></i></span>
         <span class="text">{{holder}}</span>
         <input type="file" ref="upload"  @change.stop="change($event)" >
     </div>
     <el-dialog
        title="图片预览"
        :visible.sync="centerDialogVisible"
        width="45%"
        center>
        <img v-imgNoBg="curentImg"  class="preImg" alt="">

</el-dialog>

 </div>   
</template>
<script>
import PDFJS from 'pdfjs-dist'
export default {
    name : "uploadImg",
    data(){return{
        curIndex : -1,
        isNew :false,
        pdfDoc: null,
        pageNum: 1,
        pageRendering: false,
        pageNumPending: null,
        scale: 1,
        visible : false,
        centerDialogVisible : false,
        nameList :{},
        curentImg : ''
        
// ce5453
    }},
    props:{
        limit :{
            type : Number,
            default : 10
        },
        list : {
            type : Array,
            default : function(){
                return []
            }
        },
        size : {
            type : Number,
            default : 0
        },
        type : {
            type : String,
            default : 'inrecoag'
        },
        holder : {
            type : String,
            default : '*格式为 JPG/JPEG/PNG/PDF,大小在2M以内'
        },
        isPre: {
            type : Boolean,
            default : false
        },
        canvasType : {
            type:String,
            default : ''
        }
    },
    methods :{
        change(e){
            let target = e.target || e.srcElement;
            let f = target.files[0];
            target.value = '';
            if(f){
                let size = f.size/1024/1024;
                let name = f.name;
                if(this.size > 0  && size > this.size){
                    this.$message.error(`文件大小需在${this.size}M内！`);
                }else{
                    let formData = new FormData();
                    formData.append('file', f);
                    let type = this.fileType(name);
                    if(type == 'img'){
                        this.$store.dispatch("uploadImg",{type : 'inrecoag' , formData : formData , width : 144 ,  height :144}).then(obj=>{
                                this.changeList(obj.data.data.filePath);
                        })
                    }else if(type == 'pdf'){
                        this.$store.dispatch("uploadFile",{type : 'inrecoag' , formData : formData}).then(obj=>{
                                this.changeList(obj.data.data.filePath);
                        })
                    }else{
                        this.$message.error('不支持此格式文件!');
                    }
                }
            }
            
        },
        reUpload(index){
            this.isNew = false;
            this.curIndex = index;
            this.$refs.upload.click();
        },
        changeList(url){
            let l = Object.assign([],this.list);
            if(this.isNew){
                this.list.push(url);
            }else{
                this.list.splice(this.curIndex,1,url);
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
        upload(){
            this.isNew = true;
            this.$refs.upload.click();
        },
        preview(item){
            if(this.fileType(item) ==  'pdf'){
                this.$store.dispatch('gainFileBlob',{url : `/admin/file/download/file?filePath=${item}` , sign : {'filePath' : item}}).then(obj=>{
                    var reader = new FileReader();
                    reader.readAsDataURL(obj);
                    console.log(obj);
                    reader.onload = (e)=>{ 
                        this.$showPDF(reader.result);
                    }
                })
            }else{
                this.curentImg = '';
                this.curentImg  = item;
                this.centerDialogVisible = true;
            }
        },
        dowFile(url,id){
            this.$store.dispatch('gainFileBlob',{url : `/admin/file/download/file?filePath=${url}` , sign : {'filePath' : url}}).then(obj=>{
            //    this.$showPDF(obj);
               var reader = new FileReader();
               reader.readAsDataURL(obj);
               reader.onload = (e)=>{ 
                   let re = reader.result;
                //    re = re.replace(/charset=UTF-8;/g,'');
                   this.showPDF(re,id);
               }
           })
        },
        showPDF (url,id) {
            let _this = this;
            PDFJS.getDocument(url).then(function (pdf) {
                _this.pdfDoc = pdf;
                console.log(pdf);
                _this.renderPage(1,id);
            }).catch(obj=>{
                console.log(obj);
            })
        },
        renderPage (num,id) {
        this.pageRendering = true
        let _this = this
        this.pdfDoc.getPage(num).then(function (page) {
            var viewport = page.getViewport(_this.scale)
            let canvas = document.getElementById(id)
            canvas.height = viewport.height
            canvas.width = viewport.width
            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: canvas.getContext('2d'),
                viewport: viewport
            }
            var renderTask = page.render(renderContext)
            // Wait for rendering to finish
            renderTask.promise.then(function () {
            _this.pageRendering = false
            if (_this.pageNumPending !== null) {
                // New page rendering is pending
                this.renderPage(_this.pageNumPending)
                _this.pageNumPending = null
            }
            })
        })
        },
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
@import "./common.scss";
.modules{
    display: inline-block;
    text-align: center;
    position: relative;
    margin-right: 35px;
    margin-bottom: 30px;
    vertical-align: top;
    input{
        display: none;
    }
    .iconfont{
        display: inline-block;
        background: #fbfdff;
        border-radius:5px;
        width:100%;
        height:100%;
        line-height: 144px;
        color: #EDEFF3;
        font-size: 33px;
    }
    .img{
        display: inline-block;
        border: 1px dotted $gray_f1;
        border-radius:5px;
        width:144px;
        height:144px;
        vertical-align: top;
    }
    canvas{
        display: inline-block;
        width:144px;
        height:144px;
    }
    .text{
        display: block;
        width: 144px;
        font-size: 12px;
        color: $gray_c;
        text-align: left;
        word-break: break-all;
        line-height: 18px;
        margin-top: 7px;
    }
    .mask{
        display: none;
        width: 100%;
        height: 144px;
        justify-content: center;
        background: rgba(0,0,0,0.6);
        position: absolute;
        left: 0;
        top: 0;
        text-align: center;
        border-radius:5px;
        span{
            display: inline-block;
            color: white;
            width: 70px;
            margin: 0 20px;
            height: 20px;
            border-radius: 2px;
            line-height: 20px;
            border: 1px solid white;
            font-size: 12px;
        }
        .pre{
            margin-top: 10px;
        }
    }
}
.modules:hover{
    .mask{
        display: flex;
        align-content: center;
        flex-wrap: wrap;
    }
}
.preImg{
    display: block;
    margin: 0 auto ;
    width: 70%;
}

</style>
