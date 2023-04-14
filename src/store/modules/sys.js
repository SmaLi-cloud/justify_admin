import {
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
} from '@/services/sys';
export default {
  namespaced: true,
  state: {
  },
  actions: {
    getRoleList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getRoleList(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    saveRole({ commit }, params) {
      return new Promise((resolve, reject) => {
        saveRole(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    searchRole({ commit }, params) {
      return new Promise((resolve, reject) => {
        searchRole(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    deleteRole({ commit }, params) {
      return new Promise((resolve, reject) => {
        deleteRole(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    getPermissionList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPermissionList(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    searchPermission({ commit }, params) {
      return new Promise((resolve, reject) => {
        searchPermission(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    deletePermission({ commit }, params) {
      return new Promise((resolve, reject) => {
        deletePermission(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    savePermission({ commit }, params) {
      return new Promise((resolve, reject) => {
        savePermission(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    searchVideo({ commit }, params) {
      return new Promise((resolve, reject) => {
        searchVideo(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    deleteVideo({ commit }, params) {
      return new Promise((resolve, reject) => {
        deleteVideo(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    saveVideo({ commit }, params) {
      return new Promise((resolve, reject) => {
        saveVideo(params)
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
