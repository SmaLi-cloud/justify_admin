
import {
    getNewsList,
    newsListDelete,
    newsListDetail,
    newsListSave,
    newsListPublish
} from '@/services/news';
export default {
    namespaced: true,
    state: {
    },
    actions: {
        getNewsList({ commit }, params) {
            return new Promise((resolve, reject) => {
                getNewsList(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        newsListDelete({ commit }, params) {
            return new Promise((resolve, reject) => {
                newsListDelete(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        newsListDetail({ commit }, params) {
            return new Promise((resolve, reject) => {
                newsListDetail(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        newsListSave({ commit }, params) {
            return new Promise((resolve, reject) => {
                newsListSave(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        newsListPublish({ commit }, params) {
            return new Promise((resolve, reject) => {
                newsListPublish(params)
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
