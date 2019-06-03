<template>
  <ul class="editAreaWindow">
    <div class="hospital">
      <h6 class="title">就职医院</h6>
      <input type="text" readonly="true" placeholder="请选择医院" :value="info.hospital" @click.stop="hospitalShow" onfocus="this.blur()">
    </div>
    <div class="type1">
      <section class="type">
        <h6 class="title">科室<span class="tip">（必填）</span></h6>
        <input type="text"  readonly="true"  placeholder="请选择科室"  :value="info.department" @click.stop="open('type')" onfocus="this.blur()">
      </section>
      <section class="sex">
        <h6 class="title">职称<span class="tip">（必填）</span></h6>
        <input type="text" readonly="true" placeholder="请选择职称"  :value="info.technical" @click.stop="open('level')" onfocus="this.blur()">
      </section>
    </div>
    <div class="address">
      <h6 class="title">门诊地址<span class="tip">（限字100）</span></h6>
      <textarea name="" cols="30" rows="10" maxlength="500" v-model="info.address" >{{info.address}}</textarea>
    </div>
    <hw-button :config="'保存'" v-on:event="skip"></hw-button>
    <add-text :config="addTextConfig" v-on:event="change"></add-text>
    <hw-hospital  v-on:event="selectHospital" :display="hShow"></hw-hospital>
  </ul>
</template>
<script>
  import {Toast} from '../../components/hw-components'
  import addText from '../../components/addText.vue'
  import hwHospital from '../../components/hwHospital'

