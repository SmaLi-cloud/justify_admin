
import {
  getInquiryList,
  inquiryReply,
  getInquiryDetail
} from '@/services/inquiry';
export default {
  namespaced: true,
  state: {
    conditions: {
      inquiryTime: [],
    },
  },
  actions: {
    getInquiryList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getInquiryList(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    getInquiryDetail({ commit }, params) {
      return new Promise((resolve, reject) => {
        getInquiryDetail(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    inquiryReply({ commit }, params) {
      return new Promise((resolve, reject) => {
        inquiryReply(params)
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
    resetConditions(state) {
      state.conditions = {}
    }
  }
}
