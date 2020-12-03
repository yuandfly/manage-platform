import {
  post
} from "@/http/http"


/* 获取未填报 */
export const getNoAuditList = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/fillInPlan/getNotFilled", {
    userName: user.nickname,
    ...params
  })
}

// 获取所有审核状态的列表
/* 0未填 1草稿 2已填报待审核 3审核通过 4 审核未过  审核的状态码 */
export const getApproveList = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/fillInPlan/getCheckPendingList", {
    userName: user.nickname,
    ...params
  })
}

/* 获取历史填报详情 */
export const getApproveDetail = (params = {}) => {
  return post("/web/table/getRecords", params)
}

/* 获取未审核填报详情 */
export const getNOApprove = (params = {}) => {
  return post("/web/record/getTableRecord", params)
}

/* 设置审核状态 */
/* 0未填 1草稿 2已填报待审核 3审核通过 4 审核未过  审核的状态码 */
export const setApprove = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/surveyUnitState/getTableList", {
    updateuser: user.nickname,
    ...params
  })
}
/* 查询未填报列表 */
export const getNoFillList = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/fillInPlan/getNotReported", {
    userName: user.nickname,
    ...params
  })
}
