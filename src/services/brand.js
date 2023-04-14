import { BRAND_LIST,BRAND_DETAIL,BRAND_EXAMINE} from '@/services/api'
import { post } from '@/utils/request'

export async function getBrandList(params) {
    return post(BRAND_LIST, params)
}
export async function getBrandDetail(params) {
    return post(BRAND_DETAIL, params)
}
export async function brandExamine(params) {
    return post(BRAND_EXAMINE, params)
}