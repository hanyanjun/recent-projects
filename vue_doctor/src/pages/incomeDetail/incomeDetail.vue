<template>
	<div class="container loadWrapper">
	<loading-more :data="info" :pullupLoad="true" @pullup="load" :tip= 'isShow'>
		<section v-for="item in info">
			<!-- @click.stop="$router.push({path : `/${item.year}/${item.month}/incomeMonth`})" -->
			<a href="javascript:;" class="monthDetail">
				<p :class="{'blue' : params.ym != ''}">{{item.year}}年{{item.month}}月<br>
					<span v-if="(params.status!=''&&params.status!='all')||(params.order_type!=''&&params.order_type!='all')||(params.ym!=''&&params.ym!='all')"><label class="condition">{{params.status == '2'?'进行中' : params.status == '3'?'已退款' : params.status == '4'? '已完成' : ''}}{{params.status == '' ? '': params.order_type == '' ? '':'-'}}{{params.order_type == '2'?'图文咨询（按次）' : params.order_type == '3'?'图文咨询（按期）' : ''}}</label>订单共{{item.count}}单</span>
					<span v-else>本月服务订单共{{item.count}}单</span>
				</p>
				<p class="sti">{{item.amount}}<br><span>共计(元)</span></p>
			</a>
			<div class="everyMonth">
				<div :class="['content',{'content2': index ==item.list.length-1}]" v-for="(item2,index) in item.list" @click.stop="$router.push({path : `${item2.order_no}/indentDetail`});">
					<p>{{changedate(item2.pay_time)}}<br><span>{{item2.pay_time.split(' ')[0].split('-')[1]}}-{{item2.pay_time.split(' ')[0].split('-')[2]}}</span></p>
					<div class="detail">
             <div>
               <span class="black">
                 <template v-if="item2.order_type == '2'">
                      图文咨询（按次）
                 </template>
                 <template v-else-if="item2.order_type == '3'">
                   图文咨询（按期）
                 </template>
                 <template v-else-if="item2.order_type == '9'">
                   电话咨询
                 </template>
                 <template v-else-if="item2.order_type == '8'">
                   团队咨询
                 </template>—来自<br>{{item2.pat_name}}
               </span>
               <span>
                 {{item2.status ==3 ? '-' : '+'}}{{item2.pay_amount}}
               </span>
             </div>
             <div class="price">
               <i>支付时间 ({{item2.pay_time.split(' ')[1].split(':')[0]}}：{{item2.pay_time.split(' ')[1].split(':')[1]}})</i>
               <span :class="[{'redfont': item2.status =='3'},{'grayfont': item2.status =='4'}]">{{item2.status == '3' ? '已退款' : item2.status =='4' ? '已完成' : '进行中'}}</span>
             </div>
            <!--<span>支付时间 ({{item2.pay_time.split(' ')[1].split(':')[0]}}：{{item2.pay_time.split(' ')[1].split(':')[1]}})</span>-->
          </div>
				</div>
			</div>
		</section>
	</loading-more>
    <empty :config="empty"></empty>
	</div>


<!-- {{$route.query.info?`${JSON.parse($route.query.info).status}`:'本月服务订单共'+item.count+'单'}} -->

</template>

