<template>
<div class="container">
  <span class="icon-paraphrase icon1" @click.stop="introduce"></span>
  <div class="content">
    <h6 class="title">
      门诊时间
      <span class="time">
        <i class="icon-return-boldleft icon2" @click.stop="selectLeft"></i>
        <span>{{this.tLeft}}</span>
           至
        <span>{{this.tRight}}</span>
        <i class="icon-return-boldleft icon3" @click.stop="selectRight"></i>
      </span>
    </h6>
    <div class="table">
      <table ref="table"><tr>
        <th></th>
        <th>上午</th>
        <th>下午</th>
        <th>晚上</th>
      </tr>
        <tr>
          <td class="day"><i>停诊</i>周一</td>
          <td class="gray" data-type="上午" @click.stop="skip"></td>
          <td class="gray" data-type="下午" @click.stop="skip"></td>
          <td class="gray" data-type="晚上" @click.stop="skip"></td>
        </tr>
        <tr>
          <td class="day"><i>停诊</i>周二</td>
          <td class="gray" data-type="上午" @click.stop="skip"></td>
          <td class="gray" data-type="下午" @click.stop="skip"></td>
          <td class="gray" data-type="晚上" @click.stop="skip"></td>
        </tr>
        <tr>
          <td class="day"><i>停诊</i>周三</td>
          <td class="gray" data-type="上午" @click.stop="skip"></td>
          <td class="gray" data-type="下午" @click.stop="skip"></td>
          <td class="gray" data-type="晚上" @click.stop="skip"></td>
        </tr>
        <tr>
          <td class="day"><i>停诊</i>周四</td>
          <td class="gray" data-type="上午" @click.stop="skip"></td>
          <td class="gray" data-type="下午" @click.stop="skip"></td>
          <td class="gray" data-type="晚上" @click.stop="skip"></td>
        </tr>
        <tr>
          <td class="day"><i>停诊</i>周五</td>
          <td class="gray" data-type="上午" @click.stop="skip"></td>
          <td class="gray" data-type="下午" @click.stop="skip"></td>
          <td class="gray" data-type="晚上" @click.stop="skip"></td>
        </tr>
        <tr>
          <td class="day"><i>停诊</i>周六</td>
          <td class="gray" data-type="上午" @click.stop="skip"></td>
          <td class="gray" data-type="下午" @click.stop="skip"></td>
          <td class="gray" data-type="晚上" @click.stop="skip"></td>
        </tr>
        <tr>
          <td class="day"><i>停诊</i>周日</td>
          <td class="gray" data-type="上午" @click.stop="skip"></td>
          <td class="gray" data-type="下午" @click.stop="skip"></td>
          <td class="gray" data-type="晚上" @click.stop="skip"></td>
        </tr>
      </table>
    </div>
  </div>
  <button class="submit"  @click.stop="submit">
    确认发布
  </button>
</div>
</template>

<script>
  import {Toast,MessageBox2} from "../../components/hw-components"
