<template>
<div class="container">
  <div class="content">
    <h6 v-if="walletType.type != 'team'">类型筛选
    </h6><section v-if="walletType.type != 'team'">
      <span v-for="(item,index) in type"><input type="radio" name="type" :id="index" :value="item.value" v-model="filter.type"><label :for="index">
        <template v-if="index == '1'">
          <i class="recommend" >次</i>
        </template>
        <template v-if="index == '3'">
          <i class="recommend" >期</i>
        </template>
        <span>{{item.type}}</span></label>
      </span>
    </section>
    <h6>时间筛选</h6>
    <span class="btn1">
      <input type="radio" :value="'all'"  id="t1" v-model="filter.ym" name="time">
      <label for="t1">不限</label>
    </span><span class="btn2">
      <input type="radio" :value="day"  id="t2" v-model="filter.ym" name="time" @click.stop="chooseTime">
      <label for="t2" >{{ day ? day : `${new Date().getFullYear()}年${new Date().getMonth()+1 < 10 ?  '0' + (new Date().getMonth()+1) :   new Date().getMonth()+1}月`}}<i class="icon-arrow-top" ></i></label>
    </span>
  </div>
  <button class="submit" @click.stop="submit">确定</button>
</div>
</template>

<script>
export default{
    name : 'indentFilter',
    data(){return{
        type : [{type : '全部类型' , value : 'all'} , {type : '图文咨询',value : '2'},{type : '电话咨询',value : '9'},{type : '图文咨询',value : '3'},{type : '门诊预约',value : '1'}],
        filter: {
            type : 'all',
            ym : 'all'
        },
        day : '',
        day1 : ''
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '筛选',fShow : false, hShow : true});
      let filter = this.$route.query.filter;
      if(filter){
          filter = JSON.parse(filter);
          this.filter.type = filter.type ? filter.type  : '';
          this.$picker4.setSelectedValue(filter.ym ? filter.ym : '');
          this.filter.ym = filter.ym ? filter.ym.split('-')[0]+'年'+filter.ym.split('-')[1]+'月' : 'all';
          this.day = this.filter.ym == 'all' ? '' : this.filter.ym;
      }
    },
    methods :{
        chooseTime(){
            this.$picker4.show(e=>{
              this.day = e.text.split('-')[0]+'年'+e.text.split('-')[1]+'月';
              this.filter.ym = e.text.split('-')[0]+'年'+e.text.split('-')[1]+'月';
              this.day1 = e.text.split('-')[0]+'-'+e.text.split('-')[1];
            })
      },
      submit(){
        this.filter.ym  = this.day1;
        this.$router.routeBack({filter : JSON.stringify(this.filter)});
      }
    },
    computed:{
      walletType(){
        return this.$store.state.walletType;
      }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
.container{
  height: 100%;
  overflow: hidden;
  background: white;
  .content{
    height: calc(100% - 1.33rem);
    overflow-y: scroll;
    padding: 0.2rem 0.3rem;
    box-sizing: border-box;
    line-height: 0;
    h6{
      font-size: 0.28rem;
      color: $fGray;
      height: 0.78rem;
      line-height: 0.78rem;
    }
    section{
      display: inline-block;
      line-height: 0;
      height: 1.72rem;
      width: 100%;
      padding-bottom: 0.15rem;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      align-content: space-between;
      justify-content: space-between;
      input{
        display: none;
      }
      label{
        display: inline-block;
        width: 2rem;
        height: 0.7rem;
        line-height: 0.7rem;
        font-size: 0.32rem;
        text-align: center;
        border: 1px solid $baseBlue;
        border-radius: 0.06rem;
        color: $baseBlue;
        position: relative;
        span{
          position: absolute;
          left: 0.4rem;
          top:0;
        }
      }
      .recommend {
        position: absolute;
        left: 0;
        top: 0;
        display: inline-block;
        width: 0.6rem;
        height: 0.4rem;
        font-size: 0.22rem;
        line-height: 0.3rem;
        padding-left: 0.04rem;
        box-sizing: border-box;
        text-align: left;
        color: white;
        background: linear-gradient(to bottom right, $baseBlue 50%, white 50%);
      }
    }
    .btn1{
      display: inline-block;
      width: 1rem;
      height: 0.7rem;
      border: 1px solid $baseBlue;
      border-radius: 0.06rem;
      text-align: center;
      line-height: 0.7rem;
      font-size: 0.32rem;
      background: white;
      color: $baseBlue;
      margin-right: 0.45rem;
      label{
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }
    .btn2{
      display: inline-block;
      width: 2.5rem;
      height: 0.7rem;
      border: 1px solid $baseBlue;
      border-radius: 0.06rem;
      text-align: left;
      line-height: 0.7rem;
      font-size: 0.32rem;
      background: white;
      color: $baseBlue;
      position: relative;
      box-sizing: border-box;
      label{
        padding-left: 0.16rem;
        box-sizing: border-box;
        display: inline-block;
        width: 100%;
        height: 100%;
      }
      .icon-arrow-top{
        font-size: 0.4rem;
        position: absolute;
        right: 0.2rem;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .submit{
    display: block;
    width: 6.9rem;
    height: 1rem;
    line-height: 1rem;
    background: $baseBlue;
    color: white;
    font-size: 0.4rem;
    margin: auto;
  }
  input:checked+label{
    background: $baseBlue;
    color: white;
  }
  input:checked+label>i:before{
    color: white;
  }
  input[type=radio]:checked + label > i {
    color: $baseBlue;
  }
  section input[type=radio]:checked + label > i {
    background: linear-gradient(to bottom right, white 50%, $baseBlue 50%);
  }
}
</style>
