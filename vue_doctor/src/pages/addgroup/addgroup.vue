<template>
  <div class="container">
    <!-- 新增分组 -->
    <div :class="['addGroup',{'addGroup-active': id==' '}]">
      <div class="addgroup-name">
        <i class="icon-setgroup-background" style="font-size:0.74rem;"><span class="path1" style="color:#2a8cff;"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>
        <input type="text" class="group-name" placeholder="输入分组名称" v-model="group_name" v-on:input="changName">
      </div>
      <router-link :to="`/${id}/selectPat`" class="addpatient">
        <i class="icon-addpatient" style="font-size:0.74rem;">
          <span class="path1"></span><span class="path2"></span><span class="path3"></span>
        </i><span class="title">添加会员</span>
      </router-link>
      <!-- 显示分组内会员 -->
      <!--<div>-->
        <!--<div :class="['patients',{'patients-active': id==' '}]">-->
          <ul :class="['patientlist',{'patientlist-active': id==' '}]">
            <li  class="info deleInfo" v-for="item in in_group">
              <img :src="item.headimg" alt="">
              <div>
                <span class="name">{{item.name ? item.name : item.nick}}</span>
                <span class="other">{{item.sex}}  |  {{item.age}}</span>
              </div>
              <p class="btn"  @click.stop="delePat(item)">移出</p>
            </li>
          </ul>
        <!--</div>-->
      <!--</div>-->

    </div>
    <!-- 删除分组 -->
    <div class="delete-group"  @click.stop="deleGro" v-show="id != ' '">删除分组</div>
  </div>
</template>

<script>
  import {Toast,MessageBox} from '../../components/hw-components'
