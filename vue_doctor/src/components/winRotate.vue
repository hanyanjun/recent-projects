<template>
<div class="hw-rotate-window">
  <div class="rotate-window">
    <div class="rotate-content"><b :class="['icon-rotate', {'rotate-icon-1' :  this.type == '1'}, {'rotate-icon' : this.type == '2'}]"  style="font-size: 2.6rem;color:white"></b><span>为了更好的体验,请使用竖屏浏览</span></div>
  </div>
</div>
</template>

<script>
export default{
    name : 'hw-winRotate',
    data(){return{
        type : ''
    }},
    created (){
      //屏幕旋转
      window.addEventListener("orientationchange", ()=> {
         if (window.orientation == 90) {
            this.$store.commit('SET_ROTATE_ANI',true);
            this.type = '1';
         }else if(window.orientation == -90){
             this.$store.commit('SET_ROTATE_ANI',true);
            this.type = '2';
         }else{
           this.$store.commit('SET_ROTATE_ANI',false);
         }
      }, false);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .hw-rotate-window {
    width: 100%;
    height: 100%;
    background: #000;
    position: fixed;
    z-index: 999999;
    top: 0;
    left: 0;
  }

  .hw-rotate-window .rotate-content {
    width: 3rem;
    height: 3rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -1.50rem;
    margin-top: -1.5rem
  }

  .hw-rotate-window .icon-rotate {
    width: 2.6rem;
    height: 2.6rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -1.3rem;
    margin-left: -1.3rem;
    transform-origin: 50% 50%;
  }

  .hw-rotate-window .rotate-icon {
    background-size: contain;
    -webkit-animation: rotate 1.2s infinite ease-in-out;
    animation: rotate 1.2s infinite ease-in-out
  }

  .hw-rotate-window .rotate-icon-1 {
    background-size: contain;
    -webkit-animation: rotate1 1.2s infinite ease-in-out;
    animation: rotate1 1.2s infinite ease-in-out
  }

  .hw-rotate-window .rotate-content span {
    display: block;
    text-align: center;
    font-size: 0.30rem;
    line-height: 0.5rem;
    margin-top: 3.4rem;
    color: #fff
  }

  @keyframes rotate {
    0% {
      transform: rotateZ(0)
    }
    100% {
      transform: rotateZ(60deg)
    }
  }

  @-webkit-keyframes rotate {
    0% {
      transform: rotateZ(0)
    }
    100% {
      transform: rotateZ(60deg)
    }
  }

  @keyframes rotate1 {
    0% {
      transform: rotateZ(0)
    }
    100% {
      transform: rotateZ(-60deg)
    }
  }

  @-webkit-keyframes rotate1 {
    0% {
      transform: rotateZ(0)
    }
    100% {
      transform: rotateZ(-60deg)
    }
  }

</style>
