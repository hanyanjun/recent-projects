<template>
	<div class="container">
		<div class="all">
			<h1 class="title">封面照片<!-- <span class="must_have">*</span> --></h1>
			<div class="photo">
				<label class="cover" v-if="head==''">
					<span class="icon-addpatient icon">
		            	<span class="path1"></span><span class="path2"></span><span class="path3"></span>
		            </span>
		            <p>选择封面照片</p>
		            <p>(建议尺寸800*400)</p>
		            <input type="file" accept="image/*" class="chooseFile" @change="uploadHead" ref="head">
				</label>
				<label class="cover cover_bg" v-if="head!=''">
					<span class="icon-addpatient icon icon1">
		            	<span class="path1"></span><span class="path2"></span><span class="path3"></span>
		            </span>
		            <p>更换封面照片</p>
		            <!-- <p>(建议尺寸800*400)</p> -->
		            <input type="file" accept="image/*" class="chooseFile" @change="uploadHead" ref="head1">
				</label>
				<img :src="head" alt="" ref="headImg">
			</div>
			<div class="title_content">
				<hwConInput title="标题" maxLength="30" holder="请描述您的团队擅长治疗领域、团队特色等" :operate="doOperate" v-model="title"></hwConInput>
			</div>
			<div class="title_content">
				<hwConInput title="欢迎词" maxLength="500" holder="请输入本次专家合作的内容简要、欢迎致辞等" v-model="content" minHeight="260"></hwConInput>
			</div>
			<!-- <router-link style="font-size:.4rem;" to="/myExpertsTeams">专家合作</router-link> -->
		</div>

		<div class="btn">
			<button id="submit" @click.stop="submit">提交审核</button>
		</div>

	</div>
</template>
<script type="text/javascript">
import {Toast,MessageBox} from '../../components/hw-components'
import hwConInput from '../../components/hw-con-input'
	export default{
		components : {hwConInput},
		data(){return{
			head:'',
			title:'',
			content:'',
			imgfile:'',
			doOperate:function(){
				if(event.keyCode==32){
			        event.returnValue = false;
			    }else if (event.keyCode==13) {
			    	event.returnValue = false;
			    }
			}
		}},
		created(){
			this.$store.commit('UPDATE_NAV',{title : '新建专家团队',fn : '', fShow : false, hShow : true});
		},
		methods:{
			uploadHead(){
	            let  f;
	            if(this.head != ''){
	              f = this.$refs.head1.files[0];
	            }else{
	              f = this.$refs.head.files[0];
	            }
	            this.imgfile = f;
	            let src = window.URL.createObjectURL(f);
	            // console.log(this.imgfile)
	            // let formData = new FormData();
	            // formData.append('type1[]', f);
	            this.head=src;

	        },
	        submit(){
	        	
	        	var params={};
	        	// if(this.imgfile==''){
	        	// 	Toast('请上传封面照片');
	        	// }else 
	        	if(this.title==''){
	        		Toast('请输入标题');
	        	}else if(this.content==''){
	        		Toast('请输入欢迎词');
	        	}else{
	        		let formData = new FormData();
	        		formData.append('title', this.title);
	        		formData.append('note', this.content);
	        		formData.append('banner', this.imgfile);
	        		// params.title = this.title;
	        		// params.note = this.content;
	        		// params.banner = this.imgfile;
	        		this.$api.createMeeting(formData).then(obj=>{
	        			// alert('444');
	        			// alert(obj)
	        		// // 	// this.$api.myMeeting().then(obj=>{
	        		// // 		// this.$store.state.expertTeams=obj.data;
	        				this.$router.push('/myExpertsTeams');
	        		// // 	// })
	        			
	        		})
	        	}
	        }
		},
	}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";
	.container{
		position:relative;
		border:none;
	}
	.all{
		height:calc(100% - 1.6rem);
		overflow:auto;
	}
	.title{
		font-size:.32rem;
		color:#333;
		padding:.3rem 0 .2rem .3rem;
		height:.32rem;
		line-height:.32rem;
		.must_have{
			color:#fa6c7d;
			display:inline-block;
		}
		.font_gray{
			font-size:.26rem;
			color:#999;
			font-weight:light;
		}
	}
	.photo{
		width:7.1rem;
		height:3.5rem;
		background:#fff;
		margin-left:.2rem;
		position:relative;
		border:none;
		img{
			width:6.8rem;
			height:3.2rem;
			margin-left:.15rem;
			margin-top:.15rem;
			border:none;
		}
		
		.cover{
			display:inline-block;
			width:6.8rem;
			height:3.2rem;
			// background:black;
			position:absolute;
			top:0.15rem;
			left:0.15rem;
			display:flex;
			flex-wrap:wrap;
			justify-content:center;
			align-content:center;
			border:none;
			.icon{
				font-size:.7rem;
			}
			.icon1 .path1:before{
				color:#fff;
			}
			.icon1 .path3:before{
				color:#b2b7bf;
			}
			.chooseFile{
				display:none;
			}
			p{
				width:100%;
				text-align:center;
				font-size:.28rem;
				color:#c9caca;
				height:.28rem;
				line-height:.28rem;
				margin-top:.2rem;
			}
		}
		.cover_bg{
			background:rgba(0,0,0,0.3);
		}
	}
	.title_content{
		width:7.1rem;
		margin-left:.2rem;		
	}
	.btn{
		height:1.6rem;
		width:100%;
		position:absolute;
		bottom:0;
		left:0;
		display:flex;
		#submit{
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
</style>