document.addEventListener("DOMContentLoaded", () => {
	// 获取节点，渲染会员列表  再写分页  再写增删改查
	let tbody = document.querySelector(".layui-tbody");
	// 发送请求
	let status = [200, 304];
	let pagenum = document.querySelector(".pagenum");

	var qty = 6;

	let num = 0;

	function render(arr) {
		return ` <tr data-id="${arr._id}">
            <td>
              <div class="layui-unselect layui-form-checkbox" lay-skin="primary"><i class="layui-icon">&#xe605;</i></div>
            </td>
            <td>${arr._id}</td>
            <td>${arr.person}</td>
            <td>${arr.number}</td>
            <td>${arr.price}</td>
            <td>${arr.itemSum}</td>
            <td>${arr.pay}</td>
            <td>${arr.total}</td>
            <td>${arr.address}</td>
           
            <td>${arr.time}</td>
            <td class="td-manage">
              <a title="查看" class="edit"  onclick="x_admin_show('编辑','order-edit.html')" href="javascript:;">
                <i class="layui-icon">&#xe63c;</i>
              </a>
              <a title="删除" onclick="member_del(this,'要删除的id')" href="javascript:;">
                <i class="layui-icon">&#xe640;</i>
              </a>
            </td>
          </tr> `
	}

	let xhr = new XMLHttpRequest();
	xhr.open("get", "/orderlist?page=1&qty=6", true);
	xhr.send();
	var str2 = "";
	xhr.onload = () => {
		if(status.includes(xhr.status)) {

			let res = JSON.parse(xhr.responseText);

			let arr = res.data;

			for(var i = 0; i < arr.length; i++) {
				num++;
				str2 += render(arr[i]);

			}
			tbody.innerHTML = str2;

			for(let j = 0; j < Math.ceil(res.total / qty); j++) {
				let str = `<a class="num">${j+1}</a>`;
				pagenum.innerHTML += str;

			}
			// console.log(pagenum.children[0]);
			pagenum.children[0].classList.add('current');

		}
	}

	//点击不同的页码 发送不同页数
	var now = 1;

	pagenum.onclick = function(ev) {

		var str3 = "";
		var ev = ev || window.event;
		//点哪个是哪个
		if(ev.target.tagName.toLowerCase() == 'a') {
			//ev.target  等同  this
			now = ev.target.innerText; //获取页码
			// console.log(now);
			let xhr = new XMLHttpRequest();
			xhr.open("get", `/orderlist?page=${now}&qty=6`, true);
			xhr.send();
			xhr.onload = () => {
				if(status.includes(xhr.status)) {
					let res = JSON.parse(xhr.responseText);
					// console.log(res);
					let arr = res.data;

					var qty = 6;
					var listnum = (now - 1) * qty;

					for(var i = 0; i < arr.length; i++) {

						str3 += render(arr[i]);

					}
					tbody.innerHTML = str3;

					ev.preventDefault();
					//清空
					for(var i = 0; i < pagenum.children.length; i++) {
						pagenum.children[i].classList.remove("current");
					}
					pagenum.children[now - 1].classList.add('current');
				}
			}

		}

	}

	var prev = document.querySelector(".prev");
	var next = document.querySelector(".next");

	// 点击前一页
	prev.onclick = function() {
		now--;
		if(now <= 1) {
			now = 1; //最小第一页
		}
		var str3 = "";
		let xhr = new XMLHttpRequest();
		xhr.open("get", `/orderlist?page=${now}&qty=6`, true);
		xhr.send();
		xhr.onload = () => {
			if(status.includes(xhr.status)) {
				let res = JSON.parse(xhr.responseText);
				// console.log(res);
				let arr = res.data;

				var qty = 6;
				var listnum = (now - 1) * qty;

				for(var i = 0; i < arr.length; i++) {

					str3 += render(arr[i]);

				}
				tbody.innerHTML = str3;

				//清空
				for(var i = 0; i < pagenum.children.length; i++) {
					pagenum.children[i].classList.remove("current");
				}
				pagenum.children[now - 1].classList.add('current');
			};
		}

	}

	// 点击前一页
	next.onclick = function() {
		var rows = pagenum.children.length;
		console.log(rows);
		now++;
		if(now >= rows) {
			now = rows; //最大就是最后一页
		}
		var str3 = "";
		let xhr = new XMLHttpRequest();
		xhr.open("get", `/orderlist?page=${now}&qty=6`, true);
		xhr.send();
		xhr.onload = () => {
			if(status.includes(xhr.status)) {
				let res = JSON.parse(xhr.responseText);
				// console.log(res);
				let arr = res.data;

				var qty = 6;
				var listnum = (now - 1) * qty;

				for(var i = 0; i < arr.length; i++) {

					str3 += render(arr[i]);

				}
				tbody.innerHTML = str3;

				//清空
				for(var i = 0; i < pagenum.children.length; i++) {
					pagenum.children[i].classList.remove("current");
				}
				pagenum.children[now - 1].classList.add('current');
			};
		}

	}

	var layui = document.querySelector(".layui-unselect");

	layui.onclick = function() {
		layui.classList.add("layui-form-checkbox");
	}
	var unselects = document.querySelectorAll(".layui-unselect")

	var ok = true;
	tbody.onclick = function(ev) {

		if(ev.target.className == "layui-icon") {

			if(ok) {
				(ev.target.parentNode).classList.add("layui-form-checked");
			} else {
				(ev.target.parentNode).classList.remove("layui-form-checked");
			}
			ok = !ok;
		}
	}

	tbody.onclick = function(ev) {

		if(ev.target.className == "layui-icon") {

			if(ev.target.parentNode.classList.contains('layui-form-checked')) {
				(ev.target.parentNode).classList.remove("layui-form-checked");
			} else {
				(ev.target.parentNode).classList.add("layui-form-checked");
			}

		}

	}

	var inputs = document.querySelector(".ordernumber");
	var layuibtn = document.querySelector(".searchbtn");
	// console.log(layuibtn,inputs);
	var str4 = "";
	layuibtn.onclick = function(e) {
		let tex = inputs.value.trim();
		let xhr = new XMLHttpRequest();
		xhr.open("put", `/orderlist/${tex}`, true);
		xhr.send();

		let status = [200, 304];
		xhr.onload = () => {

			if(status.includes(xhr.status)) {

				let res = JSON.parse(xhr.responseText);
				console.log(res);
				let arr = res.data;
				for(var i = 0; i < arr.length; i++) {

					str4 += render(arr[i]);

				}
				tbody.innerHTML = str4;

			};
		}
		e.preventDefault();
	}

	// 点击编辑按钮
	// <a class="edit" title="编辑"  onclick="x_admin_show('编辑','admin-edit.html')" href="javascript:;">
	let datalist;

	$('.layui-tbody').on('click', '.edit', function() {
		// x_admin_show('编辑', 'order-edit.html');

		var _id = $(this).parent().parent().data('id');

		$.ajax({
			type: 'get',
			url: '/orderlist/checkid',
			async: true,
			data: {
				'_id': _id
			},
			success: function(str) {

				var data = str.data;

				// x_admin_show('','./admin-list.html');

				datalist = {
					"number": data.number,
					"person": data.person,
					"phone": data.phone,
					"address": data.address,
					"price": data.price,
					"itemSum": data.itemSum,
					"pay": data.pay,
					"total": data.total,
					"_id": _id
				}

				var cookiestr = JSON.stringify(datalist);

				Cookie.set('data', cookiestr, {});
			}
		});
	})

})