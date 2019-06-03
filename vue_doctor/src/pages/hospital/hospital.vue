<template>
  <div class="container" v-show="display">
    <search :config="config" v-on:focus="focus" v-on:search="search"  v-on:input="input"></search>
    <div class="hospital">
       <section class="tab" v-show="!resultShow">
         <span v-for="item in tab"  :class="item.class" @click.stop="back(item)">{{item.text}}<i></i></span>
       </section>
       <ul class="select" v-show="!resultShow" >
          <li v-for="(item,index) in (type == 'province' ? province : (type == 'area' ? area : hospital))" @click.stop="select(item)" :style="{color : item.name == '没有匹配的医院?' ? '#fc3608' : ''}">{{item.name}}</li>
       </ul>
      <ul class="result" v-show="resultShow">
           <li v-for="item in result" @click.stop="resultSelect(item)">{{item.name}}</li>
            <span v-show="result.length == 0">没有查询到符合条件的结果</span>
      </ul>
    </div>
    <prompt :config="pro"></prompt>
  </div>
</template>

<script>
  import search from '../../components/search'
  import prompt from '../../components/prompt'
  import {Toast} from '../../components/hw-components'
export default{
    data(){return{
        props : ['display'],
        config : {bg : 'white',placeHolder : '地区与医院之间空格或者逗号间隔'},
        resultShow : false,
        result : [],
        type : '',
        province : [],
        area : [],
        hospital : [],
//        selectHospitalShow : true,
        tab : [
          {
              text : '省份',
              id : '',
              class : 'span-active',
              type : 'province'
          },
          {
              text :'城市',
               id : '',
              class : '',
              type : 'area'
          },
          {
              text : '医院',
              id : '',
              class : '',
              type : 'hospital'
          }
        ],
        pro : {
          title : '添加医院',
          holder : '输入医院名',
          show : false,
          btns : [
            {
              name : '取消',
              method : (v)=>{
                this.pro.show = false;
              }
            },
            {
              name : '确认',
              method : (v)=>{
                this.pro.show = false;
                this.$emit("event",{name : v, provinces_area_id : this.tab[0].id,cities_area_id : this.tab[1].id, hospitals_code: ''});
              }
            }
          ]
        }
    }},
    name : 'hospital',
    created(){
      this.$store.commit('UPDATE_NAV',{title : '主页',fn : '', router : '/work', hShow : true,fShow : false});
      this.$api.gainProvince()
        .then(obj=>{
          this.province = obj.provinces;
          this.type = 'province'
        })
    },
    components : {search,prompt},
    methods : {
        focus (v){
          this.resultShow = v == '' ? false : true;
        },
        search(v){
          this.$api.searchHospital(v)
            .then(obj=>{
              this.result = obj.hospitals;
            })
        },
        input(v){
           this.resultShow = v == '' ? false : true;
           this.result = [];
        },
        resultSelect(item){
            console.log(item);
        },
        select(item){
            let type = this.type;
            this.clearTab();
            if(type == 'province'){
              this.$api.gainAreas(item.area_id)
                .then(obj=>{
                  this.tab[1].class = 'span-active';
                  this.tab[0].text = item.name;
                  this.tab[0].id = item.area_id;
                  this.type = 'area';
                  this.area = obj.areas;
                })
            }else if(type == 'area'){
              this.$api.gainAHospital(this.tab[0].id,item.area_id)
                .then(obj=>{
                  this.tab[2].class = 'span-active';
                  this.tab[1].text = item.name;
                  this.tab[1].id = item.area_id;
                  this.type = 'hospital';
                  this.hospital = obj.hospitals;
                  this.hospital.push({name : '没有匹配的医院?',provinces_area_id:this.tab[0].id, cities_area_id:this.tab[1].id,hospitals_code: ''});
                })
            }else if(type == 'hospital'){
                  if(item.name == "没有匹配的医院?"){
                      this.pro.show = true;
                  }else{
                      console.log(item);
                  }
            }
        },
        clearTab(){
            this.tab.forEach((v,i)=>{
                v.class = '';
            })
        },
        back(item){
            this.clearTab();
           if(item.type == 'province'){
              item.class = 'span-active';
               this.type = 'province';
               this.tab[0].text  = '省份';
               this.tab[1].text = '城市';
               this.area = [];
           }else if(item.type == 'area'){
               if(this.area.length == 0){
                 this.tab[0].class = 'span-active';
                  Toast('请选择省份');
               }else{
                 this.type = 'area';
                 item.class = 'span-active';
                 this.hospital = [];
                 this.tab[1].text = '城市';
               }
           }else{
               if(this.hospital.length == 0){
                 Toast('请选择城市');
                 this.tab[1].class = 'span-active';
               }else{
                 this.type = 'hospial';
                 item.class = 'span-active';
                 this.tab[2].text = '城市';
               }
           }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
.container{
  width:100%;
  position: absolute;
  top:0;
  left:0;
  .hospital{
    height: 6.6rem;
    background: white;
    .tab{
      line-height: 0.7rem;
      font-size: 0.26rem;
      padding: 0 0.6rem;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid $gray;
      i{
        display: inline-block;
        width:0;
        height: 0;
        border-right: .12rem solid transparent;
        border-left: .12rem solid transparent;
        border-bottom: .12rem solid transparent;
        border-top: .12rem solid $gray;
        margin-left: 0.2rem;
        vertical-align: middle;
      }
      .span-active{
        color: $baseBlue;
        i{
          transform-origin: 50% 25%;
          transform: rotateX(180deg);
        }
      }
    }
    .select,.result{
      padding-left:  0.6rem;
      overflow-y: scroll;
      height: 5.8rem;
      padding-bottom: 0.5rem;
      box-sizing: border-box;
      li{
        padding-top: 0.2rem;
        font-size: 0.28rem;
        line-height: 0.68rem;
        border-bottom: 1px solid $gray;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .result span{
      display: block;
      padding: 0.2rem 0;
      text-align: center;
      font-size: 0.28rem;
    }
  }
}
</style>
