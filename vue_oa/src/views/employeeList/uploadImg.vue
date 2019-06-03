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
          <template v-else-if="fileType(item) == 'doc'  || fileType(item) == 'docx'">
            <span class="img pointer">
                <i class="iconfont icon-fileword"></i>
            </span>
         </template>
         <template v-else-if="fileType(item) == 'xls'  || fileType(item) == 'xlsx'">
            <span class="img pointer">
                <i class="iconfont icon-Excel"></i>
            </span>
         </template>
         <!-- <span class="text">*格式为 JPG/JPEG/PNG,大小在2M以内</span> -->
         <div class="mask">
             <span class="up pointer" v-show="!isPre" @click.stop="reUpload(index)">重新上传</span>
             <span class="up pointer" v-show="isPre" @click.stop="download(index)">下载</span>
             <span class="pre pointer"  @click.stop="preview(item)">预览</span>
             <span class="pre pointer" v-show="dele && !isPre "  @click.stop="deleItem(index)">删除</span>
         </div>
         
         <span class="text" v-show="!holdShow">{{holdFile}}</span>
     </div>
     <div class="modules" v-show="!isPre && !isUpload">
         <span class="img pointer" @click.stop="upload"><i class="iconfont icon-Shapecopy"></i></span>
         <span class="text" v-show="holdShow">{{holder}}</span>
         <input type="file" ref="upload"  @change.stop="change($event)" multiple>
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
        curentImg : '',
        allowUpload : true,
        // isUpload: false,
        holdFile:'',
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
        dele:{
            type : Boolean,
            default: false
        },
        isPre: {
            type : Boolean,
            default : false
        },
        canvasType : {
            type:String,
            default : ''
        },
        // hold显示
        holdShow: {
            type : Boolean,
            default : true
        },
        // 上传附件类型
        typeFile: {
          type:String,
          default: ''
        },
        // 上传文件框显示隐藏
        isUpload: {
            type : Boolean,
            default : false
        },
    },
    methods :{
        change(e){
            let target = e.target || e.srcElement;
            let f = target.files[0];
            let fs = target.files;
            let len =  fs.length;
            if(f){
                for(let i = 0 ; i < len ; i++){
                    let v = fs[i];
                    let size = v.size/1024/1024;
                    let name = v.name;
                    if(this.size > 0  && size > this.size){
                        if(fs.length > 1){
                            this.$message.error(`第${i+1}个文件大小超过${this.size}M，请重新上传！`);
                        }else{
                            this.$message.error(`体检报告仅支持PDF格式文件,文件大小需在${this.size}M以内！`);
                        }
                        if(i == len-1){
                            this.allowUpload = true;
                        }
                    }else{
                        let formData = new FormData();
                        formData.append('file', v);
                        let type = this.fileType(name);
                        // switch
                        switch(this.typeFile){
                          case 'pdf' :
                            if(type == 'pdf'){
                                this.$store.dispatch("uploadFile",{type : 'leave' , formData : formData}).then(obj=>{
                                    this.changeList(obj.data.data.filePath);
                                    // 只有上传一个附件
                                    if(this.list.length != 0 && this.limit == 1){
                                    //   上传框隐藏
                                    //   this.isUpload = true
                                      this.$emit('listEmpty',{list:this.list,isUpload: true})
                                    }
                                    this.holdFile = f.name
                                    if(i == len-1){
                                      this.allowUpload = true;
                                      e.target.value = '';
                                    }
                                }).catch(_=>{
                                    if(i == len-1){
                                      this.allowUpload = true;
                                      e.target.value = '';
                                    }
                                })
                            }else{
                                if(fs.length >  1){
                                    this.$message.error(`不支持选中的第${i+1}个文件的格式!`);
                                }else{
                                    this.$message.error(`体检报告仅支持PDF格式文件,文件大小需在${this.size}M以内！`);
                                }
                                if(i == len-1){
                                    this.allowUpload = true;
                                    e.target.value = '';
                                }
                            }
                          break;
                          case '':
                            if(type == 'img'){
                              this.$store.dispatch("uploadImg",{type : 'leave' , formData : formData , width : 144 ,  height :144}).then(obj=>{
                                      this.changeList(obj.data.data.filePath);
                                      if(i == len-1){
                                          this.allowUpload = true;
                                          e.target.value = '';
                                      }
                              }).catch(_=>{
                                      if(i == len-1){
                                          this.allowUpload = true;
                                          e.target.value = '';
                                      }
                              })
                            }else if(type == 'pdf' || type == 'doc' || type == 'docx' || type == 'xls' || type == 'xlsx'){
                                this.$store.dispatch("uploadFile",{type : 'leave' , formData : formData}).then(obj=>{
                                    this.changeList(obj.data.data.filePath);
                                    if(i == len-1){
                                      this.allowUpload = true;
                                      e.target.value = '';
                                    }
                                }).catch(_=>{
                                    if(i == len-1){
                                      this.allowUpload = true;
                                      e.target.value = '';
                                    }
                                })
                            }else{
                                if(fs.length >  1){
                                    this.$message.error(`不支持选中的第${i+1}个文件的格式!`);
                                }else{
                                this.$message.error('不支持此格式文件!');
                                }
                                if(i == len-1){
                                    this.allowUpload = true;
                                    e.target.value = '';
                                }
                            }
                          break;

                        }
                        
                    }
                }
            }
            
        },
        reUpload(index){
            this.isNew = false;
            this.curIndex = index;
            this.$refs.upload.click();
        },
        deleItem(index){
            this.$confirm('确认删除该文件?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                let l = Object.assign([],this.list);
                this.list.splice(index,1);
                // 只有上传一个附件
                if(this.list.length == 0 && this.limit == 1){
                // 上传框显示
                //   this.isUpload = false
                console.log(this.isPre)
                  this.$emit('listEmpty',{list:this.list,isUpload: false})
                }
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            })
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
            if(this.allowUpload){
                this.isNew = true;
                this.$refs.upload.click();
            }else{
                this.$message.error('请等待上次上传完成!');
            }
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
                if(this.fileType(item) == 'img'){
                    this.curentImg = '';
                    this.curentImg  = item;
                    this.centerDialogVisible = true;
                }else{
                    this.$message.error('暂不支持该类型文件预览!');
                }
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
        download(index){
            let src = this.list[index];
            let name = src.substr(src.lastIndexOf('/')+1);
            this.$store.dispatch('downFile',{type : 'get', url : ` /admin/file/download/file` ,  data : {filePath : src} , fileName : name });
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
        text-align: center;
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
