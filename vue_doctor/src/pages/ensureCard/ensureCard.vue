<template>
	<div class="container">
	<div class="ensure_content">
		<div class="content">
			<div class="head">
				<span :class="chooseCard.color">{{chooseCard.name}}</span>
				<a href="javascript:;" @click.stop="rechoose()">重选模板</a>
			</div>
			<div class="card">
				<div class="img">
					<div class="bg1" v-show="chooseCard.name=='二维码桌卡1'"></div><!-- <img src="../../assets/media/img/deskCard_01.png" v-show="chooseCard.name=='二维码桌卡1'"> -->
					<div class="bg2" v-show="chooseCard.name=='二维码桌卡2'"></div>
					<div class="bg3" v-show="chooseCard.name=='二维码桌卡3'"></div>
					<!-- <img src="../../assets/media/img/deskCard_02.png" v-show="chooseCard.name=='二维码桌卡2'">
					<img src="../../assets/media/img/deskCard_03.png" v-show="chooseCard.name=='二维码桌卡3'"> -->
					<img src="../../assets/media/img/card1_01.png" v-show="chooseCard.name=='卡通达人'">
					<img src="../../assets/media/img/card2_01.png" v-if="chooseCard.name=='可爱粉色'">
					<img src="../../assets/media/img/card3_01.png" v-if="chooseCard.name=='简约彩虹'">
					<img src="../../assets/media/img/card4_01.png" v-if="chooseCard.name=='时尚简约'">
					<img src="../../assets/media/img/card5_01.png" v-if="chooseCard.name=='手绘花卉'">
					<img src="../../assets/media/img/card6_01.png" v-if="chooseCard.name=='清新海浪'">
					<img src="../../assets/media/img/card7_01.png" v-if="chooseCard.name=='商务深蓝'">
					<img src="../../assets/media/img/card8_01.png" v-if="chooseCard.name=='绿野仙踪'">
				</div>
				<div class="all">
					<p class="name">{{docInfo.name}}医生二维码{{chooseCard.type=="desk"?'桌片':'名片'}}</p>
					<p class="explain">1盒（用完可再次领取）</p>
				</div>
			</div>
		</div>
		<div class="content patInfo" v-if="reciveInfo!=''">
			<p class="name"><span>{{reciveInfo.name}}</span>&nbsp;&nbsp;&nbsp;{{reciveInfo.phone}}</p>
			<p class="address">{{reciveInfo.area.replace('-','')}}&nbsp;{{reciveInfo.address}}</p>
			<div class="btns">
				<button class="remove" @click.stop="remove">删除</button>
				<button class="edit" @click.stop="edit">编辑</button>
			</div>
			
		</div>

		<div class="content add" v-if="reciveInfo==''" @click.stop="chooseAdd">请添加收货地址<i class="icon-return-boldleft"></i></div>
	</div>
	<div class="save">
		<button @click.stop="save()">确认提交</button>
	</div>
	</div>
</template>
<script>
import {Toast} from '../../components/hw-components'
export default{
	name : 'ensureCard',
	data(){return{
		chooseCard:'',
		// patInfo:{'name':'睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉就','address':'经典经典经典大家都好都好都好','phone':'17621708830'},
		reciveInfo:'',
		info:{'doc_receive_address_id':'',type:'',materiel_name:''},
	}},
	computed:{
		docInfo(){
            return this.$store.state.docInfo;
        },
	},
	created(){
		this.$store.commit('UPDATE_NAV',{ fn : '', hShow : false , fShow : false});
		this.$store.dispatch('setDocTitle','确认领取物料');
		this.chooseCard = JSON.parse(window.sessionStorage['chooseCard']);
		this.info.materiel_name = this.chooseCard.name;
		if(this.chooseCard.type == 'card'){
			this.info.type = 1;
		}else{
			this.info.type = 2;
		}
		// if(window.sessionStorage['reciveInfo']){
		// 	this.reciveInfo = JSON.parse(window.sessionStorage['reciveInfo']);
		// }else{
		this.$api.receiveAddressDetail().then(obj=>{
			this.reciveInfo = obj.doc_receive_address;
		})
		// }
		// console.log(this.reciveInfo =='')
	},
	methods : {
		// jump(){
		// 	this.$router.push({path : '/chooseMaterial'});
		// }
		rechoose(){
			if(this.chooseCard.type == 'desk'){				
				this.$router.push({path : '/chooseDeskCard'});
			}else{
				this.$router.push({path : '/chooseCard'});
			}
		},
		chooseAdd(){
			this.$router.push({path : '/addCardAddress'});
		},
		remove(){
			this.reciveInfo = '';
			window.sessionStorage.removeItem('reciveInfo');
		},
		edit(){
			window.sessionStorage['reciveInfo'] = JSON.stringify(this.reciveInfo);
			this.$router.push({path : '/addCardAddress'});
		},
		save(){
			if(this.reciveInfo == ''){
				Toast('请添加收货地址')
			}else{
				this.info.doc_receive_address_id = this.reciveInfo.id;
				this.$api.createReceiveOrder(this.info).then(obj=>{
					this.$router.push({path : '/chooseSuccess'});
				})
				
			}
		},
	}
}
  
