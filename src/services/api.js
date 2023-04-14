//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX

const STAFF_API = {
  LOGIN: `co.staff:login`,
  LOGOUT: `co.staff:logout`,
  SEARCH_STAFF: 'co.staff:search',
  DELETE_STAFF: 'co.staff:delete',
  SAVE_STAFF: 'co.staff:save',
  GET_BY_DEPT_ID: 'co.staff:get_by_dept_id',
  CHANGE_PASSWORD: 'co.staff:change_password',
  GET_STAFF_INFO_BY_ID: 'co.staff:get_staff_info_by_id',
  UPDATE_STAFF_PERSONAL: 'co.staff:update_personal_data'
}

const SYS_API = {
  VERIFY_CODE: 'sys.verification_code:get_code',
  ROLE_LIST: 'sys.chooser:search_role',
  SAVE_ROLE: 'co.role:save',
  SEARCH_ROLE: 'co.role:search',
  PERMISSION_LIST: 'sys.chooser:get_all_permission',
  SEARCH_PERMISSION: 'sys.permission:search',
  DELETE_PERMISSION: 'sys.permission:delete',
  SAVE_PERMISSION: 'sys.permission:save',
  SEARCH_VIDEO: 'sys.video:search',
  DELETE_VIDEO: 'sys.video:delete',
  SAVE_VIDEO: 'sys.video:save',
}

const DEPT_API = {
  GET_TITLE_BY_ID: 'co.department:get_title_by_id',
  GET_DEPT_LIST: 'sys.chooser:get_all_dept',
  GET_TITLE_BY_DEPT_NO: 'co.department:get_title_by_dept_no',
}


const FILE_API = {
  UPLOAD_FILE: 'sys.file:attach_upload',
  BATCH_UPLOAD: 'sys.file:attach_batch_upload',
  DELETE_FILE: 'sys.file:delete_file',
  DELETE_WITH_THUMBNAIL: 'sys.file:delete_with_thumbnail'
}
const CLIENT_API = {
  CLIENT_LIST: "cus.account:search",
}

const INQUIRY_API = {
  INQUIRY_LIST: "inquiry.inquiry:search",
  INQUIRY_DETAIL: "inquiry.inquiry:detail",
  INQUIRY_REPLY: "inquiry.inquiry:reply_message",
}

const NEWS_API = {
  NEWS_LIST: "news.news:search",
  NEWS_LIST_DELETE: "news.news:delete",
  NEWS_LIST_DETAIL: "news.news:detail",
  NEWS_LIST_SAVE: "news.news:save",
  NEWS_LIST_PUBLISH: "news.news:update_offline"
}
const PRODUCT_API = {
  PRODUCT_LIST: "product.product:search",
  TYPE_LIST: "product.product_type:search",
  TYPE_LIST_SAVE: "product.product_type:save",
  TYPE_LIST_DELETE: "product.product_type:delete",
  GET_TYPE_BY_LEVEL: "product.product_type:get_parent_name_by_level",
  GET_TYPE_BY_PARENT_ID: "sys.chooser:get_product_type_by_parent_id",
  PRODUCT_LIST_DETAIL: "product.product:detail",
  PRODUCT_LIST_DELETE: "product.product:delete",
  PRODUCT_LIST_SAVE: "product.product:save",
  PRODUCT_LIST_PUBLISH: "product.product:update_offline",
  GET_ALL_PRODUCT_TYPE: "sys.chooser:get_all_product_type",
}
const SUPPLIER_API = {
  SUPPLIER_LIST: "supply_chain.supplier:get_list",
  SUPPLIER_LIST_DETAIL: "supply_chain.supplier:detail",
  GET_SUPPLIER_NAME: "supply_chain.supplier:get_supplier_name",
  GET_PRODUCT_TYPE_BY_PARENT_ID: "sys.chooser:get_product_type_by_parent_id",
  SUPPLIER_LOGIN: "supply_chain.supplier:login",
  SUPPLIER_SAVE: "supply_chain.supplier:save",
  SUPPLIER_DELETE: "supply_chain.supplier:delete",
}
const BRAND_API = {
  BRAND_LIST: 'supply_chain.brand:search',
  BRAND_DETAIL: 'supply_chain.brand:detail',
  BRAND_EXAMINE: 'supply_chain.brand:examine',
}
const DISTRIBUTION_API = {
  DISTRIBUTOR_LIST: "distribution.distributor:get_list",
  DISTRIBUTOR_LIST_DETAIL: "distribution.distributor:detail",
  DISTRIBUTOR_EXAMINE: 'distribution.distributor:examine',
  DISTRIBUTOR_EXCLUSIVE_PRICE: 'distribution.distributor:exclusive_distribution_price',
}
const ORDER_API = {
  ORDER_LIST: "order.order:search",
  ORDER_DETAIL: "order.order:detail"
}
const GOODS_API = {
  GOODS_PRINT_LIST: "product.product:printLabel",
  GOODS_LIST: "product.product:search",
  GOODS_DETAIL: "product.product:detail",
  GOODS_EXAMINE: "product.product:examine",
  GOODS_IMPROVE: "product.product:improve",
  GOODS_ASSESS: "product.product:assess",
  GOODS_GET_GRADE_ITEMS: "product.product:get_product_grade_items",

  SAVE_GOODS: "",
  DELETE_GOODS: "",
  ONLINE_GOODS: "product.product:update_shelves_status",
  ALL_PRODUCT_SEPCIF: "sys.chooser:get_all_product_specif",
  // 推荐产品
  RECOMMEND_LIST: "product.recommend:search",
  RECOMMEND_SAVE: "product.recommend:save",
  RECOMMEND_DELETE: "product.recommend:delete",
  RECOMMEND_GET_PRODUCT: "product.recommend:get_product",
  RECOMMEND_GET_PRIMARY_TYPE: "product.recommend:get_primary_type",
  //选品官选择器数据API
  SELECTOR_NAME_ID: "sys.chooser:get_all_staff_name"
}

