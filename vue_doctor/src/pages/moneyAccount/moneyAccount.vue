<template>
  <div class="container loadWrapper">
    <loading-more :data="info" :pullupLoad="true" @pullup="load" :tip= 'isShow'>
      <section v-for="item in info">
        <a href="javascript:;" class="monthDetail">
          <p >{{item.year}}年{{item.month}}月<br>
            <span>本月结算订单共{{item.count}}单</span>
          </p>
          <!--<p class="sti">共结算：{{item.amount_total}}元</p>-->
        </a>
        <div class="everyMonth">
          <div class="content" v-for="(item2,index) in item.list" @click.stop="skip(item2)">
            <p v-html="changedate(item2.created_timestamp)"></p>
            <div :class="['detail',{'blue' : item2.amount < 0}]">{{item2.note}}<br><span>支付时间({{item2.created.substring(11,16).trim()}})</span></div>
            <div :class="['price',{'blue' : item2.amount < 0}]">{{item2.amount < 0 ? item2.amount : '+'+item2.amount}}<br><span class="grayfont">余额:{{item2.balance}}
            </span></div>
          </div>
        </div>
      </section>
    </loading-more>
    <empty :config="empty"></empty>
  </div>
</template>

<script>
  import loadingMore from  '../../components/loadingMore'
  import {MessageBox2} from '../../components/hw-components'
  import empty from '../../components/empty'
  export default{
    data(){return{
      info: [],
      isShow: false,
      page: 1,
      empty : {
        show : false ,
        text : '您当前还没有结算记录哦！'
      },
      params: { statement_type : '',ym : '', page : 1},
    }},
    components:{loadingMore,empty},
    created (){
      this.$store.commit('UPDATE_NAV',{title : '对账单',fn : '结算规则', fShow : false, hShow : true});

    },
    mounted(){
      document.querySelector('.nav_submit').onclick = (e)=> {
        MessageBox2.confirm('结算方式：<br>[结算时间] = 订单结束后T+7天自然日或用户  主动确认订单完成<br>[结算金额] = 结算金额按80%比例转入可提现余额账户<br>补充：<br>●当日(月)订单金额 ≠ 当日(月)结算金额（订单支付时间和结算时间并非同一天）<br>●结算后，钱款转入到可提现余额，可申请提现操作')
      }
      switch (this.walletType.type){
        case "team":
          this.$api.teamWalletDetail(this.walletType.id,this.params)
            .then(obj=>{
              this.info = obj.orders;
              if(obj.orders.length == 0){
                this.empty.show = true;
              }
            });
        break;
        default:
          this.$api.walletDetail(this.params)
            .then(obj=>{
              this.info = obj.orders;
              if(obj.orders.length == 0){
                this.empty.show = true;
              }
            });
      }
    },
    computed:{
      walletType(){
        return this.$store.state.walletType;
      }
    },
    methods : {
      changedate: function(e){
        e = e + '000';
        let time = new Date();
        time.setTime(e);
        var aa = time.getDay();
        let d = time.getDate();
        let m =  time.getMonth()+1;
        switch(aa) {
          case 0:
            return `周日<br><h6 style="font-size: 0.26rem;width: 100%">${m}-${d}</h6>`;
            break;
          case 1:
            return `周一<br><h6 style="font-size: 0.26rem;width: 100%">${m}-${d}</h6>`;
            break;
          case 2:
            return `周二<br><h6 style="font-size: 0.26rem;width: 100%">${m}-${d}</h6>`;
            break;
          case 3:
            return `周三<br><h6 style="font-size: 0.26rem;width: 100%">${m}-${d}</h6>`;
            break;
          case 4:
            return `周四<br><h6 style="font-size: 0.26rem;width: 100%">${m}-${d}</h6>`;
            break;
          case 5:
            return `周五<br><h6 style="font-size: 0.26rem;width: 100%">${m}-${d}</h6>`;
            break;
          case 6:
            return `周六<br><span style="font-size: 0.26rem">${m}-${d}</span>`;
            break;
        }
      },
      load(v){
        if(v){
          setTimeout(()=>{
            this.params.page ++;
            switch (this.walletType.type){
              case "team":
                this.$api.teamWalletDetail(this.walletType.id,this.params)
                  .then(obj=>{
                    let objOrder = obj.orders;
                    if(objOrder.length == 0){
                      this.isShow = true;
                      return false;
                    }else{
                      obj.orders.forEach((v,i)=>{
                        if(v.month == this.info[this.info.length - 1].month){
                          this.info[this.info.length - 1].list   =  [...this.info[this.info.length - 1].list,...v.list];
                        }else{
                          this.info = [...this.info,v];
                        }
                      })
                    }
                  });
                break;
              default:
                this.$api.walletDetail(this.params).then(obj=>{
                  let objOrder = obj.orders;
                  if(objOrder.length == 0){
                    this.isShow = true;
                    return false;
                  }else{
                    obj.orders.forEach((v,i)=>{
                      if(v.month == this.info[this.info.length - 1].month){
                        this.info[this.info.length - 1].list   =  [...this.info[this.info.length - 1].list,...v.list];
                      }else{
                        this.info = [...this.info,v];
                      }
                    })
                  }
                })
            }
          },1000)
        }
      },
      skip(v){
          if(v.amount > 0){
              this.$router.push({path : `${v.order_no}/indentDetail`});
          }else{
            this.$router.push({path : `${v.transfer_no}/transferDetail`});
          }
      }
    }



  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  @mixin bordergray{
    border-bottom: 1px solid $gray;
  }
  section{
    margin-bottom: .2rem;
    line-height: 0.28rem;
  }
  .monthDetail .blue{
    color: $baseBlue;
  }
  .monthDetail{
    display: flex;
    width: 6.9rem;
    padding: .25rem .3rem;
    height: 0.7rem;
    background: #fff;
  @include bordergray;
    font-size: .32rem;
    color: #9fa0a0;
  // position: relative;
  p{
  // background: yellow;
    display: flex;
    align-content:space-between;
    flex-wrap: wrap;
    height: 0.7rem;
    width: 4rem;
    color: #000;
    font-size: 0.32rem;

    span{
      width: 4rem;
      color: #9fa0a0;
      font-size: .26rem;
      // margin-top: .2rem;
      display: inline-block;
    }
  }
    .sti{
      width: 2.9rem;
      text-align: right;
      line-height: 0.7rem;
      font-size: 0.26rem;
      justify-content: flex-end;
    }
  }
  .everyMonth{
    padding-left: .3rem;
    background: #fff;
    font-size: .32rem;
  .content{
    height: .7rem;
    padding: .25rem .3rem .25rem 0;
    display: flex;
    @include bordergray;
   p{
    color: #9fa0a0;
    height: .7rem;
    display: flex;
    align-content:space-between;
    flex-wrap: wrap;
    font-size: .3rem;
    width: 1rem;
  }
  .detail{
    display: inline-block;
    width: 3.8rem;
    color: black;
    font-size: .32rem;
    height: .7rem;
    display: flex;
    align-content:space-between;
    flex-wrap: wrap;
  span{
    width: 3.8rem;
    font-size: .26rem;
    color: #9fa0a0;
  // margin-top: .2rem;
    display: inline-block;
  }

  }
  .price{
    width: 2.1rem;
  // background: lightpink;
    font-size: .32rem;
    text-align: right;
    display: flex;
    align-content:space-between;
    flex-wrap: wrap;
    font-size: 0.32rem;
    justify-content : flex-end;
  span{
    color: $baseBlue;
  // margin-top: .2rem;
    display: inline-block;
    font-size: .26rem;
    width: 2.1rem;

  }
  .redfont{
    color: #fb3d03;
  }
  .grayfont{
    color: #9fa0a0;
  }
  }
    .blue{
      color: $baseBlue;
    }
  }
    .content:nth-last-of-type(1){
      border-bottom: none;
    }
  }
</style>
