// 获取id查询对应管理员信息，渲染编辑页面
var _id = '';
if (Cookie.get('_id')) {

    _id = Cookie.get('_id');

    $.ajax({
        type: 'get',
        // url: 'http://localhost:3008/addAdmin/checkid',
        url: '/addAdmin/checkid',
        async: true,
        data: {
            '_id': _id
        },
        success: function(str) {
            // console.log(str);
            var renderdata = str.data;
            console.log(renderdata);
            // x_admin_show('','./admin-list.html');

            $('#username2').val(renderdata.username);
            $('#phone2').val(renderdata.tel);
            $('#L_email2').val(renderdata.email);
            // $('#L_pass2').val(renderdata.password);
            // $('#L_repass2').val(renderdata.password);

            var isok1 = true;
            $('#username2').blur(() => {
                var val = $('#username2').val();
                var strs = checkReg.trim(val);
                console.log(strs);

                // 修改登录名，发起请求，确定登录名可以使用
                if (strs && checkReg.username(strs)) {
                    $.ajax({
                        type: 'get',
                        // url: 'http://localhost:3008/addAdmin/checkname',
                        url: '/addAdmin/checkname',
                        async: true,
                        data: {
                            'username': strs
                        },
                        success: (str) => {
                            if (str.code == '1') {
                                if (renderdata.username == str.data.username) {
                                    // console.log(1);
                                    isok1 = true;
                                } else {
                                    // console.log('same');
                                    $('#userInfor').html('该登录名已存在');
                                    $('#userInfor').css('color', 'red');;
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
            $('#L_pass2').onblur(function(){
                var val = $('#L_pass2').val();
                var strs = checkReg.trim(val);
                console.log(strs);

                // 修改登录名，发起请求，确定登录名可以使用
                // if (strs && checkReg.username(strs)) {
                    $.ajax({
                        type: 'get',
                        // url: 'http://localhost:3008/addAdmin/checkname',
                        url: '/addAdmin/checkinfor',
                        async: true,
                        data: {
                            'password': strs,
                            '_id':_id
                        },
                        success: (str) => {
                            if (str.code == '1') {
                                if (renderdata.username == str.data.username) {
                                    // console.log(1);
                                    isok2 = true;
                                } else {
                                    // console.log('same');
                                    $('#userInfor').html('该登录名已存在');
                                    $('#userInfor').css('color', 'red');;
                                    isok1 = false;
                                }

                            } else {
                                $('#userInfor').html('');
                                isok2 = true;
                            }
                        }
                    });
                } else {
                    $('#userInfor').html('登录名以字母开头，3-20位');
                    $('#userInfor').css('color', 'red');
                    isok2 = false;
                }

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
                // console.log($(this));
                $(this).prop('checked', 'checked');
                role = $(this).data('names');
            });

            // 自定义验证规则与监听提交
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
                            // url: 'http://localhost:3008/addAdmin/update',
                            url: '/addAdmin/update',
                            async: true,
                            data: {
                                'username': $('#username2').val(),
                                'password': $('#L_pass2').val(),
                                'role': role,
                                'tel': $('#phone2').val(),
                                'email': $('#L_email2').val(),
                                '_id': renderdata._id
                            },
                            success: function(str) {
                                console.log(str);
                                // x_admin_show('','./admin-list.html');
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
                        console.log('请输入完整信息');
                        return false;
                    }
                });
            });

        }
    });
};