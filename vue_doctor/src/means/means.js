/**
 * Created by HIWEIN008 on 2017/6/29.
 */
import Vue from 'vue'
 class Means{
  //对连接地址参数的分析
  analysisURL(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return null;
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

//  时间转化为数字
  timeToNum(value) {
    switch (value) {
      case '上午':
        return 1;
        break;
      case '下午':
        return 2;
        break;
      case '晚上':
        return 3;
        break;
    }
  }

//数字转换为对应周期
  numToday(value) {
    if(value){
      value = value.toString();
      switch (value) {
        case '1':
          return '周一';
          break;
        case '2':
          return '周二';
          break;
        case '3':
          return '周三';
          break;
        case '4':
          return '周四';
          break;
        case '5':
          return '周五';
          break;
        case '6':
          return '周六';
          break;
        case '7':
          return '周日';
          break;
      }
    }
  }
  //周期转换为数字
  dayTonum(value) {
    value = value.toString();
    switch (value) {
      case '周一':
        return '1';
        break;
      case '周二':
        return '2';
        break;
      case '周三':
        return '3';
        break;
      case '周四':
        return '4';
        break;
      case '周五':
        return '5';
        break;
      case '周六':
        return '6';
        break;
      case '周日':
        return '7';
        break;
    }
  }


  //数字转化为上下午
  numTotime(value) {
    switch (value) {
      case '1':
        return '上午';
        break;
      case '2':
        return '下午';
        break;
      case '3':
        return '晚上';
        break;
    }
  }

  // 时间戳转时间
  timestampTotime(t) {
    if(/-/g.test(t)) return t;
    if(t){
      let time = t.toString();
      if (time.length == 10) {
        time += '000';
      }
      time = new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/, ' ');
      time = time.replace(/GMT\+8/,'');
      return time;
    }
  }

  // 生成从当前日期开始的数组
  dayArr() {
    let currrentDay = parseInt((new Date()).getDay());
    // let currrentDay = 0;
    let arr = [];
    for (let i = currrentDay; i < 7; i++) {
      if (i == 0) {
        arr.push(7);
      } else {
        arr.push(i);
        if (i == 6) {
          i = -1;
        }
      }
      if (arr.length == 7) {
        break;
      }
    }
    return arr;
  }

  bubbleSort(arr){
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - 1 - i; j++) {
        if (arr[j].newTime < arr[j+1].newTime) {
          var temp = arr[j+1];
          arr[j+1] = arr[j];
          arr[j] = temp;
        }
      }
    }
    return arr;
  }

  //通讯录颜色
  conColor(index){
    let result = (index+1)%7;
    switch (result){
      case 1 :
        return '#0067ED';
        break;
      case 2:
        return '#259ADE';
        break;
      case 3:
        return '#00A4FF';
        break;
      case 4:
        return '#12B7F5';
        break;
      case 5:
        return '#00C8DC';
        break;
      case 6:
        return '#2AD2C8';
        break;
      case 7:
        return '#0B92F7';
        break;
    }
  }


  routeReplace(route,string1,string2){
    let reg = new RegExp(string2);
    return route.replace(string1,string2);
  }

 changePX(value){
   let  clientWidth = document.documentElement.clientWidth;
   return Math.floor(clientWidth*parseInt(value)/750);
 }

 picker3(v1,v2){
   Vue.prototype.$picker3 = new mui.DtPicker({
     "type" : "date",
     beginDate: new Date(new Date().getFullYear() + v1,new Date().getMonth(),new Date().getDate()),//设置开始日期
     endDate: new Date(new Date().getFullYear() + v2,new Date().getMonth(),new Date().getDate())//设置结束日期
   })
 }
  //base64转blob
  BaseToBlob(v){
    if(v){
      var arr = v.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }
  }
//  是否是有效的小数
   to_float(v,len){
     if (!/[0|1|2|3|4|5|6|7|8|9|.]/.test(v[v.length - 1])){
       v = v.substring(0, v.length - 1);
     }
     if(/./.test(v)){
       if(v[0] == '.'){
         v =   '0.';
       };
       if(v[v.length - 1] == '.' && v[v.length - 2] == '.'){
         v =  v.substring(0,v.length - 1);
       };
       let arr =v.split('.');
       if(arr.length >= 2){
         if(len){
           v = arr[0] + '.'+arr[1].substr(0,len);
         }else{
           v = arr[0] + '.'+arr[1];
         }
       };
     }
     if(v > '99999999999'){
       v = '99999999999';
     }
     return v;
   }

   n_br(v){
     return v.replace(/\n/g,'<br>');
   }

   br_n(v){
    return v.replace(/<br>/g,'\n');
   }


   dateCeilTen(v){
    let t = new Date(v);
     let m0 = t.getFullYear();//年
     let m1 = t.getMonth()+1;//月
     let m2 = t.getDate();//日
     let m3 = t.getHours();//时
     let m4 = t.getMinutes();//分
     //分
     if(m4 > 0 && m4 < 10){
       m4 = 10;
     }else if(m4 >  10 && m4 < 20){
       m4 = 20;
     }else if(m4 >  20 && m4 < 30){
       m4 = 30;
     }else if(m4 >  30 && m4 < 40){
       m4 = 40;
     }else if(m4 >  40 && m4 < 50){
       m4 = 50;
     }else if(m4 >  50 && m4 < 60){
       m4 = 0;
       //时
       if(m3 == 23){
         m3 = 0;
         //日
         if(m2 > 27){
           //是否为2月份
           if(m1 == 2){
             //   判断是否为闰年
             if((m0 % 4 == 0 && m0 %100 != 0) || (m0 % 400) == 0){
               //   为闰年
               if( 29 == m2){
                 m2 = 1;
                 if(12 == m1){
                   m1 = 1;
                   ++m0;
                 }else{
                   ++m1;
                 }
               }else{
                 ++m2;
               }
             }else{
               if( 28 == m2){
                 m2 = 1;
                 if(12 == m1){
                   m1 = 1;
                   ++m0;
                 }else{
                   ++m1;
                 }
               }else{
                 ++m2;
               }
             }
           }else{
             //是否有31天
             if(m2 == 30){
               if(m1 ==  1 || 3 == m1 ||5 == m1 || 7 == m1 || 8 == m1 || 10 == m1 || 12 == m1){
                 ++m2;
               }else{
                 m2 = 1;
                 if(12 == m1){
                   m1 = 1;
                   ++m0;
                 }else{
                   ++m1;
                 }
               }
             }
             if(m2 == 31){
               m2 = 1;
               if(12 == m1){
                 m1 = 1;
                 ++m0;
               }else{
                 ++m1;
               }
             }
           }
         }else{
           ++m2;
         }
       }else{
         ++m3;
       }
     }
     return  `${m0}/${m1}/${m2} ${m3}:${m4}:00`;
   }




}



