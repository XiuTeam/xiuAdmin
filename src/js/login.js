document.addEventListener("DOMContentLoaded", () => {
	let username = document.querySelector(".username");
	let password = document.querySelector(".password");
	let btnLogin = document.querySelector(".btnLogin");

	let hr20 = document.querySelector(".hr20");
	let status = [200, 304];

	//点击事件，发送用户名密码
	btnLogin.onclick = (e) => {
		let _username = username.value;
		let _password = password.value;
		let xhr = new XMLHttpRequest();
		xhr.onload = () => {
			if(status.includes(xhr.status)) {
				let res = JSON.parse(xhr.responseText);
				if(res.code == 1) {
					if(res.data.status=="已启用"){
						Cookie.set("username", _username, {
							"path": "/"
						})
					location.href = "../index.html";
					}else{
						layer.msg('对不起，该账号已停用!', {
	                        icon: 5,
	                        time: 1000
	                    });
					}
				} else {
					layer.msg('账号或密码有误!', {
                        icon: 5,
                        time: 1000
                    });
				}
			}
		}

		xhr.open("post", "/user/login", true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(`username=${_username}&password=${_password}&time=${Date.now()}`);
		e.preventDefault();
	}

});