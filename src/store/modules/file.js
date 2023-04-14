import {
  uploadFile,
  batchUpload,
  deleteFile,
  deleteWithThumbnail
} from '@/services/file';
export default {
  namespaced: true,
  state: {
  },
  actions: {
    uploadFile({ commit }, params) {
      return new Promise((resolve, reject) => {
        uploadFile(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    batchUpload({ commit }, params) {
      return new Promise((resolve, reject) => {
        batchUpload(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    deleteFile({ commit }, params) {
      return new Promise((resolve, reject) => {
        deleteFile(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    deleteWithThumbnail({ commit }, params) {
      return new Promise((resolve, reject) => {
        deleteWithThumbnail(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
  },
  getters: {
  },
  mutations: {
  }
}
