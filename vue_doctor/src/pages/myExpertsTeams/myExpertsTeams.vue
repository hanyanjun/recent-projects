<template>
	<div class="container">
	<!-- {{myTeams}}
	{{typeof(participateTeams)}} -->
		<template v-if="myTeams.length!=0">
			<div class="myTeams">
				<h1 class="title">我发起的合作</h1>
				<ul class="teams">

					<li v-for="(item,index) in myTeams" @click.stop="jump(item)">
						<div class="info">
							<div class="img">
								<div class="banner" v-if="item.banner==''">
									<img src="../../assets/media/img/experts_banner.png">
									<div>{{item.title}}</div>
								</div>
								<div class="banner" v-else>
									<img :src="banner(item)">
								</div>
								<div class="bg" v-if="item.is_review==3">审核中</div>
							</div>
							<div class="name">
								<div class="team_title">{{item.title}}</div>
								<div class="time">创建时间：{{item.created.split(' ')[0]}}</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</template>
		<!-- {{participateTeams.length != 0}} -->
		<template v-if="myTeams.length!=0 && participateTeams.length!=0"><div id="distance"></div></template>
		<template v-if="participateTeams.length!=0">
			<div class="participateTeams">
				<h1 class="title">我参与的合作</h1>
				<ul class="teams">
					<li v-for="(item,index) in participateTeams" @click.stop="jump(item)">
						<div class="info">
							<div class="img">
								<div class="banner" v-if="item.banner==''">
									<img src="../../assets/media/img/experts_banner.png">
								</div>
								<div class="banner" v-else>
									<img :src="banner(item)">
									<div>{{item.title}}</div>
								</div>
								<div class="bg" v-if="item.is_review==3">审核中</div>
							</div>
							<div class="name">
								<div class="team_title">{{item.title}}</div>
								<div class="time">创建时间：{{item.created.split(' ')[0]}}</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</template>
	</div>
</template>
<script type="text/javascript">
	import {MessageBox,Toast} from "../../components/hw-components"
	export default{

		data(){return{
		}},
		created(){
			this.$store.commit('UPDATE_NAV',{title : '专家合作',fn : '新建', fShow : false, hShow : true});
			this.$store.state.isLoading=true;
			var paths = JSON.parse(window.sessionStorage['routeTrack']).root;
			if(paths.match('myExpertsTeams') != null){
				sessionStorage['sharePath']= paths;
			}

			this.$api.myMeeting().then(obj=>{
				this.$store.state.expertTeams=obj.data;
				let url = window.location.href;
				if((/myExpertsTeams/g).test(url) && obj.data.joinMeeting.length==0 && obj.data.myMeeting.length==0){
                	this.$router.push({path : '/expertsCooperation'});
              	}else{
              		// this.$store.commit('UPDATE_NAV',{title : '专家合作',fn : '新建', fShow : false, hShow : true});
              	}

              	this.$store.state.isLoading=false;
			})
		},
		mounted (){
	      	document.querySelector('.nav_submit').onclick =()=>{
	      		// sessionStorage['jumpToAddExpertTeam']=true;
	        	this.$router.push({path : '/expertsCooperation'});
	      	}
	    },
	    computed:{
	    	myTeams(){
	    		return this.$store.state.expertTeams.myMeeting;
	    	},
	    	participateTeams(){
	    		return this.$store.state.expertTeams.joinMeeting;
	    	}
	    },
		methods:{
			jump(item){
				if(item.is_review==1){
					this.$router.push({path : `/${item.id}/expertDetails`});
				}else{
					MessageBox.confirm('如需开通专家合作功能，请点击“确定”并保持电话畅通，工作人员将尽量与您取得联系并协助开通。<br>服务电话：<a style="color:#2a8cff;" href="tel:400-608-1028">400-608-1028</a>').then(()=>{
						this.$api.meetingHelp().then(obj=>{
							// console.log(obj)
						})
					})
				}

			},
			banner(item){
					return DOCLINKAPI+item.banner;
			},
		},
	}
</script>
<style lang="scss" scoped>
	@import "../../assets/css/common";
	.container{
		width:100%;
		height:100%;
		background:#fff;
		#distance{
			height:.2rem;
			background:#edeff0;
		}
		.title{
			height:.77rem;
			border-bottom:1px solid $line;
			line-height:.77rem;
			font-size:.28rem;
			color:$gray_c;
			padding-left:.2rem;
		}
		.teams{
			padding-bottom:.4rem;
			padding-left:.2rem;
			li{
				height:2.1rem;
				// background:pink;
				border-bottom:1px solid $line;
				display:flex;
				// align-items:center;
				.info{
					width:100%;
					height:1.4rem;
					// background:yellow;
					display:flex;
					margin-top:.3rem;
					.img{
						width:2.2rem;
						height:1.4rem;
						position:relative;
						.banner{
							width:2.2rem;
							height:1.4rem;
							position:relative;
							img{
								width:2.2rem;
								height:1.4rem;
								border-radius:6px;
							}
							div{
								width:1.8rem;
								height:1.4rem;
								// background:black;
								position:absolute;
								top:0rem;
								left:0.2rem;
								display:flex;
								flex-wrap:wrap;
								align-items:center;
								justify-content:center;
								font-size:.12rem;
								color:#fff;
							}
						}

						.bg{
							width:2.2rem;
							height:1.4rem;
							font-size: .32rem;
							color:#fff;
							position:absolute;
							top: 0;
							left: 0;
							text-align:center;
							line-height:1.4rem;
							background:rgba(0,0,0,0.4);
							border-radius:6px;
						}
					}

					.name{
						width:4.8rem;
						height:1.4rem;
						display:inline-block;
						// background:orange;
						margin-left:.2rem;
						font-size:0rem;
						display:flex;
						flex-wrap:wrap;
						align-content:center;
						.team_title{
							width:100%;
							line-height:.4rem;
							min-height:.4rem;
							max-height:.8rem;
							color:#333;
							word-break: break-all;
							overflow: hidden;
						    text-overflow: ellipsis;
						    display: -webkit-box;
						    -webkit-line-clamp: 2;
						    -webkit-box-orient: vertical;
							font-size:.32rem;
							margin-bottom:.3rem;
						}
						.time{
							color:#999;
							font-size:.24rem;
							height:.24rem;
							line-height:.24rem;
						}
					}
				}
			}
		}
	}
</style>
