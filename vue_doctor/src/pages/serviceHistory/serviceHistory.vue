<template>
<div class="container">
  <div class="chatnav">
    <b @click.stop="$router.routeBack()"></b>
    <div class="sele">
      <router-link to="userInfo" class="userInfo">会员档案</router-link>
      <router-link to="chat" class="chat">会员对话</router-link>
      <router-link to="serviceHistory" class="serviceHistory">服务记录</router-link>
    </div>
  </div>
  <ul class="serviceInfo">
    <li class="info">
      <i class="icon-return-boldleft" v-show="service.order_status != '2'"></i>
      <h6 class="title">当前服务</h6>
      <h6 class="text">
        <template v-if="service.order_status == '2'">
          <template v-if="service.order_type == '4'">
            <i class="icon1"></i>{{`免费咨询剩余${service.day ?　`${service.day}天` : ''}${service.count_usage == '0' ?  '' :  service.count_remain + '条'}`}}
          </template>
          <template v-else-if="service.order_type == '3'">
            <i class="icon-chat-consult icon"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></i>{{`图文咨询（按期）服务咨询剩余${service.day}天`}}
          </template>
          <template v-else>
            <i class="icon-chat-consult icon">
            <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span>
            </i>
            {{`图文咨询（按次）服务咨询剩余${service.count_remain}条`}}
          </template>
        </template>
        <template v-else>
          当前没有服务项目！
        </template>
        <router-link :to="`/freeSetting?acc=${$route.params.chat_hx_account}`" v-show="service.order_status == '3' || service.order_status == '4'">设置免费随访</router-link>
      </h6>
    </li>
    <li class="fn" @click.stop="$router.push({path  : 'serviceHistoryDetail'})">
      <i class="icon-return-boldleft"></i>
      历史订单
    </li>
  </ul>
</div>
</template>

<script>
  import loadingMore from  '../../components/loadingMore'
  import empty from '../../components/empty'
export default{
    name : 'serviceHistory',
    data(){return{arr : [],filter : {page : 0}}},
    components:{loadingMore,empty},
    created (){
      this.$store.commit('UPDATE_NAV',{fShow : false, hShow : false});
    },
    computed:{
        service(){
            return this.$store.state.chat.patService;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  @import "../../assets/css/common";
  .chatnav{
    height: 0.8rem;
    background: #2a8cff;
    display: flex;
  }
  .chatnav b{
    width: 0.68rem;
    text-align: center;
    display: inline-block;
    background: url(../.././assets/media/img/nav-back_icon.png) no-repeat left .2rem center;
    background-size: .2rem .34rem;
  }
  .chatnav .sele{
    margin-left: 0.2rem;
    width: 6.62rem;
    height:0.8rem;
    display:flex;
  }
  .chatnav a{
    display: inline-block;
    font-size: 0.32rem;
    color: #95c6ff;
    line-height: 0.8rem;
    width: 1.4rem;
    margin-right:0.87rem;
  }
  .sele .serviceHistory{
    color:#fff;
    position: relative;
  }
  .sele .serviceHistory p{
    border: 0.12rem solid #fff;
    border-left: 0.12rem solid transparent ;
    border-right: 0.12rem solid transparent ;
    border-top: 0.12rem solid transparent ;
    position: absolute;
    bottom:0;
    left: 0.58rem;
  }
  .serviceInfo{
    background: white;
    padding: 0 0.34rem 0 0.3rem;
    li{
      position: relative;
    }
    .info{
      font-size: 0.28rem;
      color: $fGray;
      padding: 0.24rem 0;
      line-height: 0.5rem;
      border-bottom: 1px solid $gray;
      .title{
        font-size: 0.32rem;
        color: black;
      }
      .text{
        display: flex;
        align-items: center;
      }
      .icon{
        font-size: 0.4rem;
        margin-right: 0.1rem;
      }
      .icon1{
        display: inline-block;
        width: 0.4rem;
        height: 0.4rem;
        background: url(../../assets/media/img/freeServiceIcon.png) no-repeat;
        background-size: contain;
        margin-right: 0.1rem;
      }
      a{
        position: absolute;
        right: 0.8rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.32rem;
      }
    }
    .fn{
      line-height: 1rem;
      font-size: 0.32rem;
      color: black;
    }
    .icon-return-boldleft{
      color: $iconGray;
      transform: translateY(-50%) rotateY(180deg);
      font-size: 0.4rem;
      position: absolute;
      right: 0.3rem;
      top: 50%;
    }
  }
</style>
