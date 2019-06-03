<template>
<div class="callPhone">
   <div class="callContent">
     <div :class="['callCon_top',{'callCon_top1' : !first}]">
       <img src="../../assets/media/img/callPhone1.png" alt="" class="t_call">
       <template v-if="first">
         <img src="../../assets/media/img/callPhone_arrow1.png" alt="" class="t_arrow1">
         <img src="../../assets/media/img/callPhone_arrow2.png" alt=""class="t_arrow2" >
         <h6>系统同时<br>呼叫双方</h6>
       </template>
       <template v-else>
         <a href="javascript:;" class="tel" v-show="!first">021-31354456</a>
         <a href="javascript:;" class="tip" v-show="!first">即将来电,请注意接听</a>
         <a href="javascript:;" class="ora" v-show="!first">通话免费  号码隐藏</a>
       </template>
     </div>
     <!--<img src="../../assets/media/img/callPhone.png" alt="" data="nopre" class="bg">-->
     <!--<h6 class="tip">系统将同时呼叫双方</h6>-->
     <div class="content" v-show="first">
       <div class="user">
         <img src="" v-img="head"  alt="">
         <span class="name">{{docInfo.name || docInfo.nick}}</span>
         <span class="phone">{{trans(this.from_phone || docInfo.phone)}}</span>
         <button class="modify" @click.stop="modifyP('from_phone')">修改接听电话</button>
       </div>
       <h6 class="fn">
         <span class="fn1">通话免费</span>
         <span class="fn2">号码隐藏</span>
       </h6>
       <div class="user">
         <img src="" v-img="info.pat_face" alt="">
         <span class="name">{{info.name || info.nick}}</span>
         <span class="phone">{{trans(this.to_phone || info.phone)}}</span>
         <!--<button class="modify" @click.stop="modifyP('to_phone')">修改接听电话</button>-->
       </div>
     </div>
     <button :class="['submit',{'submit_time' : time}]" @click.stop="call">{{time ? '00:'+ (time >9 ? time : '0'+ time) : (first ?  '开始通话' :  '重拨')}}</button>
     <h6 class="tip1">如果长时间未来电请重拨<br>双方接听后即可通话</h6>
   </div>
</div>
</template>

<script>
  import {MessageBox} from '../../components/hw-components'
