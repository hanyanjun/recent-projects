<template>
  <div class="setPreWrap">
    <div class="head">
      <div class="fn">
        <i class="back icon-return-boldleft" @click.stop="back"></i>
        <template v-if="docInfo.account == info.account">
          <span>我创建的专家团队</span>
          <button class="pre" @click.stop="edit" v-show="docInfo.account == info.account">编辑</button>
        </template>
        <template v-else>
          <span>我加入的专家团队</span>
        </template>
      </div>
      <div :class="['info',{'info_review' : review == '3'}]">
        <div class="headInfo">
          <template v-if="docInfo.face">
            <img src="" v-img1="head(docInfo.face)" alt="">
          </template>
          <template v-else>
            <i class="team-head">
              <template v-if="docInfo.sex == '男'">
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
          <h6 :class="['title',{'title_mul': /<br>/.test(title)} ]" v-html="title"></h6>
          <h6 class="name">{{docInfo.name}} <i>
             <span class="icon icon-team-lead1">
               <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span>
             </span>
          </i></h6>
        </div>
      </div>
    </div>
    <h6 class="head-reviewing" v-show="review == '3'"><i class="icon-team-review"></i>专家团队正在审核中，请耐心等待！</h6>
    <div :class="['content' ,{'content-active' : skillA} ]">
      <div class="con_head" @click.stop="spread('skillA')">
        <span class="type"><i> <span class="icon icon-team-skill"></span> </i>专家团队擅长</span>
        <i class="pre  icon-return-right"></i>
      </div>
      <!--<span class="line"></span>-->
      <p class="title" ref="skillA"><pre>{{skill}}</pre></p>
    </div>
    <div :class="['content' ,{'content-active' : introA} ]">
      <div class="con_head" @click.stop="spread('introA')">
        <span class="type"><i> <span class="icon icon-team-intro"></span> </i>专家团队简介</span>
        <i class="pre  icon-return-right"></i>
      </div>
      <!--<span class="line"></span>-->
      <p class="title" ref="introA">
        <template v-if="intro">
          <pre>{{intro}}</pre>
        </template><template v-else>
        <span>未填写</span>
      </template></p>
    </div>
    <h6 class="reviewing" v-show="review == '3'">此功能暂不可用，审核完成即可使用，请耐心等待！</h6>
    <div :class="['content',{'content1' : count == '0'}]">
      <div class="con_head">
        <span class="type"><i><span class="icon icon-team-consult"></span> </i>团队咨询服务</span>
        <i class="price">{{teamChatSet.price  && teamChatSet.switch == '2' ?  `${teamChatSet.price}元/次` : '未设置'}}</i>
      </div>
      <ul class="intro">
         <li><i class="circle"></i>团队咨询服务由领衔专家设置开通，其条数与领衔专家图文咨询（单次）服务相同，资费由领衔专家设定（建议为专家个人资费的80%）</li>
         <li><i class="circle"></i>团队成员均可回复会员咨询问题</li>
         <li><i class="circle"></i>在支付咨询24小时后，若未有医生回复，本服订单自动取消，咨询费用返还</li>
         <li><i class="circle"></i>团队咨询收入由领衔专家提现管理或委托智呼吸平台代为分发</li>
      </ul>
    </div>
    <div class="content content1" v-show="count != '0'" @click.stop="$router.push({path : '/4/myItConsult'})">
      <div class="con_head">
        <span class="type"><i><span class="icon icon-team-num"></span> </i>咨询会员数<span class="count">({{this.count}}人)</span></span>
      </div>
    </div>
    <h6 class="reviewing" v-show="review == '3' && docInfo.account == info.account">此功能暂不可用，审核完成即可使用，请耐心等待！</h6>
    <div class="content content1" @click.stop="skipWallet">
      <div class="con_head" v-show="docInfo.account == info.account">
        <span class="type"><i> <span class="icon icon-team-income" ></span> </i>团队收入</span>
        <i class="pre  icon-return-right"></i>
      </div>
    </div>
    <div class="content">
      <div class="con_head">
        <span class="type"><i><span class="icon icon-team-cell"></span> </i>团队成员<span class="count">({{arr.length}}人)</span></span>
      </div>
    </div>
    <div class="info_modules" v-for="(item,index) in arr">
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
  import {MessageBox2} from "../../components/hw-components";

  export default{
    created(){
      this.$store.commit('UPDATE_NAV',{hShow : false , fShow : false} ); this.id  = this.$route.params.id;
      this.$api.teamDetail(this.id).then(obj=>{
        let title = obj.team.title;
        [this.skill,this.intro,this.title,this.arr,this.teamChatSet,this.review,this.docInfo,this.count] = [obj.team.skill,obj.team.note,obj.team.title,obj.members,obj.teamChatSet,obj.team.review,obj.owner,obj.inquiry_count];
        this.arr.unshift(obj.owner);
        if(obj.team.review == '2'){
          MessageBox2.confirm('该团队未通过审核，如有疑问请咨询智呼吸平台！').then(_=>{
            this.$router.routeBack();
          })
          return;
        }
        if(title.length >= 13){
          title = title.split('');
          title.splice(10,0,"<br>");
          title = title.join('');
        }
        this.title = title;
      });
    },
    computed:{
      info(){
        return this.$store.state.docInfo;
      }
    },
    components:{hwSwitch},
    data(){return{
      title :  '--',
      checked : false,
      id : '',
      skill : '',
      intro : '',
      count : '',
      arr : [],
      teamChatSet : '',
      review : '',
      skillA : false,
      introA : false,
      docInfo : {}
    }},
    methods:{
      change(v){
//            this.checked =false;
      },
      skipWallet(){
        if(this.review == '1'){
          this.$router.push(`/${this.id}/teamWallet`);
        }
      },
      head(v){
        return `${DOCLINKAPI}${v}`;
      },
      edit(){
        this.$router.push(`/${this.id}/addTeamMem`);
      },
      back(){
        this.$router.routeBack();
      },
      spread(v){
        let p= this.$refs[v];
        let c = p.children[0];
        this[v] = !this[v];
        if(this[v]){
          if(p.offsetHeight < c.offsetHeight){
            p.style.height = 'auto';
          }
        }else{
          p.style.height = '0.68rem';
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .setPreWrap{
    height: 100%;
    line-height: 0;
    overflow: scroll;
    .head{
      padding-top: 1px;
      background: $baseGreen;
      position: relative;
      box-sizing: border-box;
      .fn{
        height: 0.8rem;
        background: $baseGreen_c;
        font-size: 0.32rem;
        color: white;
        line-height: 0.8rem;
        text-align: center;
        button{
          background: $baseGreen_c;
        }
      }
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
        height: 2.6rem;
        background: url(../../assets/media/img/teamPreBg.png) no-repeat left top;
        background-size: 100% 100%;
        width: 100%;
        font-size: 0.36rem;
        line-height: 0.4rem;
        color: white;
        padding-top: 0.36rem;
        padding-left: 2.4rem;
        padding-bottom: 0.63rem;
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
          left: 0;
          top: 0;
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
          top:0.36rem;
          left: 0.5rem;
          border: 2px solid  $baseGreen_c;
        }
        //27 36 25 34
        .title{
          margin-bottom: 0.34rem;
          font-weight: bold;
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
      .info_review{
        background: $baseGreen;
      }
    }
    .reviewing{
      background: $grange_e;
      line-height: 0.4rem;
      font-size: 0.22rem;
      color: $orange_a;
      text-align: center;
    }
    .head-reviewing{
      background: #63d7cb;
      line-height: 0.6rem;
      font-size: 0.22rem;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      i{
        font-size: 0.27rem;
        margin-right: 0.1rem;
      }
    }
    .content{
      background: white;
      .con_head{
        box-sizing: border-box;
        padding:0.38rem 0 0.12rem;
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
          padding-left: 0.5rem;
          i{
            display: inline-block;
            width: 0.4rem;
            height: 0.4rem;
            border-radius: 50%;
            /*border: 1px solid red;*/
            position: absolute;
            left: 0;
            top: -0.02rem;
            box-sizing: border-box;
            .icon{
              font-size: 0.4rem;
              &:before{
                color: #ffb923;
              }
            }
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
      .price{
        color: $baseGreen;
      }
      .intro{
        font-size: 0.26rem;
        color: $gray_b;
        box-sizing: border-box;
        padding: 0.05rem 0.3rem 0.25rem;
        border-bottom: 1px solid $gray_e;
        li{
          line-height: 0.36rem;
          padding: 0.1rem 0.1rem 0 0.34rem;
          box-sizing: border-box;
          position: relative;
          .circle{
            display: inline-block;
            width: 0.14rem;
            height: 0.14rem;
            border-radius: 50%;
            background: $grange_d;
            position: absolute;
            left: 0.1rem;
            top: 0.2rem;
          }
        }
      }
      .title{
        font-size: 0.28rem;
        line-height: 0.34rem;
        word-break: break-all;
        height: 0.68rem;
        overflow: hidden;
        color: $gray_b;
        border-top: 0.17rem solid white;
        border-bottom: 0.27rem solid white;
        padding: 0 0.3rem;
        margin-bottom: 0.2rem;
        background: white;
      }
    }
    .content-active {
       .con_head .pre{
         transform: rotateZ(90deg);
         transform-origin: 50% 50%;
       }
    }
    .content1{
      margin-bottom: 0.2rem;
      .con_head{
        padding:0.25rem 0 ;
      }
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
        padding-bottom: 0.2rem;
        padding-left: 1.4rem;
        border-bottom: 1px solid $gray_e;
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
  pre{
    display:inline-block;
    white-space: pre-wrap; /*css-3*/
    white-space: -moz-pre-wrap; /*Mozilla,since1999*/
    white-space: -pre-wrap; /*Opera4-6*/
    white-space: -o-pre-wrap; /*Opera7*/
    word-wrap: break-word;
  }
</style>
