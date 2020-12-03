let userInfo = {};

export default {
  userInfo,
  setUserInfo(para) {
    this.userInfo = para;
  },
  getComIdByRoleId() {
    return this.userInfo.roleId != 0 ? this.userInfo.companyId : '';
  }
}
export const user = JSON.parse(sessionStorage.getItem('userInfo')) ? JSON.parse(sessionStorage.getItem('userInfo')) : {}
