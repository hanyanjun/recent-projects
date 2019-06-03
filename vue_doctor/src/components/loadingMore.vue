<template>
<div class="loadingMoreContent" :style="scrollStyle" >
  <div class="loadMore" v-show="down && (loadingText || tip) ">
    <div :class="['loading',spinner]" v-show="!tip">
      <div class="spinner">
        <div class="spinner-container container1">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
          <div class="circle4"></div>
        </div>
        <div class="spinner-container container2">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
          <div class="circle4"></div>
        </div>
        <div class="spinner-container container3">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
          <div class="circle4"></div>
        </div>
      </div>
    </div>
    <span class="tip">
      <template v-if="!tip">
        {{loadingText}}
      </template>
      <template v-if="empty">
        没有更多数据了
      </template>
    </span>
  </div>
  <slot></slot>
  <div class="loadMore" v-show="up && (loadingText || tip)">
    <div :class="['loading',spinner]"  v-show="!tip">
      <div class="spinner">
        <div class="spinner-container container1">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
          <div class="circle4"></div>
        </div>
        <div class="spinner-container container2">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
          <div class="circle4"></div>
        </div>
        <div class="spinner-container container3">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
          <div class="circle4"></div>
        </div>
      </div>
    </div>
    <span class="tip">
      <template v-if="!tip">
        {{loadingText}}
      </template>
      <template v-if="empty">
        没有更多数据了
      </template>
    </span>
  </div>
</div>
</template>

<script>
  import BScroll from 'better-scroll'
  import {Toast} from './hw-components'
