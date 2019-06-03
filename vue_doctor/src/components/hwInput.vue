<template>
  <li>{{config.type}}<span class="hw-input-holder"  @click.stop="focus"  ref="zz" >
    <span v-html="card.show ? card1 : (card1 ? card1 : config.holder)" :class="[{'black':card1}]" ></span>
    <i class="cursor" v-show="card.show"></i></span><i class="icon-clear" v-show="card.show && card.value" @click.stop="clear"></i></li>
</template>

<script>
  //参数配置
//  point  是否可输入点
//  limit 字数限制
//  value  初始值
//  show  控制focus blur
//  split  控制是否分割显示
  import {Toast} from './hw-components'
export default{
    name : 'hwInput',
    props :['config'],
    data(){return {
        card :{
            show : false,
            value :  this.config.value ? this.config.value : '',
            point : this.config.point,
            split : this.config.split,
            limit : this.config.limit,
            type : this.config.type,
            keyShow : true
        }
    }},
   watch :{
     card :{
         deep : true ,
         handler : function (oldValue,newValue) {
           this.$emit('input',newValue.value);
         }
     }
   },
    computed:{
        card1(){
            let limit  = parseInt(this.card.limit);
            let length = this.card.value.length;
            if(length > limit){
                Toast(`内容不可超过${limit}个!`);
                this.card.value = this.card.value.substring(0,limit);
            }
            let v = this.card.value.split('');
            let result = '';
            let split = this.config.split;
            if(split != 0 && split){
              v.forEach((v,i,a)=>{
                result+=v;
                 if((i+1)%4 == 0){
                   result += '&nbsp;&nbsp;&nbsp;';
                 }
              })
              return result;
            }else{
                return this.card.value;
            }
        }
    },
    mounted(){
      document.querySelector('body').onclick =  (e)=> {
          if(e.target.className == 'hw-input-holder'){
              this.card.show = false;
          }
      }
    },
    methods :{
        focus(){
            this.$store.commit('INIT_INPUT');
            this.card.show = true;
            this.card.keyShow = true;
            this.$store.commit('SET_INPUT',this.card);
        },
        clear(){
            this.card.value = '';
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../assets/css/common";
  li{
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    background: white;
    font-size: 0.32rem;
    padding-left: 0.3rem;
    line-height: 1rem;
  }
  li .hw-input-holder {
    width: 5.9rem;
    height: 1rem;
    display: flex;
    color:$fGray;
    align-items: center;
    font-size: 0.32rem;
    line-height: 1rem;
    i {
      font-size: 0.6rem;
    }
    .cursor {
      display: inline-block;
      font-size: 0.32rem;
      width: 0.02rem;
      height: 0.32rem;
      border-right: 1px solid $baseBlue;
      padding-right: 0.06rem;
      animation: ani 2s infinite alternate;
    }
    @keyframes ani {
      0%, 50%, 100% {
        border-right: 1px solid $baseBlue;
      }
      51% {
        border-right: 1px solid transparent;
      }
    }
  }
  .black{
    color: black;
  }
  .icon-clear{
    position: absolute;
    right: 0.3rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.37rem;
    &:before{
      color: #c9caca;
    }
  }
</style>
