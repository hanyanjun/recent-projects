<template>
	<div class="container">
		<div class="all">
			<div class="head"></div>
			<div class="explain">
				<p class="title">二维码有什么用？</p>
				<p class="content">患者就医后，向患者出示二维码，患者扫码一键加入医
生个人工作室，方便诊后随访、患者管理，塑造医生品
牌，助于医生形象升华。</p>
			</div>
			<div class="border"></div>
			<div class="explain">
				<p class="title">有哪几种形式？</p>
				<p class="content content_blue">1、名片：发放给患者，患者需要时扫码加入<br>
2、桌卡：放在诊室桌前，患者可以主动扫码<br>
3、海报：根据医生需求定制海报展示<br>
4、其他形式定制</p>
			</div>
		</div>
		<div class="btn" @click.stop="jump()"><button>立即领取</button></div>
	</div>
</template>
<script>
import {Toast} from '../../components/hw-components'
import {MessageBox} from '../../components/hw-components'
export default{
	name : 'collectMaterial',
	data(){return{
		account:'',
	}},
	// computed:{
	// 	docInfo(){
 //            return this.$store.state.docInfo;
 //        },
	// },
	created(){
		this.$store.commit('UPDATE_NAV',{ fn : '', hShow : false , fShow : false});
		this.$store.dispatch('setDocTitle','免费领取物料');
		this.account = this.$route.params.id;
		
	},
	methods : {
		jump(){
			if(this.account=='null'){
				this.$api.loginInfo().then((obj)=>{
					if(obj.doctorInfo.isRegister != 1){
						 MessageBox.confirm('您还不是注册医生，暂不能领取物料，现在去注册？').then(()=>{
						 	this.$router.push({path : '/login'});
						 });
					}else{
						this.$api.initInfo().then((obj)=>{
							if(obj.info.is_certified == 1){
								// this.$store.commit('UPDATE_MESSAGE_LIST',obj.messages);
								// this.$store.commit('UPDATE_LOADING',false);
	       //        				this.$store.commit('UPDATE_DOCSELFINFO',obj.info);
	              				// this.$router.push({path : '/work'});
	              				this.$router.push({path : '/chooseMaterial'});
							}else{
								MessageBox.confirm('您还未通过医生认证,是否现在去个人中心提交认证?').then(obj=>{this.$router.push({path : '/certificate/addInfo'});
					          });
							}
							
						})
					}
				})
			}else{
				this.$router.push({path : '/chooseMaterial'});
			}
			// this.$router.push({path : '/chooseMaterial'});
		}
	}
}
  
</script>
<style lang="scss" scoped>
@import "../../assets/css/common";
.all{
	height: calc(100% - 1.3rem);
	width:100%;
	background:#fff;
	overflow:hidden;
}
.all .head{
	height:3.95rem;
	background: url(../../assets/media/img/collectMaterial_head.png) no-repeat;
    background-size: 7.5rem 3.95rem;
}
.all .border{
	height:.1rem;
	background:#edeff0;

}
.all .explain{
	padding:.3rem .3rem;
	background:#fff;
	color:#333;
	// margin-bottom:.1rem;
	.title{
		font-size:.36rem;
		padding-bottom:.25rem;
		border-bottom:1px solid #e0e0e0;
	}
	.content{
		font-size:.28rem;
		line-height:.4rem;
		font-weight:lighter;
		margin-top: .15rem;
	}
	.content_blue{
		color:$baseBlue;
	}
}
.btn{
	height:1.3rem;
	padding:0 .2rem;
	background:#fff;
	display:flex;
	button{
		background:$baseBlue;
		border-radius:.06rem;
		height:1rem;
		color:#fff;
		width:7.1rem;
		font-size:.4rem;
	}
}
</style>