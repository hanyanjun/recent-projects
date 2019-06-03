<template>
  <div class="contacts">
    <div class="con-fn">
      <div class="search">
        <input type="text" name="" value="" autocomplete="off" :class="['con-sear', {'con-sear-active' : !conShow}]" v-focus="searchPat" v-model="searchInput">
        <span class="con-position" v-show="conShow">搜索</span>
      </div>
    </div>
    <div class="con-content" v-show="conShow">
      <div class="con-group" >
        <!--分组列表-->
        <template v-for="(item,key,index) in all">
          <ul :class="['con-act', {'con-active' : item.patients.length != 0 && !item.toggle},{'con-device':item.group_name == 'device_patients'},{'no_group' : item.group_name == 'no_group'}]">
            <div :class="['line',{'line-active' : item.patients.length != 0 &&  !item.toggle}]">
              <span></span>
              <i></i>
            </div>
            <label :for="item.group_name" class="selectPat-title" id="selectPat-title">
              <!--<template v-if="item.patients.length == 0">-->
                <!--<input type="checkbox" :id="item.group_name"  :value="item.group_id || item.group_name"  @click.stop="item.toggle = !item.toggle">-->
              <!--</template>-->
              <!--<template v-else>-->
                <input type="checkbox" :id="item.group_name"  :value="item.group_id || item.group_name"  @click.stop="selectAll(item,$event)">
              <!--</template>-->
              <!-- 0 和 length 之间代表部分选中    num = length -1 代表全选  noNum = ‘true’ 分组里面没有人不显示选中-->
              <i :class="[{'part-selected' : item.num  >0 && item.num < item.patients.length },{'all-selected' : item.patients.length != 0  ? item.num == item.patients.length : !item.toggle }]"></i>
            </label>
            <li class="title" @click.stop="item.toggle = !item.toggle">
              <span class="group-name">
                <template v-if="item.group_name == 'device_patients'">
                    肺功能管理组
                </template>
                <template v-else-if="item.group_name == 'no_group'">
                    未分组
                </template>
                <template v-else-if="item.group_name == 'inquiry_service'">
                    图文咨询(次)
                </template>
                <template v-else-if="item.group_name == 'phone_service'">
                    电话咨询
                </template>
                <template v-else-if="item.group_name == 'family_service'">
                    图文咨询(期)
                </template>
                <template v-else-if="item.group_name == 'no_service'">
                    普通会员
                </template>
                <template v-else>
                  {{item.group_name}}
                </template>
                <!--&nbsp;(<span class="len">{{item.patients.length}}</span>)-->
                  </span>
                <span class="num">
                  <template v-if="item.patients.length == 0">
                     0
                  </template>
                  <template v-else>
                    <i class="blue">{{item.num  ? item.num : 0}}</i>/{{item.patients.length}}
                    <!--<i class="blue">{{bottomAll ? item.patients.length :　item.selectedNum || 0}}</i>/{{item.patients.length}}-->
                  </template>
                </span>
            </li>
            <li class="info info2" v-for="(item1,index1) in item.patients" >
              <!--<i class="icon-equipment iequ" style="font-size: 0.33rem" v-show="item1.is_device_exist == '1'">-->
                <!--<span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>-->
              <!--</i>-->
              <img :src="item1.headimg" alt="" ><div><span class="name">{{item1.name ? item1.name : item1.nick}}</span><span class="other">{{item1.sex}}&nbsp;|&nbsp;{{item1.age}} </span></div>
              <!--<label :for="item1.account" class="selectPat"><input type="checkbox" :id="item1.account" v-model="select" :value="item1" @click.stop="selectGroup(item)"><i></i></label>-->
              <label :for="item1.account" class="selectPat"><input type="checkbox" :id="item1.account" v-model="select"  @click.stop="selectPat(item,item1,$event,true)"  :value="item1.account"><i></i></label>
            </li>
          </ul>
        </template>
      </div>
    </div>
    <!--搜索结果-->
    <div class="search-result" v-show="!conShow">
      <div class="result" v-show="result.length == 0">查询不到符合的结果</div>
      <li class="info" v-for="item in result"  >
        <img :src="item.headimg" alt="" ><div><span class="name">{{item.name ? item.name : item.nick}}</span><span class="other">{{item.sex}}&nbsp;|&nbsp;{{item.age}}</span></div>
        <!--<label :for="item.account" class="selectPat" ><input type="checkbox" :id="item.account" v-model="select" :value="item"  @click.stop="selectPat(item)"><i></i></label>-->
        <label :for="item.account" class="selectPat" ><input type="checkbox" :id="item.account" v-model="select" :value="item.account" @click.stop="selectPat('',item,$event,true)" ><i></i></label>
      </li>
    </div>
    <div class="bottom" v-show="conShow">
        <label for="" class="selectPat-title" ><input type="checkbox" id="" v-model="bottomAll" value="all" @click.stop="selectAllPat($event)"><i></i>全选</label>
        <button @click.stop="skip">{{isSend ? '发  送' : '下一步'}}</button>
    </div>
  </div>
