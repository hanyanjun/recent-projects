<template>
  <div class="select-reason-mask" v-show="config.show">
    <div class="select-content">
      <h6 class="title">{{info.title}}</h6>
      <ul class="select-reason">
        <li v-for="(item,index) in info.text" @click.stop="change(index)" :class="{'li-active': index == sClass}">{{item}}</li>
      </ul>
      <div class="btns"><button type="button" name="button" class="select-cancle" @click.stop="cancle">取消</button><button class="select-confirm" type="button" name="button" @click.stop="confirm">确认</button></div>
    </div>
  </div>
</template>

<script>
  import {Toast} from './hw-components'
export default{
    name : 'middleSelect',
    props : ['config','display'],
    data(){return{
        info : this.config,
        sClass : '99999999'
    }},
    methods : {
        change(v){
            this.sClass = v;
        },
        confirm(){
            if(this.sClass == '99999999'){
                  Toast('请选择一项!')
            }else{
              this.config.method(this.info.text[this.sClass]);
            }
        },
        cancle(){
          this.config.method();
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*选择原因区域*/
  .select-reason-mask{
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
  }
  .select-content {
    width: 6rem;
    position: absolute;
    left: 50%;
    top: 50%;
    background: white;
    -webkit-border-radius: .2rem;
    -khtml-border-radius: .2rem;
    -moz-border-radius: .2rem;
    -ms-border-radius: .2rem;
    -o-border-radius: .2rem;
    border-radius: .2rem;
    padding-bottom: 0.4rem;
    transform: translateX(-50%) translateY(-50%);
  }
  .select-content .title{
    color: rgb(42, 140, 255);
    font-size: .34rem;
    line-height: .34rem;
    padding: .34rem 0 .3rem 1.09rem;
    font-weight: normal;
    border-bottom: 1px solid rgb(201, 202, 202);
    box-sizing: border-box;
    text-align: left;
  }
  .select-reason{
    padding-left: 1.09rem;
    padding-right: .87rem;
    box-sizing: border-box;
    font-size: .32rem;
    color: #000000;
    margin-top: .08rem;
  }
  .select-reason li{
    padding: .37rem 0 .2rem 0;
    line-height: .32rem;
    border-bottom: .02rem dashed rgb(201, 202, 202);
    margin-bottom: 1px;
    background: url(../assets/media/img/order-gray_right_icon.png) no-repeat right 0 center;
    background-size: 0.49rem 0.37rem;
    text-align: left;
  }
  .select-reason .li-active{
    padding: .37rem 0 .2rem 0;
    border-bottom: .02rem dashed rgb(201, 202, 202);
    margin-bottom: 1px;
    background: url(../assets/media/img/order-blue_right_icon.png) no-repeat right 0 center;
    background-size: 0.5rem 0.37rem;
  }
  .select-content  .btns{
   line-height: 0;
    margin-top: .6rem;
    text-align: left;
  }
  .select-content  .btns button{
    width: 1.75rem;
    height: .6rem;
    line-height: .6rem;
    text-align: center;
    display: inline-block;
    font-size: .32rem;
    color: white;
    -webkit-border-radius: .14rem;
    -khtml-border-radius: .14rem;
    -moz-border-radius: .14rem;
    -ms-border-radius: .14rem;
    -o-border-radius: .14rem;
    border-radius: .14rem;
  }
  .select-content  .btns .select-cancle{
    background: rgb(201, 202, 202);
    margin-left: .87rem;
  }
  .select-content  .btns .select-confirm{
    background: rgb(42, 140, 252);
    margin-left: .74rem;
  }
</style>
