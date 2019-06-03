<template>
  <!-- 添加会员 -->
  <div class="addPatients">
    <div class="con-fn">
      <div class="search">
        <input type="text" name="" value="" autocomplete="off" :class="['con-sear',{'con-sear-active':resultShow}]" v-focus="searchPat" v-model="searchInput" >
        <span class="con-position" v-show="!resultShow">搜索</span>
      </div>
    </div>
    <div class="add_patient" v-show="!resultShow">
        <ul class="add_patientlist">
           <li :class="['info',{'info-active': item.selected}]" v-for="item in list" @click.stop="toggle(item)">
             <img :src="item.headimg" alt="">
             <div>
               <span class="name">{{item.name ? item.name : item.nick}}</span>
               <span class="other">{{item.sex}} | {{item.age == 0 ?  `${item.age}&nbsp;` : item.age}} <span>{{item.group_name ? item.group_name : '未分组'}}</span></span>
             </div>
           </li>
        </ul>
    </div>
    <div class="search-result" v-show="resultShow">
       <div class="result" v-show="result.length== 0">查询不到符合的结果</div>
        <li :class="['info',{'info-active': item.selected}]" v-for="item in result" @click.stop="toggle(item)">
          <img :src="item.headimg" alt="">
          <div>
            <span class="name">{{item.name ? item.name : item.nick}}</span>
            <span class="other">{{item.sex}} | {{item.age}} <span>{{item.group_name ? item.group_name : '未分组'}}</span></span>
          </div>
        </li>
    </div>
  </div>
</template>

<script>
export default{
    name : 'selectPat',
    data(){return{searchInput : '', resultShow : false,result : []}},
    created (){
      let id = this.$route.params.id;
      this.$store.commit('UPDATE_NAV',{title : '选择会员',fn : '完成', router : `/${id}/addgroup`, fShow : false, hShow : true});
//     判断是否更新数据
      let group = this.$store.state.editGroup.group;
      if(!group){
        this.$store.dispatch('editGroupInitial',id == ' '? '' : id);
      }
    },
   computed :{
      list (){
          return this.$store.state.editGroup.all_pat;
      }
   },
  mounted(){
    document.querySelector('.nav_submit').onclick =(e)=>{
        this.$router.push({path : `addgroup`});
        e.preventDefault();
    }
  },
   watch :{
        searchInput(){
          let re = new RegExp(this.searchInput);
          this.result = [];
          if(this.searchInput != ''){
            this.resultShow = true;
            for (var i = 0; i < this.list.length; i++) {
              var temp = this.list[i].name;
              if(re.test(temp)){
                this.result.push(this.list[i]);
              }
            }
          }else{
            this.resultShow = false;
          }
        }
   },
   methods :{
        toggle (item){
            item.selected = item.selected  ?  false  : true;
            this.$store.commit('UPDATE_SELECT_PAT',item);
            this.$store.commit('UPDATA_IN_GROUP',{type : item.selected ? 'push' : 'shift',info :item});
        },
     searchPat(){
//          this.resultShow = true;
//          this.result = [];
     }

   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .con-fn {
    height: .94rem;
    border-bottom: 1px solid #dcdcdc;
    /*margin-bottom: .36rem;*/
    background: #fff
  }
  .addPatients{
    height: 100%;
    overflow: hidden;
  }
  .con-fn .search {
    padding: .2rem .2rem;
    -webkit-box-pack: space-between;
    -webkit-justify-content: space-between;
    display: flex;
    justify-content: space-between
  }

  .con-fn .search .con-sear {
    display: inline-block;
    /*background: #f2f2f2;*/
    width: 7.1rem;
    height: .5rem;
    padding-left: 0.6rem;
    /*padding: 0px .2rem;*/
    line-height: .5rem;
    background: #f2f2f2 url(../../assets/media/img/home-contact-search2.png) center;
    background-repeat: no-repeat;
    background-size: .28rem;
    background-position: 2.8rem .11rem;
    font-size: .26rem;
    box-sizing: border-box;
    /*position: relative;*/
  }
  .con-fn .search .con-sear-active{
    background: #f2f2f2;
  }
  .con-fn .search .con-sear-addnew{
    background-image: none;
    background: #f2f2f2;
  }
  .con-fn .search .con-position{
    display: inline-block;
    line-height: .5rem;
    position: absolute;
    font-size: .26rem;
    color: #9FA0A0;
    /*top: .27rem;*/
    left: 3.42rem;
    margin-top: 0.02rem;
  }
  /*查询结果*/
  .search-result{
    background: #fff;
  }
  .search-result .info{
    border-bottom: 1px solid #dcdcdc;
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
    /*background: lightpink;*/
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
    text-align: center;
    font-size: .32rem;
    line-height: 1rem;
  }

  /*添加会员*/
  .add_patient{
    background: #fff;
    height: calc(100% - 1rem);
    overflow: scroll;
    /*margin-top: .2rem;*/
  }
  .add_patient .add_patientlist{
    padding-left: .97rem;
  }
  .info{
    border-bottom: 1px solid #dcdcdc;
    height: 1.2rem;
    box-sizing: border-box;
    position: relative;
    background: url(../../assets/media/img/order-address_unSelected_icon.png) no-repeat right .38rem center;
    background-size: 0.35rem 0.35rem;
  }
  .info-active{
    background: url(../../assets/media/img/order-address_selected_icon.png) no-repeat right .38rem center;
    background-size: 0.35rem 0.35rem;
  }
  .add_patientlist .info img{
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
  .add_patientlist .info div{
    padding-top: .3rem;
    height: .75rem;
    width: 3rem;
    /*background: lightpink;*/
    margin-left: .23rem;
  }
  .add_patientlist .info .name{
    display: block;
    height: .32rem;
    line-height: .32rem;
    font-size: .32rem;
    color: #000;
    /*background: lightblue;*/
  }
  .add_patientlist .info .other{
    display: block;
    line-height: .26rem;
    margin-top: .17rem;
    font-size: .26rem;
    color: #9fa0a0;
  }
.other span{
  margin-left: 0.5rem;
}
</style>
