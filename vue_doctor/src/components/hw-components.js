/**
 * Created by Hardy on 2017/7/7.
 */
//confirm弹窗
class M{
  confirm(config,payload){
    return new Promise((resolve,reject)=>{
      let body = document.querySelector('body');
      let mask = createDom('class','hw-message_box_window_confirm','div');
      let content = createDom('class','hw-message_box_content','div');
      let text = createDom('class','hw-message_box_text','div');
      let buttons = createDom('class','hw-message_box_buttons','div');
      let cancle = createDom('class','cancle','button');
      let submit = createDom('class','confirm','button');
      text.innerHTML = config;
      submit.innerText = '确认';
      cancle.innerText = '取消';
      content.appendChild(text);
      if(payload && payload.btn){
        submit.innerText = payload.btn[0];
        cancle.innerText = payload.btn[1];
        if(payload.tip){
          let tip = createDom('class','hw-message_box_text_tip','div');
          text.className = 'hw-message_box_text_t';
          tip.innerHTML = payload.tip;
          content.appendChild(tip);
        }
      }
      cancle.onclick = ()=>{
        body.removeChild(mask);
        reject( '取消')
      }
      submit.onclick = ()=>{
        body.removeChild(mask);
        resolve('确定')
      }
      buttons.appendChild(cancle);
      buttons.appendChild(submit);
      content.appendChild(buttons);
      mask.appendChild(content);
      body.appendChild(mask);
      function createDom(type,name,dom) {
        let  a = document.createElement(dom);
        a.setAttribute(type,name);
        return a ;
      }
    })
  }

  prompt(config){
    return new Promise((resolve,reject)=>{
      let body = document.querySelector('body');
      this.body = body;
      let mask = createDom('class','hw-prompt','div');
      this.mask = mask;
      let content = createDom('class','hw-prompt-content','ul');
      let title = createDom('class','hw-prompt-title','li');
      title.innerText = config.title;
      let text = createDom('class','hw-prompt-text','input');
      text.setAttribute('placeHolder',config.placeHolder);
      text.setAttribute('type',config.type ? config.type : 'text');
      let buttons = createDom('class','hw-prompt-button','li');
      let cancle = createDom('class','hw-prompt-cancle','button');
      let submit = createDom('class','confirm','button');
      submit.innerText = '确认';
      cancle.innerText = '取消';
      cancle.onclick = ()=>{
        body.removeChild(mask);
        reject( '取消')
      }
      submit.onclick = ()=>{
        let isClose = config.confirm(text.value);
        if(isClose){
          body.removeChild(mask);
          resolve();
        }
      }
      buttons.appendChild(cancle);
      buttons.appendChild(submit);
      content.appendChild(title);
      content.appendChild(text);
      content.appendChild(buttons);
      mask.appendChild(content);
      body.appendChild(mask);
      function createDom(type,name,dom) {
        let  a = document.createElement(dom);
        a.setAttribute(type,name);
        return a ;
      }
    })
  }






}










//confirm弹窗（知道了）
class M2{
  constructor(){
    this.mask = '';
  }
  confirm(config){
    return new Promise((resolve)=>{
      let body = document.querySelector('body');
      let mask = createDom('class','hw-message_box_window_confirm','div');
      this.mask = mask;
      let content = createDom('class','hw-message_box_content2','div');
      let text = createDom('class','hw-message_box_text2','div');
      let buttons = createDom('class','hw-message_box_buttons','div');
      let cancle = createDom('class','cancle2','button');
      text.innerHTML = config;
      cancle.innerText = '知道了';
      cancle.onclick = ()=>{
        body.removeChild(mask);
        resolve( '知道了')
      }

      buttons.appendChild(cancle);
      content.appendChild(text);
      content.appendChild(buttons);
      mask.appendChild(content);
      body.appendChild(mask);
      function createDom(type,name,dom) {
        let  a = document.createElement(dom);
        a.setAttribute(type,name);
        return a ;
      }
    })
  }
  close(){
    if(this.mask){
      let body = document.querySelector('body');
      body.removeChild(this.mask);
    }
  }


}






//Toast组件
//参数列表
//1.message ： 提示信息
//2.delay ： 时间间隔
//3.icon :  图标
//4.position : 位置  top middle bottom



class T{
   constructor(config){
      this.config = config;
      this.created();
   }
   created(){
      let config = this.config;
      let body = document.querySelector('body');
      let mask = createDom('class','hw-toast-mask','div');
     this.mask = mask;
     let content;
      let message = createDom('class','hw-toast-text','span');
     // 提示信息的位置
     if(config.position){
       if(config.position == 'top'){
         content = createDom('class','hw-toast-content_top','div');
       }else if(config.position == 'bottom'){
         content = createDom('class','hw-toast-content_bottom','div');
       }else{
         content = createDom('class','hw-toast-content','div');
       }
     }else{
       content = createDom('class','hw-toast-content','div');
     }
      if(config.icon){
        let icon = createDom('class',config.icon,'i');
        content.appendChild(icon);
      }

      if(typeof config == 'string'){
        message.innerHTML =config;
      }else{
        message.innerHTML = config.message;
      }
      content.appendChild(message);
      body.appendChild(mask);
      mask.appendChild(content);
      if(config.delay){
         if(config.delay < 0){
             console.log('不移除提示框!');
         }else if(config.delay > 0){
           setTimeout(()=>{
             this.close();
           },config.delay);
         }
      }else{
        setTimeout(()=>{
          this.close();
        },2500)
      }
   }
   close(){
     let body = document.querySelector('body');
     body.removeChild(this.mask);
   }
}
// console.log(new Toast( '操作失败'));

//Indicator  加载提示框
class I{
  open(config){
     return new Promise((resolve)=>{
       if(!document.documentElement.contains(this.mask)){
         let body = document.querySelector('body');
         let mask = createDom('class','hw-indicator-mask','div');
         this.body = body;
         this.mask = mask;
         let content = createDom('class','hw-indicator-content','div');
         let message = createDom('class','hw-indicator-text','span');

         let icon = createDom('class',config.icon + ' hw-indicator-icon','i');
         body.appendChild(mask);
         mask.appendChild(content);
         let loading = createDom('class','hw-indicator-loading','div');
         let img = createDom('class','hw-indicator-logo','img');
         img.src = LOGO;
         loading.appendChild(img);
         let img1 = createDom('class','hw-indicator-circle','img');
         img1.src = CIRCLE;
         loading.appendChild(img1);
         content.appendChild(loading);
         if(config){
           if(typeof config == 'string'){
             message.innerText =config;
           }else{
             message.innerText = config.message;
           }
           content.appendChild(message);
         }
         resolve();
       }
     })
  }
  close(){
      let body = this.body;
      let mask = this.mask;
      if(document.documentElement.contains(this.mask) ){
        body.removeChild(mask);

      }
  }
}










function createDom(type,name,dom) {
  let  a = document.createElement(dom);
  a.setAttribute(type,name);
  return a ;
}





const MessageBox = new M();
const MessageBox2 = new M2();
const Toast = function (config) {
  return new T(config);
}
const Indicator = new I();
export {
  MessageBox,
  MessageBox2,
  Toast,
  Indicator
}

// export default  new MessageBox();
