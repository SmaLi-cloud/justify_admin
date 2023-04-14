

import { INQUIRY_LIST, INQUIRY_REPLY, INQUIRY_DETAIL } from '@/services/api'
import { post } from '@/utils/request'

export async function getInquiryList(params) {
    return post(INQUIRY_LIST, params)
}
export async function getInquiryDetail(params) {
    return post(INQUIRY_DETAIL, params)
}
export async function inquiryReply(params) {
    return post(INQUIRY_REPLY, params)
}
