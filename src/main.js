import Vue from 'vue'
import App from './App.vue'
import { initRouter } from './router'
import './theme/index.less'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import '@/mock'
import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
import { initI18n } from '@/utils/i18n'
import bootstrap from '@/bootstrap'
import 'moment/locale/zh-cn'
import SvgIcon from '@/components/iconFont/SvgIcon';
import '@/style/common.css'
import Bus from '@/utils/bus';
import print from '@/utils/print';
import htmlToPdf from '@/utils/htmlToPdf';
import JsonExcel from 'vue-json-excel'
import UploadImg from "@/components/upload/UploadImg";
import VueDND from 'awe-dnd'
import VueCoreVideoPlayer from "vue-core-video-player";

Vue.use(VueCoreVideoPlayer, {
  lang: 'zh-CN'
})
Vue.component('downloadExcel', JsonExcel)
Vue.component('upload-img', UploadImg)
Vue.component(SvgIcon.name, SvgIcon);

const router = initRouter(store.state.setting.asyncRoutes)
const i18n = initI18n('CN', 'US')
const staffStatus = {
  0: '离职',
  1: '在职'
}
const staffSex = {
  0: '女',
  1: '男'
}
const staffProNature = {
  0: '间接生产',
  1: '直接生产',
  2: '生产管理'
}
const staffOperationUnit = {
  0: '生产运营',
  1: '园区运营',
}
Vue.use(VueDND)
Vue.use(Antd)
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)
Vue.use(print)
Vue.use(htmlToPdf)


Vue.prototype.$bus = Bus;
bootstrap({ router, store, i18n, message: Vue.prototype.$message })

Vue.filter('staffStatus', function (value) {
  return staffStatus[value] ? staffStatus[value] : '未知'
})
Vue.filter('staffProNature', function (value) {
  return staffProNature[value] ? staffProNature[value] : '未知'
})
Vue.filter('staffSex', function (value) {
  return staffSex[value] ? staffSex[value] : '未知'
})
Vue.filter('staffOperationUnit', function (value) {
  return staffOperationUnit[value] ? staffOperationUnit[value] : '未知'
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
