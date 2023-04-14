

import {
    PRODUCT_LIST,
    TYPE_LIST,
    TYPE_LIST_SAVE,
    TYPE_LIST_DELETE,
    PRODUCT_LIST_DETAIL,
    PRODUCT_LIST_SAVE,
    PRODUCT_LIST_DELETE,
    PRODUCT_LIST_PUBLISH,
    GET_TYPE_BY_LEVEL,
    GET_TYPE_BY_PARENT_ID,
    GET_ALL_PRODUCT_TYPE,
} from '@/services/api'
import { post } from '@/utils/request'

export async function getProductList(params) {
    return post(PRODUCT_LIST, params)
}
export async function productListDetail(params) {
    return post(PRODUCT_LIST_DETAIL, params)
}
export async function productListDelete(params) {
    return post(PRODUCT_LIST_DELETE, params)
}
export async function productListSave(params) {
    return post(PRODUCT_LIST_SAVE, params)
}
export async function productListPublish(params) {
    return post(PRODUCT_LIST_PUBLISH, params)
}
export async function getTypeList(params) {
    return post(TYPE_LIST, params)
}
export async function typeListDelete(params) {
    return post(TYPE_LIST_DELETE, params)
}
export async function typeListSave(params) {
    return post(TYPE_LIST_SAVE, params)
}
export async function getTypeByLevel(params) {
    return post(GET_TYPE_BY_LEVEL, params)
}
export async function getAllProductType(params) {
    return post(GET_ALL_PRODUCT_TYPE, params)
}

export async function getTypeByParentId(params) {
    return post(GET_TYPE_BY_PARENT_ID, params)
}



