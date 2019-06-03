import api from './index.js'
// mock 请求的配置
var rapnode = require('rap-node-plugin');
const  env = process.env.NODE_ENV;
global.RAP_FLAG = 1;  // 开启RAP
rapnode.config({
    host: '106.14.114.152',    //启动的服务主机
    port: '8080',           //端口号 
    mock: '/mockjsdata/',  //RAP前缀
})
function get (origin){
    if(env != 'development') return axiosGet(origin);
    if(origin.data && origin.data.mockProjectId){
        return mockGet(origin);
    }else{
        return axiosGet(origin);
    }   
}
function post(origin){
    if(env != 'development') return axiosPost(origin);
    if(origin.data &&  origin.data.mockProjectId){
        return mockGet(origin);
    }else{
        return axiosPost(origin);
    }
}

function mockGet(origin){
    return new Promise((resolve,reject)=>{
        rapnode.getRapData({
            url: origin.url, 
            projectId: origin.data.mockProjectId,
        }, function() {

        }, function(err, r) {
            if(err){
                reject(err);
            }else{
                resolve({data :r});
            }
        });
    })
}

function axiosGet({url,data}){
  return new Promise((resolve,reject)=>{
    api({url , data , method : 'get'})
    .then(res=>{resolve(res)})
    .catch(err=>{reject(err)})
  })
}
function axiosPost({url,data , headers}){
  return new Promise((resolve,reject)=>{
    if(headers){
        api({url , data , method : 'post' , headers })
        .then(res=>{resolve(res)})
        .catch(err=>{reject(err)})
    }else{
        api({url , data , method : 'post' })
        .then(res=>{resolve(res)})
        .catch(err=>{reject(err)})
    }  
  })
}

export{
    get , post
}