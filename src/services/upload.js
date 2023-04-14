import { request, METHOD } from '@/utils/request'
export function getOssParams(params) {
  return request('http://testjmp.order.jiepei.com:4200/general/app/aliyun-oss/policy-token', METHOD.GET, params)
}