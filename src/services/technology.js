import { TECHNOLOGY_LIST, TECHNOLOGY_DETAIL, IN_OUT_RECORD, IN_STOCK_ADD, OUT_STOCK_ADD, BE_STOCK_PRODUCT, IN_STOCK_PRODUCT, PRO_MODEL,OUT_STORAGE_LOCATION_ID } from '@/services/api'
import {TECH_STOCK_LIST,TECH_STOCK_DETAIL,TECH_STOCK_IN,TECH_STOCK_OUT,TECH_STOCK_OUT_LOCATION_ID } from '@/services/api'

import { post } from '@/utils/request'

export async function technologyList(params) {
    return post(TECHNOLOGY_LIST, params)
}
export async function technologyDetail(params) {
    return post(TECHNOLOGY_DETAIL, params)
}
export async function inOutRecord(params) {
    return post(IN_OUT_RECORD, params)
}
export async function inStockAdd(params) {
    return post(IN_STOCK_ADD, params)
}
export async function outStockAdd(params) {
    return post(OUT_STOCK_ADD, params)
}
export async function beStockProduct(params) {
    return post(BE_STOCK_PRODUCT, params)
}
export async function inStockProduct(params) {
    return post(IN_STOCK_PRODUCT, params)
}
export async function proModel(params) {
    return post(PRO_MODEL, params)
}
export async function outStorageLocationId(params) {
    return post(OUT_STORAGE_LOCATION_ID, params)
}
// 库存
export async function techStockList(params) {
    return post(TECH_STOCK_LIST, params)
}

export async function techStockDetail(params) {
    return post(TECH_STOCK_DETAIL, params)
}

export async function techStockInProduct(params) {
    return post(TECH_STOCK_IN, params)
}
export async function techStockOutProduct(params) {
    return post(TECH_STOCK_OUT, params)
}
export async function techStockOutLocationId(params) {
    return post(TECH_STOCK_OUT_LOCATION_ID, params)
}