<script>
import loadingMore from  '../../components/loadingMore'
import {MessageBox2} from '../../components/hw-components'
import empty from '../../components/empty'
export default{
    data(){return{
    	day: {
    		month: '',
    		year: ''
    	},
      days : {
        month: '',
        year: ''
      },  //用于重组数据
    	state : 0,
    	info: [],
    	date: [],
    	isShow: false,
    	page: 1,
      	empty : {
    	    show : false ,
          text : '您当前还没有收入记录哦！'
      },
    	params: { status : '',order_type : '',ym : '', page : 1},
    }},
    components:{loadingMore,empty},
    created (){
      let params = this.$route.query.info;
      if(params){
      	params = JSON.parse(params);
      	if(params.status == 'all'){
      		this.params.status = '';
      	}else{
      		this.params.status = params.status ;
      	}
      	if(params.order_type == 'all'){
      		this.params.order_type = '';
      	}else{
      		this.params.order_type = params.order_type ;
      	}
      	let ym2 = params.ym;
      	if(ym2 != '' && ym2 != 'all'){
	        this.params.ym = ym2.split('年')[0] + '-' + ym2.split('年')[1].split('月')[0];
	    }else{
	    	this.params.ym = '';
	    }
      }
    },
    mounted(){
    	document.querySelector('.nav_submit').onclick = (e)=> {
    		let params =  this.$route.query.info;
    		if(params){
    			this.$router.push({path : `/incomeSelect`,query :{ info : JSON.stringify(params)}});
    		}else{
    			this.$router.push({path : `/incomeSelect`});
    		}

        }
        switch (this.walletType.type){
          case "team":
            this.$store.commit('UPDATE_NAV',{title : '收入记录', fShow : false, hShow : true });
            this.$api.teamIncomeDeatil(this.walletType.id,this.params)
              .then(obj=>{
                this.info = obj.orders;
                if(obj.orders.length == 0){
                  this.empty.show = true;
                }else{
                  let monthCount = this.info.length;
                  this.day.year = this.info[monthCount-1].year;
                  this.day.month = this.info[monthCount-1].month;
                  this.days.year = this.info[monthCount-1].year;
                  this.days.month = this.info[monthCount-1].month;
                }
              });
          break;
          default:
            this.$store.commit('UPDATE_NAV',{title : '收入记录',fn : '筛选', fShow : false, hShow : true});
            this.$api.incomeDeatil(this.params)
              .then(obj=>{
                this.info = obj.orders;
                if(obj.orders.length == 0){
                  this.empty.show = true;
                }else{
                  let monthCount = this.info.length;
                  this.day.year = this.info[monthCount-1].year;
                  this.day.month = this.info[monthCount-1].month;
                  this.days.year = this.info[monthCount-1].year;
                  this.days.month = this.info[monthCount-1].month;
                }
              });
        }
    },
    computed:{
      walletType(){
        return this.$store.state.walletType;
      }
    },
    methods : {
    	changedate: function(e){
    		var riqi = e.split(' ')[0];
			var arys1= new Array();
		    arys1=riqi.split('-');     //日期为输入日期，格式为 2013-3-10
		    var ssdate=new Date(arys1[0],parseInt(arys1[1]-1),arys1[2]);
		   	var aa = ssdate.getDay();
		   	// console.log(aa);
		   	switch(aa) {
		   		case 0:
		   			return '周日';
		   			break;
		   		case 1:
		   			return '周一';
		   			break;
	   			case 2:
		   			return '周二';
		   			break;
	   			case 3:
		   			return '周三';
		   			break;
		   		case 4:
		   			return '周四';
		   			break;
		   		case 5:
		   			return '周五';
		   			break;
		   		case 6:
		   			return '周六';
		   			break;
		   	}
    	},
    	load(v){
    		// console.log(this.info);
	        if(v){
	          setTimeout(()=>{
	            this.params.page ++;
              switch (this.walletType.type){
                case "team":
                  this.$api.teamIncomeDeatil(this.walletType.id,this.params).then(obj=>{
                    let objOrder = obj.orders;
                    if(objOrder.length == 0){
                      this.isShow = true;
                      return false;
                    }
                    for(var i=0 ; i<objOrder.length; i++){
                      if(this.day.year == objOrder[i].year  &&  this.day.month == objOrder[i].month){
                        let monthCount = this.info.length-1;
                        this.info[monthCount].list = this.info[monthCount].list.concat(objOrder[i].list);
                        this.info = Object.assign([],this.info);
                        break;
                      }else{
                        this.days.year = objOrder[i].year;
                        this.days.month = objOrder[i].month;
                        this.info = this.info.concat(objOrder[i]);
                      }
                    }
                  })
                  break;
                default:
                  this.$api.incomeDeatil(this.params).then(obj=>{
                    let objOrder = obj.orders;
                    if(objOrder.length == 0){
                      this.isShow = true;
                      return false;
                    }
                    for(var i=0 ; i<objOrder.length; i++){
                      if(this.days.year == objOrder[i].year  &&  this.days.month == objOrder[i].month){
                        let monthCount = this.info.length-1;
                        this.info[monthCount].list = this.info[monthCount].list.concat(objOrder[i].list);
                        this.info = Object.assign([],this.info);
                        break;
                      }else{
                        this.days.year = objOrder[i].year;
                        this.days.month = objOrder[i].month;
                        this.info = this.info.concat(objOrder[i]);
                      }
                    }
                  })
              }
	          },1000)
	        }
      	},
    }



}
</script>

<style lang="scss" scoped>
	@import "../../assets/css/common";
	@mixin bordergray{
		border-bottom: 1px solid $gray;
	}
	section{
		margin-bottom: .2rem;
    line-height: 0.28rem;
	}
	.monthDetail .blue{
		color: $baseBlue;
	}
	.monthDetail{
		display: flex;
		width: 6.9rem;
		padding: .25rem .3rem;
		height: 0.7rem;
		// justify-content: space-between;
		background: #fff;
		@include bordergray;
		font-size: .32rem;
    line-height: 0.4rem;
		color: #9fa0a0;
		// position: relative;
		p{
			// background: yellow;
			display: flex;
			align-content:space-between;
			flex-wrap: wrap;
			height: 0.7rem;
			width: 4rem;
			color: #000;
			span{
				width: 4rem;
				color: #9fa0a0;
				font-size: .26rem;
				// margin-top: .2rem;
				display: inline-block;
				.condition{
					color: $baseBlue;
				}
			}

		}
		.sti{
			width: 2.9rem;
			justify-content : flex-end;
			text-align: right;
			span{
				width: 2.9rem;
			}
		}
	}
	.everyMonth{
		padding-left: .3rem;
		background: #fff;
		font-size: .32rem;
		.content{
			/*height: .7rem;*/
			padding: .25rem .3rem .25rem 0;
			display: flex;
      align-items: center;
			@include bordergray;
			p{
				color: #9fa0a0;
				height: 0.7rem;
        /*height: 100%;*/
				display: flex;
				align-content:space-between;
				flex-wrap: wrap;
				font-size: .3rem;
				width: 1rem;
				// background: yellow;
				span{
					font-size: .26rem;
					width: 1rem;
					// margin-top: .2rem;
					display: inline-block;
				}
			}
			.detail{
				display: inline-block;
				width: 6rem;
				font-size: .32rem;
				display: flex;
        line-height: 0.4rem;
        justify-content: space-between;
				align-content:space-between;
				flex-wrap: wrap;
				span{
					/*width: 3.8rem;*/
					font-size: .32rem;
					// color: #9fa0a0;
					color: black;
					display: inline-block;
				}
        .black{
          font-size: 0.32rem;
          color: black;
        }
        div{
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
			}
			.price{
				// background: lightpink;
				font-size: .32rem;
				text-align: right;
				display: flex;
				span{
					color: $baseBlue;
					display: inline-block;
          margin-top: 0.1rem;
					font-size: .26rem;
					width: 2.1rem;
				}
        i{
          font-size: 0.26rem;
          color: #9fa0a0;
          margin-top: 0.1rem;
        }
				.redfont{
					color: #fb3d03;
				}
				.grayfont{
					color: #9fa0a0;
				}
			}
		}
		.content2{
			border: none;
		}
	}
</style>
