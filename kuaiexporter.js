// ==UserScript==
// @name        迅雷快传
// @namespace   http://www.ualberta.ca/~xiaohui6
// @description 快速批量复制迅雷快传下载地址，直接复制到离线下载即可。
// @version     0.4.25
// @include     http://kuai.xunlei.com/d/*
// ==/UserScript==

function getcookie(c_name) {
	if (document.cookie.length > 0) {
		c_start=document.cookie.indexOf(c_name + "=");
		if (c_start != -1) {
			c_start=c_start + c_name.length + 1;
			c_end=document.cookie.indexOf(";", c_start);

			if (c_end == -1) c_end = document.cookie.length;
			return document.cookie.substring(c_start, c_end);
		}
	}
	return "";
}

// use to deal with 192.168 interIP
function converturl(qs) {
	var url = "";
	var items = qs.split("&");
	var item = null, name = null, value = null, header = null;
	var needreplace = false;
	for(var i=0; i < items.length; i++){
		item = items[i].split("=");
		name = item[0];
		value = item[1];

		if(name == "mu") continue;
		if(name == "d") {
			needreplace = true;
			header = value;
			url += "&f=lixian.vip.xunlei.com";
			continue;
		}

		if(i == 0)
			url += name + "=" + value;
		else
			url += "&" + name + "=" + value;
	}

	if(needreplace == true) {
		var temp1 = "http://" + header + ".sendfile.vip.xunlei.com";
		var start = url.indexOf(":8000");
		var temp2 = url.substr(start);
		url = temp1 + temp2;
	}

	return url;
}

function addtoaria2(url, filename) {
	var kuai_cookie = "";
	kuai_cookie = getcookie("wjysessid");
	//显示Aria2c下载命令
	//alert( "aria2c -c -s10 -x10 --out "+filename+" --header 'Cookie: wjysessid="+kuai_cookie+";' '"+url+"'\n");
	var jsonrpc_path = "http://192.168.11.3:6800/jsonrpc";
	alert("添加中...到YAAW界面查看是否添加成功");
	$.getScript("https://raw.github.com/gist/3116833/aria2jsonrpc.js", function() {
		var aria2 = new ARIA2(jsonrpc_path);
		aria2.addUri(url, {out: filename, header: 'Cookie: wjysessid='+kuai_cookie});
	});
}

function getUrls() {
	var urls = "";
	var files = document.getElementsByClassName("file_name");
	for(k in files)	{
		var url = "";
		var filename = "";

		if (files[k].href != null && files[k].title != null) {
			filename = files[k].title;
			url = converturl(files[k].href);
		}
		urls += url + "\n";
    }
    return urls;
}

function showText() {
    if (textarea.style.display == "none") {
        textarea.style.display = "block";
        btn.innerHTML = "↑隐藏下载地址↑";
    } else {
        textarea.style.display = "none";
        btn.innerHTML = "↓显示下载地址↓";
    }
}

function yaawdownload() {
	//showText();
	//获取选择的列表
	var files = document.getElementsByClassName("file_name");
	for(k in files)	{
		var file_url = "";
		var fil_ename = "";

		if (files[k].href != null && files[k].title != null) {
			file_name = files[k].title;
			file_url = converturl(files[k].href);
			//alert(file_name);
			//alert(file_url);
			addtoaria2(file_url, file_name);
		}
    }
}

// 修改广告为按钮
var btn = document.getElementsByClassName("adb_txt")[0];
btn.innerHTML = "->推送到YAAW下载<-";
btn.addEventListener("click", yaawdownload, false);

// 创建文本框，显示URL
var textarea = document.createElement("textarea");
textarea.innerHTML = getUrls();
textarea.style.width = "354px";
textarea.style.height = "150px";
textarea.style.display = "block";
document.getElementsByClassName("download_w_new")[0].appendChild(textarea);