//版本控制
let version = window.localStorage['hwVersion'];
 if(typeof version == 'undefined' || version != '1.0'){
   window.localStorage.clear();
   window.localStorage['hwVersion'] = '1.0';
   window.location.reload();
 }










//定义全局变量
global.TOKEN = window.localStorage['token'] ;
global.REFRESHTOKEN = window.localStorage['refreshToken'];
const means = new Means();
let result = means.analysisURL('tokenData');
if (result){
  let result1 = JSON.parse(result);
  window.localStorage['token'] = result1.token;
  TOKEN =  result1.token;
  window.localStorage['refreshToken'] = result1.refreshToken;
  REFRESHTOKEN = result1.refreshToken;
  // window.location.reload();
}
//删除数组中某个指定元素
// Array.prototype.removeByValue = function(val) {
//   let arr = [];
//   for(var i=0; i<this.length; i++) {
//     if(this[i] != val) {
//       arr.push(this[i]);
//       this.splice(i, 1);
//       break;
//     }
//   }
//   return arr;
// }
Array.prototype.removeByValue = function(val) {
  console.log(val);
  let arr = [];
  for(var i=0; i<this.length; i++) {
    if(this[i] != val) {
      arr.push(this[i]);
      // this.splice(i, 1);
      // break;
    }
  }
  return arr;
}

Date.prototype.ceilDate = function(v)
{
  var myDate = this;
  console.log(v);
  let m0 = myDate.getFullYear();//年
  let m1 = myDate.getMonth()+1;//月
  let m2 = myDate.getDate();//日
  let m3 = myDate.getHours();//时
  let m4 = myDate.getMinutes();//分
  //分
  if(m4 > 0 && m4 < 10){
    m4 = 10;
  }else if(m4 >  10 && m4 < 20){
    m4 = 20;
  }else if(m4 >  20 && m4 < 30){
    m4 = 30;
  }else if(m4 >  30 && m4 < 40){
    m4 = 40;
  }else if(m4 >  40 && m4 < 50){
    m4 = 50;
  }else if(m4 >  50 && m4 < 60){
    m4 = 0;
    //时
    if(m3 == 23){
      m3 = 0;
      //日
      if(m2 > 27){
        //是否为2月份
        if(m1 == 2){
        //   判断是否为闰年
           if((m0 % 4 == 0 && m0 %100 != 0) || (m0 % 400) == 0){
           //   为闰年
             if( 29 == m2){
               m2 = 1;
               if(12 == m1){
                 m1 = 1;
                 ++m0;
               }else{
                 ++m1;
               }
             }else{
               ++m2;
             }
           }else{
             if( 28 == m2){
               m2 = 1;
               if(12 == m1){
                 m1 = 1;
                 ++m0;
               }else{
                 ++m1;
               }
             }else{
               ++m2;
             }
           }
        }else{
           //是否有31天
           if(m2 == 30){
               if(m1 ==  1 || 3 == m1 ||5 == m1 || 7 == m1 || 8 == m1 || 10 == m1 || 12 == m1){
                  ++m2;
               }else{
                 m2 = 1;
                 if(12 == m1){
                   m1 = 1;
                   ++m0;
                 }else{
                   ++m1;
                 }
               }
           }
           if(m2 == 31){
             m2 = 1;
             if(12 == m1){
               m1 = 1;
               ++m0;
             }else{
               ++m1;
             }
           }
        }
      }else{
        ++m2;
      }
    }else{
       ++m3;
    }
  }
  return  `${m0}-${m1}-${m2} ${m3}:${m4}:00`;
}


Date.prototype.toArray = function(v)
{
  var myDate = this;
  let m0 = myDate.getFullYear();//年
  let m1 = myDate.getMonth()+1;//月
  let m2 = myDate.getDate();//日
  let m3 = myDate.getHours();//时
  let m4 = myDate.getMinutes();//分
  let y =  (new Date()).getFullYear();
  //目前之后今年明年两种情况  姑且先这么做
  return  [`${m0}年${m1}月${m2}日`,`${m3}点`,`${m4 == 0 ? '00' : m4}分`];
}


export default means;
