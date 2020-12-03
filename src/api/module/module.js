import {
  post
} from "@/http/http"
// 创建模块
export const createModule = (params = {}) => {
  return post("/web/table/foundModular", params)
}
// 获取模块列表
export const getModuleList = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/table/getBasicModuleVO",
    {
      userName: user.nickname,
      level: null,
      organizationCode: null,
      ...params
    }
  )
}
// 获取模块详情
export const getModule = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/table/getModular", {
    createuser: user.nickname,
    ...params
  })
}
// 修改模块
export const updataModule = (params = {}) => {
  return post("/web/table/updateModular", params)
}

// 删除模块
export const deleteModule = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/table/deleteModular", {
    createuser: user.nickname,
    ...params
  })
}