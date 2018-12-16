const express=require('express');
const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;
const bodyParser=require('body-parser');

let Router=express.Router();

Router.route('/:id')
    .get((req,res)=>{
        let {qty,page}=req.query;
        // 查询管理员列表，渲染页面
        MongoClient.connect('mongodb://127.0.0.1:27017',(error,database)=>{
            if(error){
                throw error;
            }

            let db=database.db('xiu');
            let admin=db.collection('admin');
            let data;
            let total;

            admin.find().toArray((error,result)=>{
                total=result.length;
            });

            admin.find().limit(qty*1).skip(page*1).toArray((error,result)=>{

                if(result){
                    data={
                        code:1,
                        total:total,
                        data:result,
                        msg:'ok'
                    }
                }else{
                    data={
                        code:0,
                        total:0,
                        data:error,
                        msg:'sorry'
                    }
                }
                res.send(data);
            });

            // admin.find().toArray((error,result)=>{
            //     total=result.length;

            //     if(result){
            //         data={
            //             code:1,
            //             total:total,
            //             data:result,
            //             msg:'ok'
            //         }
            //     }else{
            //         data={
            //             code:0,
            //             total:0,
            //             data:error,
            //             msg:'sorry'
            //         }
            //     }
            //     res.send(data);
            // });
        });
    })
    

    // 点击添加按钮，添加管理员  

// Router.get('/:checkAdmin',(req,res)=>{
//     MongoClient.connect('mongodb://127.0.0.1:27017',(error,database)=>{
//         if(error){
//             throw error;
//         }

//         let db=database.db('xiu');
//         let admin=db.collection('admin');
//         admin.find().toArray((error,result)=>{
//             let data;
//             if(result){
//                 data={
//                     code:1,
//                     data:result,
//                     msg:'ok'
//                 }
//             }else{
//                 data={
//                     code:0,
//                     data:error,
//                     msg:'sorry'
//                 }
//             }
//             res.send(data);
//             console.log(data);
//         });
//     });
// });


module.exports=Router;