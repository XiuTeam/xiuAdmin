const express = require('express');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

let Router = express.Router();

Router.get('/check',(req, res) => {
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
		let admin = db.collection('admin');
		let data;
		let total;

		admin.find().toArray((error, result) => {
			total = result.length;
		});

		admin.find().sort({time:-1}).limit(qty * 1).skip(page * 1).toArray((error, result) => {

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
			res.send(data);
		});
		database.close();
	});
})

Router.get('/checkname', (req, res) => {
	// 获取用户名
	let {
		username
	} = req.query;
	MongoClient.connect('mongodb://127.0.0.1:27017', (error, database) => {
		if(error) {
			throw error;
		}
		// 找到对应数据库
		let db = database.db('xiu');
		// 找到所需集合
		let admin = db.collection('admin');
		// 查询数据库
		admin.findOne({
			username: username
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
		database.close();
	});
});

let urlencodedParser = bodyParser.urlencoded({
	extended: false
});
// 新注册用户加入数据库
Router.post('/addname', urlencodedParser, (req, res) => {
	// 获取新注册用户信息
	let {
		username,
		password,
		role,
		tel,
		email
	} = req.body;
	// 连接数据库
	MongoClient.connect('mongodb://127.0.0.1:27017', (error, database) => {
		if(error) {
			throw error;
		}
		// 打开数据库，找到集合
		let db = database.db('xiu');
		let admin = db.collection('admin');

		// 插入新数据
		admin.insert({
			username: username,
			password: password,
			role: role,
			time: new Date(),
			email: email,
			tel: tel,
			status: '已启用'
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
// 删除
Router.get('/delete', (req, res) => {
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
		let admin = db.collection('admin');
		// _id='ObjectId("'+_id+'")';
		// 查询数据库
		admin.deleteOne({
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
		let admin = db.collection('admin');
		// 查询数据库
		admin.findOne({
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
		role,
		tel,
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
		let admin = db.collection('admin');

		// 插入新数据
		admin.update({
			_id: new ObjectID(_id)
		}, {
			$set: {
				username: username,
				role: role,
				email: email,
				tel: tel
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

// 更新管理员状态
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
		let admin = db.collection('admin');

		// 插入新数据
		admin.update({
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

// 更新管理员信息时验证密码
Router.post('/checkinfor',urlencodedParser,(req,res)=>{
    let {_id,password}=req.body;

    MongoClient.connect('mongodb://127.0.0.1:27017',(error,database)=>{
        if(error){
            throw error;
        }

        let db=database.db('xiu');
        let admin=db.collection('admin');

        admin.findOne({_id:new ObjectID(_id),password},(error,result)=>{
            if(result){
                res.send({
                    code:1,
                    data:result,
                    msg:'have'
                })
            }else{
                res.send({
                    code:0,
                    data:[],
                    msg:'sorry'
                })
            }
        });

        database.close();
    });
});

module.exports = Router;