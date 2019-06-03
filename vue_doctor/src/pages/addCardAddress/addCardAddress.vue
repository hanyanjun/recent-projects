<template>
	<div class="container">
		<div class="addInfo-window">
		<div class="all">
			<div class="info"><div class="content"><span>收货人：</span><input class="nameInp" type="text" v-model="reciveInfo.name" @focus="pickHide()"></div></div>
			<div class="info"><div class="content"><span>联系方式：</span><input class="nameInp" type="text" v-model="reciveInfo.phone" @focus="pickHide()"></div></div>
			<div class="info" @click.stop="selectCity()"><div class="content"><span>所在地区：</span><div class="city">{{reciveInfo.area}}<i class="icon-return-right"></i></div></div></div>
			<div class="info"><div class="content content2"><span>详细地址：</span><textarea rows="3" class="nameInp" type="text" v-model="reciveInfo.address" @focus="pickHide()"></textarea></div></div>
		</div>
		<div class="btns">
			<button class="save" @click.stop="save()">保存</button>
		</div>
		</div>
	</div>
</template>

<script>
import {Toast} from '../../components/hw-components'
import '../../data/areaData'
export default{
	name : 'addCardAddress',
	data(){return{
		// chooseCard:'',
		// patInfo:{'name':'睡觉睡觉睡觉睡觉睡觉睡觉睡觉睡觉就','address':'经典经典经典大家都好都好都好','phone':'17621708830'},
		reciveInfo:{'name':'','address':'','phone':'','area':'','provinces_area_id':'','cities_area_id':''},
		name:'',
		phone:'',
		screenHeight:'',
		
	}},
	mounted (){
      this.screenHeight = document.body.clientHeight;
      let addDiv = document.getElementsByClassName('addInfo-window')[0];
      addDiv.style.height = this.screenHeight + 'px';
    },
	created(){
		this.$store.commit('UPDATE_NAV',{ fn : '', hShow : false , fShow : false});
		this.$store.dispatch('setDocTitle','收货地址');
		if(window.sessionStorage['reciveInfo']){
			let info = JSON.parse(window.sessionStorage['reciveInfo']);
			Object.assign(this.reciveInfo,info);
	        this.reciveInfo =  Object.assign({},this.reciveInfo);
	        // this.name = this.reciveInfo.name; 
	        // this.phone = this.reciveInfo.phone; 
		}
		// console.log(this.patInfo)
	},
	methods : {
		pickHide(){
			this.$picker2.hide();
		},
		selectCity(){
          this.pickHide();
          this.$picker2.setData(JSON.parse(window.localStorage['areaAll']));
          // console.log(this.$picker2.pickers[1]);
          if(this.reciveInfo.provinces_area_id && this.reciveInfo.cities_area_id){
          	this.$picker2.pickers[0].setSelectedValue("200000000");
          }
          
          // this.$picker2.pickers[1].setSelectedValue("徐汇区");
          // this.$picker2.pickers[1].setSelectedIndex(3);
          this.$picker2.show(e=>{
              this.reciveInfo.provinces_area_id = e[0].value;
              this.reciveInfo.cities_area_id = e[1].value;
              this.reciveInfo.area = `${e[0].text}-${e[1].text}`
              console.log(this.reciveInfo)
          })
        },
        save(){
        	var reg=/^([0-9]|[-])+$/g ;
        	if(this.reciveInfo.name==''){
        		Toast('请填写收货人姓名');
        	}else if(this.reciveInfo.phone==''){
        		Toast('请填写收货人电话');
        	}else if(!reg.test(this.reciveInfo.phone)){
        		Toast('请填写正确电话');        		
        	}else if(this.reciveInfo.area==''){
        		Toast('请填写区域');
        	}else if(this.reciveInfo.address==''){
        		Toast('请填写详细地址');
        	}else{
        		// window.sessionStorage['reciveInfo'] = JSON.stringify(this.reciveInfo);
        		this.$api.updatedReceiveAddress(this.reciveInfo).then(obj=>{
					// this.id = obj.doc_receive_address.id;
					this.$router.push({path : '/ensureCard'});
				})
				// this.$router.push({path : '/ensureCard'});
        	}
        },
	}
}
</script>
<style lang="scss" scoped>
@import "../../assets/css/common";
.addInfo-window{
	width: 100%;
	height: 100%;
// background: rgb(240, 239, 245);
}
.all{
	height:calc(100% - 1.3rem);
	width:100%;
}
.btns{
	height:1.3rem;	
	width:6.9rem;
	padding:0 .3rem;
	display:flex;
	.save{
		width:6.9rem;
		background:$baseBlue;
		color:#fff;
		font-size:.4rem;
		height:1rem;
		border-radius:.06rem;
	}
	
}
.info{
	padding-left:.2rem;
	width:7.3rem;
	// height:1rem;
	background:#fff;
	.content{
		height:1rem;
		border-bottom:1px solid #e0e0e0;
		display:flex;
		align-items:center;
	}

	span{
		display:inline-block;
		width:1.4rem;
		color:#666;
		font-size:.28rem;
		height:.4rem;
		line-height:.4rem;
	}
	.nameInp{
		height:.4rem;
		width:5.9rem;
		color:#333;
		font-size:.32rem;
		line-height:.4rem;
	}
	.city{
		height:.4rem;
		width:5.9rem;
		color:#333;
		font-size:.32rem;
		position:relative;
		line-height:.4rem;
		i{
			font-size:.32rem;
			position:absolute;
			top: .04rem;
			right:.2rem;
			color:#9b9b9b;
		}
	}
	.content2{
		height:auto;
		align-items:flex-start;
		padding:.34rem 0;
		border:none;
		.nameInp{
			height:auto;
			line-height:.4rem;
		}
	}
}

</style>