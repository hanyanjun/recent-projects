<template>
<div class="container">
  <header>
    <span :class="[{'active' :filter.status == 'review'}]"  @click.stop="filter.status = 'review'">待审核 <i :class="numClass(c1)">{{num(c1)}}</i></span>
    <span :class="[{'active' : filter.status == 'reviewed'}]" @click.stop="filter.status = 'reviewed'">预约中 <i>({{c2}})</i></span>
    <span :class="[{'active' : filter.status == 'complete'}]" @click.stop="filter.status = 'complete'">已结束 <i>({{c3}})</i></span>
  </header>
  <div class="content loadWrapper">
    <loading-more :data="arr" :pullupLoad="true" @pullup="load" :tip="isTip" :empty="false">
      <section v-for="(item,index) in arr"  v-show="item">
        <ul v-if="item.member_info" @click.stop="skip(item)">
          <li class="title">{{item.appoint_time ? item.appoint_time.replace(new RegExp((new Date()).getFullYear() + '年'),'') : ''}}<span  :class="completeClass(item.appoint_break_reason)" v-show="filter.status != 'review'">{{statusText(item.appoint_break_reason)}}</span></li>
          <li class="name">就诊人:<span>{{item.member_info.name}}</span></li>
          <li class="info">信息:<span class="sex">{{item.member_info.sex}}</span><span class="age"> {{item.member_info.age}}</span> <i class="icon-hospital-area" v-show="item.member_info.city"></i><span class="area">{{item.member_info.city}}</span></li>
          <li class="illness">病情描述:<span>{{item.ill_desc}}</span></li>
          <div class="btns" v-if="!item.appoint_break_reason && filter.status=='complete' && item.appoint_status== '4'">
            <a  href="javascript:;" class="addDetail" @click.stop="addDetail(item)">添加病例描述</a>
            <a href="javascript:;" class="confirmOrder" v-show="!item.appoint_break_reason && filter.status=='complete'  && item.appoint_status== '4'" @click.stop="pass('undo',item)">没来就诊</a>
          </div>
          <div class="btns" v-if="item.appoint_status == '6' && !item.appoint_break_reason && filter.status=='complete'">
            <a href="javascript:;"   class="lookDetail" @click.stop="lookDetail(item)">查看病例描述</a>
          </div>
          <div class="btns" v-if="filter.status == 'reviewed'">
            <a href="javascript:;" class="cnacle-btn"   @click.stop="cancle(item)">临时取消</a>
          </div>
          <div class="btns"  v-if="filter.status == 'review'">
            <a href="javascript:;" class="reject-btn" @click.stop="pass('reject',item)">拒绝</a>
            <a href="javascript:;"  class="agree-btn"   @click.stop="pass('resolve',item)">同意</a>
          </div>
        </ul>
      </section>
    </loading-more>
    <empty :config="{show : arr.length == 0, text :   is_btn ? '暂时还没有开通该功能' : this.filter.tip ,btn : is_btn ? '去开通' : '' , btnLink : '/appointmentSet'}"></empty>
  </div>
  <middle-select :config="selectData"></middle-select>
  <add-text :config="addTextConfig" v-on:event="add"></add-text>
</div>
</template>

<script>
  import {MessageBox} from '../../components/hw-components'
  import middleSelect from '../../components/middleSelect'
  import addText from '../../components/addText'
  import empty from '../../components/empty'
  import loadingMore from  '../../components/loadingMore'
