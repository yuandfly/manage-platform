/**
 * 对象自身属性中是否具有指定的属性
 * 方法返回一个布尔值
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * 指定的属性是否可枚举
 * 方法返回一个布尔值
 */
const propIsEnumerable = Object.prototype.propertyIsEnumerable;

/**
 * 判断是否合法对象或者函数
 * @param x
 */
function isObj(x) {
  const type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

/**
 * 判断是无
 * @param x
 */
function isNil(x) {
  return x === undefined || x === null;
}

/**
 * 将源对象属性过户给目标对象
 * @param to 目标对象
 * @param from 源对象
 * @param key 指定属性名
 */
function assignKey(to, from, key) {
  const val = from[key];
  // 如果目标对象指定属性值为undefined或val直接跳过
  if (isNil(val)) {
    return;
  }
  // 对象自身属性中是否具有指定的属性
  if (hasOwnProperty.call(to, key)) {
    if (isNil(to[key])) {
      throw new TypeError('Cannot convert undefined or null to object (' + key + ')');
    }
  }
  // 如果不为空且可枚举，则直接浅拷贝赋值
  if (!hasOwnProperty.call(to, key) || !isObj(val)) {
    to[key] = val;
  } else {
    to[key] = assign(Object(to[key]), val);
  }
}

/**
 * 将源对象过户给目标对象
 * @param to 目标对象
 * @param from 源对象
 */
function assign(to, from) {
  if (to === from) {
    return to;
  }

  from = Object(from);

  for (const key in from) {
    if (hasOwnProperty.call(from, key)) {
      assignKey(to, from, key);
    }
  }

  if (Object.getOwnPropertySymbols) {
    const symbols = Object.getOwnPropertySymbols(from);

    for (const symbol of symbols) {
      if (propIsEnumerable.call(from, symbol)) {
        assignKey(to, from, symbol);
      }
    }
  }

  return to;
}
/**
 * 深度将所有可枚举自身属性的值从一个或多个源对象复制到目标对象。返回目标对象。
 * @param target 要复制到的目标对象
 * @param source 要从中复制属性的源对象
 */
export function deepAssign(target, source)
/**
 * 深度将所有可枚举自身属性的值从一个或多个源对象复制到目标对象。返回目标对象。
 * @param target 要复制到的目标对象
 * @param source1 复制属性的第一个源对象
 * @param source2 复制属性的第二个源对象
 */
export function deepAssign(target, source1, source2)
/**
 * 深度将所有可枚举自身属性的值从一个或多个源对象复制到目标对象。返回目标对象。
 * @param target 要复制到的目标对象
 * @param source1 复制属性的第一个源对象
 * @param source2 复制属性的第二个源对象
 * @param source3 复制属性的第三个源对象
 */
export function deepAssign(target, source1, source2, source3)
/**
 * 深度将所有可枚举自身属性的值从一个或多个源对象复制到目标对象。返回目标对象。
 * @param target 要复制到的目标对象
 * @param sources 复制属性的一个或多个源对象
 */
export function deepAssign(target, ...sources) {
  // 第一个参数为空，则抛错
  if (isNil(target)) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  // 转成对象
  const to = Object(target);
  // 遍历剩余所有参数
  for (const source of sources) {
    // 参数为空，则跳过，继续下一个
    if (isNil(source)) {
      continue;
    }
    // 调用本地方法合并
    assign(to, source);
  }

  return to;
}
