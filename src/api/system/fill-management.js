import {
  post
} from "@/http/http"
/* 获取用户信息 */
/*
 *填报管理相关接口
 */

// 获取下级单位列表
export const getUnitList = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/userInformations/getByParentId", {
    organizationCode: user.ocode,
    unitname: user.nickname,
    ...params
  })
}
/* 创建填报计划 */


export const createFill = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/fillInPlan/buildPlan", {
    createuser: user.nickname,
    ...params
  })
}

/* 填报计划列表*/
export const getPlanList = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/fillInPlan/getPlanList", {
    userName: user.nickname,
    ...params
  })
}
