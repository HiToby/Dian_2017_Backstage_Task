/**
 * 绑定，删除事件
 * @param {obj对象}   elm       需要绑定事件的对象
 * @param {[type]}   evType     需要绑定的事件名称
 * @param {Function} fn         绑定事件的函数
 * @param {[type]}   useCapture true/false冒泡方式
 */

//给对象绑定事件
function addEvent(elm, evType, fn, useCapture) {
    if (elm.addEventListener) {
        elm.addEventListener(evType, fn, useCapture); //DOM2.0
        return true;
    } else if (elm.attachEvent) {
        var r = elm.attachEvent("on" + evType, fn); //IE5+
        return r;
    } else {
        elm['on' + evType] = fn; //DOM 0
    }
}

//将对象上绑定的事件移除
function removeEvent(elm, evType, fn, useCapture) {
    if (elm.removeEventListener) {
        elm.removeEventListener(evType, fn, useCapture); //DOM2.0
        return true;
    } else if (elm.detachEvent) {
        var r = elm.detachEvent("on" + evType, fn); //IE5+
        return r;
    }
}

function forbiddenEvent(event) {
    event = event || window.event;
    if (event.stopPropagation) event.stopPropagation();
    else event.cancelBubble = true;
    if (event.preventDefault) event.preventDefault();
    else event.returnValue = false;

}

/**
 * 原生JS获取form中的信息
 * @param  {[type]} frmID [description]
 * @return {[type]}       [description]
 */
function getFormQueryString(frmName) {
    var form = document.forms[frmName];  //forms[]返回对文档所有Form对象的引用
    var i, queryString = "",
        and = "";
    var item; // for each form's object
    var itemValue; // store each form object's value
    for (i = 0; i < form.length; i++) {
        item = form[i]; // get form's each object
        if (item.name !== '') {
            if (item.type == 'select-one') {
                itemValue = item.options[item.selectedIndex].value;
            } else if (item.type == 'checkbox' || item.type == 'radio') {
                if (item.checked === false) {
                    continue;
                }
                itemValue = item.value;
            } else if (item.type == 'file') {
                continue; //跳过FILE
            } else if (item.type == 'button' || item.type == 'submit' || item.type == 'reset' || item.type == 'image') { // ignore this type
                continue;
            } else {
                itemValue = item.value;
            }
            //itemValue = encodeURIComponent(itemValue);
            queryString += and + item.name + '=' + itemValue;
            and = "&";
        }
    }
    return queryString;
}

