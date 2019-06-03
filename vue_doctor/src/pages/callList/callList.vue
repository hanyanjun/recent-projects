<template>
  <div class="container">
    <midConfirm :visible="midShow" @cancle="complete" @confirm="callFinish" title="与患者通话成功!" tip="咨询结束后,可获得收入" confirm="咨询结束" cancle="取消" img="phone"></midConfirm>
    <header>
      <span :class="[{'active' :filter.status == '1'}]"  @click.stop="filter.status = '1'">进行中 <i :class="numClass(c1)">{{num(c1)}}</i></span>
      <span :class="[{'active' : filter.status == '2'}]" @click.stop="filter.status = '2'">已完成 <i>({{c2}})</i></span>
    </header>
    <div class="content loadWrapper">
      <loading-more :data="arr" :pullupLoad="true" @pullup="load" :tip="isTip" :empty="false">
        <section v-for="(item,index) in arr" @click.stop="skip(item)" v-show="item">
          <ul>
            <li class="title">{{item.order_start ? time(item.order_start) : ''}}
              <template v-if="item.order_status == '2'">
                <template v-if="item.replay_status != '3'">
                  <span  class="order-status orange" >待通话</span>
                </template>
                <template v-else>
                  <span  class="order-status orange" >已通话待确认</span>
                </template>
              </template>
              <template v-else-if="item.order_status == '3'">
                <span  class="order-status order-status_cancle">已取消</span>
              </template>
              <template v-else-if="item.order_status == '4'">
                  <span  class="order-status">已完成</span>
              </template>
            </li>
            <li class="name">就诊人:<span>{{item.name}}</span></li>
            <li class="info">信息:<span class="sex">{{item.sex}}</span><span class="age"> {{item.age}}</span> <i class="icon-hospital-area" v-show="item.city"></i><span class="area">{{item.city}}</span></li>
            <li class="illness">病情描述:<span>{{item.ill_desc}}</span></li>
          </ul>
          <h6 class="time">通话时间&nbsp;&nbsp;&nbsp;&nbsp;{{detailTime(item)}}</h6>
          <div class="btns" v-show="item.order_status != '3'">
            <template v-if="item.order_status == '2'">
              <template v-if="item.replay_status == '1'">
                <template v-if="item.modify_count >= 2">
                  <a href="javascript:;"  class="btn1" @click.stop="callCancle(item)">取消订单</a>
                </template>
                <template v-else>
                  <a href="javascript:;"  class="btn1" @click.stop="callModify(item)">修改时间</a>
                </template>
                <a  href="javascript:;" class="btn2" @click.stop="callPhone(item)">拨打电话</a>
              </template>
              <template v-else-if="item.replay_status == '3'">
                <a href="javascript:;"  class="btn1" @click.stop="callPhone(item)">重拨</a>
                <a  href="javascript:;" class="btn2" @click.stop="complete(item)">通话完成</a>
              </template>
              <template v-else-if="item.replay_status == '2'">
                <template v-if="item.modify_count >= 2">
                  <a href="javascript:;"  class="btn1" @click.stop="callCancle(item)">取消订单</a>
                </template>
                <template v-else>
                  <a href="javascript:;"  class="btn1" @click.stop="callModify(item)">修改时间</a>
                </template>
                <a href="javascript:;"  class="btn1" @click.stop="callPhone(item)">重拨</a>
              </template>
            </template>
            <template v-else-if="item.order_status == '3'">
              <!--<a href="javascript:;"  class="btn1" @click.stop="callPhone(item)">重拨</a>-->
            </template>
            <template v-else-if="item.order_status == '4'">
              <a  href="javascript:;" class="btn1"  @click.stop="skipChat(item)">查看交流</a>
            </template>
          </div>
        </section>
      </loading-more>
      <empty :config="{show : arr.length == 0, text :  is_btn ? '暂时还没有开通该功能' : this.filter.tip , btn : is_btn ? '去开通' : '' , btnLink : '/callSet'}"></empty>
    </div>
    <middle-select :config="selectData"></middle-select>
  </div>
</template>

