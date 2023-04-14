import {
    SUPPLIER_LIST,
    SUPPLIER_LIST_DETAIL,
    GET_SUPPLIER_NAME,
    GET_PRODUCT_TYPE_BY_PARENT_ID,
    SUPPLIER_LOGIN,
    SUPPLIER_SAVE,
    SUPPLIER_DELETE,
} from '@/services/api'
import { post } from '@/utils/request'

export async function getSupplierList(params) {
    return post(SUPPLIER_LIST, params)
}
export async function supplierDetail(params) {
    return post(SUPPLIER_LIST_DETAIL, params)
}
export async function getSupplierName(params) {
    return post(GET_SUPPLIER_NAME, params)
}
export async function getProductTypeByParentId(params) {
    return post(GET_PRODUCT_TYPE_BY_PARENT_ID, params)
}
export async function supplierLogin(params) {
    return post(SUPPLIER_LOGIN, params)
}
export async function supplierDelete(params) {
    return post(SUPPLIER_DELETE, params)
}
export async function supplierSave(params) {
    return post(SUPPLIER_SAVE, params)
}

export default {
    getSupplierList,
    supplierDetail,
    supplierLogin
}
