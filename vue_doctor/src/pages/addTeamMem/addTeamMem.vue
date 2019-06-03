<template>
<div class="addTeamMem">
   <div class="allMem">
     <h6 class="title" @click.stop="allTeam">全部成员 <i class="icon icon-return-right"></i> <span class="line"></span> </h6>
     <div class="imgs">
       <div class="headimg" v-for="(item,index) in arr"  v-if="item && index <= 8">
       <div class="head">
         <span class="bage icon-team-lead2" v-show="index == 0">
             <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span>
         </span>
         <template v-if="item.face">
           <img src="" v-img="head(item.face)" alt="">
         </template>
         <template v-else>
             <template v-if="item.sex == '男'">
               <i class="icon-team-head-b">
                 <span class="path1"></span><span class="path2"></span>
               </i>
             </template>
             <template v-else>
               <i class="icon-team-head-g">
                 <span class="path1"></span><span class="path2"></span>
               </i>
             </template>
         </template>
       </div>
       <span class="text">{{item.name}}</span>
       <i class="icon-deletegroup" v-show="index != 0" @click.stop="deleMem(item,index)"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
     </div><div class="headimg" @click.stop="inviteDoc">
       <div class="head">
         <!--<img src="" alt="">-->
         <i class="icon-team-addDoc"></i>
       </div>
     </div>

     </div>
   </div>
  <h6 class="margin"></h6>
  <h6 class="module" @click.stop="change"><span class="type">专家团队名称</span> <span class="text">{{title ? title : '请输入专家团队的名称'}}</span> <i class="icon icon-return-right"></i> </h6>
  <h6 class="module" @click.stop="skipConsultSet"><span class="type">团队咨询服务</span> <span class="text">{{teamChatSet.price && teamChatSet.switch == '2' ? `${teamChatSet.price}元/次` : '未设置'}}</span><i class="icon icon-return-right"></i> </h6>
  <h6 class="margin"></h6>
  <div class="skill">
    <h6>专家团队专业擅长 <span>*</span></h6>
    <div class="content">
      <textInput holder="请描述您的团队擅长治疗领域、团队特色等请描述您的 团队擅长治疗领域、团队特色等"  maxLength="500"  :trim="true" :minRows="2" v-model="skill"></textInput>
    </div>
  </div>
  <div class="skill">
    <h6>专家团队简介</h6>
    <div class="content">
      <textInput holder="请描述您的团队简介或领衔专家介绍，让用户更加了解 专家团队（可不填，即不显示简介）"  maxLength="500" :trim="true"  :minRows="2" v-model="intro"></textInput>
    </div>
  </div>
</div>
</template>

