/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}


/* 类型判断 */
export function checkType(data) { // 用来判断被拷贝对象数据类型的函数
  return Object.prototype.toString.call(data).slice(8, -1)
}
/**
 * @param {any} source
 * @returns {Object}
 */

export function deepClone(source) { // 实现深度拷贝的函数
  let result, sourceType = checkType(source)
  if (sourceType === 'Object') { // 只有对象和数组才进行深度拷贝
    result = {}
  } else if (sourceType === 'Array') {
    result = []
  } else {
    return source
  }
  for (let i in source) { // i为对象的key或数组的下标
    let value = source[i]
    let valueType = checkType(value)
    if (valueType === 'Object' || valueType === 'Array') {
      // 当拷贝的对象中还有数组或是对象时进行递归，克隆它们中的内容，直到递归完所有数组或对象为止
      result[i] = deepClone(value)
    } else {
      result[i] = value
    }
  }
  return result // 返回最终的结果
}

/**
 * @param {Object} FirstOBJ,SecondOBJ
 * @returns {Object}
 */
export function deepAssign(FirstOBJ, SecondOBJ) { // 深度合并对象
  for (var key in SecondOBJ) {
    FirstOBJ[key] = FirstOBJ[key] && FirstOBJ[key].toString() === "[object Object]" ?
      deepAssign(FirstOBJ[key], SecondOBJ[key]) : FirstOBJ[key] = SecondOBJ[key];
  }
  return FirstOBJ;
}
