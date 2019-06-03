     <template>
  <div class="contacts">
    <div class="con-fn">
      <div class="search">
        <input type="text" name="" value="" autocomplete="off" :class="['con-sear', {'con-sear-active' : !conShow}]" v-focus="searchPat" v-model="searchInput">
        <span class="con-position" v-show="conShow">搜索</span>
      </div>
    </div>
    <div class="con-content" v-show="conShow">
      <div class="fn-deal">
        <div class="fn-div">
          <a href="javascript:;" class="report">
            <i class="icon-report" style="font-size: 0.74rem;">
              <span class="path1"></span><span class="path2"></span><span class="path3"></span>
            </i>
            <a href="javascript:;"  @click.stop="skipReport" style="margin-left: 0.23rem;">会员报到 <b class="circle" v-show="reportCount != 0">{{reportCount}}</b></a>
          </a>
        </div>
        <div class="fn-div" v-if="conShow">
          <router-link to="/groupNewsHistory" class="report">
            <i class="icon-group-news" style="font-size: 0.74rem;">
              <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span>
            </i>
            <a href="javascript:;"  style="margin-left: 0.23rem;">群发消息</a>
          </router-link>
        </div>
      </div>
      <div class="sys-group">
        <!--设备会员-->
        <ul :class="payClass ? 'sys-act' : 'sys-act sys-active'">
          <div :class="['line',{'line-active' : payGroup.length != 0 &&  ! payClass}]"></div>
          <li :class="payClass ? 'title' : 'title title-active'" @click.stop="payClass = payGroup.patients.length == 0 ? true : ( payClass = payClass ? false : true) ">
            <i class="icon-equipment" style="font-size: 0.74rem">
                <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
            </i>肺功能管理组&nbsp;({{payGroup.patients.length}})</li>
          <li class="info" v-for="item in payGroup.patients"  @click.stop="skipChat(item)">
            <i class="iequ1">
              <i class="icon-equipment" style="font-size: 0.33rem" v-show="item.is_device_exist == '1'">
                <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
              </i>
            </i>
            <img :src="item.headimg" alt="" @click.stop="skipInfo(item)"><div><span class="name">{{item.name ? item.name : item.nick}}</span><span class="other">{{item.sex}}&nbsp;|&nbsp;{{item.age}} <span>报到时间：{{changeTime(item.report_time)}}</span></span></div>
          </li>
        </ul>
        <!--电话会员-->
        <ul :class="phoneClass ? 'sys-act' : 'sys-act sys-active'">
          <div :class="['line',{'line-active' : phoneGroup.length != 0 &&  ! phoneClass}]"></div>
          <li :class="phoneClass ? 'title' : 'title title-active'" @click.stop="phoneClass = phoneGroup.patients.length == 0 ? true : ( phoneClass = phoneClass ? false : true) ">
            <i class="icon-equipment" style="font-size: 0.74rem">
              <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
            </i>电话咨询&nbsp;({{phoneGroup.patients.length}})</li>
          <li class="info" v-for="item in phoneGroup.patients"  @click.stop="skipChat(item)">
            <i class="iequ1">
              <i class="icon-equipment" style="font-size: 0.33rem" v-show="item.is_device_exist == '1'">
                <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
              </i>
            </i>
            <img :src="item.headimg" alt="" @click.stop="skipInfo(item)"><div><span class="name">{{item.name ? item.name : item.nick}}</span><span class="other">{{item.sex}}&nbsp;|&nbsp;{{item.age}} <span>报到时间：{{changeTime(item.report_time)}}</span></span></div>
          </li>
        </ul>
        <!--付费会员-->
        <ul :class="buyServiceClass ? 'sys-act' : 'sys-act sys-active'">
          <div :class="['line',{'line-active' : buyService.length != 0 &&  ! buyServiceClass}]"></div>
          <li :class="buyServiceClass ? 'title' : 'title title-active'" @click.stop="buyServiceClass = buyService.length == 0 ? true : ( buyServiceClass = buyServiceClass ? false : true) ">
            <i class="icon-have-pay pay-icon" style="font-size: 0.82rem">
              <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
            </i>VIP会员&nbsp;({{buyService[0].count}})</li>
            <template v-for="item in buyService">
             <template v-if="item.group_name == 'inquiry_service'">
                <ul :class="['inquiryGroup',{'inquiryGroup-active': !item.toggle}]">
                  <li :class="['title' , {'title-active' : !item.toggle}]"  @click.stop="item.toggle = item.patients.length == 0 ? true : (!item.toggle)">
                    <div :class="['line',{'line-active' : item.patients.length != 0 &&  ! item.toggle}]"></div>
                    <!--<i class="icon-have-pay pay-icon" style="font-size: 0.82rem">-->
                    <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
                    <!--</i>-->
                    <!--<template v-if="item.group_name == 'inquiry_service'">-->
                    图文咨询(次)
                    <!--</template>-->
                    <!--<template v-else-if="item.group_name == 'family_service'">-->
                    <!--图文咨询(按期)-->
                    <!--</template>-->
                    &nbsp;({{item.patients.length}})
                  </li>
                  <li class="info" v-for="item1 in item.patients"  @click.stop="skipChat(item1)">
                    <i class="iequ1">
                      <i class="icon-contact-consult" style="font-size: 0.33rem">
                        <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
                      </i>
                      <!--<i class="icon-equipment" style="font-size: 0.33rem">-->
                      <!--<span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>-->
                      <!--</i>-->
                    </i>
                    <img :src="item1.headimg" alt="" @click.stop="skipInfo(item1)">
                    <div>
                      <span class="name">{{item1.name ? item1.name : item1.nick}}</span>
                      <span class="other">{{item1.sex}}&nbsp;|&nbsp;{{item1.age}} <span>报到时间：{{changeTime(item1.report_time)}}</span></span>
                    </div>
                  </li>
                </ul>
             </template>
              <template v-else-if="item.group_name == 'family_service'">
                <ul :class="['familyGroup' , {'familyGroup-active' : !item.toggle}]">
                  <li :class="['title', {'title-active' : !item.toggle}]"  @click.stop="item.toggle = item.patients.length == 0 ? true : (!item.toggle)">
                    <div :class="['line',{'line-active' : item.patients.length != 0 &&  ! item.toggle}]"></div>
                    <!--<i class="icon-have-pay pay-icon" style="font-size: 0.82rem">-->
                    <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
                    <!--</i>-->
                    图文咨询(期)
                    &nbsp;({{item.patients.length}})
                  </li>
                  <li class="info" v-for="item1 in item.patients"  @click.stop="skipChat(item1)">
                    <i class="iequ1">
                      <!--<i class="icon-contact-consult" style="font-size: 0.33rem" v-show="item1.is_inquiry_service == '1'">-->
                        <!--<span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>-->
                      <!--</i>-->
                      <i class="icon-contact-family" style="font-size: 0.33rem" v-show="item1.is_family_service == '1'">
                        <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
                      </i>
                      <!--<i class="icon-equipment" style="font-size: 0.33rem" v-show="item1.is_device_exist == '1'">-->
                      <!--<span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>-->
                      <!--</i>-->
                    </i>
                    <img :src="item1.headimg" alt="" @click.stop="skipInfo(item1)"><div><span class="name">{{item1.name ? item1.name : item1.nick}}</span><span class="other">{{item1.sex}}&nbsp;|&nbsp;{{item1.age}} <span>报到时间：{{changeTime(item1.report_time)}}</span></span></div>
                  </li>
                </ul>
              </template>
          </template>


        </ul>
        <!--未付费会员-->
        <ul :class="noServiceClass ? 'sys-act' : 'sys-act sys-active'">
          <div :class="[{'line-active' : noService.length != 0 &&  ! noServiceClass}]"></div>
          <li :class="noServiceClass ? 'title' : 'title title-active'" @click.stop="noServiceClass =noService.patients.length == 0 ? true : ( noServiceClass = noServiceClass ? false : true) ">
            <i class="icon-have-pay unpay-icon" style="font-size: 0.82rem">
              <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
            </i>普通会员&nbsp;({{noService.patients.length}})</li>
          <li class="info" v-for="item in noService.patients"  @click.stop="skipChat(item)">

            <img :src="item.headimg" alt="" @click.stop="skipInfo(item)"><div><span class="name">{{item.name ? item.name : item.nick}}</span><span class="other">{{item.sex}}&nbsp;|&nbsp;{{item.age}} <span>报到时间：{{changeTime(item.report_time)}}</span></span></div></li>
        </ul>
        <!--<ul :class="unPayClass ? 'sys-act sys-active' : 'sys-act'">-->
          <!--<li :class="unPayClass ? 'title' : 'title title-active'" style="border: none;" @click.stop="unPayClass = unPayClass ? false : true"><i class="icon-have-pay" style="color: #9fa0a0; font-size: 0.74rem;"></i>&nbsp;&nbsp;普通会员&nbsp;({{unPayGroup.patients.length}})</li>-->
          <!--<li class="info" v-for="item in unPayGroup.patients"  @click.stop="skipChat(item)"><img :src="item.headimg" alt="" @click.stop="skipInfo(item)"><div><span class="name">{{item.name ? item.name : item.nick}}</span><span class="other">{{item.sex}}|{{item.age}}</span></div></li>-->
        <!--</ul>-->
      </div>
      <div class="con-group" >
        <!--分组列表-->
        <!--有分组名的-->
        <ul :class="item.patients.length == 0 ? 'con-act' : item.toggle ? 'con-act' : 'con-act  con-active'" v-for="(item,index) in otherGroup">
          <div :class="['line',{'line-active' : item.patients.length != 0 &&  !item.toggle}]">
            <span></span>
            <i></i>
          </div>
          <li class="title" @click.stop="item.toggle = item.toggle ? false : true">
            <a href="javascript:;" class="jump-add" v-show="!item.toggle" @click.stop="editGroup(item)">管理分组</a>
            <i class="group-name-icon" :style="{'background':$means.conColor(index)}">{{item.group_name ? item.group_name.substring(0,1) : ''}}</i>
            <span class="group-name">{{item.group_name}}&nbsp;(<span class="len">{{item.patients.length}}</span>)</span>
          </li>
          <li class="info info2" v-for="(item1,index1) in item.patients" @click.stop="skipChat(item1)">
            <i class="iequ1">
              <i class="icon-contact-consult" style="font-size: 0.33rem" v-show="item1.is_inquiry_service == '1'">
                <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
              </i>
              <i class="icon-contact-family" style="font-size: 0.33rem" v-show="item1.is_family_service == '1'">
                <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
              </i>
              <i class="icon-equipment" style="font-size: 0.33rem" v-show="item1.is_device_exist == '1'">
                <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
              </i>
            </i>
            <img :src="item1.headimg" alt="" @click.stop="skipInfo(item1)"><div><span class="name">{{item1.name ? item1.name : item1.nick}}</span><span class="other">{{item1.sex}}&nbsp;|&nbsp;{{item1.age}} <span>报到时间：{{changeTime(item1.report_time)}}</span></span></div>
          </li>
        </ul>
        <!--未分组-->
        <ul :class="unGroup.patients.length== 0 ? 'ungroup' : !unGroupClass ? 'ungroup con-active' : 'ungroup'" >
          <div :class="['line',{'line-active' : unGroup.patients.length != 0 && !unGroupClass}]">
            <span></span>
          </div>
          <li :class="unGroupClass ? 'title title-active' : 'title'"  @click.stop="unGroupClass = unGroupClass ? false : true">
            <i class="icon-setgroup-background" style="font-size:0.74rem"><span class="path1" style="color:#9fa0a0"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>
            <span class="group-name">未分组&nbsp;(<span class="len">{{unGroup.patients.length}}</span>)</span>
          </li>
          <li class="info" v-for="item in unGroup.patients" @click.stop="skipChat(item)">
            <i class="iequ1">
              <i class="icon-contact-consult" style="font-size: 0.33rem" v-show="item.is_inquiry_service == '1'">
                <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
              </i>
              <i class="icon-contact-family" style="font-size: 0.33rem" v-show="item.is_family_service == '1'">
                <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
              </i>
              <i class="icon-equipment" style="font-size: 0.33rem" v-show="item.is_device_exist == '1'">
                <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
              </i>
            </i>
            <img :src="item.headimg" alt="" @click.stop="skipInfo(item)"><div><span class="name">{{item.name ? item.name : item.nick}}</span><span class="other">{{item.sex}}&nbsp;|&nbsp;{{item.age}} <span>报到时间：{{changeTime(item.report_time)}}</span></span></div>
          </li>
        </ul>
        <!--新建分组-->
        <ul class="con-add">
          <a href="javascript:;" class="addgroup" @click.stop="addGroup">
            <i class="icon-addpatient" style="font-size: 0.74rem;">
              <span class="path1"></span><span class="path2"></span><span class="path3"></span>
            </i><span style="margin-left: 0.23rem;">新建分组</span>
          </a>
        </ul>
      </div>
    </div>
    <!--搜索结果-->
    <div class="search-result" v-show="!conShow">
      <div class="result" v-show="result.length == 0">查询不到符合的结果</div>
      <li class="info" v-for="item in result"  @click.stop="skipChat(item)"><img :src="item.headimg" alt="" @click.stop="skipInfo(item)"><div><span class="name">{{item.name ? item.name : item.nick}}</span><span class="other">{{item.sex}}&nbsp;|&nbsp;{{item.age}}</span></div></li>
    </div>
  </div>
