const path = require('path');
const express = require('express');
let Router = express.Router();

const multer = require('multer');


// 定义上传临时路径
// 如果无文件夹，则会自动创建

// 定义磁盘存储
var storage = multer.diskStorage({
    destination: 'images/upload/',
    filename: function (req, file, cb) {
        console.log('file:',file)
        let ext = path.extname(file.originalname);//.jpg,.png,.xx
      cb(null, file.fieldname + '-' + Date.now()+ext);
    }
})

let upload = multer({ dest: 'temp/',storage });

// 多文件上传接口
Router.post('/',upload.array('file',3),(req,res)=>{

    console.log('files:',req.files);
    console.log('body:',req.body);
    let upImgUrl=req.files[0].path;
    console.log(upImgUrl);

        res.send({
            code:1,
            msg:'文件上传成功',
            data:req.files
         });

});

module.exports = Router;