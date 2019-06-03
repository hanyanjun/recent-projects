<template>
   <div class="loadingMask" v-if="visible">
        <div class="loadingCon">       
            <img src="/static/imgs/loading-mini.gif" alt="" class="img">
        </div>
    </div>  
</template>

<script>
export default {
  name: "loadingMask",
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    showLoading() {
      this.visible = true;
    },
    closeLoading(){
        this.visible =false;
    }
  }
};
</script>

<style lang="scss" scoped>
.loadingMask {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1000;
  .loadingCon {
    position: absolute;
    top: 50%;
    box-sizing: border-box;
    left: 50%;
    transform: translate(-50%, -50%);
    line-height: 0;
    .img {
      display: block;
      width: 150px;
      height: 107px;
      margin: 0 auto;
      border-radius: 12px;
      background: rgba(0,0,0,0.7);
    
    }
  }
}
</style>
