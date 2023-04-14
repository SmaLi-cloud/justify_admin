
import {
    GOODS_LIST,
    GOODS_DETAIL,
    SAVE_GOODS,
    ONLINE_GOODS,
    GOODS_EXAMINE,
    GOODS_IMPROVE,
    GOODS_ASSESS,
    SELECTOR_NAME_ID,
    ALL_PRODUCT_SEPCIF,
    GOODS_PRINT_LIST,
    GOODS_GET_GRADE_ITEMS,
} from '@/services/api'
import { post } from '@/utils/request'

export async function getGoodsList(params) {
    return post(GOODS_LIST, params)
}
export async function getGoodsDetail(params) {
    return post(GOODS_DETAIL, params)
}
export async function saveGoods(params) {
    return post(SAVE_GOODS, params)
}
export async function onlineGoods(params) {
    return post(ONLINE_GOODS, params)
}
export async function goodsExamine(params) {
    return post(GOODS_EXAMINE, params)
}
export async function goodsImprove(params) {
    return post(GOODS_IMPROVE, params)
}
export async function goodsAssess(params) {
    return post(GOODS_ASSESS, params)
}
export async function selectorNameId(params) {
    return post(SELECTOR_NAME_ID, params)
}
export async function allProductSpecif(params) {
    return post(ALL_PRODUCT_SEPCIF, params)
}
export async function getPrintList(params) {
    return post(GOODS_PRINT_LIST, params)
}
export async function getGradeItems(params) {
    return post(GOODS_GET_GRADE_ITEMS, params)
}
