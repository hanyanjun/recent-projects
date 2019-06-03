<template>
	<div class="container">
		<div class="all">
			<div class="qrcode">
				<p class="intro">{{params.title}}</p>
				<div class="code">
					<img :src="imgSrc">
				</div>
				<p class="save">长按二维码加入</p>
			</div>
		</div>
		<div class="btn">
			<button id="share" @click.stop="share">分享</button>
		</div>

	</div>
</template>
<script type="text/javascript">
	import shareWindow from '../../components/inviteWindow.vue'
	export default{
		data(){return{
			imgSrc:'',
			sShow : false,
			params:{
				title:'',
				note:'',
				id:'',
				local:'',
				img:''
			}
		}},
		created(){
			var id = this.$route.params.id;
			var paths = JSON.parse(window.sessionStorage['routeTrack']).children;
			for(var i=0; i<paths.length;i++){
	          if(paths[i].fullPath.match('expertsTeamQrcode') != null){
	          }
	        }
			this.imgSrc = DOCLINKAPI+'/meeting/qrcode/'+id;
			this.$api.meetingInfo(id).then(obj=>{
				this.params.title=obj.meeting.title;
				this.params.note = obj.meeting.note;
				this.params.local = window.location.href;
				this.params.img = this.imgSrc;
				this.$store.commit('UPDATE_NAV',{title : this.params.title,fn : '', fShow : false, hShow : true});
			})

		},
		methods:{
			share(){
				this.$store.state.sShow=true;
				this.$store.dispatch('wxShowShare');
        this.$store.dispatch('wxShareTimeLineT',{
          title : this.params.title,
          link : this.params.local,
          img : this.params.img
        })
        this.$store.dispatch('wxShareAppMessageT',{
          title : this.params.title,
          desc : this.params.note,
          link : this.params.local,
          img : this.params.img
        })
			},
		}
	}
</script>
<style lang="scss" scoped>
	@import "../../assets/css/common";
	// .container{
	// 	position:relative;
	// }
	.all{
		height:calc(100% - 1.6rem);
		width:100%;
		// background:orange;
		position:relative;
	}
	.qrcode{
		width:6rem;
		height:7rem;
		position:absolute;
		top: 50%;
		left: 0.75rem;
		transform:translateY(-50%);
		background:#fff;
		box-shadow:0rem 0.02rem 0.1rem 0rem rgba(177,177,177,0.5);
		border-radius:0.03rem;
		.intro{
			font-size:.28rem;
			color:#666;
			padding-top:.54rem;
			text-align:center;
		}
		.code{
			width:3.5rem;
			height:3.5rem;
			background: #fff url('../../assets/media/img/qrcode_border.png') no-repeat;
			background-size:100%;
			margin-left:1.25rem;
			margin-top:.3rem;
			img{
				width:3rem;
				height:3rem;
				margin-left:.25rem;
				margin-top: .25rem;
			}
		}
		.save{
			font-size:.32rem;
			color:#333;
			margin-top:.8rem;
			text-align:center;
		}
	}
	.btn{
		height:1.6rem;
		width:100%;
		position:absolute;
		bottom:0;
		left:0;
		display:flex;
		#share{
			width:7.1rem;
			height:1rem;
			font-size:.4rem;
			color:#fff;
			background:$baseBlue;
			margin-left: .2rem;
			margin-top:.3rem;
			border-radius:.06rem;
		}
	}
	// /*分享二维码弹窗指引样式*/
 //  .share-window {
 //    width: 100vw;
 //    height: 100vh;
 //    background: rgba(0, 0, 0, .6);
 //    top: 0;
 //    z-index: 100;
 //    position: fixed;
 //  }

 //  .share-window img {
 //    width: 100%;
 //    height: 2.44rem
 //  }
</style>
