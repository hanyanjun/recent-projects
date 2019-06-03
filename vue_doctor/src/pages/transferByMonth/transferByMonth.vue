<template>
	<div class="container">
		<div class="header">
			<hw-switch :config="hwSwitch" v-on:event="change"></hw-switch>
		</div>
		<div v-if="transfer_authorized" class="all">
		<!-- <div  class="all"> -->
			<template v-if="card.length == 0">
				<div class="noCard"  @click.stop="account">
					<i class="icon-add-bank"></i>
					<i class="icon-add"></i><span>添加银行卡</span>
				</div>
			</template>
			<template v-else>
				<div class="haveCard">
					<span :class="['icon',`icon-${card[0].bank_code}-icon`]">
				        <span class="path1"></span><span class="path2"></span>
				  	</span>
				  	<p>
				  		<span class="bankName">{{card[0].bank_name}}{{card[0].card_number.substring(card[0].card_number.length - 4)}}</span><br>
				  		<span class="lastNumber">尾号{{card[0].card_number.substring(card[0].card_number.length - 4)}}储蓄卡</span>
				  	</p>
				</div>
			</template>
			<button :class="['btn',{'unselect':all.transfer_authorized == '3'||card.length == 0}]" :disabled="all.transfer_authorized == '3' || card.length == 0" @click="submit">{{all.transfer_authorized == '3'?'已授权':'同意并授权开启'}}</button>
			<p class="explain">同意并授权智呼吸工作人员每月10号前后将可提现余额转入
医生银行账户</p>
		</div>

	</div>
</template>
<script>
	import {MessageBox2,MessageBox,Toast} from '../../components/hw-components'
	import hwSwitch from '../../btns/hwSwitch'
	export default{
		components : {
	      hwSwitch
	    },
		name : 'transferByMonth',
		data(){return{
			transfer_authorized : false,
			card:'',
			type:'',
			all:''
		}},
		computed : {
	       	hwSwitch(){
	           	return {
	               	title : '收入按月转出',
                  tip:'收入中的可提现余额将在每月10号（如遇假期，可能会有提前或延后操作），由智呼吸工作人员转至医生银行账户',
                  status : this.transfer_authorized,
                  t1 : {
	               	  fontSize : '0.32rem'
                  }
	           	}
	       	},
	       	// cards(){
	        //   	return this.$store.state.bankCards;
	       	// }
	    },
		created(){
			this.$store.commit('UPDATE_NAV',{title : '收入按月转出',fn : '', router : '/myWallet', fShow : false, hShow : true});
			this.$api.gBankCard().then(obj=>{
				this.all = obj;
				if(obj.transfer_authorized==3){
					this.transfer_authorized=true;
				}else {
					this.transfer_authorized=false;
				}
				this.card = obj.cards;
				this.type = obj.transfer_authorized;
			})
		},
		methods : {
			change(v){
				// this.transfer_authorized = !this.transfer_authorized;
				if(v=='2'){
					console.log('2222')
					this.type=3;
					this.transfer_authorized=true;
					console.log(this.all)
				}else{
					console.log('1111')
					this.type=1;
					if(this.all.transfer_authorized !='1'){
						console.log(this.all.transfer_authorized)
						MessageBox.confirm('确认取消授权？').then(obj=>{
		               		this.$api.transferAuthorized(this.type).then(obj=>{
		               			this.transfer_authorized=false;
		               			this.all.transfer_authorized=1;
		               		});
		            	})
					}else{
						this.transfer_authorized=false;
					}

				}
				if(v=='2' && this.card.length == 0){
					MessageBox.confirm('您暂未绑定银行卡，是否现在去绑定？').then(obj=>{
		                this.$router.push({path : '/accountManage'});
		            })
				}
			},
			account(){
		        this.$router.push({path : '/accountManage'});
		    },
		    submit(){
		    	// console.log(this.type)
		    	// this.$api.patInfo();
		    	this.$api.transferAuthorized(this.type).then(obj=>{
	                this.$router.push({path : '/myWallet'});
	                // this.$router.routeBack();
	            });
		    }
		}
	}
</script>
<style lang="scss" scoped>
	@import '../../assets/css/common';
	.header{
		height:1.9rem;
		background:#fff;
		// padding:.25rem .3rem;
	}
	.all{
		margin-top:.2rem;
		// background:#fff;
	}
	.all .haveCard, .all .noCard{
		background:#fff;
		height:1.2rem;
		width:7.5rem;
		display:flex;
		align-items: center;
	}
	.noCard{
		padding-left:.4rem;
		.icon-add-bank{
			font-size:.68rem;
			margin-right:1.85rem;
		}
		.icon-add{
			font-size:.3rem;
			margin-right:.2rem;
		}
		span{
			font-size:.32rem;
			color:#c9caca;
		}
	}
	.haveCard{
		padding-left:.4rem;
		font-size:.32rem;
		color:#000;
		.icon{
			font-size:.68rem;
			margin-right:.2rem;
		}
		.bankName{
			line-height:.6rem;
			display:inline-block;
		}
		.lastNumber{
			font-size:.26rem;
			color:#747575;
		}
	}
	.btn{
		width:6.9rem;
		margin-left:.3rem;
		background:$baseBlue;
		color:#fff;
		font-size:.32rem;
		line-height:1rem;
		text-align:center;
		border-radius:.05rem;
		margin-top:1.6rem;
		// position:absolute;
		// top: 5rem;
		// left:.3rem;

	}
	.unselect{
		background:#66acff;
		color:#a0cbff;
	}
	.explain{
		// position:absolute;
		// top: 6.2rem;
		// left:0rem;
		margin-top:.2rem;
		padding:0 .3rem;
		color:#595757;
		font-size:.26rem;
	}
</style>
