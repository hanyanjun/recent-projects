<template>
<div class="container">
  <section :class="item.class" v-for="(item,index) in info" v-show="info" @click.stop="select(index)">
    <h6 class="hospital">{{item.hospital}}</h6>
    <h6 class="other"><span class="type">{{item.department}}</span> <span class="level">{{item.technical}}</span></h6>
    <p><i class="icon-hospital-area"></i><span>{{item.address ? item.address : '未填写'}}</span></p>
  </section>
  <button type="button" name="button" class="add" @click.stop="add">添加新门诊地址</button>
  <hw-button :config="'保存'" v-on:event="skip"></hw-button>

</div>

</template>

<script>
  import {MessageBox,Toast} from '../../components/hw-components'
  export default{
    name : 'orderAreaSelect',
    data(){return {
        info : {hospital : '',department : '',technical : '', address : ''},
        id : ''
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '执业地点选择',fn : '', router : '/appointDetailSet/null/null', hShow : true , fShow : false});
      this.$api.gainDocHospital()
        .then(obj=>{
            this.is_certified = obj.is_certified;
            obj.hospitals.forEach((v,i,a) => {
                if(v.is_default == 1){v.class = 'default'}
                else{v.class = ''};
            })
          this.info = obj.hospitals;
        })
    },
    methods : {
        select(index){
          if(this.info[index].address){
            this.info.forEach((v,i,a) => {
              v.class = (v.class).replace(/\s*selected/g,'');
            })
            this.info[index].class += ' selected';
            this.id = this.info[index].id;
            this.hospital = this.info[index].hospital;
          }else{
            MessageBox.confirm('您当前选择的医院未添加地址，是否前去添加?').then(()=>{
              this.$router.push({path : `${this.info[index].id}/editArea/edit`});
            })
          }
        },
        add(){
           if(this.is_certified == 1){
             this.$router.push({path : '/null/editArea/select'})
           }else{
             Toast( '当前未认证不可添加执业地点!');
           }
        },
        skip(){
          if(this.hospital){
            let id = this.id ? this.id : 'select';
            if(this.$route.query.status){
              this.$router.push({path : `/appointDetailSet/${id}/${this.hospital}?status=1`});
            }else{
              this.$router.push({path : `/appointDetailSet/${id}/${this.hospital}`});
            }
          }else{
              Toast('请选择一个医院!');
          }
        }
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .container{
    min-height: 10.76rem;
    box-sizing: border-box;
    text-align: left;
  }
  .container .default{
    background:white;
    /*background: url(../../assets/media/img/workAreaSelect-default_icon.png) white no-repeat right top;*/
    background-size: 0.81rem 0.73rem;
  }
  .container section{
    height: 2.2rem;
    box-sizing: border-box;
    background: white;
    margin: .2rem auto;
    width: 7.1rem;
    padding: .17rem .52rem .4rem .5rem;
    border: 1px solid rgb(210, 210, 210);
    border-radius: .08rem;
  }
  .container section .hospital{
    height: .54rem;
    line-height: .54rem;
    font-size: .32rem;
    font-weight: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .container .other{
    padding: .12rem 0;
    line-height: 0;
  }
  .container section .type,
  .container section .level{
    height: .28rem;
    font-size: .28rem;
    line-height: .28rem;
    color: rgb(97, 97, 97);
    font-weight: normal;
  }
  .container section .type {
    padding-right: .21rem;
    border-right: 1px solid rgb(210, 210, 210);
    margin-right: .21rem;
  }
  .container section p {
    font-size: .26rem;
    height: 0.6rem;
    line-height: .6rem;
    color: rgb(131, 130, 130);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding-right: .36rem;
    background:url(../../assets/media/img/order-address_unSelected_icon.png) no-repeat right center;
    background-size:0.35rem 0.35rem;
    span{
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

  }
  .container .selected{
    border: 1px solid rgb(11, 158, 251);
  }
  .container .selected p {
    background:url(../../assets/media/img/order-address_selected_icon.png) no-repeat right center;
    background-size:0.35rem 0.35rem;
  }
  .container  .add{
    display: inline-block;
    width: 100%;
    height: 1.1rem;
    padding-left: 2.65rem;
    box-sizing: border-box;
    line-height: 1.15rem;
    font-size: .32rem;
    color: rgb(166, 164, 164);
    text-align: left;
    background: url(../../assets/media/img/order-address_add_icon.png) white no-repeat left 2.25rem center ;
    background-size: 0.3rem 0.28rem;
  }
  .icon-hospital-area{
    font-size: 0.36rem;
    margin-right: 0.15rem;
  }
</style>
