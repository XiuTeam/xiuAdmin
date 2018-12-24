// 发送请求，请求商品数据，渲染管理员列表
let qty = 6;
let now = 1;
let page = (now - 1) * 6;
let total = 0;
let totalPage = 0;
let rule = 'time';
let rank = -1;
let item = "";

// 发送ajax请求，渲染第一页
$.ajax({
    type: 'get',
    url: '/good/check',
    async: true,
    data: {
        'qty': qty,
        'page': page,
        'rule': rule,
        'rank': rank
    },
    success: function(str) {
        total = str.total;
        totalPage = Math.ceil(total / qty);
        arr = str.data;
        create(arr);
        updatePage(now);
    }
});

// 渲染商品列表
function create(arr) {
    var res = arr.map((item) => {
        var html = `<tr data-id=${item._id}>
            <td>
             <div class="good_pick layui-unselect layui-form-checkbox" lay-skin="primary" data-id=${item._id}><i class="layui-icon">&#xe605;</i></div>
            
            </td>
            <td class="adminId">${item._id}</td>
            <td>${item.name}</td>
            <td style="text-align:center">${item.category}</td>
            <td>${item.price}</td>
            <td style="text-align:center">${item.original}</td>
            <td>${item.total}</td>
            <td style="text-align:center">${item.time.slice(0,10)}</td>
            <td class="td-status">
              <span class="layui-btn layui-btn-normal layui-btn-mini">${item.status}</span></td>
            <td class="td-manage">
              <a class="good_status" onclick="member_stop(this,'10001')" href="javascript:;"  title=已${item.status}>
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

    $('#goodList').html(res);
    // 判断商品上架情况
    for (var i = 0; i < $('.good_status').length; i++) {
        if ($('.good_status').eq(i).prop('title') == '已上架') {
            $('.good_status').eq(i).find('i').html('&#xe601;');
            $('.good_status').eq(i).parents("tr").find(".td-status").find('span').removeClass('layui-btn-disabled').html('上架');
        } else {
            $('.good_status').eq(i).find('i').html('&#xe62f;');
            $('.good_status').eq(i).parents("tr").find(".td-status").find('span').addClass('layui-btn-disabled').html('下架');
        }
    }
    $('#goodList').html($('#goodList').html());
}

// 更新页码状态
function updatePage(now) {
    item = "";
    if (totalPage <= 5) { //总页数小于五页，则加载所有页
        item = "";
        for (var i = 1; i <= totalPage; i++) {
            item += `<a class="num" href="javascript:;">${i}</a>`;
        };
        $('#pagenum').html(item);
    } else if (totalPage > 5) { //大于五页，显示省略号
        if (now < 3) {
            for (var i = 1; i <= 3; i++) {
                item += `<a class="num" href="javascript:;">${i}</a>`;
            }
            item += "<span style='margin-right:3px;'> . . . </span>";
        } else if (now >= 3 && now < totalPage - 3) {
            for (var i = 1; i <= 4; i++) {
                item += `<a class="num" href="javascript:;">${i}</a>`;
            }
            if (now >= 4) {
                item = "";
                item += `<a class="num" href="javascript:;">1</a><span style='margin-right:3px;'> . . . </span>`;
                for (var i = (now * 1 - 1); i <= now * 1 + 1; i++) {
                    item += `<a class="num" href="javascript:;">${i}</a>`;
                }
            }
            item += "<span style='margin-right:3px;'> . . . </span>";
        } else {
            item = "";
            item += `<a class="num" href="javascript:;">1</a><span style='margin-right:3px;'> . . . </span>`;
            for (var i = (totalPage - 3); i <= totalPage - 1; i++) {
                item += `<a class="num" href="javascript:;">${i}</a>`;
            }
        }
        $('#pagenum').html(item + `<a class="num" href="javascript:;">${totalPage}</a>`);
    }
    // 当前页高亮
    var pageBtn = $('#pagenum').find('a');
    pageBtn.removeClass('current');
    for (var i = 0; i < pageBtn.length; i++) {
        if (pageBtn.eq(i).text() * 1 == now) {
            pageBtn.eq(i).addClass('current');
        }
    }

    $('.totalPage').html(`共有数据：${total} 条`);
}

// 切换页码发送ajax请求
function require(qty, page, rule, rank, now) {
    $.ajax({
        type: 'get',
        url: '/good/check',
        async: true,
        data: {
            'qty': qty,
            'page': page,
            'rule': rule,
            'rank': rank
        },
        success: function(str) {
            total = str.total;
            totalPage = Math.ceil(total / qty);
            arr = str.data;
            create(arr);
            updatePage(now);
        }
    });
}

// 点击排序
$('.layui-table .layui-edge').on('click', function() {
    if ($(this).hasClass('layui-table-sort-asc')) {
        $('.layui-table .layui-edge').removeClass('activeup activedown');
        $(this).addClass('activeup');
        rank = 1;
    } else {
        $('.layui-table .layui-edge').removeClass('activedown activeup');
        $(this).addClass('activedown');
        rank = -1;
    }
    rule = $(this).parent().data('name');
    require(qty, page, rule, rank, now);
});

// 点击上下页
//点击页码 
$('#pagenum').on('click', '.num', function() {
    now = $(this).text();
    page = (now - 1) * qty;
    require(qty, page, rule, rank, now);
    $('#skipNum').val(now);
});

// 上下页
$('#prev').on('click', function() {
    now--;
    page = (now - 1) * qty;
    if (now <= 1) {
        now = 1;
        page = 0;
    }
    require(qty, page, rule, rank, now);
    $('#skipNum').val(now);
});

$('#next').on('click', function() {
    now++;
    page = (now - 1) * qty;
    if (now >= totalPage) {
        now = totalPage;
        page = (totalPage - 1) * qty;
    }
    require(qty, page, rule, rank, now);
    $('#skipNum').val(now);
});

// 点击跳转
$('#skip').click(function() {
    now = $.trim($('#skipNum').val());
    page = (now - 1) * qty;
    require(qty, page, rule, rank, now);
});

// 点击编辑
let datalist;
$('#goodList').on('click', '.edit', function() {
    x_admin_show('编辑', 'good-edit.html');

    var _id = $(this).parent().parent().data('id');
    Cookie.set('_id', _id, {});
})

// 点击按id查找商品
$('#search').click((ev) => {
    ev.preventDefault();
    var goodid = $.trim($('#goodid').val());
    console.log(goodid);
    if (goodid) {
        $.ajax({
            type: 'get',
            url: '/good/checkid',
            async: true,
            data: {
                '_id': goodid
            },
            success: function(str) {
                console.log(str);
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

/*商品商品上下架信息*/
function member_stop(obj, id) {
    var _id = $(obj).parent().parent().data('id');
    var thisStatus = '';
    if ($(obj).attr('title') == '已上架') {
        thisStatus = '下架';
    } else {
        thisStatus = '上架';
    }
    layer.confirm('确定要' + thisStatus + '吗？', function(index) {

        if ($(obj).attr('title') == '已上架') {

            $.ajax({
                type: 'get',
                url: '/good/updateStatus',
                async: true,
                data: {
                    '_id': _id,
                    'status': '下架'
                },
                success: function(str) {
                    console.log(str);
                    $(obj).attr('title', '已下架')
                    $(obj).find('i').html('&#xe62f;');

                    $(obj).parents("tr").find(".td-status").find('span').addClass('layui-btn-disabled').html('下架');
                    layer.msg('已下架!', {
                        icon: 5,
                        time: 1000
                    });
                }
            });

        } else {
            $.ajax({
                type: 'get',
                url: '/good/updateStatus',
                async: true,
                data: {
                    '_id': _id,
                    'status': '上架'
                },
                success: function(str) {
                    $(obj).attr('title', '已上架')
                    $(obj).find('i').html('&#xe601;');

                    $(obj).parents("tr").find(".td-status").find('span').removeClass('layui-btn-disabled').html('上架');
                    layer.msg('已上架!', {
                        icon: 6,
                        time: 1000
                    });
                }

            });
        }
    });
}

// 删除商品
function member_del(obj, id) {
    layer.confirm('确定要删除吗？', function(index) {
        //发异步删除数据
        var _id = $(obj).parents("tr").find('.adminId').text();

        $.ajax({
            type: 'get',
            url: '/good/delete',
            async: true,
            data: {
                '_id': _id
            },
            success: (str) => {
                console.log(str);
            }
        });

        $(obj).parents("tr").remove();
        layer.msg('已删除!', {
            icon: 1,
            time: 1000
        });
        window.location.reload();
    });
}

// 判断复选框
$('#goodList').on('click', '.good_pick', function() {
    if (!$(this).hasClass('layui-form-checked')) {
        $(this).addClass('layui-form-checked');
    } else {
        $(this).removeClass('layui-form-checked');
    }

})

function delAll(argument) {

    var data = tableCheck.getData();
    layer.confirm('确定要删除吗？', function(index) {
        for (var i = 0; i < data.length; i++) {
            $.ajax({
                type: 'get',
                url: '/good/delete',
                async: true,
                data: {
                    '_id': data[i]
                },
                success: (str) => {
                    console.log(str);
                }
            });
        }
        //捉到所有被选中的，发异步进行删除
        layer.msg('删除成功', {
            icon: 1
        });
        window.location.reload();

        $(".layui-form-checked").not('.header').parents('tr').remove();
    });
}