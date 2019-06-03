const express  = require('express');
const mongoose = require('mongoose');

const userRouter = require("./user");

// 新建app
const app = express();


app.use()

/** 
 * 1. 链接数据库
 * 2. 定义文档模型（类似mysql中的 表的概念；Schema model 新建模型）
 * 3. 增删改查 create，remove，update，Find 和 findOne  （find方法：如果查询所有那么第一个参数为{}即可；）
 * 
 * 
 * 
 * */ 
// 链接mongodb
// 链接mongo 并且使用demo这个集合  （如果没有这个集合那么会自动新建）
const DB_URL = 'mongodb://127.0.0.1:27017/demo';
mongoose.connect(DB_URL);
mongoose.connection.on('connected',function(){
    console.log('mongodb connect success')
})

// 类似于mysql的表  mongo里有文档、字段概念
const User = mongoose.model('user', new mongoose.Schema({
    user : {type : String, require : true},
    age : {type : Number , require : true}
}))

// User.create({
//     user : '小c',
//     age : 15
// },function(err,doc){
//     if(!err){
//         console.log(doc);
//     }else{
//         console.log(err);
//     }
// })
app.get('/',function(req,res){
    res.send('<h1>server1</h1>')
})
app.get('/data',function(req,res){
    User.findOne({user : 'imooc'},function(err,doc){
        res.json(doc);
    })
})
app.get('/delete',function(req,res){
    User.remove({age : 15},function(req,doc){
        res.json(doc);
    })
})
app.get('/update',function(req,res){
    User.update({user : 'imooc'},{'$set': {age : 26}},function(req,doc){
        res.json(doc);
    })
})
app.get('/find',function(req,res){
    User.find({},function(req,doc){
        res.json(doc);
    })
})
app.get('/findOne',function(req,res){
    User.findOne({user : 'imooc'},function(req,doc){
        res.json(doc);
    })
})
app.listen(9093,function(){
    console.log('node app start at port 9093')
})