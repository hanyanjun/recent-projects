const express = require("express");
const Router = express.Router();
const model = require("./module");
const utils = require('utility');
const User = model.getModel('user');
Router.get("/info",function(req,res){
    // 获取cookie
    const {userId} = req.cookies;
    if(!userId){
       return  res.json({code : '1', messages : '未登录'})
    }
    User.findOne({_id : userId},function(err,doc){
        if(err){
            return res.json({code : 500, messages : '后端出错了'})
        }
        if(!doc.headImg){
            return  res.json({code : '2',  data : doc })
        }
        return  res.json({code : 200 , data : doc});
    })
})
Router.post('/update',function(req,res){
    const {userId} = req.cookies;
    if(!userId){
        res.json({code : '1', messages : '未登录'})
    }
    const  body = req.body;
    User.findByIdAndUpdate(userId,body,function(err,doc){
        const data =  Object.assign({},{
            user : doc.user,
            type : doc.type,  
        },body)
        return res.json({code : 200 ,data });
    })
})
Router.post('/register',function(req,res){
    const {user,pass,type} = req.body;
    User.findOne({'user' : user},function(err,doc){
        if(doc){
            return res.json({code : 3 , messages : '用户名重复'})
        }
        const userModel = new User({user,type,pass : md5Pwd(pass)});
        userModel.save(function(err,doc){
            if(err){
                return res.json({code : 500, messages : '后端出错了'})
            }
            res.cookie("userId", doc._id);
            return res.json({code : 200 , messages : '注册成功'})
        })
        // User.create({user,pass : md5Pwd(pass),type},function(err,doc){
        //     if(err){
        //         return res.json({code : 500, messages : '后端出错了'})
        //     }
        //     return res.json({code : 200 , messages : '注册成功'})
        // })
    })
})
Router.post('/login',function(req,res){
    const {user,pass} = req.body;
    User.findOne({'user': user } , function(err,doc){
        if(doc){
            if(doc.pass == md5Pwd(pass)){
                res.cookie("userId", doc._id);
                return res.json({code : 200 , data : doc})
            }else{
                return res.json({code : 10002 , messages : "账号密码不匹配"})
            }
        }else{
            return res.json({code : 10001 , messages : "该账号未注册"})
        }
    })
})
Router.get("/list",function(req,res){
    const {type} = req.query;
    User.find({type},function(err,doc){
        return res.json({code : 200 , data : doc});
    })
})
Router.get("/listAll",function(req,res){
    User.find({},function(err,doc){
        return res.json({code : 200 , data : doc});
    })
})
function md5Pwd(pwd){
    const salt = '123456@aAa.Com';
    return utils.md5(utils.md5(pwd + salt));

}


module.exports = Router;