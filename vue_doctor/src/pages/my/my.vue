 <template>
  <div class="my container">
    <a href="javascript:;" class="header">
      <img :src="head" alt="" class="headImg">
      <span class="text"><span class="name" style="font-size: 0.32rem">{{docInfo.name}}</span><span class="hospital" style="font-size: 0.28rem">{{docInfo.hospital}}</span></span>
      <!-- <span class="whiteArrow"></span> -->
      <div class="btns"><router-link to="/change/addInfo">编辑资料</router-link><router-link :to="`/${docInfo.account}/sharenoAcccollectMaterial`"><!-- <router-link to="/null/sharenoAcccollectMaterial"> -->领取物料</router-link></div>
    </a>
    <li class="nav-one">
      <a @click="skip" :class="['b-1px-b',{'is_certified' : docInfo.is_certified == '2'}]" >
        <span class="icon-my-idCard" style="font-size: 0.4rem"></span>
        <span class="text">身份认证 <i v-show="docInfo.is_certified == '2'">认证后可开通收费服务</i></span>
        <template v-if="docInfo.is_certified == '1'">
          <i class="icon-return-boldleft" ></i>
        </template>
        <template v-else>
          <span :class="['idStatus',certificate]">{{certificateText}}</span>
        </template>
        <!--<span :class="['idStatus',certificate]">{{certificateText}}</span>-->
        <!--<i class="icon-return-boldleft" v-show="docInfo.is_certified != '1'"></i>-->
      </a>
      <router-link to="/myHome" class="b-1px-b"><span class="icon-my-home" style="font-size: 0.4rem"></span> <span class="text">我的主页</span> <i class="icon-return-boldleft"></i></router-link>
      <router-link  to="/myWallet" class="b-1px-b my-wallet"><span class="icon-my-wallet" style="font-size: 0.4rem"></span> <span class="text">我的收入</span> <i class="icon-return-boldleft"></i></router-link>
      <router-link  to="/teamIncomeList" class="b-1px-b my-wallet"><span class="icon-myTeam-income" style="font-size: 0.4rem"></span> <span class="text">团队收入</span> <i class="icon-return-boldleft"></i></router-link>
      <router-link  to="/myIndent" class="b-1px-b my-wallet"><span class="icon-my-indent" style="font-size: 0.4rem"></span> <span class="text">我的订单</span> <i class="icon-return-boldleft"></i></router-link>
      <!--<router-link  to="/myIndent" class="my-wallet"><span class="icon-my-indent" style="font-size: 0.4rem"></span> <span class="text">我的订单</span> <i class="icon-return-boldleft"></i></router-link>-->
      <router-link  to="/teamIndent" class="my-wallet"><span class="icon-team-indent" style="font-size: 0.44rem"></span> <span class="text">团队订单</span> <i class="icon-return-boldleft"></i></router-link>
    </li>
    <li class="nav-two">
      <router-link to="/workArea" class="b-1px-b workAreaSelect"><span class="icon-my-area" style="font-size: 0.4rem"></span> <span class="text">执业地点</span> <i class="icon-return-boldleft"></i></router-link>
      <router-link to="/workServiceSet"><span class="icon-my-service" style="font-size: 0.4rem"></span> <span class="text">工作室服务设置</span> <i class="icon-return-boldleft"></i></router-link>
    </li>
    <li class="nav-three">
      <!--<router-link to="/message" class="unread b-1px-b"><span class="icon-my-message"></span> <span class="text">未读消息</span> <span class="arrow"></span></router-link>-->
      <router-link to="/set"><span class="icon-my-set" style="font-size: 0.4rem"></span> <span class="text">设置</span> <i class="icon-return-boldleft"></i></router-link>
    </li>
    <li>
    </li>
  </div>
</template>

<script>
  import {Toast} from '../../components/hw-components'
