<template>
  <!--prompt弹窗-->
  <div class="hw-prompt" v-show="config.show">
    <ul class="hw-prompt-content">
      <li class="hw-prompt-title">{{config.title}}</li>
      <li class="hw-prompt-content"></li>
      <input :type="config.type ? config.type : 'text'" @focus="focus" class="hw-prompt-text" :value="config.value" :placeHolder="config.holder"  v-on:input="updateValue" >
      <h6 class="tips">{{config.tip}}</h6>
      <li class="hw-prompt-button">
        <button class="hw-prompt-cancle" @click.stop="config.callback('取消')">取消</button>
        <button class="confirm" @click.stop="config.callback(value)">确定</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default{
    name : 'prompt',
    data (){
      return {
        value : ''
      }
    },
    methods : {
      focus(){
        return this.$store.state.components.prompt.tip = '';
      },
      updateValue(e){
        let config = this.config;
        let v = e.target.value;
          if(config.type){
            let temp = v;
            if(config.limit){
              if(config.type == 'number'){
                if(/\./.test(temp)){
                  temp = temp.split('.');
                  if(temp.length == 2 && temp[1].length >= config.limit){
                    v = temp[0]+'.'+temp[1].substring(0,config.limit);
                  }else{
                    v = v;
                  }
                }
                v = parseFloat(v);
              }else{
                v = v.substring(0,config.limit);
              }
            }
            e.target.value = v;
          }
        if(config.mold){
            switch (config.mold){
              case 'float':
                v = this.$means.to_float(v,config.limit ? config.limit : 0);
              break;
              case 'int':
                if(v){
                  v = isNaN(Number(v)) ?  1 : Number(v) ;
                }
            }
          e.target.value = v;
        }
        this.value = e.target.value;
      }
    },
    computed :{
        config (){
            return this.$store.state.components.prompt;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../assets/css/common";
  //prompt样式
  .hw-prompt{
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 99999;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .7);
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 0;
    .tips{
       margin: 0.2rem 0 0.32rem 0;
      font-size: 0.24rem;
      line-height: 0.24rem;
      color: rgb(254,33,38);
    }
  }

  .hw-prompt .hw-prompt-content {
    width: 5.2rem;
    background: #fff;
    border-radius: .18rem;
    overflow: hidden;
    text-align: center;
    line-height: 0;
  }

  .hw-prompt .hw-prompt-content .hw-prompt-title {
    height: 0.94rem;
    text-align: center;
    font-size: .32rem;
    line-height: 0.94rem;
  }
  .hw-prompt .hw-prompt-content input {
    display: inline-block;
    height:0.36rem;
    font-size: .26rem;
    padding: 0.24rem 0.5rem;
    line-height: .36rem;
    border-radius: 0.06rem;
    border: 1px solid $gray;
    color: $fGray;
  }
  .hw-prompt .hw-prompt-content::-webkit-input-placeholder{
    line-height: 0.26rem;
    box-shadow: 0 0 0 0;
  }


  .hw-prompt .hw-prompt-content .hw-prompt-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1rem
  }

  .hw-prompt .hw-prompt-content .hw-prompt-button button {
    display: inline-block;
    width: 50%;
    height: 100%;
    line-height: .9rem;
    background: #fff;
    border-top: 1px solid $gray;
    font-size: 0.32rem;
    color: #0693fc;
  }

  .hw-prompt .hw-prompt-content .hw-prompt-button .hw-prompt-cancle {
    margin-right: 1px;
    border-right: 1px solid $gray;
    color: black;
  }
</style>
