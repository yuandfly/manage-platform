export const menu = [
  {
    id: '0',
    parentId: '1',
    name: '我的桌面',
    key: '/home/my-desktop',
    icon: 'el-icon-s-home',
    level: 1,
    order: 1,
    category: 0, //0-菜单 1-按钮
    childList: null
  },
  {
    id: '1',
    parentId: '0',
    name: '表单管理',
    key: '/form',
    icon: 'el-icon-s-management',
    level: 1,
    order: 1,
    category: 0,
    childList: [
      {
        id: '0',
        parentId: '1',
        name: '创建元素',
        key: '/home/form/create-element',
        icon: null,
        level: 2,
        order: 1,
        category: 0,
        childList: null
      },
      {
        id: '0',
        parentId: '1',
        name: '已建元素',
        key: '/home/form/element-list',
        icon: null,
        level: 2,
        order: 1,
        category: 0,
        childList: null
      },
      {
        id: '0',
        parentId: '1',
        name: '创建模块',
        key: '/home/form/create-module',
        icon: null,
        level: 2,
        order: 1,
        category: 0,
        childList: null
      },
      {
        id: '0',
        parentId: '1',
        name: '已建模块',
        key: '/home/form/module-list',
        icon: null,
        level: 2,
        order: 1,
        category: 0,
        childList: null
      },
      {
        id: '0',
        parentId: '1',
        name: '创建表单',
        key: '/home/form/create-form',
        icon: null,
        level: 2,
        order: 1,
        category: 0,
        childList: null
      },
      {
        id: '1',
        parentId: '1',
        name: '已建表单',
        key: '/home/form/form-list',
        icon: null,
        level: 2,
        order: 1,
        category: 0,
        childList: null
      }
    ]
  },
  {
    id: '2',
    parentId: '0',
    name: '直报创建管理',
    key: '/fill',
    icon: 'el-icon-document',
    level: 1,
    order: 1,
    category: 0,
    childList: [
      {
        id: '0',
        parentId: '2',
        name: '创建直报',
        key: '/home/fill/create-fill',
        icon: null,
        level: 2,
        order: 1,
        category: 0,
        childList: null
      },
      {
        id: '1',
        parentId: '2',
        name: '已发直报',
        key: '/home/fill/publish-fill',
        icon: null,
        level: 2,
        order: 1,
        category: 0,
        childList: null
      }
    ]
  },
  {
    id: '3',
    parentId: '0',
    name: '审核管理',
    key: '/audit',
    icon: 'el-icon-s-check',
    level: 1,
    order: 1,
    category: 0,
    childList: [
      {
        id: '0',
        parentId: '3',
        name: '待审核',
        key: '/home/audit/to-audit/list',
        icon: null,
        level: 2,
        order: 1,
        category: 0,
        childList: null
      },
      {
        id: '1',
        parentId: '3',
        name: '历史审核',
        key: '/home/audit/audit-history',
        icon: null,
        level: 2,
        order: 1,
        category: 0,
        childList: null
      }
    ]
  },
  {
    id: '3',
    parentId: '0',
    name: '直报统计管理',
    key: '/fill-statistics',
    icon: 'el-icon-s-operation',
    level: 1,
    order: 1,
    category: 0,
    childList: null
  },
  {
    id: '3',
    parentId: '0',
    name: '统计分析',
    key: '/hn-statistics',
    icon: 'el-icon-s-data',
    level: 1,
    order: 1,
    category: 0,
    childList: [
      {
        id: '3',
        parentId: '0',
        name: '单计划单项统计',
        key: '/global-analysis',
        icon: 'el-icon-s-data',
        level: 1,
        order: 1,
        category: 0,
        childList: null
      },
      {
        id: '3',
        parentId: '0',
        name: '多计划单项统计',
        key: '/hn-statistics/word-statistics',
        icon: '',
        level: 1,
        order: 1,
        category: 0,
        childList: null
      },
      {
        id: '3',
        parentId: '0',
        name: '创建多项统计表',
        key: '/hn-statistics/multiterm-statistics',
        icon: '',
        level: 1,
        order: 1,
        category: 0,
        childList: null
      },
      {
        id: '3',
        parentId: '0',
        name: '多项统计列表',
        key: '/hn-statistics/table-list',
        icon: '',
        level: 1,
        order: 1,
        category: 0,
        childList: null
      },
    ]
  },
  {
    id: '3',
    parentId: '0',
    name: '系统管理',
    key: '/system-management',
    icon: 'el-icon-s-tools',
    level: 1,
    order: 1,
    category: 0,
    childList: [
      {
        id: '3',
        parentId: '0',
        name: '单位管理',
        key: '/system-management/unit-manage',
        icon: 'el-icon-s-operation',
        level: 2,
        order: 1,
        category: 0,
        childList: null
      },
      {
        id: '3',
        parentId: '0',
        name: '用户管理',
        key: '/system-management/user-manage',
        icon: 'el-icon-s-operation',
        level: 2,
        order: 1,
        category: 0,
        childList: null
      },
      {
        id: '3',
        parentId: '0',
        name: '角色管理',
        key: '/system-management/role-manage',
        icon: 'el-icon-s-operation',
        level: 2,
        order: 1,
        category: 0,
        childList: null
      },
      {
        id: '3',
        parentId: '0',
        name: '权限管理',
        key: '/system-management/permission-manage',
        icon: 'el-icon-s-operation',
        level: 2,
        order: 1,
        category: 0,
        childList: null
      }
    ]
  },
  {
    id: '3',
    parentId: '0',
    name: '公告管理',
    key: '/notice',
    icon: 'el-icon-message-solid',
    level: 1,
    order: 1,
    category: 0,
    childList: null
  }
]
