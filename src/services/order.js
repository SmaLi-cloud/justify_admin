
import { ORDER_LIST,ORDER_DETAIL } from '@/services/api'
import { post } from '@/utils/request'

export async function getOrderList(params) {
    return post(ORDER_LIST, params)
}
export async function getOrderDetail(params) {
    return post(ORDER_DETAIL, params)
}
