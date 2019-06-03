<template>
<div class="setPreWrap">
  <div class="head">
     <i class="back icon-return-boldleft" @click.stop="$router.routeBack()"></i>
     <button class="pre" @click.stop="$router.push({path : `/${id}/teamInfoPre`})">预览</button>
     <div class="info">
       <div class="headInfo">
         <template v-if="team.owner.face">
           <img src="" v-img1="head(team.owner.face)" alt="">
         </template>
         <template v-else>
           <i class="team-head">
             <template v-if="team.owner.sex == '男'">
               <i class="icon-team-head-b">
                 <span class="path1"></span><span class="path2"></span>
               </i>
             </template>
             <template v-else>
               <i class="icon-team-head-g">
                 <span class="path1"></span><span class="path2"></span>
               </i>
             </template>
           </i>
         </template>
       </div>
       <div class="con">
         <h6 :class="['title',{'title_mul': /<br>/.test(title)} ]" v-html="team.team.title"></h6>
         <h6 class="name">{{team.owner.name}} <i>
             <span class="icon icon-team-lead1">
               <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span>
             </span>
         </i></h6>
       </div>
     </div>
  </div>
  <div class="content">
    <div class="con_head" @click.stop="$router.push({path : `/${team.owner.account}/${team.team.id}/teamNotice`})">
       <span class="type"><i class="icon-team-horn"><span class="path1"></span><span class="path2"></span></i>团队公告</span>
       <i class="pre  icon-return-right"></i>
    </div>
    <!--<span class="line"></span>-->
    <p class="title">{{team.notice.content ? (team.notice.content.length > 60 ?  team.notice.content.substring(0,60)+ '...'  : team.notice.content.substring(0,60)) : '暂无公告'}}</p>
  </div>
  <div class="switch">
    团队消息免打扰  <hwSwitch v-model="checked" @change="change"></hwSwitch>
  </div>
  <h6 class="tip" :style="{opacity :checked ? 0 : 1 }">你将不会收到本团队聊天的消息提醒</h6>
  <div class="content">
    <div class="con_head">
      <span class="type"><i class="icon-team-cell"></i>团队成员<span class="count">({{team.members.length}}人)</span></span>
    </div>
  </div>
  <div class="info_modules" v-for="(item,index) in team.members">
    <div class="headimg">
      <template v-if="item.face">
        <img src="" v-img="head(item.face)" alt="">
      </template>
      <template v-else>
        <i class="team-head">
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
        </i>
      </template>
      <i class="bage"><span class="icon icon-team-lead2" v-show="index == 0">
               <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span>
             </span></i>
    </div>
    <div class="other_info">
      <h6 class="info_t"><span class="name">{{item.name}}</span><span class="technical">{{item.technical}} </span></h6>
      <h6 class="info_b"><span class="hospital">{{item.hospital}}</span><span class="depart">{{item.department}}</span></h6>
    </div>
  </div>
</div>
</template>

