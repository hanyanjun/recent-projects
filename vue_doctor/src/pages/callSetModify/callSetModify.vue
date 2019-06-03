<template>
<div class="callSetModify">
  <div class="content">
    <a  href="javascript:;"  @click.stop="selectTime">请选择预约时间<span>{{showT}}</span><i class="icon-return-boldleft"></i></a>
    <a  href="javascript:;" @click.stop="selectReason">请选择修改原因<i class="icon-return-boldleft"></i></a>
    <p class="reason" v-show="reason" @click.stop="inputRea(false)">
      {{reason}}
    </p>
  </div>
  <button class="submit" @click.stop="submit">提交</button>
  <middle-select :config="selectData"></middle-select>
  <copy-prompt v-model="reason1" @cancle="cancle" title="请输入修改原因" holder="请输入修改原因" @confirm="confirm" id="copy"  :show="copyShow"></copy-prompt>
</div>
</template>

<script>
import middleSelect from '../../components/middleSelect'
import copyPrompt from '../../components/copyPrompt.vue'
import {Toast} from "../../components/hw-components";
export default {
  data(){return{
    reason : '',
    reason1 : '',
    time : [],
    id : '',
    showT : '',
    is_select : true,
    copyShow : false,
    prompt : {show : false ,title : '取消原因',holder : '请输入取消原因',tip : '',value : ''},
    selectData :{
      title :'请选择修改原因',
      text: ['门诊数量过多','门诊时间需要调整','工作时间有冲突','自定义'],
      show : false,
      method : (v)=>{
        if(v){
          if(v == '自定义'){
            this.inputRea(true);
          }else{
            this.reason = v;
            this.selectData.show = false;
            this.prompt.show = false;
          }
        }else{
          this.selectData.show = false;
        }
      }
    },
  }},
  name: "callSetModify",
  components : {middleSelect,copyPrompt},
  created(){
    this.$store.commit('UPDATE_NAV',{title : '修改时间', hShow : true , fShow : false});
    let t = this.$route.query.time;
    this.id = this.$route.params.id;
    let time = this.$means.dateCeilTen(t ? t.replace(/-/g,'/') : '');
    let tArr = (new Date(time)).toArray();
    let timer = Date.parse(new Date(time));
    let d = 10*60*1000;
    let arr = [];
    let obj = {};
    let c =0;
    for(let a = 0;  a <= 144 ; a++){
      let t = timer + d * a;
      let t1 = (new Date(t)).toArray();
      if(!obj.hasOwnProperty(t1[0])){
        obj[t1[0]] = {};
      }
      if(!obj[t1[0]].hasOwnProperty([t1[1]])){
        c ++ ;
        obj[t1[0]][t1[1]]  = [];
      }
      obj[t1[0]][t1[1]].push(t1[2]);
    }
    for(let k  in  obj){
      if(typeof obj[k] == 'object'){
          let s = (new Date()).getFullYear() + '年';
          arr.push({value : k , text : k.replace(new RegExp(s),'') , children : []});
          let l = arr.length - 1;
          for(let k1 in obj[k]){
            if(typeof obj[k][k1] == 'object'){
              arr[l].children.push({value : k1 , text : k1 , children : []});
              let l1 = arr[l].children.length -1;
              obj[k][k1].forEach((v,i)=>{
                arr[l].children[l1].children.push({value : v , text : v.replace(/00/g,0)})
              })
            }
          }
      }
    }
    this.time = [...arr];
  },
  methods:{
    selectTime(){
      this.$pickerl3.setData(this.time);
      this.$pickerl3.show((e)=>{
        this.showT = `${e[0].value.replace(/[年|月]/g,'-').replace(/日/g,'')}  ${e[1].value.replace(/点/g,':')}${e[2].value.replace(/分/g,'')}`;
      })
    },
    inputRea(v){
      this.selectData.show = false;
      this.$store.commit('UPDATE_MASK',true);
      this.copyShow = true;
      this.is_select = v;
    },
    confirm(t){
      t = t.trim();
      if(t.length == 0){
        Toast('请输入修改原因');
      }else if(t.length > 100){
        Toast('不能超过100个字符');
      }else{
        this.reason = t;
        this.$store.commit('UPDATE_MASK',false);
        this.copyShow = false;
      }
    },
    cancle(){
      if(this.is_select){
        this.selectData.show = true;
      }else{
        this.selectData.show = false;
      }
      this.$store.commit('UPDATE_MASK',false);
      this.copyShow = false;
    },
    selectReason(){
      this.$pickerl3.hide();
      this.selectData.show = this.selectData.show ? false : true;
    },
    submit(){
      this.$api.modifyCallTime({id : this.id,modify_time : this.showT, content : this.reason}).then(obj=>{
        this.$router.routeBack();
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
.callSetModify{
  height: 100%;
  overflow: hidden;
}
.content{
  height: calc(100% - 1.6rem);
  overflow: scroll;
  a{
    padding-left: 0.30rem;
    display: block;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.32rem;
    line-height: 1rem;
    padding-right: 0.74rem;
    color: $gray_a;
    text-align: left;
    position: relative;
    background: white;
    border-bottom: 1px solid #dcdcdc;
    span{
      font-size: 0.32rem;
      color: $input_c;
    }
    &:nth-child(3){
      color: $gray_c;
    }
  }
  .reason{
    font-size: 0.32rem;
    color: $input_c;
    line-height: 0.48rem;
    padding: 0.27rem 0.5rem 0.27rem 0.3rem;
    background: white;
  }
}
.submit{
  display: block;
  margin: 0.2rem auto 0.4rem;
  width: 6.9rem;
  height: 1rem;
  line-height: 1rem;
  background: rgb(6, 147, 252);
  color: white;
  font-size: 0.4rem;
  text-align: center;
  border-radius: 0.06rem;
}

.icon-return-boldleft{
  position: absolute;
  right: 0.4rem;
  color: $gray_c;
  transform: translateY(-50%) rotateY(180deg);
  font-size: 0.26rem;
  top: 50%;
}

.add{
  line-height: 0;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  margin-bottom: 0.57rem;
  input{
    line-height: normal;
    font-size: 0.32rem;
    background: white;
    /*line-height: 0.4rem;*/
    border: 0.44rem solid white;
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
    margin-top: 0;
  }
  ::-webkit-input-placeholder{
    color: $i2Gray;
    font-size: 0.32rem;
  }
  .line{
    display: inline-block;
    width: 100%;
    position: absolute;
    height: 1px;
    background: $gray;
    left: 0.44rem;
    top:1.2rem;
  }
}
</style>
