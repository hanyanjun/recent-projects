<template>
    <ul class="content container">
      <li :class="item.is_default == 1 ? 'default' : ''" v-for="(item,index) in hospital">
        <h6 class="hospital">{{item.hospital}}</h6>
        <h6 class="other"><span class="type">{{item.department}}</span> <span class="level">{{item.technical}}</span></h6>
        <h6 class="edit-fn"><b class="edit skip" @click.stop="skip(item)">编辑</b> <b class="delete" v-show="item.is_default == 1 ?  false : true" @click.stop="dele(item)">删除</b></h6>
      </li>
      <hw-button  :config="btnText" v-on:event="skip" v-show="hospital"></hw-button>
    </ul>
</template>

<script>
  import hwButton from '../../btns/hwButton'
  import {MessageBox,Toast} from '../../components/hw-components'
export default{
    name : 'workArea',
    data (){
      return {
          hospital : '',
          is_certified : '',
          btnText : '添加新地点'
      }
    },
    components : {
      hwButton : hwButton
    },
    created (){
      this.$store.commit('UPDATE_NAV',{title : '执业地点管理',fn : '', router : '/my', hShow : true , fShow : false});
          this.$api.gainDocHospital()
            .then(obj=>{
               this.hospital = obj.hospitals;
               this.is_certified = obj.is_certified;
            })
    },
    methods : {
        skip(v){
           if(this.is_certified == '1' ){
              let id = v ? v.id : 'null';
              this.$router.push({path : `/${id}/editArea/edit`});
           }else{
             Toast({
               message: '您还未通过认证,不可编辑!',
               iconClass: 'icon icon-success'
             });
           }
        },
        dele(v){
          if(this.is_certified == '1' ){
            MessageBox.confirm('确定删除该执业地点吗?').then(obj=>{
                this.$api.deleteHospital(v.id)
                  .then(obj=>{
                      this.hospital = this.hospital.removeByValue(v);
                    Toast({
                      message: '删除成功',
                      iconClass: 'icon icon-success'
                    });
                  })
            })
          }else{
            Toast({
              message: '您还未通过认证,不可删除!',
              iconClass: 'icon icon-success'
            });
          }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .content{
    min-height: 9rem;
    padding-top: 0.2rem;
  }
  .content li {
    width: 7.15rem;
    /*height: 1.7rem;*/
    background: white;
    margin: .15rem auto;
    padding-top: .3rem;
    box-sizing: border-box;
    border-radius: .2rem;
    overflow: hidden;
    border: 1px solid rgb(210, 210, 210);
  }
  .content .hospital{
    font-size: .34rem;
    text-align: left;
    word-break: break-all;
  }
  .content .default{
    margin-top: 0px;
    background:white;
    /*background: url(../../assets/media/img/workAreaSelect-default_icon.png) white no-repeat right top;*/
    background-size: 0.81rem 0.73rem;
  }
  .content li  .hospital{
    font-size: .34rem;
    line-height: .6rem;
  }
  .content li .other{
    font-size: .28rem;
    text-align: left;
    padding: .13rem .24rem .13rem .43rem;
    color: rgb(176, 176, 176);
  }
  .content li .other .type{
    padding-right: .2rem;
    margin-right: .2rem;
    border-right: 1px solid rgb(181, 181, 181);
  }
  .content li .edit-fn{
    height: .7rem;
    border-top: 1px solid rgb(210, 210, 210);
    font-size: .26rem;
    color: rgb(126, 126, 126);
    text-align: right;
  }
  .content li .edit-fn b{
    display: inline-block;
    line-height: .7rem;
    padding-left: .4rem;
  }
  .content .default .edit-fn .edit{
    margin-right: .16rem;
  }
  .content li .edit-fn .edit{
    background: url(../../assets/media/img/workAreaSelect-edite_icon.png) no-repeat left center;
    background-size: 0.32rem 0.33rem;
    margin-right: .6rem;
  }
  .content li .edit-fn .delete{
    background: url(../../assets/media/img/workAreaSelect-delete_icon.png) no-repeat left center;
    background-size: 0.27rem 0.34rem;
    margin-right: .16rem;
  }
  h6{
    font-weight: normal;
    padding: 0 .24rem 0 .43rem;
  }
</style>
