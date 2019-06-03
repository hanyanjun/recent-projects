import util from '../util'
import Cookies from 'js-cookie'
// import core from '@/api/core'
import axios from 'axios'
import {
  md5
} from './md5.js'
import {
  Message
} from 'element-ui'
export default {
  // 修改1
  // 400提示
  codeConfirm(data, This) {
    if (data.code === '401') {
      This.$message.error(data.messages)
      This.$router.push({
        path: '/'
      })
      return false
    } else if (data.code !== '200') {
      This.$message.error(data.messages)
      // This.$router.push({ path: '/' })
      return false
    }
  },
  arrToObj(data, obj) {
    if (Object.prototype.toString.call(data) != "[object Array]") return {};
    if (data.length == 0) return {};
    data.forEach((v, i) => {
      if (Object.prototype.toString.call(v) == '[object Object]') {

      }
    });
  },
  // 下拉部门childred=[]的处理
  findChildren(arr, key) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][key].length === 0) {
        arr[i].children = ''
      } else {
        this.findChildren(arr[i].children, key)
      }
    }
  },
  findChildrenIds(arr, key, value, callBack) {
    // var string = ''
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][key] === value) {
        // console.log(arr[i])
        // newArr.push(arr[i].parentId)
        // newArr.push(arr[i].id)
        let newVal = arr[i].text
        return callBack(newVal)
      } else {
        // let twoArr = []
        if (arr[i].children !== undefined) {
          this.findChildrenIds(arr[i].children, key, value, callBack)
        }
        // twoArr = arr[i].children.parentId
        // newArr.unshift(arr[i].parentId)
        // string = arr[i].parentId
      }
    }
  },
  // 上传限制
  // uploadLimit (file, This) {
  //   // util.uploadImgLimit(file)
  //   window.forUploadTransferValue = false
  //   setTimeout(() => {
  //     window.forUploadTransferValue = true
  //   }, 500)
  //   let testmsg = file.name.substring(file.name.lastIndexOf('.')+1)                 
  //   const extension1 = testmsg === 'jpg'  
  //   const extension2 = testmsg === 'jpeg'
  //   const extension3 = testmsg === 'png'  
  //   const isLt2M = file.size / 1024 / 1024 < 2  
  //   if (!((extension1) || (extension2) || (extension3))) {
  //     return Promise.reject(
  //       This.$message({
  //         message: '上传文件只能是jpg/jpeg/png 格式!',
  //         type: 'warning'
  //       })
  //     )
  //     return false
  //   }
  //   if (!isLt2M) {
  //     return Promise.reject(
  //       This.$message({
  //         message: '上传文件大小不能超过 2MB!',
  //         type: 'warning'
  //       })
  //     )
  //     return false
  //   }
  //   return true
  // },
  getNowDate(val) {
    Date.prototype.Format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }
    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth()
    val[0] = new Date(y, m, 1).Format('yyyy-MM-dd')
    val[1] = new Date(y, m + 1, 0).Format('yyyy-MM-dd')
    return val
  },
  // 加载img流
  getDownImgBlob(param, This) {
    axios.get('/admin/file/download/file', {
      params: {
        filePath: param
      },
      responseType: 'blob',
      data: {
        'filePath': param
      }
    }).then(function (response) {
      // 头部头像的初始化加载
      var blob = new Blob([response.data])
      var obj = {}
      obj.url = window.URL.createObjectURL(blob)
      This.push(obj)
    }).catch(util.errorHandle)
  },
  setTitle: val => (document.title = val),
  isProd: () => location.hostname === 'nova.blackfi.sh',
  isTest: () => location.hostname === 'nova-sit.blackfi.sh',
  isLocal: () => location.hostname === 'localhost' || location.hostname === '10.10.216.46',
  isNot403(res, route) {
    if (res.status === 403) {
      // util.loginFirst()
      console.log('我在403里面')
      Cookies.remove('nova')
      window.location.href = util.isLoginUrl() + '?source=' + util.isLoginUrlH5() + route
      // console.log('rrrrrrrrrrrrrrrrr', window.location.href = util.isLoginUrl() + '?source=' + util.isLoginUrlH5() + route)
    } else {
      return true
    }
  },
  errorHandle: res => {
    // console.log('res:', res, 'util-index')
  },
  getCookie: (name) => {
    return window.localStorage[name] || window.sessionStorage[name];
  },
  // 获取ticket
  getQueryString(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) {
      let cookieString = unescape(r[2])
      if (cookieString.charAt(cookieString.length - 1) === '/') {
        return cookieString.slice(0, -1)
      } else {
        return cookieString
      }
    }
    return null
  },
  setCookie(cname, cvalue, exdays) {
    // let d = new Date()
    // d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    // let expires = 'expires= ' + d.toUTCString()
    // document.cookie = cname + '=' + cvalue + ';' + expires
    window.localStorage[cname] = cvalue;
  },
  delCookie(name) {
    window.localStorage.removeItem(name);
  },
  isLogin: () => Cookies.get('token'),
  removeCookie: (name) => Cookies.remove(name),
  statusHandle: res => {
    // if (res.request.response.charAt(2) === '<') {
    //   util.goLogin()
    // }
    if (res.data.code === '9999') {
      alert(`后端返回: ${res.data.msg}`)
    }
    console.info('received:', res.data.data)
    if (res.data.data === undefined) {
      console.debug('res:', res)
    }
    window.line.animate(1, {}, function () {
      window.line.set(0)
    })
  },
  removeByValue(arr, val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        arr.splice(i, 1)
        break
      }
    }
  },
  // 检查长度
  checkLength: (maxLength, val) => {
    return util.countLength(val) <= maxLength
  },
  // 用于检查url里面？后面的参数的值是什么
  getArgs: name => {
    let args = {}
    if (location.href.search(/\?/) !== -1) {
      var arr = location.href.split('?')[1].split('&')
      for (var item of arr) {
        if (item.indexOf('=') > 0) {
          args[item.split('=')[0]] = item.split('=')[1]
        }
      }
      return args
    }
  },
  format: () => {
    //shijianchuo是整数，否则要parseInt转换
    var time = new Date();
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return `${y}-${m}-${d} ${h}:${mm}:${s}`;
  },
  fullScreen: (el) => {
    var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen,
      wscript;
    if (typeof rfs != "undefined" && rfs) {
      rfs.call(el);
      return;
    }
    if (typeof window.ActiveXObject != "undefined") {
      return;
      try {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript) {
          wscript.SendKeys("{F11}");
        }
      } catch (err) {

      }
    }
  },
  exitScreen: () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    if (typeof cfs != "undefined" && cfs) {
      cfs.call(el);
    }
  },


 timestampToTime :(timestamp)=> {
   if(!timestamp) return '';
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate();
    D = D > 9 ? D + ' ' : '0'+D + ' '; 
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    s = s > 10 ? s : '0'+s;
    return Y+M+D+h+m+s;
},
  // 生成sign
  // params说明
  // methos  : get  post  小写
  // body : {a : 1 , b : 2}   如果是formdata类型该参数为{} 其他为对象key-value形式
  newHeadersSign: (methods, body) => {
    let str = '';
    if (body) {
      if (methods == 'get') {
        // 获取所有key值
        if (Object.prototype.toString.call(body) == '[object Object]') {
          let keys = Object.keys(body);
          let keysSort = keys.sort();
          keysSort.forEach(v => {
            str = str + `&${v}=${body[v] || ''}`;
          });
          str = str.substr(1, str.length - 1);
        }
      } else {
        str = JSON.stringify(body);
      }
    }
    let time = String(Date.parse(new Date()) + global.BASETIME).substr(0, 10);
    return `${time}-` + (md5(`${str};${b64DecodeUnicode('MTIzNDU2')}-${time}`)).toLowerCase();
  },
  b64DecodeUnicode: (str) => {
    return decodeURIComponent(atob(str).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  },
  b64EncodeUnicode: (str) => {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
  },
  userAgentType : ()=>{
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
      // window.location.href="移动端url";
      return("mobile")
    } else {
      // window.location.href="pc端url"; 
      return("pc")
    }
  },
  
  numToText: (n)=>{
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
    return "数据非法";
    var unit = "千百拾亿千百拾万千百拾元角分", str = "";
        n += "00";
    var p = n.indexOf('.');
    if (p >= 0)
        n = n.substring(0, p) + n.substr(p+1, 2);
        unit = unit.substr(unit.length - n.length);
    for (var i=0; i < n.length; i++)
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
    return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");   
  }
}

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}