</script>
<style lang="scss" scoped>
@import "../../assets/css/common";
.ensure_content{
	height:calc(100% - 1.6rem);
	width:100%;
	padding-top:.3rem;
}
.save{
	height:1.3rem;	
	width:6.9rem;
	padding:0 .3rem;
	display:flex;
	button{
		width:6.9rem;
		background:$baseBlue;
		color:#fff;
		font-size:.4rem;
		height:1rem;
		border-radius:.06rem;
	}
}
.content{
	width:6.9rem;
	background:#fff;
	// height:2rem;
	margin-left:.3rem;
	box-shadow: 0 1px 4.28px 0.22px rgba(153,153,153,0.35);
	margin-bottom:.25rem;
	border-radius:.06rem;
	.head{
		height:.9rem;
		border-bottom:1px solid #e0e0e0;
		padding:0 .3rem;
		font-size:.32rem;
		display:flex;
		align-items:center;
		justify-content:space-between;
		a{
			color:$baseBlue;
			display:inline-block;
			line-height:.6rem;
			width:1.5rem;
			border:1px solid $baseBlue;
			border-radius:.06rem;
			text-align:center;
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
	}
	.card{
		height:2.3rem;
		display:flex;
		.img{
			width:2.6rem;
			height:1.8rem;
			overflow:hidden;
			border-radius:.06rem;
			margin: .2rem .2rem 0 .2rem;
		}
		img{
			width:2.6rem;
			height:1.8rem;
			border:1px solid #e0e0e0;
			box-sizing:border-box;
			border-radius:.06rem;
			// border-radius:.06rem;
			// margin: .2rem .2rem 0 .2rem;
		}
		.bg1,.bg2,.bg3{
			width:2.6rem;
			height:1.8rem;
			over-flow:hidden;
			border:1px solid #e0e0e0;
			box-sizing:border-box;
			border-radius:.06rem;
		}
		.bg1{
			background:url('../../assets/media/img/deskCard_01.png') no-repeat;
			background-size:2.6rem auto;
		}
		.bg2{
			background:url('../../assets/media/img/deskCard_02.png') no-repeat;
			background-size:2.6rem auto;
		}
		.bg3{
			background:url('../../assets/media/img/deskCard_03.png') no-repeat;
			background-size:2.6rem auto;
		}
		.all{
			width:3.7rem;
			height:2.3rem;
			
		    color:#333;
		    font-size:.32rem;
		    .name{
		    	font-weight:bold;
		    	padding-top:.4rem;
		    	height:1rem;
		    	line-height:.4rem;
		    	// margin-bottom:.6rem;
		    	// white-space: nowrap;
			    // overflow: hidden;
			    // text-overflow: ellipsis;
		    }
		    .explain{
				font-size:.24rem;
		    }
		}
	}
}
.patInfo{
	padding: .3rem .2rem;
	width: 6.5rem;
	font-size:.32rem;
	color:#333;
	.name{
		height:.45rem;
		display:flex;
		align-items:center;
		span{
			display:block;
			max-width:4rem;
			height:.45rem;
			line-height:.45rem;
			white-space: nowrap;
		    overflow: hidden;
		    text-overflow: ellipsis;

		}
	}
	.address{
		color:#666;
		font-size:.28rem;
		line-height:.4rem;
		margin-top:.1rem;
		width:6.5rem;
		// text-align:justify;
		word-break:break-all;
		// white-space: nowrap;
	 //    overflow: hidden;
	 //    text-overflow: ellipsis;
	}
	.btns{
		display:flex;
		width:2.6rem;
		margin-left:3.9rem;
	}
	button{
		box-sizing:border-box;
		height:.5rem;
		width:1.2rem;
		border:1px solid $baseBlue;
		color:$baseBlue;
		background:#fff;
		font-size:.32rem;
		border-radius:.06rem;
		margin-top:.1rem;
	}
	.remove{
		color:#fff;
		background:$baseBlue;
		margin-right:.2rem;
	}
}
.add{
	height:1.1rem;
	font-size:.32rem;
	color:$baseBlue;
	// line-height:1.1rem;
	padding:0 .2rem 0 .3rem;
	width:6.4rem;
	// position:relative;
	display:flex;
	align-items:center;
	justify-content:space-between;
	i{
		// position:absolute;
		// bottom:.4rem;
		// right:.2rem;
		color:#9a9a9a;
		font-size:.25rem;
		transform: rotateY(180deg);
	}
}
</style>