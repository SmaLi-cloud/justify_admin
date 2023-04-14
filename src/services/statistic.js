import {
    SUPPLIER_DATA,
    PRODUCT_DATA,
    PRO_TYPE_DATA,
    PASS_RATE,
    SELECTOR_DATA,
    STATISTIC_DATA,
} from '@/services/api'
import { post } from '@/utils/request'

export async function supplierData(params) {
    return post(SUPPLIER_DATA, params)
}
export async function productData(params) {
    return post(PRODUCT_DATA, params)
}
export async function proTypeData(params) {
    return post(PRO_TYPE_DATA, params)
}
export async function passRate(params) {
    return post(PASS_RATE, params)
}
export async function selectorData(params) {
    return post(SELECTOR_DATA, params)
}
export async function statisticData(params) {
    return post(STATISTIC_DATA, params)
}