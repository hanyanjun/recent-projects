<template>
  <div class="dialog-addtext" v-show="config.show">
    <div class="text-content">
      <textarea name="name" :maxlength="config.count" class="text-input" :placeHolder="config.holder" v-on:input.stop="length()" ref="text"></textarea>
      <span class="count">{{count+'/'+config.count}}</span>
      <button type="button" name="button" class="submit" @click.stop="value">提交{{config.message}}</button>
      <button type="button" name="button" class="cancle" @click.stop="close"></button></div>
  </div>
</template>

<script>
  import {Toast} from  './hw-components'
export default{
    name : 'addText',
    props : ['config'],
    data(){
      return {
          info : this.config,
          count : this.config.message.length
      }
    },
    methods : {
        close (){
          this.$emit('event','')
        },
        length () {
            this.count  = this.$refs.text.value.length;
        },
        value () {
            let v = this.$refs.text.value;
            this.$emit('event',this.$refs.text.value);
            this.$refs.text.value = '';
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .dialog-addtext {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999999;
  }

  .dialog-addtext .text-content {
    width: 6.80rem;
    padding-bottom: 0.55rem;
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background: #fff;
    border-radius: 0.20rem;
    position: relative;
  }

  .dialog-addtext .text-input {
    display: block;
    resize: none;
    width: 5.80rem;
    min-height: 4.10rem;
    outline: 0;
    padding: 0.40rem 0;
    margin: auto;
    line-height: 0.46rem;
    background: #fff;
    position: relative;
    word-break: break-all;
    color: #6e6e72;
    font-size: 0.30rem;
    border-bottom: 1px solid #b5b5b5
  }

  .dialog-addtext .text-input-active {
    font-size: 0.34rem;
    color: #000
  }

  .dialog-addtext .count {
    font-size: 0.30rem;
    display: inline-block;
    position: absolute;
    right: 0.46rem;
    top: 4.40rem;
    color: #808184;
    line-height: 0.40rem
  }
  .dialog-addtext .submit {
    display: block;
    margin: 0.54rem auto auto;
    background: #0395fc;
    color: #fff;
    width: 3.30rem;
    height: 0.90rem;
    line-height: 0.90rem;
    text-align: center;
    font-size: 0.45rem;
    border-radius: 0.45rem;
    letter-spacing: 0.15rem
  }
  .dialog-addtext .cancle {
    display: block;
    width: 0.92rem;
    height: 1rem;
    background: url(../assets/media/img/close.png) no-repeat;
    background-size: contain;
    position: absolute;
    top: -1rem;
    right: 0.2rem
  }
</style>
