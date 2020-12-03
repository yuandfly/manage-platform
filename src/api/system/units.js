import axios from 'axios'
/* 获取用户信息 */


// 获取下级单位
export const getUnitsList = (params = {}) => {
  let id = Number(sessionStorage.getItem('unitId'));
  return axios.post('/web/unit/unitSelect?id=' + id, params)
}

// 创建单位时选择上级单位
export const getUnitsList2 = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return axios.post('/web/userInformations/getUnit', {
    organizationCode: user.ocode,
    unitname: user.nickname
  })
}

// 获取所有单位列表
export const getAllUnitsList = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return axios.post('/web/userInformations/getUnitInformationList', {
    createUser: user.nickname,
    ...params
  })
}

/* 添加单位 */
export const addUnits = (params) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return axios.post('/web/userInformations/buildUserInFor', {
    organizationCode: user.ocode,
    createUser: user.nickname,
    userName: null,
    ...params
  })
}
/* 修改单位 */
export const saveUnits = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return axios.post('/web/userInformations/updateData', {
    organizationCode: user.ocode,
    createUser: user.nickname,
    userName: null,
    ...params
  })
}

export const getUnits = (params) => {
  return axios.post('/web/unit/pageQuery', {

  })
}
/* 删除填报单位 */
export const delUnits = (params = {}) => {
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  return axios.post(`/web/userInformations/deleteUnit`, {
    unitname: user.nickname,
    ...params
  })
}

/*判断单位名称是否存在 */
export const isHasUinit = (params) => {
  return axios.post('/web/userInformations/judged', params)
}