var xmlhttp;
if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
} else { // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}

//ajax请求数据
function getData(method, url, queryString, fnc) { //获取JSON数据
    xmlhttp.open(method, url, true);     //通过异步的方式连接url
    //设置请求头
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xmlhttp.send(queryString);  //发送body内容
    xmlhttp.onreadystatechange = fnc;     //定义当状态改变时调用的函数
}
//显示新增联系人窗口
function showAddForm() {
    document.forms.addInf.style.zIndex = "3";
    document.forms.addInf.style.opacity = "1";
    document.forms.addInf.style.top = "50%";
}
//隐藏新增联系人窗口
function hideAddForm() {
    document.forms.addInf.style.zIndex = "0";
    document.forms.addInf.style.opacity = "0";
    document.forms.addInf.style.top = "20%";
}

//建立联系人信息表
//data表示一个联系人的信息
/*data的格式为：
    {
        "contact_id": "string",
        "name": "string",
        "phone": "string",
        "email": "string"
    } */
function createInfList(data, parent) {
    //建立一个列表，id为contact_id
    var list = document.createElement('li');
    list.className = "inf-list";
    list.setAttribute('id', data.contact_id);
    //创建一个新的行内元素name并插入list
    var name = document.createElement('span');  //span用于组合行内元素
    name.title = "name";
    name.innerText = data.name;
    list.appendChild(name);
    //创建一个name输入框，用于输入姓名
    var nameInput = document.createElement('input');
    nameInput.type = "text";
    nameInput.name = "name";
    nameInput.setAttribute('placeholder', '姓名');
    list.appendChild(nameInput);
    //创建一个新的行内元素email，并插入list
    var email = document.createElement('span');
    email.title = "email";
    email.innerText = data.email;
    list.appendChild(email);
    //创建一个输入框用于输入email
    var emailInput = document.createElement('input');
    emailInput.type = "text";
    emailInput.name = "email";
    emailInput.setAttribute('placeholder', '邮箱');
    list.appendChild(emailInput);
    //创建一个新的行内元素phone，并插入list
    var phone = document.createElement('span');
    phone.title = "phone";
    phone.innerText = data.phone;
    list.appendChild(phone);
    //创建一个电话输入框
    var phoneInput = document.createElement('input');
    phoneInput.type = "text";
    phoneInput.name = "phone";
    phoneInput.setAttribute('placeholder', '手机号码');
    list.appendChild(phoneInput);
    //创建新的元素区块，该区块包含增，删，改三个按钮
    var operation = document.createElement('div');
    operation.className = "operation";
    var edit = document.createElement('div');
    var delete_div = document.createElement('div');
    var save = document.createElement('div');
    edit.className = "edit inline-block";
    delete_div.className = "delete inline-block";
    save.className = "save inline-block";
    operation.appendChild(edit);
    operation.appendChild(save);
    operation.appendChild(delete_div);
    list.appendChild(operation);
    //parent为list的双亲节点
    parent.appendChild(list);
    //如果点击删除按钮，那么调用函数操作
    addEvent(delete_div, "click", function(event) {
        deleteInf(event);    //删除该联系人
    }, false);
    //如果点击编辑按钮，那么调用编辑操作
    addEvent(edit, "click", function(event) {
        editInf(event);//编辑该联系人
        forbiddenEvent(event);
    }, false);
    //如果点击保存按钮，那么调用保存操作
    addEvent(save,"click",function (eventq) {
        updateInf(event);  //更新联系人信息
    },false);
}
//得到所有联系人信息的函数
function getAllInf() {
    getData("GET", "http://localhost:3000/contacts", null, function() {
        if (xmlhttp.readyState == 4) {   //如果服务器响应并成功返回数据
            if (xmlhttp.status == 200) {
                //将数据转化成javascript对象
                var data = JSON.parse(xmlhttp.responseText).result;
                console.log(data);    //显示data
                //创建空的虚拟的节点对象，当插入到文档树时，插入的不是其本身，而是其所有的子孙节点
                //这样起到暂存作用，可以一次性将许多节点同时插入，减少页面渲染dom的次数，提高效率
                var wrap = document.createDocumentFragment();
                for (var i = 0; i < data.length; i++) {   //循环插入联系人信息
                    createInfList(data[i], wrap);  //以该虚拟的节点为双亲节点插入数据
                }
                //给html文件中list将所有的联系人信息添加显示
                document.querySelector("ul.container").appendChild(wrap);
            } else {
                console.log("发生错误" + xmlhttp.status);
            }
        }
    });
}

//删除联系人信息
function deleteInf(event) {
    var obj = event.target;
    getData("DELETE", "http://localhost:3000/contacts/" + obj.parentNode.parentNode.getAttribute('id'), null, function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                obj.parentNode.parentNode.parentNode.removeChild(obj.parentNode.parentNode);
            } else {
                console.log("发生错误" + xmlhttp.status);
            }
        }
    });
}

//更新联系人信息
function updateInf(event) {
    var obj = event.target,
        parent = obj.parentNode.parentNode,
        queryString = "",
        name = parent.querySelector('input[name="name"]'),
        email = parent.querySelector('input[name="email"]'),
        phone = parent.querySelector('input[name="phone"]'),
        emailPattern = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/,
        numberPattern = /^[U][2][0]\d{7}$/,
        phonePattern = /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
    if (!name.value) {
        alert('请输入姓名');
        name.focus();
    } else if (!email.value) {
        alert('请输入邮箱');
        email.focus();
    } else if (!emailPattern.test(email.value)) {
        alert('请输入有效的学号');
        email.focus();
    } else if (!phone.value) {
        alert('请输入手机号码');
        phone.focus();
    } else if (!phonePattern.test(phone.value)) {
        alert('请输入有效的手机号码');
        phone.focus();
    } else {
        var info = {
        	name: 'error',
        	email: 'test@qq.com',
        	phone: '18973707225'
        };
        info.name = name.value;
        info.email = email.value;
        info.phone = phone.value;
        console.log(info);
        getData("PUT", "http://localhost:3000/contacts/" + parent.getAttribute('id'), JSON.stringify(info), function() {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var data = JSON.parse(xmlhttp.responseText).result;
                    obj.style.display = "none";
                    obj.previousElementSibling.style.display = "inline-block";
                    hideInputs(parent);
                } else {
                    console.log("发生错误" + xmlhttp.status);
                }
            }
        });
    }
}

