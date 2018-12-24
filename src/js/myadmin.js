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
    // url: 'http://localhost:3008/admin/check',
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

        for (var i = 0; i < totalPage; i++) {
            ++num;
            var str2 = `<a class="num" href="javascript:;">${num}</a>`;
            $('#pagenum').html($('#pagenum').html() + str2);
        }
        updatePage();
    }
});

// 渲染管理员列表
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
              <a class="status" onclick="member_stop(this,'10001')" href="javascript:;"  title=${item.status}>
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

    $('#adminList').html(res);
    // console.log($('.status'));
    for (var i = 0; i < $('.status').length; i++) {
        if ($('.status').eq(i).prop('title') == '已启用') {
            $('.status').eq(i).find('i').html('&#xe601;');
            $('.status').eq(i).parents("tr").find(".td-status").find('span').removeClass('layui-btn-disabled').html('已启用');
        } else {
            $('.status').eq(i).find('i').html('&#xe62f;');

            $('.status').eq(i).parents("tr").find(".td-status").find('span').addClass('layui-btn-disabled').html('已停用');
        }
    }
    $('#adminList').html($('#adminList').html());
}

// 更新页码状态
function updatePage() {
    var pageBtn = $('#pagenum').find('a');
    pageBtn.removeClass('current');
    pageBtn.eq(now - 1).addClass('current');
    $('.totalPage').html(`共有数据：${total} 条`);
}

// 切换页码发送ajax请求
function require(qty, page) {
    $.ajax({
        type: 'get',
        // url: 'http://localhost:3008/admin/check',
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
    if (now <= 1) {
        now = 1;
        page = 0;
    }
    console.log('page:' + page);
    require(qty, page);
});

$('#next').on('click', function() {
    now++;
    page = (now - 1) * qty;
    if (now >= totalPage) {
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

    if (str && checkReg.username(str)) {
        $.ajax({
            type: 'get',
            // url: 'http://localhost:3008/addAdmin/checkname',
            url: '/addAdmin/checkname',
            async: true,
            data: {
                'username': str
            },
            success: (str) => {
                console.log(str);
                if (str.code == '1') {
                    $('#userInfor').html('该登录名已存在');
                    $('#userInfor').css('color', 'red');
                    isok1 = false;
                } else {
                	$('#userInfor').html('');
                    isok1 = true;
                }
            }
        });
    } else {
        $('#userInfor').html('登录名以字母开头，3-20位');
        $('#userInfor').css('color', 'red');
        isok1 = false;
    }
});

$('#role input').eq(0).prop('checked', 'checked');
var role = $('#role input').eq(0).data('names');
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
        username: [/^[a-zA-Z][\w\-]{2,19}$/, '登录名以字母开头，3-20位'],
        pass: [/(.+){6,12}$/, '密码必须6到12位'],
        repass: function(value) {
            if ($('#L_pass').val() != $('#L_repass').val()) {
                return '两次密码不一致';
            }
        }
    });

    // 监听提交
    form.on('submit(add)', function() {
        if (isok1) {
            $.ajax({
                type: 'post',
                // url: 'http://localhost:3008/addAdmin/addname',
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
                    layer.alert("添加成功", {
                        icon: 6
                    }, function() {
                        // 获得frame索引
                        var index = parent.layer.getFrameIndex(window.name);
                        window.parent.location.reload(); //刷新父页面
                        //关闭当前frame
                        parent.layer.close(index);
                    });
                }
            });
        } else {
            return false
        }
    });
});

// 点击编辑按钮
let datalist;
$('#adminList').on('click', '.edit', function() {
    x_admin_show('编辑', 'admin-edit.html');

    var _id = $(this).parent().parent().data('id');
    Cookie.set('_id', _id, {});
})

