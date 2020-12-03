/* 判断是否为空 null| ""|undefined*/
const isNullOrEmpty = function (val) {
  if (val == null || val == "" || typeof (val) == undefined) {
    return true;
  } else {
    return false;
  }
}

/* 日期格式化，插入可以是时间字符串或时间类型变量 ;传入两种格式"yyyy-MM-dd"|"yyyy-MM-dd HH:mm:ss"*/
const timeFormat = (value, format) => {
  let date = value instanceof Date ? value : new Date(value);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  let h = date.getHours();
  let min = date.getMinutes();
  let s = date.getSeconds();
  let result = "";
  if (format == undefined) {
    result = `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d} ${
      h < 10 ? "0" + h : h
    }:${min < 10 ? "0" + min : min}:${s < 10 ? "0" + s : s}`;
  }
  if (format == "yyyy-MM-dd") {
    result = `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
  }
  if (format == "yyyy-MM-dd HH:mm:ss") {
    result = `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d} ${h<10?'0'+h:h}:${min<10?'0'+min:min}:${s<10?'0'+s:s}`;
  }

  return result;
};


export {
  isNullOrEmpty,
  timeFormat
}
