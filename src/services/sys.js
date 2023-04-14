import { VERIFY_CODE,  ROLE_LIST, SAVE_ROLE, SEARCH_ROLE, DELETE_ROLE, PERMISSION_LIST, SEARCH_PERMISSION, DELETE_PERMISSION, SAVE_PERMISSION, SEARCH_VIDEO, DELETE_VIDEO, SAVE_VIDEO } from '@/services/api'
import { post } from '@/utils/request'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getVerifyCode() {
  return post(VERIFY_CODE, {})
}

export async function getRoleList(params) {
  return post(ROLE_LIST, params)
}

export async function saveRole(params) {
  return post(SAVE_ROLE, params)
}

export async function searchRole(params) {
  return post(SEARCH_ROLE, params)
}

export async function deleteRole(params) {
  return post(DELETE_ROLE, params)
}

export async function getPermissionList(params) {
  return post(PERMISSION_LIST, params)
}

export async function searchPermission(params) {
  return post(SEARCH_PERMISSION, params)
}

export async function deletePermission(params) {
  return post(DELETE_PERMISSION, params)
}

export async function savePermission(params) {
  return post(SAVE_PERMISSION, params)
}

export async function searchVideo(params) {
  return post(SEARCH_VIDEO, params)
}

export async function deleteVideo(params) {
  return post(DELETE_VIDEO, params)
}

export async function saveVideo(params) {
  return post(SAVE_VIDEO, params)
}

export default {
  getVerifyCode,
  getRoleList,
  saveRole,
  searchRole,
  deleteRole,
  getPermissionList,
  searchPermission,
  deletePermission,
  savePermission,
  searchVideo,
  deleteVideo,
  saveVideo
}
