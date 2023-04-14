import { GET_TITLE_BY_ID, GET_DEPT_LIST, GET_TITLE_BY_DEPT_NO } from '@/services/api'
import { post } from '@/utils/request'


export async function getTitleById(params) {
    return post(GET_TITLE_BY_ID, params)
}

export async function getDeptList(params) {
    return post(GET_DEPT_LIST, params)
}

export async function getTitleByDeptNo(params) {
    return post(GET_TITLE_BY_DEPT_NO, params)
}

export default {
    getTitleById,
    getDeptList,
    getTitleByDeptNo
}
