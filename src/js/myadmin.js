// 发送请求，请求管理员数据，渲染管理员列表
let qty = 3;
let now = 1;
let page = (now - 1) * 2;
let total = 0;
let num = 0;
let totalPage = 0

function require(qty, page) {
	$.ajax({
		type: 'get',
		url: '/admin/check',
		async: true,
		data: {
			'qty': qty,
			'page': page
		},
		success: function(str) {
			// 总页数
			total = str.total;
			totalPage = Math.ceil(total / qty);
			arr = str.data;
			create(arr);
			createpage(total, now);
		}
	});
}

require(qty, page);

// 渲染页码
function createpage(total, now) {
	num = 0;
	$('#pagenum').html('');
	for(var i = 0; i < totalPage; i++) {
		++num;
		var str2 = `<a class="num" href="javascript:;">${num}</a>`;
		$('#pagenum').html($('#pagenum').html() + str2);
	}

	var pageBtn = $('#pagenum').find('a');
	pageBtn.eq(now - 1).addClass('current');
	$('.totalPage').html(`共有数据：${total} 条`);
}

// 渲染管理员列表
// <input type="checkbox" name="pick" class="pick">
//  // <div class="layui-unselect layui-form-checkbox" lay-skin="primary" data-id='2'><i class="layui-icon">&#xe605;</i></div>
//  onclick="x_admin_show('编辑','admin-edit.html')"
function create(arr) {
	var res = arr.map((item) => {
		var html = `<tr data-id=${item._id}>
            <td>
             <div class="pick layui-unselect layui-form-checkbox" lay-skin="primary" data-id='2'><i class="layui-icon">&#xe605;</i></div>
            
            </td>
            <td class="adminId">${item._id}</td>
            <td>${item.username}</td>
            <td>${item.tel}</td>
            <td>${item.email}</td>
            <td>${item.role}</td>
            <td>${item.time}</td>
            <td class="td-status">
              <span class="layui-btn layui-btn-normal layui-btn-mini">${item.status}</span></td>
            <td class="td-manage">
              <a onclick="member_stop(this,'10001')" href="javascript:;"  title="启用">
                <i class="layui-icon">&#xe601;</i>
              </a>
              <a class="edit" title="编辑"  href="javascript:;">
                <i class="layui-icon">&#xe642;</i>
              </a>
              <a title="删除" onclick="member_del(this,'要删除的id')" href="javascript:;">
                <i class="layui-icon">&#xe640;</i>
              </a>
            </td>
          </tr>`;

		return html;
	}).join('');

	return $('#adminList').html(res);
}

// 点击上下页
//点击页码 
$('#pagenum').on('click', '.num', function() {
	now = $(this).text();
	page = (now - 1) * 2;
	console.log(page);
	require(qty, page);
});

// 上下页
$('#prev').on('click', function() {
	now--;
	page = (now - 1) * 2;
	if(now <= 1) {
		now = 1;
		page = 0;
	}
	console.log('page:' + page);
	require(qty, page);
});

$('#next').on('click', function() {
	now++;
	page = (now - 1) * 2;
	if(now >= totalPage) {
		now = totalPage;
		page = (totalPage - 1) * 2;
	}
	require(qty, page);
});

//////添加管理员
var isok1 = false;
$('#username').blur(() => {
	var val = $('#username').val();
	console.log(val);
	var str = checkReg.trim(val); //去除前后空格

	if(str && checkReg.username(str)) {
		$.ajax({
			type: 'get',
			url: '/addAdmin/checkname',
			async: true,
			data: {
				'username': str
			},
			success: (str) => {
				console.log(str);
				if(str.code == '1') {
					$('#userInfor').html('该登录名已存在');
					$('#userInfor').css('color', 'red');
					isok1 = false;
				} else {
					$('#userInfor').html('✔');
					$('#userInfor').css('color', '#999');
					isok1 = true;
				}
			}
		});
	} else {
		$('#userInfor').html('登录名不符合规则');
		$('#userInfor').css('color', 'red');
		isok1 = false;
	}
});

// 验证手机号
var isok2 = false;
$('#phone').blur(() => {
	var val = $('#phone').val();
	var str = checkReg.trim(val);

	if(str && checkReg.tel(str)) {
		//非空且符合正则
		$('#telInfor').html('✔');
		$('#telInfor').css('color', '#999');
		isok2 = true;
	} else {
		$('#telInfor').html('手机号不正确');
		$('#telInfor').css('color', 'red');
		isok2 = false;
	}
});

