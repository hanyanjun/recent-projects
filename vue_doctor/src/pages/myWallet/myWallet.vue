<template>
	<div class="container">
		<div class="pagenav">
			<router-link to="my" class="icon-return-boldleft"></router-link>
			<span :class="{'icon-money-show': state == '1','icon-money-none': '0'}" style="font-size: .45rem;" @click.stop="isVisible"></span>
		</div>
		<div class="pagehead">
			<div class="title">可提现余额(元)</div>

			<div class="price"><span >{{ state == '1' ? (money.transfer_amount*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g,'$1,') : '******'}}</span></div>
	    <div class="unprice">
				<div>待结算金额：{{state == '1' ? (money.unsettled_amount*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g,'$1,') : '******'}}<span class="icon-question" @click.stop = "intorduce"></span></div>
				<div><a href="javascript:;" @click.stop="jump" class="userInfo">收入记录</a></div>
			</div>
		</div>
    <div class="pagebg">
      <div class="functions">
        <nav>
           <a href="javascript:;" @click.stop="moneyAccount"><i class="icon-wallet-order"></i>对账单</a>
           <a href="javascript:;" @click.stop="transfer"><i class="icon-wallet-transfer"></i>提现</a>
           <a href="javascript:;" @click.stop="account"><i class="icon-wallet-account"></i>收款账户</a>
         </nav>
         <!-- <div style="width:1rem;height:1rem;background:yellow;"></div> -->
         <router-link to="/transferByMonth" class="b-1px-b trans"><span class="text">收入按月转出</span> <i class="icon-return-boldleft"></i><span class="status" v-if="cards.transfer_authorized=='3'">已开启</span></router-link>
      </div>

    </div>
		<!--<div class="operate">-->
			<!--<div  @click.stop="moneyAccount">对账单<span class="icon-return-right"></span></div>-->
			<!--<div  @click.stop="transfer">提现<span class="icon-return-right"></span></div>-->
			<!--<div @click.stop="account">收款账户<span class="icon-return-right"></span></div>-->
		<!--</div>-->
    <h6 class="space"></h6>
		<div class="myService">我的服务</div>
		<div class="content">
			<router-link to="/freeSetting">
				<i class="icon icon-set-free"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
				<div>
          <span class="name">免费随访</span>
          <span :class="{'col_gray':info.free_switch == '1','col_blue':info.free_switch == '2'}">{{info.free_switch == '2' ? '已开通' : '未开通'}}</span>
        </div>
			</router-link>
			<router-link to="/workServiceSet/consultSet">
				<i class="icon icon-set-consult"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>
				<div>
          <span class="name">图文咨询</span>
          <span :class="[{'col_gray':info.chat_switch == '1'},{'col_blue':info.chat_switch == '2' || info.family_switch == '2'}]">{{info.chat_switch == '2' ||　info.family_switch == '2' ? '已开通' : '未开通'}}</span>
        </div>
			</router-link>
			<router-link to="appointmentSet">
				<i class="icon icon-set-order"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span></i>
				<div>
          <span class="name">门诊预约</span>
          <span :class="{'col_gray':info.appoint_switch == '1','col_blue':info.appoint_switch == '2'}">{{info.appoint_switch == '2' ? '已开通' : '未开通'}}</span>
        </div>
			</router-link>
			<a v-todo>
				<i class="icon icon-set-phone"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span></i>
				<div>
          <span class="name">电话咨询</span>
          <span class="col_gray">开发中</span>
        </div>
			</a>

		</div>
	</div>
</template>
<script>
import {MessageBox2,MessageBox,Toast} from '../../components/hw-components'
export default{
    name : 'myWallet',
    data(){return{
      param: '1',
    	state: '1',
      money: {transfer_amount : 0 , unsettled_amount : 0}
    }},
    created (){
      this.$store.commit('UPDATE_NAV',{title : '',fn : '', router : '/my', fShow : false, hShow : false});
      this.$api.checkMoney().then(obj=>{
          this.money = obj;
      });
      this.$api.gBankCard().then(obj=>{
         this.$store.commit('BANK_CARDS',obj);
      });
    },
    computed:{
       info(){
           return this.$store.state.docInfo;
       },
       cards(){
          return this.$store.state.bankCards;
       }
    },
    methods : {
    	isVisible(){
    		if(this.state=='1'){
    			this.state ='0';
    		}else {
    			this.state ='1';
    		}
    	},
      intorduce(){
         MessageBox2.confirm('该金额将在订单开始T+7天后转入可提现余额。')
      },
      jump(){
        this.$router.push({path : '/incomeDetail'});
      },
      transfer(){
          if(this.money.transfer_amount <= 1){
              Toast('您的可提现余额需大于1元。');
          }else{
            this.$router.push({path : '/transferAccount',query : { amount : (this.money.transfer_amount).toString()}});
          }
      },
      account(){
          this.$router.push({path : '/accountManage'});
      },
      moneyAccount(){
          this.$router.push({path : '/moneyAccount'});
      }
    }
}
</script>

