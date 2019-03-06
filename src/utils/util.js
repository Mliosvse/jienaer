function toQueryString(obj) {
    function toQueryPair(key, value) {
        if (typeof value === 'undefined') {
            return key;
        }
        return key + '=' + encodeURIComponent(value === null ? '' : String(value));
    }
    let ret = [];
    for (let key in obj) {
        key = encodeURIComponent(key);
        let values = obj[key];
        if (values && values.constructor === Array) {//数组
            let queryValues = [];
            for (let i = 0, len = values.length, value; i < len; i++) {
                value = values[i];
                queryValues.push(toQueryPair(key, value));
            }
            ret = ret.concat(queryValues);
        } else { //字符串
            ret.push(toQueryPair(key, values));
        }
    }
    return ret.join('&');
}

//时间戳转化为时间
function getLocalTime(num) {
    let timestamp4 = new Date(num);//直接用 new Date(时间戳) 格式转化获得当前时间
    return timestamp4.toLocaleDateString().replace(/\//g, "-") + " " + timestamp4.toTimeString().substr(0, 8);
}

function getCreatetime(num) {//去除时间中时区符号
    return num.split('.')[0].replace('T', ' ');//t替换成空格
}

/*
 功能： 截取小数位
 @money:number|string 		金额
 @num:number 				小数位数
 @hasDot:boolean  			是否有逗号
 */
function fmoney(money, num, hasDot) {
    let _money = money;
    num = typeof num === "undefined" ? 2 : num;
    hasDot = typeof hasDot === "undefined" ? true : hasDot;
    if (isNaN(_money)) {//不是数字 直接返回
        console.log("is not a num");
        return _money;
    }
    _money += "";// 转化为字符串
    hasDot = hasDot && _money.replace(/\.\d*/, '').length > 3;//判断是否要自动加千分位
    let index = _money.indexOf("."),//找到小数点
        i = 0;
    if (index === -1) {
        index = _money.length;
        _money += '.';
    }
    while (i++ < num) _money += "0";//补零
    _money = _money.substring(0, index) + _money.substr(index, num + 1);//此时包含小数点
    _money = num === 0 ? +_money : _money;//得到截取后的字符串
    return hasDot ? addDot(_money) : _money;
}

function formatDateTime(inputTime, time) {
    if(!inputTime){
        return ''
    }
    let date = new Date(inputTime);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    if (time === false) {
        return y + '-' + m + '-' + d;
    } else {
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    }
}

//为金额添加逗号；功能:1000->1,000
function addDot(money) {
    //先找到小数点
    let start = money.indexOf(".");
    let result = "", j = 0;
    for (let i = money.length - 1; i >= 0; i--) {
        if (i >= start) {
            result = money[i] + result;
        } else {
            if (j >= 3) {
                result = money[i]+ ',' + result;
                j = 1;
            } else {
                result = money[i] + result;
                j++;
            }
        }
    }
    return result;
}

function is_weixin() {
    let ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}
//判断终端
function checkPlatform() {
    if (/android/i.test(navigator.userAgent)) {
        return "android";
    }
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        return "ios";
    }
    return "android";
}
function Toast(config) {
    let el = document.createElement('span');
    el.innerHTML = config.message;
    el.className = 'zyjToast';
    document.body.appendChild(el);
    setTimeout(function () {
        document.body.removeChild(el);
    },config.delay||1500);
}
//获取浏览器参数
function GetQueryString(name){
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
//p判断是否在app中打开
function isApp() {
    let appInfo = GetQueryString('_appInfo');
    if(appInfo){
        return JSON.parse(appInfo);
    }else {
        return false;
    }
}

//自定义h5页面跳转，区分app和h5
function customGoLink(url) {
    if(isApp()){
        const params = {url};
        window.location.href = '/opennative?name=WEBVIEW&params=' + encodeURIComponent(JSON.stringify(params));
    }else {
        window.location.href = url;
    }
}
//页面高度最小 100% 处理
function setPageHeight100p() {
    document.querySelector('html').style.height='100%';
    document.querySelector('body').style.height='100%';
    document.querySelector('#app').style.height='100%';
}
//页面恢复自适应高度
function recoveryPageHeight() {
    document.querySelector('body').style.height='';
    document.querySelector('html').style.height='';
    document.querySelector('#app').style.height='';
}
//
// 三个参数
// file：文件(类型是图片格式)，
// obj：压缩的参数对象{width:'',height:'',quality:''}  默认图片大小和0.5
// callback：压缩回调函数(参数是压缩后图片数据)
//
function photoCompress(file,obj,callBack){
    let ready = new FileReader();
    /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
    ready.readAsDataURL(file);
    ready.onload = function(){
        let res=this.result;
        canvasDataURL(res,obj,callBack)
    }
}
function canvasDataURL(path, obj, callback){
    let img = new Image();
    img.src = path;
    img.onload = function(){
        let that = this;
        // 默认按比例压缩
        let w = that.width,
            h = that.height,
            scale = w / h;
        w = obj.width || w;
        h = obj.height || (w / scale);
        let quality = 0.5;  // 默认图片质量为0.5
        //生成canvas
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        // 创建属性节点
        let anw = document.createAttribute("width");
        anw.nodeValue = w;
        let anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        if(obj.quality && obj.quality <= 1 && obj.quality > 0){
            quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        let base64 = canvas.toDataURL('image/jpeg', quality);
        // 回调函数返回base64的值
        const file = convertBase64UrlToBlob(base64);
        callback(file);
    }
}
/**
 * 将以base64的图片url数据转换为Blob
 * @param urlData
 * 用url方式表示的base64图片数据
 */
function convertBase64UrlToBlob(urlData){
    let arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    //转换成file对象
    return new File([u8arr], 'file', {type:mime});
    //转换成成blob对象
    // return new Blob([u8arr], {type:mime});
}

export default  { Toast,checkPlatform,is_weixin,photoCompress,toQueryString, getLocalTime, getCreatetime, fmoney, formatDateTime,GetQueryString,isApp,customGoLink,setPageHeight100p,recoveryPageHeight};