export default{
    name : 'myOrder',
    data(){return{
      prompt : {show : false ,title : '取消原因',holder : '请输入取消原因',tip : '',value : ''},
      c1 : '',c2 : '', c3 :'',isTip : false,arr : [{member_info :{name : ''}}], filter : { status : '' , page : 0 , tip : ''},old : { status : '' , page : 0 , tip : ''},
//     操作id  拒绝 同意 临时取消  添加描述  未来就诊
      id : '',
      selectData :{
          title :'请选择取消原因' ,
          text: ['门诊数量过多','门诊时间需要调整','工作时间有冲突','自定义'],
          show : false,
          method : (v)=>{
            let id = this.id;
            if(v){
              if(v == '自定义'){
                this.$store.commit('SET_PROMPT',this.prompt);
                this.prompt.tip = '';
                this.selectData.show = false;
                this.prompt.show = true;
                this.prompt.callback =(t)=>{
                  t = t.trim();
                  if(t == '取消'){
                    this.prompt.show = false;
                    this.selectData.show = true;
                  }else{
                    this.prompt.value = t;
                    if(t.length == 0){
                      this.prompt.tip = '请输入取消原因';
                    }else if(t.length > 100){
                      this.prompt.tip = '不能超过100个字符';
                    }else{
                      if(this.prompt.title == '拒绝原因'){
                        this.$api.appointReview({id : id , review : 'no' , reason : t})
                          .then(obj=>{
                            this.arr = this.arr.removeByValue(this.item);
                            this.c1 -=1;
                            this.c3 +=1;
                            this.filter.tip = '您还没有待审核的订单!';
                          })
                      }else{
                        this.$api.appointCancle({id : id, reason : t})
                          .then(obj=>{
                            this.arr = this.arr.removeByValue(this.item);
                            this.selectData.show = false;
                            this.c2 -=1;
                            this.c3 +=1;
                            this.filter.tip = '您还没有预约中的订单!';
                          })
                      }
                      this.prompt.show = false;
                    }
                  }
                }
              }else{
                if(this.prompt.title == '拒绝原因'){
                  this.$api.appointReview({id : id , review : 'no' , reason : v})
                    .then(obj=>{
                      this.arr = this.arr.removeByValue(this.item);
                      this.c1 -=1;
                      this.c3 +=1;
                      this.filter.tip = '您还没有待审核的订单!';
                    })
                }else{
                  this.$api.appointCancle({id : id, reason : v})
                    .then(obj=>{
                      this.arr = this.arr.removeByValue(this.item);
                      this.selectData.show = false;
                      this.c2 -=1;
                      this.c3 +=1;
                      this.filter.tip = '您还没有预约中的订单!';
                    })
                }
                this.selectData.show = false;
                this.prompt.show = false;
              }
            }else{
              this.selectData.show = false;
            }
          }
      },
      addTextConfig : {message : '',count : 100, show : false , holder : '点击此处可以添加会员的病历描述。'},
    }},
    watch : {
      filter :{
        handler :function (v,o) {
          if(v.status != this.old.status){
            this.filter.page  = 0;
            this.isTip = false;
            this.$router.push({path : `/${v.status}/myOrder`});
            this.old  = Object.assign({},v);
            this.load(true);
          }else{

          }
        },
        deep : true
      },
      '$route' : 'routeChange',
    },
    components : {middleSelect,addText,empty,loadingMore},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '我的预约', fn : '设置', fShow : false, hShow : true});
    },
    computed:{
      info(){
        return this.$store.state.docInfo;
      },
      is_btn(){
        if ( this.info.appoint_switch == 1) return true;
        return false;
      }
    },
    mounted (){
      this.filter.status  =  this.$route.params.type;
      document.querySelector('.nav_submit').onclick =()=>{
        this.$router.push({path : '/appointmentSet'});
      }
    },
    methods : {
      load(v){
        if(v){
          this.filter.page ++;
          if(this.filter.page == 1){
            this.arr = [''];
          }
          this.$api.appointList(this.filter)
            .then(obj=>{
              let t = this.filter.status == 'review' ? '待审核' : ('reviewed' ? '预约中' : '已完成');
              if(obj.list.length == 0){
                this.isTip = true;
                if(this.filter.page == 1){
                  this.filter.tip = `您还没有${t}的订单!`;
                }
              }
              if(this.filter.page == 1){
                this.arr = obj.list;
              }else{
                this.arr = [...this.arr,...obj.list];
              }
              this.c1 = obj.count1;
              this.c2 = obj.count2;
              this.c3 = obj.count3;
            })
        }
      },
      numClass(v){
        if(v == 0) return "";
        if(v < 100) return "circle1";
        return "circle2"
      },
      num(v){
        if(v == 0) return "(0)";
        if(v < 100) return v;
        return '99+';
      },
      routeChange(){
        document.querySelector('.nav_submit').onclick =()=>{
          this.$router.push({path : '/appointmentSet'});
        }
      },
      completeClass(v){
         if(v == '会员未到'){
             return 'order-status failOrder';
         }else if(v == '会员取消' || v == '医生取消'){
             return 'order-status cancle';
         }else{
             return 'order-status';
         }
      },
      statusText(v){
          if(this.filter.type == 'reviewed'){
              return '预约中';
          }else{
              if(v){
                  return v;
              }else{
                  return '预约完成';
              }
          }
      },
      skip(v){
          this.$router.push({path : `/${this.filter.status}/${v.id}/orderDetail`});
      },
      pass(v,item){
        //更新待办事项
        this.$store.state.unReplay.status = true;
        this.id = item.id;
        let id = this.id;
        if(v == 'reject'){
          console.log(1);
          this.id = item.id;
          this.item = item;
          this.selectData.title = '请输入拒绝原因';
          this.prompt.title = '拒绝原因';
          this.prompt.holder = '请输入拒绝原因';
          this.selectData.show = this.selectData.show ? false : true;
        }else if(v == 'resolve'){
            this.$api.appointReview({id : id , review : 'yes'})
              .then(obj=>{
                this.arr = this.arr.removeByValue(item);
                this.c1 -= 1;
                this.c2 += 1;
                this.filter.tip = '您还没有待审核的订单!';
              })
        }else if(v == 'undo') {
          MessageBox.confirm('确认该会员没来?').then(obj => {
            this.$api.OrderCompleteSymbol({appoint_id: item.id, status: 'no'})
              .then(obj => {
                item.appoint_break_reason = '会员未到';
              })
          })
        }
      },
      addDetail(item){
          this.item = item;
          this.id = item.id;
          this.addTextConfig.show = true;
      },
      lookDetail(v){
          this.$router.push({path : `/${v.id}/orderDescDetails`});
      },
      add(v){
        if(v){
            let item = this.item;
        this.$api.addOrderDesc({patients_id : item.patients_id,appoint_id : item.id,content:v})
          .then(obj=>{
            this.item.appoint_status = '6';
            console.log(obj);
            this.addTextConfig.show = false;
          })
        }else{
          this.addTextConfig.show = false;
        }

      },
      cancle(item){
        this.id = item.id;
        this.item = item;
        this.selectData.title = '请输入取消原因';
        this.prompt.title = '取消原因';
        this.prompt.holder = '请输入取消原因';
        this.selectData.show = this.selectData.show ? false : true;
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .container {
    background: url(../../assets/media/img/my-oreder_bg.png)  $bg no-repeat left top;
    background-size: 100% 2.95rem;
    min-height: 2.95rem;
    overflow: hidden;
  }
  .container .content{
    height: calc(100% - 0.8rem);
    margin-top: 0.2rem;
    overflow-y: scroll;
  }

  .container nav{
    width: 6.83rem;
    margin: 0 auto .2rem;
    height: .84rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    border-bottom: 1px solid rgb(85, 163, 255);
    position: relative;
  }
  .container nav a{
    display: inline-block;
    height: 100%;
    color: rgb(170, 209, 255);
    font-size: .32rem;
    line-height: .84rem;
    width: 60%;
    text-align: center;
  }
  .container nav .nav-active{
    color: white;
    border-bottom: 1px solid white;
  }
  .container section{
    margin:  .2rem auto;
    width: 7rem;
    /*height: 4.2rem;*/
    line-height: 0;
    background: white;
    -webkit-border-radius: .2rem;
    -moz-border-radius: .2rem;
    -ms-border-radius: .2rem;
    -o-border-radius: .2rem;
    border-radius: .2rem;
    text-align: right;
  }
  /*添加病例描述按钮*/
  .container section .addDetail,
  .container section .confirmOrder,
  .container section .lookDetail{
    display: inline-block;
    width: 2.4rem;
    height: .5rem;
    line-height: .5rem;
    color: rgb(55, 147, 255);
    text-align: center;
    border: 1px solid rgb(55, 147, 255);
    background: white;
    -webkit-border-radius: .1rem;
    -moz-border-radius: .1rem;
    -ms-border-radius: .1rem;
    -o-border-radius: .1rem;
    border-radius: .1rem;
    font-size: .34rem;
  }
  /*会员没来的按钮*/
  .container section .confirmOrder{
    margin-left: .35rem;
    width: 1.7rem;
    color: rgb(255,174,1);
    border: 1px solid rgb(255,174,1);
  }
  .container section ul{
    padding: .2rem .3rem 0;
    /*border-bottom: 1px solid rgb(181, 181, 181);*/
    box-sizing: border-box;
    /*height: 3.18rem;*/
    text-align: left;
  }
  .container section ul .title{
    height: .66rem;
    line-height: .66rem;
    color: rgb(42, 140, 255);
    font-size: .32rem;
    padding-left: .66rem;
    background: url(../../assets/media/img/my-order_day_icon.png) no-repeat left center;
    background-size: 0.44rem 0.44rem;
    position: relative;
  }
  .container section ul .title .order-status{
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    height: .66rem;
    line-height: .66rem;
    font-size: .32rem;
    padding-left: .32rem;
    background: url(../../assets/media/img/blue-circle_icon.png) no-repeat left center;
    background-size: 0.16rem 0.16rem;
    color: black;
  }
  .container section ul .name,
  .container section ul .info,
  .container section ul .illness{
    height: .56rem;
    line-height: .56rem;
    font-size: .32rem;
    position: relative;
    overflow: hidden;
    i{
      font-size: 0.28rem;
      &:before{
        color: $iconGray;
      }
    }
  }
  .container section ul .info{
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    white-space: nowrap;
  }
  .container section ul .illness{
    height: 1.12rem;
    word-break: break-all;
  }
  .container section ul .illness b{
    display: inline-block;
    position: absolute;
    width: .72rem;
    bottom: 0;
    right: 0;
    font-size: .32rem;
    line-height: .56rem;
    color: rgb(114, 113, 113);
    background: white;

  }
  .container section ul .name span,
  .container section ul .info span,
  .container section ul .illness span{
    color: $fGray;
    letter-spacing: .02rem;
    margin-left: .2rem;
    font-weight: normal;
  }
  /*基本信息*/
  .container section ul .info span{
    display: inline-block;
    height: .4rem;
    line-height: .4rem;
  }
  .container section ul .info .age{
    text-align: center;
    padding: 0 .2rem;
    border-left: 1px solid $fGray;
  }
  /*地区*/
  .container section ul .info .area{
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  /*预约结束时为取消状态的样式*/
  .container .order-cancle{
    height: 3.3rem;
    border-bottom: none;
    overflow: hidden;
  }
  .container .order-cancle ul{
    border-bottom: none;
  }
  .container section ul .title .cancle{
    background: url(../../assets/media/img/gray-circle_icon.png) no-repeat left center;
    background-size: 0.16rem 0.16rem;
    color: rgb(114, 113, 113);
  }
  /*预约结束时未能赴约的状态*/
  .container section ul .title .failOrder{
    background: url(../../assets/media/img/order-list-yellow_circle_icon.png) no-repeat left center;
    background-size: 0.16rem 0.16rem;
    color: rgb(255,174,1);
  }
  /*预约中的样式*/
  .container section .cnacle-btn{
    display: inline-block;
    width: 1.7rem;
    height: .5rem;
    line-height: .5rem;
    color: rgb(55, 147, 255);
    text-align: center;
    border: 1px solid rgb(55, 147, 255);
    background: white;
    -webkit-border-radius: .1rem;
    -moz-border-radius: .1rem;
    -ms-border-radius: .1rem;
    -o-border-radius: .1rem;
    border-radius: .1rem;
    font-size: .32rem;
  }
  /*待审核同意和拒绝*/
  .container section .agree-btn,
  .container section .reject-btn{
    display: inline-block;
    width: 1.2rem;
    height: .5rem;
    font-size: .32rem;
    line-height: .5rem;
    text-align: center;
    -webkit-border-radius: .1rem;
    -moz-border-radius: .1rem;
    -ms-border-radius: .1rem;
    -o-border-radius: .1rem;
    border-radius: .1rem;
    margin-top: .25rem;
  }
  .container section .agree-btn{
    background: rgb(42, 140, 255);
    border: 1px solid rgb(42, 140, 255);
    color: white;
  }
  .container section .reject-btn{
    background: white;
    border: 1px solid rgb(42, 140, 255);
    color: rgb(42, 140, 255);
    margin-right: .54rem;
  }
  .tips{
    font-size: .32rem;
    color: gray;
    line-height: .6rem;
    padding:  70% .2rem 0;
    text-align: center;
  }
  header{
    width: 7rem;
    height: 0.6rem;
    font-size: 0.32rem;
    color: white;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    border: 1px solid white;
    border-radius: 0.06rem;
    span{
      width: 40%;
      text-align: center;
      line-height: 0.6rem;
      border-right: 1px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      i{
        line-height: 0.6rem;
        text-align: center;
      }
    }
    span:nth-of-type(3){
      border-right: none;
    }
  }
.btns{
  height: 1.1rem;
  box-sizing: border-box;
  display: flex;
  border-top: 1px solid $gray;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
}
  .active{
    background: white;
    color: $baseBlue;
  }
  .circle1{
    display: inline-block;
    border-radius: 0.17rem;
    font-size: 0.24rem;
    width: 0.34rem;
    height: 0.34rem;
    box-sizing: border-box;
    color: white;
    background: red;
    line-height: 1;
    padding: 0.05rem;
    margin-left: 0.1rem;
    vertical-align: center;
  }
  .circle2{
    display: inline-block;
    border-radius: 0.17rem;
    font-size: 0.24rem;
    width: 0.5rem;
    height: 0.34rem;
    box-sizing: border-box;
    color: white;
    background: red;
    line-height: 1;
    padding: 0.05rem;
    margin-left: 0.1rem;
    vertical-align: center;
  }
</style>
