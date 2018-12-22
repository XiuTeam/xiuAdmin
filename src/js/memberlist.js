 document.addEventListener("DOMContentLoaded",()=>{
    // 获取节点，渲染会员列表  再写分页  再写增删改查
    let tbody=document.querySelector(".layui-tbody");
    // 发送请求
      let status=[200,304];
      let pagenum=document.querySelector(".pagenum");
     
      var qty=6;

     let num=0;


    function render(arr){
    return ` <tr data-id="${arr._id}">
            <td>
              <div class="layui-unselect layui-form-checkbox " lay-skin="primary" data-id='2'><i class="layui-icon">&#xe605;</i></div>
            </td>
            <td>${arr._id}</td>
            <td>${arr.username}</td>
            <td>${arr.gender}</td>
            <td>${arr.tel}</td>
            <td>${arr.email}</td>
            <td>${arr.address}</td>
            <td>${arr.time}</td>
            <td class="td-status">
              <span class="layui-btn layui-btn-normal layui-btn-mini">已启用</span></td>
            <td class="td-manage">
              <a onclick="member_stop(this,'10001')" href="javascript:;"  title="启用">
                <i class="layui-icon">&#xe601;</i>
              </a>
              <a title="编辑"  class="edit"  onclick="x_admin_show('编辑','member-edit.html')" href="javascript:;">
                <i class="layui-icon">&#xe642;</i>
              </a>
              <a onclick="x_admin_show('修改密码','member-password.html',600,400)" title="修改密码" href="javascript:;">
                <i class="layui-icon">&#xe631;</i>
              </a>
              <a title="删除" onclick="member_del(this,'要删除的id')" href="javascript:;">
                <i class="layui-icon">&#xe640;</i>
              </a>
            </td>
          </tr>`
    }



    let xhr=new XMLHttpRequest();
    xhr.open("get","/member?page=0&qty=6",true);
    xhr.send();
    var str2="";
     xhr.onload=()=>{
     if(status.includes(xhr.status)){

                    let res=JSON.parse(xhr.responseText);
                    // console.log(res);
                    let arr=res.data;
                    // console.log(arr);
                   
                 for(var i=0;i<arr.length;i++){
                    num++;
                    str2+=render(arr[i]);
                   
                 } tbody.innerHTML=str2;

                for(let j=0;j<res.total/qty;j++){
                   let str=`<a class="num">${j+1}</a>`;
                 pagenum.innerHTML+=str;

                }
                 pagenum.children[0].classList.add('current');
    
         }
    }    







//点击不同的页码 发送不同页数
        var now=1;
        
   pagenum.onclick=function(){
    

    var str3="";
        var ev = ev || window.event;
          //点哪个是哪个
        if(ev.target.tagName.toLowerCase() == 'a'){
            //ev.target  等同  this
            now=ev.target.innerText;//获取页码
            // console.log(now);
           let xhr=new XMLHttpRequest();
            xhr.open("get",`/member?page=${now}&qty=6`,true);
            xhr.send();
             xhr.onload=()=>{
                 if(status.includes(xhr.status)){
                    let res=JSON.parse(xhr.responseText);
                    // console.log(res);
                    let arr=res.data;
                    
                       var qty=6;
                   var listnum=(now-1)*qty;
                 
               
                 for(var i=0;i<arr.length;i++){
             
                 str3+=render(arr[i]);
                   
                 } 
                 tbody.innerHTML=str3;

                // ev.preventDefault();
                  //清空
                    for(var i=0;i<pagenum.children.length;i++){
                      pagenum.children[i].classList.remove("current");
                    }
                    pagenum.children[now-1].classList.add('current');
    
                 }
             }    
               
      }

 }

var prev=document.querySelector(".prev");
var next=document.querySelector(".next");

// 点击前一页
prev.onclick=function(){
          now--;
          if(now<=1){
            now=1;//最小第一页
          }
          var str3="";
        let xhr=new XMLHttpRequest();
            xhr.open("get",`/member?page=${now}&qty=6`,true);
            xhr.send();
              xhr.onload=()=>{
                 if(status.includes(xhr.status)){
                    let res=JSON.parse(xhr.responseText);
                    // console.log(res);
                    let arr=res.data;
                    
                    var qty=6;
                   var listnum=(now-1)*qty;
                 
                 
                 for(var i=0;i<arr.length;i++){
         
                 str3+=render(arr[i]);
                   
                 } 
                 tbody.innerHTML=str3;
                
       
                //清空
                    for(var i=0;i<pagenum.children.length;i++){
                      pagenum.children[i].classList.remove("current");
                    }
                    pagenum.children[now-1].classList.add('current');
              };
          }

}

// 点击前一页
next.onclick=function(){
  var rows=pagenum.children.length;
  console.log(rows);
         now++;
            if(now>=rows){
            now=rows;//最大就是最后一页
          }
          var str3="";
        let xhr=new XMLHttpRequest();
            xhr.open("get",`/member?page=${now}&qty=6`,true);
            xhr.send();
              xhr.onload=()=>{
                 if(status.includes(xhr.status)){
                    let res=JSON.parse(xhr.responseText);
                    // console.log(res);
                    let arr=res.data;
                    
                    var qty=6;
                   var listnum=(now-1)*qty;
                 
                 
                 for(var i=0;i<arr.length;i++){
         
                 str3+=render(arr[i]);
                   
                 } 
                 tbody.innerHTML=str3;
                
       
                //清空
                    for(var i=0;i<pagenum.children.length;i++){
                      pagenum.children[i].classList.remove("current");
                    }
                    pagenum.children[now-1].classList.add('current');
              };
          }

}


// var layui=document.querySelector(".layui-unselect");
// console.log(layui);
// layui.onclick=function(){
//   layui.classList.add("layui-form-checkbox");
// }
// var unselects=document.querySelectorAll(".layui-unselect")

// var ok=true;
// tbody.onclick=function(ev){

//   if(ev.target.className=="layui-icon"){


//     if(ok){
//         (ev.target.parentNode).classList.add("layui-form-checked");
//   }else{
//      (ev.target.parentNode).classList.remove("layui-form-checked");
//   }
//   ok=!ok;
// }
// }








tbody.onclick=function(ev){

  if(ev.target.className=="layui-icon"){

console.log(ev.target.parentNode.className);
    if(ev.target.parentNode.classList.contains('layui-form-checked')){
        (ev.target.parentNode).classList.remove("layui-form-checked");
  }else{
     (ev.target.parentNode).classList.add("layui-form-checked");
  }
 
}

}


//查询
var inputs=document.querySelector(".usercenter");
var layuibtn=document.querySelector(".searchbtn");
// console.log(layuibtn,inputs);
  var str4="";
layuibtn.onclick=function(e){
  let tex=inputs.value.trim();
  let xhr=new XMLHttpRequest();
              xhr.open("put",`/member/${tex}`,true);
              xhr.send();

              let status=[200,304];
               xhr.onload=()=>{

            if(status.includes(xhr.status)){

               let res=JSON.parse(xhr.responseText);
                    console.log(res);
                      let arr=res.data;
                 for(var i=0;i<arr.length;i++){
                 
               
                 str4+=render(arr[i]);
                   
                 } tbody.innerHTML=str4;


                    
             };
         }
          e.preventDefault();
      }









// 点击编辑按钮
// <a class="edit" title="编辑"  onclick="x_admin_show('编辑','admin-edit.html')" href="javascript:;">
let datalist;

$('.layui-tbody').on('click', '.edit', function() {
  x_admin_show('编辑', 'member-edit.html');

  var _id = $(this).parent().parent().data('id');
  console.log(333);
  $.ajax({
    type: 'get',
    url: '/member/checkid',
    async: true,
    data: {
      '_id': _id
    },
    success: function(str) {
      console.log(str);
      var data = str.data;
      console.log(data);
      // x_admin_show('','./admin-list.html');

      datalist = {
        'username': data.username,
      
        'email': data.email,
        'password': data.password,
        
        '_id': data._id,
      
      }

      
      var cookiestr = JSON.stringify(datalist);
      console.log(cookiestr);
      Cookie.set('data', cookiestr, {});
    }
  });
})





//封装cookie函数：一个对象多重功能
//存: Cookie.set()
//取: Cookie.get()
//删: Cookie.remove()

var Cookie = {
  //设置cookie，存数据到cookie里面
  set: function(name, value, prop) {
    var str = name + '=' + value;
    //json(prop)存后面一些可选参数
    //expires:设置失效时间
    if(prop.expires) {
      str += ';expires=' + prop.expires.toUTCString(); //把时间转成字符串
    }
    //设置path路径
    if(prop.path) {
      str += ';path=' + prop.path;
    }
    //domain设置可访问cookie的域名
    if(prop.domain) {
      str += ';domain=' + prop.domain;
    }
    document.cookie = str;
  },

  //获取cookie数据
  get: function(key) {
    var cookies = document.cookie;
    // name=tiantian; age=18; usn=yuanyuan; pws=456123

    var arr = cookies.split('; ');
    //['name=tiantian','age=18','usn=yuanyuan','pws=456123']
    for(var i = 0; i < arr.length; i++) {
      var arr2 = arr[i].split('=');
      //['name','tiantian']
      if(key == arr2[0]) {
        return arr2[1];
      }
    }
  },

  //删除
  remove: function(key) {
    //删的原理:设置过期时间
    var now = new Date();
    now.setDate(now.getDate() - 1);
    //重新设置时间
    this.set(key, 'no', {
      expires: now
    });
  }
}










 })

 