// 验证邮箱
var isok3 = false;
$('#L_email').blur(() => {
	var val = $('#L_email').val();
	var str = checkReg.trim(val);

	if(str && checkReg.email(str)) {
		//非空且符合正则
		$('#emailInfor').html('✔');
		$('#emailInfor').css('color', '#999');
		isok3 = true;
	} else {
		$('#emailInfor').html('邮箱格式不正确');
		$('#emailInfor').css('color', 'red');
		isok3 = false;
	}
});

// 验证密码
var isok4 = false;
$('#L_pass').blur(() => {
	var val = $('#L_pass').val();
	var str = checkReg.trim(val);

	if(str && checkReg.psw(str)) {
		//非空且符合正则
		$('#pswInfor').html('✔');
		$('#pswInfor').css('color', '#999');
		isok4 = true;
	} else {
		$('#pswInfor').html('密码不符合规则');
		$('#pswInfor').css('color', 'red');
		isok4 = false;
	}
});

// 确认密码
var isok5 = false;
$('#L_repass').blur(function() {
	var val = $('#L_repass').val();
	var str = checkReg.trim(val);

	if(str == $('#L_pass').val()) {
		$('#conInfor').html('✔');
		$('#conInfor').css('color', '#999');
		isok5 = true;
	} else {
		$('#conInfor').html('两次输入密码不一致');
		$('#conInfor').css('color', 'red');
		isok5 = false;
	}
});

var isok6 = false;
var role = '';
$('#role input').click(function() {
	console.log($(this));
	$(this).prop('checked', 'checked');
	role = $(this).data('names');
	console.log(role);

	isok6 = true;
});

//点击添加管理员
$('#addBtn').click(function() {
	if(isok1 && isok2 && isok3 && isok4 && isok5 && isok6) {
		$.ajax({
			type: 'post',
			url: '/addAdmin/addname',
			async: true,
			data: {
				'username': $('#username').val(),
				'password': $('#L_pass').val(),
				'role': role,
				'tel': $('#phone').val(),
				'email': $('#L_email').val()
			},
			success: function(str) {
				console.log(str);
				// x_admin_show('','./admin-list.html');

			}
		});
	} else {
		// alert('请输入完整信息');
		console.log('请输入完整信息');
	}
});

// form.on('submit(add)', function(){
//     // console.log(data);
//     //发异步，把数据提交给php

//     if(isok1 && isok2 && isok3 && isok4 && isok5 && isok6) {
//         $.ajax({
//             type: 'post',
//             url: '/addAdmin/addname',
//             async: true,
//             data: {
//                 'username': $('#username').val(),
//                 'password': $('#L_pass').val(),
//                 'role':role,
//                 'tel':$('#phone').val(),
//                 'email':$('#L_email').val()
//             },
//             success: function(str) {
//                 console.log(str);
//                 // x_admin_show('','./admin-list.html');
//                 layer.alert("增加成功", {icon: 6},function () {
//         // 获得frame索引
//         var index = parent.layer.getFrameIndex(window.name);
//         //关闭当前frame
//         parent.layer.close(index);
//     });
//             }
//         });
//     }

//     return false;
// });

// 点击编辑按钮
// <a class="edit" title="编辑"  onclick="x_admin_show('编辑','admin-edit.html')" href="javascript:;">
let datalist;

$('#adminList').on('click', '.edit', function() {
	x_admin_show('编辑', 'admin-edit.html');

	var _id = $(this).parent().parent().data('id');

	$.ajax({
		type: 'get',
		url: '/addAdmin/checkid',
		async: true,
		data: {
			'_id': _id
		},
		success: function(str) {
			console.log(str);
			var data = str.data;
			console.log(data);
			// x_admin_show('','./admin-list.html');

			datalist = {
				'username': data.username,
				'tel': data.tel,
				'email': data.email,
				'password': data.password,
				'status': data.status,
				'_id': data._id,
				'role': data.role
			}

			var cookiestr = JSON.stringify(datalist);
			console.log(cookiestr);
			Cookie.set('data', cookiestr, {});

			// $('#username2').val(data.username);
			// $('#phone2').val(data.tel);
			// $('#L_email2').val(data.email);
			// $('#L_pass2').val(data.password);
			// $('#L_repass2').val(data.password);
			// console.log($('#phone2').val());
			// console.log(data.username);

			// console.log($('#phone2'));
		}
	});
})

function senddata() {
	return datalist
}