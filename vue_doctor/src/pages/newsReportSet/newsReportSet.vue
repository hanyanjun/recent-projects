<template>
  <div class="container">
    <hw-switch :config="hwSwitch" v-on:event="change"></hw-switch>
    <ul class="time b-1px-b  b-1px-t" v-show="hwSwitch.status">
      <li :class="['list1 b-1px-b',{'active':type == '1'}]"  @click.stop="select(1)">任意时间均可接收 <span :class="{'span-active': type == 1}">全天</span></li>
      <li :class="['list2 b-1px-b',{'active':type == '2'}]" @click.stop="select(2)">只在白天接收 <span :class="{'span-active':type == '2'}">8:00-22:00</span></li>
      <li :class="['list3 b-1px-b',{'active':type == '3'}]"  @click.stop="select(3)">只在夜晚接收 <span :class="{'span-active' : type == '3'}">22:00-次日8:00</span></li>
      <li :class="['noline list4',{'active':type == '4'}]" @click.stop="select(4)">自定义时间段 <span :class="{'span-active' : type == '4'}">{{start}}:00-{{start > end ? '次日' : ''}}{{end}}:00</span></li>
    </ul>
  </div>
</template>

<script>
  import hwSwitch from '../../btns/hwSwitch.vue'
export default{
    data(){return{
        hwSwitch : '',type : '',start : '00',end : '00'
    }},
    components : {
      hwSwitch
    },
    created(){
      this.$store.commit('UPDATE_NAV',{title : '消息提醒设置', fn : '',router : '/my', fShow : false, hShow : true});
      this.$api.getNewsSwitch()
        .then(obj=>{
            console.log(obj)
            this.hwSwitch = {
                title : '接收新消息通知',
                status : obj.msg.message_switch == 2 ? true : false,
                tip :  obj.msg.message_switch == 2  ? '关闭后将不再发送新的会员报到、图文咨询等通知' : '开启后可设置发送新的会员报到、图文咨询（按次）等通知接收的额时间段'
            }
           this.type = obj.msg.message_switch_type;
           this.start = parseInt(obj.msg.message_switch_start);
           this.end = parseInt(obj.msg.message_switch_end);
           if(this.type != '4'){
               this.start = '00';
               this.end = '00';
           }
//            设置选择时的数据
           this.$picker2.setData(this.$hwdata.newReportData());
        })
    },
    methods : {
        change(){
            let set = this.hwSwitch.status ? 1 : 2;
           this.$api.setNewsReportTime({switch : set})
             .then(obj=>{
               this.hwSwitch = {
                 title : '接收新消息通知',
                 status : set == 2 ? true : false,
                 tip :  set == 2  ? '关闭后将不再发送新的会员报到、图文咨询（按次）等通知' : '开启后可设置发送新的会员报到、图文咨询（按次）等通知接收的额时间段'
               }
             })
        },
        select(v){
            this.type = v;
            if(v == 1){
              this.$api.setNewsReportTime({"switch" : '2', type : '1'});
              this.$picker2.hide();
            }else if(v == 2){
              this.$api.setNewsReportTime({"switch" : '2', type : '2',start : '8', end : '22'});
              this.$picker2.hide();
            }else if(v == 3){
              this.$api.setNewsReportTime({"switch" : '2', type : '3',start : '22',end : '8'});
              this.$picker2.hide();
            }else if(v == 4){
               this.$picker2.show(e=>{
                 let start = parseInt(e[0].text);
                 let end = parseInt(e[1].text);
                 this.start = start;
                 this.end = end;
                 this.$api.setNewsReportTime({switch : '2',type : '4',start : start, end : end});
               })
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  body{
    background: rgb(242, 243, 245);
  }
  .time{
    padding-left: .4rem;
    margin-top: .2rem;
    background: white;
    box-sizing: border-box;
  }
  .time li{
    height: 1rem;
    line-height: 1rem;
    font-size: .34rem;
    display: flex;
    justify-content: space-between;
  }
  .time li span{
    margin-right: 1.3rem;
    color: rgb(102, 103, 104);
    display: none;
  }
  .time .noline{
    padding-right: 1.3rem;
    background: url(../../assets/media/img/home-my_grayArrow.png) no-repeat;
    background-size: .18rem .29rem;
    background-position: right .4rem center;
  }
  .time .noline span{
    color: rgb(102, 103, 104);
    margin-right: 0;
  }
  .active{
    background: url(../../assets/media/img/complete.png) no-repeat;
    background-size: .45rem .3rem;
    background-position: right .4rem center;
  }
  .time li .span-active{
    display: inline-block;
  }
  h5[data-id=title-h]{
    width: 50%;
  }
</style>
