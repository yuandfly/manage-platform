import {
  post
} from "@/http/http"
/* 获取用户信息 */

/* 创建公告 */
export const createNotice = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/notice/buildNotice", {
    unitCode: user.ocode,
    createUser: user.nickname,
    ...params
  })
}

/* 获取公告列表 */
export const getNotices = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/notice/getNoticeList", {
    userName: user.nickname,
    ...params
  })
}

/* 获取公告详情 */
export const getDetail = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/notice/getNoticeAO", {
    createUser: user.nickname,
    ...params
  })
}

/* 删除草稿 */
export const delNotice = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post("/web/notice/deleteDraft", {
    createUser: user.nickname,
    ...params
  })
}
