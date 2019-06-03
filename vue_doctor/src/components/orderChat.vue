<template>
  <table cellspacing="0" v-show="switchs == 2">
    <tr>
      <caption><i class="icon-docHome-order">
                <i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i><i class="path5"></i><i class="path6"></i><i class="path7"></i><i class="path8"></i>
                </i>门诊预约<span @click.stop="skip">查看更多&nbsp;&gt;&gt;</span></caption>
      <th></th>
      <th :style="index ==0 ? 'color:rgb(3,137,252)' : ''" v-for="(item,index) in day">{{item}}</th>
    </tr><tr v-show="m">
    <td>上午</td>
    <td v-for="item in m"  :class="item.c" :data-id="item.id" >{{item.text}}</td>
    <!-- <td class="orderMax">约满</td>
    <td class="order">可约</td>
    <td class="noOrder">不可约</td> -->
  </tr><tr v-show="a">
    <td>下午</td>
    <td v-for="item in a" :class="item.c" :data-id="item.id">{{item.text}}</td>
  </tr><tr v-show="n">
    <td>晚上</td>
    <td v-for="item in n" :class="item.c" :data-id="item.id">{{item.text}}</td>
  </tr>
  </table>
</template>

<script>
  export default{
    name : 'orderChat',
    data (){return{
      day : [],
      m : [],
      a : [],
      n : []
    }},
    computed : {
      switchs (){return this.$store.state.docInfo.appoint_switch}
    },
    created (){
      let dayArr = this.$means.dayArr();
      for(let i= 0; i < dayArr.length; i++){
        this.m.push({t : dayArr[i]});
        this.a.push({t : dayArr[i]});
        this.n.push({t : dayArr[i]});
        this.day.push(this.$means.numToday(dayArr[i]));
      }
      this.$api.gainAppointSet()
        .then(obj=>{
          obj.set.forEach((v,i,a)=>{
            if(v.week_time == 1){
              this.m.forEach(j=>{
                if(j.t == v.week_day){
                  Object.assign(j,v);
                }
              })
            }else if(v.week_time == 2){
              this.a.forEach(j=>{
                if(j.t == v.week_day){
                  Object.assign(j,v);
                }
              })
            }else{
              this.n.forEach(j=>{
                if(j.t == v.week_day){
                  Object.assign(j,v);
                }
              })
            }
          })
//          change(this.m);
          this.m = Object.assign({},this.m,change(this.m));
          change(this.a);
          change(this.n);
          function  change(a) {
            a.forEach((v,i,a)=>{
              if (v.appoint_set_status == '1') {
                //  如果设置出诊人数为0
                if (v.set_count == '0') {
                  v.c = 'noOrder';
                  v.text = '不可约';
                }
                //  如果设置出诊人数不为0
                else{
                  if(v.appoint_count == '0'){
                    v.c = 'orderMax';
                    v.text = '约满';
                  }else{
                    v.c = 'order';
                    v.text = '可约';
                  }
                }
              }
            })
            return a;
          }
        })
    },
    methods : {
        skip(){
            this.$router.push({path : '/review/myOrder'})
        }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../assets/css/common";
  /*门诊预约*/
  table{
    width: 100%;
    background:white;
    margin-top: .15rem;
    height: 3.72rem;
    line-height: 0;
  }
  table caption{
    text-align: left;
    padding-left: 0.3rem;
    height: .76rem;
    line-height: .76rem;
    font-size: .34rem;
    display: flex;
    align-items: center;
    position: relative;
    font-size: 0.32rem;
    .icon-docHome-order{
      font-size: 0.38rem;
      margin-right: 0.2rem;
    }
  }
  table caption span{
    font-size: .25rem;
    color: rgb(119, 119, 117);
    position: absolute;
    height: .76rem;
    line-height: .76rem;
    right: 0;
    top: 0;
    padding-right: .3rem;
  }
  table tr{
    display: inline-block;
    width: 100%;
  }
  th,td{
    width: .94rem;
    height: .7rem;
    line-height: .7rem;
    text-align: center;
    font-size: .3rem;
    font-weight: normal;
    border: 1px solid $gray;
  }
  .orderMax,.noOrder{
    background: rgb(220, 238, 253);
    color: rgb(122, 123, 124);
  }
  .order{
    background: rgb(3, 137, 251);
    color: white;
  }
</style>
