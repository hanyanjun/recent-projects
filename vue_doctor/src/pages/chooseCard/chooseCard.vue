<template>
	<div class="container">
		<div class="content">
			<div class="all" :class="all[num].class">
				<div class="head">
					<span :class="color">{{name}}</span>
					<div class="choose">
						<p :class="['btn',{'gray':num == 0}]" :disabled="num == 0" @click.stop="pre()">上一个</p>
						<p :class="['btn',{'gray':num == 7}]" :disabled="num == 7" @click.stop="next()">下一个</p>
					</div>
				</div>
				<!-- <span style="font-size:.24rem;">{{all[num].img1}}</span> -->
				<div class="imgs">
					<img v-img = "all[num].img1">
					<img v-img = "all[num].img2">
				</div>
				<!-- <div class="imgs" v-show="num == 0">
					<img src="../../assets/media/img/card1_01.png">
					<img src="../../assets/media/img/card1_02.png">
				</div>
				<div class="imgs" v-show="num == 1">
					<img src="../../assets/media/img/card2_01.png">
					<img src="../../assets/media/img/card2_02.png">
				</div>
				<div class="imgs" v-show="num == 2">
					<img src="../../assets/media/img/card3_01.png">
					<img src="../../assets/media/img/card3_02.png">
				</div>
				<div class="imgs" v-show="num == 3">
					<img src="../../assets/media/img/card4_01.png">
					<img src="../../assets/media/img/card4_02.png">
				</div>
				<div class="imgs" v-show="num == 4">
					<img src="../../assets/media/img/card5_01.png">
					<img src="../../assets/media/img/card5_02.png">
				</div>
				<div class="imgs" v-show="num == 5">
					<img src="../../assets/media/img/card6_01.png">
					<img src="../../assets/media/img/card6_02.png">
				</div>
				<div class="imgs" v-show="num == 6">
					<img src="../../assets/media/img/card7_01.png">
					<img src="../../assets/media/img/card7_02.png">
				</div>
				<div class="imgs" v-show="num == 7">
					<img src="../../assets/media/img/card8_01.png">
					<img src="../../assets/media/img/card8_02.png">
				</div> -->
				<!-- <div class="imgs" v-show="num == 0">
					<img src="../../assets/media/img/card1_01.png">
					<img src="../../assets/media/img/card1_02.png">
				</div> -->
			</div>
		</div>
		<div class="btns">
			<span class="rechoose" @click.stop="rechoose()">重选物料</span>
			<span class="name">已选&nbsp;<i :class="color">（{{name}}）</i></span>
			<button @click.stop="jump()">下一步</button>
		</div>
	</div>
