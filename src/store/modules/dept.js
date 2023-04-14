import {
  getTitleById,
  getDeptList,
  getTitleByDeptNo
} from '@/services/dept';
export default {
  namespaced: true,
  state: {
  },
  actions: {
    getTitleById({ commit }, params) {
      return new Promise((resolve, reject) => {
        getTitleById(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    getDeptList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getDeptList(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    getTitleByDeptNo({ commit }, params) {
      return new Promise((resolve, reject) => {
        getTitleByDeptNo(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    }
  },
  getters: {
  },
  mutations: {
  }
}
