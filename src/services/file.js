import { UPLOAD_FILE, BATCH_UPLOAD, DELETE_FILE, DELETE_WITH_THUMBNAIL } from '@/services/api'
import { post } from '@/utils/request'


export async function uploadFile(params) {
  return post(UPLOAD_FILE, params)
}

export async function batchUpload(params) {
  return post(BATCH_UPLOAD, params)
}

export async function deleteFile(params) {
  return post(DELETE_FILE, params)
}

export async function deleteWithThumbnail(params) {
  return post(DELETE_WITH_THUMBNAIL, params)
}
export default {
  uploadFile,
  batchUpload,
  deleteFile,
  deleteWithThumbnail
}
