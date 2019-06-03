(function (win) {
    // var viewport = document.querySelector("meta[name=viewport]");
    // //下面是根据设备像素设置viewport
    // if (window.devicePixelRatio == 1) {
    //   viewport.setAttribute('content', 'width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no');
    // }
    // if (window.devicePixelRatio == 2) {
    //   viewport.setAttribute('content', 'width=device-width,initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no');
    // }
    // if (window.devicePixelRatio == 3) {
    //   viewport.setAttribute('content', 'width=device-width,initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no');
    // }
    var docEl = document.documentElement;
    var fontsize = win.innerWidth / 7.5 + 'px';
    //设置dpr属性
    // docEl.setAttribute('data-dpr',window.devicePixelRatio);
    docEl.setAttribute('data-font','1');
    docEl.style.fontSize = fontsize;
  
    /*禁止微信安卓下字体放大*/
    if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
      handleFontSize();
    } else {
      if (document.addEventListener) {
        document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
      } else if (document.attachEvent) {
        document.attachEvent("WeixinJSBridgeReady", handleFontSize);
        document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
      }
    }
  
    function handleFontSize() {
      // 设置网页字体为默认大小
      WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });
      // 重写设置网页字体大小的事件
      WeixinJSBridge.on('menu:setfont', function() {
        WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });
      });
    }
  })(window);
  