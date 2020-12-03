import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(Router)

import { getCookie, delCookie } from '@/common/js/cookie.js'

import crypto from '@/common/js/crypto.js'

let routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: resolve => require(['@/views/Login.vue'], resolve)
  },
  {
    path: '/test',
    name: 'Test',
    component: resolve => require(['@/views/test.vue'], resolve)
  },
  {
    path: '/hn-chart',
    name:"大屏总览",
    component: resolve => require(['@/views/hn-statistics/hn-chart.vue'], resolve)
  },
  {
    path: '/home',
    component: Home,
    name: '菜单主页',
    meta: {
      requireAuth: true
    },
    redirect: '/home/my-desktop',
    children: [
      {
        path: 'my-desktop',
        name: '我的桌面',
        component: resolve => require(['@/views/my-desktop/index.vue'], resolve),
        children: []
      },
      {
        path: 'form',
        name: '表单管理',
        redirect: '/home/form/create-element',
        component: resolve => require(['@/views/form-management/index.vue'], resolve),
        children: [
          {
            path: 'create-element',
            name:'创建元素',
            component: resolve => require(['@/views/element-management/create-element.vue'], resolve)
          },
          {
            path: 'element-list',
            name:'元素列表',
            component: resolve => require(['@/views/element-management/element-list.vue'], resolve)
          },
          {
            path: 'create-module',
            name:'创建模块',
            component: resolve => require(['@/views/module-management/create-module.vue'], resolve)
          },
          {
            path: 'module-list',
            name:'模块列表',
            component: resolve => require(['@/views/module-management/module-list.vue'], resolve)
          },
          {
            path: 'create-form',
            name:'创建表单',
            component: resolve => require(['@/views/form-management/create-form/index.vue'], resolve)
          },
          {
            path: 'form-list',
            name: '已建表单',
            component: resolve => require(['@/views/form-management/form-list/index.vue'], resolve)
          },
          {
            path: 'form-edit',
            name: '修改表单',
            component: resolve => require(['@/views/form-management/form-list/page-edit.vue'], resolve)
          },
          {
            path: 'add-rules',
            name: '添加规则',
            component: resolve => require(['@/views/form-management/form-list/add-rules.vue'], resolve)
          }
        ]
      },
      {
        path: 'fill',
        name: '直报创建管理',
        redirect: '/home/fill/create-fill',
        component: resolve => require(['@/views/fill-management/index.vue'], resolve),
        children: [
          {
            path: 'create-fill',
            name: '创建直报',
            component: resolve => require(['@/views/fill-management/create-fill/index.vue'], resolve)
          },
          {
            path: 'fill-draft',
            name: '直报草稿',
            component: resolve => require(['@/views/fill-management/fill-draft/index.vue'], resolve)
          },
          {
            path: 'publish-fill',
            name: '已发直报',
            component: resolve => require(['@/views/fill-management/fill-publish/index.vue'], resolve)
          }
        ]
      },
      {
        path: '/fill-statistics',
        name: '直报统计管理',
        redirect: '/fill-statistics/total',
        component: resolve => require(['@/views/fill-statistics/index.vue'], resolve),
        children: [
          {
            path: 'total',
            name: '所有直报',
            component: resolve => require(['@/views/fill-statistics/fill-total.vue'], resolve)
          },
          {
            path: 'no-fill',
            name: '未填报',
            component: resolve => require(['@/views/fill-statistics/no-fill.vue'], resolve)
          },
          {
            path: 'no-audit',
            name: '待审核',
            component: resolve => require(['@/views/fill-statistics/no-audit.vue'], resolve)
          }
        ]
      },
      {
        path: 'audit',
        name: '审核管理',
        redirect: '/home/audit/to-audit',
        component: resolve => require(['@/views/audit-management/index.vue'], resolve),
        children: [
          {
            path: 'to-audit',
            name: '待审核',
            redirect: 'to-audit/list',
            component: resolve => require(['@/views/audit-management/to-audit/index.vue'], resolve),
            children: [
              {
                path: 'list',
                name: '待审核列表',
                component: resolve => require(['@/views/audit-management/to-audit/list.vue'], resolve)
              },
              {
                path: 'detail',
                name: '待审核详情',
                component: resolve => require(['@/views/audit-management/to-audit/detail.vue'], resolve)
              }
            ]
          },
          {
            path: 'audit-history',
            name: '历史审核',
            component: resolve => require(['@/views/audit-management/approve-state/index.vue'], resolve)
          },
          {
            path: 'audit-state/:type',
            name: '审核状态',
            component: resolve => require(['@/views/audit-management/approve-state/state-list.vue'], resolve)
          }
        ]
      },
      {
        path: '/global-analysis',
        name: '统计分析',
        component: resolve => require(['@/views/global-analysis/index.vue'], resolve)
      },
      {
        path: '/notice',
        name: '公告管理',
        // redirect: '/notice/notice-release',
        component: resolve => require(['@/views/notice-management/notice-list.vue'], resolve)
        // children: [{
        //     path: 'notice-release',
        //     name: '公告管理',
        //     component: resolve => require(['@/views/notice-management/notice-list.vue'], resolve),
        //   },
        //   {
        //     path: 'notice-draft',
        //     name: '公告管理',
        //     component: resolve => require(['@/views/notice-management/notice-draft.vue'], resolve),
        //   }

        // ]
      },
      {
        path: '/system-management',
        name: '系统管理',
        redirect: '/system-management/unit-manage',
        component: resolve => require(['@/views/system-management/index.vue'], resolve),
        children: [
          {
            path: 'unit-manage',
            name: '单位管理',
            component: resolve => require(['@/views/system-management/unit-manage.vue'], resolve)
          },
          {
            path: 'user-manage',
            name: '用户管理',
            component: resolve => require(['@/views/system-management/user-manage.vue'], resolve)
          },
          {
            path: 'role-manage',
            name: '角色管理',
            component: resolve => require(['@/views/system-management/role-manage.vue'], resolve)
          },
          {
            path: 'permission-manage',
            name: '权限管理',
            component: resolve => require(['@/views/system-management/permission-manage.vue'], resolve)
          }
        ]
      },
      {
        path: '/hn-statistics',
        component: resolve => require(['@/views/hn-statistics/index.vue'], resolve),
        redirect: '/hn-statistics/word-statistics',
        children: [
          {
            path: 'word-statistics',
            name: '单字段统计',
            component: resolve => require(['@/views/hn-statistics/word-statistics.vue'], resolve)
          },
          {
            path: 'multiterm-statistics',
            name: '创建table',
            component: resolve => require(['@/views/hn-statistics/multiterm-statistics/index.vue'], resolve)
          },
          {
            path: 'custom-table',
            name: '当前统计列表',
            component: resolve => require(['@/views/hn-statistics/multiterm-statistics/custom-table.vue'], resolve)
          },
          {
            path: 'table-list',
            name: 'table列表',
            component: resolve => require(['@/views/hn-statistics/multiterm-statistics/table-list.vue'], resolve)
          }
        ]
      }
    ]
  }
]

const router = new Router({
  mode: 'history',
  base: '',
  scrollBehavior: () => ({
    y: 0
  }),
  routes
})

router.beforeEach((to, from, next) => {
  let cookieValue = getCookie('token')
  let sessionUser = sessionStorage.getItem('sessionUser')
  if (to.name == 'Login') {
    // next({path: '/login'}) //这个段程序会再次调用router.beforeEach，就会进入死循环
    next()
  } else {
    if (sessionUser) {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  }
})
export default router
