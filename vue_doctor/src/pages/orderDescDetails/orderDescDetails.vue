<template>
  <div class="record">
    <h6>{{$means.timestampTotime(info.created)}}</h6>
    <p>{{info.content}}</p>
  </div>
</template>

<script>
export default{
    name : 'orderDescDetails',
    data(){return { info : ''}},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '病历描述', fn : '',router : '/complete/myOrder', fShow : false, hShow : true});
      this.$api.gainOrderDesc(this.$route.params.id).then(obj=>{
          this.info = obj.desc;
      })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  body {
    background: #f0eff5
  }
  .record{
    width: 6.6rem;
    margin: .4rem auto;
    background: white;
    padding: 0 .4rem .8rem;
    border-radius: .1rem;
    box-sizing: border-box;
  }
  .record h6{
    display: block;
    height: .9rem;
    background: url(../../assets/media/img/day.png) no-repeat left center;
    padding: 0 .2rem 0  .7rem;
    background-size: 0.44rem 0.47rem;
    line-height: .9rem;
    box-sizing: border-box;
    color: rgb(4, 142, 252);
    font-size: .34rem;
    border-bottom: 1px solid #c6c8ca;
  }
  .record p{
    font-size: .3rem;
    color: #767676;
    padding-top:.13rem;
    letter-spacing: .03rem;
  }
</style>
