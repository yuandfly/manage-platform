import Vue from 'vue'

/* 超过长度，打点显示 */
Vue.filter('ellipsis',
  (val, num) => {
    if (val.length <= num) {
      return val
    } else {
      const pre = val.substr(0, num - 3)
      return pre + '...'
    }
  });
