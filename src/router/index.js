//把路由封装成模块
const express = require('express');

// 引入单独路由模块
const userRouter = require('./user');
const goodsRouter = require('./orderlist')
const categoryRouter = require('./category')
const memberRouter = require('./member')

let Router = express.Router();

// 关于用户的路由
Router.use('/user',userRouter);

// 关于订单的路由
Router.use('/orderlist',goodsRouter);

// 关于商品分类的路由
Router.use('/category',categoryRouter)

// 关于会员的路由
Router.use('/member',memberRouter);

module.exports = Router;