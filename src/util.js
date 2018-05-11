
let util = {}

util.$ = (el) => {
  return document.querySelector(el);
}

/**
 * 添加class
 * @param  {object}     obj      dom对象
 * @param  {string}     cls      class名称
 */
util.addClass = (obj, cls) => {
  let obj_class = obj.className; // 获取 class 内容
  let blank = (obj_class != '') ? ' ' : ''; // 判断获取到的 class 是否为空, 如果不为空在前面加个'空格'
  let added = obj_class + blank + cls; // 组合原来的 class 和需要添加的 class
  obj.className = added; // 替换原来的 class
}

/**
 * 删除class
 * @param  {object}     obj      dom对象
 * @param  {string}     cls      class名称
 */
util.removeClass = (obj, cls) => {
  let obj_class = ' ' + obj.className + ' '; // 获取 class 内容, 并在首尾各加一个空格
  obj_class = obj_class.replace(/(\s+)/gi, ' '); // 将多余的空字符替换成一个空格
  let reg = new RegExp(' ' + cls + ' ', 'g');
  let removed = obj_class.replace(' ' + cls + ' ', ' '); // 在原来的 class 替换掉首尾加了空格的 class
  while (reg.test(removed)) {
    removed = removed.replace(reg, ' ');
  }
  removed = removed.replace(/(^\s+)|(\s+$)/g, ''); // 去掉首尾空格
  obj.className = removed; // 替换原来的 class
}

/**
 * 判断是否含有某个class
 * @param  {object}     obj       dom对象
 * @param  {string}     cls       class名称
 * @return {Boolean}              返回true表示有
 */
util.hasClass = (obj, cls) => {
  let obj_class = obj.className; // 获取 class 内容
  let obj_class_lst = obj_class.split(/\s+/); // 通过split空字符将cls转换成数组
  let x = 0;
  for (x in obj_class_lst) {
    if (obj_class_lst[x] == cls) { // 循环数组, 判断是否包含cls
      return true;
    }
  }
  return false;
}

/**
 * 时间戳过滤函数
 * @param  {string | number} value      时间戳
 * @param  {string} format 输出格式 YY: 年, MM: 月, DD: 日, hh: 时, mm: 分, ss: 秒
 *                  'YY-MM-DD hh:mm:ss'
 * @return {[type]}            [description]
 */
util.timeFilter = (value, format) => {
  if (value === null) {
    return null;
  }
  let out;
  let time = new Date();
  time.setTime(value);
  let YY = time.getFullYear(),
    MM = (time.getMonth() + 1) < 10 ? ('0' + ((time.getMonth() + 1) + '')) : (time.getMonth() + 1),
    DD = time.getDate() < 10 ? ('0' + (time.getDate() + '')) : time.getDate(),
    hh = time.getHours() < 10 ? ('0' + (time.getHours() + '')) : time.getHours(),
    mm = time.getMinutes() < 10 ? ('0' + (time.getMinutes() + '')) : time.getMinutes(),
    ss = time.getSeconds() < 10 ? ('0' + (time.getSeconds() + '')) : time.getSeconds();
  out = format ?
    format.replace(/YY/g, YY).replace(/MM/g, MM).replace(/DD/g, DD).replace(/hh/g, hh).replace(/mm/g, mm).replace(/ss/g, ss) :
    YY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss;
  return out;
}

export default util;