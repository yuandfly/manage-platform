import Vue from 'vue';
import './dynamic-form'
import Aside from './aside.vue'
import EmptyTemp from './empty-temp.vue' //空数据时的占位模板
import WordScroll from './word-scroll.vue'
Vue.component('form-aside', Aside);
Vue.component('empty-temp', EmptyTemp);
Vue.component('word-scroll', WordScroll);