export default {
    name: "callPhone",
    data(){return{
      id : '',
      info : '',
      from_phone : '',
      to_phone : '',
      time : 0,
      is_call : false,
      first : true,
      curModify : '',
      prompt : {show : false ,title : '修改接听电话',holder : '请输入电话',tip : '',value : ''},
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '免费匿名电话', hShow : true , fShow : false});
      this.id = this.$route.params.id;
      this.$api.callOrderDetail(this.id).then(obj=>{
        this.info = obj.data;
      })
      if(window.sessionStorage['is_first_call']){
        this.first = Boolean(window.sessionStorage['is_first_call']);
      }
    },
    computed:{
      docInfo(){
        return  this.$store.state.docInfo;
      },
      head (){
        return this.$store.getters.docStaticHead;
      },
    },
    mounted(){
      document.querySelector('.nav_back').onclick=(e)=>{
      //   if(!this.first){
      //     MessageBox.confirm('与患者通话成功?',{btn : ['返回','重拨'] , tip : '若通话未完成，请重拨'}).then(_ => {
      //       this.$router.routeBack();
      //       //结束咨询情况
      //       // this.$api.callFinish(this.id).then(obj=>{
      //       // })
      //     }).catch(_=>{
      //       //  重拨情况
      //       this.call();
      //     })
      //   }else{
          this.$router.routeBack();
        // }
      }
    },
    methods:{
      call(){
        if(!this.is_call){
          this.is_call = true;
          if(this.first){
            window.sessionStorage['is_first_call'] = 'false';
            this.first = false;
            let time = 10;
            this.time = time;
            let t = setInterval(()=>{
              time--;
              if(time == 0){
                time = 0;
                this.is_call = false;
                clearInterval(t);
              }
              this.time = time;
            },1000)
            this.$api.callbackPhone({id : this.id , from_phone : this.from_phone || this.docInfo.phone , to_phone : this.to_phone || this.info.phone}).then(obj=>{
                console.log(obj);
            })
          }else{
            window.sessionStorage['is_first_call'] = 'true';
            this.is_call = false;
            this.first = true;
          }
        }
      },
      trans(v){
        if(!v) return '';
        return v.substr(0, 3) + "****" + v.substr(7);
      },
      modifyP(v){
        this.$store.commit('SET_PROMPT',this.prompt);
        if(v != this.curModify){
          this.curModify = v;
          this.prompt.value = '';
        }
        this.prompt.tip = '';
        this.prompt.show = true;
        this.prompt.callback =(t)=>{
          t = t.trim();
          if(t == '取消'){
            this.prompt.show = false;
            this.selectData.show = true;
          }else{
            let  mobile = /^1[3|4|5|7|8][0-9]{9}$/.test(t);
            this.prompt.value = t;
            if(t.length == 0){
              this.prompt.tip = '请输入电话';
            }else if(!mobile){
              this.prompt.tip = '请输入正确号码';
            }else{
              this[v] = t;
              this.prompt.show = false;
            }
          }
        }
      }
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.callPhone{
  height: 100%;
  background: $baseBlue;
  padding: 0 0.2rem 0.2rem;
  overflow: hidden;
  box-sizing: border-box;
  .callContent{
    width: 100%;
    height: 100%;
    overflow: scroll;
    background: white;
    border-radius: 0.06rem;
  }
  .callCon_top{
    width: 3.2rem;
    height: 3.05rem;
    margin: 0.8rem auto 0;
    text-align: center;
    position: relative;
    .t_call{
      display: inline-block;
      width: 1.3rem;
      height: 1.3rem;
    }
    .t_arrow1,.t_arrow2{
      display: inline-block;
      width: 0.5rem;
      height: 0.66rem;
      position: absolute;
    }
    .t_arrow1{
      top: 1.78rem;
      left: 0;
    }
    .t_arrow2{
      top: 1.78rem;
      right: 0;
    }
    h6{
      color: $input_c;
      font-size: 0.3rem;
      line-height: 1.2;
      margin-top: 0.5rem;
    }
  }
  .callCon_top1{
    width: auto;
    height: 6.4rem;
    a{
      display: block;
    }
    .tel{
      margin-top: 0.8rem;
      font-size: 0.48rem;
      color: $gray_a;
    }
    .tip{
      margin-top: 0.33rem;
      font-size: 0.32rem;
      color: $input_c;
    }
    .ora{
      margin-top: 0.4rem;
      font-size: 0.28rem;
      color: #ff871d;
    }

  }
  .bg{
    display: block;
    width: 1.32rem;
    height: 1.32rem;
    margin: 1.1rem auto 0.55rem;
  }
  .tip{
    font-size: 0.32rem;
    color: $input_c;
    line-height: 1;
    text-align: center;
  }
  .content{
    font-size: 0.28rem;
    display: flex;
    justify-content: center;
    margin: 0 0 1.14rem;
    img{
      display: inline-block;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      border: 1px solid #d1d1d1;
      margin-bottom: 0.08rem;
    }
    .user{
      display: inline-block;
      width: 1.7rem;
      text-align: center;
      .name{
        display: block;
        color: $gray_a;
        font-size: 0.32rem;
        line-height: 0.78rem;
        margin-top: 0.3rem;
      }
      .phone{
        color: $input_c;
        font-size: 0.28rem;
        display: inline-block;
        margin-bottom: 0.65rem;
      }
      .modify{
        background: white;
        color: $baseBlue;
        line-height: 1;
      }
    }
    .fn{
      width: 2.8rem;
      background: url("../../assets/media/img/callPhone_arrow.png") no-repeat left top 0.56rem;
      background-size: 2.8rem 0.12rem;
      position: relative;
      margin: 0 0.06rem;
      .fn1{
        position: absolute;
        top: 0.2rem;
        display: inline-block;
        width: 100%;
        color: #ff871d;
        line-height: 1;
        text-align: center;
      }
      .fn2{
        position: absolute;
        top: 0.74rem;
        line-height: 1;
        color: #ff871d;
        display: inline-block;
        width: 100%;
        text-align: center;
      }
    }
  }
  .submit{
    display: block;
    margin: 0.2rem auto 0.4rem;
    width: 6.6rem;
    height: 1rem;
    line-height: 1rem;
    background: rgb(6, 147, 252);
    color: white;
    font-size: 0.4rem;
    text-align: center;
    border-radius: 0.06rem;
  }
  .submit_time{
    background: white;
    color: $baseBlue;
    font-size: 0.56rem;
  }
  .tip1{
    font-size: 0.22rem;
    text-align: center;
    color: $input_c;
    line-height: 1.2;
  }
}
</style>
