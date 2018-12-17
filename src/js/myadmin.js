// 发送请求，请求管理员数据，渲染管理员列表
let qty = 3;
let now = 1;
let page = (now - 1) * 3;
let total = 0;
let num = 0;
let totalPage = 0

// 发送ajax请求，渲染第一页
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

		for(var i = 0; i < totalPage; i++) {
			++num;
			var str2 = `<a class="num" href="javascript:;">${num}</a>`;
			$('#pagenum').html($('#pagenum').html() + str2);
		}
		updatePage();
	}
});

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

// 更新页码状态
function updatePage(){
	var pageBtn = $('#pagenum').find('a');
	pageBtn.removeClass('current');
	pageBtn.eq(now - 1).addClass('current');
	$('.totalPage').html(`共有数据：${total} 条`);
}

// 切换页码发送ajax请求
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
			updatePage();
		}
	});
}

// 点击上下页
//点击页码 
$('#pagenum').on('click', '.num', function() {
	now = $(this).text();
	page = (now - 1) * qty;
	console.log(page);
	require(qty, page);
});

// 上下页
$('#prev').on('click', function() {
	now--;
	page = (now - 1) * qty;
	if(now <= 1) {
		now = 1;
		page = 0;
	}
	console.log('page:' + page);
	require(qty, page);
});

$('#next').on('click', function() {
	now++;
	page = (now - 1) * qty;
	if(now >= totalPage) {
		now = totalPage;
		page = (totalPage - 1) * qty;
	}
	require(qty, page);
});

//////添加管理员
var isok1 = false;
$('#username').blur(() => {
	var val = $('#username').val();
	var str = checkReg.trim(val); //去除前后空格

	if(str) {
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

$('#role input').eq(0).prop('checked','checked');
var role=$('#role input').eq(0).data('names');
$('#role input').click(function() {
	console.log($(this));
	$(this).prop('checked', 'checked');
	role = $(this).data('names');
});

layui.use(['form', 'layer'], function() {
    $ = layui.jquery;
    var form = layui.form,
        layer = layui.layer;

    form.verify({
	  username:[/^[a-zA-Z][\w\-]{2,19}$/,'登录名以字母开头，3-20位']
	  ,pass: [/(.+){6,12}$/, '密码必须6到12位']
	  ,repass: function(value){
	      if($('#L_pass').val()!=$('#L_repass').val()){
	          return '两次密码不一致';
	      }
	  }
	});

    // 监听提交
    form.on('submit(add)', function() {
        if (isok1) {
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
                    layer.alert("增加成功", {
				        icon: 6
				    }, function() {
				        // 获得frame索引
				        var index = parent.layer.getFrameIndex(window.name);
				        //关闭当前frame
				        parent.layer.close(index);
				    });
				}
            });
        }else{
        	return false
        } 
    });
});

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
		}
	});
})