</template>

<script>
  import { Toast } from '../../components/hw-components';
  import api from '../../fetch/api'
 export default{
      data(){return{
          payClass : true,
          phoneClass : true,
          unGroupClass : true,
          conShow :true,
          result : [],
          searchInput : '',
          buyServiceClass : true,
          noServiceClass : true
      }},
      created(){
        this.$store.commit('UPDATE_NAV',{title : '我的会员', fShow : false, hShow : true});
      },
      watch : {
        searchInput(){
          let re = new RegExp(this.searchInput);
          this.result = [];
          if(this.searchInput != ''){
            this.conShow = false;
            for (var i = 0; i < this.search.length; i++) {
              var temp = this.search[i].name;
              if(re.test(temp)){
                this.result.push(this.search[i]);
              }
            }
          }else{
              this.conShow = true;
          }
        }
      },
      computed :{
        reportCount(){
            return this.$store.getters.msgCount.reportCount > 99 ? '99+' : this.$store.getters.msgCount.reportCount;
        },
        payGroup(){
            return this.$store.state.contacts.payGroup;
        },
        phoneGroup(){
          return this.$store.state.contacts.phoneGroup;
        },
        noService(){
            return this.$store.state.contacts.noService;
        },
        buyService(){
          return this.$store.state.contacts.buyService;
        },
        unGroup(){
            return this.$store.state.contacts.unGroup;
        },
        search(){
            return this.$store.state.contacts.search;
        },
        otherGroup(){
            return this.$store.state.contacts.otherGroup;
        }
      },
      methods : {
          searchPat(){
//              this.result = [];
          },
          test(){
              return 111;
          },
        editGroup(item){
              this.$store.commit('CLEAR_GROUP');
              this.$router.push({path:`/${item.group_id}/addgroup`});
        },
        addGroup(){
            this.$store.commit('CLEAR_GROUP');
            this.$router.push({path:`/ /addgroup`});
        },
        skipInfo(item){
            this.$router.push({path : `/${item.account}/userInfo`});
        },
        skipChat(item){
            this.$router.push({path : `/${item.account}/userInfo`});
        },
        rich(){
            this.$store.dispatch('wxRich');
        },
        skipReport(){
            if(this.reportCount > 0){
              this.$store.dispatch('clearCount','patientReport');
            }
            this.$router.push({path : '/patientReport'});
        },
        changeTime(time){
          return time.split('-')[0] + '/' + time.split('-')[1] + '/' + time.split('-')[2];
        }
      }
 }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../assets/css/common.scss";
  .contacts {
    background: #f2f3f5
  }

  .contacts .con-fn {
    height: .94rem;
    background: #fff;
    border-bottom: 1px solid $gray;
  }

  .contacts .con-fn .search {
    padding: .2rem .2rem;
    -webkit-justify-content: space-between;
    display: flex;
    justify-content: space-between
  }

  .contacts .con-fn .search .con-sear {
    display: inline-block;
    width: 7.1rem;
    height: .5rem;
    padding-left: 0.6rem;
    line-height: .5rem;
    background: url(../../assets/media/img/home-contact-search2.png) #f2f2f2 no-repeat center;
    background-size: .28rem;
    font-size: .26rem;
    box-sizing: border-box;
    background-position: 2.8rem 0.11rem;
  }
  .contacts .con-fn .search .con-sear-active{
    background: #f2f2f2;
  }
  .contacts .con-fn .search .con-sear-addnew{
    background-image: none;
    background: #f2f2f2;
  }
  .contacts .con-fn .search .con-position{
    display: inline-block;
    line-height: .5rem;
    position: absolute;
    font-size: .26rem;
    color: #9FA0A0;
    left: 3.42rem;
    margin-top: 0.02rem;
  }


  .fn-deal {
    /*height: 1.2rem;*/
    height: 2.4rem;
    width: 100%;
    background: #fff;
    margin-bottom: .2rem;
  }
  .fn-deal .fn-div{
    padding-left: 1rem;
    height: 1.2rem;
    .report a{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 0.2rem;
    }
  }
  .fn-div:nth-of-type(1){
    border-bottom: 1px solid $gray;
  }
  .fn-deal .fn-div a{
    width: 6.5rem;
    height: 1.2rem;
    line-height: 1.2rem;
    font-size: .32rem;
    color: #000;
    font-family: SourceHanSansCN Normal;
    display: flex;
    align-items: center;
    position: relative;
  }
  .fn-deal .fn-div a i{
    position: absolute;
    top: .23rem;
    left: -0.74rem;
  }
  .contacts .fn-deal .circle {
    @include badge2();
    /*display: none*/
  }

  .con-content{
    height:calc(100vh - 0.94rem    - 0.8rem);
    background: #edeff0;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .sys-group{
    margin-bottom: .2rem;
    background: #fff;
  }

  .sys-group .sys-act,.inquiryGroup,.familyGroup{
    padding-left: 1rem;
    vertical-align: top;
    height: 1.2rem;
    line-height: 1.2rem;
    position: relative;
    overflow: hidden;
    border-bottom:1px solid transparent;
    box-sizing: border-box;
    .title{
      padding-left: 0.23rem;
    }
  }
  .contacts .inquiryGroup, .contacts .familyGroup{
    padding-left: 0;
    margin-left: -1rem;
    .title{
      /*padding-left: 1rem;*/
    }
    .info{
      /*padding-left: 1.4rem;*/
      position: relative;
      margin-left: 1rem;
      img{
        left : -0.7rem;
      }
    }
    /*li:nth-last-of-type(1){*/
      /*border-bottom: none;*/
    /*}*/
  }
  .sys-group .sys-active{
    height: auto;
  }
  .sys-group .sys-active:nth-of-type(1){
    border-bottom: 1px solid $gray;
  }
  .inquiryGroup-active,.familyGroup-active{
    height: auto;
    border-bottom: 1px solid $gray;
  }

  .title{
    height: 1.2rem;
    line-height: 1.2rem;
    position: relative;
    font-size: .32rem;
    /*border-bottom: 1px solid #dcdcdc;*/
    box-sizing: border-box;
  }
  /*.title-active{*/
    /*vertical-align: top;*/
    /*!*border-bottom: 1px solid ;*!*/
    /*box-sizing: border-box;*/
  /*}*/
  .title i{
    position: absolute;
    top: .23rem;
    left: -0.74rem;
  }
  .title .group-name{
    margin-left: .23rem;
  }
  .con-group{
    background: #fff;
    overflow: scroll;
    box-sizing: border-box;
  }
  .con-group .con-add{
    height: 1.2rem;
    padding-left: 1rem;
    line-height: 0;
    box-sizing: border-box;
  }
  .addgroup{
    display: inline-block;
    height: 1.2rem;
    width: 6.5rem;
    border-bottom:1px solid $gray;
    line-height: 1.2rem;
    position: relative;
    font-size: .32rem;
    box-sizing: border-box;
  }
  .icon-addpatient{
    position: absolute;
    top: .23rem;
    left: -0.74rem;
    font-size: .74rem;
  }
  .con-group .con-act{
    vertical-align: top;
    height: 1.2rem;
    overflow: hidden;
    padding-left: 1rem;
    overflow-x: hidden;
    border-bottom:1px solid transparent;
    box-sizing: border-box;
    vertical-align: top;
    position: relative;
    .group-name-icon{
      display: inline-block;
      width: 0.74rem;
      height: 0.74rem;
      font-size: 0.3rem;
      border-radius: 50%;
      background: $baseBlue;
      color: white;
      line-height: 0.74rem;
      text-align: center;
    }
  }
  .con-group .ungroup{
    vertical-align: top;
    padding-left: 1rem;
    height: 1.1rem;
    overflow: hidden;
    border-bottom: 1px solid $gray;
    box-sizing: border-box;
    position: relative;

  }
  .con-group .con-active{
    border-bottom: 1px solid  $gray;
    height: auto;
  }
  .con-act li:nth-last-child(1){
    border: none;
  }
  .contacts .info{
    border-bottom: 1px solid  $gray;
    height: 1.2rem;
    box-sizing: border-box;
    position: relative;
    padding-right: 0.3rem;
  }
  .contacts .info img{
    position: absolute;
    left: -0.74rem;
    top: .3rem;
    width: .74rem;
    height: .74rem;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
  }
  .contacts .info div{
    padding-top: .3rem;
    height: .75rem;
    /*width: 3rem;*/
    margin-left: .23rem;
  }
  .contacts .info .name{
    display: block;
    height: .32rem;
    line-height: .32rem;
    font-size: .32rem;
    color: #000;
  }
  .contacts .info .other{
    /*display: block;*/
    height: 0.26rem;
    line-height: .26rem;
    width: 100%;
    margin-top: .17rem;
    font-size: .26rem;
    color: #9fa0a0;
    display: flex;
    justify-content: space-between;
  }
  .con-act .jump-add{
    display: block;
    height: 1.20rem;
    line-height: 1.20rem;
    font-size: 0.26rem;
    color: #2a8cff;
    position: absolute;
    top: 0;
    right: 0.20rem;
  }
  .search-result{
    background: #fff;
  }
  .search-result .info{
    border-bottom: 1px solid  $gray;
    height: 1.2rem;
    box-sizing: border-box;
    position: relative;
    margin-left: .97rem;
  }
  .search-result .info img{
    position: absolute;
    left: -0.76rem;
    top: .3rem;
    width: .74rem;
    height: .74rem;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
  }
  .search-result .info div{
    padding-top: .3rem;
    height: .75rem;
    width: 3rem;
    margin-left: .23rem;
  }
  .search-result .info .name{
    display: block;
    height: .32rem;
    line-height: .32rem;
    font-size: .32rem;
    color: #000;
    /*background: lightblue;*/
  }
  .search-result .info .other{
    display: block;
    line-height: .26rem;
    margin-top: .17rem;
    font-size: .26rem;
    color: #9fa0a0;
  }
  .result{
    width: 100%;
    background: #edeff0;
    text-align: center;
    font-size: .32rem;
    line-height: 1rem;
  }
  .info .btn{
    position: absolute;
    top: 0;
    right: -1.25rem;
    text-align: center;
    background: #ff3c00;
    color: #fff;
    width: 1.25rem;
    height: 1.2rem;
    line-height: 1.2rem;
    font-size: .32rem;
  }
  .line{
    width: 100%;
    height: 1px;
    background: $gray;
    position: absolute;
    top:1.16rem;
    left: 0;
  }
  .line-active{
    width: 100%;
    background: $gray;
    position: absolute;
    top:1.16rem;
    left: 0;
    height: 0.18rem;
    background: url(./img/line.png) no-repeat;
  }
  .iequ{
    position: absolute;
    top: 0.435rem;
    right: 0.4rem;
  }
  .iequ1{
    position: absolute;
    top: -0.17rem;
    right: 0.2rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    i{
      margin-right: 0.1rem;
    }
  }
  .pay-icon{
    color: $baseBlue;
    font-size: 0.94rem;
  }
  .unpay-icon{
     color: $iconGray;
   }
  .con-act,.ungroup,.sys-act{
    .info:nth-last-of-type(1){
      border-bottom: none;
    }
  }
</style>