<style lang="scss" scoped>
  @import "../../assets/css/common";
  .container{
    height: 100%;
    overflow: scroll;
    background: white;
  }
  .pagenav{
  	height: .87rem;
  	background: $baseBlue;
  	display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: space-between;
  	span,a{
  		display: inline-block;
  		font-size: 0.36rem;
  		height: 0.87rem;
	    line-height: 0.87rem;
	    color: #fff;
	    padding: 0 .3rem;
  	}
  }
  .pagehead{
  	background: $baseBlue;
  	font-size: 0.32rem;
    overflow-y: visible;
  	color: #fff;
  	.title{
  		height: 0.32rem;
  		line-height: 0.32rem;
  		text-align: center;
  		margin-bottom: .55rem;
  	}
  	.price{
  		font-size: .8rem;
  		height: .8rem;
  		line-height: .8rem;
  		text-align: center;
  	}
  	.unprice{
  		height: 0.94rem;
  		display: flex;
    	justify-content: space-between;
      overflow-y: visible;
    	div{
    		font-size: .28rem;
    		padding-left: .3rem;
        margin-bottom: 0.12rem;
    		/*height: 100%;*/
    		/*line-height: 1.48rem;*/
    		display: flex;
    		justify-content: space-between;
    		align-items: flex-end;
    		span{
    			display: inline-block;
		  		font-size: 0.28rem;
    			margin-left: .3rem;
          margin-bottom: 0.04rem;
          /*height: 1.48rem;*/
          /*line-height: 1.48rem;*/
    		}
    		a{
				color: #fff;
				border-left: 1px solid #fff;
				border-top: 1px solid #fff;
				border-bottom: 1px solid #fff;
				text-align: center;
				height: .52rem;
				line-height: .52rem;
				width: 1.8rem;
				-webkit-border-radius: .15rem 0 0 .15rem;
			    -khtml-border-radius: .15rem 0 0 .15rem;
			    -moz-border-radius: .15rem 0 0 .15rem;
			    -ms-border-radius: .15rem 0 0 .15rem;
			    -o-border-radius: .15rem 0 0 .15rem;
			    border-radius: .15rem 0 0 .15rem;
    		}
    	}
      div:nth-of-type(2){
        margin-bottom: 0;
      }
    }
  }
  .pagebg{
    height: 1.38rem;
    background: url(../../assets/media/img/wallet-bg.png) $baseBlue no-repeat left top;
    background-size: cover;
    position: relative;
    .functions{
      width:7.5rem;
      height:2.85rem;
      background:#fff;
      position: absolute;
      top: 0.6rem;
      left: 0;
    }
    nav{
      // position: absolute;
      // left: 0.2rem;
      // top: 0.95rem;
      // width: 6rem;
      // height: 1.9rem;
      padding: 0.4rem 0.75rem;
      height: 1.85rem;
      box-sizing: border-box;
      background: white;
      // border-radius: 0.16rem;
      display: flex;
      justify-content: space-between;
      font-size: 0.28rem;
      border-bottom: 1px solid $gray;
      a{
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: space-between;
        i{
          display: block;
          margin: auto;
        }
      }
    }
    .trans{
      background: #fff;
      height: 1rem;
      display: flex;
      padding: 0 .3rem;
      position:relative;
      .text{
        font-size: 0.32rem;
        line-height:1rem;
      }
      .status{
        width:1.4rem;
        text-align:center;
        line-height:1rem;
        display:inline-block;
        font-size:.24rem;
        color:#828384;
        margin-left:3.35rem;
      }
      .icon-return-boldleft{
        color: #c9caca;
        -webkit-transform: translateY(-50%) rotateY(180deg);
        transform: translateY(-50%) rotateY(180deg);
        font-size: 0.4rem;
        position: absolute;
        right: 0.3rem;
        top: 50%;
      }
    }
  }
  .operate{
  	background: #fff;
  	font-size: .32rem;
  	margin-bottom: .2rem;
  	div{
  		height: 1rem;
  		display: flex;
    	justify-content: space-between;
    	align-items: center;
    	padding: 0 .3rem;
      border-bottom: 1px solid $gray;
    	span{
    		display: inline-block;
	  		font-size: 0.28rem;
	  		color: #c9caca;
    	}
  	}
  	div:nth-last-of-type(1){
  		border-bottom: none
  	}
  }
  .myService{
  	font-size: 0.32rem;
  	height: .8rem;
  	line-height: .8rem;
  	background: #fff;
  	border-bottom: 1px solid $gray;
  	padding: 0 .3rem;
    // margin-top: 1.67rem;
    /*margin-top: 2.07rem;*/
  }
  .content{
  	padding: .85rem .8rem 1.1rem;
  	height: 4.5rem;
    box-sizing: border-box;
  	background: #fff;
	  display: flex;
    flex-wrap: wrap;
    align-content: space-between;
  	a{
      width: 50%;
      line-height: 0;
      height: 0.8rem;
      display: flex;
      justify-content: flex-start;
      align-content: space-between;
  		i{
  			display: inline-block;
  			text-align: center;
  			font-size: 1.06rem;
  			float:left;
  		}
      div{
        display: flex;
        width: 1.14rem;
        flex-wrap: wrap;
        margin-left: 0.3rem;
      }
      .name{
        display: block;
        width: 100%;
        font-size: 0.28rem;
        height: 0.3rem;
        white-space: nowrap;
        line-height: 0.3rem;
        margin-bottom: 0.2rem;
      }
  		.col_gray{
        display: block;
  			text-align: center;
  			font-size: .24rem;
  			color: #c9caca;
        height: 0.24rem;
        line-height: 0.24rem;
  		}
  		.col_blue{
        display: block;
  			text-align: center;
  			font-size: .24rem;
        height: 0.24rem;
        line-height: 0.24rem;
  			color: $baseBlue;
  		}
  	}
    a:nth-of-type(2n){
      justify-content: flex-end;
    }
    .icon{
      font-size: 0.68rem;
    }
  }
  .space{
    height: 0.2rem;
    background: $bg;
    margin-top: 2.07rem;
  }
 </style>
