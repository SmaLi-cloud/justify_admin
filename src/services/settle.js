import { SETTLE_LIST,SETTLE_DETAIL,SETTLE_OP_SETTLE,SETTLE_OP_CONFIRM } from '@/services/api'
import { post } from '@/utils/request'

export async function settleList(params) {
    return post(SETTLE_LIST, params)
}
export async function settleDetail(params) {
    return post(SETTLE_DETAIL, params)
}
export async function settleOpConfirm(params) {
    return post(SETTLE_OP_CONFIRM, params)
}
export async function settleOpSettle(params) {
    return post(SETTLE_OP_SETTLE, params)
}