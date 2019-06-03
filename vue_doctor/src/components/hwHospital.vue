<template>
  <div class="hw-hospital-selelct-container" v-show="display"  @click.stop="$emit('event')">
    <search :config="searchconfig"  v-on:focus="focus" @search="search"    v-on:input="input"></search>
    <div class="hospital">
      <section class="tab" v-show="!resultShow">
        <span v-for="item in tab"  :class="item.class" @click.stop="back(item)">{{item.text}}<i></i></span>
      </section>
      <ul class="select" v-show="!resultShow" >
        <li v-for="(item,index) in (type == 'province' ? province : (type == 'area' ? area : hospital))" @click.stop="select(item)" :style="{color : item.name == '没有匹配的医院?' ? '#2a8cff' : ''}">{{item.name}}</li>
      </ul>
      <ul class="result" v-show="resultShow">
        <li v-for="item in result" @click.stop="resultSelect(item)">{{item.name}}</li>
        <span v-show="resultTip" class="resultTip" @click.stop="add_hospital">添加医院："{{input_hos}}"</span>
      </ul>
    </div>
  </div>
</template>

<script>
  import search from './search'
  import {Toast} from './hw-components'
  export default{
    props : ['display'],
    data(){return{
      searchconfig : {bg : 'white',placeHolder : '请输入医院名称' , btn : '添加'},
      resultShow : false,
      result : [],
      type : '',
      province : [],
      area : [],
      hospital : [],
      input_hos : '',
      resultTip : false,
//      selectHospitalShow : true,
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
      prompt : {show : false ,title : '添加医院',holder : '输入医院名',tip : '',value : ''}
    }},
    name : 'hospital',
    created(){
      this.$api.gainProvince()
        .then(obj=>{
          this.province = obj.provinces;
          this.type = 'province'
        })
    },
    components : {search},
    methods : {
      focus (v){
        this.resultShow = v == '' ? false : true;
      },
      search(v){
         this.input_hos = v;
        this.$api.searchHospital(v)
          .then(obj=>{
            this.result = obj.hospitals;
            if(obj.hospitals.length == 0){
                this.resultTip = true;
            }
          })
      },
      input(v){
        this.resultShow = v == '' ? false : true;
        this.resultTip  =  false;
        this.result = [];
      },
      resultSelect(item){
        this.$emit('event',item);
      },
      select(item){
        this.init();
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
              this.init();
            })
        }else if(type == 'area'){
          this.$api.gainAHospital(this.tab[0].id,item.area_id)
            .then(obj=>{
              this.tab[2].class = 'span-active';
              this.tab[1].text = item.name;
              this.tab[1].id = item.area_id;
              this.type = 'hospital';
              this.hospital = obj.hospitals;
              this.init();
              this.hospital.unshift({name : '没有匹配的医院?',provinces_area_id:this.tab[0].id, cities_area_id:this.tab[1].id,hospitals_code: ''});
            })
        }else if(type == 'hospital'){
          if(item.name == "没有匹配的医院?"){
//      设置prompt
            this.$store.commit('SET_PROMPT',this.prompt);
            this.prompt.show = true;
            this.prompt.callback =(t)=>{
              if(t == '取消'){
                this.prompt.show = false;
              }else{
                this.prompt.value = t;
                if(t.length == 0){
                  this.prompt.tip = '请输入医院';
                }else{
                  console.log({name : t, provinces_area_id : this.tab[0].id,cities_area_id : this.tab[1].id, hospitals_code: ''});
                  this.$emit("event",{name : t, provinces_area_id : this.tab[0].id,cities_area_id : this.tab[1].id, hospitals_code: ''});
                  this.prompt.tip = '';
                  this.prompt.show = false;
                }
              }
            }
          }else{
            console.log(item);
             this.$emit('event',item);
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
          this.hospital = [];
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
          if(this.area.length == 0){
              Toast('请选择省份');
          }else{
            if(this.hospital.length == 0){
              Toast('请选择城市');
              this.tab[1].class = 'span-active';
            }else{
              this.type = 'hospial';
              item.class = 'span-active';
              this.tab[2].text = '医院';
            }
          }

        }
      },
      init(){
          let d = document.querySelector('.hw-hospital-selelct-container .select');
          d.scrollTop  = 0;
      },
      add_hospital(){
        this.$emit("event",{name : this.input_hos, provinces_area_id : '',cities_area_id : '', hospitals_code: ''});
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../assets/css/common";
  .hw-hospital-selelct-container{
    width:100%;
    position: absolute;
    height: 100vh;
    top:0;
    left:0;
    background: rgba(0,0,0,0.5);
    .hospital{
      height: 6.6rem;
      background: white;
      .tab{
        line-height: 0.7rem;
        font-size: 0.26rem;
        padding: 0 0.6rem;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid $iconGray;
        i{
          display: inline-block;
          width:0;
          height: 0;
          border-right: .12rem solid transparent;
          border-left: .12rem solid transparent;
          border-bottom: .12rem solid transparent;
          border-top: .12rem solid $iconGray;
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
      .result{
        padding-left: 0.3rem;
      }
      .result span{
        display: block;
        /*padding: 0.2rem 0;*/
        line-height: 0.68rem;
        text-align: left;
        box-sizing: border-box;
        border-bottom: 1px solid $gray;
        font-size: 0.28rem;
      }
      .result .resultTip{
        word-break: break-all;
      }
    }
  }
</style>