export default{
    computed : {
       docInfo (){
         return this.$store.state.docInfo;
       },
      head (){
        return this.$store.getters.docHead;
      },
      certificate(){
        return this.docInfo.is_certified == '1' ? 'idSatus-done' : '';
      },
      certificateText(){
        return this.docInfo.is_certified == '1' ? '已认证' : (this.docInfo.is_certified == '2' ? '未认证' : '认证中');
      }
    },
   created(){
     this.$store.commit('UPDATE_NAV',{title : '',fn : '', router : '', fShow : true, hShow : false});
   },
  mounted(){
    this.$store.commit('SET_FOOTER_TAB','2');
  },
   methods:{
        skip(){
            let idStatus = this.docInfo.is_certified;
            switch (idStatus){
              case '1' :
                this.$router.push({path : '/certificate/addInfo'});
//              Toast('您当前已经认证,无需重复认证!');
              break;
              case '3':
               Toast('您当前正在认证,请耐心等待');
              break;
              case '2':
               this.$router.push({path : '/certificate/addInfo'});
               break;
            }
        }
   }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .my {
    /*height: auto;*/
    /*background: #f2f3f5*/

  }

  .my .header {
    height: 1.78rem;
    background: #0395fc;
    padding: 0 .2rem 0 .3rem;
    position: relative;
    -webkit-box-align: center;
    -webkit-align-items: center;
    display: flex;
    align-items: center;
    position:relative;
  }

  .my .header span {
    display: inline-block
  }

  .my .header .headImg {
    width: 1.2rem;
    height: 1.2rem;
    margin-right: .35rem;
    -khtml-border-radius: 50%;
    border-radius: 50%
  }

  .my .header .text {
    font-size: .3rem;
    color: #fff;
    max-width: 5rem;
    line-height: 0.6rem;
    padding-right: 0.25rem;
    box-sizing: border-box;
    span{
      display: block;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .name{
      width: 2.5rem;
    }
  }

  // .my .header .whiteArrow {
  //   display: inline-block;
  //   position: absolute;
  //   background: url(./img/my_Rectangle_white_right_icon.png)  no-repeat;
  //   background-size: contain;
  //   width: .2rem;
  //   height: .31rem;
  //   right: .4rem;
  //   top: 50%;
  //   margin-top: -0.15rem
  // }
  .my .header .btns{
    width:2.7rem;
    
    display:flex;
    justify-content:space-between;
    position:absolute;
    top: .4rem;
    right:.2rem;
    a{
      font-size:.24rem;
      color:#fff;
      display:inline-block;
      width:1.2rem;
      border:1px solid #fff;
      border-radius:.06rem;
      line-height:.4rem;
      text-align:center;
    }
  }
  .my .nav-one, .my .nav-three, .my .nav-two {
    background: #fff;
    display: block;
    padding-left: .4rem;
  }
  .my .nav-three, .my .nav-two{
    margin-top: .24rem;
  }
  .my .nav-one a, .my .nav-three a, .my .nav-two a {
    background: #fff;
    height: 1rem;
    padding-right: .4rem;
    -webkit-box-align: center;
    -webkit-align-items: center;
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 1px;
  }
  .my .arrow, .my .img {
    display: inline-block
  }

  .my .img {
    width: .5rem;
    height: .5rem;
    -webkit-border-radius: 50%;
    -khtml-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
    border-radius: 50%;
    margin-right: .2rem;
  }
  .my .text {
    line-height: 1rem;
    font-size: .32rem;
    margin-left: 0.15em;
  }

  .my .idStatus {
    width: 1.1rem;
    height: .4rem;
    border : 1px solid $gray;
    border-radius: 0.14rem;
    color: #9fa0a0;
    font-size: .26rem;
    line-height: .4rem;
    text-align: center;
    position: absolute;
    top: 50%;
    right: 0.3rem;
    transform: translateY(-50%);
  }
  .my .idSatus-done{
    color:$green;
    border: 1px solid $green;
    border-radius: 0.14rem;
    position: absolute;
    right: 0.3rem;
    top: 50%;
    transform: translateY(-50%);
  }
  .my .arrow {
    position: absolute;
    background: url(./img/my_Rectangle_gray_right_icon.png) no-repeat;
    width: .2rem;
    height: .31rem;
    right: .4rem;
    top: 50%;
    margin-top: -0.15rem;
    background-size: contain;
  }
  .icon-return-boldleft{
    color: $iconGray;
    transform: translateY(-50%) rotateY(180deg);
    font-size: 0.4rem;
    position: absolute;
    right: 0.3rem;
    top: 50%;
  }
  .my li .text{
    margin-left: 0.15rem;
  }
  .my .nav-one .is_certified{
    height: 1.6rem;
    background: $lighterBlue;
    margin-left: -0.4rem;
    padding: 0.4rem;
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    position: relative;
    .text {
      color: $baseBlue;
      line-height: 0.32rem;
      vertical-align: top;
      margin-top: 0.06rem;
      /*margin-top: 0.32rem;*/
      i{
        display: block;
        font-size: 0.26rem;
        color: #9e9d9d;
        white-space: nowrap;
        margin-top: 0.2rem;
      }
    }
    .idStatus{
      color: white;
      width: 1.1rem;
      height: .4rem;
      position: absolute;
      right: 0.3rem;
      top:0.6rem;
      border: 1px solid $baseBlue;
      background: $baseBlue;
    }
  }
</style>
