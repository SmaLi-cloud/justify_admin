import {
    supplierData,
    productData,
    proTypeData,
    passRate,
    selectorData,
    statisticData
} from '@/services/statistic';
export default {
    namespaced: true,
    state: {
    },
    actions: {
        statisticData({ commit }, params) {
            return new Promise((resolve, reject) => {
                statisticData(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        selectorData({ commit }, params) {
            return new Promise((resolve, reject) => {
                selectorData(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        passRate({ commit }, params) {
            return new Promise((resolve, reject) => {
                passRate(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        proTypeData({ commit }, params) {
            return new Promise((resolve, reject) => {
                proTypeData(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        supplierData({ commit }, params) {
            return new Promise((resolve, reject) => {
                supplierData(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        productData({ commit }, params) {
            return new Promise((resolve, reject) => {
                productData(params)
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