const SELECTOR_API = {
  SELECTOR_PRO_LIST: "product.selector_pro:search",
  SELECTOR_PRO_DETAIL: "product.selector_pro:detail",
  SELECTOR_SUP_DETAIL: "supply_chain.selector_sup:detail",
  SELECTOR_SUP_LIST: "supply_chain.selector_sup:search",
  SELECTOR_ORDER_LIST: "order.selector_order:search",
  SELECTOR_ORDER_DETAIL: "order.selector_order:detail",
}
const STATISTIC_API = {
  SUPPLIER_DATA: "statistic.statistic:supplier_data",
  PRODUCT_DATA: "statistic.statistic:product_data",
  PRO_TYPE_DATA: "statistic.statistic:pro_type_data",
  PASS_RATE: "statistic.statistic:pass_rate",
  SELECTOR_DATA: "statistic.statistic:selector_data",
  STATISTIC_DATA: "statistic.statistic:data",
}
const SETTLE_API = {
  SETTLE_LIST: "settle_order.selector_order:search",
  SETTLE_DETAIL: "settle_order.selector_order:detail",
  SETTLE_OP_CONFIRM: "settle_order.selector_order:confirm",
  SETTLE_OP_SETTLE: "settle_order.selector_order:settlement",
}
const TECHNOLOGY_API = {
  // 样品
  TECHNOLOGY_LIST: "technology.sample:search",
  TECHNOLOGY_DETAIL: "technology.sample:detail",
  IN_STOCK_ADD: "technology.sample:put_storage",
  OUT_STOCK_ADD: "technology.sample:out_storage",
  BE_STOCK_PRODUCT: "technology.sample:get_be_storage_product",
  IN_STOCK_PRODUCT: "technology.sample:get_in_storage_product",
  PRO_MODEL: "technology.sample:get_pro_model",
  OUT_STORAGE_LOCATION_ID: "technology.sample:get_out_storage_location_ids",

  // 出入库记录
  IN_OUT_RECORD: "technology.in_out_warehouse:search",
  // 库存
  TECH_STOCK_LIST: "technology.product:search",
  TECH_STOCK_DETAIL: "technology.product:detail",
  TECH_STOCK_IN: "technology.product:get_be_storage_product",
  TECH_STOCK_OUT: "technology.product:get_in_storage_product",
  TECH_STOCK_OUT_LOCATION_ID: "technology.product:get_out_storage_location_ids",
}
module.exports = {
  ...STAFF_API,
  ...SYS_API,
  ...FILE_API,
  ...DEPT_API,
  ...INQUIRY_API,
  ...CLIENT_API,
  ...NEWS_API,
  ...PRODUCT_API,
  ...SUPPLIER_API,
  ...DISTRIBUTION_API,
  ...ORDER_API,
  ...GOODS_API,
  ...BRAND_API,
  ...SELECTOR_API,
  ...STATISTIC_API,
  ...SETTLE_API,
  ...TECHNOLOGY_API,
}
