/**
 * Created by ITL on 2018/9/3.
 */
window.CK = function(){};

/**
 * @functionName: setCookie
 * @Description: set cookies /h
 * @author: KN
 */
Function.prototype.setCookie = function(name, value, hour) {
    var len = arguments.length;
    var exp = new Date();

    // 默认一天
    if (len === 2) {
        exp.setTime(exp.getTime() + 24 * 60 * 60 * 1000)
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/';
    } else if (len === 3) {
        exp.setTime(exp.getTime() + hour * 60 * 60 * 1000);
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/';
    }
}

/**
 *
 * @functionName: getCookie
 * @Description: get cookies
 * @author: KN
 *
 */
Function.prototype.getCookie = function(name) {
    var arr,
        reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)'),
        res = null;

    if (arr = document.cookie.match(reg)) {
        res = unescape(arr[2])
    }

    return res;
}

/**
 *
 * @functionName: deleteCookie
 * @Description: delete cookies
 * @author: KN
 *
 */
Function.prototype.deleteCookie = function(name) {
    CK.setCookie(name, '', -1);
}