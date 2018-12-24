var _id = '';
if (Cookie.get('_id')) {
    _id = Cookie.get('_id');

    $.ajax({
        type: 'get',
        // url: 'http://localhost:3008/good/checkid',
        url: '/good/checkid',
        async: true,
        data: {
            '_id': _id
        },
        success: function(str) {
            // console.log(str);
            var renderdata = str.data;
            console.log(renderdata);
            // x_admin_show('','./admin-list.html');

            $('#title').val(renderdata.name);
            $('#price').val(renderdata.price);
            $('#original').val(renderdata.original);
            $('#category').val(renderdata.category);
            $('#goodNum').val(renderdata.total);
            $('#desc').val(renderdata.desc);

            let activity = renderdata.activity;
            let status = renderdata.status;
            let upImgUrl = renderdata.upImgUrl;

            for (var i = 0; i < $('#activity input').length; i++) {
                if ($('#activity input').eq(i).data('names') == renderdata.activity) {
                    $('#activity input').eq(i).prop('checked', 'checked');
                }
            }

            $('#activity input').click(function() {
                console.log($(this));
                $(this).prop('checked', 'checked');
                activity = $(this).data('names');
            });

            let imgArr = (renderdata.upImgUrl).split('&').slice(0, -1)?(renderdata.upImgUrl).split('&').slice(0, -1):'';
            console.log(imgArr);

            for (var i = 0; i < imgArr.length; i++) {
                var html = '<img src="../' + imgArr[i] + '" alt="" class="layui-upload-img">';
                $('#demo2').html(html + $('#demo2').html());
            }

            var ischeck = true;
            if (renderdata.status == '上架') {
                $('#status input').prop('checked', 'checked');
                status = '上架';
                ischeck = false;
            } else {
                $('#status input').removeAttr('checked');
                status = '下架';
                ischeck = true;
            }

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

            layui.use('upload', function() {
                var $ = layui.jquery,
                    upload = layui.upload;

                //多图片上传
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
                        //上传完毕
                        console.log(res);
                        // var obj=JSON.parse(res);
                        // console.log(obj);
                        imgData = res.data;
                        imgUrl = imgData[0].path;
                        console.log(upImgUrl);
                        upImgUrl = upImgUrl + imgUrl + '&';
                        console.log(upImgUrl);
                    }
                });

            });

            layui.use(['form', 'layer'], function() {
                $ = layui.jquery;
                var form = layui.form,
                    layer = layui.layer;
                // 监听提交
                form.on('submit(add)', function() {
                    // if (isok1) {
                    $.ajax({
                        type: 'post',
                        // url: 'http://localhost:3008/good/updategood',
                        url: '/good/updategood',
                        async: true,
                        data: {
                            'name': $('#title').val(),
                            'price': $('#price').val(),
                            'original': $('#original').val(),
                            'category': $('#category').val(),
                            'total': $('#goodNum').val(),
                            'desc': $('#desc').val(),
                            'activity': activity,
                            'status': status,
                            'upImgUrl': upImgUrl,
                            '_id': renderdata._id
                        },
                        success: function(str) {
                            console.log(str);
                            // x_admin_show('','./admin-list.html');
                            layer.alert("更新成功", {
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
                    return false;
                });
 
            });

        }
    });
};