//编辑联系人信息
function editInf(event) {
    var obj = event.target;
    obj.style.display = "none";
    obj.nextElementSibling.style.display = "inline-block";
    showInputs(obj.parentNode.parentNode);
}
//显示输入的信息并给输入框属性赋值
function showInputs(parent) {
    parent.querySelector('input[name="name"]').style.display = "inline-block";
    parent.querySelector('span[title="name"]').style.display = "none";
    parent.querySelector('input[name="name"]').value = parent.querySelector('span[title="name"]').innerText;
    parent.querySelector('input[name="email"]').style.display = "inline-block";
    parent.querySelector('span[title="email"]').style.display = "none";
    parent.querySelector('input[name="email"]').value = parent.querySelector('span[title="email"]').innerText;
    parent.querySelector('input[name="phone"]').style.display = "inline-block";
    parent.querySelector('span[title="phone"]').style.display = "none";
    parent.querySelector('input[name="phone"]').value = parent.querySelector('span[title="phone"]').innerText;
}

function hideInputs(parent) {
    parent.querySelector('input[name="name"]').style.display = "none";
    parent.querySelector('span[title="name"]').style.display = "inline-block";
    parent.querySelector('span[title="name"]').innerText = parent.querySelector('input[name="name"]').value;
    parent.querySelector('input[name="email"]').style.display = "none";
    parent.querySelector('span[title="email"]').style.display = "inline-block";
    parent.querySelector('span[title="email"]').innerText = parent.querySelector('input[name="email"]').value;
    parent.querySelector('input[name="phone"]').style.display = "none";
    parent.querySelector('span[title="phone"]').style.display = "inline-block";
    parent.querySelector('span[title="phone"]').innerText = parent.querySelector('input[name="phone"]').value;
}

function checkForm() {
}
//新增click事件
addEvent(document.querySelector('div.add'), "click", function(event) {
    showAddForm();            //显示新增联系人窗口
    forbiddenEvent(event);
}, false);
//新增关闭窗口click事件
addEvent(document.querySelector('div.close'), "click", function(event) {
    hideAddForm();
    forbiddenEvent(event);
}, false);
//新增提交新增联系人信息的事件
addEvent(document.forms.addInf, "submit", function(event) {
	forbiddenEvent(event);
    var form = document.forms.addInf,
        emailPattern = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/,
        phonePattern = /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
    if (!form.name.value) {
        alert('请输入姓名');
        form.name.focus();
    } else if (!form.email.value) {
        alert('请输入邮箱');
        form.email.focus();
    } else if (!emailPattern.test(form.email.value)) {
        alert('请输入正确的学号');
        form.email.focus();
    } else if (!form.phone.value) {
        alert('请输入手机号码');
        form.phone.focus();
    } else if (!phonePattern.test(form.phone.value)) {
        alert('请输入正确的手机号码');
        form.phone.focus();
    } else {
        var info = {
        	name: 'error',
        	email: 'test@qq.com',
        	phone: '18973707225'
        };
        info.name = form.name.value;
        info.email = form.email.value;
        info.phone = form.phone.value;
        console.log(info);
        getData("POST", "http://localhost:3000/contacts", JSON.stringify(info), function() {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    window.location.href = "index.html";
                } else {
                    console.log("发生错误" + xmlhttp.status);
                }
            }
        });
    }
}, false);


getAllInf();
