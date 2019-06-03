<template>
  <div class="keyboard" v-show="config.keyShow">
    <section class="num">
      <span @click.stop="num(1,$event)">1
      </span><span @click.stop="num(2,$event)">2
      </span><span @click.stop="num(3,$event)">3
      </span><span @click.stop="num(4,$event)">4
      </span><span @click.stop="num(5,$event)">5
      </span><span @click.stop="num(6,$event)">6
      </span><span @click.stop="num(7,$event)">7
      </span><span @click.stop="num(8,$event)">8
      </span><span @click.stop="num(9,$event)">9
      </span><span @click.stop="point($event)">.
      </span><span @click.stop="num(0,$event)" >0
      </span><span @click.stop="keyShow($event)"><i class="icon-keyboard"></i>
      </span>
    </section><section class="fn">
      <span class="fn-span" @click.stop="dele($event)">
         <span class="icon-clear-count">
           <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span>
         </span>
      </span><span class="fn-span" @click.stop="submit($event)">确定
      </span>
    </section>
  </div>
</template>

<script>
  import {Toast} from './hw-components'
export default{
    name : 'keyBoard',
    created(){

    },
    computed:{
      config(){
          return this.$store.state.components.input;
      }
    },
    methods :{
        submit(e){
            this.config.show = false;
            this.change(e);
            this.$emit('event',this.config);
        },
        dele(e){
          this.change(e);
            if(this.config.value.length == 0){
                Toast('请输入内容再进行删除操作!');
            }else{
              this.config.value = this.config.value.substring(0,this.config.value.length-1);
            }
        },
        num(v,e){
//            判断保留几位小数
          let  temp = this.config.value;
          if(/\./.test(temp)){
               temp = temp.split('.');
              if(temp.length == 2 && temp[1].length == 2){
                   this.change(e);
              }else{
                this.config.value += v;
                this.change(e);
              }
          }else{
            if(/^0/.test(this.config.value)){
              this.config.value = '';
            }
            this.config.value += v;
            this.change(e);
          }
        },
        point(e){
            this.change(e);
            let v = this.config;
            if(v.point){
              if(!v.value){
                v.value = '0.';
              }else{
                if(/\./.test(v.value)){
//                  Toast('输入格式有误!');
                }else{
                  v.value += '.';
                }
              }
            }else{
              Toast('该内容不能输入 · ');
            }
        },
        keyShow(){
            this.config.show = false;
            this.config.keyShow = false;
        },
        change(v){
          if (v.target.className && v.target.className == 'icon-clear-count') {
            v.target.parentNode.setAttribute('id', 'active');
            setTimeout(function () {
              v.target.parentNode.setAttribute('id', '');
            }, 100)
          }else {
            v.target.setAttribute('id', 'active');
            setTimeout(function () {
              v.target.setAttribute('id', '');
            }, 100)
          }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../assets/css/common";
  .keyboard{
    height: 4.4rem;
    background: white;
    display: flex;
    justify-content: space-between;
    position: fixed;
    /*bottom: 0;*/
    bottom : 0;
    overflow: hidden;
    width: 100%;
    .num{
      width: 5.36rem;
      /*width: auto;*/
      display: inline-block;
      font-size: 0.45rem;
      span{
        display: inline-block;
        /*float: left;*/
        width: 1.74rem;
        height: 1.1rem;
        text-align: center;
        line-height: 1.1rem;
        border-right: 1px solid $gray;
        border-top: 1px solid $gray;
        position: relative;
        vertical-align: top;
        i{
          position: absolute;
          left: 50%;
          top:50%;
          transform: translate(-50% , -50%);
        }
      }
    }
    .fn{
      display: inline-block;
      font-size: 0.4rem;
      width: 2.4rem;
      position: absolute;
      left: 5.22rem;
      top:0;
      .fn-span{
        display: block;
        height: 2.22rem;
        border-top: 1px solid $gray;
        text-align: center;
        line-height: 2.2rem;
        position: relative;
        .icon-clear-count{
          position: absolute;
          left: 50%;
          top:50%;
          transform: translate(-50% , -50%);
        }
      }
    }
    #active{
      color: white;
      background: $baseBlue;
    }
  }
</style>
