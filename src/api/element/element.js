import {
  post
} from "@/http/http"
// 创建元素
export const createElement = (params = {}) => {
  return post("/web/table/foundElement", params)
}
// 获取元素列表
export const elementList = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/table/getBasicElementList", {
    userName: user.nickname,
    level: null,
    organizationCode: null,
    ...params
  })
}
// 删除元素
export const delElement = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/table/deleteElement", {
    createuser: user.nickname,
    ...params
  })
}
// 修改元素
export const updataElement = (params = {}) => {
  return post("/web/table/updateElement", params)
}
