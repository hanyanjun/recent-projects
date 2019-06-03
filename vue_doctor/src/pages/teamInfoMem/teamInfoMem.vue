<template>
<div class="teamInfoMem">
    <div :class="['info_modules',{'info_modules_h0' : del}]"  v-show="arr[0] && !del">
      <div class="headimg">
        <template v-if="arr[0].face">
          <img src="" v-img1="head(arr[0].face)" alt="">
        </template>
        <template v-else>
          <i class="head_icon">
            <template v-if="arr[0].sex == '男'">
              <i class="icon-team-head-b">
                <span class="path1"></span><span class="path2"></span>
              </i>
            </template>
            <template v-else>
              <i class="icon-team-head-b">
                <span class="path1"></span><span class="path2"></span>
              </i>
            </template>
          </i>
        </template>
        <i class="bage"><span class="icon icon-team-lead2">
                   <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span>
             </span></i>
      </div>
      <div class="other_info">
        <h6 class="info_t"><span class="name">{{arr[0].name}}</span><span class="technical">{{arr[0].technical}} </span></h6>
        <h6 class="info_b"><span class="hospital">{{arr[0].hospital}}</span><span class="depart">{{arr[0].department}}</span></h6>
      </div>
    </div>
    <div class="info_modules" v-for="(item,index) in arr" v-if="index != 0 && item">
      <transition name="w">
        <i class="del" v-show="del" @click.stop="deleMem(item,index)">
          <i class="del-icon icon-deletegroup" ><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
        </i>
      </transition>
      <div class="headimg">
        <template v-if="item.face">
          <img src="" v-img1="head(item.face)" alt="">
        </template>
        <template v-else>
          <i class="head_icon">
            <template v-if="item.sex == '男'">
              <i class="icon-team-head-b">
                <span class="path1"></span><span class="path2"></span>
              </i>
            </template>
            <template v-else>
              <i class="icon-team-head-b">
                <span class="path1"></span><span class="path2"></span>
              </i>
            </template>
          </i>
        </template>
      </div>
      <div class="other_info">
        <h6 class="info_t"><span class="name">{{item.name}}{{index}}</span><span class="technical">{{item.technical}} </span></h6>
        <h6 class="info_b"><span class="hospital">{{item.hospital}}</span><span class="depart">{{item.department}}</span></h6>
      </div>
    </div>
    <teamEmpty :show="arr.length == 1 && del" text="目前没有可移除的成员" ></teamEmpty>
</div>
</template>

<script>
  import teamEmpty from "../../components/teamEmpty"
  import {MessageBox} from '../../components/hw-components'
export default {
    name: "teamInfoMem",
    data(){return{
      arr : [''],
      del : false
    }},
    components:{teamEmpty},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '团队成员',theme : 'green', fn: '管理', hShow : true });
      this.id  = this.$route.params.id;
      this.$api.teamDetail(this.id).then(obj=>{
        [this.arr] = [obj.members];
        this.arr.unshift(obj.owner);
      });
    },
    watch :{
       del(v,o){
         if(v){
           this.$store.commit('UPDATE_NAV',{title : '团队成员',theme : 'green', fn: '完成', hShow : true });
         }else{
           this.$store.commit('UPDATE_NAV',{title : '团队成员',theme : 'green', fn: '管理', hShow : true });
         }
       }
    },
   methods:{
     head(v){
       return DOCLINKAPI + v;
     },
     deleMem(v,i){
       MessageBox.confirm('移除成员后，该会员将被从我的团队中删除,确定移除?').then(obj=>{
         this.$api.deleTeamMem(this.id,v.doctors_id).then(_=>{
           this.arr[i] = '';
           this.arr = Object.assign([],this.arr);
         })
       })
     },
   },
   mounted(){
     document.querySelector('.nav_submit').onclick=(e)=>{
       this.del = !this.del;
     }
   },
    computed:{
      docInfo(){
        return this.$store.state.docInfo;
      }
    },
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.teamInfoMem{
  background: white;
  height: 100%;
  overflow: scroll;
  line-height: 0;
}
.info_modules{
  padding: 0.2rem 0.2rem 0 0.2rem;
  background: white;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  transform-origin: 50% 50%;
  transition:transform  3s ease;
  .headimg{
    margin-right: 0.2rem;
    margin-left: 0.2rem;
    position: relative;
    img,.head_icon{
      display: inline-block;
      width: 1.2rem;
      height: 1.2rem;
      line-height: 1.2rem;
      text-align: center;
      border-radius: 50%;
      background: $gray_d_c;
    }
    .head_icon i{
      font-size: 0.78rem;
      color: $gray_f;
      border-radius: 50%;
    }
    .bage{
      display: inline-block;
      width: 0.3rem;
      height: 0.3rem;
      position: absolute;
      bottom: 0.2rem;
      left: 0.84rem;
      .icon{
        font-size: 0.32rem;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
  .other_info{
    display: flex;
    width: 80%;
    align-content: center;
    flex-wrap: wrap;
    min-height: 1.2rem;
    /*padding-left: 1.6rem;*/
    padding-bottom: 0.2rem;
    border-bottom: 1px solid $gray_e;
    .info_t{
      line-height: 0;
      width: 100%;
      .name{
        font-size: 0.33rem;
        color: $gray_a;
        margin-right: 0.2rem;
        line-height: 0.36rem;
      }
      .technical{
        line-height: 0.36rem;
        font-size: 0.26rem;
        color: $gray_b;
      }
    }
    .info_b{
      line-height: 0.36rem;
      font-size: 0.26rem;
      color: $gray_b;
      margin-top: 0.1rem;
      .hospital{
        margin-right: 0.15rem;
      }
    }
  }
  .del{
    display: inline-block;
    width: 0.44rem;
    margin-right: 0.06rem;
    overflow: hidden;
    position: relative;
    .del-icon{
      position: absolute;
      top: 50%;
      left: 0;
      font-size: 0.4rem;
      margin-top: -0.3rem;

    }
  }
  .w-enter-active {
    transition: all .3s ease;
  }
  .w-leave-active {
    transition: all .3s ease;
  }
  .w-enter, .w-leave-to{
    width: 0;
    font-size: 0;
  }
}
.info_modules_h0{
  transform: translateY(-100%);
}
</style>
