
import {
    getBrandList,
    getBrandDetail,
    brandExamine,
} from '@/services/brand';
export default {
    namespaced: true,
    state: {
    },
    actions: {
        getBrandList({ commit }, params) {
            return new Promise((resolve, reject) => {
                getBrandList(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        getBrandDetail({ commit }, params) {
            return new Promise((resolve, reject) => {
                getBrandDetail(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        brandExamine({ commit }, params) {
            return new Promise((resolve, reject) => {
                brandExamine(params)
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
