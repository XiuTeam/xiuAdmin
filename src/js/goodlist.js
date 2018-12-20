// 发送请求，请求管理员数据，渲染管理员列表
let qty = 6;
let now = 1;
let page = (now - 1) * 6;
let total = 0;
let num = 0;
let totalPage = 0

// 发送ajax请求，渲染第一页
$.ajax({
	type: 'get',
	url: 'http://localhost:3008/good/check',
    // url: '/good/check',
	async: true,
	data: {
		'qty': qty,
		'page': page
	},
	success: function(str) {
		// console.log(str);
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
    // console.log($('.good_status'));
	for(var i = 0; i < $('.good_status').length; i++) {
		if($('.good_status').eq(i).prop('title') == '已上架') {
			$('.good_status').eq(i).find('i').html('&#xe601;');
			$('.good_status').eq(i).parents("tr").find(".td-status").find('span').removeClass('layui-btn-disabled').html('上架');
		} else {
			// console.log($('.good_status').eq(i).parents("tr").find(".td-status").find('span'));
			$('.good_status').eq(i).find('i').html('&#xe62f;');
			$('.good_status').eq(i).parents("tr").find(".td-status").find('span').addClass('layui-btn-disabled').html('下架');
		}
	}
	$('#goodList').html($('#goodList').html());
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
		url: 'http://localhost:3008/good/check',
        // url: '/good/check',
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


var activity='';
var status='';
var url='';
var category='';

// 判断商品活动
$('#activity input').eq(0).prop('checked', 'checked');
// console.log($('#activity input').eq(0).prop('checked'));
activity = $('#activity input').eq(0).data('names');
// console.log(activity);
$('#activity input').click(function() {
    console.log($(this));
    $(this).prop('checked', 'checked');
    activity = $(this).data('names');
    // console.log(activity);
});

// 判断商品状态
$('#status input').prop('checked','checked');
// var ischeck=true;
if($('#status input').prop('checked')){
    status='上架';
}else{
    status='下架';
}
// $('#status').on.('click','.layui-unselect',function() {
//     console.log($(this));
//     $(this).prop('checked', 'checked');
//     activity = $(this).data('names');
//     // console.log(activity);
// });

// 判断商品类别
// category=$('#category').val();
// console.log(category);

// layui-unselect layui-form-switch layui-form-onswitch
// 点击添加商品
layui.use(['form', 'layer'], function() {
    $ = layui.jquery;
    var form = layui.form,
        layer = layui.layer;
        var isok1=true;



    // 监听提交
    form.on('submit(add)', function() {
        if(isok1) {
            $.ajax({
                type: 'post',
                url: 'http://localhost:3008/good/addgood',
                // url: '/addAdmin/addname',
                async: true,
                data: {
                    'name': $('#title').val(),
                    'price': $('#price').val(),
                    'original': $('#original'),
                    'category': $('#category').val(),
                    'total':$('#goodNum').val(),
                    'activity':activity,
                    'desc':$('#desc').val(),
                    'status':status
                },
                success: function(str) {
                    console.log(str);
                    // layer.alert("添加成功", {
                    //     icon: 6
                    // }, function() {
                    //     // 获得frame索引
                    //     var index = parent.layer.getFrameIndex(window.name);
                    //     window.parent.location.reload(); //刷新父页面
                    //     //关闭当前frame
                    //     parent.layer.close(index);
                    // });
                }
            });
        } else {
            return false
        }
    });

});