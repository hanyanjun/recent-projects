<template>
	<div class="container">
		<div class="content">
			<div class="all">
				<div class="head">
					<span>{{name}}</span>
					<div class="choose">
						<p :class="['btn',{'gray':num == 0}]" :disabled="num == 0" @click.stop="pre()">上一个</p>
						<p :class="['btn',{'gray':num == all.length-1}]" :disabled="num == all.length-1" @click.stop="next()">下一个</p>
					</div>
				</div>
				<div class="img" v-show="num == index" v-for="(item,index) in all">
					<img :src="item.img">
				</div>
			</div>
		</div>
		<div class="btns">
			<span class="rechoose" @click.stop="rechoose()">重选物料</span>
			<span class="name">已选&nbsp;<i>({{name}})</i></span>
			<button @click.stop="jump()">下一步</button>
		</div>
	</div>
</template>
<script>
import {Toast} from '../../components/hw-components'
import img1 from '../../assets/media/img/deskCard_01.png'
import img2 from '../../assets/media/img/deskCard_02.png'
import img3 from '../../assets/media/img/deskCard_03.png'
export default{
	name : 'chooseDeskCard',
	data(){return{
		all:[{'name':'二维码桌卡1','img':img1},{'name':'二维码桌卡2','img':img2},{'name':'二维码桌卡3','img':img3}],
		name:'二维码桌卡1',
		num:0,
	}},
	created(){
		this.$store.commit('UPDATE_NAV',{ fn : '', hShow : false , fShow : false});
		this.$store.dispatch('setDocTitle','选择桌卡模板');
	},
	methods : {
		rechoose(){
			this.$router.push({path : '/chooseMaterial'});
		},
		pre(){
			if(this.num != 0){
				this.num = this.num - 1;
			}else{
				this.num = 0;
			}
			this.name = this.all[this.num].name;
		},
		next(){
			if(this.num != 2){
				this.num = this.num + 1;
			}else{
				this.num = 2;
			}
			this.name = this.all[this.num].name;
			// this.color = this.all[this.num].color;
		},
		jump(){
			let chooseCard={'name':'',color:'darkBlue',type:'desk'};
			chooseCard.name = this.name;
			window.sessionStorage['chooseCard'] = JSON.stringify(chooseCard);
			this.$router.push({path : '/ensureCard'});
		}
	},
}
</script>
<style lang="scss" scoped>
@import "../../assets/css/common";
.content{
	height:calc(100% - 1rem);
	width:7.5rem;
	overflow:hidden;
}
.btns{
	height:1rem;
	// box-shadow:0px 1.5px 3.5px 0px rgba(0,0,0,0.35);
	background:#fff;
	display:flex;
	align-items:center;
	.rechoose{
		font-size:.3rem;
		color:#2b87c9;
		margin-left:.3rem;
		display:inline-block;
		width:2.7rem;
	}
	.name{
		width:2.5rem;
		font-size:.24rem;
		color:#999999;
		i{
			color:#2b87c9;
		}
	}
	button{
		width:2rem;
		font-size:.3rem;
		color:#fff;
		background:$baseBlue;
		height:1rem;
	}
}
.content .all{
	width:6.9rem;
	margin: .3rem .3rem 0 .3rem;
	background:#fff;
	box-shadow:0px 0.5px 4.27px 0.22px rgba(146,209,253,0.4);
	border-radius:.08rem;
	.head{
		height:.9rem;
		border-bottom:1px solid #e0e0e0;
		padding:0 .3rem;
		display:flex;
		align-items:center;
		justify-content:space-between;
		span{
			font-size:.32rem;
			color:#2b87c9;
		}
		.choose{
			width:2.5rem;
			height:.5rem;
			display:flex;
			justify-content:space-between;
			p{
				width:1.2rem;
				height:.5rem;
				box-sizing:border-box;
				font-size:.32rem;
				line-height:.5rem;
				text-align:center;
				border:1px solid $baseBlue;
				color:$baseBlue;
				border-radius:.06rem;
			}
			.gray{
				border:1px solid #c9caca;
				color:#c9caca;
			}
		}
	}
	.img{
		padding: .6rem 0 1.2rem 1rem;
		img{
			height:7.1rem;
			width:4.9rem;
			border:1px solid #e0e0e0;
			border-radius:.08rem;
		}
	}
}
</style>