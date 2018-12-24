// document.addEventListener("DomContentLoaded",()=>{
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
				// console.log(res);
				if(res.code == 1) {
					Cookie.set("username", _username, {
						"path": "/"
					})
					location.href = "../index.html";
				} else {
					alert("账号或密码有误")
					// hr20.innerHTML="账号或密码有误";
					// hr20.style.color="red";
				}

			}

		}

		xhr.open("post", "/user/login", true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

		xhr.send(`username=${_username}&password=${_password}&time=${Date.now()}`);
		e.preventDefault();
	}

}) //最后的结尾