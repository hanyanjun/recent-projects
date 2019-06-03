<template>
    <div class="container" @click.stop="timeSelect = false" style="border:1px solid transparent">
      <!-- 文本区弹出框 -->
      <div id="rd-text" v-show="firstShow">
        <div class="text-content">
          <div class="rd-title">本月报到情况</div>
          <ul class="rd-ul">
            <li>
              <i></i><span class="rd-ulsptitle">昨日新报到肺功能管理组</span>
              <p><span class="new-haveequ">{{yesterdayInfo.count_device}}</span>人</p>
            </li>
            <li>
              <i style="background: #69aeff;"></i><span class="rd-ulsptitle">昨日新报到非肺功能管理组</span>
              <p><span class="new-noequ" style="color: #69aeff;">{{yesterdayInfo.count_no_device}}</span>人</p>
            </li>
            <li>
              <i></i><span class="rd-ulsptitle">本月累计报到肺功能管理组</span>
              <p><span class="mon-haveequ">{{currentInfo.count_device}}</span>人</p>
            </li>
            <li>
              <i style="background: #69aeff;"></i><span class="rd-ulsptitle">本月累计报到非肺功能管理组</span>
              <p><span class="mon-noequ" style="color: #69aeff;">{{currentInfo.count_no_device}}</span>人</p>
            </li>
          </ul>
          <i class="i-line"></i>
          <i class="icon-close" @click.stop="firstShow = false"></i>
        </div>
      </div>

      <div class="date">
        <span class="date-time">{{switchTime(currentInfo.date)}}</span>
        <i class="icon-calendar"  @click.stop="timeSelect = timeSelect ? false : true"></i>
        <div class="date-ishide" v-show="timeSelect">
          <span></span>
          <ul>
             <li v-for="(item,index) in info" class="detail"  :style="{color :  index == selectIndex ? 'rgb(42, 140, 255)' : ''}" @click.stop="selected(index)">{{switchTime(item.date)}}</li>
          </ul>
        </div>

      </div>
      <div class="reportor-convas">
        <div class="convas-data">
          <div class="convas-data-box">
            <p class="patientcount"><span class="convasequ convas-haveequ">{{currentInfo.count_device}}</span>人<br><span class="patientequ">肺功能管理组</span></p>
            <p class="patientcount"><span class="convasequ convas-noequ">{{currentInfo.count_no_device}}</span>人<br><span class="patientequ">非肺功能管理组</span></p>
          </div>
        </div>
        <div class="convas-picture">
          <canvas id="canvas" ></canvas>
          <div class="convas-countall">
            <p class="count1"><span>{{currentInfo.count_all}}</span>人</p>
            <p class="count2">累计报到</p>
          </div>
        </div>
      </div>
      <div class="month-convas">
        <div class="month-title">本月报到情况</div>
        <canvas id="a_canvas"></canvas>
      </div>
    </div>
</template>

