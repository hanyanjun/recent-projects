<template>
<div>
  <div class="container">
    <ul>
      <li class="name">姓名<span class="text">{{info.name}}</span></li>
      <li class="sex">性别<span class="text">{{info.sex}}</span></li>
      <li class="age">年龄<span class="text">{{(new Date()).getFullYear() - info.birth_year}}岁</span></li>
      <li class="address">所在地区<span class="text">{{info.city ? info.city : '未填写'}}</span></li>
    </ul>
  </div>
  <ul class="ill_desc desc">
    <h6>病情描述</h6>
    <div class="text">
        {{order.ill_desc ? order.ill_desc : '未填写'}}
    </div>
    <div class="images" v-show="order.ill_img">
      <img src="" alt="" v-for="item in order.ill_img"  v-img="item" @click.stop="preView(item)">
    </div>
  </ul>
  <ul class="drug_desc desc">
    <h6>药物描述</h6>
    <div class="text">
        {{order.drug_desc ? order.drug_desc : '未填写'}}
    </div>
    <div class="images" v-show="order.drug_img">
      <img src="" alt="" v-for="item in order.drug_img"  v-img="item"  @click.stop="preView(item)">
    </div>
  </ul>
</div>
</template>

<script>
export default{
    name : 'orderInfo',
    data(){return{info : '',order : ''}},
    created (){
      this.$store.commit('UPDATE_NAV',{title : '就诊人信息',fn : '', router : `orderDetail`, fShow : false, hShow : true});
      this.$api.appointDetailInfo(this.$route.params.id)
        .then(obj=>{
            this.info = obj.order.member_info;
            this.order = obj.order;
            this.$store.commit('SET_IMG_ARR',{way : 'clear' });
            let arr = obj.order.ill_img.concat(obj.order.drug_img);
            this.$store.commit('SET_IMG_ARR',{way : 'concat' ,msg : arr});
        })
    },
    methods:{
      preView(src){
        this.$store.dispatch('wxImgView',src);
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  body{
    background: rgb(242, 243, 245);
  }
  .container{
    text-align: left;
  }
  .container h6{
    height: .94rem;
    line-height: .94rem;
    color: white;
    padding-left: .43rem;
    background: rgb(3, 149, 252);
    font-size: .34rem;
    font-weight: normal;
  }
  .container ul{
    background: white;
    padding: 0 .35rem 0 .45rem;
  }
  .container ul li{
    height: .9rem;
    line-height: .9rem;
    border-bottom: 1px solid rgb(220, 220, 220);
    font-size: .34rem;
    font-weight: bolder;
    position: relative;
  }
  .container ul li .text{
    position: absolute;
    right: 0;
    top: 0;
    max-width: 5.2rem;
    text-align: right;
    font-size: .32rem;
    color: rgb(134, 134, 134);
    font-weight: normal;
    padding-right: .1rem;
  }
  /*病情描述以及药物描述*/
  .desc{padding: 0 .4rem; background: rgb(255,255,255);margin-top: .2rem;}
  .desc h6{font-size: .32rem;line-height: .8rem;text-align: left}
  .desc .text{font-size: .29rem;word-wrap: break-word;word-break: break-all;line-height: .4rem;color: gray;min-height: 1.5rem;padding: .1rem 0;}
  .desc .images{border-top: 1px solid rgb(220,220,220);text-align: center;padding: .1rem 0;height: 1.05rem;display: -webkit-box;-webkit-box-align:center;display: -webkit-flex;-webkit-align-items :center;display: flex;align-items: center;}
  .desc .images img{width: .8rem;height: .8rem;margin-left: 1.5%;}
</style>
