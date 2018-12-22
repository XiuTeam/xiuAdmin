const express = require('express');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

let Router = express.Router();

Router.get('/check', (req, res) => {
	let {
		qty,
		page,
		rule,
		rank
	} = req.query;
	console.log(req.query);
	// 查询商品列表，渲染页面
	MongoClient.connect('mongodb://127.0.0.1:27017', async (error, database) => {
		if(error) {
			throw error;
		}

		let db = database.db('xiu');
		let goodlist = db.collection('goodlist');
		let data;
		let total;
		let ruleBy;
		if(rule=='category'){
			ruleBy={
				category:rule
			}
		}else{
			ruleBy={};
		}
		console.log(ruleBy);

		// 利用async确保获取到总条数后才执行分页
		function getTotal(){
			return new Promise((resolve,reject)=>{
				// total=goodlist.find().count();
				goodlist.find().toArray((error, result) => {
					if(error){
						reject(total);
                		return
					}

					total = result.length;
					resolve(total);
				});
			})
		}

		total=await getTotal();
		console.log('rule',rule);

		
		goodlist.find(ruleBy).sort({
			'time': -1
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
			// console.log(data);
			res.send(data);
		});
		database.close();
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
	// 获取信息
	let {
		name,
		price,
		original,
		category,
		total,
		activity,
		status,
		desc,
		upImgUrl
	} = req.body;
	// 连接数据库
	MongoClient.connect('mongodb://127.0.0.1:27017', (error, database) => {
		if(error) {
			throw error;
		}
		// 打开数据库，找到集合
		let db = database.db('xiu');
		let goodlist = db.collection('goodlist');

		// 插入新数据
		goodlist.insert({
			name: name,
			price: price,
			original: original,
			time: new Date(),
			category: category,
			total: total,
			status: status,
			activity:activity,
			desc:desc,
			upImgUrl:upImgUrl
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
	// res.send('success');
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
		let goodlist = db.collection('goodlist');
		// 查询数据库
		goodlist.findOne({
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

// 点击编辑更新
Router.post('/updategood', urlencodedParser, (req, res) => {
	// 获取信息
	let {
		_id,
		name,
		price,
		original,
		category,
		total,
		activity,
		status,
		desc,
		upImgUrl
	} = req.body;
	// 连接数据库
	MongoClient.connect('mongodb://127.0.0.1:27017', (error, database) => {
		if(error) {
			throw error;
		}
		// 打开数据库，找到集合
		let db = database.db('xiu');
		let goodlist = db.collection('goodlist');
		let oldImg='';

		goodlist.findOne({_id:new ObjectID(_id)},(error, result) => {
			oldImg=result.upImgUrl;
			console.log(oldImg);
			upImgUrl=upImgUrl+oldImg
			console.log(upImgUrl);
		});

		goodlist.update({
			_id: new ObjectID(_id)
		}, {
			$set: {
				name: name,
				price: price,
				original: original,
				// time: new Date(),
				category: category,
				total: total,
				status: status,
				activity:activity,
				desc:desc,
				upImgUrl:upImgUrl
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
	// res.send('success');
});


// 点击按类别查询商品
Router.get('/checkgood', (req, res) => {
    // 获取查询条件
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
        // 查询数据库
        goodlist.findOne({
            _id: new ObjectID(_id)
        },(error, result) => {
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

module.exports = Router;