</template>
<script>
import {Toast} from '../../components/hw-components'
import img1 from '../../assets/media/img/card1_01.png'
import img2 from '../../assets/media/img/card1_02.png'
import img3 from '../../assets/media/img/card2_01.png'
import img4 from '../../assets/media/img/card2_02.png'
import img5 from '../../assets/media/img/card3_01.png'
import img6 from '../../assets/media/img/card3_02.png'
import img7 from '../../assets/media/img/card4_01.png'
import img8 from '../../assets/media/img/card4_02.png'
import img9 from '../../assets/media/img/card5_01.png'
import img10 from '../../assets/media/img/card5_02.png'
import img11 from '../../assets/media/img/card6_01.png'
import img12 from '../../assets/media/img/card6_02.png'
import img13 from '../../assets/media/img/card7_01.png'
import img14 from '../../assets/media/img/card7_02.png'
import img15 from '../../assets/media/img/card8_01.png'
import img16 from '../../assets/media/img/card8_02.png'
export default{
	name : 'chooseCard',
	data(){return{
		num:0,
		name:'卡通达人',
		all:[{'name':'卡通达人','class':'class1','color':'darkBlue','img1':img1,'img2':img2},{'name':'可爱粉色','class':'class2','color':'pink','img1':img3,'img2':img4},{'name':'简约彩虹','class':'class3','color':'colorful','img1':img5,'img2':img6},{'name':'时尚简约','class':'class4','color':'blackBlue','img1':img7,'img2':img8},{'name':'手绘花卉','class':'class5','color':'red','img1':img9,'img2':img10},{'name':'清新海浪','class':'class6','color':'lightBlue','img1':img11,'img2':img12},{'name':'商务深蓝','class':'class7','color':'deepBlue','img1':img13,'img2':img14},{'name':'绿野仙踪','class':'class8','color':'green','img1':img15,'img2':img16}],
		color:'darkBlue',
	}},
	created(){
		this.$store.commit('UPDATE_NAV',{ fn : '', hShow : false , fShow : false});
		this.$store.dispatch('setDocTitle','选择名片模板');
	},
	mounted(){
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
			this.color = this.all[this.num].color;
		},
		next(){
			if(this.num != 7){
				this.num = this.num + 1;
			}else{
				this.num = 7;
			}
			this.name = this.all[this.num].name;
			this.color = this.all[this.num].color;
		},
		jump(){
			let chooseCard={'name':'','color':'','type':'card'};
			chooseCard.name = this.name;
			chooseCard.color = this.color;
			window.sessionStorage['chooseCard'] = JSON.stringify(chooseCard);
			this.$router.push({path : '/ensureCard'});
		}
	},
	watch : {
   //   	num(){
   //   		var pimg1 = document.getElementById("pimg1");
			// var pimg2 = document.getElementById("pimg2");
   //      	pimg1.style.background=this.all[this.num].img1;
			// pimg2.style.background=this.all[this.num].img2;
   //   	}
   	}
}
  
</script>
<style lang="scss" scoped>
@import "../../assets/css/common";
.content{
	height:calc(100% - 1rem);
	width:7.5rem;
	overflow:hidden;
}
.darkBlue{
	color:#2b87c9;
}
.pink{
	color:#f6c1d0;
}
.colorful{
	color:#9cd2ba;
}
.blackBlue{
	color:#4082c4;
}
.red{
	color:#ed7b80;
}
.lightBlue{
	color:#77d1f7;
}
.deepBlue{
	color:#1178b8;
}
.green{
	color:#477e5c;
}
.class1{
	box-shadow:0px 0.5px 4.27px 0.22px rgba(146,209,253,0.4);
}
.class2{
	box-shadow:0px 0.5px 4.27px 0.22px rgba(246,193,208,0.4);
}
.class3{
	box-shadow:0px 0.5px 4.27px 0.22px rgba(169,216,194,0.4);
}
.class4{
	box-shadow:0px 0.5px 4.27px 0.22px rgba(119,180,241,0.4);
}
.class5{
	box-shadow:0px 0.5px 4.27px 0.22px rgba(255,177,180,0.4);
}
.class6{
	box-shadow:0px 0.5px 4.27px 0.22px rgba(141,221,255,0.4);
}
.class7{
	box-shadow:0px 0.5px 4.27px 0.22px rgba(130,207,255,0.4);
}
.class8{
	box-shadow:0px 0.5px 4.27px 0.22px rgba(128,182,149,0.4);
}
.content .all{
	width:6.9rem;
	margin: .3rem .3rem 0 .3rem;
	background:#fff;
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
			// color:$baseBlue;
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
	.imgs{
		padding: .4rem .3rem .4rem .3rem;
		// height:3rem;
		width:6.3rem;
		img{
			width:6.3rem;
			height:3.7rem;
			margin-bottom:.3rem;
			// border:1px solid #e0e0e0;
			box-sizing:border-box;
			border-radius:.06rem;
		}
	}
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
		width:3.2rem;
	}
	.name{
		color:#999999;
		width:2rem;
		font-size:.24rem;
	}
	button{
		width:2rem;
		font-size:.3rem;
		color:#fff;
		background:$baseBlue;
		height:1rem;
	}
}
</style>