export default{
    name : 'editArea',
    components : {addText,hwHospital},
    data(){
      return {
          info : {address : '',cities_area_id:'',department:'',doctors_id:'',hospital:'',hospitals_code:'',id:'',is_default:'',provinces_area_id:'',technical:'',towns_area_id:''},
          is_default: '',
          addTextConfig : {message : '',count : 100, show : false , holder : ''},
          hShow : false,
          top : '',
      }
    },
    created (){
      if(this.$route.params.origin == 'edit'){
        this.$store.commit('UPDATE_NAV',{title : '执业地点编辑', fn : '',router : '/workArea', hShow : true , fShow : false});
      }else{
        this.$store.commit('UPDATE_NAV',{title : '执业地点选择',fn : '', router : '/orderAreaSelect', hShow : true , fShow : false});
      }
      this.picker = new mui.PopPicker({
         layer : 1
      })
      this.id = this.$route.params.id;
      console.log('执业地id为:%c'+this.$route.params.id,'color:green');
        if(this.id !== 'null') {
          this.$api.gainDocHospital(this.id)
            .then(obj => {
              this.info = obj.hospital;
              this.is_default = obj.hospital.is_default;
              this.addTextConfig = { message : obj.hospital.address,count : 100,show: false,holder:'填写详细门诊地址（如：上海复旦大学附属中山医院东院门诊楼2楼218诊室），会员将根据您填写的地址就诊。'};
            })
        }
    },
    methods : {
      open(v){
        this.hShow = false;
        if(this.is_default == '1'){
          Toast( '默认信息不可修改');
        }else{
          if(v == 'type'){
            this.picker.setData(this.$hwdata.departmentData);
            this.picker.show(e=>{
              this.info.department = e[0].text;
            })
          }else if(v == 'level'){
            this.picker.setData(this.$hwdata.levelData);
            this.picker.show(e=>{
              this.info.technical = e[0].text;
            })
          }
        }
      },
      hospitalShow(){
        if(this.is_default == '1'){
          Toast( '默认信息不可修改');
        }else{
          this.hShow = true;
          this.picker.hide();
        }
      },
      skip(){
          let info = this.info;
          if(info.address && info.hospital && info.technical && info.department){
            this.$api.addDocHospital(this.info)
              .then(obj=>{
                 this.$router.routeBack();
              })
          }else{
              Toast('请填写完整信息!');
          }
      },
      change(v){
         this.addTextConfig.show = false;
         if(v) this.info.address  = v;
      },
      show(){
        this.addTextConfig.show = true;
      },
//      选择的值同步到页面
      selectHospital(v){
          this.hShow = this.hShow ? false : true;
          if(v){
            delete v.id;
            Object.assign(this.info,v);
            this.info.hospital = v.name;
          }
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .editAreaWindow{
    width: 100vw;
    height: 100vh;
    background: rgb(242, 243, 245);
  }
  .editAreaWindow .store{
    display: block;
    margin: 6.4rem auto 0;
    width: 6.3rem;
    height: 1rem;
    background: rgb(6, 147, 252);
    color: white;
    font-size: .4rem;
    text-align: center;
    border-radius: .15rem;
  }
  .editAreaWindow a{
    height: 1rem;
    background: white;
    line-height: 1rem;
    padding: 0 .35rem 0 .4rem;
    display: flex;
    justify-content: space-between;
    font-size: .34rem;
  }
  .editAreaWindow a li{
    width: 100%;
    border-bottom: 1px solid rgb(220, 220, 220);
    box-sizing: border-box;
    padding-right: .6rem;
    display: flex;
    justify-content: space-between;
    background: url(../../assets/media/img/Rectangle.png) no-repeat right .1rem center;
    background-size: 0.18rem 0.29rem;
  }
  .editAreaWindow a .default{
    padding-right: .1rem;
    background: none;
  }
  .editAreaWindow a .noline{
    border-bottom: none;
  }
  .editAreaWindow a .infoshow{
    font-size: .3rem;
    color: rgb(134, 134, 134);
    display: inline-block;
    height: 1rem;
    vertical-align: top;
    width: 70%;
    text-align: right;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .editAreaWindow{
    width:100%;
    box-sizing: border-box;
    padding: 0 0.2rem;
    position: relative;
    background: rgb(237,239,240);
  div{
    line-height: 0;
  }
  section{
    line-height: 0;
  }
  section div{
    line-height: 0;
  }
  textarea{
    display: inline-block;
    width:100%;
    height: 1.5rem;
    box-sizing: border-box;
    border-top: 0.35rem solid white;
    border-bottom: 0.35rem solid white;
    border-right: 0.4rem solid white;
    border-left: 0.4rem solid white;
    /*padding: 0.35rem 0.4rem;*/
    font-size: 0.28rem;
    color: #727171;
  }
  .title{
    /*height:0.7rem;*/
    /*line-height: 0.7rem;*/
    font-size: 0.32rem;
    height: 0.32rem;
    line-height: 0.32rem;
    padding: 0.2rem 0 0.15rem 0;
  .tip{
    font-size: 0.3rem;
    color: rgb(159,160,160);
  }
  }
  .head section{
    display: flex;
    width:100%;
    background: white;
    height: 2rem;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    position: relative;
  img{
    display: inline-block;
    width:1.10rem;
    height:1.10rem;
    border-radius: 50%;
  }
  span{
    display: inline-block;
    height: 0.4rem;
    font-size: 0.26rem;
    color: rgb(183,184,184);
    line-height: 0.4rem;
    /*background: url(img/editor.png) no-repeat right center;*/
    padding-right: 0.45rem;
    background-size: 0.3rem 0.3rem;
  }
  input{
    display: inline-block;
    width:100%;
    height:100%;
    position: absolute;
    left:0;
    top:0;
    opacity: 0;
  }
  }
  .head1 section{
    height:1rem;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 0.4rem;
  img{
    width:0.7rem;
    height:0.7rem;
  }
  }
  input{
    display: inline-block;
    width:100%;
    height: 1rem;
    box-sizing: border-box;
    padding: 0 0.4rem;
    line-height: 1rem;
    color: #727171;
    font-size: 0.28rem;
  }
  .type1{
    width:100%;
    display: flex;
    justify-content: space-between;
  input{
    display: inline-block;
    width:3.4rem;
  }
  }
  .hope textarea{
    height:1.1rem;
  }
  .certificate section{
    width:100%;
    height:4rem;
    position: relative;
    background: white;
    padding-top: 1px;
    overflow: hidden;
  img{
    display: block;
    margin: 1.1rem auto 0;
    width: 1.6rem;
    height:1.3rem;
  }
  span{
    display: block;
    width:100%;
    font-size: 0.26rem;
    margin-top: 0.5rem;
    color: #b6b6b6;
    text-align: center;
  }
  input{
    display: inline-block;
    position: absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    opacity: 0;
  }
  }


  }
</style>
