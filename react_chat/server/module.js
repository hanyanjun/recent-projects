const mongoose = require('mongoose');
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


const moduls = {
    user : {
        "user" : {type :String , require: true},
        "pass" : {type :String , require: true},
        "type" : {type :String , require: true},
        "headImg" : {type :String}, //头像
        "desc": {type :String}, //简介
        "title" :  {type :String}, //想找的类型
        // 如果是甲方
        "company" :  {type :String},
        "money" :  {type :String},
        "require": {type : String}
    },
    chat : {

    }
}

for(let m in moduls){
    mongoose.model(m,new mongoose.Schema([moduls[m]]))
}

module.exports = {
    getModel : function(name){
        return mongoose.model(name);
    }
}