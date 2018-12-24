document.addEventListener("DOMContentLoaded", () => {
	// 获取节点，渲染会员列表  再写分页  再写增删改查
	let tbody = document.querySelector(".layui-tbody");

	// 发送请求
	let status = [200, 304];

	function render(arr) {
		return `<tr data-id="${arr._id}">
                    <td>
                        <div class="layui-unselect layui-form-checkbox " lay-skin="primary" data-id='2'><i class="layui-icon">&#xe605;</i></div>
                    </td>
                    <td>
                        ${arr._id}
                    </td>
                 
                    <td>
                        ${arr.category}
                    </td>
                    <td class="td-manage">
                        <a title="编辑" href="javascript:;" onclick="cate_edit('编辑','../html/category-edit.html','4','','510')"
                        class="ml-5" style="text-decoration:none">
                        
                        </a>
                        <a title="删除" href="javascript:;" onclick="cate_del(this,'1')" 
                        style="text-decoration:none">
                            <i class="layui-icon">&#xe640;</i>
                        </a>
                    </td>
                </tr> `
	}

	let xhr = new XMLHttpRequest();
	xhr.open("get", "/category", true);
	xhr.send();
	var str2 = "";
	xhr.onload = () => {
		if(status.includes(xhr.status)) {

			let res = JSON.parse(xhr.responseText);
			// console.log(res);
			let arr = res.data;

			for(var i = 0; i < arr.length; i++) {

				str2 += render(arr[i]);

			}
			tbody.innerHTML = str2;

		}
	}

	tbody.onclick = function(ev) {

		if(ev.target.className == "layui-icon") {

			console.log(ev.target.parentNode.className);
			if(ev.target.parentNode.classList.contains('layui-form-checked')) {
				(ev.target.parentNode).classList.remove("layui-form-checked");
			} else {
				(ev.target.parentNode).classList.add("layui-form-checked");
			}

		}

	}

})