


import {
    getSupplierList,
    supplierDetail,
    getSupplierName,
    getProductTypeByParentId,
    supplierLogin,
    supplierDelete,
    supplierSave
} from '@/services/supplier';
export default {
    namespaced: true,
    state: {
    },
    actions: {
        getProductTypeByParentId({ commit }, params) {
            return new Promise((resolve, reject) => {
                getProductTypeByParentId(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        getSupplierName({ commit }, params) {
            return new Promise((resolve, reject) => {
                getSupplierName(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        getSupplierList({ commit }, params) {
            return new Promise((resolve, reject) => {
                getSupplierList(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        supplierDetail({ commit }, params) {
            return new Promise((resolve, reject) => {
                supplierDetail(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        supplierLogin({ commit }, params) {
            return new Promise((resolve, reject) => {
                supplierLogin(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        supplierSave({ commit }, params) {
            return new Promise((resolve, reject) => {
                supplierSave(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },

        supplierDelete({ commit }, params) {
            return new Promise((resolve, reject) => {
                supplierDelete(params)
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
