const path = require('path');
const express = require('express');
let Router = express.Router();
const multer = require('multer');

// 定义磁盘存储
var storage = multer.diskStorage({
    destination: 'images/upload/',
    filename: function (req, file, cb) {
        console.log('file:',file)
        let ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + Date.now()+ext);
    }
})

let upload = multer({ dest: 'temp/',storage });

// 多文件上传接口
Router.post('/',upload.array('file',3),(req,res)=>{
    let upImgUrl=req.files[0].path;

        res.send({
            code:1,
            msg:'文件上传成功',
            data:req.files
         });

});

module.exports = Router;