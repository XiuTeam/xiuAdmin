// document.addEventListener("DomContentLoaded",()=>{
    document.addEventListener("DOMContentLoaded",()=>{
    let username=document.querySelector(".username");
    let password=document.querySelector(".password");
     let btnLogin=document.querySelector(".btnLogin");



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


    
let hr20=document.querySelector(".hr20");
    
        let status=[200,304];
     
        //点击事件，发送用户名密码
        btnLogin.onclick=(e)=>{
   
            let _username=username.value;
            let _password=password.value;
            let xhr=new XMLHttpRequest();
            xhr.onload=()=>{
                if(status.includes(xhr.status)){
                    let res=JSON.parse(xhr.responseText);
                    // console.log(res);
                    if(res.code==1){
                        Cookie.set("username",_username,{"path":"/"})
                        location.href="../index.html";
                    }else{
                        alert("账号或密码有误")
                        // hr20.innerHTML="账号或密码有误";
                        // hr20.style.color="red";
                    }

                }

                }
      

            xhr.open("post","/user/login",true);
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

            xhr.send(`username=${_username}&password=${_password}&time=${Date.now()}`);
            e.preventDefault();
        }










       })//最后的结尾


