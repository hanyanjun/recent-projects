<template>
<div class="container">
  <section @click.stop="skip(item)" v-for="(item,index) in records">
    <li class="title"> <span>{{item.note}}</span> <span>-{{item.amount}}</span></li>
    <li class="info"> <span>{{changeTime(item.created)}}</span> <span  :style="item.status != '4' ? '' :  {'color' : 'red'}">{{item.status !=  '4' ? item.balance : '提现失败'}}</span></li>
    <i class="icon-return-boldleft"></i>
  </section>
  <empty :config="eConfig"></empty>
</div>
</template>

<script>
  import empty from '../../components/empty'
  export default{
    name : 'transferHistory',
    data(){return{
      records :[],
      eConfig : {show : false , text : '您还没有提现记录哦！'}
    }},
    components:{empty},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '提现记录', hShow : true , fShow : false});
    },
    mounted(){
      switch (this.walletType.type){
        case 'team':
          this.$api.teamTransferRecord(this.walletType.id).then(obj=>{
            this.records = obj.records;
            if(obj.records.length == 0){
              this.eConfig.show = true;
            }
          })
          break;
        default:
          this.$api.transferRecord().then(obj=>{
            this.records = obj.records;
            if(obj.records.length == 0){
              this.eConfig.show = true;
            }
          })
      }
    },
    computed:{
      walletType(){
        return this.$store.state.walletType;
      }
    },
    methods :{
        skip(v){
            this.$router.push({path : `/${v.transfer_no}/transferDetail`})
        },
        text(v){
            switch (v){
              case '1':
                  return '待处理';
                  break;
              case '2':
                  return '处理中';
                  break;
              case '3':
                  return '已到账';
                  break;
              case '4':
                  return '取消';
                  break;
            }
        },
      changeTime(time){
        if(time){
          var t1 = time.split(' ')[0];
          var t2 = time.split(' ')[1];
          return t1.split('-')[0]+'/'+t1.split('-')[1]+'/'+t1.split('-')[2]+' '+t2.split(':')[0]+':'+t2.split(':')[1];
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
section{
  height: 1.44rem;
  background: white;
  border-bottom: 1px solid $gray;
  padding: 0.3rem 0.7rem 0.3rem 0.3rem;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  position: relative;
  .title{
    width: 100%;
    font-size: 0.32rem;
    display: flex;
    justify-content: space-between;
  }
  .info{
    width: 100%;
    font-size: 0.26rem;
    display: flex;
    color: $fGray;
    justify-content: space-between;
  }
  .icon-return-boldleft{
    color: $iconGray;
    transform: translateY(-50%) rotateY(180deg);
    font-size: 0.3rem;
    position: absolute;
    right: 0.3rem;
    top: 50%;
  }
}
</style>
