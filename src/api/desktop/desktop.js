import {
  post
} from "@/http/http"
/* 获取用户信息 */


export const getPlanList = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/fillInPlan/getPlanDateList", {
    userName: user.nickname,
    ...params
  })
}

/* 统计数据 */
export const getStatisticsList = (params = {}) => {
  return post("/web/dataStatistics/counting", params)
}

/* 统计数据(hn通过单位维度统计) */
export const getDetailsList = (params = {}) => {
  return post("/web/dataStatistics/getDetails", params)
}

/* 获取字段 */
export const getWords = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/dataStatistics/getTableFields", {
    createuser: user.nickname,
    ...params
  })
}
