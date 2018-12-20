const express = require('express');

const admin = require('./admin');
const addAdmin = require('./addAdmin');
const good = require('./good');
const upload=require('./upload');
let Router = express.Router();

Router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");

    // 跨域请求CORS中的预请求
    if(req.method=="OPTIONS") {
      res.send(200);/*让options请求快速返回*/
    } else{
      next();
    }
});

Router.use('/admin', admin);
Router.use('/addAdmin', addAdmin);
Router.use('/good', good);
Router.use('/upload',upload);

module.exports = Router;