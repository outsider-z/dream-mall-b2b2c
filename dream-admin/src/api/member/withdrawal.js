import request from '@/utils/request'

export function getwithdrawalList(query) {
  return request({
    url: '/merchant/admin/withdrawal/list',
    method: 'get',
    params: query
  })
}
// 用户提现审核
export function auditUserWithdrawalInfo(data) {
  return request({
    url: '/merchant/admin/withdrawal/auditUserWithdrawalInfo' ,
   method: 'post',
   data: data
  })
}
