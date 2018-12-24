// 获取id查询对应管理员信息，渲染编辑页面
var _id = '';
if (Cookie.get('_id')) {

    _id = Cookie.get('_id');

    $.ajax({
        type: 'get',
        url: '/addAdmin/checkid',
        async: true,
        data: {
            '_id': _id
        },
        success: function(str) {
            var renderdata = str.data;

            $('#username2').val(renderdata.username);
            $('#phone2').val(renderdata.tel);
            $('#L_email2').val(renderdata.email);

            var isok1 = true;
            $('#username2').blur(function() {
                var val = $('#username2').val();
                var strs = checkReg.trim(val);
                console.log(strs);

                // 修改登录名，发起请求，确定登录名可以使用
                if (strs && checkReg.username(strs)) {
                    $.ajax({
                        type: 'get',
                        url: '/addAdmin/checkname',
                        async: true,
                        data: {
                            'username': strs
                        },
                        success: (str) => {
                            if (str.code == '1') {
                                if (renderdata.username == str.data.username) {
                                    $('#userInfor').html('');
                                    isok1 = true;
                                } else {
                                    $('#userInfor').html('该登录名已存在');
                                    $('#userInfor').css('color', 'red');
                                    isok1 = false;
                                }

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
            
            isok2=false;
            $('#L_pass2').blur(function(){
                var val = $('#L_pass2').val();
                var strs = checkReg.trim(val);

                // 修改登录名，发起请求，确认身份
                $.ajax({
                    type: 'post',
                    url: '/addAdmin/checkinfor',
                    async: true,
                    data: {
                        'password': strs,
                        '_id':_id
                    },
                    success: (str) => {
                        if (str.code == '1') {
                            $('#pswInfor').html('✔');
                            $('#pswInfor').css('color', '#ccc');
                            isok2 = true;
                        } else {
                            layer.msg('您输入的密码有误', {
                                icon: 5,
                                time: 1000
                            });
                            isok2 = false;
                        }
                    }
                });
            });

            // 判断管理员身份
            var role = renderdata.role;
            $('#role input').eq(0).prop('checked', 'checked');
            for (var i = 0; i < $('#role input').length; i++) {
                if ($('#role input').eq(i).data('names') == renderdata.role) {
                    $('#role input').eq(i).prop('checked', 'checked');
                }
            }

            $('#role input').click(function() {
                $(this).prop('checked', 'checked');
                role = $(this).data('names');
            });

            // 自定义验证规则与监听提交
            layui.use(['form', 'layer'], function() {
                $ = layui.jquery;
                var form = layui.form,
                    layer = layui.layer;

                form.verify({
                    username: [/^[a-zA-Z][\w\-]{2,19}$/, '登录名以字母开头，3-20位']
                });

                // 监听提交
                form.on('submit(add)', function() {
                    if (isok1 && isok2) {
                        $.ajax({
                            type: 'post',
                            url: '/addAdmin/update',
                            async: true,
                            data: {
                                'username': $('#username2').val(),
                                'role': role,
                                'tel': $('#phone2').val(),
                                'email': $('#L_email2').val(),
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
                    } else {
                        return false
                    }
                });
            });
        }
    });
};