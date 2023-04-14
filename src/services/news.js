

import { NEWS_LIST,NEWS_LIST_DELETE,NEWS_LIST_DETAIL,NEWS_LIST_SAVE,NEWS_LIST_PUBLISH } from '@/services/api'
import { post } from '@/utils/request'

export async function getNewsList(params) {
    return post(NEWS_LIST, params)
}
export async function newsListDelete(params) {
    return post(NEWS_LIST_DELETE, params)
}
export async function newsListDetail(params) {
    return post(NEWS_LIST_DETAIL, params)
}
export async function newsListSave(params) {
    return post(NEWS_LIST_SAVE, params)
}
export async function newsListPublish(params) {
    return post(NEWS_LIST_PUBLISH, params)
}