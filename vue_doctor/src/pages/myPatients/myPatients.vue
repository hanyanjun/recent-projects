<template>
  <div class="container">
    <div class="con-fn" v-show="pat.length != 0">
      <div class="search" >
        <input type="text" name="" value="" autocomplete="off" :class="['con-sear', {'con-sear-active' : !conShow}]" v-model="searchInput">
        <span class="con-position" v-show="conShow">搜索</span>
      </div>
    </div>
    <!--<div class="fn-div" v-if="conShow">-->
      <!--<a href="javascript:;" class="report">-->
        <!--<i class="icon-report" style="font-size: 0.74rem;">-->
          <!--<span class="path1"></span><span class="path2"></span><span class="path3"></span>-->
        <!--</i>-->
        <!--<a href="javascript:;"  @click.stop="skipReport" style="margin-left: 0.23rem;">会员报到 <b class="circle" v-show="reportCount != 0">{{reportCount}}</b></a>-->
      <!--</a>-->
    <!--</div>-->
    <!--<div class="fn-div" v-if="conShow">-->
      <!--<a href="javascript:;" class="report">-->
        <!--<i class="icon-group-news" style="font-size: 0.74rem;">-->
          <!--<span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span>-->
        <!--</i>-->
        <!--<a href="javascript:;"  @click.stop="skipNews" style="margin-left: 0.23rem;">群发</a>-->
      <!--</a>-->
    <!--</div>-->
    <div class="slider"  v-show="conShow" >
        <template v-for="(item,index) in pat">
          <span :class="{'active' :　index == currentIndex}"  class="slider-w">
            <div class="icon" v-show="index == currentIndex && tip">
              <i class="icon-w-bg" ></i>
              <i class="font">{{index}}</i>
            </div>
            {{index}}
          </span>
        </template>
    </div>
    <!--<div class="content">-->
       <div class="patients" v-if="conShow && pat.length != 0" >
         <section v-for="(item,index) in pat" :data-id="index == '#' ?　'AA' : index" class="patientEle" >
           <h6 :class="{'active' :　index == currentIndex}">{{index}}</h6>
           <div v-for="(item1,index) in pat[index]" @click.stop="other(item1)">
             <img v-img1="item1.face" alt="">
             <span>{{item1.name}}</span>
           </div>
         </section>
       </div>
      <div v-else-if="!conShow" class="result">
        <section v-for="(item,index) in result" @click.stop="skip(item)">
          <div @click.stop="other(item)">
            <img v-img1="item.face" alt="">
            <span>{{item.name}}</span>
          </div>
        </section>
        <div class="tip" v-show="result.length == 0">查询不到符合的结果</div>
      </div>
    <empty :config="{show : pat.length == 0 , text : '您还没有团队成员哦！'}"></empty>
    <!--</div>-->
  </div>
</template>

<script>
  import empty from '../../components/empty'
