<template>
	<div class="container">
		<img src="../../assets/media/img/myReaearch_bg.png">
		<div class="content">
			<div class="all"><span class="num">1</span><span class="words">线上轻松一键发起项目研究</span></div>
			<div class="all"><span class="num">2</span><span class="words">专科领域，众多专家资源协同</span></div>
			<div class="all"><span class="num">3</span><span class="words">数据赋能，平台提供技术与推进服务</span></div>
			<div class="all"><span class="num">4</span><span class="words">多种模式，医生之间，平台之间，
医生与平台间合作资源互补</span></div>
			<div class="relate">如需开通，请联系<a href="tel:400-608-1028" class="call">医助小智</a>获取帮助</div>
		</div>
	</div>
</template>
<script>
export default{
	name : 'myResearch',
	created(){
		this.$store.commit('UPDATE_NAV',{title : '我的研究', fn : '', fShow : false, hShow : true});
		// this.$store.dispatch('setDocTitle','确认领取物料');
	},
	methods : {
	}
}
</script>
<style lang="scss" scoped>
@import "../../assets/css/common";
.container{
	background:#fff;
}
img{
	width:6.3rem;
	height:4.2rem;
	margin-left:.6rem;
	margin-top:.8rem;
}
.content{
	margin-top:.8rem;
	padding: 0 .8rem;
	width:5.9rem;
	.all{
		font-size:.32rem;
		margin-bottom:.25rem;
		display:flex;
		color:#333;
		// height:.5rem;
		.num{
			display:inline-block;
			height:.4rem;
			width:.4rem;
			border-radius:50%;
			background:$baseBlue;
			color:#fff;
			font-size:.28rem;
			line-height:.4rem;
			text-align:center;
			margin-right:.3rem;
			margin-top:.05rem;
		}
		.words{
			display:inline-block;
			// height:.4rem;
			line-height:.5rem;
			width:5.2rem;
		}
	}
	.relate{
		color:#666;
		font-size:.32rem;
		margin-top:1rem;
		text-align:center;
		a{
			color:$baseBlue;
			text-decoration:underline;
		}
	}
}
</style>