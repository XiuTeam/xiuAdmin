const express = require('express');

const admin = require('./admin');
const addAdmin = require('./addAdmin');
const good = require('./good');
const upload=require('./upload');
const userRouter = require('./user');
const goodsRouter = require('./orderlist')
const categoryRouter = require('./category')
const memberRouter = require('./member')
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

// 关于用户的路由
Router.use('/user',userRouter);

// 关于订单的路由
Router.use('/orderlist',goodsRouter);

// 关于商品分类的路由
Router.use('/category',categoryRouter)

// 关于会员的路由
Router.use('/member',memberRouter);

module.exports = Router;