export default{
    data(){return{
        tLeft : '',
        tRight : '',
        sT :　'',
        day : ''
    }},
    created(){
      this.$store.commit('UPDATE_NAV',{title : '发布门诊时间', fShow : false, hShow : true});
      let t = window.sessionStorage['appoint_date_start'];
      this.sT = this.currentT();
      this.day = (new Date()).getDay();
      this.sT = this.dLeft(this.sT,1,0);
      this.tLeft = t ? t : this.dLeft(this.sT,1,this.day - 1);
      this.tRight = this.dRight(this.tLeft,1);
    },
    mounted(){
      if(this.tLeft <= this.sT){
        this.dom();
        this.updateSet();
      }else{
        this.updateSet();
          console.log('不更新可选择周期.');
      }
      document.querySelector('.nav_back').onclick =()=>{
        this.$router.routeBack({filter : JSON.stringify({status : 'open' , page : 1})});
      }
    },
    methods:{
      introduce(){
        MessageBox2.confirm('说明：<br>1.此门诊时间为临时或短期；<br>2.如果设置当天已有门诊时间，将会修改原先设置内容并保存；<br>3.图中显示门诊信息为工作室服务“门诊预约”中设置的门诊时间；<br>4.如需设置长期或重复门诊时间，请前往“工作室服务设置”→“<a style="color:#2a8cff;" href="#/appointmentSet">门诊预约</a>”中设置；')
      },
      submit(){
          this.$router.routeBack({filter : JSON.stringify({status : 'open' , page : 1})});
      },
      updateSet(){
        let d = document.querySelectorAll('tr');
        [...d].forEach((v,i)=>{
            [...v.children].forEach((vv,ii)=>{
              if(ii != 0 && i!= 0){
                vv.innerText = '';
                if(this.tLeft > this.sT || i > this.day ){
                  vv.className = 'blue';
                }else{
                  vv.className = 'gray';
                }
              }
              if(ii == 0 && vv.children[0]){
                  vv.children[0].style.width = '0';
              }
            })
        })
        this.$api.appointTemporaries({date_start: this.tLeft , date_end : this.tRight})
          .then(obj=>{
            this.set = obj.temporaries;
            window.sessionStorage['appoint_date_start'] = this.tLeft;
            (obj.temporaries).forEach((v,i,a)=>{
              if(v.appoint_day > this.day || this.sT < this.tLeft){
                    if(v.is_closed == 1){
                      document.querySelectorAll('tr')[v.appoint_day].children[0].children[0].style.width = '0.38rem';
                      [...document.querySelectorAll('tr')[v.appoint_day].children].forEach((v,i)=>{
                          if(i != 0){
                            v.className = 'gray';
                          }
                      })
                    }else{
                        if(v.appoint_time){
                          let dom = document.querySelectorAll('tr')[v.appoint_day].children[v.appoint_time];
                          dom.setAttribute('data-id',v.id);
                          dom.innerText = '出诊';
                          dom.className = 'gray gray-active';
                        }
                    }
//                }
              }
            })
          })
      },
      skip(e){
        let target = e.target;
//         将id time等存起来
        let day = target.parentNode.firstChild.innerText.replace(/停诊/,'');
        let w = target.parentNode.firstChild.children[0].style.width;
        if(w && w != '0px'){
          Toast('该时间正在停诊中，请先取消停诊！');
        }else{
          if(this.$means.dayTonum(day) <= this.day && this.sT  >= this.tLeft ){
            Toast('当天及之前不可发布门诊！');
          }else{
            window.sessionStorage['id'] = target.getAttribute('data-id');
            window.sessionStorage['week_day'] = day;
            window.sessionStorage['appoint_date_start'] = this.tLeft;
            window.sessionStorage['appoint_date'] = this.dRight(this.tLeft,1,this.$means.dayTonum(day) - 1);
            window.sessionStorage['week_time'] = target.getAttribute('data-type');
            this.$router.push({path : `/appointDetailSet/null/null?status=1`});
          }
        }
      },
      selectLeft(){
          if(this.tLeft <= this.sT){
                Toast('无法选择今天之前的日期！');
          }else{
            this.tLeft = this.dLeft(this.tLeft,1,7);
          }
          this.tRight = this.dRight(this.tLeft,1,6);
          if(this.tLeft <=  this.sT){
              this.day = (new Date()).getDay();
          }else{
              this.day = '';
          }
          this.dom();
          this.updateSet();
      },
      selectRight(){
        this.tLeft =  this.dRight(this.tRight,1,1);
        this.tRight = this.dRight(this.tRight,1,7);
        if(this.tLeft <=  this.sT){
          this.day = (new Date()).getDay();
        }else{
          this.day = '';
        }
        this.dom();
        this.updateSet();
      },
      dLeft(v,c,v1){
        let arr = v.split('-');
        v1 = v1!= undefined ?  parseInt(v1) : 6;
        let [a0,a1,a2] = [...arr];
        a2 = parseInt(arr[2]) - v1;
        if(a2 <= 0){
          a1 = parseInt(arr[1]) - 1;
          if(a1 == 0) {
            a0 = parseInt(arr[0]) - 1;
            a1 = 12;
          }
          a2 += this.isY(a0,a1)
        }
        a1 += '';a0 += '',a2+='';
        let a = `${a0}-${a1.length < 2 ? '0'+a1 : a1}-${a2.length < 2 ? '0'+a2 : a2}`;
        c--;
        if(c == 0){
          return a;
        }else{
          return this.dLeft(a,c);
        }
      },
      dRight(v,c,v1){
        let arr = v.split('-');
        v1 = v1 != undefined ?  parseInt(v1) : 6;
        let [a0,a1,a2] = [...arr];
          a2 = parseInt(arr[2]) + v1;
          if(a2 > this.isY(a0,a1)){
            a2 -= this.isY(a0,a1);
            a1 = parseInt(arr[1]) + 1;
            if(a1 > 12) {
              a0 = parseInt(arr[0]) + 1;
              a1 = 1;
            }
          }
        a1 += '';a0 += '',a2+='';
        let a = `${a0}-${a1.length < 2 ? '0'+a1 : a1}-${a2.length < 2 ? '0'+a2 : a2}`;
        c--;
        if(c == 0){
            return a;
        }else{
            return this.dRight(a,c);
        }
      },
      isY(year,v){
        year = parseInt(year);
        v = parseInt(v);
        if(v == 2){
          if(year%400 == 0 || (year%100 != 0 && year%1 == 0)){
              return 29;
          }else{
              return 28;
          }
        }else if(v == 1 || v == 3 || v == 5 || v == 7 || v == 8 || v == 10 || v == 12){
            return 31;
        }else{
            return 30;
        }
      },
      dom(){
        let arr = [...document.querySelectorAll('tr')];
        arr.forEach((v,i)=>{
              v.className = '';
        })
        for(let i = 1;i < this.day + 1;i++){
          let dom = document.querySelectorAll('tr')[i];
          dom.className = 'hide';
        }
      },
      currentT(){
          return (new Date()).toLocaleString().substring(0,10).replace(/\//g,'-');
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/css/common";
.icon1{
  position: absolute;
  font-size: 0.36rem;
  top: 0rem;
  right: 0rem;
  font-weight: normal;
  text-align: left;
  display: inline-block;
  padding-right: 0.3rem;
  height: 0.80rem;
  line-height: 0.8rem;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  &:before{
    color: white;
  }
}
.container{
  overflow: hidden;
  .content{
    height: calc(100% - 1.4rem);
    overflow: hidden;
    .title{
      height: 1.2rem;
      margin-top: 0.2rem;
      background: white;
      overflow: hidden;
      padding: 0 0.2rem 0 0.27rem;
      font-size: 0.32rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .time{
        span{
          font-size: 0.28rem;
          display: inline-block;
          height: 0.46rem;
          line-height: 0.46rem;
        }
        display: inline-block;
        height: 0.46rem;
        line-height: 0.46rem;
        border: 1px solid $baseBlue;
        border-radius: 0.06rem;
        position: relative;
        padding: 0 0.8rem;

        .icon-return-boldleft{
          color: $baseBlue;
          transform: translateY(-50%);
          font-size: 0.28rem;
          position: absolute;
          top: 50%;
        }
        .icon2{
          padding: 0.1rem 0.26rem;
          left: 0;
        }
        .icon3{
          padding: 0.1rem 0.26rem;
          transform: translateY(-50%) rotateY(180deg);
          right:0;
        }
      }
    }
    .table{
      height: calc(100% - 1.2rem);
      overflow-y: scroll;
    }
  }
}
.submit{
  display: block;
  margin: 0.2rem auto;
  width: 6.9rem;
  height: 1rem;
  line-height: 1rem;
  background: #0693fc;
  color: white;
  font-size: 0.4rem;
  text-align: center;
  border-radius: 0.06rem;
}
table {
  display: block;
  background: white;
  line-height: 0;
  border-top: 1px solid $iconGray;
  border-bottom: 1px solid $iconGray;
}
table caption{
  background: white;
  display: inline-block;
  width: 100%;
  height: 0.7rem;
  line-height: 0.7rem;
  text-align: left;
  padding-left: 0.3rem;
  box-sizing: border-box;
  font-size: 0.32rem;
  border-bottom: 1px solid $gray;
}
table tr:nth-last-of-type(1) > td{
  border-bottom: none;
}
tbody,tr{
  display: block;
}
tr{
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
}
th,td{
  display: inline-block;
  width: 30%;
  height: 0.80rem;
  text-align: center;
  line-height: 0.80rem;
  font-size: 0.32rem;
  font-weight: normal;
  border-right: 1px solid rgb(210, 210, 210);
  border-bottom: 1px solid rgb(210, 210, 210);
}
table .day{
  font-size: 0.32rem;
  position: relative;
  i{
    position: absolute;
    background: $orange;
    /*display: none;*/
    color: white;
    display: flex;
    align-items: center;
    line-height: 0.26rem;
    width: 0;
    height: 0.7rem;
    justify-content: center;
    top:0;
    left: 0.13rem;
    font-size: 0.24rem;
    border-bottom-left-radius: 0.19rem;
    border-bottom-right-radius: 0.19rem;

  }
}
table .gray{
  background: url(../../assets/media/img/order-set_gray_right_icon.png) no-repeat center;
  background-size: 0.52rem 0.37rem;
}
table .blue{
  background: url(../../assets/media/img/complete.png) no-repeat center;
  background-size: 0.52rem 0.37rem;
}
table .gray-active{
  background: #2a8cff;
  color: white;
}
.hide{
  color: $iconGray;
}
</style>
