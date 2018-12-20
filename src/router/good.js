const express = require('express');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

let Router = express.Router();

Router.get('/check', (req, res) => {
	let {
		qty,
		page
	} = req.query;
	// 查询管理员列表，渲染页面
	MongoClient.connect('mongodb://127.0.0.1:27017', (error, database) => {
		if(error) {
			throw error;
		}

		let db = database.db('xiu');
		let goodlist = db.collection('goodlist');
		let data;
		let total;
//		let isok = false;

		goodlist.find().limit(36).toArray((error, result) => {
			total = result.length;
//			isok = true;
		});

		// if(!isok){
		// 	totals=goodlist.find().count();
		// 	isok=true;
		// }

		// if(isok){
		goodlist.find().sort({
			time: -1
		}).limit(qty * 1).skip(page * 1).toArray((error, result) => {

			if(result) {
				data = {
					code: 1,
					total: total,
					data: result,
					msg: 'ok'
				}
			} else {
				data = {
					code: 0,
					total: 0,
					data: error,
					msg: 'sorry'
				}
			}
			// if(isok){
			// 	res.send(data);
			// }
			res.send(data);
		});
		// }
	});

});

// 删除
Router.get('/delete', (req, res) => {
	// 获取id
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
		let goodlist = db.collection('goodlist');
		// _id='ObjectId("'+_id+'")';
		// 查询数据库
		goodlist.deleteOne({
			_id: new ObjectID(_id)
		}, (error, result) => {
			if(result) {
				res.send({
					code: 1,
					data: result,
					msg: 'yes'
				})
			} else {
				res.send({
					code: 0,
					data: [],
					msg: 'sorry'
				})
			}
		});

		// 关闭数据库，避免资源浪费
		database.close();
	});
});

// 更新商品上架信息
Router.get('/updateStatus', (req, res) => {
	// 获取新注册用户信息
	let {
		status,
		_id
	} = req.query;
	// 连接数据库
	MongoClient.connect('mongodb://127.0.0.1:27017', (error, database) => {
		if(error) {
			throw error;
		}
		// 打开数据库，找到集合
		let db = database.db('xiu');
		let good = db.collection('goodlist');

		// 插入新数据
		good.update({
			_id: new ObjectID(_id)
		}, {
			$set: {
				status: status
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

// 添加商品
let urlencodedParser = bodyParser.urlencoded({
	extended: false
});
Router.post('/addgood', urlencodedParser, (req, res) => {
	// 获取新注册用户信息
	// let {
	// 	name,
	// 	price,
	// 	original,
	// 	category,
	// 	total,
	// 	activity,
	// 	status,
	// 	desc
	// } = req.body;
	// // 连接数据库
	// MongoClient.connect('mongodb://127.0.0.1:27017', (error, database) => {
	// 	if(error) {
	// 		throw error;
	// 	}
	// 	// 打开数据库，找到集合
	// 	let db = database.db('xiu');
	// 	let admin = db.collection('admin');

	// 	// 插入新数据
	// 	admin.insert({
	// 		username: username,
	// 		password: password,
	// 		role: role,
	// 		time: new Date(),
	// 		email: email,
	// 		tel: tel,
	// 		status: '已启用'
	// 	}, (error, result) => {
	// 		let data;
	// 		if(error) {
	// 			data = {
	// 				code: 0,
	// 				data: [],
	// 				msg: error
	// 			}
	// 		} else {
	// 			data = {
	// 				code: 1,
	// 				data: result.ops,
	// 				msg: 'success'
	// 			}
	// 		}
	// 		res.send(data);
	// 	});

	// 	database.close();
	// });
	res.send('success');
});


module.exports = Router;