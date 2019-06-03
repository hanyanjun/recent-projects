<template>
<div class="teamInviteSms">
  <div class="content">
    <div class="module" v-for="item in arr">
      <h6 class="head"> <i class="icon-team-phone"></i> <input type="number" @input="input($event,item)" @focus="focus(item)" @blur="blur(item)" :value="item.phone" placeholder="请输入手机号" > <span class="error">
        <template v-if="item.err == '0'">
          请输入正确的手机号
        </template>
        <template v-else-if="item.err == '1'">
          请输入他人手机号
        </template>
        <template v-else-if="item.err == '2'">
          该手机号还未注册医生
        </template>
        <template v-else-if="item.err == '3'">
          该手机号已注册医生
        </template>
        <template v-else-if="item.err == '4'">
          手机号格式错误
        </template>
      </span></h6>
      <div class="info" v-show="item.name">
        <template v-if="item.face">
          <img src="" v-img="item.face" alt="" v-show="item.face">
        </template>
        <template v-else>
          <i class="icon" >
            <template v-if="item.sex == '男'">
              <i class="icon-team-head-b">
                <span class="path1"></span><span class="path2"></span>
              </i>
            </template>
            <template v-if="item.sex == '女'">
              <i class="icon-team-head-g">
                <span class="path1"></span><span class="path2"></span>
              </i>
            </template>
          </i>
        </template>
        <h6 class="name"><span>{{item.name}} <button :class="{'review' : item.is_certified != '1'}">{{item.is_certified == '1' ? '已认证' : '未认证'}}</button></span></h6>
        <h6 class="depart" v-show="item.technical && item.department"><span :class="['t',{'t1' : !item.department}]" v-show="item.technical">{{item.technical}}</span><span class="d">{{item.department}}</span></h6>
        <h6 class="hospital">{{item.hospital}}</h6>
      </div>
    </div>
  <button class="addPhone" @click.stop="add">+新增号码</button>
  </div>
  <hwSubmitBtn text="发送邀请" :activeStyle="{background : '#20c6b4'}" @submit="submit"></hwSubmitBtn>
</div>
</template>

<script>
  import {Indicator,Toast} from '../../components/hw-components'
