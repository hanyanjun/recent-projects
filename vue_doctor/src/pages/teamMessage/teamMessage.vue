<template>
<div class="teamMsgWrap">
<empty :config="{show : createL == 0 && joinL == 0, text : '暂时还没有团队哦！'}"></empty>
<div class="WrapModule" v-show="createL != 0 ">
  <h6 class="t_type">我创建的团队</h6>
  <h6 class="empty" v-show="createL == 0">暂无</h6>
  <div class="teamCon">
    <div class="modules" v-for="item in myTeam" @click.stop="skip(item)" v-show="item.review == '1'">
      <div class="imgs">
        <img src="" alt=""  v-img="head(item.headimg)">
        <i class="circle"  v-show="item.unread_num > 0"></i>
      </div>
      <div class="content">
        <h6 class="t_name omit">{{item.title}}专家团队</h6>
          <h6 class="t_text omit">
            <i class="green" v-show="item.is_at_me == 1">[有人@了你]&nbsp;&nbsp;&nbsp;</i>
            {{item.text || '暂无消息'}}</h6>
      </div>
      <div class="time">
        <h6 class="t_time">{{$means.timestampTotime(item.msg_timestamp) ||  '无记录'}}</h6>
        <template v-if="item.unread_num > 0">
          <h6 :class="['t_count',(item.unread_num).toString().length < 2 ? 'one-style' : 'two-style']" v-show="item.unread_num">{{item.unread_num > 99 ? '99+' : (item.unread_num || 0)}}</h6>
        </template>
      </div>
    </div>
  </div>
</div>
  <div class="WrapModule" v-show="joinL!= 0">
    <h6 class="t_type">我加入的团队</h6>
    <h6 class="empty" v-show="joinL == 0">暂无</h6>
    <div class="teamCon">
      <div class="modules" v-for="item in joinTeam" @click.stop="skip(item)" v-show="item.review == '1'">
        <div class="imgs">
          <img src="" alt=""  v-img="head(item.headimg)">
          <i class="circle"  v-show="item.unread_num > 0"></i>
        </div>
        <div class="content">
          <h6 class="t_name omit">{{item.title}}专家团队</h6>
            <h6 class="t_text omit">
              <i class="green" v-show="item.is_at_me == 1">[有人@了你]&nbsp;&nbsp;&nbsp;</i>{{item.text || '暂无消息'}}</h6>
        </div>
        <div class="time">
          <h6 class="t_time">{{$means.timestampTotime(item.msg_timestamp) ||  '无记录'}}</h6>
          <template v-if="item.unread_num > 0">
            <h6 :class="['t_count', (item.unread_num).toString().length < 2 ? 'one-style' : 'two-style']"  v-show="item.unread_num">{{item.unread_num > 99 ? '99+' : (item.unread_num || 0)}}</h6>
          </template>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import empty from '../../components/empty'
export default {
  name : 'teamMessage',
  created(){
    this.$store.dispatch('teamList');
    this.$store.commit('UPDATE_NAV',{title : '',fn : '', router : '', hShow : false,fShow : true});
  },
  components:{empty},
  computed:{
    joinTeam(){
      return this.$store.state.myTeam.joinTeam;
    },
    myTeam(){
      return this.$store.state.myTeam.myTeam;
    },
    joinL(){
      let a = 0;
      this.joinTeam.forEach((v)=>{
        if(v.review == '1'){
          ++a;
        }
      })
      return a;
    },
    createL(){
      let a = 0;
      this.myTeam.forEach((v)=>{
        if(v.review == '1'){
          ++a;
        }
      })
      return a;
    }
  },
  methods:{
    skip(v){
       this.$router.push({path : `/empty/${v.id}/groupConsult` , query : {num : Number(v.unread_num) , time : Number(v.unread_timestamp) , id : v.unread_chat_id}});
    },
    head(v){
      return `${v}?${Date.parse(new Date())}`
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
.teamMsgWrap{
    .empty{
      font-size: 0.28rem;
      padding: 0.1rem 0.2rem;
      box-sizing: border-box;
      color: $gray_c;
      line-height: 1.4;
    }
    .WrapModule{
      background: white;
      padding-bottom: 0.4rem;
      margin-bottom: 0.2rem;
      .t_type{
        padding: 0.1rem 0.2rem 0;
        font-size: 0.28rem;
        color: $gray_c;
        line-height: 0.48rem;
        box-sizing: border-box;
        border-bottom: 1px solid $gray_e;
      }
      .teamCon{
        padding: 0 0.2rem;
        font-size: 0.32rem;
        .modules{
          border-bottom: 1px solid $gray_e;
          padding: 0.2rem 0 0.2rem 1.2rem;
          box-sizing: border-box;
          position: relative;
          /*overflow: hidden;*/
          .imgs{
            width: 1.02rem;
            height: 1.02rem;
            background: $imgs_b;
            border-radius: 0.04rem;
            position: absolute;
            border-radius: 50%;
            top: 0.2rem;
            left: 0;
            .circle{
              display: inline-block;
              width: 0.24rem;
              height: 0.24rem;
              border-radius: 50%;
              background: $red_b;
              position: absolute;
              top: -0.08rem;
              left: 0.94rem;
            }
            img{
              width: 100%;
              height: 100%;
              border-radius: 50%;
              top:0;
              left: 0;
              position: absolute;
            }
          }
          .content{
            width: auto;
            max-width: 80%;
          }
          .content,.time{
            height: 1rem;
          }
          .time{
            text-align: right;
            box-sizing: border-box;
            position: absolute;
            right: 0;
            top: 0.2rem;
          }
          .t_name{
            max-width: 3.6rem;
            line-height: 0.48rem;
            margin-bottom: 0.06rem;
          }
          .t_time{
            font-size: 0.24rem;
            line-height: 0.48rem;
            margin-bottom: 0.06rem;
            color: $gray_c;
            text-align: right;
            white-space: nowrap;
          }
          .t_count{
            font-size: 0.24rem;
            display: inline-block;
            line-height: 0.46rem;
            color: $gray_c;
            text-align: right;
          }
          .one-style, .two-style {
            color: #fff;
            height: 0.32rem;
            line-height: 0.34rem;
            text-align: center;
            box-sizing: border-box;
          }
          .one-style {
            padding: 0 0.15rem;
            background: #7ecef4;
            display: inline-block;
            border-radius: 40%;
          }
          .two-style {
            padding: 0 0.17rem;
            background: #fe6d40;
            border-radius: 0.14rem;
          }
          .no-style {
            background: white;
            color: white;
          }
          .t_text{
            font-size: 0.24rem;
            color: $gray_c;
            line-height: 0.46rem;
          }
          .green{
            color: $baseGreen;
          }
        }
      }
    }
}
</style>
