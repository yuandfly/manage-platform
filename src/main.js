import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import echarts from 'echarts'
import axios from 'axios'
import '@/common/js/directives.js' //弹框可以拖动  在需要的地方添加 v-dialogDrag 即可
import '@/common/scss/common.scss'
import router from './router/index'
import '@/assets/js/china.js'
/**富文本编辑器 */
import VueKindEditor from './plugin/kindeditor.js'
import '../static/kindeditor/themes/default/default.css'
import '../static/kindeditor/kindeditor-all-min.js'
import '../static/kindeditor/lang/zh-CN.js'

/* 过滤器 */
import '@/common/js/filters.js'
/* 全局组件 */
import '@/components';

/* 全局样式 */
import '../static/css/global.css'

/* 引入vuex数据 */
import store from '@/store/index'

/* 引入Bus */
import Bus from '@/common/js/event-bus'
Vue.prototype.$bus = Bus

/* 导入jq */
import $ from 'jquery'
Vue.prototype.$ = $

// form 表单验证
import formCreate, {
  maker
} from '@form-create/element-ui'
/* 导入过滤 */
import * as filters from '@/filters'
/* 注册过滤*/
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})


Vue.use(VueKindEditor)
Vue.prototype.$echarts = echarts
Vue.use(ElementUI)
Vue.prototype.$axios = axios

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
