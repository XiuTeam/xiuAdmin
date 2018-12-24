var _id = '';
if (Cookie.get('_id')) {
    _id = Cookie.get('_id');

    $.ajax({
        type: 'get',
        url: '/good/checkid',
        async: true,
        data: {
            '_id': _id
        },
        success: function(str) {
            var renderdata = str.data;

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
                $(this).prop('checked', 'checked');
                activity = $(this).data('names');
            });

            let imgArr=[];
            if(renderdata.upImgUrl){
                imgArr = (renderdata.upImgUrl).split('&').slice(0, -1);
                for (var i = 0; i < imgArr.length; i++) {
                    var html = '<img src="../' + imgArr[i] + '" alt="" class="layui-upload-img">';
                    $('#demo2').html(html + $('#demo2').html());
                }
            }else{
                imgArr = [];
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
                        imgData = res.data;
                        imgUrl = imgData[0].path;
                        upImgUrl = upImgUrl + imgUrl + '&';
                    }
                });

            });

            layui.use(['form', 'layer'], function() {
                $ = layui.jquery;
                var form = layui.form,
                    layer = layui.layer;
                // 监听提交
                form.on('submit(add)', function() {
                    $.ajax({
                        type: 'post',
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
                            layer.alert("更新成功", {
                                icon: 6
                            }, function() {
                                var index = parent.layer.getFrameIndex(window.name);
                                window.parent.location.reload();
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