// ==UserScript==
// @name        批量复制迅雷快传下载地址
// @namespace   http://www.ualberta.ca/~xiaohui6
// @version     0.4.25
// @description 快速批量复制迅雷快传下载地址，直接复制到离线下载即可。
// @match       http://kuai.xunlei.com/d/*
// @copyright   2012+, Grey
// ==/UserScript==

function getQueryStringArgs(qs){
     //var qs = (location.search.length > 0 ? location.search.substring(1):"");
     var args = {};
     var items = qs.split("&");
     var item = null, name = null, value = null;

     for(var i=0; i < items.length; i++){
         item = items[i].split("=");
         name = decodeURLComponent(item[0]);
         value = decodeURLComponent(item[1]);
         args[name] = value;
     }
     return args;
}

function getUrls() {
  var urls = "";
	var files = document.getElementsByClassName("file_name");
	for(k in files)	{
		if (files[k].href != null) {
      var params = getQueryStringArgs(files[k].href);
      var name;
      for (name in params) {
        if (typeof params[name] !== "function") {
          urls += name + ":" + params[name] + "<br />";
        }
      }
			//urls += files[k].href + "\n";
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

// 修改广告为按钮
var btn = document.getElementsByClassName("adb_txt")[0];
btn.innerHTML = "↓显示下载地址↓";
btn.addEventListener("click", showText, false);

// 创建文本框，显示URL
var textarea = document.createElement("textarea");
textarea.innerHTML = getUrls();
textarea.style.width = "354px";
textarea.style.height = "150px";
textarea.style.display = "none";
document.getElementsByClassName("download_w_new")[0].appendChild(textarea);
