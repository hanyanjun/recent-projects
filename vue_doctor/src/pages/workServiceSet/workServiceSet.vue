<template>
  <div class="container">
    <nav class="content">
      <template v-if="!set">
          <router-link  to="/freeSetting" class="doc">免费随访<span>{{info.free_switch == '2' ? '已开通' : '未开通'}}</span><i class="icon-return-boldleft"></i></router-link>
          <a  href="javascript:;" @click.stop="skip('IT-consult')" class="chat ">图文咨询<span></span><i class="icon-return-boldleft"></i></a>
          <!--<a href="javascript:;"  class="phone " v-todo>电话咨询</a>-->
          <router-link  to="/callSet"  >电话咨询<span>{{info.call_switch  == '2' ? '已开通' : '未开通'}}</span><i class="icon-return-boldleft"></i></router-link>
          <router-link href="javascript:;"   to="/appointmentSet" class="order">门诊预约 <span>{{info.appoint_switch  == '2' ? '已开通' : '未开通'}}</span><i class="icon-return-boldleft"></i></router-link>
      </template>
      <template v-else>
          <router-view></router-view>
          <!--<a  href="javascript:;" @click.stop="" class="chat ">图文咨询（半年）<span>{{info.chat_switch == '2' ? '已开通' : '未开通'}}</span><i class="icon-return-boldleft"></i></a>-->
          <router-view name="part"></router-view>
          <!--<a  href="javascript:;" @click.stop="" class="chat ">图文咨询（全年）<span>{{info.chat_switch == '2' ? '已开通' : '未开通'}}</span><i class="icon-return-boldleft"></i></a>-->
          <router-view name="all"></router-view>
      </template>
      <!--<a href="javascript:;" @click.stop="skip('family-consult')" to="family-consult" class="doc ">图文咨询（按期） <span>{{info.family_switch == '2' ? '已开通' : '未开通'}}</span><i class="icon-return-boldleft"></i></a>-->
    </nav>
  </div>

</template>

<script>
  import {Toast} from '../../components/hw-components'
export default{
    name : 'workServiceSet',
    data(){return{set : false}},
    created (){
      this.$store.commit('UPDATE_NAV',{title : '工作室服务设置', fn : '',router : '', fShow : false, hShow : true});
      this.$store.state.chatService = Object.assign([],[false,false,false]);
      this.set = this.$route.meta.set;
    },
    computed:{
        info(){
            return this.$store.state.docInfo;
        },
        chatService(){
          return this.$store.state.chatService;
        }
    },
    methods :{
      skip(){
        this.$router.push({path : '/workServiceSet/consultSet'});
      },
      routeChange(){
        this.$store.commit('UPDATE_NAV',{title : '工作室服务设置', fn : '',router : '', fShow : false, hShow : true});
        this.set = this.$route.meta.set;
      },
      t(){
        this.$router.push({path : '/workServiceSet/consultSet'})
      }
    },
    watch : {
      '$route' : 'routeChange',
      set(v){
        if(v){
          this.$store.commit('UPDATE_NAV',{title : '图文咨询设置', fn : '保存', hShow : true});
        }
      },
      chatService : {
        handler : function(v){
          if(v[0] && v[1] && v[2]){
            Toast('保存成功!');
            this.$store.state.chatService = Object.assign([],[false,false,false]);
          }
        },
        deep : true
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  body{
    background: rgb(242, 243, 245);
  }
  .container{
    overflow: scroll;
  }
  .content{
    /*background: white;*/
    overflow-y: scroll;
    /*height: 5rem;*/
    box-sizing: border-box;
  }
  .container a{
    padding-left: 0.30rem;
    display: block;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.32rem;
    line-height: 1rem;
    padding-right: 0.74rem;
    margin-bottom: 0.2rem;
    color: $gray_a;
    text-align: left;
    position: relative;
    background: white;
    span{
      font-size: 0.28rem;
      color: $baseBlue;
    }
  }
  .container .phone{
    color: $gray_c;
  }
  .module{
    height: 1rem;
    overflow: hidden;
    margin-bottom: 0.2rem;
  }
  .module-active{
    height: auto;
  }
  .icon-return-boldleft{
    position: absolute;
    right: 0.4rem;
    color: $gray_c;
    transform: translateY(-50%) rotateY(180deg);
    font-size: 0.26rem;
    top: 50%;
  }
</style>
