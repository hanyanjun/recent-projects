<template>
  <ul class="container">
    <div class="content">
      <li class="time">{{timer}}</li>
      <label v-show="!status">
        <span>是否出诊</span>
        <b :class="info.status == 1 ? 'bg info bg-active' : 'bg info'" @click.stop="toggle"><b class="circle"></b></b>
      </label>
      <h6></h6>
      <div v-show="status || info.status == 1" class="addInfo">
        <li class="address IF-show b-1px-b" @click.stop="selectHospital"><span class="title">门诊地址</span><span class="info">{{info.hospitalText}}</span></li>
        <li class="count orderCount IF-show b-1px-b" @click.stop="open"><span class="title">可预约数</span><span class="info">{{info.count}}人</span></li>
        <!--<li class="remarke IF-show b-1px-b" @click="show"><span class="title">门诊备注</span><span class="remarke-info info">{{info.note}}</span></li>-->
      </div>
      <ul class="notice"  v-show="status || info.status == 1" >
        <li>门诊备注 <span class="tip">(限字100)</span></li>
        <textarea name=""  v-model="info.note"  id="" cols="30" rows="10" maxlength="100" placeholder="填写会员来门诊时需要注意的事项（如：如有检查报告、CT、肺功能检测报告等资料请携带） "></textarea>
      </ul>
      <li class="tips" v-show="tipShow"><b>!</b>此次修改信息将通知给已预约会员</li>
    </div>
    <button class="submit" @click.stop="store">保存</button>
    <!--<hw-button :config="'保存'" v-on:event="store"></hw-button>-->
    <!--<add-text :config="addTextConfig" v-on:event="change"></add-text>-->
  </ul>
</template>

