<template>
  <div class="mes container">
    <empty :config="{show : msg.length < 4 && msg.length > 0 && msg[0].unread_num == 0 &&  msg[1].unread_num == 0 && msg[2].unread_num == 0, text : '暂时还没咨询哦！'}"></empty>
    <section v-for="item in msg"  @click.stop="skip(item)" v-show="item.text && item.from != 'patientReport'">
      <template v-if="item">
        <template v-if="item.from == 'patientAppoint'">
          <i class="icon-system-order-icon" style="font-size: 0.9rem">
            <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span>
          </i>
        </template>
        <template v-else-if="item.from == 'patientOrder'">
          <i class="icon-message-order" style="font-size: 0.9rem">
            <span class="path1"></span><span class="path2"></span><span class="path3"></span>
          </i>
        </template>
        <template v-else>
          <img v-img="item.headimg" alt="">
        </template>
        <ul class="baseInfo">
          <template v-if="item.from == 'patientAppoint'">
            <li class="title f32">预约消息</li>
          </template>
          <template v-else-if="item.from == 'patientOrder'">
            <li class="title f32">我的订单</li>
          </template>
          <template v-else>
            <li class="title f32">{{item.name}}</li>
          </template>
          <li class="text f26">{{text(item.text)}}</li>
        </ul>
        <ul class="other">
          <li class="time f22">{{$means.timestampTotime(item.timestamp)}}</li>
          <!--<li class="num f22"><span :class="item.unread_num == 0 ? 'no-style' : ((item.unread_num).toString().length < 2 ? 'one-style' : 'two-style')">{{item.unread_num > 99 ? '99+' : item.unread_num}}</span></li>-->
          <li class="num f22"><span :class="['f20',item.unread_num == 0 ? 'no-style' : ((item.unread_num).toString().length < 2 ? 'one-style' : 'two-style')]">{{item.unread_num > 99 ? '99+' : item.unread_num}}</span></li>
        </ul>
      </template>
    </section>
  </div>
</template>

<script>
  import empty from '../../components/empty'
  export default{
    name : 'message',
    created (){
      this.$store.commit('UPDATE_NAV',{title : '',fn : '', router : '', hShow : false,fShow : true});
    },
    mounted(){
      this.$store.commit('SET_FOOTER_TAB','1');
    },
    components:{empty},
    computed:{
      msg (){
        let  m = this.$store.state.chat.messageList;
        let arr = [];
        m.forEach((v,i,a)=>{
          if(v.from == 'patientOrder' || v.from == 'patientAppoint'){
            arr.unshift(v);
          }else{
            arr.push(v);
          }
        })
        return  arr;
      },
      link (){
        return PATLINKAPI;
      }
    },
    methods:{
      skip(item){
        if(item.form == 'patientReport'){

        }else if(item.from == 'patientAppoint'){
          this.$store.dispatch('clearCount','patientAppoint').then(()=>{
            this.$router.push({path : '/review/myOrder'});
          });
        }else if(item.from == 'patientOrder'){
          this.$store.dispatch('clearCount','patientOrder').then(()=>{
            this.$router.push({path : '/myIndent'});
          })
        }else{
//          this.$store.dispatch('clearCount',item.from).then(()=>{
            this.$router.push({path : `/${item.account}/chat`})
//          })
        }
      },
//      head(v){
//        if(v.split('_')[1]){
//          return `${PATLINKAPI}/patient/face/${v.split('_')[1]}`;
//        }
//      },
      text(v){
        if(v){
          return  v.split('</br>').join('');
        }else{
          return '';
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .mes {
    background: $bg;
    width:100%;
    height:100%;
    padding-top: 0.2rem;
    box-sizing: border-box;
    section{
      line-height: 0;
      background: white;
      padding-left: 0.3rem;
      width: 100%;
      height: 1.3rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: relative;
      box-sizing: border-box;
      overflow: hidden;
      border-bottom: 1px solid $gray;
      img{
        display: inline-block;
        width: 0.9rem;
        height:0.9rem;
        border-radius: 50%;
      }
      .baseInfo{
        margin-left: 0.17rem;
        width: 5.3rem;
        height:0.9rem;
        line-height: 0.45rem;
        .title{
          /*font-size: 0.32rem;*/
        }
        .text{
          width:100%;
          /*font-size: 0.26rem;*/
          color: #b7b8b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .other{
        height:0.9rem;
        line-height: 0.45rem;
        position: absolute;
        right:0.2rem;
        white-space: nowrap;
        top:0.2rem;
        text-align: right;
        .time{
          color: #b7b8b8;
          /*font-size: 0.22rem;*/
        }
        .num{
          text-align: right;
          /*font-size: 0.22rem;*/
        }
      }
    }
  }
  .mes  .one-style, .mes .two-style {
    color: #fff;

    height: 0.32rem;
    /*font-size: 0.2rem;*/
    line-height: 0.34rem;
    text-align: center;
    box-sizing: border-box;
  }
  .mes .one-style {
    padding: 0 0.15rem;
    background: #7ecef4;
    display: inline-block;
    border-radius: 40%;
  }
  .mes .two-style {
    padding: 0 0.17rem;
    background: #fe6d40;
    border-radius: 0.14rem;
  }
  .mes .no-style {
    background: white;
    color: white;
  }
</style>
