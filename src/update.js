// 引入mongodb
const mongodb=require('mongodb');
// 获取mongo客户端
const MongoClient=mongodb.MongoClient;

// 连接数据库
MongoClient.connect('mongodb://127.0.0.1:27017',(error,database)=>{
    // 连接成功执行这里的回调函数
    if(error){
        throw error;
    }
    // 使用某个数据库，若无则自动创建
    let db=database.db('xiu');
    // 进入该数据库某集合，若无则自动创建
    let admin=db.collection('admin');
    
    // 更新数据
    admin.update({},{$set:{
        'cid':$1
    }},(error,result)=>{
        console.log(result);
    });
    
});