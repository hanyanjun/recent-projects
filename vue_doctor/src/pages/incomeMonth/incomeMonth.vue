<template>
	<div class="container" @click.stop="timeSelect = false">
		<div class="time">
			<span class="date-time">{{time}}</span>
			<i class="icon-calendar"  @click.stop="timeSelect = timeSelect ? false : true"></i>
			<div class="date-ishide" v-show="timeSelect">
	          	<span></span>
	          	<ul>
	             	<li v-for="(item,index) in info" class="detail">{{item}}</li>
	          	</ul>
	        </div>
		</div>
		<!-- canvas画图 -->
		<div class="content"></div>
		<div class="incomeall"><span class="ti">月总共提现</span><span class="pri">555</span></div>
		<div class="title">近半年收入情况</div>
		<!-- <div class="income">
			{{time.split('/')[0].replace(/\b(0+)/gi,"")}}月总共收入
			<span>+222.00</span>
		</div> -->
		<div class="income_detail">
			<!-- <div class="detail">
				<span class="name">图文咨询（按次）</span>
				<span class="money">+2867.00</span>
				<div class="procedure">
					<div></div>
				</div>
			</div>
			<div class="detail">
				<span class="name">电话咨询</span>
			</div>
			<div class="detail">
				<span class="name">图文咨询（按期）</span>
			</div>
			<div class="detail">
				<span class="name">图文咨询（按期）</span>
			</div> -->
		</div>
	</div>
</template>

<script type="text/javascript">
//	var echart = require('echarts');
	export default{
		name : 'incomeMonth',
		data(){return{
			time : '',
			timeSelect : false,
			info : ['1','2','3','4','5','6']
		}},

		created(){
			this.$store.commit('UPDATE_NAV',{title : '收入详情', fn : '', fShow : false, hShow : true});
			this.time = this.$route.params.year+'年'+this.$route.params.month+'月';
		},

	}
</script>

<style lang="scss" scoped>
	@import "../../assets/css/common";
	@mixin bordergray{
		border-bottom: 1px solid $gray;
	}
	.time{
		height: .72rem;
		line-height: .72rem;
		background: #fff;
		font-size: .32rem;
		padding-left: .35rem;
		position: relative;
		@include bordergray;
		.icon-calendar{
		    position: absolute;
		    right: 5%;
		    top: .1rem;
		  }
		.date-ishide{
		    width: 1.6rem;
		    height: 3.6rem;
		    position: absolute;
		    top: .8rem;
		    right: .15rem;
		    z-index: 20;
		    filter: drop-shadow(0 0 .06rem  #c9caca);
		    span{
			    display: inline-block;
			    border: .14rem solid #fff;
			    border-top: .14rem solid transparent;
			    border-right: .14rem solid transparent;
			    border-left: .14rem solid transparent;
			    position: absolute;
			    left: 1rem;
			    top: -0.27rem;
			}
			ul{
			    width: 1.6rem;
			    height: 3.62rem;
			    background-color: #fff;
			    li{
				    line-height: .6rem;
				    color: #9fa0a0;
				    font-size: .26rem;
				    text-align: center;
				}
			}

		}

	}
	.title{
		height: .72rem;
		line-height: .72rem;
		@include bordergray;
		background: #fff;
		font-size: .32rem;
		padding-left: .35rem;
	}
	.content{
		height: 3.5rem;
		background: #fff;
		@include bordergray;
	}
	.incomeall{
		height: .7rem;
		line-height: .7rem;
		padding-left: .35rem;
		background: #fff;
		margin-bottom: .2rem;
		line-height: .7rem;
		font-size: .32rem;
		.ti{
			display: inline-block;
			width: 5.3rem;
			font-size: .28rem;
			color: $baseBlue;
		}
	}
	.income{
		height: .78rem;
		line-height: .78rem;
		@include bordergray;
		background: #fff;
		font-size: .32rem;
		padding-left: .35rem;
		position: relative;
		span{
			display: inline-block;
			line-height: .78rem;
			position: absolute;
			top: 0;
			right: .6rem;

		}
	}
	.income_detail{
		height: 5.6rem;
		background: #fff;
		padding: 0 .35rem;
		padding-top: .25rem;
		// .detail{
		// 	height: .28rem;
		// 	line-height: .28rem;
		// 	margin-bottom: .25rem;
		// 	background: lightpink;
		// 	font-size: .28rem;
		// 	.name{
		// 		float: left;
		// 		background: lightblue;
		// 	}
		// 	.money{
		// 		float: left;
		// 		width: 2.2rem;
		// 		display: inline-block;
		// 		text-align: right;
		// 		// margin-right: .55rem;
		// 		background: yellow;
		// 	}
		// 	.procedure{
		// 		float: right;
		// 		display: inline-block;
		// 		width: 2.9rem;
		// 		height: .28rem;
		// 		background: lightgray;
		// 		border-radius: .14rem 0 0 .14rem;
		// 		div{
		// 			width: .9rem;
		// 			background: #2a8cff;
		// 			height: .28rem;
		// 			border-radius: .14rem 0 0 .14rem;
		// 		}
		// 	}

		// }
	}
</style>
