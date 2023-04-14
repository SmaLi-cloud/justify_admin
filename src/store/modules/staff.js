import storage from '@/utils/storage'
import {
  login,
  logout,
  searchStaff,
  deleteStaff,
  saveStaff,
  savePersonalInfo,
  getByDeptId,
  changePassword,
  getStaffInfoById,
  updatePersonalData
} from '@/services/staff';
export default {
  namespaced: true,
  state: {
    personalData: {},
    avatar: "",
    token: '',
    staffInfo: null,
    allPermissions: null,
    userPermissions: null,
    roleNames: null,
  },
  actions: {
    login({ commit }, params) {
      return new Promise((resolve, reject) => {
        login(params)
          .then((res) => {
            if (res.success) {
              const data = res.data;
              commit('setPersonData', {
                phone: data.phone,
                wechatAttach: data.wechatAttach,
                avatar: data.avatar,
              })
              commit('setToken', data.voToken);
              let staffInfo = {
                avatar: data.avatar,
                staffId: data.staffId, trueName: data.trueName, title: data.title, primaryDeptId: data.primaryDeptId, primaryDeptName: data.primaryDeptName
              }
              commit('setStaffInfo', staffInfo);
              commit('setAllPermissions', data.allPermissions);
              commit('setUserPermissions', data.userPermissions);
              commit('setRoleNames', data.roleNames);
            }
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        logout()
          .then((res) => {
            if (res.success) {
              storage.remove(process.env.VUE_APP_TOKEN_KEY);
              storage.remove(process.env.VUE_APP_PERSON_DATA);
              storage.remove(process.env.VUE_APP_STAFF_KEY);
              storage.remove(process.env.VUE_APP_ALL_PERMISSIONS_KEY);
              storage.remove(process.env.VUE_APP_USER_PERMISSIONS_KEY);
              storage.remove(process.env.VUE_APP_ROLE_NAMES);
            }
            resolve(res);
          })
          .catch((e) => {
            console.log(e);
            reject(e);
          });
      });
    },
    searchStaff({ commit }, params) {
      return new Promise((resolve, reject) => {
        searchStaff(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    deleteStaff({ commit }, params) {
      return new Promise((resolve, reject) => {
        deleteStaff(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    saveStaff({ commit }, params) {
      return new Promise((resolve, reject) => {
        saveStaff(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    savePersonalInfo({ commit }, params) {
      return new Promise((resolve, reject) => {
        savePersonalInfo(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    getByDeptId({ commit }, params) {
      return new Promise((resolve, reject) => {
        getByDeptId(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    changePassword({ commit }, params) {
      return new Promise((resolve, reject) => {
        changePassword(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    getStaffInfoById({ commit }, params) {
      return new Promise((resolve, reject) => {
        getStaffInfoById(params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          });
      });
    },
    updatePersonalData({ commit }, params) {
      return new Promise((resolve, reject) => {
        updatePersonalData(params)
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
    token: state => {
      if (!state.token) {
        try {
          const token = storage.get(process.env.VUE_APP_TOKEN_KEY)
          state.token = token
        } catch (e) {
          console.error(e)
        }
      }
      return state.token
    },
    personalData: state => {
      if (!state.personalData) {
        try {
          const personalData = storage.get(process.env.VUE_APP_PERSON_DATA)
          state.personalData = personalData
        } catch (e) {
          console.error(e)
        }
      }
      return state.personalData
    },
    staffInfo: state => {
      if (!state.staffInfo) {
        try {
          const staffInfo = storage.get(process.env.VUE_APP_STAFF_KEY)
          state.staffInfo = staffInfo
        } catch (e) {
          console.error(e)
        }
      }
      return state.staffInfo
    },
    allPermissions: state => {
      if (!state.allPermissions) {
        try {
          const allPermissions = storage.get(process.env.VUE_APP_ALL_PERMISSIONS_KEY)
          state.allPermissions = allPermissions ? allPermissions : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.allPermissions
    },
    userPermissions: state => {
      if (!state.userPermissions) {
        try {
          const userPermissions = storage.get(process.env.VUE_APP_USER_PERMISSIONS_KEY)
          state.userPermissions = userPermissions ? userPermissions : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.userPermissions
    },
    routesConfig: state => {
      if (!state.routesConfig) {
        try {
          const routesConfig = storage.get(process.env.VUE_APP_ROUTES_KEY)
          state.routesConfig = routesConfig ? routesConfig : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.routesConfig
    },
    roleNames: state => {
      if (!state.roleNames) {
        try {
          const roleNames = storage.get(process.env.VUE_APP_ROLE_NAMES)
          state.roleNames = roleNames ? roleNames : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.roleNames
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      storage.set(process.env.VUE_APP_TOKEN_KEY, token)
    },
    setAvatar(state, avatar) {
      state.avatar = (avatar && avatar.attachPath) || ""
    },
    setStaffInfo(state, staffInfo) {
      state.staffInfo = staffInfo
      storage.set(process.env.VUE_APP_STAFF_KEY, staffInfo)
    },
    setAllPermissions(state, allPermissions) {
      state.allPermissions = allPermissions
      storage.set(process.env.VUE_APP_ALL_PERMISSIONS_KEY, allPermissions)
    },
    setUserPermissions(state, userPermissions) {
      state.userPermissions = userPermissions
      storage.set(process.env.VUE_APP_USER_PERMISSIONS_KEY, userPermissions)
    },
    setRoutesConfig(state, routesConfig) {
      state.routesConfig = routesConfig
      storage.set(process.env.VUE_APP_ROUTES_KEY, JSON.stringify(routesConfig))
    },
    setPersonData(state, personalData) {
      state.personalData = personalData
      storage.set(process.env.VUE_APP_PERSON_DATA, personalData)
    },
    setRoleNames(state, roleNames){
      state.roleNames = roleNames
      storage.set(process.env.VUE_APP_ROLE_NAMES, roleNames)
    }
  }
}
