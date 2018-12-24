// 利用Express中的Router实现路由模块化
const express = require('express');

const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const ObjectID=require("mongodb").ObjectID;

// 获取Mongo客户端
const MongoClient = mongodb.MongoClient;
let Router = express.Router();

let urlencodedParser = bodyParser.urlencoded({
    extended: false
});

Router.get('/',(req,res)=>{
     let qty= (req.query.qty)*1;
       let page= (req.query.page)*1;
    MongoClient.connect('mongodb://localhost:27017',(err, database)=>{
        //连接成功后执行这个回调函数
        if(err) throw err;

        // 使用某个数据库，无则自动创建
        let db = database.db('xiu');

        // 使用集合
        let user = db.collection('user');
        // 查询是否存在数据
        let num="";
        // num = user.find().count();
        // console.log(num);
        user.find().toArray((err,result)=>{
                 
                 num=result.length;
         })
        user.find().limit(qty).skip((page-1)*qty).toArray((err,result)=>{
          // .toArray((err,result)=>{//不用也行 本意是想转为数组 但是会自己转为数组
            if(result){
                res.send({
                    code:0,
                    data:result,
                    total:num
                })
            }else{
                res.send({
                    code:1,
                    data:[],
                    total:0
                    })
                }
            });
 
        // 关闭数据库，避免资源浪费
             database.close();
            });
        });



Router.route('/:id')
      .delete((req,res)=>{
            let id=req.params.id;
            // console.log(id);

      MongoClient.connect('mongodb://localhost:27017',(err, database)=>{
        //连接成功后执行这个回调函数
        if(err) throw err;

        // 使用某个数据库，无则自动创建
        let db = database.db('xiu');

        // 使用集合
        let user = db.collection('user');
        user.deleteOne({"_id":new ObjectID(id)},(err,result)=>{


        // db.getCollection('user').remove({"_id" : ObjectId("5c1390c2cc4ee8a86ce3a3bd")})
            if(result){
                res.send({
                    code:1,
                    ID:id,
                    msg:"删除成功"
                })
            }else{
                res.send({
                    code:1,
                    msg:"没有找到这条数据",
                     ID:id
                   
                })
            }
                

        });



        // res.send({
        //     path:'删除商品',
        //     username:req.params.id//可以看后端是否能看到
        // })
    })

 })


    .put((req,res)=>{
            let usernames=req.params.id;
            // console.log(id);
              
       MongoClient.connect('mongodb://localhost:27017',(err, database)=>{
        //连接成功后执行这个回调函数
        if(err) throw err;

        // 使用某个数据库，无则自动创建
        let db = database.db('xiu');

        // 使用集合
        let user = db.collection('user');
        user.find({username :usernames}).toArray((err,result)=>{
         //     res.send({
         //    path:'删除商品',
         //    username:req.params.id//可以看后端是否能看到
         // })
            if(result){
                res.send({
                    code:0,
                    data:result,
                    username:usernames
                })
            }else{
                res.send({
                    code:1,
                    data:error,
                         
                })
            }
        });
    })

 })




Router.post('/addmember',urlencodedParser,(req,res)=>{
    // 获取新注册用户信息
    let {
        username,
        gender,
        phone,
        email,
        address,
        password
    } = req.body;
    // 连接数据库
    MongoClient.connect('mongodb://127.0.0.1:27017',(error,database) => {
        if(error) {
            throw error;
        }
        // 打开数据库，找到集合
        let db = database.db('xiu');
        let user = db.collection('user');

        // 插入新数据
        user.insert({
            username: username,
             gender:gender,
            tel:phone,
            email:email,
            address:address,
            password:password,
                
            time: new Date()
        }, (error, result) => {
            let data;
            if(error) {
                data = {
                    code: 0,
                    data: [],
                    msg: error
                }
            } else {
                data = {
                    code: 1,
                    data: result.ops,
                    msg: 'success'
                }
            }
            res.send(data);
        });

        database.close();
    });
});







// 通过_id查询
Router.get('/checkid', (req, res) => {
    // 获取用户名
    let {
        _id
    } = req.query;
    // 连接数据库
    MongoClient.connect('mongodb://127.0.0.1:27017', (error, database) => {
        if(error) {
            throw error;
        }
        // 找到对应数据库
        let db = database.db('xiu');
        // 找到所需集合
        let user = db.collection('user');
        // 查询数据库
        user.findOne({
            _id: new ObjectID(_id)
        }, (error, result) => {
            if(result) {
                res.send({
                    code: 1,
                    data: result,
                    msg: 'have'
                })
            } else {
                res.send({
                    code: 0,
                    data: [],
                    msg: 'none'
                })
            }
        });

        // 关闭数据库，避免资源浪费
        database.close();
    });
});




// 更新
Router.post('/update', urlencodedParser, (req, res) => {
    // 获取新注册用户信息
    let {
        username,
        password,
    
        email,
        _id
    } = req.body;
    // 连接数据库
    MongoClient.connect('mongodb://127.0.0.1:27017', (error, database) => {
        if(error) {
            throw error;
        }
        // 打开数据库，找到集合
        let db = database.db('xiu');
        let admin = db.collection('user');

        // 插入新数据
        admin.update({
            _id: new ObjectID(_id)
        }, {
            $set: {
                username: username,
                password: password,
             
                email: email,
               
            }
        }, (error, result) => {
            let data;
            if(error) {
                data = {
                    code: 0,
                    data: [],
                    msg: error
                }
            } else {
                data = {
                    code: 1,
                    data: result,
                    msg: 'success'
                }
            }
            res.send(data);
        });

        database.close();
    });
});




module.exports = Router;