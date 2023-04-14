
import {
    recommendList,
    recommendSave,
    recommendDelete,
    recommendGetProduct,
    recommendGetPrimaryType
  } from '@/services/recommend';
  export default {
    namespaced: true,
    state: {
    },
    actions: {
      recommendList({ commit }, params) {
        return new Promise((resolve, reject) => {
          recommendList(params)
            .then((res) => {
              resolve(res)
            })
            .catch((e) => {
              reject(e)
            });
        });
      },
      recommendSave({ commit }, params) {
        return new Promise((resolve, reject) => {
          recommendSave(params)
            .then((res) => {
              resolve(res)
            })
            .catch((e) => {
              reject(e)
            });
        });
      },
      recommendDelete({ commit }, params) {
        return new Promise((resolve, reject) => {
          recommendDelete(params)
            .then((res) => {
              resolve(res)
            })
            .catch((e) => {
              reject(e)
            });
        });
      },
      recommendGetProduct({ commit }, params) {
        return new Promise((resolve, reject) => {
          recommendGetProduct(params)
            .then((res) => {
              resolve(res)
            })
            .catch((e) => {
              reject(e)
            });
        });
      },
      recommendGetPrimaryType({ commit }, params) {
        return new Promise((resolve, reject) => {
          recommendGetPrimaryType(params)
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
  