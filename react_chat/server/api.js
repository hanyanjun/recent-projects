const express  = require('express');
const userRouter = require("./user");
const  coolie = require('cookie-parser');
const bodyParser = require('body-parser');

// 新建app
const app = express();


app.use(coolie());
app.use(bodyParser.json());
app.use('/user',userRouter);

app.listen(9093,function(){
    console.log('node app start at port 9093')
})