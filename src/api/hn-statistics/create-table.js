import { post } from '@/http/http'

/* 创建表头 */
export const createTable = (params = {}) => {
  return post('/web/statisticalTableName/creatStatistical', params)
}
/* 根据id获取table的数据 */
export const getTableDataById = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post('/web/dataStatistics/statisticalData', {
    userName: user.nickname,
    planCodeList: [],
    ...params
  })
}

/* 获取table表头列表 */
export const getTableList = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return post('/web/statisticalTableName/getStatisticalTableList', {
    userName: user.nickname,
    ...params
  })
}
