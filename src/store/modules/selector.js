import {
  selectorOrderDetail,
  selectorOrderList,
  selectorSupList,
  selectorSupDetail,
  selectorProDetail,
  selectorProList
} from '@/services/selector';
function formatData(conditions, timeName = "addTime") {
  let format = { ...conditions }
  if (format.addTime && format.addTime.length > 0) {
    format[timeName] = {
      start: format[timeName][0].format("YYYY-MM-DD 00:00:00"),
      end: format[timeName][1].format("YYYY-MM-DD 23:59:59"),
    };
  } else {
    delete format.addTime;
  }
  return format
}
export default {
  namespaced: true,
  state: {
    orderConditions: {
      addTime: [],
    },
    goodsConditions: {
      addTime: []
    }
  },
  actions: {
    selectorProList({ commit }, params) {
      return new Promise((resolve, reject) => {
        selectorProList(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    selectorProDetail({ commit }, params) {
      return new Promise((resolve, reject) => {
        selectorProDetail(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    selectorSupDetail({ commit }, params) {
      return new Promise((resolve, reject) => {
        selectorSupDetail(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    selectorSupList({ commit }, params) {
      return new Promise((resolve, reject) => {
        selectorSupList(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    selectorOrderList({ commit }, params) {
      return new Promise((resolve, reject) => {
        selectorOrderList(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    selectorOrderDetail({ commit }, params) {
      return new Promise((resolve, reject) => {
        selectorOrderDetail(params)
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
    formatOrderConditions({ orderConditions }) {
      return formatData(orderConditions)
    },
    formatGoodsConditions({ goodsConditions }) {
      return formatData(goodsConditions)
    }
  },
  mutations: {
    resetOrderConditions(state) {
      state.orderConditions = {
        addTime: []
      }
    },
    resetGoodsConditions(state) {
      state.goodsConditions = {
        addTime: []
      }
    },
  }
}
