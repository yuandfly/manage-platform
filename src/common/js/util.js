var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';

function padding(s, len) {
  var len = len - (s + '').length;
  for (var i = 0; i < len; i++) {
    s = '0' + s;
  }
  return s;
};

export const getQueryStringByName = function (name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  var context = "";
  if (r != null) {
    context = r[2];
    reg = null;
    r = null;
  }
  return context == null || context == "" || context == "undefined" ? "" : context;
}
export const format = function (date, pattern) {
  pattern = pattern || DEFAULT_PATTERN;
  return pattern.replace(SIGN_REGEXP, function ($0) {
    switch ($0.charAt(0)) {
      case 'y':
        return padding(date.getFullYear(), $0.length);
      case 'M':
        return padding(date.getMonth() + 1, $0.length);
      case 'd':
        return padding(date.getDate(), $0.length);
      case 'w':
        return date.getDay() + 1;
      case 'h':
        return padding(date.getHours(), $0.length);
      case 'm':
        return padding(date.getMinutes(), $0.length);
      case 's':
        return padding(date.getSeconds(), $0.length);
    }
  });
}
export const parse = function (dateString, pattern) {
  var matchs1 = pattern.match(SIGN_REGEXP);
  var matchs2 = dateString.match(/(\d)+/g);
  if (matchs1.length == matchs2.length) {
    var _date = new Date(1970, 0, 1);
    for (var i = 0; i < matchs1.length; i++) {
      var _int = parseInt(matchs2[i]);
      var sign = matchs1[i];
      switch (sign.charAt(0)) {
        case 'y':
          _date.setFullYear(_int);
          break;
        case 'M':
          _date.setMonth(_int - 1);
          break;
        case 'd':
          _date.setDate(_int);
          break;
        case 'h':
          _date.setHours(_int);
          break;
        case 'm':
          _date.setMinutes(_int);
          break;
        case 's':
          _date.setSeconds(_int);
          break;
      }
    }
    return _date;
  }
  return null;
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
