import {
    onlineGoods,
    saveGoods,
    getGoodsDetail,
    getGoodsList,
    goodsExamine,
    goodsImprove,
    goodsAssess,
    selectorNameId,
    allProductSpecif,
    getPrintList,
    getGradeItems,
} from '@/services/goods'

export default {
    namespaced: true,
    state: {
        productCount: [],
        attachs: [],
        skus: [],
        specifications: [],
        saleInfo: {
            costPriceType: "unify",
            costPrice: "",
            retailPrice: "",
            samplePrice: "",
            settlementPrice: "",
        },
        baseInfo: {
            attachs: [],
            proDetail: [],
            video: {},
            assessUrl: {}
        },
        allProductType: [],
        conditions: {
            addTime: [],
        },
        introInfo: {
            size: [],
            supprtDropshipping: 1
        }
    },
    getters: {
        getStatusCount({ productCount }) {
            return function (status) {
                let count = 0
                for (var i = 0; i < productCount.length; i++) {
                    if (status == productCount[i]['status']) {
                        count = productCount[i]['proCount']
                        break;
                    }
                }
                return count
            }
        },
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
        selectorNameId({ commit }, params) {
            return new Promise((resolve, reject) => {
                selectorNameId(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        allProductSpecif({ commit }, params) {
            return new Promise((resolve, reject) => {
                allProductSpecif(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        getGoodsList({ commit }, params) {
            return new Promise((resolve, reject) => {
                getGoodsList(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        getGoodsDetail({ commit }, params) {
            return new Promise((resolve, reject) => {
                getGoodsDetail(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        saveGoods({ commit }, params) {
            return new Promise((resolve, reject) => {
                saveGoods(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        onlineGoods({ commit }, params) {
            return new Promise((resolve, reject) => {
                onlineGoods(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        goodsExamine({ commit }, params) {
            return new Promise((resolve, reject) => {
                goodsExamine(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        goodsImprove({ commit }, params) {
            return new Promise((resolve, reject) => {
                goodsImprove(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        goodsAssess({ commit }, params) {
            return new Promise((resolve, reject) => {
                goodsAssess(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        getPrintList({ commit }, params) {
            return new Promise((resolve, reject) => {
                getPrintList(params)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((e) => {
                        reject(e)
                    });
            });
        },
        getGradeItems({ commit }, params) {
            return new Promise((resolve, reject) => {
                getGradeItems(params)
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
                addTime: []
            }
        },
        setAllProductType(state, value) {
            state.allProductType = value || []
        },
        setAttachs(state, value) {
            state.attachs = value || []
        },
        setBaseInfo(state, value) {
            state.baseInfo = value || {}
        },
        setSaleInfo(state, value) {
            state.saleInfo = value || {}
        },
        resetSalePrice(state, value) {
            if (value === "tiered") {
                state.saleInfo = {
                    ...state.saleInfo,
                    costPrice: [{ maxQuantity: "", minQuantity: "", price: "" }]
                }
            } else {
                state.saleInfo = {
                    ...state.saleInfo,
                    costPrice: ""
                }
            }
        },
        setSpecifications(state, value) {
            state.specifications = value || []
        },
        setSkus(state, value) {
            state.skus = value || []
        },
        setIntroInfo(state, value) {
            state.introInfo = value || {
                size: [],
                otherSpecif: [{}, {}]
            }
        },
        setProductCount(state, value) {
            state.productCount = value || []
        },
        resetGoods(state) {

            state.attachs = []
            state.skus = []
            state.specifications = []
            state.saleInfo = {
                costPriceType: "unify",
                costPrice: "",
                retailPrice: "",
                samplePrice: "",
                settlementPrice: "",
            }
            state.baseInfo = {
                attachs: [],
                proDetail: [],
            }
            state.allProductType = [],
                state.conditions = {
                    addTime: [],
                }
            state.introInfo = {
                size: [],
                otherSpecif: [
                    { name: "", value: "" },
                    { name: "", value: "" },
                ],
            }

        }
    }
}