import hwSubmitBtn from "../../components/hw-submit-btn"
export default {
   name: "teamInviteSms",
   created(){
     this.$store.commit('UPDATE_NAV',{title : '短信邀请',theme : 'green',hShow : true});
     this.arr.push(Object.assign({},this.mold));
     this.id  = this.$route.params.id;
     if(window.sessionStorage['teamMemSms']){
       this.arr = JSON.parse(window.sessionStorage['teamMemSms']);
     }
   },
  data(){return{
    arr : [],id : '',
    mold : {phone : '',err : '',face : '',name : '',department : '',hospital : '',technical: '',is_certified : ''}
  }},
  computed:{
    docInfo(){
      return this.$store.state.docInfo;
    }
  },
  components : {hwSubmitBtn},
  methods:{
    submit(){
          let arr = [];
          let is_submit = true;
          this.arr.forEach((v)=>{
            if(v.phone){
              arr.push(v.phone);
              if(v.phone.length < 11 && v.phone.length > 0){
                is_submit = false;
                v.err = '4';
                return;
              }
              if(v.err != '2' && v.err != '3'){
                is_submit = false;
                return;
              }
            }
          })
          if(arr.length == 0){
            Toast('请输入邀请的号码');
            return;
          }
          if(!is_submit){
            Toast('手机号格式错误！');
            return;
          }
          this.$api.inviteTeamByPhone(this.id,{phones : JSON.stringify(arr)}).then(obj=>{
            this.$router.routeBack();
          })
    },
    add(){
      this.arr.push(Object.assign({},this.mold));
    },
    focus(v){
      v.err = '';
    },
    blur(v){
      if(v.phone.length < 11 && v.phone.length > 0){
        v.err = '4';
      }
    },
    input(e,v){
      let v1 = e.target.value;
      if(v1.length >= 11){
        v1 = v1.substring(0,11);
        e.target.value = v1;
        if(!(/^1[3|4|5|7|8][0-9]{9}$/g.test(v1))){
          v.err = '0';
        }else if(v1 == this.docInfo.phone){
          v.err = '1';
        }else{
          Indicator.open('查找中');
          this.$api.getInfoByPhone(v1).then(obj=>{
            Indicator.close();
            if(obj.hasOwnProperty('errMsg')){
              v.err = '2';
            }else{
              v.err = '3';
              obj.info.face = obj.info.face ? DOCLINKAPI + obj.info.face : '';
              v = Object.assign(v,obj.info);
              window.sessionStorage['teamMemSms'] = JSON.stringify(this.arr);
            }
          })
        }
      }else{
        v.err = '';
        v = Object.assign(v,this.mold);
      }
      v.phone = e.target.value;
      window.sessionStorage['teamMemSms'] = JSON.stringify(this.arr);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.teamInviteSms{
  height: 100%;
  overflow: hidden;
  .content{
    height: calc(100% - 1.6rem);
    overflow: scroll;
    .module{
      padding-top: 0.3rem;
      box-sizing: border-box;
      background: white;
      margin-bottom: 0.2rem;
      .head{
        display: inline-block;
        width: 100%;
        height: 0.7rem;
        position: relative;
        padding: 0 2.78rem 0.2rem 1.16rem;
        box-sizing: border-box;
        display: flex;
        input{
          display: inline-block;
          width: 100%;
          height: 0.5rem;
          font-size: 0.28rem;
          color: $gray_a;
        }
        i{
          position: absolute;
          font-size: 0.5rem;
          left: 0.6rem;
          top: 0;
        }
        .error{
          position: absolute;
          font-size: 0.24rem;
          color: $gray_c;
          right: 0.6rem;
          top: 0;
          line-height: 0.5rem;
        }
      }
      .info{
        padding: 0 0.4rem 0 1.8rem;
        background: white;
        box-sizing: border-box;
        position: relative;
        display: flex;
        align-content: center;
        flex-wrap: wrap;
        height: 1.6rem;
        border-top: 1px solid $gray_e;
        img,.icon{
          border: 1px solid $gray_d_c;
          background: $gray_d_c;
          position: absolute;
          left: 0.4rem;
          top: 0.2rem;
          display: inline-block;
          width: 1.2rem;
          height: 1.2rem;
          border-radius: 0.06rem;
          line-height: 1.2rem;
          text-align: center;
         i{
           font-size: 0.78rem;
           color: $gray_f;
           display: inline-block;
           width: 0.78rem;
           height: 0.78rem;
           border-radius: 50%;
          }
        }
        h6{
          width: 100%;
        }
        .name{
          font-size: 0.28rem;
          line-height: 0.4rem;
          color: $gray_a;
          margin-bottom: 0.08rem;
          position: relative;
          span{
            display: inline-block;
            height: 0.4rem;
            position: relative;
            padding-right: 1.08rem;
            line-height: 0.4rem;
            button{
              position: absolute;
              right: 0;
              top: 0.05rem;
              background: white;
              font-size: 0.2rem;
              line-height: 0.2rem;
              color: $baseGreen;
              border: 1px solid $baseGreen;
              padding: 0.03rem 0.1rem;
              border-radius: 0.06rem;
            }
            .review{
              color: $orange;
              border: 1px solid $orange;
            }
          }
        }
        .depart,.hospital{
          font-size: 0.22rem;
          line-height: 0.34rem;
          color: $gray_b;
        }
        .t{
          padding-right: 0.1rem;
          border-right: 1px solid $gray_b;
        }
        .t1{
          border-right: none;
        }
        .d{
          padding-left: 0.1rem;
        }
      }
    }
    .addPhone{
      display: inline-block;
      width: 100%;
      background: white;
      font-size: 0.32rem;
      color: $baseGreen;
      height: 1rem;
      line-height: 1rem;
    }
  }
}
</style>
