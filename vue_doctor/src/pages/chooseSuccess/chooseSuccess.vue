<template>
	<div class="container">
		<img src="../../assets/media/img/chooseSuccess.png">
		<p>您的申请已经提交，请保持您的电话畅通<br>医助<a href="tel:18516610368" class="call">（电话：185 1661 0368）</a><br>将在1~3个工作日内联系您！</p>
		<button @click.stop="back">知道了</button>
	</div>
</template>
<script>
export default{
	name : 'chooseSuccess',
	created(){
		this.$store.commit('UPDATE_NAV',{ fn : '', hShow : false , fShow : false});
		this.$store.dispatch('setDocTitle','确认领取物料');
	},
	methods : {
		back(){
			let routeTrack = JSON.parse(window.sessionStorage['routeTrack']);
			alert(routeTrack.root)
			if(routeTrack.root=="/work"){
				this.$router.push({path : '/work'});
			}else if(routeTrack.root=="/my"){
				this.$router.push({path : '/my'});
			}else{
				this.$router.push({path : '/work'});
			}
		}
	}
}
</script>
<style lang="scss" scoped>
@import "../../assets/css/common";
.container{
	width:100%;
	height:100%;
	background:#edeff0;
	img{
		width:1rem;
		height:1rem;
		margin: 2.7rem 0 .4rem 3.25rem;
	}
	p{
		font-size:.36rem;
		color:#333333;
		width:6.9rem;
		text-align:center;
		margin-left:.3rem;
		a{
			color:$baseBlue;

		}
	}
	button{
		width:2.4rem;
		height:.8rem;
		color:#fff;
		background:$baseBlue;
		font-size:.36rem;
		margin-left:2.55rem;
		border-radius:.06rem;
	}
}
</style>