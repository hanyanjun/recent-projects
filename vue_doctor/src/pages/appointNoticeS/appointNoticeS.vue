<template>
<div class="container">
  <div class="content">
    <h6>选择停诊时间</h6>
    <ul class="time">
      <li @click.stop="chooseTime('1')"><span>开始时间</span> <span class="gray">{{t1}}</span> <i class="icon-return-boldleft"></i></li>
      <li  @click.stop="chooseTime('2')"><span>结束时间</span> <span class="gray">{{t2}}</span> <i class="icon-return-boldleft"></i></li>
    </ul>
    <ul class="notice">
      <li>停诊说明</li>
      <textarea name="" id="" cols="30" rows="10" v-model="t3" maxlength="100" :placeholder="note"></textarea>
    </ul>
  </div>
  <button class="submit" @click.stop="submit">
    确认发布
  </button>
</div>
</template>

<script>
  import {Toast} from '../../components/hw-components'
export default{
    data(){return{
       t1 : '',
       t2 : '',
       t3 : ''
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '发布停诊通知', fShow : true, hShow : true});
      this.$means.picker3(0,100);
      let s = this.$route.query.note;
      if(s){
          s = JSON.parse(s);
          this.t1 = s.date_start;
          this.t3 = s.note;
      }
      let s1 = this.$route.query.info;
      if(s1){
          s1 = JSON.parse(s1);
          this.t1 = s1.appoint_date;
          this.t2 = s1.appoint_date;
      }
    },
    mounted(){
      if(this.$route.query.info){
        document.querySelector('.nav_back').onclick =()=>{
          this.$router.routeBack({filter : JSON.stringify({status : 'open' , page : 1})});
        }
      }else{
        document.querySelector('.nav_back').onclick =()=>{
          this.$router.routeBack();
        }
      }
    },
    computed : {
       note(){
           if(this.t1 || this.t2){
               if(this.t2 && this.t1 == this.t2){
                 return `会员朋友，我于${this.t1 || this.t2}当日停诊，请大家合理安排就诊时间，谢谢！`;
               }else{
                 return `会员朋友，我于${this.t1}至${this.t2}停诊，请大家合理安排就诊时间，谢谢！`;
               }
           }else{
             return '请输入停诊备注（例如：停诊原因、停诊说明等）'
           }
       }
    },
    methods: {
      chooseTime(v){
        this.$picker3.show(e => {
            if(v == '1'){
                this.t1 = e.text;
            }else{
                if(e.text < this.t1){
                  Toast('请设置合理的结束时间！');
                  return false;
                }else{
                  this.t2 = e.text;
                }
            }
        })
      },
      submit(){
          this.$api.oAppointStop({
             date_start : this.t1,
             date_end : this.t2,
             note : this.t3  || this.note
          }).then(obj=>{
              this.$router.routeBack();
          })
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
.container{
  overflow: hidden;
  .content{
    height: calc(100% - 1.4rem);
    overflow-y: scroll;
    h6{
      padding: 0.14rem 0.3rem 0;
      font-size: 0.26rem;
      line-height: 0.56rem;
      height: 0.56rem;
      color: $fGray;
    }
    .time{
      background: white;
      padding-left: 0.3rem;
      li{
        border-bottom: 1px solid $gray;
        font-size: 0.32rem;
        height: 1rem;
        line-height: 1rem;
        display: flex;
        justify-content: space-between;
        padding-right: 0.63rem;
        position: relative;
        span:nth-of-type(1){
          font-weight: bold;
        }
      }
      .icon-return-boldleft{
        color: $iconGray;
        transform: translateY(-50%) rotateY(180deg);
        font-size: 0.33rem;
        position: absolute;
        right: 0.26rem;
        top: 50%;
      }
    }
    .notice{
      margin-top: 0.2rem;
      background: white;
      padding: 0 0.3rem 0.3rem;
      font-size: 0.32rem;
      li{
        height: 0.85rem;
        line-height: 0.85rem;
        font-weight: 600;
      }
      textarea{
        display: inline-block;
        width:100%;
        height: 2.24rem;
        box-sizing: border-box;
        padding: 0 0.17rem;
        font-size: 0.26rem;
        line-height: 0.66rem;
        color: $fGray;
        border: 1px solid $gray;
        &::-webkit-input-placeholder{
          font-size: 0.26rem;
        }
      }
    }
  }
}
.gray{
  color: $fGray;
}
.submit{
  display: block;
  margin: 0.2rem auto;
  width: 6.9rem;
  height: 1rem;
  line-height: 1rem;
  background: #0693fc;
  color: white;
  font-size: 0.4rem;
  text-align: center;
  border-radius: 0.06rem;
}
</style>