<script>
import {Toast,MessageBox} from '../../components/hw-components'
import textInput from "../../components/textInput"
export default {
  name: "addTeamMem",
  created(){
    this.$store.commit('UPDATE_NAV',{title : '专家团队名称', theme : 'green', fn : '保存', hShow : true});
    this.id  = this.$route.params.id;
    this.$api.teamDetail(this.id).then(obj=>{
       [this.skill,this.intro,this.title,this.arr,this.teamChatSet] = [obj.team.skill,obj.team.note,obj.team.title,obj.members,obj.teamChatSet];
       this.$store.commit('UPDATE_NAV',{title : this.title, theme : 'green', fn : '保存', hShow : true});
       this.prompt.value = this.title;
       this.$store.commit('SET_PROMPT',this.prompt);
       this.arr.unshift(obj.owner);
    });
  },
  data(){return{
    skill : '', intro : '', title : '', arr : [], id : '',teamChatSet : {price : ''},docInfo : {},
    prompt : {show : false ,title : '请输入团队名称',holder : '最长输入20个字符',tip : '',value : ''},
    invite : {
       show : true,
       head : [{text : '添加成员'}],
       select : [ {icon : 'icon-weixin-icon' , text : '微信发送邀请', suf : 'icon-return-right',style : [{paddingLeft : '1.75rem'}],iconStyle :[{marginRight : '0.2rem'}]},
                   {icon : 'icon-team-sms' , text : '短信发送邀请', suf : 'icon-return-right',style : [{paddingLeft : '1.75rem'}],iconStyle :[{marginRight : '0.2rem'}]}],
       btn : [{text : '取消', style : [{marginTop : '0.2rem'}] , method : ()=> {
            this.invite.show = false;
         }}]
    }
  }},
  components:{textInput},
  methods:{
    skipConsultSet(){
      window.sessionStorage['teamPrice'] = JSON.stringify(this.teamChatSet);
      this.$router.push(`/${this.id}/teamPriceSet`)
    },
    change(){
      this.prompt.show = true;
      this.prompt.callback = (t) =>{
        if(t == '取消'){
          this.prompt.show = false;
          this.prompt.tip = '';
        }else{
          t = t.trim();
          this.prompt.value = t;
          if(t.length  == 0 ){
            this.prompt.tip = '请输入团队名称!';
          }else if(t.length > 20){
            this.prompt.tip = '团队名称最长20个字符!';
          }else{
              this.prompt.tip = '';
              this.prompt.show = false;
              this.title = t;
          }
        }
      }
    },
    allTeam(){
      this.$router.push(`/${this.id}/teamInfoMem`);
    },
    deleMem(v,i){
      MessageBox.confirm('移除成员后，该会员将被从我的团队中删除,确定移除?').then(obj=>{
        this.$api.deleTeamMem(this.id,v.doctors_id).then(_=>{
          this.arr[i] = '';
          this.arr = Object.assign([],this.arr);
        })
      })
    },
    head(v){
      return DOCLINKAPI + v;
    },
    inviteDoc(){
     this.invite.show = true;
     this.invite.select[0].method = ()=>{
       this.$store.state.shareMask.show  = true;
       this.$store.state.shareMask.type  = '1';
       this.$store.dispatch('wxShowShare');
       let title;
       if(this.info.hm_title){
         title = `${this.info.hm_title}邀请您加入${this.title}专家团队`;
       }else{
         title = `${this.info.name}医生邀请您加入${this.title}专家团队`;
       }
       this.$store.dispatch('wxShareTimeLineT',{
         title : title,
         link : `${DOCSTATICLINK}/index.html#/${this.info.account}/${this.id}/sharenoAccwxInviteTeamMem`
       }).then(t=>{
         if(t == '成功'){
           this.$api.addTeamTag(this.id)
         }
         this.$store.state.shareMask.show = false;
         this.invite.show = false;
       });
       this.$store.dispatch('wxShareAppMessageT',{
         title : title,
         desc : '加入专家团队，提升专业能力，共同推广品牌形象。',
         link : `${DOCSTATICLINK}/index.html#/${this.info.account}/${this.id}/sharenoAccwxInviteTeamMem`
       }).then(t=>{
         if(t == '成功'){
           this.$api.addTeamTag(this.id)
         }
         this.$store.state.shareMask.show = false;
         this.invite.show = false;
       });
     }
     this.invite.select[1].method = ()=>{
       window.sessionStorage.removeItem('teamMemSms');
       this.$router.push(`/${this.id}/teamInviteSms`);
       this.invite.show = false;
     }
     this.$store.commit('SET_SHEET_SELECT',this.invite);
    }
  },
  computed:{
    info(){
      return this.$store.state.docInfo;
    }
  },
  mounted(){
    document.querySelector('.nav_submit').onclick = _=>{
      if(this.arr[0].account != this.info.account){
        Toast('团队创建者才可修改信息！');
        return;
      }
      if(this.skill.length == 0){
        Toast('团队擅长必填！');
      }else{
        this.$api.updateTeam(this.id,{
          title : this.$means.n_br(this.title),
          skill : this.$means.n_br(this.skill),
          note : this.$means.n_br(this.intro)
        }).then(obj=>{
          this.$router.push(`/${this.id}/teamInfoPre`);
        })
      }
    };
  }
}
</script>

