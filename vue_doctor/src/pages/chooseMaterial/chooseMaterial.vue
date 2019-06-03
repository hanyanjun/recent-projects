<template>
	<div class="container">
		<div class="bg" v-show="showPrompt">
			<div class="prompt">
				<div class="img" @click.stop="close()"></div><!-- <img src="../../assets/media/img/close_material.png"> -->
				<div class="pro_content">
					<p class="pro_title">
						尊敬的{{docInfo.name}}老师：
					</p>
					<p class="pro_words">
						感谢您使用智呼吸平台！<br>您已选择由智呼吸帮您定制专属二维码物料，在您选择<i>“确认并提交”</i>按钮后，我们将会有专属医助电话与您尾号<i>{{phone}}</i>注册电话联系，根据您的定制需求，设计出您满意的二维码物料。
					</p>
					<button @click.stop="submit">确认并提交</button>
				</div>
			</div>
		</div>
		<p class="hint">以下物料您可以任选，如果需要定制，可向医助提出</p>
		<div class="content" @click.stop="chooseCard">
			<img src="../../assets/media/img/chooseMaterial_01.png">
			<div class="all">
				<p class="title">医生二维码名片</p>
				<p class="words">患者就医后，发放给患者，<!-- <br> -->患者随时需要，随时扫码加入</p>
				<p class="jump">立即免费领取</p>
			</div>
			<!-- <i class="icon-return-boldleft"></i> -->
		</div>
		<div class="content content2" @click.stop="chooseDesk">
			<img src="../../assets/media/img/chooseMaterial_02.png">
			<div class="all">
				<p class="title">医生二维码桌卡</p>
				<p class="words">放在诊室桌前，患者就医时<!-- <br> -->可以主动扫码加入</p>
				<p class="jump">立即免费领取</p>
			</div>
			<!-- <i class="icon-return-boldleft"></i> -->
		</div>
		<div class="content" @click.stop="chooseDesign">
			<img src="../../assets/media/img/chooseMaterial_03.png">
			<div class="all">
				<p class="title">二维码定制</p>
				<p class="words">如果您需要定制二维码物料，<!-- <br> -->请联系智呼吸专属医助</p>
				<p class="jump">立即免费领取</p>
			</div>
			<!-- <i class="icon-return-boldleft"></i> -->
		</div>
		
	</div>
</template>
<style lang="scss" scoped>
@import "../../assets/css/common";
.container{
	position:relative;
	.bg{
		width: 100%;
	  	height: 100%;
	  	background: rgba(0,0,0,0.3);
	  	position: fixed;
	  	left: 0;
	  	top:0;
	  	z-index: 99;
	}
	.prompt{
		width:6.3rem;
		// height:6.9rem;
		height:8.3rem;
		margin-top:-4.15rem;
		position:absolute;
		top: 50%;
		left:.6rem;
		// background:yellow;
		.img{
			position:absolute;
			bottom: 0rem;
			left:2.75rem;
			height:.8rem;
			width:.8rem;
			background:url('../../assets/media/img/close_material.png') no-repeat;
			background-size: .8rem .8rem;
		}
		.img:after{
			content:"";
			display:block;
			width:1px;
			height:.8rem;
			position:absolute;
			top: -.8rem;
			left:.4rem;
			background:#fff;
			z-index:1000;
		}
		.pro_content{
			height:5.9rem;
			width:5.2rem;
			padding:1rem 0.55rem 0 .55rem;
			background:url('../../assets/media/img/material_bg.png') no-repeat center;
			background-size:6.3rem 6.9rem;
			position:relative;
			font-size:.26rem;
			.pro_title{
				font-size:.32rem;
				font-weight:bold;
				margin-bottom:.4rem;
			}
			.pro_words{
				line-height:.4rem;
				i{
					color:$baseBlue;
				}
			}
			button{
				width:2rem;
				height:.6rem;
				background:$baseBlue;
				font-size:.32rem;
				color:#fff;
				border-radius:.06rem;
				position:absolute;
				bottom:.9rem;
				left:2.05rem;
			}
		}

	}
}
.hint{
	background:#f2f4f5;
	height:.6rem;
	line-height:.6rem;
	font-size:.24rem;
	text-align:center;
	color:#999;
	margin-bottom:.25rem;
}
.content{
	width:7.1rem;
	height:2.8rem;
	background:#ffffff;
	margin-left:.2rem;
	box-shadow: 0 1px 4.28px 0.22px rgba(153,153,153,0.35);
	border-radius:.06rem;
	display:flex;
	align-items:center;
	margin-bottom:.2rem;
	img{
		width:2.4rem;
		height:2.2rem;
		margin-left:.3rem;
		margin-right:.6rem;
	}
	.all{
		width:3.3rem;
		height:2.8rem;
		.title{
			font-size:.32rem;
			color:#333;
			padding-top:.5rem;
			margin-bottom:.3rem;
		}
		.words{
			font-size:.24rem;
			color:#666;
			line-height:.35rem;
			margin-bottom:.3rem;
		}
		.jump{
			font-size:.24rem;
			color:$baseBlue;
		}
	}
	i{
		color:#999;
		font-size:.25rem;
		transform: translateY(-50%) rotateY(180deg);
	}
}
.content2{
	margin-bottom: .5rem;
}
</style>
<script>
import {Toast} from '../../components/hw-components'
export default{
	name : 'chooseMaterial',
	data(){return{
		showPrompt:false,
	}},
	created(){
		this.$store.commit('UPDATE_NAV',{ fn : '', hShow : false , fShow : false});
		this.$store.dispatch('setDocTitle','免费领取物料');
	},
	methods : {
		chooseCard(){
			this.$router.push({path : '/chooseCard'});
		},
		chooseDesk(){
			this.$router.push({path : '/chooseDeskCard'});
		},
		chooseDesign(){
			this.showPrompt = true;
		},
		close(){
			this.showPrompt = false;
		},
		submit(){
			let info={};
			info.type = 3;
			info.materiel_name = '二维码定制';
			this.$api.createReceiveOrder(info).then(obj=>{
				this.$router.push({path : '/chooseSuccess'});
			})
			// this.$router.push({path : '/chooseSuccess'});
		}
	},
	computed:{
		docInfo(){
            return this.$store.state.docInfo;
        },
        phone(){
        	let call = this.docInfo.phone;
        	if(call){
        		return call.substring(7,11);
        	}
        	
        }
	},
}
  
</script>