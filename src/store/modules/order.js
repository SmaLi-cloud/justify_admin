import { getOrderList, getOrderDetail } from '@/services/order'

export default {
    namespaced: true,
    state: {
        conditions: {
            addTime: [],
        },
    },
    getters: {
        formatConditions({ conditions }) {
            let format = { ...conditions }
            if (format.addTime && format.addTime.length > 0) {
                format.addTime = {
                    start: format.addTime[0].format("YYYY-MM-DD 00:00:00"),
                    end: format.addTime[1].format("YYYY-MM-DD 23:59:59"),
                };
            } else {
                delete format.addTime;
            }
            return format

        }
    },
    actions: {
        getOrderList({ commit }, params) {
            return new Promise((resolve, reject) => {
                getOrderList(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        getOrderDetail({ commit }, params) {
            return new Promise((resolve, reject) => {
                getOrderDetail(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
    },
    mutations: {
        resetConditions(state) {
            state.conditions = {
                addTime:[]
            }
        }
    }
}
