<template>
  <div class="mask container">
  <div class="content">
  <a href="javascript:;" class="group-status"><span>当前分组</span><span class="text">{{currentGro.group_name}}</span></a>
  <!--<a href="javascript:;" class="new-group" @click.stop="addGro"><span>新建分组</span><b></b></a>-->
  <a href="javascript:;" class="new-group" v-if="groData.length != 0"><span>可选分组</span></a>
  <!--<a href="javascript:;"><li class="group-list"><span>可选分组</span></li></a>-->
  <a href="javascript:;"  @click.stop="change(item)" v-for="item in groData" ><li class="group-name"><span>{{item.group_name}}</span><b :class="item.id == currentGro.id ? 'active' : 'deactive'"></b></li></a>
    <button type="button" name="button" class="submit" @click.stop="movePat" v-if="groData.length != 0">完成</button>
  </div>
    <prompt :config="proSet"></prompt>
  </div>
</template>

<script>
  import prompt from '../../components/prompt'
  import {Toast} from '../../components/hw-components'
export default{
    name : 'userGroup',
    data(){return {
        groData : '',currentGro : '',
        proSet : {
            title : '新建分组',
            holder : '输入分组名(限长8个字)',
            count : 8,
            show : false,
            btns : [
              {
                name : '取消',
                method : (v)=>{
                    this.proSet.show = false;
                }
              },
              {
                name : '保存',
                method : (v)=>{
                    console.log(v);
                  if(v){
                    this.$api.addGroup({group_name : v})
                      .then(obj=>{
                        this.groData.push(obj.group);
                      })
                  }else{
                    Toast('请输入分组名!');
                  }
                  this.proSet.show = false;
                }
              }
            ]
        }
    }},
    components : {prompt},
    created (){
      let id = this.$route.params.id;
      let groId = this.$route.params.groId;
      this.$store.commit('UPDATE_NAV',{title : '会员分组',fn : '', router : '', fShow : false,hShow : true});
      this.$api.gainAllGro()
        .then(obj=>{
            this.groData = obj.groups;
            let result = obj.groups.filter((v,i,a)=>{
                return v.id == groId;
            })
            if(result.length == 0){
              this.currentGro = {group_name : '未分组',id : ''};
            }else{
              this.currentGro = result[0];
            }

        })
    },
    methods : {
        change(v){
           this.currentGro = v;
        },
        addGro(){
            this.proSet.show = true;
        },
        movePat(){
            let id = this.$route.params.id;
            let groId = this.currentGro.id;
            this.$store.commit('IS_UPDATE_CONTACTS',true);
              this.$api.movePat({patId : id , groId : groId})
              .then(obj=>{
                this.$router.push({path : `/${id}/userInfo`})
              })

        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .mask {
    background: #f2f3f5;
    box-sizing: border-box;
  }
  .mask .content {
    /*min-height: 100%;*/
    width: 100%;
  }
  .mask .submit {
    width: 100%;
    margin-top: 0.2rem;
    /*position: absolute;*/
    /*bottom: 0;*/
    background: #0693fc;
    height: 1rem;
    color: white;
    font-size: 0.4rem;
  }
  .mask .content .group-name, .mask .content .group-status span:nth-of-type(2) {
    color: #7d7e7f
  }
  .mask .content .group-list, .mask .content .group-name, .mask .content .group-status, .mask .content .new-group {
    border-bottom: 1px solid #d2d2d2;
    font-size: .34rem
  }
  .mask .content a {
    padding: 1px .45rem;
    height: .9rem;
    display: flex;
    justify-content: space-between;
    align-items: center
  }
  .mask .content li {
    height: .9rem;
    width: 100%;
    margin-left: .45rem;
    display: flex;
    justify-content: space-between;
    align-items: center
  }
  .mask .content .group-status {
    margin: .2rem 0
  }
  .mask .content .new-group b {
    width: .37rem;
    height: .37rem;
    background: url(../../assets/media/img/newGroup.png) no-repeat;
    background-size: contain
  }
  .mask .content .group-name .deactive {
    width: .4rem;
    height: .4rem;
    background: url(../../assets/media/img/group-nocheck.png) no-repeat;
    background-size: contain
  }
  .mask .content .group-name .active {
    width: .4rem;
    height: .4rem;
    background: url(../../assets/media/img/group-check.png) no-repeat;
    background-size: contain
  }
</style>