<script>
  import {MessageBox} from '../../components/hw-components'
  import middleSelect from '../../components/middleSelect'
  import midConfirm from '../../components/midConfirm'
  import addText from '../../components/addText'
  import empty from '../../components/empty'
  import loadingMore from  '../../components/loadingMore'
  export default{
    name : 'myOrder',
    data(){return{
      c1 : '',c2 : '', isTip : false,arr : [{member_info :{name : ''}}], filter : { status : '' , page : 0 , tip : ''},old : { status : '' , page : 0 , tip : ''},
//     操作id  拒绝 同意 临时取消  添加描述  未来就诊
      id : '',
      item : '',
      curItem : '',
      prompt : {show : false ,title : '修改原因',holder : '请输入修改原因',  tip : '',value : ''},
      midShow : false,
      selectData :{
        title :'请选择修改原因',
        text: ['门诊数量过多','门诊时间需要调整','工作时间有冲突','自定义'],
        show : false,
        method : (v)=>{
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
                    this.prompt.tip = '请输入修改原因';
                  }else if(t.length > 100){
                    this.prompt.tip = '不能超过100个字符';
                  }else{
                    this.$api.cancelCallOrder(this.item.order_no,t).then(obj=>{
                      this.arr = this.arr.removeByValue(this.item);
                      this.c1--;
                      this.c2++;
                      this.filter.tip = '您还没有待通话的咨询!';
                    })
                    this.prompt.show = false;
                  }
                }
              }
            }else{
              this.$api.cancelCallOrder(this.item.order_no,v).then(obj=>{
                this.arr = this.arr.removeByValue(this.item);
                this.c1--;
                this.c2++;
                this.filter.tip = '您还没有待通话的咨询!';
              })
              this.selectData.show = false;
              this.prompt.show = false;
            }
          }else{
            this.selectData.show = false;
          }
        }
      },
    }},
    watch : {
      filter :{
        handler :function (v,o) {
          if(v.status != this.old.status){
            this.filter.page  = 0;
            this.isTip = false;
            this.$router.push({path : `/${v.status}/callList`});
            this.old  = Object.assign({},v);
            this.load(true);
          }else{

          }
        },
        deep : true
      },
      '$route' : 'routeChange',
    },
    components : {middleSelect,addText,empty,loadingMore,midConfirm},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '电话咨询', fn: '设置', fShow : false, hShow : true});
    },
    computed:{
      info(){
        return this.$store.state.docInfo;
      },
      is_btn(){
        if ( this.info.call_switch == 1) return true;
        return false;
      }
    },
    mounted (){
      this.filter.status  =  this.$route.params.type;
      document.querySelector('.nav_submit').onclick =()=>{
        this.$router.push({path : '/callSet'});
      }
    },
    methods : {
      routeChange(){
        document.querySelector('.nav_submit').onclick =()=>{
          this.$router.push({path : '/callSet'});
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
      detailTime(item){
        if(!item.order_start) return '';
        let s = item.order_start.split(' ')[0].split('-');
        let time;
        //判断年月日是否相同
        if(item.modify_time){
          time =  item.modify_time.substring(0,16).replace(/-/g,'/');
        }else{
          let arr  =   item.order_end.split(' ')[0].split('-');
          if(arr[0] == s[0] && arr[1] == s[1] && arr[2] == s[2]){
            time =  item.order_start.substring(0,16).replace(/-/g,'/') + '-' + item.order_end.substring(11,16).replace(/-/g,'/');
          }else{
            if(arr[0] == s[0]){
              time =  item.order_start.substring(0,16).replace(/-/g,'/') + '-' + item.order_end.substring(5,16).replace(/-/g,'/');
            }else{
              time =  item.order_start.substring(0,16).replace(/-/g,'/') + '-' + item.order_end.substring(0,16).replace(/-/g,'/');
            }
          }
        }
        return time;
      },
      complete(v){
        if(v){
          this.curItem = v;
        }
        this.midShow = !this.midShow;
        this.$store.state.isMask = this.midShow;
      },
      load(v){
        if(v){
          this.filter.page ++;
          if(this.filter.page == 1){
            this.arr = [''];
          }
          this.$api.callList(this.filter)
            .then(obj=>{
              let t = this.filter.status == '1' ? '待通话' : '已完成';
              if(obj.orders.length == 0){
                this.isTip = true;
                if(this.filter.page == 1){
                  this.filter.tip = `您还没有${t}的咨询!`;
                }
              }
              if(this.filter.page == 1){
                this.arr = obj.orders;
              }else{
                this.arr = [...this.arr,...obj.orders];
              }
              this.c1 = obj.count1;
              this.c2 = obj.count2;
            })
        }
      },
      time(v){
        let arr = v.split(" ");
        let a1 = arr[0].split('-');
        return a1[1]+'月'+a1[2]+'日'+arr[1].substr(0,5);
      },
      callCancle(item){
        this.id = item.id;
        this.item = item;
        this.selectData.show = this.selectData.show ? false : true;
      },
      callFinish(){
        let item = this.curItem;
        this.$store.state.isMask = false;
        this.midShow = false;
        this.$api.callFinish(item.order_no).then(obj=>{
          item.order_status = 4;
          this.$router.push({path : `/${2}/callList`});
          this.filter.status = '2';
        })
      },
      callModify(v){
        let t = v.order_end.replace(/-/g,'/');
        let t1 = Date.parse(new Date(t));
        let t2 = Date.parse(new Date());
        let t3 = new Date();
        var Y = t3.getFullYear() + '-',
        M = (t3.getMonth()+1 < 10 ? '0'+(t3.getMonth()+1) : t3.getMonth()+1) + '-',
        D = t3.getDate() + ' ',
        h = t3.getHours() + ':',
        m = t3.getMinutes() + ':',
        s = t3.getSeconds();
        let t4 = Y+M+D+h+m+s;
        if(t1 >= t2){
          this.$router.push({path : `/${v.order_no}/callSetModify`, query : {time : v.order_end} });
        }else{
          this.$router.push({path : `/${v.order_no}/callSetModify`, query : {time : t4} });
        }
      },
      callPhone(v){
        this.$router.push({path : `/${v.order_no}/callPhone`});
      },
      skip(v){
        this.$router.push({path : `/${v.order_no}/indentDetail`});
      },
      skipChat(v){
        this.$router.push({path : `/${v.account}/chat`});
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
    border-radius: 0.06rem;
    text-align: right;
  }
  .container section a{
    display: inline-block;
    width: 1.56rem;
    height: .55rem;
    line-height: .55rem;
    color: $baseBlue;
    text-align: center;
    border: 1px solid $baseBlue;
    background: white;
    border-radius: 0.06rem;
    font-size: .34rem;
    margin-right: 0.18rem;
  }
  /*会员没来的按钮*/
  .container section .btn2{
    color: white;
    background: $baseBlue;
  }
  .container section .btns{
    button:nth-last-of-type(1){
      margin-right: 0;
    }
  }
  .container section ul{
    padding: .2rem .3rem 0;
    /*border-bottom: 1px solid rgb(181, 181, 181);*/
    box-sizing: border-box;
    /*height: 3.18rem;*/
    text-align: left;
    color: $gray_a;
  }
  .container section ul .title{
    height: .66rem;
    line-height: .66rem;
    color: $gray_a;
    font-size: .32rem;
    padding-left: .66rem;
    background: url(../../assets/media/img/callPhone_icon.png) no-repeat left top 0.1rem;
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
    background-size: 0.16rem 0.16rem;
    color: $baseBlue;
  }
  .container section ul .title .orange{
    color: $orange;
  }
  .container section ul .title .order-status_cancle{
    color: $input_c;
  }
  .container section ul .name,
  .container section ul .info,
  .container section ul .illness{
    width: 100%;
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
  .container section  .time{
    height: 0.74rem;
    font-size: 0.28rem;
    line-height: 0.74rem;
    text-align: center;
    margin-top: 0.3rem;
    color: $green_c;
    background: $green_h;
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
    color: $input_c;
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
  .container .order-cancle ul{
    border-bottom: none;
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
      width: 50%;
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
    box-sizing: border-box;
    display: flex;
    border-top: 1px solid $gray;
    justify-content: flex-end;
    align-content: center;
    align-items: center;
    padding: 0.36rem 0.3rem 0.38rem;
    a:nth-last-of-type(1){
      margin-right: 0;
    }
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