export default{
    name : 'loadingMore',
    data(){return{
      control : true,
      page : 0,
      loadingText : '',
      control : true,
      oldMax : '',
    }},
    props :{
        probeType :{
            type : Number,
            default : 2
        },
//       是否派发click事件
        click :{
            type : Boolean,
            default : true
        },
        tip : {
            type : Boolean,
            defalut : false
        },
//        是否开启横向滑动
        scrollX :{
             type : Boolean,
             defalut : false
        },
//        是否开启纵向滑动
        scrollY :{
             type : Boolean,
             default : true
        },
//      数据
        data:{
            type : Array,
            default : null
        },
//      是否派发上拉加载事件
        pullupLoad :{
            type : Boolean,
            default : false
        },
        scrollTo : {
           type : String,
           default : ''
        },
        spinner : {
           type : String,
           default : ''
        },
//        是否派发上拉刷新事件
        pullupRefresh :{
            type : Boolean,
            defalut : false
        },
        pulldownLoad:{
            type : Boolean,
            default : false
        },
        pulldownRefresh:{
            type : Boolean,
            default : false
        },
//        是否派发页面开始滚动事件
        beforeScroll :{
            type : Boolean,
            default : false
        },
//      是否派发滚动监听
        listenScroll:{
            type : Boolean,
            default : false
        },
//        当数据更新之后,刷新scroll的延迟
        refreshDelay :{
            type : Number,
            default : 20
        },
//      触发的阕值
        spaceValue :{
            type : Number,
            default : 40
        },
        scrollStyle :{

        },
        empty : [Boolean] //数据加载完成是否显示没有更多数据了
    },
    mounted(){
        this.initScroll();
    },
    computed:{
      up(){
          return this.pullupLoad || this.pullupRefresh;
      },
      down(){
          return this.pulldownLoad || this.pulldownRefresh;
      }
    },
    watch :{
      'data' : {
        handler:function(val,oldVal){
//            先计算oldMax
          if(!this.oldMax){
              let v = this.scroll.maxScrollY;
              this.oldMax = v;
          }
          setTimeout(()=>{
            this.refresh();
            this.loadingText = '';
              if(this.scrollTo != ''){
                switch (this.scrollTo){
                  case 'top' :
                    this.scroll.scrollTo(0,0);
                    break;
                  case 'bottom':
                    this.scroll.scrollTo(0,this.scroll.maxScrollY);
                    break;
                  case 'keep':
                    this.scroll.scrollTo(0,parseInt(this.scroll.maxScrollY) - parseInt(this.oldMax)  + 36);
                    this.oldMax = this.scroll.maxScrollY;
                    break;
                  default: this.scroll.scrollTo(0,this.scrollTo);
                }
              }
              this.control = true;
            },this.refreshDelay)
          },
          // 深度观察
          deep:true
        },
      loadingText(){
        setTimeout(()=>{
          this.refresh();
        },10)
      },
    },
    methods:{
        initScroll(){
            this.scroll  =  new BScroll(document.querySelector('.loadWrapper'), {
                  scrollX : this.scrollX,
                  scrollY : this.scrollY,
                  momentum : true, //开启滑动惯性
                  HWCompositing : true, //启用硬件加速
                  useTransition: true, //使用css3transition属性
                  useTransform: true, //使用css3transform属性
                  bounce: true, //开启动画回弹效果
                  bounceTime: 300, //回弹动画秒数
                  click : this.click,
                  preventDefault: true,
                  probeType : this.probeType
            });
            this.scroll.on('scroll',(pos)=>{
                //滚动的将位置信息提交出去
              this.$emit('scroll',pos);
                if(this.scrollTo < 0){
                   this.scrollTo = 'bottom';
                   this.refresh();
                }
                if(pos.y  > 0 && pos.y > this.spaceValue){
                    if((this.pulldownLoad || this.pulldownRefresh) && !this.tip){
                      if(this.pulldownLoad){
                        this.loadingText = '正在加载数据...';
                      }
                      if(this.pulldownRefresh){
                        this.loadingText = '正在刷新...'
                      }
                      this.$emit('pulldown',this.control);
                      this.control = false;
                    }
                }else if(pos.y < 0 && pos.y <= (this.scroll.maxScrollY + this.spaceValue)){
                  if((this.pullupLoad || this.pullupRefresh)  && !this.tip){
                    if(this.pullupLoad){
                      this.loadingText = '正在加载数据...';
                    }
                    if(this.pullupRefresh){
                      this.loadingText = '正在刷新...'
                    }
                    this.$emit('pullup',this.control);
                    this.control = false;
                  }
                }
                this.$emit('scroll',pos);
            })
            this.scroll.on('scrollEnd',(pos)=>{
              //滚动的将位置信息提交出去
              this.$emit('scroll',pos);
              if(this.scroll.maxScrollY == 0){
                //不提示没有更多数据
                // Toast('没有更多数据了!');
              }else{
//                  if(!this.control){
//                  }
//                if(this.scroll.y <= (this.scroll.maxScrollY + this.spaceValue)){
//                  if(this.pullupLoad || this.pullupRefresh){
//                      this.$emit('pullup',this.control);
//                      if(this.pullupLoad){
//                          this.loadingText = '正在加载数据...';
//                      }
//                      if(this.pullupRefresh){
//                          this.loadingText = '正在刷新...'
//                      }
//                      this.control = false;
//                  }
//                }
              }
            })
        },
        refresh(){
            this.scroll && this.scroll.refresh();
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../assets/css/common";
.loadingMoreContent{
  border: 1px solid transparent;
  .loadMore{
    width: 100%;
    height: 0.5rem;
    display: block;
    padding-left: 30%;
    line-height: 0.5rem;
    font-size: 0.3rem;
    margin: 0.2rem 0;
    box-sizing: border-box;
    .tip{
      line-height: 0.5rem;
      vertical-align: top;
      padding-left: 0.2rem;
    }
    .loading{
      position: relative;
      display: inline-block;
      z-index: 0;
      @include loading(0.5rem,0.5rem,0.4rem,0.4rem,0.1rem,$fGray,#edeff0);
    }
    .loading1{
      position: relative;
      display: inline-block;
      z-index: 0;
      @include loading(0.5rem,0.5rem,0.4rem,0.4rem,0.1rem,$fGray,white);
    }
  }
}
</style>