export default{
    name : 'addgroup',
    data(){return{delePos : '',delePosx:'',height:''}},
    created(){
      let id = this.$route.params.id == ' ' ? ' ' : this.$route.params.id;
      this.id = id;
      this.$store.commit('UPDATE_NAV',{title : id!= ' ' ? '管理分组' : '添加分组', fn : '完成', fShow : false, hShow : true});
      let group = this.$store.state.editGroup.group;
      if(!group){
        this.$store.dispatch('editGroupInitial',id);
      }
    },
    computed :{
        in_group (){
            return this.$store.state.editGroup.in_group;
        },
        group_name(){
            return this.$store.state.editGroup.group.group_name;
        }
    },
    mounted (){
        document.querySelector('.nav_submit').onclick = (e)=> {
          if(!this.group_name){
              Toast('请输入分组名!');
          }else{
              let formData = new FormData();
              let id = this.id  == ' ' ? '' : this.id;
              formData.append('group_id',id);
              formData.append('group_name',this.group_name);
              let arr = [];
              this.in_group.forEach((v,i)=>{
                  arr.push(v.patients_id);
              })
             formData.append('patients',JSON.stringify(arr));
              this.$api.saveGroup(formData).then(obj=>{
                 this.$store.commit('IS_UPDATE_CONTACTS',true);
                  this.$router.push({path : '/contacts'});
              })
          }
          e.preventDefault();
        }
//        滑动删除会员
      let initX; //触摸位置
      let moveX; //滑动时的位置
      let X = 0; //移动距离
      let objX = 0; //目标对象位置
//        转化125px 为当前屏幕的px
      let  clientWidth = document.documentElement.clientWidth;
      let list = document.querySelector('.patientlist');
      let W = Math.floor(clientWidth*125/750);
      list.addEventListener('touchstart', (event)=> {
        let obj = event.target;
        if (obj.className == "info deleInfo") {
          initX = event.targetTouches[0].pageX;
          objX = (obj.style.transform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
        }
        if (objX == 0) {
          list.addEventListener('touchmove', (event)=> {
            let dom = document.querySelectorAll('.patientlist .deleInfo');
              for(let i=0;i<dom.length;i++){
                dom[i].style.transform = "translateX(0px)";
              }
//            event.preventDefault();
            let obj = event.target;
            if (obj.className == "info deleInfo") {
              moveX = event.targetTouches[0].pageX;
              X = moveX - initX;
              if (X >= 0) {
                obj.style.transform = "translateX(" + 0 + "px)";
              } else if (X < 0) {
                var l = Math.abs(X);
                obj.style.transform = "translateX(" + -l + "px)";
                if (l > W) {
                  l = W;
                  obj.style.transform = "translateX(" + -l + "px)";
                }
              }
            }
          });
        } else if (objX < 0) {
          list.addEventListener('touchmove', (event)=> {
//               event.preventDefault();
            let obj = event.target;
            if (obj.className == "info deleInfo") {
              moveX = event.targetTouches[0].pageX;
              X = moveX - initX;
              if (X >= 0) {
                var r = -W + Math.abs(X);
                obj.style.transform = "translateX(" + r + "px)";
                if (r > 0) {
                  r = 0;
                  obj.style.transform = "translateX(" + r + "px)";
                }
              } else { //向左滑动
                obj.style.transform = "translateX(" + -W + "px)";
              }
            }
          });
        }
      })
      list.addEventListener('touchend', (event)=> {
        let obj = event.target;
        if (obj.className == "info deleInfo") {
          objX = (obj.style.transform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
          if (objX > -(W/2)) {
            obj.style.transform = "translateX(" + 0 + "px)";
            objX = 0;
          } else {
            obj.style.transform = "translateX(" + -W + "px)";
            objX = -W;
          }
        }
      })

    },
    methods :{
      changName(e){
          this.$store.commit('UPDATE_GROUP_NAME',e.target.value);
      },
      delePat(item){
        item.selected = item.selected  ?  true  : false;
        this.$store.commit('UPDATE_SELECT_PAT',item);
        this.$store.commit('UPDATA_IN_GROUP',{type : item.selected ? 'push' : 'shift',info :item});
        let dom = document.querySelectorAll('.patientlist .deleInfo');
        for(let i=0;i<dom.length;i++){
          dom[i].style.transform = "translateX(0px)";
        }
      },
      deleGro(){
        MessageBox.confirm('删除后已有分组成员将移动到未分组,确定删除?').then(obj=>{
          this.$api.deleteGroup(this.id)
            .then(obj=>{
              setTimeout(()=>{
                this.$store.commit('IS_UPDATE_CONTACTS',true);
                this.$router.push({path : '/contacts'});
              },1500);
            })
        })
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container{
    height: 100%;
    overflow: hidden;
  }
  .addGroup{
    height: calc(100% - 1rem);
    overflow: hidden;
  }
  .addGroup-active{
    height: 100%;
  }
  .addgroup-name{
    height: 1.2rem;
    width: 100%;
    background: #fff;
    display: flex;
    align-items: center;
    margin-bottom: .2rem;
  }
  .addgroup-name i{
    display: inline-block;
    margin-left: .18rem;
  }
  .addgroup-name input{
    margin-left: .23rem;
    font-size: .32rem;
  }
  .addpatient{
    display: block;
    height: 1.2rem;
    background: #fff;
    display: flex;
    align-items: center;
  }
  .addpatient i{
    display: inline-block;
    margin-left: .18rem;
  }
  .addpatient .title{
    margin-left: .23rem;
    font-size: .32rem;
    line-height: .32rem;
  }


  /*会员信息*/
  .patientlist{
    padding-left: .97rem;
    background: #fff;
    margin-top: 0.2rem;
    overflow-x: hidden;
    height: calc(100% - 2.8rem);
    background: white;
    overflow-y :scroll;
  }
  .patientlist-active{
    height: 100%;
  }
  .patientlist .info{
    border-bottom: 1px solid #dcdcdc;
    height: 1.2rem;
    box-sizing: border-box;
    position: relative;
  }
  .patientlist .info img{
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
  .patientlist .info div{
    padding-top: .3rem;
    height: .75rem;
    width: 3rem;
    /*background: lightpink;*/
    margin-left: .23rem;
  }
  .patientlist .info .name{
    display: block;
    height: .32rem;
    line-height: .32rem;
    font-size: .32rem;
    color: #000;
    /*background: lightblue;*/
  }
  .patientlist .info .other{
    display: block;
    line-height: .26rem;
    margin-top: .17rem;
    font-size: .26rem;
    color: #9fa0a0;
  }


  .delete-group{
    width: 7.5rem;
    text-align: center;
    height: .98rem;
    line-height: .98rem;
    background: #fff;
    /*position: absolute;*/
    /*bottom: 2rem;*/
    border-top: 1px solid #dcdcdc;
    font-size: .32rem;
    color: #2a8cff;
    /*z-index: 9999;*/
  }
  .info .btn{
    position: absolute;
    top: 0;
    right: -1.25rem;
    text-align: center;
    background: #ff3c00;
    color: #fff;
    width: 1.25rem;
    height: 1.2rem;
    line-height: 1.2rem;
    font-size: .32rem;
  }
</style>
