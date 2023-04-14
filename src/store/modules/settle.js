import {
    settleList,
    settleDetail,
    settleOpConfirm,
    settleOpSettle,
} from '@/services/settle';
function formatData(conditions, timeName = "createTime") {
    let format = { ...conditions }
    if (format.createTime && format.createTime.length > 0) {
        format[timeName] = {
            start: format.createTime[0].format("YYYY-MM-DD 00:00:00"),
            end: format.createTime[1].format("YYYY-MM-DD 23:59:59"),
        };
    } else {
        delete format.createTime;
    }
    return format
}
export default {
    namespaced: true,
    state: {
        conditions: {
            createTime: [],
        },
    },
    actions: {
        settleOpConfirm({ commit }, params) {
            return new Promise((resolve, reject) => {
                settleOpConfirm(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        settleOpSettle({ commit }, params) {
            return new Promise((resolve, reject) => {
                settleOpSettle(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        settleList({ commit }, params) {
            return new Promise((resolve, reject) => {
                settleList(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        settleDetail({ commit }, params) {
            return new Promise((resolve, reject) => {
                settleDetail(params)
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
        formatConditions({ conditions }) {
            return formatData(conditions, 'createTime')
        },
    },
    mutations: {
        resetConditions(state) {
            state.conditions = {
                createTime: []
            }
        },
    }
}
