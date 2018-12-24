const express = require('express');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let Router = express.Router();

Router.get('/checkAll',(req, res) => {
	MongoClient.connect('mongodb://127.0.0.1:27017', async (error, database) => {
		if(error) {
			throw error;
		}

		let db = database.db('xiu');
		function getTotal(names){
			return new Promise((resolve,reject)=>{
				let countNum = db.collection(names).find().count();
				resolve(countNum);

			})
		}

		let admin=await getTotal('admin');
		let order=await getTotal('order');
		let goodlist=await getTotal('goodlist');
		let user=await getTotal('user');
		let category=await getTotal('category');
		let total={
			'admin':admin,
			'order':order,
			'user':user,
			'goodlist':goodlist,
			'category':category
		}
		res.send(total);	
	});
})

module.exports = Router;