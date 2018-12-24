let upImgUrl = '';
layui.use('upload', function() {
    var $ = layui.jquery,
        upload = layui.upload;

    //图片上传
    upload.render({
        elem: '#test2',
        url: '/upload',
        multiple: true,
        before: function(obj) {
            //预读本地文件示例，不支持ie8
            obj.preview(function(index, file, result) {
                $('#demo2').append('<img src="' + result + '" alt="' + file.name + '" class="layui-upload-img">')
            });
        },
        done: function(res) {
            imgData = res.data;
            upImgUrl = imgData[0].path + '&' + upImgUrl;
        }
    });

});

var activity = '';
var status = '';
var url = '';
var category = '';

// 判断商品活动
$('#activity input').eq(0).prop('checked', 'checked');
activity = $('#activity input').eq(0).data('names');
$('#activity input').click(function() {
    console.log($(this));
    $(this).prop('checked', 'checked');
    activity = $(this).data('names');
});

// 判断商品状态
$('#status input').prop('checked', 'checked');
status = '上架';
var ischeck = false;
$('#status').on('click', '.layui-form-switch', function() {
    if (ischeck) {
        $('#status input').prop('checked', 'checked');
        status = '上架';
    } else {
        $('#status input').removeAttr('checked');
        status = '下架';
    }
    ischeck = !ischeck;
})

// 点击添加商品
layui.use(['form', 'layer'], function() {
    $ = layui.jquery;
    var form = layui.form,
        layer = layui.layer;
    var isok1 = true;

    // 监听提交
    form.on('submit(add)', function() {
        // console.log(123456);
        if (isok1) {
            $.ajax({
                type: 'post',
                // url: 'http://localhost:3008/good/addgood',
                url: '/good/addgood',
                async: true,
                data: {
                    'name': $('#title').val(),
                    'price': $('#price').val(),
                    'original': $('#original').val(),
                    'category': $('#category').val(),
                    'total': $('#goodNum').val(),
                    'activity': activity,
                    'desc': $('#desc').val(),
                    'status': status,
                    'upImgUrl': upImgUrl
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