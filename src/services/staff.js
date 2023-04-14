import {LOGIN, LOGOUT, ROUTES, SEARCH_STAFF, DELETE_STAFF, SAVE_STAFF, SAVE_PERSONALINFO, GET_BY_DEPT_ID, CHANGE_PASSWORD, GET_STAFF_INFO_BY_ID, UPDATE_STAFF_PERSONAL} from '@/services/api'
import {request, post, METHOD} from '@/utils/request'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(loginInfo) {
  return post(LOGIN, loginInfo)
}

export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}


/**
 * 退出登录
 */
export async function logout() {
  return post(LOGOUT)
}

export async function searchStaff(params) {
  return post(SEARCH_STAFF, params)
}

export async function deleteStaff(params) {
  return post(DELETE_STAFF, params)
}

export async function saveStaff(params) {
  return post(SAVE_STAFF, params)
}

export async function savePersonalInfo(params) {
  return post(SAVE_PERSONALINFO, params)
}

export async function getByDeptId(params) {
  return post(GET_BY_DEPT_ID, params)
}

export async function changePassword(params) {
  return post(CHANGE_PASSWORD, params)
}

export async function getStaffInfoById(params) {
  return post(GET_STAFF_INFO_BY_ID, params)
}
export async function updatePersonalData(params) {
  return post(UPDATE_STAFF_PERSONAL, params)
}

export default {
  login,
  logout,
  getRoutesConfig,
  searchStaff,
  deleteStaff,
  saveStaff,
  savePersonalInfo,
  getByDeptId,
  changePassword,
  getStaffInfoById
}