</template>

<script>
  import { Toast,Indicator } from '../../components/hw-components';
  import api from '../../fetch/api'
  export default{
    data(){return{
      conShow :true,
      result : [],
      searchInput : '',
      select : [],  //只有account 组成的数组
      selected : {}, //account 和 name值组成的对象
      selectGroup : [],
      bottomAll : '',
      isSend : false
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '群发消息', fShow : false, hShow : true});
      this.isSend = Boolean(window.sessionStorage['sendScienceing']);
      if(Object.keys(this.all).length != 0){
        for(let key in this.all){
          this.all[key].num = 0;
          if(this.all[key].patients.length == 0){
            this.all[key].toggle = true;
          }
        }
      };
      this.init();
    },
    mounted(){
      document.querySelector('.nav_back').onclick=(()=>{
        this.$router.routeBack();
      })
    },
    computed :{
        all:{
            get : function (v) {
              return  Object.assign({},this.$store.state.contacts.allCopyGroup);
            },
            set : function (newValue) {
              return newValue;
            }
        },
        search(){
            return this.$store.state.contacts.search;
        },
        allFilter(){ //经过处理之后的所有组  以及所有的会员 的数组
            let arr1 = [];
            let arr2 = [];
            let o = {};
              this.$store.state.contacts.allGroup.forEach((v,i)=>{
                arr2 = arr2.concat(v.group_id || v.group_name);
                if(v.patients){
                  v.patients.forEach((vv,ii)=>{
                    arr1.push(vv.account);
                    o[vv.account] = {name : (vv.name || vv.nick), group_names : vv.group_names};
                  })
                }
                arr1 = [...new Set(arr1)];
              })
           return {pat : arr1 , group : arr2, patObject : o};
        }
    },
    watch : {
      searchInput(){
        let re = new RegExp(this.searchInput);
        this.result = [];
        if(this.searchInput != ''){
          this.conShow = false;
          for (var i = 0; i < this.search.length; i++) {
            var temp = this.search[i].name;
            if(re.test(temp)){
              this.result.push(this.search[i]);
            }
          }
        }else{
          this.conShow = true;
        }
      },
      selectGroup : {
        handler : function (v) {
          //实时存储 选择组员数据
          window.sessionStorage['groupNewsGroup'] = JSON.stringify(v);
          if(v.length == this.allFilter.group.length && v.length != 0){
            this.bottomAll = 'all';
          }
        },
        deep : true
      },
      all:{
        handler : function (v,o) {
          if(Object.keys(o).length == 0){
            this.init();
          }
        },
        deep : true
      }
    },
    methods : {
      searchPat(){
        this.result = [];
      },
      //选择成员 去群发 返回 或者页面刷新的时候 保留选中状态
      init(){
        let s = window.sessionStorage['groupNews'];
        let g = window.sessionStorage['groupNewsGroup'];
        if(s && Object.keys(this.all).length != 0){
          s = JSON.parse(s);
          this.selected = s;
          for(let key in s){
            this.selectPat('',s[key],{target : {checked : true}},true);
            this.select.push(key);
            this.select = [...new Set(this.select)];
          }
        }
        if(g && Object.keys(this.all).length != 0){
          g = JSON.parse(g);
          g.forEach((v)=>{
            if(this.all[v].patients.length == 0 && this.all[v].toggle){
              this.all[v].toggle = false;
            }
          });
          this.selectGroup = g;
        }
      },
      //选择某一分组下的所有的患者
      selectAll(v,e){
          Indicator.open('正在选择...');
          let check = e.target.checked;
          let key = v.group_id || v.group_name;
          let len = v.patients.length;
          if(len == 0){
            v.toggle = !v.toggle;
            if(v.toggle){
              this.bottomAll = '';
              this.selectGroup = this.selectGroup.removeByValue(v.group_id || v.group_name);
            }else{
              this.selectGroup.push(v.group_id || v.group_name);
              this.selectGroup = [...new Set(this.selectGroup)];
            }
          }else{
// //     选中状态不依据 check 值  依据 num 数字 和 v.patients.length 大小
            if(v.num < v.patients.length){
              v.num = len;
              v.patients.forEach((vv,i)=>{
                this.select.push(vv.account);
                this.select = [...new Set(this.select)];
                this.selectPat(v,vv,{target :{ checked : true}});
              })
              this.selectGroup.push(v.group_id || v.group_name);
              this.selectGroup = [...new Set(this.selectGroup)];
            }
            else{
              v.num = 0;
              this.bottomAll = '';
              v.patients.forEach((vv)=>{
                this.select.forEach((vvv,iii)=>{
                  if(vv.account == vvv){ //找到相同元素 然后把另一组里面数据里面num进行减法
                    this.selectPat(v,vv,{target :{ checked : false}});
                    this.select[iii] = ' ';
                  }
                })
              })
              this.select = [...new Set([...this.select])]; //去除select中的相同元素
              this.select = this.select.removeByValue(' ');
              this.selectGroup = this.selectGroup.removeByValue(v.group_id || v.group_name);
            }
          }
        Indicator.close();
      },
      selectAllPat(e){
        Indicator.open('正在选择...');
        let check = e.target.checked;
        if(check){
          this.bottomAll = 'all';
          this.select = [...this.allFilter.pat];
          this.selected = Object.assign({},this.allFilter.patObject);
          this.selectGroup = Object.assign([],this.allFilter.group);
          for(let key in this.all){
            let len = this.all[key].patients.length
            this.all[key].num = len;
            if(len == 0){
              this.all[key].toggle = false;
            }
          }
        }else{
          this.bottomAll = '';
          this.select = [];
          this.selected = {};
          this.selectGroup = [];
          for(let key in this.all){
            this.all[key].num = 0;
            if(this.all[key].patients.length == 0){
              this.all[key].toggle = true;
            }
          }
        }
        Indicator.close();
      },
      selectPat(parent,child,e,is_one){
        Indicator.open('正在选择...');
//        根据是否选中的状态  去控制item.num个数
        let check =  e.target.checked;
        let arr;
        //选中和未选中 改变要提交的数据
        if(check){
          this.selected[child.account] =  {name : (child.name || child.nick) ,group_names : child.group_names};
        }else{
          delete this.selected[child.account];
          this.selectGroup = this.selectGroup.removeByValue(child.group_id || child.group_name);
        }
        if(is_one){
          arr =  Object.assign([],child.group_names);
        }else{
          arr = child.group_names.filter((v)=>{
            return parent.group_id  ? v!=parent.group_id :  v!= parent.group_name;
          })
        }
        arr.forEach((v)=>{
          if(check){
                let max =  this.all[v].patients.length;
                 this.all[v].num  = this.all[v].num ?  (++ this.all[v].num > max ? max : this.all[v].num) : this.all[v].num = 1;
                 if(this.all[v].num == this.all[v].patients.length){
                   this.selectGroup.push(this.all[v].group_id || this.all[v].group_name);
                   this.selectGroup = [...new Set(this.selectGroup)];
                 }
              }else{
                 this.bottomAll = '';
                 this.all[v].num ? this.all[v].num -- : this.all[v].num = 0;
              }
        })
        Indicator.close();
      },
      skip(){
          if(this.select.length == 0){
              Toast('请选择群发会员！');
          }else{
              if(this.isSend){
                  let info = JSON.parse(window.sessionStorage['sendScienceing']);
                  Indicator.open('发送中...');
                  let all = {};
                  for(let key in this.selected){
                    all[key] = this.selected[key].name ;
                  }
                  this.$api.pGroupNotify({
                    accounts : JSON.stringify(all),
                    type : 'popularArticle',
                    content : JSON.stringify({
                      id : info.id,
                      link : window.encodeURIComponent(info.link),
                      title : info.title
                    })
                  }).then(obj=>{
//                      发送群发内容  自动收藏
                    this.$api.collectArticles(info.id).then(obj=>{
                      this.$router.routeBack();
                    })
                  })
                }else{
                window.sessionStorage['groupNews'] = JSON.stringify(this.selected);
                window.sessionStorage['groupNewsGroup'] = JSON.stringify(this.selectGroup);
                this.$router.push({path : '/groupSendNews'});
              }
          }
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../assets/css/common.scss";
  .contacts {
    background: #f2f3f5
  }

  .contacts .con-fn {
    height: .94rem;
    background: #fff;
    border-bottom: 1px solid $gray;
  }

  .contacts .con-fn .search {
    padding: .2rem .2rem;
    -webkit-justify-content: space-between;
    display: flex;
    justify-content: space-between
  }

  .contacts .con-fn .search .con-sear {
    display: inline-block;
    width: 7.1rem;
    height: .5rem;
    padding-left: 0.6rem;
    line-height: .5rem;
    background: url(../../assets/media/img/home-contact-search2.png) #f2f2f2 no-repeat center;
    background-size: .28rem;
    font-size: .26rem;
    box-sizing: border-box;
    background-position: 2.8rem 0.11rem;
  }
  .contacts .con-fn .search .con-sear-active{
    background: #f2f2f2;
  }
  .contacts .con-fn .search .con-sear-addnew{
    background-image: none;
    background: #f2f2f2;
  }
  .contacts .con-fn .search .con-position{
    display: inline-block;
    line-height: .5rem;
    position: absolute;
    font-size: .26rem;
    color: #9FA0A0;
    left: 3.42rem;
    margin-top: 0.02rem;
  }


  .fn-deal {
    height: 1.2rem;
    width: 100%;
    background: #fff;
    margin-bottom: .2rem;
  }
  .fn-deal .fn-div{
    padding-left: 1rem;
    height: 1.2rem;
    .report a{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 0.2rem;
    }
  }
  .fn-deal .fn-div a{
    width: 6.5rem;
    height: 1.2rem;
    line-height: 1.2rem;
    font-size: .32rem;
    color: #000;
    font-family: SourceHanSansCN Normal;
    display: flex;
    align-items: center;
    position: relative;
  }
  .fn-deal .fn-div a i{
    position: absolute;
    top: .23rem;
    left: -0.74rem;
  }
  .contacts .fn-deal .circle {
    @include badge2();
    /*display: none*/
  }

  .con-content{
    height:calc(100vh - 0.94rem    - 0.8rem - 1.2rem);
    background: #edeff0;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-bottom: 0.2rem;
  }

  .sys-group .sys-act,.inquiryGroup,.familyGroup{
    padding-left: .8rem;
    vertical-align: top;
    height: 0.94rem;
    line-height: 0.94rem;
    position: relative;
    overflow: hidden;
    border-bottom:1px solid transparent;
    box-sizing: border-box;
  }

  .contacts .inquiryGroup, .contacts .familyGroup{
    padding-left: 0;
    margin-left: -1rem;
    .title{
      padding-left: .4rem;
    }
    .info{
      padding-left: 1.4rem;
      position: relative;
      img{
        left : .4rem;
      }
    }
  }
  .sys-group .sys-active,.inquiryGroup-active,.familyGroup-active{
    height: auto;
  }

  .title{
    height: 0.94rem;
    line-height: 0.94rem;
    position: relative;
    font-size: .32rem;
    display: flex;
    padding-right: 0.4rem;
    justify-content: space-between;
    /*border-bottom: 1px solid #dcdcdc;*/
    box-sizing: border-box;
    .num{
      font-size: 0.28rem;
      color: $fGray;
      .blue{
        color: $baseBlue;
      }
    }
  }
  .con-group{
    overflow: scroll;
    box-sizing: border-box;
  }
  .con-group .con-act{
    vertical-align: top;
    background: white;
    height: 0.94rem;
    overflow: hidden;
    padding-left: 0.8rem;
    overflow-x: hidden;
    border-bottom:1px solid transparent;
    box-sizing: border-box;
    vertical-align: top;
    position: relative;
    .group-name-icon{
      display: inline-block;
      width: 0.74rem;
      height: 0.74rem;
      font-size: 0.3rem;
      border-radius: 50%;
      background: $baseBlue;
      color: white;
      line-height: 0.74rem;
      text-align: center;
    }
  }
  .con-group .con-device{
    margin: 0.2rem 0;
  }
  .con-group .con-active{
    border-bottom: 1px solid  $gray;
    height: auto;
  }
  .con-act li:nth-last-child(1){
    border: none;
  }
  .contacts .info{
    border-bottom: 1px solid  $gray;
    height: 1.2rem;
    box-sizing: border-box;
    position: relative;
    padding: 0 0.3rem;
  }
  .contacts .info img{
    position: absolute;
    left: -0.44rem;
    top: .3rem;
    width: .74rem;
    height: .74rem;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
  }
  .contacts .info div{
    padding-top: .3rem;
    height: .75rem;
    margin-left: .23rem;
  }
  .contacts .info .name{
    display: block;
    height: .32rem;
    line-height: .32rem;
    font-size: .32rem;
    color: #000;
  }
  .contacts .info .other{
    height: 0.26rem;
    line-height: .26rem;
    width: 100%;
    margin-top: .17rem;
    font-size: .26rem;
    color: #9fa0a0;
    display: flex;
    justify-content: space-between;
  }
  .con-act .jump-add{
    display: block;
    height: 1.20rem;
    line-height: 1.20rem;
    font-size: 0.26rem;
    color: #2a8cff;
    position: absolute;
    top: 0;
    right: 0.20rem;
  }
  .search-result{
    background: #fff;
  }
  .search-result .info{
    border-bottom: 1px solid  $gray;
    height: 1.2rem;
    box-sizing: border-box;
    position: relative;
    margin-left: .97rem;
  }
  .search-result .info img{
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
  .search-result .info div{
    padding-top: .3rem;
    height: .75rem;
    width: 3rem;
    margin-left: .23rem;
  }
  .search-result .info .name{
    display: block;
    height: .32rem;
    line-height: .32rem;
    font-size: .32rem;
    color: #000;
    /*background: lightblue;*/
  }
  .search-result .info .other{
    display: block;
    line-height: .26rem;
    margin-top: .17rem;
    font-size: .26rem;
    color: #9fa0a0;
  }
  .result{
    width: 100%;
    background: #edeff0;
    text-align: center;
    font-size: .32rem;
    line-height: 1rem;
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
  .line{
    width: 100%;
    height: 1px;
    background: $gray;
    position: absolute;
    top:0.9rem;
    left: 0.22rem;
  }
  .con-device,.no_group, .con-act:nth-last-of-type(1) {
    .line{
      top: 1.2rem;
    }
    .line-active{
      top: 0.9rem;
    }
  }
  .line-active{
    width: 100%;
    background: $gray;
    position: absolute;
    top:0.9rem;
    left: 0;
    height: 0.18rem;
    background: url(../../assets/media/img/line.png) no-repeat;
  }
  .iequ{
    position: absolute;
    top: 0.435rem;
    right: 0.4rem;
  }
  .iequ1{
    position: absolute;
    top: -0.17rem;
    right: 0.2rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    i{
      margin-right: 0.1rem;
    }
  }
  .pay-icon{
    color: $baseBlue;
    font-size: 0.94rem;
  }
  .unpay-icon{
    color: $iconGray;
  }

  .selectPat,.selectPat-title{
    position: absolute;
    right: 0;
    line-height: 0;
    top: 0;
    height: 100%;
    padding: 0 0.4rem;
    display: flex;
    align-items: center;
    /*top: 50%;*/
    input{
      display: none;
      position: absolute;
      top:0;
      left:0;
    }
    i{
      width: 0.3rem;
      height: 0.3rem;
      background: url(../../assets/media/img/order-address_unSelected_icon.png) no-repeat right  center;
      background-size: contain;
    }
  }
  .selectPat,.bottom{
    input:checked+i{
    background: url(../../assets/media/img/order-address_selected_icon.png) no-repeat right  center;
    background-size: contain;
    }
  }
  #selectPat-title{
    .part-selected{
      background: url(../../assets/media/img/order-address_selected_part_icon.png) no-repeat right  center;
      background-size: contain;
    }
    .all-selected{
      background: url(../../assets/media/img/order-address_selected_icon.png) no-repeat right  center;
      background-size: contain;
    }
  }
  .selectPat-title{
    top: 0;
    left: 0;
    height: 0.94rem;
    padding-left: 0.3rem;
  }
  .bottom{
    height: 1rem;
    background: white;
    position: relative;
    font-size: 0.32rem;
    padding: 0 0.4rem 0 0;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    span{
      display: flex;
      height: 100%;
      align-items: center;
      position: relative;
    }
    label{
      width: 40%;
    }
    .selectPat-title i{
      margin-right: 0.2rem;
    }
    button{
      background: $baseBlue;
      padding:0 0.3rem;
      color: white;
      height: 0.7rem;
      line-height: 0.7rem;
      border-radius: 0.06rem;
    }
  }
</style>
