<template>
	<div class="container">
		<div class="banner" v-if="meeting.banner==''">
			<img id="teamImg" src="../../assets/media/img/experts_banner.png">
			<p>{{meeting.title}}</p>
		</div>
		<div v-if="meeting.banner!=''" class="banner">
			<img id="teamImg" :src="banner()">
		</div>
		<!-- <img id="teamImg" src="../../assets/media/img/experts_bg.png"> -->
		<div class="welcomeWords">
			<div class="title" @click.stop="open()">欢迎词<span :class="['icon-return-right','icon',{'icon_active':isopen}]"></span></div>
			<div class="wel_content"><div :class="{'div_active':isopen}">{{meeting.note}}</div></div>
		</div>
		<template v-if="isshow">
			<div class="qrcode" @click.stop="showQrcode">专家团队二维码<div class="imgs"><img src="../../assets/media/img/qrcode.png"><span class="icon-return-right icon_right"></span></div></div>
			<!--<span class="line"></span>-->
      <!--<div class="qrcode" @click.stop="showQrcode">群聊 <button @click.stop="invite">邀请会员</button></div>-->
		</template>
		<div class="teamMembers">
			<div class="title">成员（{{members.length}}）<span class="icon-return-right icon_right"></span></div>
			<ul class="members">
				<li v-for="(item,index) in members">
				<!-- {{}} -->
          <div class="img">
            <img :src="headImage(item)" alt="">
            <!--<span class="un_register" v-show="!item.name">未注册</span>-->
          </div>
          <!--<a href="javascript:;" class="invite" @click.stop="invite">邀请</a>-->
					<div class="info">
						<p><span class="name">{{item.name || item.nick}}</span>{{item.technical}}&nbsp;&nbsp;{{item.grade}}</p>
						<p class="add">{{item.hospital}}&nbsp;&nbsp;{{item.dep}}</p>
						<p class="time">加入时间：{{item.created.split(' ')[0]}}</p>
					</div>
					<template v-if="item.status==1">
						<div class="blue">发起人</div>
					</template>
					<template v-if="item.name==''">
						<div class="orange">未注册</div>
					</template>
					 <!--<div class="blue">{{item.status==1?'发起人':'未注册'}}</div>-->
				</li>
			</ul>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		data(){return{
			meeting:'',
			isopen:false,
			members:[],
			account:'',
			isshow:false,
		}},
		computed:{
			docInfo(){
				return this.$store.state.docInfo;
			}
		},
		created(){
			var id = this.$route.params.id;
			var paths = JSON.parse(window.sessionStorage['routeTrack']).children;
			for(var i=0; i<paths.length;i++){
          		if(paths[i].fullPath.match('expertDetails') != null){
            		//从分享进来的时候存储分享的页面的路由
            		sessionStorage.sharePath = paths[i].fullPath;
          		}
        	}
			this.$api.meetingView(id).then(obj=>{
				this.account = obj.creater.account;
				if(this.docInfo.account == obj.creater.account){
					this.isshow = true;
				}else{
					this.isshow = false;
				}
				this.meeting = obj.meeting;
				// this.members = [];
				this.members.push(obj.creater);
				this.members[0].status = 1;
				// console.log(obj.meeting.title)
				this.$store.commit('UPDATE_NAV',{title : obj.meeting.title,fn : '', fShow : false, hShow : true});
				if(obj.joinMembers.length !=0){
					for(var i=0;i<obj.joinMembers.length;i++){
						this.members.push(obj.joinMembers[i]);
					}

				}
			})
		},
		methods:{
			open(){
				this.isopen=this.isopen ? false : true;
			},
			headImage(item){
				if(item.face==''){
					return DOCLINKAPI+'/doctor/face/'+item.account;
				}else{
					return DOCLINKAPI+item.face;
				}

			},
      invite(){
			  this.$router.push({path : 'expertInviteMulChat'});
      },
			showQrcode(){
				var id = this.$route.params.id;
				// this.$router.push({path : `/${id}/sharenoAccexpertsTeamQrcode`,query:{note:this.meeting.note,title:this.meeting.title}});
				this.$router.push({path : `/${id}/sharenoAccexpertsTeamQrcode`});
			},
			banner(){
				if(this.meeting.banner){
					return DOCLINKAPI+this.meeting.banner;
				}

			},
		},
	}
