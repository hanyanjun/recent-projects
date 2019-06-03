<template>
  <div class="container" >
    <div class="line" v-show="info.length != 0 ">

    </div>
    <div :class="['content',{'content-active': info.length != 0 }]" >
      <button type="button" name="button" class="add"   @click.stop="textShow">点击添加记录</button>
      <ul class="record" v-for="(item,index) in info">
        <li :class="['info','info-active']"><b></b><span class="data">{{new Date(parseInt(item.created*1000)).toLocaleString().replace(/:\d{1,2}$/,' ')}}</span><span class="fn"  @click.stop="deleteShow(item)"></span></li>
        <li :class="['text',{'text-active': arrowShow == index}]">{{item.note}}</li>
        <b :class="['fn-arrow',{'fn-arrow-bottom' : arrowShow == index}]" @click.stop="arrowChange(index)"></b>
        <b class="circle" ></b>
        <b class="triangle"></b>
      </ul>
    </div>
    <add-text :config="addTextConfig" v-on:event="add"></add-text>
    <!--<action-sheet :config="actionConfig"></action-sheet>-->
  </div>
</template>

<script>
  import addText from '../../components/addText'
  import {Toast,MessageBox} from '../../components/hw-components'
//  import actionSheet from '../../components/actionsheet'
export default{
    name : 'pathography',
    components : {addText},
    data (){return {
        info : '',
        show : false,
        addShow : true,
        arrowShow : '999999999999999999999999',
        addTextConfig : {
            message : '',
            holder : '点击此处可添加病历描述',
            count : 200,
            show : false
        },
//      actionConfig : {
//            show : false,
//            btns : [
//              {
//                name : '删除记录',
//                method : ()=>{
//                  let patId = this.patId;
//                  let noteId = this.item.id;
//                  this.$api.delPatNote({patId : patId,noteId : noteId})
//                    .then(obj=>{
//                      this.info = this.info.removeByValue(this.item);
//                    })
//                  this.actionConfig.show = false;
//                }
//              },
//              {
//                  name : '取消',
//                  method : ()=>{
//                    console.log(1);
//                    this.actionConfig.show = false;
//                  }
//              }
//            ]
//      }
    }},
    created (){
      let id = this.$route.params.id;
      this.patId = id;
      this.$store.commit('UPDATE_NAV',{title : '病历描述', fn : '',router : `userInfo`, fShow : false,hShow : true});
      this.$api.patNotes(id)
        .then(obj=>{
           console.log(obj);
           this.info = obj.notes;
        })
    },
    methods : {
//        change(){
//            if(this.info.length == 0){
//                console.log('当前没有记录描述！')
//            }else{
//              this.show = this.show ? false : true;
//            }
//        },
       textShow(){
           this.addTextConfig.show = true;
        },
       deleteShow(item){
         let patId = this.patId;
         let noteId = item.id;
         MessageBox.confirm('确定删除此条描述?').then(obj=>{
           this.$api.delPatNote({patId : patId,noteId : noteId})
             .then(obj=>{
               this.info = this.info.removeByValue(item);
             })
         })
       },
        add(v){
           if(v){
             let id = this.patId;
             this.$api.addPatNote({id : id,note : v})
               .then(obj=>{
                   Toast('添加成功');
                   this.info.push(obj.note);
               })
           }
          this.addTextConfig.show = false;
        },
      arrowChange(v){
            this.arrowShow = v == this.arrowShow ? '999999999999999999999' : v;
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    width: 100%;
  }
  .content, .line {
    display: inline-block
  }
  .line {
    height: 100%;
    width: .04rem;
    background: #64b8f9;
    left: .2rem;
    position: fixed
  }
  .content .add, .content .record {
    background: #fff;
    border-radius: 0.1rem;
  }
  .content {
    width: 6.6rem;
    padding-left: .35rem;
  }
  .content-active {
    padding-left: .6rem
  }
  .content .add {
    height: 1rem;
    margin-top: .4rem;
    width: 100%;
    color: #64b8f9;
    font-size: .34rem;
    -webkit-border-radius: .1rem;
    -moz-border-radius: .1rem;
    -ms-border-radius: .1rem;
    -o-border-radius: .1rem;
    border-radius: .1rem
  }
  .content .record {
    padding: 0 .4rem .8rem;
    position: relative;
    -webkit-border-radius: .1rem;
    -moz-border-radius: .1rem;
    -ms-border-radius: .1rem;
    -o-border-radius: .1rem;
    border-radius: .1rem
  }
  .content .record .fn-arrow {
    width: .45rem;
    height: .25rem;
    background: url(../../assets/media/img/fn-top.png) no-repeat;
    background-size: contain;
    position: absolute;
    bottom: .28rem;
    left: 50%;
    margin-left: -0.23rem
  }
  .content .record .triangle {
    position: absolute;
    border: .17rem solid #fff;
    border-top: .17rem solid transparent;
    border-bottom: .17rem solid transparent;
    border-left: .17rem solid transparent;
    top: .7rem;
    left: -0.30rem
  }
  .content .record .circle {
    width: .15rem;
    height: .15rem;
    background: #64b8f9;
    border: .15rem solid #fff;
    -webkit-border-radius: 50%;
    -khtml-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
    border-radius: 50%;
    position: absolute;
    top: .63rem;
    left: -0.60rem
  }

  .content .record .fn-arrow-bottom {
    background: url(../../assets/media/img/fn-bottom.png) no-repeat;
    background-size: 0.45rem 0.23rem;
  }

  .content .record .info {
    height: .9rem;
    border-bottom: 1px solid #c6c8ca;
    margin-top: .15rem;
    -webkit-box-align: center;
    -webkit-align-items: center;
    display: flex;
    align-items: center;
    font-size: .34rem;
    position: relative;
    color: #64b8f9
  }

  .content .record .info-active {
    color: #000;
    border-bottom: none
  }

  .content .record .info b {
    display: inline-block;
    width: .44rem;
    height: .47rem;
    background: url(../../assets/media/img/day.png) no-repeat;
    background-size: contain;
    margin-right: .2rem;
    margin-left: .13rem
  }

  .content .record .info .fn {
    width: .5rem;
    height: .11rem;
    position: absolute;
    background: url(../../assets/media/img/point.png) no-repeat;
    background-size: contain;
    right: 0;
    top: .4rem
  }

  .content .record .text {
    max-height: .9rem;
    font-size: .3rem;
    color: #767676;
    word-break: break-all;
    line-height: .45rem;
    overflow: hidden;
    padding-top: .13rem
  }

  .content .record .text-active {
    max-height: none;
    height: auto
  }

  .text-mask {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .6);
    position: fixed;
    left: 0;
    top: 0;
    display: none
  }

  .text-mask .text-content {
    width: 6.8rem;
    padding-bottom: .55rem;
    margin: 1.5rem auto auto;
    background: #fff;
    -webkit-border-radius: .2rem;
    -khtml-border-radius: .2rem;
    -moz-border-radius: .2rem;
    -ms-border-radius: .2rem;
    -o-border-radius: .2rem;
    border-radius: .2rem;
    position: relative;
    overflow: hidden
  }

  .text-mask .text-input {
    display: block;
    resize: none;
    width: 5.8rem;
    min-height: 4.1rem;
    outline: 0;
    padding: .4rem 0;
    margin: auto;
    overflow: auto;
    line-height: .46rem;
    background: #fff;
    position: relative;
    word-break: break-all;
    color: #6e6e72;
    font-size: .3rem;
    border-bottom: 1px solid #b5b5b5
  }

  .text-mask .text-input-active {
    font-size: .34rem;
    color: #000
  }

  .text-mask .count {
    font-size: .3rem;
    display: inline-block;
    position: absolute;
    right: .46rem;
    color: #808184;
    line-height: .4rem;
    top: 4.4rem
  }

  .text-mask .submit {
    display: block;
    margin: .54rem auto auto;
    background: #0395fc;
    color: #fff;
    width: 3.3rem;
    height: .9rem;
    line-height: .9rem;
    text-align: center;
    font-size: .45rem;
    -webkit-border-radius: .45rem;
    -khtml-border-radius: .45rem;
    -moz-border-radius: .45rem;
    -ms-border-radius: .45rem;
    -o-border-radius: .45rem;
    border-radius: .45rem;
    letter-spacing: .15rem
  }

  .text-mask .cancle {
    display: block;
    width: .92rem;
    height: 1rem;
    background: url(../../assets/media/img/close.png) no-repeat;
    background-size: contain;
    position: absolute;
    top: .5rem;
    right: .45rem
  }

  .delete-window {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, .5);
    display: none
  }

  .delete-window button {
    display: block;
    width: 100%;
    height: .92rem;
    line-height: .92rem;
    text-align: center;
    font-size: .34rem;
    position: absolute;
    background: #fff
  }

  .delete-window .cancle {
    bottom: 0
  }

  .delete-window .delete {
    bottom: 1.02rem
  }

</style>
