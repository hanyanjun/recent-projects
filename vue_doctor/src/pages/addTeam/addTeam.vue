<template>
<div class="addTeam">
  <div class="content">
    <hwConInput :is_require="true" title="专家团队名称" v-model="title" :trim="true" :br="true" @focus="focus" maxLength="20" holder="请输入专家团队的名称" code="100"  :err="err"></hwConInput>
    <hwConInput :is_require="true" title="专家团队专业擅长" v-model="skill" :trim="true" @focus="focus" minHeight="84"  maxLength="500" code="101" :err="err"  holder="请描述您的团队擅长治疗领域、团队特色等"></hwConInput>
    <hwConInput title="专家团队简介" minHeight="94" maxLength="500" v-model="intro"  :trim="true" @focus="focus" holder="请描述您的团队简介或领衔专家介绍，让用户更加了解专家团队（可不填，即不显示简介）"></hwConInput>
  </div>
  <!--<router-link to="" class="ignore">跳过添加成员</router-link>-->
  <hwSubmitBtn text="下一步" :activeStyle="{background : '#20c6b4'}" :is_commit="commit"  @submit="submit"></hwSubmitBtn>
</div>
</template>

<script>
import hwConInput from "../../components/hw-con-input"
import hwSubmitBtn from "../../components/hw-submit-btn"
export default {
  //状态id 0  表示 是首次创建
  created(){
    let id = window.sessionStorage['teamId'];
    this.id = id;
    if(id == '0'){
      this.$store.commit('UPDATE_NAV',{title : '新建专家团队',theme : 'green',hShow : true});
      if(window.sessionStorage['teamTitle']){
        this.title =  window.sessionStorage['teamTitle'];
      }if(window.sessionStorage['teamSkill']){
        this.skill =  window.sessionStorage['teamSkill'];
      }if(window.sessionStorage['teamIntro']){
        this.intro =  window.sessionStorage['teamIntro'];
      }
    }else{
      this.$store.commit('UPDATE_NAV',{title : '编辑专家团队',theme : 'green',hShow : true});
      this.$api.teamDetail(this.id).then(obj=>{
        [this.skill,this.intro,this.title] = [obj.team.skill,obj.team.note,obj.team.title];
      });
    }
  },
  watch :{
    title(v){
      window.sessionStorage['teamTitle'] = v;
    },
    skill(v){
      window.sessionStorage['teamSkill'] = v;
    },
    intro(v){
      window.sessionStorage['teamIntro'] = v;
    },
  },
  mounted(){
    // document.querySelector('.nav_back').onclick = _=>{
    //   this.$router.push('/myTeam');
    // };
  },
  data(){return{err : {code : 0, errMsg : ''} , title : '',skill : '' , intro : '',commit : false, id : ''}},
  components:{hwConInput,hwSubmitBtn},
  methods:{
    submit(){
      if(this.title.length == 0){
        this.err = {code : 100, errMsg : '输入不能为空'};
      }else if(this.skill.length == 0){
        this.err = {code : 101, errMsg : '输入不能为空'};
      }else{
        this.commit = true;
        if(this.id == '0'){
          this.$api.addTeam({
            title: this.title,
            skill: this.skill,
            note: this.intro
          }).then(obj=>{
            window.sessionStorage['teamId'] = obj.team_id;
            this.$router.push(`/${obj.team_id}/addTeamMem`);
          })
        }else{
          this.$api.updateTeam(this.id,{
            title : this.title,
            skill : this.skill,
            note : this.intro
          }).then(obj=>{
            this.$router.push(`/${this.id}/addTeamMem`);
          })
        }
      }
    },
    focus(){
      this.err =  {code : 0 , errMsg : ''};
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.addTeam{
  height: 100%;
  overflow: hidden;
  .content{
    height: calc(100% - 1.6rem);
    width: 100%;
    box-sizing: border-box;
    padding: 0 0.2rem;
    overflow: scroll;
  }
  .ignore{
    display: inline-block;
    width: 100%;
    text-align: center;
    color: $baseGreen;
    font-size: 0.3rem;
    line-height: 0.9rem;
    text-decoration: underline;
  }
}
</style>
