<template>
	<div class="container">
		<ul class="introduce">
			<li class="intro_li"><span class="icon-plan-status-2 icon"></span>线下开会，<span class="blue_li">线上</span>建立专家<span class="blue_li">人脉网</span></li>
			<li class="intro_li"><span class="icon-plan-status-2 icon"></span>合作网络中专家，一键邀请成立<span class="blue_li">专家团队</span></li>
			<li class="intro_li"><span class="icon-plan-status-2 icon"></span>邀请您的同事、助手、学生加入<span class="blue_li">合作</span>网络</li>
			<li class="intro_li"><span class="icon-plan-status-2 icon"></span>更多合作，<span class="blue_li">敬请期待</span> …</li>
		</ul>
		<div class="btns">
			<a href="javascript:;" id="openSelf" @click.stop="open">点击自主开通</a>
			<button id="openRelate" @click.stop="relate">联系医助协助开通</button>
		</div>
	</div>
</template>
<script type="text/javascript">
	import {MessageBox,Toast} from "../../components/hw-components"
	export default{

		data(){return{

		}},
		created(){
			this.$store.commit('UPDATE_NAV',{title : '专家合作',fn : '', fShow : false, hShow : true});

		},
		methods:{
			open(){
				this.$router.push({path : '/addExpertsTeam'});
			},
			relate(){
				MessageBox.confirm('如需开通专家合作功能，请点击“确定”并保持电话畅通，工作人员将尽量与您取得联系并协助开通。<br>服务电话：<a style="color:#2a8cff;" href="tel:400-608-1028">400-608-1028</a>').then(()=>{
					this.$api.meetingHelp().then(obj=>{
						// console.log(obj)
					})
				})
			}
		},
	}
</script>
<style lang="scss" scoped>
	@import "../../assets/css/common";
	.container{
		width:100%;
		height:100%;
		/*background:pink;*/
		position:relative;
	}
	.hw-message_box_window_confirm .hw-message_box_content{
		width:6rem;
	}

	.introduce{
		height:calc(100% - 7.25rem);
		font-size:0.32rem;
		color:#333;
		padding:5.2rem .5rem 0 .5rem;
		background: #fff url('../../assets/media/img/experts_bg.png') no-repeat;
		background-size:100% 6.2rem;
		border:none;
		.intro_li{
			height:0.72rem;
			line-height:0.72rem;
			.icon{
				font-size:0.32rem;
				margin-right:.2rem;
			}
			.blue_li{
				color:$baseBlue;
			}
		}
	}
	.btns{
		height:2.05rem;
		background:#fff;
		width:100%;
		position:absolute;
		bottom:0rem;
		left:0rem;
		display:flex;
		justify-content:center;
		align-content:space-between;
		flex-wrap:wrap;
		#openSelf{
			font-size:.3rem;
			display:inline-block;
			width:100%;
			height:.3rem;
			line-height:.3rem;
			text-decoration:underline;
			text-align:center;
			color:$baseBlue;
		}
		#openRelate{
			width:6.9rem;
			height:1rem;
			background:$baseBlue;
			color:#fff;
			font-size:.4rem;
			border-radius:0.06rem;
			margin-bottom:.3rem;
		}
	}
</style>
