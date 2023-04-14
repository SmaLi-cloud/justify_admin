
import {
  getProductList,
  getTypeList,
  typeListSave,
  typeListDelete,
  productListDetail,
  productListSave,
  productListPublish,
  productListDelete,
  getTypeByLevel,
  getTypeByParentId,
  getAllProductType
} from '@/services/product';
export default {
  namespaced: true,
  state: {
    baseInfo: {
      mainImage: [],
      attachs: [],
    },
    specifData: {
      accessory: "",
      details:"",
      otherSpecif: [{ name: "", value: "" }],
    },
    sale: {
    },
    saleInfo: {
      priceType: 'unify',
      isTop: 1,
      price: "",
    },
    allProductType: [],
  },
  actions: {
    productListDelete({ commit }, params) {
      return new Promise((resolve, reject) => {
        productListDelete(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    getProductList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getProductList(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },

    productListDetail({ commit }, params) {
      return new Promise((resolve, reject) => {
        productListDetail(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    productListSave({ commit }, params) {
      return new Promise((resolve, reject) => {
        productListSave(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    productListPublish({ commit }, params) {
      return new Promise((resolve, reject) => {
        productListPublish(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    getTypeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getTypeList(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    typeListSave({ commit }, params) {
      return new Promise((resolve, reject) => {
        typeListSave(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    typeListDelete({ commit }, params) {
      return new Promise((resolve, reject) => {
        typeListDelete(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    getTypeByLevel({ commit }, params) {
      return new Promise((resolve, reject) => {
        getTypeByLevel(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    getTypeByParentId({ commit }, params) {
      return new Promise((resolve, reject) => {
        getTypeByParentId(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    getAllProductType({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAllProductType(params)
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
    setBaseInfo(state, value) {
      state.baseInfo = value || {}
    },
    setMainImage(state, value) {
      state.baseInfo.mainImage = value || []
    },
    setAttachs(state, value) {
      state.baseInfo.attachs = value || []
    },
    setSpecifData(state, value) {
      state.specifData = {
        ...state.specifData,
        ...value
      }
    },
    setAllproductType(state, value) {
      state.allProductType = value || []
    },
    setSaleInfo(state, value) {
      state.saleInfo = {
        ...state.saleInfo,
        ...value
      }
    },
    reset(state) {
      state.baseInfo = {
        mainImage: [],
        attachs: [],
      },
        state.specifData = {
          accessory: "",
          details:"",
          otherSpecif: [{ name: "", value: "" }],
        },
        state.saleInfo = {
          priceType: 'unify',
          isTop: 1,
          price: "",
        }
    },
    resetSalePrice(state, value) {
      if (value === "tiered") {
        state.saleInfo ={
          ...state.saleInfo,
          price:[{ maxQuantity: "", minQuantity: "", price: "" }]
        }
      } else {
        state.saleInfo ={
          ...state.saleInfo,
          price:""
        }
      }
    }
  }
}
