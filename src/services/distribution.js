import {
    DISTRIBUTOR_LIST,
    DISTRIBUTOR_LIST_DETAIL,
    DISTRIBUTOR_EXAMINE,
    DISTRIBUTOR_EXCLUSIVE_PRICE
} from '@/services/api'
import { post } from '@/utils/request'

export async function getDistributorList(params) {
    return post(DISTRIBUTOR_LIST, params)
}
export async function distributorDetail(params) {
    return post(DISTRIBUTOR_LIST_DETAIL, params)
}
export async function distributorExamine(params) {
    return post(DISTRIBUTOR_EXAMINE, params)
}
export async function distributorExclusivePrice(params) {
    return post(DISTRIBUTOR_EXCLUSIVE_PRICE, params)
}

export default {
    getDistributorList,
    distributorDetail,
}
