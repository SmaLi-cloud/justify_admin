import { inStockProduct, beStockProduct, technologyList, technologyDetail, inOutRecord, inStockAdd, outStockAdd, proModel, outStorageLocationId } from '@/services/technology'
import {techStockList,techStockDetail,techStockInProduct,techStockOutProduct,techStockOutLocationId} from '@/services/technology'

function formatData(conditions, timeName = "addTime") {
    let format = { ...conditions }
    if (format.addTime && format.addTime.length > 0) {
        format[timeName] = {
            start: format.addTime[0].format("YYYY-MM-DD 00:00:00"),
            end: format.addTime[1].format("YYYY-MM-DD 23:59:59"),
        };
    } else {
        delete format.addTime;
    }
    return format
}

const techStockAction = {
    techStockList({ commit }, params) {
        return new Promise((resolve, reject) => {
            techStockList(params)
                .then((res) => {
                    resolve(res)
                })
                .catch((e) => {
                    reject(e)
                });
        });
    },
    techStockDetail({ commit }, params) {
        return new Promise((resolve, reject) => {
            techStockDetail(params)
                .then((res) => {
                    resolve(res)
                })
                .catch((e) => {
                    reject(e)
                });
        });
    },
    techStockInProduct({ commit }, params) {
        return new Promise((resolve, reject) => {
            techStockInProduct(params)
                .then((res) => {
                    resolve(res)
                })
                .catch((e) => {
                    reject(e)
                });
        });
    },
    techStockOutProduct({ commit }, params) {
        return new Promise((resolve, reject) => {
            techStockOutProduct(params)
                .then((res) => {
                    resolve(res)
                })
                .catch((e) => {
                    reject(e)
                });
        });
    },
    techStockOutLocationId({ commit }, params) {
        return new Promise((resolve, reject) => {
            techStockOutLocationId(params)
                .then((res) => {
                    resolve(res)
                })
                .catch((e) => {
                    reject(e)
                });
        });
    },
}


export default {
    namespaced: true,
    state: {
        recordConditions: {
            addTime: []
        }
    },
    getters: {
        formatRecordConditions({ recordConditions }) {
            return formatData(recordConditions)
        }
    },
    actions: {
        outStorageLocationId({ commit }, params) {
            return new Promise((resolve, reject) => {
                outStorageLocationId(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        proModel({ commit }, params) {
            return new Promise((resolve, reject) => {
                proModel(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        beStockProduct({ commit }, params) {
            return new Promise((resolve, reject) => {
                beStockProduct(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        inStockProduct({ commit }, params) {
            return new Promise((resolve, reject) => {
                inStockProduct(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        outStockAdd({ commit }, params) {
            return new Promise((resolve, reject) => {
                outStockAdd(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        inStockAdd({ commit }, params) {
            return new Promise((resolve, reject) => {
                inStockAdd(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        technologyList({ commit }, params) {
            return new Promise((resolve, reject) => {
                technologyList(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        technologyDetail({ commit }, params) {
            return new Promise((resolve, reject) => {
                technologyDetail(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        inOutRecord({ commit }, params) {
            return new Promise((resolve, reject) => {
                inOutRecord(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        ...techStockAction
    },
    mutations: {
        resetRecordConditions(state) {
            state.recordConditions = {
                addTime: []
            }
        }
    }
}