<script>
export default{
    name : 'reportDetail',
    data(){return{currentInfo : '', timeSelect : false , info: '',selectIndex : '',firstShow : false,yesterdayInfo : ''}},
    created (){
      let time = this.$route.params.time;
      this.time = time;
      this.$store.commit('UPDATE_NAV',{title : '报到详情',fn : '', router : '/patientReport', fShow : false, hShow : true});
      this.$api.monthReport(time).then(obj=>{
          this.currentInfo = obj.months[0];
          this.info = obj.months;
          this.yesterdayInfo = obj.yesterday;
          this.drawchart();
          this.drawmonths();
          let strDate = (new Date()).getDate();
        if(window.localStorage.strDate == '' || window.localStorage.strDate != strDate){
          window.localStorage.setItem('strDate',strDate);
          this.firstShow = true;
        }else{
          this.firstShow = false;
        }
      })
    },
    methods : {
      switchTime (v){
          if(v){
            v = v.toString();
            let arr = v.split('-');
            return `${arr[0]}年${arr[1]}月`;
          }
      },
      selected(i){
          this.selectIndex = i;
          this.currentInfo = this.info[i];
          this.drawchart();
          console.log(this.currentInfo)
          this.drawmonths();
      },
      drawchart(){
        let item = this.currentInfo;
        var cv = document.getElementById("canvas");
        var ctx = cv.getContext("2d");
        var  clientWidth = document.documentElement.clientWidth*window.devicePixelRatio;
        //根据设计图中的canvas画布的占比进行设置
        var canvasWidth = Math.floor(clientWidth*310/750);
        cv.setAttribute('width',canvasWidth+'px');
        cv.setAttribute('height',canvasWidth+'px');
        cv.style.transformOrigin = '0 50%';
        cv.style.transform = `scale(${1/window.devicePixelRatio},${1/window.devicePixelRatio})`;
        ctx.clearRect(0,0,canvasWidth,canvasWidth);
        // 角度转弧度方法
        function toRadian(angle) {
          return angle / 180 * Math.PI;
        }
        var startAngle = 0,                         // 起始角度
          x0 = cv.width / 2, y0 = cv.height / 2,    // 圆心点坐标
          radius = Math.floor(clientWidth*150/750),                              // 半径
          curAngle = 2*Math.PI;
         if(item.count_device==0 && item.count_no_device==0){
          console.log(curAngle+startAngle);
          ctx.beginPath();
          curAngle = 0;
          ctx.fillStyle = '#dcdcdc';
          ctx.moveTo(x0, y0);
          ctx.arc(x0, y0, radius, 0*Math.PI, 2*Math.PI,true);
          ctx.fill();
        }
        else{
          ctx.beginPath();
          curAngle = 0- (parseFloat(item.count_device)/(parseFloat(item.count_device)+parseFloat(item.count_no_device))) * 360;
          ctx.fillStyle = '#fea4eb';
          ctx.moveTo(x0, y0);
          ctx.arc(x0, y0, radius, toRadian(startAngle), toRadian( startAngle+curAngle),true);
          ctx.fill();
          startAngle += curAngle;
          ctx.beginPath();
          curAngle = 0- (parseFloat(item.count_no_device)/(parseFloat(item.count_device)+parseFloat(item.count_no_device))) * 360;
          ctx.fillStyle = '#69aeff';
          ctx.moveTo(x0, y0);
          ctx.arc(x0, y0, radius, toRadian(startAngle), toRadian( startAngle+curAngle),true);
          ctx.fill();
        }
      },
      drawmonths(){
        var count;
        var now_month = this.currentInfo.date;
        var arr = this.info;
        var data=[];
        var xinforma =[];
        arr.forEach(function(element,index){
          data.unshift(element.count_all);
          var temp = element.date;
          var month = temp .split('-');
          if(now_month == element.date){
            count = arr.length - index - 1;
          }
          xinforma.unshift(month[1].replace(/\b(0+)/gi,"")+'月');
        });
        // console.log(data);
        // 获取上下文
        var a_canvas = document.getElementById('a_canvas');
        var context = a_canvas.getContext("2d");
        var  clientWidth = document.documentElement.clientWidth*window.devicePixelRatio;
//        //根据设计图中的canvas画布的占比进行设置
        var canvasWidth = Math.floor(clientWidth*690/750);
        var canvasHeight = Math.floor(clientWidth*500/750);
        a_canvas.style.transformOrigin = '0 0';
        a_canvas.style.transform = `scale(${1/window.devicePixelRatio},${1/window.devicePixelRatio})`;
        a_canvas.setAttribute('width',canvasWidth+'px');
        a_canvas.setAttribute('height',canvasHeight+'px');
        context.font=`${Math.floor(clientWidth*28/750)}px Arial`;
        context.clearRect(0,0,Math.floor(clientWidth*690/750),Math.floor(clientWidth*500/750));
        var gradient = context.createLinearGradient(0,0,0,300);
        context.fillStyle = gradient;
        context.fillRect(0,0,a_canvas.width,a_canvas.height);
        var realheight = a_canvas.height-45;
        var realwidth = a_canvas.width;
        // 描绘边框
        var grid_cols = data.length ;
//        var grid_rows = 4;
//        var cell_height = realheight / grid_rows;
        var cell_width = realwidth / grid_cols;
        var max_v =0;
        for(var i = 0; i<data.length; i++){
          if (data[i] > max_v) { max_v =data[i]};
        }
        max_v = max_v * 1.2;
        // 将数据换算为坐标
        var points = [];
        for( var i=0; i < data.length; i++){
          var v= data[i];
          var px = cell_width *　(i);
//          var px = Math.floor(clientWidth*690/750)
          var py = realheight - realheight*(v / max_v);
          //alert(py);
          points.push({"x":px,"y":py});
        }
        //绘制坐标图形
        for(var i in points){
          var p = points[i];
          context.beginPath();
          if(i != count){
            context.fillStyle="#8bc0fe";
          }else{
            context.fillStyle="#2a8cff";
          }
          let w = Math.floor(clientWidth*45/750)
          context.fillRect(p.x,p.y-15,w,realheight-p.y);
          context.fill();
        }
        //添加文字
        for(var i in points){
          var p = points[i];
          context.beginPath();
          if(i != count){
            context.fillStyle="#c9caca";
          }else{
            context.fillStyle="#2a8cff";
          }
          let w = Math.floor(clientWidth*45/750)
          context.fillText(data[i], p.x + w/2 - Math.floor(clientWidth*28/750)/2 , p.y-20);
          
        }

        for(var i in points){
          var p = points[i];
          context.beginPath();
          
          context.fillStyle="black";

          let w = Math.floor(clientWidth*45/750)
          context.fillText(xinforma[i],p.x - 1,realheight+25);
          
        }


      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #rd-text {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  #rd-text .text-content {
    width: 6rem;
    padding-bottom: 0.4rem;
    margin: 3.35rem auto auto;
    background: #fff;
    -webkit-border-radius: .2rem;
    -khtml-border-radius: .2rem;
    -moz-border-radius: .2rem;
    -ms-border-radius: .2rem;
    -o-border-radius: .2rem;
    border-radius: .2rem;
    position: relative;
  }
  #rd-text .text-content .i-line{
    height: .36rem;
    width: 1px;
    background-color: #fff;
    position: absolute;
    top: -0.36rem;
    right: .32rem;
    z-index: 101;
  }
  #rd-text .text-content .icon-close{
    color: #fff;
    position: absolute;
    top: -0.88rem;
    right: .06rem;
    z-index: 101;
  }
  #rd-text .text-content .rd-title{
    height: .9rem;
    line-height: .9rem;
    width: 100%;
    border-bottom: 1px solid #c9caca;
    font-size: .32rem;
    font-weight: bold;
    text-align: center;
  }
  .text-content .rd-ul{
    width: 100%;
    /*height: 1.9rem;*/
    padding: 0.45rem 0.55rem 0;
    box-sizing: border-box;
  }
  .text-content .rd-ul li{
    width: 100%;
    line-height: .47rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .text-content .rd-ul li i{
    display: inline-block;
    height: .12rem;
    width: .12rem;
    background: #fea4eb;
    margin-right: .2rem;
  }
  .text-content .rd-ul li .rd-ulsptitle{
    width: 4rem;
    font-size: .26rem;
    color: #9fa0a0;
    white-space: nowrap;
  }
  .text-content .rd-ul li p{
    display: inline-block;
    text-align: right;
    width: .85rem;
    font-size: .26rem;
    color: #9fa0a0;
  }
  .text-content .rd-ul li p span{
    color: #fea4eb;
  }
  .new-haveequ{
    color: #fea4eb;
    font-size: .28rem;
    font-weight: bold;
  }
  .new-noequ{
    color: #69aeff;
    font-size: .28rem;
    font-weight: bold;
  }
  .mon-haveequ{
    color: #fea4eb;
    font-size: .28rem;
    font-weight: bold;
  }
  .mon-noequ{
    color: #69aeff;
    font-size: .28rem;
    font-weight: bold;
  }
  .date{
    height: .72rem;
    background-color: #ffffff;
    border-bottom: 1px solid #c9caca;
    position: relative;
    line-height: 0;
  }
  .date .icon-calendar{
    position: absolute;
    right: 5%;
    top: .1rem;
  }
  .date .date-time{
    line-height: .72rem;
    font-size: .32rem;
    padding-left: 5%;
  }
  .date-ishide{
    width: 1.6rem;
    height: 3.6rem;
    position: absolute;
    top: .8rem;
    right: .15rem;
    z-index: 20;
    filter: drop-shadow(0 0 .06rem  #c9caca);
  }
  .date-ishide span{
    display: inline-block;
    border: .14rem solid #fff;
    border-top: .14rem solid transparent;
    border-right: .14rem solid transparent;
    border-left: .14rem solid transparent;
    position: absolute;
    left: 1rem;
    top: -0.27rem;
  }
  .date div ul{
    width: 1.6rem;
    height: 3.62rem;
    background-color: #fff;
  }
  .date div ul li{
    line-height: .6rem;
    color: #9fa0a0;
    font-size: .26rem;
    text-align: center;
  }
  .reportor-convas{
    height: 3.95rem;
    background-color: #fff;
    display: flex;
    margin-bottom: .2rem;
  }
  .convas-data{
    width: 3.75rem;
    height: 3.95rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .convas-data-box{
    height: 2.4rem;
    width: 2.2rem;
  }
  .convas-picture{
    width: 3.75rem;
    text-align: center;
    display: flex;
    align-items: center;
    font-size: .22rem;
    position: relative;
    color: #9fa0a0;
  }
  .count1{
    font-size: .32rem;
    width: 1.55rem;
    margin-top: .35rem;
    text-align: center;
    color: #3e3a39;
  }
  .count2{
    width: 1.55rem;
    margin-top: .15rem;
    text-align: center;
    font-size: .22rem;
  }
  .patientcount{
    height: 1.2rem;
    color: #3e3a39;
    font-size: .3rem;
    line-height: .44rem;
  }
  .patientcount .patientequ{
    color: #9fa0a0;
  }
  .patientcount .convasequ{
    font-size: .5rem;
    font-weight: bold;
    color: #69aeff;
  }
  .patientcount .convas-haveequ{
    color: #fe8adc;
  }
  .month-convas{
    height: 6rem;
    width: 7.5rem;
    overflow: hidden;
    background-color: #fff;
  }
  .month-title{
    line-height: .72rem;
    font-size: .32rem;
    padding-left: 5%;
    border-bottom: 1px solid #c9caca;
    margin-bottom: .2rem;
  }
  #a_canvas{
    margin-left: .6rem;
  }
  .convas-countall{
    width: 1.55rem;
    height: 1.55rem;
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    top: 1.2rem;
    left: .77rem;
    z-index: 10;
    text-align: center;
    font-size: .22rem;
    color: #9fa0a0;
  }
</style>