<script>
import hwSwitch from "../../components/hwSwitch.vue"
  export default{
    created(){
      this.$store.commit('UPDATE_NAV',{hShow : false , fShow : false} );
      this.id  = this.$route.params.id;
      this.$api.teamDetail(this.$route.params.id).then(obj=>{
        obj.team.title = this.title(obj.team.title);
        obj.members.unshift(obj.owner);
        if(obj.team_set.is_reject_msg == '1'){
          this.checked = true;
        }else{
          this.checked = false;
        }
        this.team = obj;
      })
    },
    components:{hwSwitch},
    data(){return{
       checked : false,
       team : {
         members : [],
         notice : {},
         owner : {},
         team : {},
         teamChatSet : {}
       },
       id : '',
       docInfo : {face : ''}
    }},
    methods:{
        change(v){
          let status = v ?  1 : 2;
          this.$api.teamRejectMsg(this.id,{is_reject_msg : status}).then(obj=>{
            console.log(obj);
          })
        },
        title(v){
          if(v.length >= 13){
            v = v.split('');
            v.splice(10,0,"<br>");
            v = v.join('');
          }
          return v;
        },
        head(v){
          return `${DOCLINKAPI}${v}`;
        },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
.setPreWrap{
  height: 100%;
  overflow: scroll;
  .head{
    background: $baseGreen;
    height: 2.8rem;
    position: relative;
    border: 1px solid $baseGreen;
    box-sizing: border-box;
    .back{
      color: white;
      font-size: 0.42rem;
      position: absolute;
      left: 0.2rem;
      top:0.2rem;
    }
    .pre{
      color: white;
      font-size: 0.28rem;
      line-height: 0.42rem;
      position: absolute;
      right: 0.2rem;
      background: $baseGreen;
      top:  0.2rem;
    }
    .info{
      height: 1.6rem;
      width: 6.3rem;
      font-size: 0.36rem;
      line-height: 0.4rem;
      color: white;
      margin-top: 0.76rem;
      margin-left: 0.4rem;
      padding-left: 1.8rem;
      box-sizing: border-box;
      position: relative;
      display: flex;
      align-items: center;
      img,.headInfo{
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 50%;
        position: absolute;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        background: $gray_d_c;
        .team-head {
          display: inline-block;width: 0.78rem;
          height: 0.78rem;
          line-height: 0.78rem;
          i{
            font-size: 0.78rem;
          }
        }
      }
      .headInfo{
        top:0;
        left: 0;
        border: 2px solid  $baseGreen_c;
      }
      //27 36 25 34
      .title{
         margin-bottom: 0.34rem;
        word-break: break-all;
      }
      .title_mul{
        margin-bottom: 0.25rem;
      }
      .name{
        display: inline-block;
        font-size: 0.28rem;
        line-height: 0.28rem;
        padding-right: 0.72rem;
        position: relative;
        i{
          display: inline-block;
          width: 0.65rem;
          height: 0.4rem;
          position: absolute;
          top: -0.06rem;
          right: 0;
          .icon{
            font-size: 0.28rem;
            position: absolute;
            top: 0.05rem;
            left: 0;
          }
        }
      }
    }
  }
  .content{
    background: white;
    .con_head{
      box-sizing: border-box;
      padding:0.26rem 0 0.13rem;
      width: calc(100% - 0.6rem);
      background: white;
      margin: 0 auto;
      font-size: 0.32rem;
      line-height: 0.4rem;
      color: $gray_a;
      display: flex;
      align-items: center;
      border-bottom: 1px solid $gray_e;
      justify-content: space-between;
      .type{
        position: relative;
        padding-left: 0.48rem;
        i{
          display: inline-block;
          width: 0.35rem;
          height: 0.35rem;
          border-radius: 50%;
          /*border: 1px solid red;*/
          font-size: 0.35rem;

          position: absolute;
          left: 0;
          top: 0.02rem;
          box-sizing: border-box;
        }
      }
      .pre{
        font-size: 0.34rem;
        color: $gray_c;

      }
      .count{
        color: $gray_b;
        font-size: 0.32rem;
      }
    }
    .title{
      font-size: 0.32rem;
      line-height: 0.4rem;
      color: $gray_b;
      padding: 0.16rem 0.3rem 0.26rem;
      margin-bottom: 0.2rem;
      background: white;
      word-break: break-all;
    }
  }
  .switch{
    font-size: 0.32rem;
    line-height: 0.4rem;
    background: white;
    height: 0.93rem;
    padding: 0 0.3rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tip{
    font-size: 0.24rem;
    line-height: 0.44rem;
    padding-left: 0.3rem;
    box-sizing: border-box;
    color: $gray_c;
    margin-bottom: 0.2rem;
  }
  .info_modules{
    padding: 0.2rem 0.3rem 0 0.3rem;
    background: white;
    position: relative;
    .headimg{
      width: 1.2rem;
      height: 1.2rem;
      position: absolute;
      left: 0.3rem;
      line-height: 0;
      top:0.2rem;
      img{
        display: inline-block;
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;
        background: $gray_f;
      }
      .team-head{
        display: inline-block;
        width: 1.2rem;
        height: 1.2rem;
        text-align: center;
        line-height: 1.2rem;
        border-radius: 50%;
        background: $gray_d_c;
        i{
          font-size: 0.78rem;
        }
      }
      .bage{
        display: inline-block;
        width: 0.3rem;
        height: 0.3rem;
        position: absolute;
        bottom: 0rem;
        left: 0.84rem;
        .icon{
          font-size: 0.32rem;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
    }
    .other_info{
      display: flex;
      align-content: center;
      flex-wrap: wrap;
      min-height: 1.2rem;
      padding-left: 1.4rem;
      padding-bottom: 0.2rem;
      border-bottom: 1px solid $gray_e;
      /*height: 1.4rem;*/
      /*border: 1px solid red;*/
      .info_t{
        line-height: 0;
        width: 100%;
        .name{
          font-size: 0.33rem;
          color: $gray_a;
          margin-right: 0.2rem;
          line-height: 0.36rem;
        }
        .technical{
          line-height: 0.36rem;
          font-size: 0.26rem;
          color: $gray_b;
        }
      }
      .info_b{
        line-height: 0.36rem;
        width: 100%;
        font-size: 0.26rem;
        color: $gray_b;
        margin-top: 0.1rem;
        .hospital{
          margin-right: 0.15rem;
        }
      }
    }
  }
}
</style>
