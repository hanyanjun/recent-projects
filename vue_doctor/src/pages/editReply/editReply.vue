<template>
  <div class="container">
    <ul class="reply-text" v-show="info">
      <li class="unDefault" v-for="(item,index) in info" @click.stop="edit(item)"><b @click.stop="dele(item,index)"></b>{{item.content}}</li>
    </ul>
    <button type="button" name="button" class="addReply_btn"  @click.stop="add('')">添加</button>
    <button type="button" name="button" class="completeReply_btn" @click.stop="$router.push({path : 'chat'})">完成</button>
    <add-text :config="addConfig"  v-on:event="add"></add-text>
  </div>
</template>
<script>
  import actionSheet from '../../components/actionsheet'
  import addText from '../../components/addText'
export default{
    data(){return{
        info : '',
        editInfo : '',
        currentInfo : '',
        actionsheetConfig :{
          show : false,
          btns :[
            {name:'删除',method:()=>{
              this.$api.deleteReply(this.currentInfo.id).then(obj=>{
                this.info = Object.assign([],this.info.removeByValue(this.currentInfo));
                this.actionsheetConfig.show = false;
              })
            }},
            {name:'取消',method:()=>{
              this.actionsheetConfig.show = false;
            }},
          ]
        },
        addConfig : {
            show : false,
            count : 200,
            message : '',
            holder : '点击此处添加快捷回复短语'
        }
    }},
    components : {addText , actionSheet},
    created (){
      this.$store.commit('UPDATE_NAV',{title : '快捷回复编辑',fn : '', router : '/chat', fShow : false, hShow : true});
      this.$api.gainReply().then(obj=>{
          this.info = obj.reply;
      })
    },
    methods : {
        add(value){
            this.addConfig.show = this.addConfig.show ? false : true;
            if(value){
                if(this.editInfo){
                    this.editInfo.content = value;
                    this.$api.editReply(this.editInfo).then(obj=>{
                        this.editInfo = '';
                        this.addConfig.message = '';
                    })
                }else{
                  this.$api.addReply({content:new Array(value)}).then(obj=>{
                    this.info.push({content : value,id : obj.id});
                    this.addConfig.message = '';
                  })
                }
            }
        },
        dele(item){
            this.currentInfo = item;
            this.actionsheetConfig.show = true;
            this.$store.commit('SET_ACTION_SHEET',this.actionsheetConfig);
        },
        edit(item){
            this.addConfig.message = item.content;
            this.editInfo = item;
            this.addConfig.show = this.addConfig.show ? false : true;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    box-sizing: border-box;
    background: #f0eff5;
    padding: 0.32rem 0.26rem
  }

  .reply-text li {
    padding: 0.31rem 0.34rem 0.25rem 0.37rem;
    background: #fff;
    font-size: 0.30rem;
    line-height: 0.35rem;
    border-radius: 0.08rem;
    margin-top: 0.12rem;
    position: relative;
    word-break: break-all
  }

  .reply-text .unDefault {
    padding: 0.31rem 0.34rem 0.25rem 0.88rem
  }

  .container li b {
    display: inline-block;
    width: 0.88rem;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: url(../../assets/media/img/deleteReply_icon.png) center no-repeat;
    background-size: 0.35rem 0.35rem
  }

  .container button {
    display: block;
    width: 100%;
    height: 0.85rem;
    background: #fff;
    font-size: 0.36rem;
    text-align: center;
    margin-top: 0.20rem;
    line-height: 0.85rem;
    color: #0693fc;
    border-radius: 0.08rem
  }

</style>
