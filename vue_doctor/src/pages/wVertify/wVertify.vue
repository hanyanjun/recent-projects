<template>
	<div class="container">
		<span class="icon-question icon1" @click.stop = "intorduce"></span>
		<div class="wechat">
			<div><span class="icon-weixin-safe"></span></div>
			<p>根据央行监管规定，您需要完成实名认证才能使用微信支付功能，微信支付将严格保护您的信息和资产安全</p>
		</div>
		<div class="title">
			<span class="name">选择验证</span>&nbsp;&nbsp;<span style="font-size: .28rem;" class="icon-question icon2" @click.stop = "intorduce"></span>
		</div>
		<a  href="javascript:;"  @click.stop="vertify" class="jump">
			<p>微信微信打款验证<span>智呼吸向您的微信钱包支付￥1</span></p>
			<i class="icon-return-right"></i>
		</a>
	</div>
</template>
<script type="text/javascript">
import {MessageBox2,MessageBox} from '../../components/hw-components'
export default{
	name: 'myWallet',
	data(){return{
      link : DOCAUTHORIZELINK
	}},
	created (){
      this.$store.commit('UPDATE_NAV',{title : '验证微信账户',fn : '', fShow : false, hShow : true});
	},
	methods : {
		intorduce(){
         MessageBox2.confirm('我们将通过微信支付-商户账户向你的微信钱包付款，用来确认你的微信支付是否实名认证，此举不会收集和获取你的任何个人信息')
    },
    vertify(){
		    this.$router.push({path : '/addBankVerify'});
//        window.location.href = `${DOCAUTHORIZELINK}?weixinpub_origin=old&location_url=vertifyResult`;
    }
	}
}
</script>

<style lang="scss" scoped>
  	@import "../../assets/css/common";
  .container{
    overflow: hidden;
  }
	.icon1{
		position: fixed;
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
	    color: #fff;
	}
	.wechat{
		height: 4.7rem;
		background: #fff;
		div{
			height: 3.1rem;
			// background: yellow;
			span{
				display: inline-block;
				width: 7.5rem;
				font-size: 1.6rem;
				text-align: center;
				padding-top: .85rem;
			}
		}
		p{
			padding: 0 .95rem;
			font-size: .28rem;
			color: #6f6e6e;
			text-align: center;
		}
	}
	.title{
		padding: 0 .3rem;
		height: .8rem;
		line-height: .8rem;
		font-size: .28rem;
		display: flex;
		.name{
			display: inline-block;
			height: .8rem;
			line-height: .8rem;
		}
		.icon2{
			display: inline-block;
			height: .8rem;
			line-height: .8rem;
			color: $baseBlue;
		}
	}
	.jump{
		height: .8rem;
		background: #fff;
		padding: .3rem .3rem;
		display: flex;
		p{
			width: 6rem;
			font-size: .32rem;
			display: flex;
			align-content:space-between;
			flex-wrap: wrap;
			span{
				width: 6rem;
				color: #9fa0a0;
				font-size: .28rem;
				display: inline-block;
			}
		}
		i{
			display: inline-block;
			width:  .9rem;
			line-height: .8rem;
			text-align: right;
			font-size: .36rem;

		}
	}
</style>
