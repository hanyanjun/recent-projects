<template>
  <div id="container" v-show="visible">
    <!-- <div class='pdf-page'> -->
      <div class="content" v-if="visible">
        <scrollContent>
        <canvas id="the-canvas" ></canvas>
      </scrollContent>
      </div>
      <!--  v-if='pdfDoc' -->
      <div class="foot" v-if='pdfDoc'>
        <button class='left pointer' v-if="pageNum>1" @click="onPrevPage">上一页</button>
        <button class='right pointer' v-if="pageNum<pdfDoc.numPages" @click="onNextPage">下一页</button>
      </div>
      <i class="close iconfont pointer icon-del2" @click.stop="visible = false"></i>
    <!-- </div> -->
  </div>
</template>
<script>
import PDFJS from 'pdfjs-dist'
// var PDFJS = require('pdfjs-dist')
import scrollContent from "../scrollContent.vue"
 
export default {
  data () {
    return {
      pdfDoc: null,
      pageNum: 1,
      pageRendering: false,
      pageNumPending: null,
      scale: 1.4,
      visible : false,
      curUrl : ''
    }
  },
  watch:{
    curUrl:function(v,o){
      if(v != o && o){
        this.pageNum = 1;
      }
    }
  },
  components:{scrollContent},
  methods: {
    showPDF (url) {
      let _this = this;
      this.curUrl = url;
      PDFJS.getDocument(url).then(function (pdf) {
        _this.pdfDoc = pdf;
        _this.renderPage(1);
        _this.visible = true;
      }).catch(obj=>{
        _this.$message.error('不支持该浏览器预览，请更换浏览器进行预览!');
      })
    },
    renderPage (num) {
      this.pageRendering = true;
      let _this = this;
      this.pdfDoc.getPage(num).then(function (page) {
        var viewport = page.getViewport(_this.scale);
        let canvas = document.getElementById('the-canvas');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
 
        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport: viewport
        }
        var renderTask = page.render(renderContext);
 
        // Wait for rendering to finish
        renderTask.promise.then(function () {
          _this.pageRendering = false;
          if (_this.pageNumPending !== null) {
            // New page rendering is pending
            this.renderPage(_this.pageNumPending);
            _this.pageNumPending = null;
          }
        })
      })
    },
    queueRenderPage (num) {
      if (this.pageRendering) {
        this.pageNumPending = num;
      } else {
        this.renderPage(num);
      }
    },
    onPrevPage () {
      if (this.pageNum <= 1) {
        return
      }
      this.pageNum--;
      this.queueRenderPage(this.pageNum);
    },
    onNextPage () {
      if (this.pageNum >= this.pdfDoc.numPages) {
        return
      }
      this.pageNum++;
      this.queueRenderPage(this.pageNum);
    }
  }
}
</script>
 
<style lang="scss" scoped>
#container {
  background-color: rgba(0,0,0,0.75);
  position:fixed;
  z-index: 9999;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 50px 50px 0;
  box-sizing: border-box;
  text-align: center;
  overflow: hidden;
}
.content{
  height: calc(100% - 50px);
  width: auto;
  box-sizing: border-box;
  padding-right: 30px;
  overflow: hidden;
}
.foot {
  height: 20px;
  text-align: center;
  button{
    background: rgba(0,0,0,0);
    color: white;
    margin-top: 20px;
  }
  .right{
    margin-left: 20px;
  }
}
.iconfont{
  color: white;
  font-size: 30px;
  position: absolute;
  top: 50px;
  right: 50px;
}
</style>