// 点击查询，查找管理员
$('#search').click((ev) => {
    ev.preventDefault();
    var valName = $.trim($('.valName').val());
    console.log(valName);
    if (valName) {
        $.ajax({
            type: 'get',
            // url: 'http://localhost:3008/addAdmin/checkname',
            url: '/addAdmin/checkname',
            async: true,
            data: {
                'username': valName
            },
            success: function(str) {
                // console.log(str);
                if (str.code == 1) {
                    var arr = [];
                    arr.push(str.data);
                    create(arr);
                    $('.page').html('');
                    $('.totalPage').html(`共有数据：${arr.length} 条`);
                } else {
                    layer.confirm('没有相关数据呢', {
                        icon: 1
                    }, function() {
                        window.location.reload();
                    });
                }
            }
        });
    }
})

/*用户-停用*/
function member_stop(obj, id) {
    var _id = $(obj).parent().parent().data('id');
    var thisStatus = '';
    if ($(obj).attr('title') == '已启用') {
        thisStatus = '停用';
    } else {
        thisStatus = '启用';
    }

    layer.confirm('确定要' + thisStatus + '吗？', function(index) {

        if ($(obj).attr('title') == '已启用') {
            $.ajax({
                type: 'get',
                // url: 'http://localhost:3008/addAdmin/updateStatus',
                url: '/addAdmin/updateStatus',
                async: true,
                data: {
                    '_id': _id,
                    'status': '已停用'
                },
                success: function(str) {
                    // console.log(str);
                    $(obj).attr('title', '已停用')
                    $(obj).find('i').html('&#xe62f;');

                    $(obj).parents("tr").find(".td-status").find('span').addClass('layui-btn-disabled').html('已停用');
                    layer.msg('已停用!', {
                        icon: 5,
                        time: 1000
                    });
                }
            });
        } else {
            $.ajax({
                type: 'get',
                // url: 'http://localhost:3008/addAdmin/updateStatus',
                url: '/addAdmin/updateStatus',
                async: true,
                data: {
                    '_id': _id,
                    'status': '已启用'
                },
                success: function(str) {
                    $(obj).attr('title', '已启用')
                    $(obj).find('i').html('&#xe601;');

                    $(obj).parents("tr").find(".td-status").find('span').removeClass('layui-btn-disabled').html('已启用');
                    layer.msg('已启用!', {
                        icon: 6,
                        time: 1000
                    });
                }
            });
        }

    });
}

/*用户-删除*/
function member_del(obj, id) {
    layer.confirm('确定要删除吗？', function(index) {
        //发异步删除数据
        var _id = $(obj).parents("tr").find('.adminId').text();

        $.ajax({
            type: 'get',
            // url: 'http://localhost:3008/addAdmin/delete',
            url: '/addAdmin/delete',
            async: true,
            data: {
                '_id': _id
            },
            success: (str) => {
                // console.log(str);
                $(obj).parents("tr").remove();
                layer.msg('已删除!', {
                    icon: 1,
                    time: 1000
                });
                window.location.reload();
            }
        });

    });
}

$('#adminList').on('click', '.pick', function() {
    if (!$(this).hasClass('layui-form-checked')) {
        $(this).addClass('layui-form-checked');
    } else {
        $(this).removeClass('layui-form-checked');
    }

})

// 批量删除
function delAll(argument) {
    var data = tableCheck.getData();
    var delEle = $('#adminList .layui-form-checked');
    var _id = [];

    for (var i = 0; i < delEle.size(); i++) {
        _id.push(delEle.eq(i).parent().parent().data('id'));
    }

    // console.log(_id);

    layer.confirm('确定要删除吗？', function(index) {
        for (var i = 0; i < _id.length; i++) {
            $.ajax({
                type: 'get',
                // url: 'http://localhost:3008/addAdmin/delete',
                url: '/addAdmin/delete',
                async: true,
                data: {
                    '_id': _id[i]
                },
                success: (str) => {
                    // console.log(str);
                    //捉到所有被选中的，发异步进行删除
                    layer.msg('删除成功', {
                        icon: 1
                    });
                    window.location.reload();

                    $(".layui-form-checked").not('.header').parents('tr').remove();
                }
            });
        }
    });
}