<template>
	<div class="container">
		<router-link to="/myWallet" :class="['jump',{'jump2': index ==  info.length}]" v-for="(item,index) in info" :key="item">{{item.content}}<i class="icon-return-right"></i>
		</router-link>
	</div>
</template>
<script type="text/javascript">
export default{
 	name: 'wechatQuestions',
 	data(){return{
      info : this.$hwdata.wechat
 	}},
 	created(){
		this.$store.commit('UPDATE_NAV',{title : '微信实名问题',fn : '', fShow : false, hShow : true});
	},
}
</script>

<style lang="scss" scoped>
 	@import "../../assets/css/common";
 	.jump{
 		display: flex;
 		font-size: .32rem;
 		background: #fff;
 		height: 1rem;
 		line-height: 1rem;
 		border-bottom: 1px solid $gray;
 		box-sizing: border-box;
 		padding: 0 .3rem;
 		justify-content: space-between;
 		i{
 			color: #c9caca;
 			font-size: .36rem;
 			display: inline-block;
 			height: 1rem;
 			line-height: 1rem;
 		}
 	}
 	.jump2{
 		border-bottom: none;
 	}
</style>
