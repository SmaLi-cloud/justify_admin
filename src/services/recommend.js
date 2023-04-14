import { RECOMMEND_LIST, RECOMMEND_SAVE, RECOMMEND_DELETE,RECOMMEND_GET_PRODUCT,RECOMMEND_GET_PRIMARY_TYPE } from '@/services/api'
import { post } from '@/utils/request'


export async function recommendList(params) {
    return post(RECOMMEND_LIST, params)
}

export async function recommendSave(params) {
    return post(RECOMMEND_SAVE, params)
}

export async function recommendDelete(params) {
    return post(RECOMMEND_DELETE, params)
}
export async function recommendGetProduct(params) {
    return post(RECOMMEND_GET_PRODUCT, params)
}
export async function recommendGetPrimaryType(params) {
    return post(RECOMMEND_GET_PRIMARY_TYPE, params)
}
