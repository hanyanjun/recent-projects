<template>
<div class="container">
  <header v-show="type == 'certificate'">请务必填写真实信息,您的信息我们将严格保密!</header>
  <div :class="['content',{'content1' : type == 'certificate'}]">
    <div class="head" v-show="type == 'change'">
      <h6 class="title">头像 <span class="tip">（请使用本人照片作为头像）</span></h6>
      <section>
        <img :src="head" alt="" ref="headImg">
        <input type="file" @change="uploadHead" ref="head">
        <span class="add">{{type == 'add' ? '点击添加' : '点击更换'}}</span>
      </section>
    </div>
      <div class="head head1"  v-show="type == 'certificate'" >
      <h6 class="title">头像 <span class="tip">（请使用本人照片作为头像）</span></h6>
      <section>
        <span>点击更换</span>
        <input type="file" @change="uploadHead" ref="head1">
        <img :src="head" alt=""  ref="head1Img">
      </section>
    </div>
    <div class="type1">
      <section class="name">
        <!--<h6 class="title">姓名<span class="tip">{{type == 'change' ? '（不可修改）' : '（必填）'}}</span></h6>-->
        <h6 class="title">姓名<span class="tip tip1">&nbsp;*
          <!--（必填）-->
        </span></h6>
        <!--<input type="text" placeholder="请输入真实姓名" :value="info.name"  v-model="info.name" @click.stop="hidePicker" v-show="type != 'change'">-->
        <!--<template v-if="type == 'certificate'">-->
          <!--<input type="text" placeholder="请输入真实姓名" readonly="true" :value="info.name" onfocus="this.blur()">-->
        <!--</template>-->
        <!--<template v-else>-->
        <!--<input type="text" placeholder="请输入真实姓名">-->
        <textarea  placeholder="请输入真实姓名"  :value="info.name" @input="input_name"  maxlength="10"   @click.stop="hidePicker"></textarea>
        <!--</template>-->
      </section>
      <section class="sex">
        <!--<h6 class="title">性别<span class="tip">{{type == 'change' ? '（不可修改）' : '（必填）'}}</span></h6>-->
        <h6 class="title">性别<span class="tip tip1">&nbsp;*
          <!--（必填）-->
        </span></h6>
        <!--<template v-if="type == 'certificate'">-->
          <!--<input type="text" readonly="true"  :value="info.sex ? info.sex : '男'"  @click.stop="readonly ?　select('sex'): ''"  onfocus="this.blur()">-->
        <!--</template>-->
        <!--<template v-else>-->
          <input type="text" readonly="true"  :value="info.sex ? info.sex : '男'"  @click.stop="select('sex')"  onfocus="this.blur()">
        <!--</template>-->
      </section>
    </div>
    <div class="hospital" >
      <h6 class="title">就职医院<span class="tip tip1">&nbsp;*
        <!--（必填）-->
      </span></h6>
      <input type="text" readonly="true" placeholder="请选择医院" :value="info.hospital ? info.hospital : ''" @click.stop="hospitalShow" onfocus="this.blur()">
    </div>
    <div class="type1" >
      <section class="type">
        <h6 class="title">科室<span class="tip tip1">&nbsp;*
          <!--（必填）-->
        </span></h6>
        <input type="text"  readonly="true"  placeholder="请选择科室" :value="info.department ? info.department : ''"  @click.stop="select('department')" onfocus="this.blur()">
      </section>
      <section class="sex">
        <h6 class="title">职称<span class="tip tip1">&nbsp;*
          <!--（必填）-->
        </span></h6>
        <input type="text" readonly="true" placeholder="请选择职称"  :value="info.technical ? info.technical  : ''" @click.stop="select('technical')" onfocus="this.blur()">
      </section>
    </div>
    <div class="skill" v-show="type == 'change'">
      <h6 class="title">擅长<span class="tip">（限字500）</span></h6>
      <textarea name="" cols="30" rows="10" maxlength="500" v-model="info.skill" @click.stop="hidePicker">{{info.skill}}</textarea>
    </div>
    <div class="introduce" v-show="type == 'change'">
      <h6 class="title">个人简介<span class="tip">（限字500）</span></h6>
      <textarea name=""  cols="30" rows="10" maxlength="500" v-model="info.abstract" @click.stop="hidePicker">{{info.abstract}}</textarea>
    </div>
    <div class="hope" v-show="type == 'change'">
      <h6 class="title">医生寄语<span class="tip">（限字50）</span></h6>
      <textarea name=""   cols="30" rows="10" maxlength="50" v-model="info.hope" @click.stop="hidePicker">{{info.hope}}</textarea>
    </div>
    <div class="certificate" v-show="type == 'certificate'">
      <h6 class="title">请上传医师执业证书或工牌照</h6>
      <section>
        <template v-if="info.certify">
          <b v-show="false">{{certificate = true}}</b>
          <img v-img="`${info.certify}?${Date.parse(new Date())}`" src=""  alt=""  ref="certificateImg">
        </template>
        <template v-else>
          <img src="./img/certificateTip-icon.png" alt="" ref="certificateImg">
        </template>
        <input type="file" @change="uploadCertificate" ref="certificate">
      </section>
    </div>
  </div>
  <hw-button :config="btnText" v-on:event="submit"></hw-button>
  <hw-hospital  :display="hShow"  v-on:event="selectHospital"></hw-hospital>
