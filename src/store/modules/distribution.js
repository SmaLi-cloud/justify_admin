


import {
    getDistributorList,
    distributorDetail,
    distributorExamine,
    distributorExclusivePrice
} from '@/services/distribution';
export default {
    namespaced: true,
    state: {
    },
    actions: {
        distributorExclusivePrice({ commit }, params) {
            return new Promise((resolve, reject) => {
                distributorExclusivePrice(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        getDistributorList({ commit }, params) {
            return new Promise((resolve, reject) => {
                getDistributorList(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        distributorDetail({ commit }, params) {
            return new Promise((resolve, reject) => {
                distributorDetail(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        distributorExamine({ commit }, params) {
            return new Promise((resolve, reject) => {
                distributorExamine(params)
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