</script>
<style lang="scss" scoped>
	@import "../../assets/css/common";
	.container{
    overflow-x: hidden;
  }
	.banner{
		height:4.1rem;
		width:7.5rem;
		position:relative;
		#teamImg{
			height:4.1rem;
			width:7.5rem;
			border:none;
		}
		p{
			height:4.1rem;
			padding:0 .9rem;
			width:5.7rem;
			// background:yellow;
			position:absolute;
			top:0;
			left:0;
			display:flex;
			align-items:center;
			justify-content:center;
			font-size:.38rem;
			color:#fff;
		}
	}

	.icon{
		color:$i2Gray;
		font-size:.32rem;
		transform:rotate(-90deg);
	}
	.icon_active{
		transform:rotate(90deg);
	}
	.icon_right{
		color:$i2Gray;
		font-size:.32rem;
	}
	.title{
		color:#333;
		font-size:.32rem;
		height:.8rem;
		border-bottom:1px solid $line;
		display:flex;
		justify-content:space-between;
		align-items:center;
		padding:0 .1rem;
	}
	.welcomeWords{
		padding:0 .2rem;
    margin-bottom: 0.2rem;
		background:#fff;
		.wel_content{
			padding:.2rem .1rem;
			div{
				font-size:.28rem;
				color:#999;
				line-height:.4rem;
				max-height:1.6rem;
				word-break: break-all;
				overflow: hidden;
				text-overflow: ellipsis;
			    display: -webkit-box;
			    -webkit-line-clamp: 4;
			    -webkit-box-orient: vertical;
			}
			.div_active{
				max-height:none;
				overflow: auto;
				display: block;
			}
		}
	}
	.qrcode{
		height:1rem;
		padding:0 .3rem;
		background:#fff;
		color:#333;
		font-size:.32rem;
		display:flex;
		justify-content:space-between;
		align-items:center;
		.imgs{
			display:flex;
			align-items:center;
			img{
				width:.44rem;
				height:.44rem;
				margin-right:.2rem;
			}
		}
    button{
      display: inline-block;
      background: white;
      font-size: 0.28rem;
      color: $baseBlue;
      border: 1px solid $baseBlue;
      border-radius: .04rem;
      line-height: 0.4rem;
      padding: 0 0.13rem;
    }
	}
  .line{
    display: block;
    width: 100%;
    height: 1px;
    background: $gray_d;
    margin-left: 0.3rem;
  }
	.teamMembers{
		// padding:0 .2rem;
		background:#fff;
		margin-top:.2rem;
		.title{
			padding:0 .3rem;
		}
		.members{
			li{
				height:1.9rem;
				border-bottom:1px solid #edeff0;
				padding:0 .3rem;
				display:flex;
				align-items:center;
				position:relative;
				overflow:hidden;
        .invite{
          color: $baseBlue;
          font-size: 0.28rem;
          position: absolute;
          right: 0.3rem;
          line-height: 0.4rem;
          padding: 0 0.26rem;
          border: 1px solid $baseBlue;
          border-radius: 0.04rem;
        }
				.img{
					width:1.38rem;
					height:1.38rem;
					border-radius:50%;
					border:1px solid $imgs_b;
					margin-right:.2rem;
          overflow: hidden;
          position: relative;
          img{
            display: inline-block;
            width: 100%;
            height: 100%;
          }
          .un_register{
            position: absolute;
            font-size: 0.24rem;
            bottom: 0;
            left: 0;
            width: 100%;
            text-align: center;
            line-height: 0.36rem;
            padding-bottom: 0.06rem;
            background: rgba(42,140,255,0.8);
            color: white;
          }
				}
				.info{
					width:5.3rem;
					height:1.3rem;
					// background:pink;
					font-size:.26rem;
					color:#666;
					display:flex;
					flex-wrap:wrap;
					align-content:space-between;
					p{
						width:100%;
					}
					.add{
						font-size:.24rem;
					}
					.time{
						font-size:.24rem;
						color:#999;
					}
					.name{
						color:#333333;
						margin-right:.2rem;
						font-size:.32rem;
					}
				}
				.blue,.orange{
					position:absolute;
					right:-0.4rem;
					top: 0.25rem;
					width:1.7rem;
					height:.4rem;
					line-height:.4rem;
					background:$baseBlue;
					font-size:.24rem;
					color:#fff;
					text-align:center;
					transform:rotate(45deg);
				}
				.orange{
					background:#ffa517;
				}
			}

		}
	}
</style>