</div>
</template>

<script>
  import hwHospital from '../../components/hwHospital'
  import {Toast,MessageBox} from '../../components/hw-components'
export default{
    components : {hwHospital},
    data(){return{btnText : '提交',type : '',hShow :false,readonly: 'false',tip : false,certificate : false,
      prompt : {show : false ,title : '其他科室',holder : '请输入科室名',tip : '',value : ''},
      prompt1 : {show : false ,title : '其他职称',holder : '请输入职称名',tip : '',value : ''},
    }},
    name : 'addInfo',
    created(){
      let type = this.$route.params.type;
      //重新进入 将信息拷贝 重新赋值
      this.$store.state.docInfoCopy = Object.assign({},this.$store.state.docInfo);
      this.type = type;
      if(type == 'add'){
        this.$store.commit('UPDATE_NAV',{title : '填写个人信息', fn : '',router : '/my', fShow : false, hShow : true});
      }else if(type == 'change'){
        this.$store.commit('UPDATE_NAV',{title : '修改个人信息',fn : '', router : '/my', fShow : false, hShow : true});
      }else{
        this.$store.commit('UPDATE_NAV',{title : '上传证件',fn : '', router : '/my', fShow : false, hShow : true});
      }
    },
    computed : {
      head(){
          return this.$store.getters.docHead;
      },
      info(){
        return this.$store.state.docInfoCopy;
      }
    },
    methods : {
       input_name(e){
         let v = e.target.value;
         if(v[v.length - 1] == ' '){
           v = v.substring(0, v.length - 1);
         }
         e.target.value = v;
         this.info.name = v;
       },
        submit(){
            this.info.sex =  this.info.sex ? this.info.sex : '男';
            if(!this.info.name || !this.info.sex  || !this.info.department || !this.info.technical || !this.info.hospital){
                Toast('请填写完整信息!');
            }else{
                let type = this.$route.params.type;
                 if(type == 'certificate' && !this.certificate){
                   Toast('请提交认证照片！');
                 }else{
                   this.$api.updateDocInfo(this.info)
                     .then(obj=>{
                       this.$store.commit('IS_UPDATE_DOCINFO',true);
                       if(type == 'add'){
                         this.$router.push({path : '/progress',query : {
                           status : JSON.stringify({
                             tip : `尊敬的${this.info.name}医生，工作人员将在三个工作日内与您核对认证，请您保持电话畅通。`,
                             pro : '2',
                             title : '提交成功',
                             route : '/work'
                           })
                         }})
                       }else if(type == 'certificate'){
                         this.$router.push({path : '/progress',query : {
                           status : JSON.stringify({
                             tip : `尊敬的${this.info.name}医生，您的认证申请成功提交，工作人员将在三个工作日内与您核对认证，请您保持电话畅通。`,
                             pro : '2',
                             title : '认证提醒',
                             route : '/my'
                           })
                         }});
                       }else{
                         this.$router.push({path : '/progress',query : {
                           status : JSON.stringify({
                             tip : `尊敬的${this.info.name}医生，您的信息修改成功。`,
                             pro : '1',
                             title : '提交成功',
                             route : '/my'
                           })
                         }});
                       }
                     })
                 }
            }
        },
        hospitalShow(){
//            if(this.type != 'certificate'){
              this.hShow  = true;
              this.$picker1.hide();
//            }
        },
        close(){
          this.hShow = false;
        },
        select(v){
//            if(this.type != 'certificate'){
              this.hShow  = false;
              let data = [{value : '男' , text : '男'},{value : '女' ,text : '女'}];
//            if(v == 'sex' && this.type == 'change'){
//                Toast('性别不可修改!');
//            }else{
              if(v == 'department'){
                data = this.$hwdata.departmentData;
              }else if(v == 'technical'){
                data  = this.$hwdata.levelData;
              }
              this.$picker1.setData(data);
              this.$picker1.show(e=>{
                 if(e[0].value == 'null'){
                     if(e[0].text == '其他科室'){
                       this.$store.commit('SET_PROMPT',this.prompt);
                       this.prompt.show = true;
                       this.prompt.callback =(t)=>{
                           t = t.trim();
                         if(t == '取消'){
                           this.prompt.show = false;
                         }else{
                           this.prompt.value = t;
                           if(t.length == 0){
                             this.prompt.tip = '请输入科室';
                           }else if(t.length > 10){
                             this.prompt.tip = '长度不可超过10个字符';
                           }else{
                             this.info[v] = t;
                             this.prompt.tip = '';
                             this.prompt.show = false;
                           }
                         }
                       }
                     }else if(e[0].text == '其他职称'){
                       this.$store.commit('SET_PROMPT',this.prompt1);
                       this.prompt1.show = true;
                       this.prompt1.callback =(t)=>{
                         t = t.trim();
                         if(t == '取消'){
                           this.prompt1.show = false;
                         }else{
                           this.prompt1.value = t;
                           if(t.length == 0){
                             this.prompt1.tip = '请输入职称';
                           }else if(t.length > 10){
                             this.prompt1.tip = '长度不可超过10个字符';
                           }else{
                             this.info[v] = t;
                             this.prompt1.tip = '';
                             this.prompt1.show = false;
                           }
                         }
                       }
                     }

                 }else{
                   this.info[v] = e[0].value;
                 }

              })
//            }
//            }

        },
        selectHospital(v){
            this.$picker1.hide();
            if(v){
              this.info.provinces_area_id = v.provinces_area_id;
              this.info.hospitals_code = v.hospitals_code;
              this.info.area_id  = v.cities_area_id;
              if( v.provinces_area_id == '100000000' ||  v.provinces_area_id == '200000000'||  v.provinces_area_id == '500000000'||  v.provinces_area_id == '900000000'){
                this.info.area_id  = v.towns_area_id;
              }
              this.info.hospital = v.name;
            }
            this.hShow = this.hShow ? false : true;
        },
        hidePicker(){
            this.$picker1.hide();
        },
        uploadHead(){
            let  f;
            if(this.$route.params.type == 'certificate'){
              f = this.$refs.head1.files[0];
            }else{
              f = this.$refs.head.files[0];
            }
            let src = window.URL.createObjectURL(f);
            let formData = new FormData();
            formData.append('type1[]', f);
            this.$api.updateFace(formData)
              .then(obj=>{
                  if(obj.code == 0)Toast('图片已上传');
                  this.$store.commit('IS_UPDATE_DOCINFO',true);
                  if(this.$route.params.type == 'certificate'){
                      this.$refs.head1Img.src = `${DOCLINKAPI}${obj.face}?${Date.parse(new Date())}`;
                  }else{
                      this.$refs.headImg.src = `${DOCLINKAPI}${obj.face}?${Date.parse(new Date())}`;
                  }
              })
        },
        uploadCertificate(){
          let f = this.$refs.certificate.files[0];
          let src = window.URL.createObjectURL(f);
          this.$refs.certificateImg.src = src;
          this.$refs.certificateImg.style.marginTop = 0;
          this.$refs.certificateImg.style.width = '100%';
          this.$refs.certificateImg.style.height = '100%';
          let formData = new FormData();
          formData.append('type1[]', f);
          this.$api.uploadCertify(formData)
            .then(obj=>{
              if(obj.code == 0)Toast('图片已上传');
              this.certificate = true;
            })

        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
.container{
  width:100%;
  box-sizing: border-box;
  padding: 0 0.2rem;
  position: relative;
  overflow: hidden;
  background: rgb(237,239,240);
  .content{
    height: calc(100% - 2.1rem);
    overflow-y: scroll;
  }

  .content1{
    height: calc(100% - 2.9rem);
    overflow-y: scroll;
  }
  div{
    line-height: 0;
  }
  section{
    line-height: 0;
  }
  section div{
    line-height: 0;
  }
  header{
    width:100vw;
    margin-left: -0.2rem;
    height:0.8rem;
    line-height: 0.8rem;
    font-size: 0.26rem;
    color: white;
    padding-left: 0.35rem;
    padding-left: 1rem;
    box-sizing: border-box;
    background: url(img/self-info.png) #2a8cff no-repeat left 0.35rem center;
    background-size: 0.46rem 0.34rem;
  }

  textarea{
    display: inline-block;
    width:100%;
    height: 2rem;
    box-sizing: border-box;
    border-top: 0.35rem solid white;
    border-bottom: 0.35rem solid white;
    border-right: 0.4rem solid white;
    border-left: 0.4rem solid white;
    border-width: 0.35rem 0.4rem;
    /*border-color: white;*/
    /*padding: 0.35rem 0.4rem;*/
    font-size: 0.28rem;
    color: #727171;
    word-break: break-all;
    box-sizing: border-box;
  }
  .title{
    font-size: 0.32rem;
    height: 0.32rem;
    line-height: 0.32rem;
    color: $gray_a;
    padding: 0.2rem 0 0.15rem 0;
    .tip{
      font-size: 0.28rem;
      color: rgb(159,160,160);
    }
    .tip1{
      color: red;
    }
  }
  .head section{
    display: flex;
    width:100%;
    background: white;
    height: 2rem;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    position: relative;
    img{
      display: inline-block;
      width:1.10rem;
      height:1.10rem;
      border-radius: 50%;
    }
    span{
      display: inline-block;
      height: 0.4rem;
      font-size: 0.26rem;
      color: rgb(183,184,184);
      line-height: 0.4rem;
      background: url(img/editor.png) no-repeat right center;
      padding-right: 0.45rem;
      background-size: 0.3rem 0.3rem;
    }
    input{
      display: inline-block;
      width:100%;
      height:100%;
      position: absolute;
      left:0;
      top:0;
      opacity: 0;
    }
  }
  .head1 section{
    height:1rem;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 0.4rem;
    img{
      width:0.7rem;
      height:0.7rem;
    }
  }
  input{
    display: inline-block;
    width:100%;
    height: 1rem;
    box-sizing: border-box;
    padding: 0 0.4rem;
    line-height: 1rem;
    color: $input_c;
    font-size: 0.28rem;
  }
  .type1{
    width:100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    input,textarea{
      display: inline-block;
      width:3.4rem;
      height: 1rem;
      padding: 0.2rem 0.4rem;
      line-height: 0.6rem;
      color: $input_c;
      white-space: nowrap;
      font-size: 0.28rem;
      border: none;
    }
  }
  .hope textarea{
    height:2rem;
  }
  .certificate section{
    width:100%;
    height:4rem;
    position: relative;
    background: white;
    padding-top: 1px;
    overflow: hidden;
    img{
      display: block;
      /*border: 1px solid red;*/
      /*margin: 1.1rem auto 0;*/
      /*width: 1rem;*/
      /*height: 1rem;*/
      width: 100%;
      height: 100%;
    }
    span{
      display: block;
      width:100%;
      font-size: 0.26rem;
      margin-top: 0.5rem;
      color: #b6b6b6;
      text-align: center;
    }
    input,textarea{
      display: inline-block;
      position: absolute;
      left:0;
      top:0;
      width:100%;
      height:100%;
      opacity: 0;
    }
  }


}

</style>
