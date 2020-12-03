import { post } from '@/http/http'

/* 根据表获取直报 */
export const getFills = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post('/web/dataStatistics/getPlanList', {
    createuser: user.nickname,
    ...params
  })
}

/* 根据表获取直报 */
export const getMultiPlanStatistics = (params = {}) => {
  return post('/web/dataStatistics/multiPlanStatistics', params)
}
