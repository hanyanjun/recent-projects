<template>
  <!-- 医院选择弹窗 -->
  <div class="hospital-select" v-show="display" @click.stop="close">
    <div class="header">
      <span class="area" @click.stop="searchShow = searchShow ? false : true">{{searchShow ? '地区' : '医院'}}</span>
      <input type="text" name="" :value="inputtext" placeholder="地区与医院之间空格或者逗号间隔" class="search-text" ref="input" v-model="inputtext" @click.stop="focus">
      <span class="search" @click.stop="searchResult"></span>
    </div>
    <ul class="select-list" v-show="searchShow">
      <li class="province list1"><span v-for="(item,index) in province"  @click.stop="clickPro(item,index)" :class="{active : index === pClass}">{{item.name}}</span></li>
      <li class="city list1"><span v-for="(item,index) in areas"  @click.stop="clickArea(item,index)" :class="{active : index === aClass}">{{item.name}}</span></li>
      <li class="hospital list1"><span v-for="item in hospitals"  @click.stop="clickHospital(item)" :class="{add : item.name == '没有匹配的医院?'}">{{item.name}}</span></li>
    </ul>
    <ul class="search-result" v-show="!searchShow">
      <li v-for="item in searchData"  @click.stop="searchSelect(item)">{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
  export default{
    name : 'hwHospital',
    props : ['display'],
    data(){return{
      province : '',
      areas : '',
      hospitals : '',
      pClass : '',
      aClass : '',
      searchShow  : true,
      pShow : false,
      inputtext: '',
      searchData : '',
      returnInfo : '',
      prompt : {show : false ,title : '添加医院',holder : '输入医院名',tip : ''}
//      pro : {
//        title : '添加医院',
//        holder : '输入医院名',
//        btns : [
//          {
//            name : '取消',
//            method : (v)=>{
//              this.pShow = false;
//            }
//          },
//          {
//            name : '确认',
//            method : (v)=>{
//              this.pShow = false;
//              this.$emit("event",{name : v, provinces_area_id : this.returnInfo.provinces_area_id ,cities_area_id : this.returnInfo.cities_area_id, hospitals_code: v});
//            }
//          }
//        ]
//      }
    }},
    created (){
      this.$api.gainProvince()
        .then(obj=>{
          this.province = obj.provinces;
        })

    },
    methods : {
      clickPro(item,index){
        this.proId = item.area_id;
        this.$api.gainAreas(item.area_id)
          .then(obj=>{
            this.areas = obj.areas;
          })
        this.pClass = index;
      },
      clickArea(item,index){
        this.cityId = item.area_id;
        this.$api.gainAHospital(this.proId,item.area_id)
          .then(obj=>{
            this.hospitals = obj.hospitals;
            this.hospitals.push({name : '没有匹配的医院?',provinces_area_id:this.proId, cities_area_id:this.cityId,hospitals_code: ''});
          })
        this.aClass = index;
      },
      clickHospital(item){
        this.returnInfo = item;
        if(item.name == '没有匹配的医院?'){
          this.prompt.show = true;
          this.prompt.callback =(t)=>{
            if(t == '取消'){
              this.prompt.show = false;
            }else{
               if(t.length == 0){
                   this.prompt.tip = '请输入医院';
               }else{
                 this.$emit("event",{name : t, provinces_area_id : this.returnInfo.provinces_area_id ,cities_area_id : this.returnInfo.cities_area_id, hospitals_code: t});
                 this.prompt.tip = '';
                 this.prompt.show = false;
               }
            }
          }
        }else{
            this.$emit("event",this.returnInfo);
        }
      },
      searchResult(){
        this.$api.searchHospital(this.inputtext)
          .then(obj=>{
            this.searchData = obj.hospitals;
          })
      },
      searchSelect(item){
        this.$emit("event",item);
      },
      close(){
          this.$emit("event");
      },
      focus(){
        this.searchShow = false;
        this.$refs.input.focus();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hospital-select {
    position: fixed;
    width: 100vw;
    top: 0;
    left: 0;
    height: 100vh;
    background: rgba(0, 0, 0, .4)
  }

  .hospital-select .header {
    height: .96rem;
    -webkit-box-align: center;
    -webkit-align-items: center;
    display: flex;
    align-items: center;
    position: relative;
    background: #f9f9f9;
    padding: 0 .6rem;
    font-size: .26rem;
    border-bottom: 1px solid #bfbfbf
  }

  .hospital-select .header .area {
    display: inline-block;
    margin: 0 .14rem;
    height: 100%;
    line-height: .96rem
  }

  .hospital-select .header input {
    width: 4.3rem;
    height: .52rem;
    font-size: .26rem;
    background: #e8e8ea;
    line-height: .52rem;
    padding-left: .46rem
  }

  .hospital-select .header .search {
    display: inline-block;
    width: .38rem;
    height: .36rem;
    background: url(../assets/media/img/search.png) no-repeat;
    margin-left: .2rem;
    background-size: 0.25rem 0.25rem;
  }

  .hospital-select .select-list {
    height: 6.38rem;
    font-size: .3rem;
    line-height: .8rem;
    overflow: hidden;
    background: #fff
  }
  .hospital-select .search-result {
    height: 6.38rem;
    background: #fff;
    overflow-y: scroll
  }
  .hospital-select .search-result li {
    font-size: 0.3rem;
    line-height: .8rem;
    height: .8rem;
    text-align: left;
  }

  .hospital-select .select-list .list1 {
    display: inline-block;
    overflow: scroll;
    vertical-align: top;
    height: 100%
  }

  .hospital-select .select-list .list1 span {
    text-align: center;
    display: block;
    overflow: hidden;
    white-space: nowrap
  }

  .hospital-select .select-list .province {
    width: 1.8rem;
    height: 100%;
    text-align: center;
    border-right: 1px solid #bfbfbf
  }

  .hospital-select .select-list .city {
    width: 1.4rem;
    text-align: center;
    color: #a2a3a6
  }

  .hospital-select .select-list .hospital {
    text-align: center;
    width: 3.5rem;
    padding-left: .35rem;
    color: #a2a3a6
  }

  .hospital-select .select-list .hospital span {
    text-align: left
  }

  .hospital-select .select-list .list2 {
    border: 1px solid red
  }
  .active{
    color:#2a8cff;
  }
  .add {
    color: #fc3608;
    text-align: center;
  }
</style>