<script>
//  import addText from '../../components/addText.vue'
  import {Toast} from '../../components/hw-components'
  export default{
    name : 'appointDetailSet',
    data(){
      return {
          info : {status : '1', count : '',hospitalText : '',hospital : '',note: '',appoint_date:'',appoint_time : ''},
          tipShow : false,
          status : '',
          addTextConfig : {message : '',count : 100, show : false , holder : '点击添加门备注'}
      }
    },
     mounted(){
       document.querySelector('.nav_back').onclick=(e)=>{
           this.$router.routeBack();
       }
     },
    created(){
      let _this = this;
      this.$store.commit('UPDATE_NAV',{title : '预约设置',fn : '', router : '/appointmentSet', hShow : true , fShow : false});
      let id = window.sessionStorage['id'];
      this.id = id;
      if(this.$route.query.status){
          this.status = true;
  //      存储时间 和 id
          let date = window.sessionStorage['appoint_date'].split('-');
          this.timer =  date[1] + '月' + date[2] + '日' + window.sessionStorage['week_day'] + window.sessionStorage['week_time'];
          this.$store.commit('UPDATE_NAV',{title : '门诊设置',fn : '', router : '/appointmentSet', hShow : true , fShow : false});
      }else{
        this.timer =  window.sessionStorage['week_day'] + window.sessionStorage['week_time'];
      }
//      id 为空那么不进行信息初始化
      if(id!=='null'){
          if(this.$route.query.status){
            this.$api.appointTemporaryDetail(id)
              .then(obj=>{
                  this.info.note = obj.temporary.appoint_note;
                  this.info.hospitalText = obj.temporary.hospital;
                  this.info.count = obj.temporary.appoint_count;
                  this.info.hospital = obj.temporary.hospitals_id;
              })
          }else{
            this.$api.gainAppointSet(id)
              .then(obj=>{
                this.info.status = obj.set[0].appoint_set_status;
                this.info.count = obj.set[0].count;
                this.info.hospitalText = obj.set[0].hospital;
                this.info.note = obj.set[0].note;
                this.addTextConfig.message = obj.set[0].note;
                this.info.hospital = obj.set[0].hospitals_id;
                gainParams();
              })
          }
      }else{
        gainParams();
      }
      function gainParams() {
//              获取url参数
        let hospital = _this.$route.params.hospital;
        if(hospital !== 'null'){
          _this.info.status  = '1';
          if(_this.info.hospital !== hospital){
              if( window.sessionStorage['id'] !== 'null'){
                _this.tipShow = true;
              }
            _this.info.hospitalText = hospital;
            _this.info.hospital = _this.$route.params.hospitalId;
          }
        }
      }
    },
    methods : {
       toggle(){this.info.status = this.info.status == '1' ?  '2' : '1';},
       store(){
           let d = this.$route.query.status;
           if(d){
               let obj = {
                 appoint_date :  window.sessionStorage['appoint_date'],
                 appoint_time : this.$means.timeToNum(window.sessionStorage['week_time']),
                 appoint_count : this.info.count,
                 appoint_note : this.info.note,
                 hospitals_id : this.info.hospital
               };
               for(let k in obj){
                   if(!obj[k] && k != 'appoint_note'){
                     Toast('请填写完整信息！');
                     return;
                   }
               }
               this.$api.oAppointSet(obj).then(obj1=>{
                 this.$router.routeBack();
               })
           }else{
             this.info.doctors_id = this.$store.getters.docAcc;
             this.info.week_day = this.$means.dayTonum(window.sessionStorage['week_day']);
             this.info.week_time = this.$means.timeToNum(window.sessionStorage['week_time']);
             this.info.id = this.id;
             if(this.info.status == '1'){
               if(!this.info.hospitalText || !this.info.count){
                 Toast('医院和预约人数必填!');
               }else{
                 this.$api.appointTimeSet(this.info)
                   .then(obj=>{
                     this.$router.routeBack();
                   })
               }
             }
             else{
               this.$api.appointTimeSet(this.info)
                 .then(obj=>{
                   this.$router.routeBack();
                 })
             }
           }
       },
       selectHospital(){
          let s = this.$route.query.status;
           this.$router.push({path : `/orderAreaSelect${s ? '?status=1' : ''}`})
       },
       open(){
          this.$picker1.setData(this.$hwdata.peopleCount());
         this.addTextConfig.show = false;
          this.$picker1.show(e=>{
              this.info.count = e[0].value;
              if( window.sessionStorage['id'] !== 'null'){
                this.tipShow = true;
              }
          })
       },
       show(){
           this.$picker1.hide();
           this.addTextConfig.show = true;
       }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/common";
  .container{
    /*background: white;*/
    position: relative;
    overflow: hidden;
  }
  .container .content{
    height: calc(100% - 1.4rem);
  }
  .container .addInfo{
    background: white;
  }
  .container .time{
    height: 1.20rem;
    padding-left: 1.2rem;
    background: url(../../assets/media/img/doc-home_calendar_icon.png) white no-repeat left 0.36rem center;
    font-size: 0.36rem;
    line-height: 1.20rem;
    text-align: left;
    background-size: 0.47rem 0.43rem;
  }
  .container label{
    display: inline-block;
    position: absolute;
    right: 0.40rem;
    top: 0;
    line-height: 1.20rem;
    display: flex;
    align-items: center;
  }
  .container label span{
    line-height:1.20rem;
    font-size: 0.30rem;
    margin-right: 0.30rem;
    display: inline-block;
    vertical-align: top;
  }
  .container h6{
    height: 0.10rem;
    background: rgb(242, 243, 245);
  }
  .container .address,
  .container .orderCount,.remarke{
    height: 1.06rem;
    margin: 0 0.38rem 0 0.36rem;
    line-height: 1.06rem;
    background: url(../../assets/media/img/order-set_arrowRight_icon.png) no-repeat  right 0.1rem center;
    background-size: 0.18rem 0.29rem;
    text-align: left;
    display: flex;
    justify-content: space-between;
  }
  .container .title{
    display: inline-block;
    font-size: 0.34rem;
    height: 100%;
    line-height: 1.06rem;
    vertical-align: top;
  }
  .container .info{
    font-size: 0.32rem;
    color: rgb(100, 100, 100);
    display: inline-block;
    width: 4.40rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-right: 0.50rem;
    box-sizing: border-box;
    text-align: right;
  }
  .container .bg{
    display: inline-block;
    background: rgb(166, 167, 167);
    width: 1rem;
    height: 0.50rem;
    border-radius: 0.25rem;
    position: relative;

  }
  .container .circle{
    display: inline-block;
    width: 0.46rem;
    height: 0.46rem;
    background: white;
    -webkit-border-radius: 50%;
    -moz-border-radius:  50%;
    -ms-border-radius:  50%;
    -o-border-radius:  50%;
    border-radius:  50%;
    position: absolute;
    left: 0.02rem;
    top: 0.02rem;
    transition: all 0.5s;
  }
  .container .bg-active{
    background: rgb(3, 137, 251);
  }
  .container .bg-active .circle{
    left: 0.52rem;
  }
  .container .tips{
    height: 0.80rem;
    line-height: 0.80rem;
    text-align: center;
    font-size: 0.24rem;
    color: #2a8cff;
    background: white;
  }
  .container .tips b{
    width: 0.30rem;
    height: 0.30rem;
    border: 1px solid #2a8cff;
    border-radius:  50%;
    line-height: 0.30rem;
    text-align: center;
    font-weight: normal;
    display: inline-block;
    margin-right: 0.15rem;
  }

  .notice{
    margin-top: 0.2rem;
    background: white;
    padding: 0 0.3rem 0.3rem;
    font-size: 0.32rem;
  li{
    height: 0.85rem;
    line-height: 0.85rem;
  }
    .tip{
      font-size: 0.3rem;
      color: $fGray;
    }
  textarea{
    display: inline-block;
    width:100%;
    height: 2.24rem;
    box-sizing: border-box;
    padding: 0 0.17rem;
    font-size: 0.26rem;
    line-height: 0.66rem;
    color: $fGray;
    border-radius: 0.08rem;
    border: 1px solid $gray;
  &::-webkit-input-placeholder{
     font-size: 0.26rem;
   }
  }
  }

  .submit{
    display: block;
    margin: 0.2rem auto;
    width: 6.9rem;
    height: 1rem;
    line-height: 1rem;
    background: #0693fc;
    color: white;
    font-size: 0.4rem;
    text-align: center;
    border-radius: 0.06rem;
  }
</style>
