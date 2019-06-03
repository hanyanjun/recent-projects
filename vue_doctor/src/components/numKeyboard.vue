<template>
 <div class="keyboard" v-show="config.keyShow">
    <span v-for="(item,index) in arr" :class="['key',{'gray' : item == null},{'height':  item == 0}]"  @click.stop="num(index,$event)" > {{item  == null ? '' : item}}
      <span>{{word[index] == 'dele' ?  '' : word[index]}}
      </span>
    </span><span class="fn-span key" @click.stop="dele($event)">
         <i class="icon-clear-count">
           <i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i><i class="path5"></i><i class="path6"></i><i class="path7"></i>
         </i>
   </span>
 </div>
</template>

<script>
  import {Toast} from './hw-components'
export default{
    name : 'numKeyboard',
    data(){return{
        arr : [1,2,3,4,5,6,7,8,9,null,0],
        word : ['','ABC','DEF','GHI','JKL','MNO','PQRS','TUV','WXYZ','','']
    }},
    created(){

    },
    computed:{
      config(){
        return this.$store.state.components.input;
      },
    },
    methods:{
      dele(e){
        this.change(e);
        if(this.config.value.length == 0){
//          Toast('请输入内容再进行删除操作!');
        }else{
          this.config.value = this.config.value.substring(0,this.config.value.length-1);
        }
      },
      num(i,e){
//            判断保留几位小数
        let  temp = this.config.value;
//        判断首位是否是零以及第二位是否是.
        let v = this.arr[i];
        if(v != null && this.word[i] != 'dele'){
          if(/\./.test(temp)){
            temp = temp.split('.');
            if(temp.length == 2 && temp[1].length == 2){
              this.change(e);
            }else{
              this.config.value += v;
              this.change(e);
            }
          }else{
            this.config.value += v;
            this.change(e);
          }
        }
      },
      change(v){
          if(v.target.className &&  v.target.className != 'icon-clear-count'){
            v.target.setAttribute('id','active');
            setTimeout(function () {
              v.target.setAttribute('id','');
            },100)
          }else{
            v.target.parentNode.setAttribute('id','active');
            setTimeout(function () {
              v.target.parentNode.setAttribute('id','');
            },100)
          }

      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../assets/css/common";
.keyboard{
  width: 100%;
  position: fixed;
  bottom:0;
  font-size: 0.48rem;
  background: white;
  line-height: 0;
  .key{
    display: inline-block;
    width: 33%;
    text-align: center;
    /*height: 1rem;*/
    vertical-align: top;
    border-top: 1px solid $gray;
    border-right: 1px solid $gray;
    padding-top: 0.1rem;
    line-height: 0.68rem;
    padding-bottom: 0.2rem;
    height: 0.88rem;
    position: relative;
    span{
      display: block;
      font-size: 0.19rem;
      line-height: 0.20rem;
      position: relative;
    }
    .icon-clear-count{
      position: absolute;
      left: 50%;
      top:50%;
      font-size: 0.52rem;
      transform: translate(-50% , -50%);
    }
  }
  .fn-span{
    background: $bg;
  }
  .gray{
    background: $bg;
  }
  .height{
    line-height: 0.88rem;
  }
  #active{
    color: white;
    background: $baseBlue;
  }
}
</style>