<style  lang="scss" scoped>
@import "../../assets/css/common";
.addTeamMem{
  height: 100%;
  overflow: scroll;
  background: white;
}
.allMem{
  .title{
    padding: 0 0.3rem;
    font-size: 0.32rem;
    color: $gray_a;
    line-height: 0.98rem;
    background: white;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .icon{
      font-size: 0.34rem;
      color: $gray_c;
      line-height: 0.98rem;
    }
    .line{
      display: inline-block;
      width: 100%;
      height: 1px;
      background: $gray_e;
    }
  }
  .imgs{
     padding:  0.2rem 0.35rem 0 0.25rem;
     background: white;
     font-size: 0.28rem;
      line-height: 0;
    .headimg{
      width: 1.2rem;
      position: relative;
      display: inline-block;
      text-align: center;
      margin-right: 0.16rem;
      vertical-align: top;
      .head{
        display: inline-block;
        width: 1.2rem;
        height: 1.2rem;
        border: 1px solid $gray_d_c;
        border-radius: 0.04rem;
        background: $gray_d_c;
        text-align: center;
        position: relative;
        line-height: 1.2rem;
        img{
          display: inline-block;
          width: 100%;
          height: 100%;
        }
        i{
          font-size: 0.78rem;
          color: $gray_f;
          line-height: inherit;
          border-radius: 50%;
        }
        .icon-team-addDoc{
          font-size: 1.25rem;
        }
        .bage{
          span{
            line-height: 0.32rem;
            text-align: left;
          }
          position: absolute;
          display: inline-block;
          width: 0.32rem;
          height: 0.26rem;
          left: 0.93rem;
          text-align: left;
          line-height: 0.32rem;
          font-size: 0.32rem;
          top: 0.97rem;
        }
      }
      span{
        line-height: 0.5rem;
        color: $gray_a;
      }
      .text{
        display: inline-block;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .icon-deletegroup{
        font-size: 0.44rem;
        position: absolute;
        right: -0.13rem;
        top: -0.1rem;
        background: $gray_d_c;
        border-radius: 50%;
        color: red;
      }
    }
    /*&>.headimg:nth-child(1)>.head{*/
        /*background: url("../../assets/media/img/baage-lead.png")   no-repeat right top;*/
        /*background-size: 0.6rem 0.6rem;*/
      /*}*/
   .headimg:nth-of-type(5n+5){
      margin-right: 0;
    }
    &>.headimg:nth-last-child(1)>.head{
      background: none;
      border: 1px solid transparent;
      /*border: none;*/
     }
  }
}
.module{
  font-size: 0.32rem;
  padding: 0 0.76rem 0 0.3rem;
  line-height: 1rem;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid $gray_e;
  background: white;
  color: $gray_a;
  position: relative;
  .type{
    white-space: nowrap;
    margin-right: 0.1rem;
  }
  .text{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .icon{
    position: absolute;
    font-size: 0.34rem;
    color: $gray_c;
    line-height: 0.98rem;
    right: 0.3rem;
  }
  .text{
    font-size: 0.28rem;
    color: $gray_b;
    display: inline-block;
    text-align: right;
  }
  ::-webkit-input-placeholder{
    color:$gray_b;
  }
}
.skill{
  padding:  0 0.2rem;
  background: white;
  font-size: 0.32rem;
  h6{
    padding-top: 0.1rem;
    padding-left: 0.1rem;
    line-height: 0.72rem;
    color: $gray_a;
    span{
      color: $red_e;
    }
  }
  .content{
    border-radius: 0.06rem;
    border: 1px solid $gray_e;
  }
}
.margin{
  height: 0.2rem;
  background: $gray_e;
}
</style>
