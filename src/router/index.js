const express=require('express');

const admin=require('./admin');
const addAdmin=require('./addAdmin');

let Router=express.Router();
Router.use('/admin',admin);
Router.use('/addAdmin',addAdmin);

// Router.get('/home',(req,res)=>{
//     res.send('home');
// })

module.exports=Router;