

import { CLIENT_LIST } from '@/services/api'
import { post } from '@/utils/request'

export async function getClientList(params) {
    return post(CLIENT_LIST, params)
}
