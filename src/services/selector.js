import { SELECTOR_PRO_LIST,SELECTOR_PRO_DETAIL,SELECTOR_SUP_DETAIL,SELECTOR_SUP_LIST,SELECTOR_ORDER_LIST,SELECTOR_ORDER_DETAIL } from '@/services/api'
import { post } from '@/utils/request'

export async function selectorProList(params) {
    return post(SELECTOR_PRO_LIST, params)
}
export async function selectorProDetail(params) {
    return post(SELECTOR_PRO_DETAIL, params)
}
export async function selectorSupDetail(params) {
    return post(SELECTOR_SUP_DETAIL, params)
}
export async function selectorSupList(params) {
    return post(SELECTOR_SUP_LIST, params)
}
export async function selectorOrderList(params) {
    return post(SELECTOR_ORDER_LIST, params)
}
export async function selectorOrderDetail(params) {
    return post(SELECTOR_ORDER_DETAIL, params)
}
