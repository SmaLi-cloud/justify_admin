import {
    getClientList,
  } from '@/services/client';
  export default {
    namespaced: true,
    state: {
    },
    actions: {
        getClientList({ commit }, params) {
        return new Promise((resolve, reject) => {
            getClientList(params)
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
  