export default{
    name : 'myPatients',
    data(){return{
       conShow : true,
       searchInput : '',
       pat : [],
       currentIndex : '',
       arr : '',
       keys : '',
       tip : false,
       click : false,
       search : '',
       result : [],
       id : '',
       patId : ''
    }},
    components:{empty},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '选择@的成员',fShow : false,hShow : true , theme : 'green'});
      this.patId = this.$route.params.chat_hx_account;
      this.id = this.$route.params.chat_team_id;
      this.$api.teamDocChart(this.id).then(obj=>{
          this.pat = obj.patients;
          let k;
          if(obj.patients.hasOwnProperty('#')){
              k = obj.patients['#'];
              delete obj.patients['#'];
              obj.patients['#'] = k;
          }
          this.keys = Object.keys(obj.patients);
          let pats = Object.values(obj.patients);
          this.search = [];
          pats.forEach((v,i)=>{
             this.search = this.search.concat(pats[i]);
          });
          this.currentIndex = Object.keys(obj.patients)[0];
          setTimeout(()=>{
            this.arr = document.querySelectorAll('.patientEle');
          },300)
        console.log(this.pat);
      })
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
      }
    },
  mounted(){
    this.$store.commit('SET_FOOTER_TAB','2');
    var slider = document.querySelector('.slider');
    let scrollListener  = ()=> {
        if(!this.click){
          this.arr.forEach((v)=>{
            if(document.querySelector('.patients').scrollTop + this.arr[0].offsetTop + 5 > v.offsetTop){
              this.currentIndex = v.getAttribute('id')
            }
          })
        }
    }
    document.querySelector('.patients').addEventListener('scroll',scrollListener,false);
    document.querySelector('.patients').addEventListener('touchstart',()=>{this.click = false},false);
//
    let sY , mY;
    let h;
    let l;
    let lY;
    let count;
    let tM = (me)=>{
      mY = me.targetTouches[0].clientY;
      if(mY - lY >=  h){
        count = this.keys.findIndex((v)=>{return this.currentIndex == v});
        count = count < 0 ? l - 1 : count;
        if(count > l - 2){
          this.currentIndex = this.keys[l - 1];
        }else{
          this.currentIndex = this.keys[count + 1];
          lY = mY;
        }
        document.querySelector('.patients').scrollTop = document.querySelector(`[data-id=${this.currentIndex == '#' ? 'AA' : this.currentIndex}]`).offsetTop - document.querySelector('.patients').offsetTop;
        return;
      }
      else if(lY - mY >= h){
        count = this.keys.findIndex((v)=>{return this.currentIndex == v});
        count = count < 0 ? l - 1 : count;
        if(count - 1 < 0){
          this.currentIndex = this.keys[0];
        }else{
          this.currentIndex = this.keys[count-1];
          lY = mY;
        }
        document.querySelector('.patients').scrollTop = document.querySelector(`[data-id=${this.currentIndex == '#' ? 'AA' : this.currentIndex}]`).offsetTop - document.querySelector('.patients').offsetTop;
        return;
      }
    }
    slider.addEventListener('touchstart',(se)=>{
      this.tip = true;
      this.click = true;
      se.preventDefault();
      let sT = se.target;
      l = this.keys.length
      if(/slider-w/.test(sT.className)){
        this.currentIndex = sT.innerText;
        document.querySelector('.patients').scrollTop = document.querySelector(`[data-id=${sT.innerText == '#' ?  'AA' : sT.innerText}]`).offsetTop - document.querySelector('.patients').offsetTop;
      }
      h = document.querySelectorAll('.slider-w')[1].offsetTop - document.querySelectorAll('.slider-w')[0].offsetTop;
      sY = se.targetTouches[0].clientY;
      lY = sY;
      count = 0;
    },false);
    slider.addEventListener('touchmove',tM,false);
    slider.addEventListener('touchend',(ee)=>{
      this.tip = false;
      document.removeEventListener('touchmove',tM);
    })
  },
   methods:{
     other(v){
       console.log(v);
         if(this.patId == 'empty'){
           this.$api.docTeamAtDoctor({id : this.id, docAcc : v.account}).then(obj=>{
             this.$router.routeBack();
           })
         }else{
           this.$api.patTeamAtDoctor({id : this.id, docAcc : v.account , acc : this.patId}).then(obj=>{
             this.$router.routeBack();
           })
         }
     },
     skipNews(){
        this.$router.push({path : `/groupNews`});
      },
     skipReport(){
       this.$router.push({path : `/patientReport`});
     }

   },
   computed:{
     reportCount(){
       return this.$store.getters.msgCount.reportCount > 99 ? '99+' : this.$store.getters.msgCount.reportCount;
     },
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
 .container{
   overflow: hidden;
 }
  .container .con-fn {
    height: .94rem;
    background: #fff;
    border-bottom: 1px solid $gray;
  }
  .container .con-fn .search {
    padding: .2rem .2rem;
    -webkit-justify-content: space-between;
    display: flex;
    justify-content: space-between
  }
  .container .con-fn .search .con-sear {
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
  .container .con-fn .search .con-sear-active{
    background: #f2f2f2;
  }
  .container .con-fn .search .con-sear-addnew{
    background-image: none;
    background: #f2f2f2;
  }
  .container .con-fn .search .con-position{
    display: inline-block;
    line-height: .5rem;
    position: absolute;
    font-size: .26rem;
    color: #9FA0A0;
    left: 3.42rem;
    margin-top: 0.02rem;
  }
 .container{
   position: relative;
     .patients,.result{
       height: calc(100% - 1rem);
       background: white;
       overflow-y: scroll;
       section{
         border-bottom: 1px solid $gray;
         /*height: 5rem;*/
         h6{
           height: 0.45rem;
           line-height: 0.45rem;
           padding-left: 0.2rem;
           font-size: 0.30rem;
           color: $gray_c;
           background: $gray_e;
         }
         .active{
           color: $baseBlue;
           font-weight: bolder;
           font-size: 0.35rem;
         }
         div{
           height: 1rem;
           margin-left: 0.2rem;
           border-bottom: 1px solid $gray;
           display: flex;
           justify-content: flex-start;
           align-items: center;
           img{
             display: inline-block;
             width: 0.7rem;
             height: 0.7rem;
             border-radius: 50%;
           }
           span{
             font-size: 0.32rem;
             margin-left: 0.2rem;
           }
         }
         div:nth-last-of-type(1){
           border-bottom: none;
         }
       }
       .tip{
         font-size: 0.32rem;
         text-align: center;
         line-height: 1rem;
       }
     }
   .patients{
     /*margin-top: 0.2rem;*/
     height: calc(100% - 1rem );
   }
   /*}*/
   .slider{
     position: absolute;
     z-index: 12;
     font-size: 0.2rem;
     right: 0;
     padding-left: 1rem;
     padding-right: 0.15rem;
     /*padding-right: 0.6rem;*/
     /*right: 0.6rem;*/
     top: 50%;
     transform: translateY(-50%);
     .icon{
       position: absolute;
       right: 1rem;
       width: 0.8rem;
       height: 0.8rem;
       top: -0.3rem;
       .icon-w-bg{
         font-size: .8rem;
       }
       .font{
         color: white;
         font-size: 0.4rem;
         position: absolute;
         top: 0.25rem;
         left: 0.24rem;
       }
     }
     span{
       display: block;
       width: 0.3rem;
       height: 0.3rem;
       border-radius: 50%;
       text-align: center;
       line-height: 0.3rem;
       margin: 0.1rem;
       font-weight: bolder;
       position: relative;
     }
     .active{
       background: $baseBlue;
       color: white;
     }
   }
   .fn-div{
     padding-left: 1rem;
     background: white;
     border-bottom: 1px solid $gray;
     height: 1.2rem;
     .report a{
       display: flex;
       justify-content: space-between;
       align-items: center;
       padding-right: 0.2rem;
     }
   }
   .fn-div a{
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
   .fn-div:nth-last-of-type(1){
     border-bottom: none;
   }
   .fn-div a i{
     position: absolute;
     top: .23rem;
     left: -0.74rem;
   }
   .circle {
     @include badge2();
   }
 }

</style>
