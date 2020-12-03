import {
  post
} from "@/http/http"
/* 获取用户信息 */

/*
 *创建表单相关接口
 */
// 保存一级表（单个表）
export const saveForm = (params = {}) => {
  return post("/web/table/oneLevel", params)
}
// 保存二级表（带表头/页面）
export const savePage = (params = {}) => {
  return post("/web/table/twoLevel", params)
}
// 修改二级表(页面)
export const updatePage = (params = {}) => {
  return post("/web/table/updateTables", params)
}

// 获取表单
export const getForm = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/table/manageGetTable", {
    userName: user.nickname,
    ...params
  })
}
// 获取表单列表
export const getFormList = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/table/getTableList", {
    userName: user.nickname,
    ...params
  })
}
