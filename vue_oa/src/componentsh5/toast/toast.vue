<template>
   <div class="toastMask" v-show="text.length > 0">
        <div class="toastCon" v-for="(item,index) in text" :key="index">       
            <img src="../../commons/imgs/face.png" alt="" v-if="!icon[index]" class="img">
            <i :class="['iconfont',icon[index],'img']"  v-if="icon[index]"></i>
            <span class="text">{{text[index]}}</span>
        </div>
    </div>  
</template>

<script>
export default {
  name: "toastMask",
  data() {
    return {
      setime: "",
      text: [],
      icon: [],
      visible: false,
      time : []
    };
  },
  methods: {
    showToast({ message, icon }) {
      this.text.push(message);
      this.icon.push(icon || "");
      let time = setTimeout(() => {
        if (this.text.length > 0) {
          this.text.shift();
          this.icon.shift();
          let t = this.time.shift();
          clearTimeout(t);
        }
      }, 1500);
      this.time.push(time);
    }
  }
};
</script>

<style lang="scss" scoped>
.toastMask {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  .toastCon {
    width: 3.01rem;
    min-height: 1.5rem;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 0.2rem;
    position: absolute;
    top: 50%;
    box-sizing: border-box;
    left: 50%;
    transform: translate(-50%, -50%);
    line-height: 0;
    padding: 0.3rem 0;
    .img {
      display: block;
      width: 0.44rem;
      height: 0.44rem;
      margin: 0 auto;
    }
    .text {
      display: inline-block;
      width: 100%;
      text-align: center;
      color: white;
      font-size: 0.3rem;
      line-height: 1;
      box-sizing: border-box;
      min-height: 0.3rem;
      margin-top: 0.2rem;
      word-break: break-all;
      padding: 0 0.1rem;
    }
  }
}
</style>
