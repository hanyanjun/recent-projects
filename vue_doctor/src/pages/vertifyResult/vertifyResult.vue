<template>
	<div class="container">
	 	<div class="content">
	 	<div class="title">
	 		<i :class="status == '1' ? 'icon-verify-success': (status== '2' ? 'icon-time' : 'icon-verify-fail')"></i>
	 		{{status == '1' ? '你的微信已实名认证' : status == '2' ? '等待验证结果中' : '你的微信没有实名认证'}}
	 		<div class="bg" v-show="status != '3'"></div>
	 		<div class="question" v-show="status == '3'"  @click.stop = "intorduce">
	 			<span>如何实名认证</span>&nbsp;&nbsp;
	 			<span class="icon-question"></span>
	 		</div>
	 	</div>
	 	<hw-button  config="知道了" @event="submit"></hw-button>
	 	</div>
	</div>
</template>

<script type="text/javascript">
import {MessageBox2,MessageBox} from '../../components/hw-components'
export default{
	name: 'vetifyResult',
	data(){return{
		status: '2',
	}},
	created(){
		this.$store.commit('UPDATE_NAV',{title : '微信验证', fShow : false, hShow : true});
	},
	methods : {
		intorduce(){
		    this.$router.push({path : '/wQuestions'})
	    },
	    submit(){
	    	this.$router.push({path : '/myWallet'});
	    }

	}
}
</script>

<style lang="scss" scoped>
  	@import "../../assets/css/common";
  	.content{
  		padding: .4rem .3rem;
  		.title{
  			// height: 3rem;
  			width: 6.9rem;
  			background: #fff;
  			font-size: .32rem;
  			text-align: center;
  			i{
  				font-size: 1.15rem;
  				display: inline-block;
  				width: 6.9rem;
  				text-align: center;
  				padding: .55rem 0;
  			}
  			.bg{
  				height: .9rem;
  				background: #fff;
  			}
  			.question{
  				padding-left: 2.3rem;
  				padding-bottom: .2rem;
  				height: 1rem;
  				color: $baseBlue;
  				// background: yellow;
  				display: flex;
  				span{
  					display: inline-block;
  					line-height: 1rem;
  					font-size: .32rem;
  				}
  				.icon-question{
  					display: inline-block;
  					line-height: 1rem;
  					font-size: .32rem;
  				}

  			}
  		}
  		.div-active{
  			padding: 0;
  			margin-top: .3rem;
  		}
  	}
</style>
