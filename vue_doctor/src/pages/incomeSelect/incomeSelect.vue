<template>
	<div class="container">
		<div class="status">
			<span>状态筛选</span>
			<div>
				<!-- <span><input type="radio" name="status" id="status1" value="" v-model="select"><label style="width:.95rem;" :class="{'selected2' : select == ''}" for="status1">全部</label></span> -->
        <span><input @click.stop="cancel" type="radio" name="statu" id="status1" value="all" v-model="status"><label for="status1" :class="{'selected' : status == 'all'}" style="width:.95rem;">全部</label>
				</span><span><input @click.stop="cancel" type="radio" name="statu" id="status2" value="2" v-model="status"><label for="status2" :class="{'selected' : status == '2'}">进行中</label>
        </span><span><input @click.stop="cancel" type="radio" name="statu" id="status3" value="4" v-model="status"><label for="status3" :class="{'selected' : status == '4'}">已完成</label>
        </span><span><input @click.stop="cancel" type="radio" name="statu" id="status4" value="3" v-model="status"><label for="status4" :class="{'selected' : status == '3'}"  style="margin-right: 0">已退款</label></span>
			</div>
		</div>

    <div class="status">
      <span>类型筛选</span>
      <div>
        <span><input @click.stop="cancel" type="radio" name="types" id="types0" value="all" v-model="order_type"><label for="types0" :class="{'selected' : order_type == 'all'}" style="width:.95rem;">全部</label></span>
        <span><input @click.stop="cancel" type="radio" name="types" id="types1" value="2" v-model="order_type"><label for="types1" :class="{'selected' : order_type == '2'}">
          <i class="recommend" >次</i><span>图文咨询</span></label></span>
        <span><input @click.stop="cancel" type="radio" name="types" id="types2" value="3" v-model="order_type"><label for="types2" :class="{'selected' : order_type == '3'}">
          <i class="recommend" >期</i><span>图文咨询</span></label></span>
        <span><input @click.stop="cancel" type="radio" name="types" id="types3" value="9" v-model="order_type"><label for="types3" :class=" [ 'phone_label' ,{  'selected' : order_type == '9'}]">
         <span>电话咨询</span></label></span>
         <!--<span><input type="radio" name="types" id="types3" value="4" v-model="types"><label for="types4" :class="{'selected' : select == '4'}">电话咨询</label></span>-->
      </div>
    </div>

    <div class="status time">
      <span>时间筛选</span>
      <div>
        <span><input  @click.stop="cancel" type="radio" name="times" id="time1" value="all" v-model="ym"><label for="time1" style="width:.95rem;">不限</label></span>
        <span><input class="aaa" @click.stop="chooseTime" type="radio" name="times" id="time2" :value="day" v-model="ym"><label class="lab" for="time2">{{day}}&nbsp;&nbsp;<i class="icon-arrow-top"></i></label></span>
        <!-- <span @click.stop="chooseTime">{{day}}</span> -->
      </div>
    </div>

     <hw-button :config="{ class : 'bottom' , text : '确认'}" @event="submit"></hw-button>
	</div>
</template>

<script>
import {MessageBox2} from '../../components/hw-components'
export default{
    name : 'incomeSelect',
    data(){return{
    	status : '',
      order_type : '',
      ym : '',
      day: ''
    }},
    created (){
      this.$store.commit('UPDATE_NAV',{title : '筛选',fn : '', fShow : false, hShow : true});
      let param = this.$route.query.info;
      var nowday = new Date();
      let month = nowday.getMonth()+1;
      if(month<10){
        month = '0'+ month;
      }
      this.day = nowday.getFullYear()+'年'+month+'月';
      var now = new Date();
      this.dtPicker = new mui.DtPicker({
        "type" : "month",
        beginYear:(now.getFullYear()-100),//设置开始日期
        endDate: new Date(now.getFullYear(),now.getMonth()),//设置结束日期
      })
      if(param){

        param = JSON.parse(param);
        console.log(param);
        console.log(JSON.parse(param).status);
        this.status = JSON.parse(param).status;
        this.order_type = JSON.parse(param).order_type;

        if(JSON.parse(param).ym !='all' && JSON.parse(param).ym != ''){
          this.ym = JSON.parse(param).ym;
          this.day = JSON.parse(param).ym;
          let time = this.ym.split('年')[0] + this.ym.split('年')[0].split('月')[0];
          this.dtPicker.setSelectedValue(time);
        }else{
          this.ym = JSON.parse(param).ym;
        }
      }

    },
    mounted(){
    	document.querySelector('.nav_submit').onclick = (e)=> {
         	// this.$router.push({path : `/${this.status}/${this.order_type}/${this.ym}/incomeDetail`});
        }

    },
    watch : {
    	select : function(){
    		console.log(this.select)
    	}
    },
    methods : {
    	chooseTime : function(){
          this.$picker4.show(e=>{
            this.day = e.text.split('-')[0]+'年'+e.text.split('-')[1]+'月';
            this.ym = e.text.split('-')[0]+'年'+e.text.split('-')[1]+'月';
          })
      },
      cancel : function(){
        this.$picker4.hide();
      },
      submit: function(){
          this.$router.push({path : '/incomeDetail' ,query :{ info : JSON.stringify({status : this.status , order_type : this.order_type, ym : this.ym})}});
      }
    }



}
</script>

