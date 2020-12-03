import {
  post
} from "@/http/http"
/* 获取用户信息 */


// 获取表元素 用于计算规则
export const getFormElement = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/table/getTableElement", {
    createuser: user.nickname,
    ...params
  })
}
/* 保存规则 */
export const saveFormRule = (params = []) => {
  return post("/web/tableRules/insertTableRules",
    params
  )
}
/* 获取规则列表 */
export const getFormRule = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/tableRules/getTableRules", {
    createuser: user.nickname,
    ...params
  })
}
/* 删除 */
export const deleteFormRule = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/tableRules/deleteTableRules", {
    createuser: user.nickname,
    ...params
  })
}