<style lang="scss" scoped>
  	@import "../../assets/css/common";
  	.container{
  		padding: 0 0.3rem;
  		background: #fff;
  		font-size: .28rem;
  	}

  	.status{
  		margin-top: .4rem;
  		// background: lightblue;
  		span{
  			font-size: .28rem;
  			color: #9fa0a0;

  		}
  		div{
  			// height: .58rem;
  			/*background: lightyellow;*/
  			margin-top: .3rem;
        display: flex;
        justify-content: space-between;
  		}


  	}
    .status:nth-of-type(2){
      div{
        label{
          width: 1.8rem;
          height: 0.56rem;
          text-align: center;
          padding: 0;
          span{
            color: $baseBlue;
          }
        }
        .phone_label{
          width: 1.6rem;
        }
      }
    }
    .time{
        div{
          justify-content: flex-start;
          label{
            margin-right: 0.32rem;
          }
        }
     }
  	label{
  		display: inline-block;
      text-align: center;
      padding: 0 0.2rem;
      line-height: .56rem;
  		// padding: .13rem .18rem;
  		border: 1px solid $baseBlue;
  		border-radius: .05rem;
  		color: $baseBlue;
      position: relative;
  		margin-right: .32rem;
      font-size: .32rem;
      i{
        font-size: .32rem;
      }
      span{
        position: absolute;
        left: 0.4rem;
        top:0;
      }
  	}
    .phone_label span{
      left: 0.24rem;
    }
    label:nth-last-of-type(1){
      margin-right: 0;
    }
    .lab{
      width: 2.45rem;
    }
	.selected{
		  display: inline-block;
  		width: 1.56rem;
      text-align: center;
      line-height: .56rem;
  		border: 1px solid $baseBlue;
  		border-radius: .05rem;
  		color: #fff;
  		background:$baseBlue;
  		margin-right: .32rem;
      i{
        font-size: .32rem;
      }
	}
  input[name="times"]:checked+label{
      display: inline-block;
      width: 1.56rem;
      text-align: center;
      line-height: .56rem;
      border: 1px solid $baseBlue;
      border-radius: .05rem;
      color: #fff;
      background:$baseBlue;
      margin-right: .32rem;
      i::before{
         color: #fff;
         // font-size: .32rem;
      }
  }
  input[name="times"]:checked+ .lab{
      display: inline-block;
      width: 2.45rem;
      height: .56rem;
      text-align: center;
      line-height: .56rem;
      border: 1px solid $baseBlue;
      border-radius: .05rem;
      color: #fff;
      background:$baseBlue;
      margin-right: .32rem;
      i::before{
         color: #fff;
      }
  }
    input[type=radio]:checked + label > i {
      color: $baseBlue;
      font-size: 0.22rem;
      background: linear-gradient(to bottom right, white 50%, $baseBlue 50%);
    }
    input[type=radio]:checked + label > span {
      color: white;
    }
    .time input[type=radio]:checked + label > i {
      font-size: 0.32rem;
      background: $baseBlue;
    }
    .recommend {
      position: absolute;
      left: 0;
      top: 0;
      display: inline-block;
      width: 0.6rem;
      height: 0.4rem;
      font-size: 0.22rem;
      line-height: 0.3rem;
      padding-left: 0.04rem;
      box-sizing: border-box;
      text-align: left;
      color: white;
      background: linear-gradient(to bottom right, $baseBlue 50%, white 50%);
    }
</style>
